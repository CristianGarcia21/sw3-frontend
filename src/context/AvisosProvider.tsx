import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icono, type NombreIcono } from '../components/ui/Icono'
import { AvisosContext, type AccionAviso, type Aviso, type AvisosValor, type TipoAviso } from './AvisosContext'

const DURACION = 5000
const MAXIMO = 4
const ANCHO_GOTA = 56

const APARIENCIA: Record<TipoAviso, { icono: NombreIcono; tono: string }> = {
  exito: { icono: 'check', tono: 'var(--estado-cerrada)' },
  info: { icono: 'info', tono: 'var(--acento)' },
  advertencia: { icono: 'alerta', tono: 'var(--estado-en-analisis)' },
  error: { icono: 'cerrar', tono: 'var(--urgente)' },
}

// Fases de la gota: oculta → gota con solo el ícono → abierta con el texto → se recoge → sale
type Fase = 'oculta' | 'gota' | 'abierta' | 'recogida' | 'fuera'

interface PropsGota {
  aviso: Aviso
  indice: number
  desplegado: boolean
  onEntrar: () => void
  onSalir: () => void
  onQuitar: (id: number) => void
}

function GotaAviso({ aviso, indice, desplegado, onEntrar, onSalir, onQuitar }: PropsGota) {
  const el = useRef<HTMLDivElement>(null)
  const [fase, setFase] = useState<Fase>('oculta')
  const [ancho, setAncho] = useState(ANCHO_GOTA)
  const restante = useRef(DURACION)
  const { icono, tono } = APARIENCIA[aviso.tipo]

  // Mide el ancho natural antes de pintar, para poder animar de gota a cápsula
  useLayoutEffect(() => {
    if (!el.current) return
    el.current.style.width = 'auto'
    setAncho(Math.min(el.current.offsetWidth, 560, window.innerWidth - 32))
    el.current.style.width = `${ANCHO_GOTA}px`
  }, [])

  useEffect(() => {
    const cuadro = requestAnimationFrame(() => setFase('gota'))
    const espera = setTimeout(() => setFase('abierta'), 160)
    return () => {
      cancelAnimationFrame(cuadro)
      clearTimeout(espera)
    }
  }, [])

  const cerrar = useCallback(() => setFase((f) => (f === 'recogida' || f === 'fuera' ? f : 'recogida')), [])

  // El tiempo solo corre con el aviso abierto y el mazo recogido
  useEffect(() => {
    if (fase !== 'abierta' || desplegado) return
    const inicio = Date.now()
    const espera = setTimeout(cerrar, Math.max(restante.current, 600))
    return () => {
      clearTimeout(espera)
      restante.current -= Date.now() - inicio
    }
  }, [fase, desplegado, cerrar])

  useEffect(() => {
    if (fase === 'recogida') {
      const espera = setTimeout(() => setFase('fuera'), 260)
      return () => clearTimeout(espera)
    }
    if (fase === 'fuera') {
      const espera = setTimeout(() => onQuitar(aviso.id), 420)
      return () => clearTimeout(espera)
    }
  }, [fase, aviso.id, onQuitar])

  const escondida = fase === 'oculta' || fase === 'fuera'
  const abierta = fase === 'abierta'
  const y = (desplegado ? -indice * 64 : -indice * 11) + (fase === 'fuera' ? 14 : 0)
  const escala = escondida ? 0.6 : desplegado ? 1 : Math.max(1 - indice * 0.06, 0.82)

  return (
    <div
      ref={el}
      role={aviso.tipo === 'error' ? 'alert' : 'status'}
      onMouseEnter={onEntrar}
      onMouseLeave={onSalir}
      className="aviso absolute bottom-0 left-0 flex h-14 origin-bottom items-center gap-2.5 overflow-hidden rounded-full p-1.5 whitespace-nowrap text-texto transition-[width,translate,scale,opacity,filter] duration-[620ms] ease-resorte"
      style={{
        ['--tono' as string]: tono,
        width: abierta ? ancho : ANCHO_GOTA,
        translate: `-50% ${y}px`,
        scale: escala,
        opacity: escondida || (!desplegado && indice > 2) ? 0 : 1,
        filter: escondida ? 'blur(8px)' : 'none',
        zIndex: 20 - indice,
      }}
    >
      <span className="relative grid size-11 shrink-0 place-items-center">
        <svg viewBox="0 0 44 44" aria-hidden="true" className="absolute inset-0 size-11 -rotate-90 fill-none" strokeWidth={2.4} strokeLinecap="round">
          <circle cx="22" cy="22" r="20.5" style={{ stroke: `color-mix(in srgb, ${tono} 20%, transparent)` }} />
          <circle
            cx="22"
            cy="22"
            r="20.5"
            className="animate-anillo"
            style={{ stroke: tono, strokeDasharray: 128.8, animationDuration: `${DURACION}ms`, animationPlayState: desplegado || !abierta ? 'paused' : 'running' }}
          />
        </svg>
        <span className="grid size-8 place-items-center rounded-full text-superficie shadow-[inset_0_1px_0_rgb(255_255_255/0.4)]" style={{ background: tono }}>
          <Icono nombre={icono} className="size-4.25 stroke-[2.4]" />
        </span>
      </span>

      <span className={`flex max-w-[420px] min-w-0 flex-col leading-tight transition-opacity duration-200 ${abierta ? 'delay-150' : 'opacity-0'}`}>
        <b className="truncate text-[13.5px] font-semibold">{aviso.titulo}</b>
        {aviso.texto && <span className="truncate text-[12.5px] font-medium text-texto/75">{aviso.texto}</span>}
      </span>

      <span className={`ml-1 flex items-center gap-0.5 transition-opacity duration-200 ${abierta ? 'delay-150' : 'opacity-0'}`}>
        {aviso.accion && (
          <button
            type="button"
            onClick={() => {
              aviso.accion?.onClick()
              cerrar()
            }}
            className="h-8.5 cursor-pointer rounded-full bg-superficie/55 px-3.5 text-[12.5px] font-semibold shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_0_0_0.5px_rgb(0_0_0/0.06)] transition-[scale] duration-150 active:scale-95 dark:bg-white/12 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.18)]"
          >
            {aviso.accion.texto}
          </button>
        )}
        <button
          type="button"
          aria-label="Cerrar aviso"
          onClick={cerrar}
          className="grid size-8.5 cursor-pointer place-items-center rounded-full text-texto/55 transition-[scale,background-color] duration-150 hover:bg-texto/8 active:scale-95"
        >
          <Icono nombre="cerrar" className="size-3.25 stroke-[2.3]" />
        </button>
      </span>
    </div>
  )
}

