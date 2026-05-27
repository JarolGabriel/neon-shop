import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Sesión inválida o expirada." },
        { status: 401 },
      );
    }

    // 2. Extraer el review_id al que el usuario quiere reaccionar
    const body = await request.json();
    const { review_id } = body;

    if (!review_id) {
      return NextResponse.json(
        { error: "El identificador de la reseña (review_id) es obligatorio." },
        { status: 400 },
      );
    }

    // 3. Verificar si el usuario ya le había dado like a esta publicación específica
    const { data: existingReaction, error: checkError } = await supabaseAdmin
      .from("review_reactions")
      .select("id")
      .eq("review_id", review_id)
      .eq("user_id", user.id)
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
          reaction_type: "like", // Por si en el futuro agregas fueguitos, corazones, etc.
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
