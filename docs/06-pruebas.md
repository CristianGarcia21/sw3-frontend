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
| 2026-10-05 | CP-01 (parte bandeja) | 1 | Tania Botina | Como Laura se registró el caso #1 (Incidente, Red y conectividad / Wi-Fi, P2). Como Andrés, en Bandeja › Pendientes aparece #1 con estado Pendiente y agente "Sin asignar". La API (`GET /casos?abiertos=true&orden=prioridad`) devuelve lo mismo, con `agente: null` | Pasó | – |
| 2026-10-05 | HU-03 extra (ir al detalle) | 1 | Tania Botina | Como Andrés, el clic en la fila del caso #1 abre `/casos/1`, y la flecha atrás del navegador vuelve a la bandeja. La pantalla de detalle aún muestra "En construcción (HU-05 · #21)"; se verificó solo la navegación, que es lo que pide HU-03 | Pasó | – |
| 2026-10-05 | CP-13 | 1 | Tania Botina | BD limpia (`truncate caso restart identity cascade`). Como Laura se crearon, en orden, #1 P3, #2 P1, #3 P2, #4 P1 y #5 P1; el #5 se cerró por SQL (`estado='CERRADA'`, `fecha_cierre=now()`), porque el proyecto no tiene Prisma Studio y `PATCH /estado` no acepta CERRADA. Como Andrés, Bandeja › Pendientes muestra #2 (P1), #4 (P1), #3 (P2), #1 (P3): P1 más antiguo primero, y el #5 cerrado no aparece. La API devuelve el mismo orden | Pasó | – |
| 2026-10-05 | CP-12 | 1 | Valentina Galvis | Laura registró 2 casos (#6 y #7) y Carlos 1. Mis casos como Laura muestra solo sus 2 casos; como Carlos, solo el suyo | Pasó | – |
| 2026-10-05 | CP-12 (extra: RN-20 con curl) | 1 | Valentina Galvis | Con X-Usuario-Id: 3 (Laura) y GET /casos?solicitanteId=4 solo devolvió los casos #6 y #7, ambos de Laura | Pasó | – |
| 2026-10-05 | CP-12 (extra: solicitante sin casos) | 1 | Valentina Galvis | Carlos sin casos ve el mensaje de vacío con el enlace a registrar caso | Pasó | – |
| 2026-10-07 | CP-01 | 1 | Juan Diego | Como Laura, en Registrar caso: Incidente, Red y conectividad / Wi-Fi, "Sin Wi-Fi bloque B", descripción "No conecta desde esta mañana en el segundo piso", P2. La pantalla muestra "Caso #6 registrado". En la BD el #6 quedó INCIDENTE, P2, PENDIENTE, sin agente, con `fecha_creacion` puesta por el servidor y el evento CREACION en el historial. La parte "aparece en la bandeja" ya la ejecutó Tania (HU-03) | Pasó | – |
| 2026-10-07 | CP-02 | 1 | Juan Diego | Como Carlos: Solicitud de servicio, Software / Instalación, "Instalar Visual Studio", descripción "Necesito Visual Studio en el equipo de la sala 3", P3. La pantalla muestra "Caso #7 registrado" y en la BD el #7 quedó con tipo SOLICITUD, P3, PENDIENTE | Pasó | – |
| 2026-10-07 | CP-03 (pantalla) | 1 | Juan Diego | Como Laura, Incidente, Cuentas y acceso / Contraseña, todo lleno menos la descripción. a) Vacía: "La descripción es obligatoria." b) "corta": "Mínimo 10 caracteres". c) 12 espacios: "La descripción es obligatoria." En los tres casos el error sale debajo del campo, el formulario no envía la petición (0 POST) y no se crea ningún caso | Pasó | – |
| 2026-10-07 | CP-03 (API) | 1 | Juan Diego | `curl` a `POST /casos` como Laura: a) sin `descripcion` → 400 VALIDACION ("El campo 'descripcion' es obligatorio"). b) "corta" y c) 12 espacios → 400 VALIDACION ("La descripción debe tener al menos 10 caracteres"). `detalles` trae el campo `descripcion`. No se creó ningún caso | Pasó | – |
| 2026-10-07 | CP-11 | 1 | Juan Diego | `curl` a `POST /casos` con `areaId: 1` (Hardware) y `categoriaId: 8` (Wi-Fi) → 409 CATEGORIA_INVALIDA. El número de casos en la BD no cambió (7 antes y después) | Pasó | – |
| 2026-10-07 | CP-23 (parte HU-01) | 1 | Juan Diego | Se detuvieron el backend y PostgreSQL (`docker compose stop`, sin borrar el volumen) y se volvieron a iniciar. `GET /casos` devuelve los casos #6 (CP-01) y #7 (CP-02) con los mismos datos, y sus eventos CREACION siguen en el historial | Pasó | – |
| 2026-10-07 | CP-05 | 1 | Juan Fernando | `curl` a `PATCH /casos/{id}/estado` como Andrés (X-Usuario-Id: 3): a) caso PENDIENTE → EN_VALIDACION: 409 TRANSICION_INVALIDA. b) PENDIENTE → CERRADA: 409 TRANSICION_INVALIDA ("Un caso solo se cierra al aprobarlo en validación"). c) caso EN_ANALISIS → PENDIENTE: 409 TRANSICION_INVALIDA. Los casos quedaron en el mismo estado y el historial solo tiene CREACION (y el CAMBIO_ESTADO previo a EN_ANALISIS del paso c), sin eventos nuevos | Pasó | – |
| 2026-10-07 | CP-15 (API) | 1 | Juan Fernando | Caso puesto en CERRADA por SQL (`update caso set estado='CERRADA'`). Como Andrés: `PATCH /estado` a EN_ANALISIS → 409 CASO_CERRADO; `PATCH /clasificacion` con `{"prioridad":"P1"}` → 409 CASO_CERRADO. Falta verificar en pantalla que el detalle no muestra botones de estado ni de reclasificar (depende de #21 y #22) | Pasó (parte API) | – |
| 2026-10-07 | HU-05 extra (reclasificar P3 → P1) | 1 | Juan Fernando | Como Andrés, `PATCH /casos/{id}/clasificacion` con `{"prioridad":"P1"}` en un caso EN_ANALISIS con P3: 200, el caso queda en P1 y el historial agrega RECLASIFICACION con el comentario "prioridad: P3 → P1". Solo por API; falta repetirlo desde el diálogo de reclasificación (#22) | Pasó (parte API) | – |
| 2026-10-07 | HU-05 extra (Laura cambia estado) | 1 | Juan Fernando | Como Laura (X-Usuario-Id: 1), `PATCH /casos/{id}/estado` con `{"estado":"EN_ATENCION"}` → 403 ROL_NO_PERMITIDO | Pasó | – |

## Registro de defectos

Cada defecto también existe como issue con la etiqueta `defecto`. Esta tabla es el resumen para la entrega.

| ID | Issue | Descripción | Pasos | Resultado esperado | Resultado obtenido | Prioridad | Estado | Sprint | Fecha |
|---|---|---|---|---|---|---|---|---|---|
| DEF-01 | #20 | El merge de #20 (reclasificación) con HU-08 (historial) mezcló `reclasificarCaso` y `verHistorial` y dejó sin cerrar `reclasificar`; `development` del backend no compilaba | Actualizar `development` del backend (`d5815a9`) y ejecutar `npm run build` o `npm run dev` | El backend compila y arranca; `PATCH /casos/{id}/clasificacion` y `GET /casos/{id}/historial` responden según el contrato | Error de sintaxis TypeScript; el backend no arranca | Crítico | Corregido (PR backend #24) | 2 | 6/10/2026 |

Prioridad del defecto: **Crítico** (rompe el flujo principal o pierde datos), **Alto** (incumple una regla de negocio), **Medio** (funciona con un rodeo), **Bajo** (visual o texto).
