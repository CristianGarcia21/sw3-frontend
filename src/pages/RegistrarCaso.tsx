import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { ApiError } from '../api/client'
import { registrarCaso } from '../api/casos'
import { listarAreas, listarCategorias } from '../api/catalogos'
import { Cargando } from '../components/Cargando'
import { Mensaje } from '../components/Mensaje'
import { Boton, Campo, CampoArea, CampoTexto, EstadoVacio, ListaDesplegable, Segmentado, Tarjeta } from '../components/ui'
import type { Area, Categoria, NuevoCaso, Prioridad, TipoCaso } from '../types'
import { ETIQUETA_PRIORIDAD, ETIQUETA_TIPO, PRIORIDADES } from '../utils/etiquetas'
import { RUTAS } from '../utils/navegacion'

type ErroresFormulario = Partial<Record<keyof NuevoCaso, string>>

const CAMPOS_FORMULARIO: (keyof NuevoCaso)[] = [
  'tipo',
  'areaId',
  'categoriaId',
  'titulo',
  'descripcion',
  'prioridad',
]

const CAMPO_POR_NOMBRE_API: Partial<Record<string, keyof NuevoCaso>> = {
  tipo: 'tipo',
  titulo: 'titulo',
  descripcion: 'descripcion',
  prioridad: 'prioridad',
  areaId: 'areaId',
  categoriaId: 'categoriaId',
}

function mensajeDeError(error: unknown, alternativa: string) {
  if (error instanceof ApiError) return error.mensaje
  if (error instanceof Error) return error.message
  return alternativa
}

