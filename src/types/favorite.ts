import type { CatalogProduct } from "@/types/product";

export interface FavoritesResponse {
  data: CatalogProduct[];
}

export interface ToggleFavoriteResponse {
  success: boolean;
  message: string;
  favorited: boolean;
}
