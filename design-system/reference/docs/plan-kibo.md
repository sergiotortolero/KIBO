# Plan de trabajo — Kibo

Registro con **ID y estatus** de todo lo solicitado. `LISTO` = implementado y verificado ·
`EN CURSO` = en este bloque · `PENDIENTE` = aceptado, sin empezar.
Regla: nada se cierra sin verificación en vivo.

---

## A · Homologación al Design System (rondas 1–3)

| ID | Solicitud | Estatus |
|---|---|---|
| A-01 | Rediseñar Logros: jerarquía (vitrina/resumen → estandartes + últimos → catálogo) | LISTO |
| A-02 | SectionHead en Amigos, Personaje, Salud y Estudio | LISTO |
| A-03 | Botones secundarios en toda la plataforma (píldora tintada + solo-ícono) | LISTO |
| A-04 | Auditoría de modales; fundir CreateSharedRetoModal en CreateRetoModal | LISTO |
| A-05 | Detalle de tarea de Estudio = el de Tareas (homologado) | LISTO |
| A-06 | Créditos de Finanzas se quedan como tarjeta rica (decisión del usuario) | LISTO |
| A-07 | Galería de widgets y modal de regalo a KBVModal | LISTO |
| A-08 | 3 editores de texto libre homologados | LISTO |
| A-09 | KbTimeline compartido (Tareas + Proyectos) | LISTO |
| A-10 | KbStepper + kbv-daterange en lugar de input number/date sueltos | LISTO |
| A-11 | Barrido de hex sueltos → tokens | **LISTO** · `prestige-system.jsx` cerrado: 118 usos → 0. Familias nuevas `--kb-rank-*` (7 rangos celestes × 4 tonos), `--kb-mat-*` (9 materiales de emblema × 3), `--kb-parch-*`, `--kb-void-*`, `--kb-spark-*` y `--kb-ink-kibo`, todos generados desde la propia tabla (mismos valores) |
| A-12 | Fuentes: todo a Plus Jakarta / Inter / JetBrains Mono | LISTO |
| A-13 | Sin diálogos del navegador (confirm/alert/prompt) | LISTO |

**Nota A-11 (estado honesto).** Los literales *mezclados con tokens* ya se
cerraron: rareza de logros, ánimos de KIBO, complejidad, efectivo, acentos de
hábitos y módulos, verde de rendimiento, blancos de mezcla y los lavados de
tarjeta — con tokens nuevos **definidos** en `styles-extras.css`
(`--kb-rarity-*`, `--kb-good`, `--kb-good-soft`, `--kb-mood-*`).
El barrido se hizo **por patrón** (todo `#hex` de 6 dígitos en `app/*.jsx`), no
por lista: ya no quedan declaraciones a medias — cero `color-mix()` con hex
crudo y cero paletas mixtas (verificado).
Queda **pendiente**: los degradados de material de los emblemas de rango
(`prestige-system.jsx`, 9 materiales × 2–3 paradas) necesitan su propia familia
`--kb-mat-*`, el tinta de la cara de KIBO (`#08302E`) pide `--kb-ink-kibo`, y
las portadas cosméticas de la Vitrina son degradados **sancionados por el DS**
(decoración comprada), así que se quedan literales. Se dejan intactos a propósito: las paletas literales legítimas
(`pixel-hero.jsx`, colores de marca de bancos y plataformas, la hoja de
decisiones `opciones.jsx`) y los respaldos `var(--token, #hex)`.

## B · Plataforma y pantallas nuevas

| ID | Solicitud | Estatus |
|---|---|---|
| B-01 | Pantalla Cuenta (perfil, acceso, plan, sesiones, datos) | LISTO |
| B-02 | Pantalla Configuración (preferencias, notificaciones, juego, privacidad) | LISTO |
| B-03 | Pantalla Recursos (bóveda Markdown, wikilinks, backlinks, huérfanas) | LISTO |
| B-04 | Cuenta: facturación, pagos, datos fiscales | LISTO |
| B-05 | Cuenta: privacidad completa | LISTO |
| B-06 | Módulo Familia (padres): miembros, misiones, aprobación, mesada | LISTO |
| B-07 | Resumen de jugador visible en Amigos | LISTO |
| B-08 | Sidebar replegable + modo fijo/replegable en Configuración | LISTO |
| B-09 | PRD con análisis de compatibilidad Obsidian | LISTO |

## C · Tienda, economía y recompensas

| ID | Solicitud | Estatus |
|---|---|---|
| C-01 | Cofres: tooltip con garantizados/probabilidades (fuera del cuerpo de la tarjeta) | LISTO |
| C-02 | Cofres: ceremonia de apertura a pantalla completa con recompensas | LISTO |
| C-03 | Funciones comprables con gemas (15, en 4 grupos) | LISTO |
| C-04 | Widgets: catálogo agrupado por sección | LISTO |
| C-05 | **Cofres sin degradados — materiales sólidos** | LISTO |
| C-06 | **Materiales: 1 madera · 2 hierro · 3 oro · 4 mítico animado (color/contorno)** | LISTO |
| C-07 | **Bisagras atrás: la tapa se entreabre de atrás hacia adelante (el candado va al frente)** | LISTO |
| C-08 | **La animación se corta — arreglar el ciclo completo** | LISTO |
| C-09 | **Fondo de la ceremonia: menos “de kinder”; destellos de marca en vez de sol; círculo que se expande al final** | LISTO |
| C-10 | **Recompensas explícitas y NO solo cosméticas: descuentos en recompensas personalizadas, multiplicadores de XP por área, day-off sin perder racha, protectores…** | LISTO |
| C-11 | Rareza de recompensas personalizadas configurable al darlas de alta (backend decide si puede salir) | LISTO |
| C-16 | **Cofre reproporcionado**: cuerpo dominante, candado a 1/3 del frente, costura propia de la tapa y arte al 76% del lienzo | LISTO · cavidad limpia 26px, tesoro visible 26px (antes 8), solape tapa↔tesoro 26px→2px |
| C-12 | **Cofre frontal plano al estilo del referente: herrajes de esquina, duelas, placa de candado con bocallave, remaches; tesoro visible al abrir** | LISTO |
| C-14 | **Chispas rígidas: vivían DENTRO de `.cc-chest` y heredaban su sacudida y escala** | LISTO · ahora son hermanas del cofre y suben con desvío, escala y duración propios |
| C-15 | **No se veía el interior: la cavidad era una franja tapada por la tapa** | LISTO · cavidad con pared trasera y boca elíptica, tesoro que sube desde el fondo (gemas + monedas), luz que escapa del interior y apertura de 104°→128° |
| C-13 | **La ceremonia escala con la rareza**: madera 6 chispas / 1 aro / espera corta → mítico 20 chispas / 3 aros punteados / espera larga | LISTO |

## D · Divisas y marca

| ID | Solicitud | Estatus |
|---|---|---|
| D-01 | Moneda con la “K” de Kibo | LISTO |
| D-02 | Moneda: K más legible | LISTO |
| D-03 | **Gema → concepto nuevo científico** | LISTO · **Materia oscura**: fragmento facetado casi negro que no refleja la luz sino que la dobla — halo de lente gravitacional en dos aros y un solo destello en el borde. Contrasta a propósito con la moneda dorada. Copy unificado: divisa «materia oscura», unidad contable «fragmentos» |
| D-04 | Logo/ícono nuevo (marca + wordmark) | LISTO |
| D-05 | Renombre completo de la divisa a «materia oscura» / «fragmentos» en las 16 pantallas (antes solo Tienda y Cuenta) | LISTO · 0 apariciones de «gema» en el DOM de Inicio, Tienda, Áreas y Progreso |
| D-06 | Familia de tokens `--kb-dark-*` (núcleo, borde, halo, faceta, destello) para el glifo | LISTO · 0 hex sueltos en el JSX del glifo |
| D-07 | `parseWidgetCost`: regex tolerante al nombre viejo y nuevo + aviso en consola en vez de volver gratis un widget premium en silencio | LISTO |
| D-08 | El pill de materia oscura formatea miles (`24,000`, no `24000`) | LISTO · helper compartido `fmtNum()` en `kbv-shared.jsx` usado en los 3 pills (HUD, encabezado de Tienda, banda de Widgets), para que un pill nuevo no vuelva a nacer sin formato |

