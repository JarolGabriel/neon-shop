import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types/supabase";

// Obtenemos los tipos automáticos de la tabla 'site_settings'
type SiteSettingUpdate =
  Database["public"]["Tables"]["site_settings"]["Update"];
type SiteSettingInsert =
  Database["public"]["Tables"]["site_settings"]["Insert"];

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
