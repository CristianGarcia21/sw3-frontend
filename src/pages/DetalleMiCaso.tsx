import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ApiError } from '../api/client'
import { obtenerCaso } from '../api/casos'
import { LineaTiempo } from '../components/LineaTiempo'
import { Mensaje } from '../components/Mensaje'
import { CabeceraCaso } from '../components/detalle/CabeceraCaso'
import { DatosCaso } from '../components/detalle/DatosCaso'
import { SolucionCaso } from '../components/detalle/SolucionCaso'
import { Esqueleto, EstadoVacio, Tarjeta, type NombreIcono } from '../components/ui'
import { useUsuarioActual } from '../hooks/useUsuarioActual'
import type { CasoDetalle } from '../types'
import { idDeRuta, RUTAS } from '../utils/navegacion'

// Lo cargado queda marcado con la consulta que lo pidió: al cambiar de usuario en el selector
// no se muestra el caso del anterior mientras llega la respuesta para el nuevo
interface Cargado<T> {
  usuarioId: number | undefined
  casoId: number
  intento: number
  valor: T
}

/** HU-12: detalle de un caso propio con su solución e historial. El solicitante solo consulta, no hay acciones */
export function DetalleMiCaso() {
  const { id } = useParams()
  const casoId = idDeRuta(id)
  const { usuario } = useUsuarioActual()
  const usuarioId = usuario?.id
  const [resultado, setResultado] = useState<Cargado<CasoDetalle> | null>(null)
  const [error, setError] = useState<Cargado<ApiError> | null>(null)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    if (casoId === null) return
    let cancelado = false
    obtenerCaso(casoId)
      .then((caso) => {
        if (cancelado) return
        setResultado({ usuarioId, casoId, intento, valor: caso })
        setError(null)
      })
      .catch((e: unknown) => {
        if (cancelado) return
        const fallo = e instanceof ApiError ? e : new ApiError(0, 'ERROR_INTERNO', 'No se pudo cargar el caso')
        setError({ usuarioId, casoId, intento, valor: fallo })
      })
    return () => {
      cancelado = true
    }
  }, [casoId, intento, usuarioId])

  const esActual = (cargado: Cargado<unknown> | null) =>
    cargado !== null && cargado.usuarioId === usuarioId && cargado.casoId === casoId && cargado.intento === intento
  const caso = resultado && esActual(resultado) ? resultado.valor : null
  const fallo = error && esActual(error) ? error.valor : null

  // Un id que no es número (400 VALIDACION) se trata igual que uno que no existe (404)
  if (casoId === null || fallo?.error === 'NO_ENCONTRADO' || fallo?.error === 'VALIDACION') {
    return (
      <SinAcceso icono="buscar" titulo="Caso no encontrado">
        No existe un caso con ese número.
      </SinAcceso>
    )
  }

  // RN-20: el solicitante solo ve sus casos
  if (fallo?.error === 'CASO_AJENO') {
    return (
      <SinAcceso icono="usuario" titulo="Este caso no es tuyo">
        Solo puedes ver los casos que registraste.
      </SinAcceso>
    )
  }

  if (fallo) {
    return (
      <Mensaje tipo="error" titulo="No se pudo cargar el caso" accion={{ texto: 'Reintentar', onClick: () => setIntento((n) => n + 1) }}>
        {fallo.mensaje}
      </Mensaje>
    )
  }

  if (!caso) {
    return (
      <Tarjeta className="p-5 sm:p-6">
        <Esqueleto lineas={7} />
      </Tarjeta>
    )
  }

  return (
    <section className="flex flex-col gap-5">
      <CabeceraCaso caso={caso} />
      <DatosCaso caso={caso} paraSolicitante />
      <SolucionCaso caso={caso} />
      <LineaTiempo casoId={caso.id} compacta />
    </section>
  )
}

interface PropsSinAcceso {
  icono: NombreIcono
  titulo: string
  children: string
}

/** El caso no existe o no es del solicitante: se explica y se ofrece volver a Mis casos */
function SinAcceso({ icono, titulo, children }: PropsSinAcceso) {
  return (
    <Tarjeta>
      <EstadoVacio
        icono={icono}
        titulo={titulo}
        accion={
          <Link
            to={RUTAS.misCasos}
            className="inline-flex min-h-9 items-center rounded-full px-4 text-[13px] font-medium text-acento outline-none transition-colors hover:bg-relleno focus-visible:ring-2 focus-visible:ring-acento"
          >
            Volver a Mis casos
          </Link>
        }
      >
        {children}
      </EstadoVacio>
    </Tarjeta>
  )
}
