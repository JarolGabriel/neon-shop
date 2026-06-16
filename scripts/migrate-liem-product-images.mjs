/**
 * Migra imágenes de productos/categorías/promos de Neon Shop → Liem Shop.
 *
 * Requiere en .env (o exportadas en shell):
 *   NEON_SUPABASE_URL / NEON_SERVICE_ROLE_KEY  (default: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
 *   LIEM_SUPABASE_URL=https://cnezxcuwujhqpeknqqcb.supabase.co
 *   LIEM_SERVICE_ROLE_KEY=...
 *   LIEM_DATABASE_URL=postgresql://postgres.cnezxcuwujhqpeknqqcb:PASSWORD@aws-1-us-west-2.pooler.supabase.com:6543/postgres
 *
 * Uso:
 *   node scripts/migrate-liem-product-images.mjs --dry-run
 *   node scripts/migrate-liem-product-images.mjs
 *   node scripts/migrate-liem-product-images.mjs --copy-only
 *   node scripts/migrate-liem-product-images.mjs --sql-only
 *   node scripts/migrate-liem-product-images.mjs --seed-only
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import pg from "pg";

config({ path: resolve(process.cwd(), ".env") });

const NEON_REF = "nekjvszntyaswghwtrig";
const LIEM_REF = "cnezxcuwujhqpeknqqcb";
const BUCKET = "product_images";

const MISSING_PRODUCT_SLUGS = [
  "chameleon-led-neon-sign",
  "pickle-led-neon-sign",
  "lightbulb-led-neon-sign",
  "rain-cloud-led-neon-sign",
  "avocado-led-neon-sign",
  "maneki-neko-led-neon-sign",
];

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const copyOnly = args.has("--copy-only");
const sqlOnly = args.has("--sql-only");
const seedOnly = args.has("--seed-only");
const runAll = !copyOnly && !sqlOnly && !seedOnly;

const neonUrl =
  process.env.NEON_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const neonKey =
  process.env.NEON_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const liemUrl = process.env.LIEM_SUPABASE_URL;
const liemKey = process.env.LIEM_SERVICE_ROLE_KEY;
const liemDatabaseUrl = process.env.LIEM_DATABASE_URL;
const neonDatabaseUrl = process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL;

function requireEnv(label, value) {
  if (!value?.trim()) {
    console.error(`Falta ${label} en .env`);
    process.exit(1);
  }
  return value.trim();
}

function storagePathFromUrl(url) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

function liemPublicUrl(path) {
  return `${liemUrl.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${path}`;
}

function guessContentType(path) {
  const lower = path.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

async function collectStoragePaths(client) {
  const queries = [
    `SELECT image_url FROM product_images WHERE image_url LIKE '%${NEON_REF}%'`,
    `SELECT image_url FROM categories WHERE image_url LIKE '%${NEON_REF}%'`,
    `SELECT image_url FROM promotion_images WHERE image_url LIKE '%${NEON_REF}%'`,
  ];

  const paths = new Set();
  for (const sql of queries) {
    const { rows } = await client.query(sql);
    for (const row of rows) {
      const path = storagePathFromUrl(row.image_url);
      if (path) paths.add(path);
    }
  }

  for (const slug of MISSING_PRODUCT_SLUGS) {
    const { rows } = await client.query(
      `
      SELECT pi.image_url
      FROM products p
      JOIN product_images pi ON pi.product_id = p.id
      WHERE p.slug = $1
      `,
      [slug],
    );
    for (const row of rows) {
      const path = storagePathFromUrl(row.image_url);
      if (path) paths.add(path);
    }
  }

  return [...paths].sort();
}

async function copyStorageFiles(paths, neonClient, liemClient) {
  let copied = 0;
  let failed = 0;

  for (const path of paths) {
    const { data: blob, error: downloadError } = await neonClient.storage
      .from(BUCKET)
      .download(path);

    if (downloadError || !blob) {
      console.error(`  ✗ descarga fallida: ${path} — ${downloadError?.message}`);
      failed += 1;
      continue;
    }

    if (dryRun) {
      console.log(`  [dry-run] copiaría: ${path}`);
      copied += 1;
      continue;
    }

    const { error: uploadError } = await liemClient.storage
      .from(BUCKET)
      .upload(path, blob, {
        upsert: true,
        contentType: guessContentType(path),
      });

    if (uploadError) {
      console.error(`  ✗ subida fallida: ${path} — ${uploadError.message}`);
      failed += 1;
      continue;
    }

    copied += 1;
    if (copied % 10 === 0) {
      console.log(`  … ${copied}/${paths.length} archivos copiados`);
    }
  }

  return { copied, failed };
}

async function runSqlUpdates(liemClient) {
  const statements = [
    {
      label: "product_images",
      sql: `UPDATE product_images SET image_url = REPLACE(image_url, '${NEON_REF}', '${LIEM_REF}') WHERE image_url LIKE '%${NEON_REF}%'`,
    },
    {
      label: "categories",
      sql: `UPDATE categories SET image_url = REPLACE(image_url, '${NEON_REF}', '${LIEM_REF}') WHERE image_url LIKE '%${NEON_REF}%'`,
    },
    {
      label: "promotion_images",
      sql: `UPDATE promotion_images SET image_url = REPLACE(image_url, '${NEON_REF}', '${LIEM_REF}') WHERE image_url LIKE '%${NEON_REF}%'`,
    },
  ];

  for (const { label, sql } of statements) {
    if (dryRun) {
      console.log(`  [dry-run] ${label}: ${sql}`);
      continue;
    }
    const result = await liemClient.query(sql);
    console.log(`  ✓ ${label}: ${result.rowCount ?? 0} filas actualizadas`);
  }
}

async function seedMissingProductImages(neonClient, liemClient) {
  let inserted = 0;

  for (const slug of MISSING_PRODUCT_SLUGS) {
    const liemProduct = await liemClient.query(
      `SELECT id, slug, name FROM products WHERE slug = $1`,
      [slug],
    );
    if (liemProduct.rows.length === 0) {
      console.warn(`  ⚠ producto no encontrado en Liem: ${slug}`);
      continue;
    }

    const liemProductId = liemProduct.rows[0].id;

    const existing = await liemClient.query(
      `SELECT id FROM product_images WHERE product_id = $1 LIMIT 1`,
      [liemProductId],
    );
    if (existing.rows.length > 0) {
      console.log(`  · ${slug}: ya tiene imágenes, omitido`);
      continue;
    }

    const neonImages = await neonClient.query(
      `
      SELECT pi.image_url, pi.alt_text, pi.display_order, pi.is_primary
      FROM products p
      JOIN product_images pi ON pi.product_id = p.id
      WHERE p.slug = $1
      ORDER BY pi.is_primary DESC, pi.display_order ASC NULLS LAST
      `,
      [slug],
    );

    if (neonImages.rows.length === 0) {
      console.warn(`  ⚠ sin imágenes en Neon para: ${slug}`);
      continue;
    }

    for (const image of neonImages.rows) {
      const imageUrl = image.image_url.replaceAll(NEON_REF, LIEM_REF);

      if (dryRun) {
        console.log(`  [dry-run] insertaría imagen ${slug}: ${imageUrl}`);
        inserted += 1;
        continue;
      }

      await liemClient.query(
        `
        INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          liemProductId,
          imageUrl,
          image.alt_text,
          image.display_order ?? 0,
          image.is_primary ?? false,
        ],
      );
      inserted += 1;
    }

    console.log(`  ✓ ${slug}: ${neonImages.rows.length} imagen(es) insertada(s)`);
  }

  return inserted;
}

async function printVerification(liemClient) {
  const stats = await liemClient.query(`
    SELECT
      count(*)::int AS total_images,
      count(*) FILTER (WHERE image_url LIKE '%${NEON_REF}%')::int AS neon_urls,
      count(*) FILTER (WHERE image_url LIKE '%${LIEM_REF}%')::int AS liem_urls
    FROM product_images
  `);
  console.log("\nVerificación product_images:", stats.rows[0]);

  const missing = await liemClient.query(`
    SELECT p.slug
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    WHERE pi.id IS NULL
    ORDER BY p.slug
  `);
  console.log(`Productos sin imágenes: ${missing.rows.length}`);
  for (const row of missing.rows) {
    console.log(`  - ${row.slug}`);
  }
}

const neonUrlResolved = requireEnv("NEON_SUPABASE_URL", neonUrl);
const neonKeyResolved = requireEnv("NEON_SERVICE_ROLE_KEY", neonKey);
const liemUrlResolved = requireEnv("LIEM_SUPABASE_URL", liemUrl);
const liemKeyResolved = requireEnv("LIEM_SERVICE_ROLE_KEY", liemKey);
const liemDbResolved = requireEnv("LIEM_DATABASE_URL", liemDatabaseUrl);
const neonDbResolved = requireEnv("NEON_DATABASE_URL o DATABASE_URL", neonDatabaseUrl);

const neonStorage = createClient(neonUrlResolved, neonKeyResolved, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const liemStorage = createClient(liemUrlResolved, liemKeyResolved, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const neonPg = new pg.Client({
  connectionString: neonDbResolved,
  ssl: { rejectUnauthorized: false },
});
const liemPg = new pg.Client({
  connectionString: liemDbResolved,
  ssl: { rejectUnauthorized: false },
});

try {
  await neonPg.connect();
  await liemPg.connect();

  console.log(dryRun ? "=== DRY RUN ===" : "=== Migración Neon → Liem ===");

  if (runAll || copyOnly) {
    console.log("\n1) Copiar archivos de storage…");
    const paths = await collectStoragePaths(neonPg);
    console.log(`   Rutas únicas a copiar: ${paths.length}`);
    const copyResult = await copyStorageFiles(paths, neonStorage, liemStorage);
    console.log(
      `   Resultado: ${copyResult.copied} copiados, ${copyResult.failed} fallidos`,
    );
  }

  if (runAll || sqlOnly) {
    console.log("\n2) Actualizar URLs en Liem_db…");
    await runSqlUpdates(liemPg);
  }

  if (runAll || seedOnly) {
    console.log("\n3) Insertar imágenes faltantes (6 productos)…");
    const inserted = await seedMissingProductImages(neonPg, liemPg);
    console.log(`   Total filas insertadas: ${inserted}`);
  }

  await printVerification(liemPg);
  console.log("\nListo.");
} catch (error) {
  console.error("Error en migración:", error);
  process.exit(1);
} finally {
  await neonPg.end().catch(() => undefined);
  await liemPg.end().catch(() => undefined);
}
