"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SettingsSaveButton } from "@/components/admin/settings/SettingsSaveButton";
import { SettingsSectionCard } from "@/components/admin/settings/SettingsSectionCard";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  adminSocialSettingsSchema,
  type AdminSocialSettingsInput,
} from "@/lib/schemas/admin-settings";
import { ADMIN_INPUT_CLASS } from "@/lib/admin-ui";
import { SITE_SETTING_KEYS } from "@/types/site-settings";

interface SettingsSocialSectionProps {
  settings: Record<string, string>;
  isSaving: boolean;
  onSave: (values: AdminSocialSettingsInput) => Promise<void>;
}

export function SettingsSocialSection({
  settings,
  isSaving,
  onSave,
}: SettingsSocialSectionProps) {
  const form = useForm<AdminSocialSettingsInput>({
    resolver: zodResolver(adminSocialSettingsSchema),
    defaultValues: {
      [SITE_SETTING_KEYS.instagramUrl]: "",
      [SITE_SETTING_KEYS.facebookUrl]: "",
      [SITE_SETTING_KEYS.tiktokUrl]: "",
      [SITE_SETTING_KEYS.youtubeUrl]: "",
    },
  });

  useEffect(() => {
    form.reset({
      [SITE_SETTING_KEYS.instagramUrl]:
        settings[SITE_SETTING_KEYS.instagramUrl] ?? "",
      [SITE_SETTING_KEYS.facebookUrl]:
        settings[SITE_SETTING_KEYS.facebookUrl] ?? "",
      [SITE_SETTING_KEYS.tiktokUrl]:
        settings[SITE_SETTING_KEYS.tiktokUrl] ?? "",
      [SITE_SETTING_KEYS.youtubeUrl]:
        settings[SITE_SETTING_KEYS.youtubeUrl] ?? "",
    });
  }, [settings, form]);

  return (
    <SettingsSectionCard
      title="Redes sociales"
      description="Instagram, Facebook, TikTok y YouTube — iconos en el footer de la tienda."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
          <FormField
            control={form.control}
            name={SITE_SETTING_KEYS.instagramUrl}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Instagram</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://instagram.com/..."
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={SITE_SETTING_KEYS.facebookUrl}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Facebook</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://facebook.com/..."
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={SITE_SETTING_KEYS.tiktokUrl}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">TikTok</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://tiktok.com/@..."
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={SITE_SETTING_KEYS.youtubeUrl}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">YouTube</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://youtube.com/@..."
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SettingsSaveButton label="Guardar redes" isSaving={isSaving} />
        </form>
      </Form>
    </SettingsSectionCard>
  );
}
