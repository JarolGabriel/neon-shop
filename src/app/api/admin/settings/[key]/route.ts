import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Definimos las claves que NUNCA deben borrarse
const PROTECTED_KEYS = ["whatsapp_number", "support_email"];

interface RouteParams {
  params: Promise<{ key: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { key } = await params;

    // 1. Primero verificamos si existe (y si está protegida)
    const { data: setting, error: fetchError } = await supabaseAdmin
      .from("site_settings")
      .select("id")
      .eq("key", key)
      .single();

    if (fetchError || !setting) {
      return NextResponse.json(
        { success: false, message: `La configuración '${key}' no existe.` },
        { status: 404 },
      );
    }

    // 2. Aquí aplicamos la protección que definimos antes
    if (PROTECTED_KEYS.includes(key)) {
      return NextResponse.json(
        {
          success: false,
          message: `La configuración '${key}' es crítica y no puede eliminarse.`,
        },
        { status: 403 },
      );
    }

    // 3. Si pasó las pruebas, procedemos a borrar
    const { error: deleteError } = await supabaseAdmin
      .from("site_settings")
      .delete()
      .eq("key", key);

    if (deleteError) throw deleteError;

    return NextResponse.json(
      {
        success: true,
        message: `Configuración '${key}' eliminada correctamente.`,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";

    console.error("Error en DELETE settings:", message);

    return NextResponse.json(
      {
        success: false,

        message: "No se pudo eliminar la configuración",

        error: message,
      },

      { status: 500 },
    );
  }
}
