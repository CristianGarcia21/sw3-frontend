import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ApiError, type ApiError as TipoApiError } from '../../api/client'
import { validarCaso } from '../../api/casos'
import { useAvisos } from '../../hooks/useAvisos'
import { atencionVigente } from '../../hooks/useHistorial'
import { useUsuarioActual } from '../../hooks/useUsuarioActual'
import type { CasoDetalle, EventoHistorialItem } from '../../types'
import { formatearFecha } from '../../utils/etiquetas'
import { RUTAS } from '../../utils/navegacion'
import { Boton, CampoArea, Confirmacion, Esqueleto, Modal, Tarjeta } from '../ui'

interface Props {
  caso: CasoDetalle
  /** Historial del caso (null mientras carga): de ahí salen el agente y la fecha de la solución vigente */
  eventos: EventoHistorialItem[] | null
  /** Vuelve a pedir el caso. Se usa si la validación falla porque el caso cambió mientras estaba abierto */
  onRecargar: () => void
}

// RN-15: mínimo 10 caracteres sin contar espacios al inicio y al final, igual que el backend
const MINIMO = 10

function validarComentario(texto: string): string | undefined {
  const largo = texto.trim().length
  if (largo === 0) return 'Escribe qué falta para dar el caso por resuelto.'
  if (largo < MINIMO) return `El comentario debe tener al menos ${MINIMO} caracteres.`
  return undefined
}

function tituloError(error: TipoApiError): string {
  switch (error.error) {
    case 'VALIDADOR_ES_AGENTE':
      return 'No puedes validar una solución que registraste tú'
    case 'ROL_NO_PERMITIDO':
      return 'No tienes permiso para validar casos'
    case 'CASO_CERRADO':
      return 'El caso ya está cerrado'
    case 'ESTADO_NO_PERMITE_OPERACION':
      return 'El caso ya no está en validación'
    case 'NO_ENCONTRADO':
      return 'El caso ya no existe'
    case 'USUARIO_REQUERIDO':
      return 'Elige un usuario de prueba válido'
    case 'SIN_CONEXION':
      return 'No se pudo conectar con el servidor'
    default:
      return 'No se pudo validar el caso'
  }
}

// Errores que indican que el caso cambió mientras estaba abierto: se vuelve a pedir para mostrar su estado real
const CASO_CAMBIO = new Set(['CASO_CERRADO', 'ESTADO_NO_PERMITE_OPERACION', 'NO_ENCONTRADO'])

/**
 * HU-07: el validador aprueba la solución vigente (el caso pasa a Cerrada, RN-14)
 * o la devuelve con un comentario (vuelve a En atención con el mismo agente, RN-15).
 * Solo lo ve un VALIDADOR y solo con el caso En validación. RN-16 la valida el backend.
 */
