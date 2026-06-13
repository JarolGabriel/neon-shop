"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { SettingsContactSection } from "@/components/admin/settings/SettingsContactSection";
import { SettingsPoliciesSection } from "@/components/admin/settings/SettingsPoliciesSection";
import { SettingsSocialSection } from "@/components/admin/settings/SettingsSocialSection";
import { Button } from "@/components/ui/button";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import type {
  AdminContactSettingsInput,
  AdminPoliciesSettingsInput,
  AdminSocialSettingsInput,
} from "@/lib/schemas/admin-settings";
import { getSupportEmail } from "@/lib/site-settings-utils";
import { SITE_SETTING_KEYS } from "@/types/site-settings";

type PolicySettingKey =
  | typeof SITE_SETTING_KEYS.shippingInfo
  | typeof SITE_SETTING_KEYS.returnPolicy;

export function AdminSettingsView() {
  const { settings, isLoading, isSaving, error, refresh, saveSettings } =
    useAdminSettings();

  const saveContact = async (values: AdminContactSettingsInput) => {
    await saveSettings([
      {
        key: SITE_SETTING_KEYS.whatsappNumber,
        value: values[SITE_SETTING_KEYS.whatsappNumber],
        description: "Número de WhatsApp para pedidos y contacto",
      },
      {
        key: SITE_SETTING_KEYS.supportEmail,
        value: values[SITE_SETTING_KEYS.supportEmail],
        description: "Email de soporte al cliente",
      },
      {
        key: SITE_SETTING_KEYS.address,
        value: values[SITE_SETTING_KEYS.address] ?? "",
        description: "Dirección del negocio",
      },
      {
        key: SITE_SETTING_KEYS.businessHours,
        value: values[SITE_SETTING_KEYS.businessHours] ?? "",
        description: "Horario de atención",
      },
    ]);
  };

  const savePolicies = async (values: AdminPoliciesSettingsInput) => {
    await saveSettings([
      {
        key: SITE_SETTING_KEYS.shippingInfo,
        value: values[SITE_SETTING_KEYS.shippingInfo],
        description: "Política de envío",
      },
      {
        key: SITE_SETTING_KEYS.returnPolicy,
        value: values[SITE_SETTING_KEYS.returnPolicy],
        description: "Política de reembolsos",
      },
    ]);
  };

  const saveSocial = async (values: AdminSocialSettingsInput) => {
    await saveSettings([
      {
        key: SITE_SETTING_KEYS.instagramUrl,
        value: values[SITE_SETTING_KEYS.instagramUrl] ?? "",
        description: "URL de Instagram",
      },
      {
        key: SITE_SETTING_KEYS.facebookUrl,
        value: values[SITE_SETTING_KEYS.facebookUrl] ?? "",
        description: "URL de Facebook",
      },
      {
        key: SITE_SETTING_KEYS.tiktokUrl,
        value: values[SITE_SETTING_KEYS.tiktokUrl] ?? "",
        description: "URL de TikTok",
      },
      {
        key: SITE_SETTING_KEYS.youtubeUrl,
        value: values[SITE_SETTING_KEYS.youtubeUrl] ?? "",
        description: "URL de YouTube",
      },
    ]);
  };

  const savePartialPolicy = async (key: PolicySettingKey, value: string) => {
    const descriptions: Record<PolicySettingKey, string> = {
      [SITE_SETTING_KEYS.shippingInfo]: "Política de envío",
      [SITE_SETTING_KEYS.returnPolicy]: "Política de reembolsos",
    };

    await saveSettings([{ key, value, description: descriptions[key] }]);
  };

  const supportEmail =
    getSupportEmail(settings) ?? "info@neonshop.com";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Configuración"
          description="Datos de contacto, políticas y redes que ve la tienda pública."
        />
        <AdminTableSkeleton rows={6} columns={2} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Configuración"
        description="Datos de contacto, políticas y redes que ve la tienda pública."
      />

      {error ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refresh()}
            className="border-red-200 bg-white"
          >
            Reintentar
          </Button>
        </div>
      ) : null}

      <div className="space-y-6">
        <SettingsContactSection
          settings={settings}
          isSaving={isSaving}
          onSave={saveContact}
        />
        <SettingsPoliciesSection
          settings={settings}
          supportEmail={supportEmail}
          isSaving={isSaving}
          onSave={savePolicies}
          onSavePartial={savePartialPolicy}
        />
        <SettingsSocialSection
          settings={settings}
          isSaving={isSaving}
          onSave={saveSocial}
        />
      </div>
    </div>
  );
}
