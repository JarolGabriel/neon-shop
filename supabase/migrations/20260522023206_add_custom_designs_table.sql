-- =====================================================================
-- 9. TABLA: CUSTOM_DESIGNS (Diseños Personalizados para WhatsApp)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.custom_designs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),

    -- Info del cliente
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text, -- Clave vital para contactar por WhatsApp en Venezuela
    
    -- Diseño
    design_type text CHECK (design_type IN ('logo_upload', 'text_design', 'sketch')),
    uploaded_file_url text,  -- URL pública de la imagen en tu Storage de Supabase
    text_content text,       -- Si el diseño es puramente de texto
    reference_images text[], -- Array de URLs adicionales de inspiración (opcional)

    -- Especificaciones técnicas (Mapeadas 100% de tus capturas de pantalla)
    preferred_size text CHECK (preferred_size IN ('pequeno', 'mediano', 'grande', 'xl', 'xxl')),
    preferred_color text,
    preferred_font text,
    material text DEFAULT 'acrilico_transparente' CHECK (material IN ('acrilico_transparente', 'acrilico_negro', 'acrilico_blanco', 'otro')),
    usage_type text DEFAULT 'interior' CHECK (usage_type IN ('interior', 'exterior_ip67')),
    quantity integer DEFAULT 1 CHECK (quantity > 0),

    -- Información comercial del pedido (Mapeadas de tus capturas de pantalla)
    budget_range text CHECK (budget_range IN ('40-100', '150-400', '400-600', '600-800', '800-1000', '1000+')),
    purpose text CHECK (purpose IN ('negocio', 'evento', 'uso_personal')),
    delivery_address text,  
    delivery_time text DEFAULT 'standard' CHECK (delivery_time IN ('standard', 'express')),

    -- Precios y Control del Administrador 
    estimated_price numeric(10, 2),
    final_price numeric(10, 2),   
    mockup_url text,              -- Link del render de Photoshop que subirá el dueño
    status text DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'cotizacion_enviada', 'aprobado', 'rechazado', 'en_produccion', 'completado')),
    
    -- Bloques de texto libre
    customer_notes text,  -- Detalles del letrero de neón que escribe el cliente
    admin_notes text,     -- Anotaciones internas del taller para fabricar

    -- Tiempos de control automáticos
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    quoted_at timestamp with time zone,
    approved_at timestamp with time zone,
    
    CONSTRAINT custom_designs_pkey PRIMARY KEY (id)
);

-- Índices de optimización para búsquedas rápidas en el Admin Panel
CREATE INDEX IF NOT EXISTS idx_custom_designs_status ON public.custom_designs(status);
CREATE INDEX IF NOT EXISTS idx_custom_designs_email ON public.custom_designs(customer_email);
CREATE INDEX IF NOT EXISTS idx_custom_designs_created_at ON public.custom_designs(created_at DESC);

-- Trigger para automatizar el updated_at de manera nativa en PostgreSQL
CREATE OR REPLACE FUNCTION public.update_custom_designs_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_custom_designs_updated_at
    BEFORE UPDATE ON public.custom_designs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_custom_designs_updated_at_column();