import { createContext } from 'react'

export type Tema = 'light' | 'dark'

export interface TemaValor {
  tema: Tema
  cambiar: (tema: Tema) => void
}

/** Clave de localStorage del tema. index.html la lee antes de pintar para que no haya parpadeo */
export const CLAVE_TEMA = 'campushelp.tema'

export const TemaContext = createContext<TemaValor | null>(null)
