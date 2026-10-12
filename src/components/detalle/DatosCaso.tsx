import type { Caso } from '../../types'
import { ETIQUETA_TIPO, formatearFecha } from '../../utils/etiquetas'
import { Tarjeta } from '../ui'

interface Props {
  caso: Caso
  /** Detalle del solicitante (HU-12): sin el solicitante ni la fecha de asignación, y la de cierre solo si ya cerró */
  paraSolicitante?: boolean
}

interface Dato {
  etiqueta: string
  valor: string
  fecha?: string | null
}

export function DatosCaso({ caso, paraSolicitante = false }: Props) {
  const datos: Dato[] = paraSolicitante
    ? [
        { etiqueta: 'Tipo', valor: ETIQUETA_TIPO[caso.tipo] },
        { etiqueta: 'Área', valor: caso.area.nombre },
        { etiqueta: 'Categoría', valor: caso.categoria.nombre },
        { etiqueta: 'Creado', valor: formatearFecha(caso.fechaCreacion), fecha: caso.fechaCreacion },
        { etiqueta: 'Agente responsable', valor: caso.agente?.nombre ?? 'Aún sin asignar' },
      ]
    : [
        { etiqueta: 'Tipo', valor: ETIQUETA_TIPO[caso.tipo] },
        { etiqueta: 'Área', valor: caso.area.nombre },
        { etiqueta: 'Categoría', valor: caso.categoria.nombre },
        { etiqueta: 'Solicitante', valor: caso.solicitante.nombre },
        { etiqueta: 'Agente', valor: caso.agente?.nombre ?? 'Sin asignar' },
        { etiqueta: 'Creado', valor: formatearFecha(caso.fechaCreacion), fecha: caso.fechaCreacion },
        { etiqueta: 'Asignado', valor: formatearFecha(caso.fechaAsignacion), fecha: caso.fechaAsignacion },
        { etiqueta: 'Cerrado', valor: formatearFecha(caso.fechaCierre), fecha: caso.fechaCierre },
      ]
  if (paraSolicitante && caso.estado === 'CERRADA' && caso.fechaCierre) {
    datos.push({ etiqueta: 'Cerrado', valor: formatearFecha(caso.fechaCierre), fecha: caso.fechaCierre })
  }

  return (
    <Tarjeta className="p-5 sm:p-6">
      <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        {datos.map(({ etiqueta, valor, fecha }) => (
          <div key={etiqueta} className="flex min-w-0 flex-col gap-1">
            <dt className="text-[13px] text-texto-suave">{etiqueta}</dt>
            <dd className="text-sm font-medium">
              {fecha ? <time dateTime={fecha}>{valor}</time> : valor}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 border-t border-linea pt-5">
        <h2 className="text-sm font-semibold">Descripción</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-texto-suave">{caso.descripcion}</p>
      </div>
    </Tarjeta>
  )
}
