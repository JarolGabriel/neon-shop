import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToTop } from "@/components/store/BackToTop";
import { FeaturesGrid } from "@/components/store/FeaturesGrid";
import { ProductDetailView } from "@/components/store/ProductDetailView";
import { ReviewsSection } from "@/components/store/reviews/ReviewsSection";
import { MarqueeBanner } from "@/components/ui/marquee-banner";
import { getProductBySlug, getSiteSettings } from "@/lib/api";
import { buildPageMetadata } from "@/lib/metadata-utils";
import { getStoreNameFromDb } from "@/lib/site-settings-server";
import { interpolateStoreName } from "@/lib/store-branding";
import {
  getWhatsappNumberFromSettings,
  isWhatsappConfigured,
} from "@/lib/whatsapp-utils";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const storeName = await getStoreNameFromDb();

  if (!product) {
    return buildPageMetadata("Producto no encontrado", storeName);
  }

  const description = interpolateStoreName(
    product.short_description ??
      product.description ??
      `Compra ${product.name} en {{store_name}}.`,
    storeName,
  );
  const image =
    product.images?.find((img) => img.is_primary)?.image_url ??
    product.images?.[0]?.image_url;

  return buildPageMetadata(product.name, storeName, {
    description,
    openGraph: {
      description,
      type: "website",
      images: image ? [{ url: image }] : [],
    },
  });
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
        whatsappNumber={getWhatsappNumberFromSettings(settings)}
        whatsappConfigured={isWhatsappConfigured(settings)}
      />
      <MarqueeBanner />
      <FeaturesGrid />
      <ReviewsSection productId={product.id} />
      <BackToTop />
    </>
  );
}
