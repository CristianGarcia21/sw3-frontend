import type { EstadoCaso, Prioridad } from '../types'

// Colores para gráficos (HU-10) y puntos de estado. Apuntan a los tokens de index.css, así cambian solos con el tema

export const COLOR_ESTADO: Record<EstadoCaso, string> = {
  PENDIENTE: 'var(--estado-pendiente)',
  EN_ANALISIS: 'var(--estado-en-analisis)',
  EN_ATENCION: 'var(--estado-en-atencion)',
  EN_VALIDACION: 'var(--estado-en-validacion)',
  CERRADA: 'var(--estado-cerrada)',
}

export const COLOR_PRIORIDAD: Record<Prioridad, string> = {
  P1: 'var(--urgente)',
  P2: 'var(--estado-en-analisis)',
  P3: 'var(--estado-pendiente)',
}
