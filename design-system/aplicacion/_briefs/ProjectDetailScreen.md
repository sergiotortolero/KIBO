# Detalle de proyecto de ahorro

- **Artboard:** `ProjectDetailScreen.dc.html`
- **Módulo:** Finanzas
- **Origen:** `finanzas-screens.jsx` líneas 1357-1444
- **Propósito:** Pantalla completa de un proyecto de ahorro: cuánto llevas, cuánto falta, a qué ritmo, cuándo lo logras, en qué cuenta vive el dinero y qué aportes lo han alimentado.

## Secciones, de arriba abajo

- Page head con 'Volver a Finanzas', eyebrow 'AHORRO · PROYECTO', nombre, descripción, y acciones 'Aportar' (primary) y 'Editar' (ghost) [1365-1378]
- Hero: ACUMULADO + barra de progreso y '% de $meta'; FALTAN (con 'N meses al ritmo actual'); APORTE MENSUAL comprometido; META PROYECCIÓN (fecha si mantienes el aporte) [1380-1404]
- Card 'CUENTA VINCULADA' (solo si hay cuenta): nombre, y si la cuenta tiene CAT, cuánto gana el ahorro al mes; botón 'Ver cuenta' [1406-1422]
- Grid final: 'Evolución del ahorro' (Sparkline de 7 meses del history) y 'Aportes recientes' (TxList o EmptyState) [1424-1441]

## Estados que debe mostrar

- Con cuenta vinculada vs sin cuenta (la card completa no se pinta) [1406]
- Cuenta vinculada con CAT >0 → línea de rendimiento del ahorro; sin CAT → línea vacía [1415]
- Sin aportes detectados → EmptyState 'Sin aportes' / 'Etiqueta un movimiento con este proyecto y aparecerá aquí.' [1437-1438]
- Aporte mensual 0 → meses restantes '—' [1360]

## Comportamientos que hay que representar

- Volver a Finanzas [1367-1369]
- 'Aportar', 'Editar' y 'Ver cuenta' (botones presentes, sin handler) [1375-1376, 1417-1419]
- Los aportes se detectan por coincidencia de texto: se filtran los movimientos cuyas notas contienen la primera palabra del nombre del proyecto [1361]

## Lee de

- project (name, desc, current, target, monthly, projDate, history, color)
- account (cuenta destino resuelta por el shell)
- transactions (por coincidencia en notes)

## Escribe

- Nada (pantalla de solo lectura en el prototipo)

## Conceptos del núcleo que toca

- project (meta de ahorro con proyección)
- economy/ledger (acumulado, aportes, rendimiento de la cuenta destino)
- fact record (aportes como movimientos etiquetados)
