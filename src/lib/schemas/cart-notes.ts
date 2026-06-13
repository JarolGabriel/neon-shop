import { z } from "zod";

export const cartNotesSchema = z
  .string()
  .max(200, "La nota no puede superar 200 caracteres")
  .optional();

export type CartNotesInput = z.infer<typeof cartNotesSchema>;

export function parseCartNotes(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const result = cartNotesSchema.safeParse(trimmed);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Nota inválida");
  }

  return trimmed;
}
