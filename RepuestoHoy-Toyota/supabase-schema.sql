-- Repuesto Hoy - Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cars compatibility table
CREATE TABLE cars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year_start INTEGER NOT NULL,
  year_end INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers table (talleres)
CREATE TABLE suppliers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 20.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  supplier_id UUID REFERENCES suppliers(id),
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  brand VARCHAR(100),
  type VARCHAR(20) CHECK (type IN ('economico', 'standard', 'premium')),
  cost_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  images TEXT[],
  features JSONB,
  compatible_cars JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  delivery_zone VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_cost DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmado', 'en_camino', 'entregado', 'cancelado')),
  notes TEXT,
  whatsapp_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery zones table
CREATE TABLE delivery_zones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  delivery_time VARCHAR(100),
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_products_compatible ON products USING GIN (compatible_cars);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_phone ON orders(customer_phone);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Initial data
INSERT INTO categories (slug, name, emoji, description, sort_order) VALUES
('filtros', 'Filtros', '🔧', 'Aceite, aire, gasolina, habitáculo', 1),
('frenos', 'Frenos', '🛑', 'Pastillas, discos, líquido de frenos', 2),
('motor', 'Motor', '⚡', 'Bujías, correas, aceites', 3),
('suspension', 'Suspensión', '⬆️', 'Amortiguadores, terminales, bujes', 4),
('electricos', 'Eléctricos', '💡', 'Baterías, alternadores, bombillos', 5),
('transmision', 'Transmisión', '⚙️', 'Embrague, aceite de caja, CV', 6);

INSERT INTO delivery_zones (name, slug, cost, delivery_time, is_available, sort_order) VALUES
('Chacao / Baruta / El Hatillo', 'chacao', 3.00, '2-4 horas', true, 1),
('Los Ruices / Boleíta / Petare', 'losruices', 3.00, '2-4 horas', true, 2),
('Santa Fe / La Trinidad / Lomas', 'santafe', 3.00, '2-4 horas', true, 3),
('Centro / San Bernardino / Catia', 'centro', 5.00, '4-6 horas', true, 4),
('Guarenas / Guatire / Valle Alto', 'este', 8.00, '6-12 horas', true, 5),
('Retiro en punto', 'pickup', 0.00, 'Inmediato', true, 6);

-- Storage bucket for product images
-- Note: Create this via Supabase UI or API
-- Bucket name: 'productos'
-- Public: true
-- Allowed MIME types: image/jpeg, image/png, image/webp