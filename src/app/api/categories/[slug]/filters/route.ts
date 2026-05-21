import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "El slug es requerido" },
        { status: 400 },
      );
    }

    const { data: category, error: categoryError } = await supabaseAdmin
      .from("categories")
      .select("id, name, slug")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (categoryError || !category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 },
      );
    }

    // Traemos solo los datos estrictamente necesarios de productos con stock
    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("color, size, price")
      .eq("category_id", category.id)
      .eq("is_active", true)
      .gt("stock", 0);

    if (productsError) {
      console.error("Error cargando filtros:", productsError);
      return NextResponse.json(
        { error: "Error al procesar filtros" },
        { status: 500 },
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        {
          category: { name: category.name, slug: category.slug },
          available_filters: {
            colors: [],
            sizes: [],
            price_range: { min: 0, max: 0 },
          },
        },
        { status: 200 },
      );
    }

    // Control de nulos e inmunidad a strings vacíos
    const uniqueColors = [
      ...new Set(
        products
          .map((p) => p.color)
          .filter((c): c is string => typeof c === "string" && c.trim() !== ""),
      ),
    ].sort();

    const uniqueSizes = [
      ...new Set(
        products
          .map((p) => p.size)
          .filter((s): s is string => typeof s === "string" && s.trim() !== ""),
      ),
    ].sort();

    const prices = products
      .map((p) => p.price)
      .filter((p) => typeof p === "number");
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return NextResponse.json(
      {
        category: { name: category.name, slug: category.slug },
        available_filters: {
          colors: uniqueColors,
          sizes: uniqueSizes,
          price_range: { min: minPrice, max: maxPrice },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error crítico en filtros:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
