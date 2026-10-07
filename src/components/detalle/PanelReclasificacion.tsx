import { useState } from 'react'
import { ApiError } from '../../api/client'
import { reclasificarCaso, type CambiosClasificacion } from '../../api/casos'
import { useAvisos } from '../../hooks/useAvisos'
import { useUsuarioActual } from '../../hooks/useUsuarioActual'
import type { Caso, EstadoCaso, Prioridad, TipoCaso } from '../../types'
import { ETIQUETA_PRIORIDAD, ETIQUETA_TIPO, PRIORIDADES, TIPOS } from '../../utils/etiquetas'
import { Mensaje } from '../Mensaje'
import { SelectorAreaCategoria } from '../SelectorAreaCategoria'
import { Boton, Campo, Modal, Segmentado, Tarjeta } from '../ui'

interface Props {
  caso: Caso
  onCasoActualizado: (caso: Caso) => void
}

// RN-08: la clasificación solo se corrige mientras el caso está en Pendiente o En análisis
const ESTADOS_RECLASIFICABLES: EstadoCaso[] = ['PENDIENTE', 'EN_ANALISIS']

interface Borrador {
  tipo: TipoCaso
  prioridad: Prioridad
  areaId: number
  categoriaId: number | null
}

const desdeCaso = (caso: Caso): Borrador => ({
  tipo: caso.tipo,
  prioridad: caso.prioridad,
  areaId: caso.area.id,
  categoriaId: caso.categoria.id,
})

/** Solo lo que cambió respecto al caso. Área y categoría viajan juntas (RN-03) */
function calcularCambios(caso: Caso, borrador: Borrador): CambiosClasificacion {
  const cambios: CambiosClasificacion = {}
  if (borrador.tipo !== caso.tipo) cambios.tipo = borrador.tipo
  if (borrador.prioridad !== caso.prioridad) cambios.prioridad = borrador.prioridad
  if (borrador.categoriaId !== null && (borrador.categoriaId !== caso.categoria.id || borrador.areaId !== caso.area.id)) {
    cambios.areaId = borrador.areaId
    cambios.categoriaId = borrador.categoriaId
  }
  return cambios
}

/** HU-05: el agente corrige tipo, área, categoría y prioridad del caso */
export function PanelReclasificacion({ caso, onCasoActualizado }: Props) {
  const { usuario } = useUsuarioActual()
  const avisos = useAvisos()
  const [abierto, setAbierto] = useState(false)
  const [borrador, setBorrador] = useState<Borrador>(() => desdeCaso(caso))
  const [errorCategoria, setErrorCategoria] = useState<string | undefined>()
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  if (usuario?.rol !== 'AGENTE' || !ESTADOS_RECLASIFICABLES.includes(caso.estado)) return null

  function abrir() {
    setBorrador(desdeCaso(caso))
    setErrorCategoria(undefined)
    setErrorGeneral(null)
    setAbierto(true)
  }

  function cerrar() {
    if (!enviando) setAbierto(false)
  }

  async function guardar() {
    if (borrador.categoriaId === null) {
      setErrorCategoria('Elige una categoría del área nueva.')
      return
    }
    const cambios = calcularCambios(caso, borrador)
    // Sin cambios no se llama a la API
    if (Object.keys(cambios).length === 0) {
      setAbierto(false)
      return
    }

    setEnviando(true)
    setErrorGeneral(null)
    try {
      const actualizado = await reclasificarCaso(caso.id, cambios)
      onCasoActualizado(actualizado)
      setAbierto(false)
      avisos.exito('Clasificación actualizada', `El caso #${caso.id} quedó como ${ETIQUETA_TIPO[actualizado.tipo].toLowerCase()} · ${actualizado.categoria.nombre} · ${actualizado.prioridad}.`)
    } catch (e: unknown) {
      // El error se queda dentro del modal para poder corregir y volver a guardar
      if (e instanceof ApiError && e.error === 'CATEGORIA_INVALIDA') setErrorCategoria(e.mensaje)
      else setErrorGeneral(e instanceof ApiError ? e.mensaje : 'Ocurrió un error inesperado al reclasificar el caso.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Tarjeta className="flex flex-wrap items-center justify-between gap-3 p-5">
      <div>
        <h2 className="text-[15px] font-semibold">Clasificación</h2>
        <p className="text-[13px] text-texto-suave">Corrige el tipo, la categoría o la prioridad mientras analizas el caso.</p>
      </div>
      <Boton icono="etiqueta" onClick={abrir}>
        Reclasificar
      </Boton>

      <Modal
        abierto={abierto}
        onCerrar={cerrar}
        titulo={`Reclasificar caso #${caso.id}`}
        descripcion="Solo se guardan los datos que cambies. Cada cambio queda en el historial."
        pie={
          <>
            <Boton onClick={cerrar} disabled={enviando}>
              Cancelar
            </Boton>
            <Boton variante="primario" cargando={enviando} onClick={guardar}>
              Guardar clasificación
            </Boton>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {errorGeneral && (
            <Mensaje tipo="error" titulo="No se pudo reclasificar el caso">
              {errorGeneral}
            </Mensaje>
          )}
          <Campo etiqueta="Tipo" htmlFor="reclasificar-tipo">
            <Segmentado
              id="reclasificar-tipo"
              aria-label="Tipo"
              completo
              valor={borrador.tipo}
              onChange={(tipo) => setBorrador((b) => ({ ...b, tipo }))}
              opciones={TIPOS.map((t) => ({ valor: t, texto: ETIQUETA_TIPO[t] }))}
            />
          </Campo>
          <SelectorAreaCategoria
            idBase="reclasificar"
            areaId={borrador.areaId}
            categoriaId={borrador.categoriaId}
            errorCategoria={errorCategoria}
            onCambiarArea={(areaId) => {
              setBorrador((b) => ({ ...b, areaId, categoriaId: null }))
              setErrorCategoria(undefined)
            }}
            onCambiarCategoria={(categoriaId) => {
              setBorrador((b) => ({ ...b, categoriaId }))
              setErrorCategoria(undefined)
            }}
          />
          <Campo etiqueta="Prioridad" htmlFor="reclasificar-prioridad">
            <Segmentado
              id="reclasificar-prioridad"
              aria-label="Prioridad"
              completo
              valor={borrador.prioridad}
              onChange={(prioridad) => setBorrador((b) => ({ ...b, prioridad }))}
              opciones={PRIORIDADES.map((p) => ({ valor: p, texto: ETIQUETA_PRIORIDAD[p] }))}
            />
          </Campo>
        </div>
      </Modal>
    </Tarjeta>
  )
}
