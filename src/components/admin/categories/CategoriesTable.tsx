"use client";

import { ExternalLink, FolderTree, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { CategoryImage } from "@/components/shared/CategoryImage";
import { CategoryStatusBadge } from "@/components/admin/categories/CategoryStatusBadge";
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
import type { AdminCategory } from "@/types/admin";

interface CategoriesTableProps {
  categories: AdminCategory[];
  isLoading: boolean;
  onEdit: (category: AdminCategory) => void;
  onDelete: (category: AdminCategory) => void;
  onCreate: () => void;
}

export function CategoriesTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
  onCreate,
}: CategoriesTableProps) {
  if (isLoading) {
    return <AdminTableSkeleton rows={6} columns={6} />;
  }

  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        <AdminEmptyState
          icon={FolderTree}
          title="No hay categorías"
          description="Crea la primera categoría para organizar el catálogo en la tienda."
        />
        <div className="flex justify-center">
          <Button
            onClick={onCreate}
            className="bg-vite-purple text-white hover:bg-vite-purple/90"
          >
            Nueva categoría
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
            <TableHead className="hidden text-slate-600 md:table-cell">Slug</TableHead>
            <TableHead className="text-slate-600">Orden</TableHead>
            <TableHead className="text-slate-600">Estado</TableHead>
            <TableHead className="w-10 text-slate-600">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="hover:bg-slate-50">
              <TableCell>
                <CategoryImage
                  src={category.image_url}
                  alt={category.name}
                  variant="thumb"
                />
              </TableCell>
              <TableCell className="font-medium text-slate-900">
                {category.name}
              </TableCell>
              <TableCell className="hidden font-mono text-xs text-slate-600 md:table-cell">
                {category.slug}
              </TableCell>
              <TableCell className="text-slate-700">
                {category.display_order ?? 0}
              </TableCell>
              <TableCell>
                <CategoryStatusBadge isActive={category.is_active} />
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
                    <DropdownMenuItem onClick={() => onEdit(category)}>
                      <Pencil className="size-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={`/productos?category=${encodeURIComponent(category.slug)}`}
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
                      onClick={() => onDelete(category)}
                    >
                      <Trash2 className="size-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
