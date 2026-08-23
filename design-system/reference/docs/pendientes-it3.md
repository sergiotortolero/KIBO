# Pendientes — iteración IT-3 · **CERRADA el 9 ago 2026**

Registrado el 1 ago 2026, a partir de la revisión de **Finanzas → Resumen**.

## Finanzas · Evolución de patrimonio [1]
- **No se entiende qué mide.** Falta rotular los ejes: eje Y con la escala de dinero (referencias en $) y eje X con los meses. Hoy no hay ninguna guía de lectura.
- **Muy apretada.** Subir la altura de la gráfica y darle aire a los márgenes internos.
- **Marcadores de eventos [2]** ("Emergencia médica −$5K", "Bono semestral +$4K"): agrandarlos y ligarlos visualmente al punto de la curva donde ocurren.

## Finanzas · Periodo parametrizable [3]
- Selector de periodo aplicable a **ambas gráficas**: **1, 3, 6, 12 meses, Todo y Personalizado** (rango de fechas).
- Debe ser evidente: hoy los filtros existen pero tienen tan poca presencia que no se encuentran. Elevarlos a un control visible en el encabezado de la sección, con el periodo activo claramente marcado.

## Finanzas · Flujo mensual [4]
- Mismo tratamiento de ejes, tamaño y periodo parametrizable.
- **Agregar líneas de tendencia**: una para ingresos (de verde a verde) y otra para gastos (de rojo a rojo), sobre las barras existentes.

## Unificación de componentes
- Aplicar los 8 rubros de `docs/auditoria-ds.md` según las respuestas del cuestionario.
- Sustituir los hex sueltos que quedan (rarezas de logros, colores de área) por tokens del DS.

## Deuda pendiente detectada
- HUD superior: el chip del héroe encima el contador "2,480/4,000 XP" con el nombre/prestigio a zoom bajo.


---

## Resultado (9 ago 2026)

Todo lo de arriba está implementado; el detalle con causa raíz vive en
`docs/plan-kibo.md` § «Bloque IT-3».

| Punto | Estatus |
|---|---|
| Evolución de patrimonio: ejes, altura, aire | LISTO — marco común con eje Y en pesos, eje X con meses y 210px |
| Marcadores de evento [2] | LISTO — anclados a su punto con tallo y pin, no en una leyenda suelta |
| Periodo parametrizable [3] | LISTO — 1 · 3 · 6 · 12 meses · Todo · Personalizado, y manda sobre **ambas** gráficas |
| Flujo mensual [4] + tendencias | LISTO — mismo marco, más una recta de mínimos cuadrados por serie |
| Unificación de componentes | LISTO — los 8 rubros de `auditoria-ds.md` cerrados |
| Hex sueltos | LISTO — los de UI son tokens; quedan a propósito marcas externas y arte |
| HUD: chip del héroe sobre el XP | LISTO — las filas del chip ya pueden encoger |
