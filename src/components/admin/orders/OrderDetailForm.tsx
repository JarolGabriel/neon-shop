"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { OrderStatusSelect } from "@/components/admin/orders/OrderStatusSelect";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ADMIN_TEXTAREA_CLASS } from "@/lib/admin-ui";
import {
  adminOrderUpdateSchema,
  type AdminOrderUpdateInput,
} from "@/lib/schemas/admin-order";
import type { AdminOrder, PatchAdminOrderPayload } from "@/types/admin";

interface OrderDetailFormProps {
  order: AdminOrder;
  onSave: (id: string, payload: PatchAdminOrderPayload) => Promise<AdminOrder>;
}

export function OrderDetailForm({ order, onSave }: OrderDetailFormProps) {
  const form = useForm<AdminOrderUpdateInput>({
    resolver: zodResolver(adminOrderUpdateSchema),
    defaultValues: {
      status: order.status,
      admin_notes: order.admin_notes ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      status: order.status,
      admin_notes: order.admin_notes ?? "",
    });
  }, [order, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSave(order.id, {
        status: values.status,
        admin_notes: values.admin_notes?.trim() || "",
      });
      toast.success("Estado y notas guardados");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo actualizar la orden",
      );
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-200 pt-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Cambiar estado</FormLabel>
              <FormControl>
                <OrderStatusSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="admin_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Notas internas</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Notas visibles solo para el equipo..."
                  className={ADMIN_TEXTAREA_CLASS}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-vite-purple text-white hover:bg-vite-purple/90"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </Form>
  );
}
