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
| GET | `/usuarios` | Lista de usuarios de prueba (para el selector) | Base |
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

`GET /casos/{id}` agrega `atenciones: [{ id, diagnostico, solucion, fecha, agente }]` ordenadas de la más reciente a la más antigua.

### GET /casos

Query params opcionales y combinables: `estado`, `tipo`, `areaId`, `categoriaId`, `prioridad`, `solicitanteId`, `agenteId`, `q` (texto en título), `orden` (`fecha_desc` por defecto, `prioridad`).

Si el usuario actual es solicitante, el backend ignora `solicitanteId` y siempre filtra por él (RN-20).

### PATCH /casos/{id}/asignar

```json
{ "agenteId": 3 }
```

Si el agente se asigna a sí mismo, manda su propio id.

### PATCH /casos/{id}/estado

```json
{ "estado": "EN_ATENCION" }
```

No acepta `CERRADA`. Devuelve `409` si la transición no está permitida.

### POST /casos/{id}/atencion

```json
{ "diagnostico": "El AP del segundo piso estaba apagado.", "solucion": "Se reinició el AP y se verificó conexión." }
```

### POST /casos/{id}/validacion

```json
{ "aprobado": false, "comentario": "El usuario sigue sin conexión en el aula 204." }
```

`aprobado: true` cierra el caso. `aprobado: false` exige `comentario` y lo devuelve a `EN_ATENCION`.

### GET /casos/{id}/historial

```json
[
  { "id": 20, "evento": "CAMBIO_ESTADO", "estadoAnterior": "EN_ANALISIS", "estadoNuevo": "EN_ATENCION",
    "usuario": { "id": 3, "nombre": "Andrés Pérez" }, "fecha": "2026-10-01T15:20:00Z", "comentario": null }
]
```

Eventos: `CREACION`, `RECLASIFICACION`, `ASIGNACION`, `CAMBIO_ESTADO`, `ATENCION`, `APROBACION`, `DEVOLUCION`.

### GET /indicadores

Acepta los mismos filtros de fecha `desde` y `hasta` (opcionales).

```json
{
  "total": 42,
  "porEstado": { "PENDIENTE": 5, "EN_ANALISIS": 3, "EN_ATENCION": 6, "EN_VALIDACION": 2, "CERRADA": 26 },
  "porTipo": { "INCIDENTE": 30, "SOLICITUD": 12 },
  "porPrioridad": { "P1": 8, "P2": 25, "P3": 9 },
  "porArea": [{ "area": "Red y conectividad", "cantidad": 15 }],
  "promedioHorasHastaAsignacion": 3.4,
  "promedioHorasResolucion": 27.8,
  "devoluciones": 4
}
```
