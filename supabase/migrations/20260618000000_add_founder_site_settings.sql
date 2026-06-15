INSERT INTO public.site_settings (key, value, description)
VALUES
  (
    'founder_name',
    'Frank Siras, {{store_name}} Co-fundador',
    'Nombre del fundador en Home y Quiénes somos (usa {{store_name}} para el nombre de la tienda)'
  ),
  (
    'founder_image_url',
    '/images/frank-NSY.jpeg',
    'Foto del fundador (ruta local o URL de Supabase Storage)'
  ),
  (
    'founder_image_alt',
    'Fundador sosteniendo un letrero de neón personalizado',
    'Texto alternativo de la foto del fundador'
  ),
  (
    'founder_section_heading',
    'Neón personalizado bien hecho',
    'Título de la sección del fundador en la página de inicio'
  )
ON CONFLICT (key) DO NOTHING;
