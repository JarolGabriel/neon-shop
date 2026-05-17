import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Cliente de Supabase (Server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * POST /api/products/:id/images
 * Sube una imagen a Supabase Storage y crea registro en product_images
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: productId } = await params;

    // 1. Validar que el producto existe
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    // 2. Obtener la imagen del FormData
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const altText = (formData.get("alt_text") as string) || "";
    const isPrimary = formData.get("is_primary") === "true";

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ninguna imagen" },
        { status: 400 },
      );
    }

    // 3. Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo JPG, PNG o WebP" },
        { status: 400 },
      );
    }

    // 4. Validar tamaño (máx 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "La imagen no puede pesar más de 5MB" },
        { status: 400 },
      );
    }

    // 5. Generar nombre único para el archivo
    const fileExt = file.name.split(".").pop();
    const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // 6. Subir a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product_images")
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error al subir imagen:", uploadError);
      return NextResponse.json(
        { error: "Error al subir la imagen", details: uploadError.message },
        { status: 500 },
      );
    }

    // 7. Obtener URL pública de la imagen
    const { data: publicUrlData } = supabase.storage
      .from("product_images")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // 8. Si es imagen principal, desmarcar las demás
    if (isPrimary) {
      await supabase
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", productId);
    }

    // 9. Crear registro en la tabla product_images
    const { data: imageRecord, error: dbError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        image_url: imageUrl,
        alt_text: altText || "Imagen de producto",
        is_primary: isPrimary,
        display_order: 0,
      })
      .select()
      .single();

    if (dbError) {
      // Si falla el insert, eliminar la imagen subida
      await supabase.storage.from("product_images").remove([fileName]);

      return NextResponse.json(
        {
          error: "Error al guardar en la base de datos",
          details: dbError.message,
        },
        { status: 500 },
      );
    }

    // 10. Respuesta exitosa
    return NextResponse.json(
      {
        message: "Imagen subida correctamente",
        data: imageRecord,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error en POST /api/products/[id]/images:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
