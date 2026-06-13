"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { resetPassword } from "@/lib/api";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/schemas/auth";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenHash = searchParams.get("token_hash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  if (!tokenHash) {
    return (
      <AuthShell title="Enlace inválido">
        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Este enlace de recuperación no es válido o ya expiró. Solicita uno
            nuevo para restablecer tu contraseña.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/recuperar-contrasena">Solicitar nuevo enlace</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Ir a iniciar sesión</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  if (isSuccess) {
    return (
      <AuthShell title="Contraseña actualizada">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <CheckCircle2
            className="size-12 text-cyber-yellow"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">
            Tu contraseña fue actualizada correctamente. Ya puedes iniciar
            sesión con tu nueva contraseña.
          </p>
          <Button asChild className="mt-2 w-full">
            <Link href="/auth/login">Ir a iniciar sesión</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  const handleSubmit = async (values: ResetPasswordInput) => {
    setIsSubmitting(true);
    try {
      await resetPassword({
        token_hash: tokenHash,
        password: values.password,
      });
      setIsSuccess(true);
      toast.success("Contraseña actualizada correctamente");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la contraseña";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Restablecer contraseña"
      subtitle="Elige una contraseña nueva para tu cuenta."
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nueva contraseña</FormLabel>
                <FormControl>
                  <PasswordField
                    id="reset-password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar contraseña</FormLabel>
                <FormControl>
                  <PasswordField
                    id="reset-confirm-password"
                    autoComplete="new-password"
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
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Guardando...
              </>
            ) : (
              "Guardar nueva contraseña"
            )}
          </Button>
        </div>
      </Form>
    </AuthShell>
  );
}