## E · KIBO — cuerpo, cara y cosméticos

| ID | Solicitud | Estatus |
|---|---|---|
| E-01 | Ojos más grandes | LISTO |
| E-02 | Fuera el párpado relleno; ceja = sombra de la deformación | LISTO |
| E-03 | **Ceja/sombra más tenue, siempre rodeando el contorno del ojo y siguiendo sus deformaciones (solo cuando aplique)** | LISTO |
| E-04 | Boca viva: tamaño, sitio, inclinación, besos y muecas | LISTO |
| E-05 | Ánimo derivado del HP (no sonríe siempre) | LISTO |
| E-06 | **La expresión se queda trabada — arreglar** | LISTO · resuelto con E-24 (`run()` ya no descarta gestos dentro de la ventana de 3.4 s y el keyframe se reinicia) |
| E-07 | **Mano-pies sin degradado (sólidas)** | LISTO |
| E-08 | **Mano-pies flotando separadas del cuerpo, siempre a los costados** | LISTO · órbita lenta desfasada (`bubOrbitR`/`bubOrbitL`, 9 s) animada sobre la propiedad `translate`, **no** `transform`: así compone con la escala en vez de machacarla y E-21 (manos ocultas en reposo) sigue en pie |
| E-09 | **Mano-pies que saluden moviendo la manita** | LISTO |
| E-10 | **Mano-pies que pateen la pelota** | NO APLICA · retirado por el usuario (9 ago 2026) |
| E-11 | **Cosméticos se rompen/recortan (sombrero) — deben sobreponerse; ampliar el área** | LISTO · sin recorte (`overflow`) + escenario a la huella completa (300×280) |
| E-18 | **Cosméticos recalibrados a la cara nueva (ojos 43px): lentes, moño, gorra, gorro, corona** | LISTO |
| E-19 | **Mano-pies más pequeñas y translúcidas (mismo gel del cuerpo, no un tono oscuro)** | LISTO |
| E-20 | **Mano-pies: z-index fijo por delante del cuerpo (ya no saltan atrás/adelante)** | LISTO |
| E-21 | **Mano-pies ocultas en reposo — solo salen con el gesto o el ánimo que las usa** | LISTO |
| E-22 | **Mano-pies se deforman con el cuerpo (mismo ciclo que `kbBlob`) y más separadas** | LISTO |
| E-23 | **Boca: amalgama entre la vieja y la nueva (trazo abierto con curva llena, escalas menos extremas)** | LISTO |
| E-24 | **La cara de la travesura salía siempre igual** | LISTO · tres causas encadenadas: ánimo fijo (`fire(null,'travieso')`), el pool de bocas gateado solo a `mueca`, y `run()` que descartaba en silencio todo toque dentro de la ventana de 3.4s de la travesura anterior (`busy.current`) dejando solo la cara del ánimo. Ahora: 4 ánimos, 6 bocas para toda travesura con cara visible, y el gesto del usuario **interrumpe** el que corre (timeout en ref + reinicio del keyframe) |
| E-12 | **Cosméticos se desfasan al moverse** | LISTO · `accBreathe` sincronizado con el ciclo de `kbBlob` (6.5 s) además de las travesuras |
| E-30 | **Mano-pies estaban al revés**: en `border-radius: A/B` los radios verticales grandes van a las esquinas INFERIORES; se invirtió el eje | LISTO · punta angosta arriba, masa ancha abajo |
| E-31 | **La pupila se pegaba al borde del ojo** | LISTO · recorrido acotado (±9 px) y dilataciones recalculadas; sangría mínima medida 10.8 px en los 8 ánimos |
| E-32 | **Ojos que se deformaban raro** | LISTO · los radios fijos en px de enfocado/cansado/travieso pasaron a proporcionales, y sus alturas mínimas subieron |
| E-13 | **Pupila que sigue el cursor cuando te acercas** | RETIRADO a pedido del usuario · la pupila expresa solo por ánimo |
| E-14 | **Más animaciones, según la personalidad equipada** | LISTO · 14 travesuras (zumbido, bostezo, guiño, mareo nuevas) + selector para elegir cuál |
| E-25 | **Zumbido: cuerpo que vibra y pupila dilatada casi al contorno del ojo** | LISTO · pupila 17→40×46 px medida |
| E-26 | **Mano-pies invertidas: punta angosta arriba, masa ancha abajo** | LISTO |
| E-27 | **Boca aún más delgada** | LISTO · caja 48→38 px, trazo 4.2→3.6 |
| E-28 | **Selector de travesuras en el anillo (pruebas y usuarios)** | LISTO · **dial paginado**: 7 por página en arco + flechas, puntos de página y «Sorpréndeme» al centro (no tabla) |
| E-29 | **Parpadeo desfasado (un ojo y luego el otro)** | LISTO · el parpadeo pasó de cada ojo al contenedor `.kbb-eyes`: una sola instancia, imposible desincronizar |
| E-15 | Personalidades comprables; Sereno = quieto de fábrica | LISTO |
| E-16 | Auras grandes (rebasan la silueta) + 3 nuevas | LISTO |
| E-17 | Pieles: degradadas arregladas (base sólida + gradiente en el cuerpo) | LISTO |

## F · KIBO — juguetes e interacción

| ID | Solicitud | Estatus |
|---|---|---|
| F-01 | Juguetes comprables (pelota, cubo, ukelele, plantita) | LISTO |
| F-02 | **KIBO interactúa de verdad: patea el balón** | LISTO · travesura `patada`: la manopié golpea (`bubKick`) y la pelota sale volando y regresa (`toyKicked`) |
| F-03 | **Toma el instrumento y canta — notas musicales saliendo de su boca** | LISTO · travesura `cantar`: 3 notas que vuelan desde la boca en teal/oro/rojo, boca cantando y ukelele acercado al cuerpo |
| F-04 | **Voltea a ver sus objetos** | LISTO · travesura `mirar`: cara y pupilas giran hacia el juguete, el cuerpo se inclina y el juguete reacciona |
| F-06 | Las travesuras de juguete solo existen si ese juguete está equipado (repertorio y dial dinámicos) | LISTO |
| F-05 | Juguete reacciona a las travesuras | LISTO |

## G · Acción rápida y asistente

| ID | Solicitud | Estatus |
|---|---|---|
| G-01 | Anillo radial (círculos del DS), no tarjeta | LISTO |
| G-02 | Dos niveles: al elegir rubro los demás se opacan/encogen y emergen acciones solo-ícono | LISTO |
| G-03 | Registro inline — nunca navegar al módulo | LISTO |
| G-04 | El anillo no se sale ni se corta; separaciones medidas | LISTO |
| G-05 | Rubros personalizables + comprables en Tienda | LISTO |
| G-06 | Chat de KIBO a pantalla opacada: voz/texto → qué entendió → confirmar | LISTO |
| G-07 | Proveedor de IA: reglas locales / API key propia / IA local (Ollama) | LISTO |
| G-08 | **“Léeme” no hace nada y KIBO desaparece** | LISTO · tres causas: la losa nunca recibía la clase `on` (quedaba `opacity:0`), `.reading` ponía el trigger en `opacity:0`, y su `color-mix` estaba corrupto (`var(--kb-canvas)fff`). Ahora la losa se ancla a la derecha y KIBO se encoge sin desaparecer |
| G-09 | Vida (HP) real: daño por dificultad, cura al cumplir, HUD vivo | LISTO |
| G-10 | KIBO reacciona a cada acción con objeto y frase | LISTO |

## H · Correcciones de verificación

