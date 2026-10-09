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
  /** RN-13: el caso En atención todavía no tiene una solución vigente registrada (HU-06) */
  sinSolucion?: boolean
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

export function AccionesEstado({ caso, onCasoActualizado, sinSolucion = false }: Props) {
  const { usuario } = useUsuarioActual()
  const avisos = useAvisos()
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const transicion = obtenerTransicionManual(caso.estado)
  // RN-11: para pasar a En atención el caso debe tener agente. El backend igual lo valida
  const faltaAgente = caso.estado === 'EN_ANALISIS' && !caso.agente
  // RN-13: para enviar a validación debe haber una solución registrada. El backend igual lo valida
  const faltaSolucion = caso.estado === 'EN_ATENCION' && sinSolucion
  let nota = 'Actualiza el estado del caso cuando corresponda.'
  if (faltaAgente) nota = 'Primero asigna un agente.'
  if (faltaSolucion) nota = 'Registra la solución antes de enviar a validación.'

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
          <p id="siguiente-paso-nota" className="mt-1 text-[13px] text-texto-suave">
            {nota}
          </p>
        </div>
        <Boton variante="primario" disabled={faltaAgente || faltaSolucion} aria-describedby="siguiente-paso-nota" onClick={() => setConfirmacionAbierta(true)}>
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
