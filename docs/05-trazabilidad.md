# Matriz de trazabilidad

Relaciona cada historia con el actor, las reglas de negocio, los casos de prueba, los endpoints y las pantallas. Sirve para comprobar que ninguna regla quedó sin probar y que cada prueba viene de un requisito.

| Historia | Actor | Reglas | Pruebas | Endpoints | Pantalla (frontend) |
|---|---|---|---|---|---|
| HU-01 | Solicitante | RN-01 a RN-07, RN-17 | CP-01, CP-02, CP-03, CP-11, CP-23 | POST /casos, GET /areas, GET /categorias, GET /usuarios | Registrar caso |
| HU-02 | Solicitante | RN-20 | CP-12 | GET /casos | Mis casos |
| HU-03 | Agente | – | CP-01, CP-13 | GET /casos | Bandeja |
| HU-04 | Agente | RN-11, RN-17, RN-18, RN-19 | CP-06, CP-14 | PATCH /casos/{id}/asignar | Bandeja, Detalle (agente) |
| HU-05 | Agente | RN-08, RN-09, RN-10, RN-11, RN-13, RN-17 | CP-04, CP-05, CP-15 | PATCH /casos/{id}/estado, PATCH /casos/{id}/clasificacion | Detalle (agente) |
| HU-06 | Agente | RN-12, RN-13, RN-17 | CP-07, CP-16 | POST /casos/{id}/atencion | Detalle (agente) |
| HU-07 | Validador | RN-14, RN-15, RN-16, RN-17 | CP-08, CP-09, CP-17 | POST /casos/{id}/validacion | Validación |
| HU-08 | Usuario autorizado | RN-17 | CP-04, CP-08, CP-18 | GET /casos/{id}/historial | Detalle (historial) |
| HU-09 | Administrador | – | CP-10, CP-19 | GET /casos | Bandeja / Casos (filtros) |
| HU-10 | Administrador | – | CP-20 | GET /indicadores | Indicadores |
| HU-11 | Administrador | RN-03, RN-21, RN-22 | CP-21 | /categorias (CRUD) | Administrar categorías |
| HU-12 | Solicitante | RN-20 | CP-22 | GET /casos/{id} | Detalle (solicitante) |

## Cobertura de reglas

| Regla | Historias | Pruebas |
|---|---|---|
| RN-01 tipo obligatorio | HU-01 | CP-02 |
| RN-02 área obligatoria | HU-01 | CP-01 |
| RN-03 categoría activa del área | HU-01, HU-11 | CP-11, CP-21 |
| RN-04 título | HU-01 | CP-01 |
| RN-05 descripción mínima | HU-01 | CP-03 |
| RN-06 prioridad P1/P2/P3 | HU-01 | CP-01 |
| RN-07 fecha y estado inicial | HU-01 | CP-01 |
| RN-08 reclasificación | HU-05 | CP-15 |
| RN-09 transiciones permitidas | HU-05 | CP-05 |
| RN-10 cerrada es final | HU-05 | CP-15 |
| RN-11 atención requiere agente | HU-04, HU-05 | CP-14 |
| RN-12 solo el agente asignado atiende | HU-06 | CP-16 |
| RN-13 validación requiere solución | HU-06 | CP-07 |
| RN-14 cierre solo al aprobar | HU-07 | CP-09 |
| RN-15 devolución con comentario | HU-07 | CP-08, CP-17 |
| RN-16 validador distinto al agente | HU-07 | CP-17 |
| RN-17 historial de eventos | HU-01, HU-04 a HU-08 | CP-04, CP-18 |
| RN-18 solo agentes activos | HU-04 | CP-06 |
| RN-19 asignación en Pendiente/En análisis | HU-04 | CP-14 |
| RN-20 solicitante ve lo suyo | HU-02, HU-12 | CP-12, CP-22 |
| RN-21 desactivar en vez de borrar | HU-11 | CP-21 |
| RN-22 nombre único por área | HU-11 | CP-21 |

## Criterios de aceptación del producto final → historias

| Criterio del enunciado | Historias |
|---|---|
| Registrar un Incidente / una Solicitud de servicio | HU-01 |
| Obliga a seleccionar área y categoría | HU-01 |
| El caso recibe prioridad y estado inicial | HU-01 |
| Un agente puede ver y asignarse un caso | HU-03, HU-04 |
| El agente registra diagnóstico y solución | HU-06 |
| El sistema controla las transiciones | HU-05 |
| El validador aprueba o devuelve | HU-07 |
| El sistema registra historial | HU-08 (eventos desde HU-01) |
| Los casos se pueden filtrar | HU-09 |
| Indicadores sobre datos reales | HU-10 |
| La información persiste tras reiniciar | Todas (CP-23) |
| Se ejecuta siguiendo el README | Tarea de documentación de HU-01 |
| Flujo completo Registrar → Asignar → Atender → Validar → Cerrar | HU-01, HU-04, HU-05, HU-06, HU-07 |
