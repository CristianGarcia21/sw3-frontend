import type { CSSProperties, ReactNode } from 'react'
import { Boton } from './ui/Boton'
import { Icono, type NombreIcono } from './ui/Icono'

type TipoMensaje = 'exito' | 'error' | 'info'

const APARIENCIA: Record<TipoMensaje, { icono: NombreIcono; tono: string }> = {
  exito: { icono: 'validar', tono: 'var(--estado-cerrada)' },
  error: { icono: 'alerta', tono: 'var(--urgente)' },
  info: { icono: 'info', tono: 'var(--acento)' },
}

interface Props {
  tipo?: TipoMensaje
  titulo?: string
  children?: ReactNode
  /** Botón opcional, por ejemplo "Reintentar" */
  accion?: { texto: string; onClick: () => void }
}

/** Mensaje fijo dentro de la página (no flotante). Para el resultado de una acción usa useAvisos() */
export function Mensaje({ tipo = 'info', titulo, children, accion }: Props) {
  const { icono, tono } = APARIENCIA[tipo]
  return (
    <div
      role={tipo === 'error' ? 'alert' : 'status'}
      style={{ '--tono': tono } as CSSProperties}
      className="flex items-start gap-3 rounded-tarjeta bg-(--tono)/10 px-4 py-3.5 text-sm"
    >
      <Icono nombre={icono} className="mt-px size-4.5 text-(--tono)" />
      <div className="min-w-0 flex-1">
        {titulo && <p className="font-semibold">{titulo}</p>}
        {children && <div className={`text-texto-suave ${titulo ? 'mt-0.5' : ''}`}>{children}</div>}
      </div>
      {accion && (
        <Boton onClick={accion.onClick}>{accion.texto}</Boton>
      )}
    </div>
  )
}
