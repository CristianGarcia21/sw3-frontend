import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { listarAreas, listarCategorias } from '../../api/catalogos'
import type { Area, Categoria } from '../../types'
import { COLOR_ESTADO } from '../../utils/colores'
import { ESTADOS, ETIQUETA_ESTADO, ETIQUETA_PRIORIDAD, ETIQUETA_TIPO, PRIORIDADES, TIPOS } from '../../utils/etiquetas'
import { escribirFiltros, hayFiltros, leerFiltros, limpiarFiltros, type FiltrosUrl } from '../../utils/filtrosBandeja'
import { Boton, FiltroMultiple, Icono, ListaDesplegable } from '../ui'
import { CLASES_CONTROL } from '../ui/Campo'

// Opción "Todas" de las listas de una sola opción. Los ids reales empiezan en 1
const TODAS = 0
// Espera tras la última tecla antes de buscar
const RETRASO_BUSQUEDA = 400

/**
 * HU-09: barra de filtros de la bandeja, sincronizada con la URL para poder recargar o compartir la búsqueda.
 * Flota sobre la tabla en vidrio; por eso sus controles son sólidos (nunca vidrio sobre vidrio).
 */
export function FiltrosBandeja() {
  const [parametros, setParametros] = useSearchParams()
  const filtros = leerFiltros(parametros)

  const [areas, setAreas] = useState<Area[]>([])
  const [categorias, setCategorias] = useState<{ areaId: number; lista: Categoria[] } | null>(null)

  // El texto que se escribe va por delante de la URL hasta que pasa el retraso.
  // Queda marcado con la búsqueda de la URL de la que partió: si la URL cambia por fuera (Limpiar), se descarta
  const [busqueda, setBusqueda] = useState({ desdeUrl: filtros.q, texto: filtros.q })
  const texto = busqueda.desdeUrl === filtros.q ? busqueda.texto : filtros.q

  function cambiar(cambios: Partial<FiltrosUrl>) {
    setParametros((actuales) => escribirFiltros(actuales, cambios), { replace: true })
  }

  useEffect(() => {
    let cancelado = false
    listarAreas()
      .then((lista) => {
        if (!cancelado) setAreas(lista)
      })
      .catch(() => {
        // Sin áreas el filtro queda deshabilitado; los demás siguen funcionando
      })
    return () => {
      cancelado = true
    }
  }, [])

  // Incluye las inactivas: sirven para encontrar casos viejos
  const areaId = filtros.areaId
  useEffect(() => {
    if (areaId === null) return
    let cancelado = false
    listarCategorias({ areaId })
      .then((lista) => {
        if (!cancelado) setCategorias({ areaId, lista })
      })
      .catch(() => {
        // Sin categorías el filtro queda deshabilitado
      })
    return () => {
      cancelado = true
    }
  }, [areaId])

  useEffect(() => {
    const nueva = texto.trim()
    if (nueva === filtros.q) return
    const temporizador = setTimeout(() => {
      setBusqueda({ desdeUrl: nueva, texto })
      setParametros((actuales) => escribirFiltros(actuales, { q: nueva }), { replace: true })
    }, RETRASO_BUSQUEDA)
    return () => clearTimeout(temporizador)
  }, [texto, filtros.q, setParametros])

  const listaCategorias = categorias && categorias.areaId === areaId ? categorias.lista : []
  const nombreArea = areas.find((a) => a.id === areaId)?.nombre
  const nombreCategoria = listaCategorias.find((c) => c.id === filtros.categoriaId)?.nombre

  return (
    <search className="vidrio z-20 flex flex-wrap items-center gap-2 rounded-[22px] p-2.5 md:sticky md:top-2.5" aria-label="Filtros de casos">
      <label className="relative min-w-52 flex-1">
        <span className="sr-only">Buscar por título</span>
        <Icono nombre="buscar" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-texto-suave" />
        <input
          type="search"
          value={texto}
          maxLength={180}
          placeholder="Buscar por título"
          onChange={(e) => setBusqueda({ desdeUrl: filtros.q, texto: e.target.value })}
          className={`${CLASES_CONTROL} h-8.5 rounded-full py-0 pl-9`}
        />
      </label>

      <FiltroMultiple
        etiqueta="Estado"
        aria-label="Estado"
        opciones={ESTADOS.map((e) => ({ valor: e, texto: ETIQUETA_ESTADO[e], color: COLOR_ESTADO[e] }))}
        valor={filtros.estado}
        onChange={(estado) => cambiar({ estado })}
      />
      <FiltroMultiple
        etiqueta="Tipo"
        aria-label="Tipo"
        opciones={TIPOS.map((t) => ({ valor: t, texto: ETIQUETA_TIPO[t] }))}
        valor={filtros.tipo}
        onChange={(tipo) => cambiar({ tipo })}
      />
      <ListaDesplegable
        variante="capsula"
        aria-label="Área"
        deshabilitada={areas.length === 0}
        opciones={[{ valor: TODAS, texto: 'Todas las áreas' }, ...areas.map((a) => ({ valor: a.id, texto: a.nombre }))]}
        valor={areaId}
        // Al cambiar el área la categoría ya no aplica
        onChange={(id) => cambiar({ areaId: id === TODAS ? null : id, categoriaId: null })}
        contenido={<span className="truncate">{nombreArea ? `Área: ${nombreArea}` : 'Área'}</span>}
      />
      <ListaDesplegable
        variante="capsula"
        aria-label="Categoría"
        deshabilitada={areaId === null || listaCategorias.length === 0}
        opciones={[
          { valor: TODAS, texto: 'Todas las categorías' },
          ...listaCategorias.map((c) => ({ valor: c.id, texto: c.nombre, detalle: c.activa ? undefined : 'Inactiva' })),
        ]}
        valor={filtros.categoriaId}
        onChange={(id) => cambiar({ categoriaId: id === TODAS ? null : id })}
        contenido={<span className="truncate">{nombreCategoria ? `Categoría: ${nombreCategoria}` : 'Categoría'}</span>}
      />
      <FiltroMultiple
        etiqueta="Prioridad"
        aria-label="Prioridad"
        opciones={PRIORIDADES.map((p) => ({ valor: p, texto: ETIQUETA_PRIORIDAD[p] }))}
        valor={filtros.prioridad}
        onChange={(prioridad) => cambiar({ prioridad })}
      />

      {hayFiltros(filtros) && (
        <Boton variante="texto" icono="cerrar" onClick={() => setParametros((actuales) => limpiarFiltros(actuales), { replace: true })}>
          Limpiar
        </Boton>
      )}
    </search>
  )
}
