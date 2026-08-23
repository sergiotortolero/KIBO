// kb-gantt.jsx — El cronograma explorable.
//
// KbTimeline reparte el periodo en cubetas fijas (1m, 3m, 6m): sirve para
// mirar, no para explorar — no hay zoom continuo, ni desplazamiento, ni forma
// de acercarse a un proyecto. KbGantt cambia el modelo: el eje es TIEMPO REAL
// en píxeles, así que acercarse, moverse y arrastrar fechas son la misma
// aritmética y no tres casos especiales.
//
// Gestos: rueda/pinza = zoom anclado al cursor · arrastrar el lienzo = moverse
// · − / + / ajustar a todo · línea de HOY con vuelta a hoy · mini-mapa con
// ventana arrastrable · doble clic en una barra = acercarse a ese proyecto.
//
// Mover fechas es OPCIONAL y explícito: mientras «Editar fechas» esté apagado,
// arrastrar solo mueve el lienzo. Un mismo gesto no puede significar dos cosas.

const DAY = 86400000;
const KG_MIN_SPAN = 7 * DAY;        // no acercarse más allá de una semana
const KG_MAX_SPAN = 900 * DAY;      // ni alejarse más de ~2.5 años

function kgClamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
function kgDay(ms) { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); }

// Escala de marcas. La granularidad la decide cuántos PÍXELES hay por marca,
// no el ancho del periodo: decidirlo por periodo (`span < 120 días` → semanas)
// emitía un lunes tras otro sin comprobar si las etiquetas caben, y a 38px de
// separación con etiquetas de 48px se leían pegadas. Cuando no alcanzan los
// píxeles, la rejilla sigue densa pero solo se rotula cada N marcas: perder
// líneas es perder referencia, perder rótulos no.
const KG_LABEL_PX = 58;   // ancho mínimo cómodo para «10 ago»

function kgTicks(from, to, width) {
  const span = to - from;
  const W = Math.max(1, width);
  const out = [];
  const step = (ms) => (ms / span) * W;          // píxeles que ocupa un paso
  const every = (px) => Math.max(1, Math.ceil(KG_LABEL_PX / Math.max(1, px)));
  // Se rotula cada n marcas, y nunca una que empiece fuera de la vista.
  const rotula = (i, n, t) => i % n === 0 && t >= from;

  // Días: solo si un día ocupa lo suficiente para rotularlo.
  if (step(DAY) >= 26) {
    const n = every(step(DAY));
    let i = 0;
    for (let t = kgDay(from); t <= to; t += DAY, i++) {
      const d = new Date(t);
      out.push({ t, label: rotula(i, n, t) ? d.toLocaleDateString('es-MX', { day: 'numeric', month: step(DAY) >= 46 ? 'short' : undefined }) : '', strong: d.getDay() === 1 });
    }
    return { ticks: out, unit: 'día' };
  }

  // Semanas: idem — la rejilla es semanal, el rótulo aparece cada n semanas.
  if (step(7 * DAY) >= 22) {
    const px = step(7 * DAY), n = every(px);
    const d = new Date(kgDay(from));
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    let i = 0;
    for (let t = d.getTime(); t <= to; t += 7 * DAY, i++) {
      const x = new Date(t);
      out.push({ t, label: rotula(i, n, t) ? x.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) : '', strong: x.getDate() <= 7 });
    }
    return { ticks: out, unit: 'semana' };
  }

  // Meses.
  const px = step(30 * DAY), n = every(px);
  const d = new Date(from);
  d.setDate(1); d.setHours(0, 0, 0, 0);
  let i = 0;
  while (d.getTime() <= to) {
    const strong = d.getMonth() === 0;
    out.push({ t: d.getTime(), label: (rotula(i, n, d.getTime()) || (strong && d.getTime() >= from)) ? d.toLocaleDateString('es-MX', { month: 'short' }) : '', strong });
    d.setMonth(d.getMonth() + 1); i++;
  }
  return { ticks: out, unit: 'mes' };
}

function kgFmt(ms) {
  return new Date(ms).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
}

