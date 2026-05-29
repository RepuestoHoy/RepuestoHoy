-- Alter table orders para agregar campos de comprobante y nuevo status
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_payment', 'confirmed', 'cancelled')),
ADD COLUMN IF NOT EXISTS comprobante_url TEXT,
ADD COLUMN IF NOT EXISTS comprobante_subido_at TIMESTAMP;

-- Actualizar registros existentes: si ya tenían status 'pendiente' o similar, convertir a pending_payment
UPDATE orders 
SET status = 'pending_payment' 
WHERE status = 'draft' AND created_at < NOW() - INTERVAL '1 hour';

-- Crear tabla email_logs para tracking
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL, -- 'cliente', 'vendedor', 'comprobante_recibido', etc.
    recipient_email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_comprobante ON orders(comprobante_url);

-- Comentarios para documentación
COMMENT ON COLUMN orders.status IS 'Estado de la orden: draft (carrito), pending_payment (esperando comprobante), confirmed (pagado), cancelled (cancelado)';
COMMENT ON COLUMN orders.comprobante_url IS 'URL del comprobante de pago en Supabase Storage';
COMMENT ON COLUMN orders.comprobante_subido_at IS 'Fecha/hora cuando se subió el comprobante';