| ID | Solicitud | Estatus |
|---|---|---|
| H-01 | Sidebar colapsado ocultaba 16 de 18 enlaces | LISTO |
| H-02 | Píldora de racha vacía al colapsar | LISTO |
| H-03 | Panel/anillo anclado al ancho real del sidebar | LISTO |
| H-04 | Segundo nivel del anillo se fusionaba / pisaba al vecino | LISTO |
| H-05 | Botones solo-ícono en blanco: dos sets de KIcon peleando el global | LISTO |
| H-06 | Glifos faltantes (`trending-down`, `info`) y `mood-ok`→`mood-meh` | LISTO |
| H-07 | Burbuja de registro atascada al cerrar el anillo | LISTO |
| H-08 | El ánimo del día no registraba nada (ahora cara + causa + nota + efecto en vida) | LISTO |
| H-09 | Responsividad: columna del menú fija y `min-width: 1280px` en la ventana | LISTO |
| H-10 | KIBO tapaba contenido (el FAB caía dentro de la columna) | LISTO |
| H-11 | Anillo recortado tras mover el FAB (arco reencuadrado + abanico corrido) | LISTO |
| H-12 | KIBO amputado contra el borde: se ancla por su huella visual y se escala al riel | REEMPLAZADO por H-14 |
| H-13 | Título del hábito a 2 líneas empujaba el pie fuera de la tarjeta (pista de alto fijo) | LISTO |
| H-14 | **KIBO nunca encima del menú, y se mueve con él** | LISTO · junto al riel, dentro de una canaleta propia |
| H-15 | KIBO no puede tapar contenido: `.kbv-main` cede una canaleta (`--kbb-gutter`) y el FAB vive en el padding-box, nunca en el content-box | LISTO · canaleta afinada a 104px (KIBO al 78%) para no comerse el ancho útil; 0 intersecciones |
| H-16 | Etiquetas del cronograma cortadas a media palabra (`overflow: hidden` sin `text-overflow`) | LISTO · elipsis + `min-width: 0`; 0 barras cortadas |
| H-17 | **KIBO a la esquina inferior derecha (preferencia del usuario)** con canaleta a la derecha y anillo espejado | LISTO |

---

## I · Vitrina y guardarropa (bloque A del handoff)

| ID | Solicitud | Estatus |
|---|---|---|
| 58 | **Tienda de cosméticos: previsualizar el ÍTEM, no el KIBO completo** | LISTO · `KiboSpecimen` (en `kibo-blob.jsx`): la piel es un chip de gel que ondea con su degradado real; la marca se recorta a **su** caja (`MARK_BOX`) y se ve sola a 42px sobre gel; el aura se dibuja sin cuerpo; la personalidad muestra su **firma de movimiento** (trazo + gota que lo recorre a su cadencia — plano = Sereno, zigzag = Juguetón). 32 fichas, ninguna repetida |
| 57 | **Auras Burbujas y Pétalos no se veían** | LISTO · causa raíz: el JSX solo emitía los `.star` para `au-estelar`, así que las otras dos tenían CSS completo y cero partículas. Ahora `AURA_PARTICLES` gobierna las tres. De paso las distancias de órbita/subida/caída son vars (`--orbit/--rise/--fall`): la misma aura sirve a 150px y a 52px |
| 62 | **Marcos: previsualizar el marco solo** | LISTO · aro de 46px sobre damero de transparencia, sin foto falsa debajo; «Sin marco» es un aro punteado |
| 63 | **Las píldoras de título se veían raras** | LISTO · el `align-self: flex-start` de `.vt-honor` peleaba con el centrado de la ficha y los títulos largos se salían; en el catálogo la píldora ya centra, envuelve y balancea |
| 64 | **Título personalizable (caro)** | LISTO · «Título a tu medida», 180 fragmentos: texto propio (≤22 letras, vía `usePrompt`) y 6 colores. Persiste en `kibo:cardTitleText` / `kibo:cardTitleColor` |
| 59 | **Borrar «Colab de marca»; animar el fondo dando protagonismo al elemento que nombra** | LISTO · portada colab eliminada del catálogo y del `defaultOwned`. Cada portada anima **lo que su nombre promete**: la aurora ondea, el sol baja, la marea sube, la niebla cruza los troncos, el pulso recorre la placa, los rayos giran. `CardBackdrop` es el único componente — tienda y carta muestran lo mismo |
| 60 | **Portadas nuevas: fósiles, dinosaurios, animales** | LISTO · **Ámbar** (insecto fósil en resina con la luz cruzándolo), **Jurásico** (dos saurios cruzando el valle, uno al fondo), **Manada** (aves en formación), **Arrecife** (banco de peces) |
| 61 | **Portada de color sólido personalizable** | LISTO · «Tu color», 220 monedas, 8 sólidos curados (paleta cerrada: un color libre acaba en portadas ilegibles bajo el texto blanco de la carta) |
| 65 | **Compañero: TU KIBO con el gesto que elijas** | LISTO · `KiboPet` usa el guardarropa real (piel, marcas, aura) y ya **no** recibe `mood` — el ánimo recoloreaba el gel y borraba la piel comprada. Lo que se compra es el **gesto**: saludar, echarse, hacer caras, bostezar, guiñar, mandar besos. Cada ficha descansa en su pose y arranca con fase propia, para que seis tarjetas no gesticulen al unísono |

### Revisión 2 del bloque A (feedback en vivo)

| Punto | Estatus |
|---|---|
| «El sol se ve un rectángulo girando» | LISTO · **causa raíz**: rotar una capa a sangre (`inset:0`) enseña sus esquinas. Ahora toda capa que rota es **cuadrada y sobredimensionada** (`.vt-fx.spin`), con máscara radial. Dorado es un sol con rayos, no un rectángulo |
| «La nebulosa no se ve como una nebulosa» | LISTO · nubes de polvo en `mix-blend-mode: screen`, núcleo encendido que late, carril oscuro y campo de estrellas detrás |
| «Los dinosaurios y animales: que sea un fósil, no animados» | LISTO · las tres portadas son **placas de fósil quietas** sobre piedra: **Jurásico** (esqueleto), **Huellas** (pisadas de terópodo), **Amonita** (amonita + trilobites). Solo la luz las recorre — un fósil lleva 100 millones de años quieto |
| Imagen personalizada | LISTO · portada «Tu imagen» (90 fragmentos): sube la tuya, 1200×360 px, guardada como data URL en `kibo:cardBgImage`, con tope de 1.8 MB y aviso claro |
| Color: HEX libre, no solo la paleta | LISTO · selector de color nativo + campo HEX escribible (validado) + los 8 atajos |
| KIBO estorbaba en «Mi progreso» | LISTO · el compañero se ancla **abajo a la derecha** en las seis poses; la esquina superior izquierda es del avatar y del título, la derecha del botón Editar |
| «Mejora todas las animaciones del fondo» | LISTO · aurora con máscara vertical, marea de tres bandas, niebla en dos capas, circuito con nodos, cosmos con banda galáctica, ámbar con destello lento |
| «No veo la personalización en Amigos» | LISTO · cada tarjeta de amigo **lleva su vitrina puesta**: portada propia, marco en el avatar, título y compañero. Cinco perfiles, cinco personalizaciones distintas |
| «Arriba no se ven las animaciones» | LISTO · el HUD monta el **mismo** `CardBackdrop` que la carta: si compras un fondo vivo, se ve vivo en el sitio que miras todo el día |

---

## J · Piel y tatuajes de KIBO (bloque B del handoff)

| ID | Solicitud | Estatus |
|---|---|---|
| 49 | **Pieles Chowder de verdad** — un lienzo animado que se vea *a través* de la silueta | LISTO · el cuerpo ya recortaba (`overflow:hidden` + `kbBlob`), así que las capas `.kbb-skinfx` viven **dentro** y solo se ven por la silueta. **Galaxia**: estrellas blancas, rojas, amarillas y azules, una galaxia girando y polvo a la deriva. **Lava**: grietas encendidas que laten y pedazos de roca que se deshacen y **se hunden**. **Cristal**: facetas y un destello que recorre el gel. Las fichas del catálogo montan las mismas capas |
| 48 | **Tatuajes: posiciones de rostro** | LISTO · frente, nariz, cachete izquierdo, derecho o **ambos** (dos instancias reales, no un espejo). El arte se recorta a **su** caja (`MARK_BOX`) y esa caja se coloca sobre coordenadas **medidas** en la cara real, en vez de arrastrar el lienzo entero |
| 47 | **Que se deformen con el gel y resalten** | LISTO · el envoltorio interior lleva el mismo `kbBlob` del cuerpo, así que el dibujo se estira y comprime con él en lugar de flotar rígido; tinta de .55 → .74 y sombra de contacto |

---

## K · KIBO y acción rápida (bloque C del handoff)

