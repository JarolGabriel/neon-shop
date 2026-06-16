import type { CustomDesign, UpdateCustomDesignPayload } from "@/types/custom-design";
import type { OrderStatus } from "@/types/order";
import type { Promotion, PromotionImage } from "@/types/promotion";

export interface AdminOrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price_usd: number;
  notes: string | null;
}

export interface AdminOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  total_usd: number;
  status: OrderStatus;
  admin_notes?: string | null;
  created_at: string;
  order_items: AdminOrderItem[];
}

export interface AdminOrdersResponse {
  success: boolean;
  count: number;
  data: AdminOrder[];
}

export interface PatchAdminOrderPayload {
  status?: OrderStatus;
  admin_notes?: string;
}

export interface PatchAdminOrderResponse {
  success: boolean;
  message: string;
  data: AdminOrder;
}

export interface AdminModerationProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export interface AdminPendingReview {
  id: string;
  title: string;
  comment: string;
  image_url: string | null;
  rating: number;
  created_at: string;
  profiles: AdminModerationProfile | AdminModerationProfile[] | null;
}

export interface AdminPendingComment {
  id: string;
  comment: string;
  created_at: string;
  review_id?: string | null;
  profiles: AdminModerationProfile | AdminModerationProfile[] | null;
}

export interface AdminModerationData {
  reviews: AdminPendingReview[];
  comments: AdminPendingComment[];
}

export interface AdminModerationResponse {
  success: boolean;
  data: AdminModerationData;
}

export type AdminModerationView = "pending" | "published";

export interface PatchAdminModerationPayload {
  target_type: "review" | "comment";
  target_id: string;
  action: "approve" | "reject" | "delete";
}

export interface PatchAdminModerationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface AdminSettingsResponse {
  success: boolean;
  data: Record<string, string>;
}

export interface AdminSettingMutationResponse {
  success: boolean;
  message?: string;
}

export interface CreateAdminSettingPayload {
  key: string;
  value: string;
  description?: string;
}

export interface CreateAdminSettingResponse {
  success: boolean;
  data?: unknown;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string;
}

export interface CreateAdminCategoryResponse {
  message: string;
  category: AdminCategory;
}

export interface UpdateAdminCategoryPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateAdminCategoryResponse {
  message: string;
  category: AdminCategory;
}

export interface DeleteAdminCategoryResponse {
  message: string;
}

export interface AdminProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean | null;
}

export interface AdminProductVariant {
  id: string;
  name: string | null;
  sku: string | null;
  price: number;
  stock: number | null;
  is_active: boolean | null;
  color?: string | null;
  color_hex?: string | null;
  size?: string | null;
}

export interface ProductAvailableColor {
  label: string;
  hex: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  size: string | null;
  color: string | null;
  available_sizes?: string[] | null;
  available_colors?: ProductAvailableColor[] | null;
  voltage: string | null;
  material: string | null;
  stock: number | null;
  sku: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  is_best_seller: boolean | null;
  category_id: string | null;
  created_at: string;
  categories: { name: string; slug: string } | null;
  product_images: AdminProductImage[];
  product_variants: AdminProductVariant[];
}

export interface AdminProductsMeta {
  total_items: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface AdminProductsListResponse {
  data: AdminProduct[];
  meta: AdminProductsMeta;
}

export type AdminProductStockStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock";

export type AdminProductHighlightFilter = "featured" | "best_seller";

export interface AdminProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  stock_status?: AdminProductStockStatus | "";
  highlight?: AdminProductHighlightFilter | "";
  id?: string;
}

export interface CreateAdminProductResponse {
  message: string;
  product: AdminProduct;
  images?: AdminProductImage[];
  variants?: AdminProductVariant[];
}

export interface UpdateAdminProductPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  short_description?: string | null;
  price?: number;
  compare_at_price?: number | null;
  size?: string | null;
  color?: string | null;
  voltage?: string | null;
  material?: string | null;
  stock?: number | null;
  sku?: string | null;
  is_active?: boolean;
  is_featured?: boolean;
  is_best_seller?: boolean;
  category_id?: string | null;
  available_sizes?: string[];
  available_colors?: ProductAvailableColor[];
  variants?: Array<{
    id?: string;
    name: string;
    sku: string;
    price?: number;
    stock?: number;
    is_active?: boolean;
    size?: string | null;
    color?: string | null;
    color_hex?: string | null;
  }>;
}

export interface UpdateAdminProductResponse {
  message: string;
  data: AdminProduct;
  variants: AdminProductVariant[] | null;
}

export interface AddAdminProductImageResponse {
  message: string;
  data: AdminProductImage;
}

export interface DeleteAdminProductResponse {
  message: string;
}

export interface DeleteAdminProductImageResponse {
  message: string;
}

export type AdminPromotionImage = PromotionImage;
export type AdminPromotion = Promotion;

export interface AdminPromotionsResponse {
  success: boolean;
  data: AdminPromotion[];
}

export interface CreateAdminPromotionPayload {
  title: string;
  description?: string | null;
  link_url?: string | null;
  link_text?: string | null;
  display_location?: string | null;
  is_active?: boolean | null;
  display_order?: number | null;
  start_date?: string | null;
  end_date?: string | null;
}

export interface PatchAdminPromotionPayload {
  title?: string;
  description?: string | null;
  link_url?: string | null;
  link_text?: string | null;
  display_location?: string | null;
  is_active?: boolean | null;
  display_order?: number | null;
  start_date?: string | null;
  end_date?: string | null;
}

export interface PatchAdminPromotionResponse {
  success: boolean;
  data: AdminPromotion;
}

export interface DeleteAdminPromotionResponse {
  success: boolean;
  message: string;
}

export interface AddAdminPromotionImageResponse {
  success: boolean;
  data: AdminPromotionImage;
}

export type AdminCustomDesign = CustomDesign;

export interface AdminCustomDesignsResponse {
  success: boolean;
  data: AdminCustomDesign[];
}

export type PatchAdminCustomDesignPayload = UpdateCustomDesignPayload;

export interface PatchAdminCustomDesignResponse {
  success: boolean;
  message: string;
  data: AdminCustomDesign;
}

export interface DeleteAdminCustomDesignResponse {
  success: boolean;
  message: string;
}
