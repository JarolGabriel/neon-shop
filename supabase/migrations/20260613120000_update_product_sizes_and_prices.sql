-- =============================================================================
-- Neon Shop — official size/price tier migration (USD reference prices)
-- Run in Supabase SQL Editor or via `supabase db push`.
--
-- PREVIEW (read-only) — uncomment to inspect before applying:
--
-- SELECT slug, name, size, price, compare_at_price, available_sizes
-- FROM products
-- WHERE is_active = true
-- ORDER BY name;
--
-- SELECT p.slug, pv.size, pv.price, pv.color, count(*) OVER (PARTITION BY p.slug, pv.size)
-- FROM product_variants pv
-- JOIN products p ON p.id = pv.product_id
-- WHERE pv.is_active = true
-- ORDER BY p.slug, pv.size
-- LIMIT 50;
--
-- Mapping (legacy → tier):
--   Small (15 inches) / pequeno        → custom:40 x 40 cm  ($50)
--   Medium (20 inches) / mediano     → custom:50 x 50 cm  ($60)
--   Large (30 inches) / grande       → custom:70 x 70 cm  ($90)
--   xl                               → custom:80 x 80 cm  ($120)
--   xxl                              → custom:100 x 100 cm ($180)
-- =============================================================================

BEGIN;

-- 1) Normalize product_variants sizes and tier prices
UPDATE product_variants
SET
  size = 'custom:40 x 40 cm',
  price = 50
WHERE is_active = true
  AND (
    size ILIKE 'Small%15%inch%'
    OR size ILIKE 'small%15%inch%'
    OR size = 'pequeno'
  );

UPDATE product_variants
SET
  size = 'custom:50 x 50 cm',
  price = 60
WHERE is_active = true
  AND (
    size ILIKE 'Medium%20%inch%'
    OR size ILIKE 'medium%20%inch%'
    OR size = 'mediano'
  );

UPDATE product_variants
SET
  size = 'custom:70 x 70 cm',
  price = 90
WHERE is_active = true
  AND (
    size ILIKE 'Large%30%inch%'
    OR size ILIKE 'large%30%inch%'
    OR size = 'grande'
  );

UPDATE product_variants
SET
  size = 'custom:80 x 80 cm',
  price = 120
WHERE is_active = true AND size = 'xl';

UPDATE product_variants
SET
  size = 'custom:100 x 100 cm',
  price = 180
WHERE is_active = true AND size = 'xxl';

-- 2) Products with variants — sync base row to smallest tier price
UPDATE products p
SET
  size = 'custom:40 x 40 cm',
  price = 50,
  compare_at_price = NULL,
  updated_at = NOW()
WHERE EXISTS (
  SELECT 1 FROM product_variants pv
  WHERE pv.product_id = p.id AND pv.is_active = true
);

-- 3) Simple catalog rows still on legacy Medium (20") — single reference tier
UPDATE products
SET
  size = 'custom:50 x 50 cm',
  price = 60,
  compare_at_price = NULL,
  updated_at = NOW()
WHERE is_active = true
  AND (
    size ILIKE 'Medium%20%inch%'
    OR size ILIKE 'medium%20%inch%'
    OR size = 'mediano'
  )
  AND NOT EXISTS (
    SELECT 1 FROM product_variants pv
    WHERE pv.product_id = products.id AND pv.is_active = true
  );

-- 4) Cyber Skull — multi-size product via available_sizes (all 12 tiers)
UPDATE products
SET
  size = 'custom:30 x 30 cm',
  price = 35,
  compare_at_price = NULL,
  available_sizes = ARRAY[
    'custom:30 x 30 cm',
    'custom:40 x 40 cm',
    'custom:40 x 50 cm',
    'custom:40 x 60 cm',
    'custom:40 x 70 cm',
    'custom:50 x 50 cm',
    'custom:50 x 80 cm',
    'custom:60 x 60 cm',
    'custom:70 x 70 cm',
    'custom:80 x 80 cm',
    'custom:90 x 90 cm',
    'custom:100 x 100 cm'
  ]::text[],
  updated_at = NOW()
WHERE slug = 'lampara-de-neon-led-cyber-skull';

-- 5) Clear fictitious compare_at on any remaining active products
UPDATE products
SET compare_at_price = NULL, updated_at = NOW()
WHERE is_active = true AND compare_at_price IS NOT NULL;

COMMIT;

-- POST-CHECK:
-- SELECT slug, size, price, compare_at_price, available_sizes
-- FROM products WHERE is_active = true ORDER BY slug;
