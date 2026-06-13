"use client";

import { AlertTriangle } from "lucide-react";
import {
  getStockWarningMessage,
  type StockWarning,
} from "@/lib/stock-utils";
import { cn } from "@/lib/utils";

interface CartStockWarningsProps {
  warnings: StockWarning[];
  className?: string;
}

export function CartStockWarnings({
  warnings,
  className,
}: CartStockWarningsProps) {
  if (warnings.length === 0) return null;

  return (
    <ul className={cn("space-y-2", className)}>
      {warnings.map((warning) => {
        const isBlocking =
          warning.type === "out_of_stock" ||
          warning.type === "exceeds_stock";

        return (
          <li
            key={`${warning.itemId}-${warning.type}`}
            className={cn(
              "flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs leading-relaxed sm:text-sm",
              isBlocking
                ? "border border-destructive/30 bg-destructive/10 text-destructive"
                : "border border-amber-500/30 bg-amber-500/10 text-foreground",
            )}
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{getStockWarningMessage(warning)}</span>
          </li>
        );
      })}
    </ul>
  );
}
