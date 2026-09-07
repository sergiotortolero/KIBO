# Finanzas — shell multi-pestaña

- **Artboard:** `FinanzasScreen.dc.html`
- **Módulo:** Finanzas
- **Origen:** `finanzas-screens.jsx` líneas 349-448
- **Propósito:** Contenedor de toda la sección Finanzas: dueño del estado (movimientos, cuentas, créditos, proyectos de ahorro), del router de pestañas (Resumen · Cuentas · Créditos · Ahorro · Importar), de la 'navegación' a pantallas de detalle por early-return, y de los 5 modales de alta.

## Secciones, de arriba abajo

- Page head — eyebrow crumb('finanzas','Dinero y recursos'), h1 'Finanzas.' + InfoDot, acciones 'Importar' (ghost) y 'Movimiento' (secondary) [380-393]
- Barra de tabs con contadores vivos: Resumen, Cuentas (n), Créditos (n), Ahorro (n), Importar [396-410]
- Cuerpo de la pestaña activa: OverviewTab / AccountsTab / CreditsTab / SavingsTab / ImportTab [412-439]
- Capa de modales: RegistrarMovimientoModalV2, CreateAccountModal, CreateCreditModal, CreateSavingProjectModal, ImportStatementModal [441-445]

## Estados que debe mostrar

- Tab activa: overview (default) | accounts | credits | savings | import [350, 396-410]
- Sustitución de pantalla completa: si openAccountId / openCreditId / openProjectId están puestos, el componente hace early-return y renderiza AccountDetailScreen / CreditDetailScreen / ProjectDetailScreen en lugar de todo el shell (el head y los tabs desaparecen) [365-376]
- Guardas de id inválido: si el id abierto no existe en la colección, cae de vuelta al render normal (no hay pantalla de error) [366-375]
- Freemium/locked a nivel shell: el módulo 'finanzas' está marcado premium y cuesta 400 en el catálogo del dashboard (dashboard-v2.jsx:30 y :62) — evidencia externa al archivo

## Comportamientos que hay que representar

- Cambiar de pestaña sin perder el estado de datos [406]
- Abrir el modal de importación desde el head o desde ImportTab [386-388, 439, 445]
- Registrar un movimiento manual → antepone la transacción a la lista [389-391, 441]
- Crear cuenta / crédito / proyecto de ahorro: cada onSave genera un id aleatorio y hace push a su colección; el proyecto de ahorro además inicializa history:[current] [442-444]
- Abrir el detalle de una cuenta, un crédito o un proyecto desde cualquier tab (setOpenAccountId / setOpenCreditId / setOpenProjectId) [417-419, 424, 430, 436]
- Volver del detalle limpiando el id abierto (onBack) [367, 371, 375]

## Lee de

- FIN_TX_DEMO (movimientos)
- FIN_ACCOUNTS_DEMO (cuentas)
- FIN_CREDITS_DEMO (créditos)
- FIN_SAVING_PROJECTS (proyectos de ahorro)

## Escribe

- transactions: alta de movimiento manual (src:'manual') [441]
- accounts: alta de cuenta [442]
- credits: alta de crédito [443]
- savings: alta de proyecto de ahorro [444]

## Conceptos del núcleo que toca

- economy/ledger (dinero real: cuentas, deudas y movimientos — no es el ledger de XP/monedas)
- fact record (cada movimiento es un hecho registrado con su fuente: manual/email/notif)
- project (los proyectos de ahorro son proyectos con meta y aporte)
- shell (tabs + pantallas de detalle propias, no del shell global)

## Modales que se dibujan sobre esta pantalla

