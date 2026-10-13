# Indicadores del servicio (para la presentación)

Diapositiva de HU-10. El detalle de cada fórmula está en [03-api.md](03-api.md), sección "Cómo se calcula".

## Diapositiva: ¿Cómo se calculan los indicadores?

Los calcula el backend con consultas agregadas sobre los casos reales. Solo los ve el administrador (`/admin/indicadores`) y se pueden filtrar por fecha de creación.

| Indicador | Cómo se calcula | Qué casos entran |
|---|---|---|
| Total, por estado, por tipo, por prioridad, por área | Conteo de casos | Todos los del rango |
| Tiempo hasta asignación | Promedio de (asignación − creación), en horas | Solo los casos ya asignados |
| Tiempo de resolución | Promedio de (cierre − creación), en horas | Solo los casos cerrados |
| Devoluciones | Eventos `DEVOLUCION` del historial | Los del rango, por fecha del evento |

Sin datos, los conteos son 0 y los promedios muestran "sin datos" (`null` en la API).

**Ejemplo con 5 casos:** dos cerrados con 10 h y 20 h de resolución → promedio de resolución **(10 + 20) / 2 = 15 h**. Cuatro casos asignados tras 2, 6, 1 y 3 h → tiempo hasta asignación **12 / 4 = 3 h**. El caso pendiente no tiene asignación y no entra en ese promedio.

**Una frase para no confundirse:** los indicadores del producto miden cuánto tardan los **casos de soporte**; el Lead y el Cycle Time de [07-metricas.md](07-metricas.md) miden cuánto tardó el **equipo** en terminar sus historias.

## Cómo reproducir el ejemplo en la demo

1. Crear los 5 casos de la tabla del ejemplo de [03-api.md](03-api.md) (o los de la demo) y llevarlos a los estados indicados.
2. Ajustar `fecha_creacion`, `fecha_asignacion` y `fecha_cierre` en la base de datos para que las diferencias sean las de la tabla (es lo mismo que pide CP-20).
3. Entrar como Admin TI, abrir `/admin/indicadores` y comprobar: total 5, resolución 15 h, hasta asignación 3 h.

Los números del ejemplo se comprobaron contra el endpoint real y contra un cálculo a mano en SQL. Si la demo usa otros casos, hay que cambiar estos números por los de la demo.
