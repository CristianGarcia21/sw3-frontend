import { Navigate } from 'react-router'
import { useUsuarioActual } from '../hooks/useUsuarioActual'
import { rutaInicial } from '../utils/navegacion'

/** "/" lleva a la primera pantalla del menú del rol */
export function Inicio() {
  const { usuario } = useUsuarioActual()
  return usuario ? <Navigate to={rutaInicial(usuario.rol)} replace /> : null
}