export function PanelValidacion({ caso, eventos, onRecargar }: Props) {
  const { usuario } = useUsuarioActual()
  const avisos = useAvisos()
  const navigate = useNavigate()
  const [abierto, setAbierto] = useState<'aprobar' | 'devolver' | null>(null)
  const [comentario, setComentario] = useState('')
  const [errorComentario, setErrorComentario] = useState<string | undefined>()
  const [enviando, setEnviando] = useState(false)

  if (usuario?.rol !== 'VALIDADOR' || caso.estado !== 'EN_VALIDACION') return null

  const solucion = caso.solucionVigente
  const evento = eventos ? atencionVigente(eventos) : null
  const agente = solucion?.agente.nombre ?? evento?.usuario.nombre
  const fecha = solucion?.fecha ?? evento?.fecha
  const comentarioValido = comentario.trim().length >= MINIMO

  function cerrarModal() {
    if (!enviando) setAbierto(null)
  }

  async function validar(aprobado: boolean) {
    if (!aprobado && validarComentario(comentario)) return
    setEnviando(true)
    try {
      await validarCaso(caso.id, aprobado ? { aprobado } : { aprobado, comentario: comentario.trim() })
      if (aprobado) avisos.exito('Caso cerrado', `El caso #${caso.id} quedó en Cerrada.`)
      else avisos.exito('Caso devuelto a atención', `${caso.agente?.nombre ?? 'El agente'} verá tu comentario en el caso #${caso.id}.`)
      navigate(RUTAS.porValidar)
    } catch (e: unknown) {
      setEnviando(false)
      if (!(e instanceof ApiError)) {
        avisos.error('No se pudo validar el caso', 'Ocurrió un error inesperado.')
        return
      }
      if (e.error === 'VALIDACION' && !aprobado) {
        setErrorComentario(e.detalleDe('comentario') ?? e.mensaje)
        return
      }
      setAbierto(null)
      avisos.error(tituloError(e), e.mensaje)
      if (CASO_CAMBIO.has(e.error)) onRecargar()
    }
  }

  return (
    <>
      <Tarjeta className="flex flex-col gap-4 p-5">
        <div>
          <h2 className="text-[15px] font-semibold">Validación</h2>
          <p className="mt-1 text-[13px] text-texto-suave">Revisa la solución vigente. Si resuelve el caso, apruébala; si no, devuélvela al agente.</p>
        </div>

        <div className="flex flex-col gap-2 rounded-campo bg-relleno p-4">
          {eventos === null && !solucion ? (
            <Esqueleto lineas={2} />
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-texto-suave">
                <span className="rounded-full bg-tinte px-2 py-0.5 font-semibold text-acento">Solución vigente</span>
                {agente && <span>{agente}</span>}
                {fecha && (
                  <time dateTime={fecha} className="cifras">
                    {formatearFecha(fecha)}
                  </time>
                )}
              </div>
              {solucion ? (
                <>
                  <p>
                    <span className="font-semibold">Diagnóstico: </span>
                    {solucion.diagnostico}
                  </p>
                  <p>
                    <span className="font-semibold">Solución: </span>
                    {solucion.solucion}
                  </p>
                </>
              ) : (
                <p className="text-[13px] text-texto-suave">El texto del diagnóstico y la solución todavía no se puede consultar desde el detalle del caso.</p>
              )}
            </>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Boton icono="devolver" disabled={enviando} onClick={() => setAbierto('devolver')}>
            Devolver
          </Boton>
          <Boton variante="primario" icono="check" disabled={enviando} onClick={() => setAbierto('aprobar')}>
            Aprobar y cerrar
          </Boton>
        </div>
      </Tarjeta>

      <Confirmacion
        abierta={abierto === 'aprobar'}
        titulo={`¿Aprobar y cerrar el caso #${caso.id}?`}
        mensaje="El caso pasa a Cerrada y ya no se podrá modificar."
        textoConfirmar="Aprobar"
        cargando={enviando}
        onConfirmar={() => validar(true)}
        onCancelar={cerrarModal}
      />

      <Modal
        abierto={abierto === 'devolver'}
        onCerrar={cerrarModal}
        titulo={`Devolver caso #${caso.id}`}
        descripcion={`Vuelve a En atención con ${caso.agente?.nombre ?? 'el mismo agente'}.`}
        pie={
          <>
            <Boton disabled={enviando} onClick={cerrarModal}>
              Cancelar
            </Boton>
            <Boton variante="primario" cargando={enviando} disabled={!comentarioValido} aria-describedby="validacion-comentario-nota" onClick={() => validar(false)}>
              Devolver caso
            </Boton>
          </>
        }
      >
        <CampoArea
          id="validacion-comentario"
          etiqueta="Comentario para el agente"
          placeholder="Qué falta o qué no quedó resuelto"
          value={comentario}
          conContador
          ayuda={`Mínimo ${MINIMO} caracteres.`}
          error={errorComentario}
          disabled={enviando}
          onChange={(e) => {
            setComentario(e.target.value)
            setErrorComentario(undefined)
          }}
          onBlur={() => setErrorComentario(validarComentario(comentario))}
        />
      </Modal>
    </>
  )
}
