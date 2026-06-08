"use client";

import { useEffect, useState } from "react";
import { RecentProductsSkeleton } from "@/components/store/RecentProductsSkeleton";
import { RecentlyViewed } from "@/components/store/RecentlyViewed";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { getProductsBySlugs } from "@/lib/api";
import type { CatalogProduct } from "@/types/product";

export function RecentlyViewedClient({
  currentSlug,
}: {
  currentSlug?: string;
}) {
  const { slugs, ready } = useRecentlyViewed(currentSlug);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;

    if (slugs.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);

    getProductsBySlugs(slugs)
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ready, slugs]);

  if (!ready) return null;
  if (isLoading && slugs.length > 0) return <RecentProductsSkeleton />;
  if (products.length === 0) return null;

  return <RecentlyViewed products={products} />;
}
