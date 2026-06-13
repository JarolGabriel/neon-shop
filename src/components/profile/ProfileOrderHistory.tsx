"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Package } from "lucide-react";
import { OrderHistoryCard } from "@/components/profile/OrderHistoryCard";
import { Button } from "@/components/ui/button";
import { getMyOrders } from "@/lib/api";
import type { OrderHistoryEntry } from "@/types/order";

interface ProfileOrderHistoryProps {
  accessToken: string;
}

export function ProfileOrderHistory({ accessToken }: ProfileOrderHistoryProps) {
  const [orders, setOrders] = useState<OrderHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await getMyOrders(accessToken);
        if (mounted) setOrders(data);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar tus pedidos",
          );
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [accessToken]);

  return (
    <section className="mt-10 border-t border-border/50 pt-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Mis pedidos
        </h2>
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/mi-pedido">Último pedido</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Cargando pedidos…
        </div>
      ) : error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-border bg-card px-6 py-10 text-center">
          <Package
            className="size-12 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Aún no tienes pedidos registrados con esta cuenta.
          </p>
          <Button asChild className="mt-4 rounded-full" variant="outline">
            <Link href="/productos">Ir al catálogo</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderHistoryCard order={order} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
