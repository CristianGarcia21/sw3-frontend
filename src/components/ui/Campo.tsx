import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'

/** Clases del control de texto. Las usan CampoTexto, CampoArea y el botón de ListaDesplegable para verse igual */
export const CLASES_CONTROL =
  'w-full rounded-campo border border-transparent bg-relleno px-3 py-2.25 text-sm text-texto outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-texto-suave hover:bg-relleno-fuerte focus:border-acento focus:bg-superficie focus:ring-4 focus:ring-tinte disabled:cursor-not-allowed disabled:opacity-50'

export const CLASES_CONTROL_ERROR = 'border-urgente ring-4 ring-urgente/15 focus:border-urgente focus:ring-urgente/15'

interface PropsCampo {
  etiqueta: string
  /** id del control, para que la etiqueta lo enfoque al tocarla. La línea de ayuda o error queda con el id `${htmlFor}-nota` */
  htmlFor?: string
  /** Texto de ayuda. Se reemplaza por el error cuando lo hay */
  ayuda?: string
  /** Mensaje de error del campo. Va debajo, nunca en un aviso aparte */
  error?: string
  /** Texto a la derecha, por ejemplo "12/180" */
  contador?: string
  children: ReactNode
}

/** Etiqueta, control y línea de ayuda o error. Envuelve cualquier control: texto, lista desplegable, segmentado */
export function Campo({ etiqueta, htmlFor, ayuda, error, contador, children }: PropsCampo) {
  const idNota = htmlFor ? `${htmlFor}-nota` : undefined
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[12.5px] font-semibold">
        {etiqueta}
      </label>
      {children}
      {(error || ayuda || contador) && (
        <div className="flex min-h-[18px] justify-between gap-2 text-xs text-texto-suave">
          {error ? (
            <span id={idNota} role="alert" className="text-urgente">
              {error}
            </span>
          ) : (
            <span id={idNota}>{ayuda}</span>
          )}
          {contador && <span className="cifras">{contador}</span>}
        </div>
      )}
    </div>
  )
}

type PropsComunes = Pick<PropsCampo, 'etiqueta' | 'ayuda' | 'error'> & {
  /** Muestra "escritos/máximo". Necesita maxLength */
  conContador?: boolean
}

/** Campo de una línea con su etiqueta, ayuda y error */
export function CampoTexto({ etiqueta, ayuda, error, conContador, className = '', id, ...resto }: PropsComunes & InputHTMLAttributes<HTMLInputElement>) {
  const idGenerado = useId()
  const idControl = id ?? idGenerado
  const contador = conContador && resto.maxLength ? `${String(resto.value ?? '').trim().length}/${resto.maxLength}` : undefined
  return (
    <Campo etiqueta={etiqueta} htmlFor={idControl} ayuda={ayuda} error={error} contador={contador}>
      <input id={idControl} aria-invalid={!!error} aria-describedby={error || ayuda ? `${idControl}-nota` : undefined} className={`${CLASES_CONTROL} ${error ? CLASES_CONTROL_ERROR : ''} ${className}`} {...resto} />
    </Campo>
  )
}

/** Campo de varias líneas con su etiqueta, ayuda y error */
export function CampoArea({ etiqueta, ayuda, error, conContador, className = '', id, ...resto }: PropsComunes & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const idGenerado = useId()
  const idControl = id ?? idGenerado
  const escritos = String(resto.value ?? '').trim().length
  const contador = conContador ? (resto.maxLength ? `${escritos}/${resto.maxLength}` : String(escritos)) : undefined
  return (
    <Campo etiqueta={etiqueta} htmlFor={idControl} ayuda={ayuda} error={error} contador={contador}>
      <textarea id={idControl} aria-invalid={!!error} aria-describedby={error || ayuda ? `${idControl}-nota` : undefined} className={`min-h-[88px] resize-y ${CLASES_CONTROL} ${error ? CLASES_CONTROL_ERROR : ''} ${className}`} {...resto} />
    </Campo>
  )
}
