import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCatalog } from "@/components/store/catalog/ProductCatalog";
import { ProductCardSkeleton } from "@/components/store/ProductCardSkeleton";
import { CATALOG_PAGE_SIZE } from "@/hooks/useCatalogProducts";

import { getDefaultPageMetadata } from "@/lib/metadata-utils";

export async function generateMetadata(): Promise<Metadata> {
  return getDefaultPageMetadata("Catálogo de letreros", {
    description:
      "Explora letreros de neón LED por categoría, color y tamaño. Filtra, compara y pide por WhatsApp.",
    openGraph: {
      description:
        "Carteles de neón listos y personalizados para tu negocio o hogar.",
      type: "website",
    },
  });
}

function CatalogFallback() {
  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 h-24 animate-pulse rounded-xl bg-muted" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: CATALOG_PAGE_SIZE }, (_, index) => (
            <li key={index}>
              <ProductCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <ProductCatalog />
    </Suspense>
  );
}
