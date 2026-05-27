import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET /api/admin/moderation
 * Trae TODO lo que está pendiente de aprobación (Reviews y Comentarios)
 * ACCESO GARANTIZADO POR MIDDLEWARE
 */
export async function GET() {
  try {
    // 1. Traer reseñas pendientes de aprobación
    const { data: pendingReviews, error: errReviews } = await supabaseAdmin
      .from("customer_reviews")
      .select(
        `
        id,
        title,
        comment,
        image_url,
        rating,
        created_at,
        profiles (id, first_name, last_name, email)
      `,
      )
      .eq("is_approved", false);

    if (errReviews) throw errReviews;

    // 2. Traer comentarios pendientes de aprobación
    const { data: pendingComments, error: errComments } = await supabaseAdmin
      .from("review_comments")
      .select(
        `
        id,
        comment,
        created_at,
        profiles (id, first_name, last_name, email)
      `,
      )
      .eq("is_approved", false);

    if (errComments) throw errComments;

    return NextResponse.json(
      {
        success: true,
        data: {
          reviews: pendingReviews,
          comments: pendingComments,
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
 * Aprueba o elimina un contenido (Review o Comentario)
 * ACCESO GARANTIZADO POR MIDDLEWARE
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

    // CASO 1: El administrador decide APROBAR el contenido
    if (action === "approve") {
      const { data, error: updateError } = await supabaseAdmin
        .from(tableName)
        .update({ is_approved: true })
        .eq("id", target_id)
        .select();

      if (updateError) throw updateError;

      // Si data viene vacío, significa que el ID no existía
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
          message: `El contenido ha sido aprobado y ya es público.`,
        },
        { status: 200 },
      );
    }

    // CASO 2: El administrador decide RECHAZAR (Eliminar contenido inapropiado)
    if (action === "reject") {
      const { data, error: deleteError } = await supabaseAdmin
        .from(tableName)
        .delete()
        .eq("id", target_id)
        .select();

      if (deleteError) throw deleteError;

      // Si data viene vacío, el ID ya no existía en la base de datos
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
          message: `El contenido ha sido rechazado y eliminado.`,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: "Acción inválida. Use 'approve' o 'reject'." },
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
