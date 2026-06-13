"use client";

import { MoreHorizontal, Palette } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { CustomDesignStatusBadge } from "@/components/admin/custom-designs/CustomDesignStatusBadge";
import { CustomDesignTypeBadge } from "@/components/admin/custom-designs/CustomDesignTypeBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { getBudgetRangeLabel } from "@/lib/admin-custom-design-labels";
import { formatAdminDateTime } from "@/lib/admin-utils";
import type { AdminCustomDesign } from "@/types/admin";

interface CustomDesignsTableProps {
  designs: AdminCustomDesign[];
  isLoading: boolean;
  onViewDesign: (design: AdminCustomDesign) => void;
}

export function CustomDesignsTable({
  designs,
  isLoading,
  onViewDesign,
}: CustomDesignsTableProps) {
  if (isLoading) {
    return <AdminTableSkeleton rows={8} columns={6} />;
  }

  if (designs.length === 0) {
    return (
      <AdminEmptyState
        icon={Palette}
        title="No hay solicitudes"
        description="Prueba ajustando los filtros de búsqueda o estado."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="text-slate-600">Fecha</TableHead>
            <TableHead className="text-slate-600">Cliente</TableHead>
            <TableHead className="hidden text-slate-600 md:table-cell">Tipo</TableHead>
            <TableHead className="text-slate-600">Estado</TableHead>
            <TableHead className="hidden text-slate-600 lg:table-cell">Presupuesto</TableHead>
            <TableHead className="w-10 text-slate-600">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {designs.map((design) => (
            <TableRow
              key={design.id}
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => onViewDesign(design)}
            >
              <TableCell className="text-sm text-slate-600">
                {formatAdminDateTime(design.created_at)}
              </TableCell>
              <TableCell>
                <p className="font-medium text-slate-900">{design.customer_name}</p>
                <p className="text-xs text-slate-500">{design.customer_email}</p>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <CustomDesignTypeBadge type={design.design_type} />
              </TableCell>
              <TableCell>
                <CustomDesignStatusBadge status={design.status} />
              </TableCell>
              <TableCell className="hidden text-slate-600 lg:table-cell">
                {getBudgetRangeLabel(design.budget_range)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-slate-500"
                      aria-label="Acciones"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white text-slate-900">
                    <DropdownMenuItem onClick={() => onViewDesign(design)}>
                      Ver detalle
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
