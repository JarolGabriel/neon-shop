import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  createSupabaseErrorResponse,
  createUnexpectedErrorResponse,
} from "@/lib/supabase-errors";

// GET /api/categories
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return createSupabaseErrorResponse(error, {
        context: "GET /api/categories",
        fallbackMessage: "Error al obtener categorías",
        databaseMessage: "Error al obtener categorías",
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    return createUnexpectedErrorResponse(
      "GET /api/categories",
      error,
      "Error inesperado al obtener categorías",
    );
  }
}
