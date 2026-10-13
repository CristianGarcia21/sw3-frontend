import type { CodigoError, DetalleError } from '../types'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api').replace(/\/$/, '')

/** Clave de localStorage donde se guarda el usuario de prueba elegido */
export const CLAVE_USUARIO = 'campushelp.usuarioId'

export function leerUsuarioGuardado(): number | null {
  try {
    const valor = localStorage.getItem(CLAVE_USUARIO)
    const id = valor ? Number(valor) : NaN
    return Number.isInteger(id) && id > 0 ? id : null
  } catch {
    return null
  }
}

export function guardarUsuario(id: number | null) {
  try {
    if (id === null) localStorage.removeItem(CLAVE_USUARIO)
    else localStorage.setItem(CLAVE_USUARIO, String(id))
  } catch {
    // Sin localStorage (modo privado) la app funciona igual, solo no recuerda el usuario
  }
}

/** Error de la API con la forma { error, mensaje, detalles } de docs/03-api.md */
export class ApiError extends Error {
  status: number
  error: CodigoError
  mensaje: string
  detalles: DetalleError[]

  constructor(status: number, error: CodigoError, mensaje: string, detalles: DetalleError[] = []) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.error = error
    this.mensaje = mensaje
    this.detalles = detalles
  }

  /** Mensaje de un campo concreto cuando la API responde 400 VALIDACION */
  detalleDe(campo: string): string | undefined {
    return this.detalles.find((d) => d.campo === campo)?.mensaje
  }
}

type Query = Record<string, string | number | boolean | undefined | null>

interface OpcionesApi extends Omit<RequestInit, 'body'> {
  body?: unknown
  query?: Query
}

function construirUrl(ruta: string, query?: Query) {
  const url = new URL(API_URL + (ruta.startsWith('/') ? ruta : `/${ruta}`))
  for (const [clave, valor] of Object.entries(query ?? {})) {
    if (valor !== undefined && valor !== null && valor !== '') url.searchParams.set(clave, String(valor))
  }
  return url.toString()
}

/**
 * Llama a la API de sw3-backend.
 * Agrega X-Usuario-Id del usuario de prueba actual y lanza ApiError si la respuesta no es 2xx.
 */
export async function api<T>(ruta: string, { body, query, headers, ...opciones }: OpcionesApi = {}): Promise<T> {
  const usuarioId = leerUsuarioGuardado()
  const cabeceras = new Headers(headers)
  if (body !== undefined) cabeceras.set('Content-Type', 'application/json')
  if (usuarioId !== null) cabeceras.set('X-Usuario-Id', String(usuarioId))

  let respuesta: Response
  try {
    respuesta = await fetch(construirUrl(ruta, query), {
      ...opciones,
      headers: cabeceras,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    // SIN_CONEXION no viene del backend: lo usa el front cuando la API no responde
    throw new ApiError(0, 'SIN_CONEXION', 'No se pudo conectar con el servidor. Revisa que el backend esté corriendo.')
  }

  if (respuesta.status === 204) return undefined as T

  const datos: unknown = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    const e = (datos ?? {}) as Partial<{ error: CodigoError; mensaje: string; detalles: DetalleError[] }>
    throw new ApiError(
      respuesta.status,
      e.error ?? 'ERROR_INTERNO',
      e.mensaje ?? `Error ${respuesta.status} al llamar a la API`,
      e.detalles ?? [],
    )
  }

  return datos as T
}
