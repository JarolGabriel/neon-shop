export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  notes: string | null;
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    short_description: string | null;
    product_images?: Array<{
      id: string;
      image_url: string;
      alt_text: string | null;
      is_primary: boolean | null;
    }>;
  } | null;
  product_variants: {
    id: string;
    size: string | null;
    color: string | null;
    price: number;
    stock: number;
  } | null;
}

export interface CartResponse {
  data: CartItem[];
}

export interface CreateOrderResponse {
  success: boolean;
  order_id: string;
}
