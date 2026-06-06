"use client";

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CatalogFiltersPanel } from "@/components/store/catalog/CatalogFiltersPanel";
import type { CatalogFilterState } from "@/hooks/useCatalogProducts";

const SORT_OPTIONS = [
  { value: "best_seller", label: "Más vendido" },
  { value: "newest", label: "Más reciente" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
] as const;

interface CatalogToolbarProps {
  filters: CatalogFilterState;
  totalItems: number;
  categoryName?: string;
  onFiltersChange: (patch: Partial<CatalogFilterState>) => void;
  onClearAll?: () => void;
}

export function CatalogToolbar({
  filters,
  totalItems,
  categoryName,
  onFiltersChange,
  onClearAll,
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6">
      <nav
        aria-label="Breadcrumb"
        className="text-xs text-muted-foreground"
      >
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-neon-pink! dark:hover:text-cyber-yellow!"
            >
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-foreground">
            {categoryName ?? "Productos"}
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {categoryName ?? "Todo el stock"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ({totalItems} {totalItems === 1 ? "producto" : "productos"})
          </p>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 rounded-full border-border bg-neon-surface text-foreground hover:border-neon-pink! hover:text-neon-pink! dark:hover:border-cyber-yellow! dark:hover:text-cyber-yellow! lg:hidden"
              >
                <SlidersHorizontal className="size-4" />
                Filtrar y ordenar
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full border-border bg-neon-surface sm:max-w-sm"
            >
              <SheetHeader>
                <SheetTitle className="font-heading text-neon-pink dark:text-cyber-yellow">
                  Filtrar y ordenar
                </SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto px-4 pb-6">
                <CatalogFiltersPanel
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  onClearAll={onClearAll}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-sm text-muted-foreground">Ordenar por</span>
            <select
              value={filters.sort}
              onChange={(event) =>
                onFiltersChange({
                  sort: event.target.value as CatalogFilterState["sort"],
                })
              }
              className="h-9 rounded-lg border border-border bg-neon-surface px-3 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
