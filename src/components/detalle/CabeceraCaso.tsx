import { EstadoBadge } from '../EstadoBadge'
import { PrioridadBadge } from '../PrioridadBadge'
import type { Caso } from '../../types'

interface Props {
  caso: Caso
}

export function CabeceraCaso({ caso }: Props) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="cifras text-[13px] text-texto-suave">Caso #{caso.id}</span>
        <EstadoBadge estado={caso.estado} />
        <PrioridadBadge prioridad={caso.prioridad} />
      </div>
      <h1 className="text-[34px] leading-tight font-bold tracking-[-0.028em]">{caso.titulo}</h1>
    </header>
  )
}
