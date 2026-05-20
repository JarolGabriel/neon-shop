import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicializamos el cliente de Supabase con la llave maestra para administración de usuarios
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * POST /api/auth/sign-up
 * Registra un nuevo usuario en el sistema
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validación básica de campos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { error: "El correo y la contraseña son obligatorios" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 },
      );
    }

    // Registrar el usuario en el esquema de autenticación de Supabase
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar para evitar verificar por correo real en desarrollo
    });

    if (error) {
      return NextResponse.json(
        { error: "Error al registrar el usuario", details: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error en POST /api/auth/sign-up:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
