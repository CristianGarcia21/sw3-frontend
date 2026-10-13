const TRAZOS = {
  bandeja: 'M3 13h5l1.5 3h5L16 13h5M5.5 5h13l2.5 8v6H3v-6z',
  lista: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  validar: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12.5l2.8 2.8L16 10',
  indicadores: 'M4 20V11M10 20V5M16 20v-6M21 20H3',
  etiqueta: 'M3 12V4h8l10 10-8 8zM7.5 8.5h.01',
  buscar: 'M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM20 20l-4.2-4.2',
  mas: 'M12 5v14M5 12h14',
  cerrar: 'M6 6l12 12M18 6 6 18',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  usuario: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6',
  devolver: 'M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
  selector: 'm8 9 4-4 4 4M8 15l4 4 4-4',
  abajo: 'm7 10 5 5 5-5',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 7.5v.5',
  alerta: 'M12 4 2.5 20h19zM12 10v4M12 17v.5',
  filtros: 'M4 6h16M7 12h10M10 18h4',
  flecha: 'M5 12h14M13 6l6 6-6 6',
  herramienta: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z',
  sol: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  luna: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z',
} as const

export type NombreIcono = keyof typeof TRAZOS

interface Props {
  nombre: NombreIcono
  /** Clases de tamaño y color. Por defecto 17 px y el color del texto que lo rodea */
  className?: string
}

/** Íconos de trazo del sistema. Son decorativos: el texto o el aria-label del control dice qué hace */
export function Icono({ nombre, className = 'size-4.25' }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`shrink-0 fill-none stroke-current ${className}`}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={TRAZOS[nombre]} />
    </svg>
  )
}
