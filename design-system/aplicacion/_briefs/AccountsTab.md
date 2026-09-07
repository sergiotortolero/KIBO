# Finanzas · Cuentas

- **Artboard:** `AccountsTab.dc.html`
- **Módulo:** Finanzas
- **Origen:** `finanzas-screens.jsx` líneas 694-819
- **Propósito:** Inventario de cuentas (débito, ahorro, inversión, efectivo) con la tesis del módulo: el dinero rinde o se deprecia. Cuantifica rendimiento por CAT contra pérdida por inflación en efectivo y muestra el rendimiento NETO anual.

## Secciones, de arriba abajo

- Grid de 6 KPIs (en 3 columnas): Total en cuentas (n cuentas), Rendimiento mensual (de n cuentas con CAT), Rendimiento anual (proyección 12 meses), Pérdida por inflación (%/mes en efectivo), Rend. neto anual con tooltip (rendimientos − inflación), Tiempo ahorrado en meses con tooltip (gastos ~$22,000/mes) [707-738]
- Grid de tarjetas de cuenta: banco, pill de tipo, nombre, saldo en MXN, strip de CAT o strip de inflación, mini-holdings de inversión, últimos 4 dígitos, estado Conectada/Manual, y último movimiento [740-793]
- Card 'Agregar cuenta' (Débito · Ahorro · Inversión · Efectivo) [794-798]
- Banner de automatización 'Conexión bancaria · activa': 3 de 4 cuentas vía Belvo, saldos cada 4 horas, movimientos como borradores que se aprueban con un toque, con botón 'Gestionar conexiones' [801-816]

## Estados que debe mostrar

- Cuenta con CAT >0: strip verde '{apy}% CAT · genera +$X/mes' [757-762]
- Cuenta de efectivo: strip roja 'Se deprecia −$X/mes (inflación)' [763-768]
- Cuenta de inversión con holdings: pills con símbolo y desempeño en verde/rojo (máx. 3) [769-778]
- Conectada (check) vs Manual (alerta) [782-784]
- Con último movimiento vs sin movimientos (la fila 'Último:' no se pinta) [786-790]
- Rendimiento neto anual positivo (verde) o negativo (HP) [730]
- Sin last4 → '—' [781]

## Comportamientos que hay que representar

- Click en cualquier tarjeta de cuenta → AccountDetailScreen [747]
- 'Agregar cuenta' → CreateAccountModal [794]
- 'Gestionar conexiones' (botón presente, sin handler) [812-814]
- Calcular rendimiento mensual por cuenta como balance·apy/100/12 y la pérdida en efectivo como balance·INFLATION_MONTHLY/100 [743-744]
- Runway propio del tab calculado contra un gasto mensual fijo hardcodeado de $22,000 [702-703]

## Lee de

- accounts (type, bank, last4, balance, color, linked, apy, holdings, isCash)
- transactions (para el último movimiento por cuenta)
- ACCOUNT_TYPES_FULL, INFLATION_MONTHLY

## Escribe

- Nada directo; delega el alta a CreateAccountModal vía onAdd [794]

## Conceptos del núcleo que toca

- economy/ledger (activos, rendimiento, inflación)
- fact record (último movimiento por cuenta)
- shell (tab)

## Modales que se dibujan sobre esta pantalla

### Agregar cuenta
- Se abre desde: AccountsTab — card 'Agregar cuenta' [794]
- Propósito: Dar de alta débito, ahorro, inversión o efectivo. Modela el CAT del mundo real mexicano: tope de saldo con rendimiento y condición mensual a cumplir (estilo Mercado Pago).
- Campos: Tipo de cuenta — 4 tiles grandes con descripción: Débito ('cuenta de banco para uso diario'), Ahorro ('apartado para metas o emergencia'), Inversión ('fondos, acciones, cetes'), Efectivo ('billetera física; se deprecia con inflación'); elegir tipo también fija el color [1599-1612] · Nombre (autoFocus) [1614-1617] · Banco (input con datalist de 12: BBVA, Nu, Banamex, Banorte, Santander, HSBC, Hey Banco, Mercado Pago, Klar, Stori, GBM, Scotiabank; se puede escribir uno nuevo) [1618-1625] · Últimos 4 dígitos (maxLength 4) [1628-1631] · Saldo actual ($ MXN) [1632-1635] · CAT anual / rendimiento (%) [1636-1639] · Monto máximo con rendimiento — tope del CAT (solo si CAT >0) [1643-1647] · Condición mensual — checkbox 'Requiere cumplir algo cada mes para ganar el CAT' + campo de texto libre (solo si CAT >0) [1648-1653]
- Acciones: Cancelar (ghost) [1592] · Crear cuenta (primary, deshabilitado sin nombre; guarda linked:false e isCash derivado del tipo) [1593-1596]
- Estados: type = 'cash' → banco, últimos 4 y CAT deshabilitados, y aparece el aviso de depreciación mensual ({INFLATION_MONTHLY}% mensual / 4.5% anual) [1620, 1630, 1638, 1656-1660] · type = 'debit' → CAT deshabilitado [1638] · CAT >0 → se revela el bloque condicional de tope y condición mensual [1641-1655] · Condición mensual activada → se revela el campo de texto de la condición [1651] · Modal en tamaño 'lg' [1589]
- Origen: `finanzas-screens.jsx` 1572-1663
