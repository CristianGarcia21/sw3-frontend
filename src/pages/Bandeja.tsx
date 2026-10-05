import { useEffect, useState } from 'react'
import { generatePath, Link, useSearchParams } from 'react-router'
import type { FiltrosCasos } from '../api/casos'
import { FiltrosBandeja } from '../components/bandeja/FiltrosBandeja'
import { EstadoBadge } from '../components/EstadoBadge'
import { Mensaje } from '../components/Mensaje'
import { PrioridadBadge } from '../components/PrioridadBadge'
import { Boton, Esqueleto, EstadoVacio, Segmentado, Tarjeta } from '../components/ui'
import { useCasos } from '../hooks/useCasos'
import { useUsuarioActual } from '../hooks/useUsuarioActual'
import type { Caso } from '../types'
import { ETIQUETA_TIPO, formatearAntiguedad, formatearFecha } from '../utils/etiquetas'
import { RUTAS } from '../utils/navegacion'

type Vista = 'pendientes' | 'mios'

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
  const vista: Vista = esAgente && parametros.get('vista') === 'mios' ? 'mios' : 'pendientes'

  const filtros: FiltrosCasos = vista === 'mios' ? { abiertos: true, agenteId: usuario?.id, orden: 'prioridad' } : { abiertos: true, orden: 'prioridad' }
  const { casos, error, actualizando, recargar } = useCasos(filtros)

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
        if (nueva === 'mios') siguientes.set('vista', 'mios')
        else siguientes.delete('vista')
        return siguientes
      },
      { replace: true },
    )
  }

  let resumen = vista === 'mios' ? 'Los casos abiertos que tienes a cargo.' : 'Los casos que no están cerrados, lo más urgente primero.'
  if (casos && casos.length > 0) {
    const cantidad = `${casos.length} ${casos.length === 1 ? 'caso' : 'casos'}`
    const sinAgente = casos.filter((c) => !c.agente).length
    resumen = vista === 'mios' ? `${cantidad} asignados a ti` : `${cantidad} · ${sinAgente} sin asignar`
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
        {vista === 'mios' ? (
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
    contenido = <TablaBandeja casos={casos} ahora={ahora} />
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
          {esAgente && (
            <Segmentado
              aria-label="Vista de la bandeja"
              valor={vista}
              onChange={cambiarVista}
              opciones={[
                { valor: 'pendientes', texto: 'Pendientes' },
                { valor: 'mios', texto: 'Asignados a mí' },
              ]}
            />
          )}
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

function TablaBandeja({ casos, ahora }: { casos: Caso[]; ahora: number }) {
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
              <td className="px-4 py-3 whitespace-nowrap">{caso.agente ? caso.agente.nombre : <span className="text-texto-suave">Sin asignar</span>}</td>
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
