# Requisitos de CampusHelp

## Problema

La Dirección de Tecnologías recibe fallas y peticiones por varios canales y no tiene una vista centralizada. CampusHelp debe registrar cada caso, clasificarlo, priorizarlo, asignarlo, atenderlo, validarlo, cerrarlo y guardar su historial, además de dar indicadores del servicio.

Fuera de alcance: soporte médico, mantenimiento locativo, procesos académicos administrativos, soporte de equipos personales fuera de las políticas y cualquier integración real con WhatsApp, correo u otros sistemas.

## Actores

| Actor | Qué hace en el sistema | Historias |
|---|---|---|
| Solicitante | Registra casos y consulta los suyos, con su detalle y solución | HU-01, HU-02, HU-12 |
| Agente de soporte | Ve la bandeja, se asigna casos, cambia estados, registra diagnóstico y solución | HU-03, HU-04, HU-05, HU-06 |
| Validador | Revisa la solución y aprueba (cierra) o devuelve el caso | HU-07 |
| Administrador | Gestiona categorías, filtra casos y consulta indicadores | HU-09, HU-10, HU-11 |
| Usuario autorizado | Agente, validador o administrador que consulta el historial | HU-08 |

No hay autenticación real (el taller lo permite). El frontend tiene un selector de "usuario de prueba" y envía su id al backend en la cabecera `X-Usuario-Id`. El backend usa ese id para aplicar las reglas por rol.

### Usuarios de prueba (datos semilla)

| Nombre | Rol |
|---|---|
| Laura Méndez | Solicitante (estudiante) |
| Carlos Ruiz | Solicitante (docente) |
| Andrés Pérez | Agente |
| Marta Gómez | Agente |
| Sofía Rojas | Validador |
| Admin TI | Administrador |

Son personas ficticias creadas para las pruebas.

## Clasificación

**Tipos de caso**

| Tipo | Definición | Ejemplo |
|---|---|---|
| Incidente | Interrupción o degradación de un servicio tecnológico | "No puedo conectarme al Wi-Fi institucional." |
| Solicitud de servicio | Petición de una acción o servicio tecnológico | "Necesito que instalen Visual Studio en mi equipo institucional." |

**Áreas y categorías iniciales (datos semilla)**

| Área | Categorías |
|---|---|
| Hardware | Computador, Periférico, Proyector, Impresora |
| Software | Instalación, Error de aplicación, Actualización |
| Red y conectividad | Wi-Fi, Internet, Red cableada |
| Cuentas y acceso | Contraseña, Bloqueo de cuenta, Correo institucional, Permisos |
| Plataformas académicas | Campus virtual, Sistema académico |

Las áreas son fijas (las cinco del enunciado). Las categorías las administra el administrador (HU-11).

**Prioridades:** P1 urgente, P2 normal, P3 baja.

## Reglas de negocio

Cada regla tiene un código para poder rastrearla en historias, pruebas y código.

### Registro y clasificación

| Código | Regla |
|---|---|
| RN-01 | Todo caso es `Incidente` o `Solicitud de servicio`. Es obligatorio. |
| RN-02 | Todo caso pertenece a una de las cinco áreas. Es obligatoria. |
| RN-03 | La categoría es obligatoria, debe estar activa y pertenecer al área elegida. |
| RN-04 | El título es obligatorio, entre 5 y 180 caracteres. |
| RN-05 | La descripción es obligatoria, con mínimo 10 caracteres (sin contar espacios al inicio y al final). |
| RN-06 | La prioridad es obligatoria y solo puede ser P1, P2 o P3. |
| RN-07 | La fecha de creación la pone el sistema. Todo caso nuevo queda en estado `Pendiente` y sin agente. |
| RN-08 | El agente puede cambiar tipo, categoría o prioridad solo mientras el caso está en `Pendiente` o `En análisis`. Cada cambio queda en el historial. |

### Estados y transiciones

```
Pendiente → En análisis → En atención → En validación → Cerrada
                               ↑               │
                               └── devuelto ───┘
```

| Desde | Hacia | Quién | Condición |
|---|---|---|---|
| Pendiente | En análisis | Agente | – |
| En análisis | En atención | Agente asignado | El caso tiene agente asignado (RN-11) |
| En atención | En validación | Agente asignado | Existe una atención con solución registrada (RN-13) |
| En validación | Cerrada | Validador | Aprueba la solución (RN-14) |
| En validación | En atención | Validador | Devuelve la solución con comentario (RN-15) |

| Código | Regla |
|---|---|
| RN-09 | Cualquier transición que no esté en la tabla se rechaza, incluido saltarse estados o retroceder. |
| RN-10 | `Cerrada` es un estado final: el caso ya no se puede modificar desde la operación normal. |
| RN-11 | Para pasar a `En atención` el caso debe tener agente asignado. |
| RN-12 | Solo el agente asignado al caso puede registrar diagnóstico y solución, y solo si el caso está `En atención`. |
| RN-13 | Para pasar a `En validación` debe existir al menos una atención con solución. |
| RN-14 | Un caso solo se cierra cuando el validador aprueba. Al cerrar se guarda `fecha_cierre`. |
| RN-15 | Para devolver un caso el validador escribe un comentario de mínimo 10 caracteres. El caso vuelve a `En atención` con el mismo agente. |
| RN-16 | El validador no puede ser la misma persona que atendió el caso. |
| RN-17 | Todo cambio de estado, asignación, reclasificación, atención y validación genera un evento de historial con estado anterior, estado nuevo, usuario y fecha. |

