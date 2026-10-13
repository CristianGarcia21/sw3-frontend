# Contrato de la API (frontend ↔ sw3-backend)

Parte de los endpoints sugeridos por el docente (`docs/recursos/api_sugerida_CampusHelp.json`) y agrega los que faltan para usuarios de prueba, áreas y administración de categorías. Si el backend cambia algo, se actualiza aquí en el mismo PR.

- Base: `VITE_API_URL` (por defecto `http://localhost:3000/api`)
- Formato: JSON
- Usuario actual: cabecera `X-Usuario-Id: <id>` (usuario de prueba elegido en el front)
- Fechas: ISO 8601 en UTC

## Usuario actual

Todas las rutas de `/casos` e `/indicadores` y las de escritura de `/categorias` exigen la cabecera `X-Usuario-Id`. Si falta, no es un número o el usuario no existe o está inactivo, la respuesta es `401 USUARIO_REQUERIDO`. `GET /usuarios`, `GET /areas` y `GET /categorias` no la necesitan (el selector de usuario se carga antes de elegir uno).

## Errores

Todos los errores tienen la misma forma:

```json
{ "error": "TRANSICION_INVALIDA", "mensaje": "No se puede pasar de Pendiente a Cerrada", "detalles": [] }
```

`error` es un código de esta lista cerrada. El frontend decide qué mostrar según el código, no según el texto de `mensaje`. Si hace falta un código nuevo, se agrega aquí primero.

| HTTP | Código | Cuándo |
|---|---|---|
| 400 | `VALIDACION` | El body o los query params no pasan el esquema Zod. `detalles` = `[{ "campo": "descripcion", "mensaje": "Mínimo 10 caracteres" }]` |
| 401 | `USUARIO_REQUERIDO` | Falta `X-Usuario-Id` o no corresponde a un usuario activo |
| 403 | `ROL_NO_PERMITIDO` | El rol del usuario no puede hacer esa operación |
| 403 | `NO_ES_AGENTE_ASIGNADO` | Un agente distinto al asignado intenta operar el caso |
| 403 | `CASO_AJENO` | Un solicitante intenta ver un caso que no es suyo |
| 404 | `NO_ENCONTRADO` | No existe el caso, la categoría o el recurso pedido |
| 409 | `CATEGORIA_INVALIDA` | La categoría no existe, está inactiva o no pertenece al área enviada |
| 409 | `TRANSICION_INVALIDA` | El cambio de estado no está en la tabla de transiciones |
| 409 | `CASO_CERRADO` | Se intenta modificar un caso en `CERRADA` |
| 409 | `ESTADO_NO_PERMITE_OPERACION` | La operación no aplica en el estado actual (reclasificar en atención, asignar en validación, validar un caso que no está en validación, etc.) |
| 409 | `SIN_AGENTE_ASIGNADO` | Se intenta pasar a `EN_ATENCION` sin agente |
| 409 | `SIN_SOLUCION` | Se intenta pasar a `EN_VALIDACION` sin atención registrada |
| 409 | `AGENTE_INVALIDO` | El `agenteId` no es un usuario con rol AGENTE activo |
| 409 | `VALIDADOR_ES_AGENTE` | El validador es quien registró la atención vigente |
| 409 | `CATEGORIA_DUPLICADA` | Ya existe una categoría con ese nombre en el área |
| 409 | `CATEGORIA_CON_CASOS` | Se intenta borrar una categoría que tiene casos |
| 500 | `ERROR_INTERNO` | Cualquier error no controlado (el mensaje no expone detalles internos) |

Orden de revisión en el backend, para que dos personas no devuelvan códigos distintos ante el mismo caso: 401 → 400 → 404 → 403 → 409.

## Valores fijos

- `tipo`: `INCIDENTE`, `SOLICITUD`
- `prioridad`: `P1`, `P2`, `P3`
- `estado`: `PENDIENTE`, `EN_ANALISIS`, `EN_ATENCION`, `EN_VALIDACION`, `CERRADA`
- `rol`: `SOLICITANTE`, `AGENTE`, `VALIDADOR`, `ADMINISTRADOR`

El frontend se encarga de mostrarlos con texto legible ("En análisis", "Solicitud de servicio"…).

## Endpoints

