export type OrderStatus =
  | "pendiente_pago"
  | "pago_confirmado"
  | "en_taller"
  | "enviado"
  | "entregado"
  | "cancelado";

export interface Order {
  id: string;
  user_id: string | null;
  session_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  total_usd: number;
  status: OrderStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  quantity: number;
  price_usd: number;
  notes: string | null;
  created_at: string;
}

export interface CreateOrderPayload {
  session_id: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
}
