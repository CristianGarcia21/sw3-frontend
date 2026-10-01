interface Props {
  activo: boolean
  onChange: (activo: boolean) => void
  'aria-label': string
  deshabilitado?: boolean
}

/** Interruptor para activar o desactivar algo al instante, por ejemplo una categoría */
export function Interruptor({ activo, onChange, deshabilitado = false, ...resto }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={resto['aria-label']}
      disabled={deshabilitado}
      onClick={() => onChange(!activo)}
      className={`group relative h-6.5 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${activo ? 'bg-acento' : 'bg-texto/16'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5.5 w-5.5 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.25)] transition-[translate,width] duration-500 ease-resorte group-active:w-6.5 ${activo ? 'translate-x-4.5 group-active:translate-x-3.5' : ''}`}
      />
    </button>
  )
}
