// /home/jarol/projects/neon-shop/src/app/api/promotions/active/route.ts
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("promotions")
      .select(
        `
        *,
        promotion_images (*)
      `,
      )
      // 1. CONDICIÓN MAESTRA:
      .eq("is_active", true)

      // 2. FILTRO DE FECHAS FLEXIBLE:

      .or(
        `and(start_date.lte.${now},end_date.gte.${now}),and(start_date.is.null,end_date.is.null)`,
      )

      // 3. Ordenamos por la prioridad asignada
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error cargando promociones activas:", error);
    return NextResponse.json(
      { success: false, message: "Error al cargar promociones" },
      { status: 500 },
    );
  }
}
