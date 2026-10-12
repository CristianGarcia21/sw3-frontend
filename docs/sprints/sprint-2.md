# Sprint 2

**Fechas:** jue 1 – vie 2 oct 2026 (sprint simulado de 2 días)

**Fechas reales según el repositorio:** del 05/10 a las 22:31 (primer commit de HU-08) al 12/10 a las 02:32 (cierre de HU-07).

> Este documento se llenó el 12/10/2026 con los datos que quedaron en GitHub: el tablero, las issues y sus comentarios, los PR, los commits y [06-pruebas.md](../06-pruebas.md). Las horas están en hora de Colombia. Lo que no quedó registrado en ningún lado se marca como "Sin registro" para que el equipo lo complete.

## Sprint Planning

**Sprint Goal:** Un caso recorre el flujo completo: asignar, atender, validar (aprobar o devolver) y cerrar, con historial de cada paso.

| Historia | Título | Prioridad | SP |
|---|---|---|---|
| HU-04 | Asignarme un caso | P1 | 3 |
| HU-06 | Registrar diagnóstico y solución | P1 | 5 |
| HU-07 | Aprobar o devolver una solución | P1 | 5 |
| HU-08 | Consultar el historial | P2 | 5 |
| | **Total** | | **18** |

**Capacidad:** 6 integrantes desarrollando en paralelo durante dos días. Antes de confirmar, se compara con el Throughput y los SP terminados en el sprint anterior (ver 07-metricas.md). Si el sprint anterior no se terminó, se reduce el compromiso.

**Dependencias y riesgos:** HU-06 depende de HU-04 y HU-07 depende de HU-06, así que el orden de arranque es HU-04 → HU-06 → HU-07. HU-08 puede ir en paralelo porque los eventos de historial existen desde el Sprint 1. Riesgo: si Validación se llena (WIP 2) al final del sprint, los desarrolladores ayudan a probar.

**Fecha real de la Planning:** Sin registro. El campo `Fecha Ready` de las tareas del sprint tiene el 06/10 y el 07/10.
**Asistentes:** Sin registro.
**Cambios respecto a este plan:**

