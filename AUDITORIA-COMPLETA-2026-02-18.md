# 🔍 AUDITORÍA COMPLETA - REPUESTO HOY
**Fecha:** 18 de Febrero, 2026
**Auditor:** Subagente de Revisión
**Proyecto:** RepuestoHoy (repuestohoy.com)

---

## 📊 RESUMEN EJECUTIVO

| Aspecto | Estado | Prioridad |
|---------|--------|-----------|
| Estructura del Proyecto | ✅ Buena | Baja |
| Supabase Conexión | ⚠️ Parcial | Alta |
| Vercel Configuración | ⚠️ Requiere atención | Media |
| GitHub Integración | ✅ Configurado | Baja |
| API Endpoints | ⚠️ Inconsistente | Alta |
| Frontend | ✅ Bueno | Baja |
| Base de Datos | ⚠️ Incompleto | Alta |
| Autenticación | ✅ Funcional | Media |
| Storage | ⚠️ No verificado | Alta |
| Emails | ⚠️ Requiere API Key | Alta |

---

## 1. 📁 ESTRUCTURA DEL PROYECTO

### ✅ Lo que está bien:
- Estructura de carpetas clara y organizada
- Separación correcta entre `app/`, `components/`, `lib/`, `types/`
- Uso de App Router de Next.js 14
- TypeScript configurado correctamente
- Archivos de configuración bien ubicados

### 📁 Estructura actual:
```
repuesto-hoy/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home (selector de carro)
│   ├── buscar/            # Búsqueda de productos
│   ├── checkout/          # Checkout completo
│   ├── login/             # Autenticación
│   ├── registro/          # Registro de usuarios
│   ├── shop/              # Página post-fitment (NUEVA)
│   └── admin/             # Panel admin
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configs
├── types/                 # TypeScript interfaces
└── supabase/              # Configs de Supabase
```

### ⚠️ Problemas encontrados:
1. **Inconsistencia en tipos de producto:**
   - `lib/data.ts` usa: `'original' | 'generico'`
   - `lib/supabase.ts` usa: `'original' | 'generico'`
   - Pero el schema SQL tiene: `('economico', 'standard', 'premium')`
   - Ya hay un fix en `supabase-auth-setup.sql` pero no está aplicado

2. **Configuración de CI no actualizada:**
   - `lib/config.ts` tiene `id: 'V-12345678'` (placeholder)
   - Debe actualizarse con la cédula real para Pago Móvil

---

## 2. 🗄️ SUPABASE CONEXIÓN

### ✅ Configurado:
- URL: `https://knxhboghyxwfsqptghxq.supabase.co`
- Cliente Supabase en `lib/supabase.ts`
- Variables de entorno en `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://knxhboghyxwfsqptghxq.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
  ```

### ⚠️ Problemas:
1. **Falta SERVICE_ROLE_KEY en variables de entorno:**
   - `/api/ordenes/route.ts` usa: `process.env.SUPABASE_SERVICE_ROLE_KEY`
   - `/api/upload-comprobante/route.ts` también lo usa
   - Pero `.env.local` NO tiene esta variable
   - **Impacto:** Las APIs pueden fallar si dependen de service_role

2. **Tablas esperadas (según código):**
   - ✅ `products` - Productos del catálogo
   - ✅ `categories` - Categorías
   - ✅ `orders` - Órdenes
   - ✅ `delivery_zones` - Zonas de entrega
   - ❓ `email_logs` - Logs de emails enviados
   - ❓ `comprobantes` bucket - Para subir comprobantes

3. **Tabla `email_logs` no documentada en schema:**
   - Se usa en `/api/ordenes/route.ts`
   - Estructura esperada:
     ```sql
     - order_id (UUID)
     - email_type (VARCHAR)
     - recipient_email (VARCHAR)
     - subject (VARCHAR)
     - status (pending|sent|failed)
     - error_message (TEXT)
     - sent_at (TIMESTAMP)
     ```

