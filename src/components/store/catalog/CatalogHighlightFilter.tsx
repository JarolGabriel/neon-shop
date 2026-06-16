"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CatalogFilterState } from "@/hooks/useCatalogProducts";

const HIGHLIGHT_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "featured", label: "Destacados" },
  { value: "best_seller", label: "Más vendidos (admin)" },
] as const;

interface CatalogHighlightFilterProps {
  filters: CatalogFilterState;
  onFiltersChange: (patch: Partial<CatalogFilterState>) => void;
}

export function CatalogHighlightFilter({
  filters,
  onFiltersChange,
}: CatalogHighlightFilterProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="sr-only">Filtrar por visibilidad en tienda</legend>
      {HIGHLIGHT_OPTIONS.map((option) => {
        const checked = filters.highlight === option.value;

        return (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-foreground",
              "hover:text-neon-pink! dark:hover:text-cyber-yellow!",
            )}
          >
            <input
              type="radio"
              name="catalog-highlight"
              value={option.value}
              checked={checked}
              onChange={() =>
                onFiltersChange({
                  highlight: option.value,
                })
              }
              className="size-4 accent-vite-purple dark:accent-cyber-yellow"
            />
            <Label className="cursor-pointer font-normal">{option.label}</Label>
          </label>
        );
      })}
    </fieldset>
  );
}
