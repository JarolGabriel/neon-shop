"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Search,
  SearchX,
  Zap,
} from "lucide-react";
import { CategoryImage } from "@/components/shared/CategoryImage";
import { getCategories, getProducts } from "@/lib/api";
import { formatUsd, getProductDisplayPrice } from "@/lib/utils";
import type { CatalogProduct } from "@/types/product";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryResult {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

function getProductImage(
  product: CatalogProduct,
): { url: string; alt: string } | null {
  const images = product.product_images;
  if (!images?.length) return null;

  const image = images.find((item) => item.is_primary) ?? images[0];
  if (!image?.image_url) return null;

  return {
    url: image.image_url,
    alt: image.alt_text ?? product.name,
  };
}

function SearchResultSkeleton() {
  return (
    <div className="flex gap-3 p-3">
      <div className="size-12 shrink-0 animate-pulse rounded-lg bg-muted" />
      <div className="flex flex-1 flex-col justify-center gap-2">
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-2.5 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

interface CategoryResultItemProps {
  category: CategoryResult;
  onClose: () => void;
}

function CategoryResultItem({ category, onClose }: CategoryResultItemProps) {
  return (
    <Link
      href={`/productos?category=${encodeURIComponent(category.slug)}`}
      onClick={onClose}
      className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/60"
    >
      <CategoryImage
        src={category.image_url}
        alt={category.name}
        variant="thumb"
        className="size-10"
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{category.name}</p>
        <p className="text-xs text-muted-foreground transition-colors group-hover:text-neon-pink dark:group-hover:text-cyber-yellow">
          Ver colección →
        </p>
      </div>

      <span className="shrink-0 rounded-full bg-vite-purple/20 px-2 py-0.5 text-[10px] text-vite-purple dark:bg-cyber-yellow/10 dark:text-cyber-yellow">
        Categoría
      </span>
    </Link>
  );
}

interface SearchResultItemProps {
  product: CatalogProduct;
  onClose: () => void;
}

function SearchResultItem({ product, onClose }: SearchResultItemProps) {
  const image = getProductImage(product);
  const { price } = getProductDisplayPrice(product);

  return (
    <Link
      href={`/productos/${product.slug}`}
      onClick={onClose}
      className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/60"
    >
      {image ? (
        <Image
          src={image.url}
          alt={image.alt}
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Zap className="size-5 text-cyber-yellow" aria-hidden="true" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {product.name}
        </p>
        {product.categories?.name ? (
          <p className="text-xs text-muted-foreground">
            {product.categories.name}
          </p>
        ) : null}
        <p className="text-xs font-bold text-foreground dark:text-cyber-yellow">
          {formatUsd(price)}
        </p>
      </div>

      <ArrowUpRight
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
    </Link>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-1 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogProduct[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryResult[]>([]);
  const [matchedCategories, setMatchedCategories] = useState<CategoryResult[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFetchedCategories = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setMatchedCategories([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || hasFetchedCategories.current) return;

    void getCategories()
      .then((data) => {
        setAllCategories(
          data
            .filter((category) => category.is_active !== false)
            .map((category) => ({
              id: category.id,
              name: category.name,
              slug: category.slug,
              image_url: category.image_url,
            })),
        );
        hasFetchedCategories.current = true;
      })
      .catch(() => {
        /* silencioso, no crítico */
      });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setMatchedCategories([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(() => {
      void (async () => {
        setIsLoading(true);

        const q = trimmed.toLowerCase();
        const catMatches = allCategories
          .filter((category) => category.name.toLowerCase().includes(q))
          .slice(0, 3);

        if (!cancelled) setMatchedCategories(catMatches);

        try {
          const { data } = await getProducts({ search: trimmed, limit: 5 });
          if (!cancelled) {
            setResults(data);
            setHasSearched(true);
          }
        } catch {
          if (!cancelled) {
            setResults([]);
            setHasSearched(true);
          }
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, allCategories, isOpen]);

  const trimmedQuery = query.trim();
  const showInitial = trimmedQuery.length < 2;
  const showEmpty =
    hasSearched &&
    !isLoading &&
    matchedCategories.length === 0 &&
    results.length === 0;
  const showCategorySection = matchedCategories.length > 0;
  const showDivider = showCategorySection && results.length > 0 && !isLoading;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="search-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Buscar productos y categorías"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm sm:pt-[15vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="mx-4 w-full max-w-xl rounded-2xl border border-border bg-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <Search className="size-5 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Busca tu letrero neón..."
                className="flex-1 border-0 bg-transparent text-base text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                autoComplete="off"
                aria-label="Buscar productos y categorías"
              />
              <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
                Esc
              </kbd>
            </div>

            <div className="border-t border-border" />

            <div className="max-h-80 overflow-y-auto p-2">
              {showInitial ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <Zap
                    className="size-8 text-cyber-yellow/50"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-muted-foreground">
                    Escribe para buscar
                  </p>
                </div>
              ) : null}

              {!showInitial && showCategorySection ? (
                <div className="mb-1">
                  <SectionLabel>Categorías</SectionLabel>
                  <ul className="space-y-0.5">
                    {matchedCategories.map((category) => (
                      <li key={category.id}>
                        <CategoryResultItem
                          category={category}
                          onClose={onClose}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {!showInitial && showDivider ? (
                <div className="my-2 border-t border-border" />
              ) : null}

              {!showInitial && isLoading ? (
                <div className="space-y-1">
                  <SectionLabel>Productos</SectionLabel>
                  {Array.from({ length: 3 }, (_, index) => (
                    <SearchResultSkeleton key={index} />
                  ))}
                </div>
              ) : null}

              {!showInitial && showEmpty ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <SearchX
                    className="size-8 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-foreground">
                    Sin resultados para &ldquo;{trimmedQuery}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Intenta con otro término
                  </p>
                </div>
              ) : null}

              {!showInitial && !isLoading && results.length > 0 ? (
                <>
                  <SectionLabel>Productos</SectionLabel>
                  <ul className="space-y-0.5">
                    {results.map((product) => (
                      <li key={product.id}>
                        <SearchResultItem product={product} onClose={onClose} />
                      </li>
                    ))}
                  </ul>

                  <div className="mt-1 border-t border-border pt-2">
                    <Link
                      href={`/productos?search=${encodeURIComponent(trimmedQuery)}`}
                      onClick={onClose}
                      className="block py-2 text-center text-xs text-muted-foreground transition-colors hover:text-neon-pink dark:hover:text-cyber-yellow"
                    >
                      Ver todos los resultados para &ldquo;{trimmedQuery}&rdquo; →
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
