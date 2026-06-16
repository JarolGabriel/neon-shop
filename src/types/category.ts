export interface CategoryFiltersResponse {
  category: { name: string; slug: string };
  available_filters: {
    colors: string[];
    sizes: string[];
    price_range: { min: number; max: number };
  };
}

export type CatalogSortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "best_seller";

export interface CatalogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  color_hex?: string;
  size?: string;
  in_stock?: boolean;
  out_of_stock?: boolean;
  sort?: CatalogSortOption;
  /** Admin flag: productos marcados como destacados */
  featured?: boolean;
  /** Admin flag: productos marcados como más vendidos */
  highlighted?: boolean;
}
