"use client";

import { useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { DashboardKpiGrid } from "@/components/admin/dashboard/DashboardKpiGrid";
import { DashboardRecentOrders } from "@/components/admin/dashboard/DashboardRecentOrders";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";
import { useWindowFocusRefresh } from "@/hooks/useWindowFocusRefresh";

export function AdminDashboardView() {
  const { stats, recentOrders, isLoading, error, refresh } =
    useAdminDashboardStats();

  const handleRefresh = useCallback(() => {
    void refresh();
  }, [refresh]);

  useWindowFocusRefresh(handleRefresh);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title="Dashboard"
          description="Resumen operativo de pedidos y comunidad."
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

      <DashboardKpiGrid stats={stats} isLoading={isLoading} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Órdenes recientes
          </h2>
        </div>
        <DashboardRecentOrders orders={recentOrders} isLoading={isLoading} />
      </section>
    </div>
  );
}
