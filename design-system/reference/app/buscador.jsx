// buscador.jsx — El buscador general.
//
// Un solo sitio para llegar a cualquier cosa: una tarea, un libro, una
// pantalla, un hábito, un reto… y también para HACER algo sin llegar a ningún
// lado. Esa es la regla: un resultado te LLEVA, salvo que sea una acción
// rápida — esa se ejecuta ahí mismo y el buscador se cierra.
//
// El índice se arma en el momento de abrir, no al cargar la app: los datos
// cambian (tareas nuevas, libros añadidos, rubros comprados) y un índice
// congelado al arranque envejece sin que nadie se dé cuenta.

const KB_SEARCH_RECENT = 'kibo:search-recent';

function kbRecent() {
  try { const v = JSON.parse(localStorage.getItem(KB_SEARCH_RECENT) || '[]'); return Array.isArray(v) ? v : []; }
  catch (_) { return []; }
}
function kbPushRecent(entry) {
  const e = { id: entry.id, kind: entry.kind, label: entry.label, icon: entry.icon, color: entry.color, screen: entry.screen };
  const list = [e, ...kbRecent().filter(x => x.id !== e.id)].slice(0, 6);
  try { localStorage.setItem(KB_SEARCH_RECENT, JSON.stringify(list)); } catch (_) {}
}

const KB_SEARCH_GROUPS = [
  { kind: 'action',  label: 'Registrar ahora' },
  { kind: 'task',    label: 'Tareas' },
  { kind: 'habit',   label: 'Hábitos' },
  { kind: 'reto',    label: 'Retos' },
  { kind: 'book',    label: 'Lectura' },
  { kind: 'screen',  label: 'Ir a la pantalla' },
];

function kbBuildIndex() {
  const out = [];
  const push = (o) => out.push(o);

  // Acciones rápidas: lo único que se EJECUTA desde aquí.
  const owned = typeof qaOwned === 'function' ? qaOwned() : new Set();
  const enabled = typeof qaEnabled === 'function' ? qaEnabled() : [];
  (window.KIBO_QA_MODULES || []).filter(m => owned.has(m.id) && enabled.includes(m.id)).forEach(m => {
    m.actions.forEach(a => push({
      id: `qa:${m.id}:${a.id}`, kind: 'action', label: a.name, sub: m.name,
      icon: a.icon, color: m.color, mod: m, action: a,
      terms: `${a.name} ${m.name}`,
    }));
  });

  // Pantallas: las mismas del menú, sin repetirlas a mano.
  (window.DEFAULT_SIDEBAR_SECTIONS || []).forEach(sec => (sec.items || []).filter(it => it.id !== 'buscar').forEach(it => push({
    id: `nav:${it.id}`, kind: 'screen', label: it.label, sub: sec.name,
    icon: it.icon, color: 'var(--kb-text-3)', screen: it.id, terms: `${it.label} ${sec.name}`,
  })));
  [{ id: 'personalizar', label: 'Personalización', icon: 'sparkle' },
   { id: 'config', label: 'Configuración', icon: 'settings' },
   { id: 'cuenta', label: 'Cuenta', icon: 'user' }].forEach(x => push({
    id: `nav:${x.id}`, kind: 'screen', label: x.label, sub: 'Plataforma',
    icon: x.icon, color: 'var(--kb-text-3)', screen: x.id, terms: x.label,
  }));

  (window.DEMO_TASKS_FULL || []).forEach(t => push({
    id: `task:${t.id}`, kind: 'task', label: t.title, sub: t.status === 'done' ? 'Hecha' : t.status === 'doing' ? 'En curso' : 'Por hacer',
    icon: 'list', color: `var(--area-${t.area})`, screen: 'tarea', detail: { taskId: t.id },
    terms: `${t.title} ${t.area} ${t.project || ''}`,
  }));
  (window.HABITS_DEMO || []).forEach(h => push({
    id: `habit:${h.id}`, kind: 'habit', label: h.name, sub: h.done ? 'Hecho hoy' : h.schedule,
    icon: h.icon || 'flame', color: h.color, screen: 'habits', terms: h.name,
  }));
  (window.RETOS_DEMO || []).forEach(r => push({
    id: `reto:${r.id}`, kind: 'reto', label: r.name, sub: r.status === 'active' ? `Día ${r.daysElapsed}/${r.daysTotal}` : r.status,
    icon: 'sword', color: 'var(--kb-boss)', screen: 'retos', detail: { retoId: r.id }, terms: `${r.name} ${r.desc || ''}`,
  }));
  (window.DEMO_BOOKS || []).forEach(b => push({
    id: `book:${b.id}`, kind: 'book', label: b.title, sub: b.author,
    icon: 'book-open', color: 'var(--kb-gem)', screen: 'lectura', terms: `${b.title} ${b.author} ${b.genre || ''}`,
  }));
  return out;
}

// Coincidencia por trozos: «cor 5» encuentra «Correr 5 km». Puntúa mejor el
// comienzo de palabra que el medio, para que lo obvio salga primero.
// Minúsculas y sin acentos: la comparación no puede depender de que el usuario
// teclee diacríticos. Va aquí, no en cada término del índice, porque la consulta
// necesita el mismo trato que el dato.
function kbNorm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function kbScore(entry, q) {
  const hay = kbNorm(entry.terms || entry.label);
  const words = kbNorm(q).split(/\s+/).filter(Boolean);
  let score = 0;
  for (const w of words) {
    const i = hay.indexOf(w);
    if (i < 0) return -1;
    score += (i === 0 || hay[i - 1] === ' ') ? 3 : 1;
  }
  if (entry.kind === 'action') score += 1.5;
  return score;
}

