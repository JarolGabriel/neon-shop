import {
  HOME_HERO_LOCATION,
  type HeroSlide,
  type Promotion,
} from "@/types/promotion";

function getPrimaryImageUrl(promotion: Promotion): string | null {
  const images = promotion.promotion_images;
  if (!images.length) return null;

  const sorted = [...images].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );

  return sorted[0]?.image_url ?? null;
}

export function mapHomeHeroSlides(promotions: Promotion[]): HeroSlide[] {
  return promotions
    .filter((promotion) => promotion.display_location === HOME_HERO_LOCATION)
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
