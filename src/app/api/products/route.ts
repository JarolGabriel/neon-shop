import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select(
        `
        *,
        categories (name),
        product_images (image_url, is_primary)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al obtener productos de Supabase:", error);
      return NextResponse.json(
        { error: "No se pudieron cargar los productos" },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error inesperado en GET products:", error);
    return NextResponse.json(
      { error: "Ocurrió un fallo en el servidor" },
      { status: 500 },
    );
  }
}

// --- POST: Crear un nuevo producto ---
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. VALIDACIÓN MANUAL: Verificamos campos críticos

    const requiredFields = ["name", "slug", "price", "category_id"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `El campo '${field}' es obligatorio` },
          { status: 400 },
        );
      }
    }

    // 2. INSERCIÓN
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([
        {
          name: body.name,
          slug: body.slug,
          description: body.description,
          price: body.price,
          stock: body.stock ?? 0,
          short_description: body.short_description,
          size: body.size,
          category_id: body.category_id,
          is_active: body.is_active ?? true,
          display_order: 0,
        },
      ])
      .select();

    if (error) {
      console.error("Error de Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error("Error catastrófico:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la solicitud" },
      { status: 500 },
    );
  }
}
