# Bienvenida — 'Hola, soy Kibo'

- **Artboard:** `WelcomeScreenV2.dc.html`
- **Módulo:** acceso / onboarding paso 1
- **Origen:** `onboarding-v2.jsx` líneas 107-188
- **Propósito:** Primer paso del onboarding: presenta a KIBO como acompañante y explica qué es el producto — los nueve pilares del Personal OS — y adelanta que el dashboard se armará a medida.

## Secciones, de arriba abajo

- Header de OnboardingShell: KiboLogo + 'Paso 01 / 03' + stepbar de 3 segmentos (54-75, 109)
- Título 'Hola — soy Kibo.' + subtítulo largo que enumera hábitos, retos, tareas, proyectos, lectura, estudio, entretenimiento, finanzas y reflexión, y la promesa 'tu progreso real desbloquea recompensas reales — tú decides cuáles' (110-111)
- Tarjeta de saludo de KIBO: KiboMascot 180px pose='body' mood='wave', h3 'Encantado.', copy 'Te acompañaré durante el setup. Después aparezco solo cuando vale la pena — prometo no ser molesto.' (115-131)
- Grid 2 columnas 'Qué encontrarás aquí' con los 9 pilares de KIBO_PILLARS: Hábitos, Retos, Tareas, Proyectos, Finanzas, Diario, Lectura, Estudio, Entretenimiento — cada uno con icono, borde izquierdo de color y descripción (134-160)
- Callout primary-soft con icono sparkle: 'Tu dashboard se arma a tu medida' — anticipa el paso de prioridades (162-173)
- Pie de acciones: botón fantasma 'Atrás' y botón primario 'Empezar — solo toma 1 minuto' (175-183)

## Estados que debe mostrar

- Estática: no tiene estado propio ni validación
- Stepbar en 'active' para el segmento 1 (72)

## Comportamientos que hay que representar

- 'Atrás' navega a 'login' (176)
- 'Empezar — solo toma 1 minuto' navega a 'identity' (179)
- Contenido de los pilares viene de la constante KIBO_PILLARS (95-105) — es la definición canónica de los módulos del producto en el prototipo

## Lee de

- KIBO_PILLARS (95-105)

## Escribe

- Nada — solo navegación

## Conceptos del núcleo que toca

- KIBO
- shell
- habit
- reto
- task
- project
- economy/ledger