function KiboSearchBar() {
  const [q, setQ] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef(null);
  const wrapRef = React.useRef(null);
  // El índice se arma al ABRIR, no al montar: la cabecera vive siempre en
  // pantalla y un índice permanente envejecería con cada tarea nueva.
  const index = React.useMemo(() => (open ? kbBuildIndex() : []), [open]);
  const recents = React.useMemo(() => (open ? kbRecent() : []), [open]);

  // ⌘K / Ctrl+K enfoca el campo (ya no abre nada), y el sector «Buscar» de la
  // rueda hace lo mismo: un solo destino para todas las entradas.
  React.useEffect(() => {
    const focus = () => { setOpen(true); setTimeout(() => inputRef.current && inputRef.current.focus(), 30); };
    const key = (e) => { if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); focus(); } };
    window.addEventListener('keydown', key);
    window.addEventListener('kibo:search', focus);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('kibo:search', focus); };
  }, []);

  // Clic fuera cierra la lista pero NO borra lo escrito: volver a enfocar
  // devuelve la búsqueda donde estaba.
  React.useEffect(() => {
    if (!open) return;
    const out = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', out);
    return () => document.removeEventListener('pointerdown', out);
  }, [open]);

  const results = React.useMemo(() => {
    if (!q.trim()) return [];
    return index.map(e => ({ e, s: kbScore(e, q.trim()) }))
      .filter(x => x.s >= 0).sort((a, b) => b.s - a.s).slice(0, 24).map(x => x.e);
  }, [q, index]);

  // Sin escribir: lo último y lo que sueles registrar. Una lista en blanco no
  // enseña de qué es capaz el buscador.
  const suggestions = React.useMemo(() => {
    if (q.trim()) return [];
    const byId = new Map(index.map(e => [e.id, e]));
    const rec = recents.map(r => byId.get(r.id)).filter(Boolean);
    const acts = index.filter(e => e.kind === 'action' && !rec.find(r => r.id === e.id)).slice(0, 5);
    return [...rec, ...acts];
  }, [q, index, recents]);

  const list = q.trim() ? results : suggestions;
  const groups = KB_SEARCH_GROUPS
    .map(g => ({ ...g, items: list.filter(e => e.kind === g.kind) }))
    .filter(g => g.items.length);
  const flat = groups.flatMap(g => g.items);

  function choose(e) {
    if (!e) return;
    kbPushRecent(e);
    setOpen(false); setQ('');
    if (e.kind === 'action') {
      // Una acción se registra donde estás: abre SU formulario real en la rueda.
      try { window.dispatchEvent(new CustomEvent('kibo:qa-run', { detail: { modId: e.mod.id, actionId: e.action.id } })); } catch (_) {}
      return;
    }
    try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: e.screen, ...(e.detail || {}) } })); } catch (_) {}
  }

  return (
    <div className={`kbfind-bar ${open ? 'open' : ''}`} ref={wrapRef}>
      <div className="kbfind-field" onClick={() => { setOpen(true); inputRef.current && inputRef.current.focus(); }}>
        <KIcon name="search" size={15} />
        <input ref={inputRef} value={q} type="text"
               role="combobox" aria-expanded={open} aria-controls="kbfind-list"
               placeholder="Buscar o registrar…"
               onFocus={() => setOpen(true)}
               onChange={(e) => { setQ(e.target.value); setSel(0); setOpen(true); }}
               onKeyDown={(e) => {
                 if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setSel(s => Math.min(flat.length - 1, s + 1)); }
                 if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
                 if (e.key === 'Enter') { e.preventDefault(); choose(flat[sel]); }
                 if (e.key === 'Escape') { e.preventDefault(); if (q) setQ(''); else setOpen(false); inputRef.current.blur(); }
               }} />
        {q ? (
          <button type="button" className="kbfind-clear" aria-label="Limpiar"
                  onClick={(ev) => { ev.stopPropagation(); setQ(''); inputRef.current.focus(); }}>
            <KIcon name="x" size={13} />
          </button>
        ) : <kbd>⌘K</kbd>}
      </div>

      {open && (
        <div className="kbfind-drop" id="kbfind-list" role="listbox">
          {!q.trim() && <span className="kbfind-hint">{recents.length ? 'Lo último y lo que sueles registrar' : 'Una tarea, un libro, una pantalla… o registra algo'}</span>}
          {groups.map(g => (
            <div key={g.kind} className="kbfind-group">
              <span className="kbfind-glabel">{g.label}</span>
              {g.items.map(e => {
                const i = flat.indexOf(e);
                return (
                  <button key={e.id} type="button" role="option" aria-selected={i === sel}
                          className={`kbfind-row ${i === sel ? 'on' : ''}`} style={{ '--c': e.color }}
                          onMouseEnter={() => setSel(i)} onClick={() => choose(e)}>
                    <span className="kbfind-ico"><KIcon name={e.icon} size={15} /></span>
                    <span className="kbfind-txt"><strong>{e.label}</strong>{e.sub && <em>{e.sub}</em>}</span>
                  </button>
                );
              })}
            </div>
          ))}
          {q.trim() && !flat.length && (
            <div className="kbfind-empty">
              <strong>Nada con «{q}»</strong>
              <span>Busca por nombre de tarea, libro, hábito, reto, pantalla o acción.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { KiboSearchBar, kbBuildIndex, kbRecent, kbPushRecent, kbNorm });
