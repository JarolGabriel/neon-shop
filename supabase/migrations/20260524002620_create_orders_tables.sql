-- =====================================================================
-- 1. CREACIÓN DEL ENUM PARA LOS ESTADOS DE LA ÓRDEN
-- =====================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE public.order_status AS ENUM (
          'pendiente_pago',   -- El cliente generó la orden pero no ha pagado
          'pago_confirmado',  -- El administrador validó el dinero por WhatsApp
          'en_taller',        -- El letrero se está fabricando
          'enviado',          -- Salió por MRW / Zoom / Delivery
          'entregado',        -- Cliente recibió su neón
          'cancelado'
        ); 
    END IF;
END $$;

-- =====================================================================
-- 2. TABLA: ORDERS (Encabezado del Pedido)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, 
  session_id text, 
  
  -- Datos de contacto y despacho para Venezuela
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  delivery_city text NOT NULL,
  
  -- Totalización (Fijada en Dólares)
  total_usd numeric(10, 2) NOT NULL,
  
  -- Estados y Gestión
  status public.order_status NOT NULL DEFAULT 'pendiente_pago'::public.order_status,
  admin_notes text, -- Comentarios del dueño del taller
  
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- =====================================================================
-- 3. TABLA: ORDER_ITEMS (Productos Congelados en la Órden)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  
  -- Datos históricos congelados
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price_usd numeric(10, 2) NOT NULL,
  notes text, -- Notas de personalización del cliente
  
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);