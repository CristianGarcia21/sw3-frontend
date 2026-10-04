import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import type { FocusEventHandler } from 'react'
import { createPortal } from 'react-dom'
import { usePresencia } from '../../hooks/usePresencia'
import { CLASES_CONTROL, CLASES_CONTROL_ERROR } from './Campo'
import { Icono } from './Icono'

export interface Opcion<T> {
  valor: T
  texto: string
  /** Segunda línea en gris, por ejemplo el rol del usuario */
  detalle?: string
  /** Se ve pero no se puede elegir, por ejemplo un agente inactivo */
  deshabilitada?: boolean
  /** Color del punto a la izquierda, por ejemplo 'var(--estado-cerrada)' */
  color?: string
  /** Título de sección. Las opciones seguidas con el mismo grupo quedan bajo un solo título */
  grupo?: string
}

type Variante = 'campo' | 'capsula' | 'capsula-vidrio' | 'discreta'

interface PropsComunes<T> {
  opciones: Opcion<T>[]
  deshabilitada?: boolean
  id?: string
  'aria-label'?: string
  className?: string
  onBlur?: FocusEventHandler<HTMLButtonElement>
}

interface PropsBase<T> extends PropsComunes<T> {
  variante: Variante
  multiple: boolean
  elegidas: T[]
  onElegir: (valor: T) => void
  invalida?: boolean
  /** Contenido del botón */
  children: ReactNode
  resaltado?: boolean
}

interface Posicion {
  left: number
  minWidth: number
  top?: number
  bottom?: number
  arriba: boolean
}

const ALTO_MAXIMO = 288

const CLASES_BOTON: Record<Variante, string> = {
  campo: `${CLASES_CONTROL} flex cursor-pointer items-center gap-2 text-left aria-expanded:border-acento aria-expanded:bg-superficie aria-expanded:ring-4 aria-expanded:ring-tinte`,
  capsula: 'inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-full bg-relleno pr-2.5 pl-3.5 text-[13px] font-medium hover:bg-relleno-fuerte disabled:cursor-not-allowed disabled:opacity-50',
  'capsula-vidrio': 'vidrio inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-full pr-2.5 pl-3.5 text-[13px] font-medium disabled:cursor-not-allowed disabled:opacity-50',
  discreta: 'flex w-full cursor-pointer items-center gap-2 rounded-[14px] px-2 py-1.75 text-left hover:bg-relleno aria-expanded:bg-relleno',
}

