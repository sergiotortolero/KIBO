# Acción rápida — rueda radial de KIBO

- **Artboard:** `KiboQuickWheel.dc.html`
- **Módulo:** shell / KIBO
- **Origen:** `kibo-quick.jsx` líneas 636-1164
- **Propósito:** Superficie a pantalla completa (velo + escenario) que se abre desde el FAB de KIBO: un disco radial de dos niveles (rubros → acciones) para REGISTRAR sin navegar. Estándar tipo GTA V/Fortnite: el blanco de clic es el sector entero y se apunta con la DIRECCIÓN del cursor desde el centro; el cubo lo ocupa KIBO (jalable como gel) y el letrero inferior dice qué apuntas.

## Secciones, de arriba abajo

- Velo `kbw` (clic fuera = cerrar) + `kbw-stage`
- Disco SVG `kbw-disc`: placa del cubo (`hubplate`, r=KBW_RIN-4) + sectores `path.sec` generados por kbwSector con las 4 esquinas fileteadas (KBW_RIN 104, KBW_ROUT 210, KBW_GAP 1.4, KBW_START -90)
- Capa de rótulos `kbw-labels`: ícono + nombre por sector, colocados a (KBW_RIN+KBW_ROUT)/2, ancho de rótulo calculado por la cuerda del sector (labW)
- Pista de enseñanza `kbw-teach` («Jálalo»), una sola vez
- Cubo `kbw-hub`: botón con KiboBlob (kiboSize, mood de useVitals) que vuela desde su esquina (origin --ox/--oy/--os) y se deforma al jalarlo (`kbw-pull`)
- Barra del cubo `kbw-hubbar`: volver/cerrar + «Editar la rueda» (grip)
- Pie `kbw-foot`: página anterior, `kbw-cap` (título + subtítulo + puntos de página, aria-live), página siguiente
- Panel de formulario `kbb-rform` (sustituye al disco)
- Panel `kbb-rform wide` — «Tu rueda» (sustituye al disco)

## Estados que debe mostrar

- cerrada / abierta (clase `open`; abrir reinicia nivel, forma, custom y sector activo)
- nivel raíz: sector héroe «Platicar con KIBO» (doble ancho, centrado arriba), «Buscar», los rubros del usuario, «Travesura»
- nivel rubro (`{kind:'mod'}`): solo las acciones de ese rubro, en el color del rubro
- nivel travesuras (`{kind:'tricks'}`): «Sorpréndeme» fijo + lista de travesuras del juguete equipado (getKiboStyle().toy → kiboTricksFor), repartida en hojas parejas (máx. 11 por hoja)
- panel de formulario abierto (el disco no se renderiza)
- panel «Tu rueda» abierto (el disco no se renderiza)
- sin sector apuntado (active = -1): zona muerta dentro del cubo y fuera del anillo
- paginada (pages > 1: flechas + puntos; PageUp/PageDown)
- rótulos apagados (`labelsOff` cuando hay más de 12 sectores: solo íconos, el nombre lo dice el letrero)
- pista «Jálalo» visible 4.2 s y nunca más (localStorage kibo:taught-pull)
- cubo en arrastre (`pulling`) / rebote (`snap`) tras soltar
- freemium: en «Tu rueda», rubros no comprados en la sección «Se compran en la Tienda» con su precio en gemas (40 o 60)

## Comportamientos que hay que representar

- Apuntar = ángulo del cursor respecto al centro (sectorAt); onPointerMove pinta el sector activo, onPointerLeave lo apaga
- El clic calcula su propio sector (no depende del hover) para que funcione al tacto; pointerdown no-ratón también fija el activo
- Teclado: flechas mueven el sector activo, Enter/Espacio lo ejecutan, Escape hace back(), PageUp/PageDown cambian de hoja; role=menu + aria-activedescendant
- back() en cascada: formulario → personalización → nivel → cerrar
- Orden de rubros por lo pendiente de HOY (hábitos sin marcar, retos activos, tareas sin cerrar), desempate por uso guardado (kibo:qa-uses); 8 rubros por hoja
- Escucha `kibo:qa-run` (lo dispara el Buscador) y abre EL MISMO formulario/modal/acción instantánea; la petición se guarda en un ref para que el reinicio de apertura no se la lleve; llama onDemand() para abrir la rueda
- Escucha `kibo:qa-change` y se re-renderiza (compras, orden, activados)
- pickAction: si la acción tiene modal de plataforma (QA_MODAL) → openFullModal → cierra y dispara `kibo:open-modal {kind}` SOBRE la pantalla actual; si form === 'instant' → registra de golpe con su mensaje; si no → abre la burbuja de formulario
- done(msg, log, detail): calcula delta de vida (detail.hp, o +2 para habit/health/read/study), setHP, kiboLog({kind: log, label, detail}), lanza el toast con la ganancia (QA_GAIN) y un DESHACER que devuelve la vida y anota kiboLog({kind:'undo', of, label}); cierra la rueda
- bumpUse(modId) incrementa el contador de uso al registrar o al abrir un modal completo
- Jalar a KIBO: pointer drag escribe el transform y las variables CSS directo en el nodo (--bx/--by/--bs/--bsx/--bsy/--brot/--bo) para que el gesto no pase por React; al soltar rebota (snap) y dispara una travesura; el clic siguiente no dispara una segunda
- «Buscar» cierra y dispara `kibo:search`; «Platicar con KIBO» cierra la rueda y abre KiboChat (onChat)
- Desde la burbuja de formulario, «Formulario completo» cierra y dispara `kibo:navigate {screen, create}` según QA_FULL del rubro

## Lee de

