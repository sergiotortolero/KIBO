# Finanzas · Importar

- **Artboard:** `ImportTab.dc.html`
- **Módulo:** Finanzas
- **Origen:** `finanzas-screens.jsx` líneas 1047-1143
- **Propósito:** Onboarding e historial de la importación de estados de cuenta: explica el pipeline (subir → mapear → revisar → importar), lista los archivos ya procesados y contrasta la importación manual con la conexión bancaria automática.

## Secciones, de arriba abajo

- Hero 'Importar estados de cuenta': PDFs, CSV o Excel; Kibo extrae, clasifica y deja borradores por aprobar; compatible con BBVA, Nu, Banamex, Banorte y más; botón 'Subir archivo' [1056-1071]
- Card 'Cómo funciona' con 4 pasos numerados: 1 Sube tu estado de cuenta (hasta 12 meses por archivo), 2 Kibo lo lee y mapea (detecta banco, formato y categorías; OCR para PDFs con tablas), 3 Tú revisas y apruebas, 4 Listo · forma parte de tu historia (KPIs se recalculan al vuelo) [1074-1095]
- Card 'Historial de importaciones': 3 archivos (BBVA-2026-04.pdf 84/84 OK, Nu-2026-Q1.csv 156/156 OK, tarjeta-bbva-feb.xlsx 38/42 con 4 sin mapear) con estado y botón 'Ver' [1098-1120]
- Card '¿Por qué no conectar el banco directamente?': Belvo/Plaid cada 4 horas, la importación manual sigue útil para histórico antiguo o bancos sin conexión; botón 'Conectar banco' [1123-1140]

## Estados que debe mostrar

- Import 'success' → pill '✓ n/n OK' [1112]
- Import 'partial' → pill '⚠ mapped/total · n sin mapear' [1112]

## Comportamientos que hay que representar

- 'Subir archivo' → ImportStatementModal (vía onOpenImport) [1067]
- 'Ver' un import histórico (botón presente, sin handler) [1114-1116]
- 'Conectar banco' (botón presente, sin handler) [1136-1138]

## Lee de

- recentImports (lista local hardcodeada dentro del componente) [1048-1052]

## Escribe

- Nada

## Conceptos del núcleo que toca

- fact record (movimientos importados como borradores por aprobar)
- economy/ledger
- shell (tab)

## Modales que se dibujan sobre esta pantalla

### Importar estado de cuenta
- Se abre desde: FinanzasScreen — botón 'Importar' del page head [386-388], ImportTab — botón 'Subir archivo' del hero [1067]
- Propósito: Asistente de 4 pasos para convertir un estado de cuenta (PDF/CSV/XLSX) en movimientos: subir, confirmar el mapeo automático detectado, revisar la vista previa con nivel de confianza por movimiento e importar.
- Campos: Paso upload: zona de arrastre ('PDF, CSV, XLSX hasta 20MB') y lista de bancos compatibles (BBVA, Nu, Banamex, Banorte, Santander, HSBC, Hey Banco, Mercado Pago) [1875-1888] · Paso mapping: Cuenta destino (select de cuentas) [1892-1898] · Paso mapping: tabla de mapeo automático detectado — Fecha→Columna A (alta), Descripción→Columna B (alta), Cargo/Abono→Columna C/D (alta), Saldo→Columna E (media), Categoría→auto-detectada por descripción (media); más el meta 'Banco: BBVA · formato: PDF nativo · 6 movimientos en 2 meses' [1899-1922] · Paso preview: tabla de 6 movimientos detectados con Fecha, Descripción, Categoría (pill) y Monto, más columna de confianza [1926-1964] · Paso done: mensaje de éxito con el conteo y el nombre de la cuenta destino [1966-1974]
- Acciones: Atrás (visible fuera del paso upload; preview→mapping, mapping→upload, done→preview) [1868] · Procesar (paso upload → mapping) [1869] · Ver vista previa (paso mapping → preview) [1870] · Importar N movimientos (paso preview → done) [1871] · Cerrar (paso done) [1872] · Seleccionar archivo (botón en la zona de arrastre, sin handler) [1880]
- Estados: 4 pasos: upload | mapping | preview | done, cada uno con su propio subtítulo en el encabezado del modal [1844, 1860-1863] · Confianza por movimiento: alta ('✓ Alta'), media ('~ Media'), baja ('? Baja') [1954-1956] · Confianza por campo mapeado: alta / media [1915] · El asistente NO escribe movimientos: el modal no recibe onSave y 'Importar' solo cambia de paso — el efecto es puramente narrativo [1843, 1871] · Modal en tamaño 'lg' [1865]
- Origen: `finanzas-screens.jsx` 1843-1977
