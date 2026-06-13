"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PolicyMarkdownField } from "@/components/admin/settings/PolicyMarkdownField";
import { SettingsSaveButton } from "@/components/admin/settings/SettingsSaveButton";
import { SettingsSectionCard } from "@/components/admin/settings/SettingsSectionCard";
import { Form } from "@/components/ui/form";
import {
  getDefaultRefundPolicyMarkdown,
  getDefaultShippingPolicyMarkdown,
} from "@/lib/policy-content-markdown";
import {
  adminPoliciesSettingsSchema,
  type AdminPoliciesSettingsInput,
} from "@/lib/schemas/admin-settings";
import { SITE_SETTING_KEYS } from "@/types/site-settings";

type PolicySettingKey =
  | typeof SITE_SETTING_KEYS.shippingInfo
  | typeof SITE_SETTING_KEYS.returnPolicy;

interface SettingsPoliciesSectionProps {
  settings: Record<string, string>;
  supportEmail: string;
  isSaving: boolean;
  onSave: (values: AdminPoliciesSettingsInput) => Promise<void>;
  onSavePartial: (key: PolicySettingKey, value: string) => Promise<void>;
}

export function SettingsPoliciesSection({
  settings,
  supportEmail,
  isSaving,
  onSave,
  onSavePartial,
}: SettingsPoliciesSectionProps) {
  const form = useForm<AdminPoliciesSettingsInput>({
    resolver: zodResolver(adminPoliciesSettingsSchema),
    defaultValues: {
      [SITE_SETTING_KEYS.shippingInfo]: "",
      [SITE_SETTING_KEYS.returnPolicy]: "",
    },
  });

  useEffect(() => {
    form.reset({
      [SITE_SETTING_KEYS.shippingInfo]:
        settings[SITE_SETTING_KEYS.shippingInfo] ?? "",
      [SITE_SETTING_KEYS.returnPolicy]:
        settings[SITE_SETTING_KEYS.returnPolicy] ?? "",
    });
  }, [settings, form]);

  const handleUseSiteTemplate = async (key: PolicySettingKey) => {
    form.setValue(key, "", { shouldDirty: true });
    await onSavePartial(key, "");
  };

  const previewLinks = (
    <div className="mt-3 flex flex-wrap gap-4 text-sm">
      <Link
        href="/politicas/envios"
        target="_blank"
        className="inline-flex items-center gap-1 text-vite-purple hover:underline"
      >
        Vista previa envíos
        <ExternalLink className="size-3.5" />
      </Link>
      <Link
        href="/politicas/devoluciones"
        target="_blank"
        className="inline-flex items-center gap-1 text-vite-purple hover:underline"
      >
        Vista previa devoluciones
        <ExternalLink className="size-3.5" />
      </Link>
    </div>
  );

  return (
    <SettingsSectionCard
      title="Políticas públicas"
      description="Contenido mostrado en las páginas legales de la tienda."
      headerExtra={previewLinks}
    >
      <div className="mb-6 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
        <div className="flex gap-2">
          <Info className="mt-0.5 size-4 shrink-0" />
          <ul className="list-disc space-y-1 pl-4">
            <li>
              Si escribes aquí, reemplaza la política pública. Déjalo vacío y
              guarda para usar la plantilla por defecto del sitio.
            </li>
            <li>
              Puedes usar Markdown: ## Título, párrafos, [texto](/ruta) o
              [texto](https://...).
            </li>
            <li>
              Usa {"{{support_email}}"} para insertar el email de soporte
              automáticamente.
            </li>
          </ul>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
          <PolicyMarkdownField
            form={form}
            name={SITE_SETTING_KEYS.shippingInfo}
            label="Política de envío"
            isSaving={isSaving}
            templateMarkdown={getDefaultShippingPolicyMarkdown()}
            onUseSiteTemplate={handleUseSiteTemplate}
          />
          <PolicyMarkdownField
            form={form}
            name={SITE_SETTING_KEYS.returnPolicy}
            label="Política de reembolsos"
            isSaving={isSaving}
            templateMarkdown={getDefaultRefundPolicyMarkdown(supportEmail)}
            onUseSiteTemplate={handleUseSiteTemplate}
          />
          <SettingsSaveButton label="Guardar políticas" isSaving={isSaving} />
        </form>
      </Form>
    </SettingsSectionCard>
  );
}
