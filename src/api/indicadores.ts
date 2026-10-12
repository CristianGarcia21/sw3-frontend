import type { Indicadores } from '../types'
import { api } from './client'

/** Rango opcional de GET /indicadores: días YYYY-MM-DD (UTC), ambos incluidos */
export interface RangoFechas {
  desde?: string
  hasta?: string
}

/** GET /indicadores (solo ADMINISTRADOR). Sin rango devuelve todos los datos */
export function obtenerIndicadores(rango: RangoFechas = {}) {
  return api<Indicadores>('/indicadores', { query: { ...rango } })
}
