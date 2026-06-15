"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { useStoreName } from "@/context/SiteBrandingContext";
import { formatUsd, getProductDisplayPrice } from "@/lib/utils";
import type { CatalogProduct } from "@/types/product";

const FEATURED_COUNT = 5;
const ROTATION_MS = 8000;

function getProductImage(product: CatalogProduct): string | null {
  const primary = product.product_images.find((image) => image.is_primary);
  return primary?.image_url ?? product.product_images[0]?.image_url ?? null;
}

export function ShowroomFeaturedProduct() {
  const storeName = useStoreName();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void getProducts({ limit: FEATURED_COUNT, sort: "best_seller" })
      .then(({ data }) => {
        if (active) setProducts(data.slice(0, FEATURED_COUNT));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (products.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        let next = Math.floor(Math.random() * products.length);
        if (next === current) next = (current + 1) % products.length;
        return next;
      });
    }, ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [products.length]);

  const activeProduct = useMemo(
    () => products[activeIndex] ?? null,
    [products, activeIndex],
  );

  if (isLoading) {
    return (
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
      </section>
    );
  }

  if (!activeProduct) return null;

  const imageUrl = getProductImage(activeProduct);

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
        <h2 className="font-heading text-base font-bold text-foreground">
          Destacado ahora
        </h2>
      </div>

      <Link
        href={`/productos/${activeProduct.slug}`}
        className="mt-4 block overflow-hidden rounded-lg border border-border transition-colors hover:border-neon-pink/40 dark:hover:border-cyber-yellow/40"
      >
        <div className="relative aspect-[16/10] bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={activeProduct.name}
              fill
              className="object-cover"
              sizes="320px"
            />
          ) : null}
        </div>
        <div className="space-y-1 p-3">
          <p className="font-heading text-sm font-bold text-foreground">
            {activeProduct.name}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {activeProduct.short_description ??
              `Letrero personalizado ${storeName}`}
          </p>
          <p className="text-sm font-semibold text-neon-pink dark:text-cyber-yellow">
            {formatUsd(getProductDisplayPrice(activeProduct).price)}
          </p>
        </div>
      </Link>
    </section>
  );
}
