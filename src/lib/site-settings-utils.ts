import type { ComponentType } from "react";
import { FOOTER_SOCIAL_PLATFORMS } from "@/components/shared/footer-icons";
import type { FooterLinkItem } from "@/components/shared/footer-data";
import {
  buildGeneralWhatsAppInterestMessage,
  buildWhatsAppUrl,
  getWhatsappNumberFromSettings,
} from "@/lib/whatsapp-utils";
import {
  getStoreName,
  interpolateStoreName,
} from "@/lib/store-branding";
import { resolvePublicStorageUrl } from "@/lib/storage-url";
import { SITE_SETTING_KEYS } from "@/types/site-settings";

export { getStoreName } from "@/lib/store-branding";

export const DEFAULT_FOUNDER_NAME = "Frank Siras, {{store_name}} Co-fundador";
export const DEFAULT_FOUNDER_IMAGE_URL = "/images/frank-NSY.jpeg";
export const DEFAULT_FOUNDER_IMAGE_ALT =
  "Fundador sosteniendo un letrero de neón personalizado";
export const DEFAULT_FOUNDER_SECTION_HEADING = "Neón personalizado bien hecho";

export interface FounderProfile {
  name: string;
  rawNameTemplate: string;
  imageUrl: string;
  imageAlt: string;
  sectionHeading: string;
}

export function getFounderProfile(
  settings: Record<string, string>,
  storeName: string,
): FounderProfile {
  const rawNameTemplate =
    settings[SITE_SETTING_KEYS.founderName]?.trim() || DEFAULT_FOUNDER_NAME;
  const rawImageUrl =
    settings[SITE_SETTING_KEYS.founderImageUrl]?.trim() ||
    DEFAULT_FOUNDER_IMAGE_URL;
  const imageAlt =
    settings[SITE_SETTING_KEYS.founderImageAlt]?.trim() ||
    DEFAULT_FOUNDER_IMAGE_ALT;
  const sectionHeading =
    settings[SITE_SETTING_KEYS.founderSectionHeading]?.trim() ||
    DEFAULT_FOUNDER_SECTION_HEADING;

  const imageUrl = resolvePublicStorageUrl(rawImageUrl) ?? rawImageUrl;

  return {
    name: interpolateStoreName(rawNameTemplate, storeName),
    rawNameTemplate,
    imageUrl,
    imageAlt,
    sectionHeading,
  };
}

const DEFAULT_SITE_NAME = "Neon Shop";
const DEFAULT_SITE_TAGLINE = "Letreros Personalizados";
const DEFAULT_SITE_DESCRIPTION =
  "Tienda de letreros LED y neón personalizados.";

export interface SiteMetadata {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  ogImageUrl: string | null;
  fullTitle: string;
}

export function getSiteMetadata(settings: Record<string, string>): SiteMetadata {
  const siteName =
    settings[SITE_SETTING_KEYS.siteName]?.trim() || DEFAULT_SITE_NAME;
  const siteTagline =
    settings[SITE_SETTING_KEYS.siteTagline]?.trim() || DEFAULT_SITE_TAGLINE;
  const siteDescription =
    settings[SITE_SETTING_KEYS.siteDescription]?.trim() ||
    DEFAULT_SITE_DESCRIPTION;
  const ogImageRaw = settings[SITE_SETTING_KEYS.ogImageUrl]?.trim();
  const ogImageUrl = ogImageRaw || null;

  return {
    siteName,
    siteTagline,
    siteDescription,
    ogImageUrl,
    fullTitle: `${siteName} | ${siteTagline}`,
  };
}

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

export function isWhatsappFloatingEnabled(
  settings: Record<string, string>,
): boolean {
  const raw =
    settings[SITE_SETTING_KEYS.whatsappFloatingEnabled]?.trim().toLowerCase();
  if (!raw) return true;
  return raw === "true" || raw === "1" || raw === "yes";
}

export function getWhatsappFloatingHref(
  settings: Record<string, string>,
  storeName?: string,
): string | null {
  if (!isWhatsappFloatingEnabled(settings)) return null;

  const digits = getWhatsappNumberFromSettings(settings);
  if (!digits) return null;

  return buildWhatsAppUrl(
    digits,
    buildGeneralWhatsAppInterestMessage(storeName),
  );
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
