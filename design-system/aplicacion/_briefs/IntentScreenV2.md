# Prioridades / Intención — '¿Qué es lo más importante para ti ahora?'

- **Artboard:** `IntentScreenV2.dc.html`
- **Módulo:** acceso / onboarding paso 3
- **Origen:** `onboarding-v2.jsx` líneas 388-511
- **Propósito:** Multi-selección de hasta 5 intenciones que siembran los widgets por defecto y el énfasis del sidebar en el dashboard. Es el mecanismo de personalización inicial del shell.

## Secciones, de arriba abajo

- Header de OnboardingShell: 'Paso 03 / 03' + stepbar (401)
- Título '¿Qué es lo más importante para ti ahora?' + subtítulo 'Elige hasta 5. Con esto armamos tu dashboard inicial…' (401-403)
- Grid de 3 columnas con 12 tarjetas seleccionables de INTENT_OPTIONS: Ordenar mi vida, Construir hábitos sólidos, Cortar malos hábitos, Llevar mis finanzas, Avanzar en mi trabajo, Mejorar mi salud, Aprender algo nuevo, Estudiar de verdad, Mejorar mis relaciones, Llevar un diario, Trackear lo que consumo, Crear más (361-386, 407-458)
- Fila de pie: botón 'Atrás', texto de conteo en vivo, botón 'Continuar' (460-474)
- Rail derecho sticky: burbuja coach de KIBO con KiboMascot 56px pose='head' — 'Si todo te importa todo, nada importa. Elige las 2-3 que más mueven la aguja…' (477-484)
- Tarjeta 'Tu dashboard incluirá': lista deduplicada de hasta 8 widgets sembrados, etiquetados con labelForWidget (485-506)

## Estados que debe mostrar

- ninguna seleccionada: texto 'Elige al menos 1 para continuar.', 'Continuar' deshabilitado y la tarjeta de preview muestra el vacío en cursiva 'Elige prioridades para ver los widgets recomendados.' (465-466, 471, 492-495)
- 1 a 5 seleccionadas: 'Has elegido N. Bien — pocas y claras es mejor que muchas.', 'Continuar' habilitado (468-469, 398)
- más de 5 seleccionadas: 'Máximo 5 prioridades — selecciona menos.' y 'Continuar' deshabilitado — las tarjetas sí permiten pasarse del límite, el bloqueo es en el botón (398, 467-468, 471)
- tarjeta seleccionada: fondo y borde en el color de la opción, título coloreado y badge circular con check (416-452)

## Comportamientos que hay que representar

- Clic en una tarjeta alterna la intención en user.intents (toggle, 390-396, 414)
- canContinue = al menos 1 y como máximo 5 seleccionadas (398)
- La tarjeta de preview calcula los widgets uniendo los 'seeds' de cada intención seleccionada, deduplicando con Set y cortando a 8 (498)
- Cada seed se traduce a nombre legible con labelForWidget (501, 513-533)
- 'Atrás' navega a 'identity' (461)
- 'Continuar' navega a 'tutorial' — salta la pantalla de áreas (471)

## Lee de

- user.intents (389)
- INTENT_OPTIONS y sus arreglos de seeds (361-386)

## Escribe

- user.intents (391-395) — el contrato que consume el dashboard para sembrar widgets

## Conceptos del núcleo que toca

- identity
- shell
- progression engine
- habit
- reto
- task
- project
