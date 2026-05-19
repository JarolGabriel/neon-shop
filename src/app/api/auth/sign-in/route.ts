import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * POST /api/auth/sign-in
 * Autentica a un usuario y retorna su perfil con su rol correspondiente
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "El correo y la contraseña son obligatorios" },
        { status: 400 },
      );
    }

    // Instancia 1: Cliente exclusivo para interactuar con el sistema Auth
    const supabaseAuth = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Intercambiar credenciales por una sesión válida en Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Credenciales inválidas o usuario no encontrado" },
        { status: 401 },
      );
    }

    // Instancia 2: Cliente limpio forzado al esquema 'public' para leer la tabla
    const supabaseDatabase = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: "public" },
    });

    // Buscar el rol del usuario en nuestra tabla de perfiles públicos
    const { data: profile, error: profileError } = await supabaseDatabase
      .from("profiles")
      .select("role, first_name, last_name")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      console.error("Error detallado de base de datos:", profileError);

      return NextResponse.json(
        { error: "Perfil de usuario no encontrado en la base de datos" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Inicio de sesión exitoso",
        session: {
          access_token: authData.session?.access_token,
          refresh_token: authData.session?.refresh_token,
          expires_at: authData.session?.expires_at,
        },
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: profile.role,
          first_name: profile.first_name,
          last_name: profile.last_name,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en POST /api/auth/sign-in:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
