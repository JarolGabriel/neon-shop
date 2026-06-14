"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Percent, Sparkles, X } from "lucide-react";
import { ShowroomCategoriesCarousel } from "@/components/showroom/ShowroomCategoriesCarousel";
import { getFeaturedCategories, type CategoryWithCount } from "@/lib/api";
import { cn } from "@/lib/utils";

function CategoriesSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="aspect-[4/5] w-[calc((100%-1.5rem)/3)] shrink-0 animate-pulse rounded-2xl bg-muted"
          aria-hidden
        />
      ))}
    </div>
  );
}

export function ShowroomFeaturedCategories() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promoDismissed, setPromoDismissed] = useState(false);

  useEffect(() => {
    let mounted = true;

    getFeaturedCategories()
      .then((data) => {
        if (mounted) setCategories(data);
      })
      .catch(() => {
        if (mounted) setCategories([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!isLoading && categories.length === 0) {
    return (
      <div className="hidden lg:block">
        {!promoDismissed ? (
          <PromoDiscountBanner onDismiss={() => setPromoDismissed(true)} />
        ) : null}
      </div>
    );
  }

  return (
    <div className="hidden space-y-4 lg:block">
      {!promoDismissed ? (
        <PromoDiscountBanner onDismiss={() => setPromoDismissed(true)} />
      ) : null}

      <div>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Categorías{" "}
              <span className="text-neon-pink transition-colors duration-200 dark:text-cyber-yellow">
                destacadas
              </span>
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Explora por estilo y encuentra tu letrero ideal.
            </p>
          </div>
          <Link
            href="/productos"
            className={cn(
              "inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors",
              "hover:text-neon-pink! dark:hover:text-cyber-yellow!",
            )}
          >
            Ver catálogo
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <CategoriesSkeleton />
        ) : (
          <ShowroomCategoriesCarousel categories={categories} visibleCount={3} />
        )}
      </div>
    </div>
  );
}

interface PromoDiscountBannerProps {
  onDismiss: () => void;
}

function PromoDiscountBanner({ onDismiss }: PromoDiscountBannerProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-neon-pink/25 bg-gradient-to-r",
        "from-neon-pink/10 via-card to-vite-purple/10",
        "dark:border-cyber-yellow/25 dark:from-cyber-yellow/10",
      )}
    >
      <button
        type="button"
        onClick={onDismiss}
        className={cn(
          "absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full",
          "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        )}
        aria-label="Cerrar promoción"
      >
        <X className="size-4" />
      </button>

      <Link
        href="/productos"
        className={cn(
          "group flex items-center gap-3 p-4 pr-10 transition-colors",
          "hover:border-neon-pink/50 dark:hover:border-cyber-yellow/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            "bg-neon-pink/15 text-neon-pink dark:bg-cyber-yellow/15 dark:text-cyber-yellow",
          )}
          aria-hidden
        >
          <Percent className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-bold text-foreground">
            Promociones activas —{" "}
            <span className="text-neon-pink transition-colors duration-200 group-hover:underline dark:text-cyber-yellow">
              click aquí
            </span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Hasta 50% de descuento en letreros seleccionados. Revisa el catálogo
            antes de que se acaben.
          </p>
        </div>
        <Sparkles
          className="size-4 shrink-0 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      </Link>
    </div>
  );
}
