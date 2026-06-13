"use client";

import { ExternalLink, Image, MoreHorizontal, Pencil, Power, Trash2 } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { PromotionActiveBadge } from "@/components/admin/promotions/PromotionActiveBadge";
import { PromotionLocationBadge } from "@/components/admin/promotions/PromotionLocationBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAdminDate } from "@/lib/admin-utils";
import { resolvePublicStorageUrl } from "@/lib/storage-url";
import { HOME_HERO_LOCATION } from "@/types/promotion";
import type { AdminPromotion } from "@/types/admin";

interface PromotionsTableProps {
  promotions: AdminPromotion[];
  isLoading: boolean;
  isSaving: boolean;
  onEdit: (promotion: AdminPromotion) => void;
  onDelete: (promotion: AdminPromotion) => void;
  onToggleActive: (promotion: AdminPromotion) => void;
  onCreate: () => void;
}

function getPrimaryImage(promotion: AdminPromotion): string | null {
  const sorted = [...promotion.promotion_images].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );
  return sorted[0]?.image_url ?? null;
}

function getPreviewPath(promotion: AdminPromotion): string {
  return promotion.display_location === HOME_HERO_LOCATION
    ? "/"
    : "/comunidad";
}

export function PromotionsTable({
  promotions,
  isLoading,
  isSaving,
  onEdit,
  onDelete,
  onToggleActive,
  onCreate,
}: PromotionsTableProps) {
  if (isLoading) {
    return <AdminTableSkeleton rows={6} columns={7} />;
  }

  if (promotions.length === 0) {
    return (
      <div className="space-y-4">
        <AdminEmptyState
          icon={Image}
          title="No hay promociones"
          description="Crea la primera promoción para el carrusel del inicio o la comunidad."
        />
        <div className="flex justify-center">
          <Button
            onClick={onCreate}
            className="bg-vite-purple text-white hover:bg-vite-purple/90"
          >
            Nueva promoción
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
            <TableHead className="text-slate-600">Título</TableHead>
            <TableHead className="hidden text-slate-600 md:table-cell">Ubicación</TableHead>
            <TableHead className="text-slate-600">Estado</TableHead>
            <TableHead className="hidden text-slate-600 lg:table-cell">Fechas</TableHead>
            <TableHead className="text-slate-600">Orden</TableHead>
            <TableHead className="w-10 text-slate-600">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promotion) => {
            const imageSrc = resolvePublicStorageUrl(getPrimaryImage(promotion));
            return (
              <TableRow key={promotion.id} className="hover:bg-slate-50">
                <TableCell>
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={promotion.title}
                      className="size-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400">
                      Sin img
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-slate-900">
                  {promotion.title}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <PromotionLocationBadge location={promotion.display_location} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <PromotionActiveBadge isActive={promotion.is_active} />
                    <Switch
                      checked={promotion.is_active !== false}
                      disabled={isSaving}
                      onCheckedChange={() => onToggleActive(promotion)}
                      aria-label="Activar o desactivar"
                    />
                  </div>
                </TableCell>
                <TableCell className="hidden text-xs text-slate-600 lg:table-cell">
                  {formatAdminDate(promotion.start_date)} —{" "}
                  {formatAdminDate(promotion.end_date)}
                </TableCell>
                <TableCell className="text-slate-700">
                  {promotion.display_order ?? 0}
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
                    <DropdownMenuContent align="end" className="bg-white text-slate-900">
                      <DropdownMenuItem onClick={() => onEdit(promotion)}>
                        <Pencil className="size-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleActive(promotion)}>
                        <Power className="size-4" />
                        {promotion.is_active !== false ? "Desactivar" : "Activar"}
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a
                          href={getPreviewPath(promotion)}
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
                        onClick={() => onDelete(promotion)}
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
