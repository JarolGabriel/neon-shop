"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProfileAvatarSection } from "@/components/profile/ProfileAvatarSection";
import { ProfileCommunitySection } from "@/components/profile/ProfileCommunitySection";
import { ProfileOrderHistory } from "@/components/profile/ProfileOrderHistory";
import { ProfilePageSkeleton } from "@/components/profile/ProfilePageSkeleton";
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
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { getProfile, updateProfile } from "@/lib/api";
import { profileSchema, type ProfileInput } from "@/lib/schemas/profile";
import type { ShippingAddress } from "@/types/auth";

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="h-px bg-border" />
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, accessToken, isAuthenticated, isLoading, signOut } = useAuth();
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const profileLoadedRef = useRef(false);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!user || profileLoadedRef.current) return;

    setAvatarUrl((current) => current ?? user.avatar_url ?? null);
    form.reset({
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
    });
  }, [user, form]);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !accessToken) return;

    const token = accessToken;
    let cancelled = false;

    async function loadProfile() {
      setIsFetchingProfile(true);
      try {
        const { profile } = await getProfile(token);
        if (cancelled) return;

        profileLoadedRef.current = true;
        const shipping = profile.shipping_address as ShippingAddress | null;
        setAvatarUrl((current) => profile.avatar_url ?? current);
        form.reset({
          first_name: profile.first_name ?? "",
          last_name: profile.last_name ?? "",
          phone: profile.phone ?? "",
          street: shipping?.street ?? "",
          city: shipping?.city ?? "",
          state: shipping?.state ?? "",
          zip_code: shipping?.zip_code ?? "",
          country: shipping?.country ?? "",
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No se pudo cargar tu perfil";
        toast.error(message);
      } finally {
        if (!cancelled) setIsFetchingProfile(false);
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [accessToken, isAuthenticated, isLoading]);

  const handleSubmit = async (values: ProfileInput) => {
    if (!accessToken) return;

    setIsSaving(true);
    try {
      await updateProfile(accessToken, {
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone ?? "",
        shipping_address: {
          street: values.street ?? "",
          city: values.city ?? "",
          state: values.state ?? "",
          zip_code: values.zip_code ?? "",
          country: values.country ?? "",
        },
      });
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo guardar el perfil";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    router.replace("/");
  };

  if (isLoading || !isAuthenticated || !user || !accessToken) {
    return <ProfilePageSkeleton />;
  }

  const displayUser = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-2xl bg-background px-4 py-6 md:px-6 md:py-10"
    >
      <h1 className="mb-8 text-center font-heading text-2xl font-bold text-neon-pink dark:text-cyber-yellow">
        Mi perfil
      </h1>

      {isFetchingProfile ? (
        <p className="mb-4 text-center text-xs text-muted-foreground">
          Sincronizando datos...
        </p>
      ) : null}

      <ProfileAvatarSection
        accessToken={accessToken}
        avatarUrl={avatarUrl}
        displayUser={displayUser}
        onAvatarUpdated={setAvatarUrl}
      />

      <Form {...form}>
        <div className="space-y-6">
          <SectionHeading title="Datos personales" />

          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input autoComplete="given-name" disabled={isSaving} {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input autoComplete="family-name" disabled={isSaving} {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+58 414 000 0000"
                    autoComplete="tel"
                    disabled={isSaving}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" value={user.email} disabled />
          </div>

          <SectionHeading title="Dirección de envío" />

          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calle / Dirección</FormLabel>
                <FormControl>
                  <Input autoComplete="street-address" disabled={isSaving} {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input autoComplete="address-level2" disabled={isSaving} {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado / Provincia</FormLabel>
                <FormControl>
                  <Input autoComplete="address-level1" disabled={isSaving} {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código postal</FormLabel>
                <FormControl>
                  <Input autoComplete="postal-code" disabled={isSaving} {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Venezuela"
                    autoComplete="country-name"
                    disabled={isSaving}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button
            type="button"
            disabled={isSaving}
            onClick={form.handleSubmit(handleSubmit)}
            className="w-full rounded-full bg-neon-pink py-3 font-semibold text-white transition-opacity hover:opacity-90 dark:bg-cyber-yellow dark:text-black"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </div>
      </Form>

      <ProfileOrderHistory accessToken={accessToken} />

      <ProfileCommunitySection accessToken={accessToken} />

      <div className="mt-8 border-t border-border/50 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleSignOut}
          className="w-full rounded-full border-neon-pink/30 text-neon-pink dark:border-cyber-yellow/30 dark:text-cyber-yellow"
        >
          Cerrar sesión
        </Button>
      </div>
    </motion.div>
  );
}
