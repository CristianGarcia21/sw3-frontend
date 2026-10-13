# Métricas del flujo

Responsable del registro: Juan Fernando (PO), con ayuda de Tania (SM) en las Dailies.

El taller no permite inventar las métricas al final, así que las fechas se llenan en el momento en que pasa cada cosa, directamente en los campos del tablero de GitHub. Este documento explica cómo se calculan y guarda el consolidado de cada sprint.

## Definiciones que usamos

| Métrica | Cómo la medimos | De dónde sale |
|---|---|---|
| WIP | Número de historias en En análisis + En atención + En validación | Se anota en cada Daily (tabla de abajo) |
| Throughput | Historias que llegaron a Done en el sprint | Contar historias con `Fecha Done` dentro del sprint |
| Lead Time | `Fecha Done − Fecha Ready`, en horas | Campos del tablero |
| Cycle Time | `Fecha Done − Fecha inicio`, en horas | Campos del tablero |
| Defectos | Issues con etiqueta `defecto` creadas en el sprint | Filtro `label:defecto` en el repo |
| Bloqueos | Cantidad de bloqueos y horas que duró cada uno | Comentarios de bloqueo/desbloqueo en las issues con etiqueta `bloqueado` |

Reglas para las fechas:

- **Fecha Ready**: la pone el PO cuando confirma en el Refinement o en la Planning que la historia cumple la DoR.
- **Fecha inicio**: la pone quien mueve la historia a En análisis, ese mismo día.
- **Fecha Done**: la pone el PO cuando acepta la historia.
- Nunca se editan fechas pasadas. Si algo quedó mal, se deja comentario en la issue explicando la corrección.

Como cada sprint dura uno o dos días, las fechas del tablero se complementan con la hora exacta en un comentario de la issue al moverla (por ejemplo, "Pasa a En atención – 30/09 14:20"). Con eso se calculan los tiempos en horas.

## Cómo se obtuvieron los datos

Corte: **12/10/2026**. Todas las horas están en hora de Colombia (UTC−5).

