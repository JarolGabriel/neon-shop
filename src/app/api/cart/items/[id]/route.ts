import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// 3. PUT /api/cart/items/[id] -> MODIFICAR CANTIDAD

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "La cantidad debe ser igual o mayor a 1" },
        { status: 400 },
      );
    }

    const { data: updatedItem, error } = await supabaseAdmin
      .from("cart_items")
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(
      { message: "Cantidad modificada con éxito", data: updatedItem },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error crítico en PUT /api/cart/items:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// 4. DELETE /api/cart/items/[id] -> QUITAR ÍTEM

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("cart_items")
      .delete()
      .eq("id", id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(
      { message: "Producto removido del carrito" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error crítico en DELETE /api/cart/items:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
