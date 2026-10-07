import { useState } from 'react'
import { ApiError, type ApiError as TipoApiError } from '../../api/client'
import { cambiarEstado } from '../../api/casos'
import { useAvisos } from '../../hooks/useAvisos'
import { useUsuarioActual } from '../../hooks/useUsuarioActual'
import type { Caso } from '../../types'
import { ETIQUETA_ESTADO } from '../../utils/etiquetas'
import { obtenerTransicionManual } from '../../utils/estados'
import { Boton, Confirmacion, Tarjeta } from '../ui'

interface Props {
  caso: Caso
  onCasoActualizado: (caso: Caso) => void
}

function tituloError(error: TipoApiError): string {
  switch (error.error) {
    case 'TRANSICION_INVALIDA':
    case 'CASO_CERRADO':
      return 'No se pudo cambiar el estado'
    case 'ROL_NO_PERMITIDO':
    case 'NO_ES_AGENTE_ASIGNADO':
      return 'No tienes permiso para cambiar el estado'
    case 'SIN_AGENTE_ASIGNADO':
      return 'No se puede iniciar la atención'
    case 'SIN_SOLUCION':
      return 'No se puede enviar a validación'
    case 'SIN_CONEXION':
      return 'No se pudo conectar con el servidor'
    default:
      return 'No se pudo cambiar el estado'
  }
}

export function AccionesEstado({ caso, onCasoActualizado }: Props) {
  const { usuario } = useUsuarioActual()
  const avisos = useAvisos()
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const transicion = obtenerTransicionManual(caso.estado)

  if (usuario?.rol !== 'AGENTE' || !transicion) return null

  async function confirmarCambio() {
    if (!transicion || usuario?.rol !== 'AGENTE') return
    setEnviando(true)
    try {
      const casoActualizado = await cambiarEstado(caso.id, transicion.estadoSiguiente)
      onCasoActualizado(casoActualizado)
      setConfirmacionAbierta(false)
      avisos.exito(`Caso #${caso.id} actualizado`, `Ahora está ${ETIQUETA_ESTADO[casoActualizado.estado]}.`)
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        avisos.error(tituloError(e), e.mensaje)
      } else {
        avisos.error('No se pudo cambiar el estado', 'Ocurrió un error inesperado al actualizar el caso.')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Tarjeta className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="text-sm font-semibold">Siguiente paso</h2>
          <p className="mt-1 text-[13px] text-texto-suave">Actualiza el estado del caso cuando corresponda.</p>
        </div>
        <Boton variante="primario" onClick={() => setConfirmacionAbierta(true)}>
          {transicion.accion}
        </Boton>
      </Tarjeta>
      <Confirmacion
        abierta={confirmacionAbierta}
        titulo={`¿${transicion.accion} el caso #${caso.id}?`}
        mensaje={transicion.mensajeConfirmacion}
        textoConfirmar={transicion.accion}
        cargando={enviando}
        onConfirmar={confirmarCambio}
        onCancelar={() => {
          if (!enviando) setConfirmacionAbierta(false)
        }}
      />
    </>
  )
}
