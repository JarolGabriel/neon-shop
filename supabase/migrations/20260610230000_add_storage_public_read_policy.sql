-- Lectura pública de imágenes en el bucket product_images (categorías, productos, etc.)
DO $$
BEGIN
  CREATE POLICY "Public read product_images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'product_images');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
