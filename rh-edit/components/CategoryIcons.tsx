import React from 'react'

// Iconos estilo line art profesional para categorías de repuestos

export const BrakeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
  </svg>
)

export const FilterIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16v4l-6 8v6H10v-6L4 8V4z"/>
    <path d="M8 4v2M16 4v2"/>
  </svg>
)

export const BatteryIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <path d="M6 10h4M6 14h4M12 10h6M12 14h6"/>
    <path d="M22 10v4"/>
  </svg>
)

export const OilIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M8 6h8l2 14H6L8 6z"/>
    <path d="M10 10v6M14 10v6"/>
  </svg>
)

export const SparkPlugIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M10 6h4l-1 14h-2L10 6z"/>
    <path d="M8 14h8"/>
  </svg>
)

export const TireIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <path d="M12 6v12M6 12h12"/>
  </svg>
)

export const WiperIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16v10H4z"/>
    <path d="M12 14v6M8 20h8"/>
    <path d="M6 8l4 4M14 8l4 4"/>
  </svg>
)

export const SuspensionIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v6M8 8h8l-2 12h-4L8 8z"/>
    <circle cx="12" cy="6" r="2"/>
  </svg>
)

export const CoolingIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="12" rx="2"/>
    <path d="M8 10h8M8 14h8M4 10H2M22 10h-2M4 14H2M22 14h-2"/>
  </svg>
)

export const EngineIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="6" width="16" height="12" rx="2"/>
    <circle cx="9" cy="12" r="2"/>
    <circle cx="15" cy="12" r="2"/>
    <path d="M2 10h2M20 10h2"/>
  </svg>
)

export const SensorIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
    <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>
  </svg>
)

export const ExhaustIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h12l2 4v8H6v-8l-2-4z"/>
    <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"/>
    <circle cx="16" cy="14" r="2"/>
  </svg>
)

export const SteeringIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v10M7 12h10"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
)

export const TransmissionIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="12" r="4"/>
    <circle cx="18" cy="12" r="4"/>
    <path d="M10 12h4"/>
  </svg>
)

export const AudioIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="12" height="8" rx="2"/>
    <circle cx="16" cy="12" r="4"/>
    <path d="M4 12H2"/>
  </svg>
)

export const LightIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
    <path d="M12 2v2M6 6l-1.5 1.5M18 6l1.5 1.5M5 12H3M21 12h-2"/>
    <path d="M12 4a6 6 0 016 6v6H6v-6a6 6 0 016-6z"/>
  </svg>
)

export const InteriorIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 18v-8a2 2 0 012-2h10a2 2 0 012 2v8"/>
    <path d="M4 18h16"/>
    <path d="M7 10V8a2 2 0 012-2h6a2 2 0 012 2v2"/>
  </svg>
)

export const ExteriorIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10h16v10H4z"/>
    <path d="M6 10V8a3 3 0 013-3h6a3 3 0 013 3v2"/>
    <path d="M8 14h8"/>
  </svg>
)

export const ToolIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
)

export const SecurityIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <circle cx="12" cy="11" r="2"/>
  </svg>
)

// Mapa de iconos por categoría
export const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
  frenos: BrakeIcon,
  filtros: FilterIcon,
  bateria: BatteryIcon,
  aceites: OilIcon,
  bujias: SparkPlugIcon,
  neumaticos: TireIcon,
  parabrisas: WiperIcon,
  suspension: SuspensionIcon,
  enfriamiento: CoolingIcon,
  motor: EngineIcon,
  sensores: SensorIcon,
  escape: ExhaustIcon,
  direccion: SteeringIcon,
  transmision: TransmissionIcon,
  audio: AudioIcon,
  iluminacion: LightIcon,
  interior: InteriorIcon,
  exterior: ExteriorIcon,
  herramientas: ToolIcon,
  seguridad: SecurityIcon,
}
