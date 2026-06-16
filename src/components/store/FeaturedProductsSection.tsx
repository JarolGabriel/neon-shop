import { CatalogProductRow } from "@/components/store/CatalogProductRow";
import { getFeaturedProducts } from "@/lib/api";

const FEATURED_LIMIT = 24;

export async function FeaturedProductsSection() {
  try {
    const { data } = await getFeaturedProducts(FEATURED_LIMIT);
    if (data.length === 0) return null;

    return (
      <CatalogProductRow
        title="Productos"
        titleAccent="destacados"
        subtitle="Selección curada por el taller para inspirarte."
        carouselLabel="Productos destacados"
        products={data}
      />
    );
  } catch {
    return null;
  }
}
