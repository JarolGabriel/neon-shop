-- Reemplaza URLs de storage Neon Shop → Liem Shop en Liem_db.
-- Ejecutar DESPUÉS de copiar archivos al bucket product_images de Liem.
-- Uso: node scripts/apply-sql-migration.mjs scripts/sql/liem-replace-storage-host.sql
-- (con DATABASE_URL apuntando a Liem_db)

UPDATE public.product_images
SET image_url = REPLACE(image_url, 'nekjvszntyaswghwtrig', 'cnezxcuwujhqpeknqqcb')
WHERE image_url LIKE '%nekjvszntyaswghwtrig%';

UPDATE public.categories
SET image_url = REPLACE(image_url, 'nekjvszntyaswghwtrig', 'cnezxcuwujhqpeknqqcb')
WHERE image_url LIKE '%nekjvszntyaswghwtrig%';

UPDATE public.promotion_images
SET image_url = REPLACE(image_url, 'nekjvszntyaswghwtrig', 'cnezxcuwujhqpeknqqcb')
WHERE image_url LIKE '%nekjvszntyaswghwtrig%';
