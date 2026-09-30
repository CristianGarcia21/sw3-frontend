import type { Rol } from '../types'

export interface OpcionMenu {
  ruta: string
  texto: string
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
} as const

export const MENU_POR_ROL: Record<Rol, OpcionMenu[]> = {
  SOLICITANTE: [
    { ruta: RUTAS.registrarCaso, texto: 'Registrar caso' },
    { ruta: RUTAS.misCasos, texto: 'Mis casos' },
  ],
  AGENTE: [{ ruta: RUTAS.bandeja, texto: 'Bandeja' }],
  VALIDADOR: [{ ruta: RUTAS.porValidar, texto: 'Por validar' }],
  ADMINISTRADOR: [
    { ruta: RUTAS.bandeja, texto: 'Casos' },
    { ruta: RUTAS.indicadores, texto: 'Indicadores' },
    { ruta: RUTAS.categorias, texto: 'Categorías' },
  ],
}

/** Pantalla a la que lleva "/" según el rol */
export function rutaInicial(rol: Rol): string {
  return MENU_POR_ROL[rol][0].ruta
}
