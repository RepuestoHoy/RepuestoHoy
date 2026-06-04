-- ============================================================
--  Imágenes de categorías — Repuesto Hoy
--  Agrega soporte para que el equipo suba una imagen por categoría
--  desde el panel admin. Ejecutar en Supabase > SQL Editor.
-- ============================================================

-- 1. Agregar columna de imagen a la tabla categories (si no existe)
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Asegurar que RLS esté activo y que el público pueda leer las categorías
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Público ve categorías" ON categories;
CREATE POLICY "Público ve categorías" ON categories
  FOR SELECT USING (true);

-- 2. Crear bucket de Storage para las imágenes de categorías
INSERT INTO storage.buckets (id, name, public)
VALUES ('categorias', 'categorias', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas del bucket: público puede VER, solo autenticados gestionan
DROP POLICY IF EXISTS "Imágenes categorías públicas" ON storage.objects;
CREATE POLICY "Imágenes categorías públicas" ON storage.objects
  FOR SELECT USING (bucket_id = 'categorias');

DROP POLICY IF EXISTS "Staff sube imágenes categorías" ON storage.objects;
CREATE POLICY "Staff sube imágenes categorías" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'categorias' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Staff actualiza imágenes categorías" ON storage.objects;
CREATE POLICY "Staff actualiza imágenes categorías" ON storage.objects
  FOR UPDATE USING (bucket_id = 'categorias' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Staff borra imágenes categorías" ON storage.objects;
CREATE POLICY "Staff borra imágenes categorías" ON storage.objects
  FOR DELETE USING (bucket_id = 'categorias' AND auth.role() = 'authenticated');

-- 4. Permitir que autenticados actualicen la columna image_url de categories
DROP POLICY IF EXISTS "Staff actualiza categorías" ON categories;
CREATE POLICY "Staff actualiza categorías" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');



-- 5. Asegurar que las 20 categorías de la página existan en la tabla
--    (ON CONFLICT actualiza las que ya estaban, agrega las que faltan)
INSERT INTO categories (slug, name, emoji, description, sort_order) VALUES
  ('frenos', 'Frenos', '🛑', 'Pastillas, discos, líquido de frenos', 1),
  ('filtros', 'Filtros', '🔧', 'Aceite, aire, gasolina, habitáculo', 2),
  ('bateria', 'Batería', '🔋', 'Baterías y sistema eléctrico', 3),
  ('aceites', 'Aceites', '🛢️', 'Aceite motor, transmisión, dirección', 4),
  ('bujias', 'Bujías', '⚡', 'Bujías y sistema de encendido', 5),
  ('neumaticos', 'Neumáticos', '🛞', 'Cauchos y válvulas', 6),
  ('parabrisas', 'Parabrisas', '🪟', 'Limpia parabrisas y escobillas', 7),
  ('suspension', 'Suspensión', '⚙️', 'Amortiguadores, terminales, bujes', 8),
  ('enfriamiento', 'Enfriamiento', '❄️', 'Radiador, bomba de agua, termostato', 9),
  ('motor', 'Motor', '🔩', 'Correas, tensores, juntas', 10),
  ('sensores', 'Sensores', '📡', 'Sensores O2, temperatura, check engine', 11),
  ('escape', 'Escape', '💨', 'Tubo de escape y catalizador', 12),
  ('direccion', 'Dirección', '🎯', 'Bombas, rack, terminales', 13),
  ('transmision', 'Transmisión', '🔄', 'Embrague, aceite de caja, CV', 14),
  ('audio', 'Audio', '🔊', 'Parlantes, radio, amplificadores', 15),
  ('iluminacion', 'Iluminación', '💡', 'Luces LED, bombillos, faros', 16),
  ('interior', 'Interior', '🪑', 'Cubreasientos, alfombras, organizadores', 17),
  ('exterior', 'Exterior', '🚗', 'Defensas, estribos, spoilers', 18),
  ('herramientas', 'Herramientas', '🧰', 'Kit de emergencia, gatas, crucetas', 19),
  ('seguridad', 'Seguridad', '🛡️', 'Cámaras, alarmas, seguros', 20)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, emoji = EXCLUDED.emoji, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;

-- (Si las categorías aún no están en la tabla, ejecutar primero el INSERT
--  de categorías que ya viene en supabase-setup.sql)
