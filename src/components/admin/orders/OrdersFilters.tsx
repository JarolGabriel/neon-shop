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
import { ORDER_STATUSES } from "@/lib/schemas/admin-order";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/order";

interface OrdersFiltersProps {
  search: string;
  status: OrderStatus | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: OrderStatus | "all") => void;
  onClear: () => void;
}

export function OrdersFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: OrdersFiltersProps) {
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
          onStatusChange(value as OrderStatus | "all")
        }
      >
        <SelectTrigger className="w-full border-slate-200 bg-white text-slate-900 sm:w-56">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent className="bg-white text-slate-900">
          <SelectItem value="all">Todos los estados</SelectItem>
          {ORDER_STATUSES.map((item) => (
            <SelectItem key={item} value={item}>
              {ORDER_STATUS_LABELS[item]}
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
