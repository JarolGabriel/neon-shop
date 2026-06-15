-- =============================================================================
-- Align custom_designs.preferred_size with official cm tiers (custom:30 x 30 cm…)
-- The original CHECK only allowed pequeno|mediano|grande|xl|xxl.
-- =============================================================================

BEGIN;

-- 1) Drop obsolete size CHECK before migrating rows
ALTER TABLE public.custom_designs
  DROP CONSTRAINT IF EXISTS custom_designs_preferred_size_check;

-- 2) Migrate legacy preferred_size values to new tier keys
UPDATE public.custom_designs
SET preferred_size = 'custom:40 x 40 cm'
WHERE preferred_size = 'pequeno';

UPDATE public.custom_designs
SET preferred_size = 'custom:50 x 50 cm'
WHERE preferred_size = 'mediano';

UPDATE public.custom_designs
SET preferred_size = 'custom:70 x 70 cm'
WHERE preferred_size = 'grande';

UPDATE public.custom_designs
SET preferred_size = 'custom:80 x 80 cm'
WHERE preferred_size = 'xl';

UPDATE public.custom_designs
SET preferred_size = 'custom:100 x 100 cm'
WHERE preferred_size = 'xxl';

-- 3) Align status enum with app (entregado / cancelado vs completado / rechazado)
UPDATE public.custom_designs
SET status = 'entregado'
WHERE status = 'completado';

UPDATE public.custom_designs
SET status = 'cancelado'
WHERE status = 'rechazado';

UPDATE public.custom_designs
SET status = 'en_produccion'
WHERE status = 'aprobado';

ALTER TABLE public.custom_designs
  DROP CONSTRAINT IF EXISTS custom_designs_status_check;

ALTER TABLE public.custom_designs
  ADD CONSTRAINT custom_designs_status_check
  CHECK (
    status IN (
      'pendiente',
      'cotizacion_enviada',
      'en_produccion',
      'entregado',
      'cancelado'
    )
  );

COMMIT;
