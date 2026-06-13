import { z } from "zod";

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugField = z
  .string()
  .min(2, "Mínimo 2 caracteres")
  .regex(SLUG_REGEX, "Solo minúsculas, números y guiones (ej. letreros-neon)");

const nameField = z.string().min(2, "Mínimo 2 caracteres").max(120);

const descriptionField = z
  .string()
  .max(500, "Máximo 500 caracteres")
  .optional()
  .or(z.literal(""));

const displayOrderField = z
  .number({ error: "Debe ser un número" })
  .int("Debe ser un número entero")
  .min(0, "Mínimo 0");

const isActiveField = z.boolean();

const imageField = z.custom<File>(
  (value) => value instanceof File,
  "La imagen es obligatoria",
);

export const adminCategoryCreateSchema = z.object({
  name: nameField,
  slug: slugField,
  description: descriptionField,
  display_order: displayOrderField,
  is_active: isActiveField,
  image: imageField,
});

export const adminCategoryUpdateSchema = z.object({
  name: nameField,
  slug: slugField,
  description: descriptionField,
  display_order: displayOrderField,
  is_active: isActiveField,
});

export type AdminCategoryCreateInput = z.infer<typeof adminCategoryCreateSchema>;
export type AdminCategoryUpdateInput = z.infer<typeof adminCategoryUpdateSchema>;
