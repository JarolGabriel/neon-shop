import { z } from "zod";
import type { OrderStatus } from "@/types/order";

const ORDER_STATUSES = [
  "pendiente_pago",
  "pago_confirmado",
  "en_taller",
  "enviado",
  "entregado",
  "cancelado",
] as const satisfies readonly OrderStatus[];

export const adminOrderUpdateSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  admin_notes: z.string().max(2000).optional(),
});

export type AdminOrderUpdateInput = z.infer<typeof adminOrderUpdateSchema>;

export { ORDER_STATUSES };
