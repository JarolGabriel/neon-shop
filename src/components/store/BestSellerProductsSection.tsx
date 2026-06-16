import { CatalogProductRow } from "@/components/store/CatalogProductRow";
import { getHighlightedProducts } from "@/lib/api";

const HIGHLIGHTED_LIMIT = 24;

export async function BestSellerProductsSection() {
  try {
    const { data } = await getHighlightedProducts(HIGHLIGHTED_LIMIT);
    if (data.length === 0) return null;

    return (
      <CatalogProductRow
        title="Más"
        titleAccent="vendidos"
        subtitle="Los letreros más vendidos de esta temporada."
        carouselLabel="Productos más vendidos"
        products={data}
      />
    );
  } catch {
    return null;
  }
}
