import { useContext } from 'react'
import { AvisosContext } from '../context/AvisosContext'

/**
 * Avisos flotantes para contar el resultado de una acción.
 * const avisos = useAvisos(); avisos.exito('Caso #12 registrado', 'Quedó en Pendiente.')
 */
export function useAvisos() {
  const valor = useContext(AvisosContext)
  if (!valor) throw new Error('useAvisos debe usarse dentro de <AvisosProvider>')
  return valor
}
