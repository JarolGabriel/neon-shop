import { z } from "zod";
import { SITE_SETTING_KEYS } from "@/types/site-settings";

const optionalUrl = z
  .string()
  .max(500)
  .refine(
    (value) => value === "" || z.string().url().safeParse(value).success,
    "Introduce una URL válida o déjala vacía",
  );

export const adminIdentitySettingsSchema = z.object({
  [SITE_SETTING_KEYS.siteName]: z.string().max(80),
  [SITE_SETTING_KEYS.siteTagline]: z.string().max(120),
  [SITE_SETTING_KEYS.siteDescription]: z.string().max(500),
  [SITE_SETTING_KEYS.ogImageUrl]: optionalUrl,
});

export const adminBrandingSettingsSchema = z.object({
  [SITE_SETTING_KEYS.storeName]: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(80, "Máximo 80 caracteres"),
});

export const adminContactSettingsSchema = z.object({
  [SITE_SETTING_KEYS.whatsappNumber]: z
    .string()
    .min(10, "Mínimo 10 dígitos")
    .regex(/^[\d+]+$/, "Solo números, con código de país (ej. 58412…)"),
  [SITE_SETTING_KEYS.supportEmail]: z
    .string()
    .email("Introduce un correo válido"),
  [SITE_SETTING_KEYS.address]: z.string().max(300).optional().or(z.literal("")),
  [SITE_SETTING_KEYS.businessHours]: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("")),
});

function policyMarkdownField() {
  return z
    .string()
    .max(5000)
    .superRefine((value, ctx) => {
      const trimmed = value.trim();
      if (trimmed.length === 0) return;
      if (trimmed.length < 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Mínimo 20 caracteres si escribes contenido, o déjalo vacío para la plantilla del sitio",
        });
      }
    });
}

export const adminPoliciesSettingsSchema = z.object({
  [SITE_SETTING_KEYS.shippingInfo]: policyMarkdownField(),
  [SITE_SETTING_KEYS.returnPolicy]: policyMarkdownField(),
});

export const adminSocialSettingsSchema = z.object({
  [SITE_SETTING_KEYS.instagramUrl]: optionalUrl,
  [SITE_SETTING_KEYS.facebookUrl]: optionalUrl,
  [SITE_SETTING_KEYS.tiktokUrl]: optionalUrl,
  [SITE_SETTING_KEYS.youtubeUrl]: optionalUrl,
});

const founderImageUrl = z
  .string()
  .max(500)
  .refine(
    (value) =>
      value === "" ||
      value.startsWith("/") ||
      z.string().url().safeParse(value).success,
    "Introduce una ruta local (ej. /images/...) o una URL válida",
  );

export const adminFounderSettingsSchema = z.object({
  [SITE_SETTING_KEYS.founderName]: z.string().min(2).max(120),
  [SITE_SETTING_KEYS.founderImageUrl]: founderImageUrl,
  [SITE_SETTING_KEYS.founderImageAlt]: z.string().min(2).max(200),
  [SITE_SETTING_KEYS.founderSectionHeading]: z.string().min(2).max(120),
});

export type AdminIdentitySettingsInput = z.infer<
  typeof adminIdentitySettingsSchema
>;
export type AdminBrandingSettingsInput = z.infer<
  typeof adminBrandingSettingsSchema
>;
export type AdminContactSettingsInput = z.infer<
  typeof adminContactSettingsSchema
>;
export type AdminPoliciesSettingsInput = z.infer<
  typeof adminPoliciesSettingsSchema
>;
export type AdminSocialSettingsInput = z.infer<typeof adminSocialSettingsSchema>;
export type AdminFounderSettingsInput = z.infer<typeof adminFounderSettingsSchema>;
