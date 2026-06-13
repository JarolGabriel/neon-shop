import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromToken, supabaseAdmin } from "@/lib/supabase";

const AVATAR_BUCKET = "avatars";
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return { user: null, error: "No autorizado" };
  }

  const user = await getAuthUserFromToken(token);

  if (!user) {
    return { user: null, error: "Sesión inválida o expirada" };
  }

  return { user, error: null };
}

function getExtensionFromMime(mimeType: string): string | null {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await authenticateRequest(request);

    if (authError || !user) {
      return NextResponse.json({ error: authError ?? "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Debes seleccionar una imagen" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa JPG, PNG o WEBP" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "La imagen no puede superar 2MB" },
        { status: 400 },
      );
    }

    const extension = getExtensionFromMime(file.type);
    if (!extension) {
      return NextResponse.json(
        { error: "Formato de imagen no soportado" },
        { status: 400 },
      );
    }

    const filePath = `${user.id}/avatar.${extension}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Error al subir avatar:", uploadError.message);
      return NextResponse.json(
        { error: "No se pudo subir la imagen" },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error al actualizar avatar_url:", updateError.message);
      return NextResponse.json(
        { error: "No se pudo guardar la foto de perfil" },
        { status: 500 },
      );
    }

    return NextResponse.json({ avatar_url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Error en POST /api/profile/avatar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
