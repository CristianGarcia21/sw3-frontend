import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ApiError } from '../api/client'
import { obtenerCaso } from '../api/casos'
import { LineaTiempo } from '../components/LineaTiempo'
import { Mensaje } from '../components/Mensaje'
import { AccionesEstado } from '../components/detalle/AccionesEstado'
import { CabeceraCaso } from '../components/detalle/CabeceraCaso'
import { DatosCaso } from '../components/detalle/DatosCaso'
import { PanelAsignacion } from '../components/detalle/PanelAsignacion'
import { PanelAtencion } from '../components/detalle/PanelAtencion'
import { PanelReclasificacion } from '../components/detalle/PanelReclasificacion'
import { PanelValidacion } from '../components/detalle/PanelValidacion'
import { Esqueleto, EstadoVacio, Tarjeta } from '../components/ui'
import { tieneSolucionVigente, useHistorial } from '../hooks/useHistorial'
import { useUsuarioActual } from '../hooks/useUsuarioActual'
import type { Atencion, Caso, CasoDetalle } from '../types'
import { idDeRuta, MENU_POR_ROL, rutaInicial } from '../utils/navegacion'

interface Cargado<T> {
  usuarioId: number | undefined
  casoId: number
  intento: number
  valor: T
}

export function DetalleCaso() {
  const { id } = useParams()
  const casoId = idDeRuta(id)
  const { usuario } = useUsuarioActual()
  const usuarioId = usuario?.id
  const [resultado, setResultado] = useState<Cargado<CasoDetalle> | null>(null)
  const [error, setError] = useState<Cargado<ApiError> | null>(null)
  const [intento, setIntento] = useState(0)
  // Sube con cada acción sobre el caso para que la línea de tiempo traiga el evento nuevo
  const [version, setVersion] = useState(0)
  const eventos = useHistorial(casoId ?? 0, version)

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

  // Las acciones responden con el Caso sin atenciones: se conservan las que ya estaban
  function actualizarCaso(caso: Caso) {
    if (casoId === null || !resultadoActual) return
    setResultado({ usuarioId, casoId, intento, valor: { ...resultadoActual, ...caso } })
    setVersion((v) => v + 1)
  }

  // La atención nueva pasa a ser la solución vigente (la lista va de la más reciente a la más antigua)
  function agregarAtencion(atencion: Atencion) {
    if (casoId === null || !resultadoActual) return
    const atenciones = [atencion, ...resultadoActual.atenciones]
    setResultado({ usuarioId, casoId, intento, valor: { ...resultadoActual, atenciones, solucionVigente: atencion } })
    setVersion((v) => v + 1)
  }

  // Un id que no es número (400 VALIDACION) se trata igual que uno que no existe
  const noEncontrado = errorActual?.error === 'NO_ENCONTRADO' || errorActual?.error === 'VALIDACION'

  if (casoId === null || noEncontrado) {
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
      <AccionesEstado caso={resultadoActual} onCasoActualizado={actualizarCaso} sinSolucion={!eventos || !tieneSolucionVigente(eventos)} />
      <PanelAsignacion caso={resultadoActual} onCasoActualizado={actualizarCaso} onRecargar={reintentar} />
      <PanelReclasificacion caso={resultadoActual} onCasoActualizado={actualizarCaso} />
      <PanelAtencion key={resultadoActual.id} caso={resultadoActual} eventos={eventos} onAtencionRegistrada={agregarAtencion} />
      <PanelValidacion caso={resultadoActual} eventos={eventos} onRecargar={reintentar} />
      <LineaTiempo casoId={resultadoActual.id} version={version} />
    </section>
  )
}
