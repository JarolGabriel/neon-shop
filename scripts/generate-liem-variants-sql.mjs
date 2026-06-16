/**
 * Genera SQL para importar variantes Neon → Liem (mapeo por slug)
 * y opcionalmente lo aplica con Supabase CLI --linked.
 *
 * Uso:
 *   node scripts/generate-liem-variants-sql.mjs
 *   node scripts/generate-liem-variants-sql.mjs --apply
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";
import pg from "pg";

config({ path: resolve(process.cwd(), ".env") });

const apply = process.argv.includes("--apply");
const liemSite = (process.env.LIEM_SITE_URL ?? "https://liem-shop.vercel.app").replace(
  /\/$/,
  "",
);

function sqlLiteral(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

async function fetchLiemProducts() {
  const slugToId = new Map();
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const res = await fetch(`${liemSite}/api/products?limit=30&page=${page}`);
    if (!res.ok) throw new Error(`Liem API ${res.status}`);
    const body = await res.json();
    totalPages = body.meta?.total_pages ?? 1;

    for (const product of body.data ?? []) {
      slugToId.set(product.slug, product.id);
    }
    page += 1;
  }

  return slugToId;
}

const neonPg = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await neonPg.connect();

const { rows: neonVariants } = await neonPg.query(`
  SELECT
    p.slug,
    pv.name,
    pv.sku,
    pv.price,
    pv.stock,
    pv.size,
    pv.color,
    pv.color_hex,
    pv.is_active
  FROM product_variants pv
  JOIN products p ON p.id = pv.product_id
  ORDER BY p.slug, pv.size NULLS LAST, pv.color NULLS LAST
`);

await neonPg.end();

const liemSlugToId = await fetchLiemProducts();

const mapped = [];
const skipped = [];

for (const row of neonVariants) {
  const liemProductId = liemSlugToId.get(row.slug);
  if (!liemProductId) {
    skipped.push(row.slug);
    continue;
  }
  mapped.push({ ...row, liemProductId });
}

const lines = [
  "-- Generado por scripts/generate-liem-variants-sql.mjs",
  "-- Borra variantes incorrectas e importa desde Neon Shop por slug",
  "BEGIN;",
  "DELETE FROM public.product_variants;",
];

const chunkSize = 50;
for (let i = 0; i < mapped.length; i += chunkSize) {
  const chunk = mapped.slice(i, i + chunkSize);
  const values = chunk
    .map((row) => {
      return `(
        ${sqlLiteral(row.liemProductId)}::uuid,
        ${sqlLiteral(row.name)},
        ${sqlLiteral(row.sku)},
        ${row.price},
        ${row.stock ?? 0},
        ${sqlLiteral(row.size)},
        ${sqlLiteral(row.color)},
        ${sqlLiteral(row.color_hex)},
        ${row.is_active !== false}
      )`;
    })
    .join(",\n");

  lines.push(`
INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES
${values};
`);
}

lines.push("COMMIT;");

const outPath = resolve(
  process.cwd(),
  "scripts/sql/liem-variants-import-generated.sql",
);
writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");

console.log(`Neon variantes: ${neonVariants.length}`);
console.log(`Mapeadas a Liem: ${mapped.length}`);
console.log(`Omitidas (slug no en Liem): ${skipped.length}`);
if (skipped.length > 0) {
  console.log("Slugs omitidos:", [...new Set(skipped)].join(", "));
}
console.log(`SQL escrito: ${outPath}`);

if (apply) {
  const { execSync } = await import("node:child_process");
  execSync(
    `npx supabase db query --linked --yes -f "${outPath}"`,
    { stdio: "inherit", cwd: process.cwd() },
  );
  console.log("SQL aplicado en Liem_db via Supabase CLI --linked");
}
