import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ApiError } from '../api/client'
import { obtenerCaso } from '../api/casos'
import { Mensaje } from '../components/Mensaje'
import { AccionesEstado } from '../components/detalle/AccionesEstado'
import { CabeceraCaso } from '../components/detalle/CabeceraCaso'
import { DatosCaso } from '../components/detalle/DatosCaso'
import { LineaTiempo } from '../components/detalle/LineaTiempo'
import { PanelAsignacion } from '../components/detalle/PanelAsignacion'
import { PanelAtencion } from '../components/detalle/PanelAtencion'
import { PanelReclasificacion } from '../components/detalle/PanelReclasificacion'
import { PanelValidacion } from '../components/detalle/PanelValidacion'
import { Esqueleto, EstadoVacio, Tarjeta } from '../components/ui'
import { useUsuarioActual } from '../hooks/useUsuarioActual'
import type { Caso } from '../types'
import { MENU_POR_ROL, rutaInicial } from '../utils/navegacion'

interface Cargado<T> {
  usuarioId: number | undefined
  casoId: number
  intento: number
  valor: T
}

function idValido(valor: string | undefined): number | null {
  if (!valor) return null
  const id = Number(valor)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export function DetalleCaso() {
  const { id } = useParams()
  const casoId = idValido(id)
  const { usuario } = useUsuarioActual()
  const usuarioId = usuario?.id
  const [resultado, setResultado] = useState<Cargado<Caso | null> | null>(null)
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

  const resultadoActual =
    resultado && resultado.usuarioId === usuarioId && resultado.casoId === casoId && resultado.intento === intento
      ? resultado.valor
      : undefined
  const errorActual =
    error && error.usuarioId === usuarioId && error.casoId === casoId && error.intento === intento ? error.valor : null

  function reintentar() {
    setIntento((n) => n + 1)
  }

  const rutaDeVuelta = usuario ? rutaInicial(usuario.rol) : '/'
  const textoDeVuelta = usuario ? MENU_POR_ROL[usuario.rol][0].texto.toLowerCase() : 'inicio'

  function actualizarCaso(caso: Caso) {
    if (casoId === null) return
    setResultado({ usuarioId, casoId, intento, valor: caso })
  }

  if (casoId === null || resultadoActual === null) {
    return (
      <Tarjeta>
        <EstadoVacio
          icono="buscar"
          titulo="Caso no encontrado"
          accion={
            <Link
              to={rutaDeVuelta}
              className="inline-flex min-h-9 items-center rounded-full px-4 text-[13px] font-medium text-acento outline-none transition-colors hover:bg-relleno focus-visible:ring-2 focus-visible:ring-acento"
            >
              Volver a {textoDeVuelta}
            </Link>
          }
        >
          No existe un caso con ese número.
        </EstadoVacio>
      </Tarjeta>
    )
  }

  if (resultadoActual === undefined && !errorActual) {
    return (
      <Tarjeta className="p-5 sm:p-6">
        <Esqueleto lineas={7} />
      </Tarjeta>
    )
  }

  if (errorActual) {
    return (
      <Mensaje tipo="error" titulo="No se pudo cargar el caso" accion={{ texto: 'Reintentar', onClick: reintentar }}>
        {errorActual.mensaje}
      </Mensaje>
    )
  }

  if (!resultadoActual) return null

  return (
    <section className="flex flex-col gap-5">
      <CabeceraCaso caso={resultadoActual} />
      <DatosCaso caso={resultadoActual} />
      <AccionesEstado caso={resultadoActual} onCasoActualizado={actualizarCaso} />
      <PanelAsignacion />
      <PanelReclasificacion caso={resultadoActual} onCasoActualizado={actualizarCaso} />
      <PanelAtencion />
      <PanelValidacion />
      <LineaTiempo />
    </section>
  )
}
