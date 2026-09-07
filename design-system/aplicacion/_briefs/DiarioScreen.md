# Diario

- **Artboard:** `DiarioScreen.dc.html`
- **Módulo:** Diario
- **Origen:** `screens-v2.jsx` líneas 3513-3797
- **Propósito:** Archivo personal: captura del día (mood + texto + dictado + foto + reflexiones), analítica de estado de ánimo en el tiempo, entradas de la semana y nube de palabras.

## Secciones, de arriba abajo

- Page head: eyebrow crumb('diario','Tu archivo personal') + H1 «Diario.» + InfoDot; acción secundaria «Entrada con fecha»
- KPI grid de 4 con icono: Entradas este mes (22, +3 vs Abril), Racha de diario (17 días, récord 31, icono pulsante), Mood dominante (Bien, 54% del rango), Días con mood 'bajo' (4)
- Tarjeta de captura: cabecera ('Lun 25 May · Captura del día', «Cuenta cómo te fue hoy.») + fila de moods (MOOD_OPTIONS)
- Captura izquierda: textarea 'Escribe lo que pasó', tira de dictado (botón 'Lector dictado' / 'Dictando…' + aviso 'Reconocimiento on-device · solo guarda texto, nunca audio')
- Reflexiones rápidas: 'Algo que agradezco', 'Algo que aprendí', 'Tags / personas'
- Captura derecha: zona de 'Foto del día' (clic o arrastrar, JPG/PNG, quitar/cambiar), botón «Guardar entrada · +15 XP» y nota 'Se guarda en local. La transcripción usa IA on-device.'
- Bloque 'Mood a lo largo del tiempo': tabs de rango (Semana/Mes/3 meses/Personalizado), rango de fechas si es personalizado, <MoodRadial> y leyenda con conteo y % por mood + línea de mood dominante
- Bloque 'Entradas de la semana': tarjetas por día (número+día, icono de mood, preview, miniatura de foto o —)
- Bloque 'De qué hablaste más': nube de palabras (15 términos con tamaño y color por área)
- Modales: CreateEntryModal, EntryDetailModal

## Estados que debe mostrar

- Mood seleccionado (default 'good')
- Transcribiendo (dictado emulado que va añadiendo párrafos al textarea) vs detenido
- Foto del día presente / ausente / zona en drag-over
- Rango 7d / 30d / 90d / custom (custom muestra el selector de fechas)
- Entrada abierta en modal

## Comportamientos que hay que representar

- Elegir mood del día
- Escribir la entrada a mano o dictarla (transcripción emulada por intervalos; se puede detener)
- Rellenar gratitud, aprendizaje y tags/personas
- Subir foto del día por clic o arrastrar-soltar; quitarla o cambiarla
- Guardar la entrada (+15 XP) — botón sin handler en el prototipo
- Cambiar el rango del análisis de mood y fijar un rango personalizado
- Abrir el detalle de una entrada de la semana
- Crear una entrada con fecha (CreateEntryModal; onSave vacío en el prototipo)

## Lee de

- MOOD_OPTIONS (compartido con widgets-v2)
- MOOD_COUNTS_30D (conteos mock del radar)
- DEMO_DIARY_ENTRIES (día, etiqueta, mood, hora, preview, foto, gratitud, aprendizaje, tags)
- KPIs mock

## Escribe

- Estado local de captura (mood, cuerpo, gratitud, lección, tags, foto)
- No persiste: 'Guardar entrada' y CreateEntryModal.onSave son stubs

## Conceptos del núcleo que toca

- fact record (entrada de diario, mood, foto, transcripción)
- progression engine (+15 XP, racha de diario)
- habit (racha)
- identity

## Modales que se dibujan sobre esta pantalla

### Detalle de entrada de diario
- Se abre desde: DiarioScreen — clic en una tarjeta de 'Entradas de la semana'
- Propósito: Lectura completa de una entrada del diario: mood y hora de registro, tags, foto del día, texto íntegro, reflexiones (gratitud y aprendizaje) y transcripción de voz.
- Acciones: Cerrar · Editar (botón sin handler en el prototipo) · Ir al diario del día (botón sin handler en el prototipo)
- Estados: Con foto ('Foto del día · ver completa') vs sin foto · Con reflexiones (gratitud y/o aprendizaje) vs sin ellas · Con transcripción de voz (solo la entrada del día 22 en el mock) vs sin ella · Con tags vs sin tags · Devuelve null si no hay entrada; tamaño lg
- Origen: `screens-v2.jsx` 3799-3886