export function RegistrarCaso() {
  const [areas, setAreas] = useState<Area[]>([])
  const [cargandoAreas, setCargandoAreas] = useState(true)
  const [errorAreas, setErrorAreas] = useState<string | null>(null)
  const [intentoAreas, setIntentoAreas] = useState(0)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargandoCategorias, setCargandoCategorias] = useState(false)
  const [errorCategorias, setErrorCategorias] = useState<string | null>(null)
  const [intentoCategorias, setIntentoCategorias] = useState(0)

  const [tipo, setTipo] = useState<TipoCaso | null>(null)
  const [areaId, setAreaId] = useState<number | null>(null)
  const [categoriaId, setCategoriaId] = useState<number | null>(null)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [prioridad, setPrioridad] = useState<Prioridad>('P2')
  const [errores, setErrores] = useState<ErroresFormulario>({})
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [casoRegistrado, setCasoRegistrado] = useState<number | null>(null)

  useEffect(() => {
    let cancelado = false

    listarAreas()
      .then((lista) => {
        if (!cancelado) setAreas(lista)
      })
      .catch((error: unknown) => {
        if (!cancelado) {
          setErrorAreas(mensajeDeError(error, 'No se pudieron cargar las áreas.'))
        }
      })
      .finally(() => {
        if (!cancelado) setCargandoAreas(false)
      })

    return () => {
      cancelado = true
    }
  }, [intentoAreas])

  useEffect(() => {
    if (areaId === null) return

    let cancelado = false

   listarCategorias({
  areaId,
  activa: true,
})
      .then((lista) => {
        if (!cancelado) setCategorias(lista)
      })
      .catch((error: unknown) => {
        if (!cancelado) {
          setErrorCategorias(mensajeDeError(error, 'No se pudieron cargar las categorías.'))
        }
      })
      .finally(() => {
        if (!cancelado) setCargandoCategorias(false)
      })

    return () => {
      cancelado = true
    }
  }, [areaId, intentoCategorias])

  function limpiarError(campo: keyof NuevoCaso) {
    setErrores((actuales) => {
      const siguientes = { ...actuales }
      delete siguientes[campo]
      return siguientes
    })
    setErrorGeneral(null)
  }

  function mensajeValidacion(campo: keyof NuevoCaso): string | undefined {
    switch (campo) {
      case 'tipo':
        return tipo ? undefined : 'Selecciona un tipo de caso.'
      case 'areaId':
        return areaId ? undefined : 'Elige un área.'
      case 'categoriaId':
        return categoriaId ? undefined : 'Elige una categoría.'
      case 'titulo': {
        const cantidad = titulo.trim().length
        if (cantidad === 0) return 'El título es obligatorio.'
        if (cantidad < 5 || cantidad > 180) return 'El título debe tener entre 5 y 180 caracteres.'
        return undefined
      }
      case 'descripcion': {
        const cantidad = descripcion.trim().length
        if (cantidad === 0) return 'La descripción es obligatoria.'
        if (cantidad < 10) return 'Mínimo 10 caracteres'
        return undefined
      }
      case 'prioridad':
        return prioridad ? undefined : 'Elige una prioridad.'
    }
  }

  function validarCampo(campo: keyof NuevoCaso) {
    const mensaje = mensajeValidacion(campo)
    setErrores((actuales) => {
      const siguientes = { ...actuales }
      if (mensaje) siguientes[campo] = mensaje
      else delete siguientes[campo]
      return siguientes
    })
  }

  function validarFormulario() {
    const siguientes: ErroresFormulario = {}
    for (const campo of CAMPOS_FORMULARIO) {
      const mensaje = mensajeValidacion(campo)
      if (mensaje) siguientes[campo] = mensaje
    }
    setErrores(siguientes)
    return Object.keys(siguientes).length === 0
  }

  function cambiarArea(id: number) {
    if (id === areaId) return
    setAreaId(id)
    setCategoriaId(null)
    setCategorias([])
    setCargandoCategorias(true)
    setErrorCategorias(null)
    limpiarError('areaId')
    limpiarError('categoriaId')
  }

  function reintentarAreas() {
    setCargandoAreas(true)
    setErrorAreas(null)
    setIntentoAreas((intento) => intento + 1)
  }

  function reintentarCategorias() {
    setCargandoCategorias(true)
    setErrorCategorias(null)
    setIntentoCategorias((intento) => intento + 1)
  }

  function registrarOtro() {
    setTipo(null)
    setAreaId(null)
    setCategoriaId(null)
    setCategorias([])
    setCargandoCategorias(false)
    setErrorCategorias(null)
    setTitulo('')
    setDescripcion('')
    setPrioridad('P2')
    setErrores({})
    setErrorGeneral(null)
    setCasoRegistrado(null)
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorGeneral(null)
    if (enviando || !validarFormulario()) return
    if (tipo === null || areaId === null || categoriaId === null) return

    setEnviando(true)
    try {
      const caso = await registrarCaso({
        tipo,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        prioridad,
        areaId,
        categoriaId,
      })
      setCasoRegistrado(caso.id)
    } catch (error: unknown) {
      if (error instanceof ApiError && error.error === 'VALIDACION') {
        const erroresApi: ErroresFormulario = {}
        for (const detalle of error.detalles) {
          const campo = CAMPO_POR_NOMBRE_API[detalle.campo]
          if (campo) {
            erroresApi[campo] = erroresApi[campo]
              ? `${erroresApi[campo]} ${detalle.mensaje}`
              : detalle.mensaje
          }
        }
        if (Object.keys(erroresApi).length > 0) setErrores(erroresApi)
        else setErrorGeneral(error.mensaje)
      } else {
        setErrorGeneral(mensajeDeError(error, 'Ocurrió un error al registrar el caso.'))
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="text-[34px] leading-tight font-bold tracking-[-0.028em]">Registrar caso</h1>
        <p className="mt-1 text-texto-suave">Cuéntanos qué necesitas para que el equipo pueda ayudarte.</p>
      </header>

      {casoRegistrado !== null ? (
        <Tarjeta className="flex flex-col items-start gap-4 p-5 sm:p-7">
          <div>
            <h2 className="text-2xl leading-tight font-bold tracking-[-0.02em]">Caso #{casoRegistrado} registrado</h2>
            <p className="mt-1 text-sm text-texto-suave">Tu caso quedó en estado Pendiente.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to={RUTAS.misCasos}
              className="inline-flex min-h-9 items-center justify-center rounded-full bg-acento px-4 text-[13px] font-medium text-sobre-acento transition-[transform,filter] duration-150 hover:brightness-110 active:scale-[0.96] focus-visible:ring-4 focus-visible:ring-tinte"
            >
              Ver mis casos
            </Link>
            <Link
              to={RUTAS.registrarCaso}
              onClick={registrarOtro}
              className="inline-flex min-h-9 items-center justify-center rounded-full bg-relleno px-4 text-[13px] font-medium text-texto transition-colors hover:bg-relleno-fuerte focus-visible:ring-4 focus-visible:ring-tinte"
            >
              Registrar otro
            </Link>
          </div>
        </Tarjeta>
      ) : cargandoAreas ? (
        <Tarjeta className="p-5 sm:p-7">
          <Cargando texto="Cargando áreas…" />
        </Tarjeta>
      ) : errorAreas ? (
        <Mensaje
          tipo="error"
          titulo="No se pudieron cargar las áreas"
          accion={{ texto: 'Reintentar', onClick: reintentarAreas }}
        >
          {errorAreas}
        </Mensaje>
      ) : areas.length === 0 ? (
        <Tarjeta>
          <EstadoVacio titulo="No hay áreas disponibles">
            Cuando haya áreas disponibles podrás clasificar tu caso y registrarlo.
          </EstadoVacio>
        </Tarjeta>
      ) : (
        <Tarjeta className="p-5 sm:p-7">
          <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
            {errorGeneral && (
              <Mensaje tipo="error" titulo="No se pudo registrar el caso">
                {errorGeneral}
              </Mensaje>
            )}

            <Campo etiqueta="Tipo" htmlFor="tipo-caso" error={errores.tipo}>
              <Segmentado
                aria-label="Tipo"
                id="tipo-caso"
                aria-describedby="tipo-caso-nota"
                aria-invalid={!!errores.tipo}
                completo
                valor={tipo}
                onBlur={() => validarCampo('tipo')}
                onChange={(valor) => {
                  setTipo(valor)
                  limpiarError('tipo')
                }}
                opciones={[
                  { valor: 'INCIDENTE', texto: ETIQUETA_TIPO.INCIDENTE },
                  { valor: 'SOLICITUD', texto: ETIQUETA_TIPO.SOLICITUD },
                ]}
              />
              <div className="grid gap-1.5 text-[12px] text-texto-suave sm:grid-cols-2">
                <p>Interrupción o degradación de un servicio tecnológico.</p>
                <p>Petición de una acción o servicio tecnológico.</p>
              </div>
            </Campo>

            <div className="grid gap-5 sm:grid-cols-2">
              <Campo etiqueta="Área" htmlFor="area-caso" error={errores.areaId}>
                <ListaDesplegable
                  id="area-caso"
                  opciones={areas.map((area) => ({ valor: area.id, texto: area.nombre }))}
                  valor={areaId}
                  invalida={!!errores.areaId}
                  onChange={cambiarArea}
                  onBlur={() => validarCampo('areaId')}
                />
              </Campo>

              <Campo
                etiqueta="Categoría"
                htmlFor="categoria-caso"
                error={errores.categoriaId}
                ayuda={
                  areaId !== null && !cargandoCategorias && !errorCategorias && categorias.length === 0
                    ? 'Sin categorías para esta área'
                    : undefined
                }
              >
                <ListaDesplegable
                  id="categoria-caso"
                  placeholder="Elige una categoría"
                  opciones={categorias.map((categoria) => ({ valor: categoria.id, texto: categoria.nombre }))}
                  valor={categoriaId}
                  invalida={!!errores.categoriaId}
                  deshabilitada={areaId === null || cargandoCategorias || categorias.length === 0 || !!errorCategorias}
                  onChange={(valor) => {
                    setCategoriaId(valor)
                    limpiarError('categoriaId')
                  }}
                  onBlur={() => validarCampo('categoriaId')}
                />
                {cargandoCategorias && <Cargando texto="Cargando categorías…" />}
                {errorCategorias && (
                  <Mensaje
                    tipo="error"
                    titulo="No se pudieron cargar las categorías"
                    accion={{ texto: 'Reintentar', onClick: reintentarCategorias }}
                  >
                    {errorCategorias}
                  </Mensaje>
                )}
              </Campo>
            </div>

            <CampoTexto
              etiqueta="Título"
              id="titulo-caso"
              value={titulo}
              maxLength={180}
              conContador
              placeholder="Resume el problema o la solicitud"
              ayuda="Entre 5 y 180 caracteres."
              error={errores.titulo}
              onChange={(e) => {
                setTitulo(e.target.value)
                limpiarError('titulo')
              }}
              onBlur={() => validarCampo('titulo')}
            />

            <CampoArea
              etiqueta="Descripción"
              id="descripcion-caso"
              value={descripcion}
              conContador
              placeholder="Describe qué ocurre o qué servicio necesitas"
              ayuda="Mínimo 10 caracteres."
              error={errores.descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value)
                limpiarError('descripcion')
              }}
              onBlur={() => validarCampo('descripcion')}
            />

            <Campo etiqueta="Prioridad" htmlFor="prioridad-caso" error={errores.prioridad}>
              <Segmentado
                aria-label="Prioridad"
                id="prioridad-caso"
                aria-describedby="prioridad-caso-nota"
                aria-invalid={!!errores.prioridad}
                completo
                valor={prioridad}
                onBlur={() => validarCampo('prioridad')}
                onChange={(valor) => {
                  setPrioridad(valor)
                  limpiarError('prioridad')
                }}
                opciones={PRIORIDADES.map((valor) => ({ valor, texto: ETIQUETA_PRIORIDAD[valor] }))}
              />
            </Campo>

            <div className="flex justify-end border-t border-linea pt-4">
              <Boton variante="primario" type="submit" cargando={enviando}>
                {enviando ? 'Registrando caso…' : 'Registrar caso'}
              </Boton>
            </div>
          </form>
        </Tarjeta>
      )}
    </section>
  )
}
