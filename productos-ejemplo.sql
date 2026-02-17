-- PRODUCTOS DE EJEMPLO PARA REPUESTO HOY
-- SKUs estructurados: [CATEGORIA]-[MARCA]-[MODELO]-[NUMERO]

-- 1. FILTROS DE ACEITE TOYOTA COROLLA
INSERT INTO products (sku, name, description, category_id, brand, type, cost_price, sale_price, stock, is_available, images, features, compatible_cars) VALUES
(
  'FIL-TOY-COR-001',
  'Filtro de Aceite Toyota Corolla 2008-2020 - Económico',
  'Filtro de aceite básico para Toyota Corolla. Compatible con modelos 2008-2020. Cambio recomendado cada 5,000 km. Incluye junta de sellado.',
  (SELECT id FROM categories WHERE slug = 'filtros'),
  'Genérico',
  'economico',
  8.50,
  12.00,
  25,
  true,
  ARRAY['https://placehold.co/400x300/e5e7eb/111111?text=Filtro+Eco'],
  '{"duracion_km": 5000, "garantia_meses": 3, "incluye_junta": true}',
  '[{"brand": "Toyota", "model": "Corolla", "years": "2008-2020"}]'
),
(
  'FIL-TOY-COR-002',
  'Filtro de Aceite Toyota Corolla 2008-2020 - Standard',
  'Filtro de aceite de alta calidad FRAM para Toyota Corolla. Filtración óptima hasta 10,000 km. Válvula anti-drenado.',
  (SELECT id FROM categories WHERE slug = 'filtros'),
  'FRAM',
  'standard',
  14.00,
  19.50,
  18,
  true,
  ARRAY['https://placehold.co/400x300/fef3c7/92400e?text=Filtro+Std'],
  '{"duracion_km": 10000, "garantia_meses": 6, "valvula_anti_drenado": true}',
  '[{"brand": "Toyota", "model": "Corolla", "years": "2008-2020"}]'
),
(
  'FIL-TOY-COR-003',
  'Filtro de Aceite Toyota Corolla 2008-2020 - Original OEM',
  'Filtro de aceite original Toyota OEM 90915-YZZF1. Máxima calidad y durabilidad. Hasta 15,000 km de protección. Garantía 1 año.',
  (SELECT id FROM categories WHERE slug = 'filtros'),
  'Toyota',
  'premium',
  28.00,
  38.00,
  12,
  true,
  ARRAY['https://placehold.co/400x300/fee2e2/991b1b?text=Filtro+Premium'],
  '{"duracion_km": 15000, "garantia_meses": 12, "original_oem": true, "numero_parte": "90915-YZZF1"}',
  '[{"brand": "Toyota", "model": "Corolla", "years": "2008-2020"}]'
);

-- 2. PASTILLAS DE FRENO CHEVROLET AVEO
INSERT INTO products (sku, name, description, category_id, brand, type, cost_price, sale_price, stock, is_available, images, features, compatible_cars) VALUES
(
  'FRE-CHE-AVE-001',
  'Pastillas de Freno Chevrolet Aveo Delanteras - Económicas',
  'Pastillas de freno delanteras orgánicas para Chevrolet Aveo. Buena performance para uso urbano. Incluye sensores de desgaste.',
  (SELECT id FROM categories WHERE slug = 'frenos'),
  'Genérico',
  'economico',
  22.00,
  32.00,
  15,
  true,
  ARRAY['https://placehold.co/400x300/e5e7eb/111111?text=Pastillas+Eco'],
  '{"posicion": "delantera", "material": "organica", "garantia_meses": 3, "incluye_sensores": true}',
  '[{"brand": "Chevrolet", "model": "Aveo", "years": "2005-2018"}]'
),
(
  'FRE-CHE-AVE-002',
  'Pastillas de Freno Chevrolet Aveo Delanteras - Cerámicas',
  'Pastillas de freno cerámicas de alto rendimiento. Menos polvo, mejor frenado. Ideales para tráfico intenso de Caracas.',
  (SELECT id FROM categories WHERE slug = 'frenos'),
  'Brembo',
  'standard',
  38.00,
  55.00,
  10,
  true,
  ARRAY['https://placehold.co/400x300/fef3c7/92400e?text=Pastillas+Std'],
  '{"posicion": "delantera", "material": "ceramica", "garantia_meses": 6, "menos_polvo": true}',
  '[{"brand": "Chevrolet", "model": "Aveo", "years": "2005-2018"}]'
),
(
  'FRE-CHE-AVE-003',
  'Pastillas de Freno Chevrolet Aveo Delanteras - Performance',
  'Pastillas de freno semimetálicas de alto rendimiento. Máxima durabilidad y potencia de frenado. Para conductores exigentes.',
  (SELECT id FROM categories WHERE slug = 'frenos'),
  'Brembo',
  'premium',
  58.00,
  82.00,
  8,
  true,
  ARRAY['https://placehold.co/400x300/fee2e2/991b1b?text=Pastillas+Premium'],
  '{"posicion": "delantera", "material": "semimetalica", "garantia_meses": 12, "alto_rendimiento": true}',
  '[{"brand": "Chevrolet", "model": "Aveo", "years": "2005-2018"}]'
);

