"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ADMIN_TEXTAREA_CLASS } from "@/lib/admin-ui";
import type { AdminPoliciesSettingsInput } from "@/lib/schemas/admin-settings";
import { SITE_SETTING_KEYS } from "@/types/site-settings";

type PolicySettingKey =
  | typeof SITE_SETTING_KEYS.shippingInfo
  | typeof SITE_SETTING_KEYS.returnPolicy;

interface PolicyMarkdownFieldProps {
  form: UseFormReturn<AdminPoliciesSettingsInput>;
  name: PolicySettingKey;
  label: string;
  isSaving: boolean;
  templateMarkdown: string;
  onUseSiteTemplate: (key: PolicySettingKey) => Promise<void>;
}

export function PolicyMarkdownField({
  form,
  name,
  label,
  isSaving,
  templateMarkdown,
  onUseSiteTemplate,
}: PolicyMarkdownFieldProps) {
  const [insertConfirmOpen, setInsertConfirmOpen] = useState(false);
  const [siteTemplateConfirmOpen, setSiteTemplateConfirmOpen] = useState(false);
  const [isApplyingSiteTemplate, setIsApplyingSiteTemplate] = useState(false);

  const handleInsertTemplate = () => {
    form.setValue(name, templateMarkdown, { shouldDirty: true });
  };

  const handleUseSiteTemplate = async () => {
    setIsApplyingSiteTemplate(true);
    try {
      await onUseSiteTemplate(name);
    } finally {
      setIsApplyingSiteTemplate(false);
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <FormLabel className="text-slate-700">{label}</FormLabel>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-slate-200"
                  disabled={isSaving}
                  onClick={() => setInsertConfirmOpen(true)}
                >
                  Insertar plantilla
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-slate-200"
                  disabled={isSaving}
                  onClick={() => setSiteTemplateConfirmOpen(true)}
                >
                  Usar plantilla del sitio
                </Button>
              </div>
            </div>
            <FormControl>
              <Textarea
                {...field}
                rows={18}
                className={`${ADMIN_TEXTAREA_CLASS} resize-y font-mono text-sm`}
                disabled={isSaving}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ConfirmDialog
        open={insertConfirmOpen}
        onOpenChange={setInsertConfirmOpen}
        title="Insertar plantilla"
        description="¿Reemplazar el texto del formulario con la plantilla Markdown?"
        confirmLabel="Insertar"
        tone="admin"
        onConfirm={handleInsertTemplate}
      />

      <ConfirmDialog
        open={siteTemplateConfirmOpen}
        onOpenChange={setSiteTemplateConfirmOpen}
        title="Usar plantilla del sitio"
        description="¿Guardar vacío y usar la plantilla por defecto del sitio en la tienda?"
        confirmLabel="Usar plantilla"
        tone="admin"
        isLoading={isApplyingSiteTemplate}
        onConfirm={handleUseSiteTemplate}
      />
    </>
  );
}
