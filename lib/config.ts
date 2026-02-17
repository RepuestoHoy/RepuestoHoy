// Configuración del negocio - Extraer a variables de entorno en producción
export const BUSINESS_CONFIG = {
  // Contacto
  phone: '+58 412-2223775',
  whatsapp: '584122223775',
  email: 'hola@repuestohoy.com',
  
  // Pago Móvil
  payment: {
    pagoMovil: {
      bank: 'Mercantil',
      phone: '0412-2223775',
      id: 'V-12345678', // Reemplazar con cédula real
      name: 'Repuesto Hoy CA'
    },
    zelle: {
      email: 'pagos@repuestohoy.com',
      name: 'Repuesto Hoy CA'
    }
  },
  
  // Redes sociales
  social: {
    instagram: '@repuestohoy',
    facebook: 'repuestohoy'
  },
  
  // Analytics
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'
  },
  
  // Imágenes
  images: {
    placeholder: '/placeholder-product.png',
    placeholderBlur: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjVGNUY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuyHnOeJhzwvdGV4dD48L3N2Zz4='
  },
  
  // Metadata
  name: 'Repuesto Hoy',
  tagline: 'Caracas • Entrega same-day',
  year: new Date().getFullYear()
}

// Constantes de validación
export const VALIDATION = {
  phone: {
    pattern: /^0(412|414|416|424|426)-\d{7}$/,
    message: 'Formato: 0412-1234567'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido'
  }
}

// Función helper para validar teléfono venezolano
export const validatePhone = (phone: string): boolean => {
  return VALIDATION.phone.pattern.test(phone)
}

// Función helper para validar email
export const validateEmail = (email: string): boolean => {
  if (!email) return true // Email es opcional
  return VALIDATION.email.pattern.test(email)
}

// Helper para tracking de analytics
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params)
  }
}
