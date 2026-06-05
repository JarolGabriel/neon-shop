"use client";

import { useCallback, useMemo, useState } from "react";
import type { ProductDetail, ProductDetailVariant } from "@/types/product";

export interface VariantColorOption {
  key: string;
  color: string | null;
  colorHex: string | null;
}

export interface UseProductVariantsResult {
  variants: ProductDetailVariant[];
  sizes: string[];
  colors: VariantColorOption[];
  selectedSize: string | null;
  selectedColorKey: string | null;
  selectedColorIndex: number;
  selectedVariant: ProductDetailVariant | null;
  currentPrice: number;
  selectSize: (size: string) => void;
  selectColor: (colorKey: string) => void;
  isSizeAvailable: (size: string) => boolean;
}

function colorKeyOf(variant: ProductDetailVariant): string {
  return (
    variant.color_hex?.trim().toLowerCase() ||
    variant.color?.trim().toLowerCase() ||
    variant.id
  );
}

export function useProductVariants(
  product: ProductDetail,
): UseProductVariantsResult {
  const variants = useMemo(
    () => product.variants.filter((v) => v.is_active !== false),
    [product.variants],
  );

  const sizes = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const v of variants) {
      if (v.size && !seen.has(v.size)) {
        seen.add(v.size);
        out.push(v.size);
      }
    }
    return out;
  }, [variants]);

  const colors = useMemo<VariantColorOption[]>(() => {
    const map = new Map<string, VariantColorOption>();
    for (const v of variants) {
      const key = colorKeyOf(v);
      if (!map.has(key)) {
        map.set(key, { key, color: v.color, colorHex: v.color_hex });
      }
    }
    return [...map.values()];
  }, [variants]);

  const initial = useMemo(
    () => variants.find((v) => v.price === product.price) ?? variants[0] ?? null,
    [variants, product.price],
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(
    initial?.size ?? sizes[0] ?? null,
  );
  const [selectedColorKey, setSelectedColorKey] = useState<string | null>(
    initial ? colorKeyOf(initial) : (colors[0]?.key ?? null),
  );

  const findVariant = useCallback(
    (size: string | null, key: string | null) =>
      variants.find(
        (v) =>
          (size ? v.size === size : true) &&
          (key ? colorKeyOf(v) === key : true),
      ) ?? null,
    [variants],
  );

  const selectedVariant = useMemo(
    () =>
      findVariant(selectedSize, selectedColorKey) ??
      findVariant(null, selectedColorKey) ??
      findVariant(selectedSize, null) ??
      variants[0] ??
      null,
    [findVariant, selectedSize, selectedColorKey, variants],
  );

  // Si la combinación elegida no existe, saltamos a otra variante real disponible.
  const selectSize = useCallback(
    (size: string) => {
      setSelectedSize(size);
      if (!findVariant(size, selectedColorKey)) {
        const alt = variants.find((v) => v.size === size);
        if (alt) setSelectedColorKey(colorKeyOf(alt));
      }
    },
    [findVariant, selectedColorKey, variants],
  );

  const selectColor = useCallback(
    (key: string) => {
      setSelectedColorKey(key);
      if (!findVariant(selectedSize, key)) {
        const alt = variants.find((v) => colorKeyOf(v) === key);
        if (alt?.size) setSelectedSize(alt.size);
      }
    },
    [findVariant, selectedSize, variants],
  );

  const isSizeAvailable = useCallback(
    (size: string) =>
      variants.some(
        (v) =>
          v.size === size &&
          (selectedColorKey ? colorKeyOf(v) === selectedColorKey : true),
      ),
    [variants, selectedColorKey],
  );

  const selectedColorIndex = colors.findIndex(
    (c) => c.key === selectedColorKey,
  );

  return {
    variants,
    sizes,
    colors,
    selectedSize,
    selectedColorKey,
    selectedColorIndex: selectedColorIndex < 0 ? 0 : selectedColorIndex,
    selectedVariant,
    currentPrice: selectedVariant?.price ?? product.price,
    selectSize,
    selectColor,
    isSizeAvailable,
  };
}
