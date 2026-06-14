import { supabaseAdmin } from "@/lib/supabase";

const ACCENT = "#fcee0a";
const SURFACE = "#1f1f24";
const DEV_FROM_ADDRESS = "onboarding@resend.dev";
/** Dominio verificado en Resend (neonshop.shop). */
const PRODUCTION_FROM_ADDRESS = "no-reply@neonshop.shop";
const DEFAULT_FROM = `Neon Shop <${DEV_FROM_ADDRESS}>`;

/** Dominios gratuitos no pueden usarse como remitente en Resend. */
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "protonmail.com",
  "proton.me",
]);

function extractEmailAddress(value: string): string {
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] ?? value).trim().toLowerCase();
}

export function isResendCompatibleFromAddress(email: string): boolean {
  const address = extractEmailAddress(email);
  if (address === DEV_FROM_ADDRESS) return true;
  const domain = address.split("@")[1];
  if (!domain) return false;
  return !FREE_EMAIL_DOMAINS.has(domain);
}

export async function getSupportEmailFromSettings(): Promise<string> {
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "support_email")
    .maybeSingle();

  return data?.value?.trim() || DEV_FROM_ADDRESS;
}

export function formatResendFromAddress(email: string): string {
  const trimmed = email.trim();
  if (trimmed.includes("<") && trimmed.includes(">")) {
    return trimmed;
  }
  const address = trimmed.includes("@") ? trimmed : DEV_FROM_ADDRESS;
  return `Neon Shop <${address}>`;
}

/**
 * Remitente para Resend. El "from" debe ser un dominio verificado en Resend
 * (neonshop.shop en producción, o onboarding@resend.dev en dev sin env).
 * support_email en site_settings se usa como replyTo, no como remitente.
 */
export async function getResendFromAddress(): Promise<string> {
  const envFrom = process.env.RESEND_FROM_EMAIL?.trim();
  if (envFrom) {
    return formatResendFromAddress(envFrom);
  }

  if (process.env.NODE_ENV !== "production") {
    return DEFAULT_FROM;
  }

  return formatResendFromAddress(PRODUCTION_FROM_ADDRESS);
}

export function extractRecoveryTokenHash(
  properties: { hashed_token?: string; action_link?: string } | null | undefined,
): string | null {
  if (!properties) return null;
  if (properties.hashed_token) return properties.hashed_token;
  if (!properties.action_link) return null;

  try {
    const url = new URL(properties.action_link);
    return (
      url.searchParams.get("token_hash") ?? url.searchParams.get("token")
    );
  } catch {
    return null;
  }
}

export function getSiteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

function emailShell(content: string): string {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; background-color: ${SURFACE}; color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #2e2e2e;">
      <div style="padding: 28px 24px 16px; text-align: center; border-bottom: 1px solid #2e2e2e;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: ${ACCENT};">⚡ Neon Shop</p>
      </div>
      <div style="padding: 24px;">
        ${content}
      </div>
    </div>
  `;
}

export function buildPasswordResetEmailHtml(resetLink: string): string {
  return emailShell(`
    <p style="margin: 0 0 16px; line-height: 1.6; color: #e5e7eb;">
      Recibimos una solicitud para restablecer la contraseña de tu cuenta en Neon Shop.
    </p>
    <p style="margin: 0 0 24px; line-height: 1.6; color: #9ca3af;">
      Haz clic en el botón para crear una nueva contraseña. Este enlace expira en 1 hora.
    </p>
    <p style="margin: 0 0 24px; text-align: center;">
      <a href="${resetLink}" style="display: inline-block; background-color: ${ACCENT}; color: #111111; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 9999px;">
        Restablecer contraseña
      </a>
    </p>
    <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #6b7280;">
      Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
    </p>
  `);
}

export function buildWelcomeEmailHtml(firstName: string, catalogUrl: string): string {
  return emailShell(`
    <p style="margin: 0 0 16px; line-height: 1.6; color: #ffffff; font-size: 18px; font-weight: 600;">
      ¡Hola, ${firstName}!
    </p>
    <p style="margin: 0 0 16px; line-height: 1.6; color: #e5e7eb;">
      Gracias por unirte a Neon Shop. Estamos listos para ayudarte a crear letreros de neón
      personalizados que iluminen tu espacio o tu negocio.
    </p>
    <p style="margin: 0 0 24px; line-height: 1.6; color: #9ca3af;">
      Explora nuestro catálogo y descubre diseños listos para pedir, o personaliza el tuyo desde cero.
    </p>
    <p style="margin: 0 0 24px; text-align: center;">
      <a href="${catalogUrl}" style="display: inline-block; background-color: ${ACCENT}; color: #111111; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 9999px;">
        Ver catálogo
      </a>
    </p>
    <p style="margin: 0; line-height: 1.6; color: #9ca3af;">
      — El equipo de Neon Shop
    </p>
  `);
}

export { DEFAULT_FROM };
