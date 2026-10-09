import { useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import { registrarAtencion } from '../../api/casos'
import { useAvisos } from '../../hooks/useAvisos'
import { devolucionPendiente } from '../../hooks/useHistorial'
import { useUsuarioActual } from '../../hooks/useUsuarioActual'
import type { Atencion, Caso, EventoHistorialItem } from '../../types'
import { formatearFecha } from '../../utils/etiquetas'
import { Mensaje } from '../Mensaje'
import { Boton, CampoArea, EstadoVacio, Tarjeta } from '../ui'

interface Props {
  caso: Caso
  /** Historial del caso (null mientras carga): de ahí sale el comentario de la última devolución */
  eventos: EventoHistorialItem[] | null
  /** Se llama tras registrar la atención para refrescar el caso y su historial */
  onAtencionRegistrada: () => void
}

type Campo = 'diagnostico' | 'solucion'

// RN-12 / HU-06: mínimo 10 caracteres sin contar espacios al inicio y al final, igual que el backend
const MINIMO = 10

function validar(texto: string, nombre: string): string | undefined {
  const largo = texto.trim().length
  if (largo === 0) return `Escribe ${nombre}.`
  if (largo < MINIMO) return `${nombre[0].toUpperCase()}${nombre.slice(1)} debe tener al menos ${MINIMO} caracteres.`
  return undefined
}

const NOMBRES: Record<Campo, string> = { diagnostico: 'el diagnóstico', solucion: 'la solución' }

/**
 * HU-06: el agente asignado registra el diagnóstico y la solución mientras el caso está En atención (RN-12).
 * Agente, validador y administrador ven las atenciones; la más reciente es la solución vigente.
 */
export function PanelAtencion({ caso, eventos, onAtencionRegistrada }: Props) {
  const { usuario } = useUsuarioActual()
  const avisos = useAvisos()
  const [diagnostico, setDiagnostico] = useState('')
  const [solucion, setSolucion] = useState('')
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({})
  const [enviando, setEnviando] = useState(false)
  // TODO(#54): cuando exista GET /casos/:id con `atenciones`, mostrar esas en vez de solo las registradas en esta sesión
  const [atenciones, setAtenciones] = useState<Atencion[]>([])

  if (!usuario || usuario.rol === 'SOLICITANTE') return null

  const puedeRegistrar = usuario.rol === 'AGENTE' && caso.estado === 'EN_ATENCION' && caso.agente?.id === usuario.id
  const devolucion = caso.estado === 'EN_ATENCION' && eventos ? devolucionPendiente(eventos) : null
  const textos: Record<Campo, string> = { diagnostico, solucion }

  function validarCampo(campo: Campo) {
    setErrores((actuales) => ({ ...actuales, [campo]: validar(textos[campo], NOMBRES[campo]) }))
  }

  async function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nuevos = { diagnostico: validar(diagnostico, NOMBRES.diagnostico), solucion: validar(solucion, NOMBRES.solucion) }
    setErrores(nuevos)
    if (nuevos.diagnostico || nuevos.solucion) return

    setEnviando(true)
    try {
      const atencion = await registrarAtencion(caso.id, { diagnostico: diagnostico.trim(), solucion: solucion.trim() })
      setAtenciones((anteriores) => [atencion, ...anteriores])
      setDiagnostico('')
      setSolucion('')
      setErrores({})
      avisos.exito('Atención registrada', `Ya puedes enviar el caso #${caso.id} a validación.`)
      onAtencionRegistrada()
    } catch (error: unknown) {
      if (error instanceof ApiError && error.error === 'VALIDACION') {
        setErrores({ diagnostico: error.detalleDe('diagnostico'), solucion: error.detalleDe('solucion') })
      } else {
        avisos.error('No se pudo registrar la atención', error instanceof ApiError ? error.mensaje : 'Ocurrió un error inesperado.')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Tarjeta className="flex flex-col gap-5 p-5">
      <h2 className="text-[15px] font-semibold">Atención</h2>

      {devolucion && (
        <Mensaje tipo="advertencia" titulo={`${devolucion.usuario.nombre} devolvió el caso`}>
          {devolucion.comentario ?? 'Sin comentario.'}
        </Mensaje>
      )}

      {puedeRegistrar && (
        <form onSubmit={guardar} noValidate className="flex flex-col gap-4">
          <CampoArea
            id="atencion-diagnostico"
            etiqueta="Diagnóstico"
            placeholder="Qué encontraste al revisar el caso"
            value={diagnostico}
            conContador
            ayuda={`Mínimo ${MINIMO} caracteres.`}
            error={errores.diagnostico}
            onChange={(e) => {
              setDiagnostico(e.target.value)
              setErrores((actuales) => ({ ...actuales, diagnostico: undefined }))
            }}
            onBlur={() => validarCampo('diagnostico')}
          />
          <CampoArea
            id="atencion-solucion"
            etiqueta="Solución"
            placeholder="Qué hiciste para resolverlo"
            value={solucion}
            conContador
            ayuda={`Mínimo ${MINIMO} caracteres.`}
            error={errores.solucion}
            onChange={(e) => {
              setSolucion(e.target.value)
              setErrores((actuales) => ({ ...actuales, solucion: undefined }))
            }}
            onBlur={() => validarCampo('solucion')}
          />
          <div className="flex justify-end">
            <Boton type="submit" icono="check" cargando={enviando}>
              Registrar atención
            </Boton>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        <h3 className="text-[13px] font-semibold text-texto-suave">Atenciones registradas</h3>
        {atenciones.length === 0 ? (
          <EstadoVacio icono="lista" titulo="Sin atenciones en esta sesión">
            Las atenciones que se registren aquí aparecerán con su fecha y su agente. La más reciente es la solución vigente.
          </EstadoVacio>
        ) : (
          <ol className="flex flex-col gap-3">
            {atenciones.map((atencion, i) => (
              <li key={atencion.id} className="flex flex-col gap-2 rounded-campo bg-relleno p-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-texto-suave">
                  {i === 0 && <span className="rounded-full bg-tinte px-2 py-0.5 font-semibold text-acento">Solución vigente</span>}
                  <span>{atencion.agente.nombre}</span>
                  <time dateTime={atencion.fecha}>{formatearFecha(atencion.fecha)}</time>
                </div>
                <p>
                  <span className="font-semibold">Diagnóstico: </span>
                  {atencion.diagnostico}
                </p>
                <p>
                  <span className="font-semibold">Solución: </span>
                  {atencion.solucion}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Tarjeta>
  )
}
