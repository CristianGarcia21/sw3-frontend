import { createContext } from 'react'
import type { ApiError } from '../api/client'
import type { Usuario } from '../types'

export interface UsuarioActualValor {
  /** Usuarios de prueba activos (GET /usuarios) */
  usuarios: Usuario[]
  /** Usuario elegido en el selector, o null si no hay ninguno */
  usuario: Usuario | null
  cargando: boolean
  error: ApiError | null
  seleccionar: (id: number | null) => void
  recargar: () => void
}

export const UsuarioActualContext = createContext<UsuarioActualValor | null>(null)
