import { z } from "zod";
import { SLUG_REGEX } from "@/lib/schemas/admin-category";

const optionalText = z
  .string()
  .max(500, "Máximo 500 caracteres")
  .optional()
  .or(z.literal(""));

const specField = z
  .string()
  .max(80, "Máximo 80 caracteres")
  .optional()
  .or(z.literal(""));

const slugField = z
  .string()
  .min(2, "Mínimo 2 caracteres")
  .regex(SLUG_REGEX, "Solo minúsculas, números y guiones");

const nameField = z.string().min(2, "Mínimo 2 caracteres").max(120);

const categoryField = z.string().uuid("Selecciona una categoría");

const priceField = z
  .number({ error: "Precio inválido" })
  .positive("El precio debe ser mayor a 0");

const stockField = z
  .number({ error: "Stock inválido" })
  .int("Debe ser un número entero")
  .min(0, "Mínimo 0");

const compareAtPriceField = z
  .number({ error: "Precio inválido" })
  .positive("Debe ser mayor a 0")
  .optional()
  .nullable();

const imageFile = z.custom<File>(
  (value) => value instanceof File,
  "Archivo inválido",
);

const colorHexField = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Hex inválido")
  .optional()
  .or(z.literal(""));

export const productAvailableColorSchema = z.object({
  label: z.string().min(1, "Nombre de color requerido"),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Hex inválido"),
});

export const adminProductVariantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().max(80).optional().or(z.literal("")),
  sku: z.string().max(60).optional().or(z.literal("")),
  size: specField,
  color: specField,
  color_hex: colorHexField,
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

const sharedProductFields = {
  name: nameField,
  slug: slugField,
  description: optionalText,
  short_description: optionalText,
  price: priceField,
  compare_at_price: compareAtPriceField,
  category_id: categoryField,
  stock: stockField,
  voltage: specField,
  material: specField,
  sku: specField,
  is_active: z.boolean(),
  is_featured: z.boolean(),
  available_sizes: z.array(z.string().min(1)),
  available_colors: z.array(productAvailableColorSchema),
  variants: z.array(adminProductVariantSchema),
};

export const adminProductCreateSchema = z.object({
  ...sharedProductFields,
  images: z.array(imageFile).min(1, "Sube al menos una imagen"),
});

export const adminProductUpdateSchema = z.object({
  ...sharedProductFields,
  is_best_seller: z.boolean(),
});

export type AdminProductVariantInput = z.infer<typeof adminProductVariantSchema>;
export type ProductAvailableColorInput = z.infer<
  typeof productAvailableColorSchema
>;
export type AdminProductCreateInput = z.infer<typeof adminProductCreateSchema>;
export type AdminProductUpdateInput = z.infer<typeof adminProductUpdateSchema>;

export const STOCK_STATUS_OPTIONS = [
  { value: "all", label: "Todo el stock" },
  { value: "in_stock", label: "En stock (>3)" },
  { value: "low_stock", label: "Stock bajo (1–3)" },
  { value: "out_of_stock", label: "Agotado" },
] as const;
