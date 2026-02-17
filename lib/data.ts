import { Car, Motorcycle, Product } from '@/types'

export const CARS: Car[] = [
  {
    brand: 'Toyota',
    models: ['Corolla', 'Yaris', 'Hilux', 'Fortuner', 'RAV4', 'Prado'],
    years: Array.from({ length: 21 }, (_, i) => 2005 + i)
  },
  {
    brand: 'Chevrolet',
    models: ['Aveo', 'Optra', 'Spark', 'Cruze', 'Captiva', 'Silverado'],
    years: Array.from({ length: 21 }, (_, i) => 2005 + i)
  },
  {
    brand: 'Ford',
    models: ['Fiesta', 'Focus', 'Explorer', 'Ranger', 'Ecosport', 'Escape'],
    years: Array.from({ length: 21 }, (_, i) => 2005 + i)
  },
  {
    brand: 'Jeep',
    models: ['Cherokee', 'Grand Cherokee', 'Wrangler', 'Compass', 'Renegade'],
    years: Array.from({ length: 21 }, (_, i) => 2005 + i)
  },
  {
    brand: 'Chery',
    models: ['QQ', 'Tiggo', 'Arrizo', 'Orinoco', 'X1'],
    years: Array.from({ length: 16 }, (_, i) => 2010 + i)
  },
  {
    brand: 'Hyundai',
    models: ['Accent', 'Elantra', 'Tucson', 'Santa Fe', 'Getz'],
    years: Array.from({ length: 21 }, (_, i) => 2005 + i)
  }
]

export const MOTORCYCLES: Motorcycle[] = [
  {
    brand: 'Yamaha',
    models: ['FZ', 'FZ-S', 'FZ-2.0', 'R15', 'MT-03', 'MT-07', 'XTZ', 'Crypton', 'BWS', 'NMax', 'Mio', 'Fino', 'Fz25'],
    years: Array.from({ length: 21 }, (_, i) => 2005 + i)
  },
  {
    brand: 'Honda',
    models: ['CB190R', 'CB300', 'CB500', 'CBR', 'XRE', 'XR150', 'XR190', 'XR250', 'Tornado', 'Wave', 'Dio', 'Click', 'Elite', 'Lead'],
    years: Array.from({ length: 21 }, (_, i) => 2005 + i)
  },
  {
    brand: 'Suzuki',
    models: ['GSX', 'Gixxer', 'Hayate', 'Best', 'Address', 'Axelo', 'Step', 'V-Strom'],
    years: Array.from({ length: 21 }, (_, i) => 2005 + i)
  },
  {
    brand: 'Bajaj',
    models: ['Boxer', 'Pulsar', 'Discover', 'Platina', 'Avenger', 'Dominar'],
    years: Array.from({ length: 21 }, (_, i) => 2005 + i)
  },
  {
    brand: 'Empire',
    models: ['Keeway', 'Arsen', 'Outlook', 'Target', 'RKV', 'RK'],
    years: Array.from({ length: 16 }, (_, i) => 2010 + i)
  },
  {
    brand: 'Sym',
    models: ['Crox', 'Fiddle', 'Jet', 'Orbit', 'Citycom'],
    years: Array.from({ length: 16 }, (_, i) => 2010 + i)
  },
  {
    brand: 'Kymco',
    models: ['Agility', 'Like', 'Downtown', 'Xciting'],
    years: Array.from({ length: 16 }, (_, i) => 2010 + i)
  },
  {
    brand: 'Genesis',
    models: ['Vmax', 'Gxt', 'Gxt200'],
    years: Array.from({ length: 16 }, (_, i) => 2010 + i)
  },
  {
    brand: 'Um',
    models: ['Dsr', 'Renegade', 'Max', 'Velocity'],
    years: Array.from({ length: 16 }, (_, i) => 2010 + i)
  },
  {
    brand: 'Mondial',
    models: ['Rd', 'Td', 'Enduro', 'Custom'],
    years: Array.from({ length: 16 }, (_, i) => 2010 + i)
  }
]

export interface Category {
  id: string
  name: string
  icon: string // ID del icono en CategoryIcons
  description: string
}

