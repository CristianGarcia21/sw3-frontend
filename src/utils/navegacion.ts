import type { NombreIcono } from '../components/ui/Icono'
import type { Rol } from '../types'

export interface OpcionMenu {
  ruta: string
  texto: string
  icono: NombreIcono
}

// Rutas de la tabla "Rutas de la aplicación" del README
export const RUTAS = {
  registrarCaso: '/casos/nuevo',
  misCasos: '/mis-casos',
  detalleMiCaso: '/mis-casos/:id',
  bandeja: '/bandeja',
  detalleCaso: '/casos/:id',
  porValidar: '/validacion',
  indicadores: '/admin/indicadores',
  categorias: '/admin/categorias',
  /** Galería del sistema de diseño (docs/08-diseno.md). No sale en el menú */
  componentes: '/componentes',
} as const

export const MENU_POR_ROL: Record<Rol, OpcionMenu[]> = {
  SOLICITANTE: [
    { ruta: RUTAS.registrarCaso, texto: 'Registrar caso', icono: 'mas' },
    { ruta: RUTAS.misCasos, texto: 'Mis casos', icono: 'lista' },
  ],
  AGENTE: [{ ruta: RUTAS.bandeja, texto: 'Bandeja', icono: 'bandeja' }],
  VALIDADOR: [{ ruta: RUTAS.porValidar, texto: 'Por validar', icono: 'validar' }],
  ADMINISTRADOR: [
    { ruta: RUTAS.bandeja, texto: 'Casos', icono: 'bandeja' },
    { ruta: RUTAS.indicadores, texto: 'Indicadores', icono: 'indicadores' },
    { ruta: RUTAS.categorias, texto: 'Categorías', icono: 'etiqueta' },
  ],
}

/** Pantalla a la que lleva "/" según el rol */
export function rutaInicial(rol: Rol): string {
  return MENU_POR_ROL[rol][0].ruta
}