- vitals (useVitals → mood para el blob del cubo)
- getHP()
- localStorage: kibo:qa-enabled, kibo:qa-owned, kibo:qa-order, kibo:qa-uses, kibo:taught-pull
- catálogo KIBO_QA_MODULES (11 rubros, 6 propios + 5 de pago)
- window.HABITS_DEMO (hábitos sin marcar), window.RETOS_DEMO (retos activos), window.DEMO_TASKS_FULL (tareas abiertas)
- getKiboStyle().toy y kiboTricksFor(toy) / window.KIBO_TRICK_LIST

## Escribe

- setHP(+delta) y setHP(-delta) al deshacer
- kiboLog({kind, label, detail}) con kinds: money-out, money-in, habit, health, read, study, note, mood, task, reto, watch, social — y kind:'undo' con `of`
- localStorage: kibo:qa-uses, kibo:taught-pull, kibo:qa-order, kibo:qa-enabled, kibo:qa-owned (vía qaOwn/qaSetEnabled/qaSetOrder)
- CustomEvent kibo:open-modal {kind: task|habit|entry|book}
- CustomEvent kibo:navigate {screen, create} y {screen:'store', tab:'unlocks'}
- CustomEvent kibo:search
- CustomEvent kibo:qa-change
- toast del FAB con {gain: {xp, coins, streak}} y callback de deshacer

## Conceptos del núcleo que toca

- shell
- KIBO
- fact record
- economy/ledger
- progression engine
- habit
- reto
- task
- identity

## Modales que se dibujan sobre esta pantalla

### Burbuja de formulario rápido de la rueda
- Se abre desde: KiboQuickWheel · pickAction() sobre una acción con `form`, evento kibo:qa-run disparado por el Buscador (buscador.jsx:160)
- Propósito: Panel compacto que sustituye al disco cuando se escoge una acción con formulario chico: el registro pasa ahí mismo, sin navegar al módulo. Lleva el color del rubro (--c).
- Campos: money-out / money-in (QaMoneyForm): monto `kbv-amount-input` con prefijo $ y sufijo MXN + chips de categoría (Comida/Transporte/Casa/Gustos o Nómina/Venta/Regalo) + chips de cuenta (Débito/Efectivo/Crédito) · goal (QaStepperForm): stepper «Abono» en MXN, inicio 500, paso 100 · habit (QaHabitForm): chips de hábito (Meditar 10 min, Leer 20 min, Salir a correr, Sin azúcar) · mood (QaMoodForm): 5 caras (Genial +3, Bien +1, Normal 0, Bajo −2, Mal −4 de vida) + chips de causa (Trabajo, Escuela, Salud, Gente, Dinero, Nada en particular) + textarea de una línea para el Diario · note / quote / task (QaNoteForm): textarea libre · read / pages (QaPickCountForm): chips de libro + stepper «Páginas» (KbStepper, inicio 12, paso 4) · episode (QaPickCountForm): chips de serie + stepper «Episodios» (inicio 1, paso 1) · done (QaPickForm rica): lista de tareas abiertas reales con ícono, área-color y meta (prioridad · proyecto) · reto (QaPickForm rica): lista de retos activos reales con ícono, color, «Día X de Y» y barra de progreso · friend (QaPickForm simple): chips Lucía / Diego / Sofía / Renata · weight (QaStepperForm): stepper «Peso» en kg, inicio 72, paso 1
- Acciones: rf-back — volver al disco · rf-x — cerrar la rueda · botón primario de guardado, con el verbo de cada forma: «Registrar», «Marcar hecho», «Registrar el día», «Guardar», «Marcar hecha», «Registrar día», «Enviar» · rf-more «Formulario completo» — solo si el rubro está en QA_FULL; cierra y dispara kibo:navigate {screen, create}
- Estados: botón de guardar deshabilitado hasta que hay valor válido (monto > 0, hábito elegido, cara elegida, texto no vacío, ítem elegido) · QaMoodForm colapsado: causa y nota solo aparecen tras elegir la cara · listas de tareas/retos vacías → cae a ejemplos fijos («Cerrar el reporte…», «Maratón de lectura…») · KbStepper ausente → cae a un `input type=number`
- Origen: `kibo-quick.jsx` 1070-1089 (cuerpos de formulario 186-410)

### Tu rueda — editor de la acción rápida
- Se abre desde: KiboQuickWheel · botón «Editar la rueda» (grip) de la `kbw-hubbar`
- Propósito: Panel ancho donde el usuario decide QUÉ rubros salen en el disco y en qué ORDEN; también es la vitrina de los rubros que aún no compra.
- Campos: Fila por rubro: flechas subir/bajar (`qc-move`), ícono, nombre y KbToggle de encendido · Separador «Guardados» — rubros tuyos pero apagados · Separador «Se compran en la Tienda» — rubros no comprados, con su precio en gemas (40 Entretenimiento/Amigos/Bóveda, 60 Salud/Estudio) · Texto guía: «Arrastra con las flechas para ordenar. El orden es el que verás en el disco.»
- Acciones: Subir / Bajar (deshabilitadas en los extremos) → qaSetOrder(activos + apagados) · KbToggle poner/quitar → qaSetEnabled · Botón de precio (gema + costo) → cierra y dispara kibo:navigate {screen:'store', tab:'unlocks'} · rf-back — volver al disco · rf-x — cerrar la rueda
- Estados: tres listas: encendidos (ordenables), guardados (apagados, no ordenables), bloqueados (no comprados) · flecha deshabilitada en el primero/último de la lista · KbToggle ausente → cae a un botón «Poner»/«Quitar»
- Origen: `kibo-quick.jsx` 1091-1160
