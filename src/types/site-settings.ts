export const SITE_SETTING_KEYS = {
  whatsappNumber: "whatsapp_number",
  supportEmail: "support_email",
  address: "address",
  businessHours: "business_hours",
  shippingInfo: "shipping_info",
  returnPolicy: "return_policy",
  instagramUrl: "instagram_url",
  facebookUrl: "facebook_url",
  tiktokUrl: "tiktok_url",
  youtubeUrl: "youtube_url",
} as const;

export type SiteSettingKey =
  (typeof SITE_SETTING_KEYS)[keyof typeof SITE_SETTING_KEYS];

export interface PolicyPageConfig {
  slug: string;
  settingKey: SiteSettingKey;
  title: string;
  description: string;
}

export const POLICY_PAGES: PolicyPageConfig[] = [
  {
    slug: "envios",
    settingKey: SITE_SETTING_KEYS.shippingInfo,
    title: "Política de envío",
    description:
      "Información sobre envíos, tiempos de entrega y cobertura en Venezuela.",
  },
  {
    slug: "devoluciones",
    settingKey: SITE_SETTING_KEYS.returnPolicy,
    title: "Política de reembolsos",
    description:
      "Condiciones para devoluciones, cambios y reembolsos en Neon Shop.",
  },
];

export function getPolicyBySlug(slug: string): PolicyPageConfig | undefined {
  return POLICY_PAGES.find((policy) => policy.slug === slug);
}
