"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORIES_VISIBLE_LIMIT } from "@/components/store/catalog/catalog-filter-utils";
import type { CategoryWithCount } from "@/lib/api";
import type { CatalogFilterState } from "@/hooks/useCatalogProducts";

interface CatalogCategoryFilterProps {
  categories: CategoryWithCount[];
  filters: CatalogFilterState;
  onFiltersChange: (patch: Partial<CatalogFilterState>) => void;
}

export function CatalogCategoryFilter({
  categories,
  filters,
  onFiltersChange,
}: CatalogCategoryFilterProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll
    ? categories
    : categories.slice(0, CATEGORIES_VISIBLE_LIMIT);
  const hasMore = categories.length > CATEGORIES_VISIBLE_LIMIT;

  const handleCategoryToggle = (slug: string, checked: boolean) => {
    onFiltersChange({ category: checked ? slug : "" });
  };

  return (
    <div className="space-y-3">
      {visibleCategories.map((category) => (
        <label
          key={category.id}
          className="flex cursor-pointer items-center gap-2.5"
        >
          <Checkbox
            checked={filters.category === category.slug}
            onCheckedChange={(checked) =>
              handleCategoryToggle(category.slug, checked === true)
            }
          />
          <span className="text-sm">
            {category.name}{" "}
            <span className="text-xs text-muted-foreground">
              ({category.product_count})
            </span>
          </span>
        </label>
      ))}

      {hasMore && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-sm text-muted-foreground transition-colors hover:text-neon-pink! dark:hover:text-cyber-yellow!"
        >
          Ver más
        </button>
      )}

      {hasMore && showAll && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="text-sm text-muted-foreground transition-colors hover:text-neon-pink! dark:hover:text-cyber-yellow!"
        >
          Ver menos
        </button>
      )}
    </div>
  );
}
