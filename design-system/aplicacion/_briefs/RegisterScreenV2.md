# Crear cuenta / Forja un nuevo Hero

- **Artboard:** `RegisterScreenV2.dc.html`
- **Módulo:** acceso / auth
- **Origen:** `auth-v2.jsx` líneas 205-342
- **Propósito:** Alta de cuenta nueva: correo + contraseña con medidor de fuerza y confirmación, antes de entrar al onboarding. Mismo split-screen que login.

## Secciones, de arriba abajo

- AuthSide izquierdo: headline 'Forja un nuevo Hero.', sub 'Una cuenta, un Hero persistente, infinitas misiones…', burbuja 'Elige una contraseña que recuerdes — la vas a usar todos los días.' (239-244)
- Encabezado: h2 'Crea tu cuenta' + 'Empieza tu aventura en menos de un minuto.' (247-250)
- Campo Correo, placeholder tu@correo.com (253-263)
- Campo Contraseña con botón ojo (265-279)
- Medidor de fuerza de 5 segmentos con clase s0..s5 (280-282)
- Checklist de requisitos: 8+ caracteres, Mayúscula, Minúscula, Número, Símbolo (283-290)
- Campo Confirmar contraseña + indicador vivo 'Las contraseñas coinciden' / 'no coinciden' con icono check o alert (293-310)
- Banner de error inline role=alert (312-317)
- Botón primario 'Crear cuenta' (319-322)
- Divisor 'o regístrate con' + SocialButtonsV2 verb='Registrarme' (325-326)
- Pie: '¿Ya tienes cuenta?' + link 'Inicia sesión' (328-333)
- Línea legal: 'Al continuar aceptas el Código del Héroe · Términos · Privacidad.' (335-337)

## Estados que debe mostrar

- untouched: sin errores visibles, mood='happy' (210, 235)
- password score 0-5 calculado en vivo contra los 5 requisitos (213-221)
- mood='celebrating' cuando score >= 4 (235)
- touched + error: mood='worried', clases 'error' en los campos que fallan (235, 257, 270, 297)
- confirmación coincide (check, color primary-ink) / no coincide (alert, color hp) — solo visible si confirm tiene texto (303-309)
- error 'Ingresa un correo válido.' (228)
- error 'La contraseña no cumple todos los requisitos.' (229)
- error 'Las contraseñas no coinciden.' (230)
- contraseña y confirmación visibles/ocultas comparten el mismo toggle showPw (270-278, 298)

## Comportamientos que hay que representar

- Cada requisito de contraseña se evalúa en vivo con regex: longitud >= 8, [A-Z], [a-z], [0-9], [^A-Za-z0-9] (213-219)
- El medidor y la checklist se pintan conforme se cumplen requisitos (280-290)
- Escribir en cualquier campo limpia el error (261, 274, 301)
- Submit marca touched y valida en cascada: correo con '@', allMet (score===5), matches (225-233)
- Éxito: onNavigate('avatar') (232) — ENLACE MUERTO en el shell actual: 'avatar' no está en KIBO_SCREENS (kibo-root.jsx:26) y navigate() hace return si la pantalla no está en la lista (kibo-root.jsx:63-66), así que el botón 'Crear cuenta' no lleva a ningún lado
- Botones sociales inertes (sin onClick) (53-66)
- 'Inicia sesión' navega a 'login' (330)

## Lee de

- Solo estado local: email, password, confirm, showPw, touched, error (206-211)

## Escribe

- No emite eventos ni persiste el usuario: solo intenta navegar (a 'avatar', que no existe)

## Conceptos del núcleo que toca

- identity
- shell
- KIBO
