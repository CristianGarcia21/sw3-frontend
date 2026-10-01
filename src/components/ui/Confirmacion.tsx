import type { ReactNode } from 'react'
import { Boton } from './Boton'
import { Icono } from './Icono'
import { Modal } from './Modal'

interface Props {
  abierta: boolean
  titulo: string
  mensaje: ReactNode
  /** Verbo de la acción: "Desactivar", "Aprobar". Nunca "Aceptar" ni "Sí" */
  textoConfirmar: string
  onConfirmar: () => void
  onCancelar: () => void
  /** Pinta la acción en rojo y muestra el ícono de alerta */
  destructiva?: boolean
  cargando?: boolean
}

/** Confirmación para acciones que no se deshacen fácil. Para todo lo demás, haz la acción y muestra un aviso */
export function Confirmacion({ abierta, titulo, mensaje, textoConfirmar, onConfirmar, onCancelar, destructiva = false, cargando = false }: Props) {
  return (
    <Modal
      abierto={abierta}
      onCerrar={onCancelar}
      variante="alerta"
      titulo={titulo}
      descripcion={mensaje}
      encabezado={<Icono nombre={destructiva ? 'alerta' : 'validar'} className={`mb-1 size-8.5 ${destructiva ? 'text-urgente' : 'text-acento'}`} />}
      pie={
        <>
          <Boton onClick={onCancelar}>Cancelar</Boton>
          <Boton variante={destructiva ? 'destructivo' : 'primario'} cargando={cargando} onClick={onConfirmar}>
            {textoConfirmar}
          </Boton>
        </>
      }
    />
  )
}