| Método | Ruta | Uso | Historia |
|---|---|---|---|
| GET | `/usuarios?rol=` | Usuarios de prueba activos (para el selector); `rol` filtra por rol | Base |
| GET | `/areas` | Áreas activas | HU-01 |
| GET | `/categorias?areaId=&activa=` | Categorías, filtrables por área | HU-01, HU-11 |
| POST | `/categorias` | Crear categoría | HU-11 |
| PUT | `/categorias/{id}` | Editar nombre/descripción | HU-11 |
| PATCH | `/categorias/{id}/activa` | Activar o desactivar | HU-11 |
| DELETE | `/categorias/{id}` | Borrar (solo si no tiene casos) | HU-11 |
| POST | `/casos` | Registrar caso | HU-01 |
| GET | `/casos` | Listar y filtrar casos | HU-02, HU-03, HU-09 |
| GET | `/casos/{id}` | Detalle con atenciones | HU-12 |
| PATCH | `/casos/{id}/clasificacion` | Cambiar tipo/categoría/prioridad | HU-05 |
| PATCH | `/casos/{id}/asignar` | Asignar agente | HU-04 |
| PATCH | `/casos/{id}/estado` | Cambiar estado | HU-05 |
| POST | `/casos/{id}/atencion` | Registrar diagnóstico y solución | HU-06 |
| POST | `/casos/{id}/validacion` | Aprobar o devolver | HU-07 |
| GET | `/casos/{id}/historial` | Historial del caso | HU-08 |
| GET | `/indicadores` | Indicadores del servicio | HU-10 |

### Categorías (HU-11)

Las cuatro rutas de escritura son solo para `ADMINISTRADOR`. `GET /categorias` sigue siendo público.

`GET /categorias` devuelve `{ id, areaId, nombre, descripcion, activa, totalCasos }`. `totalCasos` es el número de casos que usan la categoría (activos o cerrados); el front lo usa para saber si se puede borrar.

| Ruta | Body | Respuesta |
|---|---|---|
| `POST /categorias` | `{ "areaId": 2, "nombre": "Licencias", "descripcion": "…" }` (`descripcion` opcional) | `201` categoría creada, activa, con `totalCasos: 0` |
| `PUT /categorias/{id}` | `{ "nombre": "…", "descripcion": "…" }` | `200` categoría actualizada. No cambia el área (si hace falta, se crea otra). Si se omite `descripcion`, queda en `null` |
| `PATCH /categorias/{id}/activa` | `{ "activa": false }` | `200` categoría actualizada. Los casos que ya la usaban siguen mostrándola |
| `DELETE /categorias/{id}` | – | `204` |

Validaciones: `nombre` con `trim()` y entre 2 y 100 caracteres, `descripcion` de hasta 255, `areaId` entero positivo que exista.

| Situación | Respuesta |
|---|---|
| Nombre vacío o muy largo, `areaId` o `activa` inválidos | `400 VALIDACION` |
| `areaId` o categoría inexistente | `404 NO_ENCONTRADO` |
| No es `ADMINISTRADOR` | `403 ROL_NO_PERMITIDO` |
| Nombre repetido en el área, sin distinguir mayúsculas (`wi-fi` choca con `Wi-Fi`; en otra área sí se permite) | `409 CATEGORIA_DUPLICADA` |
| `DELETE` con casos asociados | `409 CATEGORIA_CON_CASOS` ("Tiene N casos; desactívala en vez de borrarla") |

### POST /casos

```json
{
  "tipo": "INCIDENTE",
  "titulo": "Sin Wi-Fi en bloque B",
  "descripcion": "Desde esta mañana no conecta a la red institucional en el segundo piso.",
  "prioridad": "P2",
  "areaId": 3,
  "categoriaId": 8
}
```

`areaId` se envía para que el backend compruebe que la categoría pertenece a esa área (RN-03). El solicitante es el de `X-Usuario-Id`, solo usuarios con rol SOLICITANTE pueden registrar. Respuesta `201` con el caso creado (estado `PENDIENTE`, `fechaCreacion` puesta por el servidor).

### Objeto Caso

```json
{
  "id": 7,
  "tipo": "INCIDENTE",
  "titulo": "Sin Wi-Fi en bloque B",
  "descripcion": "…",
  "prioridad": "P2",
  "estado": "EN_ATENCION",
  "solicitante": { "id": 1, "nombre": "Laura Méndez" },
  "agente": { "id": 3, "nombre": "Andrés Pérez" },
  "categoria": { "id": 8, "nombre": "Wi-Fi" },
  "area": { "id": 3, "nombre": "Red y conectividad" },
  "fechaCreacion": "2026-10-01T14:02:00Z",
  "fechaAsignacion": "2026-10-01T15:10:00Z",
  "fechaCierre": null
}
```

### GET /casos/{id}

Detalle de un caso: el objeto Caso más sus atenciones y la solución vigente. Requiere `X-Usuario-Id`. Un solicitante solo puede ver sus propios casos (RN-20); agente, validador y administrador ven cualquiera.