### Asignación, consulta y administración

| Código | Regla |
|---|---|
| RN-18 | Solo se asignan usuarios con rol Agente y activos. La asignación guarda el agente y `fecha_asignacion`. |
| RN-19 | Un caso se puede asignar o reasignar solo en `Pendiente` o `En análisis`. |
| RN-20 | Un solicitante solo ve sus propios casos. |
| RN-21 | Una categoría con casos no se borra; se desactiva. Las inactivas no aparecen al registrar, pero los casos viejos la conservan. |
| RN-22 | No puede haber dos categorías con el mismo nombre dentro de la misma área. |

## Ambigüedades encontradas y decisión tomada

Parte de refinar el backlog fue detectar cosas que el enunciado no deja claras. Estas son las decisiones, aprobadas por el PO:

1. **¿Quién clasifica y prioriza?** El enunciado pone "Clasificar → Priorizar" como pasos del flujo, pero el registro ya pide tipo, categoría y prioridad. Decidimos que el solicitante propone la clasificación al registrar y el agente la confirma o corrige en `En análisis` (RN-08).
2. **¿Cuándo se asigna?** La asignación no es un estado. Se permite en `Pendiente` o `En análisis`, y es obligatoria para pasar a `En atención` (RN-11, RN-19).
3. **"Cerrada sin solución cuando el tipo lo requiera".** Para no depender de una regla por tipo que nadie definió, todo caso necesita solución antes de ir a validación (RN-13). Como solo se cierra desde validación, ningún caso se cierra sin solución.
4. **¿Se puede cerrar con el cambio de estado normal?** No. `PATCH /estado` no acepta `Cerrada`; eso solo pasa al aprobar en validación (RN-14).
5. **¿Dónde queda el motivo de una devolución?** Agregamos el campo `comentario` al historial (ver modelo de datos).
6. **¿Qué pasa si el caso se devuelve varias veces?** Se permiten varias atenciones por caso. La solución vigente es la más reciente.
7. **"Tiempos de atención" en indicadores.** Se calculan dos: tiempo hasta asignación (`fecha_asignacion - fecha_creacion`) y tiempo de resolución (`fecha_cierre - fecha_creacion`), en horas, promediados.
8. **"Usuario autorizado" en HU-08.** Agente, validador y administrador ven el historial de cualquier caso. El solicitante lo ve solo en sus casos (dentro del detalle, HU-12).
9. **Expedite del tablero vs. prioridad P1 de los casos.** Son cosas distintas. P1 es un dato del caso en la app; Expedite es una política del tablero del equipo.

## Modelo de datos

El taller trae un script en MySQL (`docs/recursos/schema_CampusHelp.sql`). El backend del equipo ya estaba montado con Prisma y PostgreSQL, así que el modelo se implementa como esquema de Prisma manteniendo todos los campos mínimos.

| Entidad | Campos | Notas |
|---|---|---|
| Usuario | id, nombre, correo, rol, activo | `correo` único. `rol` es enum: SOLICITANTE, AGENTE, VALIDADOR, ADMINISTRADOR |
| Area | id, nombre, descripcion, activa | Las cinco áreas vienen en el seed |
| Categoria | id, area_id, nombre, descripcion, activa | Único (area_id, nombre) por RN-22 |
| Caso | id, tipo, titulo, descripcion, prioridad, estado, usuario_id, categoria_id, agente_id, fecha_creacion, fecha_asignacion, fecha_cierre | `tipo`, `prioridad` y `estado` como enums. El área se obtiene por la categoría |
| Atencion | id, caso_id, diagnostico, solucion, fecha, agente_id | Relación 1..n con Caso (por las devoluciones) |
| Historial | id, caso_id, evento, estado_anterior, estado_nuevo, usuario_id, fecha, **comentario** | `comentario` es el campo agregado |

Decisiones de diseño:

- **Enums en vez de texto libre** para tipo, prioridad, estado y rol. Así la base de datos misma rechaza valores inválidos (RN-01, RN-06).
- **El caso no guarda `area_id`.** Se saca de la categoría para que no haya un caso con área y categoría que no coinciden (RN-03).
- **`historial.comentario`** (texto, opcional) guarda el motivo de devolución y el detalle de reclasificaciones.
- **Índices** en `caso.estado`, `caso.usuario_id`, `caso.agente_id` y `historial.caso_id` porque son los filtros que más se usan.

```
Usuario 1──n Caso (solicitante)      Area 1──n Categoria 1──n Caso
Usuario 1──n Caso (agente)           Caso 1──n Atencion n──1 Usuario (agente)
Caso 1──n Historial n──1 Usuario
```
