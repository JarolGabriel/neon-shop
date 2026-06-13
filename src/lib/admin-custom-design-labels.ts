import {
  BUDGET_OPTIONS,
  DELIVERY_TIME_OPTIONS,
  MATERIAL_OPTIONS,
  PURPOSE_OPTIONS,
  SIZE_OPTIONS,
  USAGE_OPTIONS,
  type SelectOption,
} from "@/components/store/custom-design/custom-design-options";
import { getProductSizeLabel } from "@/lib/product-catalog-options";
import type { CustomDesignStatus, DesignType } from "@/types/custom-design";
import { CUSTOM_DESIGN_STATUS_OPTIONS } from "@/lib/schemas/admin-custom-design";

function optionLabel(
  options: SelectOption[],
  value: string | null | undefined,
): string {
  if (!value?.trim()) return "—";
  return options.find((item) => item.value === value)?.label ?? value;
}

export function getCustomDesignStatusLabel(status: CustomDesignStatus): string {
  return (
    CUSTOM_DESIGN_STATUS_OPTIONS.find((item) => item.value === status)?.label ??
    status
  );
}

export function getDesignTypeLabel(type: DesignType): string {
  if (type === "logo_upload") return "Logo subido";
  if (type === "text_design") return "Texto / personalizador";
  return type;
}

export function getPreferredSizeLabel(
  value: string | null | undefined,
): string {
  if (!value?.trim()) return "—";
  const preset = getProductSizeLabel(value);
  if (preset !== value) return preset;
  return optionLabel(SIZE_OPTIONS, value);
}

export function getMaterialLabel(value: string | null | undefined): string {
  return optionLabel(MATERIAL_OPTIONS, value);
}

export function getUsageTypeLabel(value: string | null | undefined): string {
  return optionLabel(USAGE_OPTIONS, value);
}

export function getBudgetRangeLabel(value: string | null | undefined): string {
  return optionLabel(BUDGET_OPTIONS, value);
}

export function getPurposeLabel(value: string | null | undefined): string {
  return optionLabel(PURPOSE_OPTIONS, value);
}

export function getDeliveryTimeLabel(value: string | null | undefined): string {
  return optionLabel(DELIVERY_TIME_OPTIONS, value);
}
