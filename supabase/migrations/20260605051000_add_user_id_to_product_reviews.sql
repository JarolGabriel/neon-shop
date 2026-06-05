-- =====================================================================
-- Agregar relación opcional con el usuario autenticado (profiles).
-- Si la reseña fue escrita por un usuario con sesión iniciada, se guarda
-- su user_id y se considera "verificada". Si es anónima, queda en NULL.
-- =====================================================================
ALTER TABLE public.product_reviews
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_product_reviews_user ON public.product_reviews(user_id);
