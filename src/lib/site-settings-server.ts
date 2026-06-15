import { supabaseAdmin } from "@/lib/supabase";
import { getStoreName } from "@/lib/store-branding";

export async function fetchSiteSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("key, value");

  if (error || !data) return {};

  return data.reduce<Record<string, string>>((acc, row) => {
    if (row.key) {
      acc[row.key] = row.value ?? "";
    }
    return acc;
  }, {});
}

/** @deprecated Usar fetchSiteSettings */
export const getSiteSettingsFromDb = fetchSiteSettings;

export async function getStoreNameFromDb(): Promise<string> {
  const settings = await fetchSiteSettings();
  return getStoreName(settings);
}
