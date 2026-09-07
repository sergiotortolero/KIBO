# Familia — Kibo para padres

- **Artboard:** `FamiliaScreen.dc.html`
- **Módulo:** familia
- **Origen:** `social-screen.jsx` líneas 394-434
- **Propósito:** Sección propia (antes cuarta pestaña del hub de Amigos, ver comentario L389-393) para administrar la casa: cuentas protegidas de los peques, misiones que el adulto aprueba y mesada ligada al esfuerzo. Ruta 'familia' del shell (dashboard-v2.jsx:1572-1576).

## Secciones, de arriba abajo

- kbv-page-head: eyebrow crumb('familia','Tu casa') + h1 'Familia.' con InfoDot explicando cuentas protegidas (L402-410)
- kbv-social-band de 3 celdas: personas en casa / con cuenta protegida, misiones por aprobar, monedas de mesada por semana (L412-428)
- FamilyPanel — franja explicativa + 'Por aprobar' + tarjetas de peques + tarjeta de co-admin (L430)
- toast kbv-toast (L431)

## Estados que debe mostrar

- Contadores derivados de FAMILY_MEMBERS y FAMILY_QUESTS; pluralización 'misión/misiones esperando tu visto bueno' (L421)
- Toast efímero 2.2 s (L396)
- Nota: la banda lee FAMILY_QUESTS (constante, L399) mientras FamilyPanel lleva su propio estado, así que el contador 'por aprobar' de la banda no baja al aprobar una misión

## Comportamientos que hay que representar

- Delegación total al FamilyPanel para aprobar/devolver misiones, invitar familiares y asignar misiones
- flash(m) muestra el toast durante 2.2 s (L396)

## Lee de

- FAMILY_MEMBERS (L71-75) — nombre, edad, color, nivel, racha, rol peque/adulto, mesada
- FAMILY_QUESTS (L76-82) — nombre, dueño, coins, xp, status pendiente/por-aprobar/aprobada, daily

## Escribe

- Nada persistente; el estado de misiones vive dentro de FamilyPanel (React state)

## Conceptos del núcleo que toca

- identity
- task
- economy/ledger
- progression engine
- habit
- shell