```json
{
  "id": 7,
  "…": "resto de campos del objeto Caso",
  "atenciones": [
    { "id": 12, "diagnostico": "El AP tenía el firmware desactualizado.", "solucion": "Se actualizó el firmware.",
      "fecha": "2026-10-02T10:30:00Z", "agente": { "id": 3, "nombre": "Andrés Pérez" } },
    { "id": 9, "diagnostico": "El AP del segundo piso estaba apagado.", "solucion": "Se reinició el AP.",
      "fecha": "2026-10-01T16:00:00Z", "agente": { "id": 3, "nombre": "Andrés Pérez" } }
  ],
  "solucionVigente": { "id": 12, "diagnostico": "…", "solucion": "…", "fecha": "2026-10-02T10:30:00Z", "agente": { "id": 3, "nombre": "Andrés Pérez" } }
}
```

- `atenciones`: de la más reciente a la más antigua (un caso tiene varias si fue devuelto). `[]` si no tiene.
- `solucionVigente`: la atención más reciente (la primera de `atenciones`), o `null` si no hay ninguna. Si el caso fue devuelto y aún no tiene una atención nueva, sigue siendo la devuelta; el historial muestra la devolución.

Errores: `400 VALIDACION` (id no numérico), `404 NO_ENCONTRADO`, `403 CASO_AJENO` (solicitante que no es dueño).

### GET /casos

Query params opcionales. Todos se combinan con Y lógico; si ningún caso coincide, la respuesta es `200 []`.

| Parámetro | Valores | Efecto |
|---|---|---|
| `estado` | Uno o varios separados por coma (`estado=PENDIENTE,EN_ANALISIS`) | Casos en alguno de esos estados |
| `tipo` | `INCIDENTE`, `SOLICITUD` (uno o ambos) | Casos de ese tipo |
| `prioridad` | `P1`, `P2`, `P3` (uno o varios: `prioridad=P1,P2`) | Casos con alguna de esas prioridades |
| `areaId` | Entero positivo | Casos cuya categoría pertenece a esa área |
| `categoriaId` | Entero positivo | Casos de esa categoría. Si no pertenece a `areaId`, la respuesta es `200 []` |
| `q` | Texto, máximo 180 caracteres | Busca en el título sin distinguir mayúsculas. Es literal: `wifi` no encuentra "Wi-Fi" |
| `solicitanteId` | Entero positivo | Casos de ese solicitante (ver RN-20 abajo) |
| `agenteId` | Entero positivo | Casos asignados a ese agente |
| `sinAgente` | `true` / `false` | `true`: solo casos sin agente (tiene prioridad sobre `agenteId`). `false` u omitido: sin filtro |
| `abiertos` | `true` / `false` | `true`: excluye los casos `CERRADA`. `false` u omitido: sin filtro |
| `orden` | `fecha_desc` (por defecto), `prioridad` | `fecha_desc`: más recientes primero. `prioridad`: P1 → P3 y, dentro de cada prioridad, el más antiguo primero (CP-13) |

`estado`, `tipo` y `prioridad` también se aceptan repetidos (`prioridad=P1&prioridad=P2`). Un parámetro vacío (`?areaId=`) se ignora.

Un valor que no pertenece a la lista, no es numérico o está fuera de rango responde `400 VALIDACION`, con el parámetro en `detalles[].campo`.

Pestañas de la bandeja del agente (HU-03):
- **Pendientes:** `GET /api/casos?abiertos=true&orden=prioridad`
- **Asignados a mí:** `GET /api/casos?abiertos=true&agenteId=<miId>&orden=prioridad`

Si el usuario actual es solicitante, el backend ignora `solicitanteId` y siempre filtra por él (RN-20); los demás filtros se aplican sobre sus casos.

### Rutas con `{id}`

En todas las rutas `/casos/{id}/…`, un `id` que no es un entero positivo responde `400 VALIDACION` con `detalles[].campo = "id"`, y un caso que no existe, `404 NO_ENCONTRADO`. Las tablas de errores de abajo no repiten estos dos casos ni el `401 USUARIO_REQUERIDO`.

### PATCH /casos/{id}/clasificacion

El agente corrige la clasificación mientras analiza el caso (HU-05, RN-08). Se envía solo lo que cambia; `areaId` y `categoriaId` van siempre juntos para poder comprobar que la categoría pertenece al área (RN-03).

```json
{ "prioridad": "P1" }
{ "tipo": "SOLICITUD", "areaId": 3, "categoriaId": 8 }
```

