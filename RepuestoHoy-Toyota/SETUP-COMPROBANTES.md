# Configuración Pendiente - Sistema de Comprobantes

## ✅ Código Deployado
El código del sistema de emails + comprobantes ya está en producción (commit 1bfabeb).

## ⚠️ Pasos Manuales Pendientes

### 1. Crear Bucket en Supabase Storage

Ir a: https://supabase.com/dashboard/project/knxhboghyxwfsqptghxq/storage/buckets

- Click "New Bucket"
- Name: `comprobantes`
- Public bucket: ✅ Sí (marcar como público)
- Click "Create bucket"

### 2. Aplicar Migraciones SQL

Ir a: https://supabase.com/dashboard/project/knxhboghyxwfsqptghxq/sql/new

Copiar y ejecutar el contenido de `supabase/migrations/001_add_comprobante_system.sql`:

```sql
-- Alter table orders para agregar campos de comprobante y nuevo status
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_payment', 'confirmed', 'cancelled')),
ADD COLUMN IF NOT EXISTS comprobante_url TEXT,
ADD COLUMN IF NOT EXISTS comprobante_subido_at TIMESTAMP;

-- Actualizar registros existentes
UPDATE orders 
SET status = 'pending_payment' 
WHERE status = 'draft' AND created_at < NOW() - INTERVAL '1 hour';

-- Crear tabla email_logs para tracking
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Crear indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_comprobante ON orders(comprobante_url);
```

### 3. Configurar Variables de Entorno en Vercel

Ir a: https://vercel.com/dashboard → repuesto-hoy → Settings → Environment Variables

Agregar/verificar:

```
GMAIL_USER=ventas@repuestohoy.com
GMAIL_APP_PASSWORD=mexi hfsi oxok ugwv
SELLER_EMAIL=ventas@repuestohoy.com
```

### 4. Política de Storage (RLS)

En el bucket `comprobantes`, configurar políticas:

```sql
-- Permitir lectura pública
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'comprobantes');

-- Permitir insert anónimo (para el checkout)
CREATE POLICY "Anonymous Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'comprobantes');

-- Permitir delete anónimo (para reemplazar archivos)
CREATE POLICY "Anonymous Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'comprobantes');
```

## 🧪 Testing

1. Ir a https://repuestohoy.com
2. Agregar producto al carrito
3. Ir a checkout
4. Seleccionar "Pago Móvil" o "Zelle"
5. Verificar que aparezca el campo de comprobante (obligatorio)
6. Subir una imagen de prueba
7. Completar el pedido
8. Verificar que lleguen los emails:
   - Al cliente (si proporcionó email)
   - A ventas@repuestohoy.com

## 📧 Flujo de Emails

| Evento | Destinatario | Asunto |
|--------|-------------|--------|
| Nueva orden | vendedor | 🆕 Nueva orden RH-XXX |
| Nueva orden | cliente | ✅ Confirmación de tu pedido RH-XXX |
| Comprobante recibido | vendedor | 📎 Comprobante recibido - Orden RH-XXX |
| Comprobante recibido | cliente | 📎 Comprobante recibido - Orden RH-XXX |

## 📂 Estructura de Archivos

Los comprobantes se guardan en:
```
comprobantes/[orderId]/comprobante_[timestamp]_[random].[ext]
```

## 🔄 Estados de Orden

- `draft` - Orden creada, esperando comprobante
- `pending_payment` - Comprobante subido, pendiente de verificación
- `confirmed` - Pago verificado (para efectivo: inmediato)
- `cancelled` - Orden cancelada
