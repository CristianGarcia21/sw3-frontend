import type { Usuario } from '../types'
import { api } from './client'

/** GET /usuarios: usuarios de prueba activos (no requiere X-Usuario-Id) */
export function listarUsuarios() {
  return api<Usuario[]>('/usuarios')
}
