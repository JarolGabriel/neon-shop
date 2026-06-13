"use client";

import { Search } from "lucide-react";
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
import { CUSTOM_DESIGN_STATUS_OPTIONS } from "@/lib/schemas/admin-custom-design";
import type { CustomDesignStatus } from "@/types/custom-design";

interface CustomDesignsFiltersProps {
  search: string;
  status: CustomDesignStatus | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CustomDesignStatus | "all") => void;
  onClear: () => void;
}

export function CustomDesignsFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: CustomDesignsFiltersProps) {
  const hasFilters = search.length > 0 || status !== "all";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-end">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nombre o email..."
          className={`${ADMIN_INPUT_CLASS} pl-9`}
        />
      </div>

      <Select
        value={status}
        onValueChange={(value) =>
          onStatusChange(value as CustomDesignStatus | "all")
        }
      >
        <SelectTrigger className="w-full border-slate-200 bg-white text-slate-900 sm:w-56">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent className="bg-white text-slate-900">
          <SelectItem value="all">Todos los estados</SelectItem>
          {CUSTOM_DESIGN_STATUS_OPTIONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters ? (
        <Button variant="outline" onClick={onClear} className="border-slate-200">
          Limpiar
        </Button>
      ) : null}
    </div>
  );
}
