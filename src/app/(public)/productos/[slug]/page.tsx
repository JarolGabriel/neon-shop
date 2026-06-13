import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToTop } from "@/components/store/BackToTop";
import { FeaturesGrid } from "@/components/store/FeaturesGrid";
import { ProductDetailView } from "@/components/store/ProductDetailView";
import { ReviewsSection } from "@/components/store/reviews/ReviewsSection";
import { MarqueeBanner } from "@/components/ui/marquee-banner";
import { getProductBySlug, getSiteSettings } from "@/lib/api";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Producto no encontrado | Neon Shop" };
  }

  const description =
    product.short_description ??
    product.description ??
    `Compra ${product.name} en Neon Shop.`;
  const image =
    product.images?.find((img) => img.is_primary)?.image_url ??
    product.images?.[0]?.image_url;

  return {
    title: `${product.name} | Neon Shop`,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: image ? [{ url: image }] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetailView
        product={product}
        whatsappNumber={settings["whatsapp_number"] ?? ""}
      />
      <MarqueeBanner />
      <FeaturesGrid />
      <ReviewsSection productId={product.id} />
      <BackToTop />
    </>
  );
}
