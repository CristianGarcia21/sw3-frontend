import { useState } from 'react'
import { useAsignarCaso } from '../../hooks/useAsignarCaso'
import { useUsuarioActual } from '../../hooks/useUsuarioActual'
import type { Caso } from '../../types'
import { ETIQUETA_ESTADO } from '../../utils/etiquetas'
import { puedeAsignarse } from '../../utils/estados'
import { Boton, Campo, ListaDesplegable, Tarjeta } from '../ui'

interface Props {
  caso: Caso
  onCasoActualizado: (caso: Caso) => void
  /** Vuelve a pedir el caso. Se usa si la asignación falla, por si cambió mientras estaba abierto */
  onRecargar: () => void
}

/**
 * HU-04: el agente se asigna el caso o se lo asigna a otro agente activo.
 * Solo se puede en Pendiente o En análisis (RN-19); en los demás estados queda el nombre del agente, sin botones.
 */
export function PanelAsignacion({ caso, onCasoActualizado, onRecargar }: Props) {
  const { usuario, usuarios } = useUsuarioActual()
  const { asignar, asignando } = useAsignarCaso()
  const [elegido, setElegido] = useState<number | null>(null)

  if (usuario?.rol !== 'AGENTE') return null

  const asignable = puedeAsignarse(caso.estado)
  const soyElAsignado = caso.agente?.id === usuario.id
  const enviando = asignando === caso.id
  // GET /usuarios ya devuelve solo los activos (RN-18); de ahí salen los agentes
  const agentes = usuarios.filter((u) => u.rol === 'AGENTE')
  const destino = agentes.find((a) => a.id === elegido)

  async function asignarA(agente: { id: number; nombre: string }) {
    const actualizado = await asignar(caso, agente)
    if (actualizado) {
      onCasoActualizado(actualizado)
      setElegido(null)
    } else {
      onRecargar()
    }
  }

  return (
    <Tarjeta className="flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold">Asignación</h2>
          <p className="text-[13px] text-texto-suave">
            {caso.agente ? (
              <>
                Agente: <span className="font-medium text-texto">{soyElAsignado ? `${caso.agente.nombre} (tú)` : caso.agente.nombre}</span>
              </>
            ) : (
              'Sin asignar'
            )}
          </p>
        </div>
        {asignable && !soyElAsignado && (
          <Boton icono="usuario" cargando={enviando && elegido === null} disabled={enviando} onClick={() => asignarA(usuario)}>
            Asignarme
          </Boton>
        )}
      </div>

      {asignable ? (
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-56 flex-1">
            <Campo etiqueta="Asignar a…" htmlFor="asignar-agente">
              <ListaDesplegable
                id="asignar-agente"
                placeholder="Elige un agente"
                deshabilitada={enviando}
                opciones={agentes.map((a) => ({
                  valor: a.id,
                  texto: a.id === usuario.id ? `${a.nombre} (tú)` : a.nombre,
                  // Reasignar al mismo agente no cambia nada
                  detalle: a.id === caso.agente?.id ? 'Ya tiene este caso' : undefined,
                  deshabilitada: a.id === caso.agente?.id,
                }))}
                valor={elegido}
                onChange={setElegido}
              />
            </Campo>
          </div>
          <Boton cargando={enviando && elegido !== null} disabled={!destino || enviando} onClick={() => destino && asignarA(destino)}>
            Asignar
          </Boton>
        </div>
      ) : (
        <p className="text-[13px] text-texto-suave">Solo se asigna o reasigna en Pendiente o En análisis. Este caso está {ETIQUETA_ESTADO[caso.estado]}.</p>
      )}
    </Tarjeta>
  )
}
