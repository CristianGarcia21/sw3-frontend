import type { Prioridad } from '../types'
import { ETIQUETA_PRIORIDAD } from '../utils/etiquetas'

/** Solo P1 lleva color: así lo urgente resalta sin que la tabla se llene de colores */
export function PrioridadBadge({ prioridad }: { prioridad: Prioridad }) {
  return <span className={`text-xs whitespace-nowrap ${prioridad === 'P1' ? 'font-semibold text-urgente' : 'text-texto-suave'}`}>{ETIQUETA_PRIORIDAD[prioridad]}</span>
}
