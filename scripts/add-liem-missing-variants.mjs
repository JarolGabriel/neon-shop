/**
 * Inserta variantes para los 3 productos Liem sin product_variants.
 * Uso: node scripts/add-liem-missing-variants.mjs --apply
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

const SIGN_SLUGS = [
  "its-a-vibe-led-neon-sign",
  "lets-stay-home-led-neon-sign",
];

const CYBER_SKULL_SLUG = "lampara-de-neon-led-cyber-skull";

const STANDARD_SIGN_SIZES = [
  "custom:40 x 40 cm",
  "custom:50 x 50 cm",
  "custom:70 x 70 cm",
];

const STANDARD_SIGN_COLORS = [
  { color: "Electric Pink", color_hex: "#FF10F0" },
  { color: "Ice Blue", color_hex: "#00F5FF" },
  { color: "Royal Blue", color_hex: "#4169FF" },
  { color: "Neon Red", color_hex: "#FF2020" },
  { color: "Lime Green", color_hex: "#39FF14" },
  { color: "Warm White", color_hex: "#FFF5E1" },
  { color: "Deep Purple", color_hex: "#9D00FF" },
];

const SIZE_PRICES = {
  "custom:40 x 40 cm": 50,
  "custom:50 x 50 cm": 60,
  "custom:70 x 70 cm": 90,
  "custom:30 x 30 cm": 35,
  "custom:40 x 50 cm": 60,
  "custom:40 x 60 cm": 65,
  "custom:40 x 70 cm": 70,
  "custom:50 x 80 cm": 90,
  "custom:60 x 60 cm": 70,
  "custom:80 x 80 cm": 120,
  "custom:90 x 90 cm": 140,
  "custom:100 x 100 cm": 180,
};

function sqlLiteral(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function skuToken(value, max = 6) {
  const token = value.replace(/[^a-z0-9]/gi, "").toUpperCase();
  return token.slice(0, max) || "ITEM";
}

function generateVariantSku(productSlug, size, color) {
  const base = skuToken(productSlug, 6);
  const sizeToken = size.startsWith("custom:")
    ? skuToken(size.slice(7), 4)
    : skuToken(size, 3);
  const colorToken = skuToken(color, 4);
  return `NS-${base}-${sizeToken}-${colorToken}`;
}

function suggestVariantName(size, color) {
  const sizeLabel = size.replace(/^custom:/, "");
  return `${color} · ${sizeLabel}`;
}

async function fetchLiemProductIds(slugs) {
  const map = new Map();
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const res = await fetch(`${liemSite}/api/products?limit=30&page=${page}`);
    if (!res.ok) throw new Error(`Liem API ${res.status}`);
    const body = await res.json();
    totalPages = body.meta?.total_pages ?? 1;

    for (const product of body.data ?? []) {
      if (slugs.includes(product.slug)) {
        map.set(product.slug, product.id);
      }
    }
    page += 1;
  }

  return map;
}

async function fetchNeonCyberSkullOptions() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const { rows } = await client.query(
    `
    SELECT available_sizes, available_colors
    FROM products
    WHERE slug = $1
    `,
    [CYBER_SKULL_SLUG],
  );

  await client.end();

  const row = rows[0];
  if (!row) throw new Error("Cyber skull no encontrado en Neon");

  const colors = Array.isArray(row.available_colors)
    ? row.available_colors.map((item) => ({
        color: item.label,
        color_hex: item.hex,
      }))
    : [];

  return {
    sizes: row.available_sizes ?? [],
    colors,
    stock: 1000,
  };
}

function buildSignVariants(slug, productId) {
  const variants = [];
  for (const size of STANDARD_SIGN_SIZES) {
    for (const { color, color_hex } of STANDARD_SIGN_COLORS) {
      variants.push({
        productId,
        slug,
        name: suggestVariantName(size, color),
        sku: generateVariantSku(slug, size, color),
        price: SIZE_PRICES[size] ?? 60,
        stock: 20,
        size,
        color,
        color_hex,
        is_active: true,
      });
    }
  }
  return variants;
}

function buildCyberSkullVariants(slug, productId, sizes, colors, stock) {
  const variants = [];
  for (const size of sizes) {
    for (const { color, color_hex } of colors) {
      variants.push({
        productId,
        slug,
        name: suggestVariantName(size, color),
        sku: generateVariantSku(slug, size, color),
        price: SIZE_PRICES[size] ?? 35,
        stock,
        size,
        color,
        color_hex,
        is_active: true,
      });
    }
  }
  return variants;
}

const allSlugs = [...SIGN_SLUGS, CYBER_SKULL_SLUG];
const liemIds = await fetchLiemProductIds(allSlugs);

for (const slug of allSlugs) {
  if (!liemIds.has(slug)) {
    console.error(`Falta producto en Liem: ${slug}`);
    process.exit(1);
  }
}

const cyber = await fetchNeonCyberSkullOptions();

const allVariants = [
  ...SIGN_SLUGS.flatMap((slug) =>
    buildSignVariants(slug, liemIds.get(slug)),
  ),
  ...buildCyberSkullVariants(
    CYBER_SKULL_SLUG,
    liemIds.get(CYBER_SKULL_SLUG),
    cyber.sizes,
    cyber.colors,
    cyber.stock,
  ),
];

const lines = [
  "-- Variantes para 3 productos sin product_variants en Liem",
  "BEGIN;",
];

for (const row of allVariants) {
  lines.push(`
INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  ${sqlLiteral(row.productId)}::uuid,
  ${sqlLiteral(row.name)},
  ${sqlLiteral(row.sku)},
  ${row.price},
  ${row.stock},
  ${sqlLiteral(row.size)},
  ${sqlLiteral(row.color)},
  ${sqlLiteral(row.color_hex)},
  true
);
`);
}

lines.push("COMMIT;");

const outPath = resolve(
  process.cwd(),
  "scripts/sql/liem-variants-missing-three.sql",
);
writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");

console.log(`Variantes a insertar: ${allVariants.length}`);
console.log(`  ${SIGN_SLUGS[0]}: 21`);
console.log(`  ${SIGN_SLUGS[1]}: 21`);
console.log(`  ${CYBER_SKULL_SLUG}: ${cyber.sizes.length}×${cyber.colors.length} = ${cyber.sizes.length * cyber.colors.length}`);
console.log(`SQL: ${outPath}`);

if (apply) {
  const { execSync } = await import("node:child_process");
  execSync(`npx supabase db query --linked --yes -f "${outPath}"`, {
    stdio: "inherit",
    cwd: process.cwd(),
  });
  console.log("Aplicado en Liem_db");
}
