import { formatUsd } from "@/lib/utils";
import { SITE_SETTING_KEYS } from "@/types/site-settings";

const MAX_WHATSAPP_MESSAGE_CHARS = 1500;
const MAX_WHATSAPP_URL_LENGTH = 1800;
const MIN_WHATSAPP_DIGITS = 10;
const MAX_WHATSAPP_DIGITS = 15;

export function normalizeWhatsappNumber(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

export function isValidWhatsappDigits(digits: string): boolean {
  return digits.length >= MIN_WHATSAPP_DIGITS && digits.length <= MAX_WHATSAPP_DIGITS;
}

export function getPublicSiteOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (siteUrl) return siteUrl;

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://127.0.0.1:3000";
}

export function toAbsolutePublicUrl(
  pathOrUrl: string | null | undefined,
): string | null {
  if (!pathOrUrl?.trim()) return null;

  const trimmed = pathOrUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const origin = getPublicSiteOrigin();
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${origin}${path}`;
}

function readWhatsappDigits(settings: Record<string, string>): string | null {
  const fromSettings = settings[SITE_SETTING_KEYS.whatsappNumber]?.trim();
  if (fromSettings) {
    const digits = normalizeWhatsappNumber(fromSettings);
    if (isValidWhatsappDigits(digits)) return digits;
  }

  const fromEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (fromEnv) {
    const digits = normalizeWhatsappNumber(fromEnv);
    if (isValidWhatsappDigits(digits)) return digits;
  }

  return null;
}

export function isWhatsappConfigured(settings: Record<string, string>): boolean {
  return readWhatsappDigits(settings) !== null;
}

export function getWhatsappNumberFromSettings(
  settings: Record<string, string>,
): string | null {
  return readWhatsappDigits(settings);
}

/** @deprecated Usar getWhatsappNumberFromSettings */
export function resolveWhatsappNumber(
  settings: Record<string, string>,
): string | null {
  return getWhatsappNumberFromSettings(settings);
}

export function truncateWhatsappMessage(
  message: string,
  maxChars = MAX_WHATSAPP_MESSAGE_CHARS,
): string {
  if (message.length <= maxChars) return message;
  return `${message.slice(0, maxChars - 3)}...`;
}

export function buildWhatsAppUrl(number: string, message?: string): string | null {
  const digits = normalizeWhatsappNumber(number);
  if (!isValidWhatsappDigits(digits)) return null;

  const base = `https://api.whatsapp.com/send?phone=${digits}`;
  if (!message?.trim()) return base;

  let safeMessage = truncateWhatsappMessage(message.trim());
  let url = `${base}&text=${encodeURIComponent(safeMessage)}`;

  while (url.length > MAX_WHATSAPP_URL_LENGTH && safeMessage.length > 80) {
    safeMessage = truncateWhatsappMessage(
      safeMessage,
      Math.floor(safeMessage.length * 0.85),
    );
    url = `${base}&text=${encodeURIComponent(safeMessage)}`;
  }

  if (url.length > MAX_WHATSAPP_URL_LENGTH) {
    return base;
  }

  return url;
}

export interface ProductWhatsAppMessageInput {
  productName: string;
  price: number;
  pageUrl: string;
  imageUrl?: string | null;
  sizeLabel?: string | null;
  colorName?: string | null;
  customizationNote?: string;
}

export function buildProductWhatsAppMessage(
  input: ProductWhatsAppMessageInput,
): string {
  const lines = ["Hola! Me interesa este producto:", input.productName];

  const selection = [input.sizeLabel, input.colorName].filter(Boolean).join(" · ");
  if (selection) lines.push(`Tamaño/Color: ${selection}`);

  const note = input.customizationNote?.trim();
  if (note) lines.push(`Nota: ${note}`);

  lines.push(`Precio: ${formatUsd(input.price)} USD`);

  const pageUrl = toAbsolutePublicUrl(input.pageUrl);
  if (pageUrl) lines.push(`Link: ${pageUrl}`);

  let message = lines.join("\n");
  const imageUrl = toAbsolutePublicUrl(input.imageUrl);
  if (imageUrl) {
    const withImage = `${message}\nImagen: ${imageUrl}`;
    if (withImage.length <= MAX_WHATSAPP_MESSAGE_CHARS) {
      message = withImage;
    }
  }

  return truncateWhatsappMessage(message);
}