export const CATEGORIES: Category[] = [
  // Essentials - Seguridad y mantenimiento básico
  { id: 'frenos', name: 'Frenos', icon: 'frenos', description: 'Pastillas, discos, líquido de frenos' },
  { id: 'filtros', name: 'Filtros', icon: 'filtros', description: 'Aceite, aire, gasolina, habitáculo' },
  { id: 'bateria', name: 'Batería', icon: 'bateria', description: 'Baterías y sistema eléctrico' },
  { id: 'aceites', name: 'Aceites', icon: 'aceites', description: 'Aceite motor, transmisión, dirección' },
  { id: 'bujias', name: 'Bujías', icon: 'bujias', description: 'Bujías y sistema de encendido' },
  { id: 'neumaticos', name: 'Neumáticos', icon: 'neumaticos', description: 'Cauchos y válvulas' },
  { id: 'parabrisas', name: 'Parabrisas', icon: 'parabrisas', description: 'Limpia parabrisas y escobillas' },
  
  // Reparación - Sistemas mecánicos
  { id: 'suspension', name: 'Suspensión', icon: 'suspension', description: 'Amortiguadores, terminales, bujes' },
  { id: 'enfriamiento', name: 'Enfriamiento', icon: 'enfriamiento', description: 'Radiador, bomba de agua, termostato' },
  { id: 'motor', name: 'Motor', icon: 'motor', description: 'Correas, tensores, juntas' },
  { id: 'sensores', name: 'Sensores', icon: 'sensores', description: 'Sensores O2, temperatura, check engine' },
  { id: 'escape', name: 'Escape', icon: 'escape', description: 'Tubo de escape y catalizador' },
  { id: 'direccion', name: 'Dirección', icon: 'direccion', description: 'Bombas, rack, terminales' },
  { id: 'transmision', name: 'Transmisión', icon: 'transmision', description: 'Embrague, aceite de caja, CV' },
  
  // Mejoras - Accesorios y personalización
  { id: 'audio', name: 'Audio', icon: 'audio', description: 'Parlantes, radio, amplificadores' },
  { id: 'iluminacion', name: 'Iluminación', icon: 'iluminacion', description: 'Luces LED, bombillos, faros' },
  { id: 'interior', name: 'Interior', icon: 'interior', description: 'Cubreasientos, alfombras, organizadores' },
  { id: 'exterior', name: 'Exterior', icon: 'exterior', description: 'Defensas, estribos, spoilers' },
  { id: 'herramientas', name: 'Herramientas', icon: 'herramientas', description: 'Kit de emergencia, gatas, crucetas' },
  { id: 'seguridad', name: 'Seguridad', icon: 'seguridad', description: 'Cámaras, alarmas, seguros' }
]

export const DELIVERY_ZONES = [
  { id: 'chacao', name: 'Chacao / Baruta / El Hatillo', cost: 3, time: '2-4 horas', available: true },
  { id: 'losruices', name: 'Los Ruices / Boleíta / Petare', cost: 3, time: '2-4 horas', available: true },
  { id: 'santafe', name: 'Santa Fe / La Trinidad / Lomas', cost: 3, time: '2-4 horas', available: true },
  { id: 'centro', name: 'Centro / San Bernardino / Catia', cost: 5, time: '4-6 horas', available: true },
  { id: 'este', name: 'Guarenas / Guatire / Valle Alto', cost: 8, time: '6-12 horas', available: true },
  { id: 'pickup', name: 'Retiro en punto (Gratis)', cost: 0, time: 'Inmediato', available: true }
]

// Sample products
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Filtro de Aceite Toyota Corolla - FRAM',
    description: 'Filtro de aceite de alta calidad FRAM para Toyota Corolla. Compatible con modelos 2008-2020. Filtración óptima hasta 10,000 km.',
    category: 'filtros',
    brand: 'FRAM',
    type: 'generico',
    price: 18.50,
    originalPrice: 25.00,
    stock: 15,
    images: [],
    compatible: [{ brand: 'Toyota', model: 'Corolla', years: '2008-2020' }],
    features: ['Filtración 20 micrones', 'Válvula anti-drenado', '10,000 km duración'],
    sku: 'FRAM-PH3614'
  },
  {
    id: '2',
    name: 'Filtro de Aceite Toyota Corolla - Genérico',
    description: 'Opción económica para cambios frecuentes. Cambio recomendado cada 5,000 km.',
    category: 'filtros',
    brand: 'Genérico',
    type: 'generico',
    price: 12.00,
    stock: 20,
    images: [],
    compatible: [{ brand: 'Toyota', model: 'Corolla', years: '2008-2020' }],
    features: ['Durabilidad estándar', 'Cambio cada 5,000 km'],
    sku: 'GEN-PH3614'
  },
  {
    id: '3',
    name: 'Filtro de Aceite Toyota Corolla - Original',
    description: 'Filtro original Toyota OEM. Máxima calidad y durabilidad.',
    category: 'filtros',
    brand: 'Toyota',
    type: 'original',
    price: 35.00,
    stock: 8,
    images: [],
    compatible: [{ brand: 'Toyota', model: 'Corolla', years: '2008-2020' }],
    features: ['Original OEM', 'Alta durabilidad', '15,000 km duración'],
    sku: 'TOY-90915-YZZF1'
  }
]