import { useEffect, useState } from 'react'
import { generatePath, Link } from 'react-router'
import { Mensaje } from '../components/Mensaje'
import { PrioridadBadge } from '../components/PrioridadBadge'
import { Boton, Esqueleto, EstadoVacio, Tarjeta } from '../components/ui'
import { useCasos } from '../hooks/useCasos'
import { useLlegadasAValidacion } from '../hooks/useLlegadasAValidacion'
import type { Caso } from '../types'
import { ETIQUETA_TIPO, formatearAntiguedad, formatearFecha } from '../utils/etiquetas'
import { RUTAS } from '../utils/navegacion'

const COLUMNAS = ['ID', 'Título', 'Tipo', 'Prioridad', 'Agente', 'Llegó']

/**
 * HU-07: casos En validación que esperan aprobación o devolución.
 * El orden lo da el backend con orden=prioridad: P1 primero y, en cada prioridad, el más antiguo arriba.
 */
export function PorValidar() {
  const { casos, error, actualizando, recargar } = useCasos({ estado: ['EN_VALIDACION'], orden: 'prioridad' })
  const llegadas = useLlegadasAValidacion(casos)

  // "Hace cuánto llegó" se recalcula cada minuto sin volver a pedir los casos
  const [ahora, setAhora] = useState(() => Date.now())
  useEffect(() => {
    const reloj = setInterval(() => setAhora(Date.now()), 60_000)
    return () => clearInterval(reloj)
  }, [])

  let resumen = 'Revisa la solución de cada caso y apruébala o devuélvela.'
  if (casos && casos.length > 0) resumen = `${casos.length} ${casos.length === 1 ? 'caso espera' : 'casos esperan'} tu revisión`

  let contenido = null
  if (casos === null) {
    // Si falló la primera carga solo queda el mensaje de error
    if (!error) {
      contenido = (
        <Tarjeta className="p-5">
          <Esqueleto lineas={4} />
        </Tarjeta>
      )
    }
  } else if (casos.length === 0) {
    contenido = (
      <Tarjeta>
        <EstadoVacio icono="validar" titulo="No hay casos por validar">
          Cuando un agente envíe un caso a validación, aparecerá aquí con su prioridad.
        </EstadoVacio>
      </Tarjeta>
    )
  } else {
    contenido = <TablaPorValidar casos={casos} llegadas={llegadas} ahora={ahora} />
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[34px] leading-tight font-bold tracking-[-0.028em]">Por validar</h1>
          <p className="mt-1 text-texto-suave">{resumen}</p>
        </div>
        <Boton cargando={actualizando} onClick={recargar}>
          Actualizar
        </Boton>
      </header>

      {error && (
        <Mensaje tipo="error" titulo="No se pudieron cargar los casos" accion={{ texto: 'Reintentar', onClick: recargar }}>
          {error.mensaje}
        </Mensaje>
      )}

      {contenido}
    </section>
  )
}

interface PropsTabla {
  casos: Caso[]
  /** Fecha en que cada caso entró a En validación. Falta la clave mientras llega su historial */
  llegadas: Record<number, string | null>
  ahora: number
}

function TablaPorValidar({ casos, llegadas, ahora }: PropsTabla) {
  return (
    <Tarjeta className="overflow-x-auto">
      <table className="w-full min-w-180 text-left">
        <thead>
          <tr>
            {COLUMNAS.map((columna) => (
              <th key={columna} scope="col" className="px-4.5 py-3 text-[11px] font-semibold whitespace-nowrap text-texto-suave">
                {columna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {casos.map((caso) => {
            const llegada = llegadas[caso.id]
            return (
              <tr key={caso.id} className="relative border-t border-linea transition-colors duration-150 ease-resorte hover:bg-relleno">
                <td className="cifras px-4.5 py-3 text-texto-suave">#{caso.id}</td>
                <td className="max-w-80 min-w-44 px-4.5 py-3">
                  {/* El enlace cubre toda la fila: se abre con un clic en cualquier celda y queda una sola parada de tabulación */}
                  <Link
                    to={generatePath(RUTAS.detalleCaso, { id: String(caso.id) })}
                    className="line-clamp-2 font-medium outline-none after:absolute after:inset-0 focus-visible:after:rounded-campo focus-visible:after:ring-2 focus-visible:after:ring-acento focus-visible:after:ring-inset"
                  >
                    {caso.titulo}
                  </Link>
                </td>
                <td className="min-w-28 px-4.5 py-3">{ETIQUETA_TIPO[caso.tipo]}</td>
                <td className="px-4.5 py-3">
                  <PrioridadBadge prioridad={caso.prioridad} />
                </td>
                <td className="px-4.5 py-3 whitespace-nowrap">{caso.agente?.nombre ?? <span className="text-texto-suave">Sin agente</span>}</td>
                <td className="cifras px-4.5 py-3 whitespace-nowrap text-texto-suave">
                  {llegada === undefined ? (
                    <Esqueleto lineas={1} className="w-16" />
                  ) : (
                    <time dateTime={llegada ?? undefined} title={formatearFecha(llegada)}>
                      {formatearAntiguedad(llegada, ahora)}
                    </time>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Tarjeta>
  )
}
