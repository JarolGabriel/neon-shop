import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET /api/showroom
 * Trae todas las publicaciones con conteo de likes en vivo y verificación de usuario
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Verificar de forma OPCIONAL si hay un usuario navegando para saber si ya le dio like
    let currentUserId: string | null = null;
    const authHeader = request.headers.get("authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const {
        data: { user },
      } = await supabaseAdmin.auth.getUser(token);
      if (user) {
        currentUserId = user.id;
      }
    }

    // 2. Traer las publicaciones inyectando el conteo de likes y los comentarios asociados
    const { data: reviews, error: dbError } = await supabaseAdmin
      .from("customer_reviews")
      .select(
        `
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
          user_id
        )
      `,
      )
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (dbError) throw dbError;

    // 3. Procesar los datos en el servidor para entregarle al Frontend un formato ultra limpio
    const formattedReviews = reviews.map((review) => {
      // Contamos cuántas reacciones tiene este post en total
      const likesCount = review.review_reactions
        ? review.review_reactions.length
        : 0;

      // Verificamos si el usuario actual está dentro del array de personas que dieron like
      const userHasLiked = currentUserId
        ? review.review_reactions.some(
            (reaction: { user_id: string }) =>
              reaction.user_id === currentUserId,
          )
        : false;

      return {
        id: review.id,
        title: review.title,
        comment: review.comment,
        image_url: review.image_url,
        rating: review.rating,
        created_at: review.created_at,
        profiles: review.profiles,
        likes_count: likesCount,
        user_has_liked: userHasLiked,
      };
    });

    return NextResponse.json(
      { success: true, data: formattedReviews },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("❌ Error en GET /api/showroom:", error);
    return NextResponse.json(
      {
        error:
          "Error al obtener las publicaciones del showroom con sus métricas.",
      },
      { status: 500 },
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
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No autorizado. Token de autenticación ausente o inválido." },
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
        { error: "Sesión inválida o expirada. Inicie sesión nuevamente." },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const comment = formData.get("comment") as string;
    const ratingRaw = formData.get("rating");
    const file = formData.get("file") as File | null;

    if (!title || !comment || !ratingRaw || !file) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios." },
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

    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filePath = `showroom/${fileName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: storageError } = await supabaseAdmin.storage
      .from("product_images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (storageError) {
      console.error(
        "❌ Error al subir imagen a Storage:",
        storageError.message,
      );
      return NextResponse.json(
        { error: "Error al almacenar la imagen." },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("product_images").getPublicUrl(filePath);

    const { data: newReview, error: dbError } = await supabaseAdmin
      .from("customer_reviews")
      .insert({
        user_id: user.id,
        title,
        comment,
        rating,
        image_url: publicUrl,
      })
      .select()
      .single();

    if (dbError) {
      await supabaseAdmin.storage.from("product_images").remove([filePath]);
      throw dbError;
    }

    return NextResponse.json(
      {
        success: true,
        message: "¡Testimonio publicado con éxito!",
        data: newReview,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error crítico en POST /api/showroom:", error.message);
      return NextResponse.json(
        { error: "Error interno del servidor." },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: "Error desconocido." }, { status: 500 });
  }
}
