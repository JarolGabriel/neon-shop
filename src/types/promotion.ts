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
