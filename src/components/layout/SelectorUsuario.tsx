import { useUsuarioActual } from '../../hooks/useUsuarioActual'
import { ETIQUETA_ROL } from '../../utils/etiquetas'

export function SelectorUsuario() {
  const { usuarios, usuario, cargando, error, seleccionar, recargar } = useUsuarioActual()

  if (cargando) return <span className="text-sm text-slate-300">Cargando usuarios…</span>

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-red-300" title={error.mensaje}>
          No se pudieron cargar los usuarios
        </span>
        <button type="button" onClick={recargar} className="rounded-md border border-slate-500 px-2 py-1 text-xs hover:bg-slate-700">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-slate-300 sm:inline">Usuario de prueba</span>
      <select
        value={usuario?.id ?? ''}
        onChange={(e) => seleccionar(e.target.value ? Number(e.target.value) : null)}
        className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1.5 text-white focus:ring-2 focus:ring-sky-400 focus:outline-none"
      >
        <option value="">Elige un usuario…</option>
        {usuarios.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nombre} · {ETIQUETA_ROL[u.rol]}
          </option>
        ))}
      </select>
    </label>
  )
}
