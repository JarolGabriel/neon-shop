import { z } from "zod";
import {
  COMMUNITY_MOBILE_LOCATION,
  HOME_HERO_LOCATION,
  SHOWROOM_MOBILE_LOCATION,
} from "@/types/promotion";

export const PROMOTION_DISPLAY_LOCATIONS = [
  { value: HOME_HERO_LOCATION, label: "Carrusel del inicio (Home)" },
  { value: COMMUNITY_MOBILE_LOCATION, label: "Comunidad — banner móvil" },
  { value: SHOWROOM_MOBILE_LOCATION, label: "Showroom móvil (legacy)" },
] as const;

const displayLocationField = z.enum([
  HOME_HERO_LOCATION,
  COMMUNITY_MOBILE_LOCATION,
  SHOWROOM_MOBILE_LOCATION,
]);

const optionalUrl = z
  .string()
  .url("URL inválida")
  .optional()
  .or(z.literal(""));

const optionalText = z
  .string()
  .max(500, "Máximo 500 caracteres")
  .optional()
  .or(z.literal(""));

const shortText = z
  .string()
  .max(80, "Máximo 80 caracteres")
  .optional()
  .or(z.literal(""));

const dateField = z
  .string()
  .optional()
  .or(z.literal(""));

export const adminPromotionFormSchema = z
  .object({
    title: z.string().min(2, "Mínimo 2 caracteres").max(120),
    description: optionalText,
    link_url: optionalUrl,
    link_text: shortText,
    display_location: displayLocationField,
    is_active: z.boolean(),
    display_order: z
      .number({ error: "Debe ser un número" })
      .int("Debe ser un número entero")
      .min(0, "Mínimo 0"),
    start_date: dateField,
    end_date: dateField,
  })
  .refine(
    (values) => {
      if (!values.start_date || !values.end_date) return true;
      return values.start_date <= values.end_date;
    },
    {
      message: "La fecha de inicio debe ser anterior o igual a la de fin",
      path: ["end_date"],
    },
  );

export type AdminPromotionFormInput = z.infer<typeof adminPromotionFormSchema>;
