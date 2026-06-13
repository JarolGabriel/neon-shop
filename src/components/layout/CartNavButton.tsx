"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { NAV_ACTION_BTN } from "@/components/layout/navbar-links";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export function CartNavButton() {
  const { itemCount } = useCart();
  const badgeLabel = itemCount > 9 ? "9+" : String(itemCount);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Carrito${itemCount > 0 ? `, ${itemCount} productos` : ""}`}
      className={cn(NAV_ACTION_BTN, "relative text-foreground")}
      asChild
    >
      <Link href="/carrito">
        <ShoppingCart className="size-4" />
        {itemCount > 0 ? (
          <span
            className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-neon-pink text-[10px] font-bold text-primary-foreground dark:bg-cyber-yellow dark:text-black"
            aria-hidden="true"
          >
            {badgeLabel}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
