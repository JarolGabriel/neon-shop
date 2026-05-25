import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types/supabase"; // Importa el tipo generado

// Definimos el tipo para lo que se inserta en "promotions"
type PromotionInsert = Database["public"]["Tables"]["promotions"]["Insert"];

export async function POST(request: NextRequest) {
  try {
    // 1. Tipamos el body para que TypeScript sepa qué campos debe tener
    const body: PromotionInsert = await request.json();

    const { data, error } = await supabaseAdmin
      .from("promotions")
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    // 2. Corrección profesional del catch:

    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
