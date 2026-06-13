import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromToken, supabaseAdmin } from "@/lib/supabase";
import {
  createSupabaseErrorResponse,
  createUnexpectedErrorResponse,
} from "@/lib/supabase-errors";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No autorizado. Token de autenticación ausente o inválido." },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    const user = await getAuthUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Sesión inválida o expirada. Inicie sesión nuevamente." },
        { status: 401 },
      );
    }

    const [postsResult, reactionsResult, commentsResult] = await Promise.all([
      supabaseAdmin
        .from("customer_reviews")
        .select("id, title, is_approved, created_at, review_reactions(id)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabaseAdmin
        .from("review_reactions")
        .select(
          `
          review_id,
          reaction_type,
          created_at,
          customer_reviews (
            id,
            title,
            is_approved
          )
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabaseAdmin
        .from("review_comments")
        .select(
          `
          id,
          review_id,
          comment,
          is_approved,
          created_at,
          customer_reviews (
            id,
            title
          )
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    if (postsResult.error) {
      return createSupabaseErrorResponse(postsResult.error, {
        context: "GET /api/showroom/me posts",
        fallbackMessage: "No se pudo cargar tu actividad.",
      });
    }

    if (reactionsResult.error) {
      return createSupabaseErrorResponse(reactionsResult.error, {
        context: "GET /api/showroom/me reactions",
        fallbackMessage: "No se pudo cargar tu actividad.",
      });
    }

    if (commentsResult.error) {
      return createSupabaseErrorResponse(commentsResult.error, {
        context: "GET /api/showroom/me comments",
        fallbackMessage: "No se pudo cargar tu actividad.",
      });
    }

    const posts = (postsResult.data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      is_approved: row.is_approved === true,
      created_at: row.created_at,
      likes_count: Array.isArray(row.review_reactions)
        ? row.review_reactions.length
        : 0,
    }));

    const reactions = (reactionsResult.data ?? []).map((row) => {
      const review = Array.isArray(row.customer_reviews)
        ? (row.customer_reviews[0] ?? null)
        : row.customer_reviews;

      return {
        review_id: row.review_id,
        reaction_type: row.reaction_type,
        created_at: row.created_at,
        review: review
          ? {
              id: review.id,
              title: review.title,
              is_approved: review.is_approved === true,
            }
          : null,
      };
    });

    const comments = (commentsResult.data ?? []).map((row) => {
      const review = Array.isArray(row.customer_reviews)
        ? (row.customer_reviews[0] ?? null)
        : row.customer_reviews;

      return {
        id: row.id,
        review_id: row.review_id,
        comment: row.comment,
        is_approved: row.is_approved === true,
        created_at: row.created_at,
        review: review ? { id: review.id, title: review.title } : null,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: { posts, reactions, comments },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return createUnexpectedErrorResponse(
      "GET /api/showroom/me",
      error,
      "Error al cargar tu actividad en la comunidad.",
    );
  }
}
