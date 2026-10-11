import { useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import { crearCategoria, editarCategoria } from '../../api/catalogos'
import { useAvisos } from '../../hooks/useAvisos'
import type { Area, Categoria } from '../../types'
import { Mensaje } from '../Mensaje'
import { Boton, CampoArea, CampoTexto, Modal } from '../ui'

interface Props {
  abierto: boolean
  /** Área de la sección donde se abrió. En edición no se puede cambiar */
  area: Area
  /** null para crear una categoría nueva en `area` */
  categoria: Categoria | null
  onCerrar: () => void
  /** Se llama tras guardar con éxito, para recargar la lista */
  onGuardada: () => void
}

type CampoFormulario = 'nombre' | 'descripcion'

// Límites de docs/03-api.md (HU-11)
const NOMBRE_MIN = 2
const NOMBRE_MAX = 100
const DESCRIPCION_MAX = 255

function validarNombre(nombre: string): string | undefined {
  const largo = nombre.trim().length
  if (largo === 0) return 'Escribe el nombre de la categoría.'
  if (largo < NOMBRE_MIN || largo > NOMBRE_MAX) return `El nombre debe tener entre ${NOMBRE_MIN} y ${NOMBRE_MAX} caracteres.`
  return undefined
}

function validarDescripcion(descripcion: string): string | undefined {
  return descripcion.trim().length > DESCRIPCION_MAX ? `La descripción puede tener hasta ${DESCRIPCION_MAX} caracteres.` : undefined
}

/**
 * HU-11: crear o editar una categoría. El área sale de la sección y no se cambia (PUT no la acepta).
 * Los errores del backend quedan dentro del modal, que sigue abierto con lo escrito.
 */
export function FormularioCategoria({ abierto, area, categoria, onCerrar, onGuardada }: Props) {
  const avisos = useAvisos()
  const [nombre, setNombre] = useState(categoria?.nombre ?? '')
  const [descripcion, setDescripcion] = useState(categoria?.descripcion ?? '')
  const [errores, setErrores] = useState<Partial<Record<CampoFormulario, string>>>({})
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const idFormulario = 'formulario-categoria'

  function cerrar() {
    if (!enviando) onCerrar()
  }

  async function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (enviando) return
    const nuevos = { nombre: validarNombre(nombre), descripcion: validarDescripcion(descripcion) }
    setErrores(nuevos)
    setErrorGeneral(null)
    if (nuevos.nombre || nuevos.descripcion) return

    const datos = { nombre: nombre.trim(), descripcion: descripcion.trim() || undefined }
    // Editar sin cambios no necesita ir al backend
    if (categoria && datos.nombre === categoria.nombre && (datos.descripcion ?? null) === categoria.descripcion) {
      onCerrar()
      return
    }

    setEnviando(true)
    try {
      const guardada = categoria ? await editarCategoria(categoria.id, datos) : await crearCategoria({ areaId: area.id, ...datos })
      if (categoria) avisos.exito(`Categoría "${guardada.nombre}" actualizada`, `Sigue en ${area.nombre}.`)
      else avisos.exito(`Categoría "${guardada.nombre}" creada`, `Ya aparece al registrar casos en ${area.nombre}.`)
      onGuardada()
      onCerrar()
    } catch (error: unknown) {
      if (!(error instanceof ApiError)) {
        setErrorGeneral('Ocurrió un error inesperado. Intenta de nuevo.')
      } else if (error.error === 'VALIDACION') {
        const porCampo = { nombre: error.detalleDe('nombre'), descripcion: error.detalleDe('descripcion') }
        setErrores(porCampo)
        if (!porCampo.nombre && !porCampo.descripcion) setErrorGeneral(error.mensaje)
      } else if (error.error === 'CATEGORIA_DUPLICADA') {
        setErrores({ nombre: error.mensaje })
      } else if (error.error === 'NO_ENCONTRADO') {
        // El área o la categoría ya no existe: no hay nada que guardar, se recarga la lista
        avisos.error('No se pudo guardar la categoría', error.mensaje)
        onGuardada()
        onCerrar()
      } else {
        setErrorGeneral(error.mensaje)
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Modal
      abierto={abierto}
      onCerrar={cerrar}
      titulo={categoria ? `Editar "${categoria.nombre}"` : 'Nueva categoría'}
      descripcion={categoria ? `Área: ${area.nombre}. El área no se cambia; si hace falta, crea la categoría en otra área.` : `Área: ${area.nombre}.`}
      pie={
        <>
          <Boton disabled={enviando} onClick={cerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" form={idFormulario} variante="primario" cargando={enviando}>
            {categoria ? 'Guardar cambios' : 'Crear categoría'}
          </Boton>
        </>
      }
    >
      <form id={idFormulario} onSubmit={guardar} noValidate className="flex flex-col gap-4">
        {errorGeneral && (
          <Mensaje tipo="error" titulo="No se pudo guardar la categoría">
            {errorGeneral}
          </Mensaje>
        )}
        <CampoTexto
          id="categoria-nombre"
          etiqueta="Nombre"
          placeholder="Por ejemplo, Licencias"
          value={nombre}
          maxLength={NOMBRE_MAX}
          conContador
          ayuda={`Entre ${NOMBRE_MIN} y ${NOMBRE_MAX} caracteres. No puede repetirse en el área.`}
          error={errores.nombre}
          disabled={enviando}
          onChange={(e) => {
            setNombre(e.target.value)
            setErrores((actuales) => ({ ...actuales, nombre: undefined }))
          }}
          onBlur={() => setErrores((actuales) => ({ ...actuales, nombre: validarNombre(nombre) }))}
        />
        <CampoArea
          id="categoria-descripcion"
          etiqueta="Descripción (opcional)"
          placeholder="Qué tipo de casos entran en esta categoría"
          value={descripcion}
          maxLength={DESCRIPCION_MAX}
          conContador
          error={errores.descripcion}
          disabled={enviando}
          onChange={(e) => {
            setDescripcion(e.target.value)
            setErrores((actuales) => ({ ...actuales, descripcion: undefined }))
          }}
          onBlur={() => setErrores((actuales) => ({ ...actuales, descripcion: validarDescripcion(descripcion) }))}
        />
      </form>
    </Modal>
  )
}
