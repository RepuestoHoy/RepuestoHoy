# 🚀 GUIA DE LANZAMIENTO — REPUESTO HOY

## ✅ Qué se implementó en esta sesión

| Feature | Estado |
|---------|--------|
| API `/api/ordenes` — guarda en Supabase | ✅ Listo |
| Email al vendedor con cada orden | ✅ Listo |
| Email de confirmación al comprador | ✅ Listo |
| Login/Registro de compradores (opcional) | ✅ Listo |
| Panel Admin protegido con contraseña | ✅ Listo |
| Dashboard con órdenes en tiempo real | ✅ Listo |
| Cambiar estado de órdenes desde admin | ✅ Listo |
| Upload de imágenes de productos | ✅ Listo |
| Header con perfil de usuario | ✅ Listo |
| Todos los bugs críticos del CODE_REVIEW | ✅ Corregidos |

---

## 📋 PASOS PARA PODER USARLA HOY

### PASO 1: Variables de entorno en Vercel

Ve a tu proyecto en **vercel.com → Settings → Environment Variables** y agrega:

```
NEXT_PUBLIC_SUPABASE_URL        → Lo ves en Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY   → Lo ves en Supabase → Settings → API
SUPABASE_SERVICE_ROLE_KEY       → Lo ves en Supabase → Settings → API (service_role)
GMAIL_USER                      → tu_email@gmail.com
GMAIL_APP_PASSWORD              → (ver instrucciones abajo)
SELLER_EMAIL                    → email donde quieres recibir notificaciones
NEXT_PUBLIC_ADMIN_PASSWORD      → contraseña segura para el panel admin
NEXT_PUBLIC_WHATSAPP            → 584122223775 (formato sin espacios ni +)
```

---

### PASO 2: Configurar Gmail para envío de emails

1. Ve a **myaccount.google.com**
2. Seguridad → **Verificación en 2 pasos** → Actívala
3. Regresa a Seguridad → **Contraseñas de aplicaciones**
4. Genera una contraseña para "Correo" en "Otro dispositivo"
5. Te da 16 caracteres tipo `xxxx xxxx xxxx xxxx` → ese es tu `GMAIL_APP_PASSWORD`

> ⚠️ La contraseña de aplicaciones es diferente a tu contraseña normal de Gmail. No compartas este archivo.

---

### PASO 3: Supabase — Ejecutar SQL

En **Supabase → SQL Editor**, ejecuta el archivo `supabase-auth-setup.sql` que está en el proyecto. Esto:
- Habilita Row Level Security
- Crea el bucket de imágenes `productos`
- Corrige el constraint de tipo de producto
- Permite que la API inserte órdenes correctamente

---

### PASO 4: Supabase — Activar Auth (para login de compradores)

En **Supabase → Authentication → Settings**:
- Site URL: `https://repuestohoy.com` (o tu dominio)
- Redirect URLs: `https://repuestohoy.com/**`
- Email confirmations: puedes dejarlo en On (recomendado) o apagarlo para simplificar

---

### PASO 5: Supabase — Crear Storage Bucket

En **Supabase → Storage**:
1. Crea un nuevo bucket llamado `productos`
2. Marca "Public bucket" ✅
3. File size limit: 3MB
4. Allowed MIME types: `image/jpeg, image/png, image/webp`

> Alternativamente el SQL en paso 3 ya lo hace automáticamente.

---

### PASO 6: Deploy en Vercel

```bash
git add .
git commit -m "feat: email notifications, auth, admin dashboard, image upload"
git push
```

Vercel detecta el push y despliega automáticamente.

---

## 🔐 URLs importantes

| URL | Descripción |
|-----|-------------|
| `repuestohoy.com` | Tienda (compradores) |
| `repuestohoy.com/login` | Login de compradores |
| `repuestohoy.com/registro` | Registro de compradores |
| `repuestohoy.com/admin` | Login del panel admin |
| `repuestohoy.com/admin/dashboard` | Dashboard con órdenes |
| `repuestohoy.com/admin/productos/nuevo` | Agregar productos |

---

## 📱 Flujo completo de una orden

1. **Cliente** agrega productos al carrito
2. **Cliente** va a `/checkout` — puede ser invitado o logeado
3. **Cliente** completa el formulario y confirma
4. **API** guarda la orden en Supabase
5. **Vendedor** recibe email con detalles completos + link WhatsApp al cliente
6. **Cliente** recibe email de confirmación con número de orden (si puso email)
7. **Vendedor** va a `/admin/dashboard` y ve la nueva orden en "Pendientes"
8. **Vendedor** contacta al cliente, confirma el pago
9. **Vendedor** cambia el estado en el dashboard (Confirmado → En camino → Entregado)

---

## 🛠️ Datos que debes actualizar en `lib/config.ts`

```typescript
payment: {
  pagoMovil: {
    bank: 'TU BANCO',          // Ej: Mercantil, Bancamiga
    phone: '0412-XXXXXXX',     // Tu número de Pago Móvil
    id: 'V-XXXXXXXX',          // Tu cédula
    name: 'TU NOMBRE O EMPRESA'
  },
  zelle: {
    email: 'tu@email.com',
    name: 'TU NOMBRE'
  }
}
```

---

## 🔔 Cómo saber que los emails funcionan

1. Después de desplegar, haz una orden de prueba desde la tienda
2. Revisa tu `SELLER_EMAIL` — debería llegar en segundos
3. Si usaste un email en el checkout, el comprador también recibe uno
4. Si no llegan: revisa los logs en Vercel → Functions → `/api/ordenes`

---

## 💡 Próximos pasos recomendados

- [ ] Agregar tus primeros 10-20 productos reales con fotos
- [ ] Verificar los datos de Pago Móvil en `lib/config.ts`
- [ ] Probar una orden completa de principio a fin
- [ ] Configurar dominio personalizado en Vercel
- [ ] Agregar Google Analytics (ya hay soporte, solo poner el GA_ID)