---

## 3. 🚀 VERCEL CONFIGURACIÓN

### ✅ Configurado:
- Proyecto conectado a GitHub: `RepuestoHoy/RepuestoHoy`
- Auto-deploy desde `main` branch
- Archivo `.vercel/project.json` presente

### ⚠️ Variables de Entorno FALTANTES en Vercel:

| Variable | Estado | Dónde se usa |
|----------|--------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ⚠️ Requiere verificación | Cliente Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚠️ Requiere verificación | Cliente Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ FALTA | API endpoints |
| `RESEND_API_KEY` | ❌ FALTA | Envío de emails |
| `NEXT_PUBLIC_GA_ID` | ❌ FALTA (opcional) | Google Analytics |

### 🔴 CRÍTICO:
Las siguientes variables **DEBEN** estar configuradas en Vercel Dashboard:
```
SUPABASE_SERVICE_ROLE_KEY=re_key_aquí
RESEND_API_KEY=re_key_aquí
```

---

## 4. 🔗 GITHUB INTEGRACIÓN

### ✅ Estado: Funcional
- Repositorio: `https://github.com/RepuestoHoy/RepuestoHoy.git`
- Branch: `main`
- Estado: Clean (no hay cambios sin commitear)
- Últimos commits:
  - `a994035` Fix order status values to match database constraint
  - `1042d88` Trigger redeploy for RESEND_API_KEY
  - `73c18e9` Migrate email system from Gmail SMTP to Resend API

### ⚠️ Observaciones:
- No hay sistema de CI/CD adicional más allá del auto-deploy de Vercel
- No hay tests automatizados configurados

---

## 5. 🔌 API ENDPOINTS

### Endpoints implementados:

#### `/api/ordenes` - Crear orden
**Métodos:** POST, PATCH
**Estado:** ⚠️ Funcional pero con problemas

**Problemas:**
1. El POST envía `comprobanteUrl` (camelCase) pero el backend espera `comprobante_url` (snake_case)
   - CheckoutClient.tsx línea 181: `comprobanteUrl`
   - API espera: `comprobante_url`
   - **Esto causa que el comprobante no se guarde**

2. Falta `SUPABASE_SERVICE_ROLE_KEY` en producción

#### `/api/upload-comprobante` - Subir comprobantes
**Métodos:** POST, DELETE
**Estado:** ⚠️ Funcional pero sin verificar bucket

**Problemas:**
1. Se asume que existe un bucket `comprobantes` en Supabase Storage
2. No se ha verificado si el bucket existe y es público
3. Falta `SUPABASE_SERVICE_ROLE_KEY`

#### `/api/admin-auth` - Autenticación admin
**Métodos:** POST
**Estado:** ⚠️ Inseguro

**Problemas:**
1. Contraseña hardcodeada: `[CONTRASEÑA ELIMINADA — usar Supabase Auth]`
2. No usa variable de entorno `ADMIN_PASSWORD` como debería
3. Token generado es muy simple (Base64 de timestamp)
4. **Riesgo de seguridad:** La contraseña está en el código fuente

---

## 6. 🎨 FRONTEND

### ✅ Lo que está bien:
- Diseño moderno y responsive
- Mobile-first approach
- Animaciones y transiciones fluidas
- Uso de Tailwind CSS consistente
- Componentes bien estructurados

### Páginas implementadas:
| Página | Estado | Observaciones |
|--------|--------|---------------|
| `/` (Home) | ✅ Completa | Selector de vehículo funcional |
| `/buscar` | ✅ Completa | Con búsqueda inteligente por problema |
| `/shop` | ✅ Nueva | Página post-fitment estilo CARiD |
| `/checkout` | ✅ Completa | Con subida de comprobantes |
| `/gracias` | ✅ Completa | Página de confirmación |
| `/login` | ✅ Completa | Autenticación Supabase |
| `/registro` | ✅ Completa | Registro con validación |
| `/carrito` | ✅ Completa | Carrito funcional |
| `/admin/productos` | ⚠️ Básica | Falta editar/eliminar |

