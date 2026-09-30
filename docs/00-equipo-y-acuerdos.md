# Equipo y acuerdos de trabajo

## Product Goal

Tener un MVP de CampusHelp donde un caso de soporte tecnológico (incidente o solicitud de servicio) se pueda registrar, clasificar, priorizar, asignar, atender, validar y cerrar, con historial de todo lo que pasó, datos guardados en base de datos e indicadores calculados sobre esos datos.

## Roles

Los seis desarrollamos. Además, tres personas tienen un rol de Scrum que cumplen al mismo tiempo que programan.

| Integrante | Desarrollo | Rol adicional |
|---|---|---|
| Juan José | Backend (líder: máquina de estados, atención, historial, indicadores) | Revisa los PR de backend |
| Tania Botina | Backend / BD (modelo Prisma, asignación, filtros, detalle) | Scrum Master: facilita los eventos, cuida los límites WIP y los bloqueos |
| Juan Fernando | Backend (seed, catálogos, bandeja, validación, categorías) | Product Owner: ordena el backlog, acepta historias, lleva métricas y documentación |
| Cristian García | Frontend (líder: base del proyecto, bandeja, asignación, historial, indicadores) | Revisa los PR de frontend |
| Valentina Galvis | Frontend (registro, detalle y acciones, validación, categorías, detalle del solicitante) | – |
| Juan Diego | Frontend (mis casos, reclasificación, atención, filtros) | QA: coordina las pruebas y revisa que los resultados queden registrados |

Los roles de Tania, Juan Fernando y Juan Diego salieron de un sorteo. Juan José, Cristian y Valentina tenían su rol definido desde el inicio.

Cada historia la prueba alguien que no la programó. Así cada uno termina probando trabajo de otro y nadie valida lo suyo.

Si una columna del tablero llega a su límite WIP, cualquiera ayuda a sacar trabajo de ahí antes de empezar algo nuevo.

## Cadencia (sprints simulados)

El taller plantea tres sprints de una semana, pero tenemos cinco días (martes 29 de septiembre a sábado 3 de octubre). Mantenemos los tres sprints y todos sus eventos, comprimidos en días:

| Sprint | Fechas | Objetivo |
|---|---|---|
| Sprint 1 | mar 29 – mié 30 sep | Flujo básico de registro y consulta |
| Sprint 2 | jue 1 – vie 2 oct | Asignación, atención, validación e historial |
| Sprint 3 | sáb 3 oct | Filtros, indicadores, categorías, detalle y demo |

| Evento | Cuándo | Duración | Quién facilita |
|---|---|---|---|
| Sprint Planning | Al inicio del primer día de cada sprint | 20 min | Tania (SM), Juan Fernando presenta el backlog |
| Daily | Cada día al empezar (Meet o WhatsApp) | 10 min | Tania |
| Refinement | Al final del primer día del Sprint 1 y del Sprint 2, para dejar Ready el siguiente sprint | 15 min | Juan Fernando |
| Sprint Review | Al cierre del último día del sprint | 15 min | Juan Fernando, demo de quien desarrolló |
| Retrospective | Justo después de la Review | 15 min | Tania |

Como los sprints son cortos, las métricas de tiempo (Lead Time y Cycle Time) se miden en horas y no en días.

En la Daily se mira el tablero de derecha a izquierda: primero lo que está cerca de Done, luego lo bloqueado y al final lo que se podría empezar.

## Acuerdos

- Nada se empieza si no está en Ready.
- Toda tarea que se empieza se mueve en el tablero ese mismo día, y quien la mueve llena la fecha correspondiente (ver [07-metricas.md](07-metricas.md)).
- Una rama por tarea: `feature/HU-XX-descripcion-corta` o `fix/DEF-XX`. Los commits mencionan la issue (`HU-01: formulario de registro (#12)`).
- Todo PR lo revisa al menos otra persona antes de hacer merge a `main`.
- Si alguien está bloqueado más de medio día, lo dice en el grupo y marca la issue con la etiqueta `bloqueado` con el motivo en un comentario.
- Los defectos se registran como issue con la etiqueta `defecto`, nunca solo por chat.
