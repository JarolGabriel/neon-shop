import type { Tables } from "@/types/supabase";

type ProductRow = Tables<"products">;
type ProductImageRow = Tables<"product_images">;
type ProductVariantRow = Tables<"product_variants">;
type CategoryRow = Tables<"categories">;

export type CatalogProductImage = Pick<
  ProductImageRow,
  "id" | "image_url" | "alt_text" | "is_primary"
>;

export type CatalogProductVariant = Pick<
  ProductVariantRow,
  "id" | "color" | "color_hex" | "size" | "price" | "stock" | "is_active"
>;

export type CatalogCategory = Pick<CategoryRow, "id" | "name" | "slug">;

/** Producto tal como lo devuelve GET /api/products */
export type CatalogProduct = Pick<
  ProductRow,
  | "id"
  | "name"
  | "slug"
  | "short_description"
  | "description"
  | "price"
  | "compare_at_price"
  | "stock"
  | "color"
  | "size"
  | "sales_count"
  | "is_active"
> & {
  categories: CatalogCategory | null;
  product_images: CatalogProductImage[];
  product_variants: CatalogProductVariant[];
};

export interface UniqueColorSwatch {
  id: string;
  color: string | null;
  colorHex: string | null;
}

export type ProductDetailImage = Pick<
  ProductImageRow,
  "id" | "image_url" | "alt_text" | "is_primary" | "display_order"
>;

export type ProductDetailVariant = Pick<
  ProductVariantRow,
  | "id"
  | "name"
  | "sku"
  | "price"
  | "stock"
  | "size"
  | "color"
  | "color_hex"
  | "is_active"
>;

export interface ProductAvailableColor {
  label: string;
  hex: string;
}

/** Producto tal como lo devuelve GET /api/products/[slug] */
export type ProductDetail = ProductRow & {
  available_sizes?: string[] | null;
  available_colors?: ProductAvailableColor[] | null;
  images: ProductDetailImage[];
  variants: ProductDetailVariant[];
};

export interface ProductDetailResponse {
  message: string;
  data: ProductDetail;
}

export interface CatalogProductsMeta {
  total_items: number;
  page: number;
  limit: number;
  total_pages: number;
  has_more: boolean;
}

export interface CatalogProductsResponse {
  data: CatalogProduct[];
  meta: CatalogProductsMeta;
}