| ID | Solicitud | Estatus |
|---|---|---|
| 50 | **Chat inmersivo**: KIBO grande, fondo muy opaco con animación, chat integrado al espacio | LISTO · el chat dejó de ser una tarjeta sobre un velo gris. Ahora **es** el espacio: fondo profundo con tres luces que respiran, KIBO a 168 px presidiendo, mensajes sueltos en cristal esmerilado y la barra de escritura flotando. Sin marco, sin cabecera, sin caja. KIBO cede altura en ventanas bajas — la conversación es el contenido, él es el anfitrión |
| 51 | **Casuísticas de conversación** | LISTO · **varios registros a la vez** («pesqué 2 cosas» + botón *Registrar las 2*); **entrada ambigua** (un número suelto pregunta «¿30 de qué?» con opciones); **verbo sin cantidad** («gasté» → «¿de cuánto?» con montos); **corrección de lo entendido** (lápiz por tarjeta: editas el número y la etiqueta se rearma sola desde `KB_KINDS`); **nada detectado** → cuatro atajos en vez de un callejón sin salida |
| 52 | **Eliminar «Léeme»** | LISTO · fuera el nodo, la losa (`.kbb-slab`), el tecleo y el estado `reading` del FAB. La acción estelar del anillo se llama ahora **«Platicar con KIBO»** |
| 53 | **Dial: flechas → giro tipo teléfono de disco** | LISTO · las travesuras viven sobre una rueda completa y el **disco con agujeros** las trae y se las lleva al girarlo (arrastre, rueda del ratón o flechas del teclado, con imán a la muesca). Las de los extremos se desvanecen para decir «sigue girando»; el centro es *Sorpréndeme*. Las flechas no se entendían porque decían «siguiente», no «hay más» |

**Nota (petición en vivo).** KIBO es **gel: traslúcido siempre**, aunque la piel
esté animada — el lienzo vivo se ve *a través* de él, no lo vuelve un sólido
pintado. Y la piel Galaxia se quedó **solo con estrellas**: la banda de galaxia
y el polvo la ensuciaban.

---

## L · Producto y estructura (bloque D del handoff)

| ID | Solicitud | Estatus |
|---|---|---|
| 66 | **Quitar el análisis con IA** | LISTO · fuera el panel «Recomendaciones inteligentes» de Finanzas (cuatro tarjetas de consejo con etiqueta *Beta IA*). Prometía un juicio que el producto no tiene y ensuciaba la pantalla que sí funciona |
| 68 | **Familia como sección propia** | LISTO · vivía como cuarta pestaña del hub de Amigos, y ahí se leía como anexo del círculo social. La casa administra personas, dinero y permisos: ahora tiene su entrada en el menú (Personal), su encabezado, y una banda de resumen — cuántos son, cuántas misiones esperan tu visto bueno y cuánta mesada compromete la semana |
| 67 | **Detalle por materia** | LISTO · la tarjeta abre la materia completa, con las seis piezas en el orden en que se preguntan: **Resumen** (temario, pendientes, cuánto falta por calificar y qué necesitas para cerrar en 70), **Calificaciones por rubro** (cada rubro con su peso y sus entregas una por una), **Pendientes** (las mismas tareas del backlog, filtradas), **Calendario** (tus clases de la semana + las fechas que no se mueven), **Apuntes** y **Profesor** (correo, asesorías y cómo trabaja) |
| 69 | **Tareas = el backlog general** | LISTO · Tareas era otro tablero, hermano de Proyectos: mismas columnas, mismo gesto, ninguna respuesta a «¿qué sigue?». Ahora es el **backlog**: una lista con todo lo que debes —de un proyecto, de una materia, de un área o de nada— agrupada por **cuándo** (Hoy · Esta semana · Después · Algún día), con arrastre entre momentos, alta en una línea, y cada fila diciendo de dónde viene. Se puede releer agrupando por proyecto, área o prioridad. **Proyectos queda como agrupador**; el tablero y el cronograma siguen ahí como vistas |
| 56 | **El tesoro del cofre: monedas y materia oscura** | LISTO · el arte enseñaba cristales de gema (un material que ya no existe en la economía) y el copy hablaba de «fragmentos». Dentro del cofre hay ahora oro acuñado y esferas de obsidiana; los dos metales están **garantizados** y se declaran en la tarjeta, en el tooltip de probabilidades y en la ceremonia |

---

## M · Layout (bloque E)

| ID | Solicitud | Estatus |
|---|---|---|
| 54 | **Botón de replegar** | LISTO · era un disco de 24px flotando medio fuera del borde del menú: no se encontraba, no llegaba al mínimo táctil, y **por debajo de 1080px desaparecía** — justo donde el menú ya venía replegado y no había forma de abrirlo. Ahora es un control de 34px en la cabecera del menú, junto a la marca (apilado bajo ella cuando está en riel), con `aria-expanded`. En pantallas estrechas cambia de oficio: **abre el menú encima del contenido** (velo, etiquetas completas, se cierra al elegir destino o al tocar fuera), porque a ese ancho una columna de 232px ahoga la pantalla |
| 55a | **Responsive web (paso 1 de 2)** | LISTO · el problema no era falta de media queries sino **demasiadas, cada una con su ancho** (620, 700, 720, 860, 900, 920, 1000, 1100…): a 924px las tarjetas de insight de Áreas seguían en tres columnas de 130px porque su regla arrancaba a 920. Capa nueva al final de `kibo-shell.css` que aplica los **cuatro breakpoints del DS** (640 · 768 · 1024 · 1280) a todas las rejillas de pista fija y a las tiras que no envolvían. Auditoría de desbordes horizontales en 15 pantallas: de 8 pantallas con rejillas rotas a **cero**; lo que queda son elipsis de texto. Tableros y cronogramas se deslizan desde 1024 (antes solo desde 860, así que el kanban de Proyectos empujaba 197px) |
| 55b | **Móvil real (paso 2 de 2)** | LISTO · el teléfono no era la web encogida sino otro MODELO. (1) **Barra inferior** `.kbv-tabbar` — cinco destinos al pulgar; «Más» abre el mismo cajón del riel (no una lista paralela que se desincronice con las secciones que el usuario edita) y el lateral se retira del grid. (2) **Cabecera de dos filas, 114px**: `display: contents` sobre el grupo derecho suelta sus tres píldoras al flujo de la cabecera, así identidad + racha caben en un renglón y HP + monedas + materia en el siguiente — el HP **no** se oculta; lo que se va es la búsqueda (vive en el anillo de KIBO) y los protectores de racha. (3) **Hojas inferiores**: el velo era `position: absolute` dentro del shell, así que su borde inferior era el del documento y la hoja aterrizaba 125px bajo lo visible; anclado al viewport sube a su sitio, ancho completo y esquinas superiores redondeadas con asa. (4) **Piso táctil de 44px** en botones, chips, pestañas y enlaces — los campos conservan su contrato de 42px. (5) KIBO se sube por encima de la barra y suelta la canaleta lateral. |
| — | **Tweak «Vista»** | LISTO · una media query mide el VIEWPORT, no la caja donde se dibuja: encoger el shell nunca habría disparado la capa móvil. La vista de teléfono carga **esta misma página dentro de un marco** (que sí tiene su propio viewport) y le pasa pantalla, perfil, jefe y color por la URL. Tres tamaños: 390, 430 y tableta 834. |

---

## Orden del siguiente bloque

1. **55b · Móvil real** — el segundo paso del responsive, ya como experiencia de teléfono.

Decisiones del usuario para esos bloques: 69 = **rehacer Tareas como el
backlog** (Proyectos queda como agrupador) · 55 = **móvil real y web
responsive, en dos pasos** · 67 = el detalle de materia lleva las seis piezas
(resumen, calificaciones por rubro, pendientes, calendario, apuntes, profesor).

Fuera de alcance (no solicitados): tema oscuro, backend real del asistente, arte oficial de KIBO.

## Pendientes conocidos (no solicitados aún)

- Tema oscuro (decidido en el DS, no construido).
- Sustituir las reglas locales del asistente por el proveedor real cuando exista backend.
- Arte oficial de KIBO (lo actual es propuesta v1).


---

## Bloque IT-3 · deuda vieja de los documentos (9 ago 2026)

Cerradas las listas que quedaban abiertas fuera de los 23. La numeración es la
de `docs/pendientes-it3.md` y `docs/auditoria-ds.md`.

