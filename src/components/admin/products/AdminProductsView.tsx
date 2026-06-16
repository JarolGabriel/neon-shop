"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { AdminErrorBanner } from "@/components/admin/AdminErrorBanner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ProductFormSheet } from "@/components/admin/products/ProductFormSheet";
import { ProductsFilters } from "@/components/admin/products/ProductsFilters";
import { ProductsPagination } from "@/components/admin/products/ProductsPagination";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { Button } from "@/components/ui/button";
import { useAdminCategories } from "@/hooks/useAdminCategories";
import { useAdminProductFilters } from "@/hooks/useAdminProductFilters";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import type {
  AdminProductCreateInput,
  AdminProductUpdateInput,
} from "@/lib/schemas/admin-product";
import type { AdminProduct } from "@/types/admin";

export function AdminProductsView() {
  const { categories } = useAdminCategories();
  const {
    filters,
    searchInput,
    setSearchInput,
    categoryFilter,
    stockFilter,
    highlightFilter,
    replaceQuery,
    clearFilters,
  } = useAdminProductFilters();

  const {
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
  } = useAdminProducts(filters);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreate = useCallback(() => {
    setSheetMode("create");
    setSelectedProduct(null);
    setSheetOpen(true);
  }, []);

  const openEdit = useCallback(
    async (product: AdminProduct) => {
      setSheetMode("edit");
      setSelectedProduct((await fetchProduct(product.id)) ?? product);
      setSheetOpen(true);
    },
    [fetchProduct],
  );

  const handleDelete = useCallback((product: AdminProduct) => {
    setDeleteTarget(product);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteProduct, deleteTarget]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title="Productos"
          description="Gestiona el catálogo: precios, stock, imágenes y visibilidad en la tienda."
        />
        <Button
          onClick={openCreate}
          className="shrink-0 bg-vite-purple text-white hover:bg-vite-purple/90"
        >
          <Plus className="size-4" />
          Nuevo producto
        </Button>
      </div>

      {error ? (
        <AdminErrorBanner message={error} onRetry={() => void refresh()} />
      ) : null}

      <ProductsFilters
        search={searchInput}
        categoryId={categoryFilter}
        stockStatus={stockFilter}
        highlightFilter={highlightFilter}
        categories={categories}
        onSearchChange={setSearchInput}
        onCategoryChange={(value) =>
          replaceQuery({ category_id: value === "all" ? null : value, page: "1" })
        }
        onStockStatusChange={(value) =>
          replaceQuery({
            stock_status: value === "all" ? null : value,
            page: "1",
          })
        }
        onHighlightFilterChange={(value) =>
          replaceQuery({
            highlight: value === "all" ? null : value,
            page: "1",
          })
        }
        onClear={clearFilters}
      />

      <ProductsTable
        products={products}
        isLoading={isLoading}
        onEdit={(product) => void openEdit(product)}
        onDelete={handleDelete}
        onCreate={openCreate}
      />

      <ProductsPagination
        meta={meta}
        onPageChange={(page) => replaceQuery({ page: String(page) })}
      />

      <ProductFormSheet
        mode={sheetMode}
        product={selectedProduct}
        categories={categories}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        isSaving={isSaving}
        onCreate={async (values: AdminProductCreateInput) => {
          await createProduct(values);
        }}
        onUpdate={async (values: AdminProductUpdateInput) => {
          if (!selectedProduct) return;
          const updated = await updateProduct(selectedProduct.id, values);
          setSelectedProduct(updated);
        }}
        onUploadImage={(file, isPrimary) => {
          if (!selectedProduct) {
            return Promise.reject(new Error("Producto no seleccionado"));
          }
          return addProductImage(selectedProduct.id, file, { isPrimary });
        }}
        onDeleteImage={(imageId) => {
          if (!selectedProduct) {
            return Promise.reject(new Error("Producto no seleccionado"));
          }
          return deleteProductImage(selectedProduct.id, imageId);
        }}
        onSetPrimaryImage={(image) => {
          if (!selectedProduct) {
            return Promise.reject(new Error("Producto no seleccionado"));
          }
          return setProductImagePrimary(selectedProduct.id, image);
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Eliminar producto"
        description={
          deleteTarget
            ? `¿Eliminar "${deleteTarget.name}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        variant="destructive"
        tone="admin"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
