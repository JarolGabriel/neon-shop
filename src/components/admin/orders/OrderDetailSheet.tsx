"use client";

import Link from "next/link";
import { OrderDetailBody } from "@/components/admin/orders/OrderDetailBody";
import { OrderDetailForm } from "@/components/admin/orders/OrderDetailForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatAdminDateTime, formatOrderShortId } from "@/lib/admin-utils";
import type { AdminOrder, PatchAdminOrderPayload } from "@/types/admin";

interface OrderDetailSheetProps {
  order: AdminOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "preview" | "manage";
  onSave?: (id: string, payload: PatchAdminOrderPayload) => Promise<AdminOrder>;
}

export function OrderDetailSheet({
  order,
  open,
  onOpenChange,
  mode = "preview",
  onSave,
}: OrderDetailSheetProps) {
  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-slate-200 bg-white sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-slate-900">
            Pedido #{formatOrderShortId(order.id)}
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            {formatAdminDateTime(order.created_at)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-4">
          <OrderDetailBody order={order} showStatusBadge={mode === "preview"} />

          {mode === "manage" && onSave ? (
            <OrderDetailForm order={order} onSave={onSave} />
          ) : null}
        </div>

        {mode === "preview" ? (
          <SheetFooter className="border-t border-slate-200">
            <Button
              asChild
              className="w-full bg-vite-purple text-white hover:bg-vite-purple/90"
            >
              <Link href={`/admin/ordenes?id=${order.id}`}>
                Gestionar en órdenes
              </Link>
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
