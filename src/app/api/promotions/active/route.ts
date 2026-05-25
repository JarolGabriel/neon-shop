import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("promotions")
    .select(`*, promotion_images(*)`)
    .eq("is_active", true)
    .lte("start_date", now)
    .gte("end_date", now)
    .order("display_order", { ascending: true });

  if (error)
    return NextResponse.json(
      { error: "Error al cargar promociones" },
      { status: 500 },
    );

  return NextResponse.json(data);
}
