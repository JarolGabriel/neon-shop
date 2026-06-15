import { z } from "zod";
import { ALL_PRODUCT_SIZE_VALUES } from "@/lib/product-size-pricing";

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const preferredSizeEnum = z.enum(
  ALL_PRODUCT_SIZE_VALUES as [string, ...string[]],
  { message: "Elige un tamaño válido" },
);

const optionalPreferredSize = z
  .string()
  .refine(
    (value) => value === "" || preferredSizeEnum.safeParse(value).success,
    { message: "Elige un tamaño válido" },
  );

const optionalBudgetRange = z
  .string()
  .refine(
    (value) =>
      value === "" ||
      ["40-100", "150-400", "400-600", "600-800", "800-1000", "1000+"].includes(
        value,
      ),
    { message: "Elige un presupuesto válido" },
  );

const optionalPurpose = z
  .string()
  .refine(
    (value) =>
      value === "" || ["negocio", "evento", "uso_personal"].includes(value),
    { message: "Indica un uso válido" },
  );

const optionalMaterial = z
  .string()
  .refine(
    (value) =>
      value === "" ||
      ["acrilico_transparente", "acrilico_negro", "acrilico_blanco", "otro"].includes(
        value,
      ),
    { message: "Elige un material válido" },
  );

const optionalUsageType = z
  .string()
  .refine(
    (value) => value === "" || ["interior", "exterior_ip67"].includes(value),
    { message: "Indica un tipo de uso válido" },
  );

const optionalDeliveryTime = z
  .string()
  .refine(
    (value) => value === "" || ["standard", "express"].includes(value),
    { message: "Elige un tiempo de entrega válido" },
  );

export const customDesignFormSchema = z.object({
  preferred_size: optionalPreferredSize,
  budget_range: optionalBudgetRange,
  purpose: optionalPurpose,
  delivery_address: z
    .string()
    .max(200, "La dirección no puede superar los 200 caracteres"),
  material: optionalMaterial,
  usage_type: optionalUsageType,
  delivery_time: optionalDeliveryTime,
  customer_notes: z
    .string()
    .min(
      10,
      "Describe tamaño, colores y uso del letrero (mínimo 10 caracteres)",
    )
    .max(2000, "Los detalles no pueden superar los 2000 caracteres"),
  customer_name: z
    .string()
    .min(1, "Indica tu nombre o el de tu empresa")
    .max(120, "El nombre no puede superar los 120 caracteres"),
  customer_email: z
    .string()
    .min(1, "Necesitamos tu correo electrónico")
    .email("Introduce una dirección de correo válida"),
  file: z
    .union([z.undefined(), z.instanceof(File)])
    .superRefine((value, ctx) => {
      if (!(value instanceof File)) {
        ctx.addIssue({
          code: "custom",
          message: "Sube un logotipo, boceto o imagen de referencia",
        });
        return;
      }

      if (value.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: "custom",
          message: "El archivo no puede superar los 10 MB",
        });
      }

      if (
        !ALLOWED_FILE_TYPES.includes(
          value.type as (typeof ALLOWED_FILE_TYPES)[number],
        )
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Solo se aceptan archivos JPG, PNG, WebP o PDF",
        });
      }
    })
    .pipe(z.instanceof(File)),
});

export type CustomDesignFormInput = z.input<typeof customDesignFormSchema>;
export type CustomDesignFormValues = z.output<typeof customDesignFormSchema>;
