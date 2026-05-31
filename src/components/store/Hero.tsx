import { getActivePromotions } from "@/lib/api";
import { mapHomeHeroSlides } from "@/lib/promotions";
import { HeroCarousel } from "@/components/store/HeroCarousel";
import { InfoTicker } from "@/components/shared/InfoTicker";
import type { HeroSlide } from "@/types/promotion";

export async function Hero() {
  let slides: HeroSlide[] = [];

  try {
    const { data } = await getActivePromotions();
    slides = mapHomeHeroSlides(data);
  } catch {
    return null;
  }

  if (slides.length === 0) return null;

  return (
    <div className="relative -mt-20 w-full">
      <HeroCarousel slides={slides} />
      <InfoTicker />
    </div>
  );
}
