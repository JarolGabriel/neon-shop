"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getActivePromotions } from "@/lib/api";
import { mapShowroomMobilePromos } from "@/lib/promotions";
import type { ShowroomPromoCard } from "@/types/promotion";
import { cn } from "@/lib/utils";

const FALLBACK_PROMOS: ShowroomPromoCard[] = [
  {
    id: "fallback-text",
    title: "Diseña tu letrero con texto",
    description: "Escribe tu frase, elige fuente y color en segundos.",
    imageUrl: "/images/como-funciona/como-funciona1.webp",
    href: "/personalizar",
    linkText: "Diseñar",
  },
  {
    id: "fallback-logo",
    title: "Sube tu logo personalizado",
    description: "Cotiza un letrero a medida con tu gráfico.",
    imageUrl: "/images/banner-footer-al-por-mayor.jpg",
    href: "/diseno-personalizado",
    linkText: "Cotizar",
  },
];

function MobilePromoCard({ promo }: { promo: ShowroomPromoCard }) {
  return (
    <Link
      href={promo.href}
      className={cn(
        "group relative flex w-[min(78vw,280px)] shrink-0 snap-center flex-col overflow-hidden rounded-xl border border-border bg-card",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={promo.imageUrl}
          alt={promo.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="280px"
        />
      </div>
      <div className="space-y-1 p-3">
        <h3
          className={cn(
            "font-heading text-sm font-bold text-foreground transition-colors",
            "group-hover:text-neon-pink! dark:group-hover:text-cyber-yellow!",
          )}
        >
          {promo.title}
          <ArrowUpRight className="ml-1 inline size-3.5 opacity-60" />
        </h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {promo.description}
        </p>
        <span className="text-xs font-medium text-neon-pink dark:text-cyber-yellow">
          {promo.linkText}
        </span>
      </div>
    </Link>
  );
}

export function ShowroomMobilePromos() {
  const [promos, setPromos] = useState<ShowroomPromoCard[]>(FALLBACK_PROMOS);

  useEffect(() => {
    let mounted = true;

    getActivePromotions()
      .then(({ data }) => {
        if (!mounted) return;
        const mapped = mapShowroomMobilePromos(data);
        if (mapped.length > 0) setPromos(mapped);
      })
      .catch(() => {
        if (mounted) setPromos(FALLBACK_PROMOS);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="lg:hidden">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Promociones
      </p>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 snap-x snap-mandatory">
        {promos.map((promo) => (
          <MobilePromoCard key={promo.id} promo={promo} />
        ))}
      </div>
    </div>
  );
}
