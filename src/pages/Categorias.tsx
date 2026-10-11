import { useEffect, useState } from 'react'
import { ApiError, type ApiError as TipoApiError } from '../api/client'
import { cambiarActivaCategoria, eliminarCategoria, listarAreas, listarCategorias } from '../api/catalogos'
import { FormularioCategoria } from '../components/categorias/FormularioCategoria'
import { Mensaje } from '../components/Mensaje'
import { Boton, Confirmacion, Esqueleto, EstadoVacio, Interruptor, Tarjeta } from '../components/ui'
import { useAvisos } from '../hooks/useAvisos'
import type { Area, Categoria } from '../types'

interface Datos {
  areas: Area[]
  categorias: Categoria[]
}

/** Acción que pide confirmación. Se guarda aparte de `abierta` para que el modal se cierre con su animación */
interface AccionPendiente {
  tipo: 'desactivar' | 'borrar'
  categoria: Categoria
}

function tituloError(error: TipoApiError, accion: string): string {
  switch (error.error) {
    case 'CATEGORIA_CON_CASOS':
      return 'La categoría tiene casos'
    case 'NO_ENCONTRADO':
      return 'La categoría ya no existe'
    case 'ROL_NO_PERMITIDO':
      return 'No tienes permiso para administrar categorías'
    case 'SIN_CONEXION':
      return 'No se pudo conectar con el servidor'
    default:
      return `No se pudo ${accion} la categoría`
  }
}

function plural(n: number, singular: string, varios: string) {
  return `${n} ${n === 1 ? singular : varios}`
}

