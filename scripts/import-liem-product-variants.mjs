/**
 * Importa product_variants a Liem_db correctamente (mapeo por slug, no por UUID de Neon).
 *
 * Problema habitual: importar CSV directo en Supabase usa product_id de Neon Shop
 * y Liem tiene otros UUID → variantes huérfanas o incompletas.
 *
 * Requiere en .env:
 *   DATABASE_URL o NEON_DATABASE_URL  → Neon Shop
 *   LIEM_DATABASE_URL                 → Liem_db
 *
 * Uso recomendado (TODAS las variantes desde Neon DB):
 *   node scripts/import-liem-product-variants.mjs --dry-run
 *   node scripts/import-liem-product-variants.mjs --yes
 *
 * Desde CSV (solo si exportaste el archivo completo):
 *   node scripts/import-liem-product-variants.mjs --from-csv /ruta/product_variants_rows.csv --dry-run
 *   node scripts/import-liem-product-variants.mjs --from-csv /ruta/product_variants_rows.csv --yes
 *
 * Flags:
 *   --dry-run   Solo muestra qué haría
 *   --yes       Ejecuta sin preguntar (borra variantes Liem y reimporta)
 *   --from-csv  Ruta al CSV exportado de Neon (opcional; default = sync desde Neon DB)
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";
import pg from "pg";

config({ path: resolve(process.cwd(), ".env") });

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const autoYes = args.includes("--yes");
const fromCsvIndex = args.indexOf("--from-csv");
const csvPath =
  fromCsvIndex >= 0 ? args[fromCsvIndex + 1] : null;

const neonDatabaseUrl =
  process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL;
const liemDatabaseUrl = process.env.LIEM_DATABASE_URL;

function requireEnv(label, value) {
  if (!value?.trim()) {
    console.error(`Falta ${label} en .env`);
    process.exit(1);
  }
  return value.trim();
}

function parseCsvLine(line) {
  const parts = line.split(",");
  if (parts.length < 11) return null;

  const [
    id,
    product_id,
    name,
    sku,
    price,
    stock,
    size,
    color,
    is_active,
    created_at,
    color_hex,
  ] = parts;

  return {
    neonVariantId: id.trim(),
    neonProductId: product_id.trim(),
    name: name?.trim() || null,
    sku: sku?.trim() || null,
    price: Number.parseFloat(price),
    stock: Number.parseInt(stock, 10) || 0,
    size: size?.trim() || null,
    color: color?.trim() || null,
    is_active: is_active?.trim() !== "false",
    color_hex: color_hex?.trim() || null,
  };
}

function loadCsvVariants(path) {
  const raw = readFileSync(path, "utf8").trim();
  const lines = raw.split(/\r?\n/);
  const header = lines[0];
  if (!header?.includes("product_id")) {
    throw new Error("CSV inválido: falta columna product_id");
  }

  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const parsed = parseCsvLine(lines[i]);
    if (parsed && !Number.isNaN(parsed.price)) rows.push(parsed);
  }
  return rows;
}

async function buildSlugMaps(neonPg, liemPg) {
  const [neonProducts, liemProducts] = await Promise.all([
    neonPg.query(`SELECT id, slug FROM products`),
    liemPg.query(`SELECT id, slug FROM products`),
  ]);

  const neonIdToSlug = new Map(
    neonProducts.rows.map((row) => [row.id, row.slug]),
  );
  const liemSlugToId = new Map(
    liemProducts.rows.map((row) => [row.slug, row.id]),
  );

  return { neonIdToSlug, liemSlugToId };
}

function mapVariantRows(rows, neonIdToSlug, liemSlugToId) {
  const mapped = [];
  const skipped = [];

  for (const row of rows) {
    const slug = neonIdToSlug.get(row.neonProductId);
    if (!slug) {
      skipped.push({ reason: "product_id Neon sin slug", row });
      continue;
    }

    const liemProductId = liemSlugToId.get(slug);
    if (!liemProductId) {
      skipped.push({ reason: `slug no existe en Liem: ${slug}`, row });
      continue;
    }

    mapped.push({
      liemProductId,
      slug,
      name: row.name,
      sku: row.sku,
      price: row.price,
      stock: row.stock,
      size: row.size,
      color: row.color,
      color_hex: row.color_hex,
      is_active: row.is_active,
    });
  }

  return { mapped, skipped };
}

async function fetchAllVariantsFromNeon(neonPg) {
  const { rows } = await neonPg.query(`
    SELECT
      pv.name,
      pv.sku,
      pv.price,
      pv.stock,
      pv.size,
      pv.color,
      pv.color_hex,
      pv.is_active,
      p.slug
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    ORDER BY p.slug, pv.size NULLS LAST, pv.color NULLS LAST
  `);

  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    sku: row.sku,
    price: Number(row.price),
    stock: row.stock ?? 0,
    size: row.size,
    color: row.color,
    color_hex: row.color_hex,
    is_active: row.is_active !== false,
  }));
}

async function wipeLiemVariants(liemPg) {
  const before = await liemPg.query(`SELECT count(*)::int AS c FROM product_variants`);
  if (dryRun) {
    console.log(`  [dry-run] Borraría ${before.rows[0].c} variantes en Liem`);
    return before.rows[0].c;
  }
  await liemPg.query(`DELETE FROM product_variants`);
  return before.rows[0].c;
}

async function insertVariants(liemPg, mapped, liemSlugToId) {
  const byProduct = new Map();
  for (const row of mapped) {
    const liemProductId =
      row.liemProductId ?? liemSlugToId.get(row.slug);
    if (!liemProductId) continue;

    if (!byProduct.has(liemProductId)) byProduct.set(liemProductId, []);
    byProduct.get(liemProductId).push({ ...row, liemProductId });
  }

  let inserted = 0;

  for (const [productId, variants] of byProduct) {
    if (dryRun) {
      inserted += variants.length;
      continue;
    }

    for (const variant of variants) {
      await liemPg.query(
        `
        INSERT INTO product_variants (
          product_id, name, sku, price, stock, size, color, color_hex, is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [
          productId,
          variant.name,
          variant.sku,
          variant.price,
          variant.stock,
          variant.size,
          variant.color,
          variant.color_hex,
          variant.is_active ?? true,
        ],
      );
      inserted += 1;
    }
  }

  return { inserted, products: byProduct.size };
}

async function printSummary(liemPg) {
  const stats = await liemPg.query(`
    SELECT
      count(*)::int AS total,
      count(DISTINCT product_id)::int AS products
    FROM product_variants
  `);

  const samples = await liemPg.query(`
    SELECT p.slug, count(pv.id)::int AS variants
    FROM products p
    JOIN product_variants pv ON pv.product_id = p.id
    WHERE p.slug IN (
      'ghost-led-neon-sign',
      'popsicle-led-neon-sign',
      'pickle-led-neon-sign',
      'maneki-neko-led-neon-sign'
    )
    GROUP BY p.slug
    ORDER BY p.slug
  `);

  console.log("\nLiem tras import:", stats.rows[0]);
  console.log("Muestra:");
  for (const row of samples.rows) {
    console.log(`  ${row.slug}: ${row.variants} variantes`);
  }

  const missing = await liemPg.query(`
    SELECT p.slug
    FROM products p
    LEFT JOIN product_variants pv ON pv.product_id = p.id
    WHERE p.is_active = true AND pv.id IS NULL
    ORDER BY p.slug
    LIMIT 8
  `);
  if (missing.rows.length > 0) {
    console.log("Sin variantes (muestra):");
    for (const row of missing.rows) {
      console.log(`  - ${row.slug}`);
    }
  }
}

const neonPg = new pg.Client({
  connectionString: requireEnv("NEON DATABASE_URL", neonDatabaseUrl),
  ssl: { rejectUnauthorized: false },
});
const liemPg = new pg.Client({
  connectionString: requireEnv("LIEM_DATABASE_URL", liemDatabaseUrl),
  ssl: { rejectUnauthorized: false },
});

try {
  await neonPg.connect();
  await liemPg.connect();

  const { neonIdToSlug, liemSlugToId } = await buildSlugMaps(neonPg, liemPg);

  let sourceRows;
  let sourceLabel;

  if (csvPath) {
    sourceRows = loadCsvVariants(csvPath);
    sourceLabel = `CSV (${sourceRows.length} filas)`;
    console.log(`\n⚠️  Tu CSV tiene ${sourceRows.length} filas. Neon DB tiene ~1008.`);
    console.log("   Para TODOS los colores/tamaños, omite --from-csv y usa sync desde Neon DB.\n");
  } else {
    sourceRows = await fetchAllVariantsFromNeon(neonPg);
    sourceLabel = `Neon DB (${sourceRows.length} filas)`;
  }

  const { mapped, skipped } = csvPath
    ? mapVariantRows(sourceRows, neonIdToSlug, liemSlugToId)
    : {
        mapped: sourceRows
          .filter((row) => liemSlugToId.has(row.slug))
          .map((row) => ({
            ...row,
            liemProductId: liemSlugToId.get(row.slug),
          })),
        skipped: sourceRows
          .filter((row) => !liemSlugToId.has(row.slug))
          .map((row) => ({ reason: `slug no en Liem: ${row.slug}`, row })),
      };

  console.log(dryRun ? "=== DRY RUN ===" : "=== IMPORT Liem variantes ===");
  console.log(`Fuente: ${sourceLabel}`);
  console.log(`Mapeadas: ${mapped.length}`);
  console.log(`Omitidas: ${skipped.length}`);

  if (skipped.length > 0 && skipped.length <= 5) {
    for (const item of skipped) {
      console.log(`  - ${item.reason}`);
    }
  }

  const productCounts = new Map();
  for (const row of mapped) {
    const key = row.slug ?? neonIdToSlug.get(row.neonProductId);
    productCounts.set(key, (productCounts.get(key) ?? 0) + 1);
  }
  console.log(`Productos con variantes: ${productCounts.size}`);

  if (!dryRun && !autoYes) {
    console.log(
      "\nEsto BORRARÁ todas las variantes actuales en Liem y las reemplazará.",
    );
    console.log("Ejecuta con --yes para confirmar.");
    process.exit(0);
  }

  const deleted = await wipeLiemVariants(liemPg);
  if (!dryRun) console.log(`  Borradas ${deleted} variantes antiguas en Liem`);

  const { inserted, products } = await insertVariants(
    liemPg,
    mapped,
    liemSlugToId,
  );

  console.log(`  Insertadas: ${inserted} variantes en ${products} productos`);

  await printSummary(liemPg);
  console.log("\nVerifica en producción:");
  console.log("  https://liem-shop.vercel.app/api/products/popsicle-led-neon-sign");
  console.log("  (debería mostrar 21 variantes, 3 tamaños, 7 colores)");
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
} finally {
  await neonPg.end().catch(() => undefined);
  await liemPg.end().catch(() => undefined);
}
