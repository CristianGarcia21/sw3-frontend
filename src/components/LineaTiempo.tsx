import { useEffect, useState, type CSSProperties } from 'react'
import { ApiError } from '../api/client'
import { obtenerHistorial } from '../api/casos'
import { useUsuarioActual } from '../hooks/useUsuarioActual'
import type { EventoHistorial, EventoHistorialItem } from '../types'
import { COLOR_ESTADO } from '../utils/colores'
import { ETIQUETA_ESTADO, ETIQUETA_ROL, formatearFecha } from '../utils/etiquetas'
import { Mensaje } from './Mensaje'
import { Esqueleto, EstadoVacio, Icono, Tarjeta, type NombreIcono } from './ui'

interface Props {
  casoId: number
  /** Cambia después de cada acción sobre el caso: la línea de tiempo se vuelve a pedir sin recargar la página */
  version?: number
  /** Versión resumida (detalle del solicitante, HU-12): menos espacio y sin los comentarios de reclasificación */
  compacta?: boolean
}

// Lo cargado queda marcado con la consulta que lo pidió, para no mostrar el historial de otro caso o de otro usuario
interface Cargado<T> {
  clave: string
  valor: T
}

const APARIENCIA: Record<EventoHistorial, { icono: NombreIcono; tono: string }> = {
  CREACION: { icono: 'mas', tono: 'var(--acento)' },
  ASIGNACION: { icono: 'usuario', tono: 'var(--acento)' },
  RECLASIFICACION: { icono: 'etiqueta', tono: 'var(--estado-pendiente)' },
  CAMBIO_ESTADO: { icono: 'flecha', tono: 'var(--estado-en-atencion)' },
  ATENCION: { icono: 'herramienta', tono: 'var(--estado-en-atencion)' },
  APROBACION: { icono: 'validar', tono: 'var(--estado-cerrada)' },
  DEVOLUCION: { icono: 'devolver', tono: 'var(--urgente)' },
}

/**
 * Texto legible del evento. En la asignación el backend manda el agente en el comentario:
 * "Asignado a X" o "Reasignado de X a Y".
 * Devuelve también si el comentario ya quedó dicho en el texto, para no repetirlo.
 */
function describir(evento: EventoHistorialItem): { texto: string; comentarioUsado: boolean } {
  const comentario = evento.comentario?.trim() ?? ''
  switch (evento.evento) {
    case 'CREACION':
      return { texto: 'Registró el caso', comentarioUsado: false }
    case 'ASIGNACION': {
      const reasignado = comentario.match(/^Reasignado de (.+) a (.+)$/)
      if (reasignado) return { texto: `Reasignó de ${reasignado[1]} a ${reasignado[2]}`, comentarioUsado: true }
      const nombre = comentario.match(/^Asignado a (.+)$/)?.[1]
      return nombre ? { texto: `Asignó a ${nombre}`, comentarioUsado: true } : { texto: 'Asignó el caso', comentarioUsado: false }
    }
    case 'CAMBIO_ESTADO':
      if (evento.estadoAnterior && evento.estadoNuevo) {
        return { texto: `Cambió de ${ETIQUETA_ESTADO[evento.estadoAnterior]} a ${ETIQUETA_ESTADO[evento.estadoNuevo]}`, comentarioUsado: false }
      }
      return { texto: 'Cambió el estado', comentarioUsado: false }
    case 'RECLASIFICACION':
      return { texto: 'Reclasificó el caso', comentarioUsado: false }
    case 'ATENCION':
      return { texto: 'Registró la atención', comentarioUsado: false }
    case 'APROBACION':
      return { texto: 'Aprobó y cerró', comentarioUsado: false }
    case 'DEVOLUCION':
      return { texto: 'Devolvió a atención', comentarioUsado: false }
  }
}

/**
 * HU-08: historial del caso, del más viejo al más nuevo.
 * Es independiente del detalle: lo usan el detalle del agente y el del solicitante (HU-12).
 */
