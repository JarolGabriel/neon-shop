import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromToken, supabaseAdmin } from "@/lib/supabase";
import {
  createSupabaseErrorResponse,
  createUnexpectedErrorResponse,
} from "@/lib/supabase-errors";

const REVIEW_SELECT = `
  id,
  title,
  comment,
  image_url,
  rating,
  created_at,
  profiles (
    id,
    first_name,
    last_name
  ),
  review_reactions (
    user_id,
    reaction_type
  )
`;

interface RawReview {
  id: string;
  title: string;
  comment: string;
  image_url: string | null;
  rating: number;
  created_at: string | null;
  profiles:
    | {
        id: string;
        first_name: string | null;
        last_name: string | null;
      }
    | {
        id: string;
        first_name: string | null;
        last_name: string | null;
      }[]
    | null;
  review_reactions: { user_id: string; reaction_type: string }[] | null;
}

async function attachCommentCounts(reviewIds: string[]) {
  const commentsCountByReview = new Map<string, number>();

  if (reviewIds.length === 0) return commentsCountByReview;

  const { data: approvedComments, error: commentsError } = await supabaseAdmin
    .from("review_comments")
    .select("review_id")
    .in("review_id", reviewIds)
    .eq("is_approved", true);

  if (commentsError) throw commentsError;

  for (const row of approvedComments ?? []) {
    commentsCountByReview.set(
      row.review_id,
      (commentsCountByReview.get(row.review_id) ?? 0) + 1,
    );
  }

  return commentsCountByReview;
}

function formatReview(
  review: RawReview,
  currentUserId: string | null,
  commentsCountByReview: Map<string, number>,
) {
  const reactions = review.review_reactions ?? [];
  const reactionCounts: Record<string, number> = {};
  const userReactions: string[] = [];

  for (const reaction of reactions) {
    reactionCounts[reaction.reaction_type] =
      (reactionCounts[reaction.reaction_type] ?? 0) + 1;

    if (currentUserId && reaction.user_id === currentUserId) {
      userReactions.push(reaction.reaction_type);
    }
  }

  return {
    id: review.id,
    title: review.title,
    comment: review.comment,
    image_url: review.image_url,
    rating: review.rating,
    created_at: review.created_at,
    profiles: Array.isArray(review.profiles)
      ? (review.profiles[0] ?? null)
      : review.profiles,
    likes_count: reactions.length,
    user_has_liked: userReactions.includes("like"),
    reaction_counts: reactionCounts,
    user_reactions: userReactions,
    comments_count: commentsCountByReview.get(review.id) ?? 0,
  };
}

function buildMeta(totalItems: number, page: number, limit: number) {
  const totalPages = Math.ceil(totalItems / limit) || 0;

  return {
    total_items: totalItems,
    page,
    limit,
    total_pages: totalPages,
    has_more: page < totalPages,
  };
}

/**
 * GET /api/showroom
 * Trae publicaciones aprobadas con reacciones y conteo de comentarios.
 */
export async function GET(request: NextRequest) {
  try {
    let currentUserId: string | null = null;
    const authHeader = request.headers.get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const user = await getAuthUserFromToken(token);
      if (user) currentUserId = user.id;
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(
      30,
      Math.max(1, parseInt(searchParams.get("limit") || "13", 10) || 13),
    );
    const sort = searchParams.get("sort") === "top" ? "top" : "latest";

    if (sort === "latest") {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: reviews, error: dbError, count } = await supabaseAdmin
        .from("customer_reviews")
        .select(REVIEW_SELECT, { count: "exact" })
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (dbError) {
        return createSupabaseErrorResponse(dbError, {
          context: "GET /api/showroom",
          fallbackMessage: "Error al obtener las publicaciones del showroom.",
          databaseMessage:
            "Error al obtener las publicaciones del showroom con sus métricas.",
        });
      }

      const reviewIds = (reviews ?? []).map((review) => review.id);
      const commentsCountByReview = await attachCommentCounts(reviewIds);
      const formattedReviews = (reviews ?? []).map((review) =>
        formatReview(review as RawReview, currentUserId, commentsCountByReview),
      );

      return NextResponse.json(
        {
          success: true,
          data: formattedReviews,
          meta: buildMeta(count ?? 0, page, limit),
        },
        { status: 200 },
      );
    }

    const { data: reviews, error: dbError } = await supabaseAdmin
      .from("customer_reviews")
      .select(REVIEW_SELECT)
      .eq("is_approved", true);

    if (dbError) {
      return createSupabaseErrorResponse(dbError, {
        context: "GET /api/showroom",
        fallbackMessage: "Error al obtener las publicaciones del showroom.",
        databaseMessage:
          "Error al obtener las publicaciones del showroom con sus métricas.",
      });
    }

    const reviewIds = (reviews ?? []).map((review) => review.id);
    const commentsCountByReview = await attachCommentCounts(reviewIds);

    const formattedReviews = (reviews ?? [])
      .map((review) =>
        formatReview(review as RawReview, currentUserId, commentsCountByReview),
      )
      .sort((a, b) => {
        if (b.likes_count !== a.likes_count) {
          return b.likes_count - a.likes_count;
        }

        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });

    const totalItems = formattedReviews.length;
    const from = (page - 1) * limit;
    const paginated = formattedReviews.slice(from, from + limit);

    return NextResponse.json(
      {
        success: true,
        data: paginated,
        meta: buildMeta(totalItems, page, limit),
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return createUnexpectedErrorResponse(
      "GET /api/showroom",
      error,
      "Error al obtener las publicaciones del showroom con sus métricas.",
    );
  }
}

/**
 * POST /api/showroom
 * Crea una nueva publicación en el showroom (Ruta Protegida)
 */
export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const comment = formData.get("comment") as string;
    const ratingRaw = formData.get("rating");
    const file = formData.get("file") as File | null;

    if (!title || !comment || !ratingRaw) {
      return NextResponse.json(
        { error: "Título, descripción y calificación son obligatorios." },
        { status: 400 },
      );
    }

    const rating = parseInt(ratingRaw as string, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La calificación debe ser un número entero entre 1 y 5." },
        { status: 400 },
      );
    }

    let imageUrl: string | null = null;
    let uploadedFilePath: string | null = null;

    if (file && file.size > 0) {
      const fileExtension = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      uploadedFilePath = `showroom/${fileName}`;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { error: storageError } = await supabaseAdmin.storage
        .from("product_images")
        .upload(uploadedFilePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (storageError) {
        return createSupabaseErrorResponse(storageError, {
          context: "POST /api/showroom upload",
          fallbackMessage: "Error al almacenar la imagen.",
          databaseMessage: "Error al almacenar la imagen.",
        });
      }

      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from("product_images").getPublicUrl(uploadedFilePath);

      imageUrl = publicUrl;
    }

    const { data: newReview, error: dbError } = await supabaseAdmin
      .from("customer_reviews")
      .insert({
        user_id: user.id,
        title,
        comment,
        rating,
        image_url: imageUrl,
        is_approved: false,
      })
      .select()
      .single();

    if (dbError) {
      if (uploadedFilePath) {
        await supabaseAdmin.storage.from("product_images").remove([uploadedFilePath]);
      }

      return createSupabaseErrorResponse(dbError, {
        context: "POST /api/showroom insert",
        fallbackMessage: "No se pudo crear la publicación.",
        databaseMessage: "No se pudo crear la publicación.",
      });
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Tu publicación fue enviada y está pendiente de revisión por el equipo.",
        data: newReview,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return createUnexpectedErrorResponse(
      "POST /api/showroom",
      error,
      "Error interno del servidor.",
    );
  }
}
