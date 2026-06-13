import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      token_hash?: string;
      password?: string;
    };

    const tokenHash = body.token_hash?.trim();
    const password = body.password;

    if (!tokenHash) {
      return NextResponse.json(
        { error: "Enlace inválido o expirado" },
        { status: 400 },
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 },
      );
    }

    if (password.length > 72) {
      return NextResponse.json(
        { error: "La contraseña no puede superar 72 caracteres" },
        { status: 400 },
      );
    }

    const { data, error: verifyError } = await supabaseAdmin.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });

    if (verifyError || !data.user) {
      return NextResponse.json(
        { error: "Enlace inválido o expirado. Solicita uno nuevo." },
        { status: 400 },
      );
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      data.user.id,
      { password },
    );

    if (updateError) {
      return NextResponse.json(
        { error: "No se pudo actualizar la contraseña. Intenta de nuevo." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Contraseña actualizada correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en POST /api/auth/reset-password:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 },
    );
  }
}
