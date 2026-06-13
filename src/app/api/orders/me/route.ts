import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromToken, supabaseAdmin } from "@/lib/supabase";

async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return { user: null, error: "No autorizado" };
  }

  const user = await getAuthUserFromToken(token);

  if (!user) {
    return { user: null, error: "Sesión inválida o expirada" };
  }

  return { user, error: null };
}

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await authenticateRequest(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: authError ?? "No autorizado" },
        { status: 401 },
      );
    }

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
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        count: orders?.length ?? 0,
        data: orders ?? [],
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en GET /api/orders/me:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
