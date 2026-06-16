/**
 * Inspecciona product_images en la DB configurada en DATABASE_URL.
 * Uso: node scripts/inspect-product-images.mjs
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import pg from "pg";

config({ path: resolve(process.cwd(), ".env") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Falta DATABASE_URL en .env");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();

  const stats = await client.query(`
    SELECT
      count(*)::int AS total_images,
      count(*) FILTER (WHERE image_url LIKE '%nekjvszntyaswghwtrig%')::int AS neon_urls,
      count(*) FILTER (WHERE image_url LIKE '%cnezxcuwujhqpeknqqcb%')::int AS liem_urls
    FROM product_images
  `);
  console.log("product_images:", stats.rows[0]);

  const missing = await client.query(`
    SELECT p.id, p.slug, p.name
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    WHERE pi.id IS NULL
    ORDER BY p.slug
  `);
  console.log(`\nProductos sin imágenes (${missing.rows.length}):`);
  for (const row of missing.rows) {
    console.log(`- ${row.slug} (${row.name}) [${row.id}]`);
  }

  const sample = await client.query(`
    SELECT image_url
    FROM product_images
    WHERE image_url IS NOT NULL
    LIMIT 3
  `);
  console.log("\nMuestra URLs:");
  for (const row of sample.rows) {
    console.log(`- ${row.image_url}`);
  }
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  await client.end();
}
