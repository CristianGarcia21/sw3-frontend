import type { EstadoCaso, EventoHistorial, Prioridad, Rol, TipoCaso } from '../types'

// Textos legibles para los valores fijos de la API. Nunca mostrar el valor del enum en pantalla.

export const ETIQUETA_ESTADO: Record<EstadoCaso, string> = {
  PENDIENTE: 'Pendiente',
  EN_ANALISIS: 'En análisis',
  EN_ATENCION: 'En atención',
  EN_VALIDACION: 'En validación',
  CERRADA: 'Cerrada',
}

export const ETIQUETA_TIPO: Record<TipoCaso, string> = {
  INCIDENTE: 'Incidente',
  SOLICITUD: 'Solicitud de servicio',
}

export const ETIQUETA_PRIORIDAD: Record<Prioridad, string> = {
  P1: 'P1 · Urgente',
  P2: 'P2 · Normal',
  P3: 'P3 · Baja',
}

export const ETIQUETA_ROL: Record<Rol, string> = {
  SOLICITANTE: 'Solicitante',
  AGENTE: 'Agente',
  VALIDADOR: 'Validador',
  ADMINISTRADOR: 'Administrador',
}

export const ETIQUETA_EVENTO: Record<EventoHistorial, string> = {
  CREACION: 'Registro del caso',
  RECLASIFICACION: 'Reclasificación',
  ASIGNACION: 'Asignación',
  CAMBIO_ESTADO: 'Cambio de estado',
  ATENCION: 'Atención registrada',
  APROBACION: 'Aprobación',
  DEVOLUCION: 'Devolución',
}

/** Orden del flujo, útil para gráficos y listas */
export const ESTADOS: EstadoCaso[] = ['PENDIENTE', 'EN_ANALISIS', 'EN_ATENCION', 'EN_VALIDACION', 'CERRADA']
export const TIPOS: TipoCaso[] = ['INCIDENTE', 'SOLICITUD']
export const PRIORIDADES: Prioridad[] = ['P1', 'P2', 'P3']

const formatoFecha = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' })

/** "30 sept 2026, 2:20 p. m." — acepta la fecha ISO que envía la API */
export function formatearFecha(fecha: string | null | undefined): string {
  if (!fecha) return '—'
  const d = new Date(fecha)
  return Number.isNaN(d.getTime()) ? '—' : formatoFecha.format(d)
}

// Corto para minutos y horas ("hace 3 h") y largo para días ("hace 2 días"), que en corto queda "hace 2 d"
const relativoCorto = new Intl.RelativeTimeFormat('es', { numeric: 'always', style: 'short' })
const relativoLargo = new Intl.RelativeTimeFormat('es', { numeric: 'always', style: 'long' })

/** "hace 3 h", "hace 2 días" — cuánto tiempo pasó desde la fecha ISO que envía la API */
export function formatearAntiguedad(fecha: string | null | undefined, ahora: number = Date.now()): string {
  if (!fecha) return '—'
  const d = new Date(fecha).getTime()
  if (Number.isNaN(d)) return '—'
  const minutos = Math.max(0, Math.floor((ahora - d) / 60_000))
  if (minutos < 1) return 'ahora'
  if (minutos < 60) return relativoCorto.format(-minutos, 'minute')
  const horas = Math.floor(minutos / 60)
  if (horas < 24) return relativoCorto.format(-horas, 'hour')
  return relativoLargo.format(-Math.floor(horas / 24), 'day')
}
