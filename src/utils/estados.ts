import type { EstadoCaso } from '../types'

export interface TransicionManualEstado {
  estadoSiguiente: EstadoCaso
  accion: string
  mensajeConfirmacion: string
}

const TRANSICIONES_MANUALES: Partial<Record<EstadoCaso, TransicionManualEstado>> = {
  PENDIENTE: {
    estadoSiguiente: 'EN_ANALISIS',
    accion: 'Pasar a análisis',
    mensajeConfirmacion: 'El caso no podrá volver a Pendiente.',
  },
  EN_ANALISIS: {
    estadoSiguiente: 'EN_ATENCION',
    accion: 'Iniciar atención',
    mensajeConfirmacion: 'El caso no podrá volver a En análisis.',
  },
  EN_ATENCION: {
    estadoSiguiente: 'EN_VALIDACION',
    accion: 'Enviar a validación',
    mensajeConfirmacion: 'No podrás deshacer este envío desde las acciones del agente.',
  },
}

/** Devuelve la única transición manual del estado o null si no aplica al agente */
export function obtenerTransicionManual(estado: EstadoCaso): TransicionManualEstado | null {
  return TRANSICIONES_MANUALES[estado] ?? null
}
