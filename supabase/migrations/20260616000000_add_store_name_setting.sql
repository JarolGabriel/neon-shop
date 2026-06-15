INSERT INTO public.site_settings (key, value, description)
VALUES (
  'store_name',
  'Neon Shop',
  'Nombre público de la tienda (navbar, emails, SEO)'
)
ON CONFLICT (key) DO NOTHING;
