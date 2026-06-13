import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromToken, supabaseAdmin } from "@/lib/supabase";
import type { CatalogProduct } from "@/types/product";

function normalizeJoinedProduct(
  product: CatalogProduct | CatalogProduct[] | null,
): CatalogProduct | null {
  if (!product) return null;
  if (Array.isArray(product)) return product[0] ?? null;
  return product;
}

const PRODUCT_SELECT = `
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

async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  return getAuthUserFromToken(token);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado. Token ausente o inválido." },
        { status: 401 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("user_favorites")
      .select(`created_at, products (${PRODUCT_SELECT})`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const products = (data ?? [])
      .map((row) =>
        normalizeJoinedProduct(
          row.products as unknown as CatalogProduct | CatalogProduct[] | null,
        ),
      )
      .filter(
        (product): product is CatalogProduct =>
          product != null && product.is_active !== false,
      );

    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error en GET /api/favorites:", error.message);
    }
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado. Token ausente o inválido." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { product_id: productId } = body;

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "El identificador del producto (product_id) es obligatorio." },
        { status: 400 },
      );
    }

    const { data: existingFavorite, error: checkError } = await supabaseAdmin
      .from("user_favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingFavorite) {
      const { error: deleteError } = await supabaseAdmin
        .from("user_favorites")
        .delete()
        .eq("id", existingFavorite.id);

      if (deleteError) throw deleteError;

      return NextResponse.json(
        {
          success: true,
          message: "Producto eliminado de favoritos.",
          favorited: false,
        },
        { status: 200 },
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from("user_favorites")
      .insert({
        user_id: user.id,
        product_id: productId,
      });

    if (insertError) throw insertError;

    return NextResponse.json(
      {
        success: true,
        message: "Producto añadido a favoritos.",
        favorited: true,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error en POST /api/favorites:", error.message);
    }
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
