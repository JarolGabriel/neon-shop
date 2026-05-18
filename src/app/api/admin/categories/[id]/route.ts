import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// --- PUT: Actualizar una categoría existente de forma parcial por ID ---
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Esperar el ID de la URL dinámico
    const { id } = await params;
    const body = await request.json();

    // 2. CONTROL DE ERRORES TEMPRANO: Verificar si la categoría existe primero
    const { data: existingCategory, error: findError } = await supabaseAdmin
      .from("categories")
      .select("id, slug")
      .eq("id", id)
      .single();

    if (findError || !existingCategory) {
      return NextResponse.json(
        { error: "La categoría que intenta actualizar no existe." },
        { status: 404 },
      );
    }

    // 3. VALIDACIÓN DE SLUG DUPLICADO: Si cambian el slug, verificar que otro no lo tenga
    if (body.slug && body.slug !== existingCategory.slug) {
      const { data: duplicateSlugCategory } = await supabaseAdmin
        .from("categories")
        .select("id")
        .eq("slug", body.slug)
        .neq("id", id)
        .maybeSingle();

      if (duplicateSlugCategory) {
        return NextResponse.json(
          {
            error: `El slug '${body.slug}' ya está siendo usado por otra categoría.`,
          },
          { status: 400 },
        );
      }
    }

    // 4. CONSTRUCCIÓN DINÁMICA DE CAMPOS PERMITIDOS (Seguridad)
    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "name",
      "slug",
      "description",
      "image_url",
      "display_order",
      "is_active",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // Manejo especial para números
        if (field === "display_order" && typeof body[field] === "string") {
          updateData[field] = parseInt(body[field] as string, 10);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    // Si no enviaron ningún campo válido para actualizar
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No se enviaron campos válidos para actualizar." },
        { status: 400 },
      );
    }

    // 5. EJECUTAR ACTUALIZACIÓN EN POSTGRESQL
    const { data: updatedCategory, error: updateError } = await supabaseAdmin
      .from("categories")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error de Supabase al actualizar categoría:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // 6. RESPUESTA EXITOSA
    return NextResponse.json(
      { message: "Categoría actualizada con éxito", category: updatedCategory },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error catastrófico en el PUT de categorías admin:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al actualizar la categoría" },
      { status: 500 },
    );
  }
}

// --- DELETE: Eliminar una categoría existente por ID ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 1. Verificar si la categoría existe
    const { data: category, error: findError } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("id", id)
      .single();

    if (findError || !category) {
      return NextResponse.json(
        { error: "La categoría que intenta eliminar no existe." },
        { status: 404 },
      );
    }

    // 2. Verificar si hay productos usando esta categoría
    const { count, error: countError } = await supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (countError) {
      console.error("Error al verificar productos asociados:", countError);
      return NextResponse.json({ error: countError.message }, { status: 400 });
    }

    if (count && count > 0) {
      return NextResponse.json(
        {
          error: `No se puede eliminar la categoría. Tiene ${count} producto(s) asociado(s). Por favor, reasigna o elimina los productos primero.`,
        },
        { status: 400 },
      );
    }

    // 3. Si pasó la prueba (count === 0), procedemos a borrar con seguridad
    const { error: deleteError } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error de Supabase al eliminar categoría:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Categoría eliminada con éxito de la base de datos." },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Error catastrófico en el DELETE de categorías admin:",
      error,
    );
    return NextResponse.json(
      { error: "Error interno del servidor al eliminar la categoría" },
      { status: 500 },
    );
  }
}