export function LineaTiempo({ casoId, version = 0, compacta = false }: Props) {
  const { usuario } = useUsuarioActual()
  const clave = `${usuario?.id ?? ''}|${casoId}`
  const [resultado, setResultado] = useState<Cargado<EventoHistorialItem[]> | null>(null)
  const [error, setError] = useState<Cargado<ApiError> | null>(null)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let cancelado = false
    obtenerHistorial(casoId)
      .then((eventos) => {
        if (cancelado) return
        // Por si el backend no los ordena: el más viejo arriba
        const ordenados = [...eventos].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime() || a.id - b.id)
        setResultado({ clave, valor: ordenados })
        setError(null)
      })
      .catch((e: unknown) => {
        if (cancelado) return
        setError({ clave, valor: e instanceof ApiError ? e : new ApiError(0, 'ERROR_INTERNO', 'No se pudo cargar el historial') })
      })
    return () => {
      cancelado = true
    }
    // version no se lee aquí: solo provoca que se vuelva a pedir después de cada acción
  }, [clave, casoId, version, intento])

  // Al recargar por una acción se sigue mostrando lo anterior hasta que llega lo nuevo: no hay parpadeo
  const eventos = resultado?.clave === clave ? resultado.valor : null
  const fallo = error?.clave === clave ? error.valor : null

  let contenido
  if (fallo && !eventos) {
    contenido = (
      <Mensaje tipo="error" titulo="No se pudo cargar el historial" accion={{ texto: 'Reintentar', onClick: () => setIntento((n) => n + 1) }}>
        {fallo.mensaje}
      </Mensaje>
    )
  } else if (!eventos) {
    contenido = <Esqueleto lineas={compacta ? 3 : 5} />
  } else if (eventos.length === 0) {
    contenido = (
      <EstadoVacio icono="lista" titulo="Todavía no hay eventos">
        Cada cambio del caso (asignación, estado, atención, validación) aparecerá aquí.
      </EstadoVacio>
    )
  } else {
    contenido = (
      <ol className={`flex flex-col ${compacta ? 'gap-3' : 'gap-4.5'}`}>
        {eventos.map((evento, i) => (
          <ItemEvento key={evento.id} evento={evento} compacta={compacta} ultimo={i === eventos.length - 1} />
        ))}
      </ol>
    )
  }

  return (
    <Tarjeta className={compacta ? 'p-4' : 'p-5 sm:p-6'}>
      <div className={`flex items-baseline justify-between gap-3 ${compacta ? 'mb-3' : 'mb-4.5'}`}>
        <h2 className="text-[15px] font-semibold">Historial</h2>
        {eventos && eventos.length > 0 && (
          <span className="cifras text-[12.5px] text-texto-suave">
            {eventos.length} {eventos.length === 1 ? 'evento' : 'eventos'}
          </span>
        )}
      </div>
      {contenido}
    </Tarjeta>
  )
}

interface PropsItem {
  evento: EventoHistorialItem
  compacta: boolean
  ultimo: boolean
}

function ItemEvento({ evento, compacta, ultimo }: PropsItem) {
  const { icono, tono: tonoBase } = APARIENCIA[evento.evento]
  // El cambio de estado toma el color del estado al que llegó
  const tono = evento.evento === 'CAMBIO_ESTADO' && evento.estadoNuevo ? COLOR_ESTADO[evento.estadoNuevo] : tonoBase
  const { texto, comentarioUsado } = describir(evento)
  const devolucion = evento.evento === 'DEVOLUCION'
  // En la versión compacta no se muestran los comentarios de reclasificación
  const comentario = evento.comentario && !comentarioUsado && !(compacta && evento.evento === 'RECLASIFICACION') ? evento.comentario : null

  return (
    <li className="relative grid grid-cols-[auto_1fr] gap-x-3" style={{ '--tono': tono } as CSSProperties}>
      {/* Línea que une cada evento con el siguiente */}
      {!ultimo && <span aria-hidden="true" className={`absolute top-8 -bottom-4.5 w-px bg-linea ${compacta ? 'left-3' : 'left-3.75'}`} />}
      <span className={`relative grid shrink-0 place-items-center rounded-full bg-(--tono)/13 text-(--tono) ${compacta ? 'size-6' : 'size-7.5'}`}>
        <Icono nombre={icono} className={compacta ? 'size-3.25' : 'size-3.75'} />
      </span>
      <div className="min-w-0 pt-1">
        <p className={`font-medium ${compacta ? 'text-[13px]' : 'text-sm'}`}>{texto}</p>
        <p className="mt-0.5 text-[12.5px] text-texto-suave">
          {evento.usuario.nombre}
          {!compacta && evento.usuario.rol && ` · ${ETIQUETA_ROL[evento.usuario.rol]}`}
          {' · '}
          <time dateTime={evento.fecha} className="cifras">
            {formatearFecha(evento.fecha)}
          </time>
        </p>
        {comentario &&
          (devolucion ? (
            <div className="mt-2 flex gap-2 rounded-campo bg-urgente/10 px-3 py-2.5 text-[13px]">
              <Icono nombre="devolver" className="mt-0.5 size-3.75 text-urgente" />
              <div>
                <p className="font-semibold text-urgente">Motivo de la devolución</p>
                <p className="mt-0.5 text-texto">{comentario}</p>
              </div>
            </div>
          ) : (
            <p className="mt-1.5 rounded-campo bg-relleno px-3 py-2 text-[13px] text-texto-suave">{comentario}</p>
          ))}
      </div>
    </li>
  )
}