### ⚠️ Problemas frontend:
1. **Productos de ejemplo hardcodeados:**
   - `SAMPLE_PRODUCTS` en `lib/data.ts` se usa en `/buscar`
   - No se conecta a Supabase para obtener productos reales
   - El cliente ve productos de ejemplo, no los de la base de datos

2. **Shop page usa Supabase pero...:**
   - Hace fetch de conteos de productos
   - Pero si no hay productos en la BD, todo aparecerá en 0

---

## 7. 🗃️ BASE DE DATOS

### Schema principal (`supabase-schema.sql`):

#### Tablas definidas:
1. ✅ `cars` - Compatibilidad de vehículos
2. ✅ `categories` - Categorías de productos
3. ✅ `suppliers` - Talleres/proveedores
4. ✅ `products` - Productos
5. ✅ `orders` - Órdenes
6. ✅ `delivery_zones` - Zonas de entrega

#### ❌ Tablas FALTANTES en schema:
1. **`email_logs`** - Usada en `/api/ordenes/route.ts`
2. **`users`** - Manejada por Supabase Auth (automática)

### ⚠️ Problemas de schema:

1. **Inconsistencia en CHECK constraint de products.type:**
   ```sql
   -- Schema dice:
   type VARCHAR(20) CHECK (type IN ('economico', 'standard', 'premium'))
   
   -- Código usa:
   type: 'original' | 'generico'
   ```
   
   **Fix aplicado en `supabase-auth-setup.sql`:**
   ```sql
   ALTER TABLE products DROP CONSTRAINT IF EXISTS products_type_check;
   ALTER TABLE products ADD CONSTRAINT products_type_check 
     CHECK (type IN ('original', 'generico'));
   ```

2. **Columnas en orders que pueden faltar:**
   - `comprobante_url` - Para URL del comprobante
   - `comprobante_subido_at` - Timestamp de subida
   - `whatsapp_notified` - Boolean de notificación

3. **RLS Policies:**
   - Hay políticas definidas en `supabase-auth-setup.sql`
   - Pero no se ha verificado si están aplicadas

---

## 8. 🔐 AUTENTICACIÓN

### ✅ Estado: Funcional
- Usa Supabase Auth
- Login con email/password
- Registro con validación
- Persistencia de sesión
- Prefill de datos en checkout para usuarios logueados

### ⚠️ Problemas:
1. **No hay protección de rutas admin:**
   - `/admin/*` no verifica autenticación
   - Cualquiera puede acceder al panel admin
   - Solo `/admin` (la raíz) pide contraseña

2. **No hay roles de usuario:**
   - No hay diferencia entre cliente y admin
   - Todos los usuarios son iguales

---

## 9. 📦 STORAGE

### Buckets necesarios:

#### 1. `comprobantes` - Para comprobantes de pago
**Estado:** ❌ No verificado
**Uso:** `/api/upload-comprobante/route.ts`

**Configuración requerida:**
```sql
-- Crear bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'comprobantes',
  'comprobantes', 
  true,
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
);

-- Políticas
CREATE POLICY "Public can read comprobantes"
ON storage.objects FOR SELECT
USING (bucket_id = 'comprobantes');

CREATE POLICY "Anyone can upload comprobantes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'comprobantes');
```

#### 2. `productos` - Para imágenes de productos
**Estado:** ⚠️ Documentado pero no verificado

---

## 10. 📧 EMAILS (RESEND)

### ✅ Configuración:
- Sistema migrado de Gmail SMTP a Resend API
- Plantillas HTML bien diseñadas
- Logging de emails en base de datos