### Registrar movimiento
- Se abre desde: FinanzasScreen — botón 'Movimiento' del page head [389-391]
- Propósito: Alta manual de una entrada o salida en una cuenta. Declara explícitamente su frontera: 'solo entradas y salidas — los proyectos de ahorro viven en su propia sección'.
- Campos: Toggle Salida / Entrada (default Salida; cambiar de lado resetea la categoría a food o salary) [1516-1523] · Monto (number con prefijo $ y sufijo MXN, autoFocus) [1525-1532] · Fecha (date, default hoy) [1533-1536] · Concepto (texto: 'Súper de la semana, salario, etc.') [1538-1541] · Categoría (grid de tiles filtrado por tipo: entradas → salary/side/interest/transfer; salidas → todo menos salary/side/interest) [1488-1490, 1542-1555] · Cuenta (select de las cuentas del usuario, default la primera) [1557-1562] · Notas (opcional) [1563-1566]
- Acciones: Cancelar (ghost) [1510] · Guardar movimiento (primary, deshabilitado sin monto o sin concepto) [1511-1513]
- Estados: kind = expense (el monto se guarda negativo) vs income (positivo) [1494] · Guardar deshabilitado hasta que haya monto y concepto [1493, 1511] · Categoría seleccionada (tile 'on') [1547] · Modal en tamaño 'lg' [1507]
- Origen: `finanzas-screens.jsx` 1479-1570

### Agregar cuenta
- Se abre desde: AccountsTab — card 'Agregar cuenta' [794]
- Propósito: Dar de alta débito, ahorro, inversión o efectivo. Modela el CAT del mundo real mexicano: tope de saldo con rendimiento y condición mensual a cumplir (estilo Mercado Pago).
- Campos: Tipo de cuenta — 4 tiles grandes con descripción: Débito ('cuenta de banco para uso diario'), Ahorro ('apartado para metas o emergencia'), Inversión ('fondos, acciones, cetes'), Efectivo ('billetera física; se deprecia con inflación'); elegir tipo también fija el color [1599-1612] · Nombre (autoFocus) [1614-1617] · Banco (input con datalist de 12: BBVA, Nu, Banamex, Banorte, Santander, HSBC, Hey Banco, Mercado Pago, Klar, Stori, GBM, Scotiabank; se puede escribir uno nuevo) [1618-1625] · Últimos 4 dígitos (maxLength 4) [1628-1631] · Saldo actual ($ MXN) [1632-1635] · CAT anual / rendimiento (%) [1636-1639] · Monto máximo con rendimiento — tope del CAT (solo si CAT >0) [1643-1647] · Condición mensual — checkbox 'Requiere cumplir algo cada mes para ganar el CAT' + campo de texto libre (solo si CAT >0) [1648-1653]
- Acciones: Cancelar (ghost) [1592] · Crear cuenta (primary, deshabilitado sin nombre; guarda linked:false e isCash derivado del tipo) [1593-1596]
- Estados: type = 'cash' → banco, últimos 4 y CAT deshabilitados, y aparece el aviso de depreciación mensual ({INFLATION_MONTHLY}% mensual / 4.5% anual) [1620, 1630, 1638, 1656-1660] · type = 'debit' → CAT deshabilitado [1638] · CAT >0 → se revela el bloque condicional de tope y condición mensual [1641-1655] · Condición mensual activada → se revela el campo de texto de la condición [1651] · Modal en tamaño 'lg' [1589]
- Origen: `finanzas-screens.jsx` 1572-1663

### Agregar crédito
- Se abre desde: CreditsTab — card 'Agregar crédito' [897]
- Propósito: Dar de alta tarjetas, hipotecas, préstamos online, crédito de auto o préstamos entre personas, para que Kibo calcule interés vs capital y recomiende estrategias de pago.
- Campos: Tipo de crédito — 5 tiles: Tarjeta crédito (default), Hipoteca, Préstamo online, Crédito auto, Préstamo personal [1691-1704] · Nombre (autoFocus) [1706-1709] · Banco — o 'Persona / prestamista' si el tipo es personal ('Ej: Abuela, prima Ana, Tío Beto…') [1710-1714] · Saldo pendiente ($) [1717-1720] · Límite total ($) [1721-1724] · CAT anual (%) [1725-1728] · Pago mínimo ($) [1729-1732] · Día de pago (KbStepper 1-31, default 15) [1735-1737] · Fecha límite (opcional) — o 'Fecha compromiso de pago' si es personal [1738-1742]
- Acciones: Cancelar (ghost) [1684] · Agregar crédito (primary, deshabilitado sin nombre; guarda el saldo como negativo, color derivado del tipo, linked:false, interestPaidYTD:0, capitalPaidYTD:0 y payee cuando es personal) [1685-1688]
- Estados: isPersonal (type='personal') cambia las etiquetas de banco y fecha, y muestra los hints 'préstamos entre personas — sin banco' y 'la fecha en la que te comprometiste a saldar la deuda' [1675, 1711-1713, 1739-1741] · Tipo seleccionado (tile 'on') [1696] · Modal en tamaño 'lg' [1681]
- Origen: `finanzas-screens.jsx` 1665-1746

