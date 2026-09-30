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

## WIP diario

| Fecha | Sprint | En análisis (máx 3) | En atención (máx 3) | En validación (máx 2) | WIP total | Bloqueadas | Nota |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## Registro de bloqueos

| Issue | Motivo | Desde | Hasta | Horas | Impacto | Cómo se resolvió |
|---|---|---|---|---|---|---|
| | | | | | | |

## Tiempos por historia

| Historia | SP | Sprint | Fecha Ready | Fecha inicio | Fecha Done | Lead Time (h) | Cycle Time (h) |
|---|---|---|---|---|---|---|---|
| HU-01 | 5 | 1 | | | | | |
| HU-02 | 3 | 1 | | | | | |
| HU-03 | 3 | 1 | | | | | |
| HU-05 | 5 | 1 | | | | | |
| HU-04 | 3 | 2 | | | | | |
| HU-06 | 5 | 2 | | | | | |
| HU-07 | 5 | 2 | | | | | |
| HU-08 | 5 | 2 | | | | | |
| HU-09 | 3 | 3 | | | | | |
| HU-10 | 5 | 3 | | | | | |
| HU-11 | 3 | 3 | | | | | |
| HU-12 | 3 | 3 | | | | | |

## Consolidado por sprint

| Sprint | SP comprometidos | Historias comprometidas | Throughput | SP terminados | Lead Time promedio | Cycle Time promedio | WIP promedio | Defectos | Bloqueos (cantidad / horas) |
|---|---|---|---|---|---|---|---|---|---|
| 1 (29–30 sep) | 16 | 4 | | | | | | | |
| 2 (1–2 oct) | 18 | 4 | | | | | | | |
| 3 (3 oct) | 14 | 4 | | | | | | | |

## Comparación entre dos momentos

El taller pide comparar al menos dos momentos y decir si una mejora tuvo efecto. Se llena en la Retro del Sprint 2 (Sprint 1 contra Sprint 2) y se actualiza al final del Sprint 3.

| | Momento 1 (Sprint __) | Momento 2 (Sprint __) | ¿Cambió? |
|---|---|---|---|
| Mejora aplicada | | | |
| Cycle Time promedio | | | |
| Lead Time promedio | | | |
| Throughput | | | |
| Defectos | | | |
| Bloqueos | | | |

**Conclusión:** (qué se cambió, qué se esperaba, qué pasó con los números y si vale la pena mantener el cambio)
