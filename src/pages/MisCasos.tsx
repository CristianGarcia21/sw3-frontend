import { useEffect, useState } from 'react'
import { generatePath, Link, useNavigate } from 'react-router'
import { ApiError } from '../api/client'
import { listarCasos } from '../api/casos'
import { EstadoBadge } from '../components/EstadoBadge'
import { Mensaje } from '../components/Mensaje'
import { PrioridadBadge } from '../components/PrioridadBadge'
import { Boton, Esqueleto, EstadoVacio, Tarjeta } from '../components/ui'
import { useUsuarioActual } from '../hooks/useUsuarioActual'
import type { Caso } from '../types'
import { ETIQUETA_TIPO, formatearFecha } from '../utils/etiquetas'
import { RUTAS } from '../utils/navegacion'

// Lo cargado queda marcado con el usuario al que pertenece: al cambiar de usuario en el
// selector no se muestran los casos del anterior mientras llegan los del nuevo
interface Cargado<T> {
  usuarioId: number | undefined
  valor: T
}

const COLUMNAS = ['ID', 'Título', 'Tipo', 'Área / Categoría', 'Prioridad', 'Estado', 'Fecha de creación']

/** HU-02: casos del solicitante actual. El backend ya filtra por él (RN-20), aquí no se filtra nada */
export function MisCasos() {
  const { usuario } = useUsuarioActual()
  const usuarioId = usuario?.id
  const navigate = useNavigate()
  const [resultado, setResultado] = useState<Cargado<Caso[]> | null>(null)
  const [error, setError] = useState<Cargado<ApiError> | null>(null)
  const [actualizando, setActualizando] = useState(false)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let cancelado = false
    listarCasos({ orden: 'fecha_desc' })
      .then((casos) => {
        if (cancelado) return
        setResultado({ usuarioId, valor: casos })
        setError(null)
      })
      .catch((e: unknown) => {
        if (cancelado) return
        setError({ usuarioId, valor: e instanceof ApiError ? e : new ApiError(0, 'ERROR_INTERNO', 'No se pudieron cargar tus casos') })
      })
      .finally(() => {
        if (!cancelado) setActualizando(false)
      })
    return () => {
      cancelado = true
    }
  }, [usuarioId, intento])

  const recargar = () => {
    setActualizando(true)
    setIntento((n) => n + 1)
  }

  const casos = resultado && resultado.usuarioId === usuarioId ? resultado.valor : null
  const fallo = error && error.usuarioId === usuarioId ? error.valor : null

  let resumen = 'Los casos que registraste y en qué estado van.'
  if (casos && casos.length > 0) resumen = `${casos.length} ${casos.length === 1 ? 'caso' : 'casos'}`

  let contenido = null
  if (casos === null) {
    // Si falló la primera carga solo queda el mensaje de error
    if (!fallo) {
      contenido = (
        <Tarjeta className="p-5">
          <Esqueleto lineas={5} />
        </Tarjeta>
      )
    }
  } else if (casos.length === 0) {
    contenido = (
      <Tarjeta>
        <EstadoVacio
          icono="lista"
          titulo="Todavía no has registrado casos"
          accion={
            <Boton variante="primario" icono="mas" onClick={() => navigate(RUTAS.registrarCaso)}>
              Registrar caso
            </Boton>
          }
        >
          Cuando registres un incidente o una solicitud de servicio, aparecerá aquí con su estado.
        </EstadoVacio>
      </Tarjeta>
    )
  } else {
    contenido = <TablaCasos casos={casos} />
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[34px] leading-tight font-bold tracking-[-0.028em]">Mis casos</h1>
          <p className="mt-1 text-texto-suave">{resumen}</p>
        </div>
        <Boton cargando={actualizando} onClick={recargar}>
          Actualizar
        </Boton>
      </header>

      {fallo && (
        <Mensaje tipo="error" titulo="No se pudieron cargar tus casos" accion={{ texto: 'Reintentar', onClick: recargar }}>
          {fallo.mensaje}
        </Mensaje>
      )}

      {contenido}
    </section>
  )
}

function TablaCasos({ casos }: { casos: Caso[] }) {
  return (
    <Tarjeta className="overflow-x-auto">
      <table className="w-full min-w-200 text-left">
        <thead>
          <tr>
            {COLUMNAS.map((columna) => (
              <th key={columna} scope="col" className="px-4.5 py-3 text-[11px] font-semibold whitespace-nowrap text-texto-suave">
                {columna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {casos.map((caso) => (
            <tr key={caso.id} className="relative border-t border-linea transition-colors duration-150 ease-resorte hover:bg-relleno">
              <td className="cifras px-4.5 py-3 text-texto-suave">#{caso.id}</td>
              <td className="max-w-80 px-4.5 py-3">
                {/* El enlace cubre toda la fila: se abre con un clic en cualquier celda y queda una sola parada de tabulación */}
                <Link
                  to={generatePath(RUTAS.detalleMiCaso, { id: String(caso.id) })}
                  className="line-clamp-2 font-medium outline-none after:absolute after:inset-0 focus-visible:after:rounded-campo focus-visible:after:ring-2 focus-visible:after:ring-acento focus-visible:after:ring-inset"
                >
                  {caso.titulo}
                </Link>
              </td>
              <td className="px-4.5 py-3 whitespace-nowrap">{ETIQUETA_TIPO[caso.tipo]}</td>
              <td className="px-4.5 py-3">
                <span className="block">{caso.area.nombre}</span>
                <span className="block text-[13px] text-texto-suave">{caso.categoria.nombre}</span>
              </td>
              <td className="px-4.5 py-3">
                <PrioridadBadge prioridad={caso.prioridad} />
              </td>
              <td className="px-4.5 py-3">
                <EstadoBadge estado={caso.estado} />
              </td>
              <td className="cifras px-4.5 py-3 whitespace-nowrap text-texto-suave">{formatearFecha(caso.fechaCreacion)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Tarjeta>
  )
}
