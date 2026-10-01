# Guía de diseño

Cómo se ve y se comporta CampusHelp, para que las pantallas de todos queden iguales. Aplica a cualquier pantalla nueva, la programes a mano o con IA.

El estilo es Liquid Glass de Apple con la paleta Océano: superficies limpias, un solo color de acento, vidrio translúcido para los controles que flotan y nada de degradados.

Para ver todo funcionando, corre la app y entra a **`/componentes`**. No necesita backend.

## Las seis reglas

1. **Usa los componentes de `src/components/ui/`.** Antes de crear un botón, un campo o un modal, revisa si ya existe. No uses `<select>`, `alert()` ni `confirm()` del navegador.
2. **Usa los tokens, nunca colores a mano.** `bg-superficie`, `text-acento`, `border-linea`. Nada de `bg-slate-100`, `text-red-600` ni `#1b4242` en las pantallas. Así el modo oscuro funciona solo.
3. **El vidrio es solo para controles que flotan.** Navegación, barras de filtros, menús, modales y avisos. El contenido (tablas, formularios, textos) va en una `Tarjeta` sólida.
4. **Nunca vidrio sobre vidrio.** Dentro de un modal o una barra de vidrio, los controles usan relleno sólido.
5. **Sin degradados.** Ni en fondos, ni en botones, ni en gráficos.
6. **Un solo botón primario por pantalla o modal.** Lo demás es secundario o de texto.

## Colores

Están definidos en [src/index.css](../src/index.css) y cambian solos entre claro y oscuro.

| Clase de Tailwind | Para qué | Claro | Oscuro |
|---|---|---|---|
| `bg-fondo` | Fondo de la página | `#E7EFEC` | `#04141C` |
| `bg-superficie` | Tarjetas, tablas, formularios | `#FFFFFF` | `#092635` |
| `text-texto` | Texto principal | `#092635` | `#E6F1ED` |
| `text-texto-suave` | Texto secundario, ayudas, encabezados de tabla | `#4D6964` | `#8FB0A6` |
| `border-linea` | Divisores y bordes finos | `#D2E1DB` | `#1B4242` |
| `bg-acento` / `text-acento` | Acción principal y selección | `#1B4242` | `#9EC8B9` |
| `text-sobre-acento` | Texto encima del acento | `#FFFFFF` | `#092635` |
| `bg-tinte` | Fondo de lo seleccionado (menú activo, fila elegida) | verde agua suave | verde suave |
| `bg-relleno` / `bg-relleno-fuerte` | Fondo de campos y botones secundarios, y su hover | texto al 5,5 % / 9 % | igual |
| `text-urgente` | Prioridad P1, errores y acciones destructivas | `#C8102E` | `#FF7A7A` |

Colores de estado del caso. No se usan para nada más:

| Estado | Token | Claro | Oscuro |
|---|---|---|---|
| Pendiente | `estado-pendiente` | `#5F7472` | `#94AAA5` |
| En análisis | `estado-en-analisis` | `#B45309` | `#FBBF24` |
| En atención | `estado-en-atencion` | `#2563EB` | `#60A5FA` |
| En validación | `estado-en-validacion` | `#7C3AED` | `#B39DFA` |
| Cerrada | `estado-cerrada` | `#4D7C0F` | `#A3E635` |

Todos los colores de texto pasan contraste AA (4,5:1) sobre su superficie en los dos temas.

Para mostrar un estado o una prioridad usa `<EstadoBadge>` y `<PrioridadBadge>`. Para gráficos (Recharts) usa `COLOR_ESTADO` y `COLOR_PRIORIDAD` de [src/utils/colores.ts](../src/utils/colores.ts).

## Tipografía, forma y espacio

- **Fuente:** la del sistema (ya está configurada). No se agregan fuentes.
- **Título de pantalla:** `text-[34px] leading-tight font-bold tracking-[-0.028em]`. Uno por pantalla, en un `<h1>`.
- **Texto normal:** 14 px (`text-sm`, es el valor por defecto). Secundario: `text-[13px] text-texto-suave`.
- **Números** en tablas, contadores e ids: agrega la clase `cifras` para que queden alineados.
- **Radios:** `rounded-campo` (campos), `rounded-tarjeta` (tarjetas), `rounded-hoja` (modales), `rounded-full` (botones y cápsulas).
- **Espacio:** separa con `gap-*` en contenedores `flex` o `grid`, no con márgenes sueltos.

## Vidrio

