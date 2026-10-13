import { createContext } from 'react'

export type TipoAviso = 'exito' | 'info' | 'advertencia' | 'error'

/** Botón opcional dentro del aviso, por ejemplo "Ver" o "Reintentar" */
export interface AccionAviso {
  texto: string
  onClick: () => void
}

export interface Aviso {
  id: number
  tipo: TipoAviso
  titulo: string
  texto?: string
  accion?: AccionAviso
}

type Mostrar = (titulo: string, texto?: string, accion?: AccionAviso) => void

export interface AvisosValor {
  exito: Mostrar
  info: Mostrar
  advertencia: Mostrar
  error: Mostrar
}

export const AvisosContext = createContext<AvisosValor | null>(null)
