import { z } from "zod";

export const profileSchema = z.object({
  first_name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(60, "Máximo 60 caracteres"),
  last_name: z
    .string()
    .min(1, "El apellido es obligatorio")
    .max(60, "Máximo 60 caracteres"),
  phone: z.string().max(20, "Máximo 20 caracteres").optional().or(z.literal("")),
  street: z.string().max(200, "Máximo 200 caracteres").optional().or(z.literal("")),
  city: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  state: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  zip_code: z.string().max(20, "Máximo 20 caracteres").optional().or(z.literal("")),
  country: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
