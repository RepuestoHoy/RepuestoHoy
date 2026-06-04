# 🚀 CHECKLIST PRE-LANZAMIENTO - REPUESTO HOY

## Variables de Entorno (Vercel Dashboard)

Ve a: https://vercel.com/dashboard → repuestohoy → Settings → Environment Variables

### ✅ Requeridas:
```
NEXT_PUBLIC_SUPABASE_URL=https://knxhboghyxwfsqptghxq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=<obtener de Supabase Dashboard → Project Settings → API → service_role key>
RESEND_API_KEY=<obtener de https://resend.com → API Keys>
```

### 🔧 Recomendadas:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SELLER_EMAIL=ventas@repuestohoy.com
```

---

## Base de Datos (Supabase)

### 1. Ejecutar SQL de Fixes
Ve a: https://supabase.com/dashboard/project/knxhboghyxwfsqptghxq/sql/new

Pega el contenido de `fixes-criticos.sql` y ejecuta.

### 2. Crear Bucket de Comprobantes
Ve a: https://supabase.com/dashboard/project/knxhboghyxwfsqptghxq/storage/buckets

- Click "New Bucket"
- Name: `comprobantes`
- Public: ✅ Sí
- Click "Save"
- Click en el bucket → Policies → Add Policies
- SELECT: Enable public access
- INSERT: Enable public access

### 3. Verificar Tablas Creadas

```sql
-- Debe retornar: orders, products, categories, delivery_zones, email_logs
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

---

## Configuración de Negocio

### Actualizar `lib/config.ts`:

```typescript
export const BUSINESS_CONFIG = {
  // ...
  payment: {
    pagoMovil: {
      bank: 'Mercantil',
      phone: '0412-2223775',
      id: 'V-COLOCAR_CEDULA_REAL_AQUI',  // <-- ACTUALIZAR
      name: 'Repuesto Hoy CA'
    },
    // ...
  }
}
```

---

## Verificar Emails (Resend)

### 1. Verificar Dominio
Ve a: https://resend.com/domains

- Agregar dominio: `repuestohoy.com`
- Seguir instrucciones de verificación DNS
- Esperar confirmación (puede tomar minutos)

### 2. Verificar Email de Envío
El from email es: `ventas@repuestohoy.com`

Asegurar que esté verificado en Resend.

---

## Testing del Flujo Completo

### Test 1: Navegación Básica
- [ ] Cargar página principal `/`
- [ ] Seleccionar marca, modelo, año
- [ ] Ir a `/shop` y verificar vehículo aparece
- [ ] Click en categoría → va a `/buscar`

### Test 2: Productos
- [ ] Verificar productos cargan en `/buscar`
- [ ] Filtros funcionan (categoría, tipo)
- [ ] Click en producto → página de detalle
- [ ] Agregar al carrito

### Test 3: Carrito
- [ ] Ver carrito `/carrito`
- [ ] Cambiar cantidad
- [ ] Eliminar producto
- [ ] Ir a checkout

### Test 4: Checkout (Usuario sin cuenta)
- [ ] Llenar datos personales
- [ ] Seleccionar zona de entrega
- [ ] Seleccionar método de pago (Pago Móvil)
- [ ] Subir comprobante de pago
- [ ] Verificar que el comprobante se ve
- [ ] Confirmar pedido
- [ ] Verificar llegada a `/gracias` con número de orden

### Test 5: Checkout (Usuario con cuenta)
- [ ] Crear cuenta en `/registro`
- [ ] Hacer login en `/login`
- [ ] Verificar que datos se prellenan en checkout
- [ ] Completar pedido

### Test 6: Emails
- [ ] Verificar que llega email al cliente (si puso email)
- [ ] Verificar que llega email a ventas@repuestohoy.com
- [ ] Verificar tabla `email_logs` tiene registros

### Test 7: Comprobantes
- [ ] Verificar que el comprobante se sube a Storage
- [ ] Verificar que la URL se guarda en `orders.comprobante_url`
- [ ] Verificar que se puede ver el comprobante desde el email

### Test 8: Admin
- [ ] Ir a `/admin`
- [ ] Ingresar contraseña ([CONTRASEÑA ELIMINADA — usar Supabase Auth])
- [ ] Ver lista de productos
- [ ] Agregar producto nuevo

---

## Verificar en Producción

### URLs a probar:
```
https://repuestohoy.com/
https://repuestohoy.com/buscar
https://repuestohoy.com/checkout
https://repuestohoy.com/login
https://repuestohoy.com/registro
https://repuestohoy.com/admin/productos
```

### Tests de rendimiento:
- [ ] PageSpeed Insights > 70
- [ ] Carga en < 3 segundos en 4G
- [ ] Funciona correctamente en móvil

---

## Post-Launch

### Inmediato (primeras 24h):
- [ ] Monitorear logs de Vercel
- [ ] Verificar emails se envían correctamente
- [ ] Revisar que comprobantes se suben
- [ ] Revisar tabla orders tiene datos

### Semana 1:
- [ ] Analytics configurado y funcionando
- [ ] Hotjar o similar para heatmaps
- [ ] Configurar backups automáticos de BD

---

## Comandos Útiles

### Ver logs de Vercel:
```bash
vercel logs --production
```

### Forzar redeploy:
```bash
vercel --prod
# o hacer un commit vacío:
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

### Verificar BD desde terminal:
```bash
# Instalar supabase CLI si no lo tienes
# Ver tablas
psql -h db.knxhboghyxwfsqptghxq.supabase.co -U postgres -c "\dt"
```

---

## Contactos de Soporte

| Servicio | URL | Para qué |
|----------|-----|----------|
| Supabase | https://supabase.com/dashboard | Base de datos |
| Vercel | https://vercel.com/dashboard | Hosting |
| Resend | https://resend.com | Emails |
| GitHub | https://github.com/RepuestoHoy/RepuestoHoy | Código |

---

**Fecha de revisión:** 18 de Febrero, 2026
**Próxima revisión recomendada:** Una vez completados los fixes
