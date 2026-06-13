import { NextRequest, NextResponse } from "next/server";
import { getBulkDiscountRate } from "@/lib/cart-pricing";
import { getSupportEmailFromSettings } from "@/lib/auth-emails";
import { sendOrderEmails } from "@/lib/order-emails";
import { supabaseAdmin } from "@/lib/supabase";
import { CreateOrderPayload } from "@/types/order";
import { Resend } from "resend";
import { Database } from "@/types/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

type CartItemResult = Database["public"]["Tables"]["cart_items"]["Row"] & {
  products: { name: string; price: number } | null;
  product_variants: {
    size: string | null;
    color: string | null;
    price: number;
  } | null;
};

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
      !customer_email ||
      !customer_phone ||
      !delivery_address ||
      !delivery_city
    ) {
      return NextResponse.json(
        { success: false, message: "Faltan datos obligatorios." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email.trim())) {
      return NextResponse.json(
        { success: false, message: "El correo electrónico no es válido." },
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

    let subtotalUsd = 0;
    typedCartItems.forEach((item) => {
      const precioUnitario =
        item.product_variants?.price || item.products?.price || 0;
      subtotalUsd += precioUnitario * (item.quantity || 0);
    });

    const itemCount = typedCartItems.reduce(
      (total, item) => total + (item.quantity || 0),
      0,
    );
    const discountRate = getBulkDiscountRate(itemCount);
    const savingsUsd = subtotalUsd * discountRate;
    const totalUsd = subtotalUsd - savingsUsd;

    const { data: orderCreated, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user_id || null,
        session_id,
        customer_name,
        customer_email: customer_email.trim(),
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
    const supportEmail = await getSupportEmailFromSettings();

    const emailItems = typedCartItems.map((item) => {
      const unitPrice =
        item.product_variants?.price || item.products?.price || 0;
      const variantParts = [
        item.product_variants?.size,
        item.product_variants?.color,
      ].filter(Boolean);

      return {
        product_name: item.products?.name || "Letrero Neón",
        quantity: item.quantity || 0,
        unit_price: unitPrice,
        variant_label: variantParts.join(" · "),
        notes: item.notes,
      };
    });

    await sendOrderEmails(
      resend,
      {
        orderNum,
        customer_name,
        customer_email: customer_email.trim(),
        customer_phone,
        delivery_address,
        delivery_city,
        subtotal_usd: subtotalUsd,
        savings_usd: savingsUsd,
        total_usd: totalUsd,
        items: emailItems,
      },
      supportEmail,
    );

    return NextResponse.json(
      {
        success: true,
        order_id: orderCreated.id,
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
