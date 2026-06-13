"use client";

import { Box, Loader2 } from "lucide-react";
import { useState } from "react";
import { ProductCustomizationNote } from "@/components/store/ProductCustomizationNote";
import { ProductAccordion } from "@/components/store/ProductAccordion";
import { ProductBenefits } from "@/components/store/ProductBenefits";
import { BulkDiscountNotice } from "@/components/store/BulkDiscountNotice";
import { PaymentInfoCard } from "@/components/store/PaymentInfoCard";
import { ProductRating } from "@/components/store/ProductRating";
import { ProductSpecs } from "@/components/store/ProductSpecs";
import { ProductVariantSelector } from "@/components/store/ProductVariantSelector";
import { PRODUCT_ACCORDION_ITEMS } from "@/components/store/product-accordion-data";
import { Button } from "@/components/ui/button";
import { addToCart, getCartSessionId } from "@/lib/api";
import { parseCartNotes } from "@/lib/schemas/cart-notes";
import { LOW_STOCK_THRESHOLD } from "@/lib/stock-utils";
import { useCart } from "@/context/CartContext";
import {
  cn,
  formatSizeLabel,
  formatUsd,
  getDiscountPercent,
} from "@/lib/utils";
import type { UseProductVariantsResult } from "@/hooks/useProductVariants";
import type { ProductDetail } from "@/types/product";

interface ProductInfoProps {
  product: ProductDetail;
  whatsappNumber: string;
  selection: UseProductVariantsResult;
  onSelectColor: (key: string) => void;
}

type CartState = "idle" | "loading" | "success" | "error";

export function ProductInfo({
  product,
  whatsappNumber,
  selection,
  onSelectColor,
}: ProductInfoProps) {
  const [cartState, setCartState] = useState<CartState>("idle");
  const [customizationNote, setCustomizationNote] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const { fetchCart } = useCart();

  const {
    currentPrice,
    selectedVariant,
    selectedSize,
    colors,
    selectedColorKey,
    variants,
  } = selection;
  const hasVariants = variants.length > 0;
  const compareAt = product.compare_at_price;
  const discount = getDiscountPercent(currentPrice, compareAt);
  const selectedColorName =
    colors.find((c) => c.key === selectedColorKey)?.color ?? null;
  const availableStock = hasVariants
    ? (selectedVariant?.stock ?? 0)
    : (product.stock ?? 0);
  const isOutOfStock = availableStock <= 0;
  const isLowStock =
    availableStock > 0 && availableStock <= LOW_STOCK_THRESHOLD;
  const canAddToCart =
    !isOutOfStock && (!hasVariants || selectedVariant !== null);

  const handleAddToCart = async () => {
    if (!canAddToCart) return;

    setNoteError(null);
    let notes: string | undefined;
    try {
      notes = parseCartNotes(customizationNote);
    } catch (error) {
      setNoteError(
        error instanceof Error ? error.message : "Nota inválida",
      );
      return;
    }

    setCartState("loading");
    try {
      await addToCart({
        session_id: getCartSessionId(),
        product_id: product.id,
        ...(selectedVariant ? { variant_id: selectedVariant.id } : {}),
        quantity: 1,
        notes,
      });
      await fetchCart();
      setCustomizationNote("");
      setCartState("success");
    } catch {
      setCartState("error");
    }
  };

  const handleWhatsApp = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const sizeValue = selectedVariant?.size ?? selectedSize;
    const details = [
      sizeValue ? formatSizeLabel(sizeValue) : null,
      selectedColorName,
    ]
      .filter(Boolean)
      .join(" · ");
    const message = `Hola! Me interesa este producto: ${product.name}${
      details ? ` (${details})` : ""
    } — ${formatUsd(currentPrice)} USD.\n${url}`;
    const digits = whatsappNumber.replace(/[^\d]/g, "");
    const base = digits ? `https://wa.me/${digits}` : "https://wa.me/";
    window.open(`${base}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <ProductRating reviewCount={product.sales_count} />
        <h1 className="font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {discount != null ? (
            <span className="rounded-full bg-neon-pink px-2.5 py-1 text-xs font-semibold text-primary-foreground dark:bg-cyber-yellow dark:text-black">
              {discount}% OFF
            </span>
          ) : null}
          <span className="text-2xl font-bold text-foreground dark:text-cyber-yellow">
            {formatUsd(currentPrice)} USD
          </span>
          {compareAt != null && compareAt > currentPrice ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatUsd(compareAt)} USD
            </span>
          ) : null}
        </div>
      </div>

      {product.short_description ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.short_description}
        </p>
      ) : null}

      <ProductVariantSelector
        sizes={selection.sizes}
        colors={selection.colors}
        selectedSize={selection.selectedSize}
        selectedColorKey={selection.selectedColorKey}
        selectedColorName={selectedColorName}
        isSizeAvailable={selection.isSizeAvailable}
        onSelectSize={selection.selectSize}
        onSelectColor={onSelectColor}
      />

      <BulkDiscountNotice />

      {isOutOfStock ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {hasVariants
            ? "Esta variante está agotada. Elige otro tamaño o color."
            : "Este producto está agotado."}
        </p>
      ) : isLowStock ? (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-foreground">
          ¡Quedan pocas unidades! ({availableStock} disponibles)
        </p>
      ) : null}

      <ProductCustomizationNote
        value={customizationNote}
        onChange={(value) => {
          setCustomizationNote(value);
          if (noteError) setNoteError(null);
        }}
        disabled={cartState === "loading"}
        error={noteError}
      />

      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={cartState === "loading" || !canAddToCart}
          className="w-full rounded-full border-0 bg-vite-purple! text-white transition-colors duration-200 hover:bg-neon-pink! disabled:opacity-70"
        >
          {cartState === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          {cartState === "success" ? "¡Añadido al carrito!" : "Añadir al carrito"}
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={handleWhatsApp}
          className="w-full rounded-full border-border hover:border-vite-purple! hover:text-vite-purple! dark:hover:border-cyber-yellow! dark:hover:text-cyber-yellow!"
        >
          Comprar por WhatsApp
        </Button>

        {cartState === "error" ? (
          <p className="text-center text-xs text-destructive">
            No se pudo añadir al carrito. Inténtalo de nuevo o cómpralo por
            WhatsApp.
          </p>
        ) : null}
      </div>

      <div className={cn("border-y border-border py-6")}>
        <ProductBenefits />
      </div>

      {product.description ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      ) : null}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Box className="size-3.5" aria-hidden="true" />
        Envío gratis a todo Venezuela
      </div>

      <ProductAccordion items={PRODUCT_ACCORDION_ITEMS} />

      {/* En móvil, especificaciones y pago se muestran al final, tras el acordeón. */}
      <div className="flex flex-col gap-6 md:hidden">
        <ProductSpecs />
        <PaymentInfoCard />
      </div>
    </div>
  );
}
