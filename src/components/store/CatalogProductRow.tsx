import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CatalogProductsCarousel } from "@/components/store/CatalogProductsCarousel";
import { Button } from "@/components/ui/button";
import type { CatalogProduct } from "@/types/product";

interface CatalogProductRowProps {
  title: string;
  titleAccent: string;
  subtitle?: string;
  products: CatalogProduct[];
  carouselLabel: string;
  viewAllHref?: string;
}

export function CatalogProductRow({
  title,
  titleAccent,
  subtitle,
  products,
  carouselLabel,
  viewAllHref = "/productos",
}: CatalogProductRowProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-background py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              {title}{" "}
              <span className="text-neon-pink transition-colors duration-200 dark:text-cyber-yellow">
                {titleAccent}
              </span>
            </h2>
            {subtitle ? (
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {subtitle}
              </p>
            ) : null}
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-border hover:border-vite-purple! dark:hover:border-cyber-yellow!"
          >
            <Link href={viewAllHref}>
              Ver catálogo
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="w-full min-w-0 overflow-hidden">
          <CatalogProductsCarousel
            products={products}
            ariaLabel={carouselLabel}
          />
        </div>
      </div>
    </section>
  );
}
