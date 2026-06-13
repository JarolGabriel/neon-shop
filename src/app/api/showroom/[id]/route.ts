import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromToken, supabaseAdmin } from "@/lib/supabase";
import {
  createSupabaseErrorResponse,
  createUnexpectedErrorResponse,
} from "@/lib/supabase-errors";

const STORAGE_BUCKET = "product_images";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function extractStoragePath(imageUrl: string | null): string | null {
  if (!imageUrl) return null;
  const marker = `/${STORAGE_BUCKET}/`;
  const index = imageUrl.indexOf(marker);
  if (index < 0) return null;
  return imageUrl.slice(index + marker.length).split("?")[0] || null;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;

    const { data: review, error: fetchError } = await supabaseAdmin
      .from("customer_reviews")
      .select("id, user_id, image_url")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      return createSupabaseErrorResponse(fetchError, {
        context: "DELETE /api/showroom/[id]",
        fallbackMessage: "No se pudo eliminar la publicación.",
      });
    }

    if (!review) {
      return NextResponse.json(
        { error: "Publicación no encontrada." },
        { status: 404 },
      );
    }

    if (review.user_id !== user.id) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar esta publicación." },
        { status: 403 },
      );
    }

    const storagePath = extractStoragePath(review.image_url);
    if (storagePath) {
      await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([storagePath]);
    }

    const { error: deleteError } = await supabaseAdmin
      .from("customer_reviews")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return createSupabaseErrorResponse(deleteError, {
        context: "DELETE /api/showroom/[id]",
        fallbackMessage: "No se pudo eliminar la publicación.",
      });
    }

    return NextResponse.json(
      { success: true, message: "Publicación eliminada" },
      { status: 200 },
    );
  } catch (error: unknown) {
    return createUnexpectedErrorResponse(
      "DELETE /api/showroom/[id]",
      error,
      "Error al eliminar la publicación.",
    );
  }
}
