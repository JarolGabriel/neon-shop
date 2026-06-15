INSERT INTO public.site_settings (key, value, description)
VALUES
  ('site_name',        '',  'Nombre comercial de la tienda (aparece en el título del navegador y Google)'),
  ('site_tagline',     '',  'Slogan o subtítulo de la tienda'),
  ('site_description', '',  'Descripción SEO que aparece en Google y al compartir en redes sociales'),
  ('og_image_url',     '',  'URL absoluta de la imagen que aparece al compartir en WhatsApp, Twitter, etc.')
ON CONFLICT (key) DO NOTHING;
