# Product Backlog

Parte del backlog que entregó el docente (`docs/recursos/backlog_CampusHelp.csv`). Lo refinamos agregando reglas de negocio, criterios de aceptación, dependencias, pruebas y tareas técnicas. Cada historia tiene su ficha en [backlog/](backlog/) y su issue en el tablero; el estado real siempre es el del tablero, esta tabla es la foto inicial.

Estimación en Story Points (1, 2, 3, 5, 8, 13). Como estimación inicial se tomaron los puntos sugeridos por el docente. El equipo los confirma o ajusta con Planning Poker en la primera Planning, y cualquier cambio queda anotado en el documento del sprint.

## Historias

| ID | Historia | Prioridad | SP | Sprint | Depende de | Issue | Estado inicial |
|---|---|---|---|---|---|---|---|
| [HU-01](backlog/HU-01.md) | Registrar incidente o solicitud | P1 | 5 | 1 | – | [#1](https://github.com/CristianGarcia21/sw3-frontend/issues/1) | Ready |
| [HU-02](backlog/HU-02.md) | Consultar mis casos | P1 | 3 | 1 | HU-01 | [#10](https://github.com/CristianGarcia21/sw3-frontend/issues/10) | Ready |
| [HU-03](backlog/HU-03.md) | Bandeja de casos del agente | P1 | 3 | 1 | HU-01 | [#14](https://github.com/CristianGarcia21/sw3-frontend/issues/14) | Ready |
| [HU-04](backlog/HU-04.md) | Asignarme un caso | P1 | 3 | 2 | HU-03, HU-05 | [#24](https://github.com/CristianGarcia21/sw3-frontend/issues/24) | Product Backlog |
| [HU-05](backlog/HU-05.md) | Cambiar el estado del caso | P1 | 5 | 1 | HU-01 | [#18](https://github.com/CristianGarcia21/sw3-frontend/issues/18) | Ready |
| [HU-06](backlog/HU-06.md) | Registrar diagnóstico y solución | P1 | 5 | 2 | HU-04, HU-05 | [#28](https://github.com/CristianGarcia21/sw3-frontend/issues/28) | Product Backlog |
| [HU-07](backlog/HU-07.md) | Aprobar o devolver una solución | P1 | 5 | 2 | HU-06 | [#32](https://github.com/CristianGarcia21/sw3-frontend/issues/32) | Product Backlog |
| [HU-08](backlog/HU-08.md) | Consultar el historial | P2 | 5 | 2 | HU-05 | [#36](https://github.com/CristianGarcia21/sw3-frontend/issues/36) | Product Backlog |
| [HU-09](backlog/HU-09.md) | Filtrar casos | P2 | 3 | 3 | HU-03 | [#40](https://github.com/CristianGarcia21/sw3-frontend/issues/40) | Product Backlog |
| [HU-10](backlog/HU-10.md) | Indicadores del servicio | P2 | 5 | 3 | HU-04, HU-07 | [#44](https://github.com/CristianGarcia21/sw3-frontend/issues/44) | Product Backlog |
| [HU-11](backlog/HU-11.md) | Gestionar categorías | P2 | 3 | 3 | HU-01 | [#49](https://github.com/CristianGarcia21/sw3-frontend/issues/49) | Product Backlog |
| [HU-12](backlog/HU-12.md) | Detalle de mi caso y solución | P3 | 3 | 3 | HU-02, HU-06 | [#53](https://github.com/CristianGarcia21/sw3-frontend/issues/53) | Product Backlog |

Total: 48 SP. Sprint 1: 16 SP, Sprint 2: 18 SP, Sprint 3: 14 SP.

## Plan de sprints

Seguimos la distribución sugerida en el taller. La revisamos contra las dependencias:

- HU-05 (Sprint 1) va antes que HU-04 (Sprint 2), aunque cambiar a `En atención` necesita agente asignado. Lo resolvimos así: en Sprint 1 se construye la máquina de estados completa y en Sprint 2, con HU-04, se activa la regla RN-11. Así el Sprint 1 ya muestra transiciones válidas e inválidas.
- HU-08 queda en Sprint 2, pero los eventos de historial se guardan desde el Sprint 1 (HU-01 y HU-05). Lo que se hace en Sprint 2 es consultarlos y mostrarlos.
- Las áreas y categorías iniciales entran como datos semilla en HU-01. La administración de categorías (HU-11) puede esperar al Sprint 3 sin bloquear nada.

## Tareas técnicas

Cada tarea es una sub-issue de su historia. BD y Backend se programan en `sw3-backend`; Frontend en este repo.

| Sprint | Historia | Área | Tarea | Responsable | Issue |
|---|---|---|---|---|---|
| 1 | HU-01 | BD | Modelo Prisma del dominio y migración inicial | Tania Botina | [#2](https://github.com/CristianGarcia21/sw3-frontend/issues/2) |
| 1 | HU-01 | BD | Seed de áreas, categorías y usuarios de prueba | Tania Botina | [#3](https://github.com/CristianGarcia21/sw3-frontend/issues/3) |
| 1 | HU-01 | Backend | Endpoints GET /usuarios, /areas y /categorias | Juan José | [#4](https://github.com/CristianGarcia21/sw3-frontend/issues/4) |
| 1 | HU-01 | Backend | POST /casos con validaciones y evento CREACION | Juan José | [#5](https://github.com/CristianGarcia21/sw3-frontend/issues/5) |
| 1 | HU-01 | Frontend | Base del frontend: rutas, layout, cliente API y selector de usuario de prueba | Cristian García | [#6](https://github.com/CristianGarcia21/sw3-frontend/issues/6) |
| 1 | HU-01 | Frontend | Formulario de registro de caso | Valentina Galvis | [#7](https://github.com/CristianGarcia21/sw3-frontend/issues/7) |
| 1 | HU-01 | Pruebas | Ejecutar CP-01, CP-02, CP-03 y CP-11 | Juan Diego | [#8](https://github.com/CristianGarcia21/sw3-frontend/issues/8) |
| 1 | HU-01 | Documentación | README con pasos para correr backend y frontend juntos | Juan Fernando | [#9](https://github.com/CristianGarcia21/sw3-frontend/issues/9) |
| 1 | HU-02 | Backend | GET /casos filtrado por solicitante (RN-20) | Juan José | [#11](https://github.com/CristianGarcia21/sw3-frontend/issues/11) |
| 1 | HU-02 | Frontend | Pantalla Mis casos | Cristian García | [#12](https://github.com/CristianGarcia21/sw3-frontend/issues/12) |
| 1 | HU-02 | Pruebas | Ejecutar CP-12 | Juan Diego | [#13](https://github.com/CristianGarcia21/sw3-frontend/issues/13) |
| 1 | HU-03 | Backend | Orden de bandeja y filtros de no cerrados / asignados a mí | Tania Botina | [#15](https://github.com/CristianGarcia21/sw3-frontend/issues/15) |
| 1 | HU-03 | Frontend | Pantalla Bandeja del agente | Valentina Galvis | [#16](https://github.com/CristianGarcia21/sw3-frontend/issues/16) |
| 1 | HU-03 | Pruebas | Ejecutar CP-13 y la parte de bandeja de CP-01 | Juan Diego | [#17](https://github.com/CristianGarcia21/sw3-frontend/issues/17) |
| 1 | HU-05 | Backend | Máquina de estados y PATCH /casos/{id}/estado | Juan José | [#19](https://github.com/CristianGarcia21/sw3-frontend/issues/19) |
| 1 | HU-05 | Backend | PATCH /casos/{id}/clasificacion (RN-08) | Tania Botina | [#20](https://github.com/CristianGarcia21/sw3-frontend/issues/20) |
| 1 | HU-05 | Frontend | Detalle del caso para el agente con acciones de estado | Cristian García | [#21](https://github.com/CristianGarcia21/sw3-frontend/issues/21) |
| 1 | HU-05 | Frontend | Diálogo de reclasificación (tipo, categoría, prioridad) | Valentina Galvis | [#22](https://github.com/CristianGarcia21/sw3-frontend/issues/22) |
| 1 | HU-05 | Pruebas | Ejecutar CP-04, CP-05 y CP-15 | Juan Diego | [#23](https://github.com/CristianGarcia21/sw3-frontend/issues/23) |
| 2 | HU-04 | Backend | PATCH /casos/{id}/asignar y regla RN-11 | Juan José | [#25](https://github.com/CristianGarcia21/sw3-frontend/issues/25) |
| 2 | HU-04 | Frontend | Botón Asignarme y selector de agente | Cristian García | [#26](https://github.com/CristianGarcia21/sw3-frontend/issues/26) |
| 2 | HU-04 | Pruebas | Ejecutar CP-06 y CP-14 | Juan Diego | [#27](https://github.com/CristianGarcia21/sw3-frontend/issues/27) |
| 2 | HU-06 | Backend | POST /casos/{id}/atencion y regla RN-13 | Juan José | [#29](https://github.com/CristianGarcia21/sw3-frontend/issues/29) |
| 2 | HU-06 | Frontend | Formulario de diagnóstico y solución | Cristian García | [#30](https://github.com/CristianGarcia21/sw3-frontend/issues/30) |
| 2 | HU-06 | Pruebas | Ejecutar CP-07 y CP-16 | Juan Diego | [#31](https://github.com/CristianGarcia21/sw3-frontend/issues/31) |
| 2 | HU-07 | Backend | POST /casos/{id}/validacion | Tania Botina | [#33](https://github.com/CristianGarcia21/sw3-frontend/issues/33) |
| 2 | HU-07 | Frontend | Bandeja y pantalla de validación | Valentina Galvis | [#34](https://github.com/CristianGarcia21/sw3-frontend/issues/34) |
| 2 | HU-07 | Pruebas | Ejecutar CP-08, CP-09 y CP-17 | Juan Diego | [#35](https://github.com/CristianGarcia21/sw3-frontend/issues/35) |
| 2 | HU-08 | Backend | GET /casos/{id}/historial con permisos | Juan José | [#37](https://github.com/CristianGarcia21/sw3-frontend/issues/37) |
| 2 | HU-08 | Frontend | Línea de tiempo del historial en el detalle | Valentina Galvis | [#38](https://github.com/CristianGarcia21/sw3-frontend/issues/38) |
| 2 | HU-08 | Pruebas | Ejecutar CP-18 | Juan Diego | [#39](https://github.com/CristianGarcia21/sw3-frontend/issues/39) |
| 3 | HU-09 | Backend | Filtros combinables en GET /casos e índices | Tania Botina | [#41](https://github.com/CristianGarcia21/sw3-frontend/issues/41) |
| 3 | HU-09 | Frontend | Barra de filtros sincronizada con la URL | Valentina Galvis | [#42](https://github.com/CristianGarcia21/sw3-frontend/issues/42) |
| 3 | HU-09 | Pruebas | Ejecutar CP-10 y CP-19 | Juan Diego | [#43](https://github.com/CristianGarcia21/sw3-frontend/issues/43) |
| 3 | HU-10 | Backend | GET /indicadores con consultas agregadas | Juan José | [#45](https://github.com/CristianGarcia21/sw3-frontend/issues/45) |
| 3 | HU-10 | Frontend | Pantalla de indicadores | Cristian García | [#46](https://github.com/CristianGarcia21/sw3-frontend/issues/46) |
| 3 | HU-10 | Pruebas | Ejecutar CP-20 | Juan Diego | [#47](https://github.com/CristianGarcia21/sw3-frontend/issues/47) |
| 3 | HU-10 | Documentación | Documentar cómo se calcula cada indicador | Juan Fernando | [#48](https://github.com/CristianGarcia21/sw3-frontend/issues/48) |
| 3 | HU-11 | Backend | CRUD de /categorias (RN-21, RN-22) | Juan José | [#50](https://github.com/CristianGarcia21/sw3-frontend/issues/50) |
| 3 | HU-11 | Frontend | Pantalla de administración de categorías | Valentina Galvis | [#51](https://github.com/CristianGarcia21/sw3-frontend/issues/51) |
| 3 | HU-11 | Pruebas | Ejecutar CP-21 | Juan Diego | [#52](https://github.com/CristianGarcia21/sw3-frontend/issues/52) |
| 3 | HU-12 | Backend | GET /casos/{id} con atenciones y permiso de solicitante | Tania Botina | [#54](https://github.com/CristianGarcia21/sw3-frontend/issues/54) |
| 3 | HU-12 | Frontend | Detalle del caso para el solicitante | Cristian García | [#55](https://github.com/CristianGarcia21/sw3-frontend/issues/55) |
| 3 | HU-12 | Pruebas | Ejecutar CP-22 y CP-23 | Juan Diego | [#56](https://github.com/CristianGarcia21/sw3-frontend/issues/56) |

### Carga por persona (tareas técnicas)

| Integrante | Tareas |
|---|---|
| Juan Diego | 12 |
| Juan José | 9 |
| Tania Botina | 7 |
| Cristian García | 7 |
| Valentina Galvis | 7 |
| Juan Fernando | 2 |

Además, Tania (SM) facilita las ceremonias y Juan Fernando (PO) lleva métricas y documentación de cada sprint: issues [#57](https://github.com/CristianGarcia21/sw3-frontend/issues/57), [#58](https://github.com/CristianGarcia21/sw3-frontend/issues/58) y [#59](https://github.com/CristianGarcia21/sw3-frontend/issues/59).
