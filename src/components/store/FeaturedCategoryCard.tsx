import Link from "next/link";
import { FolderTree } from "lucide-react";
import type { CategoryWithCount } from "@/lib/api";
import { resolvePublicStorageUrl } from "@/lib/storage-url";
import { cn } from "@/lib/utils";

interface FeaturedCategoryCardProps {
  category: CategoryWithCount;
}

export function FeaturedCategoryCard({ category }: FeaturedCategoryCardProps) {
  const href = `/productos?category=${encodeURIComponent(category.slug)}`;
  const imageUrl = resolvePublicStorageUrl(category.image_url);

  return (
    <Link
      href={href}
      className={cn(
        "group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-muted",
        "transition-transform duration-200 hover:-translate-y-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={category.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-muted">
          <FolderTree
            className="size-12 text-muted-foreground/50"
            aria-hidden
          />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
        <h3
          className={cn(
            "font-heading text-base font-bold text-white transition-colors sm:text-lg",
            "group-hover:text-neon-pink dark:group-hover:text-cyber-yellow",
          )}
        >
          {category.name}
        </h3>
        <p className="mt-1 text-xs text-white/80 sm:text-sm">
          {category.product_count}{" "}
          {category.product_count === 1 ? "producto" : "productos"}
        </p>
      </div>
    </Link>
  );
}
