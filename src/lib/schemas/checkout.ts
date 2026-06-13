import { z } from "zod";

export const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Ingresa tu nombre completo"),
  customer_email: z.string().email("Email inválido"),
  customer_phone: z.string().min(7, "Teléfono inválido"),
  delivery_address: z.string().min(5, "Ingresa tu dirección"),
  delivery_city: z.string().min(2, "Ingresa tu ciudad"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
