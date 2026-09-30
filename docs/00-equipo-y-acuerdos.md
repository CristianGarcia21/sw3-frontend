# Equipo y acuerdos de trabajo

## Product Goal

Tener un MVP de CampusHelp donde un caso de soporte tecnológico (incidente o solicitud de servicio) se pueda registrar, clasificar, priorizar, asignar, atender, validar y cerrar, con historial de todo lo que pasó, datos guardados en base de datos e indicadores calculados sobre esos datos.

## Roles

| Integrante | Rol | Responsabilidades en el proyecto |
|---|---|---|
| Juan José | Desarrollo Backend | API REST en `sw3-backend`, reglas de negocio, transiciones de estado, historial |
| Cristian García | Desarrollo Frontend | Estructura del front, cliente de la API, pantallas del solicitante y del agente |
| Valentina Galvis | Desarrollo Frontend | Pantallas de validación, historial, filtros, indicadores y administración de categorías |
| Tania Botina | Scrum Master + apoyo Backend/BD | Facilita los eventos, cuida los límites WIP y los bloqueos del tablero. Modelo Prisma, migraciones y datos semilla |
| Juan Fernando | Product Owner + documentación | Ordena y refina el backlog, acepta las historias, lleva el registro de métricas y la documentación |
| Juan Diego | QA / Pruebas | Diseña y ejecuta los casos de prueba, registra defectos y verifica criterios de aceptación |

Los roles de Tania, Juan Fernando y Juan Diego salieron de un sorteo. Juan José, Cristian y Valentina tenían su rol definido desde el inicio.

Tener un rol no significa trabajar solo en eso. Si una columna del tablero llega a su límite WIP, cualquiera ayuda a sacar trabajo de ahí (por ejemplo, un desarrollador puede ejecutar pruebas para liberar "En validación").

## Cadencia

| Sprint | Fechas | Objetivo |
|---|---|---|
| Sprint 1 | 30 sep – 6 oct 2026 | Flujo básico de registro y consulta |
| Sprint 2 | 7 oct – 13 oct 2026 | Asignación, atención, validación e historial |
| Sprint 3 | 14 oct – 20 oct 2026 | Filtros, indicadores, categorías y detalle |

Si el docente fija otras fechas, se cambian aquí y en el campo `Sprint` del tablero.

| Evento | Cuándo | Duración | Quién facilita |
|---|---|---|---|
| Sprint Planning | Primer día del sprint | 45 min | Tania (SM), Juan Fernando presenta el backlog |
| Daily | Todos los días (puede ser por WhatsApp/Meet si no coincidimos) | 10–15 min | Tania |
| Refinement | A mitad de sprint | 30 min | Juan Fernando |
| Sprint Review | Último día del sprint | 30 min | Juan Fernando, demo de quien desarrolló |
| Retrospective | Después de la Review | 30 min | Tania |

En la Daily se mira el tablero de derecha a izquierda: primero lo que está cerca de Done, luego lo bloqueado y al final lo que se podría empezar.

## Acuerdos

- Nada se empieza si no está en Ready.
- Toda tarea que se empieza se mueve en el tablero ese mismo día, y quien la mueve llena la fecha correspondiente (ver [07-metricas.md](07-metricas.md)).
- Una rama por tarea: `feature/HU-XX-descripcion-corta` o `fix/DEF-XX`. Los commits mencionan la issue (`HU-01: formulario de registro (#12)`).
- Todo PR lo revisa al menos otra persona antes de hacer merge a `main`.
- Si alguien está bloqueado más de medio día, lo dice en el grupo y marca la issue con la etiqueta `bloqueado` con el motivo en un comentario.
- Los defectos se registran como issue con la etiqueta `defecto`, nunca solo por chat.
