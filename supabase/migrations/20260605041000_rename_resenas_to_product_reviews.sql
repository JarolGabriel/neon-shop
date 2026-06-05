-- =====================================================================
-- Renombrar la tabla "reseñas" y sus columnas a inglés -> product_reviews
-- =====================================================================

-- 1. Renombrar la tabla
ALTER TABLE public."reseñas" RENAME TO product_reviews;

-- 2. Renombrar las columnas a inglés
ALTER TABLE public.product_reviews RENAME COLUMN producto_id TO product_id;
ALTER TABLE public.product_reviews RENAME COLUMN clasificacion TO rating;
ALTER TABLE public.product_reviews RENAME COLUMN titulo TO title;
ALTER TABLE public.product_reviews RENAME COLUMN contenido TO content;
ALTER TABLE public.product_reviews RENAME COLUMN multimedia_url TO media_url;
ALTER TABLE public.product_reviews RENAME COLUMN nombre_usuario TO user_name;
ALTER TABLE public.product_reviews RENAME COLUMN correo_electronico TO email;
ALTER TABLE public.product_reviews RENAME COLUMN creado_en TO created_at;

-- 3. Renombrar índice y llave primaria
ALTER INDEX IF EXISTS public."idx_reseñas_producto" RENAME TO idx_product_reviews_product;
ALTER TABLE public.product_reviews RENAME CONSTRAINT "reseñas_pkey" TO product_reviews_pkey;

-- 4. Renombrar las políticas RLS a inglés
ALTER POLICY "Cualquiera puede enviar una reseña" ON public.product_reviews RENAME TO "Anyone can submit a review";
ALTER POLICY "Cualquiera puede ver las reseñas" ON public.product_reviews RENAME TO "Anyone can view reviews";
