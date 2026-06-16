"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHighlightedProducts } from "@/lib/api";
import { formatUsd, getProductDisplayPrice } from "@/lib/utils";
import type { CatalogProduct } from "@/types/product";

const HIGHLIGHTED_LIMIT = 4;

function getProductImage(product: CatalogProduct): string | null {
  const primary = product.product_images.find((image) => image.is_primary);
  return primary?.image_url ?? product.product_images[0]?.image_url ?? null;
}

export function ShowroomHighlightedProducts() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void getHighlightedProducts(HIGHLIGHTED_LIMIT)
      .then(({ data }) => {
        if (active) setProducts(data.slice(0, HIGHLIGHTED_LIMIT));
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
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="font-heading text-base font-bold text-foreground">
        Más{" "}
        <span className="text-neon-pink transition-colors duration-200 dark:text-cyber-yellow">
          vendidos
        </span>
      </h2>

      <ul className="mt-3 space-y-2">
        {products.map((product) => {
          const imageUrl = getProductImage(product);
          const { price } = getProductDisplayPrice(product);

          return (
            <li key={product.id}>
              <Link
                href={`/productos/${product.slug}`}
                className="flex items-center gap-3 rounded-lg border border-transparent p-1 transition-colors hover:border-neon-pink/30 dark:hover:border-cyber-yellow/30"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {product.name}
                  </p>
                  <p className="text-xs font-medium text-neon-pink dark:text-cyber-yellow">
                    {formatUsd(price)}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
