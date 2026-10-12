# Sprint 1

**Fechas:** mar 29 – mié 30 sep 2026 (sprint simulado de 2 días)

**Fechas reales según el repositorio:** del 29/09 a las 20:40 (primer commit) al 07/10 a las 23:39 (cierre de la última historia, HU-05).

> Este documento se llenó el 12/10/2026 con los datos que quedaron en GitHub: el tablero, las issues y sus comentarios, los PR, los commits y [06-pruebas.md](../06-pruebas.md). Las horas están en hora de Colombia. Lo que no quedó registrado en ningún lado (por ejemplo, los asistentes a las reuniones) se marca como "Sin registro" para que el equipo lo complete.

## Sprint Planning

**Sprint Goal:** Un solicitante puede registrar un caso que queda guardado y lo consulta; un agente lo ve en su bandeja y lo mueve por los estados válidos.

| Historia | Título | Prioridad | SP |
|---|---|---|---|
| HU-01 | Registrar incidente o solicitud | P1 | 5 |
| HU-02 | Consultar mis casos | P1 | 3 |
| HU-03 | Bandeja de casos del agente | P1 | 3 |
| HU-05 | Cambiar el estado del caso | P1 | 5 |
| | **Total** | | **16** |

**Capacidad:** 6 integrantes desarrollando en paralelo durante dos días. Todavía no hay Throughput histórico, así que el compromiso sale de la estimación.

**Dependencias y riesgos:** HU-01 es la base de todo: mientras no estén el modelo de datos y el seed, el resto no puede probarse con datos reales. Por eso Tania arranca con BD el primer día y el front puede avanzar con datos simulados. HU-05 se hace completa, pero las condiciones de agente asignado (RN-11) y de solución registrada (RN-13) se conectan en el Sprint 2.

**Fecha real de la Planning:** 29/09/2026 por la noche. Las 59 issues (historias, tareas y ceremonias) se crearon entre las 19:13 y las 19:21, y las del Sprint 1 entraron directo a Ready. A las 19:35 se ajustó el plan en el commit "Replanificación: sprints simulados en 5 días, desarrollo repartido entre los 6 y dependencias entre tareas".
**Asistentes:** Sin registro.
**Cambios respecto a este plan:**

