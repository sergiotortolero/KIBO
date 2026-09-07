# Personalizacion · Divisas

- **Artboard:** `PersDivisas.dc.html`
- **Módulo:** economia
- **Origen:** `personalizacion.jsx` líneas 193-268
- **Propósito:** Cambiar el nombre, el glifo y el color de las dos divisas (materia oscura y monedas). La economia no se entera: siguen valiendo lo mismo y ganandose igual.

## Secciones, de arriba abajo

- Lead .pers-lead con la promesa de que solo cambia la apariencia
- Bloque 'Materia oscura' (la rara: cofres, retos y prestigios): head con el nombre vivo csLabel('dark'), boton 'Renombrar' y grid de PersCard con CurrencyGlyph size 38
- Bloque 'Monedas' (la de todos los dias: habitos, tareas y rachas): misma estructura con csLabel('coin')
- Modal de renombrado (condicional, 248-265)

## Estados que debe mostrar

- Skin activo: el glifo gira (spin) y el PersCard queda 'on'
- Skin en propiedad no activo: 'Poner'
- Skin bloqueado: precio en gemas
- Saldo insuficiente: flash 'No tienes suficiente materia oscura'
- Modal de renombrado abierto con la divisa objetivo

## Comportamientos que hay que representar

- Poner un skin en propiedad: csSet(kind, id) y flash
- Comprar skin: valida gemas, confirma 'Comprar y poner', luego csOwn(id) + csSet(kind, id)
- Renombrar una divisa: abre modal con el nombre actual, max 22 caracteres, csSetName(kind, valor) y flash 'se llama asi en toda la plataforma'

## Lee de

- useCurrencySkin() — skins vivos por divisa
- csOwned(), csLabel(kind), CURRENCY_SKINS['dark'|'coin']
- stats.gems

## Escribe

- csOwn(id), csSet(kind,id), csSetName(kind,nombre) — skin y nombre de divisa a nivel plataforma

## Conceptos del núcleo que toca

- economy/ledger
- identity
- shell

## Modales que se dibujan sobre esta pantalla

### ¿Como se llama?
- Se abre desde: PersDivisas — boton 'Renombrar' del head de cada bloque de divisa (231-233)
- Propósito: Renombrar una divisa (materia oscura o monedas) en toda la plataforma. Modal propio pequeno (.kbv-modal-card.sm).
- Campos: Un input autoFocus con el nombre actual (csLabel del kind), maxLength 22
- Acciones: Guardar → csSetName(kind, valor recortado) + flash 'Listo — se llama asi en toda la plataforma' · Cancelar · Click en el velo cierra
- Estados: Cerrado (naming == null) · Abierto para kind 'dark' o kind 'coin'
- Origen: `personalizacion.jsx` 248-265

### Comprar skin de divisa
- Se abre desde: PersDivisas — click en un PersCard de skin no poseido (pick, 198-211)
- Propósito: Confirmar la compra de un glifo/color alternativo para una divisa, aclarando que lo que vale no cambia.
- Campos: Titulo: 'Comprar «<skin>»' · Mensaje: 'Cuesta <costo> de materia oscura. Cambia como se ve y como se llama; lo que vale, no.'
- Acciones: Comprar y poner → csOwn(id) + csSet(kind, id) + flash · Cancelar / cerrar
- Estados: Solo se abre con saldo suficiente; sin saldo, flash 'No tienes suficiente materia oscura'
- Origen: `personalizacion.jsx` 202-207
