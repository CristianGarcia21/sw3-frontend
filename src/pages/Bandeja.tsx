import { useEffect, useState } from 'react'
import { generatePath, Link, useSearchParams } from 'react-router'
import type { FiltrosCasos } from '../api/casos'
import { FiltrosBandeja } from '../components/bandeja/FiltrosBandeja'
import { EstadoBadge } from '../components/EstadoBadge'
import { Mensaje } from '../components/Mensaje'
import { PrioridadBadge } from '../components/PrioridadBadge'
import { Boton, Esqueleto, EstadoVacio, Segmentado, Tarjeta } from '../components/ui'
import { useAsignarCaso } from '../hooks/useAsignarCaso'
import { useCasos } from '../hooks/useCasos'
import { useUsuarioActual } from '../hooks/useUsuarioActual'
import type { Caso } from '../types'
import { puedeAsignarse } from '../utils/estados'
import { ETIQUETA_TIPO, formatearAntiguedad, formatearFecha } from '../utils/etiquetas'
import { aConsulta, hayFiltros, leerFiltros, limpiarFiltros } from '../utils/filtrosBandeja'
import { RUTAS } from '../utils/navegacion'

// 'todos' solo para el administrador: incluye los cerrados (HU-09)
type Vista = 'pendientes' | 'mios' | 'todos'

const COLUMNAS = ['ID', 'Título', 'Tipo', 'Área / Categoría', 'Prioridad', 'Estado', 'Solicitante', 'Agente', 'Antigüedad']

/**
 * HU-03: bandeja del agente y del administrador.
 * El orden (P1 primero y, en cada prioridad, el más antiguo arriba) lo da el backend con orden=prioridad.
 */
