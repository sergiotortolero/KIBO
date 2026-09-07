# Configuración — preferencias, notificaciones, juego, IA e integraciones

- **Artboard:** `ConfigScreen.dc.html`
- **Módulo:** settings
- **Origen:** `cuenta-config.jsx` líneas 213-376
- **Propósito:** Preferencias de plataforma persistidas en localStorage y difundidas al resto de la app por evento: idioma y calendario, notificaciones, juego y motion, privacidad social, proveedor de IA del asistente KIBO e integraciones externas. Ruta 'settings' del shell (dashboard-v2.jsx:1615-1618).

## Secciones, de arriba abajo

- kbv-page-head: crumb('config','Tu plataforma, a tu modo') + h1 'Configuración.' (L236-241)
- kbv-settings-grid con 4 tarjetas (L243-326)
- Tarjeta 'Preferencias' — Idioma (es-MX/en), semana empieza en (lunes/domingo), tu día termina a las (00:00/02:00/04:00), Menú lateral (replegable/fijo) (L245-274)
- Tarjeta 'Notificaciones' — Rescate de racha, Recordatorios de hábitos, Empujones del círculo, Resumen semanal (L277-292)
- Tarjeta 'Juego y motion' — Celebraciones, Sonidos, Menos movimiento, Modo hardcore (doble daño) (L296-312)
- Tarjeta 'Privacidad' — Perfil visible, Actividad en el círculo (L315-325)
- Tarjeta 'Asistente KIBO' — select de proveedor de IA + fila condicional de API key + fila condicional de IA local con 'Probar conexión' (L329-351)
- Tarjeta 'Integraciones' — rejilla de 4: Obsidian (tag Nuevo), Google Calendar, Apple Salud/Google Fit, Notion (L354-371)
- toast kbv-social-toast (L373)

## Estados que debe mostrar

- prefs cargadas de localStorage con merge sobre los valores por omisión; si el JSON falla, se usan los defaults (L202-211, L214)
- aiProvider = 'ninguno' | 'propia' | 'local' — controla dos filas condicionales (API key tipo password / Ollama) (L339-349)
- Integración con status 'nuevo' (Obsidian, pinta el pill 'Nuevo') vs 'off' (L228-231, L361)
- Modo hardcore encendido/apagado con toast propio (L309)
- Toast efímero 2.4 s (L216)
- Sin estados de carga ni error; 'Probar conexión' es explícitamente demo (L347)

## Comportamientos que hay que representar

- set(k,v): actualiza prefs, escribe localStorage 'kibo:prefs' y dispara CustomEvent 'kibo:prefs' con el objeto completo para que el resto de la app se aplique en el momento (L217-225)
- Cambiar Menú lateral también lanza toast 'Listo — el menú ya quedó así' (L268)
- Modo hardcore: toast 'Modo hardcore activado ⚔' / 'apagado' (L309)
- Escribir la API key la guarda en prefs.aiKey (solo en el dispositivo, según el copy) (L341-342)
- 'Probar conexión' de Ollama → toast demo (L347)
- Integración Obsidian → CustomEvent 'kibo:navigate' {screen:'resources'}; las demás → toast 'Conectando X…' (L364-367)

## Lee de

- localStorage 'kibo:prefs' vía loadPrefs() (L201-211)
- INTEGRATIONS local (L227-232)

## Escribe

- localStorage 'kibo:prefs' (objeto completo de prefs) (L220)
- CustomEvent 'kibo:prefs' con detail = prefs (L222)
- CustomEvent 'kibo:navigate' {screen:'resources'} desde Obsidian (L365)

## Conceptos del núcleo que toca

- shell
- identity
- progression engine
- KIBO
- habit
- reto
