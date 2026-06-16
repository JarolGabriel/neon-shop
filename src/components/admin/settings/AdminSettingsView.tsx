"use client";

import { AdminErrorBanner } from "@/components/admin/AdminErrorBanner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { SettingsFounderSection } from "@/components/admin/settings/SettingsFounderSection";
import { SettingsIdentitySection } from "@/components/admin/settings/SettingsIdentitySection";
import { SettingsBrandingSection } from "@/components/admin/settings/SettingsBrandingSection";
import { SettingsContactSection } from "@/components/admin/settings/SettingsContactSection";
import { SettingsPoliciesSection } from "@/components/admin/settings/SettingsPoliciesSection";
import { SettingsSocialSection } from "@/components/admin/settings/SettingsSocialSection";
import { Button } from "@/components/ui/button";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import type {
  AdminBrandingSettingsInput,
  AdminContactSettingsInput,
  AdminFounderSettingsInput,
  AdminIdentitySettingsInput,
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

  const saveIdentity = async (values: AdminIdentitySettingsInput) => {
    await saveSettings([
      {
        key: SITE_SETTING_KEYS.siteName,
        value: values[SITE_SETTING_KEYS.siteName],
        description:
          "Nombre comercial de la tienda (aparece en el título del navegador y Google)",
      },
      {
        key: SITE_SETTING_KEYS.siteTagline,
        value: values[SITE_SETTING_KEYS.siteTagline],
        description: "Slogan o subtítulo de la tienda",
      },
      {
        key: SITE_SETTING_KEYS.siteDescription,
        value: values[SITE_SETTING_KEYS.siteDescription],
        description:
          "Descripción SEO que aparece en Google y al compartir en redes sociales",
      },
      {
        key: SITE_SETTING_KEYS.ogImageUrl,
        value: values[SITE_SETTING_KEYS.ogImageUrl] ?? "",
        description:
          "URL absoluta de la imagen que aparece al compartir en WhatsApp, Twitter, etc.",
      },
    ]);
  };

  const saveBranding = async (values: AdminBrandingSettingsInput) => {
    await saveSettings([
      {
        key: SITE_SETTING_KEYS.storeName,
        value: values[SITE_SETTING_KEYS.storeName],
        description: "Nombre público de la tienda (navbar, emails, SEO)",
      },
    ]);
  };

  const saveFounder = async (values: AdminFounderSettingsInput) => {
    await saveSettings([
      {
        key: SITE_SETTING_KEYS.founderName,
        value: values[SITE_SETTING_KEYS.founderName],
        description:
          "Nombre del fundador en Home y Quiénes somos (usa {{store_name}})",
      },
      {
        key: SITE_SETTING_KEYS.founderImageUrl,
        value: values[SITE_SETTING_KEYS.founderImageUrl],
        description: "Foto del fundador (ruta local o URL de Supabase Storage)",
      },
      {
        key: SITE_SETTING_KEYS.founderImageAlt,
        value: values[SITE_SETTING_KEYS.founderImageAlt],
        description: "Texto alternativo de la foto del fundador",
      },
      {
        key: SITE_SETTING_KEYS.founderSectionHeading,
        value: values[SITE_SETTING_KEYS.founderSectionHeading],
        description: "Título de la sección del fundador en la página de inicio",
      },
    ]);
  };

  const saveContact = async (values: AdminContactSettingsInput) => {
    await saveSettings([
      {
        key: SITE_SETTING_KEYS.whatsappNumber,
        value: values[SITE_SETTING_KEYS.whatsappNumber],
        description: "Número de WhatsApp para pedidos y contacto",
      },
      {
        key: SITE_SETTING_KEYS.whatsappFloatingEnabled,
        value: values[SITE_SETTING_KEYS.whatsappFloatingEnabled]
          ? "true"
          : "false",
        description:
          "Mostrar botón flotante de WhatsApp en la tienda (true/false)",
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
        <AdminErrorBanner message={error} onRetry={() => void refresh()} />
      ) : null}

      <div className="space-y-6">
        <SettingsIdentitySection
          settings={settings}
          isSaving={isSaving}
          onSave={saveIdentity}
        />
        <SettingsBrandingSection
          settings={settings}
          isSaving={isSaving}
          onSave={saveBranding}
        />
        <SettingsFounderSection
          settings={settings}
          isSaving={isSaving}
          onSave={saveFounder}
        />
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
