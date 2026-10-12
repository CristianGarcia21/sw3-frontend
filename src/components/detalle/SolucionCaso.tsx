import type { CasoDetalle, EstadoCaso } from '../../types'
import { formatearFecha } from '../../utils/etiquetas'
import { EstadoVacio, Tarjeta } from '../ui'

interface Props {
  caso: CasoDetalle
}

// Mientras el caso no esté Cerrada, se aclara en qué va la solución
const ACLARACION: Partial<Record<EstadoCaso, string>> = {
  EN_VALIDACION: 'La solución está en revisión',
  EN_ATENCION: 'En proceso',
}

/** HU-12: la solución vigente del caso (la atención más reciente), vista por el solicitante. Solo lectura */
export function SolucionCaso({ caso }: Props) {
  const solucion = caso.solucionVigente
  const aclaracion = ACLARACION[caso.estado]

  return (
    <Tarjeta className="flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-[15px] font-semibold">Solución</h2>
        {aclaracion && <p className="text-[13px] text-texto-suave">{aclaracion}</p>}
      </div>

      {solucion ? (
        <>
          <dl className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <dt className="text-[13px] text-texto-suave">Diagnóstico</dt>
              <dd className="text-sm leading-relaxed whitespace-pre-wrap">{solucion.diagnostico}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-[13px] text-texto-suave">Solución</dt>
              <dd className="text-sm leading-relaxed whitespace-pre-wrap">{solucion.solucion}</dd>
            </div>
          </dl>
          <p className="border-t border-linea pt-4 text-[13px] text-texto-suave">
            Registrada por <span className="font-medium text-texto">{solucion.agente.nombre}</span>
            {' · '}
            <time dateTime={solucion.fecha} className="cifras">
              {formatearFecha(solucion.fecha)}
            </time>
          </p>
        </>
      ) : (
        <EstadoVacio icono="herramienta" titulo="Aún sin solución registrada">
          Cuando el agente registre el diagnóstico y la solución, aparecerán aquí.
        </EstadoVacio>
      )}
    </Tarjeta>
  )
}