| ID | Solicitud | Estatus |
|---|---|---|
| IT3-1/2/4 | **Las gráficas de Finanzas no decían qué medían** | LISTO · causa raíz: Finanzas nunca adoptó las primitivas comunes (`progress-charts.jsx`) y arrastraba un `Sparkline`/`StackedFlow` propios, sin ejes y a 120px. Ahora hay un marco común (`FinChartFrame`): eje Y rotulado en pesos, eje X con los meses, rejilla, 210px de alto y aire interno. El texto va en **HTML sobre el trazo**, no dentro del SVG — estos lienzos se estiran (`preserveAspectRatio="none"`) y ahí dentro la tipografía se deforma. Los **marcadores de evento** dejaron de ser una leyenda suelta: cada hito se ancla a SU punto con tallo, pin y etiqueta. **Tendencia**: mínimos cuadrados sobre ingresos y gastos, punteada, en el tono de cada serie. |
| IT3-3 | **Periodo parametrizable en ambas gráficas** | LISTO · el filtro pedía Mes/Trimestre/Año y solo rotulaba: ninguna gráfica lo leía. Ahora se pide en **meses** (1 · 3 · 6 · 12 · Todo · Personalizado con rango de meses) y **manda sobre las dos series**, que se regeneran y aterrizan en el valor real de hoy. Los hitos se anclan a «hace N meses», así siguen cayendo en su mes y desaparecen si quedan fuera del rango. |
| — | **Patrimonio neto negativo** (hallazgo) | LISTO · la hipoteca supera a los activos: el patrimonio real es **−$1,157,880** y la serie vieja lo ignoraba (histórico positivo terminando en negativo). El dominio de la gráfica ahora incluye el cero, el área se ancla a esa línea y la serie viene «de peor a hoy» con cualquier signo. De paso: «$1263K» → **$1.26M** y el signo menos antes del símbolo de peso. |
| ADS-1 | **Reto = una sola entidad** | LISTO · `RetoWidgetLegacy` (60 líneas muertas en `dashboard-v2`) eliminado; el widget del tablero ya montaba `RetoCard compact`. Lo que faltaba era el **store**: `kbActiveReto()` vive junto a la pantalla de Retos y lo consumen el widget y el catálogo, que antes traían su propia copia del mismo reto — el tablero decía +480 XP y la pantalla +450. |
| ADS-8 / IT3 | **Barrido de hex sueltos** | LISTO · quedaban **345** literales (no 1,150: el número del documento venía de antes de los barridos). De esos, los que eran **UI** ya son tokens; un `var(--kb-canvas)7FA` roto en el onboarding —color inválido que ningún barrido anterior detectó— quedó corregido. Nuevo token `--kb-media` (acento de Entretenimiento) derivado de la paleta, no inventado. **Se quedan como hex, a propósito**: marcas externas (BBVA, Nu, Netflix, Spotify, Coursera, Udemy, Platzi, Google, Microsoft), arte de portadas/pósters/carátulas, arte de KIBO y de la vitrina, y el héroe pixel. |
| IT3 | **HUD: el chip del héroe encima el contador de XP** | LISTO · las dos filas del chip traían `min-width: auto`: al angostarse la cabecera nada podía encoger y el prestigio y el número de XP se salían de su fila. Ahora encoge el TEXTO y queda fijo lo que no debe deformarse. |
| AMD | **Auditoría de modales** | CERRADO desde el 1 ago (ver `docs/auditoria-modales.md` § Resultado): retos fundidos, detalle de tarea único, galería migrada a `KBVModal`. El encabezado del documento decía «pendiente IT-3» por descuido. |

**Decisión — paleta de color del usuario (ADS-8, segunda mitad).** Las 10
muestras de `opciones.jsx` (Menta, Índigo, Rosa, Coral, Ámbar, Lima, Pizarra,
Vino…) **se quedan como están**: son una paleta de elección del usuario, y el
DS solo define 5 áreas y 5 prioridades. Convertirlas en tokens sería inventar
diez colores de sistema que ninguna otra cosa usa.

---

## Rueda de acción rápida + KIBO consistente (10 ago 2026)

| ID | Solicitud | Estatus |
|---|---|---|
| — | **El KIBO del chat no se parecía al de la esquina** | LISTO · era el mismo dibujo con distinta cara: el chat montaba `KiboBlob` **sin `mood`**, así que se quedaba en 'calma' mientras el de la esquina reflejaba tu vida. Los tres (esquina, cubo de la rueda, chat) leen ahora `useVitals()`. |
| 53b | **Rueda estándar (GTA V / Fortnite)** | LISTO · el anillo era un arco de 92° con círculos de 50px: el blanco de clic era el círculo (había que perseguirlo), con más de seis destinos se encaballaban y por eso existía una paginación con flechas. Ahora es un **disco completo de sectores**: el blanco es el sector entero, se apunta con la **dirección del cursor** desde el centro (zona muerta en el cubo para no escoger nada), caben 13 destinos en 360° y la paginación desaparece. Segundo nivel = el disco se rellena con las acciones del rubro; el cubo hace de «volver». Las travesuras son otro disco (15 sectores) y, cuando pasan de 12, el disco se queda en íconos y el nombre completo lo dice el letrero — la convención de GTA. |
| — | **KIBO al centro al abrir** | LISTO · al tocarlo se mide su esquina contra el centro de la ventana y el cubo entra desde ahí con una transición sobre `transform` (no sobre layout). Mientras la rueda está abierta, la esquina queda vacía: KIBO está al centro, no duplicado. |
| 53c | **Pulido de bordes + páginas** | LISTO · los bordes «raros» eran cuatro **puntas de aguja** por sector: donde el arco corta el radio, un sector recto termina en pico, y a 1px de trazo se leen como suciedad. El filete se resuelve en la GEOMETRÍA (las cuatro esquinas del sector se redondean en el `path`), no con `stroke-linejoin`, que solo suaviza la unión del trazo y no la silueta del relleno. Con las esquinas redondas el contorno en reposo sobraba —sumaba una segunda línea junto al hueco—: fuera, y el disco gana una sombra suave que lo despega del fondo. **Páginas**: el disco se pagina por LEGIBILIDAD, no por falta de sitio (en 360° caben veinte sectores, pero pasando de doce ya no cabe el nombre). Reparto balanceado —15 travesuras salen 8 y 8, no 12 y 4— con flechas y puntos junto al letrero, `RePág/AvPág` en teclado, y las **anclas** (Platicar, Travesura, **Carpetas**) presentes en TODAS las páginas: son la razón de abrir la rueda, no pueden quedar en la otra hoja. |
| — | **Escala de la rueda** (hallazgo) | El factor `--k` era `clamp(.58, calc((100vmin - 48px) / 460), 1)`: dividir dos longitudes en `calc()` **no da un número**, así que el clamp mezclaba número y longitud e invalidaba en silencio **toda** declaración que lo usara — el letrero se quedaba encima de KIBO y la rueda nunca escalaba. Ahora el escalón va por media query, con números puros. |

---

## Rueda · comprar, gestionar y jalar a KIBO (10 ago 2026)

| ID | Solicitud | Estatus |
|---|---|---|
| 53d | **Los rubros de pago no se compraban** | LISTO · causa raíz: **dos listas que debían coincidir a mano y no coincidían**. `STORE_UNLOCKS` escribía los rubros de la rueda a pulso y solo traía dos de los cinco de pago — **Entretenimiento, Amigos y Bóveda no existían en ninguna parte donde comprarlos**. Ahora se DERIVAN de `KIBO_QA_MODULES`: un rubro con precio aparece en la tienda por el solo hecho de existir. Además la compra era un clic sin consecuencia: no cobraba, no confirmaba y la ficha nunca cambiaba de estado. Ahora cobra materia oscura, confirma, y la ficha queda «Desbloqueado». Y `qaOwn` **también lo enciende**: comprar un rubro es comprarlo para usarlo — marcarlo solo como «tuyo» lo dejaba fuera del disco y la compra se sentía rota igual. |
| 53e | **«Carpetas» deja de ser un sector: es el gestor de la rueda** | LISTO · configurar la rueda no es un destino más de la rueda. Bajo KIBO hay dos teclas: **volver/cerrar** y **⋯**, que abre *Tu rueda*: encender y apagar rubros, **ordenarlos** (el orden se guarda en `kibo:qa-order` y es el que verás en el disco) y ver los que faltan con su precio y su atajo a la Tienda. Con un sector menos, el disco pagina de 8 en 8. |
| 53f | **Tocar a KIBO = travesura, no navegación** | LISTO · «volver» colgaba del personaje: cada caricia era un salto de pantalla. Ahora tocarlo hace una travesura y la navegación tiene su propia tecla. |
| 53g | **Jalar el gel** | LISTO · al arrastrar sobre KIBO el cuerpo se estira HACIA el cursor (y adelgaza en el eje perpendicular — conservar volumen es lo que lo hace ver blando y no elástico) y al soltar rebota con una travesura. El `transform` se escribe directo en el nodo: un re-render de React por cada `pointermove` convierte un gesto continuo en una animación a saltos. |
| — | **Dónde ocurren las travesuras** | Dentro del dial. Elegir una del disco ya no cierra la rueda para que pase en la esquina: se ve en el cubo y puedes encadenar otra. **Fuera** del dial KIBO solo hace las suyas según la personalidad comprada (su ciclo `idle`). |

