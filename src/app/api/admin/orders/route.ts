import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/admin/orders -> Listar todas las órdenes del sistema
export async function GET(request: NextRequest) {
  try {
    // Consultamos la tabla orders y traemos también el desglose de sus productos (order_items)
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        delivery_city,
        total_usd,
        status,
        admin_notes,
        created_at,
        order_items (
          id,
          product_name,
          quantity,
          price_usd,
          notes
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error al obtener las órdenes.",
          error: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        count: orders.length,
        data: orders,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Error crítico en GET /api/admin/orders:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