| Clase | Dónde |
|---|---|
| `vidrio` | Barras y cápsulas que flotan sobre el contenido: navegación, barra de filtros |
| `vidrio-grueso` | Lo que flota encima de todo: modales y listas (ya lo traen los componentes) |
| `vidrio-acento` | La acción principal dentro de una barra de vidrio (`<Boton variante="vidrio-acento">`) |

El vidrio necesita contenido que pase por debajo para notarse. Si vas a poner una barra de filtros fija arriba de una tabla, hazla `sticky` con `vidrio` y deja que la tabla se desplace debajo.

## Componentes

Se importan todos desde un mismo lugar:

```tsx
import { Boton, Campo, CampoArea, CampoTexto, Confirmacion, Esqueleto, EstadoVacio, FiltroMultiple, Icono, Interruptor, ListaDesplegable, Modal, Segmentado, Tarjeta } from '../components/ui'
```

| Necesito… | Uso | Notas |
|---|---|---|
| Un botón | `Boton` | `variante`: `primario`, `secundario` (por defecto), `texto`, `destructivo`, `vidrio`, `vidrio-acento`. Props `icono`, `cargando`, `soloIcono` |
| Un campo de texto | `CampoTexto`, `CampoArea` | Traen etiqueta, `ayuda`, `error` y `conContador` |
| Elegir una opción de una lista | `ListaDesplegable` dentro de `Campo` | Reemplaza al `<select>`. Las opciones pueden tener `detalle`, `color` y `deshabilitada` |
| Filtrar por varias opciones | `FiltroMultiple` | `variante="vidrio"` si va en una barra flotante |
| Elegir entre 2 a 6 opciones a la vista | `Segmentado` | Tipo de caso, prioridad, pestañas de una vista |
| Activar o desactivar algo | `Interruptor` | El cambio aplica al instante |
| Una tarea que bloquea | `Modal` | Formularios cortos: asignar, devolver, registrar solución |
| Confirmar algo que no se deshace | `Confirmacion` | Solo para eso. Ver "Confirmaciones" abajo |
| Contar el resultado de una acción | `useAvisos()` | Ver "Avisos" abajo |
| Un mensaje fijo en la página | `Mensaje` | Errores de carga, falta de permisos |
| Un contenedor de contenido | `Tarjeta` | Tablas, formularios, bloques de detalle |
| Una lista sin datos | `EstadoVacio` | Dice qué va a aparecer ahí |
| Algo que está cargando | `Esqueleto` o `Cargando` | `Esqueleto` cuando conoces la forma del contenido |
| Un ícono | `Icono` | Si falta uno, agrégalo en `Icono.tsx` con el mismo estilo de trazo |

### Formulario con validación

Se valida al salir del campo y el error va debajo del campo, no en un aviso.

```tsx
<CampoTexto
  etiqueta="Título"
  value={titulo}
  maxLength={180}
  conContador
  ayuda="Entre 5 y 180 caracteres."
  error={errores.titulo}
  onChange={(e) => setTitulo(e.target.value)}
  onBlur={() => validar('titulo')}
/>

<Campo etiqueta="Categoría" htmlFor="categoria" error={errores.categoria}>
  <ListaDesplegable
    id="categoria"
    placeholder="Elige una categoría"
    invalida={!!errores.categoria}
    opciones={categorias.map((c) => ({ valor: c.id, texto: c.nombre }))}
    valor={categoriaId}
    onChange={setCategoriaId}
  />
</Campo>
```

Cuando la API responde `400 VALIDACION`, pon cada mensaje en su campo con `error.detalleDe('titulo')`.

### Avisos

Son las gotas de vidrio que salen abajo. Sirven para contar qué pasó después de una acción.

```tsx
const avisos = useAvisos()

try {
  const caso = await crearCaso(datos)
  avisos.exito(`Caso #${caso.id} registrado`, 'Quedó en Pendiente y sin agente.')
} catch (e) {
  if (e instanceof ApiError) avisos.error('No se pudo registrar el caso', e.mensaje)
}
```

Hay cuatro: `exito`, `info`, `advertencia` y `error`. El tercer parámetro es un botón opcional: `{ texto: 'Ver', onClick: () => navigate(...) }`.

- El título dice qué pasó, en pasado y con el número del caso: "Caso #12 asignado".
- Si algo falla al **cargar** una pantalla, usa `Mensaje` con botón de reintentar, no un aviso.

### Modal

```tsx
<Modal
  abierto={abierto}
  onCerrar={() => setAbierto(false)}
  titulo="Devolver caso #1037"
  descripcion="Vuelve a En atención con el mismo agente."
  pie={
    <>
      <Boton onClick={() => setAbierto(false)}>Cancelar</Boton>
      <Boton variante="primario" cargando={enviando} onClick={enviar}>Devolver caso</Boton>
    </>
  }
