// Tipos del dominio, iguales al contrato de docs/03-api.md

export type Rol = 'SOLICITANTE' | 'AGENTE' | 'VALIDADOR' | 'ADMINISTRADOR'

export type TipoCaso = 'INCIDENTE' | 'SOLICITUD'

export type Prioridad = 'P1' | 'P2' | 'P3'

export type EstadoCaso =
  | 'PENDIENTE'
  | 'EN_ANALISIS'
  | 'EN_ATENCION'
  | 'EN_VALIDACION'
  | 'CERRADA'

export type EventoHistorial =
  | 'CREACION'
  | 'RECLASIFICACION'
  | 'ASIGNACION'
  | 'CAMBIO_ESTADO'
  | 'ATENCION'
  | 'APROBACION'
  | 'DEVOLUCION'

export interface Usuario {
  id: number
  nombre: string
  correo: string
  rol: Rol
  activo: boolean
}

/** Referencia corta a un usuario dentro de otros objetos */
export interface UsuarioResumen {
  id: number
  nombre: string
}

export interface Area {
  id: number
  nombre: string
  descripcion: string | null
}

export interface Categoria {
  id: number
  areaId: number
  nombre: string
  descripcion: string | null
  activa: boolean
  /** Casos que usan la categoría (HU-11); lo envía la API en GET y en las escrituras de /categorias */
  totalCasos?: number
}

export interface Atencion {
  id: number
  diagnostico: string
  solucion: string
  fecha: string
  agente: UsuarioResumen
}

export interface Caso {
  id: number
  tipo: TipoCaso
  titulo: string
  descripcion: string
  prioridad: Prioridad
  estado: EstadoCaso
  solicitante: UsuarioResumen
  agente: UsuarioResumen | null
  categoria: { id: number; nombre: string }
  area: { id: number; nombre: string }
  fechaCreacion: string
  fechaAsignacion: string | null
  fechaCierre: string | null
}

export interface NuevoCaso {
  tipo: TipoCaso
  titulo: string
  descripcion: string
  prioridad: Prioridad
  areaId: number
  categoriaId: number
}

/** Respuesta de GET /casos/:id */
export interface CasoDetalle extends Caso {
  atenciones: Atencion[]
  solucionVigente: Atencion | null
}

export interface EventoHistorialItem {
  id: number
  evento: EventoHistorial
  estadoAnterior: EstadoCaso | null
  estadoNuevo: EstadoCaso | null
  usuario: UsuarioResumen & { rol?: Rol }
  fecha: string
  comentario: string | null
}

export interface Indicadores {
  total: number
  porEstado: Record<EstadoCaso, number>
  porTipo: Record<TipoCaso, number>
  porPrioridad: Record<Prioridad, number>
  porArea: { areaId: number; area: string; cantidad: number }[]
  promedioHorasHastaAsignacion: number | null
  promedioHorasResolucion: number | null
  devoluciones: number
}

/** Códigos de error de la API (lista cerrada en docs/03-api.md) */
export type CodigoError =
  | 'VALIDACION'
  | 'USUARIO_REQUERIDO'
  | 'ROL_NO_PERMITIDO'
  | 'NO_ES_AGENTE_ASIGNADO'
  | 'CASO_AJENO'
  | 'NO_ENCONTRADO'
  | 'CATEGORIA_INVALIDA'
  | 'TRANSICION_INVALIDA'
  | 'CASO_CERRADO'
  | 'ESTADO_NO_PERMITE_OPERACION'
  | 'SIN_AGENTE_ASIGNADO'
  | 'SIN_SOLUCION'
  | 'AGENTE_INVALIDO'
  | 'VALIDADOR_ES_AGENTE'
  | 'CATEGORIA_DUPLICADA'
  | 'CATEGORIA_CON_CASOS'
  | 'ERROR_INTERNO'
  | 'SIN_CONEXION'

export interface DetalleError {
  campo: string
  mensaje: string
}
