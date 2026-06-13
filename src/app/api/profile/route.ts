import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromToken, supabaseAdmin } from "@/lib/supabase";
import type { ShippingAddress } from "@/types/auth";

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
      return NextResponse.json({ error: authError ?? "No autorizado" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, first_name, last_name, email, phone, avatar_url, shipping_address, role",
      )
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/profile:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

interface UpdateProfileBody {
  first_name?: string;
  last_name?: string;
  phone?: string;
  shipping_address?: Partial<ShippingAddress>;
}

export async function PUT(request: NextRequest) {
  try {
    const { user, error: authError } = await authenticateRequest(request);

    if (authError || !user) {
      return NextResponse.json({ error: authError ?? "No autorizado" }, { status: 401 });
    }

    const body = (await request.json()) as UpdateProfileBody;
    const first_name = body.first_name?.trim();
    const last_name = body.last_name?.trim();

    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: "El nombre y el apellido son obligatorios" },
        { status: 400 },
      );
    }

    const shipping_address: ShippingAddress = {
      street: body.shipping_address?.street?.trim() ?? "",
      city: body.shipping_address?.city?.trim() ?? "",
      state: body.shipping_address?.state?.trim() ?? "",
      zip_code: body.shipping_address?.zip_code?.trim() ?? "",
      country: body.shipping_address?.country?.trim() ?? "",
    };

    const phone = body.phone?.trim() || null;

    const { data: profile, error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        first_name,
        last_name,
        phone,
        shipping_address,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select(
        "id, first_name, last_name, email, phone, avatar_url, shipping_address, role",
      )
      .single();

    if (updateError || !profile) {
      console.error("Error al actualizar perfil:", updateError?.message);
      return NextResponse.json(
        { error: "No se pudo actualizar el perfil" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Perfil actualizado", profile },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en PUT /api/profile:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
