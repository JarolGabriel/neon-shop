import { SITE_SETTING_KEYS } from "@/types/site-settings";

export const DEFAULT_STORE_NAME = "Neon Shop";

const STORE_NAME_PLACEHOLDER = "{{store_name}}";

export function getStoreName(settings: Record<string, string>): string {
  const name = settings[SITE_SETTING_KEYS.storeName]?.trim();
  return name || DEFAULT_STORE_NAME;
}

export function formatPageTitle(
  pageTitle: string,
  storeName: string = DEFAULT_STORE_NAME,
): string {
  const trimmed = pageTitle.trim();
  if (!trimmed) return storeName;
  return `${trimmed} | ${storeName}`;
}

export function formatStoreFromAddress(
  storeName: string,
  email: string,
): string {
  const trimmedEmail = email.trim();
  const safeName = storeName.trim() || DEFAULT_STORE_NAME;
  if (trimmedEmail.includes("<") && trimmedEmail.includes(">")) {
    return trimmedEmail;
  }
  const address = trimmedEmail.includes("@") ? trimmedEmail : "onboarding@resend.dev";
  return `${safeName} <${address}>`;
}

const LEGACY_BRAND_VARIANTS = [/\bNeon-Shop\b/gi, /\bNeon-shop\b/g] as const;

export function interpolateStoreName(text: string, storeName: string): string {
  const safeName = storeName.trim() || DEFAULT_STORE_NAME;
  let result = text
    .split(STORE_NAME_PLACEHOLDER)
    .join(safeName)
    .split(DEFAULT_STORE_NAME)
    .join(safeName);

  for (const pattern of LEGACY_BRAND_VARIANTS) {
    result = result.replace(pattern, safeName);
  }

  return result;
}
