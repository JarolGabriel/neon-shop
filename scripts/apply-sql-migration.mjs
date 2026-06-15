/**
 * Applies a local SQL migration file against DATABASE_URL (Supabase Postgres).
 * Usage: node scripts/apply-sql-migration.mjs supabase/migrations/20260615000000_fix_custom_designs_preferred_size.sql
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

config({ path: resolve(process.cwd(), ".env") });

const migrationPath = process.argv[2];
if (!migrationPath) {
  console.error("Uso: node scripts/apply-sql-migration.mjs <ruta-al-archivo.sql>");
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error(
    "Falta DATABASE_URL en .env (connection string de Supabase → Settings → Database).",
  );
  process.exit(1);
}

const sql = readFileSync(resolve(process.cwd(), migrationPath), "utf8");

const { default: pg } = await import("pg");
const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log(`Migración aplicada: ${migrationPath}`);
} catch (error) {
  console.error("Error al aplicar migración:", error);
  process.exit(1);
} finally {
  await client.end();
}