Responde `200` con el caso actualizado y crea un evento `RECLASIFICACION` cuyo `comentario` describe los cambios, separados por `; `: `prioridad: P3 → P1`, `tipo: INCIDENTE → SOLICITUD`, `categoría: Proyector (Hardware) → Wi-Fi (Red y conectividad)`. Si los valores enviados son los que el caso ya tiene, responde `200` con el caso sin crear evento.

| Situación | Respuesta |
|---|---|
| Body vacío, valores fuera de la lista, o `areaId` sin `categoriaId` (o al revés) | `400 VALIDACION` |
| No es `AGENTE` | `403 ROL_NO_PERMITIDO` |
| Caso `CERRADA` | `409 CASO_CERRADO` |
| Caso en un estado distinto de `PENDIENTE` o `EN_ANALISIS` | `409 ESTADO_NO_PERMITE_OPERACION` |
| La categoría no existe, está inactiva o no es del área enviada | `409 CATEGORIA_INVALIDA` |


### PATCH /casos/{id}/asignar

```json
{ "agenteId": 3 }
```

Si el agente se asigna a sí mismo, manda su propio id. Responde `200` con el caso actualizado (`agente` y `fechaAsignacion`) y crea un evento `ASIGNACION` con `comentario` `"Asignado a <nombre>"` o, si ya tenía agente, `"Reasignado de <anterior> a <nuevo>"`. La línea de tiempo del front lee ese texto. Asignar el agente que el caso ya tiene responde `200` sin evento y sin cambiar la fecha.

| Situación | Respuesta |
|---|---|
| Falta `agenteId` o no es un entero positivo | `400 VALIDACION` |
| No es `AGENTE` | `403 ROL_NO_PERMITIDO` |
| Caso `CERRADA` | `409 CASO_CERRADO` |
| Caso en un estado distinto de `PENDIENTE` o `EN_ANALISIS` (RN-19) | `409 ESTADO_NO_PERMITE_OPERACION` |
| `agenteId` no es un usuario activo con rol `AGENTE` (RN-18) | `409 AGENTE_INVALIDO` |

### PATCH /casos/{id}/estado

```json
{ "estado": "EN_ATENCION" }
```

Solo para `AGENTE`. Responde `200` con el caso actualizado y crea un evento `CAMBIO_ESTADO` con el estado anterior y el nuevo. Las únicas transiciones de esta ruta son `PENDIENTE → EN_ANALISIS → EN_ATENCION → EN_VALIDACION`; las salidas de `EN_VALIDACION` son de `POST /validacion`. La tabla vive en `src/domain/estados.ts` del backend.

| Situación | Respuesta |
|---|---|
| `estado` falta o no es uno de los cinco valores | `400 VALIDACION` |
| No es `AGENTE` | `403 ROL_NO_PERMITIDO` |
| Caso `CERRADA` (RN-10) | `409 CASO_CERRADO` |
| `estado: CERRADA`, saltarse un estado, retroceder, pedir el mismo estado o salir de `EN_VALIDACION` (RN-09, RN-14) | `409 TRANSICION_INVALIDA` |
| A `EN_ATENCION` sin agente asignado (RN-11) | `409 SIN_AGENTE_ASIGNADO` |
| A `EN_VALIDACION` sin una atención posterior a la última devolución (RN-13) | `409 SIN_SOLUCION` |

> Pendiente: la tabla de transiciones de [02-requisitos.md](02-requisitos.md) dice que `En análisis → En atención` y `En atención → En validación` las hace el **agente asignado**. Hoy el backend solo comprueba que el usuario sea `AGENTE`, no que sea el asignado.

### POST /casos/{id}/atencion

```json
{ "diagnostico": "El AP del segundo piso estaba apagado.", "solucion": "Se reinició el AP y se verificó conexión." }
```

Los dos campos son obligatorios, con mínimo 10 caracteres sin contar espacios al inicio y al final; se guardan recortados. Responde `201` con la atención creada y crea el evento `ATENCION`. El estado del caso no cambia: el agente lo envía después con `PATCH /estado` a `EN_VALIDACION`.

```json
{ "id": 3, "casoId": 14, "diagnostico": "…", "solucion": "…", "fecha": "2026-10-12T21:33:20Z", "agente": { "id": 3, "nombre": "Andrés Pérez" } }
```

| Situación | Respuesta |
|---|---|
| Falta un campo o tiene menos de 10 caracteres | `400 VALIDACION` (con `detalles[].campo` = `diagnostico` o `solucion`) |
| No es `AGENTE` | `403 ROL_NO_PERMITIDO` |
| Es agente pero no el asignado al caso (RN-12) | `403 NO_ES_AGENTE_ASIGNADO` |
| Caso `CERRADA` | `409 CASO_CERRADO` |
| Caso en un estado distinto de `EN_ATENCION` (RN-12) | `409 ESTADO_NO_PERMITE_OPERACION` |

