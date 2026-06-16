import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { parseAvailableColorsFromDb } from "@/lib/product-catalog-options";
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
  is_featured,
  is_best_seller,
  categories (id, name, slug),
  product_images (id, image_url, alt_text, is_primary),
  product_variants (id, color, color_hex, size, price, stock, is_active),
  available_sizes,
  available_colors
`;

function jsonWithCache<T>(body: T, status = 200, maxAge = 30) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control":
        maxAge <= 0
          ? "no-store"
          : `public, max-age=${maxAge}, stale-while-revalidate=120`,
    },
  });
}

function normalizeCatalogProduct<
  T extends { available_sizes?: string[] | null; available_colors?: unknown },
>(product: T) {
  return {
    ...product,
    available_sizes: product.available_sizes ?? [],
    available_colors: parseAvailableColorsFromDb(product.available_colors),
  };
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

      return jsonWithCache({ data: sorted.map(normalizeCatalogProduct) });
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
    const featured = searchParams.get("featured") === "true";
    const highlighted = searchParams.get("highlighted") === "true";
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

    if (featured) query = query.eq("is_featured", true);
    if (highlighted) query = query.eq("is_best_seller", true);

    if (featured || highlighted) {
      query = query
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
    } else {
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
    const cacheMaxAge = featured || highlighted ? 0 : 30;

    return jsonWithCache(
      {
        data: (products ?? []).map(normalizeCatalogProduct),
        meta: {
          total_items: totalItems,
          page,
          limit,
          total_pages: totalPages,
          has_more: page < totalPages,
        },
      },
      200,
      cacheMaxAge,
    );
  } catch (error) {
    return createUnexpectedErrorResponse(
      "GET /api/products",
      error,
      "Error interno del servidor al procesar el catálogo",
    );
  }
}