export function Bandeja() {
  const { usuario } = useUsuarioActual()
  const esAgente = usuario?.rol === 'AGENTE'
  // La pestaña va en la URL (?vista=mios) para que se conserve al volver del detalle
  const [parametros, setParametros] = useSearchParams()
  const vistaUrl = parametros.get('vista')
  let vista: Vista = 'pendientes'
  if (esAgente && vistaUrl === 'mios') vista = 'mios'
  else if (!esAgente && vistaUrl === 'todos') vista = 'todos'

  // Los filtros de la barra (HU-09) se suman a la pestaña activa
  const filtrosUrl = leerFiltros(parametros)
  const conFiltros = hayFiltros(filtrosUrl)
  const pestana: FiltrosCasos = { orden: 'prioridad' }
  if (vista !== 'todos') pestana.abiertos = true
  if (vista === 'mios') pestana.agenteId = usuario?.id
  const { casos, error, actualizando, recargar } = useCasos({ ...pestana, ...aConsulta(filtrosUrl) })
  const { asignar, asignando } = useAsignarCaso()

  // HU-04: el agente toma un caso desde Pendientes. Con éxito o con error se refresca la lista,
  // así se ve el agente nuevo o el estado real si otro agente lo tomó antes
  async function asignarme(caso: Caso) {
    if (!usuario) return
    await asignar(caso, usuario)
    recargar()
  }

  // La antigüedad se recalcula cada minuto sin volver a pedir los casos
  const [ahora, setAhora] = useState(() => Date.now())
  useEffect(() => {
    const reloj = setInterval(() => setAhora(Date.now()), 60_000)
    return () => clearInterval(reloj)
  }, [])

  function cambiarVista(nueva: Vista) {
    setParametros(
      (actuales) => {
        const siguientes = new URLSearchParams(actuales)
        if (nueva === 'pendientes') siguientes.delete('vista')
        else siguientes.set('vista', nueva)
        return siguientes
      },
      { replace: true },
    )
  }

  function limpiar() {
    setParametros((actuales) => limpiarFiltros(actuales), { replace: true })
  }

  let resumen = 'Los casos que no están cerrados, lo más urgente primero.'
  if (vista === 'mios') resumen = 'Los casos abiertos que tienes a cargo.'
  if (vista === 'todos') resumen = 'Todos los casos, incluidos los cerrados.'
  if (casos && (casos.length > 0 || conFiltros)) {
    const cantidad = `${casos.length} ${casos.length === 1 ? 'caso' : 'casos'}`
    const sinAgente = casos.filter((c) => !c.agente).length
    if (conFiltros) resumen = `${cantidad} con estos filtros`
    else if (vista === 'mios') resumen = `${cantidad} asignados a ti`
    else resumen = `${cantidad} · ${sinAgente} sin asignar`
  }

  let contenido = null
  if (casos === null) {
    // Si falló la primera carga solo queda el mensaje de error
    if (!error) {
      contenido = (
        <Tarjeta className="p-5">
          <Esqueleto lineas={6} />
        </Tarjeta>
      )
    }
  } else if (casos.length === 0) {
    contenido = (
      <Tarjeta>
        {conFiltros ? (
          <EstadoVacio icono="filtros" titulo="No hay casos con esos filtros" accion={<Boton onClick={limpiar}>Limpiar filtros</Boton>}>
            Prueba con otros filtros o límpialos para ver todos los casos de esta pestaña.
          </EstadoVacio>
        ) : vista === 'mios' ? (
          <EstadoVacio
            icono="usuario"
            titulo="No tienes casos asignados"
            accion={<Boton onClick={() => cambiarVista('pendientes')}>Ver pendientes</Boton>}
          >
            Cuando te asignes un caso, aparecerá aquí mientras siga abierto.
          </EstadoVacio>
        ) : (
          <EstadoVacio icono="bandeja" titulo="No hay casos pendientes">
            Cuando un solicitante registre un caso, aparecerá aquí con su prioridad.
          </EstadoVacio>
        )}
      </Tarjeta>
    )
  } else {
    contenido = <TablaBandeja casos={casos} ahora={ahora} onAsignarme={esAgente && vista === 'pendientes' ? asignarme : undefined} asignando={asignando} />
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {/* El administrador la ve como "Casos", igual que en su menú */}
          <h1 className="text-[34px] leading-tight font-bold tracking-[-0.028em]">{esAgente ? 'Bandeja' : 'Casos'}</h1>
          <p className="mt-1 text-texto-suave">{resumen}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Segmentado
            aria-label="Vista de la bandeja"
            valor={vista}
            onChange={cambiarVista}
            opciones={
              esAgente
                ? [
                    { valor: 'pendientes', texto: 'Pendientes' },
                    { valor: 'mios', texto: 'Asignados a mí' },
                  ]
                : [
                    { valor: 'pendientes', texto: 'Pendientes' },
                    { valor: 'todos', texto: 'Todos' },
                  ]
            }
          />
          <Boton cargando={actualizando} onClick={recargar}>
            Actualizar
          </Boton>
        </div>
      </header>

      <FiltrosBandeja />

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
  ahora: number
  /** Solo llega para el agente en Pendientes: muestra Asignarme en las filas sin agente */
  onAsignarme?: (caso: Caso) => void
  /** id del caso que se está asignando */
  asignando: number | null
}

function TablaBandeja({ casos, ahora, onAsignarme, asignando }: PropsTabla) {
  return (
    <Tarjeta className="overflow-x-auto">
      <table className="w-full min-w-240 text-left">
        <thead>
          <tr>
            {COLUMNAS.map((columna) => (
              <th key={columna} scope="col" className="px-4 py-3 text-[11px] font-semibold whitespace-nowrap text-texto-suave">
                {columna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {casos.map((caso) => (
            <tr key={caso.id} className="relative border-t border-linea transition-colors duration-150 ease-resorte hover:bg-relleno">
              <td className="cifras px-4 py-3 text-texto-suave">#{caso.id}</td>
              <td className="max-w-72 min-w-44 px-4 py-3">
                {/* El enlace cubre toda la fila: se abre con un clic en cualquier celda y queda una sola parada de tabulación */}
                <Link
                  to={generatePath(RUTAS.detalleCaso, { id: String(caso.id) })}
                  className="line-clamp-2 font-medium outline-none after:absolute after:inset-0 focus-visible:after:rounded-campo focus-visible:after:ring-2 focus-visible:after:ring-acento focus-visible:after:ring-inset"
                >
                  {caso.titulo}
                </Link>
              </td>
              <td className="min-w-28 px-4 py-3">{ETIQUETA_TIPO[caso.tipo]}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="block">{caso.area.nombre}</span>
                <span className="block text-[13px] text-texto-suave">{caso.categoria.nombre}</span>
              </td>
              <td className="px-4 py-3">
                <PrioridadBadge prioridad={caso.prioridad} />
              </td>
              <td className="px-4 py-3">
                <EstadoBadge estado={caso.estado} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{caso.solicitante.nombre}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {caso.agente ? (
                  caso.agente.nombre
                ) : onAsignarme && puedeAsignarse(caso.estado) ? (
                  // Queda por encima del enlace de la fila: el clic asigna y no abre el detalle
                  <Boton
                    className="relative z-10"
                    aria-label={`Asignarme el caso #${caso.id}`}
                    cargando={asignando === caso.id}
                    disabled={asignando !== null}
                    onClick={() => onAsignarme(caso)}
                  >
                    Asignarme
                  </Boton>
                ) : (
                  <span className="text-texto-suave">Sin asignar</span>
                )}
              </td>
              <td className="cifras px-4 py-3 whitespace-nowrap text-texto-suave">
                <time dateTime={caso.fechaCreacion} title={formatearFecha(caso.fechaCreacion)}>
                  {formatearAntiguedad(caso.fechaCreacion, ahora)}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Tarjeta>
  )
}
