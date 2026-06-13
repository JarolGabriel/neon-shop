"use client";

import type { RefObject } from "react";
import type { UseFormReturn } from "react-hook-form";
import { ProductBasicFields } from "@/components/admin/products/ProductBasicFields";
import { ProductCatalogHelp } from "@/components/admin/products/ProductCatalogHelp";
import { ProductDetailFields } from "@/components/admin/products/ProductDetailFields";
import { ProductPricingFields } from "@/components/admin/products/ProductPricingFields";
import type { AdminProductUpdateInput } from "@/lib/schemas/admin-product";
import type { AdminCategory } from "@/types/admin";

interface ProductSharedFieldsProps {
  form: UseFormReturn<AdminProductUpdateInput>;
  categories: AdminCategory[];
  isSaving: boolean;
  slugEditedRef: RefObject<boolean>;
  showBestSeller?: boolean;
}

export function ProductSharedFields(props: ProductSharedFieldsProps) {
  return (
    <>
      <ProductCatalogHelp />
      <ProductBasicFields
        form={props.form}
        categories={props.categories}
        isSaving={props.isSaving}
        slugEditedRef={props.slugEditedRef}
      />
      <ProductPricingFields form={props.form} isSaving={props.isSaving} />
      <ProductDetailFields
        form={props.form}
        isSaving={props.isSaving}
        showBestSeller={props.showBestSeller}
      />
    </>
  );
}
