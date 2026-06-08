export type ShowcaseBadge = "FEATURE" | "CUSTOM" | "PREMIUM" | "NEW" | "LIVE";

export interface ShowcaseGalleryItem {
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

export const SHOWCASE_LEFT_ITEMS: ShowcaseGalleryItem[] = [
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

export const SHOWCASE_CENTER_ITEMS: ShowcaseGalleryItem[] = [
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

export const SHOWCASE_RIGHT_ITEMS: ShowcaseGalleryItem[] = [
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

export const SHOWCASE_ALL_ITEMS: ShowcaseGalleryItem[] = [
  ...SHOWCASE_LEFT_ITEMS,
  ...SHOWCASE_CENTER_ITEMS,
  ...SHOWCASE_RIGHT_ITEMS,
];

/** Layout móvil: 2 carteles apilados a la izquierda + 1 alto a la derecha */
export const SHOWCASE_MOBILE_COMPARE_LEFT: ShowcaseGalleryItem[] = [
  SHOWCASE_LEFT_ITEMS[0],
  SHOWCASE_LEFT_ITEMS[1],
];

export const SHOWCASE_MOBILE_COMPARE_HERO: ShowcaseGalleryItem =
  SHOWCASE_CENTER_ITEMS[1];
