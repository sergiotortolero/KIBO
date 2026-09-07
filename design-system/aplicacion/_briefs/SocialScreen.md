# Amigos — Social / Tu círculo

- **Artboard:** `SocialScreen.dc.html`
- **Módulo:** social
- **Origen:** `social-screen.jsx` líneas 436-835
- **Propósito:** Hub del círculo social: economía entre usuarios SIN transferencias directas (regalas items de la Tienda, aportas hasta 90% a la lista de deseos de un amigo), empujones estilo Duolingo para no perder la racha, marcador de retos compartidos y feed de actividad del círculo. Ruta 'social' del shell (dashboard-v2.jsx:1562-1566).

## Secciones, de arriba abajo

- kbv-page-head: eyebrow 'Social · Tu círculo' + h1 'Amigos.' con InfoDot + botón 'Invitar amigos' (L520-528)
- kbv-social-band — pulso del círculo, 5 celdas: amigos/en línea, retos donde vas arriba, rachas en riesgo, retos compartidos activos, XP del círculo semana (L531-557)
- kbv-nudge-strip — empujones pendientes, solo si hay alguien en riesgo; un botón por amigo en riesgo (L560-575)
- Tarjeta 'Tu círculo' — SectionHead + kbv-seg-row con 3 pestañas (Mis amigos / Buscar gente / Solicitudes con badge) (L578-682)
- Pestaña 'amigos': kbv-friends-grid de FriendCard + botón kbv-friend-add 'Buscar amigos' (L598-610)
- Pestaña 'buscar': kbv-search-box + lista kbv-person-list de SEARCH_POOL con botón Agregar/Enviada (L612-637)
- Pestaña 'buzon': grupo 'Recibidas' (aceptar/rechazar) + grupo 'Enviadas' (cancelar) (L639-681)
- Tarjeta 'Retos compartidos' — SectionHead con acción 'Gestionar en Retos', kbv-reto-switch (si >1), RetoScoreboard, kbv-shared-foot con invitaciones pendientes + 'Nuevo reto compartido' (L686-738)
- Tarjeta 'Apoya las metas de tus amigos' — kbv-fwish-grid con GoalBar y 'Aportar 5%' por deseo (L741-774)
- Tarjeta 'Actividad del círculo' — filtro Todo/Logros/En riesgo + feed agrupado por Hoy/Ayer/Esta semana con aplauso o 'Empujar' (L777-824)
- Modales montados al final + toast kbv-social-toast (L826-832)

## Estados que debe mostrar

- hubTab = 'amigos' | 'buscar' | 'buzon' (L443)
- Búsqueda: sugerencias (query vacío) · resultados filtrados · EmptyState 'Sin resultados' cuando no hay coincidencias (L619-623)
- Solicitud por persona: no enviada · 'Enviada' (cancelable) — set `sent` (L630-632)
- Buzón: EmptyState 'Sin solicitudes' cuando requests=[] · grupo 'Enviadas' solo si hay enviadas (L643-644, L663)
- Riesgo: la banda de empujones y la clase .warn solo existen si atRisk.length>0 (L542, L560)
- Retos compartidos: EmptyState 'Todavía no comparten un reto' si activeShared=0 · un solo marcador · conmutador visible solo con >1 reto (L690-714)
- Retos: 'invitaciones sin responder' depende de sc.pending — SHARED_CHALLENGES (personal-screens.jsx:565-574) NO define `pending`, así que pendingShared siempre es 0 y esa línea nunca se pinta; activeShared = los 2 retos (L461, L727-731)
- Marcador: fila 'lead' con corona si hay ventaja · 'Empatados' si lead=0 · botón 'Registrar hoy' solo si !sc.meDone (L253-279)
- Deseos: botón 'Aportar 5%' deshabilitado cuando saved >= 90% del target ('tope alcanzado') (L746-747, L764-767)
- Feed: feedTab 'todo'|'logro'|'riesgo' · EmptyState 'Nada por aquí' si el filtro no devuelve filas (L820-822)
- Aplauso: on/off por evento (claps) — las filas con `nudge` muestran 'Empujar' en vez del aplauso (L791, L803-813)
- Toast efímero 2.6 s (L451)
- Sin estados de carga ni de error: todos los datos son constantes del módulo

## Comportamientos que hay que representar

- 'Invitar amigos' → toast 'Liga de invitación copiada al portapapeles' (no copia real) (L525-527)
- nudge(f,'racha'|'animo') → toast; se dispara desde FriendCard, la banda de riesgo, el feed y el perfil (L464-466)
- Abrir FriendProfileModal al tocar la tarjeta de amigo (L188, L601-602)
- Abrir GiftModal desde el botón regalo de la portada (L193-194) y desde el perfil (L346)
- send(f,g) → cierra GiftModal + toast 'Regalaste X a Y' (L467-470)
- Buscar por nombre o @usuario; filtra SEARCH_POOL y excluye a quien ya es amigo (L500-503)
- sendRequest / cancelRequest → toast (L506-507)
- acceptRequest → quita del buzón y agrega a `friends` con streak 1 y weekXP 320 (L508-512); rejectRequest lo descarta (L513)
- contribute(friendId,itemId): suma 5% del target, topado al 90% acumulado, y acumula en fromFriends (L474-487)
- clap(id) alterna el aplauso local (L471-473)
- 'Registrar hoy' en el marcador → solo toast, no muta el reto (L719)
- Cambiar de reto compartido con el conmutador (setRetoId) (L703)
- goRetos(action) → window.dispatchEvent CustomEvent 'kibo:navigate' {screen:'retos', tab:'compartidos', action}; usado por 'Gestionar en Retos', 'Proponer un reto', 'Nuevo reto compartido' y 'Proponer reto' del perfil (L514-516)
- Abrir el perfil del rival desde el avatar del marcador (L720-723)

