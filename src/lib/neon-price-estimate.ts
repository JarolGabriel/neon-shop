import {
  getMinTierPriceUsd,
  getPriceForSize,
  normalizeSizeKey,
} from "@/lib/product-size-pricing";
import type { SpecialEffectId } from "@/lib/neon-customizer-config";

export const NEON_PRICE_MIN_USD = getMinTierPriceUsd();
export const NEON_PRICE_MAX_USD = 180;

export interface NeonPriceEstimateInput {
  textContent: string;
  size: string;
  usageType: string;
  effectId: SpecialEffectId;
}

export interface NeonPriceEstimate {
  amountUsd: number;
  characterCount: number;
}

const EFFECT_PREMIUM_USD: Record<SpecialEffectId, number> = {
  single: 0,
  dynamic: 8,
  multicolor: 14,
  rgb: 10,
};

function countNeonCharacters(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const withoutSpaces = trimmed.replace(/\s/g, "");
  return withoutSpaces.length > 0 ? withoutSpaces.length : trimmed.length;
}

export function estimateNeonPrice(
  input: NeonPriceEstimateInput,
): NeonPriceEstimate | null {
  const { textContent, size, usageType, effectId } = input;

  if (!size || !usageType) return null;

  const characterCount = countNeonCharacters(textContent);
  const tierPrice = getPriceForSize(size);
  const sizeBase = tierPrice ?? NEON_PRICE_MIN_USD;

  const extraCharacters = Math.max(0, characterCount - 8);
  const characterPremium = Math.min(extraCharacters * 2.5, 28);

  const effectPremium = EFFECT_PREMIUM_USD[effectId] ?? 0;
  const usagePremium = usageType === "exterior_ip67" ? 12 : 0;

  const raw =
    sizeBase + characterPremium + effectPremium + usagePremium;

  const amountUsd = Math.min(
    NEON_PRICE_MAX_USD,
    Math.max(NEON_PRICE_MIN_USD, Math.round(raw)),
  );

  return { amountUsd, characterCount };
}
