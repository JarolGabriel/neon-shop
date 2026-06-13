"use client";

import { ExternalLink, MoreHorizontal, Package, Pencil, Trash2 } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { ProductStatusBadge } from "@/components/admin/products/ProductStatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { resolvePublicStorageUrl } from "@/lib/storage-url";
import { formatUsd } from "@/lib/utils";
import type { AdminProduct } from "@/types/admin";

function getPrimaryImage(product: AdminProduct) {
  return (
    product.product_images.find((image) => image.is_primary) ??
    product.product_images[0] ??
    null
  );
}

interface ProductsTableProps {
  products: AdminProduct[];
  isLoading: boolean;
  onEdit: (product: AdminProduct) => void;
  onDelete: (product: AdminProduct) => void;
  onCreate: () => void;
}

export function ProductsTable({
  products,
  isLoading,
  onEdit,
  onDelete,
  onCreate,
}: ProductsTableProps) {
  if (isLoading) {
    return <AdminTableSkeleton rows={8} columns={6} />;
  }

  if (products.length === 0) {
    return (
      <div className="space-y-4">
        <AdminEmptyState
          icon={Package}
          title="No hay productos"
          description="Crea el primer producto para mostrarlo en el catálogo de la tienda."
        />
        <div className="flex justify-center">
          <Button
            onClick={onCreate}
            className="bg-vite-purple text-white hover:bg-vite-purple/90"
          >
            Nuevo producto
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-20 text-slate-600">Imagen</TableHead>
            <TableHead className="text-slate-600">Nombre</TableHead>
            <TableHead className="hidden text-slate-600 md:table-cell">
              Categoría
            </TableHead>
            <TableHead className="text-slate-600">Precio</TableHead>
            <TableHead className="text-slate-600">Stock</TableHead>
            <TableHead className="text-slate-600">Estado</TableHead>
            <TableHead className="w-10 text-slate-600">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const primaryImage = getPrimaryImage(product);
            const imageSrc = resolvePublicStorageUrl(primaryImage?.image_url);

            return (
              <TableRow key={product.id} className="hover:bg-slate-50">
                <TableCell>
                  <div className="relative inline-flex size-14 shrink-0 overflow-hidden rounded-md bg-slate-200">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="size-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="font-mono text-xs text-slate-500">{product.slug}</p>
                </TableCell>
                <TableCell className="hidden text-slate-700 md:table-cell">
                  {product.categories?.name ?? "—"}
                </TableCell>
                <TableCell className="text-slate-900">
                  {formatUsd(product.price)}
                </TableCell>
                <TableCell className="text-slate-700">{product.stock ?? 0}</TableCell>
                <TableCell>
                  <ProductStatusBadge
                    isActive={product.is_active}
                    stock={product.stock}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-slate-500"
                        aria-label="Acciones"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white text-slate-900"
                    >
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Pencil className="size-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a
                          href={`/productos/${encodeURIComponent(product.slug)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="size-4" />
                          Ver en tienda
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(product)}
                      >
                        <Trash2 className="size-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
