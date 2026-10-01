import { useContext } from 'react'
import { TemaContext } from '../context/TemaContext'

/** Tema actual ('light' o 'dark') y la función para cambiarlo */
export function useTema() {
  const valor = useContext(TemaContext)
  if (!valor) throw new Error('useTema debe usarse dentro de <TemaProvider>')
  return valor
}
