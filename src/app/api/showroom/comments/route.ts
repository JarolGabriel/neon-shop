import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET /api/showroom/comments?review_id=UUID
 * Obtiene todos los comentarios de una publicación específica de forma pública
 */
export async function GET(request: NextRequest) {
  try {
    // Extraer el parámetro review_id de la URL de la petición
    const { searchParams } = new URL(request.url);
    const review_id = searchParams.get("review_id");

    if (!review_id) {
      return NextResponse.json(
        { error: "El parámetro review_id es obligatorio en la URL." },
        { status: 400 },
      );
    }

    // Consultar los comentarios uniendo los datos de los perfiles públicos
    const { data: comments, error: dbError } = await supabaseAdmin
      .from("review_comments")
      .select(
        `
        id,
        comment,
        created_at,
        profiles (
          id,
          first_name,
          last_name
        )
      `,
      )
      .eq("review_id", review_id)
      .eq("is_approved", true)
      .order("created_at", { ascending: true });

    if (dbError) throw dbError;

    return NextResponse.json(
      { success: true, data: comments },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error en GET /api/showroom/comments:", error);
    return NextResponse.json(
      { error: "Error al obtener los comentarios." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/showroom/comments
 * Agrega un nuevo comentario a una publicación (Ruta Protegida)
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

    // 2. Extraer y validar el cuerpo del comentario
    const body = await request.json();
    const { review_id, comment } = body;

    if (!review_id || !comment || comment.trim() === "") {
      return NextResponse.json(
        {
          error:
            "El id de la reseña y el contenido del comentario son obligatorios.",
        },
        { status: 400 },
      );
    }

    // 3. Insertar el comentario amarrado al usuario logueado
    const { data: newComment, error: dbError } = await supabaseAdmin
      .from("review_comments")
      .insert({
        review_id,
        user_id: user.id,
        comment: comment.trim(),
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json(
      {
        success: true,
        message: "Comentario publicado con éxito.",
        data: newComment,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Error crítico en POST /api/showroom/comments:",
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
