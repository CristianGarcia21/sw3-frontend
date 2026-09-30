import type { EstadoCaso } from '../types'
import { ETIQUETA_ESTADO } from '../utils/etiquetas'

const COLORES: Record<EstadoCaso, string> = {
  PENDIENTE: 'bg-slate-100 text-slate-700 ring-slate-300',
  EN_ANALISIS: 'bg-amber-50 text-amber-800 ring-amber-300',
  EN_ATENCION: 'bg-sky-50 text-sky-800 ring-sky-300',
  EN_VALIDACION: 'bg-violet-50 text-violet-800 ring-violet-300',
  CERRADA: 'bg-emerald-50 text-emerald-800 ring-emerald-300',
}

export function EstadoBadge({ estado }: { estado: EstadoCaso }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${COLORES[estado]}`}>
      {ETIQUETA_ESTADO[estado]}
    </span>
  )
}
