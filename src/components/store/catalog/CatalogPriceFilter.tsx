"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  clampPrice,
  PRICE_STEP,
} from "@/components/store/catalog/catalog-filter-utils";
import type { CatalogFilterState } from "@/hooks/useCatalogProducts";
import { DEFAULT_MAX_PRICE } from "@/hooks/useCatalogProducts";

interface CatalogPriceFilterProps {
  filters: CatalogFilterState;
  priceBounds: { min: number; max: number };
  onFiltersChange: (patch: Partial<CatalogFilterState>) => void;
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function parsePriceInput(raw: string, fallback: number): number {
  const trimmed = raw.trim();
  if (trimmed === "") return fallback;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function CatalogPriceFilter({
  filters,
  priceBounds,
  onFiltersChange,
}: CatalogPriceFilterProps) {
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const [minDraft, setMinDraft] = useState("");
  const [maxDraft, setMaxDraft] = useState("");

  useEffect(() => {
    setMinPrice(filters.minPrice);
    setMaxPrice(filters.maxPrice);
    setMinDraft(
      filters.minPrice === 0 ? "" : String(filters.minPrice),
    );
    setMaxDraft(
      filters.maxPrice === DEFAULT_MAX_PRICE ? "" : String(filters.maxPrice),
    );
  }, [filters.minPrice, filters.maxPrice]);

  const commitMin = (raw: string) => {
    const parsed = parsePriceInput(raw, 0);
    const next = clampPrice(parsed, priceBounds.min, maxPrice);
    setMinPrice(next);
    setMinDraft(next === 0 ? "" : String(next));
    onFiltersChange({ minPrice: next });
  };

  const commitMax = (raw: string) => {
    const parsed = parsePriceInput(raw, DEFAULT_MAX_PRICE);
    const next = clampPrice(parsed, minPrice, priceBounds.max);
    setMaxPrice(next);
    setMaxDraft(next === DEFAULT_MAX_PRICE ? "" : String(next));
    onFiltersChange({ maxPrice: next });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          inputMode="numeric"
          value={minDraft}
          placeholder="0"
          onChange={(event) => setMinDraft(digitsOnly(event.target.value))}
          onBlur={(event) => commitMin(event.target.value)}
          className="h-8 flex-1 border-border bg-background px-2 text-center text-xs placeholder:text-muted-foreground/40"
          aria-label="Precio mínimo"
        />
        <span className="text-muted-foreground">—</span>
        <Input
          type="text"
          inputMode="numeric"
          value={maxDraft}
          placeholder="999"
          onChange={(event) => setMaxDraft(digitsOnly(event.target.value))}
          onBlur={(event) => commitMax(event.target.value)}
          className="h-8 flex-1 border-border bg-background px-2 text-center text-xs placeholder:text-muted-foreground/40"
          aria-label="Precio máximo"
        />
      </div>

      <Slider
        min={priceBounds.min}
        max={priceBounds.max}
        step={PRICE_STEP}
        value={[minPrice, maxPrice]}
        onValueChange={([min, max]) => {
          setMinPrice(min);
          setMaxPrice(max);
          setMinDraft(min === 0 ? "" : String(min));
          setMaxDraft(max === DEFAULT_MAX_PRICE ? "" : String(max));
          onFiltersChange({ minPrice: min, maxPrice: max });
        }}
      />
    </div>
  );
}
