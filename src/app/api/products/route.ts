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
