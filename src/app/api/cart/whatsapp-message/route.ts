import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// 5. GET /api/cart/whatsapp-message -> TEXTO FORMATEADO

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Se requiere el session_id" },
        { status: 400 },
      );
    }

    const { data: items, error } = await supabaseAdmin
      .from("cart_items")
      .select(
        `
        quantity,
        notes,
        products ( name, price ),
        product_variants ( size, color, price )
      `,
      )
      .eq("session_id", sessionId);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 },
      );
    }

    // --- CONSTRUCCIÓN DEL MENSAJE PARA EL DUEÑO ---
    let message = `⚡ *¡Hola Neon Shop! Quisiera hacer un pedido:* \n\n`;
    let totalPedido = 0;

    items.forEach((item: any, index: number) => {
      const precioUnitario =
        item.product_variants?.price || item.products?.price || 0;
      const subtotalItem = precioUnitario * item.quantity;
      totalPedido += subtotalItem;

      message += `${index + 1}. 🛍️ *${item.products?.name}*\n`;

      if (item.product_variants) {
        const { size, color } = item.product_variants;
        message += `   • Detalle: ${size || ""} | ${color || ""}\n`;
      }

      message += `   • Cantidad: ${item.quantity}\n`;
      message += `   • Precio: $${precioUnitario} c/u\n`;

      if (item.notes) {
        message += `   • 📝 *Notas:* _"${item.notes}"_\n`;
      }

      message += `\n`;
    });

    message += `🏁 *Total Estimado del Pedido:* $${totalPedido.toFixed(2)}\n\n`;
    message += `📱 _Pedido generado automáticamente desde el catálogo web._`;

    return NextResponse.json({ whatsapp_text: message }, { status: 200 });
  } catch (error) {
    console.error("Error crítico en whatsapp-message:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
