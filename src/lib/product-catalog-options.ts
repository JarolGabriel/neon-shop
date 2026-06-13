import { NEON_COLORS, SIZE_OPTIONS } from "@/lib/neon-customizer-config";

export { NEON_COLORS };

export const PRODUCT_SIZE_PRESETS = SIZE_OPTIONS;

export const CUSTOM_SIZE_VALUE = "__custom__";

export interface AdminProductVariantDraft {
  id?: string;
  name?: string;
  sku?: string;
  size?: string;
  color?: string;
  color_hex?: string;
  price?: number;
  stock?: number;
  is_active?: boolean;
}

export function normalizeCustomSize(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("custom:")) return trimmed;
  return `custom:${trimmed}`;
}

export function getProductSizeLabel(size: string | null | undefined): string {
  if (!size) return "";
  if (size.startsWith("custom:")) return size.slice("custom:".length);
  return (
    PRODUCT_SIZE_PRESETS.find((preset) => preset.value === size)?.label ?? size
  );
}

function randomSkuSuffix(): string {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

function skuToken(value: string, max = 6): string {
  const token = value.replace(/[^a-z0-9]/gi, "").toUpperCase();
  return token.slice(0, max) || "ITEM";
}

export function generateProductSku(slug: string): string {
  return `NS-${skuToken(slug, 8)}-${randomSkuSuffix()}`;
}

export function generateVariantSku(
  productSlug: string,
  size?: string,
  color?: string,
): string {
  const base = skuToken(productSlug, 6);
  const sizeToken = size
    ? size.startsWith("custom:")
      ? skuToken(size.slice(7), 4)
      : skuToken(size, 3)
    : "STD";
  const colorToken = color ? skuToken(color, 4) : "DEF";
  return `NS-${base}-${sizeToken}-${colorToken}`;
}

export function suggestVariantName(size?: string, color?: string): string {
  const parts = [
    size ? getProductSizeLabel(size) : null,
    color?.trim() || null,
  ].filter(Boolean);
  return parts.join(" · ");
}

export function colorKeyFromNameAndHex(
  color: string,
  colorHex: string | null,
): string {
  return colorHex?.trim().toLowerCase() || color.trim().toLowerCase();
}

export function lookupNeonColorHex(colorName: string | null | undefined): string | null {
  if (!colorName?.trim()) return null;
  const lower = colorName.trim().toLowerCase();
  const found = NEON_COLORS.find(
    (item) =>
      item.label.toLowerCase() === lower || item.id.toLowerCase() === lower,
  );
  return found?.color ?? null;
}

export function encodeStoredProductColor(
  color: string,
  colorHex?: string | null,
): string {
  const name = color.trim();
  if (!name) return "";

  const preset = NEON_COLORS.find(
    (item) => item.label === name || item.id === name.toLowerCase(),
  );
  if (preset) return `${preset.label}|${preset.color}`;

  const hex = colorHex?.trim();
  if (hex && /^#[0-9A-Fa-f]{6}$/.test(hex)) return `${name}|${hex}`;

  const lookup = lookupNeonColorHex(name);
  if (lookup) return `${name}|${lookup}`;

  return name;
}

export function parseStoredProductColor(value: string | null | undefined): {
  color: string;
  colorHex: string | null;
} {
  if (!value?.trim()) return { color: "", colorHex: null };

  const pipeIndex = value.indexOf("|");
  if (pipeIndex > 0) {
    const color = value.slice(0, pipeIndex).trim();
    const hex = value.slice(pipeIndex + 1).trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      return { color, colorHex: hex };
    }
  }

  const color = value.trim();
  return { color, colorHex: lookupNeonColorHex(color) };
}

export function sanitizeColorHex(hex: unknown): string | null {
  if (typeof hex !== "string" || !hex.trim()) return null;
  const normalized = hex.trim();
  return /^#[0-9A-Fa-f]{6}$/.test(normalized) ? normalized : null;
}

export function normalizeVariantForSubmit(
  variant: AdminProductVariantDraft,
  productSlug: string,
  basePrice: number,
): AdminProductVariantDraft {
  const size = variant.size?.trim() || "";
  const color = variant.color?.trim() || "";
  const colorHex =
    sanitizeColorHex(variant.color_hex) ?? lookupNeonColorHex(color) ?? "";

  return {
    ...variant,
    size,
    color,
    color_hex: colorHex,
    name: variant.name?.trim() || suggestVariantName(size, color),
    sku:
      variant.sku?.trim() ||
      generateVariantSku(productSlug, size || undefined, color || undefined),
    price: variant.price ?? basePrice,
    stock: variant.stock ?? 0,
    is_active: variant.is_active ?? true,
  };
}

export function isVariantRowFilled(variant: AdminProductVariantDraft): boolean {
  return Boolean(variant.size?.trim() || variant.color?.trim());
}

export interface VariantColorSelection {
  color: string;
  color_hex: string;
}

function variantCombinationKey(size: string, color: string): string {
  return `${size.trim()}|${color.trim().toLowerCase()}`;
}

export function buildVariantCombinations(
  sizes: string[],
  colors: VariantColorSelection[],
  basePrice: number,
  baseStock: number,
): AdminProductVariantDraft[] {
  const variants: AdminProductVariantDraft[] = [];

  for (const size of sizes) {
    const normalizedSize = size.trim();
    if (!normalizedSize) continue;

    for (const { color, color_hex } of colors) {
      const normalizedColor = color.trim();
      if (!normalizedColor) continue;

      variants.push({
        name: suggestVariantName(normalizedSize, normalizedColor),
        sku: "",
        size: normalizedSize,
        color: normalizedColor,
        color_hex: color_hex,
        price: basePrice > 0 ? basePrice : undefined,
        stock: baseStock,
        is_active: true,
      });
    }
  }

  return variants;
}

export function mergeVariantCombinations(
  existing: AdminProductVariantDraft[],
  generated: AdminProductVariantDraft[],
): AdminProductVariantDraft[] {
  const map = new Map<string, AdminProductVariantDraft>();

  for (const variant of existing) {
    if (!isVariantRowFilled(variant)) continue;
    map.set(
      variantCombinationKey(variant.size ?? "", variant.color ?? ""),
      variant,
    );
  }

  for (const variant of generated) {
    const key = variantCombinationKey(variant.size ?? "", variant.color ?? "");
    if (!map.has(key)) {
      map.set(key, variant);
    }
  }

  return [...map.values()];
}

export interface ProductAvailableColor {
  label: string;
  hex: string;
}

export function normalizeAvailableSizes(sizes: string[] | undefined): string[] {
  if (!sizes?.length) return [];

  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const size of sizes) {
    const value = size.trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    normalized.push(value);
  }

  return normalized;
}

