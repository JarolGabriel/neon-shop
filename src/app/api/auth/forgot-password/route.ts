import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  buildPasswordResetEmailHtml,
  extractRecoveryTokenHash,
  getResendFromAddress,
  getSiteBaseUrl,
  getSupportEmailFromSettings,
} from "@/lib/auth-emails";
import { supabaseAdmin } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUCCESS_MESSAGE =
  "Si el correo existe, recibirás instrucciones en breve";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Introduce un correo electrónico válido" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Introduce un correo electrónico válido" },
        { status: 400 },
      );
    }

    const siteUrl = getSiteBaseUrl();
    const resetPath = "/auth/restablecer-contrasena";

    // Supabase Auth → URL Configuration debe permitir: ${siteUrl}/auth/restablecer-contrasena
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${siteUrl}${resetPath}`,
      },
    });

    const tokenHash = extractRecoveryTokenHash(data?.properties);

    if (error || !tokenHash) {
      if (process.env.NODE_ENV !== "production") {
        console.error("forgot-password generateLink:", {
          email,
          error: error?.message ?? null,
          hasProperties: Boolean(data?.properties),
          hasActionLink: Boolean(data?.properties?.action_link),
        });
      }
      return NextResponse.json({ message: SUCCESS_MESSAGE }, { status: 200 });
    }

    const resetUrl = `${siteUrl}${resetPath}?token_hash=${encodeURIComponent(tokenHash)}&type=recovery`;

    const [fromAddress, supportEmail] = await Promise.all([
      getResendFromAddress(),
      getSupportEmailFromSettings(),
    ]);

    const { error: sendError } = await resend.emails.send({
      from: fromAddress,
      to: email,
      replyTo: supportEmail.includes("@") ? supportEmail : undefined,
      subject: "🔐 Restablece tu contraseña — Neon Shop",
      html: buildPasswordResetEmailHtml(resetUrl),
    });

    if (sendError) {
      console.error("Error enviando correo de recuperación:", {
        to: email,
        from: fromAddress,
        message: sendError.message,
        name: sendError.name,
      });
    } else if (process.env.NODE_ENV !== "production") {
      console.info("Correo de recuperación enviado:", { to: email, from: fromAddress });
    }

    return NextResponse.json({ message: SUCCESS_MESSAGE }, { status: 200 });
  } catch (error) {
    console.error("Error en POST /api/auth/forgot-password:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 },
    );
  }
}
