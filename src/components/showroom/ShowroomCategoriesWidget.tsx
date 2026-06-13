"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { getCategories } from "@/lib/api";
import {
  SHOWROOM_CATEGORIES_PREVIEW,
  categoryToHashtag,
} from "@/lib/showroom-utils";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/api";

function CategoryLink({ category }: { category: Category }) {
  return (
    <li>
      <Link
        href={`/productos?category=${encodeURIComponent(category.slug)}`}
        className={cn(
          "flex items-center justify-between rounded-lg px-2 py-2 text-sm text-foreground transition-colors",
          "hover:bg-muted hover:text-neon-pink! dark:hover:text-cyber-yellow!",
        )}
      >
        <span>{categoryToHashtag(category.slug)}</span>
        <ArrowUpRight className="size-3.5 text-muted-foreground" />
      </Link>
    </li>
  );
}

export function ShowroomCategoriesWidget() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let active = true;

    void getCategories()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch(() => {
        if (active) setCategories([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const hasHiddenCategories = categories.length > SHOWROOM_CATEGORIES_PREVIEW;
  const visibleCategories = expanded
    ? categories
    : categories.slice(0, SHOWROOM_CATEGORIES_PREVIEW);
  const hiddenCount = Math.max(categories.length - SHOWROOM_CATEGORIES_PREVIEW, 0);

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="font-heading text-base font-bold text-foreground">
        #categorías
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Explora letreros por tipo
      </p>

      {isLoading ? (
        <div className="mt-4 space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-8 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No hay categorías disponibles.
        </p>
      ) : (
        <>
          <ul className="mt-4 space-y-1">
            {visibleCategories.map((category) => (
              <CategoryLink key={category.id} category={category} />
            ))}
          </ul>

          {hasHiddenCategories ? (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className={cn(
                "mt-3 flex w-full items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-neon-pink! dark:hover:text-cyber-yellow!",
              )}
            >
              {expanded ? (
                <>
                  Ver menos
                  <ChevronUp className="size-3.5" />
                </>
              ) : (
                <>
                  Ver más ({hiddenCount})
                  <ChevronDown className="size-3.5" />
                </>
              )}
            </button>
          ) : null}
        </>
      )}
    </section>
  );
}
