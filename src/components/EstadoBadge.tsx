import type { CSSProperties } from 'react'
import type { EstadoCaso } from '../types'
import { COLOR_ESTADO } from '../utils/colores'
import { ETIQUETA_ESTADO } from '../utils/etiquetas'

interface Props {
  estado: EstadoCaso
  /** 'suave' es la píldora de color para tablas y detalles; 'punto' es más discreta, para listas densas */
  variante?: 'suave' | 'punto'
}

export function EstadoBadge({ estado, variante = 'suave' }: Props) {
  const color = { '--tono': COLOR_ESTADO[estado] } as CSSProperties
  return (
    <span
      style={color}
      className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${variante === 'suave' ? 'rounded-full bg-(--tono)/13 py-0.75 pr-2.5 pl-2 text-(--tono)' : ''}`}
    >
      <span className="size-1.75 shrink-0 rounded-full bg-(--tono)" />
      {ETIQUETA_ESTADO[estado]}
    </span>
  )
}
