"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CartItemNotesEditor } from "@/components/store/cart/CartItemNotesEditor";
import { useCart, type CartItem } from "@/context/CartContext";
import {
  getCartItemImage,
  getCartItemUnitPrice,
} from "@/lib/cart-pricing";
import {
  getCartItemStock,
  LOW_STOCK_THRESHOLD,
} from "@/lib/stock-utils";
import { cn, formatSizeLabel, formatUsd } from "@/lib/utils";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { removeItem, updateQuantity } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const unitPrice = getCartItemUnitPrice(item);
  const lineTotal = unitPrice * item.quantity;
  const image = getCartItemImage(item);
  const productSlug = item.products?.slug;
  const variantParts = [
    item.product_variants?.size
      ? formatSizeLabel(item.product_variants.size)
      : null,
    item.product_variants?.color,
  ].filter(Boolean);
  const stock = getCartItemStock(item);
  const isOutOfStock = stock !== null && stock <= 0;
  const isLowStock =
    stock !== null && stock > 0 && stock <= LOW_STOCK_THRESHOLD;
  const exceedsStock = stock !== null && stock > 0 && item.quantity > stock;

  const handleDecrease = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      if (item.quantity <= 1) {
        await removeItem(item.id);
      } else {
        await updateQuantity(item.id, item.quantity - 1);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo actualizar el carrito",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIncrease = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await updateQuantity(item.id, item.quantity + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo actualizar el carrito",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await removeItem(item.id);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo eliminar el producto",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const imageContent = image ? (
    <Image
      src={image.url}
      alt={image.alt}
      fill
      sizes="80px"
      className="object-cover"
    />
  ) : (
    <Zap className="size-8 text-cyber-yellow" aria-hidden="true" />
  );

  const imageWrapperClass =
    "relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted";

  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="flex gap-4">
        {productSlug ? (
          <Link href={`/productos/${productSlug}`} className={imageWrapperClass}>
            {imageContent}
          </Link>
        ) : (
          <div className={imageWrapperClass}>{imageContent}</div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {productSlug ? (
                <Link
                  href={`/productos/${productSlug}`}
                  className="font-heading text-sm font-semibold text-foreground hover:text-neon-pink dark:hover:text-cyber-yellow"
                >
                  {item.products?.name ?? "Producto"}
                </Link>
              ) : (
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {item.products?.name ?? "Producto"}
                </h3>
              )}
              {variantParts.length > 0 ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {variantParts.join(" · ")}
                </p>
              ) : null}
              {isOutOfStock ? (
                <p className="mt-1 text-xs font-medium text-destructive">
                  Agotado
                </p>
              ) : exceedsStock ? (
                <p className="mt-1 text-xs font-medium text-destructive">
                  Solo quedan {stock} unidades
                </p>
              ) : isLowStock ? (
                <p className="mt-1 text-xs text-amber-400">
                  Pocas unidades ({stock})
                </p>
              ) : null}
              <CartItemNotesEditor
                itemId={item.id}
                notes={item.notes}
                disabled={isProcessing}
              />
            </div>
            <p className="shrink-0 font-bold text-foreground dark:text-cyber-yellow">
              {formatUsd(lineTotal)}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8 rounded-full"
                disabled={isProcessing}
                onClick={() => void handleDecrease()}
                aria-label="Disminuir cantidad"
              >
                <Minus className="size-3.5" />
              </Button>
              <span className="min-w-8 text-center text-sm font-medium text-foreground">
                {item.quantity}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8 rounded-full"
                disabled={isProcessing}
                onClick={() => void handleIncrease()}
                aria-label="Aumentar cantidad"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => void handleRemove()}
              className={cn(
                "text-xs text-muted-foreground transition-colors hover:text-destructive",
                isProcessing && "pointer-events-none opacity-50",
              )}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
