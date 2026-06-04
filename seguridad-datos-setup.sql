-- ============================================================
--  SEGURIDAD DE DATOS — Repuesto Hoy
--  Protege los datos de clientes (pedidos) y deja políticas
--  correctas. Ejecutar en Supabase > SQL Editor.
--
--  Principio: el público SOLO puede crear pedidos (checkout).
--  Solo usuarios AUTENTICADOS (tu equipo) pueden leerlos/gestionarlos.
--  Nadie anónimo puede leer datos de clientes.
-- ============================================================

-- ─── ORDERS (pedidos con datos de clientes) ───
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas viejas/contradictorias
DROP POLICY IF EXISTS "Allow insert orders from API" ON orders;
DROP POLICY IF EXISTS "Allow service role full access" ON orders;
DROP POLICY IF EXISTS "Service role can do everything on orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users view own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;

-- El público (checkout) SOLO puede CREAR pedidos. No leer.
CREATE POLICY "Publico crea pedidos"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Solo el equipo autenticado puede LEER los pedidos.
CREATE POLICY "Equipo lee pedidos"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

-- Solo el equipo autenticado puede ACTUALIZAR (cambiar estado, etc.).
CREATE POLICY "Equipo actualiza pedidos"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Solo el equipo autenticado puede BORRAR pedidos.
CREATE POLICY "Equipo borra pedidos"
  ON orders FOR DELETE
  USING (auth.role() = 'authenticated');


-- ─── ORDER_ITEMS (líneas de cada pedido), si existe ───
-- Mismo criterio: público crea, equipo lee.
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'order_items') THEN
    EXECUTE 'ALTER TABLE order_items ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Publico crea items" ON order_items';
    EXECUTE 'DROP POLICY IF EXISTS "Equipo lee items" ON order_items';
    EXECUTE 'CREATE POLICY "Publico crea items" ON order_items FOR INSERT WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Equipo lee items" ON order_items FOR SELECT USING (auth.role() = ''authenticated'')';
  END IF;
END $$;


-- ─── PRODUCTS (catálogo) ───
-- Público lee solo disponibles; equipo autenticado gestiona todo.
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read available products" ON products;
DROP POLICY IF EXISTS "Public read available products" ON products;
DROP POLICY IF EXISTS "Service role manages products" ON products;
DROP POLICY IF EXISTS "Staff gestiona productos" ON products;

CREATE POLICY "Publico ve productos disponibles"
  ON products FOR SELECT
  USING (is_available = true);

CREATE POLICY "Equipo gestiona productos"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');


-- ============================================================
--  IMPORTANTE — quién es "el equipo"
--  Con esto, cualquier usuario AUTENTICADO en tu Supabase puede
--  administrar. Por eso es CLAVE que en Authentication tengas
--  SOLO los usuarios de tu equipo, y que el registro público
--  esté DESACTIVADO:
--    Authentication > Providers > Email > "Enable signups" = OFF
--  Así nadie de fuera puede crearse una cuenta y entrar al panel.
-- ============================================================
