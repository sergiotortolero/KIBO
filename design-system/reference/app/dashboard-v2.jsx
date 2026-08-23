// dashboard-v2.jsx — Desktop shell, restructured Today dashboard, Tutorial

// ─────────────────────────────────────────────────────────────
// Sidebar — editable: rename/hide/reorder sections (Dashboard locked)
// ─────────────────────────────────────────────────────────────

// Default sidebar structure — sections + items.
// Dashboard section is locked: cannot be renamed, hidden, or reordered.
// Agrupación del menú: cada grupo responde a UNA pregunta, y ese es el criterio
// para decidir dónde cae algo nuevo. «Hoy», «Personal», «Trabajo» y «Más» se
// solapaban —Salud podía ir en los cuatro— y «Más» era el cajón de sastre.
//   · General      · dónde estoy
//   · Tu plan      · lo que te comprometiste a sacar
//   · Tu constancia· lo que repites hasta que se vuelve tuyo
//   · Tu bitácora  · lo que registras de tu vida
//   · Tu gente     · con quién
//   · Recompensas  · en qué se convierte el esfuerzo
// El grupo General está bloqueado: no se renombra, ni se oculta, ni se mueve.
const DEFAULT_SIDEBAR_SECTIONS = [
{ id: 'dashboard', name: 'General', locked: true,
  items: [
  { id: 'today', icon: 'home', label: 'Inicio', locked: true },
  { id: 'progreso', icon: 'trending-up', label: 'Mi progreso' }]
},
{ id: 'work', name: 'Tu plan', locked: false,
  items: [
  { id: 'tareas', icon: 'list', label: 'Tareas' },
  { id: 'areas', icon: 'layers', label: 'Áreas' },
  { id: 'projects', icon: 'folder', label: 'Proyectos' },
  { id: 'finanzas', icon: 'wealth', label: 'Finanzas', premium: true }]
},
{ id: 'personal', name: 'Tu constancia', locked: false,
  items: [
  { id: 'habits', icon: 'flame', label: 'Hábitos' },
  { id: 'retos', icon: 'sword', label: 'Retos' }]
},
{ id: 'today', name: 'Tu bitácora', locked: false,
  items: [
  { id: 'salud', icon: 'vigor', label: 'Salud' },
  { id: 'diario', icon: 'edit', label: 'Diario', premium: true },
  { id: 'lectura', icon: 'book-open', label: 'Lectura', premium: true },
  { id: 'estudio', icon: 'layers', label: 'Estudio', premium: true },
  { id: 'watch', icon: 'film', label: 'Entretenimiento', premium: true },
  { id: 'resources', icon: 'book', label: 'Bóveda', premium: true }]
},
{ id: 'social', name: 'Tu gente', locked: false,
  items: [
  { id: 'social', icon: 'community', label: 'Amigos' },
  { id: 'familia', icon: 'shield', label: 'Familia' }]
},
{ id: 'rewards', name: 'Recompensas', locked: false,
  items: [
  { id: 'store', icon: 'shop', label: 'Tienda' },
  { id: 'personalizar', icon: 'sparkle', label: 'Personalización' }]
}];


// ── Modular freemium ───────────────────────────────────────────
// Núcleo = siempre gratis (no listado aquí). Premium = se desbloquea con materia oscura
// (también ganables jugando, así un usuario free llega a lo mismo sin pagar).
const PREMIUM_MODULES = {
  finanzas: { cost: 400, name: 'Finanzas', icon: 'wealth', desc: 'Cuentas, gastos, presupuesto, deudas e inversiones — con auto-registro.' },
  estudio: { cost: 250, name: 'Estudio', icon: 'layers', desc: 'Pomodoro, cursos, agenda académica y ranking de conocimiento.' },
  lectura: { cost: 150, name: 'Lectura', icon: 'book-open', desc: 'Libros activos, sesiones cronometradas y notas con IA.' },
  watch: { cost: 150, name: 'Entretenimiento', icon: 'film', desc: 'Series, pelis y resumen anual sincronizado con Trakt.' },
  resources: { cost: 300, name: 'Bóveda', icon: 'book', desc: 'Notas importadas y lecturas sintetizadas con IA.' },
  diario: { cost: 120, name: 'Diario', icon: 'edit', desc: 'Bitácora emocional: mood, gratitud, foto y dictado.' }
};
// Qué trae desbloqueado cada perfil de prueba
const PROFILE_UNLOCKED = {
  novato: [],
  intermedio: ['diario', 'lectura'],
  maestro: ['finanzas', 'estudio', 'lectura', 'watch', 'resources', 'diario']
};

