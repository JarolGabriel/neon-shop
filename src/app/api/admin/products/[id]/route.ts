import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * PUT /api/admin/products/:id
 * Actualiza los datos de un producto específico por su ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 1. VALIDACIÓN: Verificar si el producto existe en la base de datos
    const { data: existingProduct, error: findError } = await supabaseAdmin
      .from("products")
      .select("id, slug")
      .eq("id", id)
      .single();

    if (findError || !existingProduct) {
      return NextResponse.json(
        { error: "El producto que intenta actualizar no existe" },
        { status: 404 },
      );
    }

    // 2. VALIDACIÓN DE SLUG: Si viene un slug en el body y es diferente al actual,
    // debemos verificar que ningún OTRO producto lo esté usando.
    if (body.slug && body.slug !== existingProduct.slug) {
      const { data: duplicateSlugProduct } = await supabaseAdmin
        .from("products")
        .select("id")
        .eq("slug", body.slug)
        .neq("id", id)
        .maybeSingle();

      if (duplicateSlugProduct) {
        return NextResponse.json(
          {
            error: `El slug '${body.slug}' ya está siendo usado por otro producto`,
          },
          { status: 400 },
        );
      }
    }

    // 3. CONSTRUCCIÓN DEL OBJETO DE ACTUALIZACIÓN (Protección contra campos undefined)
    // Solo actualizamos lo que el cliente explícitamente envía en el JSON body
    const updateData: Record<string, unknown> = {};

    const allowedFields = [
      "name",
      "slug",
      "description",
      "short_description",
      "price",
      "compare_at_price",
      "size",
      "color",
      "voltage",
      "material",
      "stock",
      "sku",
      "is_active",
      "is_featured",
      "is_best_seller",
      "category_id",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Forzamos la actualización del timestamp de modificación
    updateData["updated_at"] = new Date().toISOString();

    // 4. EJECUCIÓN EN BASE DE DATOS
    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error de Supabase al actualizar producto:", updateError);
      return NextResponse.json(
        {
          error: "Error al actualizar el producto en la base de datos",
          details: updateError.message,
        },
        { status: 400 },
      );
    }

    // 5. RESPUESTA EXITOSA
    return NextResponse.json(
      {
        message: "Producto actualizado correctamente",
        data: updatedProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error crítico en PUT /api/admin/products/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la actualización" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/products/:id
 * Elimina un producto, sus registros de imágenes y sus archivos físicos en el Storage
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 1. VALIDACIÓN: Verificar si el producto existe antes de hacer nada
    const { data: product, error: findError } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (findError || !product) {
      return NextResponse.json(
        { error: "El producto que intenta eliminar no existe" },
        { status: 404 },
      );
    }

    // 2. OBTENER IMÁGENES ASOCIADAS: Buscamos los registros en 'product_images'
    const { data: images } = await supabaseAdmin
      .from("product_images")
      .select("image_url")
      .eq("product_id", id);

    // 3. LIMPIEZA DEL STORAGE: Si el producto tenía imágenes, las borramos físicamente
    if (images && images.length > 0) {
      const filesToRemove = images
        .map((img) => {
          const urlParts = img.image_url.split("/product_images/");
          return urlParts[1];
        })
        .filter(Boolean);

      if (filesToRemove.length > 0) {
        const { error: storageError } = await supabaseAdmin.storage
          .from("product_images")
          .remove(filesToRemove);

        if (storageError) {
          console.error(
            "Advertencia: No se pudieron borrar los archivos del Storage:",
            storageError,
          );
          // Nota de producción: A veces no querrás detener el flujo si el archivo ya no existía en Storage,
          // pero lo dejamos logueado para auditoría.
        }
      }
    }

    // 4. ELIMINACIÓN EN BASE DE DATOS: Borramos el producto
    // Nota: Si tu tabla 'product_images' no tiene CASCADE, borramos primero las imágenes a mano aquí:
    await supabaseAdmin.from("product_images").delete().eq("product_id", id);

    const { error: deleteError } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(
        "Error al eliminar el producto en PostgreSQL:",
        deleteError,
      );
      return NextResponse.json(
        { error: "No se pudo eliminar el producto de la base de datos" },
        { status: 400 },
      );
    }

    // 5. RESPUESTA EXITOSA
    return NextResponse.json(
      { message: "Producto y sus recursos asociados eliminados correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error crítico en DELETE /api/admin/products/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la eliminación" },
      { status: 500 },
    );
  }
}
