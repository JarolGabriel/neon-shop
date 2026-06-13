import { resolvePublicStorageUrl } from "@/lib/storage-url";
import {
  COMMUNITY_MOBILE_LOCATION,
  HOME_HERO_LOCATION,
  SHOWROOM_MOBILE_LOCATION,
  type HeroSlide,
  type Promotion,
  type ShowroomPromoCard,
} from "@/types/promotion";

type PromotionSchedule = Pick<
  Promotion,
  "is_active" | "start_date" | "end_date"
>;

function parsePromotionBoundaryDate(
  value: string,
  boundary: "start" | "end",
): Date {
  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(
      boundary === "start"
        ? `${trimmed}T00:00:00.000Z`
        : `${trimmed}T23:59:59.999Z`,
    );
  }

  const parsed = new Date(trimmed);

  if (
    boundary === "end" &&
    parsed.getUTCHours() === 0 &&
    parsed.getUTCMinutes() === 0 &&
    parsed.getUTCSeconds() === 0 &&
    parsed.getUTCMilliseconds() === 0
  ) {
    return new Date(parsed.getTime() + 24 * 60 * 60 * 1000 - 1);
  }

  return parsed;
}

export function isPromotionCurrentlyActive(
  promotion: PromotionSchedule,
  now: Date = new Date(),
): boolean {
  if (promotion.is_active !== true) return false;

  if (promotion.start_date) {
    const start = parsePromotionBoundaryDate(promotion.start_date, "start");
    if (start > now) return false;
  }

  if (promotion.end_date) {
    const end = parsePromotionBoundaryDate(promotion.end_date, "end");
    if (end < now) return false;
  }

  return true;
}

function isHomeHeroPromotion(promotion: Promotion): boolean {
  const location = promotion.display_location;
  return !location || location === HOME_HERO_LOCATION;
}

function getPrimaryImageUrl(promotion: Promotion): string | null {
  const images = promotion.promotion_images;
  if (!images.length) return null;

  const sorted = [...images].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );

  return resolvePublicStorageUrl(sorted[0]?.image_url) ?? null;
}

export function mapHomeHeroSlides(promotions: Promotion[]): HeroSlide[] {
  return promotions
    .filter(isHomeHeroPromotion)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .flatMap((promotion) => {
      const imageUrl = getPrimaryImageUrl(promotion);
      if (!imageUrl) return [];

      return [
        {
          id: promotion.id,
          title: promotion.title,
          description: promotion.description ?? "",
          imageUrl,
        },
      ];
    });
}

export function mapShowroomMobilePromos(
  promotions: Promotion[],
): ShowroomPromoCard[] {
  return promotions
    .filter(
      (promotion) =>
        promotion.display_location === COMMUNITY_MOBILE_LOCATION ||
        promotion.display_location === SHOWROOM_MOBILE_LOCATION,
    )
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .flatMap((promotion) => {
      const imageUrl = getPrimaryImageUrl(promotion);
      if (!imageUrl) return [];

      return [
        {
          id: promotion.id,
          title: promotion.title,
          description: promotion.description ?? "",
          imageUrl,
          href: promotion.link_url ?? "/productos",
          linkText: promotion.link_text ?? "Ver más",
        },
      ];
    });
}
