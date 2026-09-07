# Detalle de crédito

- **Artboard:** `CreditDetailScreen.dc.html`
- **Módulo:** Finanzas
- **Origen:** `finanzas-screens.jsx` líneas 1260-1355
- **Propósito:** Pantalla completa de una deuda: saldo pendiente y utilización, pago mínimo, CAT, la proyección punitiva de 'si solo pagas el mínimo', el desglose interés vs capital del año y la recomendación de acelerar el pago.

## Secciones, de arriba abajo

- Page head con 'Volver a Finanzas', eyebrow del tipo, nombre del crédito, línea 'banco · vence día N cada mes', y acciones 'Marcar pago' (danger) y 'Editar' [1269-1282]
- Hero: SALDO PENDIENTE en negativo + barra de utilización y '% utilizado de $límite'; PAGO MÍNIMO (próximo día N); CAT (costo total anual); SI SOLO PAGAS MÍNIMO (meses a liquidar + interés proyectado) [1284-1308]
- Grid de 4 KPIs: Interés pagado YTD (% del saldo), Capital pagado YTD ('reduce deuda'), Pago total YTD (5 meses), % interés del pago ('dinero perdido') [1310-1331]
- Card 'Movimientos asociados' (TxList de los tx cuyo accountId es el id del crédito) [1333-1339]
- Card 'Acelera el pago — ahorra interés': pagando el doble del mínimo liquidas en la mitad de los meses y ahorras ~la mitad del interés; botón 'Plan acelerado' [1341-1352]

## Estados que debe mostrar

- Utilización >80% → barra en var(--kb-hp) [1289]
- CAT >50% → CAT en var(--kb-hp-ink) [1300]
- Pago mínimo 0 → meses a liquidar '—' e interés proyectado 0 [1264-1265]
- Crédito sin movimientos asociados → TxList cae a EmptyState [1450]

## Comportamientos que hay que representar

- Volver a Finanzas [1271-1273]
- 'Marcar pago', 'Editar' y 'Plan acelerado' (botones presentes, sin handler) [1279-1280, 1350]
- Proyección: meses = ceil(saldo/pago mínimo); interés proyectado = saldo·apr/100/12·meses·0.6 [1264-1265]

## Lee de

- credit (type, name, bank, balance, limit, apr, dueDay, minPayment, interestPaidYTD, capitalPaidYTD, color)
- transactions filtradas por accountId === credit.id
- CREDIT_TYPES_FULL

## Escribe

- Nada (pantalla de solo lectura en el prototipo)

## Conceptos del núcleo que toca

- economy/ledger (deuda, interés vs capital)
- fact record (cargos y pagos asociados)
