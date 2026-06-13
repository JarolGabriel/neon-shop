"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Tag } from "lucide-react";
import { CartStockWarnings } from "@/components/store/cart/CartStockWarnings";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import {
  getCartStockWarnings,
  hasBlockingStockWarnings,
} from "@/lib/stock-utils";
import { formatUsd } from "@/lib/utils";

interface CartOrderSummaryProps {
  onCheckout: () => void;
}

export function CartOrderSummary({ onCheckout }: CartOrderSummaryProps) {
  const {
    items,
    itemCount,
    subtotal,
    savingsAmount,
    total,
    discountLabel,
    nextTierHint,
  } = useCart();

  const stockWarnings = useMemo(() => getCartStockWarnings(items), [items]);
  const hasStockBlockers = hasBlockingStockWarnings(stockWarnings);

  return (
    <aside className="sticky top-24 rounded-xl border border-border bg-card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Resumen del pedido
      </h2>

      {discountLabel && savingsAmount > 0 ? (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm text-foreground">
          <Tag className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span>
            {discountLabel}{" "}
            <span className="font-medium text-neon-pink dark:text-cyber-yellow">
              (-{formatUsd(savingsAmount)})
            </span>
          </span>
        </div>
      ) : null}

      {nextTierHint ? (
        <p className="mt-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          {nextTierHint}
        </p>
      ) : null}

      <CartStockWarnings warnings={stockWarnings} className="mt-3" />

      <div className="mt-4 space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({itemCount}{" "}
            {itemCount === 1 ? "artículo" : "artículos"}):
          </span>
          <span className="font-medium text-foreground">{formatUsd(subtotal)}</span>
        </div>

        {savingsAmount > 0 ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ahorro:</span>
            <span className="rounded-full bg-neon-pink px-2.5 py-0.5 text-xs font-semibold text-primary-foreground dark:bg-cyber-yellow dark:text-black">
              -{formatUsd(savingsAmount)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="my-4 border-t border-border" />

      <div className="flex items-baseline justify-between gap-3">
        <span className="font-heading text-base font-semibold text-foreground">
          Total:
        </span>
        <span className="text-2xl font-bold text-foreground dark:text-cyber-yellow">
          {formatUsd(total)}
        </span>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        💬 El pago se coordina por WhatsApp
      </p>

      <Button
        type="button"
        size="lg"
        disabled={items.length === 0 || hasStockBlockers}
        onClick={onCheckout}
        className="mt-6 w-full rounded-full bg-vite-purple text-primary-foreground hover:bg-vite-purple/90"
      >
        <ShoppingCart className="size-4" />
        Confirmar pedido
      </Button>

      <Button
        variant="ghost"
        className="mt-3 w-full rounded-full text-muted-foreground hover:text-neon-pink dark:hover:text-cyber-yellow"
        asChild
      >
        <Link href="/productos">
          <ArrowLeft className="size-4" />
          Seguir comprando
        </Link>
      </Button>
    </aside>
  );
}
