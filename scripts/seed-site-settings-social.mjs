/**
 * Inserta youtube_url y tiktok_url en site_settings si no existen.
 * Uso: node scripts/seed-site-settings-social.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const SOCIAL_SETTINGS = [
  {
    key: "tiktok_url",
    value: "",
    description: "URL del perfil de TikTok",
  },
  {
    key: "youtube_url",
    value: "",
    description: "URL del canal de YouTube",
  },
];

const { data: existing, error: readError } = await supabase
  .from("site_settings")
  .select("key")
  .in(
    "key",
    SOCIAL_SETTINGS.map((setting) => setting.key),
  );

if (readError) {
  console.error("Error al leer site_settings:", readError.message);
  process.exit(1);
}

const existingKeys = new Set((existing ?? []).map((row) => row.key));
const toInsert = SOCIAL_SETTINGS.filter(
  (setting) => !existingKeys.has(setting.key),
);

if (toInsert.length === 0) {
  console.log("youtube_url y tiktok_url ya existen en site_settings.");
  process.exit(0);
}

const { error: insertError } = await supabase
  .from("site_settings")
  .insert(toInsert);

if (insertError) {
  console.error("Error al insertar site_settings:", insertError.message);
  process.exit(1);
}

console.log(
  `Insertadas ${toInsert.length} clave(s): ${toInsert.map((s) => s.key).join(", ")}`,
);
