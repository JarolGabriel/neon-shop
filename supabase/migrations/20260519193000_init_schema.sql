-- =====================================================================
-- 1. TIPOS PERSONALIZADOS (ENUMS)
-- =====================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('customer', 'admin'); 
    END IF;
END $$;

-- =====================================================================
-- 2. TABLA: CATEGORIES
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text, -- Almacenará la URL de Cloudflare R2 / Supabase Storage
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- =====================================================================
-- 3. TABLA: PRODUCTS 
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text, -- Para los cards en la cuadrícula (grid)
  price numeric(10, 2) NOT NULL,
  compare_at_price numeric(10, 2), -- Precio antes del descuento
  
  -- Especificaciones del letrero neón
  size text,             -- "Small (12-18 inches)", etc.
  color text,            -- "Warm White", "Blue", etc.
  voltage text,          -- "12V", "24V"
  material text,         -- "LED Neon Flex"
  
  -- Control de inventario
  stock integer DEFAULT 0,
  sku text UNIQUE,       -- Código de inventario único
  
  -- Métricas de analítica
  views_count integer DEFAULT 0,
  sales_count integer DEFAULT 0, -- Para filtrar por "Best Sellers"
  
  -- Estados de visibilidad
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,   -- Aparece en la Home
  is_best_seller boolean DEFAULT false, -- Destacado por ventas
  
  -- Relaciones (Llaves Foráneas)
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  
  -- Fechas de control
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT products_pkey PRIMARY KEY (id)
);

-- Índices de optimización requeridos por tu Notion
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

-- =====================================================================
-- 4. TABLA: PRODUCT_IMAGES
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL, -- URL de Cloudflare R2 / Supabase Storage
  alt_text text,
  display_order integer DEFAULT 0,
  is_primary boolean DEFAULT false, -- Imagen principal de la galería
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT product_images_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

-- =====================================================================
-- 5. TABLA: PROFILES (Reemplaza a tu tabla 'users' interna usando Supabase Auth)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text NOT NULL,
  phone text,
  role public.user_role NOT NULL DEFAULT 'customer'::public.user_role,
  avatar_url text,
  shipping_address jsonb, -- Estructura flexible para direcciones
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- =====================================================================
-- 6. TABLA: PRODUCT_VARIANTS
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name text, -- Ej: "Small - Blue"
  sku text UNIQUE,
  price numeric(10, 2) NOT NULL,
  stock integer DEFAULT 0,
  size text,
  color text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT product_variants_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);

-- =====================================================================
-- 7. TABLA: CART_ITEMS
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL si no está logueado
  session_id text, -- Para rastrear carritos de usuarios anónimos
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity integer DEFAULT 1,
  notes text, -- Notas de personalización enviadas por el cliente
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT cart_items_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_cart_user ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session ON public.cart_items(session_id);

-- =====================================================================
-- 8. TABLA: USER_FAVORITES
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_favorites_pkey PRIMARY KEY (id),
  CONSTRAINT user_favorites_user_id_product_id_key UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.user_favorites(user_id);


-- =====================================================================
-- EXTRA: CONFIGURACIÓN AUTOMÁTICA DEL STORAGE BUCKET
-- =====================================================================
-- Crea el contenedor para guardar los archivos físicos de las imágenes si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('product_images', 'product_images', true)
ON CONFLICT (id) DO NOTHING;