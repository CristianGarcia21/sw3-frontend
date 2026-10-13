# Reglas para asistentes de IA

Frontend de CampusHelp: React 19, TypeScript, Vite, React Router, Tailwind CSS 4, oxlint. El código, los nombres y los textos van en español.

Antes de escribir interfaz, lee [docs/08-diseno.md](docs/08-diseno.md). Antes de tocar reglas de negocio o llamadas a la API, lee [docs/02-requisitos.md](docs/02-requisitos.md) y [docs/03-api.md](docs/03-api.md).

## Diseño (obligatorio)

El estilo es Liquid Glass con la paleta Océano. Los tokens están en `src/index.css` y los componentes en `src/components/ui/`. La galería `/componentes` (`src/pages/Componentes.tsx`) muestra cada uno en uso.

Haz esto:

- Importa los controles de `src/components/ui`: `Boton`, `CampoTexto`, `CampoArea`, `Campo`, `ListaDesplegable`, `FiltroMultiple`, `Segmentado`, `Interruptor`, `Modal`, `Confirmacion`, `Tarjeta`, `EstadoVacio`, `Esqueleto`, `Icono`.
- Usa los colores como clases de token: `bg-fondo`, `bg-superficie`, `text-texto`, `text-texto-suave`, `border-linea`, `bg-acento`, `text-acento`, `text-sobre-acento`, `bg-tinte`, `bg-relleno`, `bg-relleno-fuerte`, `text-urgente`, `text-estado-*`.
- Pon el contenido (tablas, formularios, textos) en `<Tarjeta>`.
- Cuenta el resultado de una acción con `useAvisos()`: `avisos.exito(titulo, texto)`, `avisos.error(titulo, e.mensaje)`.
- Muestra los errores de validación debajo de cada campo con la prop `error`. Valida al salir del campo.
- Muestra estados y prioridades con `<EstadoBadge>` y `<PrioridadBadge>`, y sus textos con `src/utils/etiquetas.ts`.
- Cubre los tres estados de toda pantalla que carga datos: cargando (`Esqueleto` o `Cargando`), error (`Mensaje` con reintentar) y vacío (`EstadoVacio`).
- Usa radios `rounded-campo`, `rounded-tarjeta`, `rounded-hoja` o `rounded-full`, y la curva `ease-resorte` en transiciones.

No hagas esto:

- No uses colores de la paleta de Tailwind (`slate`, `sky`, `red`, `emerald`…) ni colores hexadecimales en las pantallas.
- No uses `<select>`, `alert()`, `confirm()` ni `prompt()`.
- No uses degradados (`bg-gradient-*`, `bg-linear-*`, `linear-gradient`).
- No pongas `vidrio` en tarjetas, tablas ni formularios, ni un vidrio dentro de otro. El vidrio es solo para navegación, barras flotantes, menús, modales y avisos.
- No pongas más de un botón `primario` por pantalla o modal.
- No pidas confirmación para acciones que se pueden deshacer. `Confirmacion` es solo para lo irreversible.
- No muestres valores de enum (`EN_ATENCION`) en pantalla.
- No crees un componente de interfaz dentro de una página si es reutilizable: va en `src/components/ui/` y se agrega a la galería y a la guía.
- No agregues librerías. Se acuerdan en la Daily.

## Código

- Sigue el estilo existente: sin punto y coma, comillas simples, componentes como funciones con `export function`, props en una `interface Props`.
- Las llamadas a la API van en `src/api/` y usan `api()` de `src/api/client.ts`. Los errores llegan como `ApiError` con `error` (código), `mensaje` y `detalleDe(campo)`.
- Las rutas salen de `RUTAS` en `src/utils/navegacion.ts`.
- Antes de terminar, corre `npm run build` y `npm run lint`. Deben pasar sin advertencias.
- Revisa la pantalla en tema claro y oscuro.
