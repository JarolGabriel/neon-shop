"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ADMIN_INPUT_CLASS } from "@/lib/admin-ui";
import { STOCK_STATUS_OPTIONS } from "@/lib/schemas/admin-product";
import type { AdminCategory } from "@/types/admin";
import type { AdminProductStockStatus } from "@/types/admin";

interface ProductsFiltersProps {
  search: string;
  categoryId: string;
  stockStatus: AdminProductStockStatus | "all";
  categories: AdminCategory[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStockStatusChange: (value: AdminProductStockStatus | "all") => void;
  onClear: () => void;
}

export function ProductsFilters({
  search,
  categoryId,
  stockStatus,
  categories,
  onSearchChange,
  onCategoryChange,
  onStockStatusChange,
  onClear,
}: ProductsFiltersProps) {
  const hasFilters =
    search.trim().length > 0 || categoryId !== "all" || stockStatus !== "all";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative min-w-[200px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nombre..."
          className={`${ADMIN_INPUT_CLASS} pl-9`}
        />
      </div>

      <Select value={categoryId} onValueChange={onCategoryChange}>
        <SelectTrigger className={`w-full sm:w-52 ${ADMIN_INPUT_CLASS}`}>
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent className="bg-white text-slate-900">
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
              {category.is_active === false ? " (inactiva)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={stockStatus}
        onValueChange={(value) =>
          onStockStatusChange(value as AdminProductStockStatus | "all")
        }
      >
        <SelectTrigger className={`w-full sm:w-48 ${ADMIN_INPUT_CLASS}`}>
          <SelectValue placeholder="Stock" />
        </SelectTrigger>
        <SelectContent className="bg-white text-slate-900">
          {STOCK_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters ? (
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          className="border-slate-200 bg-white text-slate-700"
        >
          <X className="size-4" />
          Limpiar
        </Button>
      ) : null}
    </div>
  );
}
