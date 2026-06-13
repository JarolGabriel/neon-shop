"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminModeration, getAdminOrders } from "@/lib/api";
import type { AdminOrder } from "@/types/admin";

const RECENT_ORDERS_LIMIT = 8;

export interface AdminDashboardStats {
  pendingPayment: number;
  inWorkshop: number;
  totalOrders: number;
  pendingModeration: number;
}

interface UseAdminDashboardStatsResult {
  stats: AdminDashboardStats | null;
  recentOrders: AdminOrder[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const EMPTY_STATS: AdminDashboardStats = {
  pendingPayment: 0,
  inWorkshop: 0,
  totalOrders: 0,
  pendingModeration: 0,
};

export function useAdminDashboardStats(): UseAdminDashboardStatsResult {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [ordersRes, moderationRes] = await Promise.all([
        getAdminOrders(),
        getAdminModeration(),
      ]);

      const orders = ordersRes.data;
      setStats({
        pendingPayment: orders.filter(
          (order) => order.status === "pendiente_pago",
        ).length,
        inWorkshop: orders.filter((order) => order.status === "en_taller")
          .length,
        totalOrders: orders.length,
        pendingModeration:
          moderationRes.data.reviews.length +
          moderationRes.data.comments.length,
      });
      setRecentOrders(orders.slice(0, RECENT_ORDERS_LIMIT));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las estadísticas",
      );
      setStats(EMPTY_STATS);
      setRecentOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { stats, recentOrders, isLoading, error, refresh };
}