| — | **Widgets de ancho cero al angostar** (regresión de 55a) | LISTO · el tile escribía su tamaño **en línea** (`grid-column: span 4`), así que ninguna media query podía acotarlo. Al bajar la rejilla a 2 pistas, un span de 4 **no se recorta**: crea dos pistas IMPLÍCITAS, que sin tamaño miden 0, y con `grid-auto-flow: dense` los `w-1` siguientes caen dentro y salen a cero de ancho. La colocación volvió al CSS (clases `w-*` / `h-*`) y cada escalón responsive acota los spans donde reduce las pistas. Es la misma invariante del handoff («4 pistas fijas») rota por el otro lado: no cambiar el número de pistas sin acotar los spans. |

---

## Lote de arreglos chicos (11 ago 2026)

| ID | Solicitud | Estatus |
|---|---|---|
| 70 | **Catálogo de animaciones de KIBO** | LISTO · turno 3 de `Kibo Opciones de componentes.dc.html`: 7 grupos, 35 KIBOs **vivos** (no capturas) con su identificador debajo y botón de repetir en las travesuras. Incluye ánimos, auras, pieles animadas, personalidades y las animaciones «siempre encendidas» (respiración, flotar, parpadeo, mirada, boca, manopies, sombra). Sirve para dar retro por id. |
| 71 | **El menú lateral no se podía fijar** | LISTO · dos fallas encadenadas: (1) las prefs se leían de `localStorage` en cada render pero **nada avisaba de un cambio**, así que la opción decía «se aplica al recargar»; ahora hay un evento `kibo:prefs` y un hook `useKbPrefs`. (2) El riel por debajo de 1080 es **CSS**, y ninguna decisión de JS podía deshacerlo: el menú fijado se quedaba en 76px. El shell marca `side-pinned` y la capa responsive lo excluye. Además se fija **desde el propio menú** (chincheta), que es donde estás cuando te estorba, no enterrado en Configuración. |
| 72 | **El botón de replegar no se entendía** | LISTO · era un círculo con una flecha; ahora dice «Replegar» mientras el menú está abierto y se queda en ícono solo en el riel. |
| 73 | **El registro se perdía de pantalla** | LISTO · dos causas. (1) El aviso se anclaba al borde IZQUIERDO del FAB, que vive pegado a la derecha: cualquier frase larga se salía del viewport. (2) Más grave: el **comentario de KIBO** llegaba medio segundo después y **reemplazaba el recibo**. Son dos cosas distintas — el recibo manda y el comentario se le suma como segunda línea. |
| 74 | **Deshacer un registro** | LISTO · todo registro mueve vida y XP y no había vuelta atrás. El aviso trae «Deshacer» 5.6 s: devuelve el HP y anota la reversión. (El deshacer se perdía en el cable: el envoltorio del toast solo pasaba el mensaje, no la función.) |
| 75 | **La compra no se notaba** | LISTO · destello y sello «Desbloqueado» animado al pasar a tuya, y cada grupo dice **cuántas son tuyas** de cuántas. |
| 76 | **Jalar a KIBO: chipote, no estirar todo** | LISTO · antes se escalaba la silueta entera (se veía elástico). Ahora el cuerpo apenas se va tras el cursor y lo que se deforma es un punto: un **chipote** con el mismo gel que nace en el borde y se aleja con el jalón. Vive fuera del cuerpo para que su silueta no lo recorte. |

---

## Personalización como sección propia (11 ago 2026)

| ID | Solicitud | Estatus |
|---|---|---|
| 77 | **Personalización, separada de Mi progreso** | LISTO · «Mi progreso» se queda con lo que MIDES (perfil, estadísticas, logros) y la nueva sección con lo que DECIDES. Cinco pestañas: **KIBO · Carta · Prestigio · Divisas · Interfaz**. Las dos primeras **reutilizan** los tabs que ya existían en la Tienda (`KiboStyleTab`, `VitrinaStoreTab`) en vez de duplicarlos — estaban privados y solo hizo falta exportarlos. Vive en el menú, entre Amigos y Tienda. |
| 78 | **Prestigios personalizables y vendibles** | LISTO · los 16 se llamaban «Cadete Estelar → Gran Almirante»: un escalafón militar, una lectura muy concreta del mérito. El nombre pasa a ser **cosmético** y la lógica sigue siendo el número. **7 familias** (Escalafón estelar, Estaciones, Cosmos, Maestrías, Mitología, Minimalista, Neutro), dos gratis y el resto en paquete; más **«escribe los tuyos»** (los 16, 400 de materia). Donde se muestran va **P{n} · nombre**, así renombrar no borra la referencia. |
| 79 | **Divisas personalizables** | LISTO · nombre, glifo y color de materia oscura y monedas, con el glifo activo animado. La economía no se entera: siguen valiendo y ganándose igual. |
| — | **Interfaz** | Menú fijo/replegable, densidad y atajos a lo que se configura en su propio sitio (widgets, rueda, Configuración). |

| 80 | **Buscador general** | LISTO · una CAPA, no una pantalla: se abre con ⌘K/Ctrl+K, desde el enlace del menú y desde su sector en la rueda. Indexa acciones rápidas, tareas, hábitos, retos, libros y pantallas (las pantallas salen del **mismo** menú, no de una lista aparte). El índice se arma al abrir, no al arrancar: los datos cambian y un índice congelado envejece sin que nadie se dé cuenta. **Un resultado te lleva; una acción rápida se ejecuta ahí mismo** y abre EL MISMO formulario de la rueda vía `kibo:qa-run` — no una copia. En blanco muestra lo último y lo que sueles registrar. |

| — | **La divisa personalizada no salía de su pantalla** | LISTO · cada sitio dibujaba `CoinIcon`/`GemIcon` a mano, así que renombrarla o recolorearla solo cambiaba su propia vista previa. Dos ayudantes (`curLabel` / `curGlyph`) son ahora el único camino por el que se muestra una divisa, y el HUD se repinta con `kibo:currency-change`. |
| — | **El prestigio tenía dos nombres a la vez** | LISTO · `character-screen` calculaba el «próximo destino» leyendo `CELESTIAL` directo, así que la misma pantalla decía «Oro II» arriba y «Almirante» abajo. Ahora el nombre sale de `prestigeName()` y el `sub` sigue siendo el del viaje. |
| — | **Token `--kb-void` inexistente** | LISTO · la familia definida es `--kb-void-1/2`; el glifo por defecto de la materia oscura pintaba casi negro por heredar el color de texto. |

| — | **La acción pedida desde el buscador abría la rueda en su portada** | LISTO · `openWheel()` cambia `open`, y el efecto de reinicio ligado a `[open]` corría **después** del manejador de `kibo:qa-run`, borrando el nivel y el formulario recién fijados. La petición se guarda en un ref y es el propio reinicio quien la aplica. |
| — | **El sector «Buscar» nunca llegó a la rueda** | LISTO · la edición anterior apuntaba a un texto que ya no existía (`replaceText` no falla, simplemente no hace nada). Ahora se verifica el efecto de cada reemplazo, no solo que el script corriera. |
| — | **«Platicar con KIBO» con más presencia** | LISTO · los sectores dejan de medir todos lo mismo: cada uno declara su peso y la acción estelar ocupa el **doble**, centrada arriba (el origen del arco se corre media porción para que quede centrada, no empezando ahí). |

---

## Cierre de pendientes (11 ago 2026)

