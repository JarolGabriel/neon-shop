import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  createSupabaseErrorResponse,
  createUnexpectedErrorResponse,
} from "@/lib/supabase-errors";

// 1. GET /api/cart -> OBTENER EL CARRITO

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Se requiere un session_id para obtener el carrito." },
        { status: 400 },
      );
    }

    const { data: cartItems, error } = await supabaseAdmin
      .from("cart_items")
      .select(
        `
        id,
        quantity,
        notes,
        created_at,
        product_id,
        variant_id,
        products (
          id,
          name,
          slug,
          price,
          short_description,
          product_images (
            id,
            image_url,
            alt_text,
            is_primary
          )
        ),
        product_variants (
          id,
          size,
          color,
          price,
          stock
        )
      `,
      )
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false });

    if (error) {
      return createSupabaseErrorResponse(error, {
        context: "GET /api/cart",
        fallbackMessage: "Error al obtener el carrito",
        databaseMessage: "Error al obtener el carrito",
      });
    }

    return NextResponse.json({ data: cartItems }, { status: 200 });
  } catch (error) {
    return createUnexpectedErrorResponse(
      "GET /api/cart",
      error,
      "Error interno del servidor",
    );
  }
}

// 2. POST /api/cart/add -> AGREGAR AL CARRITO

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, variant_id, quantity, notes, session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: "Se requiere un session_id temporal." },
        { status: 400 },
      );
    }

    const itemsQuantity = quantity || 1;
    if (itemsQuantity < 1) {
      return NextResponse.json(
        { error: "La cantidad debe ser mayor o igual a 1" },
        { status: 400 },
      );
    }

    // Validación de stock opcional (Dejado listo para el futuro)
    if (variant_id) {
      const { data: variant } = await supabaseAdmin
        .from("product_variants")
        .select("stock, name")
        .eq("id", variant_id)
        .single();

      if (variant && variant.stock > 0 && itemsQuantity > variant.stock) {
        return NextResponse.json(
          {
            error: `Lo sentimos, solo quedan ${variant.stock} unidades de la variante ${variant.name}`,
          },
          { status: 400 },
        );
      }
    }

    // Buscar si el producto/variante ya está en el carrito de esta sesión
    let existQuery = supabaseAdmin
      .from("cart_items")
      .select("id, quantity")
      .eq("session_id", session_id)
      .eq("product_id", product_id);

    if (variant_id) {
      existQuery = existQuery.eq("variant_id", variant_id);
    } else {
      existQuery = existQuery.is("variant_id", null);
    }

    const { data: existingItem } = await existQuery.maybeSingle();

    if (existingItem) {
      const newQuantity = existingItem.quantity + itemsQuantity;
      const { data: updatedItem, error: updateError } = await supabaseAdmin
        .from("cart_items")
        .update({
          quantity: newQuantity,
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (updateError)
        return NextResponse.json(
          { error: updateError.message },
          { status: 400 },
        );
      return NextResponse.json(
        { message: "Cantidad actualizada", data: updatedItem },
        { status: 200 },
      );
    } else {
      // Insertar nuevo ítem anónimo
      const { data: newItem, error: insertError } = await supabaseAdmin
        .from("cart_items")
        .insert({
          session_id,
          product_id,
          variant_id: variant_id || null,
          quantity: itemsQuantity,
          notes: notes || null,
        })
        .select()
        .single();

      if (insertError)
        return NextResponse.json(
          { error: insertError.message },
          { status: 400 },
        );
      return NextResponse.json(
        { message: "Producto agregado al carrito", data: newItem },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("Error crítico en POST /api/cart/add:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
