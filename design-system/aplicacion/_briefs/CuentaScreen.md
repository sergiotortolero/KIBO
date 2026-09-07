# Cuenta — identidad, acceso, plan y datos

- **Artboard:** `CuentaScreen.dc.html`
- **Módulo:** account
- **Origen:** `cuenta-config.jsx` líneas 34-196
- **Propósito:** Pantalla de identidad y administración de la cuenta: perfil público, credenciales y cuentas conectadas, plan de suscripción, facturación, privacidad de la cuenta, sesiones activas, exportación y borrado. Ruta 'account' del shell (dashboard-v2.jsx:1619-1622).

## Secciones, de arriba abajo

- kbv-page-head: crumb('cuenta','Tu identidad') + h1 'Cuenta.' (L51-56)
- Tarjeta 'Perfil' — UserAvatar 64px (o inicial), campos Nombre y Usuario (@slug derivado), botón Guardar (L59-69)
- Tarjeta 'Acceso' — Correo verificado (Cambiar), Contraseña (Cambiar), Google conectada (desconectar), Microsoft sin conectar (Conectar) (L72-88)
- Tarjeta 'Plan' (kbv-plan-card) — tag 'Premium anual', 4 perks con check, renovación 12 ene 2027 · $899 MXN/año, 'Ver facturas' + engrane 'Administrar plan' (L91-109)
- Tarjeta 'Facturación y pagos' — método de pago Visa ****4521 08/28, datos fiscales RFC/CFDI G03, 3 facturas históricas con monto y descarga (L112-132)
- Tarjeta 'Privacidad' — 'Quién puede encontrarte' (select Todos / Amigos de amigos / Nadie), toggle 'Invitaciones a retos', toggle 'Datos de uso anónimos', botón peligro 'Borrar historial social' (L135-158)
- Tarjeta 'Sesiones activas' — 3 dispositivos con lugar y antigüedad; el actual marcado con tag, los demás cerrables (L161-175)
- Tarjeta 'Tus datos' — 'Exportar todo' (Markdown + CSV) y 'Eliminar cuenta' en zona delicada (L178-191)
- toast kbv-social-toast (L193)

## Estados que debe mostrar

- Toast efímero 2.4 s tras cada acción (L38)
- ConfirmDialog abierto/cerrado vía useConfirm (L36, L50)
- priv = { retos: true, usage: true } — dos toggles independientes (L46)
- Sesiones: lista que se encoge al cerrar sesiones; la sesión actual (s.current) no es cerrable (L45, L168-171)
- Cuentas conectadas: Google 'Conectada' vs Microsoft 'Sin conectar' — dos variantes de la misma fila (L81-86)
- No hay estado de carga, error ni vacío: todos los datos son constantes de demostración

## Comportamientos que hay que representar

- Editar Nombre y Usuario (inputs no controlados, defaultValue) y 'Guardar' → toast 'Perfil guardado' (L64-67)
- Cambiar correo / contraseña → toast simulando envío de correo o enlace seguro (L76, L79)
- Desconectar Google / conectar Microsoft → toast (L82, L85)
- Ver facturas / administrar plan / cambiar tarjeta / editar datos fiscales / descargar factura → toast (L104-105, L116, L119, L128)
- Cambiar visibilidad en búsquedas → toast 'Preferencia guardada' (L139)
- Alternar 'Invitaciones a retos' y 'Datos de uso anónimos' (estado local, no persiste) (L146, L149)
- 'Borrar historial social' → ConfirmDialog; al confirmar, toast (L152-155)
- Cerrar una sesión → la quita de la lista + toast 'Sesión cerrada' (L171)
- 'Exportar' → toast 'Preparando tu exportación — te avisamos por correo' (L182)
- 'Eliminar cuenta' → ConfirmDialog; al confirmar, toast 'Cuenta programada para eliminarse en 14 días' (L185-187)

## Lee de

- user.name (prop del shell) para el nombre, la inicial y el @usuario derivado (L35, L65)
- SESSIONS local (L40-44) y las 3 facturas inline (L121-125)
- UserAvatar (onboarding-v2.jsx) con guarda typeof (L62)

## Escribe

- Nada persistente ni ningún evento: solo React state (sessions, priv, toast) y toasts

## Conceptos del núcleo que toca

- identity
- economy/ledger
- shell
- fact record
