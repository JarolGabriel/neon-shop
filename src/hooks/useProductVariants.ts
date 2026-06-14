"use client";

import { useCallback, useMemo, useState } from "react";
import {
  colorKeyFromNameAndHex,
  parseAvailableColorsFromDb,
  parseStoredProductColor,
  productHasConfiguredOptions,
} from "@/lib/product-catalog-options";
import { getPriceForSize, resolveCompareAtPrice } from "@/lib/product-size-pricing";
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
  currentCompareAtPrice: number | null;
  hasConfiguredOptions: boolean;
  usesAdvancedVariants: boolean;
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

  const usesAdvancedVariants = variants.length > 0;

  const configuredOptions = useMemo(() => {
    if (usesAdvancedVariants) return null;
    if (!productHasConfiguredOptions(product)) return null;

    const sizes = product.available_sizes ?? [];
    const colors = parseAvailableColorsFromDb(product.available_colors).map(
      (color) => ({
        key: colorKeyFromNameAndHex(color.label, color.hex),
        color: color.label,
        colorHex: color.hex,
      }),
    );

    return {
      sizes,
      colors,
      initialSize: sizes[0] ?? null,
      initialColorKey: colors[0]?.key ?? null,
    };
  }, [
    usesAdvancedVariants,
    product.available_sizes,
    product.available_colors,
  ]);

  const simpleProduct = useMemo(() => {
    if (usesAdvancedVariants || configuredOptions) return null;

    const parsed = parseStoredProductColor(product.color);
    const size = product.size?.trim() || null;
    const colorName = parsed.color || null;

    if (!size && !colorName) return null;

    const colorKey = colorName
      ? colorKeyFromNameAndHex(colorName, parsed.colorHex)
      : null;

    return {
      sizes: size ? [size] : [],
      colors: colorName
        ? [
            {
              key: colorKey!,
              color: colorName,
              colorHex: parsed.colorHex,
            },
          ]
        : [],
      initialSize: size,
      initialColorKey: colorKey,
    };
  }, [
    usesAdvancedVariants,
    configuredOptions,
    product.size,
    product.color,
  ]);

  const sizes = useMemo(() => {
    if (configuredOptions) return configuredOptions.sizes;
    if (simpleProduct) return simpleProduct.sizes;

    const seen = new Set<string>();
    const out: string[] = [];
    for (const v of variants) {
      if (v.size && !seen.has(v.size)) {
        seen.add(v.size);
        out.push(v.size);
      }
    }
    return out;
  }, [configuredOptions, simpleProduct, variants]);

  const colors = useMemo<VariantColorOption[]>(() => {
    if (configuredOptions) return configuredOptions.colors;
    if (simpleProduct) return simpleProduct.colors;

    const map = new Map<string, VariantColorOption>();
    for (const v of variants) {
      const key = colorKeyOf(v);
      if (!map.has(key)) {
        map.set(key, { key, color: v.color, colorHex: v.color_hex });
      }
    }
    return [...map.values()];
  }, [configuredOptions, simpleProduct, variants]);

  const initial = useMemo(() => {
    if (configuredOptions || simpleProduct) return null;
    return variants.find((v) => v.price === product.price) ?? variants[0] ?? null;
  }, [configuredOptions, simpleProduct, variants, product.price]);

  const [selectedSize, setSelectedSize] = useState<string | null>(
    configuredOptions?.initialSize ??
      simpleProduct?.initialSize ??
      initial?.size ??
      sizes[0] ??
      null,
  );
  const [selectedColorKey, setSelectedColorKey] = useState<string | null>(
    configuredOptions?.initialColorKey ??
      simpleProduct?.initialColorKey ??
      (initial ? colorKeyOf(initial) : (colors[0]?.key ?? null)),
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

  const selectedVariant = useMemo(() => {
    if (configuredOptions || simpleProduct) return null;

    return (
      findVariant(selectedSize, selectedColorKey) ??
      findVariant(null, selectedColorKey) ??
      findVariant(selectedSize, null) ??
      variants[0] ??
      null
    );
  }, [
    configuredOptions,
    simpleProduct,
    findVariant,
    selectedSize,
    selectedColorKey,
    variants,
  ]);

  const selectSize = useCallback(
    (size: string) => {
      setSelectedSize(size);
      if (configuredOptions || simpleProduct) return;

      if (!findVariant(size, selectedColorKey)) {
        const alt = variants.find((v) => v.size === size);
        if (alt) setSelectedColorKey(colorKeyOf(alt));
      }
    },
    [configuredOptions, simpleProduct, findVariant, selectedColorKey, variants],
  );

  const selectColor = useCallback(
    (key: string) => {
      setSelectedColorKey(key);
      if (configuredOptions || simpleProduct) return;

      if (!findVariant(selectedSize, key)) {
        const alt = variants.find((v) => colorKeyOf(v) === key);
        if (alt?.size) setSelectedSize(alt.size);
      }
    },
    [configuredOptions, simpleProduct, findVariant, selectedSize, variants],
  );

  const isSizeAvailable = useCallback(
    (size: string) => {
      if (configuredOptions) return configuredOptions.sizes.includes(size);
      if (simpleProduct) return simpleProduct.sizes.includes(size);

      return variants.some(
        (v) =>
          v.size === size &&
          (selectedColorKey ? colorKeyOf(v) === selectedColorKey : true) &&
          (v.stock ?? 0) > 0,
      );
    },
    [configuredOptions, simpleProduct, variants, selectedColorKey],
  );

  const selectedColorIndex = colors.findIndex(
    (c) => c.key === selectedColorKey,
  );

  const currentPrice = useMemo(() => {
    if (selectedVariant?.price != null) return selectedVariant.price;

    if (configuredOptions && selectedSize) {
      return getPriceForSize(selectedSize) ?? product.price;
    }

    if (simpleProduct && selectedSize) {
      return getPriceForSize(selectedSize) ?? product.price;
    }

    return product.price;
  }, [
    selectedVariant,
    configuredOptions,
    simpleProduct,
    selectedSize,
    product.price,
  ]);

  const currentCompareAtPrice = useMemo(
    () => resolveCompareAtPrice(currentPrice, product.compare_at_price),
    [currentPrice, product.compare_at_price],
  );

  return {
    variants,
    sizes,
    colors,
    selectedSize,
    selectedColorKey,
    selectedColorIndex: selectedColorIndex < 0 ? 0 : selectedColorIndex,
    selectedVariant,
    currentPrice,
    currentCompareAtPrice,
    hasConfiguredOptions: configuredOptions !== null,
    usesAdvancedVariants,
    selectSize,
    selectColor,
    isSizeAvailable,
  };
}
