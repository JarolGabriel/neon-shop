/**
 * Elimina los posts demo del Showroom creados por seed-showroom-posts.mjs
 * Uso: node scripts/clean-showroom-seed.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env") });

const SEED_MARKER = "__SHOWROOM_SEED__";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  const { data: reviews, error } = await supabase
    .from("customer_reviews")
    .select("id, title")
    .like("comment", `%${SEED_MARKER}%`);

  if (error) throw error;

  if (!reviews?.length) {
    console.log("No hay posts demo para eliminar.");
    return;
  }

  const ids = reviews.map((row) => row.id);

  await supabase.from("review_comments").delete().in("review_id", ids);
  await supabase.from("review_reactions").delete().in("review_id", ids);

  const { error: deleteError } = await supabase
    .from("customer_reviews")
    .delete()
    .in("id", ids);

  if (deleteError) throw deleteError;

  console.log(`Eliminados ${ids.length} posts demo del showroom.`);
}

main().catch((error) => {
  console.error("Error al limpiar seed:", error.message ?? error);
  process.exit(1);
});
