/**
 * Lista imágenes de productos por slug en la DB de Neon (.env DATABASE_URL).
 * Uso: node scripts/list-product-images-by-slug.mjs chameleon pickle ...
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import pg from "pg";

config({ path: resolve(process.cwd(), ".env") });

const slugTerms = process.argv.slice(2);
if (slugTerms.length === 0) {
  console.error(
    "Uso: node scripts/list-product-images-by-slug.mjs <termino-slug> [...]",
  );
  process.exit(1);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();

  for (const term of slugTerms) {
    const { rows } = await client.query(
      `
      SELECT p.slug, p.name, pi.image_url, pi.is_primary, pi.alt_text
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.slug ILIKE $1
      ORDER BY pi.is_primary DESC, pi.display_order ASC NULLS LAST
      `,
      [`%${term}%`],
    );

    console.log(`\n=== ${term} (${rows.length} filas) ===`);
    if (rows.length === 0) {
      console.log("  (sin coincidencias)");
      continue;
    }

    const slug = rows[0].slug;
    console.log(`  producto: ${slug} — ${rows[0].name}`);
    const images = rows.filter((r) => r.image_url);
    if (images.length === 0) {
      console.log("  (sin imágenes en Neon)");
      continue;
    }
    for (const row of images) {
      console.log(
        `  - ${row.is_primary ? "[primary] " : ""}${row.image_url}`,
      );
    }
  }
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  await client.end();
}
