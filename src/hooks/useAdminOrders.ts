"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminOrders, patchAdminOrder } from "@/lib/api";
import type { AdminOrder, PatchAdminOrderPayload } from "@/types/admin";

interface UseAdminOrdersResult {
  orders: AdminOrder[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateOrder: (
    id: string,
    payload: PatchAdminOrderPayload,
  ) => Promise<AdminOrder>;
}

export function useAdminOrders(): UseAdminOrdersResult {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAdminOrders();
      setOrders(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar las órdenes",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateOrder = useCallback(
    async (id: string, payload: PatchAdminOrderPayload) => {
      const response = await patchAdminOrder(id, payload);
      setOrders((current) =>
        current.map((order) =>
          order.id === id ? { ...order, ...response.data } : order,
        ),
      );
      return response.data;
    },
    [],
  );

  return { orders, isLoading, error, refresh, updateOrder };
}
