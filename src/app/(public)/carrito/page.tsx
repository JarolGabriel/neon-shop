"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { CartItemRow } from "@/components/store/cart/CartItemRow";
import { CartOrderSummary } from "@/components/store/cart/CartOrderSummary";
import { CheckoutModal } from "@/components/store/cart/CheckoutModal";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

function CartSkeletonList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-xl bg-muted"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default function CarritoPage() {
  const { items, itemCount, isLoading } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Carrito
              </h1>
              {!isLoading && items.length > 0 ? (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  ({itemCount})
                </span>
              ) : null}
            </div>

            {isLoading ? (
              <CartSkeletonList />
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center">
                <ShoppingCart
                  className="size-16 text-muted-foreground"
                  aria-hidden="true"
                />
                <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
                  Tu carrito está vacío
                </h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Explora nuestros letreros neón y encuentra el que ilumina tu
                  espacio.
                </p>
                <Button
                  asChild
                  className="mt-6 rounded-full bg-vite-purple text-primary-foreground hover:bg-vite-purple/90"
                >
                  <Link href="/productos">Ver catálogo</Link>
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id}>
                    <CartItemRow item={item} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <CartOrderSummary onCheckout={() => setCheckoutOpen(true)} />
        </div>
      </div>

      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </section>
  );
}