- El sprint duró 9 días calendario en lugar de 2.
- HU-01 se cerró el 30/09 a las 14:11, con 7 de sus 8 tareas abiertas. Se toma como terminada el 07/10, cuando se cerró su última tarea (#8, pruebas).
- El seed entró dos veces mal a las ramas y hubo que revertirlo: PR backend #2 → #11, y #12 → #13, este último porque se fusionó en `main` por error.
- Los 8 PR del backend #3 a #10 (catálogos, bandeja, validación, categorías y pruebas), creados el 30/09 en 7 minutos y encadenados sobre la rama del seed, se cerraron sin fusionar. Ese trabajo se rehízo después en otros PR.

## Dailies

No hay actas de las Dailies en el repositorio. Esta tabla se reconstruyó con lo que GitHub registró cada día (PR fusionados, issues cerradas y comentarios). El WIP es el total de historias en curso al final del día; la división por columna no quedó registrada.

| Fecha | Qué avanzó | Qué sigue | Bloqueos | WIP (análisis / atención / validación) | Decisión tomada |
|---|---|---|---|---|---|
| 29/09 | Backlog cargado en el tablero. Base del frontend: rutas, layout, cliente API y selector de usuario (PR frontend #60) | Modelo de datos y seed | – | — / — / — (total 1) | Replanificar en 5 días con el desarrollo repartido entre los 6 |
| 30/09 | Modelo Prisma y migración inicial (PR backend #1, cierra #2). Seed fusionado (PR backend #2) | Seed, catálogos y `POST /casos` | – | — / — / — (total 1) | Revertir el seed (PR backend #11) |
| 01/10 | Sistema de diseño (PR frontend #61). Seed definitivo (PR backend #14, cierra #3). `POST /casos` (PR backend #15, cierra #5). `GET` de catálogos (PR backend #16) | `GET /casos` del solicitante y pantallas | – | — / — / — (total 1) | Revertir el seed que entró a `main` por error (PR backend #13) |
| 02/10 | Cierra #4 (catálogos). Empieza #11 a las 20:41 | `GET /casos` y Mis casos | – | — / — / — (total 2) | – |
| 03/10 | Se quita `/users` heredado (PR backend #18). `GET /casos` por solicitante (PR backend #17, cierra #11). Pantalla Mis casos (PR frontend #63, cierra #12) | Bandeja (HU-03) y máquina de estados (HU-05) | – | — / — / — (total 4) | – |
| 04/10 | Orden y filtros de la bandeja (PR backend #19, cierra #15). `PATCH /casos/{id}/estado` (PR backend #21, cierra #19). README (PR frontend #62 y backend #20, cierra #9) | Pantallas de bandeja y registro | – | — / — / — (total 4) | – |
| 05/10 | Pantalla Bandeja (PR frontend #66, cierra #16). Formulario de registro (PR frontend #65, cierra #7). Se ejecutan CP-12 y CP-13 | Reclasificación, detalle y pruebas | – | — / — / — (total 4) | – |
| 06/10 | Resultados de CP-01 (bandeja) y CP-13 (PR frontend #67). Reclasificación (PR backend #23), que rompe `development`. Arreglo (PR backend #24, cierra #20). DEF-01 registrado (PR frontend #69). HU-03 aceptada a las 21:04 | Detalle del agente, reclasificación y pruebas | DEF-01: `development` del backend sin compilar de 00:45 a 19:38 | — / — / — (total 6, con historias de los tres sprints) | Atender DEF-01 como expedite y pausar #25 |
| 07/10 | Detalle del agente (PR frontend #72, cierra #21). Diálogo de reclasificación (PR frontend #73, cierra #22). Resultados de CP-01, CP-02, CP-03 y CP-11 (PR frontend #74, cierra #8). HU-01 y HU-02 aceptadas a las 08:53–08:55. Resultados de CP-05 y CP-15 (PR frontend #77, cierra #23). HU-05 aceptada a las 23:39 | Sprint 2 | – | — / — / — (total 5) | – |

## Refinement

**Fecha:** Sin registro.
**Historias revisadas:** Sin registro. No hay movimientos del tablero ni comentarios que muestren una sesión de Refinement durante este sprint.
**Cambios (división de historias, reestimación, criterios nuevos):** Ninguno registrado. Los Story Points y los criterios de las historias no cambiaron.

## Sprint Review

**Fecha:** Sin acta. Las historias se cerraron entre el 06/10 a las 21:04 (HU-03, cerrada por Tania) y el 07/10 a las 23:39 (HU-05). Las cerró Juan Diego (QA), salvo HU-03.
**Asistentes:** Sin registro.

| Historia | ¿Se demostró? | ¿Cumple DoD? | Comentarios |
|---|---|---|---|
| HU-01 | Sí, con pruebas registradas | Parcial | CP-01, CP-02, CP-03 (pantalla y API), CP-11 y la parte de HU-01 de CP-23: pasaron (Juan Diego, 07/10). Integrada en `development`, no en `main`. No hay aceptación del PO registrada |
| HU-02 | Sí, con pruebas registradas | Parcial | CP-12 y dos extras: pasaron (Valentina, 05/10). Integrada en `development`, no en `main`. No hay aceptación del PO registrada |
| HU-03 | Sí, con pruebas registradas | Parcial | CP-13, la parte de bandeja de CP-01 y un extra: pasaron (Tania, 05/10). Integrada en `development`, no en `main`. No hay aceptación del PO registrada |
| HU-05 | Sí, en parte | No | CP-05, CP-15 (solo API) y dos extras: pasaron (Juan Fernando, 07/10). CP-04 no tiene resultado registrado y CP-15 no se probó en pantalla. Tiene el defecto DEF-01, ya corregido |

La DoD de [01-scrumban.md](../01-scrumban.md) pide que el código esté en `main` y que el PO acepte la historia. Ninguna de las dos cosas está registrada para este sprint.

**Evidencia** (capturas, video, enlace al commit o tag): resultados en [06-pruebas.md](../06-pruebas.md) (filas del 05/10 y del 07/10) y capturas en los PR frontend #67, #68, #74 y #77. No hay tag.
**Retroalimentación recibida:** Sin registro.
**Cambios al backlog:** Ninguno registrado.

## Retrospectiva

### Datos
- WIP promedio: 3,2 historias (máximo 6, el 06/10)
- Throughput: 4 historias (16 de 16 SP)
- Cycle Time promedio: 116,7 h
- Lead Time promedio: 182,4 h
- Defectos: 0 en este sprint. DEF-01 nació en una tarea de HU-05, pero quedó registrado en el Sprint 2
- Bloqueos: 0 registrados

No hay acta de esta retrospectiva. Lo que sigue son observaciones que salen de los datos del repositorio. El equipo debe confirmarlas.

### ¿Qué funcionó?
- Cada historia la probó alguien distinto de quien la programó: Valentina probó HU-02, Tania HU-03, Juan Diego HU-01 y Juan Fernando HU-05.
- Los resultados de las pruebas quedaron en [06-pruebas.md](../06-pruebas.md) con fecha, quién ejecutó y el resultado.
- Los PR los fusionó una persona distinta del autor en la mayoría de los casos.
- Se completó el 100 % de los SP comprometidos.

### ¿Qué no funcionó?
- El sprint de 2 días tomó 9: la base técnica (proyecto, modelo, seed, catálogos) tardó más de lo planeado.
- Hubo retrabajo: el seed se revirtió dos veces, uno de esos merges entró a `main` por error, y 8 PR del backend se descartaron.
- HU-01 se cerró el 30/09, una semana antes de terminar sus tareas.
- Las fechas del tablero y las Dailies casi no se registraron, así que las métricas hubo que reconstruirlas.
- HU-05 se cerró sin el resultado de CP-04.

### Evidencia
- PR backend #11 y #13 (reversiones) y PR backend #3 a #10, cerrados sin fusionar.
- Issue #1 cerrada el 30/09 a las 14:11 con las tareas #2, #3, #4, #5, #7, #8 y #9 abiertas.
- Campos `Fecha Ready`, `Fecha inicio` y `Fecha Done` vacíos en las historias del sprint (ver [07-metricas.md](../07-metricas.md)).

### Mejora seleccionada
No quedó registrada ninguna mejora acordada. Propuesta a partir de los datos, para que el equipo la confirme:
- Problema: las fechas del tablero no se llenan, y una historia se cerró antes de terminar sus tareas.
- Hipótesis: si al mover una tarjeta se deja un comentario con la hora y la historia solo se cierra cuando todas sus sub-issues están cerradas, las métricas salen del registro y no hay que reconstruirlas.
- Cambio: comentario "Pasa a <columna> – <fecha y hora>" en cada movimiento, y la historia solo la cierra el PO después de la última tarea.
- Indicador para saber si funcionó: porcentaje de historias del sprint con las tres fechas llenas en el tablero (hoy, 0 de 4).
- Responsable: Juan Fernando (PO), con Tania (SM) en la Daily.
- Fecha de revisión: Retro del Sprint 2.
