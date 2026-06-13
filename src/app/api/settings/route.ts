import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

// Obtenemos el tipo de fila de la tabla site_settings
type SiteSettingRow = Database["public"]["Tables"]["site_settings"]["Row"];

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("key, value");

    if (error) throw error;

    const settings = (data as SiteSettingRow[]).reduce(
      (acc: Record<string, string>, curr: SiteSettingRow) => {
        acc[curr.key] = curr.value || "";
        return acc;
      },
      {} as Record<string, string>,
    );

    return NextResponse.json(
      { success: true, data: settings },
      { status: 200, headers: NO_CACHE_HEADERS },
    );
  } catch (error: unknown) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al cargar configuración",
      },
      { status: 500 },
    );
  }
}
