import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const TABLE = "product_reviews";

/**
 * GET /api/resenas?product_id=<uuid>
 * Devuelve las reseñas de un producto (o todas si no se envía product_id).
 */
export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("product_id");

    let query = supabaseAdmin
      .from(TABLE)
      .select(
        "id, product_id, rating, title, content, media_url, user_name, created_at, user_id",
      )
      .order("created_at", { ascending: false });

    if (productId) {
      query = query.eq("product_id", productId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Una reseña se considera "verificada" si fue escrita por un usuario con sesión.
    const reviews = (data ?? []).map(({ user_id, ...review }) => ({
      ...review,
      is_verified: user_id != null,
    }));

    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ Error en GET /api/resenas:", error);
    return NextResponse.json(
      { error: "Error al obtener las reseñas." },
      { status: 500 },
    );
  }
}

interface CreateReviewPayload {
  product_id?: string;
  rating?: number;
  title?: string;
  content?: string;
  media_url?: string | null;
  user_name?: string;
  email?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/resenas
 * Crea una reseña pública para un producto.
 * Body JSON: { product_id, rating, title, content, user_name, email, media_url? }
 */
export async function POST(request: NextRequest) {
  try {
    // Token OPCIONAL: si el usuario tiene sesión, la reseña queda "verificada".
    let verifiedUserId: string | null = null;
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const {
        data: { user },
      } = await supabaseAdmin.auth.getUser(token);
      if (user) verifiedUserId = user.id;
    }

    const body = (await request.json()) as CreateReviewPayload;

    const { product_id, rating, title, content, media_url, user_name, email } =
      body;

    if (
      !product_id ||
      rating == null ||
      !title ||
      !content ||
      !user_name ||
      !email
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La clasificación debe ser un entero entre 1 y 5." },
        { status: 400 },
      );
    }

    if (title.length > 100) {
      return NextResponse.json(
        { error: "El título no puede superar los 100 caracteres." },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "El correo electrónico no es válido." },
        { status: 400 },
      );
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("id", product_id)
      .maybeSingle();

    if (productError) throw productError;
    if (!product) {
      return NextResponse.json(
        { error: "El producto indicado no existe." },
        { status: 404 },
      );
    }

    const { data: newReview, error: insertError } = await supabaseAdmin
      .from(TABLE)
      .insert({
        product_id,
        rating,
        title,
        content,
        media_url: media_url ?? null,
        user_name,
        email,
        user_id: verifiedUserId,
      })
      .select(
        "id, product_id, rating, title, content, media_url, user_name, created_at",
      )
      .single();

    if (insertError) throw insertError;

    return NextResponse.json(
      {
        success: true,
        message: "¡Reseña enviada con éxito!",
        data: { ...newReview, is_verified: verifiedUserId != null },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error en POST /api/resenas:", error.message);
    }
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
