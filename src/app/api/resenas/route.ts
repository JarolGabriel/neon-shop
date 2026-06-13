import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromToken, supabaseAdmin } from "@/lib/supabase";

const TABLE = "product_reviews";
const STORAGE_BUCKET = "product_images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function uploadReviewImage(
  file: File,
): Promise<{ publicUrl: string; filePath: string }> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      "Formato no permitido. Solo se aceptan imágenes JPG, PNG, WebP o GIF.",
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("La imagen no puede superar los 5 MB.");
  }

  const extension = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
  const filePath = `reviews/${fileName}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error: storageError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (storageError) {
    throw new Error("Error al almacenar la imagen.");
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

  return { publicUrl, filePath };
}

/**
 * POST /api/resenas
 * Crea una reseña pública para un producto.
 * multipart/form-data: product_id, rating, title, content, user_name, email, file? (imagen opcional)
 */
export async function POST(request: NextRequest) {
  let uploadedPath: string | null = null;

  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const [formData, authUser] = await Promise.all([
      request.formData(),
      getAuthUserFromToken(token),
    ]);

    const verifiedUserId = authUser?.id ?? null;
    const product_id = formData.get("product_id") as string | null;
    const ratingRaw = formData.get("rating");
    const title = formData.get("title") as string | null;
    const content = formData.get("content") as string | null;
    const user_name = formData.get("user_name") as string | null;
    const email = formData.get("email") as string | null;
    const file = formData.get("file") as File | null;

    if (
      !product_id ||
      ratingRaw == null ||
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

    const rating = parseInt(ratingRaw as string, 10);
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

    let mediaUrl: string | null = null;

    if (file && file.size > 0) {
      try {
        const uploaded = await uploadReviewImage(file);
        mediaUrl = uploaded.publicUrl;
        uploadedPath = uploaded.filePath;
      } catch (uploadError) {
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Error al subir la imagen.";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    const { data: newReview, error: insertError } = await supabaseAdmin
      .from(TABLE)
      .insert({
        product_id,
        rating,
        title,
        content,
        media_url: mediaUrl,
        user_name,
        email,
        user_id: verifiedUserId,
      })
      .select(
        "id, product_id, rating, title, content, media_url, user_name, created_at",
      )
      .single();

    if (insertError) {
      if (uploadedPath) {
        await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([uploadedPath]);
      }

      if (insertError.code === "23503") {
        return NextResponse.json(
          { error: "El producto indicado no existe." },
          { status: 404 },
        );
      }

      throw insertError;
    }

    return NextResponse.json(
      {
        success: true,
        message: "¡Reseña enviada con éxito!",
        data: { ...newReview, is_verified: verifiedUserId != null },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (uploadedPath) {
      await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([uploadedPath]);
    }
    if (error instanceof Error) {
      console.error("❌ Error en POST /api/resenas:", error.message);
    }
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
