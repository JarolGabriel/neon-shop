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
import {
  adminBrandingSettingsSchema,
  type AdminBrandingSettingsInput,
} from "@/lib/schemas/admin-settings";
import { ADMIN_INPUT_CLASS } from "@/lib/admin-ui";
import { DEFAULT_STORE_NAME } from "@/lib/store-branding";
import { SITE_SETTING_KEYS } from "@/types/site-settings";

interface SettingsBrandingSectionProps {
  settings: Record<string, string>;
  isSaving: boolean;
  onSave: (values: AdminBrandingSettingsInput) => Promise<void>;
}

export function SettingsBrandingSection({
  settings,
  isSaving,
  onSave,
}: SettingsBrandingSectionProps) {
  const form = useForm<AdminBrandingSettingsInput>({
    resolver: zodResolver(adminBrandingSettingsSchema),
    defaultValues: {
      [SITE_SETTING_KEYS.storeName]: DEFAULT_STORE_NAME,
    },
  });

  useEffect(() => {
    form.reset({
      [SITE_SETTING_KEYS.storeName]:
        settings[SITE_SETTING_KEYS.storeName] ?? DEFAULT_STORE_NAME,
    });
  }, [settings, form]);

  return (
    <SettingsSectionCard
      title="Identidad de marca"
      description="Nombre visible en navbar, footer y emails (distinto del título SEO)."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
          <FormField
            control={form.control}
            name={SITE_SETTING_KEYS.storeName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Nombre de la tienda</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={DEFAULT_STORE_NAME}
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormDescription className="text-slate-500">
                  Aparece en navbar, footer, emails transaccionales y pestaña del
                  navegador. Ejemplo white-label: Liem Shop.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <SettingsSaveButton label="Guardar identidad" isSaving={isSaving} />
        </form>
      </Form>
    </SettingsSectionCard>
  );
}
