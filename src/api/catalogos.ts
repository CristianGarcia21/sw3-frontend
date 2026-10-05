import type { Area, Categoria } from '../types'

import { api } from './client'

/** GET /areas: áreas activas */
export function listarAreas() {
  return api<Area[]>('/areas')
}

/** GET /categorias: sin filtros devuelve activas e inactivas de todas las áreas */
export function listarCategorias(
  filtros: { areaId?: number; activa?: boolean } = {}
) {
  return api<Categoria[]>('/categorias', { query: filtros })
}