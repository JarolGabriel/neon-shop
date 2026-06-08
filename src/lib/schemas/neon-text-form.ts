import { z } from "zod";

export const neonTextFormSchema = z.object({
  text_content: z
    .string()
    .min(1, "Escribe el texto de tu letrero")
    .max(80, "Máximo 80 caracteres"),
  preferred_size: z.enum(["pequeno", "mediano", "grande", "xl", "xxl"], {
    message: "Elige un tamaño",
  }),
  usage_type: z.enum(["interior", "exterior_ip67"], {
    message: "Elige el uso",
  }),
  preferred_color: z.string().optional(),
  preferred_font: z.string().optional(),
  special_effect: z.string().optional(),
  customer_name: z.string().min(1, "Necesitamos tu nombre").max(120),
  customer_email: z.string().email("Introduce un correo válido"),
  customer_phone: z.string().optional(),
  customer_notes: z.string().max(500).optional(),
});

export type NeonTextFormValues = z.infer<typeof neonTextFormSchema>;
