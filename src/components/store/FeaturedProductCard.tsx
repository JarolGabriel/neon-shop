import Link from "next/link";
import { Package } from "lucide-react";
import { resolvePublicStorageUrl } from "@/lib/storage-url";
import {
  cn,
  formatUsd,
  getProductDisplayPrice,
  sortProductImages,
} from "@/lib/utils";
import type { CatalogProduct } from "@/types/product";

interface FeaturedProductCardProps {
  product: CatalogProduct;
}

export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const images = sortProductImages(product.product_images);
  const imageUrl = resolvePublicStorageUrl(
    images[0]?.image_url ?? null,
  );
  const { price, showFromLabel } = getProductDisplayPrice(product);

  return (
    <Link
      href={`/productos/${product.slug}`}
      className={cn(
        "group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted",
        "transition-transform duration-200 hover:-translate-y-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={images[0]?.alt_text ?? product.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-muted">
          <Package
            className="size-10 text-muted-foreground/50"
            aria-hidden
          />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
        <h3
          className={cn(
            "line-clamp-2 font-heading text-sm font-bold leading-snug text-white transition-colors sm:text-base",
            "group-hover:text-neon-pink dark:group-hover:text-cyber-yellow",
          )}
        >
          {product.name}
        </h3>
        <p className="mt-1 text-xs font-semibold text-neon-pink sm:text-sm dark:text-cyber-yellow">
          {showFromLabel ? "Desde " : ""}
          {formatUsd(price)}
        </p>
      </div>
    </Link>
  );
}