Los campos del tablero se llenaron solo en parte. De las 12 historias, solo HU-03 y HU-04 tienen `Fecha Done`, y solo HU-04 tiene `Fecha Ready` y `Fecha inicio`. Los comentarios con hora existen únicamente en seis tareas (#11, #17, #20, #25, #41 y #54), y GitHub guardó pocos cambios de columna. Para no inventar nada, cada fecha sale de un registro con marca de tiempo que GitHub guardó en el momento:

| Fecha | Regla | Fuente |
|---|---|---|
| Ready | Sprint 1: momento en que las historias entraron a Ready en el tablero (29/09, 19:13–19:15). Sprints 2 y 3: campo `Fecha Ready` de la historia o, si está vacío, el primero de sus tareas. Ese campo solo guarda el día, así que se toma a las 00:00 | Eventos y campos del tablero |
| Inicio | La primera evidencia de trabajo en cualquiera de las tareas de la historia: el comentario con la hora de inicio o el primer commit de un PR fusionado | Comentarios de las issues y commits de los PR |
| Done | El cierre de la historia. Si alguna de sus tareas se cerró después, se toma el cierre de esa tarea | Fecha de cierre de las issues |

Los 8 PR del backend que se cerraron sin fusionar (#3 a #10) no cuentan como inicio. Se crearon el 30/09 en 7 minutos, encadenados sobre la rama del seed, y ese trabajo se rehízo después en otros PR.

## WIP diario

No hay actas de las Dailies con el WIP de cada columna. El WIP total se reconstruyó contando, al cierre de cada día, las historias ya empezadas y todavía no terminadas (ver la tabla de tiempos). No hay forma de saber en qué columna estaba cada una, por eso esas columnas van con "—".

| Fecha | Sprint | En análisis (máx 3) | En atención (máx 3) | En validación (máx 2) | WIP total | Bloqueadas | Nota |
|---|---|---|---|---|---|---|---|
| 29/09 | 1 | — | — | — | 1 | 0 | HU-01 |
| 30/09 | 1 | — | — | — | 1 | 0 | HU-01 |
| 01/10 | 1 | — | — | — | 1 | 0 | HU-01 |
| 02/10 | 1 | — | — | — | 2 | 0 | HU-01, HU-02 |
| 03/10 | 1 | — | — | — | 4 | 0 | HU-01, HU-02, HU-03, HU-05 |
| 04/10 | 1 | — | — | — | 4 | 0 | HU-01, HU-02, HU-03, HU-05 |
| 05/10 | 1 y 2 | — | — | — | 5 | 0 | Se suma HU-08 (Sprint 2) sin haber cerrado el Sprint 1 |
| 06/10 | 1, 2 y 3 | — | — | — | 6 | 2 por unas horas | HU-01, HU-02, HU-05, HU-04, HU-08 y HU-09: historias de los tres sprints a la vez. HU-04 (#25) y HU-09 (#41) estuvieron en pausa (ver bloqueos) |
| 07/10 | 2 y 3 | — | — | — | 5 | 0 | Cierran HU-01, HU-02 y HU-05. Siguen HU-04, HU-06, HU-08, HU-09 y HU-11 |
| 08/10 | 2 y 3 | — | — | — | 4 | 0 | Cierran HU-04 y HU-08. Siguen HU-06, HU-07, HU-09 y HU-11 |
| 09/10 | 2 y 3 | — | — | — | 4 | 0 | Sin PR fusionados |
| 10/10 | 2 y 3 | — | — | — | 4 | 0 | Sin PR fusionados |
| 11/10 | 2 y 3 | — | — | — | 5 | 0 | Cierra HU-06. Empiezan HU-10 y HU-12 |
| 12/10 | 3 | — | — | — | 3 | 0 | Cierran HU-07 y HU-11. Siguen HU-09, HU-10 y HU-12 |

## Registro de bloqueos

Ninguna issue tiene la etiqueta `bloqueado`. Los dos bloqueos de abajo quedaron escritos en los comentarios de las issues, con la hora.

| Issue | Motivo | Desde | Hasta | Horas | Impacto | Cómo se resolvió |
|---|---|---|---|---|---|---|
| #25 (HU-04) | DEF-01: `development` del backend no compilaba tras el merge del PR backend #23. Se atendió como expedite y #25 quedó en pausa | 06/10 17:54 | 06/10 19:38 | 1,7 | La asignación de casos se detuvo. Además, `development` estuvo roto para todo el equipo desde el merge de #23 (06/10 00:45) hasta el arreglo: 18,9 h | PR backend #24 reordenó los métodos mezclados, sin cambiar lógica. Registro en el PR frontend #69 |
| #41 (HU-09) | Se esperaba a que #33 agregara el filtro `estado` a `GET /casos`, para no duplicarlo | 06/10 21:28 | 06/10 21:55 | 0,5 | Los filtros del backend se pausaron | Se decidió agregar el filtro en #41 y que #33 lo reutilizara |

## Tiempos por historia

| Historia | SP | Sprint | Fecha Ready | Fecha inicio | Fecha Done | Lead Time (h) | Cycle Time (h) |
|---|---|---|---|---|---|---|---|
| HU-01 | 5 | 1 | 29/09 19:13 | 29/09 20:40 | 07/10 08:53 | 181,7 | 180,2 |
| HU-02 | 3 | 1 | 29/09 19:14 | 02/10 20:41 | 07/10 08:55 | 181,7 | 108,2 |
| HU-03 | 3 | 1 | 29/09 19:15 | 03/10 13:50 | 06/10 21:04 | 169,8 | 79,2 |
| HU-05 | 5 | 1 | 29/09 19:15 | 03/10 20:35 | 07/10 23:39 | 196,4 | 99,1 |
| HU-04 | 3 | 2 | 06/10 00:00 | 06/10 09:57 | 08/10 01:58 | 50,0 | 40,0 |
| HU-06 | 5 | 2 | 06/10 00:00 | 07/10 14:27 | 11/10 13:21 | 133,4 | 94,9 |
| HU-07 | 5 | 2 | 07/10 00:00 | 08/10 09:01 | 12/10 02:32 | 122,5 | 89,5 |
| HU-08 | 5 | 2 | 05/10 22:31 | 05/10 22:31 | 08/10 21:58 | 71,5 | 71,5 |
| HU-09 | 3 | 3 | 06/10 00:00 | 06/10 21:07 | En curso | – | – |
| HU-10 | 5 | 3 | 08/10 00:00 | 11/10 16:26 | En curso | – | – |
| HU-11 | 3 | 3 | 07/10 00:00 | 07/10 09:41 | 12/10 02:29 | 122,5 | 112,8 |
| HU-12 | 3 | 3 | 11/10 00:00 | 11/10 14:03 | En curso | – | – |

De dónde sale cada inicio y cada cierre:

- **HU-01:** inicio con el primer commit del PR frontend #60 (base del frontend). La historia se cerró el 30/09 a las 14:11, con 7 de sus 8 tareas abiertas; por eso el Done es el cierre de su última tarea, #8 (pruebas).
- **HU-02:** inicio con el comentario "Hora inicio" de #11.
- **HU-03:** inicio con el primer commit del PR backend #19.
- **HU-05:** inicio con el primer commit del PR backend #21.
- **HU-04:** inicio con el comentario "Fecha inicio" de #25.
- **HU-06:** inicio con el primer commit del PR backend #28.
- **HU-07:** inicio con el primer commit del PR backend #29.
- **HU-08:** inicio con el primer commit del PR backend #22. Su `Fecha Ready` (07/10, de #38) es posterior al inicio, así que se toma el inicio como Ready: la tarea #37 empezó sin que la historia estuviera en Ready.
- **HU-09:** inicio con el comentario "Fecha inicio" de #41. Falta #43 (CP-10 y CP-19).
- **HU-10:** inicio con el primer commit del PR backend #31. Faltan #47 (CP-20) y #48 (documentar el cálculo).
- **HU-11:** inicio con el primer commit del PR backend #27.
- **HU-12:** inicio con el comentario "Hora inicio" de #54. Falta #56 (CP-22 y CP-23).

## Consolidado por sprint

El WIP promedio es el promedio del WIP diario de arriba en los días en que el sprint tuvo trabajo. Defectos y bloqueos se asignan al sprint de la issue afectada.

| Sprint | SP comprometidos | Historias comprometidas | Throughput | SP terminados | Lead Time promedio | Cycle Time promedio | WIP promedio | Defectos | Bloqueos (cantidad / horas) |
|---|---|---|---|---|---|---|---|---|---|
| 1 (29–30 sep; real 29/09–07/10) | 16 | 4 | 4 | 16 | 182,4 h | 116,7 h | 3,2 | 0 | 0 / 0 |
| 2 (1–2 oct; real 05/10–12/10) | 18 | 4 | 4 | 18 | 94,3 h | 74,0 h | 4,5 | 1 (DEF-01) | 1 / 1,7 h |
| 3 (3 oct; real 06/10–en curso) | 14 | 4 | 1 | 3 | 122,5 h | 112,8 h | 4,4 | 0 | 1 / 0,5 h |

Al corte, el Sprint 3 sigue abierto: sus promedios salen de una sola historia (HU-11).

Además de la tabla:

- **Defectos.** Ninguna issue tiene la etiqueta `defecto`. DEF-01 está registrado en [06-pruebas.md](06-pruebas.md) y en un comentario de #20, y se cuenta en el Sprint 2 porque así quedó en ese registro.
- **Retrabajo en el Sprint 1.** El seed se fusionó y se revirtió dos veces (PR backend #2 → #11, y #12 → #13, este último por entrar a `main` por error), y los 8 PR del backend #3 a #10 se cerraron sin fusionar.
- **Rama `main`.** Todo el trabajo está en `development`. Al corte, `main` no tiene 82 commits del frontend ni 47 del backend.

## Comparación entre dos momentos

El taller pide comparar al menos dos momentos y decir si una mejora tuvo efecto. Se llena en la Retro del Sprint 2 (Sprint 1 contra Sprint 2) y se actualiza al final del Sprint 3.

| | Momento 1 (Sprint 1) | Momento 2 (Sprint 2) | ¿Cambió? |
|---|---|---|---|
| Mejora aplicada | – | No quedó registrada ninguna mejora acordada en una retro | No hay cambio que medir |
| Cycle Time promedio | 116,7 h | 74,0 h | Bajó 42,7 h (−37 %) |
| Lead Time promedio | 182,4 h | 94,3 h | Bajó 88,1 h (−48 %) |
| Throughput | 4 historias (16 SP) | 4 historias (18 SP) | Igual en historias, +2 SP |
| Defectos | 0 | 1 (DEF-01, crítico, corregido el mismo día) | Subió 1 |
| Bloqueos | 0 | 1 / 1,7 h | Subió 1 |

**Conclusión:** los tiempos del Sprint 2 bajaron casi a la mitad, pero no se puede atribuir a una mejora del proceso, porque no hubo una acordada y registrada. Los datos explican la diferencia por otras dos razones:

- **El Sprint 1 incluyó la preparación del proyecto** (base del frontend, modelo de datos, seed, catálogos). Además, sus historias entraron a Ready el 29/09 y quedaron ahí mientras se armaba esa base, lo que alarga el Lead Time.
- **Las historias del Sprint 2 empezaron cuando esa base ya estaba lista**, entre el 05/10 y el 08/10.

Lo que sí muestran los datos en los dos sprints:

- **Las fechas planeadas no se cumplieron.** Los sprints de 2 días duraron entre 7 y 9 días calendario.
- **Los sprints se solaparon.** El 06/10 había 6 historias de los tres sprints en curso a la vez.

Antes de cerrar el Sprint 3 conviene acordar una mejora concreta (en las retros de los sprints hay propuestas sacadas de estos datos) y medir su efecto con estas mismas columnas.
