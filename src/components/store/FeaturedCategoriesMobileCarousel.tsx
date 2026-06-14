"use client";

import { ShowroomCategoriesCarousel } from "@/components/showroom/ShowroomCategoriesCarousel";
import type { CategoryWithCount } from "@/lib/api";

interface FeaturedCategoriesMobileCarouselProps {
  categories: CategoryWithCount[];
}

export function FeaturedCategoriesMobileCarousel({
  categories,
}: FeaturedCategoriesMobileCarouselProps) {
  return (
    <ShowroomCategoriesCarousel categories={categories} visibleCount={2} />
  );
}
