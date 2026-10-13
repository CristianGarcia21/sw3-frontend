import { useEffect, useState } from 'react'
import { ApiError } from '../api/client'
import { listarAreas, listarCategorias } from '../api/catalogos'
import type { Area, Categoria } from '../types'
import { Campo, ListaDesplegable } from './ui'

interface Props {
  areaId: number | null
  categoriaId: number | null
  /** Al cambiar el área la categoría se vacía: hay que elegir una del área nueva */
  onCambiarArea: (areaId: number) => void
  onCambiarCategoria: (categoriaId: number) => void
  errorArea?: string
  errorCategoria?: string
  /** Prefijo de los id de los controles, para poder usar el selector más de una vez en la página */
  idBase?: string
}

function mensajeDe(e: unknown, alternativa: string) {
  return e instanceof ApiError ? e.mensaje : alternativa
}

/** Área y categoría dependiente. Solo ofrece categorías activas, que son las que se pueden asignar (RN-03) */
export function SelectorAreaCategoria({ areaId, categoriaId, onCambiarArea, onCambiarCategoria, errorArea, errorCategoria, idBase = 'clasificacion' }: Props) {
  const [areas, setAreas] = useState<Area[]>([])
  const [falloAreas, setFalloAreas] = useState<string | null>(null)
  const [categorias, setCategorias] = useState<{ areaId: number; lista: Categoria[] } | null>(null)
  const [falloCategorias, setFalloCategorias] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false
    listarAreas()
      .then((lista) => {
        if (!cancelado) setAreas(lista)
      })
      .catch((e: unknown) => {
        if (!cancelado) setFalloAreas(mensajeDe(e, 'No se pudieron cargar las áreas.'))
      })
    return () => {
      cancelado = true
    }
  }, [])

  useEffect(() => {
    if (areaId === null) return
    let cancelado = false
    listarCategorias({ areaId, activa: true })
      .then((lista) => {
        if (cancelado) return
        setCategorias({ areaId, lista })
        setFalloCategorias(null)
      })
      .catch((e: unknown) => {
        if (!cancelado) setFalloCategorias(mensajeDe(e, 'No se pudieron cargar las categorías.'))
      })
    return () => {
      cancelado = true
    }
  }, [areaId])

  // Las categorías cargadas solo valen para el área a la que pertenecen
  const listaCategorias = categorias && categorias.areaId === areaId ? categorias.lista : null
  const cargandoCategorias = areaId !== null && listaCategorias === null && !falloCategorias

  let ayudaCategoria: string | undefined
  if (cargandoCategorias) ayudaCategoria = 'Cargando categorías…'
  else if (listaCategorias && listaCategorias.length === 0) ayudaCategoria = 'Esta área no tiene categorías activas.'

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Campo etiqueta="Área" htmlFor={`${idBase}-area`} error={falloAreas ?? errorArea}>
        <ListaDesplegable
          id={`${idBase}-area`}
          placeholder="Elige un área"
          invalida={!!(falloAreas ?? errorArea)}
          deshabilitada={areas.length === 0}
          opciones={areas.map((a) => ({ valor: a.id, texto: a.nombre }))}
          valor={areaId}
          onChange={(id) => {
            if (id !== areaId) onCambiarArea(id)
          }}
        />
      </Campo>
      <Campo etiqueta="Categoría" htmlFor={`${idBase}-categoria`} ayuda={ayudaCategoria} error={falloCategorias ?? errorCategoria}>
        <ListaDesplegable
          id={`${idBase}-categoria`}
          placeholder="Elige una categoría"
          invalida={!!(falloCategorias ?? errorCategoria)}
          deshabilitada={!listaCategorias || listaCategorias.length === 0}
          opciones={(listaCategorias ?? []).map((c) => ({ valor: c.id, texto: c.nombre }))}
          valor={categoriaId}
          onChange={onCambiarCategoria}
        />
      </Campo>
    </div>
  )
}
