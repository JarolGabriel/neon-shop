-- Variantes para 3 productos sin product_variants en Liem
BEGIN;

INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Electric Pink · 40 x 40 cm',
  'NS-ITSAVI-40X4-ELEC',
  50,
  20,
  'custom:40 x 40 cm',
  'Electric Pink',
  '#FF10F0',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Ice Blue · 40 x 40 cm',
  'NS-ITSAVI-40X4-ICEB',
  50,
  20,
  'custom:40 x 40 cm',
  'Ice Blue',
  '#00F5FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Royal Blue · 40 x 40 cm',
  'NS-ITSAVI-40X4-ROYA',
  50,
  20,
  'custom:40 x 40 cm',
  'Royal Blue',
  '#4169FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Neon Red · 40 x 40 cm',
  'NS-ITSAVI-40X4-NEON',
  50,
  20,
  'custom:40 x 40 cm',
  'Neon Red',
  '#FF2020',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Lime Green · 40 x 40 cm',
  'NS-ITSAVI-40X4-LIME',
  50,
  20,
  'custom:40 x 40 cm',
  'Lime Green',
  '#39FF14',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Warm White · 40 x 40 cm',
  'NS-ITSAVI-40X4-WARM',
  50,
  20,
  'custom:40 x 40 cm',
  'Warm White',
  '#FFF5E1',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Deep Purple · 40 x 40 cm',
  'NS-ITSAVI-40X4-DEEP',
  50,
  20,
  'custom:40 x 40 cm',
  'Deep Purple',
  '#9D00FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Electric Pink · 50 x 50 cm',
  'NS-ITSAVI-50X5-ELEC',
  60,
  20,
  'custom:50 x 50 cm',
  'Electric Pink',
  '#FF10F0',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Ice Blue · 50 x 50 cm',
  'NS-ITSAVI-50X5-ICEB',
  60,
  20,
  'custom:50 x 50 cm',
  'Ice Blue',
  '#00F5FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Royal Blue · 50 x 50 cm',
  'NS-ITSAVI-50X5-ROYA',
  60,
  20,
  'custom:50 x 50 cm',
  'Royal Blue',
  '#4169FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Neon Red · 50 x 50 cm',
  'NS-ITSAVI-50X5-NEON',
  60,
  20,
  'custom:50 x 50 cm',
  'Neon Red',
  '#FF2020',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Lime Green · 50 x 50 cm',
  'NS-ITSAVI-50X5-LIME',
  60,
  20,
  'custom:50 x 50 cm',
  'Lime Green',
  '#39FF14',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Warm White · 50 x 50 cm',
  'NS-ITSAVI-50X5-WARM',
  60,
  20,
  'custom:50 x 50 cm',
  'Warm White',
  '#FFF5E1',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Deep Purple · 50 x 50 cm',
  'NS-ITSAVI-50X5-DEEP',
  60,
  20,
  'custom:50 x 50 cm',
  'Deep Purple',
  '#9D00FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Electric Pink · 70 x 70 cm',
  'NS-ITSAVI-70X7-ELEC',
  90,
  20,
  'custom:70 x 70 cm',
  'Electric Pink',
  '#FF10F0',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Ice Blue · 70 x 70 cm',
  'NS-ITSAVI-70X7-ICEB',
  90,
  20,
  'custom:70 x 70 cm',
  'Ice Blue',
  '#00F5FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Royal Blue · 70 x 70 cm',
  'NS-ITSAVI-70X7-ROYA',
  90,
  20,
  'custom:70 x 70 cm',
  'Royal Blue',
  '#4169FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Neon Red · 70 x 70 cm',
  'NS-ITSAVI-70X7-NEON',
  90,
  20,
  'custom:70 x 70 cm',
  'Neon Red',
  '#FF2020',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Lime Green · 70 x 70 cm',
  'NS-ITSAVI-70X7-LIME',
  90,
  20,
  'custom:70 x 70 cm',
  'Lime Green',
  '#39FF14',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Warm White · 70 x 70 cm',
  'NS-ITSAVI-70X7-WARM',
  90,
  20,
  'custom:70 x 70 cm',
  'Warm White',
  '#FFF5E1',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'f9c0d9e0-92cd-46b3-9228-91464153d10a'::uuid,
  'Deep Purple · 70 x 70 cm',
  'NS-ITSAVI-70X7-DEEP',
  90,
  20,
  'custom:70 x 70 cm',
  'Deep Purple',
  '#9D00FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Electric Pink · 40 x 40 cm',
  'NS-LETSST-40X4-ELEC',
  50,
  20,
  'custom:40 x 40 cm',
  'Electric Pink',
  '#FF10F0',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Ice Blue · 40 x 40 cm',
  'NS-LETSST-40X4-ICEB',
  50,
  20,
  'custom:40 x 40 cm',
  'Ice Blue',
  '#00F5FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Royal Blue · 40 x 40 cm',
  'NS-LETSST-40X4-ROYA',
  50,
  20,
  'custom:40 x 40 cm',
  'Royal Blue',
  '#4169FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Neon Red · 40 x 40 cm',
  'NS-LETSST-40X4-NEON',
  50,
  20,
  'custom:40 x 40 cm',
  'Neon Red',
  '#FF2020',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Lime Green · 40 x 40 cm',
  'NS-LETSST-40X4-LIME',
  50,
  20,
  'custom:40 x 40 cm',
  'Lime Green',
  '#39FF14',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Warm White · 40 x 40 cm',
  'NS-LETSST-40X4-WARM',
  50,
  20,
  'custom:40 x 40 cm',
  'Warm White',
  '#FFF5E1',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Deep Purple · 40 x 40 cm',
  'NS-LETSST-40X4-DEEP',
  50,
  20,
  'custom:40 x 40 cm',
  'Deep Purple',
  '#9D00FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Electric Pink · 50 x 50 cm',
  'NS-LETSST-50X5-ELEC',
  60,
  20,
  'custom:50 x 50 cm',
  'Electric Pink',
  '#FF10F0',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Ice Blue · 50 x 50 cm',
  'NS-LETSST-50X5-ICEB',
  60,
  20,
  'custom:50 x 50 cm',
  'Ice Blue',
  '#00F5FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Royal Blue · 50 x 50 cm',
  'NS-LETSST-50X5-ROYA',
  60,
  20,
  'custom:50 x 50 cm',
  'Royal Blue',
  '#4169FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Neon Red · 50 x 50 cm',
  'NS-LETSST-50X5-NEON',
  60,
  20,
  'custom:50 x 50 cm',
  'Neon Red',
  '#FF2020',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Lime Green · 50 x 50 cm',
  'NS-LETSST-50X5-LIME',
  60,
  20,
  'custom:50 x 50 cm',
  'Lime Green',
  '#39FF14',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Warm White · 50 x 50 cm',
  'NS-LETSST-50X5-WARM',
  60,
  20,
  'custom:50 x 50 cm',
  'Warm White',
  '#FFF5E1',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Deep Purple · 50 x 50 cm',
  'NS-LETSST-50X5-DEEP',
  60,
  20,
  'custom:50 x 50 cm',
  'Deep Purple',
  '#9D00FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Electric Pink · 70 x 70 cm',
  'NS-LETSST-70X7-ELEC',
  90,
  20,
  'custom:70 x 70 cm',
  'Electric Pink',
  '#FF10F0',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Ice Blue · 70 x 70 cm',
  'NS-LETSST-70X7-ICEB',
  90,
  20,
  'custom:70 x 70 cm',
  'Ice Blue',
  '#00F5FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Royal Blue · 70 x 70 cm',
  'NS-LETSST-70X7-ROYA',
  90,
  20,
  'custom:70 x 70 cm',
  'Royal Blue',
  '#4169FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Neon Red · 70 x 70 cm',
  'NS-LETSST-70X7-NEON',
  90,
  20,
  'custom:70 x 70 cm',
  'Neon Red',
  '#FF2020',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Lime Green · 70 x 70 cm',
  'NS-LETSST-70X7-LIME',
  90,
  20,
  'custom:70 x 70 cm',
  'Lime Green',
  '#39FF14',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Warm White · 70 x 70 cm',
  'NS-LETSST-70X7-WARM',
  90,
  20,
  'custom:70 x 70 cm',
  'Warm White',
  '#FFF5E1',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'd9503f2f-0766-4abc-87d2-dbe37e4c24cc'::uuid,
  'Deep Purple · 70 x 70 cm',
  'NS-LETSST-70X7-DEEP',
  90,
  20,
  'custom:70 x 70 cm',
  'Deep Purple',
  '#9D00FF',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Blanco · 30 x 30 cm',
  'NS-LAMPAR-30X3-BLAN',
  35,
  1000,
  'custom:30 x 30 cm',
  'Blanco',
  '#ffffff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Azul Neón · 30 x 30 cm',
  'NS-LAMPAR-30X3-AZUL',
  35,
  1000,
  'custom:30 x 30 cm',
  'Azul Neón',
  '#00d4ff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Rosa · 30 x 30 cm',
  'NS-LAMPAR-30X3-ROSA',
  35,
  1000,
  'custom:30 x 30 cm',
  'Rosa',
  '#ff007a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Púrpura · 30 x 30 cm',
  'NS-LAMPAR-30X3-PRPU',
  35,
  1000,
  'custom:30 x 30 cm',
  'Púrpura',
  '#bd34fe',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Verde · 30 x 30 cm',
  'NS-LAMPAR-30X3-VERD',
  35,
  1000,
  'custom:30 x 30 cm',
  'Verde',
  '#00ff87',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Amarillo · 30 x 30 cm',
  'NS-LAMPAR-30X3-AMAR',
  35,
  1000,
  'custom:30 x 30 cm',
  'Amarillo',
  '#fcee0a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Naranja · 30 x 30 cm',
  'NS-LAMPAR-30X3-NARA',
  35,
  1000,
  'custom:30 x 30 cm',
  'Naranja',
  '#ff6b00',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Blanco · 40 x 40 cm',
  'NS-LAMPAR-40X4-BLAN',
  50,
  1000,
  'custom:40 x 40 cm',
  'Blanco',
  '#ffffff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Azul Neón · 40 x 40 cm',
  'NS-LAMPAR-40X4-AZUL',
  50,
  1000,
  'custom:40 x 40 cm',
  'Azul Neón',
  '#00d4ff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Rosa · 40 x 40 cm',
  'NS-LAMPAR-40X4-ROSA',
  50,
  1000,
  'custom:40 x 40 cm',
  'Rosa',
  '#ff007a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Púrpura · 40 x 40 cm',
  'NS-LAMPAR-40X4-PRPU',
  50,
  1000,
  'custom:40 x 40 cm',
  'Púrpura',
  '#bd34fe',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Verde · 40 x 40 cm',
  'NS-LAMPAR-40X4-VERD',
  50,
  1000,
  'custom:40 x 40 cm',
  'Verde',
  '#00ff87',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Amarillo · 40 x 40 cm',
  'NS-LAMPAR-40X4-AMAR',
  50,
  1000,
  'custom:40 x 40 cm',
  'Amarillo',
  '#fcee0a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Naranja · 40 x 40 cm',
  'NS-LAMPAR-40X4-NARA',
  50,
  1000,
  'custom:40 x 40 cm',
  'Naranja',
  '#ff6b00',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Blanco · 40 x 50 cm',
  'NS-LAMPAR-40X5-BLAN',
  60,
  1000,
  'custom:40 x 50 cm',
  'Blanco',
  '#ffffff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Azul Neón · 40 x 50 cm',
  'NS-LAMPAR-40X5-AZUL',
  60,
  1000,
  'custom:40 x 50 cm',
  'Azul Neón',
  '#00d4ff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Rosa · 40 x 50 cm',
  'NS-LAMPAR-40X5-ROSA',
  60,
  1000,
  'custom:40 x 50 cm',
  'Rosa',
  '#ff007a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Púrpura · 40 x 50 cm',
  'NS-LAMPAR-40X5-PRPU',
  60,
  1000,
  'custom:40 x 50 cm',
  'Púrpura',
  '#bd34fe',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Verde · 40 x 50 cm',
  'NS-LAMPAR-40X5-VERD',
  60,
  1000,
  'custom:40 x 50 cm',
  'Verde',
  '#00ff87',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Amarillo · 40 x 50 cm',
  'NS-LAMPAR-40X5-AMAR',
  60,
  1000,
  'custom:40 x 50 cm',
  'Amarillo',
  '#fcee0a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Naranja · 40 x 50 cm',
  'NS-LAMPAR-40X5-NARA',
  60,
  1000,
  'custom:40 x 50 cm',
  'Naranja',
  '#ff6b00',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Blanco · 40 x 60 cm',
  'NS-LAMPAR-40X6-BLAN',
  65,
  1000,
  'custom:40 x 60 cm',
  'Blanco',
  '#ffffff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Azul Neón · 40 x 60 cm',
  'NS-LAMPAR-40X6-AZUL',
  65,
  1000,
  'custom:40 x 60 cm',
  'Azul Neón',
  '#00d4ff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Rosa · 40 x 60 cm',
  'NS-LAMPAR-40X6-ROSA',
  65,
  1000,
  'custom:40 x 60 cm',
  'Rosa',
  '#ff007a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Púrpura · 40 x 60 cm',
  'NS-LAMPAR-40X6-PRPU',
  65,
  1000,
  'custom:40 x 60 cm',
  'Púrpura',
  '#bd34fe',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Verde · 40 x 60 cm',
  'NS-LAMPAR-40X6-VERD',
  65,
  1000,
  'custom:40 x 60 cm',
  'Verde',
  '#00ff87',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Amarillo · 40 x 60 cm',
  'NS-LAMPAR-40X6-AMAR',
  65,
  1000,
  'custom:40 x 60 cm',
  'Amarillo',
  '#fcee0a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Naranja · 40 x 60 cm',
  'NS-LAMPAR-40X6-NARA',
  65,
  1000,
  'custom:40 x 60 cm',
  'Naranja',
  '#ff6b00',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Blanco · 40 x 70 cm',
  'NS-LAMPAR-40X7-BLAN',
  70,
  1000,
  'custom:40 x 70 cm',
  'Blanco',
  '#ffffff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Azul Neón · 40 x 70 cm',
  'NS-LAMPAR-40X7-AZUL',
  70,
  1000,
  'custom:40 x 70 cm',
  'Azul Neón',
  '#00d4ff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Rosa · 40 x 70 cm',
  'NS-LAMPAR-40X7-ROSA',
  70,
  1000,
  'custom:40 x 70 cm',
  'Rosa',
  '#ff007a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Púrpura · 40 x 70 cm',
  'NS-LAMPAR-40X7-PRPU',
  70,
  1000,
  'custom:40 x 70 cm',
  'Púrpura',
  '#bd34fe',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Verde · 40 x 70 cm',
  'NS-LAMPAR-40X7-VERD',
  70,
  1000,
  'custom:40 x 70 cm',
  'Verde',
  '#00ff87',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Amarillo · 40 x 70 cm',
  'NS-LAMPAR-40X7-AMAR',
  70,
  1000,
  'custom:40 x 70 cm',
  'Amarillo',
  '#fcee0a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Naranja · 40 x 70 cm',
  'NS-LAMPAR-40X7-NARA',
  70,
  1000,
  'custom:40 x 70 cm',
  'Naranja',
  '#ff6b00',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Blanco · 50 x 50 cm',
  'NS-LAMPAR-50X5-BLAN',
  60,
  1000,
  'custom:50 x 50 cm',
  'Blanco',
  '#ffffff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Azul Neón · 50 x 50 cm',
  'NS-LAMPAR-50X5-AZUL',
  60,
  1000,
  'custom:50 x 50 cm',
  'Azul Neón',
  '#00d4ff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Rosa · 50 x 50 cm',
  'NS-LAMPAR-50X5-ROSA',
  60,
  1000,
  'custom:50 x 50 cm',
  'Rosa',
  '#ff007a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Púrpura · 50 x 50 cm',
  'NS-LAMPAR-50X5-PRPU',
  60,
  1000,
  'custom:50 x 50 cm',
  'Púrpura',
  '#bd34fe',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Verde · 50 x 50 cm',
  'NS-LAMPAR-50X5-VERD',
  60,
  1000,
  'custom:50 x 50 cm',
  'Verde',
  '#00ff87',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Amarillo · 50 x 50 cm',
  'NS-LAMPAR-50X5-AMAR',
  60,
  1000,
  'custom:50 x 50 cm',
  'Amarillo',
  '#fcee0a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Naranja · 50 x 50 cm',
  'NS-LAMPAR-50X5-NARA',
  60,
  1000,
  'custom:50 x 50 cm',
  'Naranja',
  '#ff6b00',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Blanco · 50 x 80 cm',
  'NS-LAMPAR-50X8-BLAN',
  90,
  1000,
  'custom:50 x 80 cm',
  'Blanco',
  '#ffffff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Azul Neón · 50 x 80 cm',
  'NS-LAMPAR-50X8-AZUL',
  90,
  1000,
  'custom:50 x 80 cm',
  'Azul Neón',
  '#00d4ff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Rosa · 50 x 80 cm',
  'NS-LAMPAR-50X8-ROSA',
  90,
  1000,
  'custom:50 x 80 cm',
  'Rosa',
  '#ff007a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Púrpura · 50 x 80 cm',
  'NS-LAMPAR-50X8-PRPU',
  90,
  1000,
  'custom:50 x 80 cm',
  'Púrpura',
  '#bd34fe',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Verde · 50 x 80 cm',
  'NS-LAMPAR-50X8-VERD',
  90,
  1000,
  'custom:50 x 80 cm',
  'Verde',
  '#00ff87',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Amarillo · 50 x 80 cm',
  'NS-LAMPAR-50X8-AMAR',
  90,
  1000,
  'custom:50 x 80 cm',
  'Amarillo',
  '#fcee0a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Naranja · 50 x 80 cm',
  'NS-LAMPAR-50X8-NARA',
  90,
  1000,
  'custom:50 x 80 cm',
  'Naranja',
  '#ff6b00',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Blanco · 60 x 60 cm',
  'NS-LAMPAR-60X6-BLAN',
  70,
  1000,
  'custom:60 x 60 cm',
  'Blanco',
  '#ffffff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Azul Neón · 60 x 60 cm',
  'NS-LAMPAR-60X6-AZUL',
  70,
  1000,
  'custom:60 x 60 cm',
  'Azul Neón',
  '#00d4ff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Rosa · 60 x 60 cm',
  'NS-LAMPAR-60X6-ROSA',
  70,
  1000,
  'custom:60 x 60 cm',
  'Rosa',
  '#ff007a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Púrpura · 60 x 60 cm',
  'NS-LAMPAR-60X6-PRPU',
  70,
  1000,
  'custom:60 x 60 cm',
  'Púrpura',
  '#bd34fe',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Verde · 60 x 60 cm',
  'NS-LAMPAR-60X6-VERD',
  70,
  1000,
  'custom:60 x 60 cm',
  'Verde',
  '#00ff87',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Amarillo · 60 x 60 cm',
  'NS-LAMPAR-60X6-AMAR',
  70,
  1000,
  'custom:60 x 60 cm',
  'Amarillo',
  '#fcee0a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Naranja · 60 x 60 cm',
  'NS-LAMPAR-60X6-NARA',
  70,
  1000,
  'custom:60 x 60 cm',
  'Naranja',
  '#ff6b00',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Blanco · 70 x 70 cm',
  'NS-LAMPAR-70X7-BLAN',
  90,
  1000,
  'custom:70 x 70 cm',
  'Blanco',
  '#ffffff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Azul Neón · 70 x 70 cm',
  'NS-LAMPAR-70X7-AZUL',
  90,
  1000,
  'custom:70 x 70 cm',
  'Azul Neón',
  '#00d4ff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Rosa · 70 x 70 cm',
  'NS-LAMPAR-70X7-ROSA',
  90,
  1000,
  'custom:70 x 70 cm',
  'Rosa',
  '#ff007a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Púrpura · 70 x 70 cm',
  'NS-LAMPAR-70X7-PRPU',
  90,
  1000,
  'custom:70 x 70 cm',
  'Púrpura',
  '#bd34fe',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Verde · 70 x 70 cm',
  'NS-LAMPAR-70X7-VERD',
  90,
  1000,
  'custom:70 x 70 cm',
  'Verde',
  '#00ff87',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Amarillo · 70 x 70 cm',
  'NS-LAMPAR-70X7-AMAR',
  90,
  1000,
  'custom:70 x 70 cm',
  'Amarillo',
  '#fcee0a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Naranja · 70 x 70 cm',
  'NS-LAMPAR-70X7-NARA',
  90,
  1000,
  'custom:70 x 70 cm',
  'Naranja',
  '#ff6b00',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Blanco · 80 x 80 cm',
  'NS-LAMPAR-80X8-BLAN',
  120,
  1000,
  'custom:80 x 80 cm',
  'Blanco',
  '#ffffff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Azul Neón · 80 x 80 cm',
  'NS-LAMPAR-80X8-AZUL',
  120,
  1000,
  'custom:80 x 80 cm',
  'Azul Neón',
  '#00d4ff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Rosa · 80 x 80 cm',
  'NS-LAMPAR-80X8-ROSA',
  120,
  1000,
  'custom:80 x 80 cm',
  'Rosa',
  '#ff007a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Púrpura · 80 x 80 cm',
  'NS-LAMPAR-80X8-PRPU',
  120,
  1000,
  'custom:80 x 80 cm',
  'Púrpura',
  '#bd34fe',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Verde · 80 x 80 cm',
  'NS-LAMPAR-80X8-VERD',
  120,
  1000,
  'custom:80 x 80 cm',
  'Verde',
  '#00ff87',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Amarillo · 80 x 80 cm',
  'NS-LAMPAR-80X8-AMAR',
  120,
  1000,
  'custom:80 x 80 cm',
  'Amarillo',
  '#fcee0a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Naranja · 80 x 80 cm',
  'NS-LAMPAR-80X8-NARA',
  120,
  1000,
  'custom:80 x 80 cm',
  'Naranja',
  '#ff6b00',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Blanco · 90 x 90 cm',
  'NS-LAMPAR-90X9-BLAN',
  140,
  1000,
  'custom:90 x 90 cm',
  'Blanco',
  '#ffffff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Azul Neón · 90 x 90 cm',
  'NS-LAMPAR-90X9-AZUL',
  140,
  1000,
  'custom:90 x 90 cm',
  'Azul Neón',
  '#00d4ff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Rosa · 90 x 90 cm',
  'NS-LAMPAR-90X9-ROSA',
  140,
  1000,
  'custom:90 x 90 cm',
  'Rosa',
  '#ff007a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Púrpura · 90 x 90 cm',
  'NS-LAMPAR-90X9-PRPU',
  140,
  1000,
  'custom:90 x 90 cm',
  'Púrpura',
  '#bd34fe',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Verde · 90 x 90 cm',
  'NS-LAMPAR-90X9-VERD',
  140,
  1000,
  'custom:90 x 90 cm',
  'Verde',
  '#00ff87',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Amarillo · 90 x 90 cm',
  'NS-LAMPAR-90X9-AMAR',
  140,
  1000,
  'custom:90 x 90 cm',
  'Amarillo',
  '#fcee0a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Naranja · 90 x 90 cm',
  'NS-LAMPAR-90X9-NARA',
  140,
  1000,
  'custom:90 x 90 cm',
  'Naranja',
  '#ff6b00',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Blanco · 100 x 100 cm',
  'NS-LAMPAR-100X-BLAN',
  180,
  1000,
  'custom:100 x 100 cm',
  'Blanco',
  '#ffffff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Azul Neón · 100 x 100 cm',
  'NS-LAMPAR-100X-AZUL',
  180,
  1000,
  'custom:100 x 100 cm',
  'Azul Neón',
  '#00d4ff',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Rosa · 100 x 100 cm',
  'NS-LAMPAR-100X-ROSA',
  180,
  1000,
  'custom:100 x 100 cm',
  'Rosa',
  '#ff007a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Púrpura · 100 x 100 cm',
  'NS-LAMPAR-100X-PRPU',
  180,
  1000,
  'custom:100 x 100 cm',
  'Púrpura',
  '#bd34fe',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Verde · 100 x 100 cm',
  'NS-LAMPAR-100X-VERD',
  180,
  1000,
  'custom:100 x 100 cm',
  'Verde',
  '#00ff87',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Amarillo · 100 x 100 cm',
  'NS-LAMPAR-100X-AMAR',
  180,
  1000,
  'custom:100 x 100 cm',
  'Amarillo',
  '#fcee0a',
  true
);


INSERT INTO public.product_variants (
  product_id, name, sku, price, stock, size, color, color_hex, is_active
) VALUES (
  'c095ee23-f7f6-4665-b6d6-e7403c47ea30'::uuid,
  'Naranja · 100 x 100 cm',
  'NS-LAMPAR-100X-NARA',
  180,
  1000,
  'custom:100 x 100 cm',
  'Naranja',
  '#ff6b00',
  true
);

COMMIT;
