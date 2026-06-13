import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturedCategoryCard } from "@/components/store/FeaturedCategoryCard";
import { Button } from "@/components/ui/button";
import { getFeaturedCategories } from "@/lib/api";

export async function FeaturedCategoriesSection() {
  let categories: Awaited<ReturnType<typeof getFeaturedCategories>> = [];

  try {
    categories = await getFeaturedCategories();
  } catch {
    return null;
  }

  if (categories.length === 0) return null;

  return (
    <section className="border-t border-border bg-background py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Categorías{" "}
              <span className="text-neon-pink transition-colors duration-200 dark:text-cyber-yellow">
                destacadas
              </span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Explora por estilo y encuentra el letrero perfecto para tu espacio.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-border hover:border-vite-purple! dark:hover:border-cyber-yellow!"
          >
            <Link href="/productos">
              Ver catálogo
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => (
            <li key={category.id}>
              <FeaturedCategoryCard category={category} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
