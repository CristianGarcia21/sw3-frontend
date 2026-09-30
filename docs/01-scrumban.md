# ScrumBan: tablero y políticas

Usamos la cadencia de Scrum (sprints de una semana con Planning, Daily, Refinement, Review y Retro) y manejamos el flujo como en Kanban: tablero visible, límites WIP y sistema pull.

## Tablero

El tablero es un GitHub Project ligado a este repositorio. Columnas (campo `Status`):

| Columna | Qué significa | Límite WIP |
|---|---|---|
| Product Backlog | Historias sin refinar o que todavía no cumplen la DoR | – |
| Ready | Cumplen la Definition of Ready y se pueden jalar | – |
| En análisis | Alguien empezó: diseño, dudas con el PO, modelo de datos, contrato de API | **3 historias** |
| En atención | Se está programando (BD, backend, frontend) | **3 historias** |
| En validación | Pruebas contra los criterios de aceptación y revisión del PO | **2 historias** |
| Done | Cumple la Definition of Done | – |

Los límites WIP cuentan **historias**, no tareas. Por eso la vista principal del tablero filtra por `label:historia` y las tareas técnicas se ven como sub-issues dentro de cada historia (la barra de progreso de la tarjeta muestra cuántas van).

### Campos del tablero

| Campo | Uso |
|---|---|
| Status | Columna actual |
| Sprint | Sprint 1, 2 o 3 |
| Story Points | Estimación (1, 2, 3, 5, 8, 13) |
| Prioridad | P1, P2, P3 |
| Tipo | Historia, Tarea, Defecto, Ceremonia |
| Responsable | Integrante a cargo (usamos esto porque no todos tienen el repo como colaborador todavía) |
| Área técnica | BD, Backend, Frontend, Pruebas, Documentación |
| Fecha Ready | Día en que la historia entró a Ready |
| Fecha inicio | Día en que pasó a En análisis |
| Fecha Done | Día en que llegó a Done |
| Bloqueado | Sí / No |
| Motivo bloqueo | Texto corto con la causa |

Con Fecha Ready, Fecha inicio y Fecha Done se calculan Lead Time y Cycle Time (ver [07-metricas.md](07-metricas.md)).

## Políticas

**Pull.** Solo se jala una historia de la columna anterior cuando la siguiente tiene cupo. Nadie "empuja" trabajo a otra persona.

**Límite alcanzado.** Si una columna está llena, no se empieza otra historia. Primero se ayuda a terminar, probar o desbloquear lo que ya está en curso. Ejemplo: si "En validación" tiene 2 historias, el siguiente desarrollador que se libere ayuda a Juan Diego a ejecutar pruebas en vez de empezar algo nuevo.

**Expedite.** Máximo un elemento a la vez con la etiqueta `expedite` (por ejemplo, un defecto crítico que rompe la demo). Puede saltarse el límite WIP, pero en la issue se escribe qué trabajo se detuvo para atenderlo. Ojo: esto es sobre el trabajo del equipo, no tiene que ver con la prioridad P1 de los casos dentro de la aplicación.

**Bloqueos.** Una historia bloqueada se queda en su columna, se le pone la etiqueta `bloqueado`, el campo `Bloqueado = Sí` y un comentario con el motivo, la fecha y qué se necesita para desbloquear. Cuando se resuelve, se comenta la fecha de desbloqueo. Así se puede medir cuánto duró.

**Orden de prioridad para jalar trabajo.** Expedite, luego historias bloqueadas que ya se pueden desbloquear, luego lo que está más a la derecha, y al final algo nuevo desde Ready.

## Definition of Ready

Una historia pasa a Ready cuando tiene:

- [ ] Actor, necesidad y valor claros (Como / Quiero / Para)
- [ ] Prioridad
- [ ] Reglas de negocio escritas
- [ ] Criterios de aceptación en formato Given / When / Then
- [ ] Estimación en Story Points
- [ ] Dependencias identificadas y ninguna bloqueante sin plan
- [ ] Tareas técnicas creadas como sub-issues
- [ ] Ninguna pregunta crítica abierta con el PO

## Definition of Done

Una historia pasa a Done cuando:

- [ ] El código está integrado en `main` (frontend y backend) mediante PR revisado
- [ ] Todos los criterios de aceptación se verificaron
- [ ] Los casos de prueba vinculados se ejecutaron y el resultado quedó en [06-pruebas.md](06-pruebas.md)
- [ ] No hay defectos críticos abiertos asociados
- [ ] La documentación afectada está actualizada (API, README, trazabilidad)
- [ ] Se puede demostrar funcionando con datos guardados en la base de datos
- [ ] El PO (Juan Fernando) la aceptó

## Cómo responder a los eventos del docente

| Evento | Qué hacemos |
|---|---|
| E1. Suben los incidentes de Wi-Fi | El PO revisa si cambia la prioridad del backlog (por ejemplo, adelantar filtros por área/categoría). No se mete trabajo extra si las columnas están llenas; se reordena Ready y se decide en la Daily. |
| E2. Validación llega a WIP 2 | Nadie mueve una tercera historia a En validación. Quien termine desarrollo ayuda a probar las que ya están ahí. Se deja comentario en las issues como evidencia. |
| E3. Una historia de 13 puntos es muy grande | Se parte en historias más pequeñas que sigan entregando valor (por ejemplo, por actor o por regla), se cierran/reestiman en el backlog y se anota en la sección de refinamiento del sprint. |
| E4. Dependencia externa bloqueada | Etiqueta `bloqueado`, motivo, fecha e impacto en el Sprint Goal. Se busca alternativa (datos semilla, mock del endpoint en el front) y se registra en métricas de bloqueos. |
| E5. El cliente pide algo nuevo | Se crea una issue con la plantilla de historia, queda en Product Backlog, el PO la prioriza y se analiza capacidad antes de meterla en un sprint. No entra directo a desarrollo. |

## Configuración manual del tablero

GitHub no permite crear vistas ni límites de columna por API, así que esto se hace una vez a mano:

1. Abrir el Project → vista por defecto → cambiar el layout a **Board**, agrupado por `Status`.
2. En el menú de cada columna → **Set limit**: En análisis 3, En atención 3, En validación 2.
3. Filtrar la vista con `label:historia` y guardarla como "Tablero ScrumBan".
4. Crear otra vista tipo **Table** llamada "Tareas" con filtro `label:tarea` y agrupada por `Responsable`.
5. Crear otra vista **Table** llamada "Métricas" que muestre Sprint, Story Points, Fecha Ready, Fecha inicio y Fecha Done.
