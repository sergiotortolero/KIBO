# Finanzas · Ahorro (proyectos)

- **Artboard:** `SavingsTab.dc.html`
- **Módulo:** Finanzas
- **Origen:** `finanzas-screens.jsx` líneas 956-1042
- **Propósito:** Los proyectos de ahorro como metas de dinero con cuenta destino, aporte mensual y proyección de fecha de logro (fondo de emergencia, viaje, enganche de auto).

## Secciones, de arriba abajo

- Grid de 4 KPIs: Acumulado (de $X meta), Avance global %, Aporte mensual comprometido, Proyectos activos [964-985]
- Grid de tarjetas de ahorro: glyph, nombre, descripción, pill 'AHORRO', tres bloques (Acumulado / Meta / Mensual), GoalBar con 'N meses para meta · proyección {fecha}', línea de cuenta destino y Sparkline del histórico [987-1033]
- Card 'Nuevo proyecto de ahorro' ('Define meta, aporte mensual y cuenta destino. Kibo proyecta cuándo lo logras.') [1034-1038]

## Estados que debe mostrar

- Aporte mensual 0 → los meses restantes se muestran como '—' [991]
- Progreso topado a 100% [989]
- Con cuenta destino vinculada vs sin ella (la línea 'Depositado en:' no se pinta) [1024-1029]

## Comportamientos que hay que representar

- Click en cualquier tarjeta → ProjectDetailScreen [994]
- 'Nuevo proyecto de ahorro' → CreateSavingProjectModal [1034]
- Calcular meses restantes como ceil((target−current)/monthly) [990-991]

## Lee de

- savings (current, target, monthly, projDate, desc, history, accountId, icon, color)
- accounts (para resolver la cuenta destino)

## Escribe

- Nada directo; delega el alta a CreateSavingProjectModal vía onAdd [1034]

## Conceptos del núcleo que toca

- project (proyecto de ahorro con meta y proyección)
- economy/ledger (dinero acumulado y aporte comprometido)
- shell (tab)

## Modales que se dibujan sobre esta pantalla

### Nuevo proyecto de ahorro
- Se abre desde: SavingsTab — card 'Nuevo proyecto de ahorro' [1034]
- Propósito: Definir una meta de dinero a acumular con cuenta destino y aporte mensual, para que Kibo proyecte cuándo se logra.
- Campos: Nombre del proyecto (autoFocus, 'Fondo de emergencia, viaje Japón...') [1788-1791] · Fecha objetivo (date) [1792-1795] · Descripción (textarea: 'por qué importa y cómo se ve éxito') [1797-1800] · Acumulado hoy ($) [1802-1805] · Meta total ($) [1806-1809] · Aporte mensual ($) [1810-1813] · Cuenta destino (select que EXCLUYE cuentas de efectivo y anota el CAT de cada una; nota 'idealmente una con buen rendimiento') [1815-1823] · Color (6 swatches) [1824-1832]
- Acciones: Cancelar (ghost) [1771] · Crear proyecto (primary, deshabilitado sin nombre o sin meta; guarda icon fijo 'shield' y projDate '—' si no hay fecha) [1772-1783]
- Estados: Proyección viva: con meta y aporte mensual >0 aparece la línea 'Con $X al mes alcanzas la meta en N meses' [1759-1761, 1833-1838] · Color seleccionado (borde grueso) [1829] · Modal en tamaño 'lg' [1768]
- Origen: `finanzas-screens.jsx` 1748-1841
