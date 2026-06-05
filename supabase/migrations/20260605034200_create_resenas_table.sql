-- =====================================================================
-- TABLA: RESEÑAS (reseñas de un producto en la página de detalle)
-- =====================================================================
-- 1. Crear la tabla de reseñas
CREATE TABLE IF NOT EXISTS public.reseñas (
  -- Identificador único para cada reseña
  id uuid NOT NULL DEFAULT gen_random_uuid(),

  -- Relación con el producto del detalle donde se deja la reseña
  producto_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,

  -- Clasificación por estrellas (del 1 al 5)
  clasificacion integer NOT NULL CHECK (clasificacion >= 1 AND clasificacion <= 5),

  -- Título de la reseña (limitado a 100 caracteres según el formulario)
  titulo varchar(100) NOT NULL,

  -- Contenido de la reseña (texto libre largo)
  contenido text NOT NULL,

  -- URL de la imagen o video (opcional).
  -- Nota: Aquí guardarás el enlace público que te genere el Storage de Supabase al subir el archivo.
  multimedia_url text NULL,

  -- Nombre de visualización del usuario
  nombre_usuario varchar(150) NOT NULL,

  -- Dirección de correo electrónico
  correo_electronico varchar(255) NOT NULL,

  -- Fecha y hora automática en la que se envía la reseña
  creado_en timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),

  CONSTRAINT reseñas_pkey PRIMARY KEY (id)
);

-- Índice para acelerar la búsqueda de reseñas por producto
CREATE INDEX IF NOT EXISTS idx_reseñas_producto ON public.reseñas(producto_id);

-- =====================================================================
-- 2. Habilitar el control de acceso (Row Level Security - RLS)
-- =====================================================================
ALTER TABLE public.reseñas ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- 3. Política pública: cualquiera puede insertar una reseña
-- =====================================================================
CREATE POLICY "Cualquiera puede enviar una reseña"
ON public.reseñas
FOR INSERT
WITH CHECK (true);

-- =====================================================================
-- 4. Política pública: cualquiera puede leer las reseñas
-- =====================================================================
CREATE POLICY "Cualquiera puede ver las reseñas"
ON public.reseñas
FOR SELECT
USING (true);
