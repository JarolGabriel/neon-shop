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
        { error: "El slug de la categoría es requerido" },
        { status: 400 },
      );
    }

    // 1. Obtener información básica de la categoría
    const { data: category, error: categoryError } = await supabaseAdmin
      .from("categories")
      .select("id, name, slug, description, image_url")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (categoryError || !category) {
      console.error(`Categoría '${slug}' no encontrada:`, categoryError);
      return NextResponse.json(
        { error: "Categoría no encontrada o inactiva" },
        { status: 404 },
      );
    }

    // 2. Procesar parámetros de paginación de forma segura
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "12", 10));
    const sortBy = searchParams.get("sort") || "newest";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 3. Query de productos con conteo exacto global para esta categoría
    let productsQuery = supabaseAdmin
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        short_description,
        price,
        compare_at_price,
        stock,
        color,
        size,
        is_featured,
        product_images (id, image_url, alt_text, is_primary)
      `,
        { count: "exact" },
      )
      .eq("category_id", category.id)
      .eq("is_active", true);

    // 4. Aplicar ordenamiento lógico de productos
    switch (sortBy) {
      case "price_asc":
        productsQuery = productsQuery.order("price", { ascending: true });
        break;
      case "price_desc":
        productsQuery = productsQuery.order("price", { ascending: false });
        break;
      case "best_seller":
        productsQuery = productsQuery.order("sales_count", {
          ascending: false,
        });
        break;
      case "newest":
      default:
        productsQuery = productsQuery.order("created_at", { ascending: false });
        break;
    }

    const {
      data: products,
      error: productsError,
      count,
    } = await productsQuery.range(from, to);

    if (productsError) {
      console.error(`Error al obtener productos de '${slug}':`, productsError);
      return NextResponse.json(
        { error: "Error al cargar los productos de la categoría" },
        { status: 500 },
      );
    }

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json(
      {
        category: {
          ...category,
          product_count: totalItems,
        },
        products: products || [],
        meta: {
          total_items: totalItems,
          page,
          limit,
          total_pages: totalPages,
          has_more: page < totalPages,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error crítico en /api/categories/[slug]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al cargar la categoría" },
      { status: 500 },
    );
  }
}
