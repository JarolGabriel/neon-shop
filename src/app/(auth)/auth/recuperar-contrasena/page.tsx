"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/api";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/schemas/auth";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: ForgotPasswordInput) => {
    setIsSubmitting(true);
    try {
      await requestPasswordReset(values.email);
      setEmailSent(true);
    } catch {
      toast.error("Error al procesar la solicitud. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <AuthShell title="Recuperar contraseña">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <CheckCircle2
            className="size-12 text-cyber-yellow"
            aria-hidden
          />
          <div className="space-y-2">
            <p className="font-medium text-foreground">
              Revisa tu bandeja de entrada
            </p>
            <p className="text-sm text-muted-foreground">
              Si el correo existe en nuestra base de datos, recibirás un enlace
              para restablecer tu contraseña en los próximos minutos. El enlace
              expira en aproximadamente 1 hora.
            </p>
          </div>
          <Button asChild variant="outline" className="mt-2">
            <Link href="/auth/login">Volver al inicio de sesión</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace para restablecer tu contraseña si el correo está registrado."
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            className="w-full"
            disabled={isSubmitting}
            onClick={form.handleSubmit(handleSubmit)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Enviando...
              </>
            ) : (
              "Enviar instrucciones"
            )}
          </Button>
        </div>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          href="/auth/login"
          className="font-medium text-neon-pink transition-colors hover:underline dark:text-cyber-yellow"
        >
          Volver al inicio de sesión
        </Link>
      </p>
    </AuthShell>
  );
}
