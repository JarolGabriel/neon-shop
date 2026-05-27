-- Agregar la columna de moderación a los comentarios
ALTER TABLE public.review_comments 
ADD COLUMN is_approved BOOLEAN DEFAULT FALSE;

-- Cambiar el valor por defecto de las reviews a false
ALTER TABLE public.customer_reviews 
ALTER COLUMN is_approved SET DEFAULT FALSE;

-- Actualizar la política RLS de comentarios
DROP POLICY IF EXISTS "Cualquiera puede ver los comentarios" ON public.review_comments;

CREATE POLICY "Cualquiera puede ver los comentarios aprobados" 
ON public.review_comments FOR SELECT 
USING (is_approved = true);