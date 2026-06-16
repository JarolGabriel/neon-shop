import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getProductSizeLabel, parseAvailableColorsFromDb } from "@/lib/product-catalog-options"
import { getPricesForSizes, resolveCompareAtPrice } from "@/lib/product-size-pricing"
import type {
  CatalogProduct,
  CatalogProductVariant,
  ProductAvailableColor,
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

const SIZE_NAME_MAP: Record<string, string> = {
  small: "Pequeño",
  medium: "Mediano",
  large: "Grande",
}

/** Traduce presets del taller, tamaños custom y pulgadas legacy. */
export function formatSizeLabel(size: string | null): string {
  if (!size) return ""

  const presetLabel = getProductSizeLabel(size)
  if (presetLabel !== size) return presetLabel

  let label = size
  const lower = size.toLowerCase()

  for (const [en, es] of Object.entries(SIZE_NAME_MAP)) {
    if (lower.startsWith(en)) {
      label = label.replace(new RegExp(en, "i"), es)
      break
    }
  }

  return label.replace(
    /(\d+(?:\.\d+)?)\s*inches?/i,
    (_, value: string) => `${Math.round(parseFloat(value) * 2.54)} cm`,
  )
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
  const uniqueVariantPrices = [...new Set(variantPrices)]

  const minVariantPrice =
    uniqueVariantPrices.length > 0 ? Math.min(...uniqueVariantPrices) : null

  const availableSizes = "available_sizes" in product
    ? (product as CatalogProduct & { available_sizes?: string[] }).available_sizes
    : undefined
  const tierPrices = getPricesForSizes(availableSizes ?? [])
  const minTierPrice =
    tierPrices.length > 0 ? Math.min(...tierPrices) : null

  const candidates = [minVariantPrice, minTierPrice, product.price].filter(
    (value): value is number => value != null,
  )
  const price = candidates.length > 0 ? Math.min(...candidates) : product.price

  const hasMultipleVariantPrices = uniqueVariantPrices.length > 1
  const hasMultipleTierPrices = tierPrices.length > 1
  const compareAtPrice = resolveCompareAtPrice(
    price,
    product.compare_at_price,
  )

  return {
    price,
    compareAtPrice,
    showFromLabel: hasMultipleVariantPrices || hasMultipleTierPrices,
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

/** Swatches para tarjeta: variantes primero, luego available_colors como respaldo. */
export function getProductCardColorSwatches(
  variants: CatalogProductVariant[],
  availableColors: ProductAvailableColor[] | null | undefined,
  maxVisible = 4,
): { swatches: UniqueColorSwatch[]; overflowCount: number } {
  const fromVariants = getUniqueVariantColors(variants, maxVisible)
  if (fromVariants.swatches.length > 0) return fromVariants

  const colors = parseAvailableColorsFromDb(availableColors)
  if (colors.length === 0) {
    return { swatches: [], overflowCount: 0 }
  }

  const swatches = colors.slice(0, maxVisible).map((color, index) => ({
    id: `configured-${color.hex}-${index}`,
    color: color.label,
    colorHex: color.hex,
  }))

  return {
    swatches,
    overflowCount: Math.max(0, colors.length - maxVisible),
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

/** Genera slug kebab-case desde un nombre (sin acentos). */
export function slugifyName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
