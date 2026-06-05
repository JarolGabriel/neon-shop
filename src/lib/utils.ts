import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type {
  CatalogProduct,
  CatalogProductVariant,
  UniqueColorSwatch,
} from "@/types/product"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function getDiscountPercent(
  price: number,
  compareAtPrice: number | null,
): number | null {
  if (compareAtPrice == null || compareAtPrice <= price) return null
  return Math.round((1 - price / compareAtPrice) * 100)
}

export function getProductDisplayPrice(product: CatalogProduct): {
  price: number
  compareAtPrice: number | null
  showFromLabel: boolean
} {
  const activeVariants = product.product_variants.filter(
    (v) => v.is_active !== false,
  )
  const variantPrices = activeVariants.map((v) => v.price)

  const minVariantPrice =
    variantPrices.length > 0 ? Math.min(...variantPrices) : null

  return {
    price: minVariantPrice ?? product.price,
    compareAtPrice: product.compare_at_price,
    showFromLabel: variantPrices.length > 1,
  }
}

function variantColorKey(variant: CatalogProductVariant): string | null {
  const hex = variant.color_hex?.trim().toLowerCase()
  if (hex) return hex

  const name = variant.color?.trim().toLowerCase()
  return name || null
}

/** Agrupa variantes por color único (hex o nombre) para swatches sin duplicados. */
export function getUniqueVariantColors(
  variants: CatalogProductVariant[],
  maxVisible = 4,
): { swatches: UniqueColorSwatch[]; overflowCount: number } {
  const seen = new Map<string, UniqueColorSwatch>()

  for (const variant of variants) {
    if (variant.is_active === false) continue

    const key = variantColorKey(variant)
    if (!key || seen.has(key)) continue

    seen.set(key, {
      id: variant.id,
      color: variant.color,
      colorHex: variant.color_hex,
    })
  }

  const all = [...seen.values()]
  return {
    swatches: all.slice(0, maxVisible),
    overflowCount: Math.max(0, all.length - maxVisible),
  }
}

export function sortProductImages(
  images: CatalogProduct["product_images"],
): CatalogProduct["product_images"] {
  return [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (!a.is_primary && b.is_primary) return 1
    return 0
  })
}
