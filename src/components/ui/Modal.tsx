import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { usePresencia } from '../../hooks/usePresencia'

interface Props {
  abierto: boolean
  /** Se llama con Escape, al tocar fuera o desde el botón Cancelar */
  onCerrar: () => void
  titulo: string
  descripcion?: ReactNode
  children?: ReactNode
  /** Botones del pie, alineados a la derecha. La acción principal va de última */
  pie?: ReactNode
  /** 'alerta' es angosto y centrado, para confirmaciones */
  variante?: 'normal' | 'alerta'
  /** Ícono o adorno sobre el título (solo en 'alerta') */
  encabezado?: ReactNode
}

const ENFOCABLES = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

/** Tarea que bloquea: hoja de vidrio grueso sobre el fondo atenuado. Atrapa el foco y lo devuelve al cerrar */
export function Modal({ abierto, onCerrar, titulo, descripcion, children, pie, variante = 'normal', encabezado }: Props) {
  const { montado, visible } = usePresencia(abierto, 320)
  const hoja = useRef<HTMLDivElement>(null)
  const idTitulo = useId()
  const idDescripcion = useId()

  useEffect(() => {
    if (!abierto) return
    const anterior = document.activeElement as HTMLElement | null
    return () => anterior?.focus()
  }, [abierto])

  useEffect(() => {
    if (!visible) return
    const primero = hoja.current?.querySelector<HTMLElement>('input, textarea, [aria-haspopup="listbox"]') ?? hoja.current?.querySelector<HTMLElement>(ENFOCABLES)
    ;(primero ?? hoja.current)?.focus()
  }, [visible])

  function teclas(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onCerrar()
      return
    }
    if (e.key !== 'Tab') return
    const items = [...(hoja.current?.querySelectorAll<HTMLElement>(ENFOCABLES) ?? [])]
    if (items.length === 0) return
    const primero = items[0]
    const ultimo = items[items.length - 1]
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault()
      ultimo.focus()
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault()
      primero.focus()
    }
  }

  if (!montado) return null
  const alerta = variante === 'alerta'

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4" onKeyDown={teclas}>
      <div aria-hidden="true" onClick={onCerrar} className={`fixed inset-0 bg-velo transition-opacity duration-300 ${visible ? '' : 'opacity-0'}`} />
      <div
        ref={hoja}
        role={alerta ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={descripcion ? idDescripcion : undefined}
        tabIndex={-1}
        className={`vidrio-grueso relative flex w-full flex-col rounded-hoja text-texto outline-none transition-all duration-500 ease-resorte ${alerta ? 'max-w-80 items-center gap-2 px-5 pt-6 pb-4 text-center' : 'max-w-[480px] gap-3.5 px-5.5 pt-5.5 pb-4.5'} ${visible ? 'blur-none' : 'pointer-events-none scale-[0.94] opacity-0 blur-[8px]'}`}
      >
        {encabezado}
        <div>
          <h2 id={idTitulo} className="text-xl leading-tight font-bold tracking-[-0.016em]">
            {titulo}
          </h2>
          {descripcion && <p id={idDescripcion} className="mt-1 text-[13px] text-texto-suave">{descripcion}</p>}
        </div>
        {children}
        {pie && <div className={`flex gap-2 ${alerta ? 'mt-2.5 w-full [&>*]:h-9.5 [&>*]:flex-1' : 'justify-end [&>*]:h-9.5'}`}>{pie}</div>}
      </div>
    </div>,
    document.body,
  )
}
