import type { Tables } from "@/types/supabase";

export type PromotionImage = Tables<"promotion_images">;

export type Promotion = Tables<"promotions"> & {
  promotion_images: PromotionImage[];
};

export interface ActivePromotionsResponse {
  success: boolean;
  data: Promotion[];
}

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export const HOME_HERO_LOCATION = "home_hero" as const;
/** Nuevas promos admin — ubicación móvil de la comunidad. */
export const COMMUNITY_MOBILE_LOCATION = "comunidad_mobile" as const;
/** Legacy en Supabase — sigue soportado en el mapper. */
export const SHOWROOM_MOBILE_LOCATION = "showroom_mobile" as const;

export interface ShowroomPromoCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  linkText: string;
}
