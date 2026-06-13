import { SITE_SETTING_KEYS } from "@/types/site-settings";

/** Solo desarrollo cuando `whatsapp_number` no está en site_settings. */
export const WHATSAPP_FALLBACK = "584121234567";

export function normalizeWhatsappNumber(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

export function buildWhatsAppUrl(number: string, message?: string): string {
  const digits = normalizeWhatsappNumber(number) || WHATSAPP_FALLBACK;
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function resolveWhatsappNumber(settings: Record<string, string>): string {
  const fromSettings = settings[SITE_SETTING_KEYS.whatsappNumber]?.trim();
  if (fromSettings) {
    const digits = normalizeWhatsappNumber(fromSettings);
    if (digits) return digits;
  }

  const fromEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (fromEnv) {
    const digits = normalizeWhatsappNumber(fromEnv);
    if (digits) return digits;
  }

  return WHATSAPP_FALLBACK;
}
