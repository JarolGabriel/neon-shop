import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type PromotionUpdate = Database["public"]["Tables"]["promotions"]["Update"];

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 1. PATCH: Actualizar una promoción existente (o hacer toggle del switch)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: PromotionUpdate = await request.json();

    const { data, error } = await supabaseAdmin
      .from("promotions")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/comunidad");

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// 2. DELETE: Eliminar una promoción
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("promotions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/comunidad");

    return NextResponse.json(
      { success: true, message: "Promoción eliminada correctamente" },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
