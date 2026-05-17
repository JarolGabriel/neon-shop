import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET /api/products/:slug
 * Obtiene un producto por su slug incluyendo su galería de imágenes
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Buscamos el producto y usamos '...' para traer la relación de imágenes
    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
        *,
        images: product_images (
          id,
          image_url,
          alt_text,
          is_primary,
          display_order
        )
      `,
      )
      .eq("slug", slug)
      .single(); //

    if (error || !product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Producto obtenido correctamente",
        data: product,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en GET /api/products/[slug]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