- El sprint empezó el 05/10, antes de cerrar el Sprint 1, y duró 7 días calendario en lugar de 2.
- El compromiso no se redujo, aunque el Sprint 1 no había terminado cuando empezó este.
- HU-08 arrancó primero (#37, el 05/10) y no al final, como decía el orden previsto.

## Dailies

No hay actas de las Dailies en el repositorio. Esta tabla se reconstruyó con lo que GitHub registró cada día (PR fusionados, issues cerradas y comentarios). El WIP es el total de historias en curso al final del día, de todos los sprints; la división por columna no quedó registrada.

| Fecha | Qué avanzó | Qué sigue | Bloqueos | WIP (análisis / atención / validación) | Decisión tomada |
|---|---|---|---|---|---|
| 05/10 | Empieza `GET /casos/{id}/historial` (#37) | Historial y asignación | – | — / — / — (total 5) | – |
| 06/10 | Historial en el backend (PR backend #22, cierra #37). #25 (asignar) empieza a las 09:57. `PATCH /casos/{id}/asignar` y RN-11 (PR backend #25, cierra #25) | Botón Asignarme, línea de tiempo y atención | #25 en pausa de 17:54 a 19:38 por DEF-01 | — / — / — (total 6) | Atender DEF-01 como expedite. Tania abre #70: ¿solo el agente asignado puede mover el caso? Queda para el PO |
| 07/10 | Empieza `POST /casos/{id}/atencion` (#29). Juan Diego pasa #26 y #38 a Ready (08:59) | Asignarme, línea de tiempo y atención | – | — / — / — (total 5) | – |
| 08/10 | Botón Asignarme (PR frontend #78, cierra #26). Línea de tiempo (PR frontend #79, cierra #38). CP-06 y CP-14 (PR frontend #80, cierra #27). HU-04 aceptada a la 01:58. Atención en el backend (PR backend #28, cierra #29). Validación en el backend (PR backend #29, cierra #33). Formulario de atención (PR frontend #83, cierra #30). CP-18 por API (PR frontend #82, cierra #39). HU-08 aceptada a las 21:58 | Pantalla de validación y pruebas de HU-06 | – | — / — / — (total 4) | – |
| 09/10 | Se ejecutan CP-07 y CP-16. Sin PR fusionados | Pantalla de validación | – | — / — / — (total 4) | – |
| 10/10 | Empieza la pantalla de validación (primer commit a las 22:56). Sin PR fusionados | Pantalla de validación | – | — / — / — (total 4) | – |
| 11/10 | Resultados de CP-07 y CP-16 (PR frontend #84, cierra #31). HU-06 aceptada a las 13:21. Bandeja y panel de validación (PR frontend #85, cierra #34) | Pruebas de HU-07 | – | — / — / — (total 5) | – |
| 12/10 | Resultados de CP-08, CP-09 y CP-17 (PR frontend #90, cierra #35). HU-07 aceptada a las 02:32 | – | – | — / — / — (total 3) | – |

## Refinement

**Fecha:** Sin acta. La única evidencia es el 07/10 a las 08:59, cuando #26 y #38 pasaron de Product Backlog a Ready.
**Historias revisadas:** HU-04 y HU-08 (por las tareas #26 y #38).
**Cambios (división de historias, reestimación, criterios nuevos):**

- No cambiaron los Story Points.
- Quedó abierta la pregunta #70 para el PO: si solo el agente asignado puede pasar el caso a En atención y a En validación. No tiene respuesta registrada.

## Sprint Review

**Fecha:** Sin acta. Las historias se cerraron entre el 08/10 a la 01:58 (HU-04) y el 12/10 a las 02:32 (HU-07). Todas las cerró Juan Diego (QA).
**Asistentes:** Sin registro.

| Historia | ¿Se demostró? | ¿Cumple DoD? | Comentarios |
|---|---|---|---|
| HU-04 | Sí, con pruebas registradas | Parcial | CP-06, CP-14 (pantalla y API) y tres extras: pasaron (Juan Diego, 08/10). Integrada en `development`, no en `main`. No hay aceptación del PO registrada |
| HU-06 | Sí, con pruebas registradas | Parcial | CP-07, CP-16 y cuatro extras: pasaron (Valentina, 09/10). Integrada en `development`, no en `main`. No hay aceptación del PO registrada |
| HU-07 | Sí, con pruebas registradas | Parcial | CP-08, CP-09, CP-17 a) y b) y el flujo completo solo con la interfaz: pasaron (Cristian, 12/10). Integrada en `development`, no en `main`. No hay aceptación del PO registrada |
| HU-08 | Sí, en parte | No | CP-18 se probó solo por API ("Pasó (parte API)") y CP-04 (parte de historial) no tiene resultado registrado. La línea de tiempo en pantalla sí aparece en las pruebas de CP-08 |

**Evidencia** (capturas, video, enlace al commit o tag): resultados en [06-pruebas.md](../06-pruebas.md) (filas del 08/10, 09/10 y 12/10). El PR frontend #90 tiene 13 capturas paso a paso del flujo Registrar → Asignar → Atender → Validar → Cerrar. Los PR frontend #80 y #84 también tienen capturas. No hay tag.
**Retroalimentación recibida:** Sin registro.
**Cambios al backlog:** Ninguno registrado. Sigue abierta la pregunta #70.

## Retrospectiva

### Datos
- WIP promedio: 4,5 historias (incluye las de otros sprints en curso)
- Throughput: 4 historias (18 de 18 SP)
- Cycle Time promedio: 74,0 h
- Lead Time promedio: 94,3 h
- Defectos: 1 (DEF-01, crítico, corregido en 1,7 h desde que se empezó a atender)
- Bloqueos: 1 (#25, 1,7 h)

No hay acta de esta retrospectiva. Lo que sigue son observaciones que salen de los datos del repositorio. El equipo debe confirmarlas.

### ¿Qué funcionó?
- El flujo completo del Sprint Goal se demostró solo con la interfaz (PR frontend #90): Registrar → Asignar → Atender → Validar → Cerrar.
- DEF-01 se manejó como dice [01-scrumban.md](../01-scrumban.md): issue comentada con qué pasó, impacto y corrección, trabajo detenido (#25) y registro en [06-pruebas.md](../06-pruebas.md). Se corrigió el mismo día.
- Los tiempos bajaron frente al Sprint 1: Cycle Time −37 % y Lead Time −48 %.
- Se completó el 100 % de los SP comprometidos.

### ¿Qué no funcionó?
- Los sprints se solaparon: el 06/10 había 6 historias en curso de los tres sprints a la vez. La regla "no empezar algo nuevo si se puede ayudar a terminar" no se ve aplicada.
- El 09/10 y el 10/10 no se fusionó ningún PR, mientras HU-06 y HU-07 seguían esperando la pantalla de validación y las pruebas.
- HU-08 se cerró con pruebas incompletas (CP-18 solo por API y sin CP-04).
- La pregunta #70 lleva abierta desde el 06/10 sin decisión del PO.

### Evidencia
- WIP diario en [07-metricas.md](../07-metricas.md).
- Fila de CP-18 con estado "Pasó (parte API)" en [06-pruebas.md](../06-pruebas.md).
- Issue #70 sin comentarios.

### Mejora seleccionada
No quedó registrada ninguna mejora acordada. Propuesta a partir de los datos, para que el equipo la confirme:
- Problema: se empiezan historias del sprint siguiente antes de cerrar las del actual, y el trabajo se queda esperando pruebas.
- Hipótesis: si se respeta el límite WIP por columna y nadie jala una historia nueva mientras haya algo en En validación, el Cycle Time baja y no quedan historias cerradas con pruebas a medias.
- Cambio: en la Daily, mirar primero En validación y asignar a alguien a probar antes de empezar algo nuevo. Una historia solo se cierra con todos sus casos de prueba registrados como "Pasó".
- Indicador para saber si funcionó: WIP máximo diario de 3 historias y 0 historias cerradas con casos de prueba pendientes.
- Responsable: Tania (SM).
- Fecha de revisión: Retro del Sprint 3.
