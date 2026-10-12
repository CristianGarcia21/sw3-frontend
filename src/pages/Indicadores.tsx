import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import { ApiError } from '../api/client'
import { obtenerIndicadores, type RangoFechas } from '../api/indicadores'
import { GraficoBarras, GraficoDona, TarjetaGrafico, type Dato } from '../components/indicadores/Graficos'
import { Mensaje } from '../components/Mensaje'
import { Boton, Campo, Esqueleto, EstadoVacio, Tarjeta } from '../components/ui'
import { CLASES_CONTROL, CLASES_CONTROL_ERROR } from '../components/ui/Campo'
import { useColoresTema } from '../hooks/useColoresTema'
import type { Indicadores as DatosIndicadores } from '../types'
import { ESTADOS, ETIQUETA_ESTADO, ETIQUETA_PRIORIDAD, ETIQUETA_TIPO, formatearHoras, PRIORIDADES, TIPOS } from '../utils/etiquetas'

interface Cargado<T> {
  clave: string
  valor: T
}

const FECHA = /^\d{4}-\d{2}-\d{2}$/
const numero = new Intl.NumberFormat('es-CO')
// Las fechas del rango son días en UTC (docs/03-api.md): se muestran sin pasarlas a la hora local
const formatoDia = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeZone: 'UTC' })
const dia = (iso: string) => formatoDia.format(new Date(`${iso}T00:00:00Z`))

// Colores de la paleta que pinta Recharts: el acento para una serie, los de PrioridadBadge para prioridad
const TOKENS = ['urgente', 'estado-en-analisis', 'estado-pendiente', 'acento'] as const

function leerRango(parametros: URLSearchParams): RangoFechas {
  const rango: RangoFechas = {}
  const desde = parametros.get('desde')
  const hasta = parametros.get('hasta')
  if (desde && FECHA.test(desde)) rango.desde = desde
  if (hasta && FECHA.test(hasta)) rango.hasta = hasta
  return rango
}

function describirRango({ desde, hasta }: RangoFechas): string {
  if (desde && hasta) return `Casos creados del ${dia(desde)} al ${dia(hasta)}`
  if (desde) return `Casos creados desde el ${dia(desde)}`
  if (hasta) return `Casos creados hasta el ${dia(hasta)}`
  return 'Todos los casos registrados'
}

