"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ShowcaseBadge = "FEATURE" | "CUSTOM" | "PREMIUM" | "NEW" | "LIVE";

interface ShowcaseItem {
  id: string;
  imageSrc: string;
  alt: string;
  badge: ShowcaseBadge;
  gridClass?: string;
  imageClass?: string;
  quality?: number;
  unoptimized?: boolean;
  sizes?: string;
}

const LEFT_ITEMS: ShowcaseItem[] = [
  {
    id: "charleys",
    imageSrc: "/images/gallery-charleys-steak.jpg",
    alt: "Letrero de neón Charley's Steak",
    badge: "FEATURE",
    gridClass: "md:col-start-1 md:row-start-1",
  },
  {
    id: "patron",
    imageSrc: "/images/gallery-patron-neon.jpg",
    alt: "Letrero de neón Patrón",
    badge: "CUSTOM",
    gridClass: "md:col-start-1 md:row-start-2",
  },
];

const CENTER_STACK_ITEMS: ShowcaseItem[] = [
  {
    id: "open",
    imageSrc: "/images/gallery-open.webp",
    alt: 'Letrero de neón "Open"',
    badge: "NEW",
    imageClass: "object-cover object-center",
    quality: 90,
    sizes: "(max-width: 768px) 85vw, 400px",
  },
  {
    id: "mikes",
    imageSrc: "/images/gallery-mikes-honey.jpg",
    alt: "Letrero de neón Mike's Hot Honey",
    badge: "PREMIUM",
  },
  {
    id: "play-game",
    imageSrc: "/images/gallery-play-game.jpg",
    alt: "Letrero de neón Play Game",
    badge: "LIVE",
    imageClass: "object-cover object-center",
    quality: 100,
    sizes: "(max-width: 768px) 85vw, 420px",
  },
];

const RIGHT_ITEMS: ShowcaseItem[] = [
  {
    id: "volcan",
    imageSrc: "/images/gallery-volcan-tequila.jpg",
    alt: "Letrero de neón Volcán de mi Tierra",
    badge: "CUSTOM",
    gridClass: "md:col-start-3 md:row-start-1",
  },
  {
    id: "bacardi",
    imageSrc: "/images/gallery-bacardi-neon.jpg",
    alt: "Letrero de neón Bacardi",
    badge: "FEATURE",
    gridClass: "md:col-start-3 md:row-start-2",
  },
];

const MOBILE_SLIDER_ITEMS: ShowcaseItem[] = [
  ...LEFT_ITEMS,
  ...CENTER_STACK_ITEMS,
  ...RIGHT_ITEMS,
];

const CARD_SHELL =
  "shadow-[-4px_8px_16px_-10px] shadow-neon-pink/10 transition-shadow duration-300 dark:shadow-cyber-yellow/10 md:hover:shadow-[-6px_12px_22px_-8px] md:hover:shadow-neon-pink/16 dark:md:hover:shadow-cyber-yellow/14";

const HOVER_MOTION = {
  y: -8,
  rotateX: 4,
  rotateY: -5,
  scale: 1.02,
};

interface ShowcaseCardProps {
  item: ShowcaseItem;
  variant?: "grid" | "compact" | "hero";
  className?: string;
}

function ShowcaseCard({ item, variant = "grid", className }: ShowcaseCardProps) {
  return (
    <motion.article
      className={cn(
        "group relative h-[min(72vw,280px)] w-[85vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-3xl border border-border bg-card/70 backdrop-blur-md",
        variant === "grid" &&
          "md:h-auto md:w-full md:max-w-none md:shrink md:aspect-square",
        variant === "compact" && "md:h-auto md:min-h-0 md:flex-1 md:w-full md:max-w-none",
        variant === "hero" && "md:aspect-square md:h-auto md:w-full md:max-w-none md:shrink-0",
        CARD_SHELL,
        item.gridClass,
        className,
      )}
      whileHover={HOVER_MOTION}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <span className="absolute top-3 left-3 z-10 rounded-md border border-border/70 bg-card/80 px-2 py-0.5 font-sans text-[10px] font-semibold tracking-[0.2em] text-foreground backdrop-blur-sm">
        {item.badge}
      </span>
      <div className="relative size-full min-h-[inherit]">
        <Image
          src={item.imageSrc}
          alt={item.alt}
          fill
          quality={item.quality ?? 80}
          unoptimized={item.unoptimized}
          sizes={item.sizes ?? "(max-width: 768px) 85vw, 33vw"}
          className={cn("object-cover object-center", item.imageClass)}
        />
      </div>
    </motion.article>
  );
}

function CenterColumnStack() {
  const [openBanner, mikes, playGame] = CENTER_STACK_ITEMS;

  return (
    <div className="flex h-full flex-col gap-4 md:col-start-2 md:row-span-2 md:row-start-1">
      <ShowcaseCard item={openBanner} variant="compact" />
      <ShowcaseCard item={mikes} variant="hero" />
      <ShowcaseCard item={playGame} variant="compact" />
    </div>
  );
}

export function CustomShowcase() {
  return (
    <section
      className="relative w-full py-14 md:mx-auto md:max-w-6xl md:px-4 md:py-20"
      aria-label="Galería de carteles personalizados"
    >
      <header className="mb-8 px-4 text-center md:mb-10">
        <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">
          Carteles de neón personalizados para tu negocio
        </h2>
        <Link
          href="/diseño-personalizado"
          className="mt-3 inline-block text-sm font-medium text-foreground underline underline-offset-4 transition-colors duration-200 hover:text-neon-pink! dark:hover:text-cyber-yellow!"
        >
          Consigue un presupuesto GRATIS
        </Link>
      </header>

      <div className="flex gap-4 overflow-x-auto px-4 pb-2 [perspective:1200px] snap-x snap-mandatory scrollbar-none md:hidden">
        {MOBILE_SLIDER_ITEMS.map((item) => (
          <ShowcaseCard key={item.id} item={item} />
        ))}
      </div>

      <div className="hidden [perspective:1200px] md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] md:grid-rows-2 md:gap-4">
        {LEFT_ITEMS.map((item) => (
          <ShowcaseCard key={item.id} item={item} />
        ))}
        <CenterColumnStack />
        {RIGHT_ITEMS.map((item) => (
          <ShowcaseCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
