import { useUsuarioActual } from '../../hooks/useUsuarioActual'
import { ETIQUETA_ROL } from '../../utils/etiquetas'
import { Boton } from '../ui/Boton'
import { ListaDesplegable } from '../ui/ListaDesplegable'

const iniciales = (nombre: string) =>
  nombre
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export function SelectorUsuario() {
  const { usuarios, usuario, cargando, error, seleccionar, recargar } = useUsuarioActual()

  if (cargando) return <span className="px-2 text-[13px] text-texto-suave">Cargando usuarios…</span>

  if (error) {
    return (
      <div className="flex flex-col items-start gap-2 px-2 text-[13px]">
        <span className="text-urgente" title={error.mensaje}>
          No se pudieron cargar los usuarios
        </span>
        <Boton onClick={recargar}>Reintentar</Boton>
      </div>
    )
  }

  return (
    <ListaDesplegable
      aria-label="Usuario de prueba"
      opciones={usuarios.map((u) => ({ valor: u.id, texto: u.nombre, detalle: ETIQUETA_ROL[u.rol] }))}
      valor={usuario?.id ?? null}
      onChange={seleccionar}
      variante="discreta"
      contenido={
        usuario ? (
          <>
            <span className="grid size-7.5 shrink-0 place-items-center rounded-full bg-tinte text-[11px] font-semibold text-acento">{iniciales(usuario.nombre)}</span>
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-[13px] font-medium">{usuario.nombre}</span>
              <span className="truncate text-[11px] text-texto-suave">{ETIQUETA_ROL[usuario.rol]} · usuario de prueba</span>
            </span>
          </>
        ) : (
          <span className="min-w-0 flex-1 truncate text-[13px] font-medium">Elige un usuario de prueba</span>
        )
      }
    />
  )
}
