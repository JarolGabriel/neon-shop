-- Agrega claves de redes sociales faltantes en site_settings
INSERT INTO public.site_settings (key, value, description)
VALUES
  ('tiktok_url', '', 'URL del perfil de TikTok'),
  ('youtube_url', '', 'URL del canal de YouTube')
ON CONFLICT (key) DO NOTHING;