/** Guarda los avisos y los pinta abajo al centro, encima de todo. Va una sola vez, en main.tsx */
export function AvisosProvider({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [desplegado, setDesplegado] = useState(false)
  const siguiente = useRef(1)
  const recoger = useRef<ReturnType<typeof setTimeout>>(undefined)

  const quitar = useCallback((id: number) => setAvisos((lista) => lista.filter((a) => a.id !== id)), [])

  const valor = useMemo<AvisosValor>(() => {
    const mostrar = (tipo: TipoAviso) => (titulo: string, texto?: string, accion?: AccionAviso) =>
      setAvisos((lista) => [{ id: siguiente.current++, tipo, titulo, texto, accion }, ...lista].slice(0, MAXIMO))
    return { exito: mostrar('exito'), info: mostrar('info'), advertencia: mostrar('advertencia'), error: mostrar('error') }
  }, [])

  // Al pasar el mouse el mazo se despliega; se recoge con una pequeña espera para que no parpadee entre avisos
  const entrar = useCallback(() => {
    clearTimeout(recoger.current)
    setDesplegado(true)
  }, [])
  const salir = useCallback(() => {
    clearTimeout(recoger.current)
    recoger.current = setTimeout(() => setDesplegado(false), 140)
  }, [])

  // Sin avisos no queda nada desplegado (se ajusta durante el render)
  if (avisos.length === 0 && desplegado) setDesplegado(false)

  return (
    <AvisosContext.Provider value={valor}>
      {children}
      {createPortal(
        <div aria-live="polite" className="fixed bottom-6 left-1/2 z-80 size-0 md:left-[calc(50%+7.75rem)]">
          {avisos.map((aviso, indice) => (
            <GotaAviso key={aviso.id} aviso={aviso} indice={indice} desplegado={desplegado} onEntrar={entrar} onSalir={salir} onQuitar={quitar} />
          ))}
        </div>,
        document.body,
      )}
    </AvisosContext.Provider>
  )
}
