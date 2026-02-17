# 📦 GUÍA PARA AGREGAR PRODUCTOS

## Opción 1: Formulario Simple (Recomendado)

Ve a tu sitio web:
```
https://repuesto-hoy.vercel.app/admin/productos/nuevo
```

O ejecuta localmente:
```bash
cd repuesto-hoy
npm run admin
```

### Campos del producto:

| Campo | Qué poner | Ejemplo |
|-------|-----------|---------|
| **SKU** | Código único del producto | `FIL-TOY-COR-001` |
| **Nombre** | Nombre descriptivo | `Filtro de Aceite Toyota Corolla 2008-2020` |
| **Descripción** | Qué incluye, duración, etc | `Filtro de alta calidad. Duración 10,000km. Incluye sellos.` |
| **Categoría** | Selecciona del dropdown | `Filtros` |
| **Marca** | Marca del repuesto | `FRAM`, `Toyota`, `Genérico` |
| **Tipo** | Calidad del producto | `Económico` / `Standard` / `Premium` |
| **Precio Costo** | Lo que pagas tú | `12.50` |
| **Precio Venta** | Lo que cobras | `18.50` |
| **Stock** | Unidades disponibles | `15` |
| **Fotos** | Sube imágenes del producto | JPG o PNG, máx 2MB |

---

## Opción 2: Excel/CSV (Para muchos productos)

### Paso 1: Descarga la plantilla
[Descargar plantilla CSV](https://repuesto-hoy.vercel.app/plantilla-productos.csv)

### Paso 2: Llena el Excel
```csv
sku,nombre,descripcion,categoria,marca,tipo,precio_costo,precio_venta,stock
FIL-001,Filtro Aceite Toyota,Filtro premium 10k km,filtros,FRAM,premium,12.50,18.50,15
FRE-001,Pastillas Delanteras,Pastillas cerámicas,frenos,Brembo,standard,25.00,35.00,8
```

### Paso 3: Sube el archivo
Ve a: `https://repuesto-hoy.vercel.app/admin/importar`

---

## Opción 3: Directo en Supabase (Para técnicos)

### URL:
```
https://supabase.com/dashboard/project/knxhboghyxwfsqptghxq
```

### Tabla: `products`

Ejemplo de inserción:
```sql
INSERT INTO products (
  sku, 
  name, 
  description, 
  category_id, 
  brand, 
  type, 
  cost_price, 
  sale_price, 
  stock,
  is_available
) VALUES (
  'FIL-TOY-001',
  'Filtro de Aceite Toyota Corolla',
  'Filtro de alta calidad compatible con modelos 2008-2020',
  (SELECT id FROM categories WHERE slug = 'filtros'),
  'FRAM',
  'standard',
  12.50,
  18.50,
  15,
  true
);
```

---

## 📋 Checklist antes de publicar

- [ ] SKU único (no se repite)
- [ ] Precio venta > Precio costo
- [ ] Stock es número positivo
- [ ] Fotos subidas al storage
- [ ] Descripción menciona compatibilidad (años/modelos)
- [ ] Tipo correcto (económico/standard/premium)

---

## 💡 Tips

1. **SKU**: Usa formato `CATEGORIA-MARCA-MODELO-NUMERO`
   - Ej: `FIL-Toyota-Corolla-001`
   
2. **Fotos**: Sube siempre la misma foto del producto real

3. **Descripción**: Incluye:
   - Qué incluye
   - Kilometraje de duración
   - Garantía (3, 6 o 12 meses según tipo)
   - Compatibilidad exacta (años)

4. **Stock**: Actualiza cuando vendas

---

## 🆘 ¿Necesitas ayuda?

Escribe por WhatsApp: **+58 412-2223775**

O crea un ticket en: `https://repuesto-hoy.vercel.app/ayuda`
