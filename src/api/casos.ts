import type { Caso, EstadoCaso, NuevoCaso, Prioridad, TipoCaso } from '../types'
import { api } from './client'

export type { NuevoCaso } from '../types'

/** POST /casos (solo SOLICITANTE) */
export function registrarCaso(datos: NuevoCaso) {
  return api<Caso>('/casos', { method: 'POST', body: datos })
}

/** Obtiene un caso desde GET /casos; cuando exista GET /casos/:id, solo cambiará esta función */
export async function obtenerCaso(id: number): Promise<Caso | null> {
  const casos = await api<Caso[]>('/casos')
  return casos.find((caso) => caso.id === id) ?? null
}

/** PATCH /casos/:id/estado (transiciones manuales del agente) */
export function cambiarEstado(id: number, estado: EstadoCaso): Promise<Caso> {
  return api<Caso>(`/casos/${id}/estado`, { method: 'PATCH', body: { estado } })
}

/** PATCH /casos/:id/asignar (solo AGENTE). Para asignarse a sí mismo se manda el propio id */
export function asignarCaso(id: number, agenteId: number): Promise<Caso> {
  return api<Caso>(`/casos/${id}/asignar`, { method: 'PATCH', body: { agenteId } })
}

/** Cuerpo de PATCH /casos/:id/clasificacion. areaId y categoriaId van juntos (RN-03) */
export interface CambiosClasificacion {
  tipo?: TipoCaso
  prioridad?: Prioridad
  areaId?: number
  categoriaId?: number
}

/** PATCH /casos/:id/clasificacion (solo AGENTE, en Pendiente o En análisis: RN-08) */
export function reclasificarCaso(id: number, cambios: CambiosClasificacion): Promise<Caso> {
  return api<Caso>(`/casos/${id}/clasificacion`, { method: 'PATCH', body: cambios })
}

/** Parámetros de GET /casos. Cada tarea agrega los que implemente el backend (ver docs/03-api.md) */
export interface FiltrosCasos {
  orden?: 'fecha_desc' | 'prioridad'
  abiertos?: boolean
  agenteId?: number
  sinAgente?: boolean
  /** Varios valores viajan separados por coma (estado=PENDIENTE,EN_ANALISIS) */
  estado?: EstadoCaso[]
  tipo?: TipoCaso[]
  prioridad?: Prioridad[]
  areaId?: number
  categoriaId?: number
  /** Texto que se busca en el título */
  q?: string
}

/** GET /casos: a un SOLICITANTE el backend solo le devuelve sus casos */
export function listarCasos(filtros: FiltrosCasos = {}) {
  const query: Record<string, string | number | boolean | undefined> = {}
  for (const [clave, valor] of Object.entries(filtros)) query[clave] = Array.isArray(valor) ? valor.join(',') : valor
  return api<Caso[]>('/casos', { query })
}
