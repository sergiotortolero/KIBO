# Finanzas · Resumen

- **Artboard:** `OverviewTab.dc.html`
- **Módulo:** Finanzas
- **Origen:** `finanzas-screens.jsx` líneas 453-689
- **Propósito:** Vista de una sola mirada del dinero: patrimonio, flujo del mes, tasa de ahorro, deuda, KPIs derivados (rendimiento, interés pagado, suscripciones, quema diaria, runway, presupuesto), atajos a cuentas y créditos, y dos gráficas con ejes rotulados gobernadas por un filtro de periodo global.

## Secciones, de arriba abajo

- Filtro de periodo global: 1 mes / 3 meses / 6 meses (default) / 12 meses / Todo (24) / Personalizado; con rango por mes (inputs type=month 'Del … al …') y nota '{n} meses · {mesInicio} → {mesFin}' [510-527]
- Hero de 4 cifras: Patrimonio neto (+12% vs Q1 · activos), Saldo mes (ingresos · gastos), Tasa de ahorro %, Deuda total (interés YTD pagado) [530-551]
- Strip de 6 KPIs: Rendimiento estimado/mes, Interés pagado YTD (% del saldo), Suscripciones (n activas), Quema diaria (y /mes), Runway en meses (con tooltip explicativo), Presupuesto usado % (n sobre el límite) [554-585]
- Grid de dos cards: 'Tus cuentas' (MoneyRow por cuenta con tipo, CAT o depreciación por inflación en efectivo) y 'Tus créditos' (fila por crédito con tipo, CAT en rojo si >50%, día de vencimiento y saldo negativo) [588-628]
- Gráficas principales: 'Flujo mensual' (FinFlowChart de barras pareadas + líneas de tendencia + leyenda Ingresos/Gastos/Tendencia y ahorro neto) y 'Evolución patrimonio' (FinNetWorthChart con área anclada al cero, hitos anclados a su mes y delta del periodo) [631-659]
- 'Gastos por categoría · Mayo': breakdown de barras ordenado desc por monto (icono, nombre, barra, monto, %) junto a un FinDonut con el total al centro [662-685]

## Estados que debe mostrar

- Periodo estándar vs 'Personalizado' (revela el selector de rango de meses, clamped 1-24) [462-468, 517-525]
- 1 mes: los rótulos cambian a 'Mostrando el mes en curso' / 'Mes en curso' / '+X en el mes' [526, 635, 649, 655]
- Patrimonio neto negativo: la cifra se pinta con var(--kb-hp-ink) y la gráfica ancla el área al cero y colorea la línea en tono HP [533, 246-257]
- Tasa de ahorro ≥20% ('✓ Por arriba de 20%') vs <20% ('Bajo 20% — ajusta gasto') [544]
- Hitos del patrimonio ('Emergencia médica −$5K' a 3 meses, 'Bono semestral +$4K' a 1 mes) que DESAPARECEN si quedan fuera del periodo elegido [501-505]
- Delta del periodo en verde o en HP según si el patrimonio creció o cayó [653-656]

## Comportamientos que hay que representar

- Cambiar el periodo recalcula meses visibles y ambas series (flujo y patrimonio), no solo el rótulo [495-505]
- Definir un rango personalizado mes a mes (from ≤ to, con max/min cruzados) [520-523]
- Click en cualquier cuenta → AccountDetailScreen [600]
- Click en cualquier crédito → CreditDetailScreen [615]
- Series deterministas que ATERRIZAN en el valor real de hoy (finSeries fuerza el último punto al valor actual) [171-186]
- Excluir las transferencias de ingresos, gastos y del desglose por categoría [470-471, 487]
- Tooltips explicativos en Runway ('meses que podrías cubrir tus gastos actuales sin ingresos nuevos') [576]

## Lee de

- transactions (kind, catId, amt)
- accounts (balance, apy)
- credits (balance, apr, dueDay, interestPaidYTD)
- savings (recibido pero no usado en el render)
- BUDGET_V2 (límites por categoría)
- FIN_CATEGORIES, ACCOUNT_TYPES_FULL, CREDIT_TYPES_FULL
- INFLATION_MONTHLY (etiqueta de depreciación en efectivo)

## Escribe

- Nada persistente: solo estado local de periodo y rango [460-461]

## Conceptos del núcleo que toca

- economy/ledger (patrimonio, flujo, deuda, presupuesto)
- fact record (agregación de movimientos)
- shell (tab)
