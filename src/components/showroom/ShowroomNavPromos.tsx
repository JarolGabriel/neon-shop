"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShowroomNavPromoCardProps {
  href: string;
  title: string;
  description: string;
  buttonLabel: string;
  imageSrc: string;
  imageAlt: string;
}

function ShowroomNavPromoCard({
  href,
  title,
  description,
  buttonLabel,
  imageSrc,
  imageAlt,
}: ShowroomNavPromoCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <Link
        href={href}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="220px"
          />
        </div>

        <div className="space-y-2 p-3">
          <h3
            className={cn(
              "font-heading text-sm font-bold leading-snug text-foreground transition-colors",
              "group-hover:text-neon-pink! dark:group-hover:text-cyber-yellow!",
            )}
          >
            {title}
            <ArrowUpRight className="ml-1 inline size-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </Link>

      <div className="px-3 pb-3">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={href}>{buttonLabel}</Link>
        </Button>
      </div>
    </article>
  );
}

const PROMO_ITEMS = [
  {
    href: "/personalizar",
    title: "Diseña tu letrero de neón con texto",
    description:
      "Escribe tu frase, elige fuente y color. Previsualiza tu cartel en segundos.",
    buttonLabel: "Diseñar con texto",
    imageSrc: "/images/como-funciona/como-funciona1.webp",
    imageAlt: "Ejemplo de letrero de neón con texto personalizado",
  },
  {
    href: "/diseno-personalizado",
    title: "Haz tu diseño personalizado con tu logo",
    description:
      "Sube tu logo o gráfico y te ayudamos a cotizar tu letrero a medida.",
    buttonLabel: "Subir mi logo",
    imageSrc: "/images/banner-footer-al-por-mayor.jpg",
    imageAlt: "Ejemplo de diseño personalizado con logo para letrero neón",
  },
] as const;

export function ShowroomNavPromos() {
  return (
    <div className="space-y-3 pb-1">
      {PROMO_ITEMS.map((item) => (
        <ShowroomNavPromoCard key={item.href} {...item} />
      ))}
    </div>
  );
}
