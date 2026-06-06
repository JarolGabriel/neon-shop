"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CatalogAvailabilityFilter } from "@/components/store/catalog/CatalogAvailabilityFilter";
import { CatalogCategoryFilter } from "@/components/store/catalog/CatalogCategoryFilter";
import { CatalogPriceFilter } from "@/components/store/catalog/CatalogPriceFilter";
import { hasActiveFilters } from "@/components/store/catalog/catalog-filter-utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getCategoriesWithProductCounts,
  getCategoryFilters,
  type CategoryWithCount,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import type { CatalogFilterState } from "@/hooks/useCatalogProducts";
import { DEFAULT_MAX_PRICE } from "@/hooks/useCatalogProducts";

interface CatalogFiltersPanelProps {
  filters: CatalogFilterState;
  onFiltersChange: (patch: Partial<CatalogFilterState>) => void;
  onClearAll?: () => void;
  className?: string;
}

const SORT_OPTIONS = [
  { value: "best_seller", label: "Más vendido" },
  { value: "newest", label: "Más reciente" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
] as const;

export function CatalogFiltersPanel({
  filters,
  onFiltersChange,
  onClearAll,
  className,
}: CatalogFiltersPanelProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [priceBounds, setPriceBounds] = useState({
    min: 0,
    max: DEFAULT_MAX_PRICE,
  });
  const [searchDraft, setSearchDraft] = useState(filters.search);
  const showClearAll = hasActiveFilters(filters);

  useEffect(() => {
    setSearchDraft(filters.search);
  }, [filters.search]);

  useEffect(() => {
    getCategoriesWithProductCounts()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!filters.category) {
      setPriceBounds({ min: 0, max: DEFAULT_MAX_PRICE });
      return;
    }

    getCategoryFilters(filters.category)
      .then((response) => {
        const { min, max } = response.available_filters.price_range;
        const safeMax = max > min ? Math.min(max, DEFAULT_MAX_PRICE) : DEFAULT_MAX_PRICE;
        setPriceBounds({ min: Math.max(0, min), max: safeMax });
      })
      .catch(() => setPriceBounds({ min: 0, max: DEFAULT_MAX_PRICE }));
  }, [filters.category]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchDraft !== filters.search) {
        onFiltersChange({ search: searchDraft });
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchDraft, filters.search, onFiltersChange]);

  return (
    <div className={cn("space-y-4 text-foreground", className)}>
      <div className="space-y-2">
        <Label htmlFor="catalog-search" className="text-sm font-medium">
          Buscar
        </Label>
        <Input
          id="catalog-search"
          type="search"
          placeholder="Buscar productos…"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          className="border-border bg-background"
        />
        {showClearAll && onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-muted-foreground transition-colors hover:text-neon-pink! dark:hover:text-cyber-yellow!"
          >
            Limpiar todo
          </button>
        )}
      </div>

      <div className="space-y-2 lg:hidden">
        <Label htmlFor="catalog-sort" className="text-sm font-medium">
          Ordenar por
        </Label>
        <select
          id="catalog-sort"
          value={filters.sort}
          onChange={(event) =>
            onFiltersChange({
              sort: event.target.value as CatalogFilterState["sort"],
            })
          }
          className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["availability", "price", "category"]}
        className="w-full"
      >
        <AccordionItem value="availability" className="border-border">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline hover:text-neon-pink! dark:hover:text-cyber-yellow!">
            Disponibilidad
          </AccordionTrigger>
          <AccordionContent>
            <CatalogAvailabilityFilter
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-border">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline hover:text-neon-pink! dark:hover:text-cyber-yellow!">
            Precio
          </AccordionTrigger>
          <AccordionContent>
            <CatalogPriceFilter
              filters={filters}
              priceBounds={priceBounds}
              onFiltersChange={onFiltersChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category" className="border-border">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline hover:text-neon-pink! dark:hover:text-cyber-yellow!">
            Categoría
          </AccordionTrigger>
          <AccordionContent>
            <CatalogCategoryFilter
              categories={categories}
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
