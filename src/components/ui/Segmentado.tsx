import { useLayoutEffect, useRef, useState, type FocusEventHandler, type KeyboardEvent } from 'react'

interface OpcionSegmento<T> {
  valor: T
  texto: string
  /** Color del punto a la izquierda, por ejemplo 'var(--urgente)' */
  color?: string
}

interface Props<T> {
  opciones: OpcionSegmento<T>[]
  valor: T | null
  onChange: (valor: T) => void
  'aria-label': string
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  onBlur?: FocusEventHandler<HTMLDivElement>
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
      setLente(activo ? { x: activo.offsetLeft, ancho: activo.offsetWidth } : null)
    }
    medir()
    if (!grupo.current) return
    const observador = new ResizeObserver(medir)
    observador.observe(grupo.current)
    return () => observador.disconnect()
  }, [valor, opciones.length])

  // Como un grupo de radios: Tab entra a la opción activa y las flechas cambian la elección
  function teclas(e: KeyboardEvent<HTMLDivElement>) {
    const actual = opciones.findIndex((o) => o.valor === valor)
    const ultimo = opciones.length - 1
    let destino = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') destino = actual === ultimo ? 0 : actual + 1
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') destino = actual <= 0 ? ultimo : actual - 1
    else if (e.key === 'Home') destino = 0
    else if (e.key === 'End') destino = ultimo
    if (destino < 0) return
    e.preventDefault()
    onChange(opciones[destino].valor)
    grupo.current?.querySelectorAll<HTMLElement>('[role="radio"]')[destino]?.focus()
  }

  return (
    <div
      ref={grupo}
      id={resto.id}
      role="radiogroup"
      onKeyDown={teclas}
      onBlur={(e) => {
        if (e.relatedTarget instanceof Node && grupo.current?.contains(e.relatedTarget)) return
        resto.onBlur?.(e)
      }}
      aria-label={resto['aria-label']}
      aria-describedby={resto['aria-describedby']}
      aria-invalid={resto['aria-invalid'] || undefined}
      className={`relative items-center rounded-full p-0.75 ${completo ? 'flex' : 'inline-flex'} ${variante === 'vidrio' ? 'vidrio' : 'bg-relleno'} ${className}`}
    >
      {lente && (
        <span
          aria-hidden="true"
          className="absolute top-0.75 bottom-0.75 left-0 rounded-full transition-[translate,width] duration-500 ease-resorte"
          style={{ width: lente.ancho, translate: `${lente.x}px 0`, background: 'var(--lente)', boxShadow: 'var(--lente-sombra)' }}
        />
      )}
      {opciones.map((opcion, i) => {
        const activa = opcion.valor === valor
        // Si ningún valor coincide, la primera opción queda alcanzable con Tab
        const enfocable = activa || (i === 0 && !opciones.some((o) => o.valor === valor))
        return (
          <button
            key={String(opcion.valor)}
            type="button"
            role="radio"
            aria-checked={activa}
            tabIndex={enfocable ? 0 : -1}
            onClick={() => onChange(opcion.valor)}
            className={`relative z-10 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-[color,scale] duration-200 active:scale-95 focus-visible:ring-4 focus-visible:ring-tinte ${completo ? 'flex-1' : ''} ${activa ? 'text-texto' : 'text-texto-suave'}`}
          >
            {opcion.color && <span className="size-1.75 rounded-full" style={{ background: opcion.color }} />}
            {opcion.texto}
          </button>
        )
      })}
    </div>
  )
}
