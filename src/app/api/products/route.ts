import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // 1. Capturar y procesar Query Params de la URL
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    // Filtros principales
    const search = searchParams.get("search") || "";
    const categorySlug = searchParams.get("category") || "";
    const minPrice = searchParams.get("min_price")
      ? parseFloat(searchParams.get("min_price")!)
      : null;
    const maxPrice = searchParams.get("max_price")
      ? parseFloat(searchParams.get("max_price")!)
      : null;
    const color = searchParams.get("color_hex") || "";
    const size = searchParams.get("size") || "";
    const inStock = searchParams.get("in_stock") === "true";

    // Ordenamiento (sort)
    const sortBy = searchParams.get("sort") || "newest";

    // Calcular paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 2. Query base con relaciones estándar
    let query = supabaseAdmin.from("products").select(
      `
        id,
        name,
        slug,
        short_description,
        description,
        price,
        compare_at_price,
        stock,
        color,
        size,
        sales_count,
        is_active,
        categories (id, name, slug),
        product_images (id, image_url, alt_text, is_primary),
        product_variants (id, color, color_hex, size, price, stock, is_active)
      `,
      { count: "exact" },
    );

    // 3. REGLA INQUEBRANTABLE DE NEGOCIO
    query = query.eq("is_active", true);

    // 4. Construcción dinámica de filtros

    // 🔧 FIX 1: Búsqueda mejorada
    if (search && search.trim() !== "") {
      query = query.ilike("name", `%${search}%`);
    }

    // 🔧 FIX 2: Filtro de categoría
    if (categorySlug) {
      // Paso 1: Obtener el category_id desde el slug
      const { data: categoryData } = await supabaseAdmin
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      if (categoryData) {
        // Paso 2: Filtrar productos por category_id
        query = query.eq("category_id", categoryData.id);
      } else {
        return NextResponse.json(
          {
            data: [],
            meta: {
              total_items: 0,
              page,
              limit,
              total_pages: 0,
              has_more: false,
            },
          },
          { status: 200 },
        );
      }
    }

    if (minPrice !== null) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice !== null) {
      query = query.lte("price", maxPrice);
    }

    if (color) {
      const { data: variantProductIds } = await supabaseAdmin
        .from("product_variants")
        .select("product_id")
        .eq("color_hex", color)
        .eq("is_active", true);

      if (variantProductIds && variantProductIds.length > 0) {
        const ids = variantProductIds.map((v) => v.product_id);
        query = query.in("id", ids);
      } else {
        return NextResponse.json(
          { data: [], meta: { total_items: 0, page, limit, total_pages: 0, has_more: false } },
          { status: 200 }
        );
      }
    }

    if (size) {
      const { data: variantProductIds } = await supabaseAdmin
        .from("product_variants")
        .select("product_id")
        .eq("size", size)
        .eq("is_active", true);

      if (variantProductIds && variantProductIds.length > 0) {
        const ids = variantProductIds.map((v) => v.product_id);
        query = query.in("id", ids);
      } else {
        return NextResponse.json(
          { data: [], meta: { total_items: 0, page, limit, total_pages: 0, has_more: false } },
          { status: 200 }
        );
      }
    }

    if (inStock) {
      query = query.gt("stock", 0);
    }

    // 5. Estrategia de Ordenamiento profesional
    switch (sortBy) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "best_seller":
        query = query.order("sales_count", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    // 6. Ejecutar Query con Paginación final
    const { data: products, error, count } = await query.range(from, to);

    if (error) {
      console.error("Error de Supabase al filtrar productos:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 7. Formatear la respuesta con Metadatos limpios
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json(
      {
        data: products,
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
    console.error("Error crítico en el catálogo público de productos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el catálogo" },
      { status: 500 },
    );
  }
}
