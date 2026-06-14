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
  { message: "Elige un tamaño aproximado" },
);

export const customDesignFormSchema = z.object({
  preferred_size: z
    .string()
    .min(1, "Elige un tamaño aproximado")
    .pipe(preferredSizeEnum),
  budget_range: z
    .string()
    .min(1, "Elige un presupuesto estimado")
    .pipe(
      z.enum(
        ["40-100", "150-400", "400-600", "600-800", "800-1000", "1000+"],
        { message: "Elige un presupuesto estimado" },
      ),
    ),
  purpose: z
    .string()
    .min(1, "Indica para qué usarás el letrero")
    .pipe(
      z.enum(["negocio", "evento", "uso_personal"], {
        message: "Indica para qué usarás el letrero",
      }),
    ),
  delivery_address: z
    .string()
    .min(1, "Indica la dirección o ciudad de entrega")
    .max(200, "La dirección no puede superar los 200 caracteres"),
  material: z
    .string()
    .min(1, "Elige un material")
    .pipe(
      z.enum(
        ["acrilico_transparente", "acrilico_negro", "acrilico_blanco", "otro"],
        { message: "Elige un material" },
      ),
    ),
  usage_type: z
    .string()
    .min(1, "Indica si es para interior o exterior")
    .pipe(
      z.enum(["interior", "exterior_ip67"], {
        message: "Indica si es para interior o exterior",
      }),
    ),
  delivery_time: z
    .string()
    .min(1, "Elige un tiempo de entrega")
    .pipe(z.enum(["standard", "express"], { message: "Elige un tiempo de entrega" })),
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
