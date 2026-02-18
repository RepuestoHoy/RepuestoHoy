-- ═══════════════════════════════════════════════════════════════
-- REPUESTO HOY - FIXES CRÍTICOS PARA PRODUCCIÓN
-- Ejecutar en Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. CORREGIR CONSTRAINT DE PRODUCTS.TYPE
-- El código usa 'original'|'generico' pero el schema tenía 'economico'|'standard'|'premium'
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_type_check;
ALTER TABLE products ADD CONSTRAINT products_type_check 
  CHECK (type IN ('original', 'generico'));

-- 2. CREAR TABLA EMAIL_LOGS (usada por /api/ordenes)
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  email_type VARCHAR(50) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para búsquedas rápidas
CREATE INDEX idx_email_logs_order ON email_logs(order_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);

-- 3. VERIFICAR/CORREGIR TABLA ORDERS
-- Asegurar que tenga todas las columnas necesarias
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS comprobante_url TEXT,
  ADD COLUMN IF NOT EXISTS comprobante_subido_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS whatsapp_notified BOOLEAN DEFAULT false;

-- 4. BUCKET DE COMPROBANTES (ejecutar en Storage UI o via API)
-- Nota: Los buckets deben crearse en Supabase Dashboard → Storage
-- 
-- Nombre: comprobantes
-- Public: SÍ
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/gif, image/webp, application/pdf

-- 5. POLÍTICAS RLS PARA ORDERS (permitir inserción desde API)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert orders from API" ON orders;
DROP POLICY IF EXISTS "Allow service role full access" ON orders;
DROP POLICY IF EXISTS "Service role can do everything on orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;

-- Política: Service role tiene acceso completo
CREATE POLICY "Service role full access"
ON orders FOR ALL
USING (auth.role() = 'service_role');

-- Política: Cualquiera puede crear órdenes (para checkout)
CREATE POLICY "Anyone can create orders"
ON orders FOR INSERT
WITH CHECK (true);

-- Política: Usuarios pueden ver sus propias órdenes
CREATE POLICY "Users view own orders"
ON orders FOR SELECT
USING (customer_email = auth.email() OR auth.role() = 'service_role');

-- 6. POLÍTICAS PARA PRODUCTS (lectura pública)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read available products" ON products;
DROP POLICY IF EXISTS "Service role manages products" ON products;

CREATE POLICY "Public read available products"
ON products FOR SELECT
USING (is_available = true);

CREATE POLICY "Service role manages products"
ON products FOR ALL
USING (auth.role() = 'service_role');

-- 7. POLÍTICAS PARA CATEGORIES (lectura pública)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read categories" ON categories;

CREATE POLICY "Public read categories"
ON categories FOR SELECT
USING (true);

-- 8. POLÍTICAS PARA DELIVERY_ZONES (lectura pública)
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read delivery zones" ON delivery_zones;

CREATE POLICY "Public read delivery zones"
ON delivery_zones FOR SELECT
USING (true);

-- 9. VERIFICAR ESTRUCTURA DE PRODUCTS
-- Asegurar que compatible_cars sea JSONB
ALTER TABLE products 
  ALTER COLUMN compatible_cars TYPE JSONB 
  USING compatible_cars::JSONB;

-- Asegurar que features sea JSONB
ALTER TABLE products 
  ALTER COLUMN features TYPE JSONB 
  USING features::JSONB;

-- 10. TRIGGER PARA ACTUALIZAR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════
-- VERIFICACIÓN: Queries para confirmar todo está correcto
-- ═══════════════════════════════════════════════════════════════

-- Verificar tabla email_logs existe
SELECT 'email_logs existe' as check_status 
WHERE EXISTS (SELECT FROM information_schema.tables 
              WHERE table_name = 'email_logs');

-- Verificar columnas de orders
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders';

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN ('orders', 'products', 'categories', 'delivery_zones');

-- Contar tablas creadas
SELECT COUNT(*) as total_tablas 
FROM information_schema.tables 
WHERE table_schema = 'public';
