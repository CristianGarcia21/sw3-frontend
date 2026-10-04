import type { Area, Categoria } from '../types'
import { api } from './client'

/** GET /areas: áreas activas */
export function listarAreas() {
  return api<Area[]>('/areas')
}

export const getAreas = listarAreas

/** GET /categorias: sin filtros devuelve activas e inactivas de todas las áreas */
export function listarCategorias(filtros: { areaId?: number; activa?: boolean } = {}) {
  return api<Categoria[]>('/categorias', { query: filtros })
}

/** GET /categorias?areaId=&activa=true: categorías activas de un área */
export function getCategorias(areaId: number) {
  return listarCategorias({ areaId, activa: true })
}
