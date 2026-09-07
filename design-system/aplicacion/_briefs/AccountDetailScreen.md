# Detalle de cuenta

- **Artboard:** `AccountDetailScreen.dc.html`
- **Módulo:** Finanzas
- **Origen:** `finanzas-screens.jsx` líneas 1148-1258
- **Propósito:** Pantalla completa de una cuenta: saldo, rendimiento o depreciación, entradas y salidas del mes, composición del portafolio si es de inversión, evolución del saldo y sus movimientos.

## Secciones, de arriba abajo

- Page head con botón 'Volver a Finanzas', eyebrow del tipo de cuenta, pill Conectada/Manual, título de la cuenta, línea de banco · últimos 4 · fecha de apertura, y acciones 'Editar' y 'Movimiento' [1161-1179]
- Hero de saldo: SALDO ACTUAL en MXN + bloques condicionales RENDIMIENTO MENSUAL (con % CAT) o PÉRDIDA INFLACIÓN/MES (con % mensual y anual), más INGRESOS MES y SALIDAS MES [1182-1209]
- 'Composición del portafolio' (solo cuentas con holdings): fila por instrumento con símbolo, nombre, barra de peso, %, monto y desempeño en verde/rojo [1212-1237]
- Grid final: 'Evolución del saldo' (Sparkline de 6 meses, serie mock derivada del saldo) y 'Movimientos · n' (TxList compact + link 'Ver todos') [1239-1255]

## Estados que debe mostrar

- Cuenta con CAT >0 → bloque de rendimiento mensual [1187-1193]
- Cuenta de efectivo → bloque de pérdida por inflación [1194-1200]
- Cuenta de inversión con holdings → sección de portafolio [1212]
- Sin banco → la línea de banco/last4/apertura no se pinta; openedAt ausente → '—' [1173]
- Cuenta sin movimientos → TxList cae a EmptyState 'Sin movimientos' [1450]

## Comportamientos que hay que representar

- Volver a Finanzas (onBack limpia openAccountId y restituye el shell con tabs) [1163-1165]
- 'Editar' y 'Movimiento' (botones presentes, sin handler) [1176-1177]
- 'Ver todos' los movimientos (link presente, sin handler) [1251]
- Filtrar los movimientos por accountId y separar entradas de salidas del mes [1150, 1153-1154]
- Serie de evolución de saldo simulada: 40%/55%/65%/78%/90%/100% del saldo actual [1157]

## Lee de

- account (type, name, bank, last4, openedAt, balance, apy, isCash, holdings, linked, color)
- transactions filtradas por accountId
- ACCOUNT_TYPES_FULL, INFLATION_MONTHLY / INFLATION_ANNUAL

## Escribe

- Nada (pantalla de solo lectura en el prototipo)

## Conceptos del núcleo que toca

- economy/ledger (saldo, rendimiento, portafolio)
- fact record (movimientos de la cuenta)
