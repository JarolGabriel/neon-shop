-- 1. Agregar la columna de moderación a los comentarios de forma segura
ALTER TABLE public.review_comments 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- 2. Cambiar el valor por defecto de las reviews a false
ALTER TABLE public.customer_reviews 
ALTER COLUMN is_approved SET DEFAULT FALSE;

-- 3. Eliminar la política anterior si existe (evita conflictos)
DROP POLICY IF EXISTS "Cualquiera puede ver los comentarios" ON public.review_comments;
DROP POLICY IF EXISTS "Cualquiera puede ver los comentarios aprobados" ON public.review_comments;

-- 4. Crear la nueva política RLS de comentarios
CREATE POLICY "Cualquiera puede ver los comentarios aprobados" 
ON public.review_comments FOR SELECT 
USING (is_approved = true);