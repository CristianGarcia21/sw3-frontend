import { useEffect, useState } from 'react'
import { ApiError } from '../api/client'
import { listarCasos, type FiltrosCasos } from '../api/casos'
import type { Caso } from '../types'
import { useUsuarioActual } from './useUsuarioActual'

// Lo cargado queda marcado con la consulta que lo pidió (usuario y filtros): al cambiar de usuario
// o de pestaña no se muestran los casos anteriores mientras llegan los nuevos
interface Cargado<T> {
  clave: string
  valor: T
}

/**
 * Carga GET /casos con los filtros dados y la vuelve a pedir al cambiar el usuario de prueba o los filtros.
 * `casos` es null mientras llega la primera respuesta de esa consulta.
 */
export function useCasos(filtros: FiltrosCasos) {
  const { usuario } = useUsuarioActual()
  const consulta = JSON.stringify(filtros)
  const clave = `${usuario?.id ?? ''}|${consulta}`
  const [resultado, setResultado] = useState<Cargado<Caso[]> | null>(null)
  const [error, setError] = useState<Cargado<ApiError> | null>(null)
  const [actualizando, setActualizando] = useState(false)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let cancelado = false
    listarCasos(JSON.parse(consulta) as FiltrosCasos)
      .then((casos) => {
        if (cancelado) return
        setResultado({ clave, valor: casos })
        setError(null)
      })
      .catch((e: unknown) => {
        if (cancelado) return
        setError({ clave, valor: e instanceof ApiError ? e : new ApiError(0, 'ERROR_INTERNO', 'No se pudieron cargar los casos') })
      })
      .finally(() => {
        if (!cancelado) setActualizando(false)
      })
    return () => {
      cancelado = true
    }
  }, [clave, consulta, intento])

  const recargar = () => {
    setActualizando(true)
    setIntento((n) => n + 1)
  }

  return {
    casos: resultado?.clave === clave ? resultado.valor : null,
    error: error?.clave === clave ? error.valor : null,
    actualizando,
    recargar,
  }
}
