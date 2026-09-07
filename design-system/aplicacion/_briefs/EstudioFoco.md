# Pestaña Foco — Pomodoro con confirmación anti-abandono

- **Artboard:** `EstudioFoco.dc.html`
- **Módulo:** Estudio
- **Origen:** `estudio-screen.jsx` líneas 162-349
- **Propósito:** Temporizador Pomodoro configurable, opcionalmente ligado a un curso, con KPIs de foco del periodo y widget de música. La sesión solo cuenta si confirmas al terminar cada fase.

## Secciones, de arriba abajo

- Rejilla de 4 KPIs: Pomodoros hoy (4), Horas en foco 7 días (9.4 h), Racha de estudio (9 días, récord 14), Foco completado hoy (87%) (236-263)
- Hero del Pomodoro: anillo SVG de progreso + pila de tiempo (fase, mm:ss, ciclo n/N) (266-288)
- Overlay de confirmación de fase dentro del anillo (278-287)
- Panel lateral: curso vinculado, selector «Vincular a (opcional)», presets, controles, extras (289-345)
- Rejilla de presets POMODORO_PRESETS + tarjeta «Personalizado» (306-317)
- Formulario personalizado: Foco/Descanso/Pausa larga (min) y Ciclos (318-327)
- Controles: Iniciar/Pausar, Saltar fase, Reset (329-335)
- Extras: toggle de sonido, enlace a plataforma del curso (336-341)
- FocusMusicWidget (342)
- Tiras de aviso: idleMsg de sesión descartada y explicación del gate de 20 min (343-344)

## Estados que debe mostrar

- phase: 'work' | 'short' | 'long' con color propio (267)
- running / pausado
- awaiting: fase siguiente pendiente de confirmar — bloquea Iniciar y Saltar (330, 333)
- idleMsg: «Sesión no registrada: pasaron más de 20 min sin confirmar…» (207)
- preset 'custom' vs preset de catálogo
- sound on/off
- Curso vinculado o «Foco libre · sin vincular» (292)

## Comportamientos que hay que representar

- Cuenta atrás de 1 s mientras running y secs>0 (188-193)
- Al llegar a 0: detiene, hace beep con WebAudio si sound, calcula la fase siguiente (work→short, o long si cycle>=cycles) y pide confirmación (195-203, 179-187)
- confirmNext(): fija la fase, recarga los segundos y reanuda; si entra a 'work' incrementa el ciclo (210-217)
- stopHere(): cierra la confirmación y detiene (218)
- Timeout de 20 min sin confirmar → descarta la sesión y hace reset con mensaje (205-209)
- skipPhase() y reset() (225-229)
- Cambiar preset o custom.work resetea el temporizador (219)
- Vincular/desvincular curso desde el select (297-302), solo cursos no terminados

## Lee de

- POMODORO_PRESETS (global de personal-screens.jsx)
- courses (cursos activos) para el select y la cabecera del panel
- KPIs de foco (valores demo hardcodeados)

## Escribe

- Nada al bus; la «sesión registrada» es conceptual — el prototipo solo cambia estado local

## Conceptos del núcleo que toca

- progression engine
- habit (racha de estudio)
- task
- shell

## Modales que se dibujan sobre esta pantalla

### Confirmación de fase del Pomodoro (overlay dentro del anillo)
- Se abre desde: EstudioFoco — automáticamente cuando secs llega a 0 estando running (195-203)
- Propósito: Verificar que sigues frente al temporizador al terminar cada fase; sin confirmar, la sesión no se registra.
- Campos: Pregunta «Fase terminada · ¿iniciar FOCO/DESCANSO/PAUSA LARGA?» · Nota «Confirma para registrar · sin acción en 20 min se descarta»
- Acciones: Continuar → confirmNext(): arranca la fase siguiente (282) · Terminar → stopHere(): cierra y detiene (283)
- Estados: Visible solo mientras awaiting != null · Mientras está visible, Iniciar y Saltar fase quedan deshabilitados (330, 333) · Autocaducidad a los 20 min → reset + mensaje de sesión no registrada (205-209)
- Origen: `estudio-screen.jsx` 278-287
