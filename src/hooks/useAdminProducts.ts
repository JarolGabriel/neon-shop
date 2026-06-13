"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  addAdminProductImage,
  createAdminProduct,
  deleteAdminProduct,
  deleteAdminProductImage,
  getAdminProductById,
  getAdminProducts,
  updateAdminProduct,
} from "@/lib/admin-api";
import {
  buildProductCreateFormData,
  buildProductUpdatePayload,
} from "@/lib/admin-product-form";
import { resolvePublicStorageUrl } from "@/lib/storage-url";
import type {
  AdminProductCreateInput,
  AdminProductUpdateInput,
} from "@/lib/schemas/admin-product";
import type {
  AdminProduct,
  AdminProductsMeta,
  AdminProductsQuery,
} from "@/types/admin";

const DEFAULT_LIMIT = 10;

interface UseAdminProductsResult {
  products: AdminProduct[];
  meta: AdminProductsMeta;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createProduct: (values: AdminProductCreateInput) => Promise<AdminProduct>;
  updateProduct: (
    id: string,
    values: AdminProductUpdateInput,
  ) => Promise<AdminProduct>;
  deleteProduct: (id: string) => Promise<void>;
  addProductImage: (
    productId: string,
    file: File,
    options?: { altText?: string; isPrimary?: boolean },
  ) => Promise<AdminProduct>;
  deleteProductImage: (
    productId: string,
    imageId: string,
  ) => Promise<AdminProduct>;
  setProductImagePrimary: (
    productId: string,
    image: AdminProduct["product_images"][number],
  ) => Promise<AdminProduct>;
  fetchProduct: (id: string) => Promise<AdminProduct | null>;
}

export function useAdminProducts(
  filters: AdminProductsQuery,
): UseAdminProductsResult {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [meta, setMeta] = useState<AdminProductsMeta>({
    total_items: 0,
    page: 1,
    limit: DEFAULT_LIMIT,
    total_pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAdminProducts({
        page: filters.page ?? 1,
        limit: filters.limit ?? DEFAULT_LIMIT,
        search: filters.search,
        category_id: filters.category_id,
        stock_status: filters.stock_status,
      });
      setProducts(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar los productos",
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.category_id,
    filters.limit,
    filters.page,
    filters.search,
    filters.stock_status,
  ]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const reloadProduct = useCallback(async (productId: string) => {
    const product = await getAdminProductById(productId);
    if (product) {
      setProducts((current) =>
        current.map((item) => (item.id === productId ? product : item)),
      );
    }
    return product;
  }, []);

  const fetchProduct = useCallback(async (id: string) => {
    return getAdminProductById(id);
  }, []);

  const createProduct = useCallback(
    async (values: AdminProductCreateInput) => {
      setIsSaving(true);
      try {
        const response = await createAdminProduct(
          buildProductCreateFormData(values),
        );
        toast.success("Producto creado");
        await refresh();
        return response.product;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No se pudo crear el producto",
        );
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [refresh],
  );

  const updateProduct = useCallback(
    async (id: string, values: AdminProductUpdateInput) => {
      setIsSaving(true);
      try {
        await updateAdminProduct(id, buildProductUpdatePayload(values));
        toast.success("Producto actualizado");
        await refresh();
        const product = await reloadProduct(id);
        if (!product) throw new Error("Producto no encontrado");
        return product;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No se pudo actualizar el producto",
        );
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [refresh, reloadProduct],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      setIsSaving(true);
      try {
        await deleteAdminProduct(id);
        toast.success("Producto eliminado");
        await refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No se pudo eliminar el producto",
        );
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [refresh],
  );

  const addProductImage = useCallback(
    async (
      productId: string,
      file: File,
      options?: { altText?: string; isPrimary?: boolean },
    ) => {
      setIsSaving(true);
      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("alt_text", options?.altText ?? "");
        formData.append("is_primary", options?.isPrimary ? "true" : "false");
        await addAdminProductImage(productId, formData);
        toast.success("Imagen agregada");
        const product = await reloadProduct(productId);
        if (!product) throw new Error("Producto no encontrado");
        return product;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No se pudo subir la imagen",
        );
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [reloadProduct],
  );

  const deleteProductImage = useCallback(
    async (productId: string, imageId: string) => {
      setIsSaving(true);
      try {
        await deleteAdminProductImage(productId, imageId);
        toast.success("Imagen eliminada");
        const product = await reloadProduct(productId);
        if (!product) throw new Error("Producto no encontrado");
        return product;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No se pudo eliminar la imagen",
        );
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [reloadProduct],
  );

  const setProductImagePrimary = useCallback(
    async (
      productId: string,
      image: AdminProduct["product_images"][number],
    ) => {
      if (image.is_primary) {
        const product = await reloadProduct(productId);
        if (!product) throw new Error("Producto no encontrado");
        return product;
      }

      setIsSaving(true);
      try {
        const imageUrl =
          resolvePublicStorageUrl(image.image_url) ?? image.image_url;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const extension = image.image_url.split(".").pop()?.split("?")[0] ?? "jpg";
        const file = new File([blob], `primary-${image.id}.${extension}`, {
          type: blob.type || "image/jpeg",
        });

        const formData = new FormData();
        formData.append("image", file);
        formData.append("alt_text", image.alt_text ?? "");
        formData.append("is_primary", "true");
        await addAdminProductImage(productId, formData);
        await deleteAdminProductImage(productId, image.id);
        toast.success("Imagen principal actualizada");
        const product = await reloadProduct(productId);
        if (!product) throw new Error("Producto no encontrado");
        return product;
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "No se pudo marcar la imagen como principal",
        );
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [reloadProduct],
  );

  return {
    products,
    meta,
    isLoading,
    isSaving,
    error,
    refresh,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductImage,
    deleteProductImage,
    setProductImagePrimary,
    fetchProduct,
  };
}
