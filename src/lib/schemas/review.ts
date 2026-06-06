import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z
    .number({ message: "Por favor, indica cuántas estrellas le das a este producto" })
    .int()
    .min(1, "Por favor, indica cuántas estrellas le das a este producto")
    .max(5),
  title: z
    .string()
    .min(1, "Dale un título a tu reseña para que otros la identifiquen")
    .max(100, "El título no puede superar los 100 caracteres"),
  content: z
    .string()
    .min(1, "Por favor, cuéntanos qué te pareció tu producto"),
  user_name: z
    .string()
    .min(1, "Indica cómo quieres que aparezca tu nombre"),
  email: z
    .string()
    .min(1, "Necesitamos tu correo por si debemos contactarte")
    .email("Introduce una dirección de correo válida"),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
