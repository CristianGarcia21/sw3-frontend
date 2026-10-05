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
- React Router (rutas)
- Tailwind CSS (estilos), con el sistema de diseño propio descrito en [docs/08-diseno.md](docs/08-diseno.md)
- Recharts (gráficos de indicadores)
- `fetch` envuelto en `src/api/client.ts` para llamar a la API, sin librerías extra
- oxlint
- Consume la API REST de `sw3-backend`

Los formularios usan estado de React y validación propia (son pocos campos). No se agregan otras librerías sin acordarlo en la Daily, para que todos trabajen igual.

### Rutas de la aplicación

| Ruta | Pantalla | Rol |
|---|---|---|
| `/` | Redirige según el rol del usuario de prueba | Todos |
| `/casos/nuevo` | Registrar caso (HU-01) | Solicitante |
| `/mis-casos` | Mis casos (HU-02) | Solicitante |
| `/mis-casos/:id` | Detalle de mi caso y solución (HU-12) | Solicitante |
| `/bandeja` | Bandeja de casos con filtros (HU-03, HU-09) | Agente, Administrador |
| `/casos/:id` | Detalle con acciones, atención, validación e historial (HU-04 a HU-08) | Agente, Validador, Administrador |
| `/validacion` | Casos por validar (HU-07) | Validador |
| `/admin/indicadores` | Indicadores (HU-10) | Administrador |
| `/admin/categorias` | Administrar categorías (HU-11) | Administrador |
| `/componentes` | Galería del sistema de diseño (no sale en el menú ni necesita backend) | Todos |

## Cómo ejecutarlo

Requisitos: Node.js 24 o superior y el backend corriendo (ver el README de `CampusHelp-backend`).

```bash
git clone https://github.com/CristianGarcia21/sw3-frontend.git
cd sw3-frontend
npm install
cp .env.example .env      # ajustar VITE_API_URL si el backend no está en el puerto 3000
npm run dev
```

La app queda disponible en http://localhost:5173. En el backend hay que agregar ese origen en `ALLOWED_ORIGINS`, si no el navegador bloquea las peticiones por CORS.

### Levantar todo el proyecto (Backend + Frontend juntos)

Para levantar el sistema completo desde cero, sigue este orden secuencial:

1. **Base de datos (PostgreSQL):**
   ```bash
   cd ../CampusHelp-backend
   docker compose up -d postgres
   ```
2. **Backend (Configuración, Migración y Seed):**
   ```bash
   cp .env.example .env
   npm install
   npx prisma db migrate   # crea las tablas y enums en PostgreSQL
   npm run seed            # inserta las 5 áreas, 16 categorías y 7 usuarios de prueba
   npm run dev             # queda escuchando en http://localhost:3000/api
   ```
3. **Frontend:**
   En otra terminal:
   ```bash
   cd ../sw3-frontend
   cp .env.example .env    # verifica VITE_API_URL="http://localhost:3000/api"
   npm install
   npm run dev             # queda disponible en http://localhost:5173
   ```
4. **Abrir navegador:** Ingresa a http://localhost:5173 y selecciona un usuario de prueba en la barra superior.

### Problemas comunes y soluciones

- **CORS (`Cross-Origin Request Blocked`):**
  Asegúrate de que en el archivo `.env` del backend esté configurado `ALLOWED_ORIGINS="http://localhost:5173"`. Si cambiaste de puerto en el front, agrégalo a esa variable y reinicia el backend.
- **Puerto 5173 o 3000 ocupado (`EADDRINUSE`):**
  Identifica qué proceso lo está ocupando con `lsof -i :5173` y ciérralo con `kill -9 <PID>`, o cambia el puerto en la configuración.
- **Selector de usuarios vacío o error 401 `USUARIO_REQUERIDO`:**
  Ocurre cuando no se han cargado los usuarios de prueba en la base de datos. En el backend, corre `npm run seed`.
- **Error `relation "caso" does not exist` al hacer peticiones:**
  Falta ejecutar la migración inicial de la base de datos. En el backend, ejecuta `npx prisma db migrate`.

### Scripts

- `npm run dev`: servidor de desarrollo con Vite.
- `npm run build`: compila TypeScript y genera `dist/`.
- `npm run lint`: revisa el código con oxlint.
- `npm run preview`: sirve la versión compilada.

## Estructura

```
src/
  api/         cliente HTTP y llamadas a sw3-backend
  components/  componentes reutilizables
    ui/        componentes genéricos del sistema de diseño (botones, campos, listas, modales…)
  pages/       pantallas (registro, bandeja, detalle, validación, indicadores…)
  context/     proveedores de estado global (usuario de prueba, tema, avisos)
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
| [08-diseno](docs/08-diseno.md) | Guía de diseño: colores, vidrio, componentes y reglas para que todas las pantallas se vean igual |
| [sprints/](docs/sprints/) | Planning, Review y Retrospectiva de cada sprint |
| [recursos/](docs/recursos/) | Material entregado por el docente |

## Diseño y trabajo con IA

Las pantallas siguen la [guía de diseño](docs/08-diseno.md). Los componentes genéricos se ven funcionando en `/componentes`.

Si programas con un asistente de IA, las reglas del proyecto están en [AGENTS.md](AGENTS.md) y la mayoría de herramientas las leen solas. La skill `apple-design` está en `.agents/skills/`.

## Tablero ScrumBan

El tablero está en la pestaña **Projects** de este repositorio. Cada historia es una issue con la etiqueta `historia`, y sus tareas técnicas están como sub-issues. La forma de usarlo está en [docs/01-scrumban.md](docs/01-scrumban.md).
