"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getProducts } from "@/lib/api";
import type { CatalogSortOption } from "@/types/category";
import type { CatalogProduct, CatalogProductsMeta } from "@/types/product";

export const CATALOG_PAGE_SIZE = 12;

const DEFAULT_SORT: CatalogSortOption = "best_seller";
export const DEFAULT_MAX_PRICE = 999;

export type CatalogHighlightFilter = "all" | "featured" | "best_seller";

export interface CatalogFilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  outOfStock: boolean;
  sort: CatalogSortOption;
  highlight: CatalogHighlightFilter;
  page: number;
}

function parseHighlight(value: string | null): CatalogHighlightFilter {
  if (value === "featured" || value === "best_seller") return value;
  return "all";
}

function parseSort(value: string | null): CatalogSortOption {
  if (
    value === "newest" ||
    value === "price_asc" ||
    value === "price_desc" ||
    value === "best_seller"
  ) {
    return value;
  }
  return DEFAULT_SORT;
}

function parseFilters(searchParams: URLSearchParams): CatalogFilterState {
  const minPrice = Number(searchParams.get("min_price") ?? "0");
  const maxPrice = Number(searchParams.get("max_price") ?? String(DEFAULT_MAX_PRICE));

  return {
    search: searchParams.get("search") ?? "",
    category: searchParams.get("category") ?? "",
    minPrice: Number.isFinite(minPrice) ? minPrice : 0,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : DEFAULT_MAX_PRICE,
    inStock: searchParams.get("in_stock") === "true",
    outOfStock: searchParams.get("out_of_stock") === "true",
    sort: parseSort(searchParams.get("sort")),
    highlight: parseHighlight(
      searchParams.get("featured") === "true"
        ? "featured"
        : searchParams.get("highlighted") === "true"
          ? "best_seller"
          : null,
    ),
    page: Math.max(1, Number(searchParams.get("page") ?? "1") || 1),
  };
}

function buildQueryString(filters: CatalogFilterState): string {
  const params = new URLSearchParams();

  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.category) params.set("category", filters.category);
  if (filters.minPrice > 0) params.set("min_price", String(filters.minPrice));
  if (filters.maxPrice < DEFAULT_MAX_PRICE)
    params.set("max_price", String(filters.maxPrice));
  if (filters.inStock) params.set("in_stock", "true");
  if (filters.outOfStock) params.set("out_of_stock", "true");
  if (filters.highlight === "featured") params.set("featured", "true");
  if (filters.highlight === "best_seller") params.set("highlighted", "true");
  if (filters.sort !== DEFAULT_SORT) params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));

  return params.toString();
}

export function useCatalogProducts() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFilters(searchParams),
    [searchParams],
  );

  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [meta, setMeta] = useState<CatalogProductsMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const updateFilters = useCallback(
    (patch: Partial<CatalogFilterState>, resetPage = true) => {
      const current = parseFilters(searchParams);
      const next: CatalogFilterState = {
        ...current,
        ...patch,
        page: resetPage ? 1 : (patch.page ?? current.page),
      };
      const qs = buildQueryString(next);
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    getProducts({
      page: filters.page,
      limit: CATALOG_PAGE_SIZE,
      sort: filters.sort,
      search: filters.search.trim() || undefined,
      category: filters.category || undefined,
      min_price: filters.minPrice > 0 ? filters.minPrice : undefined,
      max_price:
        filters.maxPrice < DEFAULT_MAX_PRICE ? filters.maxPrice : undefined,
      in_stock: filters.inStock || undefined,
      out_of_stock: filters.outOfStock || undefined,
      featured: filters.highlight === "featured" || undefined,
      highlighted: filters.highlight === "best_seller" || undefined,
    })
      .then((response) => {
        if (cancelled) return;
        setProducts(response.data);
        setMeta(response.meta);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Error al cargar productos",
        );
        setProducts([]);
        setMeta(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, retryKey]);

  const refetch = useCallback(() => {
    setRetryKey((key) => key + 1);
  }, []);

  const clearAllFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    filters,
    products,
    meta,
    isLoading,
    error,
    updateFilters,
    refetch,
    clearAllFilters,
  };
}