| ID | Solicitud | Estatus |
|---|---|---|
| 81 | **Reutilizar los formularios reales, no duplicarlos** | LISTO · el formulario de la rueda se queda con el registro de tres segundos y gana un escape: **«Formulario completo»** entrega lo escrito a la pantalla dueña vía el contrato de navegación que YA existía (`navDetail.create`, que las pantallas honran desde antes) — inventar una segunda llave para lo mismo habría sido el error. `QA_FULL` mapea rubro → pantalla. |
| 82 | **La rueda ordena por tu día** | LISTO · el catálogo estaba en orden de escritura, que no dice nada de tu día: si hay tres hábitos sin marcar, ese rubro no puede quedar en la segunda hoja. Ordena por pendientes de hoy y empata por uso (que se aprende al registrar). |
| 83 | **De dónde salió cada moneda** | LISTO · el historial contaba el qué pero no el porqué. Cada movimiento declara su **origen** (hábitos, tareas, retos, cofres…), arriba se resume por origen de mayor a menor y se puede filtrar. De paso, el historial pasó a los glifos personalizables. |
| 84 | **Enseñar el jalón** | LISTO · el gesto no se descubre solo. Una flecha con «Jálalo» sale del cubo la **primera** vez y se calla para siempre: una pista que vuelve cada día es ruido. |
| 85 | **Presets del tablero** | LISTO · **Mañana / Trabajo / Noche** reordenan y agrandan lo que ya tienes; nunca añaden un widget que habría que comprar. El elegido se recuerda y se aplica al entrar. |
| 86 | **«El fracaso reencauza»** | LISTO · la promesa de marca solo sabía restar vida. Al fallar, KIBO ofrece una versión **más pequeña** del compromiso (la mitad, solo empezar, partirla en dos…) y devuelve **la mitad del golpe** si la aceptas; y un **día de gracia** por semana que salva la racha. El día de gracia **no se compra** a propósito: si se comprara dejaría de ser una red y sería otra moneda. |
| — | `moon` no existía en el set de íconos | LISTO · un nombre inexistente dibuja vacío; el preset de noche habría salido sin glifo. |

**Pendientes del bloque de mejoras que ya estaban hechos:** deshacer en el toast (`done()` ya construía el undo), nivel junto al nombre del prestigio (P{n} · nombre), buscador en blanco con lo reciente, y KIBO reaccionando por el bus `kibo:action`.

| 87 | **KIBO se atascaba en un gesto** | LISTO · tres agujeros por los que la clase de travesura se quedaba puesta: el efecto dependía de `run`, que se recrea al cambiar personalidad o juguete y **volvía a disparar el mismo token** en bucle; el temporizador de limpieza vivía en una propiedad suelta del ref y quedaba huérfano al recrearse; y si se perdía, nada devolvía a KIBO a su reposo. Cerrados los tres: token ya atendido, temporizador en su propio ref y `animationend` como red. |
| 88 | **Talla mínima de KIBO** | LISTO · `KIBO_MIN = 132` en el propio componente: por debajo la cara deja de leerse. Las marcas de logotipo (auth, wordmark) se declaran `asMark` y quedan fuera. El cubo de la rueda se pide con holgura (×1.24) porque la rueda entera se escala para caber — el piso es un mínimo **renderizado**, no nominal. El FAB pasa a talla real y la canaleta crece a 150px: la regla «KIBO nunca tapa contenido» se cumple ensanchando el hueco, no encogiendo al personaje. |
| 89 | **Boca chica más fina, en «w» curveada** | LISTO · trazo de 3.6 → 2.9 y el reposo pasa de un arco simple a dos bombas cortas; a este tamaño un arco se leía como una raya. |
| 90 | **El jalón: mismo color, más recorrido, rebote de gelatina** | LISTO · el chipote es opaco a propósito (dos figuras al 55% que se solapan componen ~80% y dejan costura), así que su color es el gel **ya mezclado con lo que tiene detrás** — y ese «detrás» pasa a ser un contrato (`--kbb-behind`) en vez de un supuesto; además el **aura se apaga al jalar**, que era lo único que hacía el fondo distinto bajo el cuerpo y bajo el chipote. El recorrido casi triplica (30+74·mag) y la masa **adelgaza** al estirarse. Al soltar: rebote con sobrepaso, temblor de gelatina y dos ondas que se expanden. |

---

## Retro de Sergio (11 ago 2026)

| ID | Comentario | Estatus |
|---|---|---|
| 91 | **La acción rápida no debe sacarte de tu pantalla** | LISTO · KIBO abre ahora los formularios **reales** de la plataforma (`QuickActionRouter`, que ya existía) encima de donde estés. El FAB vive fuera de `.kbv-main`, así que el modal se monta sobre cualquier pantalla sin que ninguna tenga que saber de KIBO. Un solo sitio decide qué pasa al escoger una acción (`pickAction`): instantánea, modal real o formulario chico — tenerlo repetido en la rueda y en el manejador del buscador era la vía segura a que se desincronizaran. |
| 92 | **«Nueva tarea» pedía el widget ya desarrollado** | LISTO · las acciones de CREAR (tarea, hábito, entrada de diario, libro) abren su modal completo; las de REGISTRAR (vaso de agua, páginas, gasto) siguen en la rueda, que es donde ganan. Reinventar el formulario en miniatura dejaba registros a medias y dos formularios que mantener. |
| 93 | **El acceso directo, con más presencia** | LISTO · era una nota al pie que te mandaba a la pantalla; ahora es un botón secundario que abre el formulario completo de esa acción. |
| 94 | **Elegir reto/tarea, más visual** | LISTO · la lista sale de los datos **reales** (retos activos, tareas abiertas) con el ícono y color de su rubro, en qué día va el reto y su barra de avance. Una lista inventada dentro de la rueda se queda vieja en cuanto el usuario toca su pantalla. |
| 95 | **Aviso sin animación** | LISTO · gustó cómo se ve, sobraba el movimiento: fuera el despliegue en dos tiempos, el barrido dorado y los rebotes. La información se queda igual. |
| 96 | **Sombra blanca en los ojos** | LISTO · la pupila se pintaba a opacidad <1 sobre la tinta, así que el negro se transparentaba a través del blanco. Blanco sólido en todos los ánimos; lo que expresa cansancio o tristeza es el TAMAÑO y la posición, no un blanco a medias. |
| 97 | **El WIP tenía demasiada presencia** | LISTO · la banda con su frase explicativa se va; queda un engrane que abre **Configurar el tablero**: límite por columna, qué campos enseña cada tarjeta y el tiempo por complejidad. De paso se arregla que el límite dependiera de si el panel estaba abierto — ocultar la configuración apagaba la regla. |

| 98 | **Detalle de tarea como pantalla, con histórico** | LISTO · `app/tarea-detalle.jsx`: ruta `tarea`, el **destino canónico** de cualquier enlace a una tarea (tablero, proyecto, buscador, KIBO). Dos columnas — izquierda para trabajar (descripción, pasos, subtareas, histórico, nota), derecha para consultar (meta y recompensa) — sobre `kbv-card` + `SectionHead`. El **histórico** deriva del estado real de la tarea (una tarea hecha no muestra una historia a medias) y cada evento declara su tipo, así que añadir uno nuevo no obliga a tocar la vista; se filtra por tipo y acepta notas. El modal sigue existiendo para editar de pasada y gana la salida «Ver pantalla completa». |
| 99 | **ProjectDetail al DS + enlaces** | LISTO · `kbv-fin-card` con encabezados a mano → `kbv-card` + `SectionHead`; el vacío usa `EmptyState`. Las tareas ligadas eran texto muerto: ahora cada fila lleva a su pantalla. |
| 100 | **Cronograma v2** | LISTO · el roadmap gana **alcance**: todos los proyectos, o uno solo y sus tareas — un cronograma que solo hace zoom-out obliga a cambiar de pantalla para ver el detalle. Cada barra es un destino (proyecto → su detalle; tarea → su pantalla) y la etiqueta de proyecto tiene un atajo a sus tareas. Además el proyecto lleva **su propio cronograma dentro de su pantalla** (`ProjectScheduleCard`), que es donde se pregunta «¿cómo va esto?». |

---

## Cronograma explorable + pantallas con el lenguaje de Áreas (12 ago 2026)

