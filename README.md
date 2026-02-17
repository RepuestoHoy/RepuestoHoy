# 🚗 Repuesto Hoy

**Repuestos para tu carro con entrega same-day en Caracas**

Sitio web completo para venta de repuestos automotrices con:
- ✅ Selector inteligente "Mi Carro" 
- ✅ Chequeo Express de mantenimiento
- ✅ Comparador de precios (Económico/Standard/Premium)
- ✅ Checkout con zonas de delivery en Caracas
- ✅ Integración WhatsApp Business

---

## 🎯 Características Premium

### Para el Cliente
- **"Mi Carro"**: Selecciona marca/modelo/año una vez, guardado para siempre
- **Chequeo Express**: Basado en km y último mantenimiento, sugiere qué necesita
- **3 Niveles de Precio**: Económico, Standard, Premium con comparación visual
- **Delivery Same-Day**: Zonas de Caracas con tiempos y costos claros
- **WhatsApp Directo**: Pedido rápido sin registrarse

### Para el Admin
- Dashboard de órdenes en tiempo real
- Gestión de inventario por proveedor
- Notificaciones automáticas por WhatsApp
- Analytics de ventas y productos más buscados

---

## 🏗️ Arquitectura

```
Frontend: Next.js 14 + Tailwind CSS + TypeScript
Backend: Next.js API Routes + Supabase
Database: PostgreSQL (Supabase)
Storage: Supabase Storage
Hosting: Vercel Pro
Email: Google Workspace
Notifications: WhatsApp Business API
```

---

## 📋 Setup Completo

### Paso 1: GitHub (Gratis)

1. Crear cuenta en [github.com](https://github.com)
2. Crear nuevo repositorio: `repuesto-hoy`
3. Hacerlo **público** o **privado** (da igual)
4. No inicializar con README

```bash
# En tu terminal local
cd repuesto-hoy
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUUSUARIO/repuesto-hoy.git
git push -u origin main
```

### Paso 2: Vercel Pro ($20/mes)

1. Ir a [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Importar proyecto `repuesto-hoy`
4. Framework Preset: Next.js
5. Click "Deploy"
6. **Upgrade a Pro**:
   - Settings → Billing → Upgrade to Pro
   - $20/mes, cancelable anytime

**Variables de Entorno (Vercel):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Paso 3: Supabase Pro ($25/mes)

1. Ir a [supabase.com](https://supabase.com)
2. Crear cuenta
3. "New Project"
   - Name: repuesto-hoy
   - Database Password: (generar fuerte)
   - Region: East US (N. Virginia) - más cercano a Caracas
4. **Upgrade a Pro**:
   - Project Settings → Billing → Change Plan → Pro ($25/mes)

**Setup Database:**
1. SQL Editor → New query
2. Copiar contenido de `supabase-schema.sql`
3. Run

**Setup Storage:**
1. Storage → New bucket
2. Name: `productos`
3. Public bucket: ✅ ON
4. Allowed MIME types: `image/jpeg, image/png, image/webp`

**Copiar credenciales:**
- Project Settings → API
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon public

### Paso 4: Google Workspace ($6/mes)

1. [workspace.google.com](https://workspace.google.com)
2. Business Starter: $6/usuario/mes
3. Dominio: repuestohoy.com
4. Verificar dominio (añadir TXT record en Namecheap)
5. Crear usuario: `hola@repuestohoy.com`

### Paso 5: WhatsApp Business (Gratis)

1. Descargar "WhatsApp Business" en teléfono
2. Registrar con número de negocio
3. Configurar perfil: Repuesto Hoy, logo, dirección
4. Para API avanzada (opcional): [business.whatsapp.com](https://business.whatsapp.com)

### Paso 6: Conectar Dominio

**En Vercel:**
1. Project Settings → Domains
2. Add: `repuestohoy.com`
3. Seguir instrucciones para DNS

**En Namecheap:**
1. Domain List → Manage
2. Advanced DNS
3. Añadir records que pide Vercel (generalmente CNAME o A records)
4. Esperar 5-60 minutos a propagar

---

## 🚀 Deploy

```bash
# Desarrollo local
npm install
npm run dev

# Deploy automático
# Cada push a main en GitHub → Vercel deploya automático
```

---

## 📊 Costos Mensuales

| Servicio | Costo | Para qué |
|----------|-------|----------|
| Vercel Pro | $20 | Hosting rápido, analytics, soporte |
| Supabase Pro | $25 | Database, storage, backups |
| Google Workspace | $6 | Email profesional |
| Dominio | ~$1 | repuestohoy.com |
| **Total** | **~$52/mes** | Todo incluido |

---

## 📝 Próximos Pasos después del Setup

1. **Subir productos** (20-30 iniciales)
2. **Fotografiar repuestos** o usar stock photos
3. **Configurar zonas de delivery** (ajustar precios si es necesario)
4. **Test checkout** completo
5. **Soft launch** en grupos de Facebook
6. **Iterar** según feedback

---

## 🆘 Soporte

Si algo falla en el setup:
1. Vercel: chat en vercel.com (Pro tiene soporte prioritario)
2. Supabase: discord.gg/supabase
3. GitHub: documentación en docs.github.com

---

**¿Listo para empezar? Comenzá con Paso 1 (GitHub) y avisame cuando tengas el repo creado.**# Force rebuild Tue Feb 17 00:00:28 EST 2026
