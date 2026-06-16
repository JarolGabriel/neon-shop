"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { getFeaturedProducts } from "@/lib/api";
import type { CatalogProduct } from "@/types/product";

const FEATURED_LIMIT = 6;

export function ShowroomFeaturedProductsMobile() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void getFeaturedProducts(FEATURED_LIMIT)
      .then(({ data }) => {
        if (active) setProducts(data.slice(0, FEATURED_LIMIT));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (isLoading || products.length === 0) return null;

  return (
    <section className="space-y-3 lg:hidden">
      <div className="flex items-end justify-between gap-3">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Productos{" "}
          <span className="text-neon-pink transition-colors duration-200 dark:text-cyber-yellow">
            destacados
          </span>
        </h2>
        <Link
          href="/productos"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-neon-pink! dark:hover:text-cyber-yellow!"
        >
          Ver catálogo
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <ul className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory">
        {products.map((product) => (
          <li
            key={product.id}
            className="w-[min(72vw,220px)] shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