function Sidebar({ active = 'today', collapsed = false, onToggleCollapse, onNavigate, habitsDone = 2, habitsTotal = 4, streakDays = 23, bossActive = false, unlockedModules = [], onOpenModules }) {
  const goto = (id) => onNavigate && onNavigate(id);
  const tier = typeof getFlameTier === 'function' ? getFlameTier(streakDays) : { color: 'var(--kb-streak)', name: 'Naranja' };

  const [sections, setSections] = React.useState(DEFAULT_SIDEBAR_SECTIONS);
  const [hidden, setHidden] = React.useState([]); // array of section ids that are hidden
  const [editMode, setEditMode] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [drag, setDrag] = React.useState(null); // { type:'section', id } | { type:'item', from, itemId }

  const [askDel, delConfirmDialog] = useConfirm();
  const visibleSections = sections.filter((s) => !hidden.includes(s.id));
  const hiddenSections = sections.filter((s) => hidden.includes(s.id));

  function rename(id, name) {setSections((ss) => ss.map((s) => s.id === id ? { ...s, name } : s));}
  function hide(id) {setHidden((h) => h.includes(id) ? h : [...h, id]);}
  function unhide(id) {setHidden((h) => h.filter((x) => x !== id));}

  function addSection() {
    const id = 'grp-' + Math.random().toString(36).slice(2, 6);
    setSections((ss) => [...ss, { id, name: 'Nueva sección', locked: false, items: [] }]);
    setEditingId(id);
  }
  function deleteSection(id) {
    const sec = sections.find((s) => s.id === id);
    if (!sec || sec.locked) return;
    if (sec.items.length > 0) {
      askDel({ title: 'Eliminar sección', message: `¿Eliminar la sección «${sec.name}»? Sus ${sec.items.length} accesos se moverán a otra sección — no se pierden.`, confirmLabel: 'Sí, eliminar', onConfirm: () => reallyDeleteSection(id) });
      return;
    }
    reallyDeleteSection(id);
  }
  function reallyDeleteSection(id) {
    const sec = sections.find((s) => s.id === id);
    if (!sec) return;
    setSections((ss) => {
      const fallback = ss.find((s) => s.id !== id && !s.locked) || ss.find((s) => s.id !== id);
      const next = ss.
      map((s) => fallback && s.id === fallback.id ? { ...s, items: [...s.items, ...sec.items] } : s).
      filter((s) => s.id !== id);
      return next;
    });
    setHidden((h) => h.filter((x) => x !== id));
  }

  // ── Section drag (reorder whole groups) ──
  function onSecDragStart(id) {return (e) => {if (!editMode) return;const s = sections.find((x) => x.id === id);if (s?.locked) return;setDrag({ type: 'section', id });e.dataTransfer.effectAllowed = 'move';};}
  function onSecDragOver(id) {return (e) => {if (drag && (drag.type === 'item' || drag.type === 'section' && drag.id !== id)) e.preventDefault();};}
  function onSecDrop(targetId) {return (e) => {
      e.preventDefault();
      if (!drag) return;
      if (drag.type === 'item') {moveItem(drag.from, drag.itemId, targetId, null);setDrag(null);return;}
      if (drag.id === targetId) return setDrag(null);
      const dragged = sections.find((s) => s.id === drag.id);
      const target = sections.find((s) => s.id === targetId);
      if (!dragged || dragged.locked) return setDrag(null);
      const filtered = sections.filter((s) => s.id !== drag.id);
      const tIdx = filtered.findIndex((s) => s.id === targetId);
      const insertAt = target?.locked && target?.id === 'dashboard' ? 1 : tIdx;
      filtered.splice(insertAt, 0, dragged);
      setSections(filtered);
      setDrag(null);
    };}

  // ── Item drag (move between/within groups) ──
  function moveItem(fromId, itemId, toId, beforeItemId) {
    setSections((ss) => {
      let moved = null;
      const cleared = ss.map((s) => {
        if (s.id !== fromId) return s;
        moved = s.items.find((i) => i.id === itemId);
        if (moved && moved.locked) {moved = null;return s;}
        return { ...s, items: s.items.filter((i) => i.id !== itemId) };
      });
      if (!moved) return ss;
      return cleared.map((s) => {
        if (s.id !== toId) return s;
        const items = [...s.items];
        let idx = beforeItemId ? items.findIndex((i) => i.id === beforeItemId) : items.length;
        if (idx < 0) idx = items.length;
        items.splice(idx, 0, moved);
        return { ...s, items };
      });
    });
  }
  function onItemDragStart(fromId, itemId) {return (e) => {if (!editMode) return;e.stopPropagation();setDrag({ type: 'item', from: fromId, itemId });e.dataTransfer.effectAllowed = 'move';try {e.dataTransfer.setData('text/plain', itemId);} catch (_) {}};}
  function onItemDropOnItem(toId, beforeItemId) {return (e) => {if (drag?.type !== 'item') return;e.preventDefault();e.stopPropagation();moveItem(drag.from, drag.itemId, toId, beforeItemId);setDrag(null);};}

  // Modo del sidebar. Vive en las prefs y se aplica EN VIVO (antes solo al
  // recargar), y se puede cambiar desde aquí mismo: fijarlo es una decisión
  // que se toma mirando el menú, no enterrada en Configuración.
  const prefs = (typeof useKbPrefs === 'function') ? useKbPrefs() : {};
  const sideMode = prefs.sidebarMode || 'replegable';
  const pinned = sideMode === 'fijo';
  return (
    <aside className={`kbv-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {delConfirmDialog}
      {/* 54 · Antes era un disco de 24px flotando medio fuera del borde: no se
          encontraba, no alcanzaba el mínimo táctil, y por debajo de 1080px
          desaparecía justo donde el menú ya venía replegado — sin forma de
          abrirlo. Ahora es un control de la cabecera del menú, del tamaño de
          los demás, y en pantallas estrechas abre el menú encima. */}
      <div className="kbv-side-top">
        <KiboLogo onClick={() => onNavigate && onNavigate('today')} />
        <div className="kbv-side-modeswitch">
          <button type="button" className={`kbv-side-pin ${pinned ? 'on' : ''}`}
                  aria-pressed={pinned}
                  title={pinned ? 'Menú fijo — clic para poder replegarlo' : 'Fijar el menú abierto'}
                  aria-label={pinned ? 'Menú fijo' : 'Fijar el menú'}
                  onClick={() => { if (typeof kbSetPref === 'function') kbSetPref('sidebarMode', pinned ? 'replegable' : 'fijo'); }}>
            <KIcon name={pinned ? 'pin-on' : 'pin-off'} size={16} />
          </button>
          {!pinned && (
            <button type="button" className="kbv-side-collapse" onClick={onToggleCollapse}
                    aria-expanded={!collapsed}
                    title={collapsed ? 'Desplegar menú' : 'Replegar menú'}
                    aria-label={collapsed ? 'Desplegar menú' : 'Replegar menú'}>
              <KIcon name={collapsed ? 'list' : 'arrow-right'} size={15}
                     style={collapsed ? undefined : { transform: 'rotate(180deg)' }} />
              <span>Replegar</span>
            </button>
          )}
        </div>
      </div>

      {/* PINNED — Racha pill (matches HUD streak language) */}
      <button
        type="button"
        className={`kbv-side-streak ${bossActive ? 'in-reto' : ''}`}
        title={bossActive ? `Reto activo · ${streakDays} días de racha` : `${streakDays} días de racha`}
        onClick={() => goto('habits')}
        style={{ '--flame-c': bossActive ? 'var(--kb-boss)' : tier.color }}
        title={bossActive ? 'Reto activo · racha en juego' : `Racha: ${streakDays} días`}>
        <span className="flame">
          <FlameSVG size={22} tierColor={bossActive ? 'var(--kb-boss)' : tier.color} />
        </span>
        <span className="meta">
          <span className="label">{bossActive ? 'Reto activo' : 'Racha'}</span>
          <span className="days"><strong>{streakDays}</strong> días</span>
        </span>
        <span className="progress" aria-hidden="true">
          {Array.from({ length: habitsTotal }).map((_, i) =>
          <span key={i} className={i < habitsDone ? 'on' : ''} />
          )}
        </span>
      </button>

      {/* Edit toggle */}
      <button
        type="button"
        className={`kbv-side-edit-btn ${editMode ? 'on' : ''}`}
        onClick={() => {setEditMode((m) => !m);setEditingId(null);}}
        title="Personalizar barra lateral">
        <KIcon name={editMode ? 'check' : 'edit'} size={11} />
        <span>{editMode ? 'Listo' : 'Personalizar'}</span>
      </button>

      {editMode &&
      <div className="kbv-side-edit-hint">
          Arrastra <strong>accesos</strong> entre secciones, créalas o elimínalas. Pronto podrás <strong>comprar</strong> módulos nuevos con materia oscura.
        </div>
      }

      <div className={`kbv-side-nav ${editMode ? 'editing' : ''}`}>
        {visibleSections.map((section) =>
        <div
          key={section.id}
          className={`kbv-side-section ${section.locked ? 'locked' : ''} ${drag && drag.type === 'section' && drag.id === section.id ? 'dragging' : ''} ${drag && drag.type === 'item' ? 'item-target' : ''}`}
          draggable={editMode && !section.locked}
          onDragStart={onSecDragStart(section.id)}
          onDragOver={onSecDragOver(section.id)}
          onDrop={onSecDrop(section.id)}>
            <div className="section section-head">
              {editMode && !section.locked && <span className="grip" title="Arrastrar sección"><KIcon name="grip" size={10} /></span>}
              {section.locked && <span className="lock" title="Sección bloqueada"><KIcon name="shield" size={9} /></span>}
              {editingId === section.id ?
            <input
              autoFocus
              className="section-name-edit"
              defaultValue={section.name}
              onBlur={(e) => {rename(section.id, e.target.value.trim() || section.name);setEditingId(null);}}
              onKeyDown={(e) => {if (e.key === 'Enter') e.currentTarget.blur();if (e.key === 'Escape') setEditingId(null);}} /> :

            <button type="button"
            className="section-name"
            onClick={() => editMode && !section.locked && setEditingId(section.id)}
            title={editMode && !section.locked ? 'Renombrar sección' : ''}>
                  {section.name}
                </button>
            }
              {editMode && !section.locked &&
            <div className="section-actions">
                  <button type="button" className="section-hide" onClick={() => hide(section.id)} title="Ocultar sección">
                    <KIcon name="eye-off" size={11} />
                  </button>
                  <button type="button" className="section-del" onClick={() => deleteSection(section.id)} title="Eliminar sección">
                    <KIcon name="trash" size={11} />
                  </button>
                </div>
            }
            </div>
            {section.items.map((it) => {
            const locked = it.premium && !unlockedModules.includes(it.id);
            const cost = typeof PREMIUM_MODULES !== 'undefined' && PREMIUM_MODULES[it.id] ? PREMIUM_MODULES[it.id].cost : 0;
            return (
              <SideLink
                key={it.id} id={it.id} active={active} icon={it.icon} label={it.label} soon={it.soon} onClick={goto}
                premium={it.premium} locked={locked} cost={cost}
                editMode={editMode}
                draggable={editMode && !it.locked}
                onDragStart={onItemDragStart(section.id, it.id)}
                onDragOver={(e) => {if (drag?.type === 'item') e.preventDefault();}}
                onDrop={onItemDropOnItem(section.id, it.id)} />);

          })}
            {editMode && section.items.length === 0 &&
          <div className="kbv-side-empty-drop">Suelta accesos aquí</div>
          }
          </div>
        )}
        {editMode &&
        <button type="button" className="kbv-side-add-section" onClick={addSection}>
            <KIcon name="plus" size={12} /> Nueva sección
          </button>
        }
      </div>

      {/* Hidden tray */}
      {hiddenSections.length > 0 &&
      <div className="kbv-side-hidden">
          <div className="hidden-head">
            <KIcon name="eye-off" size={11} />
            <span>Ocultas ({hiddenSections.length})</span>
          </div>
          {hiddenSections.map((s) =>
        <button key={s.id} type="button" className="hidden-row" onClick={() => unhide(s.id)} title="Volver a mostrar">
              <span>{s.name}</span>
              <KIcon name="plus" size={10} />
            </button>
        )}
        </div>
      }

      <div className="kbv-side-foot" style={{ borderTop: '1px solid var(--kb-border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button type="button" className="kbv-side-modules" onClick={() => onOpenModules && onOpenModules()} title="Desbloquea módulos premium con materia oscura">
          <KIcon name="shield" size={13} />
          <span>Módulos</span>
          <span className="mod-pill">premium</span>
        </button>
        <SideLink id="settings" active={active} icon="settings" label="Configuración" onClick={goto} />
        <SideLink id="account" active={active} icon="user" label="Cuenta" onClick={goto} />
      </div>
    </aside>);

}

function SideLink({ id, active, icon, label, soon, onClick, editMode, draggable, onDragStart, onDragOver, onDrop, premium, locked, cost }) {
  return (
    <button
      type="button"
      className={`kbv-side-link ${active === id ? 'active' : ''} ${editMode ? 'editable' : ''} ${draggable ? 'draggable' : ''} ${locked ? 'locked-premium' : ''}`}
      draggable={!!draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => {if (!editMode) onClick && onClick(id);}}>
      {editMode && draggable && <span className="item-grip" title="Mover acceso"><KIcon name="grip" size={9} /></span>}
      <KIcon name={icon} size={18} />
      <span>{label}</span>
      {locked ?
      <span className="prem-lock" title={`Módulo premium · ◆ ${cost} fragmentos`}><KIcon name="shield" size={10} /> ◆{cost}</span> :
      soon && <span className="soon">próx</span>}
    </button>);

}

// ─────────────────────────────────────────────────────────────
// Coin / Gem dropdown — shows last transactions
// ─────────────────────────────────────────────────────────────
// De dónde sale (y a dónde va) cada movimiento. Sin esto el historial cuenta
// el qué pero no el porqué, y no se puede responder «¿de dónde salió todo
// esto?» — la pregunta que la gente hace de verdad.
const LEDGER_SRC = {
  habito:     { n: 'Hábitos',     icon: 'flame',       c: 'var(--kb-streak)' },
  tarea:      { n: 'Tareas',      icon: 'list',        c: 'var(--kb-primary)' },
  proyecto:   { n: 'Proyectos',   icon: 'folder',      c: 'var(--area-wisdom)' },
  reto:       { n: 'Retos',       icon: 'sword',       c: 'var(--kb-hp)' },
  lectura:    { n: 'Lectura',     icon: 'book-open',   c: 'var(--kb-gem)' },
  racha:      { n: 'Racha',       icon: 'flame',       c: 'var(--kb-streak)' },
  recompensa: { n: 'Recompensas', icon: 'trophy',      c: 'var(--kb-medal)' },
  cofre:      { n: 'Cofres',      icon: 'sparkle',     c: 'var(--kb-void-1)' },
  plataforma: { n: 'Plataforma',  icon: 'settings',    c: 'var(--kb-text-3)' },
  compra:     { n: 'Compra',      icon: 'shop',        c: 'var(--area-community)' },
};

const COIN_LEDGER_DEMO = [
{ id: 'l1', src: 'habito', amt: +25, reason: 'Hábitos completados (3×)', when: 'Hoy · 10:42', kind: 'earn' },
{ id: 'l2', src: 'lectura', amt: +60, reason: 'Sesión de lectura · 45 min', when: 'Hoy · 09:15', kind: 'earn' },
{ id: 'l3', src: 'recompensa', amt: -120, reason: 'Recompensa: Cena italiana', when: 'Ayer · 21:30', kind: 'spend' },
{ id: 'l4', src: 'tarea', amt: +80, reason: 'Tarea cerrada · alta prioridad', when: 'Ayer · 18:04', kind: 'earn' },
{ id: 'l5', src: 'habito', amt: +40, reason: 'Hábitos completados (4×)', when: 'Ayer · 09:00', kind: 'earn' },
{ id: 'l6', src: 'recompensa', amt: -200, reason: 'Recompensa: Película + popcorn', when: 'Sáb · 16:12', kind: 'spend' },
{ id: 'l7', src: 'proyecto', amt: +150, reason: 'Proyecto completado · Aurora', when: 'Vie · 17:48', kind: 'earn' },
{ id: 'l8', src: 'cofre', amt: -350, reason: 'Cofre de monedas (5×)', when: 'Jue · 12:20', kind: 'spend' },
{ id: 'l9', src: 'habito', amt: +35, reason: 'Hábitos + diario', when: 'Mié · 22:05', kind: 'earn' },
{ id: 'l10', src: 'reto', amt: +90, reason: 'Reto día 18 · sin falta', when: 'Mar · 23:00', kind: 'earn' }];


const GEM_LEDGER_DEMO = [
{ id: 'g1', src: 'plataforma', amt: -8, reason: 'Desbloquear fila extra · dashboard', when: 'Hoy · 11:02', kind: 'spend' },
{ id: 'g2', src: 'reto', amt: +40, reason: 'Reto completado · "7 días sin redes"', when: 'Feb · 08', kind: 'earn' },
{ id: 'g3', src: 'recompensa', amt: -50, reason: 'Recompensa Premium: Día libre', when: 'Ene · 25', kind: 'spend' },
{ id: 'g4', src: 'reto', amt: +60, reason: 'Reto completado · "Meditar 30 días"', when: 'Abr · 15', kind: 'earn' },
{ id: 'g5', src: 'compra', amt: +5300, reason: 'Compra paquete · Premium anual', when: '2026-04-01', kind: 'earn' },
{ id: 'g6', src: 'plataforma', amt: -200, reason: 'Crear área "Creatividad"', when: '2026-03-22', kind: 'spend' },
{ id: 'g7', src: 'reto', amt: +30, reason: 'Reto día 30 · "Sin azúcar"', when: '2026-03-22', kind: 'earn' },
{ id: 'g8', src: 'plataforma', amt: -100, reason: 'Tema oscuro premium', when: '2026-03-10', kind: 'spend' },
{ id: 'g9', src: 'reto', amt: +80, reason: 'Reto "Procrastinación" · día 30', when: '2026-02-28', kind: 'earn' },
{ id: 'g10', src: 'racha', amt: +15, reason: 'Bonificación racha 21 días', when: '2026-02-21', kind: 'earn' }];


function CurrencyDropdown({ kind, total, anchorClass, onClose, children }) {
  const ref = React.useRef();
  React.useEffect(() => {
    function onClick(e) {if (ref.current && !ref.current.contains(e.target)) onClose();}
    setTimeout(() => document.addEventListener('mousedown', onClick), 10);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
  const all = kind === 'coin' ? COIN_LEDGER_DEMO : GEM_LEDGER_DEMO;
  const [src, setSrc] = React.useState('all');
  const ledger = src === 'all' ? all : all.filter((l) => l.src === src);
  const earned = ledger.filter((l) => l.kind === 'earn').reduce((s, l) => s + l.amt, 0);
  const spent = Math.abs(ledger.filter((l) => l.kind === 'spend').reduce((s, l) => s + l.amt, 0));
  // Los orígenes que aportaron, de mayor a menor: la respuesta a «¿de dónde
  // salió esto?» en una línea.
  const bySrc = Object.entries(all.filter((l) => l.kind === 'earn').reduce((m, l) => {
    m[l.src] = (m[l.src] || 0) + l.amt; return m;
  }, {})).sort((a, b) => b[1] - a[1]);
  return (
    <div ref={ref} className={`kbv-currency-dropdown ${kind}`} onClick={(e) => e.stopPropagation()}>
      <div className="dd-head">
        <div className="dd-title">
          <span className="big">
            {curGlyph(kind === 'coin' ? 'coin' : 'dark', 24)}
            <span>{total}</span>
          </span>
          <span className="kbv-meta">{kind === 'coin' ? `${curLabel('coin')} · ganadas por actividad` : `${curLabel('dark')} · Premium · recompensas de retos`}</span>
        </div>
        <div className="dd-summary">
          <span className="earn">+{earned}</span>
          <span className="kbv-meta">ganadas</span>
          <span className="spend">−{spent}</span>
          <span className="kbv-meta">gastadas</span>
        </div>
      </div>
      <div className="dd-srcs">
        <button type="button" className={src === 'all' ? 'on' : ''} onClick={() => setSrc('all')}>Todo</button>
        {bySrc.map(([s, amt]) => {
          const meta = LEDGER_SRC[s] || { n: s, icon: 'sparkle', c: 'var(--kb-text-3)' };
          return (
            <button key={s} type="button" className={src === s ? 'on' : ''} style={{ '--c': meta.c }}
                    onClick={() => setSrc(src === s ? 'all' : s)} title={`${meta.n}: +${amt}`}>
              <KIcon name={meta.icon} size={11} /> {meta.n} <b>+{amt}</b>
            </button>
          );
        })}
      </div>
      <div className="dd-list">
        {ledger.map((l) => {
          const meta = LEDGER_SRC[l.src] || null;
          return (
            <div key={l.id} className={`dd-row ${l.kind}`}>
              <span className="amt">
                {l.amt > 0 ? '+' : ''}{l.amt}
                {curGlyph(kind === 'coin' ? 'coin' : 'dark', 11)}
              </span>
              <div className="info">
                <span className="reason">{l.reason}</span>
                <span className="when">
                  {meta && <em style={{ color: meta.c }}><KIcon name={meta.icon} size={10} /> {meta.n}</em>}
                  {l.when}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="dd-foot">
        <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={onClose}>
          Cerrar
        </button>
        {kind === 'gem' && <span className="kbv-meta">La materia oscura se compra o se gana en retos premium.</span>}
        {kind === 'coin' && <span className="kbv-meta">Convierte 10× monedas en cofres premium.</span>}
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Header — restructured: bigger hero id, HP/XP centered, streak + currencies right
// ─────────────────────────────────────────────────────────────
function Header({ user, stats, headerRef, statsRef, currencyRef }) {
  // La vida es estado real: hábitos y retos la mueven (kibo-vitals).
  if (typeof useCurrencyRepaint === 'function') useCurrencyRepaint();
  const live = (typeof useVitals === 'function') ? useVitals() : null;
  const hp = live ? live.hp : stats.hp;
  const hpMax = live ? live.max : stats.hpMax;
  const hpPct = Math.round((hp / hpMax) * 100);
  const userName = (user?.name || 'Hero').trim() || 'Hero';
  const [openDD, setOpenDD] = React.useState(null); // null | 'coin' | 'gem'
  // Vitrina: la portada y el marco elegidos se reflejan SOLO en la zona de identidad.
  const cardCos = typeof useCardCosmetics === 'function' ? useCardCosmetics() : { bg: 'vt-bg-slate', frame: 'vt-fr-none' };
  const heroBg = typeof cardBgById === 'function' ? cardBgById(cardCos.bg) : null;
  // El HUD monta la MISMA portada que la carta (mismo componente, misma
  // animación): si arriba se pintara plana, el usuario compraría un fondo
  // vivo y lo vería muerto en el único sitio que mira todo el día.
  const heroFrame = typeof frameRingStyle === 'function' ? frameRingStyle(cardCos.frame) : {};
  return (
    <header className="kbv-header" ref={headerRef}>
      <div className="left">
        <div className={`kbv-hero-id clickable ${heroBg ? 'vt-themed' : ''}`} role="button" title="Ver Mi progreso" onClick={() => {try {window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'progreso' } }));} catch (_) {}}}>
          {heroBg && typeof CardBackdrop === 'function' && <CardBackdrop bgId={cardCos.bg} className="vt-hud-bg" />}
          <div className="kbv-hero-avatar-wrap" style={heroFrame}>
            <UserAvatar user={user} size={48} />
            {typeof EmblemBadge === 'function' &&
            <span className="kbv-hero-emblem" title={stats.prestigeCompleted >= 1 ? `Prestigio ${stats.prestigeCompleted}` : `Rango ${stats.level}`}>
                <EmblemBadge completed={stats.prestigeCompleted ?? 0} level={stats.level ?? 1} master={!!stats.prestigeMaster} size={22} />
              </span>
            }
          </div>
          <div className="kbv-hero-meta" data-comment-anchor="hero-id-block">
            <div className="row top">
              <span className="name">{userName}</span>
              <span className={`lvl-chip ${stats.prestigeMaster ? 'rainbow' : ''}`}>NV. {stats.prestigeMaster ? stats.paragonLevel || stats.level : stats.level}</span>
              <span className="prestige">· {stats.prestige}</span>
            </div>
            <div className="row xp-row">
              <span className="xp-track"><span className={`xp-fill ${stats.prestigeMaster ? 'rainbow' : ''}`} style={{ width: `${stats.xpPct}%` }} /></span>
              <span className="xp-num kbv-num">{stats.xp.toLocaleString('es-MX')} / {stats.xpMax.toLocaleString('es-MX')} XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="center" ref={statsRef}>
        {typeof KiboSearchBar === 'function' && <KiboSearchBar />}
        <div className={`kbv-bar hp ${hpPct < 30 ? 'low' : ''}`}>
          <span className="label">HP</span>
          <div className="track"><div className="fill" style={{ width: `${hpPct}%` }} /></div>
          <span className="num kbv-num">{hp} / {hpMax}</span>
          {hpPct < 30 &&
          <span className="kbv-hp-trance" tabIndex={0} aria-label="Cerca del trance">
              <KIcon name="alert" size={13} />
              <span className="kbv-hp-trance-tip" role="tooltip">
                <strong>Cuidado: cerca del trance</strong>
                <span>Tu HP está por debajo del 30%. Si llega a 0 entras en <b>trance</b>: empiezas a perder XP hasta cero y puedes perder tu progreso. Cumple tus hábitos y retos para recuperar vida.</span>
              </span>
            </span>
          }
        </div>
      </div>

      <div className="right" ref={currencyRef}>
        <HUDStreak
          days={stats.streak}
          protectors={stats.protectors ?? 1}
          protectorsMax={stats.protectorsMax ?? 2}
          challengeActive={!!stats.bossActive} />
        <div className="kbv-stat-pill coin clickable" title={`${curLabel('coin')} · ver últimas transacciones`} onClick={() => setOpenDD(openDD === 'coin' ? null : 'coin')}>
          <span className="icon" style={{ background: 'transparent', padding: 0 }}>{curGlyph('coin', 16)}</span>
          <span>{stats.coins}</span>
          {openDD === 'coin' && <CurrencyDropdown kind="coin" total={stats.coins} onClose={() => setOpenDD(null)} />}
        </div>
        <div className="kbv-stat-pill gem clickable" title={`${curLabel('dark')} · ver últimas transacciones`} onClick={() => setOpenDD(openDD === 'gem' ? null : 'gem')}>
          <span className="icon" style={{ background: 'transparent', padding: 0 }}>{curGlyph('dark', 16)}</span>
          <span>{fmtNum(stats.gems)}</span>
          {openDD === 'gem' && <CurrencyDropdown kind="gem" total={fmtNum(stats.gems)} onClose={() => setOpenDD(null)} />}
        </div>
      </div>
    </header>);

}

// ─────────────────────────────────────────────────────────────
// Tasks
// ─────────────────────────────────────────────────────────────
const PRIORITY_DEFS = {
  urgent: { label: 'Urgente', color: 'var(--pri-urgent)' },
  high: { label: 'Alta', color: 'var(--pri-high)' },
  medium: { label: 'Media', color: 'var(--pri-medium)' },
  low: { label: 'Baja', color: 'var(--pri-low)' },
  vlow: { label: 'Muy baja', color: 'var(--pri-vlow)' }
};
const PRIORITY_ORDER = ['urgent', 'high', 'medium', 'low', 'vlow'];

const DEMO_TASKS = [
{ id: 't1', title: 'Cerrar propuesta para cliente Aurora', area: 'wealth', priority: 'urgent', time: '2h', energy: 4, done: false },
{ id: 't2', title: 'Correr 5 km — entrenamiento de zona 2', area: 'vigor', priority: 'high', time: '1h', energy: 3, done: false },
{ id: 't3', title: 'Leer cap. 3 de "Atomic Habits"', area: 'wisdom', priority: 'high', time: '45m', energy: 2, done: false },
{ id: 't4', title: 'Llamar a mamá', area: 'community', priority: 'medium', time: '30m', energy: 1, done: false },
{ id: 't5', title: 'Meditar 10 min (sin pantalla)', area: 'will', priority: 'medium', time: '10m', energy: 1, done: true },
{ id: 't6', title: 'Revisar y categorizar gastos de la semana', area: 'wealth', priority: 'low', time: '20m', energy: 2, done: false },
{ id: 't7', title: 'Responder mensajes pendientes', area: null, priority: 'vlow', time: '15m', energy: 1, done: false }];


const DEMO_HABITS = [
{ id: 'h1', name: 'Tomar 2L de agua', streak: 14, when: 'Cualquier hora', done: true, xp: 10, icon: 'vigor', c: 'var(--area-wisdom)' },
{ id: 'h2', name: 'No redes < 22h', streak: 12, when: 'Noche', done: true, xp: 15, icon: 'will', c: 'var(--area-community)' },
{ id: 'h3', name: 'Estiramientos AM', streak: 8, when: 'Antes de las 9', done: false, xp: 10, icon: 'vigor', c: 'var(--area-vigor)' },
{ id: 'h4', name: 'Diario nocturno', streak: 21, when: 'Antes de dormir', done: false, xp: 12, icon: 'edit', c: 'var(--area-community)' }];


function TaskRow({ task, onToggle }) {
  const area = KIBO_AREAS_V2.find((a) => a.id === task.area);
  const pri = PRIORITY_DEFS[task.priority];
  return (
    <div className={`kbv-task ${task.done ? 'done' : ''}`} onClick={() => onToggle(task.id)}>
      <div className="check" />
      <div className="area-tag" style={{ '--c': area ? area.color : 'var(--kb-text-3)' }} />
      <div className="body">
        <div className="title">{task.title}</div>
        <div className="sub">
          {area ? <span style={{ color: area.color, fontWeight: 600 }}>{area.name}</span> : <span style={{ fontStyle: 'italic' }}>Sin área</span>}
          <span>·</span>
          <span className="energy">{[1, 2, 3, 4, 5].map((i) => <span key={i} className={`e ${i <= task.energy ? 'on' : ''}`} />)}</span>
          <span>·</span>
          <span>{task.energy}/5 energía</span>
        </div>
      </div>
      <span className="pri" style={{ '--p': pri.color }}>{pri.label}</span>
      <span className="time">{task.time}</span>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Hábitos — BIG section (Sergio: hasta arriba y en grande)
// ─────────────────────────────────────────────────────────────
function HabitsBig({ habits, onToggle, onAddHabit, showAdd = true, streakDays = 23, protectors = 1, protectorsMax = 2 }) {
  const done = habits.filter((h) => h.done).length;
  const xpOf = (h) => h.xp != null ? h.xp : typeof habitReward === 'function' ? habitReward(h.energy, h.effort).xp : 10;
  const xpEarned = habits.filter((h) => h.done).reduce((a, h) => a + xpOf(h), 0);
  const xpPossible = habits.reduce((a, h) => a + xpOf(h), 0);
  return (
    <section className="kbv-habits-big">
      <div className="head">
        <div className="top" style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'var(--kb-primary-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--kb-primary)',
            flexShrink: 0
          }}>
            <KIcon name="flame" size={28} />
          </div>
          <div className="name" style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 22, color: 'var(--kb-text)', whiteSpace: 'nowrap' }}>
                Hábitos de hoy
              </h2>
              {showAdd &&
              <button
                type="button"
                className="kbv-habits-add-btn"
                title="Agregar hábito"
                aria-label="Agregar hábito"
                onClick={(e) => {e.stopPropagation();onAddHabit && onAddHabit();}}>
                <KIcon name="plus" size={13} />
              </button>
              }
            </div>
            <p className="sub" style={{ marginTop: 4, fontSize: 13, color: 'var(--kb-text-2)' }}>
              {done} de {habits.length} completados hoy
            </p>
          </div>
        </div>
        <div className="stats" style={{ alignItems: 'center' }}>
          <div>
            <span className="val">{done}<span style={{ fontSize: 16, color: 'var(--kb-text-2)' }}>/{habits.length}</span></span>
            <span className="lbl">Hoy</span>
          </div>
          <div>
            <span className="val" style={{ color: 'var(--kb-primary)' }}>+{xpEarned}</span>
            <span className="lbl">XP · de {xpPossible}</span>
          </div>
        </div>
      </div>
      <div className="kbv-habits-grid">
        {habits.map((h) =>
          <KbHabitCard key={h.id} h={h} onToggle={onToggle} />
        )}
      </div>
    </section>);

}

// ─────────────────────────────────────────────────────────────
// Reto / Hábitos / Tareas — wrapped as widgets so they live in the grid
// ─────────────────────────────────────────────────────────────
function HabitsBigWidget({ size = 'L' }) {
  const [habits, setHabits] = React.useState(DEMO_HABITS);
  const [createOpen, setCreateOpen] = React.useState(false);
  function toggle(id) {setHabits((hs) => hs.map((h) => h.id === id ? { ...h, done: !h.done } : h));}
  function onSave(h) {
    setHabits((hs) => [...hs, {
      id: 'h' + Math.random().toString(36).slice(2, 6),
      name: h.name || 'Nuevo hábito',
      streak: 0,
      when: h.when || 'Cualquier hora',
      done: false,
      xp: h.xp || 10,
      icon: h.icon || 'flame',
      c: h.color || 'var(--kb-primary)'
    }]);
  }
  return (
    <div style={{ margin: 0 }}>
      <HabitsBig habits={habits} onToggle={toggle} onAddHabit={() => setCreateOpen(true)} streakDays={23} protectors={1} protectorsMax={2} />
      {createOpen && <CreateHabitModal onClose={() => setCreateOpen(false)} onSave={onSave} />}
    </div>);

}

function TasksTodayWidget({ w = 2, h = 3, onNavigate }) {
  const [tasks, setTasks] = React.useState(DEMO_TASKS);
  function toggle(id) {setTasks((ts) => ts.map((t) => t.id === id ? { ...t, done: !t.done } : t));}
  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority);
  });
  const pending = tasks.filter((t) => !t.done).length;

  // BIG (4 wide, 2+ tall) → split view: list left + simple kanban right
  const isBig = w >= 4 && h >= 2;
  if (isBig) {
    const cols = [
    { id: 'todo', name: 'Por hacer', filter: (t) => !t.done },
    { id: 'done', name: 'Hecho', filter: (t) => t.done }];

    return (
      <div className="kbv-card kbv-tasks-split" style={{ margin: 0 }}>
        <div className="kbv-card-head">
          <div>
            <h2 className="kbv-h3">Tareas de hoy</h2>
            <p className="kbv-body" style={{ marginTop: 2, fontSize: 12 }}>{pending} pendientes · lista + tablero</p>
          </div>
          <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={() => onNavigate && onNavigate('tareas')}>
            Ver todas →
          </button>
        </div>
        <div className="kbv-tasks-split-body">
          <div className="split-list">
            <div className="col-label">Lista priorizada</div>
            {sorted.slice(0, 6).map((t) =>
            <div key={t.id} className={`split-task ${t.done ? 'done' : ''}`} onClick={() => toggle(t.id)}>
                <span className="check" />
                <PriorityIcon level={t.priority} size={13} />
                <span className="ttl">{t.title}</span>
              </div>
            )}
          </div>
          <div className="split-kanban">
            {cols.map((c) =>
            <div key={c.id} className="mini-col">
                <div className="mini-col-head">{c.name} <span>{tasks.filter(c.filter).length}</span></div>
                {sorted.filter(c.filter).slice(0, 5).map((t) => {
                const area = KIBO_AREAS_V2.find((a) => a.id === t.area);
                return (
                  <div key={t.id} className="mini-card" style={{ '--c': area?.color || 'var(--kb-text-3)' }} draggable>
                      <PriorityIcon level={t.priority} size={11} />
                      <span>{t.title}</span>
                    </div>);

              })}
              </div>
            )}
          </div>
        </div>
      </div>);

  }

  // Compact list (1×1, 2×1, 2×3) — max 2 cols depending on width
  const limit = w >= 2 ? h >= 3 ? 6 : 4 : 3;
  return (
    <div className="kbv-card kbv-tasks-widget" style={{ margin: 0 }}>
      <div className="kbv-card-head">
        <div>
          <h2 className="kbv-h3">Tareas de hoy</h2>
          {w >= 2 && <p className="kbv-body" style={{ marginTop: 2, fontSize: 12 }}>Por prioridad</p>}
        </div>
        <span className="kbv-meta">{pending} pend.</span>
      </div>
      <div className="kbv-card-body kbv-stack-8">
        {sorted.slice(0, limit).map((t) => <TaskRow key={t.id} task={t} onToggle={toggle} compact={w < 2} />)}
        {limit < tasks.length &&
        <button type="button" className="kbv-btn-link" style={{ alignSelf: 'flex-start', padding: '4px 0', fontSize: 12 }}
        onClick={() => onNavigate && onNavigate('tareas')}>
            Ver {tasks.length - limit} más
          </button>
        }
      </div>
    </div>);

}

// Bloque F · reto/habits/tasks are owned by widgets-v3.jsx (size-aware variants +
// correct per-widget `sizes`). We intentionally do NOT re-register them here —
// doing so previously clobbered the framework because this file loads later.

// ─────────────────────────────────────────────────────────────
// Reorderable widget grid — 4 cols, each widget can be 1×1 … 4×4
// ─────────────────────────────────────────────────────────────
const SIZE_TO_W = { S: 1, M: 2, L: 3, XL: 4 };
function itemW(it) {
  if (typeof it.w === 'number') return Math.max(1, Math.min(4, it.w));
  return SIZE_TO_W[it.size] || 1;
}
function itemH(it) {
  if (typeof it.h === 'number') return Math.max(1, Math.min(4, it.h));
  return it.tall ? 2 : 1;
}

const SIZE_LABELS = {
  '1-1': 'Pequeño', '1-2': 'Alto', '2-1': 'Ancho', '2-2': 'Mediano',
  '4-1': 'Banner', '4-2': 'Grande', '4-3': 'Extra grande'
};
function SizePicker({ w, h, allowedSizes, onPick }) {
  // Show ONLY the sizes this widget supports — as a simple option list.
  const opts = allowedSizes && allowedSizes.length ? allowedSizes : [[1, 1]];
  return (
    <div className="kbv-size-picker list" onClick={(e) => e.stopPropagation()}>
      <div className="head">Tamaño del widget</div>
      <div className="opts">
        {opts.map(([cw, ch]) => {
          const active = cw === w && ch === h;
          return (
            <button
              key={`${cw}-${ch}`}
              type="button"
              className={`opt ${active ? 'on' : ''}`}
              onClick={() => onPick(cw, ch)}
              title={`${cw}×${ch}`}>
              <span className="prev" style={{ width: 12 + cw * 6, height: 8 + ch * 7 }} />
              <span className="dim">{cw}×{ch}</span>
              <span className="nm">{SIZE_LABELS[`${cw}-${ch}`] || ''}</span>
              {active && <span className="tick"><KIcon name="check" size={12} /></span>}
            </button>);

        })}
      </div>
    </div>);

}

function WidgetGrid({ items, editing, onReorder, onRemove, onResize, ctx, onAdd, maxRows, onAddRow, premiumRowCost }) {
  const [draggingId, setDraggingId] = React.useState(null);
  const [overId, setOverId] = React.useState(null);
  const [pickerId, setPickerId] = React.useState(null);

  function onDragStart(id) {return (e) => {
      setDraggingId(id);
      e.dataTransfer.effectAllowed = 'move';
      try {e.dataTransfer.setData('text/plain', id);} catch (_) {}
    };}
  function onDragOver(id) {return (e) => {
      if (!draggingId) return;
      e.preventDefault();
      setOverId(id);
    };}
  function onDrop(id) {return (e) => {
      e.preventDefault();
      if (!draggingId || draggingId === id) return reset();
      const next = [...items];
      const fromIdx = next.findIndex((it) => it.id === draggingId);
      const toIdx = next.findIndex((it) => it.id === id);
      if (fromIdx === -1 || toIdx === -1) return reset();
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      onReorder(next);
      reset();
    };}
  function reset() {setDraggingId(null);setOverId(null);}

  // Compute used cell area + remaining empty placeholders to show
  const totalCapacity = (maxRows || 0) * 4;
  const usedCapacity = items.reduce((a, it) => a + itemW(it) * itemH(it), 0);
  const remainingCapacity = Math.max(0, totalCapacity - usedCapacity);
  const emptySlots = editing ? Math.min(remainingCapacity, 12) : 0;

  return (
    <div className={`kbv-canvas-grid ${editing ? 'editing' : ''}`}>
      {items.map((it) => {
        const Comp = WIDGET_COMPONENTS[it.id];
        const def = WIDGET_REGISTRY[it.id];
        if (!Comp) return null;
        const w = itemW(it);
        const h = itemH(it);
        const allowedSizes = def?.sizes || [[1, 1]];
        const isDragging = draggingId === it.id;
        const isOver = overId === it.id && draggingId !== it.id;
        const pickerOpen = pickerId === it.id;
        return (
          // La colocación la manda el CSS por las clases w-* / h-*. Escrita en
          // línea, ninguna media query podía acotarla: al bajar la rejilla a 2
          // pistas, un span de 4 inventaba pistas implícitas de ancho cero y
          // los tiles siguientes caían dentro.
          <div
            key={it.id}
            className={`kbv-widget ${editing ? 'editable' : ''} ${isDragging ? 'dragging' : ''} ${h > 1 ? 'tall' : ''} w-${w} h-${h}`}
            draggable={editing}
            onDragStart={editing ? onDragStart(it.id) : undefined}
            onDragOver={editing ? onDragOver(it.id) : undefined}
            onDrop={editing ? onDrop(it.id) : undefined}
            onDragEnd={editing ? reset : undefined}
            style={isOver ? { outline: '2px dashed var(--kb-primary)', outlineOffset: 4 } : undefined}>
            {editing &&
            <div className="kbv-widget-size-tabs">
                <button
                type="button"
                className="size-current"
                onClick={(e) => {e.stopPropagation();setPickerId(pickerOpen ? null : it.id);}}
                title="Cambiar tamaño">
                  {w}×{h}
                </button>
                {pickerOpen &&
              <SizePicker
                w={w}
                h={h}
                allowedSizes={allowedSizes}
                onPick={(cw, ch) => {onResize(it.id, cw, ch);setPickerId(null);}} />

              }
              </div>
            }
            <div className="kbv-widget-inner">
              <Comp ctx={ctx} size={w >= 3 ? 'L' : w === 2 ? 'M' : 'S'} w={w} h={h} />
            </div>
            {editing &&
            <div className="kbv-widget-controls">
                <button type="button" title="Mover" style={{ cursor: 'grab' }}>
                  <KIcon name="grip" size={14} />
                </button>
                <button type="button" className="danger" onClick={() => onRemove(it.id)} title="Quitar del dashboard">
                  <KIcon name="x" size={14} />
                </button>
              </div>
            }
          </div>);
      })}
      {editing && Array.from({ length: emptySlots }).map((_, i) =>
      <button key={`slot-${i}`} type="button" className="kbv-slot-empty" onClick={onAdd}
      title="Slot disponible · agregar widget">
          <KIcon name="plus" size={14} />
        </button>
      )}
      {editing && onAddRow &&
      <button type="button" className="kbv-row-unlock" onClick={onAddRow} style={{ gridColumn: '1 / -1' }}>
          <span className="glyph"><KIcon name="plus" size={16} /></span>
          <div className="info">
            <span className="name">Desbloquear fila adicional</span>
            <span className="sub">Tienes <strong>{maxRows}</strong> filas · {remainingCapacity} slots libres. Cada fila te da 4 slots más para widgets.</span>
          </div>
          <span className="price"><span className="gem">◆</span> {premiumRowCost} fragmentos</span>
        </button>
      }
    </div>);
}

// ─────────────────────────────────────────────────────────────
// Widget gallery (modal) — categorized + KPIs per section
// ─────────────────────────────────────────────────────────────
const WIDGET_CATEGORIES = [
{ id: 'today', name: 'Hoy', desc: 'Coach IA, resumen, bolsa y racha.', icon: 'home', color: 'var(--kb-primary)' },
{ id: 'personal', name: 'Personal', desc: 'Hábitos y retos — tu disciplina diaria.', icon: 'flame', color: 'var(--kb-streak)' },
{ id: 'work', name: 'Trabajo', desc: 'Tareas y proyectos con prioridad y timeline.', icon: 'list', color: 'var(--kb-primary)' },
{ id: 'diario', name: 'Diario', desc: 'Mood, gratitud y bitácora emocional.', icon: 'edit', color: 'var(--area-community)' },
{ id: 'lectura', name: 'Lectura', desc: 'Libro activo, sesiones y notas.', icon: 'book-open', color: 'var(--kb-gem)' },
{ id: 'estudio', name: 'Estudio', desc: 'Pomodoro, cursos y clases.', icon: 'layers', color: 'var(--area-wisdom)' },
{ id: 'entretenimiento', name: 'Entretenimiento', desc: 'Pelis, series y resumen anual.', icon: 'film', color: 'var(--kb-hp)' },
{ id: 'finance', name: 'Finanzas', desc: 'Balance, gastos, presupuesto y suscripciones.', icon: 'wealth', color: 'var(--area-wealth)' }];


function WidgetGallery({ activeIds, onClose, onPick }) {
  const [tab, setTab] = React.useState('today');
  const allWidgets = Object.values(WIDGET_REGISTRY).filter((w) => w && !w.hidden);
  const inSection = (cat) => allWidgets.filter((w) => (w.category || 'today') === cat);

  // KPIs por sección
  const kpis = WIDGET_CATEGORIES.map((c) => {
    const list = inSection(c.id);
    const free = list.filter((w) => !w.locked).length;
    const locked = list.filter((w) => w.locked).length;
    const inUse = list.filter((w) => activeIds.includes(w.id)).length;
    return { ...c, total: list.length, free, locked, inUse };
  });

  const visible = inSection(tab);

  return (
    <KBVModal size="full" title="Personaliza tu dashboard"
      sub="Agrega widgets a tu Hoy. Algunos son gratis; otros se desbloquean en la Tienda con monedas o fragmentos."
      onClose={onClose}>
        {/* KPIs strip — counts per section, jumps the active tab */}
        <div className="kbv-gallery-kpis">
          {kpis.map((k) =>
          <button
            key={k.id}
            type="button"
            className={`kbv-gallery-kpi ${tab === k.id ? 'on' : ''}`}
            style={{ '--c': k.color }}
            onClick={() => setTab(k.id)}>
              <span className="head">
                <span className="ico"><KIcon name={k.icon} size={16} /></span>
                <span className="name">{k.name}</span>
              </span>
              <span className="desc">{k.desc}</span>
              <span className="stats">
                <span className="stat"><span className="n">{k.total}</span><span className="l">widgets</span></span>
                <span className="stat"><span className="n" style={{ color: 'var(--kb-primary)' }}>{k.free}</span><span className="l">gratis</span></span>
                <span className="stat"><span className="n" style={{ color: 'var(--kb-gem-ink)' }}>{k.locked}</span><span className="l">premium</span></span>
                <span className="stat"><span className="n" style={{ color: 'var(--kb-text-2)' }}>{k.inUse}</span><span className="l">activos</span></span>
              </span>
            </button>
          )}
        </div>

        <div className="kbv-gallery-grid">
          {visible.map((w) => {
            const inUse = activeIds.includes(w.id);
            const disabled = inUse || w.locked;
            return (
              <button
                key={w.id}
                type="button"
                className="kbv-gallery-item"
                disabled={disabled}
                onClick={() => !disabled && onPick(w.id)}>
                
                <div className="top">
                  <span className="glyph"><KIcon name={w.icon} size={18} /></span>
                  <span className="name">{w.name}</span>
                </div>
                <span className="desc">{w.desc}</span>
                <span className="size-hint">Tamaños: 1×1 · 4×2</span>
                {inUse ?
                <span className="cost free">Ya en tu dashboard</span> :
                w.locked ?
                <span className={`cost ${w.cost.includes('fragmentos') ? 'gem' : ''}`}>{w.cost} · Tienda</span> :

                <span className="cost free">Gratis</span>
                }
              </button>);

          })}
        </div>
    </KBVModal>);

}

// ─────────────────────────────────────────────────────────────
// Acción rápida — KIBO. La mascota vive abajo a la izquierda y abre la
// rueda radial (RF-19 del DS): registro rápido + travesuras + «Léeme».
// ─────────────────────────────────────────────────────────────
function QuickFab({ user, stats }) {
  const [modalAction, setModalAction] = React.useState(null);

  // KIBO abre los formularios REALES de la plataforma sin sacarte de donde
  // estás: el FAB vive fuera de `.kbv-main`, así que el modal se monta encima
  // de cualquier pantalla sin que ninguna tenga que saber de KIBO.
  React.useEffect(() => {
    const h = (e) => { const k = e && e.detail && e.detail.kind; if (k) setModalAction(k); };
    window.addEventListener('kibo:open-modal', h);
    return () => window.removeEventListener('kibo:open-modal', h);
  }, []);

  const items = [
  { id: 'entry', label: 'Diario', icon: 'edit', desc: 'Entrada de diario · mood + foto', mode: 'modal' },
  { id: 'session', label: 'Leer', icon: 'book-open', desc: 'Cronómetro + páginas → Sabiduría', mode: 'nav', screen: 'lectura' },
  { id: 'pomodoro', label: 'Foco', icon: 'clock', desc: 'Bloque de foco · 25 min', mode: 'nav', screen: 'estudio' },
  { id: 'tx', label: 'Dinero', icon: 'wealth', desc: 'Entrada o salida en una cuenta', mode: 'nav', screen: 'finanzas' }];


  function pick(it) {
    if (it.mode === 'nav') {
      try {window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: it.screen, action: it.id } }));} catch (_) {}
      return;
    }
    setTimeout(() => setModalAction(it.id), 0);
  }

  const streak = stats?.streak ?? 23;
  const name = (user?.name || '').trim();
  const tip = `${name ? '¡Vas increíble, ' + name + '! ' : '¡Vas increíble! '}Llevas ${streak} días de racha. ¿Seguimos con lo de hoy?`;

  return (
    <React.Fragment>
      <KiboFab items={items} onPick={pick} tip={tip} />
      {modalAction &&
      <QuickActionRouter
        action={modalAction}
        onClose={() => setModalAction(null)}
        onCreated={() => {}} />
      }
    </React.Fragment>);

}

// ─────────────────────────────────────────────────────────────
// Today dashboard (restructured)
// ─────────────────────────────────────────────────────────────
const DEFAULT_WIDGET_LAYOUT = [
{ id: 'habits', w: 4, h: 1 },
{ id: 'reto', w: 2, h: 1 },
{ id: 'crono', w: 2, h: 1 },
{ id: 'tasks', w: 4, h: 2 },
{ id: 'proyectos', w: 2, h: 1 },
{ id: 'backlog', w: 1, h: 1 },
{ id: 'streak', w: 1, h: 1 },
{ id: 'escuela', w: 1, h: 1 },
{ id: 'familia', w: 1, h: 1 },
{ id: 'prestigio', w: 1, h: 1 },
{ id: 'origen', w: 1, h: 1 },
{ id: 'diario', w: 1, h: 1 },
{ id: 'lectura', w: 1, h: 1 },
{ id: 'watch', w: 1, h: 1 },
{ id: 'personalizar', w: 1, h: 1 }];


// Cada momento del día pide otra cosa arriba. El preset REORDENA lo que ya
// tienes y ajusta tamaños; nunca añade un widget que habría que comprar.
const BOARD_PRESETS = [
  { id: 'manana',  name: 'Mañana',  icon: 'sparkle', desc: 'Hábitos y racha primero; el día por delante.',
    first: ['habits', 'streak', 'reto', 'crono'], big: 'habits' },
  { id: 'trabajo', name: 'Trabajo', icon: 'list',    desc: 'Tareas y proyectos al frente; lo demás abajo.',
    first: ['tasks', 'proyectos', 'crono', 'backlog'], big: 'tasks' },
  { id: 'noche',   name: 'Noche',   icon: 'moon',    desc: 'Cierre del día: diario, lectura y balance.',
    first: ['diario', 'lectura', 'watch', 'origen'], big: 'diario' },
];
const BOARD_PRESET_KEY = 'kibo:board-preset';

function applyPreset(list, preset) {
  const rank = (id) => {
    const i = preset.first.findIndex(p => id.indexOf(p) >= 0);
    return i < 0 ? preset.first.length : i;
  };
  return list.slice()
    .sort((a, b) => rank(a.id) - rank(b.id))
    .map(it => (it.id.indexOf(preset.big) >= 0 ? { ...it, w: Math.max(it.w || 1, 2) } : it));
}

function TodayDashboard({ user, stats, bossActive, refs }) {
  const [editing, setEditing] = React.useState(false);
  const [layout, setLayout] = React.useState(DEFAULT_WIDGET_LAYOUT);
  const [preset, setPreset] = React.useState(() => {
    try { return localStorage.getItem(BOARD_PRESET_KEY) || ''; } catch (_) { return ''; }
  });
  const [maxRows, setMaxRows] = React.useState(9); // base unlocked rows
  const [galleryOpen, setGalleryOpen] = React.useState(false);

  const userName = (user?.name || 'Hero').trim() || 'Hero';

  React.useEffect(() => {
    const p = BOARD_PRESETS.find(x => x.id === preset);
    if (p) setLayout(applyPreset(DEFAULT_WIDGET_LAYOUT, p));
  }, []);

  const widgetCtx = {
    bossActive: bossActive ?? stats?.bossActive,
    habitsDone: 2, habitsTotal: 4,
    tasksDone: 1, tasksTotal: 7,
    onNavigate: refs?.onNavigate
  };

  return (
    <div className="kbv-main">
      {/* Page head — title + customize toggle */}
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>{crumb('today', 'Lun 25 May')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Buenas tardes, {userName}. <InfoDot label="i" text={`Tu dashboard se acomoda solo. 4 columnas, hasta ${maxRows} filas — cada widget va de 1×1 a 4×4. Arrastra, redimensiona, explora más en el marketplace.`} /></h1>
        </div>
        <div className="actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="kbv-board-presets" role="group" aria-label="Arreglo del tablero">
            {BOARD_PRESETS.map(p => (
              <button key={p.id} type="button" className={preset === p.id ? 'on' : ''} title={p.desc}
                      onClick={() => {
                        const next = preset === p.id ? '' : p.id;
                        setPreset(next);
                        try { localStorage.setItem(BOARD_PRESET_KEY, next); } catch (_) {}
                        setLayout(next ? applyPreset(DEFAULT_WIDGET_LAYOUT, p) : DEFAULT_WIDGET_LAYOUT);
                      }}>
                <KIcon name={p.icon} size={13} /> {p.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="kbv-btn kbv-btn-secondary"
            onClick={() => setGalleryOpen(true)}
            style={{ padding: '10px 14px', fontSize: 13 }}>
            <KIcon name="shop" size={14} /> Explorar widgets
          </button>
          <button
            type="button"
            className={`kbv-edit-toggle ${editing ? 'on' : ''}`}
            onClick={() => setEditing((e) => !e)}>
            <span className="dot" />
            {editing ? 'Listo' : 'Editar dashboard'}
          </button>
        </div>
      </div>

      {/* Widget grid */}
      <div className="kbv-canvas-wrap">
        <WidgetGrid
          items={layout}
          editing={editing}
          onReorder={setLayout}
          onRemove={(id) => setLayout((l) => l.filter((it) => it.id !== id))}
          onResize={(id, w, h) => setLayout((l) => l.map((it) => it.id === id ? { ...it, w, h } : it))}
          onAdd={() => setGalleryOpen(true)}
          maxRows={maxRows}
          onAddRow={() => setMaxRows((r) => r + 1)}
          premiumRowCost={8}
          ctx={widgetCtx} />
      </div>

      {galleryOpen &&
      <WidgetGallery
        activeIds={layout.map((it) => it.id)}
        onClose={() => setGalleryOpen(false)}
        onPick={(id) => {
          setLayout((l) => l.find((it) => it.id === id) ? l : [...l, { id, w: 1, h: 1 }]);
          setGalleryOpen(false);
        }} />

      }
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Tutorial overlay — uses dashboard as backdrop
// ─────────────────────────────────────────────────────────────
function TutorialOverlay({ onNavigate, user, stats }) {
  const refs = {
    sidebar: React.useRef(null),
    header: React.useRef(null),
    boss: React.useRef(null),
    tasks: React.useRef(null),
    habits: React.useRef(null),
    fab: React.useRef(null)
  };

  const steps = [
  { key: 'sidebar',
    title: 'Tu mapa, siempre a la izquierda.',
    body: 'Tus hábitos viven aquí arriba, destacados. Debajo: día, áreas, proyectos, diario, lectura y más.',
    align: 'right' },
  { key: 'header',
    title: 'Stats que te acompañan.',
    body: 'HP, XP, racha, monedas y fragmentos siempre visibles. Kibo cambia de cara según cómo estés.',
    align: 'bottom' },
  { key: 'habits',
    title: 'Hábitos = lo primero del día.',
    body: 'Repetitivos, pequeños, alimentan tu HP y tu racha global. No pertenecen a un área.',
    align: 'bottom' },
  { key: 'tasks',
    title: 'Tareas de hoy.',
    body: 'Ordenadas por prioridad: Urgente → Muy baja. Cada tarea muestra área, energía y tiempo.',
    align: 'top' },
  { key: 'fab',
    title: 'Acción rápida, siempre a mano.',
    body: 'Crea tareas, proyectos, hábitos, entradas de diario o registros de lectura desde aquí — nunca tienes que buscar el botón.',
    align: 'top' }];


  const [stepIdx, setStepIdx] = React.useState(0);
  const step = steps[stepIdx];

  const [box, setBox] = React.useState(null);
  React.useEffect(() => {
    function measure() {
      const target = refs[step.key]?.current;
      const root = document.querySelector('.kbv-window');
      if (!target || !root) {setBox(null);return;}
      const tr = target.getBoundingClientRect();
      const rr = root.getBoundingClientRect();
      setBox({
        top: tr.top - rr.top,
        left: tr.left - rr.left,
        width: tr.width,
        height: tr.height,
        winW: rr.width,
        winH: rr.height
      });
    }
    measure();
    const tid = setTimeout(measure, 80);
    window.addEventListener('resize', measure);
    return () => {clearTimeout(tid);window.removeEventListener('resize', measure);};
  }, [stepIdx]);

  const cardPos = (() => {
    if (!box) return { top: 200, left: 200 };
    const cardW = 360,cardH = 200,pad = 16;
    let top, left;
    switch (step.align) {
      case 'right':
        top = Math.max(60, box.top + box.height / 2 - cardH / 2);
        left = Math.min(box.left + box.width + pad, box.winW - cardW - pad);
        break;
      case 'left':
        top = Math.max(60, box.top + 16);
        left = Math.max(pad, box.left - cardW - pad);
        break;
      case 'top':
        top = Math.max(60, box.top - cardH - pad);
        left = Math.min(Math.max(pad, box.left + box.width / 2 - cardW / 2), box.winW - cardW - pad);
        break;
      case 'bottom':
      default:
        top = Math.min(box.top + box.height + pad, box.winH - cardH - pad);
        left = Math.min(Math.max(pad, box.left + box.width / 2 - cardW / 2), box.winW - cardW - pad);
        break;
    }
    return { top, left };
  })();

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 240, right: 0, height: 4, zIndex: 70 }}>
        <div className="kbv-stepbar" style={{ height: 4 }}>
          {[0, 1, 2, 3].map((i) => <div key={i} className={`seg ${i < 2 ? 'done' : ''} ${i === 2 ? 'active' : ''}`} />)}
        </div>
      </div>

      <div className="kbv-shell" style={{ minHeight: 720 }}>
        <div ref={refs.sidebar}>
          <Sidebar active="today" />
        </div>
        <div className="kbv-content" style={{ display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
          <Header user={user} stats={stats} headerRef={refs.header} />
          <TodayDashboard user={user} stats={stats} bossActive={true} refs={refs} />
          <div ref={refs.fab}>
            <QuickFab user={user} stats={stats} />
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(20, 30, 50, 0.45)',
        backdropFilter: 'blur(1.5px)',
        WebkitBackdropFilter: 'blur(1.5px)',
        zIndex: 50,
        pointerEvents: 'auto'
      }} />

      {box &&
      <div style={{
        position: 'absolute',
        top: box.top - 6, left: box.left - 6,
        width: box.width + 12, height: box.height + 12,
        border: '2px solid var(--kb-primary)',
        borderRadius: 14,
        boxShadow: '0 0 0 9999px rgba(20, 30, 50, 0.45), 0 8px 24px rgba(76, 175, 130, 0.30)',
        background: 'transparent',
        zIndex: 60,
        pointerEvents: 'none'
      }} />
      }

      <div className="kbv-tut-card" style={{ top: cardPos.top, left: cardPos.left }}>
        <span className="badge">Paso {stepIdx + 1} de {steps.length} · Tutorial</span>
        <h3 className="title">{step.title}</h3>
        <p className="body">{step.body}</p>
        <div className="row">
          <div className="dots">
            {steps.map((_, i) => <span key={i} className={i === stepIdx ? 'on' : ''} />)}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {stepIdx > 0 &&
            <button type="button" className="kbv-btn kbv-btn-ghost" style={{ padding: '8px 12px', fontSize: 12 }} onClick={() => setStepIdx((i) => i - 1)}>
                Atrás
              </button>
            }
            {stepIdx < steps.length - 1 ?
            <button type="button" className="kbv-btn kbv-btn-primary" style={{ padding: '8px 14px', fontSize: 12 }} onClick={() => setStepIdx((i) => i + 1)}>
                Siguiente <KIcon name="arrow-right" size={12} />
              </button> :

            <button type="button" className="kbv-btn kbv-btn-primary" style={{ padding: '8px 14px', fontSize: 12 }} onClick={() => onNavigate('dashboard')}>
                Empezar <KIcon name="sparkle" size={12} />
              </button>
            }
          </div>
        </div>
        <button type="button" className="kbv-btn-link" onClick={() => onNavigate('dashboard')} style={{ alignSelf: 'flex-start', padding: 0, fontSize: 11 }}>
          Saltar tutorial
        </button>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Coming-soon stub for sidebar links that don't have full screens yet
// ─────────────────────────────────────────────────────────────
// Pantalla de módulo premium bloqueado — superficie de desbloqueo (freemium)
function ModuleLocked({ id, onUnlock, onStore }) {
  const m = typeof PREMIUM_MODULES !== 'undefined' && PREMIUM_MODULES[id] ? PREMIUM_MODULES[id] : { name: 'Módulo', icon: 'shield', cost: 0, desc: '' };
  return (
    <div className="kbv-main kbv-module-locked">
      <div className="ml-card">
        <span className="ml-ico"><KIcon name={m.icon} size={34} /></span>
        <span className="ml-badge"><KIcon name="shield" size={11} /> Módulo premium</span>
        <h1 className="kbv-h1">{m.name}</h1>
        <p className="kbv-body">{m.desc}</p>
        <p className="ml-note">Kibo es modular: el núcleo es gratis para siempre. Este módulo se desbloquea con <strong>fragmentos</strong> — que también ganas jugando, así que puedes tenerlo sin pagar.</p>
        <div className="ml-actions">
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={onUnlock}>
            <GemIcon size={14} /> Desbloquear · {m.cost} fragmentos
          </button>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onStore}>Ver módulos en la Tienda</button>
        </div>
      </div>
    </div>);

}

function ComingSoon({ title, icon = 'sparkle', message }) {
  return (
    <div className="kbv-main" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: 80 }}>
      <div style={{
        width: 80, height: 80, borderRadius: 20,
        background: 'var(--kb-primary-soft)', color: 'var(--kb-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px'
      }}>
        <KIcon name={icon} size={32} />
      </div>
      <h1 className="kbv-h1">{title}</h1>
      <p className="kbv-body" style={{ marginTop: 8, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
        {message || 'Esta sección llega en el próximo sprint. Mientras tanto, todo lo importante vive en tu Hoy.'}
      </p>
      <span className="kbv-tag soon" style={{ marginTop: 16, display: 'inline-block' }}>Próximo sprint</span>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Main dashboard screen — routes between today/areas/coming-soon
// ─────────────────────────────────────────────────────────────
// ── 55b · Barra inferior (teléfono) ──────────────────────────────
// En un teléfono el menú lateral no cabe ni replegado: un riel de 62px se
// come el 16% de una pantalla de 390. La navegación baja al pulgar — cinco
// destinos fijos y «Más», que abre el MISMO menú completo del riel (no una
// lista aparte que se desincronice con las secciones que el usuario edita).
const TABBAR_ITEMS = [
  { id: 'today',  icon: 'home',   label: 'Inicio' },
  { id: 'habits', icon: 'flame',  label: 'Hábitos' },
  { id: 'tareas', icon: 'list',   label: 'Tareas' },
  { id: 'areas',  icon: 'layers', label: 'Áreas' }];

function MobileTabBar({ active, onNavigate, onMore, moreOpen }) {
  return (
    <nav className="kbv-tabbar" aria-label="Navegación principal">
      {TABBAR_ITEMS.map((t) =>
        <button key={t.id} type="button" className={`tb-item ${active === t.id && !moreOpen ? 'on' : ''}`}
                aria-current={active === t.id ? 'page' : undefined}
                onClick={() => onNavigate(t.id)}>
          <KIcon name={t.icon} size={20} />
          <span>{t.label}</span>
        </button>)}
      <button type="button" className={`tb-item ${moreOpen ? 'on' : ''}`}
              aria-expanded={moreOpen} onClick={onMore}>
        <KIcon name="grip" size={20} />
        <span>Más</span>
      </button>
    </nav>);
}

const SIDE_COLLAPSE_KEY = 'kibo:side-collapsed';
function DashboardScreenV2({ onNavigate, user, stats }) {
  const [active, setActive] = React.useState('today');
  const [navDetail, setNavDetail] = React.useState(null);
  const [sideCollapsed, setSideCollapsed] = React.useState(() => {
    try { return localStorage.getItem(SIDE_COLLAPSE_KEY) === '1'; } catch (_) { return false; }
  });
  // Por debajo de 1080px el menú YA es un riel por CSS. Ahí el botón no debe
  // "replegar" (no hay nada que replegar): debe ABRIR el menú encima del
  // contenido, porque a ese ancho no cabe una columna de 232px sin ahogar la
  // pantalla. Dos comportamientos, un solo botón.
  // Ancho REAL del shell, no del viewport: la hoja de estilos mide su
  // contenedor y el JS tiene que mirar lo mismo, o el riel y las media queries
  // se contradicen (menú de escritorio con estilos de teléfono, o al revés).
  const shellRef = React.useRef(null);
  const [shellW, setShellW] = React.useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280));
  React.useEffect(() => {
    const el = shellRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setShellW(el.clientWidth || window.innerWidth));
    ro.observe(el);
    setShellW(el.clientWidth || window.innerWidth);
    return () => ro.disconnect();
  }, []);
  const narrow = shellW <= 1080;
  // El buscador es un campo de la cabecera (KiboSearchBar): se enfoca con
  // ⌘K/Ctrl+K y con el evento `kibo:search` que dispara la rueda. La barra se
  // encarga; el shell no necesita estado para él.

  // Una navegación «limpia» (clic en el menú, sin destino) empieza la pantalla
  // de cero. El token cambia solo en ese caso, así que entrar con destino
  // (proyecto, tarea, área) NO remonta y conserva lo que traiga.
  const navFresh = React.useMemo(() => {
    if (!navDetail) return 0;
    const hasTarget = ['project', 'area', 'taskId', 'retoId', 'create', 'tab', 'action', 'screen']
      .some(k => navDetail[k] != null);
    return hasTarget ? 0 : (navDetail.at || 1);
  }, [navDetail]);

  const [sideOpen, setSideOpen] = React.useState(false);
  React.useEffect(() => { if (!narrow) setSideOpen(false); }, [narrow]);
  function toggleSide() {
    if (narrow) { setSideOpen(o => !o); return; }
    setSideCollapsed(c => { try { localStorage.setItem(SIDE_COLLAPSE_KEY, c ? '0' : '1'); } catch (_) {} return !c; });
  }
  // «Fijo» manda sobre el estado guardado y también sobre el riel automático:
  // por debajo de 1080 el menú se convierte en riel por sí solo, y con eso
  // fijarlo no se notaba en ninguna laptop. El riel se respeta solo cuando de
  // verdad no cabe (teléfono), donde el menú es un cajón.
  const dashPrefs = (typeof useKbPrefs === 'function') ? useKbPrefs() : {};
  const sidePinned = (dashPrefs.sidebarMode || 'replegable') === 'fijo';
  const phone = shellW <= 640;
  const railed = phone ? !sideOpen
    : sidePinned ? false
    : (narrow ? !sideOpen : sideCollapsed);
  const [unlockedModules, setUnlockedModules] = React.useState(() => (PROFILE_UNLOCKED[stats?.profile] || []).slice());
  React.useEffect(() => {setUnlockedModules((PROFILE_UNLOCKED[stats?.profile] || []).slice());}, [stats?.profile]);
  function unlockModule(id) {setUnlockedModules((m) => m.includes(id) ? m : [...m, id]);}
  const isLockedModule = (mid) => typeof PREMIUM_MODULES !== 'undefined' && PREMIUM_MODULES[mid] && !unlockedModules.includes(mid);

  // Bloque F · widgets dispatch `kibo:navigate` to route into a section
  // (and optionally deep-link to a reto/task/action). Listen and route.
  React.useEffect(() => {
    function onNav(e) {
      const d = e.detail || {};
      if (!d.screen) return;
      setNavDetail(d);
      setActive(d.screen);
    }
    window.addEventListener('kibo:navigate', onNav);
    return () => window.removeEventListener('kibo:navigate', onNav);
  }, []);

  // Compute habit counts for sidebar
  const habitsDone = 2,habitsTotal = 4;

  let body = null;
  switch (active) {
    case 'today':
      body = <TodayDashboard user={user} stats={stats} bossActive={stats.bossActive} refs={{ onNavigate: setActive }} />;
      break;
    case 'habits':
      body = <HabitsScreen onNavigate={setActive} navDetail={navDetail} />;
      break;
    case 'retos':
      body = <RetosScreen navDetail={navDetail} />;
      break;
    case 'estudio':
      body = typeof EstudioScreenV2 === 'function' ? <EstudioScreenV2 /> : <EstudioScreen />;
      break;
    case 'watch':
      body = <EntretenimientoScreen />;
      break;
    case 'areas':
      body = <AreasScreen hero={user} stats={stats} onNavigate={setActive} navDetail={navDetail} />;
      break;
    case 'progreso':
      body = typeof CharacterScreen === 'function' ?
      <CharacterScreen user={user} stats={stats} onNavigate={setActive} /> :
      <ComingSoon title="Mi progreso" icon="trending-up" message="Indicadores personales y prestigio." />;
      break;
    case 'social':
      body = typeof SocialScreen === 'function' ?
      <SocialScreen user={user} stats={stats} onNavigate={setActive} /> :
      <ComingSoon title="Amigos" icon="community" message="Tu círculo social en Kibo." />;
      break;
    case 'personalizar':
      body = typeof PersonalizacionScreen === 'function' ?
      <PersonalizacionScreen user={user} stats={stats} onNavigate={setActive} initialTab={navDetail && navDetail.tab} /> :
      <ComingSoon title="Personalización" icon="sparkle" message="Tu KIBO, tu carta, tus prestigios y tus divisas." />;
      break;
    case 'familia':
      body = typeof FamiliaScreen === 'function' ?
      <FamiliaScreen onNavigate={setActive} /> :
      <ComingSoon title="Familia" icon="home" message="Misiones, mesada y aprobaciones." />;
      break;
    case 'tareas':
      body = <TareasScreen hero={user} navDetail={navDetail} />;
      break;
    case 'tarea':
      // Destino canónico de cualquier enlace a una tarea: el tablero, el
      // proyecto, el buscador y KIBO llegan aquí en vez de abrir cada uno su
      // propio modal.
      body = typeof TaskDetailScreen === 'function' ?
      <TaskDetailScreen key={(navDetail && navDetail.taskId) || 'none'}
                        taskId={navDetail && navDetail.taskId}
                        onBack={() => { setNavDetail(null); setActive('tareas'); }}
                        onNavigate={(s, det) => { setNavDetail(det || null); setActive(s); }} /> :
      <ComingSoon title="Tarea" icon="list" message="Detalle de la tarea." />;
      break;
    case 'projects':
      body = <ProjectsScreen hero={user} navDetail={navDetail} />;
      break;
    case 'finanzas':
      body = <FinanzasScreen />;
      break;
    case 'diario':
      body = <DiarioScreen />;
      break;
    case 'lectura':
      body = <LecturaScreen />;
      break;
    case 'salud':
      body = typeof SaludScreen === 'function' ?
      <SaludScreen onNavigate={setActive} /> :
      <ComingSoon title="Salud" icon="vigor" message="Tu cuerpo, signos vitales y expediente médico." />;
      break;
    case 'store':
      body = <StoreScreen stats={stats} unlockedModules={unlockedModules} onUnlock={unlockModule} initialTab={navDetail && navDetail.tab} />;
      break;
    case 'resources':
      body = typeof BovedaScreen === 'function' ? <BovedaScreen /> :
      <ComingSoon title="Bóveda" icon="book" message="Tu archivo de vida en Markdown." />;
      break;
    case 'settings':
      body = typeof ConfigScreen === 'function' ? <ConfigScreen /> :
      <ComingSoon title="Configuración" icon="settings" message="Preferencias e integraciones." />;
      break;
    case 'account':
      body = typeof CuentaScreen === 'function' ? <CuentaScreen user={user} /> :
      <ComingSoon title="Cuenta" icon="user" message="Identidad, plan y datos." />;
      break;
    default:
      body = <TodayDashboard user={user} stats={stats} bossActive={stats.bossActive} />;
  }

  // Gate freemium: si el módulo activo es premium y no está desbloqueado, mostrar candado.
  if (isLockedModule(active)) {
    body = <ModuleLocked id={active} onUnlock={() => unlockModule(active)} onStore={() => {setNavDetail({ tab: 'modules' });setActive('store');}} />;
  }

  return (
    <div ref={shellRef} className={`kbv-shell ${(sideCollapsed && !sidePinned) ? 'side-collapsed' : ''} ${sidePinned && !phone ? 'side-pinned' : ''} ${(narrow && !sidePinned) || phone ? 'side-narrow' : ''} ${((narrow && !sidePinned) || phone) && sideOpen ? 'side-flyout' : ''}`}>
      {narrow && sideOpen && <div className="kbv-side-scrim" onClick={() => setSideOpen(false)} aria-hidden="true" />}
      {typeof ReencauceCard === 'function' && <ReencauceCard />}
      <Sidebar active={active} collapsed={railed} onToggleCollapse={toggleSide} onNavigate={(s) => {setNavDetail({ at: Date.now() });setActive(s);setSideOpen(false);}} habitsDone={habitsDone} habitsTotal={habitsTotal} streakDays={stats?.streak ?? 23} bossActive={stats?.bossActive} unlockedModules={unlockedModules} onOpenModules={() => {setNavDetail({ tab: 'modules' });setActive('store');}} />
      <div className="kbv-content" style={{ display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        <Header user={user} stats={stats} />
        {/* Dos cosas deciden la identidad de la pantalla y ambas entran en la
            `key`: la del propio elemento —si el caso puso una, es el SUJETO que
            muestra (qué tarea)— y el token de navegación limpia, que resetea el
            detalle al volver desde el menú. Sobrescribir una con la otra rompe
            justo el caso que la otra arreglaba. */}
        {React.cloneElement(body, { key: (body.key ? body.key + '@' : '') + active + ':' + navFresh })}
        <QuickFab user={user} stats={stats} />
      </div>
      <MobileTabBar
        active={active}
        moreOpen={narrow && sideOpen}
        onNavigate={(s) => {setNavDetail(null);setActive(s);setSideOpen(false);}}
        onMore={() => setSideOpen((o) => !o)} />
    </div>);

}

Object.assign(window, {
  DEFAULT_SIDEBAR_SECTIONS,
  DashboardScreenV2,
  TutorialOverlay,
  Sidebar,
  MobileTabBar,
  Header,
  TodayDashboard,
  HabitsBig,
  QuickFab,
  ComingSoon,
  ModuleLocked,
  PREMIUM_MODULES,
  PROFILE_UNLOCKED,
  KIBO_AREAS_V2
});