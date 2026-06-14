export interface ProductSizePriceTier {
  value: string;
  label: string;
  priceUsd: number;
  sortOrder: number;
}

/** Official reference tiers (USD). Final price may vary by design complexity. */
export const PRODUCT_SIZE_PRICE_TIERS: readonly ProductSizePriceTier[] = [
  { value: "custom:30 x 30 cm", label: "30 x 30 cm", priceUsd: 35, sortOrder: 1 },
  { value: "custom:40 x 40 cm", label: "40 x 40 cm", priceUsd: 50, sortOrder: 2 },
  { value: "custom:40 x 50 cm", label: "40 x 50 cm", priceUsd: 60, sortOrder: 3 },
  { value: "custom:40 x 60 cm", label: "40 x 60 cm", priceUsd: 65, sortOrder: 4 },
  { value: "custom:40 x 70 cm", label: "40 x 70 cm", priceUsd: 70, sortOrder: 5 },
  { value: "custom:50 x 50 cm", label: "50 x 50 cm", priceUsd: 60, sortOrder: 6 },
  { value: "custom:50 x 80 cm", label: "50 x 80 cm", priceUsd: 90, sortOrder: 7 },
  { value: "custom:60 x 60 cm", label: "60 x 60 cm", priceUsd: 70, sortOrder: 8 },
  { value: "custom:70 x 70 cm", label: "70 x 70 cm", priceUsd: 90, sortOrder: 9 },
  { value: "custom:80 x 80 cm", label: "80 x 80 cm", priceUsd: 120, sortOrder: 10 },
  { value: "custom:90 x 90 cm", label: "90 x 90 cm", priceUsd: 140, sortOrder: 11 },
  {
    value: "custom:100 x 100 cm",
    label: "100 x 100 cm (1×1 m)",
    priceUsd: 180,
    sortOrder: 12,
  },
] as const;

export const PRODUCT_SIZE_PRESETS = PRODUCT_SIZE_PRICE_TIERS.map((tier) => ({
  value: tier.value,
  label: `${tier.label} · $${tier.priceUsd}`,
}));

export const ALL_PRODUCT_SIZE_VALUES: string[] =
  PRODUCT_SIZE_PRICE_TIERS.map((tier) => tier.value);

const LEGACY_SIZE_TO_TIER: ReadonlyArray<{ pattern: RegExp; tierValue: string }> =
  [
    { pattern: /^pequeno$/i, tierValue: "custom:40 x 40 cm" },
    { pattern: /^small\b/i, tierValue: "custom:40 x 40 cm" },
    { pattern: /small.*15\s*inch/i, tierValue: "custom:40 x 40 cm" },
    { pattern: /^mediano$/i, tierValue: "custom:50 x 50 cm" },
    { pattern: /^medium\b/i, tierValue: "custom:50 x 50 cm" },
    { pattern: /medium.*20\s*inch/i, tierValue: "custom:50 x 50 cm" },
    { pattern: /^grande$/i, tierValue: "custom:70 x 70 cm" },
    { pattern: /^large\b/i, tierValue: "custom:70 x 70 cm" },
    { pattern: /large.*30\s*inch/i, tierValue: "custom:70 x 70 cm" },
    { pattern: /^xl$/i, tierValue: "custom:80 x 80 cm" },
    { pattern: /^xxl$/i, tierValue: "custom:100 x 100 cm" },
  ];

const TIER_BY_VALUE = new Map(
  PRODUCT_SIZE_PRICE_TIERS.map((tier) => [tier.value, tier]),
);

const TIER_BY_LABEL = new Map(
  PRODUCT_SIZE_PRICE_TIERS.map((tier) => [tier.label.toLowerCase(), tier]),
);

export function mapLegacySizeToTierValue(size: string): string | null {
  const trimmed = size.trim();
  if (!trimmed) return null;

  for (const { pattern, tierValue } of LEGACY_SIZE_TO_TIER) {
    if (pattern.test(trimmed)) return tierValue;
  }

  return null;
}

export function normalizeSizeKey(size: string): string {
  const trimmed = size.trim();
  if (!trimmed) return "";

  const legacy = mapLegacySizeToTierValue(trimmed);
  if (legacy) return legacy;

  const normalized = trimmed.startsWith("custom:")
    ? trimmed
    : `custom:${trimmed}`;
  if (TIER_BY_VALUE.has(normalized)) return normalized;

  const bare = trimmed.startsWith("custom:")
    ? trimmed.slice("custom:".length).trim()
    : trimmed;
  const byLabel = TIER_BY_LABEL.get(bare.toLowerCase());
  if (byLabel) return byLabel.value;

  return normalized;
}

export function getPriceForSize(size: string): number | null {
  const key = normalizeSizeKey(size);
  return TIER_BY_VALUE.get(key)?.priceUsd ?? null;
}

export function getProductSizeLabel(size: string | null | undefined): string {
  if (!size) return "";

  const key = normalizeSizeKey(size);
  const tier = TIER_BY_VALUE.get(key);
  if (tier) return tier.label;

  if (size.startsWith("custom:")) return size.slice("custom:".length);
  return size;
}

export function resolveSizeKeyFromLabel(label: string): string | null {
  const trimmed = label.trim();
  if (!trimmed) return null;

  const byLabel = TIER_BY_LABEL.get(trimmed.toLowerCase());
  if (byLabel) return byLabel.value;

  const normalized = normalizeSizeKey(trimmed);
  return TIER_BY_VALUE.has(normalized) ? normalized : null;
}

export function getMinTierPriceUsd(): number {
  return Math.min(...PRODUCT_SIZE_PRICE_TIERS.map((tier) => tier.priceUsd));
}

export function getPricesForSizes(sizes: string[]): number[] {
  const prices = sizes
    .map((size) => getPriceForSize(size))
    .filter((price): price is number => price != null);

  return [...new Set(prices)];
}

export function getMaxDimensionCm(size: string): number | null {
  const label = getProductSizeLabel(size);
  const match = label.match(/(\d+)\s*x\s*(\d+)/i);
  if (!match) return null;

  return Math.max(parseInt(match[1], 10), parseInt(match[2], 10));
}

/**
 * Reference markup for strikethrough “original” price (e.g. $50 sale → $76 compare-at).
 * Ratio 76/50 = 1.52. Final quotes may still vary by design complexity.
 */
export const COMPARE_AT_MARKUP_MULTIPLIER = 1.52;

/** Rounds to a whole-dollar “retail” compare-at for display. */
export function getCompareAtPriceForSalePrice(salePrice: number): number {
  if (salePrice <= 0) return 0;
  return Math.round(salePrice * COMPARE_AT_MARKUP_MULTIPLIER);
}

export function getCompareAtPriceForSize(size: string): number | null {
  const salePrice = getPriceForSize(size);
  if (salePrice == null) return null;
  return getCompareAtPriceForSalePrice(salePrice);
}

/**
 * Resolves strikethrough price: DB override when above sale price, else auto markup.
 */
export function resolveCompareAtPrice(
  salePrice: number,
  dbCompareAtPrice: number | null | undefined,
): number | null {
  if (salePrice <= 0) return null;

  if (dbCompareAtPrice != null && dbCompareAtPrice > salePrice) {
    return dbCompareAtPrice;
  }

  const calculated = getCompareAtPriceForSalePrice(salePrice);
  return calculated > salePrice ? calculated : null;
}
