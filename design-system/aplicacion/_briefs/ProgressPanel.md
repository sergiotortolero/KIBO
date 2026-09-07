# Progresión — Rango y Prestigio ("Rango y progresión" / "Prestigio y emblemas")

- **Artboard:** `ProgressPanel.dc.html`
- **Módulo:** progreso
- **Origen:** `prestige-system.jsx` líneas 443-573 (usePrestigeRepaint 564-571; alias PrestigePanel 573)
- **Propósito:** Panel de página completa que muestra dónde va el usuario en la escalera de progresión: rango militar 1–100 con 20 insignias (salto cada 5 niveles, 9 materiales Bronce→Damasco) y, tras el nivel 100, el viaje de 16 prestigios (escalafón espacial Cadete Estelar→Leyenda). En Maestro (prestigio 16) añade paragón sin tope, equipar cualquier emblema y el 'Trayecto hacia deidad'.

## Secciones, de arriba abajo

- pp-head · pp-current: emblema grande (PrestigeEmblem 66px si prestigiado, RankEmblem 66px si no) + eyebrow ('Prestigio N de 16' / 'Rango · niveles 1–100' / 'Prestigio máximo · Paragón') + nombre de rango (P{n} · nombre de familia · sub, o 'RANK_NAMES[tier] · Nivel L') + sub-línea con lo que falta
- pp-progress: barra pp-track (pct = level/100, o paragonLevel%100 en modo paragón) + botón 'Prestigiar' / 'Nv. 100 para prestigiar' (o, en Maestro, texto 'Próximo hito en N niv.')
- pp-tabs (solo si prestiged): 'Viaje de prestigio' | 'Rangos 1–100'
- pp-gallery-head: eyebrow ('El viaje · 16 destinos' / 'Insignias de rango') + coletilla ('· toca para equipar' / '· tu colección' / '· se ganan al subir') + meta 'Equipar a gusto: exclusivo de Maestro' (si no master)
- pp-gallery (tab prestige): 16 botones CELESTIAL con PrestigeEmblem 46px + nombre de la familia activa + tag equipado
- pp-gallery.ranks (tab rank): 20 botones (niveles 5,10,…,100) con RankEmblem 46px + RANK_NAMES[i] + tag equipado
- pp-next-reward (si NO prestigiado): 'Al llegar al Nivel 100 desbloqueas · El Prestigio · asciendes a Cadete Estelar + el escalafón espacial de emblemas'
- pp-next-reward (prestigiado y no master): 'Tu próximo destino · Prestigio N+1: nombre · sub'
- pp-master-perks (solo master): 4 chips ('Equipar cualquier emblema', 'Niveles sin tope (paragón)', 'Ascensos cada 100 niv.', 'Leyenda animada')
- ParagonTimeline (solo master): línea de tiempo cósmica de 8 nodos con recompensas cada 100 niveles

## Estados que debe mostrar

- Sin prestigio (completed=0): sin tabs, galería de rangos implícita vía tab inicial 'rank', tarjeta 'Al llegar al Nivel 100'
- Prestigiado (1–15): tab inicial 'prestige', tabs visibles, tarjeta 'Tu próximo destino'
- Maestro (completed>=16): eyebrow 'Prestigio máximo · Paragón', barra en modo paragón, perks + ParagonTimeline, galerías 'pickable'
- Botón Prestigiar deshabilitado (level < 100, title 'Llega al Nv. 100 para prestigiar')
- Botón Prestigiar habilitado (atCap, level >= 100, title 'Reinicia a Nv. 1 y avanza en el viaje')
- Emblema locked (PrestigeEmblem/RankEmblem con candado y paleta --kb-parch-*) vs unlocked
- Emblema equipped (tag con check); en master sin equipo explícito, el prestigio 16 sale marcado por defecto
- Rangos: si prestiged, reachedLevel se fuerza a 100 → los 20 rangos aparecen desbloqueados

## Comportamientos que hay que representar

- Cambiar de pestaña entre 'Viaje de prestigio' y 'Rangos 1–100' (solo existe si prestiged)
- Clic en un emblema → equip(key): SOLO si master; guarda 'p{n}' o 'r{lvl}' en localStorage y dispara el evento kibo:emblem-change. Si no es master la función retorna sin hacer nada y los botones van disabled
- Botón 'Prestigiar' → llama onPrestige (en CharacterScreen se pasa () => {}, es decir NO hace nada en el prototipo)
- usePrestigeRepaint(): se re-renderiza al escuchar el evento window 'kibo:prestige-change' (cambio de familia de nombres o de nombres personalizados)
- Tooltips por emblema con nombre + sub o 'Bloqueado · prestigio N' / 'Bloqueado · Nv. L'

## Lee de

- nivel actual (level) y XP indirectamente
- prestigio completado (completed) y bandera master, vía prestigeInfo()
- paragonLevel
- localStorage 'kibo:equippedEmblem' (getEquippedEmblem)
- nombres cosméticos de prestigio: pfName() → localStorage 'kibo:prestige-custom' / 'kibo:prestige-family' (prestigio-nombres.jsx)
- tabla CELESTIAL (16 grados) y RANK_NAMES (20 rangos)

## Escribe

- localStorage 'kibo:equippedEmblem' + CustomEvent window 'kibo:emblem-change' (setEquippedEmblem)
- onPrestige() callback hacia el host (no emite evento propio; no toca el ledger en este archivo)

## Conceptos del núcleo que toca

- progression engine
- identity
- economy/ledger (cosmética equipable)
- shell
