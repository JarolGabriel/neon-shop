"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductCardSkeleton } from "@/components/store/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/context/FavoritesContext";

const GRID_CLASS = "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4";

export function FavoritesGrid() {
  const { favorites, isLoading, fetchFavorites } = useFavorites();

  if (isLoading) {
    return (
      <ul className={GRID_CLASS}>
        {Array.from({ length: 4 }, (_, index) => (
          <li key={index}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center">
        <Heart
          className="size-16 text-muted-foreground"
          aria-hidden="true"
        />
        <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
          Aún no tienes favoritos
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Pulsa el corazón en cualquier producto para guardarlo aquí y
          encontrarlo rápido.
        </p>
        <Button
          asChild
          className="mt-6 rounded-full bg-vite-purple text-primary-foreground hover:bg-vite-purple/90"
        >
          <Link href="/productos">Explorar catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <ul className={GRID_CLASS}>
        {favorites.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => void fetchFavorites()}
        >
          Actualizar lista
        </Button>
      </div>
    </>
  );
}
