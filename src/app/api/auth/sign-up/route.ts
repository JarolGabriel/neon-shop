import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import {
  buildWelcomeEmailHtml,
  getResendFromAddress,
  getSiteBaseUrl,
} from "@/lib/auth-emails";
import { getStoreNameFromDb } from "@/lib/site-settings-server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name } = body;

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

    // 1. Crear el usuario en el sistema de autenticación de Supabase
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          error: "Error al registrar el usuario en autenticación",
          details: authError?.message,
        },
        { status: 400 },
      );
    }

    // 2.Leer lista de admins desde las variables de entorno (.env)
    const envEmails = process.env.ADMIN_EMAILS || "";

    const adminEmailsList = envEmails
      .split(",")
      .map((e) => e.trim().toLowerCase());

    // Validamos si el email ingresado coincide con la lista del .env
    const asignoRol = adminEmailsList.includes(email.toLowerCase())
      ? "admin"
      : "customer";

    // 3. Insertar el perfil en la tabla pública
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authData.user.id,
        email: email,
        first_name: first_name || "",
        last_name: last_name || "",
        role: asignoRol,
      });

    // Control de daños transaccional
    if (profileError) {
      console.error(
        "Error al crear perfil, revirtiendo Auth:",
        profileError.message,
      );
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        {
          error: "Error al inicializar el perfil de usuario.",
          details: profileError.message,
        },
        { status: 500 },
      );
    }

    try {
      const catalogUrl = `${getSiteBaseUrl()}/productos`;
      const [fromAddress, storeName] = await Promise.all([
        getResendFromAddress(),
        getStoreNameFromDb(),
      ]);

      await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: `🎉 ¡Bienvenido a ${storeName}, ${first_name || "cliente"}!`,
        html: buildWelcomeEmailHtml(first_name || "cliente", catalogUrl, storeName),
      });
    } catch (emailError) {
      console.error("Error enviando correo de bienvenida:", emailError);
    }

    return NextResponse.json(
      {
        message: "Usuario y perfil creados exitosamente",
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: asignoRol,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error crítico en POST /api/auth/sign-up:", error.message);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: "Error desconocido." }, { status: 500 });
  }
}
