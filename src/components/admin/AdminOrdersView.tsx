"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { OrderDetailSheet } from "@/components/admin/orders/OrderDetailSheet";
import { OrdersFilters } from "@/components/admin/orders/OrdersFilters";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import { Button } from "@/components/ui/button";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { useWindowFocusRefresh } from "@/hooks/useWindowFocusRefresh";
import { ORDER_STATUSES } from "@/lib/schemas/admin-order";
import type { AdminOrder } from "@/types/admin";
import type { OrderStatus } from "@/types/order";

function isValidOrderStatus(value: string | null): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

export function AdminOrdersView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { orders, isLoading, error, refresh, updateOrder } = useAdminOrders();

  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const statusFilter = useMemo(() => {
    const param = searchParams.get("status");
    return isValidOrderStatus(param) ? param : "all";
  }, [searchParams]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      if (!query) return true;

      return (
        order.customer_name.toLowerCase().includes(query) ||
        order.customer_email.toLowerCase().includes(query)
      );
    });
  }, [orders, search, statusFilter]);

  const replaceQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const openOrder = useCallback(
    (order: AdminOrder) => {
      setSelectedOrder(order);
      setSheetOpen(true);
      replaceQuery({ id: order.id });
    },
    [replaceQuery],
  );

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedOrder(null);
      replaceQuery({ id: null });
    }
  };

  useEffect(() => {
    const orderId = searchParams.get("id");
    if (!orderId || orders.length === 0) return;

    const order = orders.find((item) => item.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setSheetOpen(true);
    }
  }, [orders, searchParams]);

  useEffect(() => {
    if (selectedOrder) {
      const fresh = orders.find((item) => item.id === selectedOrder.id);
      if (fresh) setSelectedOrder(fresh);
    }
  }, [orders, selectedOrder?.id]);

  const handleRefresh = useCallback(() => {
    void refresh();
  }, [refresh]);

  useWindowFocusRefresh(handleRefresh);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title="Órdenes"
          description="Gestiona pedidos, estados y notas internas."
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="shrink-0 border-slate-200 bg-white"
        >
          <RefreshCw
            className={`size-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>

      {error ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refresh()}
            className="border-red-200 bg-white"
          >
            Reintentar
          </Button>
        </div>
      ) : null}

      <OrdersFilters
        search={search}
        status={statusFilter}
        onSearchChange={setSearch}
        onStatusChange={(value) =>
          replaceQuery({ status: value === "all" ? null : value })
        }
        onClear={() => {
          setSearch("");
          replaceQuery({ status: null, id: null });
        }}
      />

      <OrdersTable
        orders={filteredOrders}
        isLoading={isLoading}
        onViewOrder={openOrder}
      />

      <OrderDetailSheet
        order={selectedOrder}
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        mode="manage"
        onSave={updateOrder}
      />
    </div>
  );
}
