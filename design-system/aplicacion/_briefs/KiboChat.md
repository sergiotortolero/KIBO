# Chat inmersivo con KIBO

- **Artboard:** `KiboChat.dc.html`
- **Módulo:** shell / KIBO
- **Origen:** `kibo-quick.jsx` líneas 417-595
- **Propósito:** Conversación a pantalla completa donde el usuario cuenta el día (voz o texto) y KIBO lo convierte en registros confirmables. Ya no es una tarjeta sobre un velo gris: el chat ES el espacio — fondo profundo con luces que respiran, KIBO grande al centro y los mensajes sueltos a su alrededor.

## Secciones, de arriba abajo

- Velo `kbb-chat-veil` (clic fuera = cerrar)
- Fondo ambiental `kc-space` con tres luces (i.a / i.b / i.c)
- Diálogo `kbb-chat` (role=dialog, aria-label «Chat con KIBO») + botón `kc-x`
- Escenario `kc-stage`: KiboBlob de 168 px con el mood real de la vida + `kc-vitals` («Tu vida N · <tono>»)
- Registro `kc-log`: burbujas `kc-msg` (yo / kibo), tarjetas de propuesta `kc-props`, chips de desambiguación `kc-chips`
- Pie `kc-bar`: micrófono, input de texto, botón enviar

## Estados que debe mostrar

- mensaje inicial de bienvenida de KIBO
- escuchando (mic `live`, placeholder «Escuchando…»)
- sin dictado disponible (mic `off` con título «Tu navegador no soporta dictado»)
- enviar deshabilitado si el texto está vacío
- propuestas pendientes de confirmar (1..n tarjetas por mensaje)
- tarjeta en edición del número (`kp-edit`, input + unidad; Enter guarda, Escape cancela)
- pregunta de unidad (número suelto sin verbo): chips «N páginas leídas / minutos de estudio / pesos gastados / vasos de agua»
- pregunta de monto (verbo sin cantidad): chips $50/$100/$250/$500 + «Otro monto…»
- nada registrable: chips «Marqué un hábito / Leí un rato / Registré mi ánimo / Fallé en algo»
- propuestas vaciadas tras registrar (una a una o todas)

## Comportamientos que hay que representar

- Dictado con SpeechRecognition/webkitSpeechRecognition en es-MX con resultados intermedios; el botón alterna escuchar/detener
- Enviar con Enter o con el botón; say() pasa el texto por kiboRead y responde SIEMPRE (registros o UNA pregunta, nunca silencio)
- KIBO gesticula: 'wave' si pescó algo, 'mueca' si no, 'beso' al registrar uno, 'clap' al registrar todos
- Corregir el número de una propuesta la re-etiqueta desde KB_KINDS (corregir el valor corrige lo que dice la tarjeta)
- register(p): commit + saca la tarjeta de la lista y añade un mensaje de confirmación de KIBO
- registerAll(props): commit de todas + mensaje «Registré las N»
- commit(p): si kind === 'fail' → damageHP(8, label); si es habit/health/read/study → setHP(getHP()+3); si no es fallo → kiboLog({kind, label}); y lanza el toast del FAB
- Autoscroll fijado con requestAnimationFrame + un timeout de 140 ms porque las tarjetas crecen después del primer layout
- Escape cierra el chat

## Lee de

- useVitals (hp, tone.label, mood)
- getHP()
- kiboRead/kiboParse sobre el texto del usuario
- KB_KINDS (etiqueta, ícono, color y unidad canónicos por tipo)

## Escribe

- setHP (+3 en hábito/salud/lectura/estudio), damageHP(8) en fallo
- kiboLog({kind, label}) para money-out, money-in, read, habit, health, mood
- toast del FAB («… · registrado ✓»)

## Conceptos del núcleo que toca

- KIBO
- fact record
- progression engine
- economy/ledger
- shell
- habit
