# Sprint 3

**Fechas:** sáb 3 oct 2026 (sprint simulado de 1 día)

**Fechas reales según el repositorio:** empezó el 06/10 a las 21:07 (#41) y sigue en curso al corte del 12/10/2026.

> Este documento se llenó el 12/10/2026 con los datos que quedaron en GitHub: el tablero, las issues y sus comentarios, los PR, los commits y [06-pruebas.md](../06-pruebas.md). Las horas están en hora de Colombia. Lo que no quedó registrado en ningún lado se marca como "Sin registro". La Review y la Retro todavía no se han hecho: sus secciones tienen los datos al corte, para usarlos en esas reuniones.

## Sprint Planning

**Sprint Goal:** El administrador filtra casos, ve indicadores reales y gestiona categorías; el solicitante ve el detalle y la solución de su caso.

| Historia | Título | Prioridad | SP |
|---|---|---|---|
| HU-09 | Filtrar casos | P2 | 3 |
| HU-10 | Indicadores del servicio | P2 | 5 |
| HU-11 | Gestionar categorías | P2 | 3 |
| HU-12 | Detalle de mi caso y solución | P3 | 3 |
| | **Total** | | **14** |

**Capacidad:** 6 integrantes desarrollando en paralelo durante un día. Antes de confirmar, se compara con el Throughput y los SP terminados en el sprint anterior (ver 07-metricas.md). Si el sprint anterior no se terminó, se reduce el compromiso.

**Dependencias y riesgos:** Son historias bastante independientes entre sí, así que se pueden trabajar en paralelo sin pasar el WIP. HU-10 necesita casos cerrados con fechas reales; Juan Diego prepara datos de prueba. Como el sprint dura un solo día, se empieza con las tareas que no dependen de nada pendiente y la última parte del día se reserva para ensayar la demo del flujo completo.

**Fecha real de la Planning:** Sin registro. El campo `Fecha Ready` de las tareas tiene fechas del 06/10 (#41), 07/10 (#50), 08/10 (#45) y 11/10 (#54).
**Asistentes:** Sin registro.
**Cambios respecto a este plan:**

- El sprint empezó el 06/10, cuando el Sprint 1 todavía no había terminado y el Sprint 2 estaba en curso.
- Al corte lleva 6 días calendario, frente a 1 planeado.
- El compromiso no se redujo, aunque los dos sprints anteriores terminaron tarde.

## Dailies

No hay actas de las Dailies en el repositorio. Esta tabla se reconstruyó con lo que GitHub registró cada día (PR fusionados, issues cerradas y comentarios). El WIP es el total de historias en curso al final del día, de todos los sprints; la división por columna no quedó registrada.

| Fecha | Qué avanzó | Qué sigue | Bloqueos | WIP (análisis / atención / validación) | Decisión tomada |
|---|---|---|---|---|---|
| 06/10 | Empiezan los filtros del backend (#41) a las 21:07 | Filtros combinables en `GET /casos` | #41 en pausa de 21:28 a 21:55, esperando a #33 | — / — / — (total 6) | Agregar el filtro `estado` en #41 para que #33 lo reutilice |
| 07/10 | Filtros combinables e índices (PR backend #26, cierra #41). Contrato de `GET /casos` (PR frontend #71). Barra de filtros sincronizada con la URL (PR frontend #75, cierra #42). CRUD de `/categorias` (PR backend #27, cierra #50) y su contrato (PR frontend #76) | Pruebas de HU-09 (#43) y pantalla de categorías | – | — / — / — (total 5) | – |
| 08/10 – 10/10 | Sin avances registrados en historias de este sprint | – | – | — / — / — (total 4) | – |
| 11/10 | Pantalla de categorías (PR frontend #86, cierra #51). `GET /casos/{id}` (PR backend #30) y su contrato (PR frontend #87, cierra #54). `GET /indicadores` (PR backend #31) y su contrato (PR frontend #88, cierra #45) | Pantallas de indicadores y de detalle del solicitante, pruebas de HU-11 | – | — / — / — (total 5) | – |
| 12/10 | Pantalla de indicadores (PR frontend #89, cierra #46). Resultados de CP-21 (PR frontend #91, cierra #52). HU-11 aceptada a las 02:29. Detalle del caso para el solicitante (PR frontend #92, cierra #55) | #43 (CP-10 y CP-19), #47 (CP-20), #48 (documentar los indicadores) y #56 (CP-22 y CP-23) | – | — / — / — (total 3) | – |

## Refinement

**Fecha:** Sin registro.
**Historias revisadas:** Sin registro.
**Cambios (división de historias, reestimación, criterios nuevos):**

- No cambiaron los Story Points.
- Los contratos de `GET /casos/{id}` (`solucionVigente`, PR frontend #87) y `GET /indicadores` (`areaId` en `porArea` y reglas de cálculo, PR frontend #88) se completaron en `docs/03-api.md` durante el sprint.

## Sprint Review

**Fecha:** Pendiente. Al corte, solo HU-11 está cerrada (12/10 a las 02:29, por Juan Diego).
**Asistentes:** Pendiente.

| Historia | ¿Se demostró? | ¿Cumple DoD? | Comentarios |
|---|---|---|---|
| HU-09 | Pendiente | No | Backend (#41) y frontend (#42) integrados en `development`. Faltan CP-10 y CP-19 (#43) |
| HU-10 | Pendiente | No | Backend (#45) y pantalla (#46) integrados en `development`. Faltan CP-20 (#47) y documentar cómo se calcula cada indicador (#48) |
| HU-11 | Sí, con pruebas registradas | Parcial | CP-21 a) y b) y tres extras: pasaron (Cristian, 12/10). Integrada en `development`, no en `main`. No hay aceptación del PO registrada |
| HU-12 | Pendiente | No | Backend (#54) y pantalla (#55) integrados en `development`. Faltan CP-22 y CP-23 (#56) |

**Evidencia** (capturas, video, enlace al commit o tag): resultados de CP-21 en [06-pruebas.md](../06-pruebas.md) y capturas en los PR frontend #86, #89, #91 y #92. No hay tag.
**Retroalimentación recibida:** Pendiente.
**Cambios al backlog:** Pendiente.

## Retrospectiva

### Datos
Al corte del 12/10, con el sprint en curso:
- WIP promedio: 4,4 historias (incluye las de otros sprints en curso)
- Throughput: 1 historia (3 de 14 SP)
- Cycle Time promedio: 112,8 h (solo HU-11)
- Lead Time promedio: 122,5 h (solo HU-11)
- Defectos: 0 registrados
- Bloqueos: 1 (#41, 0,5 h)

Observaciones que salen de los datos del repositorio, para discutir en la retro.

### ¿Qué funcionó?
- Las historias de este sprint son independientes y se avanzaron en paralelo: el backend de las cuatro está integrado.
- Los contratos de la API se actualizaron en el mismo momento que el backend (PR frontend #87 y #88).

### ¿Qué no funcionó?
- El sprint de 1 día empezó cuando los otros dos seguían abiertos y lleva 6 días.
- Tres de las cuatro historias tienen el código integrado pero no las pruebas: el trabajo se acumula en la etapa de validación.
- Entre el 08/10 y el 10/10 no hubo avances en historias de este sprint.

### Evidencia
- Issues #43, #47, #48 y #56 abiertas al corte.
- WIP diario en [07-metricas.md](../07-metricas.md).

### Mejora seleccionada
Pendiente de acordar en la retro. Propuesta a partir de los datos:
- Problema: el código está terminado pero las historias no llegan a Done porque faltan las pruebas y la integración a `main`.
- Hipótesis: si cada quien termina las pruebas que tiene asignadas antes de tomar otra tarea y se hace un merge de `development` a `main` al final del sprint, las historias cumplen la DoD a tiempo para la demo.
- Cambio: cerrar #43, #47, #48 y #56 antes de cualquier trabajo nuevo, y fusionar `development` en `main` en los dos repositorios.
- Indicador para saber si funcionó: SP terminados del sprint (hoy 3 de 14) y commits de `development` que faltan en `main` (hoy 82 en el frontend y 47 en el backend).
- Responsable: Juan Diego (QA) para las pruebas, Cristian y Juan José para el merge a `main`.
- Fecha de revisión: antes de la demo final.
