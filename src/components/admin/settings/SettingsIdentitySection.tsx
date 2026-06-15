"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SettingsSaveButton } from "@/components/admin/settings/SettingsSaveButton";
import { SettingsSectionCard } from "@/components/admin/settings/SettingsSectionCard";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  adminIdentitySettingsSchema,
  type AdminIdentitySettingsInput,
} from "@/lib/schemas/admin-settings";
import { ADMIN_INPUT_CLASS, ADMIN_TEXTAREA_CLASS } from "@/lib/admin-ui";
import { SITE_SETTING_KEYS } from "@/types/site-settings";

interface SettingsIdentitySectionProps {
  settings: Record<string, string>;
  isSaving: boolean;
  onSave: (values: AdminIdentitySettingsInput) => Promise<void>;
}

export function SettingsIdentitySection({
  settings,
  isSaving,
  onSave,
}: SettingsIdentitySectionProps) {
  const form = useForm<AdminIdentitySettingsInput>({
    resolver: zodResolver(adminIdentitySettingsSchema),
    defaultValues: {
      [SITE_SETTING_KEYS.siteName]: "",
      [SITE_SETTING_KEYS.siteTagline]: "",
      [SITE_SETTING_KEYS.siteDescription]: "",
      [SITE_SETTING_KEYS.ogImageUrl]: "",
    },
  });

  useEffect(() => {
    form.reset({
      [SITE_SETTING_KEYS.siteName]: settings[SITE_SETTING_KEYS.siteName] ?? "",
      [SITE_SETTING_KEYS.siteTagline]:
        settings[SITE_SETTING_KEYS.siteTagline] ?? "",
      [SITE_SETTING_KEYS.siteDescription]:
        settings[SITE_SETTING_KEYS.siteDescription] ?? "",
      [SITE_SETTING_KEYS.ogImageUrl]:
        settings[SITE_SETTING_KEYS.ogImageUrl] ?? "",
    });
  }, [settings, form]);

  return (
    <SettingsSectionCard
      title="Identidad de la tienda"
      description="Nombre, slogan y descripción que aparecen en Google y al compartir el enlace en redes."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
          <FormField
            control={form.control}
            name={SITE_SETTING_KEYS.siteName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Nombre de la tienda</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="The Art Neon"
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormDescription className="text-slate-500">
                  Título principal en la pestaña del navegador y resultados de
                  búsqueda.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={SITE_SETTING_KEYS.siteTagline}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Slogan</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Letreros Personalizados"
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormDescription className="text-slate-500">
                  Subtítulo que completa el título: Nombre | Slogan
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={SITE_SETTING_KEYS.siteDescription}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Descripción SEO</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="Descripción que aparece en Google y al compartir en redes sociales"
                    className={ADMIN_TEXTAREA_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={SITE_SETTING_KEYS.ogImageUrl}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">
                  URL de imagen para redes (OG Image)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://..."
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormDescription className="text-slate-500">
                  Imagen al compartir en WhatsApp, Twitter, Facebook, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <SettingsSaveButton label="Guardar identidad SEO" isSaving={isSaving} />
        </form>
      </Form>
    </SettingsSectionCard>
  );
}
