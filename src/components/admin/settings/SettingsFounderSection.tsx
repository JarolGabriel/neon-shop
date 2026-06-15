"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AdminImageUploadDropzone } from "@/components/admin/AdminImageUploadDropzone";
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
import { uploadAdminFounderImage } from "@/lib/admin-api";
import {
  adminFounderSettingsSchema,
  type AdminFounderSettingsInput,
} from "@/lib/schemas/admin-settings";
import { ADMIN_INPUT_CLASS } from "@/lib/admin-ui";
import {
  DEFAULT_FOUNDER_IMAGE_ALT,
  DEFAULT_FOUNDER_IMAGE_URL,
  DEFAULT_FOUNDER_NAME,
  DEFAULT_FOUNDER_SECTION_HEADING,
} from "@/lib/site-settings-utils";
import { resolvePublicStorageUrl } from "@/lib/storage-url";
import { SITE_SETTING_KEYS } from "@/types/site-settings";

interface SettingsFounderSectionProps {
  settings: Record<string, string>;
  isSaving: boolean;
  onSave: (values: AdminFounderSettingsInput) => Promise<void>;
}

export function SettingsFounderSection({
  settings,
  isSaving,
  onSave,
}: SettingsFounderSectionProps) {
  const form = useForm<AdminFounderSettingsInput>({
    resolver: zodResolver(adminFounderSettingsSchema),
    defaultValues: {
      [SITE_SETTING_KEYS.founderName]: DEFAULT_FOUNDER_NAME,
      [SITE_SETTING_KEYS.founderImageUrl]: DEFAULT_FOUNDER_IMAGE_URL,
      [SITE_SETTING_KEYS.founderImageAlt]: DEFAULT_FOUNDER_IMAGE_ALT,
      [SITE_SETTING_KEYS.founderSectionHeading]: DEFAULT_FOUNDER_SECTION_HEADING,
    },
  });

  useEffect(() => {
    form.reset({
      [SITE_SETTING_KEYS.founderName]:
        settings[SITE_SETTING_KEYS.founderName] ?? DEFAULT_FOUNDER_NAME,
      [SITE_SETTING_KEYS.founderImageUrl]:
        settings[SITE_SETTING_KEYS.founderImageUrl] ?? DEFAULT_FOUNDER_IMAGE_URL,
      [SITE_SETTING_KEYS.founderImageAlt]:
        settings[SITE_SETTING_KEYS.founderImageAlt] ?? DEFAULT_FOUNDER_IMAGE_ALT,
      [SITE_SETTING_KEYS.founderSectionHeading]:
        settings[SITE_SETTING_KEYS.founderSectionHeading] ??
        DEFAULT_FOUNDER_SECTION_HEADING,
    });
  }, [settings, form]);

  const imageUrl = form.watch(SITE_SETTING_KEYS.founderImageUrl);
  const previewSrc = resolvePublicStorageUrl(imageUrl) ?? imageUrl;

  const handleImageUpload = useCallback(
    async (file: File) => {
      const { image_url } = await uploadAdminFounderImage(file);
      form.setValue(SITE_SETTING_KEYS.founderImageUrl, image_url, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Foto subida. Guarda los cambios para publicarla.");
    },
    [form],
  );

  return (
    <SettingsSectionCard
      title="Perfil del fundador"
      description="Foto y nombre que aparecen en la página de inicio y en Quiénes somos."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              {previewSrc ? (
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  <Image
                    src={previewSrc}
                    alt="Vista previa del fundador"
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover object-center"
                    unoptimized={previewSrc.startsWith("/storage/")}
                  />
                </div>
              ) : null}
              <AdminImageUploadDropzone
                multiple={false}
                disabled={isSaving}
                onUpload={handleImageUpload}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name={SITE_SETTING_KEYS.founderName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Nombre del fundador
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={DEFAULT_FOUNDER_NAME}
                        className={ADMIN_INPUT_CLASS}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormDescription className="text-slate-500">
                      Usa {"{{store_name}}"} para insertar el nombre de la
                      tienda automáticamente.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={SITE_SETTING_KEYS.founderSectionHeading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Título de la sección (solo inicio)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={DEFAULT_FOUNDER_SECTION_HEADING}
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
                name={SITE_SETTING_KEYS.founderImageAlt}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Texto alternativo de la foto
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={DEFAULT_FOUNDER_IMAGE_ALT}
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
                name={SITE_SETTING_KEYS.founderImageUrl}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      URL de la foto
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={DEFAULT_FOUNDER_IMAGE_URL}
                        className={ADMIN_INPUT_CLASS}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormDescription className="text-slate-500">
                      Ruta local o URL de Supabase. Se actualiza al subir una
                      imagen nueva.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <SettingsSaveButton label="Guardar perfil del fundador" isSaving={isSaving} />
        </form>
      </Form>
    </SettingsSectionCard>
  );
}
