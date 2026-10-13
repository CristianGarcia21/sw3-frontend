import { useContext } from 'react'
import { UsuarioActualContext } from '../context/UsuarioActualContext'

/** Usuario de prueba elegido en el selector y la lista de usuarios disponibles */
export function useUsuarioActual() {
  const valor = useContext(UsuarioActualContext)
  if (!valor) throw new Error('useUsuarioActual debe usarse dentro de <UsuarioActualProvider>')
  return valor
}
