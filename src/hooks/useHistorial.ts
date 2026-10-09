import { useEffect, useState } from 'react'
import { obtenerHistorial } from '../api/casos'
import type { EventoHistorialItem } from '../types'
import { useUsuarioActual } from './useUsuarioActual'

/**
 * Eventos del caso del más viejo al más nuevo, o null mientras cargan o si fallan.
 * `version` cambia después de cada acción para volver a pedirlos. La línea de tiempo maneja su propio error.
 */
export function useHistorial(casoId: number, version = 0): EventoHistorialItem[] | null {
  const { usuario } = useUsuarioActual()
  const clave = `${usuario?.id ?? ''}|${casoId}`
  const [resultado, setResultado] = useState<{ clave: string; eventos: EventoHistorialItem[] } | null>(null)

  useEffect(() => {
    if (casoId <= 0) return
    let cancelado = false
    obtenerHistorial(casoId)
      .then((eventos) => {
        if (cancelado) return
        const ordenados = [...eventos].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime() || a.id - b.id)
        setResultado({ clave, eventos: ordenados })
      })
      .catch(() => {
        // Sin historial no se muestra el aviso de devolución; el backend sigue validando RN-13
      })
    return () => {
      cancelado = true
    }
  }, [clave, casoId, version])

  return resultado?.clave === clave ? resultado.eventos : null
}

/** La última devolución, si no hubo una atención después (el agente todavía debe corregir) */
export function devolucionPendiente(eventos: EventoHistorialItem[]): EventoHistorialItem | null {
  const ultimo = [...eventos].reverse().find((e) => e.evento === 'DEVOLUCION' || e.evento === 'ATENCION')
  return ultimo?.evento === 'DEVOLUCION' ? ultimo : null
}

/** RN-13: hay una atención registrada después de la última devolución */
export function tieneSolucionVigente(eventos: EventoHistorialItem[]): boolean {
  const ultimo = [...eventos].reverse().find((e) => e.evento === 'DEVOLUCION' || e.evento === 'ATENCION')
  return ultimo?.evento === 'ATENCION'
}
