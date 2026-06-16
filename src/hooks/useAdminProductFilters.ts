"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AdminProductStockStatus, AdminProductsQuery, AdminProductHighlightFilter } from "@/types/admin";

function parseStockStatus(value: string | null): AdminProductStockStatus | "all" {
  if (
    value === "in_stock" ||
    value === "low_stock" ||
    value === "out_of_stock"
  ) {
    return value;
  }
  return "all";
}

function parseHighlightFilter(
  value: string | null,
): AdminProductHighlightFilter | "all" {
  if (value === "featured" || value === "best_seller") return value;
  return "all";
}

export function useAdminProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") ?? "",
  );

  const filters: AdminProductsQuery = useMemo(
    () => ({
      page: Math.max(1, Number(searchParams.get("page") || "1")),
      search: searchParams.get("search") ?? "",
      category_id:
        searchParams.get("category_id") &&
        searchParams.get("category_id") !== "all"
          ? (searchParams.get("category_id") as string)
          : undefined,
      stock_status: (() => {
        const status = parseStockStatus(searchParams.get("stock_status"));
        return status === "all" ? undefined : status;
      })(),
      highlight: (() => {
        const highlight = parseHighlightFilter(searchParams.get("highlight"));
        return highlight === "all" ? undefined : highlight;
      })(),
    }),
    [searchParams],
  );

  const replaceQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const current = searchParams.get("search") ?? "";
      if (searchInput === current) return;
      replaceQuery({ search: searchInput.trim() || null, page: "1" });
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [searchInput, replaceQuery, searchParams]);

  return {
    filters,
    searchInput,
    setSearchInput,
    categoryFilter: searchParams.get("category_id") ?? "all",
    stockFilter: parseStockStatus(searchParams.get("stock_status")),
    highlightFilter: parseHighlightFilter(searchParams.get("highlight")),
    replaceQuery,
    clearFilters: () => {
      setSearchInput("");
      replaceQuery({
        search: null,
        category_id: null,
        stock_status: null,
        highlight: null,
        page: "1",
      });
    },
  };
}