### POST /casos/{id}/validacion

```json
{ "aprobado": false, "comentario": "El usuario sigue sin conexión en el aula 204." }
```

Solo para `VALIDADOR`. Responde `200` con el caso actualizado.

- `aprobado: true`: el caso pasa a `CERRADA`, se guarda `fechaCierre` y se crea el evento `APROBACION`. El `comentario` es opcional.
- `aprobado: false`: exige `comentario` de al menos 10 caracteres. El caso vuelve a `EN_ATENCION` con el mismo agente y se crea el evento `DEVOLUCION` con el comentario. Para volver a `EN_VALIDACION` el agente debe registrar una atención nueva; si no, `409 SIN_SOLUCION`.

| Situación | Respuesta |
|---|---|
| Falta `aprobado`, o devolución sin comentario válido | `400 VALIDACION` |
| El caso no existe | `404 NO_ENCONTRADO` |
| No es `VALIDADOR` | `403 ROL_NO_PERMITIDO` |
| Caso `CERRADA` | `409 CASO_CERRADO` |
| Caso en un estado distinto de `EN_VALIDACION` | `409 ESTADO_NO_PERMITE_OPERACION` |
| El validador registró la atención vigente | `409 VALIDADOR_ES_AGENTE` |

### GET /casos/{id}/historial

```json
[
  { "id": 20, "evento": "CAMBIO_ESTADO", "estadoAnterior": "EN_ANALISIS", "estadoNuevo": "EN_ATENCION",
    "usuario": { "id": 3, "nombre": "Andrés Pérez" }, "fecha": "2026-10-01T15:20:00Z", "comentario": null }
]
```

Eventos: `CREACION`, `RECLASIFICACION`, `ASIGNACION`, `CAMBIO_ESTADO`, `ATENCION`, `APROBACION`, `DEVOLUCION`.

Agente, validador y administrador ven el historial de cualquier caso; un solicitante solo el de sus casos, si no responde `403 CASO_AJENO` (RN-20). Igual que en `GET /casos/{id}`, el `404` se comprueba antes del `403`, para que un solicitante no pueda averiguar qué ids existen.

`comentario` trae el texto de la asignación (`"Asignado a …"`, `"Reasignado de … a …"`), el detalle de la reclasificación o el motivo de la devolución; en los demás eventos es `null`.

### GET /indicadores

Solo para `ADMINISTRADOR`. Acepta los filtros opcionales `desde` y `hasta` (`YYYY-MM-DD`), que filtran por `fechaCreacion` e incluyen ambos días.

```json
{
  "total": 42,
  "porEstado": { "PENDIENTE": 5, "EN_ANALISIS": 3, "EN_ATENCION": 6, "EN_VALIDACION": 2, "CERRADA": 26 },
  "porTipo": { "INCIDENTE": 30, "SOLICITUD": 12 },
  "porPrioridad": { "P1": 8, "P2": 25, "P3": 9 },
  "porArea": [
    { "areaId": 1, "area": "Hardware", "cantidad": 9 },
    { "areaId": 3, "area": "Red y conectividad", "cantidad": 15 }
  ],
  "promedioHorasHastaAsignacion": 3.4,
  "promedioHorasResolucion": 27.8,
  "devoluciones": 4
}
```

- `porEstado`, `porTipo` y `porPrioridad` traen siempre todas las llaves del enum, en 0 si no hay casos.
- `porArea` trae las 5 áreas, ordenadas por `areaId`, aunque tengan 0 casos. El ejemplo muestra solo dos.
- `promedioHorasHastaAsignacion`: promedio de `fechaAsignacion − fechaCreacion` de los casos con agente, en horas con 1 decimal. `null` si no hay ninguno.
- `promedioHorasResolucion`: promedio de `fechaCierre − fechaCreacion` de los casos `CERRADA`, en horas con 1 decimal. `null` si no hay ninguno.
- `devoluciones`: número de eventos `DEVOLUCION` del rango. Se filtra por la fecha del evento, no por la creación del caso.
- Los días se toman en UTC: `desde` empieza a las `00:00:00Z` y `hasta` termina a las `23:59:59.999Z`.

Errores: `400 VALIDACION` (fecha con otro formato o inexistente, parámetro repetido, o `desde` posterior a `hasta`) y `403 ROL_NO_PERMITIDO` (no es administrador).
