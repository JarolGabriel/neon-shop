"use client";

import { MoreHorizontal, ShoppingBag } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
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
import { formatAdminDateTime, formatOrderShortId } from "@/lib/admin-utils";
import { formatUsd } from "@/lib/utils";
import type { AdminOrder } from "@/types/admin";

interface OrdersTableProps {
  orders: AdminOrder[];
  isLoading: boolean;
  onViewOrder: (order: AdminOrder) => void;
}

export function OrdersTable({
  orders,
  isLoading,
  onViewOrder,
}: OrdersTableProps) {
  if (isLoading) {
    return <AdminTableSkeleton rows={8} columns={6} />;
  }

  if (orders.length === 0) {
    return (
      <AdminEmptyState
        icon={ShoppingBag}
        title="No hay órdenes"
        description="Prueba ajustando los filtros de búsqueda o estado."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="text-slate-600">ID</TableHead>
            <TableHead className="text-slate-600">Cliente</TableHead>
            <TableHead className="hidden text-slate-600 lg:table-cell">
              Email
            </TableHead>
            <TableHead className="hidden text-slate-600 md:table-cell">
              Teléfono
            </TableHead>
            <TableHead className="text-right text-slate-600">Total</TableHead>
            <TableHead className="text-slate-600">Estado</TableHead>
            <TableHead className="hidden text-slate-600 sm:table-cell">
              Fecha
            </TableHead>
            <TableHead className="w-10 text-slate-600">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => onViewOrder(order)}
            >
              <TableCell className="font-mono text-xs font-medium text-slate-700">
                #{formatOrderShortId(order.id)}
              </TableCell>
              <TableCell className="font-medium text-slate-900">
                {order.customer_name}
              </TableCell>
              <TableCell className="hidden text-slate-600 lg:table-cell">
                {order.customer_email}
              </TableCell>
              <TableCell className="hidden text-slate-600 md:table-cell">
                {order.customer_phone}
              </TableCell>
              <TableCell className="text-right font-medium text-slate-900">
                {formatUsd(order.total_usd)}
              </TableCell>
              <TableCell>
                <AdminStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="hidden text-slate-600 sm:table-cell">
                {formatAdminDateTime(order.created_at)}
              </TableCell>
              <TableCell onClick={(event) => event.stopPropagation()}>
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
                    <DropdownMenuItem onClick={() => onViewOrder(order)}>
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
