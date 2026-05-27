-- ==========================================
-- 1. CREACIÓN DE LAS TABLAS DEL SHOWROOM
-- ==========================================

-- TABLA 13: customer_reviews (Los Posts del Showroom)
CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    is_approved BOOLEAN DEFAULT TRUE, -- Cambiar a FALSE si el dueño quiere moderar antes de publicar
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA 14: review_reactions (Reacciones 🔥, ❤️, ⚡)
CREATE TABLE IF NOT EXISTS public.review_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES public.customer_reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_review_reaction UNIQUE (review_id, user_id, reaction_type)
);

-- TABLA 15: review_comments (Caja de comentarios)
CREATE TABLE IF NOT EXISTS public.review_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES public.customer_reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. HABILITAR RLS EN TODAS LAS TABLAS
-- ==========================================
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_comments ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. POLÍTICAS RLS PARA CUSTOMER_REVIEWS
-- ==========================================
CREATE POLICY "Cualquiera puede ver reviews aprobadas" 
ON public.customer_reviews FOR SELECT USING (is_approved = true);

CREATE POLICY "Usuarios autenticados pueden crear sus reviews" 
ON public.customer_reviews FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden editar sus propias reviews" 
ON public.customer_reviews FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios o admins pueden borrar sus reviews" 
ON public.customer_reviews FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);


-- ==========================================
-- 4. POLÍTICAS RLS PARA REVIEW_REACTIONS
-- ==========================================
CREATE POLICY "Cualquiera puede ver las reacciones" 
ON public.review_reactions FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden reaccionar" 
ON public.review_reactions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden quitar su reaccion" 
ON public.review_reactions FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);


-- ==========================================
-- 5. POLÍTICAS RLS PARA REVIEW_COMMENTS
-- ==========================================
CREATE POLICY "Cualquiera puede ver los comentarios" 
ON public.review_comments FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden comentar" 
ON public.review_comments FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden editar su propio comentario" 
ON public.review_comments FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden borrar su propio comentario" 
ON public.review_comments FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);