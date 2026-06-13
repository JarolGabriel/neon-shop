import {
  ClipboardList,
  Factory,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminDashboardStats } from "@/hooks/useAdminDashboardStats";
import { ADMIN_COMMUNITY_PATH } from "@/lib/community-routes";

interface DashboardKpiGridProps {
  stats: AdminDashboardStats | null;
  isLoading: boolean;
}

export function DashboardKpiGrid({ stats, isLoading }: DashboardKpiGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        title="Pedidos pendientes"
        value={stats?.pendingPayment ?? 0}
        href="/admin/ordenes?status=pendiente_pago"
        icon={ClipboardList}
      />
      <AdminStatCard
        title="Comunidad por revisar"
        value={stats?.pendingModeration ?? 0}
        href={ADMIN_COMMUNITY_PATH}
        icon={Sparkles}
      />
      <AdminStatCard
        title="Pedidos en taller"
        value={stats?.inWorkshop ?? 0}
        href="/admin/ordenes?status=en_taller"
        icon={Factory}
      />
      <AdminStatCard
        title="Total pedidos"
        value={stats?.totalOrders ?? 0}
        href="/admin/ordenes"
        icon={ShoppingBag}
      />
    </div>
  );
}
