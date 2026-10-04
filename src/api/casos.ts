import type { Caso, EstadoCaso, NuevoCaso } from '../types'
import { api } from './client'

export type { NuevoCaso } from '../types'

/** POST /casos (solo SOLICITANTE) */
export function registrarCaso(datos: NuevoCaso) {
  return api<Caso>('/casos', { method: 'POST', body: datos })
}

export const crearCaso = registrarCaso

/** Parámetros de GET /casos. Cada tarea agrega los que implemente el backend (ver docs/03-api.md) */
export interface FiltrosCasos {
  orden?: 'fecha_desc' | 'prioridad'
  abiertos?: boolean
  agenteId?: number
  sinAgente?: boolean
  estado?: EstadoCaso
}

/** GET /casos: a un SOLICITANTE el backend solo le devuelve sus casos */
export function listarCasos(filtros: FiltrosCasos = {}) {
  return api<Caso[]>('/casos', { query: { ...filtros } })
}