### Nuevo proyecto de ahorro
- Se abre desde: SavingsTab — card 'Nuevo proyecto de ahorro' [1034]
- Propósito: Definir una meta de dinero a acumular con cuenta destino y aporte mensual, para que Kibo proyecte cuándo se logra.
- Campos: Nombre del proyecto (autoFocus, 'Fondo de emergencia, viaje Japón...') [1788-1791] · Fecha objetivo (date) [1792-1795] · Descripción (textarea: 'por qué importa y cómo se ve éxito') [1797-1800] · Acumulado hoy ($) [1802-1805] · Meta total ($) [1806-1809] · Aporte mensual ($) [1810-1813] · Cuenta destino (select que EXCLUYE cuentas de efectivo y anota el CAT de cada una; nota 'idealmente una con buen rendimiento') [1815-1823] · Color (6 swatches) [1824-1832]
- Acciones: Cancelar (ghost) [1771] · Crear proyecto (primary, deshabilitado sin nombre o sin meta; guarda icon fijo 'shield' y projDate '—' si no hay fecha) [1772-1783]
- Estados: Proyección viva: con meta y aporte mensual >0 aparece la línea 'Con $X al mes alcanzas la meta en N meses' [1759-1761, 1833-1838] · Color seleccionado (borde grueso) [1829] · Modal en tamaño 'lg' [1768]
- Origen: `finanzas-screens.jsx` 1748-1841

### Importar estado de cuenta
- Se abre desde: FinanzasScreen — botón 'Importar' del page head [386-388], ImportTab — botón 'Subir archivo' del hero [1067]
- Propósito: Asistente de 4 pasos para convertir un estado de cuenta (PDF/CSV/XLSX) en movimientos: subir, confirmar el mapeo automático detectado, revisar la vista previa con nivel de confianza por movimiento e importar.
- Campos: Paso upload: zona de arrastre ('PDF, CSV, XLSX hasta 20MB') y lista de bancos compatibles (BBVA, Nu, Banamex, Banorte, Santander, HSBC, Hey Banco, Mercado Pago) [1875-1888] · Paso mapping: Cuenta destino (select de cuentas) [1892-1898] · Paso mapping: tabla de mapeo automático detectado — Fecha→Columna A (alta), Descripción→Columna B (alta), Cargo/Abono→Columna C/D (alta), Saldo→Columna E (media), Categoría→auto-detectada por descripción (media); más el meta 'Banco: BBVA · formato: PDF nativo · 6 movimientos en 2 meses' [1899-1922] · Paso preview: tabla de 6 movimientos detectados con Fecha, Descripción, Categoría (pill) y Monto, más columna de confianza [1926-1964] · Paso done: mensaje de éxito con el conteo y el nombre de la cuenta destino [1966-1974]
- Acciones: Atrás (visible fuera del paso upload; preview→mapping, mapping→upload, done→preview) [1868] · Procesar (paso upload → mapping) [1869] · Ver vista previa (paso mapping → preview) [1870] · Importar N movimientos (paso preview → done) [1871] · Cerrar (paso done) [1872] · Seleccionar archivo (botón en la zona de arrastre, sin handler) [1880]
- Estados: 4 pasos: upload | mapping | preview | done, cada uno con su propio subtítulo en el encabezado del modal [1844, 1860-1863] · Confianza por movimiento: alta ('✓ Alta'), media ('~ Media'), baja ('? Baja') [1954-1956] · Confianza por campo mapeado: alta / media [1915] · El asistente NO escribe movimientos: el modal no recibe onSave y 'Importar' solo cambia de paso — el efecto es puramente narrativo [1843, 1871] · Modal en tamaño 'lg' [1865]
- Origen: `finanzas-screens.jsx` 1843-1977
