// Generaciones, años y motores por modelo Toyota (mercado Venezuela).
// Estructura ENRIQUECIDA opcional: las páginas la usan si el modelo existe aquí.
// Generado desde toyota_venezuela_modelos.json — verificar con Toyota de Venezuela.

export interface Generation {
  name: string       // nombre comercial/venezolano, ej. 'New Sensation (E110)'
  code: string       // código de chasis, ej. 'E110'
  yearStart: number
  yearEnd: number
  engines: string[]
}

export interface ModelDetail {
  model: string
  segment: string
  aka: string[]      // apodos: Macho, Burbuja, etc.
  generations: Generation[]
}

// clave = slug del modelo (igual que en las URLs /marca/toyota/<slug>)
export const TOYOTA_GENERATIONS: Record<string, ModelDetail> = {
  "corolla": {
    model: "Corolla",
    segment: "Sedán / Pasajero",
    aka: ["Ávila", "Araya", "Sky", "Baby Camry", "New Sensation"],
    generations: [
      { name: "Baby Camry (E100)", code: "E100", yearStart: 1993, yearEnd: 1998, engines: ["1.6L 4A gasolina", "1.8L 7A gasolina (inyección desde ~1997)"] },
      { name: "New Sensation (E110)", code: "E110", yearStart: 1998, yearEnd: 2002, engines: ["1.8L 7A-FE gasolina"] },
      { name: "Corolla (E120)", code: "E120", yearStart: 2003, yearEnd: 2008, engines: ["1.8L 1ZZ-FE gasolina"] },
      { name: "Corolla (E140/E150)", code: "E140/E150", yearStart: 2009, yearEnd: 2014, engines: ["1.8L 2ZR-FE gasolina"] },
      { name: "Corolla (E170)", code: "E170", yearStart: 2015, yearEnd: 2019, engines: ["1.8L 2ZR-FE gasolina (GNV en versión local 2019)"] },
      { name: "Corolla (E210)", code: "E210", yearStart: 2020, yearEnd: 2026, engines: ["2.0L M20A gasolina", "1.8L híbrido (según versión importada)"] }
    ],
  },
  "yaris": {
    model: "Yaris",
    segment: "Sedán / Pasajero",
    aka: [],
    generations: [
      { name: "Yaris (XP90)", code: "XP90", yearStart: 2006, yearEnd: 2013, engines: ["1.3L gasolina", "1.5L gasolina"] },
      { name: "Yaris (XP150)", code: "XP150", yearStart: 2014, yearEnd: 2020, engines: ["1.5L 2NR-FE gasolina"] },
      { name: "Yaris (XP210 / Yaris Cross)", code: "XP210", yearStart: 2021, yearEnd: 2026, engines: ["1.5L gasolina"] }
    ],
  },
  "camry": {
    model: "Camry",
    segment: "Sedán / Pasajero",
    aka: [],
    generations: [
      { name: "Camry (XV20)", code: "XV20", yearStart: 1997, yearEnd: 2001, engines: ["2.2L 5S-FE gasolina", "3.0L V6 1MZ-FE"] },
      { name: "Camry (XV30)", code: "XV30", yearStart: 2002, yearEnd: 2006, engines: ["2.4L 2AZ-FE gasolina", "3.0L V6 1MZ-FE"] },
      { name: "Camry (XV40)", code: "XV40", yearStart: 2007, yearEnd: 2011, engines: ["2.4L 2AZ-FE gasolina", "3.5L V6 2GR-FE"] },
      { name: "Camry (XV50)", code: "XV50", yearStart: 2012, yearEnd: 2017, engines: ["2.5L gasolina", "3.5L V6"] }
    ],
  },
  "celica": {
    model: "Celica",
    segment: "Sedán / Pasajero",
    aka: [],
    generations: [
      { name: "Celica (T230)", code: "T230", yearStart: 2000, yearEnd: 2006, engines: ["1.8L 1ZZ-FE", "1.8L 2ZZ-GE (GTS)"] }
    ],
  },
  "starlet": {
    model: "Starlet",
    segment: "Sedán / Pasajero",
    aka: [],
    generations: [
      { name: "Starlet (P90)", code: "EP91", yearStart: 1996, yearEnd: 1999, engines: ["1.3L gasolina"] }
    ],
  },
  "hilux": {
    model: "Hilux",
    segment: "Pick-up",
    aka: [],
    generations: [
      { name: "Hilux (N140/N150/N160 — anterior)", code: "N140-N160", yearStart: 1995, yearEnd: 2004, engines: ["2.4L diésel", "2.7L gasolina 3RZ-FE", "Gasolina V6 según versión"] },
      { name: "Hilux (AN10/AN20/AN30 — Vigo)", code: "AN10-AN30", yearStart: 2005, yearEnd: 2015, engines: ["2.5L diésel 2KD-FTV", "3.0L diésel 1KD-FTV", "2.7L gasolina 2TR-FE", "4.0L V6 gasolina 1GR-FE"] },
      { name: "Hilux (AN120/AN130 — Revo)", code: "AN120-AN130", yearStart: 2016, yearEnd: 2026, engines: ["2.4L diésel 2GD-FTV", "2.8L diésel 1GD-FTV", "2.7L gasolina 2TR-FE", "4.0L V6 gasolina 1GR-FE"] }
    ],
  },
  "fortuner": {
    model: "Fortuner",
    segment: "SUV / Rústico",
    aka: ["Fortuner", "Fortuner SW4"],
    generations: [
      { name: "Fortuner (AN50/AN60)", code: "AN50-AN60", yearStart: 2006, yearEnd: 2015, engines: ["2.7L gasolina 2TR-FE", "4.0L V6 gasolina 1GR-FE", "3.0L diésel 1KD-FTV"] },
      { name: "Fortuner / SW4 (AN160)", code: "AN160", yearStart: 2016, yearEnd: 2026, engines: ["2.7L gasolina 2TR-FE", "4.0L V6 gasolina 1GR-FE", "2.8L diésel 1GD-FTV"] }
    ],
  },
  "4runner": {
    model: "4Runner",
    segment: "SUV / Rústico",
    aka: [],
    generations: [
      { name: "4Runner (N180)", code: "N180", yearStart: 1996, yearEnd: 2002, engines: ["2.7L 3RZ-FE gasolina", "3.4L 5VZ-FE V6 gasolina"] },
      { name: "4Runner (N210)", code: "N210", yearStart: 2003, yearEnd: 2009, engines: ["4.0L 1GR-FE V6 gasolina"] }
    ],
  },
  "terios": {
    model: "Terios",
    segment: "SUV / Rústico",
    aka: [],
    generations: [
      { name: "Terios (1ra gen)", code: "J100", yearStart: 2001, yearEnd: 2006, engines: ["1.3L gasolina"] },
      { name: "Terios (2da gen)", code: "J200", yearStart: 2007, yearEnd: 2017, engines: ["1.5L 3SZ-VE gasolina"] }
    ],
  },
  "meru": {
    model: "Meru",
    segment: "SUV / Rústico",
    aka: ["Meru", "Land Cruiser Prado J120"],
    generations: [
      { name: "Meru (Prado J120)", code: "J120", yearStart: 2003, yearEnd: 2009, engines: ["2.7L gasolina", "4.0L V6 1GR-FE gasolina"] }
    ],
  },
  "land-cruiser-prado": {
    model: "Land Cruiser Prado",
    segment: "SUV / Rústico",
    aka: ["Prado"],
    generations: [
      { name: "Prado (J150)", code: "J150", yearStart: 2010, yearEnd: 2023, engines: ["4.0L V6 gasolina 1GR-FE", "2.8L diésel 1GD-FTV"] },
      { name: "Prado (J250)", code: "J250", yearStart: 2024, yearEnd: 2026, engines: ["2.4L turbo gasolina/híbrido", "2.8L diésel 1GD-FTV"] }
    ],
  },
  "land-cruiser": {
    model: "Land Cruiser",
    segment: "SUV / Rústico",
    aka: ["Autana", "Burbuja", "Samurai", "Hembrita"],
    generations: [
      { name: "Autana / Burbuja (J80)", code: "J80 (FJ80/FZJ80/HDJ80)", yearStart: 1995, yearEnd: 1998, engines: ["4.5L gasolina 1FZ-FE", "4.2L diésel"] },
      { name: "Autana (J100)", code: "J100 (FZJ100/UZJ100)", yearStart: 1998, yearEnd: 2007, engines: ["4.5L gasolina 1FZ-FE", "4.7L V8 gasolina 2UZ-FE"] },
      { name: "Land Cruiser 200 (J200)", code: "J200", yearStart: 2008, yearEnd: 2021, engines: ["4.5L V8 diésel 1VD-FTV", "4.6L/5.7L V8 gasolina"] },
      { name: "Land Cruiser 300 (J300)", code: "J300", yearStart: 2022, yearEnd: 2026, engines: ["3.5L V6 twin-turbo gasolina", "3.3L V6 turbodiésel"] }
    ],
  },
  "land-cruiser-serie-70": {
    model: "Land Cruiser Serie 70",
    segment: "SUV / Rústico",
    aka: ["Macho", "Machito", "Samuray"],
    generations: [
      { name: "Macho (Serie 70)", code: "J70 (FZJ70/FZJ75/etc.)", yearStart: 1995, yearEnd: 2026, engines: ["4.5L gasolina 1FZ-FE", "4.0L V6 gasolina 1GR-FE (desde ~2009)", "4.2L diésel 1HZ"] }
    ],
  },
  "fj-cruiser": {
    model: "FJ Cruiser",
    segment: "SUV / Rústico",
    aka: [],
    generations: [
      { name: "FJ Cruiser", code: "GSJ15", yearStart: 2007, yearEnd: 2016, engines: ["4.0L V6 gasolina 1GR-FE"] }
    ],
  },
  "hiace": {
    model: "Hiace",
    segment: "Van / Comercial",
    aka: [],
    generations: [
      { name: "Hiace (H100)", code: "H100", yearStart: 1995, yearEnd: 2004, engines: ["2.4L gasolina", "Diésel según versión"] },
      { name: "Hiace (H200)", code: "H200", yearStart: 2005, yearEnd: 2018, engines: ["2.7L gasolina 2TR-FE", "3.0L diésel 1KD-FTV"] },
      { name: "Hiace (H300)", code: "H300", yearStart: 2019, yearEnd: 2026, engines: ["2.8L diésel 1GD-FTV", "3.5L V6 gasolina"] }
    ],
  },
  "dyna": {
    model: "Dyna",
    segment: "Van / Comercial",
    aka: [],
    generations: [
      { name: "Dyna (camión liviano)", code: "Dyna", yearStart: 1996, yearEnd: 2010, engines: ["Diésel"] }
    ],
  },
  "agya": {
    model: "Agya",
    segment: "Sedán / Pasajero",
    aka: [],
    generations: [
      { name: "Agya", code: "A10", yearStart: 2023, yearEnd: 2026, engines: ["1.2L gasolina"] }
    ],
  },
  "tercel": {
    model: "Tercel",
    segment: "Sedán / Pasajero",
    aka: [],
    generations: [
      { name: "Tercel (L40/L20)", code: "L20-L40", yearStart: 1995, yearEnd: 1999, engines: ["1.5L gasolina 5E-FE"] }
    ],
  },
  "corolla-cross": {
    model: "Corolla Cross",
    segment: "SUV / Rústico",
    aka: [],
    generations: [
      { name: "Corolla Cross", code: "XG10", yearStart: 2022, yearEnd: 2026, engines: ["2.0L gasolina M20A Dual VVT-i (167 hp)", "1.8L híbrido (según versión)"] }
    ],
  },
  "yaris-cross": {
    model: "Yaris Cross",
    segment: "SUV / Rústico",
    aka: [],
    generations: [
      { name: "Yaris Cross (AC200)", code: "AC200", yearStart: 2023, yearEnd: 2026, engines: ["1.5L gasolina", "1.5L híbrido"] }
    ],
  },
  "rav4": {
    model: "RAV4",
    segment: "SUV / Rústico",
    aka: [],
    generations: [
      { name: "RAV4 (XA30)", code: "XA30", yearStart: 2006, yearEnd: 2012, engines: ["2.4L gasolina", "3.5L V6 gasolina"] },
      { name: "RAV4 (XA40)", code: "XA40", yearStart: 2013, yearEnd: 2018, engines: ["2.5L gasolina"] },
      { name: "RAV4 (XA50)", code: "XA50", yearStart: 2019, yearEnd: 2026, engines: ["2.5L gasolina", "2.5L híbrido"] }
    ],
  },
  "tundra": {
    model: "Tundra",
    segment: "Pick-up",
    aka: [],
    generations: [
      { name: "Tundra (XK50)", code: "XK50", yearStart: 2007, yearEnd: 2021, engines: ["4.6L V8 gasolina", "5.7L V8 gasolina 3UR-FE"] },
      { name: "Tundra (XK70)", code: "XK70", yearStart: 2022, yearEnd: 2026, engines: ["3.5L V6 twin-turbo gasolina", "3.5L híbrido i-FORCE MAX"] }
    ],
  },
  "sequoia": {
    model: "Sequoia",
    segment: "SUV / Rústico",
    aka: [],
    generations: [
      { name: "Sequoia (XK60)", code: "XK60", yearStart: 2008, yearEnd: 2022, engines: ["5.7L V8 gasolina 3UR-FE"] }
    ],
  },
  "previa": {
    model: "Previa",
    segment: "Van / Comercial",
    aka: [],
    generations: [
      { name: "Previa (XR30/XR40)", code: "XR30-XR40", yearStart: 2000, yearEnd: 2019, engines: ["2.4L gasolina"] }
    ],
  },
  "avalon": {
    model: "Avalon",
    segment: "Sedán / Pasajero",
    aka: [],
    generations: [
      { name: "Avalon", code: "XX30/XX40", yearStart: 2005, yearEnd: 2018, engines: ["3.5L V6 gasolina 2GR-FE"] }
    ],
  },
}