| ID | Solicitud | Estatus |
|---|---|---|
| 101 | **Cronograma de verdad explorable** | LISTO · `app/kb-gantt.jsx`. `KbTimeline` repartía el periodo en **cubetas fijas** (1m/3m/6m): sirve para mirar, no para explorar — sin ese cambio de modelo no hay zoom continuo posible. `KbGantt` pone el eje en **tiempo real sobre píxeles**, así acercarse, moverse y arrastrar fechas son la misma aritmética y no tres casos especiales. Rueda/pinza = zoom **anclado al cursor** (sin ancla, acercarse tira el contenido fuera de la vista) · arrastrar el lienzo para moverse · − / + / «Todo» · línea de HOY con botón «Hoy» · **mini-mapa** con ventana arrastrable · doble clic en una barra = acercarse a su rango. La granularidad de las marcas la decide el ancho del periodo, no un selector: acercarse revela detalle por sí solo (mes → semana → día). |
| 102 | **Acercarse a un proyecto** | LISTO · doble clic acerca el lienzo a su rango **y** despliega sus tareas como sub-filas; **varios proyectos** pueden estar abiertos a la vez, cada uno se pliega y despliega desde su etiqueta. |
| 103 | **Mover fechas arrastrando** | LISTO · y **opcional**, como pediste: mientras «Editar fechas» esté apagado, arrastrar solo mueve el lienzo. Un mismo gesto no puede significar dos cosas; con el modo encendido la barra se queda el gesto (mueve) y sus bordes estiran la duración, con la fecha resultante a la vista. |
| 104 | **Las pantallas nuevas, con el lenguaje de Áreas** | LISTO · tarea y proyecto adoptan el patrón que ya funciona: **encabezado tintado** con el color del área (ícono grande, migajas, y a la derecha lo que se gana o el avance), **pulso** de cinco celdas arriba, y **pestañas** — Detalle · Pasos · Histórico en la tarea; Resumen · Tareas · Cronograma · Configuración en el proyecto. Los hitos del proyecto usan la misma línea de hitos del área. |
| 105 | **Configuración del proyecto** | LISTO · pestaña propia: identidad (nombre, meta, descripción, etiquetas), área y color, complejidad y prioridad, fechas, quién lo ve, y archivar o borrar. Un proyecto vive meses; el modal de alta dura un minuto. |
| 106 | **Tocar el área lleva a su nivel** | LISTO · el salto respeta desde dónde entras: tarea y proyecto → área en **Proyectos** (que en Riqueza se llama «Finanzas» y en Voluntad «Retos y hábitos», porque la jerarquía es la del área). La pestaña viaja en la ruta (`{screen:'areas', area, tab}`) y el detalle del área la acepta como inicial. Los chips de área del tablero, que eran texto, ahora navegan. |

| 107 | **Tareas homologada a Proyectos** | LISTO · el conmutador de vistas era un segmento apretado dentro de las acciones del encabezado; pasa a la **fila de pestañas** (Backlog · Tablero · Cronograma) que ya usan Proyectos y los detalles. La edición de columnas sube al **engrane del encabezado**, donde Proyectos tiene el suyo, y desaparece la barra propia que colgaba sobre el tablero. |
| 108 | **El cronograma de Tareas, al explorable** | LISTO · misma `KbGantt` que el roadmap. Las fechas de una tarea salen de su **momento del backlog** (hoy / esta semana / después / algún día) o de su fecha límite si la tiene — un hash del id daba barras deterministas pero sin significado. `KbTimeline` quedó sin un solo uso y se **borró** (componente + tokens + CSS): dos cronogramas conviviendo obligan a elegir mal en la próxima pantalla que necesite uno. |

| 109 | **Comprar un slot de área** | LISTO · la tarjeta hablaba de «materia oscura» y «fragmentos» en texto fijo y pintaba un rombo con degradado azul-violeta y cuatro hexes a mano: ignoraba la divisa que el usuario eligió y contradecía el sistema (la capa de gamificación no usa degradados). Ahora **nombre, glifo y color salen de la divisa activa**, dice si te alcanza antes de mandarte al formulario (con confirmación y el saldo resultante), y el clic anidado desaparece: la tarjeta ya no es un botón con otro botón dentro. |
| 110 | **Catálogo de hábitos → lista de gestión** | LISTO · había **dos** sitios para marcar el mismo hábito (el widget de hoy y las tarjetas del catálogo), y de ahí venía que el catálogo se sintiera accionable. Ahora es una lista sin un solo control de marcado: buscar, ordenar (mi orden con arrastre, nombre, racha, cadencia), editar, borrar y **activo/pausado** — que es estado, no acción. Un hábito pausado desaparece de lo de hoy pero sigue en la lista; si siguiera pidiendo check, pausar no significaría nada. La tarjeta de catálogo quedó sin uso y se borró. |

---

## Tienda y Mi progreso: cada pantalla, una promesa (14 ago 2026)

| ID | Cambio | Estatus |
|---|---|---|
| 111 | **La Tienda suelta los cosméticos** | LISTO · la decisión «Personalización lo hace todo; la Tienda se queda con cofres, recompensas reales y funciones» nunca se ejecutó del lado de la Tienda: sus pestañas *Kibo cosmético* y *Vitrina* montaban **los mismos componentes** que Personalización. Dos pantallas vendiendo lo mismo es la duplicación que nos costó regresiones (el conteo de tareas, el avance del proyecto, la divisa que no salía de su pantalla). Ahora la Tienda es **economía real** — cofres, recompensas que tú defines, funciones, módulos, widgets y la lista de deseos — con un puente visible hacia Personalización. Un enlace viejo con `tab: 'kibo'` aterriza en Módulos, no en una pantalla en blanco. |
| 112 | **Mi progreso, solo perfil y estadísticas** | LISTO · la carta pasa a **lectura** con un botón «Personalizar» que lleva a Personalización → Carta; el editor de insignias fijadas se muda allá, junto a portada, marco, título y compañero — elegir qué presumes es decidir cómo se ve tu carta. De paso, la pestaña Carta gana la **vista previa real** que le faltaba: la misma carta, editable. Y la **lista de deseos** se va a la Tienda: apartar monedas hasta que una función se compre sola es economía, no una lectura de cómo vas. |
| — | **Enlace roto** | LISTO · `goVitrinaTienda()` apuntaba a `{screen:'store', tab:'vitrina'}`, una pestaña que acababa de desaparecer. Ahora va a Personalización → Carta, que es donde se compran las casillas. |

---

## Móvil de verdad — el paso 2 del responsive (15 ago 2026)

| ID | Cambio | Estatus |
|---|---|---|
| 113 | **La capa responsive medía la pantalla equivocada** | LISTO · los 68 saltos (`kibo-shell.css` + `styles-extras.css`) consultaban el **viewport**, pero la app no ocupa el viewport: vive dentro de `.kbv-window`. En un teléfono ambos coinciden —por eso «funcionaba»— pero cualquier ventana más angosta que la pantalla (la vista previa, un embebido, una pantalla partida) se quedaba con el layout de escritorio apretado, y no había forma de verificar el móvil sin un teléfono. Ahora `.kbv-window` es un **contenedor de consulta** (`container: kbwin / inline-size`) y todos los saltos miden esa caja. El JS del shell dejó de leer `window.innerWidth`: mide el shell con `ResizeObserver`, o el riel y las hojas se contradicen. |
| — | **La rueda no escalaba** | LISTO · la conversión mecánica dejó tres reglas inválidas: `@container` no acepta listas por coma y un contenedor de `inline-size` no se puede consultar por ALTO, así que las tres se descartaban en silencio y la rueda salía a 420px en un teléfono de 390. El ancho es del contenedor; el alto sigue siendo del viewport, que es lo correcto — la rueda está anclada a la pantalla. |
| — | **Las barras de filtro desbordaban** | LISTO · `flex-wrap: wrap` reparte los BLOQUES de la barra, pero cada bloque seguía siendo una fila rígida (448px dentro de 366). En el escalón de teléfono los bloques también se parten y sus hijos encogen (`min-width: 0`), y lo que no cabe partido se desliza en vez de empujar la pantalla. |
| — | **Verificado a 390px** | Menú retirado · barra de cinco destinos al pulgar · cabecera de dos filas (126px) con el buscador como botón de 44px · tablero a una columna sin widgets aplastados · **cero** desbordes en Inicio, Hábitos, Tareas y Áreas. |
