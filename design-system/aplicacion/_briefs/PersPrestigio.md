# Personalizacion · Prestigio

- **Artboard:** `PersPrestigio.dc.html`
- **Módulo:** economia
- **Origen:** `personalizacion.jsx` líneas 95-190
- **Propósito:** Cambiar como se llaman los 16 prestigios: comprar una familia entera de nombres o escribir los 16 propios. Explicitamente cosmetico — el numero de prestigio y lo que vale no se tocan.

## Secciones, de arriba abajo

- Lead .pers-lead con la explicacion de que el nombre es cosmetico y el nivel se sigue viendo
- Grid .pers-grid con un PersCard wide por cada PRESTIGE_FAMILIES, mostrando muestra de los nombres 1, 8 y 16 (130-140)
- Tarjeta final 'Escribe los tuyos' con precio PF_CUSTOM_COST (142-150)
- Modal de edicion de los 16 nombres (condicional, 153-187)

## Estados que debe mostrar

- Familia en propiedad y activa (pc-tag 'Puesto') / en propiedad no activa ('Poner') / bloqueada (precio en gemas)
- Nombres propios activos (live.custom): la tarjeta custom aparece 'on' con 'Puestos'
- Saldo insuficiente: flash y no compra
- Draft abierto (modal de los 16 campos) / cerrado

## Comportamientos que hay que representar

- Elegir familia en propiedad: pfSetCustom(null) + pfSetActive(id) y flash
- Comprar familia: valida gemas, confirma 'Comprar y poner', luego pfOwn + pfSetCustom(null) + pfSetActive
- Abrir el editor de nombres propios: si aun no los tiene, exige PF_CUSTOM_COST de materia oscura
- Guardar los 16: valida que ninguno quede vacio, recorta espacios y llama pfSetCustom(array)
- 'Quitar los mios': pfSetCustom(null) y vuelve a la familia elegida

## Lee de

- usePrestigeNames() → { names, family, custom }
- pfOwned() — familias en propiedad
- PRESTIGE_FAMILIES, PF_CUSTOM_COST
- stats.gems

## Escribe

- pfOwn(id), pfSetActive(id), pfSetCustom(array|null) — nombres de prestigio persistidos

## Conceptos del núcleo que toca

- economy/ledger
- progression engine
- identity

## Modales que se dibujan sobre esta pantalla

### Tus 16 prestigios
- Se abre desde: PersPrestigio — tarjeta 'Escribe los tuyos' (startCustom, 115-120 / 142)
- Propósito: Editar a mano los nombres de los 16 prestigios. Modal propio (.kbv-modal-veil / .kbv-modal-card), no el ConfirmDialog compartido.
- Campos: 16 filas .pers-custom-row, cada una con su numero (1..16) y un input de maxLength 28
- Acciones: Quitar los mios (solo si live.custom): pfSetCustom(null) + flash 'Volviste a la familia elegida' · Cancelar (cierra el draft) · Guardar los 16 → valida que ninguno este vacio (si no, flash 'Ninguno puede quedar vacio'), recorta y llama pfSetCustom · Click en el velo cierra el modal
- Estados: Cerrado (draft == null) · Abierto con los nombres vivos precargados · Ya tiene nombres propios (live.custom): aparece el boton 'Quitar los mios' · Validacion fallida: algun campo vacio → flash y no guarda · Puerta de pago: no abre si no posee los nombres propios y le falta PF_CUSTOM_COST de materia oscura
- Origen: `personalizacion.jsx` 153-187

### Comprar familia de prestigios
- Se abre desde: PersPrestigio — click en un PersCard de familia no poseida (pick, 100-113)
- Propósito: Confirmar la compra de una familia entera de nombres de prestigio, aclarando que el numero y lo que valen no se tocan.
- Campos: Titulo: 'Comprar «<familia>»' · Mensaje: 'Cuesta <costo> de materia oscura. Cambia el nombre de tus 16 prestigios; el numero y lo que valen no se tocan.'
- Acciones: Comprar y poner → pfOwn(id) + pfSetCustom(null) + pfSetActive(id) + flash · Cancelar / cerrar
- Estados: Solo se abre con saldo suficiente; sin saldo, flash 'No tienes suficiente materia oscura — ganala en retos o abrela en cofres'
- Origen: `personalizacion.jsx` 104-109