/** Botón y lista en vidrio. La usan ListaDesplegable y FiltroMultiple; no se usa directo */
function ListaBase<T extends string | number>({ opciones, deshabilitada = false, id, className = '', variante, multiple, elegidas, onElegir, invalida = false, children, resaltado = false, onBlur, ...resto }: PropsBase<T>) {
  const [abierta, setAbierta] = useState(false)
  const [posicion, setPosicion] = useState<Posicion | null>(null)
  const boton = useRef<HTMLButtonElement>(null)
  const lista = useRef<HTMLDivElement>(null)
  const { montado, visible } = usePresencia(abierta, 220)

  function abrir() {
    if (deshabilitada || !boton.current) return
    // Se calcula dónde cabe: hacia abajo, o hacia arriba si no hay espacio
    const r = boton.current.getBoundingClientRect()
    const alto = Math.min(ALTO_MAXIMO, opciones.length * 38 + 40)
    const arriba = r.bottom + alto + 12 > window.innerHeight && r.top > alto
    setPosicion({ left: r.left, minWidth: r.width, arriba, ...(arriba ? { bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6 }) })
    setAbierta(true)
  }

  function cerrar(devolverFoco = false) {
    setAbierta(false)
    if (devolverFoco) boton.current?.focus()
  }

  // Si la lista no cabe hacia la derecha, se corre hasta quedar dentro de la pantalla
  useLayoutEffect(() => {
    if (!montado || !posicion || !lista.current) return
    const sobra = posicion.left + lista.current.offsetWidth - (window.innerWidth - 8)
    lista.current.style.left = `${sobra > 0 ? Math.max(8, posicion.left - sobra) : posicion.left}px`
  }, [montado, posicion])

  // Al abrir, el foco va a la opción elegida o a la primera que se pueda elegir
  useEffect(() => {
    if (!visible) return
    const destino = lista.current?.querySelector<HTMLElement>('[aria-selected="true"]:not(:disabled)') ?? lista.current?.querySelector<HTMLElement>('[role="option"]:not(:disabled)')
    destino?.focus({ preventScroll: true })
  }, [visible])

  // Se cierra al tocar fuera, al desplazar la página o al cambiar el tamaño de la ventana
  useEffect(() => {
    if (!abierta) return
    const fuera = (e: Event) => {
      const destino = e.target as Node
      if (!boton.current?.contains(destino) && !lista.current?.contains(destino)) setAbierta(false)
    }
    const alDesplazar = (e: Event) => {
      if (!lista.current?.contains(e.target as Node)) setAbierta(false)
    }
    const alRedimensionar = () => setAbierta(false)
    document.addEventListener('pointerdown', fuera)
    window.addEventListener('scroll', alDesplazar, true)
    window.addEventListener('resize', alRedimensionar)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      window.removeEventListener('scroll', alDesplazar, true)
      window.removeEventListener('resize', alRedimensionar)
    }
  }, [abierta])

  function teclasDeLista(e: KeyboardEvent<HTMLDivElement>) {
    const items = [...(lista.current?.querySelectorAll<HTMLElement>('[role="option"]:not(:disabled)') ?? [])]
    const actual = items.indexOf(document.activeElement as HTMLElement)
    const ir = (i: number) => {
      e.preventDefault()
      items[Math.max(0, Math.min(i, items.length - 1))]?.focus()
    }
    if (e.key === 'ArrowDown') ir(actual + 1)
    else if (e.key === 'ArrowUp') ir(actual - 1)
    else if (e.key === 'Home') ir(0)
    else if (e.key === 'End') ir(items.length - 1)
    else if (e.key === 'Escape') {
      // Que no cierre también el modal que la contiene
      e.stopPropagation()
      cerrar(true)
    } else if (e.key === 'Tab') {
      // La lista vive al final del <body>: sin esto el foco saltaría fuera del modal que la contiene
      e.preventDefault()
      cerrar(true)
    }
  }

  return (
    <>
      <button
        ref={boton}
        id={id}
        type="button"
        disabled={deshabilitada}
        aria-haspopup="listbox"
        aria-expanded={abierta}
        aria-invalid={invalida || undefined}
        aria-label={resto['aria-label']}
        aria-describedby={id ? `${id}-nota` : undefined}
        onClick={() => (abierta ? cerrar() : abrir())}
        onBlur={(e) => {
          if (e.relatedTarget instanceof Node && lista.current?.contains(e.relatedTarget)) return
          onBlur?.(e)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            abrir()
          }
        }}
        className={`${CLASES_BOTON[variante]} ${invalida ? CLASES_CONTROL_ERROR : ''} ${resaltado ? 'font-semibold text-acento' : ''} ${className}`}
      >
        {children}
        <Icono nombre={variante === 'campo' || variante === 'discreta' ? 'selector' : 'abajo'} className="size-3.75 text-texto-suave" />
      </button>

      {montado &&
        posicion &&
        createPortal(
          <div
            ref={lista}
            role="listbox"
            aria-multiselectable={multiple || undefined}
            onKeyDown={teclasDeLista}
            style={{ left: posicion.left, top: posicion.top, bottom: posicion.bottom, minWidth: posicion.minWidth, maxHeight: ALTO_MAXIMO }}
            className={`vidrio-grueso fixed z-70 w-max max-w-80 overflow-y-auto rounded-2xl p-1.25 text-texto transition-all duration-300 ease-resorte ${posicion.arriba ? 'origin-bottom-left' : 'origin-top-left'} ${visible ? 'blur-none' : 'pointer-events-none scale-[0.94] opacity-0 blur-[5px]'}`}
          >
            {opciones.map((opcion, i) => {
              const elegida = elegidas.includes(opcion.valor)
              return (
                <div key={String(opcion.valor)}>
                  {opcion.grupo && opcion.grupo !== opciones[i - 1]?.grupo && (
                    <p className={`px-2.5 pt-2 pb-1 text-[11px] font-semibold text-texto-suave ${i > 0 ? 'mt-1 border-t border-texto/10 pt-2.5' : ''}`}>{opcion.grupo}</p>
                  )}
                  <button
                    type="button"
                    role="option"
                    aria-selected={elegida}
                    disabled={opcion.deshabilitada}
                    onClick={() => {
                      onElegir(opcion.valor)
                      if (!multiple) cerrar(true)
                    }}
                    className="group flex w-full cursor-pointer items-center gap-2 rounded-[10px] py-1.75 pr-3 pl-2 text-left text-[13.5px] outline-none hover:bg-acento hover:text-sobre-acento focus-visible:bg-acento focus-visible:text-sobre-acento disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-texto"
                  >
                    <Icono nombre="check" className={`size-3.75 ${elegida ? '' : 'invisible'}`} />
                    {opcion.color && <span className="size-2 shrink-0 rounded-full" style={{ background: opcion.color }} />}
                    <span className="flex flex-col leading-tight">
                      {opcion.texto}
                      {opcion.detalle && <small className="text-[11.5px] text-texto-suave group-hover:text-current group-focus-visible:text-current group-disabled:text-texto-suave">{opcion.detalle}</small>}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>,
          document.body,
        )}
    </>
  )
}

interface PropsLista<T> extends PropsComunes<T> {
  valor: T | null
  onChange: (valor: T) => void
  placeholder?: string
  /** Marca el control en rojo. El mensaje va en el <Campo> que lo envuelve */
  invalida?: boolean
  /** 'campo' para formularios; 'discreta' sin fondo, para la navegación */
  variante?: 'campo' | 'discreta'
  /** Reemplaza el texto del botón, por ejemplo con avatar y nombre */
  contenido?: ReactNode
}

/**
 * Lista desplegable de una sola opción. Reemplaza al <select> nativo para que las opciones se vean igual en todos los navegadores.
 * Se maneja con teclado: flechas, Inicio, Fin, Enter y Escape.
 */
export function ListaDesplegable<T extends string | number>({ valor, onChange, placeholder = 'Elige una opción', variante = 'campo', contenido, ...resto }: PropsLista<T>) {
  const elegida = resto.opciones.find((o) => o.valor === valor)
  return (
    <ListaBase {...resto} variante={variante} multiple={false} elegidas={valor === null ? [] : [valor]} onElegir={onChange}>
      {contenido ?? <span className={`min-w-0 flex-1 truncate ${elegida ? '' : 'text-texto-suave'}`}>{elegida?.texto ?? placeholder}</span>}
    </ListaBase>
  )
}

interface PropsFiltro<T> extends PropsComunes<T> {
  /** Nombre del filtro, por ejemplo "Prioridad" */
  etiqueta: string
  valor: T[]
  onChange: (valor: T[]) => void
  /** 'vidrio' cuando la cápsula flota en una barra sobre el contenido */
  variante?: 'solida' | 'vidrio'
}

/** Filtro en cápsula con selección múltiple. La lista se queda abierta mientras se marcan opciones */
export function FiltroMultiple<T extends string | number>({ etiqueta, valor, onChange, variante = 'solida', ...resto }: PropsFiltro<T>) {
  const elegidas = resto.opciones.filter((o) => valor.includes(o.valor))
  const texto = elegidas.length === 0 ? etiqueta : elegidas.length === 1 ? `${etiqueta}: ${elegidas[0].texto}` : `${etiqueta} · ${elegidas.length}`
  return (
    <ListaBase
      {...resto}
      variante={variante === 'vidrio' ? 'capsula-vidrio' : 'capsula'}
      multiple
      elegidas={valor}
      resaltado={elegidas.length > 0}
      onElegir={(v) => onChange(valor.includes(v) ? valor.filter((x) => x !== v) : [...valor, v])}
    >
      <span className="truncate">{texto}</span>
    </ListaBase>
  )
}
