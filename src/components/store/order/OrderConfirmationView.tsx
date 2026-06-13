"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getLastOrder,
  openWhatsAppOrder,
  type LastOrderSnapshot,
} from "@/lib/order-utils";
import { formatUsd } from "@/lib/utils";

function OrderEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center">
      <ShoppingBag
        className="size-16 text-muted-foreground"
        aria-hidden="true"
      />
      <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
        No hay pedidos recientes
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Cuando confirmes un pedido desde el carrito, verás aquí el resumen y el
        enlace a WhatsApp.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          className="rounded-full bg-vite-purple text-primary-foreground hover:bg-vite-purple/90"
        >
          <Link href="/productos">Ver catálogo</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/carrito">Ir al carrito</Link>
        </Button>
      </div>
    </div>
  );
}

function OrderSummaryCard({ order }: { order: LastOrderSnapshot }) {
  const orderCode = order.orderId.slice(0, 8).toUpperCase();

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <CheckCircle2
          className="mt-0.5 size-8 shrink-0 text-neon-pink dark:text-cyber-yellow"
          aria-hidden="true"
        />
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            ¡Pedido registrado!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tu orden{" "}
            <span className="font-mono font-semibold text-foreground dark:text-cyber-yellow">
              #{orderCode}
            </span>{" "}
            quedó guardada correctamente.
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Cliente</dt>
          <dd className="font-medium text-foreground">{order.customerName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Productos</dt>
          <dd className="font-medium text-foreground">
            {order.itemCount} {order.itemCount === 1 ? "ítem" : "ítems"}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-3">
          <dt className="font-medium text-foreground">Total</dt>
          <dd className="font-bold text-foreground dark:text-cyber-yellow">
            {formatUsd(order.total)} USD
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-sm text-muted-foreground">
        Te enviamos un recibo por correo electrónico con el detalle de tu
        pedido.
      </p>

      <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-foreground">
        <p className="font-medium">Importante — WhatsApp</p>
        <p className="mt-1 text-muted-foreground">
          Al abrir WhatsApp el mensaje aparecerá listo, pero{" "}
          <strong className="text-foreground">debes pulsar Enviar</strong> en el
          chat para que llegue al taller.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          onClick={() =>
            openWhatsAppOrder(order.whatsappNumber, order.whatsappMessage)
          }
          className="rounded-full bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 dark:bg-cyber-yellow dark:text-black dark:hover:bg-cyber-yellow/90"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Abrir WhatsApp
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/productos">Seguir comprando</Link>
        </Button>
        <Button asChild variant="ghost" className="rounded-full">
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>
    </div>
  );
}

export function OrderConfirmationView() {
  const [order, setOrder] = useState<LastOrderSnapshot | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setOrder(getLastOrder());
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div
        className="h-64 animate-pulse rounded-xl bg-muted"
        aria-hidden="true"
      />
    );
  }

  if (!order) {
    return <OrderEmptyState />;
  }

  return <OrderSummaryCard order={order} />;
}
