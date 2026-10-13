import type { FiltrosCasos } from '../api/casos'
import type { EstadoCaso, Prioridad, TipoCaso } from '../types'
import { ESTADOS, PRIORIDADES, TIPOS } from './etiquetas'

// Filtros de la bandeja (HU-09) tal como viven en la URL: /bandeja?tipo=INCIDENTE&prioridad=P1,P2&areaId=3

export interface FiltrosUrl {
  estado: EstadoCaso[]
  tipo: TipoCaso[]
  prioridad: Prioridad[]
  areaId: number | null
  categoriaId: number | null
  q: string
}

/** Parámetros que borra "Limpiar". La pestaña (`vista`) no es un filtro y se conserva */
export const PARAMETROS_FILTRO = ['estado', 'tipo', 'prioridad', 'areaId', 'categoriaId', 'q'] as const

/** Lee una lista "A,B" (o repetida: ?x=A&x=B) y descarta lo que no es un valor válido, para no pedirle al backend algo que responde 400 */
function lista<T extends string>(parametros: URLSearchParams, nombre: string, validos: readonly T[]): T[] {
  const valores = parametros.getAll(nombre).flatMap((v) => v.split(','))
  return validos.filter((v) => valores.includes(v))
}

function id(parametros: URLSearchParams, nombre: string): number | null {
  const n = Number(parametros.get(nombre))
  return Number.isSafeInteger(n) && n > 0 ? n : null
}

export function leerFiltros(parametros: URLSearchParams): FiltrosUrl {
  const areaId = id(parametros, 'areaId')
  return {
    estado: lista(parametros, 'estado', ESTADOS),
    tipo: lista(parametros, 'tipo', TIPOS),
    prioridad: lista(parametros, 'prioridad', PRIORIDADES),
    areaId,
    // La categoría depende del área: sin área no se filtra por categoría
    categoriaId: areaId === null ? null : id(parametros, 'categoriaId'),
    q: (parametros.get('q') ?? '').trim().slice(0, 180),
  }
}

export function hayFiltros(f: FiltrosUrl): boolean {
  return f.estado.length > 0 || f.tipo.length > 0 || f.prioridad.length > 0 || f.areaId !== null || f.q !== ''
}

/** Los filtros como parámetros de GET /casos. Lo vacío no se envía */
export function aConsulta(f: FiltrosUrl): FiltrosCasos {
  const consulta: FiltrosCasos = {}
  if (f.estado.length > 0) consulta.estado = f.estado
  if (f.tipo.length > 0) consulta.tipo = f.tipo
  if (f.prioridad.length > 0) consulta.prioridad = f.prioridad
  if (f.areaId !== null) consulta.areaId = f.areaId
  if (f.categoriaId !== null) consulta.categoriaId = f.categoriaId
  if (f.q) consulta.q = f.q
  return consulta
}

/** Escribe un cambio de filtros en los parámetros, sin tocar los demás (como `vista`) */
export function escribirFiltros(actuales: URLSearchParams, cambios: Partial<FiltrosUrl>): URLSearchParams {
  const siguientes = new URLSearchParams(actuales)
  for (const [nombre, valor] of Object.entries(cambios)) {
    const texto = Array.isArray(valor) ? valor.join(',') : valor === null || valor === undefined ? '' : String(valor).trim()
    if (texto) siguientes.set(nombre, texto)
    else siguientes.delete(nombre)
  }
  return siguientes
}

export function limpiarFiltros(actuales: URLSearchParams): URLSearchParams {
  const siguientes = new URLSearchParams(actuales)
  for (const nombre of PARAMETROS_FILTRO) siguientes.delete(nombre)
  return siguientes
}
