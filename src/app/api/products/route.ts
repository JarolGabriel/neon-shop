import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  createSupabaseErrorResponse,
  createUnexpectedErrorResponse,
} from "@/lib/supabase-errors";

/** Campos mínimos para tarjetas de catálogo (sin description ni joins pesados). */
const LIST_SELECT = `
  id,
  name,
  slug,
  short_description,
  price,
  compare_at_price,
  stock,
  sales_count,
  is_active,
  categories (id, name, slug),
  product_images (id, image_url, alt_text, is_primary),
  product_variants (id, color, color_hex, size, price, stock, is_active)
`;

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
};

function jsonWithCache<T>(body: T, status = 200) {
  return NextResponse.json(body, { status, headers: CACHE_HEADERS });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const slugsParam = searchParams.get("slugs");
    if (slugsParam) {
      const slugs = [
        ...new Set(
          slugsParam
            .split(",")
            .map((slug) => slug.trim())
            .filter(Boolean),
        ),
      ].slice(0, 12);

      if (slugs.length === 0) {
        return jsonWithCache({ data: [] });
      }

      const { data, error } = await supabaseAdmin
        .from("products")
        .select(LIST_SELECT)
        .eq("is_active", true)
        .in("slug", slugs);

      if (error) {
        return createSupabaseErrorResponse(error, {
          context: "GET /api/products?slugs",
          fallbackMessage: "Error al obtener productos",
          databaseMessage: "Error al obtener productos",
        });
      }

      const order = new Map(slugs.map((slug, index) => [slug, index]));
      const sorted = (data ?? []).sort(
        (a, b) => (order.get(a.slug) ?? 99) - (order.get(b.slug) ?? 99),
      );

      return jsonWithCache({ data: sorted });
    }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(
      30,
      Math.max(1, parseInt(searchParams.get("limit") || "12", 10) || 12),
    );

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
    const outOfStock = searchParams.get("out_of_stock") === "true";
    const sortBy = searchParams.get("sort") || "newest";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from("products")
      .select(LIST_SELECT, { count: "exact" })
      .eq("is_active", true);

    if (search.trim()) {
      query = query.ilike("name", `%${search.trim()}%`);
    }

    if (categorySlug) {
      const { data: categoryData } = await supabaseAdmin
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      if (categoryData) {
        query = query.eq("category_id", categoryData.id);
      } else {
        return jsonWithCache({
          data: [],
          meta: {
            total_items: 0,
            page,
            limit,
            total_pages: 0,
            has_more: false,
          },
        });
      }
    }

    if (minPrice !== null) query = query.gte("price", minPrice);
    if (maxPrice !== null) query = query.lte("price", maxPrice);

    if (color) {
      const { data: variantProductIds } = await supabaseAdmin
        .from("product_variants")
        .select("product_id")
        .eq("color_hex", color)
        .eq("is_active", true);

      if (variantProductIds?.length) {
        query = query.in(
          "id",
          variantProductIds.map((v) => v.product_id),
        );
      } else {
        return jsonWithCache({
          data: [],
          meta: {
            total_items: 0,
            page,
            limit,
            total_pages: 0,
            has_more: false,
          },
        });
      }
    }

    if (size) {
      const { data: variantProductIds } = await supabaseAdmin
        .from("product_variants")
        .select("product_id")
        .eq("size", size)
        .eq("is_active", true);

      if (variantProductIds?.length) {
        query = query.in(
          "id",
          variantProductIds.map((v) => v.product_id),
        );
      } else {
        return jsonWithCache({
          data: [],
          meta: {
            total_items: 0,
            page,
            limit,
            total_pages: 0,
            has_more: false,
          },
        });
      }
    }

    if (outOfStock) {
      query = query.eq("stock", 0);
    } else if (inStock) {
      query = query.gt("stock", 0);
    }

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

    const { data: products, error, count } = await query.range(from, to);

    if (error) {
      return createSupabaseErrorResponse(error, {
        context: "GET /api/products",
        fallbackMessage: "Error al obtener productos",
        databaseMessage: "Error al obtener productos",
      });
    }

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return jsonWithCache({
      data: products,
      meta: {
        total_items: totalItems,
        page,
        limit,
        total_pages: totalPages,
        has_more: page < totalPages,
      },
    });
  } catch (error) {
    return createUnexpectedErrorResponse(
      "GET /api/products",
      error,
      "Error interno del servidor al procesar el catálogo",
    );
  }
}
