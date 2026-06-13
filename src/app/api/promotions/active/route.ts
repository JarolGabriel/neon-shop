import { supabaseAdmin } from "@/lib/supabase";
import { isPromotionCurrentlyActive } from "@/lib/promotions";
import {
  buildSupabaseErrorPayload,
  createUnexpectedErrorResponse,
} from "@/lib/supabase-errors";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("promotions")
      .select(
        `
        *,
        promotion_images (*)
      `,
      )
      .eq("is_active", true)
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

    const activePromotions = (data ?? []).filter((promotion) =>
      isPromotionCurrentlyActive(promotion),
    );

    return NextResponse.json(
      { success: true, data: activePromotions },
      { status: 200, headers: NO_CACHE_HEADERS },
    );
  } catch (error: unknown) {
    return createUnexpectedErrorResponse(
      "GET /api/promotions/active",
      error,
      "Error al cargar promociones",
    );
  }
}
