import { useLayoutEffect, useRef, useState } from 'react'

interface OpcionSegmento<T> {
  valor: T
  texto: string
  /** Color del punto a la izquierda, por ejemplo 'var(--urgente)' */
  color?: string
}

interface Props<T> {
  opciones: OpcionSegmento<T>[]
  valor: T
  onChange: (valor: T) => void
  'aria-label': string
  /** 'solido' dentro de formularios y tarjetas; 'vidrio' cuando flota en una barra sobre el contenido */
  variante?: 'solido' | 'vidrio'
  /** Ocupa todo el ancho y reparte las opciones por igual */
  completo?: boolean
  className?: string
}

/** Elección entre pocas opciones (2 a 6). La lente se desliza hasta la opción activa */
export function Segmentado<T extends string | number>({ opciones, valor, onChange, variante = 'solido', completo = false, className = '', ...resto }: Props<T>) {
  const grupo = useRef<HTMLDivElement>(null)
  const [lente, setLente] = useState<{ x: number; ancho: number } | null>(null)

  useLayoutEffect(() => {
    const medir = () => {
      const activo = grupo.current?.querySelector<HTMLElement>('[aria-checked="true"]')
      if (activo) setLente({ x: activo.offsetLeft, ancho: activo.offsetWidth })
    }
    medir()
    if (!grupo.current) return
    const observador = new ResizeObserver(medir)
    observador.observe(grupo.current)
    return () => observador.disconnect()
  }, [valor, opciones.length])

  return (
    <div
      ref={grupo}
      role="radiogroup"
      aria-label={resto['aria-label']}
      className={`relative items-center rounded-full p-0.75 ${completo ? 'flex' : 'inline-flex'} ${variante === 'vidrio' ? 'vidrio' : 'bg-relleno'} ${className}`}
    >
      {lente && (
        <span
          aria-hidden="true"
          className="absolute top-0.75 bottom-0.75 left-0 rounded-full transition-[translate,width] duration-500 ease-resorte"
          style={{ width: lente.ancho, translate: `${lente.x}px 0`, background: 'var(--lente)', boxShadow: 'var(--lente-sombra)' }}
        />
      )}
      {opciones.map((opcion) => {
        const activa = opcion.valor === valor
        return (
          <button
            key={String(opcion.valor)}
            type="button"
            role="radio"
            aria-checked={activa}
            onClick={() => onChange(opcion.valor)}
            className={`relative z-10 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-[color,scale] duration-200 active:scale-95 ${completo ? 'flex-1' : ''} ${activa ? 'text-texto' : 'text-texto-suave'}`}
          >
            {opcion.color && <span className="size-1.75 rounded-full" style={{ background: opcion.color }} />}
            {opcion.texto}
          </button>
        )
      })}
    </div>
  )
}
