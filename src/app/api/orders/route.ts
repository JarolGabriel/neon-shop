import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { CreateOrderPayload } from "@/types/order";
import { Resend } from "resend";
import { Database } from "@/types/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

// Tipado para los resultados de la consulta al carrito con joins
type CartItemResult = Database["public"]["Tables"]["cart_items"]["Row"] & {
  products: { name: string; price: number } | null;
  product_variants: {
    size: string | null;
    color: string | null;
    price: number;
  } | null;
};

async function getSiteSettings() {
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("key, value");

  return (data || []).reduce(
    (acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    },
    {} as Record<string, string>,
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderPayload = await request.json();
    const {
      session_id,
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      delivery_city,
      user_id,
    } = body;

    if (
      !session_id ||
      !customer_name ||
      !customer_phone ||
      !delivery_address ||
      !delivery_city
    ) {
      return NextResponse.json(
        { success: false, message: "Faltan datos obligatorios." },
        { status: 400 },
      );
    }

    const { data: cartItems, error: cartError } = await supabaseAdmin
      .from("cart_items")
      .select(
        `
        quantity, notes, product_id, variant_id,
        products ( name, price ),
        product_variants ( size, color, price )
      `,
      )
      .eq("session_id", session_id);

    if (cartError || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "El carrito está vacío." },
        { status: 400 },
      );
    }

    const typedCartItems = cartItems as unknown as CartItemResult[];

    let totalUsd = 0;
    typedCartItems.forEach((item) => {
      const precioUnitario =
        item.product_variants?.price || item.products?.price || 0;
      totalUsd += precioUnitario * (item.quantity || 0);
    });

    const { data: orderCreated, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user_id || null,
        session_id,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        delivery_city,
        total_usd: totalUsd,
        status: "pendiente_pago",
      })
      .select()
      .single();

    if (orderError || !orderCreated) throw orderError;

    const orderItemsPayload = typedCartItems.map((item) => ({
      order_id: orderCreated.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.products?.name || "Letrero Neón",
      quantity: item.quantity,
      price_usd: item.product_variants?.price || item.products?.price || 0,
      notes: item.notes,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) {
      await supabaseAdmin.from("orders").delete().eq("id", orderCreated.id);
      throw itemsError;
    }

    await supabaseAdmin
      .from("cart_items")
      .delete()
      .eq("session_id", session_id);

    const orderNum = orderCreated.id.slice(0, 8).toUpperCase();
    const settings = await getSiteSettings();
    const adminEmail =
      settings.support_email || "tu_email_por_defecto@gmail.com";

    let emailItemsHtml = "";
    typedCartItems.forEach((item) => {
      const precioUnitario =
        item.product_variants?.price || item.products?.price || 0;
      emailItemsHtml += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <b>${item.products?.name}</b><br/>
            <small style="color: #666;">${item.product_variants ? `${item.product_variants.size || ""} | ${item.product_variants.color || ""}` : ""}</small><br/>
            ${item.notes ? `<small style="color: #d97706;">📝 Nota: "${item.notes}"</small>` : ""}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${precioUnitario.toFixed(2)}</td>
        </tr>`;
    });

    try {
      await resend.emails.send({
        from: "Neon Shop <onboarding@resend.dev>",
        to: customer_email,
        subject: `✨ Recibo de Pedido # ${orderNum} - Neon Shop`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h1 style="color: #ec4899; text-align: center;">⚡ Neon Shop ⚡</h1>
            <p>¡Gracias por tu pedido, ${customer_name}!</p>
            <table style="width: 100%; border-collapse: collapse;">
              ${emailItemsHtml}
            </table>
            <p><b>Total:</b> $${totalUsd.toFixed(2)} USD</p>
          </div>`,
      });
    } catch (err) {
      console.error("Error enviando correo al cliente:", err);
    }

    try {
      let whatsappText = `⚡ *¡NUEVO PEDIDO!* ⚡\n\n🆔 *Orden:* \`${orderNum}\`\n👤 *Cliente:* ${customer_name}\n`;
      typedCartItems.forEach((item, index) => {
        whatsappText += `${index + 1}. *${item.products?.name}* - Cant: ${item.quantity}\n`;
      });
      whatsappText += `\n🏁 *TOTAL:* $${totalUsd.toFixed(2)} USD`;

      await resend.emails.send({
        from: "Alerta Neon Shop <onboarding@resend.dev>",
        to: adminEmail,
        subject: `🚨 NUEVA ORDEN # ${orderNum}`,
        text: whatsappText,
      });
    } catch (emailError) {
      console.error("Error en Resend:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        order_id: orderCreated.id,
        whatsapp_text: "Mensaje generado correctamente",
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Error crítico:", error);
    return NextResponse.json(
      { success: false, message: "Error interno." },
      { status: 500 },
    );
  }
}