>
  <CampoArea etiqueta="Comentario" value={comentario} onChange={(e) => setComentario(e.target.value)} />
</Modal>
```

Cancelar va a la izquierda y la acción principal a la derecha. El modal ya atrapa el foco, se cierra con Escape y al tocar fuera.

### Confirmaciones

Solo cuando la acción no se puede deshacer fácil: aprobar y cerrar un caso, desactivar una categoría. Para lo demás, haz la acción y muestra un aviso.

```tsx
<Confirmacion
  abierta={confirmar}
  titulo="¿Aprobar y cerrar el caso #1037?"
  mensaje="El caso pasa a Cerrada y ya no se podrá modificar."
  textoConfirmar="Aprobar"
  onConfirmar={aprobar}
  onCancelar={() => setConfirmar(false)}
/>
```

El botón dice el verbo de la acción ("Aprobar", "Desactivar"), nunca "Aceptar" ni "Sí". Usa `destructiva` si quita o desactiva algo.

## Estructura de una pantalla

```tsx
<section className="flex flex-col gap-6">
  <header className="flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="text-[34px] leading-tight font-bold tracking-[-0.028em]">Bandeja</h1>
      <p className="mt-1 text-texto-suave">12 casos · 3 sin asignar</p>
    </div>
    <Boton variante="primario" icono="mas">Registrar caso</Boton>
  </header>

  <Tarjeta className="overflow-hidden">
    {/* tabla, formulario o lista */}
  </Tarjeta>
</section>
```

Tablas dentro de la tarjeta: encabezados `text-[11px] font-semibold text-texto-suave`, celdas `px-4.5 py-3`, filas separadas con `border-t border-linea` y `hover:bg-relleno`.

Toda pantalla que carga datos tiene tres estados: cargando (`Esqueleto` o `Cargando`), error (`Mensaje tipo="error"` con reintentar) y vacío (`EstadoVacio`).

## Textos

- Habla como la persona, no como el sistema: "Mis casos", no "Listado de registros".
- Nunca muestres el valor del enum (`EN_ATENCION`). Usa las etiquetas de [src/utils/etiquetas.ts](../src/utils/etiquetas.ts).
- Los botones dicen lo que hacen: "Registrar caso", "Devolver caso". No "Enviar" ni "OK".
- Los errores dicen qué pasó y cómo arreglarlo: "El título debe tener entre 5 y 180 caracteres."
- Fechas con `formatearFecha()`.

## Movimiento

- Las transiciones usan `ease-resorte` (ya la traen los componentes). Sin rebotes.
- Todo control responde al presionar: los botones se encogen un poco (`active:scale-[0.96]`).
- Lo que se abre sale desde el control que lo abrió y se cierra por el mismo camino.
- No agregues animaciones decorativas. Si el sistema tiene activado "reducir movimiento", todo pasa a fundidos cortos de forma automática.

## Modo oscuro

Se cambia con el botón Claro / Oscuro de la barra de navegación y se recuerda. Si usas solo tokens y componentes, no tienes que hacer nada. Si necesitas un ajuste solo para oscuro, usa la variante `dark:` de Tailwind.

Antes de pedir revisión de un PR, mira tu pantalla en los dos temas.

## Accesibilidad

- Todo se puede usar con teclado. El foco se ve con un anillo del color de acento; no lo quites.
- Un botón que solo tiene ícono lleva `aria-label`.
- Cada campo tiene su etiqueta visible (`Campo`, `CampoTexto`, `CampoArea` ya la ponen).
- El color nunca es la única señal: los estados llevan punto de color y texto.

## Si programas con IA

En la raíz del repositorio está [AGENTS.md](../AGENTS.md) con estas reglas resumidas. Claude Code, Codex, Cursor y otras herramientas lo leen solas. Si tu herramienta no lo hace, pégale ese archivo al empezar.

También está instalada la skill `apple-design` en `.agents/skills/`, con los principios de Apple sobre movimiento, materiales y tipografía.

## Si falta algo

Si necesitas un componente o un color que no existe, no lo inventes dentro de tu pantalla. Avisa en la Daily, se agrega a `src/components/ui/` o a `index.css`, se muestra en `/componentes` y se anota en esta guía.
