import type { ComponentType } from "react";
import { FOOTER_SOCIAL_PLATFORMS } from "@/components/shared/footer-icons";
import type { FooterLinkItem } from "@/components/shared/footer-data";
import {
  buildWhatsAppUrl,
  getWhatsappNumberFromSettings,
} from "@/lib/whatsapp-utils";
import { SITE_SETTING_KEYS } from "@/types/site-settings";

export interface FooterSocialLink {
  label: string;
  href: string | null;
  Icon: ComponentType<{ className?: string }>;
}

export function getSupportEmail(settings: Record<string, string>): string | null {
  const email = settings[SITE_SETTING_KEYS.supportEmail]?.trim();
  return email || null;
}

export function getBusinessAddress(
  settings: Record<string, string>,
): string | null {
  const address = settings[SITE_SETTING_KEYS.address]?.trim();
  return address || null;
}

export function getBusinessHours(
  settings: Record<string, string>,
): string | null {
  const hours = settings[SITE_SETTING_KEYS.businessHours]?.trim();
  return hours || null;
}

export function getWhatsappContact(
  settings: Record<string, string>,
): { display: string; href: string } | null {
  const digits = getWhatsappNumberFromSettings(settings);
  if (!digits) return null;

  const raw = settings[SITE_SETTING_KEYS.whatsappNumber]?.trim();
  const display = raw || digits;
  const href = buildWhatsAppUrl(digits);
  if (!href) return null;

  return { display, href };
}

export function buildFooterSocialLinks(
  settings: Record<string, string>,
): FooterSocialLink[] {
  return FOOTER_SOCIAL_PLATFORMS.map(({ settingKey, label, Icon }) => {
    const href = settings[settingKey]?.trim() || null;
    return { label, href, Icon };
  });
}

export function getContactHref(settings: Record<string, string>): string {
  return getWhatsappContact(settings)?.href ?? "/quienes-somos";
}

export function buildSupportLinks(
  settings: Record<string, string>,
): FooterLinkItem[] {
  return [
    { label: "Política de envío", href: "/politicas/envios" },
    { label: "Política de reembolsos", href: "/politicas/devoluciones" },
    { label: "Contáctanos", href: getContactHref(settings) },
    { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  ];
}
