-- =====================================================================
-- 10. TABLE: SITE_SETTINGS
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  description text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_pkey PRIMARY KEY (id)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read-only access" ON public.site_settings 
  FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON public.site_settings 
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================================
-- 11. TABLE: PROMOTIONS
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.promotions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  link_url text,
  link_text text,
  display_location text DEFAULT 'home_hero',
  display_order integer DEFAULT 0,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  is_active boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT promotions_pkey PRIMARY KEY (id)
);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer promos activas
CREATE POLICY "Public read-only access" ON public.promotions 
  FOR SELECT USING (is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));

-- Solo admin puede gestionar
CREATE POLICY "Admin full access" ON public.promotions 
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================================
-- 12. TABLE: PROMOTION_IMAGES
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.promotion_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  promotion_id uuid NOT NULL REFERENCES public.promotions(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT promotion_images_pkey PRIMARY KEY (id)
);

ALTER TABLE public.promotion_images ENABLE ROW LEVEL SECURITY;

-- Políticas para imágenes (heredan la visibilidad de la promoción)
CREATE POLICY "Public read-only access" ON public.promotion_images 
  FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON public.promotion_images 
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));