export function normalizeAvailableColors(
  colors: ProductAvailableColor[] | undefined,
): ProductAvailableColor[] {
  if (!colors?.length) return [];

  const map = new Map<string, ProductAvailableColor>();

  for (const color of colors) {
    const label = color.label?.trim();
    const hex = sanitizeColorHex(color.hex);
    if (!label || !hex) continue;
    map.set(hex.toLowerCase(), { label, hex });
  }

  return [...map.values()];
}

export function parseAvailableColorsFromDb(
  raw: unknown,
): ProductAvailableColor[] {
  if (!Array.isArray(raw)) return [];

  const parsed: ProductAvailableColor[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const record = item as { label?: unknown; hex?: unknown };
    const label = typeof record.label === "string" ? record.label.trim() : "";
    const hex = sanitizeColorHex(record.hex);
    if (!label || !hex) continue;
    parsed.push({ label, hex });
  }

  return normalizeAvailableColors(parsed);
}

export function extractUniqueSizesFromVariants(
  variants: Array<{ size?: string | null }>,
): string[] {
  const seen = new Set<string>();
  const sizes: string[] = [];

  for (const variant of variants) {
    const size = variant.size?.trim();
    if (!size || seen.has(size)) continue;
    seen.add(size);
    sizes.push(size);
  }

  return sizes;
}

export function extractUniqueColorsFromVariants(
  variants: Array<{ color?: string | null; color_hex?: string | null }>,
): ProductAvailableColor[] {
  const colors: ProductAvailableColor[] = [];

  for (const variant of variants) {
    const label = variant.color?.trim();
    if (!label) continue;

    const hex =
      sanitizeColorHex(variant.color_hex) ?? lookupNeonColorHex(label) ?? "#ffffff";

    colors.push({ label, hex });
  }

  return normalizeAvailableColors(colors);
}

export function productHasConfiguredOptions(product: {
  available_sizes?: string[] | null;
  available_colors?: ProductAvailableColor[] | null;
}): boolean {
  return (
    (product.available_sizes?.length ?? 0) > 0 ||
    (product.available_colors?.length ?? 0) > 0
  );
}

export function productUsesAdvancedVariants(product: {
  product_variants?: Array<{ id: string }>;
  variants?: Array<{ id: string }>;
}): boolean {
  return (
    (product.product_variants?.length ?? 0) > 0 ||
    (product.variants?.length ?? 0) > 0
  );
}

/** @deprecated Use productUsesAdvancedVariants */
export function productHasLegacyVariants(product: {
  product_variants?: Array<{ id: string }>;
  available_sizes?: string[] | null;
  available_colors?: ProductAvailableColor[] | null;
}): boolean {
  return (
    (product.product_variants?.length ?? 0) > 0 &&
    !productHasConfiguredOptions(product)
  );
}

export function parseProductSelectionNotes(notes: string): {
  sizeLabel: string | null;
  colorName: string | null;
  userNote: string | null;
} {
  const trimmed = notes.trim();
  if (!trimmed) {
    return { sizeLabel: null, colorName: null, userNote: null };
  }

  const newlineIndex = trimmed.indexOf("\n");
  const firstLine =
    newlineIndex >= 0 ? trimmed.slice(0, newlineIndex) : trimmed;
  const rest = newlineIndex >= 0 ? trimmed.slice(newlineIndex + 1).trim() : "";

  if (!firstLine.includes("Tamaño:") && !firstLine.includes("Color:")) {
    return { sizeLabel: null, colorName: null, userNote: trimmed };
  }

  let sizeLabel: string | null = null;
  let colorName: string | null = null;

  for (const segment of firstLine.split(" · ")) {
    if (segment.startsWith("Tamaño:")) {
      sizeLabel = segment.replace("Tamaño:", "").trim();
    }
    if (segment.startsWith("Color:")) {
      colorName = segment.replace("Color:", "").trim();
    }
  }

  return {
    sizeLabel: sizeLabel || null,
    colorName: colorName || null,
    userNote: rest || null,
  };
}

export function buildProductSelectionNotes(
  size: string | null,
  colorName: string | null,
  userNote?: string,
): string | undefined {
  const parts: string[] = [];

  if (size) {
    parts.push(`Tamaño: ${getProductSizeLabel(size)}`);
  }

  if (colorName) {
    parts.push(`Color: ${colorName}`);
  }

  const prefix = parts.join(" · ");
  const trimmedNote = userNote?.trim();

  if (prefix && trimmedNote) {
    return `${prefix}\n${trimmedNote}`;
  }

  return prefix || trimmedNote || undefined;
}
