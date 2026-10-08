import { useState } from 'react'
import { ApiError } from '../api/client'
import { asignarCaso } from '../api/casos'
import type { Caso, UsuarioResumen } from '../types'
import { useAvisos } from './useAvisos'

/**
 * HU-04: asigna un caso y cuenta el resultado con un aviso.
 * Lo usan la bandeja (Asignarme) y el panel del detalle, para que se comporten igual.
 */
export function useAsignarCaso() {
  const avisos = useAvisos()
  // id del caso que se está asignando, para mostrar la carga solo en su botón
  const [asignando, setAsignando] = useState<number | null>(null)

  /** Devuelve el caso actualizado, o null si falló (el aviso de error ya se mostró) */
  async function asignar(caso: Caso, agente: UsuarioResumen): Promise<Caso | null> {
    setAsignando(caso.id)
    try {
      const actualizado = await asignarCaso(caso.id, agente.id)
      avisos.exito(`Caso asignado a ${agente.nombre}`, `#${caso.id} · ${caso.titulo}`)
      return actualizado
    } catch (e: unknown) {
      // El mensaje del backend ya explica la regla (RN-18, RN-19, caso cerrado…)
      avisos.error('No se pudo asignar el caso', e instanceof ApiError ? e.mensaje : 'Ocurrió un error inesperado al asignar el caso.')
      return null
    } finally {
      setAsignando(null)
    }
  }

  return { asignar, asignando }
}
