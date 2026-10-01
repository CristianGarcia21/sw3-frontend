import type { ButtonHTMLAttributes } from 'react'
import { Icono, type NombreIcono } from './Icono'

type Variante = 'primario' | 'secundario' | 'texto' | 'destructivo' | 'vidrio' | 'vidrio-acento'

const VARIANTES: Record<Variante, string> = {
  primario: 'bg-acento text-sobre-acento hover:brightness-110',
  secundario: 'bg-relleno text-texto hover:bg-relleno-fuerte',
  texto: 'text-acento hover:bg-relleno',
  destructivo: 'bg-urgente/12 text-urgente hover:bg-urgente/16',
  vidrio: 'vidrio text-texto',
  'vidrio-acento': 'vidrio-acento',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  icono?: NombreIcono
  /** Muestra el giro de carga y deshabilita el botón */
  cargando?: boolean
  /** Botón circular solo con ícono. Requiere aria-label */
  soloIcono?: boolean
}

/** Botón en cápsula. Responde al presionar, no al soltar */
export function Boton({ variante = 'secundario', icono, cargando = false, soloIcono = false, className = '', children, disabled, type = 'button', ...resto }: Props) {
  return (
    <button
      type={type}
      disabled={disabled || cargando}
      className={`inline-flex h-8.5 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-[transform,background-color,filter,opacity] duration-150 ease-out active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${soloIcono ? 'w-8.5' : 'px-4'} ${VARIANTES[variante]} ${className}`}
      {...resto}
    >
      {cargando ? <span className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" /> : icono && <Icono nombre={icono} />}
      {!soloIcono && children}
    </button>
  )
}
