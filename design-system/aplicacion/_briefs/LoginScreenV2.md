# Inicio de sesión

- **Artboard:** `LoginScreenV2.dc.html`
- **Módulo:** acceso / auth
- **Origen:** `auth-v2.jsx` líneas 71-200
- **Propósito:** Puerta de entrada a Kibo: autentica al usuario existente con correo + contraseña (o social) y lo devuelve a su dashboard. Split-screen con panel de marca a la izquierda (KIBO + copy) y formulario a la derecha.

## Secciones, de arriba abajo

- AuthSide izquierdo: KiboLogo, headline 'Tu Hero te está esperando.', sub sobre tareas/hábitos/RPG sutil, KiboMascot 120px + burbuja de Kibo (líneas 111-116)
- Encabezado del formulario: h2 'Inicia sesión' + 'Continúa tu progreso desde donde lo dejaste.' (119-122)
- Campo Correo con placeholder hero@kibo.app, autoComplete email (125-137)
- Campo Contraseña con link '¿Olvidaste tu contraseña?' en la etiqueta y botón ojo mostrar/ocultar (139-159)
- Banner de error inline role=alert con icono alert (161-166)
- Bloque CAPTCHA condicional 'No soy un robot' con marca KIBO·CAPTCHA · Privacidad · Términos (168-179)
- Botón primario Entrar / 'Cuenta bloqueada' (181-184)
- Divisor 'o continúa con' + SocialButtonsV2 verb='Entrar' (187-188)
- Pie: '¿Aún no tienes cuenta?' + link 'Crear tu Hero' (190-195)

## Estados que debe mostrar

- idle / feliz: sin error, mascota mood='happy', burbuja '¡Bienvenido de regreso! Tu héroe te está esperando.' (102-107)
- error de campos vacíos: 'Ingresa tu correo y contraseña.' (85)
- credenciales incorrectas 1 intento: 'No pudimos validar esas credenciales. Te quedan N intentos.', mood='worried' (98, 102)
- captcha requerido (failures >= 2 y no bloqueado): aparece el bloque captcha, burbuja 'Tómate un segundo. Verifica que no eres un bot y reintenta.', error '...(intento N de 5)' (80, 96, 106)
- captcha sin resolver al enviar: 'Completa la verificación para continuar.' (86)
- captcha resuelto: caja con clase 'checked', aria-checked true (171-174)
- bloqueado (failures >= 5): locked=true, inputs disabled, botón 'Cuenta bloqueada' disabled, mood='alert', burbuja 'Te bloquearon. Recupera tu acceso y vuelve — te espero.' (92-95, 102-104, 181-183)
- contraseña visible / oculta (showPw, 148, 155-157)
- inputs con clase 'error' cuando hay error y no está bloqueado (129, 147)

## Comportamientos que hay que representar

- Escribir en correo o contraseña limpia el error inmediatamente (setError(null), 133, 151)
- Alternar visibilidad de contraseña con el botón ojo (eye / eye-off) (155-157)
- Enviar el formulario valida credenciales hardcodeadas: email 'hero@kibo.app' + password 'Quest123!' (87)
- Éxito: resetea contadores y navega a 'dashboard' (88)
- Fallo: incrementa contador, resetea captchaPassed, y a los 2 intentos exige captcha; a los 5 bloquea la cuenta (89-99)
- Clic en la caja del captcha marca captchaPassed = true (no hay verificación real) (172)
- Submit no hace nada si locked (84)
- '¿Olvidaste tu contraseña?' es un botón sin onClick — inerte en el prototipo (142)
- Botones sociales (Google / Microsoft) son inertes, sin onClick (SocialButtonsV2, 53-66)
- 'Crear tu Hero' navega a 'register' (192)

## Lee de

- Nada del kernel: todo el estado es local (email, password, showPw, failures, captchaPassed, error, locked) (72-78)
- Estado de ánimo de KIBO derivado del error/bloqueo para alimentar la mascota (102)

## Escribe

- No emite eventos ni escribe en ledger/XP: solo navegación (onNavigate('dashboard') / onNavigate('register'))

## Conceptos del núcleo que toca

- identity
- shell
- KIBO
