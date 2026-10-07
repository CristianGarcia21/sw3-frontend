import { useState, type ReactNode } from 'react'
import { Cargando } from '../components/Cargando'
import { EstadoBadge } from '../components/EstadoBadge'
import { Mensaje } from '../components/Mensaje'
import { PrioridadBadge } from '../components/PrioridadBadge'
import { Boton, Campo, CampoArea, CampoTexto, Confirmacion, Esqueleto, EstadoVacio, FiltroMultiple, Interruptor, ListaDesplegable, Modal, Segmentado, Tarjeta } from '../components/ui'
import { useAvisos } from '../hooks/useAvisos'
import type { EstadoCaso, Prioridad, TipoCaso } from '../types'
import { COLOR_ESTADO } from '../utils/colores'
import { ESTADOS, ETIQUETA_ESTADO, ETIQUETA_PRIORIDAD, PRIORIDADES } from '../utils/etiquetas'

// Datos de ejemplo iguales al seed (docs/02-requisitos.md). La galería no llama al backend
const AREAS: Record<string, string[]> = {
  Hardware: ['Computador', 'Periférico', 'Proyector', 'Impresora'],
  Software: ['Instalación', 'Error de aplicación', 'Actualización'],
  'Red y conectividad': ['Wi-Fi', 'Internet', 'Red cableada'],
  'Cuentas y acceso': ['Contraseña', 'Bloqueo de cuenta', 'Correo institucional', 'Permisos'],
  'Plataformas académicas': ['Campus virtual', 'Sistema académico'],
}

const AGENTES = [
  { valor: 3, texto: 'Andrés Pérez', detalle: 'Activo' },
  { valor: 4, texto: 'Marta Gómez', detalle: 'Activo' },
  { valor: 7, texto: 'Pedro Salas', detalle: 'Inactivo', deshabilitada: true },
]

const TOKENS = ['fondo', 'superficie', 'linea', 'texto-suave', 'texto', 'acento', 'tinte', 'urgente']

function Seccion({ titulo, nota, children }: { titulo: string; nota?: string; children: ReactNode }) {
  return (
    <Tarjeta className="flex flex-col gap-3.5 p-5">
      <div>
        <h2 className="text-[11px] font-semibold tracking-[0.05em] text-texto-suave uppercase">{titulo}</h2>
        {nota && <p className="mt-1 text-[12.5px] text-texto-suave">{nota}</p>}
      </div>
      {children}
    </Tarjeta>
  )
}

const Fila = ({ children }: { children: ReactNode }) => <div className="flex flex-wrap items-center gap-2">{children}</div>