### ⚠️ Problemas:
1. **Falta `RESEND_API_KEY` en Vercel**
   - El código detecta esto y loguea error
   - Los emails no se enviarán hasta configurar la key

2. **From email:**
   - Configurado: `ventas@repuestohoy.com`
   - Requiere verificar dominio en Resend

3. **Email de admin hardcodeado:**
   - En `/api/ordenes/route.ts` línea ~280
   - `'ventas@repuestohoy.com'` está hardcodeado
   - Debería usar variable de entorno `SELLER_EMAIL`

---

## 🔴 PROBLEMAS CRÍTICOS (Fix Inmediato Requerido)

### 1. Variables de Entorno en Vercel
```bash
# Configurar en Vercel Dashboard:
SUPABASE_SERVICE_ROLE_KEY=<tu_service_role_key>
RESEND_API_KEY=<tu_resend_api_key>
```

### 2. Fix API /api/ordenes - camelCase vs snake_case
**Archivo:** `/api/ordenes/route.ts`
**Línea:** ~170 (donde recibe el body)

El POST recibe `comprobanteUrl` (camelCase) del frontend pero debe guardar `comprobante_url` (snake_case) en la BD.

### 3. Crear tabla `email_logs`
```sql
CREATE TABLE email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  email_type VARCHAR(50) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Crear bucket `comprobantes` en Supabase Storage

### 5. Actualizar CI en config.ts
```typescript
// lib/config.ts
payment: {
  pagoMovil: {
    id: 'V-XXXXXXXX', // <-- Cédula real aquí
  }
}
```

---

## 🟡 PROBLEMAS MEDIOS (Fix Recomendado)

### 1. Inconsistencia tipos de producto
Aplicar el fix del SQL:
```sql
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_type_check;
ALTER TABLE products ADD CONSTRAINT products_type_check 
  CHECK (type IN ('original', 'generico'));
```

### 2. Admin auth hardcodeado
**Archivo:** `/api/admin-auth/route.ts`
- Mover contraseña a variable de entorno
- Implementar JWT más seguro

### 3. Protección de rutas admin
Agregar middleware o verificación de auth en `/admin/*`

### 4. Conectar /buscar a Supabase
Actualmente usa `SAMPLE_PRODUCTS`, debería hacer fetch real.

---

## 🟢 MEJORAS RECOMENDADAS

1. **Agregar tests** (Jest, React Testing Library)
2. **Implementar rate limiting** en APIs
3. **Agregar Sentry** para monitoreo de errores
4. **Configurar webhook** de Supabase para notificaciones realtime
5. **Implementar caché** con React Query o SWR
6. **Agregar lazy loading** de imágenes
7. **Implementar Service Worker** para PWA

---

## 📋 CHECKLIST PRE-LAUNCH

### Infraestructura:
- [ ] Configurar `SUPABASE_SERVICE_ROLE_KEY` en Vercel
- [ ] Configurar `RESEND_API_KEY` en Vercel
- [ ] Verificar dominio `ventas@repuestohoy.com` en Resend
- [ ] Actualizar CI real en `lib/config.ts`

### Base de Datos:
- [ ] Crear tabla `email_logs`
- [ ] Crear bucket `comprobantes` en Storage
- [ ] Aplicar fix de `products_type_check`
- [ ] Verificar RLS policies están activas

### Código:
- [ ] Fix camelCase vs snake_case en `/api/ordenes`
- [ ] Conectar `/buscar` a productos reales de Supabase
- [ ] Proteger rutas `/admin/*`

### Testing:
- [ ] Probar flujo completo de compra
- [ ] Verificar emails se envían
- [ ] Verificar comprobantes se suben
- [ ] Probar en móvil real

---

## 📞 CONTACTO SOPORTE

- **WhatsApp:** +58 412-2223775
- **Email:** ventas@repuestohoy.com
- **Admin:** https://repuestohoy.com/admin/productos

---

*Fin del reporte de auditoría*
