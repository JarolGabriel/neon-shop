"use client";

import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductCardSkeleton } from "@/components/store/ProductCardSkeleton";
import { StickySidebar } from "@/components/store/StickySidebar";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/api";
import type { CatalogProduct, CatalogProductsMeta } from "@/types/product";

const PAGE_SIZE = 12;

const GRID_CLASS = "grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3";

export function ProductGrid() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [meta, setMeta] = useState<CatalogProductsMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async (targetPage: number) => {
    const isFirstPage = targetPage === 1;
    if (isFirstPage) setIsLoading(true);
    else setIsLoadingMore(true);
    setError(null);

    try {
      const response = await getProducts({
        page: targetPage,
        limit: PAGE_SIZE,
        sort: "best_seller",
      });

      setProducts((prev) =>
        isFirstPage ? response.data : [...prev, ...response.data],
      );
      setMeta(response.meta);
      setPage(targetPage);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No pudimos cargar los productos. Intenta de nuevo.";
      setError(message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  return (
    <section className="border-t border-border bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">
            Explora todos nuestros carteles
          </h2>
          <p className="mt-2 text-muted-foreground">
            Ilumina tu espacio con el brillo perfecto.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1" aria-label="Productos más vendidos">
            <StickySidebar />
          </aside>

          <div className="lg:col-span-3">
            {isLoading ? (
              <ul className={GRID_CLASS}>
                {Array.from({ length: PAGE_SIZE }, (_, i) => (
                  <li key={i}>
                    <ProductCardSkeleton />
                  </li>
                ))}
              </ul>
            ) : error && products.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="max-w-md text-muted-foreground">{error}</p>
                <Button
                  variant="outline"
                  className="border-border"
                  onClick={() => loadPage(1)}
                >
                  Reintentar
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

                {meta?.has_more ? (
                  <div className="mt-12 flex justify-center">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full border-border px-8 hover:border-vite-purple! dark:hover:border-cyber-yellow!"
                      disabled={isLoadingMore}
                      onClick={() => loadPage(page + 1)}
                    >
                      {isLoadingMore ? "Cargando…" : "Cargar más"}
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
