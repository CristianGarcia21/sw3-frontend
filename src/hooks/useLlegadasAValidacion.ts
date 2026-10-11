import { useEffect, useState } from 'react'
import { obtenerHistorial } from '../api/casos'
import type { Caso } from '../types'
import { fechaLlegadaAValidacion } from './useHistorial'
import { useUsuarioActual } from './useUsuarioActual'

/**
 * Fecha en que cada caso entró a En validación, por id. El objeto Caso no la trae: se pide el historial
 * de cada caso (GET /casos/:id/historial). Un caso cuyo historial falla queda en null y la pantalla muestra "—".
 */
export function useLlegadasAValidacion(casos: Caso[] | null): Record<number, string | null> {
  const { usuario } = useUsuarioActual()
  const ids = casos?.map((caso) => caso.id).join(',') ?? ''
  const clave = `${usuario?.id ?? ''}|${ids}`
  const [resultado, setResultado] = useState<{ clave: string; fechas: Record<number, string | null> } | null>(null)

  useEffect(() => {
    if (!ids) return
    let cancelado = false
    const lista = ids.split(',').map(Number)
    Promise.allSettled(lista.map((id) => obtenerHistorial(id))).then((respuestas) => {
      if (cancelado) return
      const fechas: Record<number, string | null> = {}
      respuestas.forEach((respuesta, i) => {
        fechas[lista[i]] = respuesta.status === 'fulfilled' ? fechaLlegadaAValidacion(respuesta.value) : null
      })
      setResultado({ clave, fechas })
    })
    return () => {
      cancelado = true
    }
  }, [clave, ids])

  return resultado?.clave === clave ? resultado.fechas : {}
}
