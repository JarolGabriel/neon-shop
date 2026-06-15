import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

const FOUNDER_IMAGE_BUCKET = "product_images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

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
    const formData = await request.formData();
    const file = formData.get("file");

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
        { error: "La imagen no puede superar 5 MB" },
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

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `founder/${Date.now()}_${safeName || `photo.${extension}`}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(FOUNDER_IMAGE_BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error al subir foto del fundador:", uploadError.message);
      return NextResponse.json(
        { error: "No se pudo subir la imagen" },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(FOUNDER_IMAGE_BUCKET).getPublicUrl(filePath);

    revalidatePath("/", "layout");
    revalidatePath("/quienes-somos");

    return NextResponse.json({ image_url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Error en POST /api/admin/founder-image:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
