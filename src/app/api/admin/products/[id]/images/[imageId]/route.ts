import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

type RouteParams = {
  params: Promise<{
    id: string;
    imageId: string;
  }>;
};

/**
 * DELETE /api/admin/products/[id]/images/[imageId]
 * Elimina una imagen específica del Storage y su registro en PostgreSQL
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: productId, imageId } = await params;

    // 1. Validar la existencia de la imagen y verificar que pertenezca al producto
    const { data: imageRecord, error: fetchError } = await supabase
      .from("product_images")
      .select("image_url, is_primary")
      .eq("id", imageId)
      .eq("product_id", productId)
      .single();

    if (fetchError || !imageRecord) {
      return NextResponse.json(
        { error: "La imagen no existe o no pertenece a este producto" },
        { status: 404 },
      );
    }

    // 2. Escudo protector de negocio: No dejar la tienda sin imagen principal
    if (imageRecord.is_primary) {
      return NextResponse.json(
        {
          error:
            "No puedes eliminar la imagen principal del producto. " +
            "Por favor, marca otra imagen como principal antes de eliminar esta.",
        },
        { status: 400 },
      );
    }

    // 3. Extraer la ruta relativa del archivo para Supabase Storage
    const urlParts = imageRecord.image_url.split("/product_images/");
    if (urlParts.length !== 2) {
      return NextResponse.json(
        { error: "La URL de la imagen almacenada tiene un formato inválido" },
        { status: 400 },
      );
    }
    const storageFilePath = urlParts[1];

    // 4. Eliminación Física: Borrar primero del Storage de Supabase
    const { error: storageError } = await supabase.storage
      .from("product_images")
      .remove([storageFilePath]);

    if (storageError) {
      console.error(
        " Error al eliminar archivo físico del Storage:",
        storageError,
      );
      return NextResponse.json(
        {
          error: "No se pudo eliminar el archivo físico del almacenamiento",
          details: storageError.message,
        },
        { status: 500 },
      );
    }

    // 5. Eliminación Lógica: Borrar el registro de la tabla product_images en PostgreSQL
    const { error: dbError } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (dbError) {
      console.error(
        "Error al eliminar el registro de la base de datos:",
        dbError,
      );
      return NextResponse.json(
        {
          error:
            "El archivo físico fue eliminado, pero hubo un error al limpiar el registro en la base de datos",
          details: dbError.message,
        },
        { status: 500 },
      );
    }

    // 6. Respuesta Exitosa de nivel Profesional
    return NextResponse.json(
      {
        message:
          "Imagen eliminada exitosamente del almacenamiento y de la base de datos",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      " Error crítico en DELETE /api/admin/products/[id]/images/[imageId]:",
      error,
    );
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la solicitud" },
      { status: 500 },
    );
  }
}
