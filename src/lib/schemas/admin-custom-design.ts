import { z } from "zod";
import type { CustomDesignStatus } from "@/types/custom-design";

export const CUSTOM_DESIGN_STATUSES = [
  "pendiente",
  "cotizacion_enviada",
  "en_produccion",
  "entregado",
  "cancelado",
] as const satisfies readonly CustomDesignStatus[];

export const CUSTOM_DESIGN_STATUS_OPTIONS: Array<{
  value: CustomDesignStatus;
  label: string;
}> = [
  { value: "pendiente", label: "Pendiente" },
  { value: "cotizacion_enviada", label: "Cotización enviada" },
  { value: "en_produccion", label: "En producción" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
];

const optionalUrl = z
  .string()
  .url("URL inválida")
  .optional()
  .or(z.literal(""));

const optionalNotes = z
  .string()
  .max(2000, "Máximo 2000 caracteres")
  .optional()
  .or(z.literal(""));

export const adminCustomDesignManageSchema = z.object({
  status: z.enum(CUSTOM_DESIGN_STATUSES),
  final_price: z
    .number({ error: "Precio inválido" })
    .positive("Debe ser mayor a 0")
    .optional()
    .nullable(),
  mockup_url: optionalUrl,
  admin_notes: optionalNotes,
});

export type AdminCustomDesignManageInput = z.infer<
  typeof adminCustomDesignManageSchema
>;
