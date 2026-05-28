import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// 3. PUT /api/cart/items/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quantity, session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: "session_id es requerido" },
        { status: 400 },
      );
    }
    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "La cantidad debe ser igual o mayor a 1" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("cart_items")
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("session_id", session_id)
      .select();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Ítem no encontrado o acceso no autorizado" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Cantidad modificada con éxito", data: data[0] },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en PUT /api/cart/items:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// 4. DELETE /api/cart/items/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // En DELETE, el session_id lo sacaremos de los Query Params
    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get("session_id");

    if (!session_id) {
      return NextResponse.json(
        { error: "session_id es requerido en los parámetros" },
        { status: 400 },
      );
    }

    // ✅ Filtramos por ID y por session_id (Ownership Check)
    const { data, error } = await supabaseAdmin
      .from("cart_items")
      .delete()
      .eq("id", id)
      .eq("session_id", session_id)
      .select();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    // Si data está vacío, es que no encontró el ítem bajo esa sesión
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Ítem no encontrado o acceso no autorizado" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Producto removido del carrito" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en DELETE /api/cart/items:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
