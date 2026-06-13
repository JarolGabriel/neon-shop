"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUSES } from "@/lib/schemas/admin-order";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/order";

interface OrderStatusSelectProps {
  value: OrderStatus;
  onValueChange: (value: OrderStatus) => void;
  disabled?: boolean;
}

export function OrderStatusSelect({
  value,
  onValueChange,
  disabled,
}: OrderStatusSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next as OrderStatus)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full border-slate-200 bg-white text-slate-900">
        <SelectValue placeholder="Seleccionar estado" />
      </SelectTrigger>
      <SelectContent className="bg-white text-slate-900">
        {ORDER_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {ORDER_STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