/** HU-10: indicadores del servicio para el administrador. Los cálculos los hace el backend (GET /indicadores) */
export function Indicadores() {
  // El rango aplicado va en la URL (?desde=&hasta=), para poder recargar o compartir la consulta
  const [parametros, setParametros] = useSearchParams()
  const rango = leerRango(parametros)
  const consulta = JSON.stringify(rango)

  // Lo que se escribe en las fechas no se aplica hasta pulsar Aplicar
  const [borrador, setBorrador] = useState({ desdeUrl: consulta, desde: rango.desde ?? '', hasta: rango.hasta ?? '' })
  const fechas = borrador.desdeUrl === consulta ? borrador : { desdeUrl: consulta, desde: rango.desde ?? '', hasta: rango.hasta ?? '' }
  const rangoInvalido = fechas.desde !== '' && fechas.hasta !== '' && fechas.desde > fechas.hasta

  const [datos, setDatos] = useState<Cargado<DatosIndicadores> | null>(null)
  const [error, setError] = useState<Cargado<ApiError> | null>(null)
  const [intento, setIntento] = useState(0)
  const [actualizando, setActualizando] = useState(false)
  const colores = useColoresTema(TOKENS)

  useEffect(() => {
    let cancelado = false
    obtenerIndicadores(JSON.parse(consulta) as RangoFechas)
      .then((valor) => {
        if (cancelado) return
        setDatos({ clave: consulta, valor })
        setError(null)
      })
      .catch((e: unknown) => {
        if (cancelado) return
        setError({ clave: consulta, valor: e instanceof ApiError ? e : new ApiError(0, 'ERROR_INTERNO', 'No se pudieron cargar los indicadores') })
      })
      .finally(() => {
        if (!cancelado) setActualizando(false)
      })
    return () => {
      cancelado = true
    }
  }, [consulta, intento])

  function recargar() {
    setActualizando(true)
    setIntento((n) => n + 1)
  }

  function aplicar(e: FormEvent) {
    e.preventDefault()
    if (rangoInvalido) return
    setParametros(
      (actuales) => {
        const siguientes = new URLSearchParams(actuales)
        for (const clave of ['desde', 'hasta'] as const) {
          if (fechas[clave]) siguientes.set(clave, fechas[clave])
          else siguientes.delete(clave)
        }
        return siguientes
      },
      { replace: true },
    )
    // Con el mismo rango, Aplicar vuelve a pedir los datos
    if (JSON.stringify({ ...(fechas.desde && { desde: fechas.desde }), ...(fechas.hasta && { hasta: fechas.hasta }) }) === consulta) recargar()
  }

  function verTodo() {
    setBorrador({ desdeUrl: '{}', desde: '', hasta: '' })
    setParametros(
      (actuales) => {
        const siguientes = new URLSearchParams(actuales)
        siguientes.delete('desde')
        siguientes.delete('hasta')
        return siguientes
      },
      { replace: true },
    )
  }

  const hayRango = Boolean(rango.desde || rango.hasta)
  // Mientras llega el rango nuevo se siguen viendo los números anteriores, sin parpadeo
  const valor = datos?.valor ?? null
  const cargandoRango = datos !== null && datos.clave !== consulta
  const fallo = error?.clave === consulta ? error.valor : null

  let contenido
  if (!valor) {
    contenido = fallo ? null : <CargandoIndicadores />
  } else if (valor.total === 0) {
    contenido = (
      <Tarjeta>
        {hayRango ? (
          <EstadoVacio icono="indicadores" titulo="No hay casos creados en ese rango" accion={<Boton onClick={verTodo}>Ver todos los casos</Boton>}>
            Prueba con otras fechas o quita el rango para ver todos los datos.
          </EstadoVacio>
        ) : (
          <EstadoVacio icono="indicadores" titulo="Todavía no hay casos registrados">
            Cuando los solicitantes registren casos, aquí verás cuántos hay, en qué estado van y cuánto se tarda en atenderlos.
          </EstadoVacio>
        )}
      </Tarjeta>
    )
  } else {
    const porEstado: Dato[] = ESTADOS.map((e) => ({ clave: e, nombre: ETIQUETA_ESTADO[e], valor: valor.porEstado[e] ?? 0 }))
    const colorPrioridad = { P1: colores.urgente, P2: colores['estado-en-analisis'], P3: colores['estado-pendiente'] }
    const porPrioridad: Dato[] = PRIORIDADES.map((p) => ({ clave: p, nombre: ETIQUETA_PRIORIDAD[p], valor: valor.porPrioridad[p] ?? 0, color: colorPrioridad[p] }))
    const colorTipo = { INCIDENTE: colores.acento, SOLICITUD: colores['estado-en-analisis'] }
    const porTipo: Dato[] = TIPOS.map((t) => ({ clave: t, nombre: ETIQUETA_TIPO[t], valor: valor.porTipo[t] ?? 0, color: colorTipo[t] }))
    const porArea: Dato[] = valor.porArea.map((a) => ({ clave: String(a.areaId), nombre: a.area, valor: a.cantidad }))

    contenido = (
      <div className={`flex flex-col gap-4 transition-opacity duration-200 ${cargandoRango ? 'opacity-60' : ''}`} aria-busy={cargandoRango || actualizando}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Cifra etiqueta="Total de casos" valor={numero.format(valor.total)} detalle={hayRango ? 'Creados en el rango' : 'Registrados en total'} />
          <Cifra etiqueta="Tiempo hasta asignación" valor={formatearHoras(valor.promedioHorasHastaAsignacion)} detalle="Promedio desde que se registra hasta que tiene agente" />
          <Cifra etiqueta="Tiempo de resolución" valor={formatearHoras(valor.promedioHorasResolucion)} detalle="Promedio desde que se registra hasta que se cierra" />
          <Cifra etiqueta="Devoluciones" valor={numero.format(valor.devoluciones)} detalle="Soluciones que el validador devolvió" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <TarjetaGrafico titulo="Casos por estado" descripcion="En el orden del flujo" datos={porEstado}>
            <GraficoBarras datos={porEstado} />
          </TarjetaGrafico>
          <TarjetaGrafico titulo="Casos por tipo" datos={porTipo}>
            <GraficoDona datos={porTipo} />
          </TarjetaGrafico>
          <TarjetaGrafico titulo="Casos por prioridad" datos={porPrioridad}>
            <GraficoBarras datos={porPrioridad} />
          </TarjetaGrafico>
          <TarjetaGrafico titulo="Casos por área" datos={porArea}>
            <GraficoBarras datos={porArea} orientacion="filas" />
          </TarjetaGrafico>
        </div>
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[34px] leading-tight font-bold tracking-[-0.028em]">Indicadores</h1>
          <p className="mt-1 text-texto-suave">{describirRango(rango)}</p>
        </div>
        <Boton cargando={actualizando} onClick={recargar}>
          Actualizar
        </Boton>
      </header>

      <Tarjeta className="p-4">
        <form onSubmit={aplicar} className="flex flex-wrap items-start gap-3" aria-label="Rango de fechas">
          <div className="w-44">
            <Campo etiqueta="Desde" htmlFor="indicadores-desde">
              <input
                id="indicadores-desde"
                type="date"
                value={fechas.desde}
                max={fechas.hasta || undefined}
                onChange={(e) => setBorrador({ ...fechas, desde: e.target.value })}
                className={CLASES_CONTROL}
              />
            </Campo>
          </div>
          <div className="w-44">
            <Campo etiqueta="Hasta" htmlFor="indicadores-hasta" error={rangoInvalido ? 'Debe ser igual o posterior a la fecha inicial.' : undefined}>
              <input
                id="indicadores-hasta"
                type="date"
                value={fechas.hasta}
                min={fechas.desde || undefined}
                aria-invalid={rangoInvalido}
                aria-describedby={rangoInvalido ? 'indicadores-hasta-nota' : undefined}
                onChange={(e) => setBorrador({ ...fechas, hasta: e.target.value })}
                className={`${CLASES_CONTROL} ${rangoInvalido ? CLASES_CONTROL_ERROR : ''}`}
              />
            </Campo>
          </div>
          <div className="flex gap-2 pt-6.5">
            <Boton type="submit" variante="primario" disabled={rangoInvalido} cargando={cargandoRango}>
              Aplicar
            </Boton>
            {hayRango && (
              <Boton variante="texto" onClick={verTodo}>
                Quitar fechas
              </Boton>
            )}
          </div>
        </form>
      </Tarjeta>

      {fallo && (
        <Mensaje tipo="error" titulo="No se pudieron cargar los indicadores" accion={{ texto: 'Reintentar', onClick: recargar }}>
          {fallo.mensaje}
        </Mensaje>
      )}

      {contenido}
    </section>
  )
}

/** Una cifra del resumen. "Sin datos" se ve más tenue para no confundirse con un número */
function Cifra({ etiqueta, valor, detalle }: { etiqueta: string; valor: string; detalle: string }) {
  const sinDatos = valor === 'Sin datos'
  return (
    <Tarjeta className="flex flex-col gap-1 p-5">
      <h2 className="text-[13px] text-texto-suave">{etiqueta}</h2>
      <p className={`leading-tight font-bold tracking-[-0.02em] ${sinDatos ? 'text-xl text-texto-suave' : 'text-[28px]'}`}>{valor}</p>
      <p className="text-xs text-texto-suave">{detalle}</p>
    </Tarjeta>
  )
}

function CargandoIndicadores() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Tarjeta key={i} className="p-5">
            <Esqueleto lineas={3} />
          </Tarjeta>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Tarjeta key={i} className="h-72 p-5">
            <Esqueleto lineas={5} />
          </Tarjeta>
        ))}
      </div>
    </div>
  )
}
