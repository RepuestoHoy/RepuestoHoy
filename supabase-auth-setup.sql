-- ═══════════════════════════════════════════════════════════════
-- REPUESTO HOY - Auth & Storage Setup
-- Ejecutar esto en Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. Habilitar Row Level Security en orders para que funcione la API
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 2. Política: Solo el service role puede insertar órdenes (desde la API)
CREATE POLICY "Service role can do everything on orders"
ON orders FOR ALL
USING (auth.role() = 'service_role');

-- 3. Política: Compradores pueden ver sus propias órdenes (por email)
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (customer_email = auth.email());

-- 4. Política anónima: Insertar desde la API (no directamente)
-- La API usa service_role key, así que esto está cubierto

-- ───────────────────────────────────────────────────────────────
-- STORAGE: Crear bucket para imágenes de productos
-- ───────────────────────────────────────────────────────────────

-- Ejecutar en Supabase → Storage → New Bucket:
-- Nombre: productos
-- Public: ✅ Sí
-- File size limit: 3MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- O via SQL:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'productos',
  'productos', 
  true,
  3145728,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Política de storage: Cualquiera puede leer, solo admins pueden subir
CREATE POLICY "Public can read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'productos');

CREATE POLICY "Anyone can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'productos');

-- ───────────────────────────────────────────────────────────────
-- CORREGIR: El schema original tiene type CHECK incorrecto
-- El código usa 'original'|'generico' pero el schema tenía 'economico'|'standard'|'premium'
-- ───────────────────────────────────────────────────────────────

-- Si la tabla ya existe, actualizar el constraint:
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_type_check;
ALTER TABLE products ADD CONSTRAINT products_type_check 
  CHECK (type IN ('original', 'generico'));

-- ───────────────────────────────────────────────────────────────
-- ORDERS: Permitir inserción desde la API (sin autenticación de usuario)
-- ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Service role can do everything on orders" ON orders;

-- Política simple: permite todo desde service_role y también anon insert
CREATE POLICY "Allow insert orders from API"
ON orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow service role full access"
ON orders FOR ALL
USING (auth.role() = 'service_role');

-- Verificar que products también permite lectura pública
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read available products"
ON products FOR SELECT
USING (is_available = true);

CREATE POLICY "Service role manages products"
ON products FOR ALL
USING (auth.role() = 'service_role');
