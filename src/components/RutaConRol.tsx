import type { ReactNode } from 'react'
import { useUsuarioActual } from '../hooks/useUsuarioActual'
import type { Rol } from '../types'
import { Mensaje } from './Mensaje'

/** Muestra la pantalla solo a los roles indicados. El backend igual valida los permisos. */
export function RutaConRol({ roles, children }: { roles: Rol[]; children: ReactNode }) {
  const { usuario } = useUsuarioActual()
  if (!usuario || !roles.includes(usuario.rol)) {
    return (
      <Mensaje tipo="error" titulo="No tienes acceso a esta pantalla">
        Cambia a un usuario de prueba con el rol adecuado en el selector de arriba.
      </Mensaje>
    )
  }
  return <>{children}</>
}
