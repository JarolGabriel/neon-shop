import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types/supabase";

// Obtenemos los tipos automáticos de la tabla 'site_settings'
type SiteSettingUpdate =
  Database["public"]["Tables"]["site_settings"]["Update"];
type SiteSettingInsert =
  Database["public"]["Tables"]["site_settings"]["Insert"];
type SiteSettingRow = Database["public"]["Tables"]["site_settings"]["Row"];

export async function PATCH(request: NextRequest) {
  try {
    const { key, value } = await request.json();

    const { error } = await supabaseAdmin
      .from("site_settings")
      .update({
        value,
        updated_at: new Date().toISOString(),
      } as SiteSettingUpdate)
      .eq("key", key);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SiteSettingInsert = await request.json(); // TypeScript valida esto

    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .insert([body])
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Consultamos toda la configuración
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("key, value");

    if (error) throw error;

    // Transformamos el array (formato DB) a un objeto simple (formato Frontend)
    // Usamos el tipo SiteSettingRow para asegurar que 'curr' tenga 'key' y 'value'
    const settings = (data as SiteSettingRow[]).reduce(
      (acc: Record<string, string>, curr: SiteSettingRow) => {
        acc[curr.key] = curr.value || "";
        return acc;
      },
      {} as Record<string, string>,
    );

    return NextResponse.json(
      {
        success: true,
        data: settings,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido al obtener configuraciones";
    console.error("❌ Admin Settings GET Error:", message);

    return NextResponse.json(
      {
        success: false,
        message: "No se pudieron cargar las configuraciones",
        error: message,
      },
      { status: 500 },
    );
  }
}
