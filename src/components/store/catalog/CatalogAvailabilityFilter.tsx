"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { getProducts } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { CatalogFilterState } from "@/hooks/useCatalogProducts";

interface CatalogAvailabilityFilterProps {
  filters: CatalogFilterState;
  onFiltersChange: (patch: Partial<CatalogFilterState>) => void;
}

export function CatalogAvailabilityFilter({
  filters,
  onFiltersChange,
}: CatalogAvailabilityFilterProps) {
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  useEffect(() => {
    const baseParams = {
      limit: 1,
      page: 1,
      category: filters.category || undefined,
      search: filters.search.trim() || undefined,
    };

    Promise.all([
      getProducts(baseParams),
      getProducts({ ...baseParams, in_stock: true }),
    ])
      .then(([all, inStock]) => {
        setOutOfStockCount(
          Math.max(0, all.meta.total_items - inStock.meta.total_items),
        );
      })
      .catch(() => setOutOfStockCount(0));
  }, [filters.category, filters.search]);

  const hasOutOfStock = outOfStockCount > 0;

  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox
          checked={filters.inStock}
          onCheckedChange={(checked) =>
            onFiltersChange({
              inStock: checked === true,
              outOfStock: false,
            })
          }
        />
        <span className="text-sm">En stock</span>
      </label>

      <label
        className={cn(
          "flex items-center gap-2.5",
          hasOutOfStock ? "cursor-pointer" : "cursor-not-allowed opacity-45",
        )}
      >
        <Checkbox
          checked={filters.outOfStock}
          disabled={!hasOutOfStock}
          onCheckedChange={(checked) =>
            onFiltersChange({
              outOfStock: checked === true,
              inStock: false,
            })
          }
        />
        <span className="text-sm">Agotado</span>
        {hasOutOfStock && (
          <span className="text-xs text-muted-foreground">
            ({outOfStockCount})
          </span>
        )}
      </label>
    </div>
  );
}
