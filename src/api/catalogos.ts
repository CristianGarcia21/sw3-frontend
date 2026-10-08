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

/** Cuerpo de POST /categorias */
export interface NuevaCategoria {
  areaId: number
  nombre: string
  descripcion?: string
}

/** POST /categorias (solo ADMINISTRADOR) */
export function crearCategoria(datos: NuevaCategoria) {
  return api<Categoria>('/categorias', { method: 'POST', body: datos })
}

/** PUT /categorias/:id (solo ADMINISTRADOR). No cambia el área; sin descripción queda vacía */
export function editarCategoria(id: number, datos: { nombre: string; descripcion?: string }) {
  return api<Categoria>(`/categorias/${id}`, { method: 'PUT', body: datos })
}

/** PATCH /categorias/:id/activa (solo ADMINISTRADOR). Los casos viejos conservan la categoría */
export function cambiarActivaCategoria(id: number, activa: boolean) {
  return api<Categoria>(`/categorias/${id}/activa`, { method: 'PATCH', body: { activa } })
}

/** DELETE /categorias/:id (solo ADMINISTRADOR). Con casos responde 409 CATEGORIA_CON_CASOS */
export function eliminarCategoria(id: number) {
  return api<void>(`/categorias/${id}`, { method: 'DELETE' })
}
