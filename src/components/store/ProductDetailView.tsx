"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { ProductDetailGallery } from "@/components/store/ProductDetailGallery";
import { ProductInfo } from "@/components/store/ProductInfo";
import { PaymentInfoCard } from "@/components/store/PaymentInfoCard";
import { ProductSpecs } from "@/components/store/ProductSpecs";
import { useProductVariants } from "@/hooks/useProductVariants";
import type { ProductDetail } from "@/types/product";

interface ProductDetailViewProps {
  product: ProductDetail;
  whatsappNumber: string;
}

function sortImages(images: ProductDetail["images"]) {
  return [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });
}

export function ProductDetailView({
  product,
  whatsappNumber,
}: ProductDetailViewProps) {
  const images = sortImages(product.images);
  const selection = useProductVariants(product);
  const [activeImage, setActiveImage] = useState(0);

  // Al cambiar de color, sincronizamos la imagen principal con esa variante.
  const handleSelectColor = useCallback(
    (key: string) => {
      selection.selectColor(key);
      const index = selection.colors.findIndex((c) => c.key === key);
      if (index >= 0 && images.length > 0) {
        setActiveImage(index % images.length);
      }
    },
    [selection, images.length],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Inicio
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href="/productos"
          className="transition-colors hover:text-foreground"
        >
          Productos
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <ProductDetailGallery
            images={images}
            productName={product.name}
            activeIndex={activeImage}
            onActiveIndexChange={setActiveImage}
          />
          {/* En desktop especificaciones y pago viven aquí; en móvil van tras el acordeón. */}
          <div className="hidden md:flex md:flex-col md:gap-6">
            <ProductSpecs />
            <PaymentInfoCard />
          </div>
        </div>

        <ProductInfo
          product={product}
          whatsappNumber={whatsappNumber}
          selection={selection}
          onSelectColor={handleSelectColor}
        />
      </div>
    </section>
  );
}
