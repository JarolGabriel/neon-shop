INSERT INTO public.site_settings (key, value, description)
VALUES
  (
    'whatsapp_floating_enabled',
    'true',
    'Mostrar botón flotante de WhatsApp en la tienda (true/false)'
  )
ON CONFLICT (key) DO NOTHING;