// Devuelve el detalle de un modelo por su slug, o null si no está enriquecido.
export function getToyotaModelDetail(modelSlug: string): ModelDetail | null {
  return TOYOTA_GENERATIONS[modelSlug] ?? null
}

// Devuelve la generación que corresponde a un año dado (o null).
export function getGenerationForYear(detail: ModelDetail, year: number): Generation | null {
  return detail.generations.find(g => year >= g.yearStart && year <= g.yearEnd) ?? null
}

// --- Variantes de combustible para el selector del home ---
export interface ModelOption {
  label: string
  model: string
  fuel?: 'Diésel' | 'Gasolina'
}

function modelHasBothFuels(detail: ModelDetail): boolean {
  const all = detail.generations.flatMap((g) => g.engines).join(' ').toLowerCase()
  const diesel = all.includes('diésel') || all.includes('diesel')
  const gas = all.includes('gasolina')
  return diesel && gas
}

export function getToyotaModelOptions(models: string[]): ModelOption[] {
  const options: ModelOption[] = []
  for (const m of models) {
    const slug = m.toLowerCase().replace(/\s+/g, '-')
    const detail = TOYOTA_GENERATIONS[slug]
    if (detail && modelHasBothFuels(detail)) {
      options.push({ label: `${m} (Gasolina)`, model: m, fuel: 'Gasolina' })
      options.push({ label: `${m} (Diésel)`, model: m, fuel: 'Diésel' })
    } else {
      options.push({ label: m, model: m })
    }
  }
  return options
}