/** Galería del sistema de diseño. Sirve para ver cada componente funcionando y copiar su uso */
export function Componentes() {
  const avisos = useAvisos()

  const [area, setArea] = useState<string | null>('Red y conectividad')
  const [categoria, setCategoria] = useState<string | null>(null)
  const [agente, setAgente] = useState<number | null>(4)
  const [filtroEstado, setFiltroEstado] = useState<EstadoCaso[]>(['EN_ATENCION'])
  const [filtroPrioridad, setFiltroPrioridad] = useState<Prioridad[]>([])
  const [filtroArea, setFiltroArea] = useState<string | null>(null)
  const [tipo, setTipo] = useState<TipoCaso>('INCIDENTE')
  const [prioridad, setPrioridad] = useState<Prioridad>('P2')
  const [vista, setVista] = useState('todos')
  const [activa, setActiva] = useState(true)
  const [titulo, setTitulo] = useState('Wifi')
  const [tituloTocado, setTituloTocado] = useState(true)
  const [descripcion, setDescripcion] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [modal, setModal] = useState(false)
  const [comentario, setComentario] = useState('')
  const [confirmar, setConfirmar] = useState(false)

  const errorTitulo = tituloTocado && titulo.trim().length < 5 ? 'El título debe tener entre 5 y 180 caracteres.' : undefined

  function guardar() {
    setGuardando(true)
    setTimeout(() => {
      setGuardando(false)
      avisos.exito('Cambios guardados', 'La categoría quedó actualizada.')
    }, 1100)
  }

  return (
    <section className="flex flex-col gap-6">
      <header>
        <h1 className="text-[34px] leading-tight font-bold tracking-[-0.028em]">Componentes</h1>
        <p className="mt-1 max-w-[62ch] text-texto-suave">
          Las piezas del sistema de diseño funcionando. Antes de crear un control nuevo, revisa si ya está aquí. Las reglas están en docs/08-diseno.md.
        </p>
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <Seccion titulo="Botones" nota="Un solo botón primario por pantalla o modal. El destructivo solo para acciones que quitan o devuelven algo.">
            <Fila>
              <Boton variante="primario">Primario</Boton>
              <Boton>Secundario</Boton>
              <Boton variante="texto">Texto</Boton>
              <Boton variante="destructivo">Destructivo</Boton>
            </Fila>
            <Fila>
              <Boton variante="primario" icono="mas">
                Con ícono
              </Boton>
              <Boton variante="primario" disabled>
                Deshabilitado
              </Boton>
              <Boton variante="primario" cargando={guardando} onClick={guardar}>
                {guardando ? 'Guardando' : 'Guardar'}
              </Boton>
              <Boton soloIcono icono="buscar" aria-label="Buscar" />
            </Fila>
          </Seccion>

          <Seccion titulo="Campos de texto" nota="Se valida al salir del campo y el error va debajo. El contador ayuda con los límites de las reglas de negocio.">
            <CampoTexto
              etiqueta="Título"
              value={titulo}
              maxLength={180}
              conContador
              placeholder="Resume el problema en una frase"
              ayuda="Entre 5 y 180 caracteres."
              error={errorTitulo}
              onChange={(e) => setTitulo(e.target.value)}
              onBlur={() => setTituloTocado(true)}
            />
            <CampoArea
              etiqueta="Descripción"
              value={descripcion}
              conContador
              placeholder="Qué pasa, desde cuándo y qué ya intentaste"
              ayuda="Mínimo 10 caracteres."
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Seccion>

          <Seccion titulo="Listas desplegables" nota="Reemplazan al select nativo. Funcionan con teclado: flechas, Inicio, Fin, Enter y Escape.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Campo etiqueta="Área" htmlFor="galeria-area">
                <ListaDesplegable
                  id="galeria-area"
                  opciones={Object.keys(AREAS).map((a) => ({ valor: a, texto: a }))}
                  valor={area}
                  onChange={(a) => {
                    setArea(a)
                    setCategoria(null)
                  }}
                />
              </Campo>
              <Campo etiqueta="Categoría" htmlFor="galeria-categoria" error={categoria ? undefined : 'Elige una categoría de esa área.'}>
                <ListaDesplegable
                  id="galeria-categoria"
                  placeholder="Elige una categoría"
                  invalida={!categoria}
                  opciones={(area ? AREAS[area] : []).map((c) => ({ valor: c, texto: c }))}
                  valor={categoria}
                  onChange={setCategoria}
                />
              </Campo>
              <Campo etiqueta="Agente" htmlFor="galeria-agente" ayuda="Pedro Salas está inactivo (RN-18).">
                <ListaDesplegable id="galeria-agente" opciones={AGENTES} valor={agente} onChange={setAgente} />
              </Campo>
              <Campo etiqueta="Estado" htmlFor="galeria-estado" ayuda="Deshabilitada.">
                <ListaDesplegable id="galeria-estado" deshabilitada opciones={[{ valor: 'x', texto: 'En atención' }]} valor="x" onChange={() => {}} />
              </Campo>
            </div>
          </Seccion>

          <Seccion titulo="Filtros" nota="Cápsulas con selección múltiple (FiltroMultiple) o de una sola opción (ListaDesplegable con variante cápsula). En vidrio cuando flotan solas; sólidas dentro de una barra de vidrio.">
            <div className="flex flex-wrap gap-2 rounded-2xl bg-fondo p-2.5">
              <FiltroMultiple
                variante="vidrio"
                etiqueta="Estado"
                opciones={ESTADOS.map((e) => ({ valor: e, texto: ETIQUETA_ESTADO[e], color: COLOR_ESTADO[e] }))}
                valor={filtroEstado}
                onChange={setFiltroEstado}
              />
              <FiltroMultiple
                variante="vidrio"
                etiqueta="Prioridad"
                opciones={PRIORIDADES.map((p) => ({ valor: p, texto: ETIQUETA_PRIORIDAD[p] }))}
                valor={filtroPrioridad}
                onChange={setFiltroPrioridad}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <ListaDesplegable
                variante="capsula"
                aria-label="Área"
                opciones={Object.keys(AREAS).map((a) => ({ valor: a, texto: a }))}
                valor={filtroArea}
                onChange={setFiltroArea}
                contenido={<span className="truncate">{filtroArea ? `Área: ${filtroArea}` : 'Área'}</span>}
              />
            </div>
          </Seccion>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Seccion titulo="Avisos" nota="Cuentan el resultado de una acción. Se apilan y se pausan con el mouse o el foco. Los de error se quedan hasta cerrarlos.">
            <Fila>
              <Boton onClick={() => avisos.exito('Caso #1043 registrado', 'Quedó en Pendiente y sin agente.', { texto: 'Ver', onClick: () => {} })}>Éxito</Boton>
              <Boton onClick={() => avisos.info('Caso #1037 devuelto', 'Volvió a En atención con Andrés Pérez.')}>Información</Boton>
              <Boton onClick={() => avisos.advertencia('En validación llegó a su límite', 'Hay 2 de 2 casos.')}>Advertencia</Boton>
              <Boton onClick={() => avisos.error('No se pudo asignar', 'Pedro Salas está inactivo (AGENTE_INVALIDO).', { texto: 'Reintentar', onClick: () => {} })}>Error de la API</Boton>
              <Boton onClick={() => avisos.error('No se pudo registrar el caso', 'La categoría no existe, está inactiva o no pertenece al área enviada.')}>Error largo</Boton>
            </Fila>
          </Seccion>

          <Seccion titulo="Segmentado e interruptor" nota="Segmentado para elegir entre pocas opciones a la vista. Interruptor para activar o desactivar al instante.">
            <Campo etiqueta="Tipo">
              <Segmentado
                aria-label="Tipo"
                completo
                valor={tipo}
                onChange={setTipo}
                opciones={[
                  { valor: 'INCIDENTE', texto: 'Incidente' },
                  { valor: 'SOLICITUD', texto: 'Solicitud de servicio' },
                ]}
              />
            </Campo>
            <Campo etiqueta="Prioridad">
              <Segmentado
                aria-label="Prioridad"
                completo
                valor={prioridad}
                onChange={setPrioridad}
                opciones={PRIORIDADES.map((p) => ({ valor: p, texto: ETIQUETA_PRIORIDAD[p], color: p === 'P1' ? 'var(--urgente)' : undefined }))}
              />
            </Campo>
            <div className="rounded-2xl bg-fondo p-2.5">
              <Segmentado
                aria-label="Vista"
                variante="vidrio"
                valor={vista}
                onChange={setVista}
                opciones={[
                  { valor: 'todos', texto: 'Todos' },
                  { valor: 'mios', texto: 'Míos' },
                  { valor: 'sin', texto: 'Sin asignar' },
                ]}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">Categoría activa</p>
                <p className="text-[12.5px] text-texto-suave">Si la desactivas, deja de aparecer al registrar (RN-21).</p>
              </div>
              <Interruptor aria-label="Categoría activa" activo={activa} onChange={setActiva} />
            </div>
          </Seccion>

          <Seccion titulo="Modal y confirmación" nota="El modal es para tareas que bloquean. La confirmación, solo para lo que no se deshace fácil.">
            <Fila>
              <Boton icono="devolver" onClick={() => setModal(true)}>
                Devolver caso
              </Boton>
              <Boton variante="destructivo" onClick={() => setConfirmar(true)}>
                Desactivar categoría
              </Boton>
            </Fila>
          </Seccion>

          <Seccion titulo="Estados y prioridad">
            <Fila>
              {ESTADOS.map((e) => (
                <EstadoBadge key={e} estado={e} />
              ))}
            </Fila>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {ESTADOS.map((e) => (
                <EstadoBadge key={e} estado={e} variante="punto" />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {PRIORIDADES.map((p) => (
                <PrioridadBadge key={p} prioridad={p} />
              ))}
            </div>
          </Seccion>

          <Seccion titulo="Mensajes, vacío y carga" nota="El mensaje se queda fijo en la página. El aviso flota y se va solo.">
            <Mensaje tipo="error" titulo="No se pudo conectar con el backend" accion={{ texto: 'Reintentar', onClick: () => {} }}>
              Revisa que el backend esté corriendo.
            </Mensaje>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-relleno">
                <EstadoVacio icono="validar" titulo="No hay casos por validar">
                  Cuando un agente registre una solución, el caso aparece aquí.
                </EstadoVacio>
              </div>
              <div className="flex flex-col justify-center gap-2 rounded-2xl bg-relleno p-4">
                <Esqueleto />
                <Cargando texto="Cargando casos…" />
              </div>
            </div>
          </Seccion>

          <Seccion titulo="Colores" nota="Se usan como clases de Tailwind: bg-superficie, text-acento, border-linea. Nunca un color escrito a mano.">
            <div className="grid grid-cols-4 gap-2">
              {TOKENS.map((t) => (
                <div key={t} className="flex flex-col gap-1 text-[11px] text-texto-suave">
                  <span className="h-9 rounded-[10px] shadow-[0_0_0_0.5px_var(--linea)]" style={{ background: `var(--${t})` }} />
                  {t}
                </div>
              ))}
            </div>
          </Seccion>
        </div>
      </div>

      <Modal
        abierto={modal}
        onCerrar={() => setModal(false)}
        titulo="Devolver caso #1037"
        descripcion="Vuelve a En atención con Andrés Pérez. Explica qué le falta a la solución."
        pie={
          <>
            <Boton onClick={() => setModal(false)}>Cancelar</Boton>
            <Boton
              variante="destructivo"
              disabled={comentario.trim().length < 10}
              onClick={() => {
                setModal(false)
                setComentario('')
                avisos.info('Caso #1037 devuelto', 'Volvió a En atención con Andrés Pérez.')
              }}
            >
              Devolver caso
            </Boton>
          </>
        }
      >
        <CampoArea
          etiqueta="Comentario"
          value={comentario}
          conContador
          ayuda="Mínimo 10 caracteres (RN-15)."
          placeholder="Por ejemplo: la cuenta sigue bloqueada al entrar desde el campus virtual"
          onChange={(e) => setComentario(e.target.value)}
        />
      </Modal>

      <Confirmacion
        abierta={confirmar}
        destructiva
        titulo="¿Desactivar “Proyector”?"
        mensaje="Tiene 3 casos, así que no se puede borrar. Dejará de aparecer al registrar, pero esos casos la conservan."
        textoConfirmar="Desactivar"
        onCancelar={() => setConfirmar(false)}
        onConfirmar={() => {
          setConfirmar(false)
          avisos.info('Categoría desactivada', '“Proyector” ya no aparece al registrar casos.')
        }}
      />
    </section>
  )
}