## Lee de

- user.name, stats.level, stats.streak (props del shell) → objeto `you` (L437-438)
- DEMO_FRIENDS: nivel, racha, weekXP, online, risk, wishlist y `card` (vitrina: bg/frame/pet/title/tagline) (L19-35)
- SHARED_CHALLENGES global de personal-screens.jsx, leído con guarda typeof (L456-461)
- SEARCH_POOL (L41-47), REQUESTS_IN (L49-52), SOCIAL_FEED (L55-68), FRIEND_GIFTS (L12-17)
- Vitrina del amigo vía CardBackdrop / KiboPet / cardPetById / frameRingStyle (vitrina.jsx)

## Escribe

- Nada persistente: todo es React state local (friends, requests, sent, claps, retoId, toast)
- CustomEvent 'kibo:navigate' con {screen:'retos', tab:'compartidos', action:'create-shared'} (L515)
- Mutación local de wishlist: saved += 5% del target y fromFriends += aporte, con tope 90% (L477-483)
- Alta local de amigo al aceptar una solicitud (L510)

## Conceptos del núcleo que toca

- identity
- economy/ledger
- reto
- progression engine
- habit
- shell

## Modales que se dibujan sobre esta pantalla

### Regalar a {amigo}
- Se abre desde: SocialScreen · FriendCard, botón .fc-gift de la portada (social-screen.jsx:193-194), FriendProfileModal · acción 'Regalar un item' (cierra el perfil y abre el regalo) (social-screen.jsx:346-348)
- Propósito: Regalar items de la Tienda a un amigo. El copy es explícito: no se envía dinero ni fragmentos directo, se regalan items que le sirven en su día a día.
- Campos: Sin campos de captura: rejilla .gm-grid con un ItemCard por regalo de FRIEND_GIFTS (Multiplicador XP x2 1 h · 12 gemas; Protector de racha 1 día · 20 gemas; Cofre de monedas +50 · 80 monedas; Congelar racha 1 día · 15 gemas)
- Acciones: Comprar/regalar item (ItemCard onBuy → send(friend, gift)) · Cerrar (kbv-btn-ghost del pie) · Cerrar por onClose del KBVModal
- Estados: Estado único: siempre los 4 regalos, sin verificación de saldo ni estado deshabilitado · KBVModal size='lg'
- Origen: `social-screen.jsx` 286-301

### Resumen de jugador (perfil de amigo)
- Se abre desde: SocialScreen · clic en la tarjeta FriendCard (onOpen) (social-screen.jsx:188, 601-602), SocialScreen · avatar del rival en RetoScoreboard (onOpenFriend) (social-screen.jsx:255-256, 720-723)
- Propósito: Perfil rápido de un amigo: su carta de presentación (vitrina), su pulso, la comparación contra ti, los retos que comparten y su lista de deseos con aporte topado.
- Campos: Carta de vitrina: CardBackdrop (portada), KiboPet (compañero), avatar con anillo de marco, título honorífico, tagline entre comillas, nivel (L320-333) · 4 estadísticas de solo lectura: Nivel, Racha (clase zero/fire), XP semana, 'Contra ti' con el diferencial firmado (L334-340) · Lista 'Retos que comparten': nombre, barra de avance, día X de Y y fallos (L351-368) · Lista 'Su lista de deseos': GoalBar con label, cur/target, capPct 90 y % aportado por amigos (L370-383)
- Acciones: 'Mandar ánimo' / 'Recordar su racha' según f.risk (onNudge) · 'Regalar un item' → cierra y abre GiftModal · 'Aportar 5%' por cada deseo (onContribute), deshabilitado al llegar al tope · 'Proponer reto' (primario) → goRetos('create-shared') y cierra · 'Cerrar'
- Estados: Con/sin retos compartidos: EmptyState 'Aún no comparten un reto' (L352-354) · Con/sin lista de deseos: EmptyState 'Sin metas publicadas' (L371-372) · Aporte deshabilitado cuando saved >= 90% del target (L374-380) · Riesgo: cambia icono y etiqueta de la acción de empujón (L343-345) · Diferencial contra ti en positivo (.up) o negativo (.down) (L338-339) · Elementos de vitrina opcionales: sin pet, sin título o sin tagline la carta se dibuja igual (L322-329) · KBVModal size='lg'
- Origen: `social-screen.jsx` 304-386
