import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  SHOWROOM_STORAGE_BUCKET,
  extractShowroomStoragePath,
} from "@/lib/showroom-storage";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const REVIEW_SELECT = `
  id,
  title,
  comment,
  image_url,
  rating,
  created_at,
  profiles (id, first_name, last_name, email)
`;

const COMMENT_SELECT = `
  id,
  comment,
  created_at,
  review_id,
  profiles (id, first_name, last_name, email)
`;

async function deleteReviewImage(imageUrl: string | null) {
  const storagePath = extractShowroomStoragePath(imageUrl);
  if (!storagePath) return;
  await supabaseAdmin.storage.from(SHOWROOM_STORAGE_BUCKET).remove([storagePath]);
}

/**
 * GET /api/admin/moderation?view=pending|published
 */
export async function GET(request: NextRequest) {
  try {
    const view = request.nextUrl.searchParams.get("view");
    const isPublished = view === "published";

    let reviewsQuery = supabaseAdmin
      .from("customer_reviews")
      .select(REVIEW_SELECT)
      .eq("is_approved", isPublished);

    if (isPublished) {
      reviewsQuery = reviewsQuery
        .order("created_at", { ascending: false })
        .limit(50);
    }

    const { data: reviews, error: errReviews } = await reviewsQuery;

    if (errReviews) throw errReviews;

    let commentsQuery = supabaseAdmin
      .from("review_comments")
      .select(COMMENT_SELECT)
      .eq("is_approved", isPublished);

    if (isPublished) {
      commentsQuery = commentsQuery
        .order("created_at", { ascending: false })
        .limit(50);
    }

    const { data: comments, error: errComments } = await commentsQuery;

    if (errComments) throw errComments;

    return NextResponse.json(
      {
        success: true,
        data: {
          reviews: reviews ?? [],
          comments: comments ?? [],
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error en GET /api/admin/moderation:", error);
    return NextResponse.json(
      { error: "Error interno al cargar la moderación." },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/moderation
 * approve | reject (pendientes) | delete (cualquier estado)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { target_type, target_id, action } = body;

    if (!target_type || !target_id || !action) {
      return NextResponse.json(
        { error: "Campos obligatorios: target_type, target_id, action." },
        { status: 400 },
      );
    }

    const tableName =
      target_type === "review" ? "customer_reviews" : "review_comments";

    if (action === "approve") {
      const { data, error: updateError } = await supabaseAdmin
        .from(tableName)
        .update({ is_approved: true })
        .eq("id", target_id)
        .select();

      if (updateError) throw updateError;

      if (!data || data.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: `El ${target_type} con el ID proporcionado no existe o ya fue eliminado.`,
          },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "El contenido ha sido aprobado y ya es público.",
        },
        { status: 200 },
      );
    }

    if (action === "reject" || action === "delete") {
      if (target_type === "review") {
        const { data: review } = await supabaseAdmin
          .from("customer_reviews")
          .select("image_url")
          .eq("id", target_id)
          .maybeSingle();

        if (review?.image_url) {
          await deleteReviewImage(review.image_url);
        }
      }

      const { data, error: deleteError } = await supabaseAdmin
        .from(tableName)
        .delete()
        .eq("id", target_id)
        .select();

      if (deleteError) throw deleteError;

      if (!data || data.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: `El ${target_type} con el ID proporcionado no existe o ya fue eliminado.`,
          },
          { status: 404 },
        );
      }

      const message =
        action === "delete"
          ? "Contenido eliminado"
          : "El contenido ha sido rechazado y eliminado.";

      return NextResponse.json({ success: true, message }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Acción inválida. Use 'approve', 'reject' o 'delete'." },
      { status: 400 },
    );
  } catch (error: unknown) {
    console.error("Error en PATCH /api/admin/moderation:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la moderación." },
      { status: 500 },
    );
  }
}
