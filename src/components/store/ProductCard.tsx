import Link from "next/link";
import { ProductCardShell } from "@/components/store/ProductCardShell";
import { ProductColorSwatches } from "@/components/store/ProductColorSwatches";
import { ProductImageGallery } from "@/components/store/ProductImageGallery";
import { ProductPrice } from "@/components/store/ProductPrice";
import { ProductRating } from "@/components/store/ProductRating";
import {
  getDiscountPercent,
  getProductDisplayPrice,
  getUniqueVariantColors,
  sortProductImages,
} from "@/lib/utils";
import type { CatalogProduct } from "@/types/product";

interface ProductCardProps {
  product: CatalogProduct;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const images = sortProductImages(product.product_images);
  const { price, compareAtPrice, showFromLabel } =
    getProductDisplayPrice(product);
  const discountPercent = getDiscountPercent(price, compareAtPrice);
  const { swatches, overflowCount } = getUniqueVariantColors(
    product.product_variants,
  );

  return (
    <ProductCardShell className={className}>
      <ProductImageGallery
        images={images}
        productName={product.name}
        productId={product.id}
        discountPercent={discountPercent}
        href={`/productos/${product.slug}`}
      />

      <Link
        href={`/productos/${product.slug}`}
        className="flex flex-1 flex-col gap-1.5 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:gap-2 sm:p-4"
      >
        <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-foreground sm:text-sm">
          {product.name}
        </h3>

        <ProductRating reviewCount={product.sales_count} />

        <ProductPrice
          price={price}
          compareAtPrice={compareAtPrice}
          showFromLabel={showFromLabel}
        />

        <ProductColorSwatches
          swatches={swatches}
          overflowCount={overflowCount}
          className="mt-auto pt-1"
        />
      </Link>
    </ProductCardShell>
  );
}
