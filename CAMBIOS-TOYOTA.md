# Repuesto Hoy — Modelos Toyota Venezuela (1995–2026)
### Resumen de cambios

Se enriqueció la marca **Toyota** con todos los modelos del mercado venezolano, sus **generaciones**, **años exactos** y **motores**, respetando el diseño existente (Tailwind, navegación marca → modelo → año). El resto de las marcas no se tocó.

---

## Archivos modificados (6)

| Archivo | Cambio |
|---|---|
| `lib/toyota-generations.ts` | **NUEVO.** Generaciones, años y motores por modelo Toyota + helper de variantes Gasolina/Diésel. |
| `lib/data.ts` | Toyota lista 17 modelos reales de Venezuela; años desde **1995**. |
| `app/page.tsx` | El buscador del home desdobla los modelos Toyota en Gasolina/Diésel cuando aplica. Al buscar, separa modelo base y combustible. |
| `app/shop/page.tsx` | Lee el combustible elegido y lo muestra en el nombre del vehículo. |
| `app/marca/[brand]/[model]/page.tsx` | Años agrupados por generación con motores (modelos Toyota). |
| `app/marca/[brand]/[model]/[year]/page.tsx` | Muestra generación y motores del año elegido. |

## El desdoblado Gasolina/Diésel (lo último que agregamos)

En el buscador del home, los modelos que vienen en **ambos combustibles** aparecen como dos entradas: "Hilux (Gasolina)" y "Hilux (Diésel)". Solo se desdoblan 6 modelos (Hilux, Fortuner, Land Cruiser, Prado, Serie 70, Hiace); el resto queda simple. El menú pasa de 17 a 23 entradas.

Diseño seguro: la URL sigue llevando el **modelo base** (`model=Hilux`) más un parámetro nuevo `fuel=Diésel`. Así las páginas de productos no se rompen — `fuel` es información adicional. Verificado con una simulación de la lógica.

## Cómo está diseñado (importante)

El cambio es **aditivo y seguro**: el tipo `Car` original no se modificó, así que las otras 12 marcas (Chevrolet, Ford, etc.) siguen funcionando igual. La data rica de Toyota vive aparte en `toyota-generations.ts`, y las páginas la usan **solo si el modelo existe ahí**. Si un día agregas generaciones para otra marca, basta con seguir el mismo patrón.

Las claves del archivo de generaciones coinciden exactamente con los *slugs* de las URLs (ej. `/marca/toyota/land-cruiser-serie-70`), verificado: los 17 modelos mapean 1:1.

## Modelos Toyota incluidos (17, con 39 generaciones)

Corolla (desde Baby Camry E100), Yaris, Camry, Celica, Starlet, Agya, Hilux, Fortuner, 4Runner, Terios, Meru, Land Cruiser Prado, Land Cruiser (Autana/Burbuja/200/300), Land Cruiser Serie 70 (Macho), FJ Cruiser, Hiace, Dyna. Con apodos venezolanos incluidos.

---

## ⚠️ Validación y siguientes pasos

**Qué validé:** estructura del código balanceada, imports correctos, y que los 17 modelos mapean 1:1 con sus generaciones. **Qué NO pude validar:** el `npm run build` completo, porque mi entorno no tiene acceso a internet para instalar dependencias. Antes de publicar, corre en tu máquina:

```bash
npm install
npm run build
```

Si el build pasa, está listo para subir. Si marca algún error de tipos, lo más probable es que sea un ajuste menor y me lo puedes pasar.

**Sobre los datos:** los años y motores reflejan el mercado venezolano según fuentes públicas; conviene que **Toyota de Venezuela los confirme** en la reunión. Editar es fácil: cambias `lib/toyota-generations.ts` y listo.

**Lo que sigue dependiendo de Toyota:** los productos reales (números de parte, precios, fotos) que aparecen en la página de año vienen de tu base de datos Supabase (`products`). Eso se llena con el catálogo que negocies con ellos.
