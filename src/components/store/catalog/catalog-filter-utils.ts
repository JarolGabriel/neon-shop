import type { CatalogSortOption } from "@/types/category";
import type { CatalogFilterState } from "@/hooks/useCatalogProducts";
import { DEFAULT_MAX_PRICE } from "@/hooks/useCatalogProducts";

export const DEFAULT_SORT: CatalogSortOption = "best_seller";
export const CATEGORIES_VISIBLE_LIMIT = 8;
export const PRICE_STEP = 10;

export const DEFAULT_FILTER_STATE: CatalogFilterState = {
  search: "",
  category: "",
  minPrice: 0,
  maxPrice: DEFAULT_MAX_PRICE,
  inStock: false,
  outOfStock: false,
  sort: DEFAULT_SORT,
  highlight: "all",
  page: 1,
};

export function hasActiveFilters(filters: CatalogFilterState): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.category !== "" ||
    filters.minPrice > 0 ||
    filters.maxPrice < DEFAULT_MAX_PRICE ||
    filters.inStock ||
    filters.outOfStock ||
    filters.highlight !== "all" ||
    filters.sort !== DEFAULT_SORT
  );
}

export function clampPrice(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(max, Math.max(min, value));
}
