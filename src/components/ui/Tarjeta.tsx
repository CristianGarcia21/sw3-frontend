import type { HTMLAttributes, ReactNode } from 'react'
import { Icono, type NombreIcono } from './Icono'

/** Superficie sólida para contenido: tablas, formularios, textos. El contenido nunca va sobre vidrio */
export function Tarjeta({ className = '', children, ...resto }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-tarjeta bg-superficie shadow-[0_0_0_0.5px_var(--linea)] ${className}`} {...resto}>
      {children}
    </div>
  )
}

interface PropsVacio {
  icono?: NombreIcono
  titulo: string
  /** Qué va a aparecer aquí y cómo */
  children?: ReactNode
  accion?: ReactNode
}

/** Estado vacío de una lista. Dice qué aparecerá y, si aplica, cómo crear lo primero */
export function EstadoVacio({ icono = 'bandeja', titulo, children, accion }: PropsVacio) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-4 py-10 text-center">
      <Icono nombre={icono} className="mb-1 size-7 text-texto-suave" />
      <p className="text-[15px] font-semibold">{titulo}</p>
      {children && <p className="max-w-[44ch] text-[13px] text-texto-suave">{children}</p>}
      {accion && <div className="mt-3">{accion}</div>}
    </div>
  )
}

/** Líneas de carga para reservar el espacio de un contenido que aún no llega */
export function Esqueleto({ lineas = 4, className = '' }: { lineas?: number; className?: string }) {
  const anchos = ['70%', '92%', '55%', '80%', '64%']
  return (
    <div role="status" aria-label="Cargando" className={`flex flex-col gap-2.5 ${className}`}>
      {Array.from({ length: lineas }, (_, i) => (
        <span key={i} className="h-2.75 animate-pulse rounded-md bg-relleno-fuerte" style={{ width: anchos[i % anchos.length] }} />
      ))}
    </div>
  )
}
