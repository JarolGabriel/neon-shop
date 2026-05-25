import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types/supabase";

// Definimos el tipo de inserción para la tabla de imágenes
type PromotionImageInsert =
  Database["public"]["Tables"]["promotion_images"]["Insert"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const promotion_id = formData.get("promotion_id") as string | null;
    const alt_text = (formData.get("alt_text") as string) || "";
    const display_order = parseInt(
      (formData.get("display_order") as string) || "0",
    );

    if (!file || !promotion_id) {
      return NextResponse.json(
        { error: "Faltan datos requeridos (archivo o ID)" },
        { status: 400 },
      );
    }

    // 2. Subir al Storage
    const filePath = `promotions/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("product_images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 3. Obtener la URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("product_images").getPublicUrl(filePath);

    // 4. Preparar el objeto tipado
    const dbPayload: PromotionImageInsert = {
      promotion_id,
      image_url: publicUrl,
      alt_text,
      display_order,
    };

    // 5. Guardar el registro
    const { data, error: dbError } = await supabaseAdmin
      .from("promotion_images")
      .insert([dbPayload])
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error al procesar la subida";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
