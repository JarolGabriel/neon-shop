import { z } from "zod";

export const showroomQuickPostSchema = z.object({
  title: z
    .string()
    .min(1, "Escribe un título para tu publicación")
    .max(120, "El título no puede superar los 120 caracteres"),
  comment: z
    .string()
    .min(1, "Cuéntanos sobre tu letrero")
    .max(2000, "La descripción es demasiado larga"),
  rating: z.number().int().min(1).max(5),
});

export const showroomFullPostSchema = showroomQuickPostSchema.extend({
  tags: z
    .string()
    .max(120, "Máximo 120 caracteres en etiquetas")
    .optional()
    .or(z.literal("")),
});

export type ShowroomQuickPostValues = z.infer<typeof showroomQuickPostSchema>;
export type ShowroomFullPostValues = z.infer<typeof showroomFullPostSchema>;
