import type { Prioridad } from '../types'
import { ETIQUETA_PRIORIDAD } from '../utils/etiquetas'

const CLASES: Record<Prioridad, string> = {
  P1: 'bg-red-50 text-red-700 ring-red-300',
  P2: 'bg-amber-50 text-amber-800 ring-amber-300',
  P3: 'bg-slate-50 text-slate-600 ring-slate-300',
}

export function PrioridadBadge({ prioridad }: { prioridad: Prioridad }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${CLASES[prioridad]}`}>
      {ETIQUETA_PRIORIDAD[prioridad]}
    </span>
  )
}
