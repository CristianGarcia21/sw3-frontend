import type { ReactNode } from 'react'

type TipoMensaje = 'exito' | 'error' | 'info'

const ESTILOS: Record<TipoMensaje, string> = {
  exito: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  error: 'border-red-300 bg-red-50 text-red-800',
  info: 'border-sky-300 bg-sky-50 text-sky-800',
}

interface Props {
  tipo?: TipoMensaje
  titulo?: string
  children?: ReactNode
  /** Botón opcional, por ejemplo "Reintentar" */
  accion?: { texto: string; onClick: () => void }
}

export function Mensaje({ tipo = 'info', titulo, children, accion }: Props) {
  return (
    <div role={tipo === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-4 py-3 text-sm ${ESTILOS[tipo]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {titulo && <p className="font-semibold">{titulo}</p>}
          {children && <div className={titulo ? 'mt-1' : ''}>{children}</div>}
        </div>
        {accion && (
          <button
            type="button"
            onClick={accion.onClick}
            className="shrink-0 rounded-md border border-current px-3 py-1 text-xs font-medium hover:bg-white/60"
          >
            {accion.texto}
          </button>
        )}
      </div>
    </div>
  )
}
