import { supabaseAdmin } from "@/lib/supabase";
import {
  buildSupabaseErrorPayload,
  createUnexpectedErrorResponse,
} from "@/lib/supabase-errors";
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
      .eq("is_active", true)
      .or(
        `and(start_date.lte.${now},end_date.gte.${now}),and(start_date.is.null,end_date.is.null)`,
      )
      .order("display_order", { ascending: true });

    if (error) {
      const { body, status, headers } = buildSupabaseErrorPayload(error, {
        context: "GET /api/promotions/active",
        fallbackMessage: "Error al cargar promociones",
        databaseMessage: "Error al cargar promociones",
      });
      return NextResponse.json(
        { success: false, message: body.error, code: body.code },
        { status, headers },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    return createUnexpectedErrorResponse(
      "GET /api/promotions/active",
      error,
      "Error al cargar promociones",
    );
  }
}
