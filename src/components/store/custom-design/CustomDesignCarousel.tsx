"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { LOGO_DESIGN_IMAGES } from "@/components/store/custom-design/custom-design-images";
import { cn } from "@/lib/utils";

const CAROUSEL_SLIDES = [
  ...LOGO_DESIGN_IMAGES,
  ...LOGO_DESIGN_IMAGES,
  ...LOGO_DESIGN_IMAGES,
];

interface CustomDesignCarouselProps {
  className?: string;
}

export function CustomDesignCarousel({ className }: CustomDesignCarouselProps) {
  return (
    <section
      aria-label="Galería de diseños personalizados"
      className={cn("w-full", className)}
    >
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
        plugins={[
          Autoplay({
            delay: 2200,
            stopOnInteraction: false,
            stopOnMouseEnter: false,
            playOnInit: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-2 sm:-ml-3">
          {CAROUSEL_SLIDES.map((src, index) => (
            <CarouselItem
              key={`${src}-${index}`}
              className="basis-1/4 pl-2 sm:basis-1/4 sm:pl-3 lg:basis-1/6"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg border border-border/50 bg-neon-surface shadow-sm">
                <Image
                  src={src}
                  alt={`Ejemplo de diseño personalizado ${(index % LOGO_DESIGN_IMAGES.length) + 1}`}
                  fill
                  sizes="(max-width: 1024px) 25vw, 16vw"
                  className="object-contain p-1"
                  priority={index < 4}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
