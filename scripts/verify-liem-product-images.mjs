/**
 * Verifica imágenes de productos en una instancia (API pública + opcional DB).
 * Uso:
 *   node scripts/verify-liem-product-images.mjs
 *   LIEM_SITE_URL=https://liem-shop.vercel.app node scripts/verify-liem-product-images.mjs
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import pg from "pg";

config({ path: resolve(process.cwd(), ".env") });

const SITE_URL = (process.env.LIEM_SITE_URL ?? "https://liem-shop.vercel.app").replace(
  /\/$/,
  "",
);
const DATABASE_URL = process.env.LIEM_DATABASE_URL;

const CHECK_SLUGS = [
  "weed-open-led-neon-sign",
  "pow-and-bam-led-neon-signs",
  "chameleon-led-neon-sign",
  "plant-led-neon-sign",
  "peach-led-neon-sign",
  "this-must-be-the-place-led-neon-sign",
  "xoxo-led-neon-sign",
  "pickle-led-neon-sign",
  "popsicle-led-neon-sign",
  "lightbulb-led-neon-sign",
  "unicorn-led-neon-sign",
  "rain-cloud-led-neon-sign",
  "palm-tree-led-neon-sign",
  "til-death-led-neon-sign",
  "take-it-easy-led-neon-sign",
  "sweet-dreams-led-neon-sign",
  "avocado-led-neon-sign",
  "pizza-led-neon-sign",
  "wave-led-neon-sign",
  "toadstool-mushroom-led-neon-sign",
  "maneki-neko-led-neon-sign",
  "rocket-ship-led-neon-sign",
];

async function checkApi() {
  const res = await fetch(
    `${SITE_URL}/api/products?slugs=${encodeURIComponent(CHECK_SLUGS.join(","))}&limit=50`,
  );
  if (!res.ok) {
    throw new Error(`API products ${res.status}`);
  }

  const body = await res.json();
  const products = body.data ?? [];

  console.log(`\nAPI ${SITE_URL}/api/products — ${products.length} productos`);
  let missing = 0;

  for (const slug of CHECK_SLUGS) {
    const product = products.find((item) => item.slug === slug);
    if (!product) {
      console.log(`  ✗ ${slug}: no encontrado en API`);
      missing += 1;
      continue;
    }

    const primary =
      product.product_images?.find((img) => img.is_primary) ??
      product.product_images?.[0];
    const url = primary?.image_url ?? null;

    if (!url) {
      console.log(`  ✗ ${slug}: sin imagen`);
      missing += 1;
      continue;
    }

    const isNeon = url.includes("nekjvszntyaswghwtrig");
    const isLiem = url.includes("cnezxcuwujhqpeknqqcb");
    const marker = isNeon ? "NEON" : isLiem ? "LIEM" : "OTRO";
    console.log(`  ✓ ${slug}: [${marker}] ${url.slice(0, 90)}…`);
  }

  return missing;
}

async function checkDb() {
  if (!DATABASE_URL) {
    console.log("\n(Omitiendo DB: falta LIEM_DATABASE_URL)");
    return 0;
  }

  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const stats = await client.query(`
      SELECT
        count(*)::int AS total,
        count(*) FILTER (WHERE image_url LIKE '%nekjvszntyaswghwtrig%')::int AS neon,
        count(*) FILTER (WHERE image_url LIKE '%cnezxcuwujhqpeknqqcb%')::int AS liem
      FROM product_images
    `);
    console.log("\nDB product_images:", stats.rows[0]);

    const missing = await client.query(`
      SELECT p.slug
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE pi.id IS NULL AND p.slug = ANY($1::text[])
      ORDER BY p.slug
    `, [CHECK_SLUGS]);

    if (missing.rows.length > 0) {
      console.log("Sin imágenes en DB (muestra verificación):");
      for (const row of missing.rows) {
        console.log(`  ✗ ${row.slug}`);
      }
    }

    return missing.rows.length;
  } finally {
    await client.end();
  }
}

try {
  const apiMissing = await checkApi();
  const dbMissing = await checkDb();
  if (apiMissing > 0 || dbMissing > 0) {
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}