/** HU-11: el administrador crea, edita, activa o desactiva y borra categorías. Las áreas son fijas */
export function Categorias() {
  const avisos = useAvisos()
  const [datos, setDatos] = useState<Datos | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [actualizando, setActualizando] = useState(false)
  const [intento, setIntento] = useState(0)
  // Categoría con una petición en curso (interruptor o borrado): sus controles quedan bloqueados
  const [ocupada, setOcupada] = useState<number | null>(null)
  const [accion, setAccion] = useState<AccionPendiente | null>(null)
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false)
  const [formulario, setFormulario] = useState<{ area: Area; categoria: Categoria | null } | null>(null)
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  // Cada apertura monta un formulario limpio, sin cortar la animación de cierre del anterior
  const [aperturas, setAperturas] = useState(0)

  useEffect(() => {
    let cancelado = false
    // Sin filtro `activa`, GET /categorias trae activas e inactivas con totalCasos
    Promise.all([listarAreas(), listarCategorias()])
      .then(([areas, categorias]) => {
        if (cancelado) return
        setDatos({ areas, categorias })
        setError(null)
      })
      .catch((e: unknown) => {
        if (!cancelado) setError(e instanceof ApiError ? e : new ApiError(0, 'ERROR_INTERNO', 'No se pudieron cargar las categorías'))
      })
      .finally(() => {
        if (!cancelado) setActualizando(false)
      })
    return () => {
      cancelado = true
    }
  }, [intento])

  // Mientras llega la lista nueva se sigue mostrando la anterior: no hay parpadeo
  function recargar() {
    setActualizando(true)
    setIntento((n) => n + 1)
  }

  function abrirFormulario(area: Area, categoria: Categoria | null) {
    setFormulario({ area, categoria })
    setAperturas((n) => n + 1)
    setFormularioAbierto(true)
  }

  function pedirConfirmacion(tipo: AccionPendiente['tipo'], categoria: Categoria) {
    setAccion({ tipo, categoria })
    setConfirmacionAbierta(true)
  }

  async function cambiarActiva(categoria: Categoria, activa: boolean) {
    setOcupada(categoria.id)
    try {
      await cambiarActivaCategoria(categoria.id, activa)
      if (activa) avisos.exito(`Categoría "${categoria.nombre}" activada`, 'Vuelve a aparecer al registrar casos.')
      else avisos.exito(`Categoría "${categoria.nombre}" desactivada`, 'Ya no aparece al registrar casos. Los casos existentes la conservan.')
    } catch (e: unknown) {
      if (e instanceof ApiError) avisos.error(tituloError(e, activa ? 'activar' : 'desactivar'), e.mensaje)
      else avisos.error(`No se pudo ${activa ? 'activar' : 'desactivar'} la categoría`, 'Ocurrió un error inesperado.')
    } finally {
      // Con éxito o con error se recarga: el interruptor queda con el estado real del backend
      setOcupada(null)
      setConfirmacionAbierta(false)
      recargar()
    }
  }

  async function borrar(categoria: Categoria) {
    setOcupada(categoria.id)
    try {
      await eliminarCategoria(categoria.id)
      avisos.exito(`Categoría "${categoria.nombre}" borrada`)
    } catch (e: unknown) {
      // CATEGORIA_CON_CASOS: alguien registró un caso mientras tanto; la recarga trae el total nuevo
      if (e instanceof ApiError) avisos.error(tituloError(e, 'borrar'), e.mensaje)
      else avisos.error('No se pudo borrar la categoría', 'Ocurrió un error inesperado.')
    } finally {
      setOcupada(null)
      setConfirmacionAbierta(false)
      recargar()
    }
  }

  function confirmar() {
    if (!accion) return
    if (accion.tipo === 'desactivar') cambiarActiva(accion.categoria, false)
    else borrar(accion.categoria)
  }

  let resumen = 'Las categorías que se ofrecen al registrar un caso, por área.'
  if (datos) {
    const inactivas = datos.categorias.filter((c) => !c.activa).length
    resumen = `${plural(datos.categorias.length, 'categoría', 'categorías')} · ${plural(inactivas, 'inactiva', 'inactivas')}`
  }

  let contenido = null
  if (datos === null) {
    // Si falló la primera carga solo queda el mensaje de error
    if (!error) {
      contenido = (
        <Tarjeta className="p-5">
          <Esqueleto lineas={6} />
        </Tarjeta>
      )
    }
  } else {
    const orden = new Intl.Collator('es')
    contenido = datos.areas.map((area) => (
      <SeccionArea
        key={area.id}
        area={area}
        categorias={datos.categorias.filter((c) => c.areaId === area.id).sort((a, b) => orden.compare(a.nombre, b.nombre))}
        ocupada={ocupada}
        onNueva={() => abrirFormulario(area, null)}
        onEditar={(categoria) => abrirFormulario(area, categoria)}
        onCambiarActiva={(categoria, activa) => (activa ? cambiarActiva(categoria, true) : pedirConfirmacion('desactivar', categoria))}
        onBorrar={(categoria) => pedirConfirmacion('borrar', categoria)}
      />
    ))
  }

  const enviandoConfirmacion = accion !== null && ocupada === accion.categoria.id

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[34px] leading-tight font-bold tracking-[-0.028em]">Categorías</h1>
          <p className="mt-1 text-texto-suave">{resumen}</p>
        </div>
        <Boton cargando={actualizando} onClick={recargar}>
          Actualizar
        </Boton>
      </header>

      {error && (
        <Mensaje tipo="error" titulo="No se pudieron cargar las categorías" accion={{ texto: 'Reintentar', onClick: recargar }}>
          {error.mensaje}
        </Mensaje>
      )}

      {contenido}

      {formulario && (
        <FormularioCategoria
          key={aperturas}
          abierto={formularioAbierto}
          area={formulario.area}
          categoria={formulario.categoria}
          onCerrar={() => setFormularioAbierto(false)}
          onGuardada={recargar}
        />
      )}

      <Confirmacion
        abierta={confirmacionAbierta}
        destructiva
        titulo={accion?.tipo === 'borrar' ? `¿Borrar la categoría "${accion.categoria.nombre}"?` : `¿Desactivar la categoría "${accion?.categoria.nombre ?? ''}"?`}
        mensaje={accion?.tipo === 'borrar' ? 'Se borra para siempre. No tiene casos asociados.' : 'Ya no aparecerá al registrar casos; los casos existentes la conservan'}
        textoConfirmar={accion?.tipo === 'borrar' ? 'Borrar' : 'Desactivar'}
        cargando={enviandoConfirmacion}
        onConfirmar={confirmar}
        onCancelar={() => {
          if (!enviandoConfirmacion) setConfirmacionAbierta(false)
        }}
      />
    </section>
  )
}

