import { Link, NavLink, Outlet } from 'react-router'
import { useUsuarioActual } from '../../hooks/useUsuarioActual'
import { MENU_POR_ROL } from '../../utils/navegacion'
import { Cargando } from '../Cargando'
import { Mensaje } from '../Mensaje'
import { SelectorUsuario } from './SelectorUsuario'

export function Layout() {
  const { usuario, cargando, error, recargar } = useUsuarioActual()
  const menu = usuario ? MENU_POR_ROL[usuario.rol] : []

  return (
    <div className="min-h-svh">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-semibold tracking-tight">
              Campus<span className="text-sky-400">Help</span>
            </Link>
            <nav className="flex gap-1">
              {menu.map((opcion) => (
                <NavLink
                  key={opcion.ruta}
                  to={opcion.ruta}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-1.5 text-sm font-medium ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
                  }
                >
                  {opcion.texto}
                </NavLink>
              ))}
            </nav>
          </div>
          <SelectorUsuario />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {cargando ? (
          <Cargando texto="Cargando usuarios de prueba…" />
        ) : error ? (
          <Mensaje tipo="error" titulo="No se pudo conectar con el backend" accion={{ texto: 'Reintentar', onClick: recargar }}>
            {error.mensaje}
          </Mensaje>
        ) : !usuario ? (
          <Mensaje tipo="info" titulo="Elige un usuario de prueba para empezar">
            Usa el selector de la esquina superior derecha. Cada usuario tiene un rol distinto (solicitante, agente, validador o administrador).
          </Mensaje>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}
