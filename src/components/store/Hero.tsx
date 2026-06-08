import dynamic from "next/dynamic";
import { InfoTicker } from "@/components/shared/InfoTicker";
import { getActivePromotions } from "@/lib/api";
import { mapHomeHeroSlides } from "@/lib/promotions";
import type { HeroSlide } from "@/types/promotion";

const HeroCarousel = dynamic(
  () =>
    import("@/components/store/HeroCarousel").then((mod) => ({
      default: mod.HeroCarousel,
    })),
  {
    loading: () => (
      <div
        className="min-h-[36rem] animate-pulse bg-muted sm:min-h-[40rem]"
        aria-hidden
      />
    ),
  },
);

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
