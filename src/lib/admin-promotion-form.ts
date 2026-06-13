import type { AdminPromotionFormInput } from "@/lib/schemas/admin-promotion";
import type {
  CreateAdminPromotionPayload,
  PatchAdminPromotionPayload,
} from "@/types/admin";

function normalizeDate(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed || null;
}

export function buildPromotionCreatePayload(
  values: AdminPromotionFormInput,
): CreateAdminPromotionPayload {
  return {
    title: values.title.trim(),
    description: values.description?.trim() || null,
    link_url: values.link_url?.trim() || null,
    link_text: values.link_text?.trim() || null,
    display_location: values.display_location,
    is_active: values.is_active,
    display_order: values.display_order,
    start_date: normalizeDate(values.start_date),
    end_date: normalizeDate(values.end_date),
  };
}

export function buildPromotionUpdatePayload(
  values: AdminPromotionFormInput,
): PatchAdminPromotionPayload {
  return buildPromotionCreatePayload(values);
}