interface PropsSeccion {
  area: Area
  categorias: Categoria[]
  ocupada: number | null
  onNueva: () => void
  onEditar: (categoria: Categoria) => void
  onCambiarActiva: (categoria: Categoria, activa: boolean) => void
  onBorrar: (categoria: Categoria) => void
}

function SeccionArea({ area, categorias, ocupada, onNueva, onEditar, onCambiarActiva, onBorrar }: PropsSeccion) {
  const idTitulo = `area-${area.id}-titulo`
  return (
    <Tarjeta role="region" aria-labelledby={idTitulo}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div>
          <h2 id={idTitulo} className="text-[15px] font-semibold">
            {area.nombre}
          </h2>
          <p className="cifras text-[13px] text-texto-suave">{plural(categorias.length, 'categoría', 'categorías')}</p>
        </div>
        <Boton icono="mas" aria-label={`Nueva categoría en ${area.nombre}`} onClick={onNueva}>
          Nueva categoría
        </Boton>
      </div>

      {categorias.length === 0 ? (
        <div className="border-t border-linea">
          <EstadoVacio icono="etiqueta" titulo="Sin categorías">
            Las categorías que crees en {area.nombre} aparecerán aquí.
          </EstadoVacio>
        </div>
      ) : (
        <ul>
          {categorias.map((categoria) => (
            <FilaCategoria
              key={categoria.id}
              categoria={categoria}
              ocupada={ocupada === categoria.id}
              onEditar={() => onEditar(categoria)}
              onCambiarActiva={(activa) => onCambiarActiva(categoria, activa)}
              onBorrar={() => onBorrar(categoria)}
            />
          ))}
        </ul>
      )}
    </Tarjeta>
  )
}

interface PropsFila {
  categoria: Categoria
  ocupada: boolean
  onEditar: () => void
  onCambiarActiva: (activa: boolean) => void
  onBorrar: () => void
}

function FilaCategoria({ categoria, ocupada, onEditar, onCambiarActiva, onBorrar }: PropsFila) {
  const totalCasos = categoria.totalCasos ?? 0
  // RN-21: con casos no se borra, se desactiva. El motivo queda a la vista, no solo en un title
  const conCasos = totalCasos > 0
  const idMotivo = `categoria-${categoria.id}-motivo`

  return (
    <li className="flex flex-col gap-3 border-t border-linea px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">{categoria.nombre}</p>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${categoria.activa ? 'bg-tinte text-acento' : 'bg-relleno-fuerte text-texto-suave'}`}
          >
            {categoria.activa ? 'Activa' : 'Inactiva'}
          </span>
        </div>
        <p className={`text-[13px] text-texto-suave ${categoria.descripcion ? '' : 'italic'}`}>{categoria.descripcion || 'Sin descripción'}</p>
        <p className="cifras text-[12.5px] text-texto-suave">{plural(totalCasos, 'caso', 'casos')}</p>
      </div>

      <div className="flex shrink-0 flex-col gap-1.5 sm:items-end">
        <div className="flex items-center gap-2">
          <Interruptor aria-label={`Activar categoría ${categoria.nombre}`} activo={categoria.activa} deshabilitado={ocupada} onChange={onCambiarActiva} />
          <Boton variante="texto" disabled={ocupada} onClick={onEditar}>
            Editar
          </Boton>
          <Boton variante="destructivo" disabled={conCasos || ocupada} aria-describedby={conCasos ? idMotivo : undefined} onClick={onBorrar}>
            Borrar
          </Boton>
        </div>
        {conCasos && (
          <p id={idMotivo} className="text-[12px] text-texto-suave">
            Tiene casos; desactívala en su lugar
          </p>
        )}
      </div>
    </li>
  )
}
