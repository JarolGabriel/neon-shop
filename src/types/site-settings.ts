export const SITE_SETTING_KEYS = {
  storeName: "store_name",
  siteName: "site_name",
  siteTagline: "site_tagline",
  siteDescription: "site_description",
  ogImageUrl: "og_image_url",
  whatsappNumber: "whatsapp_number",
  whatsappFloatingEnabled: "whatsapp_floating_enabled",
  supportEmail: "support_email",
  address: "address",
  businessHours: "business_hours",
  shippingInfo: "shipping_info",
  returnPolicy: "return_policy",
  instagramUrl: "instagram_url",
  facebookUrl: "facebook_url",
  tiktokUrl: "tiktok_url",
  youtubeUrl: "youtube_url",
  founderName: "founder_name",
  founderImageUrl: "founder_image_url",
  founderImageAlt: "founder_image_alt",
  founderSectionHeading: "founder_section_heading",
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
      "Condiciones para devoluciones, cambios y reembolsos en {{store_name}}.",
  },
];

export function getPolicyBySlug(slug: string): PolicyPageConfig | undefined {
  return POLICY_PAGES.find((policy) => policy.slug === slug);
}
