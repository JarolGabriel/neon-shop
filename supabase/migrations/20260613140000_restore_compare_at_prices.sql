-- =============================================================================
-- Restore compare_at_price for active products (reference retail markup +52%)
-- Run via `npx supabase db push` or Supabase SQL Editor.
--
-- PREVIEW (read-only):
--
-- SELECT slug, price, compare_at_price,
--        ROUND(price * 1.52, 2) AS proposed_compare_at
-- FROM products
-- WHERE is_active = true
-- ORDER BY slug;
--
-- Note: product_variants has no compare_at column — only products.price base.
-- UI also auto-calculates compare-at at runtime when DB value is null or <= sale.
-- =============================================================================

BEGIN;

UPDATE products
SET
  compare_at_price = ROUND(price * 1.52, 2),
  updated_at = NOW()
WHERE is_active = true
  AND (compare_at_price IS NULL OR compare_at_price <= price);

COMMIT;

-- POST-CHECK:
-- SELECT slug, price, compare_at_price,
--        ROUND((1 - price / compare_at_price) * 100) AS discount_pct
-- FROM products
-- WHERE is_active = true AND compare_at_price IS NOT NULL
-- ORDER BY slug
-- LIMIT 20;
