import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types/supabase"; // Tu archivo generado

// Obtenemos el tipo para actualizar órdenes
type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, admin_notes } = body;

    // 1. Tipamos el payload como OrderUpdate
    const updatePayload: OrderUpdate = {
      updated_at: new Date().toISOString(),
    };

    // 2. Validación de estados válidos
    if (status !== undefined) {
      const estadosValidos = [
        "pendiente_pago",
        "pago_confirmado",
        "en_taller",
        "en_taller",
        "enviado",
        "entregado",
        "cancelado",
      ];

      if (!estadosValidos.includes(status)) {
        return NextResponse.json(
          {
            success: false,
            message: `Estado no válido. Use uno de estos: ${estadosValidos.join(", ")}`,
          },
          { status: 400 },
        );
      }
      updatePayload.status = status;
    }

    if (admin_notes !== undefined) {
      updatePayload.admin_notes = admin_notes;
    }

    // 3. Validación de contenido
    if (status === undefined && admin_notes === undefined) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Debes proporcionar al menos un campo para actualizar ('status' o 'admin_notes').",
        },
        { status: 400 },
      );
    }

    // 4. Actualización tipada
    const { data: updatedOrder, error } = await supabaseAdmin
      .from("orders")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: "Orden actualizada con éxito.",
        data: updatedOrder,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error en PATCH:", error);
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
