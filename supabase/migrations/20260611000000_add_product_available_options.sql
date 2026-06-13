-- Opciones de talla/color en producto sin matriz de variantes
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS available_sizes text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS available_colors jsonb NOT NULL DEFAULT '[]';

COMMENT ON COLUMN products.available_sizes IS 'Tallas ofrecidas en la ficha (ej. small, custom:30 cm)';
COMMENT ON COLUMN products.available_colors IS 'Colores ofrecidos: [{ "label": string, "hex": string }]';