-- 3. BUJÍAS FORD FIESTA
INSERT INTO products (sku, name, description, category_id, brand, type, cost_price, sale_price, stock, is_available, images, features, compatible_cars) VALUES
(
  'BUJ-FOR-FIE-001',
  'Bujías Ford Fiesta 1.6 - Cobre',
  'Bujías de cobre para Ford Fiesta 1.6. Rendimiento estándar. Cambio recomendado cada 20,000 km. Juego de 4 unidades.',
  (SELECT id FROM categories WHERE slug = 'motor'),
  'NGK',
  'economico',
  18.00,
  26.00,
  30,
  true,
  ARRAY['https://placehold.co/400x300/e5e7eb/111111?text=Bujias+Eco'],
  '{"cantidad": 4, "material": "cobre", "duracion_km": 20000, "garantia_meses": 3}',
  '[{"brand": "Ford", "model": "Fiesta", "years": "2005-2019"}]'
),
(
  'BUJ-FOR-FIE-002',
  'Bujías Ford Fiesta 1.6 - Iridium',
  'Bujías NGK Iridium de alto rendimiento. Mayor durabilidad y mejor combustión. Duración hasta 60,000 km.',
  (SELECT id FROM categories WHERE slug = 'motor'),
  'NGK',
  'premium',
  45.00,
  65.00,
  20,
  true,
  ARRAY['https://placehold.co/400x300/fee2e2/991b1b?text=Bujias+Iridium'],
  '{"cantidad": 4, "material": "iridium", "duracion_km": 60000, "garantia_meses": 12, "mejor_combustion": true}',
  '[{"brand": "Ford", "model": "Fiesta", "years": "2005-2019"}]'
);

-- 4. AMORTIGUADORES JEEP CHEROKEE
INSERT INTO products (sku, name, description, category_id, brand, type, cost_price, sale_price, stock, is_available, images, features, compatible_cars) VALUES
(
  'AMO-JEE-CHE-001',
  'Amortiguadores Jeep Cherokee Delanteros - Par',
  'Amortiguadores delanteros para Jeep Cherokee. Par completo (izquierdo y derecho). Mejora estabilidad y confort.',
  (SELECT id FROM categories WHERE slug = 'suspension'),
  'Monroe',
  'standard',
  95.00,
  135.00,
  6,
  true,
  ARRAY['https://placehold.co/400x300/fef3c7/92400e?text=Amortiguadores'],
  '{"posicion": "delantera", "cantidad": 2, "garantia_meses": 6, "mejora_estabilidad": true}',
  '[{"brand": "Jeep", "model": "Cherokee", "years": "2008-2020"}]'
);

-- 5. BATERÍA HYUNDAI ACCENT
INSERT INTO products (sku, name, description, category_id, brand, type, cost_price, sale_price, stock, is_available, images, features, compatible_cars) VALUES
(
  'BAT-HYU-ACC-001',
  'Batería Hyundai Accent 45Ah - Standard',
  'Batería 45Ah para Hyundai Accent. Arranque confiable. Garantía 6 meses. Incluye instalación gratuita en nuestro taller.',
  (SELECT id FROM categories WHERE slug = 'electricos'),
  'Mac',
  'standard',
  65.00,
  95.00,
  8,
  true,
  ARRAY['https://placehold.co/400x300/fef3c7/92400e?text=Bateria+45Ah'],
  '{"capacidad_ah": 45, "garantia_meses": 6, "instalacion_incluida": true}',
  '[{"brand": "Hyundai", "model": "Accent", "years": "2005-2020"}]'
),
(
  'BAT-HYU-ACC-002',
  'Batería Hyundai Accent 55Ah - Premium',
  'Batería 55Ah de alto rendimiento para Hyundai Accent. Mayor capacidad y durabilidad. Ideal para uso intensivo.',
  (SELECT id FROM categories WHERE slug = 'electricos'),
  'Bosch',
  'premium',
  95.00,
  135.00,
  5,
  true,
  ARRAY['https://placehold.co/400x300/fee2e2/991b1b?text=Bateria+55Ah'],
  '{"capacidad_ah": 55, "garantia_meses": 12, "alto_rendimiento": true, "instalacion_incluida": true}',
  '[{"brand": "Hyundai", "model": "Accent", "years": "2005-2020"}]'
);

-- 6. ACEITE DE TRANSMISIÓN TOYOTA
INSERT INTO products (sku, name, description, category_id, brand, type, cost_price, sale_price, stock, is_available, images, features, compatible_cars) VALUES
(
  'ACE-TOY-UNI-001',
  'Aceite de Transmisión Toyota ATF-WS - 4 Litros',
  'Aceite de transmisión automática original Toyota ATF-WS. 4 litros. Cambio recomendado cada 40,000 km. Protege componentes.',
  (SELECT id FROM categories WHERE slug = 'transmision'),
  'Toyota',
  'premium',
  55.00,
  78.00,
  12,
  true,
  ARRAY['https://placehold.co/400x300/fee2e2/991b1b?text=Aceite+ATF'],
  '{"litros": 4, "tipo": "ATF-WS", "cambio_km": 40000, "garantia_meses": 12, "original": true}',
  '[{"brand": "Toyota", "model": "Corolla", "years": "2008-2020"}, {"brand": "Toyota", "model": "Yaris", "years": "2008-2020"}]'
);

-- Actualizar el contador de stock bajo para demostración
-- Algunos productos con stock menor a 10 para mostrar badges
