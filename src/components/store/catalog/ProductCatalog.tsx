"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BackToTop } from "@/components/store/BackToTop";
import { CatalogFiltersPanel } from "@/components/store/catalog/CatalogFiltersPanel";
import { CatalogPagination } from "@/components/store/catalog/CatalogPagination";
import { CatalogToolbar } from "@/components/store/catalog/CatalogToolbar";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductCardSkeleton } from "@/components/store/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import {
  CATALOG_PAGE_SIZE,
  useCatalogProducts,
} from "@/hooks/useCatalogProducts";
import { getCategories } from "@/lib/api";

const GRID_CLASS =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3";

export function ProductCatalog() {
  const {
    filters,
    products,
    meta,
    isLoading,
    error,
    updateFilters,
    refetch,
    clearAllFilters,
  } = useCatalogProducts();
  const [categoryName, setCategoryName] = useState<string | undefined>();

  useEffect(() => {
    if (!filters.category) {
      setCategoryName(undefined);
      return;
    }

    getCategories()
      .then((categories) => {
        const match = categories.find(
          (category) => category.slug === filters.category,
        );
        setCategoryName(match?.name);
      })
      .catch(() => setCategoryName(undefined));
  }, [filters.category]);

  const totalItems = meta?.total_items ?? 0;

  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CatalogToolbar
          filters={filters}
          totalItems={totalItems}
          categoryName={categoryName}
          onFiltersChange={updateFilters}
          onClearAll={clearAllFilters}
        />

        <div className="mt-8 flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-20 rounded-xl border border-border bg-neon-surface p-4">
              <CatalogFiltersPanel
                filters={filters}
                onFiltersChange={updateFilters}
                onClearAll={clearAllFilters}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {isLoading ? (
              <ul className={GRID_CLASS}>
                {Array.from({ length: CATALOG_PAGE_SIZE }, (_, index) => (
                  <li key={index}>
                    <ProductCardSkeleton />
                  </li>
                ))}
              </ul>
            ) : error ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-muted-foreground">{error}</p>
                <Button
                  variant="outline"
                  className="rounded-full border-border"
                  onClick={refetch}
                >
                  Reintentar
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-muted-foreground">
                  No encontramos productos con estos filtros.
                </p>
                <Button
                  variant="outline"
                  className="rounded-full border-border hover:border-neon-pink! hover:text-neon-pink! dark:hover:border-cyber-yellow! dark:hover:text-cyber-yellow!"
                  asChild
                >
                  <Link href="/productos">Ver todos</Link>
                </Button>
              </div>
            ) : (
              <>
                <ul className={GRID_CLASS}>
                  {products.map((product) => (
                    <li key={product.id}>
                      <ProductCard product={product} />
                    </li>
                  ))}
                </ul>

                <div className="mt-12 border-t border-border/40 pt-10">
                  <CatalogPagination
                    page={meta?.page ?? filters.page}
                    totalPages={meta?.total_pages ?? 1}
                  />
                  <BackToTop className="mt-12 pb-10" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
