# Pruebas

Responsable: Juan Diego (QA). Cada historia tiene casos ligados a sus criterios de aceptación. Los CP-01 a CP-10 vienen del docente; del CP-11 en adelante son nuestros (el taller pide mínimo cinco adicionales).

Los resultados se llenan **cuando se ejecuta la prueba**, con la fecha real. Si una prueba falla, se abre una issue con la plantilla "Defecto" y se anota su número aquí.

## Datos de prueba

Usuarios del seed (ver [02-requisitos.md](02-requisitos.md)): Laura Méndez y Carlos Ruiz (solicitantes), Andrés Pérez y Marta Gómez (agentes), Sofía Rojas (validadora), Admin TI (administrador).

## Casos de prueba

| ID | HU | Tipo / Área | Caso | Pasos | Resultado esperado |
|---|---|---|---|---|---|
| CP-01 | HU-01, HU-03 | Incidente / Red | Registrar Wi-Fi sin conexión | Como Laura: tipo Incidente, área Red y conectividad, categoría Wi-Fi, título "Sin Wi-Fi bloque B", descripción de más de 10 caracteres, P2. Guardar. Entrar como Andrés a la bandeja | Se crea con ID, estado Pendiente, persiste y aparece en la bandeja |
| CP-02 | HU-01 | Solicitud / Software | Solicitar instalación de software | Como Carlos: tipo Solicitud de servicio, Software → Instalación, "Instalar Visual Studio", P3. Guardar | Se crea y persiste con tipo Solicitud de servicio |
| CP-03 | HU-01 | Incidente / Cuentas | Registrar sin descripción | Llenar todo menos la descripción (y luego con 5 caracteres). Guardar | El sistema rechaza el registro y marca el campo |
| CP-04 | HU-05, HU-08 | Incidente / Red | Transición válida | Como Andrés, pasar el caso de CP-01 de Pendiente a En análisis | Cambia el estado y se crea evento en el historial |
| CP-05 | HU-05 | Solicitud / Software | Transición inválida | Enviar a la API `PATCH /estado` de Pendiente a EN_VALIDACION y a CERRADA | Responde 409 y el estado no cambia |
| CP-06 | HU-04 | Ambos | Asignar agente | Como Andrés, "Asignarme" en un caso Pendiente | Queda Andrés como responsable con fecha de asignación y evento en historial |
| CP-07 | HU-06 | Ambos | Registrar diagnóstico y solución | Como Andrés, en un caso En atención asignado a él, registrar diagnóstico y solución | La atención queda guardada con fecha y agente |
| CP-08 | HU-07, HU-08 | Ambos | Devolver desde validación | Como Sofía, devolver un caso En validación con comentario | Vuelve a En atención y el historial guarda el comentario |
| CP-09 | HU-07 | Ambos | Aprobar solución | Como Sofía, aprobar un caso En validación | Queda Cerrada con fecha de cierre |
| CP-10 | HU-09 | Ambos | Filtrar por prioridad/área/tipo | Con casos variados, filtrar por Incidente + P1 + Red y conectividad | Solo aparecen coincidencias |
| CP-11 | HU-01 | Incidente / Hardware | Categoría de otra área | Enviar a la API un caso con área Hardware y categoría Wi-Fi | La API responde error y no crea el caso |
| CP-12 | HU-02 | Ambos | Solicitante solo ve lo suyo | Laura con 2 casos, Carlos con 1. Entrar como Laura a Mis casos | Laura ve solo sus 2 casos |
| CP-13 | HU-03 | Ambos | Orden de la bandeja | Crear casos P3 viejo, P1 nuevo y P2. Abrir bandeja | Orden: P1, P2, P3; mismo nivel, más antiguo primero. Sin casos Cerrada |
| CP-14 | HU-04 | Ambos | En atención sin agente | Caso En análisis sin agente. Intentar pasar a En atención | El sistema lo impide |
| CP-15 | HU-05 | Ambos | Caso cerrado no cambia | Tomar un caso Cerrada e intentar cambiar estado o reclasificar | El sistema lo impide |
| CP-16 | HU-06 | Ambos | Atención de agente no asignado | Caso asignado a Andrés. Como Marta, registrar atención | Responde 403 y no guarda |
| CP-17 | HU-07 | Ambos | Devolver sin comentario / validador que atendió | a) Devolver sin comentario. b) Validar con el mismo usuario que registró la atención | Ambas se rechazan |
| CP-18 | HU-08 | Ambos | Historial del flujo completo | Llevar un caso de Pendiente a Cerrada con una devolución en medio. Ver historial | Aparece un evento por cada paso, en orden, con usuario, fecha y el comentario de la devolución |
| CP-19 | HU-09 | Ambos | Filtros sin resultados y limpiar | Filtrar por una combinación sin casos; luego Limpiar | Mensaje "No hay casos con esos filtros"; al limpiar vuelven todos |
| CP-20 | HU-10 | Ambos | Promedio de resolución | Dos casos cerrados con 10 h y 20 h de resolución (ajustar fechas en BD). Ver indicadores | Promedio de resolución 15 h; conteos por estado correctos |
| CP-21 | HU-11 | Hardware / Red | Categorías duplicadas e inactivas | a) Crear "Wi-Fi" otra vez en Red. b) Desactivar "Proyector" y abrir el registro | a) Se rechaza. b) Proyector no aparece, pero los casos viejos la conservan |
| CP-22 | HU-12 | Ambos | Detalle de caso ajeno | Como Carlos, abrir la URL del detalle de un caso de Laura | 403 y mensaje en pantalla |
| CP-23 | Todas | Ambos | Persistencia tras reinicio | Registrar un caso, detener backend y base de datos, volver a iniciar | El caso y su historial siguen ahí |

## Resultados de ejecución

Una fila por ejecución. Si se vuelve a probar después de corregir un defecto, se agrega otra fila.

| Fecha | ID | Sprint | Ejecutó | Resultado obtenido | Estado (Pasó/Falló) | Defecto |
|---|---|---|---|---|---|---|
| 2026-10-05 | CP-12 | 1 | Valentina Galvis | Laura registró 2 casos (#6 y #7) y Carlos 1. Mis casos como Laura muestra solo sus 2 casos; como Carlos, solo el suyo | Pasó | – |
| 2026-10-05 | CP-12 (extra: RN-20 con curl) | 1 | Valentina Galvis | Con X-Usuario-Id: 3 (Laura) y GET /casos?solicitanteId=4 solo devolvió los casos #6 y #7, ambos de Laura | Pasó | – |
| 2026-10-05 | CP-12 (extra: solicitante sin casos) | 1 | Valentina Galvis | Carlos sin casos ve el mensaje de vacío con el enlace a registrar caso | Pasó | – |

## Registro de defectos

Cada defecto también existe como issue con la etiqueta `defecto`. Esta tabla es el resumen para la entrega.

| ID | Issue | Descripción | Pasos | Resultado esperado | Resultado obtenido | Prioridad | Estado | Sprint | Fecha |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |




Prioridad del defecto: **Crítico** (rompe el flujo principal o pierde datos), **Alto** (incumple una regla de negocio), **Medio** (funciona con un rodeo), **Bajo** (visual o texto).
