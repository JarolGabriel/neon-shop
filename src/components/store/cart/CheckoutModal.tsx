"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  createOrder,
  getCartSessionId,
  getSiteSettings,
} from "@/lib/api";
import { checkoutSchema, type CheckoutInput } from "@/lib/schemas/checkout";
import {
  buildWhatsAppMessage,
  openWhatsAppOrder,
  saveLastOrder,
} from "@/lib/order-utils";
import {
  getCartStockWarnings,
  getStockWarningMessage,
  hasBlockingStockWarnings,
} from "@/lib/stock-utils";
import { getWhatsappNumberFromSettings } from "@/lib/whatsapp-utils";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { items, itemCount, savingsAmount, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      delivery_address: "",
      delivery_city: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      customer_name: user ? `${user.first_name} ${user.last_name}`.trim() : "",
      customer_email: user?.email ?? "",
      customer_phone: user?.phone ?? "",
      delivery_address: "",
      delivery_city: "",
    });
  }, [open, user, form]);

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    getSiteSettings()
      .then((settings) => {
        if (!mounted) return;
        setWhatsappNumber(getWhatsappNumberFromSettings(settings));
      })
      .catch(() => {
        if (mounted) setWhatsappNumber(null);
      });

    return () => {
      mounted = false;
    };
  }, [open]);

  const handleSubmit = async (values: CheckoutInput) => {
    const stockWarnings = getCartStockWarnings(items);
    if (hasBlockingStockWarnings(stockWarnings)) {
      const blocker = stockWarnings.find(
        (warning) =>
          warning.type === "out_of_stock" ||
          warning.type === "exceeds_stock",
      );
      toast.error(
        blocker
          ? getStockWarningMessage(blocker)
          : "Hay productos sin stock suficiente en tu carrito.",
      );
      return;
    }

    if (!whatsappNumber) {
      toast.error("WhatsApp no configurado. Contacta al taller por otro medio.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { order_id: orderId } = await createOrder({
        session_id: getCartSessionId(),
        user_id: user?.id ?? null,
        ...values,
      });

      const message = buildWhatsAppMessage(
        orderId,
        values,
        items,
        savingsAmount,
        total,
      );

      saveLastOrder({
        orderId,
        whatsappNumber,
        whatsappMessage: message,
        customerName: values.customer_name,
        total,
        itemCount,
        createdAt: new Date().toISOString(),
      });

      clearCart();
      onOpenChange(false);
      const opened = openWhatsAppOrder(whatsappNumber, message);
      toast.success(
        opened
          ? "¡Pedido confirmado! Pulsa Enviar en WhatsApp para que llegue al taller."
          : "¡Pedido confirmado! Abre WhatsApp desde la pantalla de confirmación.",
      );
      router.push("/mi-pedido");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo procesar el pedido";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvalidSubmit = (errors: FieldErrors<CheckoutInput>) => {
    const firstError = Object.values(errors)[0]?.message;
    toast.error(
      typeof firstError === "string"
        ? firstError
        : "Revisa los campos del formulario",
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isSubmitting) onOpenChange(next);
      }}
    >
      <DialogContent className="border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-foreground">
            Confirmar pedido
          </DialogTitle>
        </DialogHeader>

        {isSubmitting ? (
          <div
            className="flex flex-col items-center gap-4 py-8 text-center"
            role="status"
            aria-live="polite"
          >
            <Loader2
              className="size-10 animate-spin text-neon-pink dark:text-cyber-yellow"
              aria-hidden="true"
            />
            <div className="space-y-2">
              <p className="font-heading text-lg font-semibold text-foreground">
                Procesando tu pedido…
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Te llevaremos a WhatsApp para coordinar. No olvides presionar{" "}
                <strong className="text-foreground">Enviar</strong> en el chat.
              </p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, handleInvalidSubmit)}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input type="tel" autoComplete="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="delivery_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="delivery_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección de entrega</FormLabel>
                    <FormControl>
                      <Input autoComplete="street-address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-full bg-neon-pink text-primary-foreground hover:bg-neon-pink/90 dark:bg-cyber-yellow dark:text-black dark:hover:bg-cyber-yellow/90"
              >
                Confirmar pedido
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
