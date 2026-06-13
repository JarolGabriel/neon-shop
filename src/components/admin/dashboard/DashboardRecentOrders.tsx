"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { OrderDetailSheet } from "@/components/admin/orders/OrderDetailSheet";
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

interface DashboardRecentOrdersProps {
  orders: AdminOrder[];
  isLoading: boolean;
}

export function DashboardRecentOrders({
  orders,
  isLoading,
}: DashboardRecentOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const openOrder = (order: AdminOrder) => {
    setSelectedOrder(order);
    setSheetOpen(true);
  };

  if (isLoading) {
    return <AdminTableSkeleton rows={6} columns={5} />;
  }

  if (orders.length === 0) {
    return (
      <AdminEmptyState
        icon={ShoppingBag}
        title="Sin pedidos recientes"
        description="Cuando lleguen nuevas órdenes, aparecerán aquí."
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="text-slate-600">ID</TableHead>
              <TableHead className="text-slate-600">Cliente</TableHead>
              <TableHead className="hidden text-slate-600 md:table-cell">
                Email
              </TableHead>
              <TableHead className="text-slate-600">Fecha</TableHead>
              <TableHead className="text-right text-slate-600">Total</TableHead>
              <TableHead className="text-slate-600">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => openOrder(order)}
              >
                <TableCell className="font-mono text-xs font-medium text-slate-700">
                  #{formatOrderShortId(order.id)}
                </TableCell>
                <TableCell className="font-medium text-slate-900">
                  {order.customer_name}
                </TableCell>
                <TableCell className="hidden text-slate-600 md:table-cell">
                  {order.customer_email}
                </TableCell>
                <TableCell className="text-slate-600">
                  {formatAdminDateTime(order.created_at)}
                </TableCell>
                <TableCell className="text-right font-medium text-slate-900">
                  {formatUsd(order.total_usd)}
                </TableCell>
                <TableCell>
                  <AdminStatusBadge status={order.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <OrderDetailSheet
        order={selectedOrder}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
