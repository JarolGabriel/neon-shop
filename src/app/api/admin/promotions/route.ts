import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/supabase"; // Importa el tipo generado

// Definimos el tipo para lo que se inserta en "promotions"
type PromotionInsert = Database["public"]["Tables"]["promotions"]["Insert"];
type PromotionRow = Database["public"]["Tables"]["promotions"]["Row"];

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
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { success: false, message: "Error al cargar promociones" },
      { status: 500 },
    );
  }
}

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

    revalidatePath("/");
    revalidatePath("/comunidad");

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    // 2. Corrección profesional del catch:

    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
