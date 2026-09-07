# Identidad — nombre, foto y bio

- **Artboard:** `IdentityScreenV2.dc.html`
- **Módulo:** acceso / onboarding paso 2
- **Origen:** `onboarding-v2.jsx` líneas 193-354
- **Propósito:** Captura la identidad mínima del usuario (nombre obligatorio, foto opcional, bio opcional) que alimenta UserAvatar y la personalización posterior. Reemplaza el viejo constructor de avatar (nota de cabecera, línea 2).

## Secciones, de arriba abajo

- Header de OnboardingShell: 'Paso 02 / 03' + stepbar (215)
- Título 'Empecemos por ti.' + subtítulo 'Solo lo necesario para que Kibo te trate como persona. Puedes cambiarlo cuando quieras desde tu cuenta.' (215-217)
- Columna izquierda: zona de carga de foto grande con borde punteado, clic o arrastrar-soltar, icono camera 48px, 'Sube tu foto' y 'Arrástrala aquí o haz clic. PNG, JPG hasta 5MB.' (221-278)
- Nota meta bajo la zona: 'Si la dejas vacía, usamos las iniciales de tu nombre en un círculo de color.' (279-281)
- Columna derecha — campo '¿Cómo quieres que te digamos?' con maxLength 28 y autoFocus (286-304)
- Campo textarea 'Cuéntanos quién eres (opcional)' maxLength 300 con placeholder de ejemplo y nota de privacidad 'Privado — no se comparte.' (306-320)
- Chip de vista previa en vivo: UserAvatar 44px + nombre o 'Tu nombre' + 'Así te verás en la app.' (322-339)
- Pie de acciones: 'Atrás' y 'Siguiente' (341-349)

## Estados que debe mostrar

- sin foto: círculo placeholder con icono camera (259-275)
- con foto: UserAvatar 140px con anillo primario + botón 'Quitar foto' (251-257)
- hover sobre la zona de carga: borde y fondo cambian a primario (248-249)
- touched + nombre vacío: input con clase 'error' y mensaje 'Necesitamos un nombre para personalizar la experiencia.' (290, 298-303)
- 'Siguiente' deshabilitado mientras el nombre esté vacío (345)
- vista previa vacía muestra el placeholder 'Tu nombre' (333)

## Comportamientos que hay que representar

- Clic en la zona dispara el input file oculto (accept image/*) (224, 277)
- Arrastrar y soltar un archivo también lo carga: dragOver preventDefault + drop lee el primer archivo (226-233)
- La imagen se lee con FileReader.readAsDataURL y se guarda como data URL en user.photo (200-206, 231-232)
- 'Quitar foto' hace stopPropagation y pone user.photo = null sin reabrir el selector (254-256)
- Escribir nombre y bio actualiza el usuario en vivo vía update(k,v) → setUser (198, 295, 315)
- La vista previa (UserAvatar + nombre) refleja los cambios en tiempo real (330-337)
- submit() marca touched y solo avanza a 'intent' si el nombre no está vacío (208-212)
- 'Atrás' navega a 'welcome' (342)
- El límite de 5MB es solo copy: no hay validación de tamaño ni de tipo en el código

## Lee de

- user.name, user.photo, user.bio del estado elevado (props user/setUser; sembrado por KIBO_DEFAULT_USER en kibo-root.jsx:10-16)

## Escribe

- user.name (295)
- user.photo como data URL base64 (204, 231)
- user.bio (315)

## Conceptos del núcleo que toca

- identity
- fact record
- shell
