import { NextRequest, NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { supabaseAdmin, supabaseAnonServer } from "@/lib/supabase";
import type { UserRole } from "@/types/auth";

function resolveUserRole(email: string): UserRole {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.toLowerCase()) ? "admin" : "customer";
}

async function ensureUserProfile(user: User) {
  const { data: existingProfile, error: lookupError } = await supabaseAdmin
    .from("profiles")
    .select("role, first_name, last_name, avatar_url, phone")
    .eq("id", user.id)
    .maybeSingle();

  if (lookupError) throw lookupError;
  if (existingProfile) return existingProfile;

  const email = user.email?.trim().toLowerCase() ?? "";
  const role = resolveUserRole(email);

  const { data: createdProfile, error: createError } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: user.id,
      email,
      first_name:
        typeof user.user_metadata?.first_name === "string"
          ? user.user_metadata.first_name
          : "",
      last_name:
        typeof user.user_metadata?.last_name === "string"
          ? user.user_metadata.last_name
          : "",
      role,
    })
    .select("role, first_name, last_name, avatar_url, phone")
    .single();

  if (createError || !createdProfile) throw createError;

  return createdProfile;
}

/**
 * POST /api/auth/sign-in
 * Autentica a un usuario y retorna su perfil con su rol correspondiente
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "El correo y la contraseña son obligatorios" },
        { status: 400 },
      );
    }

    const { data: authData, error: authError } =
      await supabaseAnonServer.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Credenciales inválidas o usuario no encontrado" },
        { status: 401 },
      );
    }

    if (!authData.session?.access_token) {
      return NextResponse.json(
        { error: "No se pudo crear la sesión. Intenta de nuevo." },
        { status: 500 },
      );
    }

    let profile;

    try {
      profile = await ensureUserProfile(authData.user);
    } catch (profileError) {
      console.error("Error al resolver perfil de usuario:", profileError);

      return NextResponse.json(
        { error: "No se pudo cargar el perfil del usuario." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Inicio de sesión exitoso",
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at,
        },
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: profile.role,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url,
          phone: profile.phone,
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
