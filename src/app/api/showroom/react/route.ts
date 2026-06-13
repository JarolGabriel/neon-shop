import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromToken, supabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/showroom/react
 * Maneja el comportamiento de Toggle (Dar/Quitar Like) para una reseña
 * RUTA PROTEGIDA
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Validar autenticación por token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No autorizado. Token ausente o inválido." },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    const user = await getAuthUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Sesión inválida o expirada." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { review_id, reaction_type = "like" } = body;

    const allowedReactions = ["like", "fire", "celebrate", "wow", "unicorn"];

    if (!review_id) {
      return NextResponse.json(
        { error: "El identificador de la reseña (review_id) es obligatorio." },
        { status: 400 },
      );
    }

    if (!allowedReactions.includes(reaction_type)) {
      return NextResponse.json(
        { error: "Tipo de reacción no válido." },
        { status: 400 },
      );
    }

    const { data: existingReaction, error: checkError } = await supabaseAdmin
      .from("review_reactions")
      .select("id")
      .eq("review_id", review_id)
      .eq("user_id", user.id)
      .eq("reaction_type", reaction_type)
      .maybeSingle();

    if (checkError) throw checkError;

    // 4. LOGICA TOGGLE:
    if (existingReaction) {
      // CASO A: Ya existe el like -> El usuario quiere quitarlo
      const { error: deleteError } = await supabaseAdmin
        .from("review_reactions")
        .delete()
        .eq("id", existingReaction.id);

      if (deleteError) throw deleteError;

      return NextResponse.json(
        {
          success: true,
          message: "Reacción eliminada con éxito.",
          liked: false,
        },
        { status: 200 },
      );
    } else {
      // CASO B: No existe el like -> El usuario quiere dar un nuevo like
      const { error: insertError } = await supabaseAdmin
        .from("review_reactions")
        .insert({
          review_id,
          user_id: user.id,
          reaction_type,
        });

      if (insertError) throw insertError;

      return NextResponse.json(
        {
          success: true,
          message: "Reacción registrada con éxito.",
          liked: true,
        },
        { status: 201 },
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Error crítico en POST /api/showroom/react:",
        error.message,
      );
      return NextResponse.json(
        { error: "Error interno del servidor." },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: "Error desconocido." }, { status: 500 });
  }
}
