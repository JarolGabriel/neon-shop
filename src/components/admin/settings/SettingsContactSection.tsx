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
  adminContactSettingsSchema,
  type AdminContactSettingsInput,
} from "@/lib/schemas/admin-settings";
import { ADMIN_INPUT_CLASS, ADMIN_TEXTAREA_CLASS } from "@/lib/admin-ui";
import { SITE_SETTING_KEYS } from "@/types/site-settings";

interface SettingsContactSectionProps {
  settings: Record<string, string>;
  isSaving: boolean;
  onSave: (values: AdminContactSettingsInput) => Promise<void>;
}

export function SettingsContactSection({
  settings,
  isSaving,
  onSave,
}: SettingsContactSectionProps) {
  const form = useForm<AdminContactSettingsInput>({
    resolver: zodResolver(adminContactSettingsSchema),
    defaultValues: {
      [SITE_SETTING_KEYS.whatsappNumber]: "",
      [SITE_SETTING_KEYS.supportEmail]: "",
      [SITE_SETTING_KEYS.address]: "",
      [SITE_SETTING_KEYS.businessHours]: "",
    },
  });

  useEffect(() => {
    form.reset({
      [SITE_SETTING_KEYS.whatsappNumber]:
        settings[SITE_SETTING_KEYS.whatsappNumber] ?? "",
      [SITE_SETTING_KEYS.supportEmail]:
        settings[SITE_SETTING_KEYS.supportEmail] ?? "",
      [SITE_SETTING_KEYS.address]: settings[SITE_SETTING_KEYS.address] ?? "",
      [SITE_SETTING_KEYS.businessHours]:
        settings[SITE_SETTING_KEYS.businessHours] ?? "",
    });
  }, [settings, form]);

  return (
    <SettingsSectionCard
      title="Contacto y WhatsApp"
      description="Footer, checkout, WhatsApp post-pedido y emails."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
          <FormField
            control={form.control}
            name={SITE_SETTING_KEYS.whatsappNumber}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="584121234567"
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormDescription>
                  Código país (ej. 58412…). Footer, checkout y post-pedido.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={SITE_SETTING_KEYS.supportEmail}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Email de soporte</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormDescription>
                  Footer, Resend y {"{{support_email}}"} en políticas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={SITE_SETTING_KEYS.address}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Dirección</FormLabel>
                <FormControl>
                  <Input {...field} className={ADMIN_INPUT_CLASS} disabled={isSaving} />
                </FormControl>
                <FormDescription>Columna contacto del footer.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={SITE_SETTING_KEYS.businessHours}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Horario de atención</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    className={ADMIN_TEXTAREA_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormDescription>Horario en el footer.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <SettingsSaveButton label="Guardar contacto" isSaving={isSaving} />
        </form>
      </Form>
    </SettingsSectionCard>
  );
}
