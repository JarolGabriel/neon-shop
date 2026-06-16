/**
 * Copia product_variants (y opciones base) de Neon Shop → Liem Shop por slug.
 *
 * Liem comparte código pero la DB no tiene filas en product_variants, por eso
 * faltan swatches en tarjetas y botones de tamaño/color en la ficha.
 *
 * Requiere en .env:
 *   NEON_DATABASE_URL  (o DATABASE_URL apuntando a Neon)
 *   LIEM_DATABASE_URL  (connection string de Liem_db)
 *
 * Uso:
 *   node scripts/sync-liem-product-variants.mjs --dry-run
 *   node scripts/sync-liem-product-variants.mjs
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import pg from "pg";

config({ path: resolve(process.cwd(), ".env") });

const dryRun = process.argv.includes("--dry-run");

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

const neonPg = new pg.Client({
  connectionString: requireEnv("NEON_DATABASE_URL o DATABASE_URL", neonDatabaseUrl),
  ssl: { rejectUnauthorized: false },
});
const liemPg = new pg.Client({
  connectionString: requireEnv("LIEM_DATABASE_URL", liemDatabaseUrl),
  ssl: { rejectUnauthorized: false },
});

async function getProducts(client) {
  const { rows } = await client.query(`
    SELECT
      id,
      slug,
      price,
      compare_at_price,
      size,
      color,
      available_sizes,
      available_colors
    FROM products
    WHERE is_active = true
    ORDER BY slug
  `);
  return rows;
}

async function getVariants(client, productId) {
  const { rows } = await client.query(
    `
    SELECT name, sku, price, stock, size, color, color_hex, is_active
    FROM product_variants
    WHERE product_id = $1
    ORDER BY size NULLS LAST, color NULLS LAST
    `,
    [productId],
  );
  return rows;
}

try {
  await neonPg.connect();
  await liemPg.connect();

  console.log(dryRun ? "=== DRY RUN variantes Neon → Liem ===" : "=== Sync variantes Neon → Liem ===");

  const [neonProducts, liemProducts] = await Promise.all([
    getProducts(neonPg),
    getProducts(liemPg),
  ]);

  const liemBySlug = new Map(liemProducts.map((p) => [p.slug, p]));
  const neonBySlug = new Map(neonProducts.map((p) => [p.slug, p]));

  let variantsInserted = 0;
  let productsSynced = 0;
  let productsWithoutVariants = 0;
  let liemOnlySlugs = 0;

  for (const liemProduct of liemProducts) {
    const neonProduct = neonBySlug.get(liemProduct.slug);
    if (!neonProduct) {
      liemOnlySlugs += 1;
      continue;
    }

    const variants = await getVariants(neonPg, neonProduct.id);
    if (variants.length === 0) {
      productsWithoutVariants += 1;
      continue;
    }

    if (dryRun) {
      console.log(
        `  [dry-run] ${liemProduct.slug}: ${variants.length} variantes`,
      );
      variantsInserted += variants.length;
      productsSynced += 1;
      continue;
    }

    await liemPg.query("BEGIN");

    try {
      await liemPg.query(`DELETE FROM product_variants WHERE product_id = $1`, [
        liemProduct.id,
      ]);

      for (const variant of variants) {
        await liemPg.query(
          `
          INSERT INTO product_variants (
            product_id, name, sku, price, stock, size, color, color_hex, is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `,
          [
            liemProduct.id,
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
      }

      await liemPg.query(
        `
        UPDATE products
        SET
          price = $2,
          compare_at_price = $3,
          size = $4,
          color = $5,
          available_sizes = $6,
          available_colors = $7,
          updated_at = now()
        WHERE id = $1
        `,
        [
          liemProduct.id,
          neonProduct.price,
          neonProduct.compare_at_price,
          neonProduct.size,
          neonProduct.color,
          neonProduct.available_sizes ?? [],
          neonProduct.available_colors ?? [],
        ],
      );

      await liemPg.query("COMMIT");
      productsSynced += 1;
      variantsInserted += variants.length;
      console.log(`  ✓ ${liemProduct.slug}: ${variants.length} variantes`);
    } catch (error) {
      await liemPg.query("ROLLBACK");
      console.error(`  ✗ ${liemProduct.slug}:`, error);
      throw error;
    }
  }

  const verify = await liemPg.query(`
    SELECT
      count(*)::int AS total_variants,
      count(DISTINCT product_id)::int AS products_with_variants
    FROM product_variants
  `);

  const sampleMissing = await liemPg.query(`
    SELECT p.slug
    FROM products p
    LEFT JOIN product_variants pv ON pv.product_id = p.id
    WHERE p.is_active = true AND pv.id IS NULL
    ORDER BY p.slug
    LIMIT 10
  `);

  console.log("\nResumen:");
  console.log(`  Productos Liem activos: ${liemProducts.length}`);
  console.log(`  Productos sincronizados: ${productsSynced}`);
  console.log(`  Variantes insertadas: ${variantsInserted}`);
  console.log(`  Solo en Liem (sin par Neon): ${liemOnlySlugs}`);
  console.log(`  Neon sin variantes: ${productsWithoutVariants}`);
  console.log("  Liem tras sync:", verify.rows[0]);

  if (sampleMissing.rows.length > 0) {
    console.log("  Aún sin variantes (muestra):");
    for (const row of sampleMissing.rows) {
      console.log(`    - ${row.slug}`);
    }
  }

  const neonOnly = neonProducts.filter((p) => !liemBySlug.has(p.slug));
  if (neonOnly.length > 0) {
    console.log(`  En Neon pero no en Liem: ${neonOnly.length}`);
  }

  console.log("\nListo. Verifica: https://liem-shop.vercel.app/api/products/ghost-led-neon-sign");
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
} finally {
  await neonPg.end().catch(() => undefined);
  await liemPg.end().catch(() => undefined);
}
