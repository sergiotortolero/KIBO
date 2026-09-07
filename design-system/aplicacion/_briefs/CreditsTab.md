# Finanzas · Créditos

- **Artboard:** `CreditsTab.dc.html`
- **Módulo:** Finanzas
- **Origen:** `finanzas-screens.jsx` líneas 824-951
- **Propósito:** Inventario de deuda con la distinción central del módulo: interés pagado (dinero perdido) vs capital pagado (deuda real reducida). Incluye el catálogo de suscripciones y recurrentes y una recomendación de estrategia anti-deuda.

## Secciones, de arriba abajo

- Grid de 5 KPIs: Deuda total (n créditos activos), Interés pagado YTD (% del saldo), Capital pagado YTD ('reduce tu deuda real'), Pago mínimo/mes (suma de mínimos), CAT promedio (ponderado por saldo) [834-860]
- Grid de tarjetas de crédito: pill de tipo, estado Conectado/Manual, nombre, saldo usado 'de $límite', barra de utilización, strip 'Interés YTD $X (n%)', pie con 'Vence día N' y CAT [862-896]
- Card 'Agregar crédito' (Tarjeta · Hipoteca · Préstamo · Auto · Personal) [897-901]
- Card 'Suscripciones y recurrentes': 6 recurrentes (Netflix, Spotify, Xbox Game Pass, teléfono, Luz CFE, Renta) como MoneyRow con tipo, día de cobro y cuenta ligada, total mensual y anual, botón 'Agregar recurrente' y nota de que se contemplan en la quema mensual y el runway [905-928]
- Banner 'Estrategia anti-deuda': método avalancha (liquidar Kueski en 6 meses, ahorrar $4,800 de interés futuro) con botones 'Plan avalancha' y 'Plan bola de nieve' [930-948]

## Estados que debe mostrar

- Utilización >80%: la barra se pinta en var(--kb-hp) [883]
- CAT >50%: el porcentaje se pinta en var(--kb-hp) tanto en la tarjeta como en el resumen [892, 619]
- Conectado (check) vs Manual (alerta) [873-875]
- Crédito sin límite (limit 0) → utilización 0% [865]

## Comportamientos que hay que representar

- Click en cualquier tarjeta de crédito → CreditDetailScreen [868]
- 'Agregar crédito' → CreateCreditModal [897]
- 'Agregar recurrente' (botón presente, sin handler) [919-921]
- 'Plan avalancha' / 'Plan bola de nieve' (botones presentes, sin handler) [941-946]
- Calcular CAT promedio ponderado por saldo y % de interés sobre el saldo [829-830]

## Lee de

- credits (balance, limit, apr, dueDay, interestPaidYTD, capitalPaidYTD, minPayment, linked)
- transactions (recibido como prop, no usado en el render)
- CREDIT_TYPES_FULL, FIN_SUBSCRIPTIONS_DEMO

## Escribe

- Nada directo; delega el alta a CreateCreditModal vía onAdd [897]

## Conceptos del núcleo que toca

- economy/ledger (deuda, interés vs capital, recurrentes)
- shell (tab)

## Modales que se dibujan sobre esta pantalla

### Agregar crédito
- Se abre desde: CreditsTab — card 'Agregar crédito' [897]
- Propósito: Dar de alta tarjetas, hipotecas, préstamos online, crédito de auto o préstamos entre personas, para que Kibo calcule interés vs capital y recomiende estrategias de pago.
- Campos: Tipo de crédito — 5 tiles: Tarjeta crédito (default), Hipoteca, Préstamo online, Crédito auto, Préstamo personal [1691-1704] · Nombre (autoFocus) [1706-1709] · Banco — o 'Persona / prestamista' si el tipo es personal ('Ej: Abuela, prima Ana, Tío Beto…') [1710-1714] · Saldo pendiente ($) [1717-1720] · Límite total ($) [1721-1724] · CAT anual (%) [1725-1728] · Pago mínimo ($) [1729-1732] · Día de pago (KbStepper 1-31, default 15) [1735-1737] · Fecha límite (opcional) — o 'Fecha compromiso de pago' si es personal [1738-1742]
- Acciones: Cancelar (ghost) [1684] · Agregar crédito (primary, deshabilitado sin nombre; guarda el saldo como negativo, color derivado del tipo, linked:false, interestPaidYTD:0, capitalPaidYTD:0 y payee cuando es personal) [1685-1688]
- Estados: isPersonal (type='personal') cambia las etiquetas de banco y fecha, y muestra los hints 'préstamos entre personas — sin banco' y 'la fecha en la que te comprometiste a saldar la deuda' [1675, 1711-1713, 1739-1741] · Tipo seleccionado (tile 'on') [1696] · Modal en tamaño 'lg' [1681]
- Origen: `finanzas-screens.jsx` 1665-1746
