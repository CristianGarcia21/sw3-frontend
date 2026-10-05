import { Link, NavLink, Outlet, useMatch } from 'react-router'
import { useTema } from '../../hooks/useTema'
import { useUsuarioActual } from '../../hooks/useUsuarioActual'
import { MENU_POR_ROL, RUTAS } from '../../utils/navegacion'
import { Cargando } from '../Cargando'
import { Mensaje } from '../Mensaje'
import { Icono } from '../ui/Icono'
import { Segmentado } from '../ui/Segmentado'
import { SelectorUsuario } from './SelectorUsuario'

export function Layout() {
  const { usuario, cargando, error, recargar } = useUsuarioActual()
  const { tema, cambiar } = useTema()
  // La galería de componentes se ve aunque no haya backend ni usuario elegido
  const enGaleria = useMatch(RUTAS.componentes) !== null
  const menu = usuario ? MENU_POR_ROL[usuario.rol] : []

  return (
    <div className="min-h-svh">
      {/* Navegación en vidrio: barra lateral flotante en escritorio, barra superior en pantallas angostas */}
      <aside className="vidrio z-30 flex gap-3 rounded-[22px] p-2.5 max-md:sticky max-md:top-2 max-md:mx-2 max-md:flex-wrap max-md:items-center md:fixed md:inset-y-2.5 md:left-2.5 md:w-56 md:flex-col md:gap-4 md:pt-4">
        <Link to="/" className="flex items-center gap-2.5 px-2 text-[15px] font-semibold tracking-[-0.01em]">
          <span className="grid size-6.5 place-items-center rounded-lg bg-acento text-[11px] font-bold text-sobre-acento">CH</span>
          CampusHelp
        </Link>

        <nav aria-label="Principal" className="flex gap-0.5 max-md:order-3 max-md:w-full max-md:overflow-x-auto md:flex-col">
          {menu.map((opcion) => (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-[10px] px-2.5 py-1.5 text-[13px] whitespace-nowrap transition-[background-color,scale] duration-150 active:scale-[0.97] ${isActive ? 'bg-tinte font-semibold text-acento' : 'hover:bg-relleno'}`
              }
            >
              <Icono nombre={opcion.icono} className="size-4" />
              {opcion.texto}
            </NavLink>
          ))}
        </nav>

        <div className="flex gap-2 max-md:contents md:mt-auto md:flex-col">
          <Segmentado
            aria-label="Tema"
            completo
            className="max-md:ml-auto"
            valor={tema}
            onChange={cambiar}
            opciones={[
              { valor: 'light', texto: 'Claro' },
              { valor: 'dark', texto: 'Oscuro' },
            ]}
          />
          <div className="max-md:order-2 max-md:w-full">
            <SelectorUsuario />
          </div>
        </div>
      </aside>

      <main className="md:pl-61">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
          {enGaleria ? (
            <Outlet />
          ) : cargando ? (
            <Cargando texto="Cargando usuarios de prueba…" />
          ) : error ? (
            <Mensaje tipo="error" titulo="No se pudo conectar con el backend" accion={{ texto: 'Reintentar', onClick: recargar }}>
              {error.mensaje}
            </Mensaje>
          ) : !usuario ? (
            <Mensaje tipo="info" titulo="Elige un usuario de prueba para empezar">
              Usa el selector de la barra de navegación. Cada usuario tiene un rol distinto (solicitante, agente, validador o administrador).
            </Mensaje>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  )
}
