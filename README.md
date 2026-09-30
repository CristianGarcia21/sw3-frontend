# CampusHelp – Frontend (sw3-frontend)

Aplicación web para gestionar incidentes y solicitudes de servicios tecnológicos de la universidad. Es el proyecto del Taller ScrumBan de Ingeniería de Software III (2026-2).

Este repositorio tiene el frontend en React y también el tablero ScrumBan (GitHub Projects), las issues del backlog y la documentación del taller. El backend vive en el repositorio `sw3-backend` (Express 5 + TypeScript + Prisma + PostgreSQL).

## Equipo

| Integrante | Desarrollo | Rol adicional |
|---|---|---|
| Juan José | Backend | – |
| Tania Botina | Backend / BD | Scrum Master |
| Juan Fernando | Backend | Product Owner (documentación y métricas) |
| Cristian García | Frontend | – |
| Valentina Galvis | Frontend | – |
| Juan Diego | Frontend | QA / Pruebas |

Los seis desarrollan. Los roles adicionales de Tania, Juan Fernando y Juan Diego se asignaron por sorteo. Los sprints son simulados: tres sprints en cinco días (29 sep – 3 oct). El detalle está en [docs/00-equipo-y-acuerdos.md](docs/00-equipo-y-acuerdos.md).

## Tecnologías

- React 19 + TypeScript
- Vite
- oxlint
- Consume la API REST de `sw3-backend`

## Cómo ejecutarlo

Requisitos: Node.js 24 o superior y el backend corriendo (ver el README de `sw3-backend`).

```bash
git clone https://github.com/CristianGarcia21/sw3-frontend.git
cd sw3-frontend
npm install
cp .env.example .env      # ajustar VITE_API_URL si el backend no está en el puerto 3000
npm run dev
```

La app queda en http://localhost:5173. En el backend hay que agregar ese origen en `ALLOWED_ORIGINS`, si no el navegador bloquea las peticiones por CORS.

### Scripts

- `npm run dev`: servidor de desarrollo.
- `npm run build`: compila TypeScript y genera `dist/`.
- `npm run lint`: revisa el código con oxlint.
- `npm run preview`: sirve la versión compilada.

## Estructura

```
src/
  api/         cliente HTTP y llamadas a sw3-backend
  components/  componentes reutilizables
  pages/       pantallas (registro, bandeja, detalle, validación, indicadores…)
  hooks/       hooks propios
  types/       tipos compartidos (Caso, Usuario, Categoria…)
docs/          documentación del taller (requisitos, backlog, pruebas, métricas, sprints)
```

## Documentación del taller

| Documento | Contenido |
|---|---|
| [00-equipo-y-acuerdos](docs/00-equipo-y-acuerdos.md) | Product Goal, roles, acuerdos de trabajo |
| [01-scrumban](docs/01-scrumban.md) | Tablero, límites WIP, políticas, DoR, DoD, respuesta a eventos |
| [02-requisitos](docs/02-requisitos.md) | Actores, reglas de negocio, estados, modelo de datos, ambigüedades resueltas |
| [03-api](docs/03-api.md) | Contrato entre frontend y backend |
| [04-backlog](docs/04-backlog.md) | Product Backlog y plan de sprints |
| [backlog/](docs/backlog/) | Ficha de cada historia (HU-01 a HU-12) |
| [05-trazabilidad](docs/05-trazabilidad.md) | Historia ↔ reglas ↔ pruebas ↔ endpoints ↔ pantallas |
| [06-pruebas](docs/06-pruebas.md) | Casos de prueba, resultados y registro de defectos |
| [07-metricas](docs/07-metricas.md) | Cómo registramos WIP, Throughput, Lead/Cycle Time, defectos y bloqueos |
| [sprints/](docs/sprints/) | Planning, Review y Retrospectiva de cada sprint |
| [recursos/](docs/recursos/) | Material entregado por el docente |

## Tablero ScrumBan

El tablero está en la pestaña **Projects** de este repositorio. Cada historia es una issue con la etiqueta `historia`, y sus tareas técnicas están como sub-issues. La forma de usarlo está en [docs/01-scrumban.md](docs/01-scrumban.md).
