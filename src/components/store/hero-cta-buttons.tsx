import Link from "next/link";
import { Button } from "@/components/ui/button";

export const HERO_CTA_CLASS =
  "rounded-full border-0 bg-vite-purple! px-6 text-white transition-colors duration-200 hover:bg-neon-pink!";

export type HeroCtaVariant = "logo-catalog" | "catalog-text";

/** Slide 0 y 2: logo + catálogo. Slide 1: catálogo + personalizador de texto. */
export function getHeroCtaVariant(slideIndex: number): HeroCtaVariant {
  return slideIndex % 3 === 1 ? "catalog-text" : "logo-catalog";
}

interface HeroCtaButtonsProps {
  variant: HeroCtaVariant;
}

export function HeroCtaButtons({ variant }: HeroCtaButtonsProps) {
  if (variant === "catalog-text") {
    return (
      <>
        <Button asChild size="lg" className={HERO_CTA_CLASS}>
          <Link href="/productos">encuentra tu diseno personalizado</Link>
        </Button>
        <Button asChild size="lg" className={HERO_CTA_CLASS}>
          <Link href="/personalizar">Diseña un letrero de texto con neón</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <Button asChild size="lg" className={HERO_CTA_CLASS}>
        <Link href="/diseno-personalizado">Sube tu logotipo o gráfico</Link>
      </Button>
      <Button asChild size="lg" className={HERO_CTA_CLASS}>
        <Link href="/productos">encuentra tu diseno personalizado</Link>
      </Button>
    </>
  );
}
