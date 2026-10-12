import { useId, type ReactNode } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useColoresTema } from '../../hooks/useColoresTema'
import { Tarjeta } from '../ui'

/** Una barra o porción. `color` es opcional: sin él se usa el acento (una sola serie, un solo color) */
export interface Dato {
  clave: string
  nombre: string
  valor: number
  color?: string
}

const TOKENS = ['acento', 'texto', 'texto-suave', 'linea', 'superficie', 'relleno'] as const
const numero = new Intl.NumberFormat('es-CO')
const porcentaje = new Intl.NumberFormat('es-CO', { style: 'percent', maximumFractionDigits: 0 })
const reducirMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const textoCasos = (n: number) => `${numero.format(n)} ${n === 1 ? 'caso' : 'casos'}`

/** Tarjeta de un gráfico con su título. Incluye la tabla con los mismos datos para lectores de pantalla */
export function TarjetaGrafico({ titulo, descripcion, datos, children }: { titulo: string; descripcion?: string; datos: Dato[]; children: ReactNode }) {
  const id = useId()
  return (
    <Tarjeta className="flex min-w-0 flex-col gap-4 p-5">
      <div>
        <h2 id={id} className="text-[15px] font-semibold">
          {titulo}
        </h2>
        {descripcion && <p className="text-[13px] text-texto-suave">{descripcion}</p>}
      </div>
      <div aria-hidden="true">{children}</div>
      <table className="sr-only" aria-labelledby={id}>
        <thead>
          <tr>
            <th scope="col">Categoría</th>
            <th scope="col">Casos</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d) => (
            <tr key={d.clave}>
              <th scope="row">{d.nombre}</th>
              <td>{d.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Tarjeta>
  )
}

/** Globo del cursor, en vidrio grueso como los demás elementos flotantes */
function Globo({ active, payload, total }: { active?: boolean; payload?: readonly unknown[]; total: number }) {
  // Recharts entrega en cada elemento el dato original de la barra o porción
  const dato = (payload?.[0] as { payload?: Dato } | undefined)?.payload
  if (!active || !dato) return null
  return (
    <div className="vidrio-grueso rounded-xl px-3 py-2 text-[13px] text-texto">
      <p className="font-semibold">{dato.nombre}</p>
      <p className="text-texto-suave">
        {textoCasos(dato.valor)}
        {total > 0 && ` · ${porcentaje.format(dato.valor / total)}`}
      </p>
    </div>
  )
}

interface PropsBarras {
  datos: Dato[]
  /** 'columnas' crecen hacia arriba; 'filas' son barras horizontales, para nombres largos */
  orientacion?: 'columnas' | 'filas'
}

/** Barras delgadas (24 px como máximo) con punta redondeada, el valor en la punta y una cuadrícula de pelo */
export function GraficoBarras({ datos, orientacion = 'columnas' }: PropsBarras) {
  const c = useColoresTema(TOKENS)
  const total = datos.reduce((suma, d) => suma + d.valor, 0)
  const filas = orientacion === 'filas'
  const ejeTexto = { fill: c['texto-suave'], fontSize: 12 }
  const alto = filas ? datos.length * 44 + 16 : 240

  return (
    <ResponsiveContainer width="100%" height={alto}>
      <BarChart data={datos} layout={filas ? 'vertical' : 'horizontal'} margin={{ top: filas ? 0 : 22, right: filas ? 40 : 4, bottom: 0, left: filas ? 0 : -18 }}>
        <CartesianGrid stroke={c.linea} strokeWidth={1} vertical={filas} horizontal={!filas} />
        {filas ? (
          <>
            <XAxis type="number" allowDecimals={false} tick={ejeTexto} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="nombre" width={150} tick={{ ...ejeTexto, fill: c.texto, fontSize: 13 }} axisLine={false} tickLine={false} />
          </>
        ) : (
          <>
            <XAxis dataKey="nombre" interval={0} tick={{ ...ejeTexto, fill: c.texto }} axisLine={{ stroke: c.linea }} tickLine={false} />
            <YAxis allowDecimals={false} tick={ejeTexto} axisLine={false} tickLine={false} />
          </>
        )}
        <Tooltip cursor={{ fill: c.relleno }} content={(props) => <Globo active={props.active} payload={props.payload} total={total} />} />
        <Bar dataKey="valor" maxBarSize={24} radius={filas ? [0, 4, 4, 0] : [4, 4, 0, 0]} isAnimationActive={!reducirMovimiento()} animationDuration={500}>
          {datos.map((d) => (
            <Cell key={d.clave} fill={d.color ?? c.acento} />
          ))}
          <LabelList dataKey="valor" position={filas ? 'right' : 'top'} fill={c.texto} fontSize={12} fontWeight={600} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/** Dona con el total en el centro y la leyenda con cantidad y porcentaje (el color nunca va solo) */
export function GraficoDona({ datos }: { datos: Dato[] }) {
  const c = useColoresTema(TOKENS)
  const total = datos.reduce((suma, d) => suma + d.valor, 0)

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative size-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* El borde del color de la superficie deja el espacio de 2 px entre porciones */}
            <Pie data={datos} dataKey="valor" nameKey="nombre" innerRadius="70%" outerRadius="100%" stroke={c.superficie} strokeWidth={2} startAngle={90} endAngle={-270} isAnimationActive={!reducirMovimiento()} animationDuration={500}>
              {datos.map((d) => (
                <Cell key={d.clave} fill={d.color ?? c.acento} />
              ))}
            </Pie>
            <Tooltip content={(props) => <Globo active={props.active} payload={props.payload} total={total} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-2xl leading-none font-bold tracking-[-0.02em]">{numero.format(total)}</p>
            <p className="mt-1 text-xs text-texto-suave">{total === 1 ? 'caso' : 'casos'}</p>
          </div>
        </div>
      </div>
      <ul className="flex min-w-40 flex-1 flex-col gap-2.5">
        {datos.map((d) => (
          <li key={d.clave} className="flex items-center gap-2.5 text-sm">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: d.color ?? c.acento }} />
            <span className="flex-1">{d.nombre}</span>
            <span className="cifras font-semibold">{numero.format(d.valor)}</span>
            <span className="cifras w-10 text-right text-texto-suave">{total > 0 ? porcentaje.format(d.valor / total) : '—'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
