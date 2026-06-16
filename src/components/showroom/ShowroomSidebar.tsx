"use client";

import { ShowroomCategoriesWidget } from "./ShowroomCategoriesWidget";
import { ShowroomFeaturedProduct } from "./ShowroomFeaturedProduct";
import { ShowroomHighlightedProducts } from "./ShowroomHighlightedProducts";

export function ShowroomSidebar() {
  return (
    <aside className="hidden xl:block xl:-mt-1">
      <div className="sticky top-20 space-y-4">
        <ShowroomFeaturedProduct />
        <ShowroomHighlightedProducts />
        <ShowroomCategoriesWidget />
      </div>
    </aside>
  );
}