function KbGantt({ title, meta, rows = [], filters, onOpenRow, onChangeDates,
                   emptyText = 'Nada que mostrar en este periodo.', rowLabel = 'ELEMENTO',
                   canEditDates = true, focusId = null, onFocus, initialDays = 90 }) {
  const trackRef = React.useRef(null);
  const [width, setWidth] = React.useState(900);
  const [view, setView] = React.useState(() => {
    const now = kgDay(Date.now());
    // Un poco de pasado a la izquierda: sin él, «hoy» queda pegado al borde y
    // no se ve lo que viene con retraso.
    const back = Math.round(initialDays * 0.12);
    return { from: now - back * DAY, to: now + (initialDays - back) * DAY };
  });
  const [open, setOpen] = React.useState(() => new Set());
  const [editing, setEditing] = React.useState(false);
  const [drag, setDrag] = React.useState(null);
  const [hint, setHint] = React.useState(null);

  // El ancho real del lienzo es un dato de layout: sin medirlo, el eje de
  // tiempo y los píxeles no coinciden y todo el zoom queda torcido.
  React.useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth || 900));
    ro.observe(el);
    setWidth(el.clientWidth || 900);
    return () => ro.disconnect();
  }, []);

  const span = view.to - view.from;
  const xOf = (t) => ((t - view.from) / span) * width;
  const tOf = (x) => view.from + (x / Math.max(1, width)) * span;
  const { ticks, unit } = kgTicks(view.from, view.to, width);
  const today = kgDay(Date.now());

  // Rango completo: lo que abarca todo lo que hay, con aire a los lados.
  const bounds = React.useMemo(() => {
    const all = [];
    const walk = (list) => list.forEach(r => { if (r.start && r.end) all.push(r.start, r.end); if (r.children) walk(r.children); });
    walk(rows);
    if (!all.length) return { from: today - 30 * DAY, to: today + 60 * DAY };
    const lo = Math.min(...all), hi = Math.max(...all);
    const pad = Math.max(3 * DAY, (hi - lo) * 0.08);
    return { from: lo - pad, to: hi + pad };
  }, [rows, today]);

  function setSpanAround(anchorT, nextSpan) {
    const s = kgClamp(nextSpan, KG_MIN_SPAN, KG_MAX_SPAN);
    const ratio = (anchorT - view.from) / span;
    setView({ from: anchorT - ratio * s, to: anchorT - ratio * s + s });
  }
  function zoom(factor, anchorT) { setSpanAround(anchorT != null ? anchorT : view.from + span / 2, span * factor); }
  function fitAll() {
    // Ajustar a todo respeta el mismo techo que el zoom: sin él, un rango muy
    // largo deja todas las barras contra su ancho mínimo y no dice nada.
    const s = Math.min(KG_MAX_SPAN, bounds.to - bounds.from);
    const mid = (bounds.from + bounds.to) / 2;
    setView({ from: mid - s / 2, to: mid + s / 2 });
  }
  function goToday() { setView({ from: today - span * 0.25, to: today + span * 0.75 }); }
  function focusRange(from, to) {
    const pad = Math.max(2 * DAY, (to - from) * 0.15);
    setView({ from: from - pad, to: to + pad });
  }

  // Rueda = zoom anclado al cursor. Sin ancla, acercarse tira el contenido
  // fuera de la vista y hay que volver a buscarlo.
  function onWheel(e) {
    if (!trackRef.current) return;
    e.preventDefault();
    const r = trackRef.current.getBoundingClientRect();
    const at = tOf(e.clientX - r.left);
    setSpanAround(at, span * (e.deltaY > 0 ? 1.18 : 1 / 1.18));
  }

  // Arrastrar el lienzo. Cuando «Editar fechas» está encendido, la barra se
  // queda el gesto para sí (detiene la propagación) y el lienzo solo responde
  // fuera de las barras.
  function panStart(e) {
    if (e.button !== 0) return;
    const startX = e.clientX, from0 = view.from, to0 = view.to;
    const move = (ev) => {
      const dx = ev.clientX - startX;
      const dt = -(dx / Math.max(1, width)) * (to0 - from0);
      setView({ from: from0 + dt, to: to0 + dt });
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); setDrag(null); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    setDrag({ kind: 'pan' });
  }

  // Mover o estirar una barra: solo en modo edición.
  function barDrag(e, row, mode) {
    if (!editing || !onChangeDates) return;
    e.stopPropagation();
    const startX = e.clientX, s0 = row.start, e0 = row.end;
    const move = (ev) => {
      const dt = ((ev.clientX - startX) / Math.max(1, width)) * span;
      let ns = s0, ne = e0;
      if (mode === 'move') { ns = s0 + dt; ne = e0 + dt; }
      if (mode === 'start') ns = Math.min(e0 - DAY, s0 + dt);
      if (mode === 'end')   ne = Math.max(s0 + DAY, e0 + dt);
      setHint(`${kgFmt(ns)} → ${kgFmt(ne)}`);
      onChangeDates(row.id, kgDay(ns), kgDay(ne));
    };
    const up = () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
      setDrag(null); setHint(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    setDrag({ kind: mode });
  }

  // Mini-mapa: el periodo completo con una ventana que se arrastra.
  function miniDrag(e) {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const total = bounds.to - bounds.from;
    const at = bounds.from + ((e.clientX - r.left) / r.width) * total;
    setView({ from: at - span / 2, to: at + span / 2 });
    const move = (ev) => {
      const t = bounds.from + ((ev.clientX - r.left) / r.width) * total;
      setView({ from: t - span / 2, to: t + span / 2 });
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  // Filas visibles: un padre abierto intercala sus hijas debajo. Varios
  // pueden estar abiertos a la vez.
  const flat = [];
  rows.forEach(r => {
    flat.push({ ...r, depth: 0 });
    if (open.has(r.id) && r.children) r.children.forEach(c => flat.push({ ...c, depth: 1, parent: r.id }));
  });

  function toggle(id) {
    setOpen(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const miniPct = (t) => kgClamp(((t - bounds.from) / Math.max(1, bounds.to - bounds.from)) * 100, 0, 100);

  return (
    <div className={`kbv-card kb-gantt ${drag ? 'dragging drag-' + drag.kind : ''} ${editing ? 'editing' : ''}`}>
      <div className="kg-head">
        <div className="kg-title">
          <h3 className="kbv-h3">{title}</h3>
          {meta && <span className="kbv-meta">{meta}</span>}
        </div>
        <div className="kg-tools">
          <span className="kg-range">{kgFmt(view.from)} — {kgFmt(view.to)} · por {unit}</span>
          <div className="kg-zoom">
            <button type="button" onClick={() => zoom(1.35)} title="Alejar" aria-label="Alejar"><KIcon name="minus" size={14} /></button>
            <button type="button" onClick={() => zoom(1 / 1.35)} title="Acercar" aria-label="Acercar"><KIcon name="plus" size={14} /></button>
          </div>
          <button type="button" className="kbv-btn kbv-btn-secondary kg-btn" onClick={fitAll} title="Ajustar a todo">
            <KIcon name="layers" size={13} /> Todo
          </button>
          <button type="button" className="kbv-btn kbv-btn-secondary kg-btn" onClick={goToday} title="Volver a hoy">
            <KIcon name="calendar" size={13} /> Hoy
          </button>
          {canEditDates && onChangeDates && (
            <button type="button" className={`kbv-btn kg-btn ${editing ? 'kbv-btn-primary' : 'kbv-btn-secondary'}`}
                    onClick={() => setEditing(v => !v)}
                    title={editing ? 'Al apagarlo, arrastrar vuelve a mover el lienzo' : 'Enciéndelo para arrastrar barras y cambiar fechas'}>
              <KIcon name={editing ? 'check' : 'edit'} size={13} /> {editing ? 'Editando fechas' : 'Editar fechas'}
            </button>
          )}
        </div>
      </div>

      {filters && <div className="kg-filters">{filters}</div>}

      <p className="kg-hint kbv-meta">
        {editing
          ? 'Arrastra una barra para moverla y sus bordes para estirarla. El lienzo sigue moviéndose desde el fondo.'
          : 'Rueda para acercar · arrastra el lienzo para moverte · doble clic en una barra para acercarte a ella.'}
      </p>

      <div className="kg-body">
        <div className="kg-labels">
          <span className="kg-corner">{rowLabel}</span>
          {flat.map(r => (
            <span key={(r.parent || '') + r.id} className={`kg-label d${r.depth}`}>
              {r.depth === 0 && r.children && r.children.length > 0 ? (
                <button type="button" className={`kg-twist ${open.has(r.id) ? 'on' : ''}`} onClick={() => toggle(r.id)}
                        title={open.has(r.id) ? 'Plegar sus tareas' : 'Desplegar sus tareas'}>
                  <KIcon name="arrow-right" size={12} />
                </button>
              ) : <span className="kg-twist ghost" />}
              {r.icon ? <KIcon name={r.icon} size={12} /> : <span className="kg-dot" style={{ background: r.color }} />}
              <button type="button" className="kg-name" onClick={() => onOpenRow && onOpenRow(r)} title="Abrir">{r.name}</button>
            </span>
          ))}
        </div>

        <div className="kg-canvas" ref={trackRef} onWheel={onWheel} onPointerDown={panStart}>
          <div className="kg-axis">
            {ticks.filter(t => t.label).map(t => (
              <span key={t.t} className={`kg-tick ${t.strong ? 'strong' : ''}`} style={{ left: xOf(t.t) + 'px' }}>{t.label}</span>
            ))}
          </div>
          <div className="kg-grid">
            {ticks.map(t => <i key={t.t} className={t.strong ? 'strong' : ''} style={{ left: xOf(t.t) + 'px' }} />)}
            {today >= view.from && today <= view.to && (
              <span className="kg-today" style={{ left: xOf(today) + 'px' }}><em>Hoy</em></span>
            )}
            {flat.length === 0 && <div className="kg-empty">{emptyText}</div>}
            {flat.map(r => {
              const x1 = xOf(r.start), x2 = xOf(r.end);
              const w = Math.max(18, x2 - x1);
              return (
                <div key={(r.parent || '') + r.id} className={`kg-row d${r.depth} ${focusId === r.id ? 'focus' : ''}`}>
                  <button type="button" className="kg-bar" style={{ '--c': r.color, left: x1 + 'px', width: w + 'px' }}
                          title={`${r.name} · ${kgFmt(r.start)} → ${kgFmt(r.end)}`}
                          onPointerDown={(e) => barDrag(e, r, 'move')}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            focusRange(r.start, r.end);
                            if (r.depth === 0 && r.children && r.children.length) { setOpen(p => new Set(p).add(r.id)); if (onFocus) onFocus(r); }
                          }}
                          onClick={() => { if (!editing && onOpenRow) onOpenRow(r); }}>
                    {r.progress != null && <span className="kg-fill" style={{ width: r.progress + '%' }} />}
                    <span className="kg-bar-txt">{r.label || r.name}</span>
                    {editing && (
                      <React.Fragment>
                        <i className="kg-handle s" onPointerDown={(e) => barDrag(e, r, 'start')} />
                        <i className="kg-handle e" onPointerDown={(e) => barDrag(e, r, 'end')} />
                      </React.Fragment>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
          {hint && <span className="kg-drag-hint">{hint}</span>}
        </div>
      </div>

      {/* Mini-mapa: todo el rango, con la ventana que estás viendo */}
      <div className="kg-mini" onPointerDown={miniDrag} title="Arrastra para recorrer todo el rango">
        {flat.filter(r => r.depth === 0).map(r => (
          <i key={r.id} style={{ '--c': r.color, left: miniPct(r.start) + '%', width: Math.max(1, miniPct(r.end) - miniPct(r.start)) + '%' }} />
        ))}
        <span className="kg-mini-today" style={{ left: miniPct(today) + '%' }} />
        <span className="kg-mini-win" style={{ left: miniPct(view.from) + '%', width: Math.max(2, miniPct(view.to) - miniPct(view.from)) + '%' }} />
      </div>
    </div>
  );
}

Object.assign(window, { KbGantt, kgDay, kgFmt, DAY_MS: DAY });
