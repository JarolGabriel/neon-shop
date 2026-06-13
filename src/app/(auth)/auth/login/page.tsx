"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { signInSchema, type SignInInput } from "@/lib/schemas/auth";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: SignInInput) => {
    setIsSubmitting(true);
    try {
      await signIn(values.email.trim(), values.password);
      toast.success("¡Bienvenido de vuelta!");
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo iniciar sesión";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvalidSubmit = (errors: FieldErrors<SignInInput>) => {
    const firstError = Object.values(errors)[0]?.message;
    toast.error(
      typeof firstError === "string"
        ? firstError
        : "Revisa los campos del formulario",
    );
  };

  return (
    <AuthShell
      title="Iniciar sesión"
      subtitle="Accede a tu cuenta para continuar con tu pedido."
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between gap-2">
                  <FormLabel>Contraseña</FormLabel>
                  <Link
                    href="/auth/recuperar-contrasena"
                    className="text-xs text-muted-foreground transition-colors hover:text-neon-pink! dark:hover:text-cyber-yellow!"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <FormControl>
                  <PasswordField
                    id="login-password"
                    autoComplete="current-password"
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
            onClick={form.handleSubmit(handleSubmit, handleInvalidSubmit)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </div>
      </Form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">o</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link
          href="/auth/registro"
          className="font-medium text-neon-pink transition-colors hover:underline dark:text-cyber-yellow"
        >
          Regístrate
        </Link>
      </p>
    </AuthShell>
  );
}
