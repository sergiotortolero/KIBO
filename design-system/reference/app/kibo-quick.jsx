// kibo-quick.jsx — la acción rápida de KIBO: anillo radial (DS) de dos niveles
// + el chat de KIBO a pantalla completa.
//
// Nivel 1: círculos de rubro alrededor de KIBO. Al elegir uno, los demás se
// opacan y encogen, el elegido crece y de él emergen círculos pequeños —solo
// ícono— con las acciones. El registro pasa ahí mismo: nunca navega al módulo.

// Qué pantalla y qué formulario grande cubre cada rubro: el «Más opciones» del
// formulario chico entrega ahí lo que ya escribiste.
// Acciones cuyo formulario COMPLETO ya existe como modal de la plataforma.
// Reinventarlo en miniatura dentro de la rueda dejaba registros a medias (una
// tarea sin proyecto, sin fecha, sin esfuerzo) y dos formularios que mantener.
// KIBO abre el de verdad SOBRE la pantalla en la que estés — sin navegar.
const QA_MODAL = {
  'qa-tareas:nueva':   { kind: 'task',  label: 'Nueva tarea' },
  'qa-habitos:nuevo':  { kind: 'habit', label: 'Nuevo hábito' },
  'qa-diario:entrada': { kind: 'entry', label: 'Entrada de diario' },
  'qa-lectura:libro':  { kind: 'book',  label: 'Registrar libro' },
};
function qaModalFor(modId, actId) { return QA_MODAL[modId + ':' + actId]; }

const QA_FULL = {
  'qa-finanzas': { screen: 'finanzas', label: 'Abrir Finanzas' },
  'qa-habitos':  { screen: 'habits',   label: 'Abrir Hábitos' },
  'qa-tareas':   { screen: 'tareas',   label: 'Formulario completo', create: true },
  'qa-retos':    { screen: 'retos',    label: 'Abrir Retos' },
  'qa-lectura':  { screen: 'lectura',  label: 'Abrir Lectura' },
  'qa-diario':   { screen: 'diario',   label: 'Abrir Diario' },
  'qa-salud':    { screen: 'salud',    label: 'Abrir Salud' },
  'qa-estudio':  { screen: 'estudio',  label: 'Abrir Estudio' },
  'qa-entre':    { screen: 'entretenimiento', label: 'Abrir Entretenimiento' },
  'qa-amigos':   { screen: 'social',   label: 'Abrir Amigos' },
  'qa-boveda':   { screen: 'recursos', label: 'Abrir Bóveda' },
};

const KIBO_QA_MODULES = [
  { id: 'qa-finanzas', name: 'Finanzas', icon: 'wealth', color: 'var(--kb-coin)', owned: true, actions: [
    { id: 'gasto',   name: 'Registrar gasto',   icon: 'trending-down', form: 'money-out', log: 'money-out' },
    { id: 'ingreso', name: 'Registrar ingreso', icon: 'trending-up',   form: 'money-in',  log: 'money-in' },
    { id: 'abono',   name: 'Abono a meta',      icon: 'piggy',         form: 'goal',      log: 'money-out' },
  ] },
  { id: 'qa-habitos', name: 'Hábitos', icon: 'flame', color: 'var(--kb-streak)', owned: true, actions: [
    { id: 'done',    name: 'Marcar hábito',     icon: 'check', form: 'habit', log: 'habit' },
    { id: 'agua',    name: 'Vaso de agua',      icon: 'plus',  form: 'instant', log: 'health', msg: 'Vaso de agua registrado 💧 +5 XP a Vigor' },
    { id: 'nuevo',   name: 'Nuevo hábito',      icon: 'plus',  log: 'habit' },
  ] },
  { id: 'qa-diario', name: 'Diario', icon: 'edit', color: 'var(--area-community)', owned: true, actions: [
    { id: 'mood',    name: 'Mi ánimo de hoy',   icon: 'mood-great', form: 'mood', log: 'mood' },
    { id: 'nota',    name: 'Nota rápida',       icon: 'edit',       form: 'note', log: 'note' },
    { id: 'entrada', name: 'Entrada completa',  icon: 'calendar',   log: 'note' },
  ] },
  { id: 'qa-lectura', name: 'Lectura', icon: 'book-open', color: 'var(--kb-gem)', owned: true, actions: [
    { id: 'paginas', name: 'Registrar lectura', icon: 'book', form: 'read', log: 'read' },
    { id: 'cita',    name: 'Guardar una cita',  icon: 'edit', form: 'quote', log: 'note' },
    { id: 'libro',   name: 'Registrar libro',   icon: 'plus', log: 'read' },
  ] },
  { id: 'qa-tareas', name: 'Tareas', icon: 'list', color: 'var(--kb-primary)', owned: true, actions: [
    { id: 'nueva',   name: 'Nueva tarea',       icon: 'plus',  form: 'task',  log: 'task' },
    { id: 'hecha',   name: 'Marcar hecha',      icon: 'check', form: 'done',  log: 'task' },
  ] },
  { id: 'qa-retos', name: 'Retos', icon: 'sword', color: 'var(--kb-hp)', owned: true, actions: [
    { id: 'dia-ok',  name: 'Día cumplido',      icon: 'check', form: 'reto',  log: 'reto' },
    { id: 'reflex',  name: 'Reflexión del día', icon: 'edit',  form: 'note',  log: 'note' },
  ] },
  { id: 'qa-entre', name: 'Entretenimiento', icon: 'film', color: 'var(--kb-hp-ink)', cost: 40, actions: [
    { id: 'epi',     name: 'Marcar episodio',   icon: 'tv',    form: 'episode', log: 'watch' },
  ] },
  { id: 'qa-amigos', name: 'Amigos', icon: 'community', color: 'var(--area-community)', cost: 40, actions: [
    { id: 'empujon', name: 'Mandar empujón',    icon: 'flame', form: 'friend', log: 'social' },
    { id: 'aplauso', name: 'Aplaudir a alguien',icon: 'trophy',form: 'friend', log: 'social' },
  ] },
  { id: 'qa-boveda', name: 'Bóveda', icon: 'book', color: 'var(--kb-gem-ink)', cost: 40, actions: [
    { id: 'nota-md', name: 'Nota a la Bóveda',  icon: 'edit',  form: 'note',  log: 'note' },
  ] },
  { id: 'qa-salud', name: 'Salud', icon: 'vigor', color: 'var(--area-vigor)', cost: 60, actions: [
    { id: 'peso',    name: 'Registrar peso',    icon: 'gauge', form: 'weight', log: 'health' },
    { id: 'entreno', name: 'Entreno hecho',     icon: 'check', form: 'instant', log: 'health', msg: 'Entreno registrado 💪 +40 XP a Vigor' },
  ] },
  { id: 'qa-estudio', name: 'Estudio', icon: 'graduation', color: 'var(--area-wisdom)', cost: 60, actions: [
    { id: 'pomo',    name: 'Pomodoro · 25 min', icon: 'clock', form: 'instant', log: 'study', msg: 'Foco de 25 min iniciado 🎯' },
    { id: 'apunte',  name: 'Apunte a la Bóveda', icon: 'book',  form: 'note',    log: 'note' },
  ] },
];

const KIBO_QA_KEY = 'kibo:qa-enabled', KIBO_QA_OWNED_KEY = 'kibo:qa-owned';
function qaOwned() {
  const base = KIBO_QA_MODULES.filter(m => m.owned).map(m => m.id);
  try { return new Set(base.concat(JSON.parse(localStorage.getItem(KIBO_QA_OWNED_KEY) || '[]'))); }
  catch (_) { return new Set(base); }
}
function qaOwn(id) {
  const s = [...qaOwned()].filter(x => !KIBO_QA_MODULES.find(m => m.id === x && m.owned));
  if (!s.includes(id)) s.push(id);
  try { localStorage.setItem(KIBO_QA_OWNED_KEY, JSON.stringify(s)); } catch (_) {}
  // Comprar un rubro es comprarlo PARA USARLO: si solo se marcara como tuyo,
  // seguiría sin aparecer en la rueda y la compra se sentiría rota.
  const on = qaEnabled();
  if (!on.includes(id)) { try { localStorage.setItem(KIBO_QA_KEY, JSON.stringify([...on, id])); } catch (_) {} }
  try { window.dispatchEvent(new CustomEvent('kibo:qa-change')); } catch (_) {}
}

// El orden lo decide el usuario desde el «⋯» de KIBO; lo que no esté en la
// lista guardada va detrás, en el orden del catálogo.
const KIBO_QA_ORDER_KEY = 'kibo:qa-order';
function qaOrder() {
  try { const v = JSON.parse(localStorage.getItem(KIBO_QA_ORDER_KEY) || 'null'); if (Array.isArray(v)) return v; } catch (_) {}
  return [];
}
function qaSetOrder(list) {
  try { localStorage.setItem(KIBO_QA_ORDER_KEY, JSON.stringify(list)); } catch (_) {}
  try { window.dispatchEvent(new CustomEvent('kibo:qa-change')); } catch (_) {}
}
function qaSort(list) {
  const ord = qaOrder();
  return [...list].sort((a, b) => {
    const ia = ord.indexOf(a.id), ib = ord.indexOf(b.id);
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
  });
}
function qaEnabled() {
  try { const v = JSON.parse(localStorage.getItem(KIBO_QA_KEY) || 'null'); if (Array.isArray(v)) return v; } catch (_) {}
  return KIBO_QA_MODULES.filter(m => m.owned).map(m => m.id);
}
function qaSetEnabled(list) {
  try { localStorage.setItem(KIBO_QA_KEY, JSON.stringify(list)); } catch (_) {}
  try { window.dispatchEvent(new CustomEvent('kibo:qa-change')); } catch (_) {}
}

// ── El intérprete (reglas locales; se sustituye por el proveedor de IA) ──
function kiboParse(text) {
  const t = (text || '').toLowerCase();
  const num = (re) => { const m = t.match(re); return m ? parseFloat(m[1].replace(/,/g, '')) : null; };
  const out = [];
  const gasto = num(/(?:gast[eé]|compr[eé]|pagu[eé])[^\d$]*\$?\s*([\d,]+(?:\.\d+)?)/);
  if (gasto) out.push({ kind: 'money-out', icon: 'wealth', color: 'var(--kb-coin)', label: `Gasto de $${gasto.toLocaleString('es-MX')}`, sub: /caf[eé]|comida|super|uber|cine/.test(t) ? 'Categoría: ' + (t.match(/caf[eé]|comida|super|uber|cine/) || [])[0] : 'Sin categoría' });
  const ingreso = num(/(?:me pagaron|ingres[oé]|cobr[eé]|deposit[oó]?)[^\d$]*\$?\s*([\d,]+(?:\.\d+)?)/);
  if (ingreso) out.push({ kind: 'money-in', icon: 'trending-up', color: 'var(--kb-good)', label: `Ingreso de $${ingreso.toLocaleString('es-MX')}`, sub: 'A tu cuenta principal' });
  const pags = num(/le[ií][^\d]*(\d+)\s*p[aá]g/);
  if (pags) out.push({ kind: 'read', icon: 'book-open', color: 'var(--kb-gem)', label: `${pags} páginas leídas`, sub: '+' + Math.round(pags * 1.5) + ' XP a Sabiduría' });
  if (/medit|ejercicio|entren|gym|corr[íi]|camin/.test(t)) out.push({ kind: 'habit', icon: 'flame', color: 'var(--kb-streak)', label: 'Hábito completado', sub: 'Actividad física / mindfulness' });
  if (/agua|vaso/.test(t)) out.push({ kind: 'health', icon: 'plus', color: 'var(--kb-primary)', label: 'Vaso de agua', sub: '+5 XP a Vigor' });
  if (/me siento|[aá]nimo/.test(t)) out.push({ kind: 'mood', icon: 'mood-great', color: 'var(--area-community)', label: 'Ánimo de hoy', sub: 'Eliges el mood al confirmar' });
  if (/fall[eé]|no pude|se me olvid|romp[íi]/.test(t)) out.push({ kind: 'fail', icon: 'alert', color: 'var(--kb-hp)', label: 'Fallo registrado', sub: 'Cuesta vida — pero reencauza' });
  return out;
}

// Etiqueta canónica de un registro: se rearma desde el valor, para que
// corregir el número corrija también lo que dice la tarjeta.
const KB_KINDS = {
  'money-out': { icon: 'wealth',      color: 'var(--kb-coin)',           unit: '$',    lbl: v => `Gasto de $${(+v).toLocaleString('es-MX')}` },
  'money-in':  { icon: 'trending-up', color: 'var(--kb-good)',  unit: '$',    lbl: v => `Ingreso de $${(+v).toLocaleString('es-MX')}` },
  read:        { icon: 'book-open',   color: 'var(--kb-gem)',            unit: 'pág.', lbl: v => `${+v} páginas leídas` },
  study:       { icon: 'graduation',  color: 'var(--area-wisdom)',       unit: 'min',  lbl: v => `${+v} min de estudio` },
  habit:       { icon: 'flame',       color: 'var(--kb-streak)',         unit: '',     lbl: () => 'Hábito completado' },
  health:      { icon: 'plus',        color: 'var(--kb-primary)',        unit: 'vasos',lbl: v => `${+v} vaso${+v === 1 ? '' : 's'} de agua` },
  mood:        { icon: 'mood-great',  color: 'var(--area-community)',    unit: '',     lbl: () => 'Ánimo de hoy' },
  fail:        { icon: 'alert',       color: 'var(--kb-hp)',             unit: '',     lbl: () => 'Fallo registrado' },
};
function kbProp(kind, value, sub) {
  const k = KB_KINDS[kind] || KB_KINDS.habit;
  return { kind, value: value == null ? null : +value, icon: k.icon, color: k.color, unit: k.unit, label: k.lbl(value), sub };
}

// kiboRead — lo que kiboParse no cubría: número suelto sin unidad, verbo sin
// cantidad, y el caso de que no haya nada. Devuelve o registros o UNA
// pregunta; nunca un silencio.
function kiboRead(text) {
  const t = (text || '').toLowerCase();
  const props = kiboParse(text).map(p => {
    const m = String(p.label).match(/([\d,.]+)/);
    const v = m ? parseFloat(m[1].replace(/,/g, '')) : null;
    return { ...p, value: v, unit: (KB_KINDS[p.kind] || {}).unit || '' };
  });
  if (props.length) return { props, ask: null };
  const verbo = /gast[eé]|compr[eé]|pagu[eé]/.test(t) ? 'money-out'
              : /me pagaron|ingres[oé]|cobr[eé]/.test(t) ? 'money-in'
              : /le[ií]/.test(t) ? 'read'
              : /estudi/.test(t) ? 'study' : null;
  const bare = (t.match(/\b(\d[\d,.]*)\b/) || [])[1];
  if (verbo && !bare) return { props: [], ask: { type: 'amount', kind: verbo } };
  if (bare && !verbo) return { props: [], ask: { type: 'unit', n: parseFloat(String(bare).replace(/,/g, '')) } };
  return { props: [], ask: { type: 'none' } };
}

// ── Formularios compactos (burbuja junto al anillo) ──────────────
function QaMoneyForm({ kind, onDone }) {
  const [amount, setAmount] = React.useState('');
  const [cat, setCat] = React.useState(kind === 'money-in' ? 'Nómina' : 'Comida');
  const [acct, setAcct] = React.useState('Débito');
  const CATS = kind === 'money-in' ? ['Nómina', 'Venta', 'Regalo'] : ['Comida', 'Transporte', 'Casa', 'Gustos'];
  return (
    <div className="qa-form">
      <div className="kbv-amount-input">
        <span className="prefix">$</span>
        <input type="number" value={amount} autoFocus placeholder="0.00" onChange={(e) => setAmount(e.target.value)} />
        <span className="suffix">MXN</span>
      </div>
      <div className="qa-chiprow">
        {CATS.map(c => <button key={c} type="button" className={`qa-chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      <div className="qa-chiprow">
        {['Débito', 'Efectivo', 'Crédito'].map(a => (
          <button key={a} type="button" className={`qa-chip ${acct === a ? 'on' : ''}`} onClick={() => setAcct(a)}>{a}</button>
        ))}
      </div>
      <button type="button" className="kbv-btn kbv-btn-primary qa-save" disabled={!parseFloat(amount)}
              onClick={() => onDone(
                `${kind === 'money-in' ? 'Ingreso' : 'Gasto'} de $${parseFloat(amount).toLocaleString('es-MX')} · ${cat} · ${acct} ✓`,
                { amount: parseFloat(amount), cat, account: acct, dir: kind === 'money-in' ? 'in' : 'out' },
              )}>
        <KIcon name="check" size={14} /> Registrar
      </button>
    </div>
  );
}
function QaHabitForm({ onDone }) {
  const HABITS = ['Meditar 10 min', 'Leer 20 min', 'Salir a correr', 'Sin azúcar'];
  const [h, setH] = React.useState(null);
  return (
    <div className="qa-form">
      <div className="qa-chiprow wrap">
        {HABITS.map(x => <button key={x} type="button" className={`qa-chip ${h === x ? 'on' : ''}`} onClick={() => setH(x)}>{x}</button>)}
      </div>
      <button type="button" className="kbv-btn kbv-btn-primary qa-save" disabled={!h} onClick={() => onDone(`«${h}» marcado ✓ — racha protegida 🔥`, { habit: h })}>
        <KIcon name="check" size={14} /> Marcar hecho
      </button>
    </div>
  );
}
// El ánimo no es solo una cara: guarda causa y nota, y mueve la vida (un día
// «Mal» cuesta, uno «Genial» repone) — así el registro tiene consecuencia.
const QA_MOODS = [
  { ic: 'mood-great', l: 'Genial', hp: 3,  c: 'var(--kb-good)' },
  { ic: 'mood-good',  l: 'Bien',   hp: 1,  c: 'var(--kb-primary)' },
  { ic: 'mood-meh',   l: 'Normal', hp: 0,  c: 'var(--kb-coin)' },
  { ic: 'mood-low',   l: 'Bajo',   hp: -2, c: 'var(--kb-streak)' },
  { ic: 'mood-sad',   l: 'Mal',    hp: -4, c: 'var(--kb-hp)' },
];
const QA_MOOD_CAUSES = ['Trabajo', 'Escuela', 'Salud', 'Gente', 'Dinero', 'Nada en particular'];

function QaMoodForm({ onDone }) {
  const [pick, setPick] = React.useState(null);
  const [cause, setCause] = React.useState(null);
  const [note, setNote] = React.useState('');
  const m = QA_MOODS.find(x => x.l === pick);
  return (
    <div className="qa-form">
      <div className="qa-moodrow">
        {QA_MOODS.map(x => (
          <button key={x.ic} type="button" className={`qa-mood ${pick === x.l ? 'on' : ''}`} style={{ '--c': x.c }}
                  title={x.l} aria-label={x.l} onClick={() => setPick(x.l)}>
            <KIcon name={x.ic} size={20} />
          </button>
        ))}
      </div>
      {pick && (
        <React.Fragment>
          <span className="qa-hintline">¿Qué lo hizo así?</span>
          <div className="qa-chiprow wrap">
            {QA_MOOD_CAUSES.map(c => (
              <button key={c} type="button" className={`qa-chip ${cause === c ? 'on' : ''}`} onClick={() => setCause(c)}>{c}</button>
            ))}
          </div>
          <textarea value={note} rows={2} placeholder="Una línea para tu Diario (opcional)…" onChange={(e) => setNote(e.target.value)} />
        </React.Fragment>
      )}
      <button type="button" className="kbv-btn kbv-btn-primary qa-save" disabled={!pick}
              onClick={() => onDone(
                `Ánimo «${pick}»${cause ? ' · ' + cause : ''} guardado en tu Diario ✓${m && m.hp ? (m.hp > 0 ? ` +${m.hp} de vida` : ` ${m.hp} de vida`) : ''}`,
                { hp: m ? m.hp : 0, note: note.trim(), cause },
              )}>
        <KIcon name="check" size={14} /> Registrar el día
      </button>
    </div>
  );
}
function QaNoteForm({ onDone }) {
  const [v, setV] = React.useState('');
  return (
    <div className="qa-form">
      <textarea value={v} autoFocus rows={3} placeholder="Escríbelo y suéltalo…" onChange={(e) => setV(e.target.value)} />
      <button type="button" className="kbv-btn kbv-btn-primary qa-save" disabled={!v.trim()} onClick={() => onDone(`Nota guardada ✓ +10 XP · ${v.trim().split(/\s+/).length} palabras`, { text: v.trim() })}>
        <KIcon name="check" size={14} /> Guardar
      </button>
    </div>
  );
}
// Selector + contador: el registro dice de QUÉ es, no solo cuánto.
function QaPickCountForm({ items, pickLabel, label, suffix, start, step, msg, onDone }) {
  const [pick, setPick] = React.useState(items[0]);
  const [n, setN] = React.useState(start);
  return (
    <div className="qa-form">
      <span className="qa-hintline">{pickLabel}</span>
      <div className="qa-chiprow wrap">
        {items.map(it => (
          <button key={it} type="button" className={`qa-chip ${pick === it ? 'on' : ''}`} onClick={() => setPick(it)}>{it}</button>
        ))}
      </div>
      {typeof KbStepper === 'function'
        ? <KbStepper label={label} value={n} onChange={setN} min={1} max={999} step={step} suffix={suffix} />
        : <input type="number" value={n} onChange={(e) => setN(parseInt(e.target.value || '0', 10))} />}
      <button type="button" className="kbv-btn kbv-btn-primary qa-save" disabled={!pick}
              onClick={() => onDone(msg(pick, n), { item: pick, value: n, unit: suffix })}>
        <KIcon name="check" size={14} /> Registrar
      </button>
    </div>
  );
}

// Elegir uno de una lista y listo (tarea hecha, reto del día, empujón).
// Un ítem puede ser una cadena o {name, icon, color, meta, progress} — así la
// misma lista sirve para un empujón (solo nombre) y para un reto (ícono del
// rubro, color y en qué día va), sin dos componentes que mantener.
function qaItem(it) { return typeof it === 'string' ? { name: it } : it; }

function QaPickForm({ items, hint, cta, msg, onDone }) {
  const [pick, setPick] = React.useState(null);
  const list = items.map(qaItem);
  const rich = list.some(x => x.icon || x.meta);
  return (
    <div className="qa-form">
      <span className="qa-hintline">{hint}</span>
      <div className={rich ? 'qa-optlist' : 'qa-chiprow wrap'}>
        {list.map(it => (
          <button key={it.name} type="button"
                  className={rich ? `qa-opt ${pick === it.name ? 'on' : ''}` : `qa-chip ${pick === it.name ? 'on' : ''}`}
                  style={it.color ? { '--c': it.color } : undefined}
                  onClick={() => setPick(it.name)}>
            {rich && <span className="qa-opt-ico"><KIcon name={it.icon || 'target'} size={16} /></span>}
            <span className="qa-opt-txt">
              <strong>{it.name}</strong>
              {it.meta && <em>{it.meta}</em>}
            </span>
            {rich && typeof it.progress === 'number' && (
              <span className="qa-opt-bar"><i style={{ width: Math.round(it.progress * 100) + '%' }} /></span>
            )}
            {rich && pick === it.name && <span className="qa-opt-check"><KIcon name="check" size={13} /></span>}
          </button>
        ))}
      </div>
      <button type="button" className="kbv-btn kbv-btn-primary qa-save" disabled={!pick}
              onClick={() => onDone(msg(pick), { item: pick })}>
        <KIcon name="check" size={14} /> {cta}
      </button>
    </div>
  );
}

function QaStepperForm({ label, suffix, start = 10, step = 5, msg, onDone }) {
  const [n, setN] = React.useState(start);
  return (
    <div className="qa-form">
      {typeof KbStepper === 'function'
        ? <KbStepper label={label} value={n} onChange={setN} min={1} max={999} step={step} suffix={suffix} />
        : <input type="number" value={n} onChange={(e) => setN(parseInt(e.target.value || '0', 10))} />}
      <button type="button" className="kbv-btn kbv-btn-primary qa-save" onClick={() => onDone(msg(n), { value: n, unit: suffix })}>
        <KIcon name="check" size={14} /> Registrar
      </button>
    </div>
  );
}
// Las listas salen de los datos de verdad: una lista inventada aquí dentro se
// queda vieja en cuanto el usuario cambia algo en su pantalla.
function qaActiveRetos() {
  const src = (window.RETOS_DEMO || []).filter(r => r.status === 'active');
  if (!src.length) return ['Maratón de lectura', 'Sin azúcar 30 días', '5 km diarios'];
  return src.slice(0, 5).map(r => ({
    name: r.name, icon: r.icon || 'sword', color: r.color || 'var(--kb-boss)',
    meta: r.daysTotal ? `Día ${r.daysElapsed || 0} de ${r.daysTotal}` : null,
    progress: r.daysTotal ? Math.min(1, (r.daysElapsed || 0) / r.daysTotal) : null,
  }));
}
function qaOpenTasks() {
  const PRIO = { urgent: 'Urgente', high: 'Alta', medium: 'Media', low: 'Baja', vlow: 'Muy baja' };
  const src = (window.DEMO_TASKS_FULL || []).filter(t => t.status !== 'done');
  if (!src.length) return ['Cerrar el reporte', 'Llamar al banco', 'Comprar despensa'];
  return src.slice(0, 5).map(t => ({
    name: t.title, icon: 'list', color: `var(--area-${t.area})`,
    meta: [PRIO[t.priority], t.project].filter(Boolean).join(' · ') || null,
  }));
}

function QaForm({ form, onDone }) {
  switch (form) {
    case 'money-out': return <QaMoneyForm kind="money-out" onDone={onDone} />;
    case 'money-in':  return <QaMoneyForm kind="money-in" onDone={onDone} />;
    case 'goal':      return <QaStepperForm label="Abono" suffix="MXN" start={500} step={100} msg={(n) => `Abono de $${n.toLocaleString('es-MX')} a tu meta ✓`} onDone={onDone} />;
    case 'habit':     return <QaHabitForm onDone={onDone} />;
    case 'mood':      return <QaMoodForm onDone={onDone} />;
    case 'note':      return <QaNoteForm onDone={onDone} />;
    case 'pages':
    case 'read':      return <QaPickCountForm items={['Hábitos atómicos', 'Sapiens', 'El Quijote']}
                        pickLabel="¿Qué estás leyendo?" label="Páginas" suffix="pág." start={12} step={4}
                        msg={(b, n) => `${n} páginas de «${b}» ✓ +${Math.round(n * 1.5)} XP a Sabiduría`} onDone={onDone} />;
    case 'quote':
    case 'task':      return <QaNoteForm onDone={onDone} />;
    case 'done':      return <QaPickForm items={qaOpenTasks()}
                        hint="¿Cuál terminaste?" cta="Marcar hecha" msg={(t) => `«${t}» completada ✓ +25 XP`} onDone={onDone} />;
    case 'reto':      return <QaPickForm items={qaActiveRetos()}
                        hint="¿Qué reto cumpliste hoy?" cta="Registrar día" msg={(r) => `Día cumplido en «${r}» 🔥`} onDone={onDone} />;
    case 'episode':   return <QaPickCountForm items={['Severance', 'The Bear', 'Arcane']}
                        pickLabel="¿Qué estás viendo?" label="Episodios" suffix="ep." start={1} step={1}
                        msg={(s, n) => `${n} episodio${n > 1 ? 's' : ''} de «${s}» ✓`} onDone={onDone} />;
    case 'friend':    return <QaPickForm items={['Lucía', 'Diego', 'Sofía', 'Renata']}
                        hint="¿A quién?" cta="Enviar" msg={(f) => `Empujón enviado a ${f} 👊`} onDone={onDone} />;
    case 'weight':    return <QaStepperForm label="Peso" suffix="kg" start={72} step={1} msg={(n) => `Peso de ${n} kg registrado ✓`} onDone={onDone} />;
    default: return null;
  }
}

// ── 50 · Chat inmersivo ───────────────────────────────────────────
// Antes era una tarjeta flotando sobre un velo gris: KIBO diminuto en una
// esquina y la conversación encerrada en una caja. Ahora el chat ES el
// espacio — fondo profundo con luz que respira, KIBO grande al centro y los
// mensajes viviendo sueltos a su alrededor.
function KiboChat({ onClose, onToast }) {
  const { hp, tone, mood } = (typeof useVitals === 'function') ? useVitals() : { hp: 80, tone: { label: '' }, mood: 'calma' };
  const [msgs, setMsgs] = React.useState([{ who: 'kibo', text: 'Cuéntame el día y yo lo registro. Puedes hablarme o escribirme — y si entiendo mal, me corriges.' }]);
  const [text, setText] = React.useState('');
  const [listening, setListening] = React.useState(false);
  const [edit, setEdit] = React.useState(null);   // { mi, pi, value }
  const [gesture, setGesture] = React.useState(null);
  const recRef = React.useRef(null), endRef = React.useRef(null);
  const canVoice = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  // Un rAF de margen: las tarjetas de registro crecen DESPUÉS del primer
  // layout, así que fijar el scroll en el mismo tick lo dejaba a media altura.
  React.useEffect(() => {
    const el = endRef.current && endRef.current.parentNode;
    if (!el) return;
    const pin = () => { el.scrollTop = el.scrollHeight; };
    const id = requestAnimationFrame(pin);
    const t = setTimeout(pin, 140);   // las tarjetas crecen tras el layout
    return () => { cancelAnimationFrame(id); clearTimeout(t); };
  }, [msgs, edit]);
  React.useEffect(() => {
    const esc = (ev) => { if (ev.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);
  function react(g) { setGesture(g + '#' + Date.now()); setTimeout(() => setGesture(null), 90); }

  function mic() {
    if (!canVoice) return;
    if (listening) { recRef.current && recRef.current.stop(); return; }
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new R(); recRef.current = rec;
    rec.lang = 'es-MX'; rec.interimResults = true;
    rec.onresult = (ev) => setText([...ev.results].map(r => r[0].transcript).join(' '));
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true); rec.start();
  }

  function say(t) {
    const { props, ask } = kiboRead(t);
    const reply = props.length
      ? (props.length > 1 ? `Pesqué ${props.length} cosas. Confírmalas o corrige el número.` : 'Esto entendí. Confirma o corrige el número.')
      : ask && ask.type === 'unit' ? `${ask.n}… ¿de qué? Dime y lo guardo.`
      : ask && ask.type === 'amount' ? '¿De cuánto?'
      : 'No pesqué nada registrable ahí. ¿Va alguno de estos?';
    react(props.length ? 'wave' : 'mueca');
    setMsgs(ms => [...ms, { who: 'yo', text: t }, { who: 'kibo', text: reply, props, ask }]);
  }
  function send() { const t = text.trim(); if (!t) return; setText(''); say(t); }

  function commit(p) {
    if (p.kind === 'fail' && typeof damageHP === 'function') damageHP(8, p.label);
    else if (typeof setHP === 'function' && typeof getHP === 'function' && ['habit', 'health', 'read', 'study'].includes(p.kind)) setHP(getHP() + 3);
    if (p.kind !== 'fail' && typeof kiboLog === 'function') kiboLog({ kind: p.kind, label: p.label });
    onToast && onToast(`${p.label} · registrado ✓`);
  }
  function register(p, mi, pi) {
    commit(p);
    react('beso');
    setMsgs(ms => ms.map((m, i) => i !== mi ? m : { ...m, props: m.props.filter((_, j) => j !== pi) })
                    .concat([{ who: 'kibo', text: `Listo: ${p.label}. ${p.kind === 'fail' ? 'Perdiste 8 de vida — mañana lo reencauzas.' : 'Anotado.'}` }]));
  }
  function registerAll(props, mi) {
    props.forEach(commit);
    react('clap');
    setMsgs(ms => ms.map((m, i) => i !== mi ? m : { ...m, props: [] })
                    .concat([{ who: 'kibo', text: `Registré las ${props.length}. Buen día, en serio.` }]));
  }
  function saveEdit() {
    if (!edit) return;
    const { mi, pi, value } = edit;
    setMsgs(ms => ms.map((m, i) => i !== mi ? m : {
      ...m,
      props: m.props.map((p, j) => j !== pi ? p : { ...p, value: +value, label: (KB_KINDS[p.kind] || KB_KINDS.habit).lbl(+value) }),
    }));
    setEdit(null);
  }

  const UNIT_OPTS = [
    { kind: 'read', label: 'páginas leídas' }, { kind: 'study', label: 'minutos de estudio' },
    { kind: 'money-out', label: 'pesos gastados' }, { kind: 'health', label: 'vasos de agua' },
  ];
  const NADA_OPTS = ['Marqué un hábito', 'Leí un rato', 'Registré mi ánimo', 'Fallé en algo'];

  return (
    <div className="kbb-chat-veil" onClick={onClose}>
      <div className="kc-space" aria-hidden="true"><i className="a" /><i className="b" /><i className="c" /></div>
      <div className="kbb-chat" onClick={(ev) => ev.stopPropagation()} role="dialog" aria-label="Chat con KIBO">
        <button type="button" className="kc-x" onClick={onClose} aria-label="Cerrar"><KIcon name="x" size={18} /></button>
        <div className="kc-stage">
          {/* El mismo KIBO de la esquina: sin `mood` se quedaba en 'calma'
              mientras el de la esquina reflejaba tu vida, y los dos no se
              parecían aunque fueran el mismo dibujo. */}
          {typeof KiboBlob === 'function' && <KiboBlob size={168} ground={false} gesture={gesture} mood={mood} idle />}
          <span className="kc-vitals">Tu vida <strong>{hp}</strong> · {tone.label}</span>
        </div>
        <div className="kc-log">
          {msgs.map((m, i) => (
            <div key={i} className={`kc-msg ${m.who}`}>
              <span className="kc-bub">{m.text}</span>
              {m.props && m.props.length > 0 && (
                <div className="kc-props">
                  {m.props.map((p, j) => {
                    const editing = edit && edit.mi === i && edit.pi === j;
                    return (
                      <div key={j} className="kc-prop" style={{ '--c': p.color }}>
                        <span className="kp-ico"><KIcon name={p.icon} size={15} /></span>
                        {editing ? (
                          <span className="kp-edit">
                            <input type="number" value={edit.value} autoFocus
                                   onChange={(ev) => setEdit({ ...edit, value: ev.target.value })}
                                   onKeyDown={(ev) => { if (ev.key === 'Enter') saveEdit(); if (ev.key === 'Escape') setEdit(null); }} />
                            <em>{p.unit}</em>
                          </span>
                        ) : (
                          <span className="kp-txt"><strong>{p.label}</strong><em>{p.sub}</em></span>
                        )}
                        {p.value != null && !editing && (
                          <button type="button" className="kp-fix" title="Corregir el número"
                                  onClick={() => setEdit({ mi: i, pi: j, value: p.value })}><KIcon name="edit" size={13} /></button>
                        )}
                        <button type="button" className="kp-ok" title={editing ? 'Guardar' : 'Registrar'}
                                onClick={() => editing ? saveEdit() : register(p, i, j)}><KIcon name="check" size={14} /></button>
                      </div>
                    );
                  })}
                  {m.props.length > 1 && (
                    <button type="button" className="kc-all" onClick={() => registerAll(m.props, i)}>
                      <KIcon name="check" size={13} /> Registrar las {m.props.length}
                    </button>
                  )}
                </div>
              )}
              {m.ask && m.ask.type === 'unit' && (
                <div className="kc-chips">
                  {UNIT_OPTS.map(o => (
                    <button key={o.kind} type="button" onClick={() => {
                      const p = kbProp(o.kind, m.ask.n, 'Lo dijiste tú, yo solo pregunté');
                      setMsgs(ms => [...ms, { who: 'kibo', text: 'Va:', props: [p] }]);
                    }}>{m.ask.n} {o.label}</button>
                  ))}
                </div>
              )}
              {m.ask && m.ask.type === 'amount' && (
                <div className="kc-chips">
                  {[50, 100, 250, 500].map(v => (
                    <button key={v} type="button" onClick={() => {
                      const p = kbProp(m.ask.kind, v, 'Sin categoría');
                      setMsgs(ms => [...ms, { who: 'kibo', text: 'Va:', props: [p] }]);
                    }}>${v}</button>
                  ))}
                  <button type="button" className="otro" onClick={() => setText('')}>Otro monto…</button>
                </div>
              )}
              {m.ask && m.ask.type === 'none' && (
                <div className="kc-chips">
                  {NADA_OPTS.map(o => <button key={o} type="button" onClick={() => say(o)}>{o}</button>)}
                </div>
              )}
            </div>
          ))}
          <span ref={endRef} />
        </div>
        <footer className="kc-bar">
          <button type="button" className={`kc-mic ${listening ? 'live' : ''} ${canVoice ? '' : 'off'}`} onClick={mic}
                  title={canVoice ? (listening ? 'Detener' : 'Hablar') : 'Tu navegador no soporta dictado'}>
            <KIcon name="mic" size={18} />
          </button>
          <input type="text" value={text} autoFocus placeholder={listening ? 'Escuchando…' : 'Gasté $250 en el súper y leí 30 páginas'}
                 onChange={(ev) => setText(ev.target.value)} onKeyDown={(ev) => { if (ev.key === 'Enter') send(); }} />
          <button type="button" className="kc-send" disabled={!text.trim()} onClick={send} aria-label="Enviar">
            <KIcon name="arrow-right" size={17} />
          </button>
        </footer>
      </div>
    </div>
  );
}

// ── La rueda radial ──────────────────────────────────────────────
// Estándar de acción rápida (GTA V, Fortnite): un disco completo partido en
// sectores, no botones flotando en un arco. Lo que cambia de raíz frente a la
// versión anterior:
//   · el blanco de clic es el SECTOR entero, no un círculo de 50px;
//   · se apunta con la DIRECCIÓN del cursor desde el centro — a media pulgada
//     del centro ya sabes qué vas a escoger, sin perseguir el botón;
//   · caben 13 destinos en 360° sin encaballarse, así que la paginación
//     (dos flechas que nadie entendía) desaparece;
//   · KIBO ocupa el cubo y dice el nombre de lo que apuntas.
const KBW_RIN = 104, KBW_ROUT = 210, KBW_GAP = 1.4, KBW_START = -90;

// Sector con las CUATRO esquinas redondeadas. Un sector recto deja cuatro
// puntas de aguja donde el arco corta el radio: a 1px de trazo se ven como
// bordes sucios, y es lo que hacía que la rueda no se viera terminada. El
// filete se resuelve en la geometría, no con `stroke-linejoin` (que solo
// suaviza la unión del trazo, no la silueta del relleno).
function kbwSector(a0, a1, ri, ro, k = 9) {
  const rad = (d) => d * Math.PI / 180;
  const p = (a, r) => [+(Math.cos(rad(a)) * r).toFixed(2), +(Math.sin(rad(a)) * r).toFixed(2)];
  // El filete no puede comerse más de la mitad del sector, ni del grosor.
  const kk = Math.max(0, Math.min(k, (ro - ri) / 2 - 1, (rad(a1 - a0) * ri) / 2 - 1));
  const dOut = (kk / ro) * 180 / Math.PI, dIn = (kk / ri) * 180 / Math.PI;
  const big = (a1 - a0 - dOut * 2) > 180 ? 1 : 0;
  const A = p(a0 + dOut, ro), B = p(a1 - dOut, ro), C = p(a1, ro - kk);
  const D = p(a1, ri + kk), E = p(a1 - dIn, ri), F = p(a0 + dIn, ri), G = p(a0, ri + kk), H = p(a0, ro - kk);
  return [
    `M ${A[0]} ${A[1]}`,
    `A ${ro} ${ro} 0 ${big} 1 ${B[0]} ${B[1]}`,
    `A ${kk} ${kk} 0 0 1 ${C[0]} ${C[1]}`,
    `L ${D[0]} ${D[1]}`,
    `A ${kk} ${kk} 0 0 1 ${E[0]} ${E[1]}`,
    `A ${ri} ${ri} 0 ${big} 0 ${F[0]} ${F[1]}`,
    `A ${kk} ${kk} 0 0 1 ${G[0]} ${G[1]}`,
    `L ${H[0]} ${H[1]}`,
    `A ${kk} ${kk} 0 0 1 ${A[0]} ${A[1]}`, 'Z',
  ].join(' ');
}

function KiboQuickWheel({ open, onClose, onToast, onChat, onDemand, origin, kiboSize = 96 }) {
  const [level, setLevel] = React.useState(null);   // null | {kind:'mod', mod} | {kind:'tricks'}
  const [form, setForm] = React.useState(null);
  const [custom, setCustom] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const [page, setPage] = React.useState(0);
  const [hubGesture, setHubGesture] = React.useState(null);
  const hubPulse = React.useRef(null);
  function fireHub(name) {
    setHubGesture((name || 'random') + '#' + Date.now());
    clearTimeout(hubPulse.current);
    hubPulse.current = setTimeout(() => setHubGesture(null), 80);
  }
  React.useEffect(() => () => clearTimeout(hubPulse.current), []);
  const pullRef = React.useRef(null);
  const justPulled = React.useRef(false);

  // Jalar el gel. El cuerpo se estira HACIA el cursor mientras arrastras y al
  // soltar rebota con una travesura. Se escribe el transform directo en el
  // nodo (no por estado de React): un re-render por cada pointermove convierte
  // un gesto continuo en una animación a saltos.
  function pullStart(e) {
    const el = pullRef.current; if (!el) return;
    e.stopPropagation();
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    el.classList.add('pulling');
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    const draw = (ev) => {
      const dx = ev.clientX - cx, dy = ev.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (!dist) return;
      const mag = Math.min(1, dist / 190);
      const rad = Math.atan2(dy, dx);
      // El cuerpo entero apenas se va TRAS el cursor; lo que se deforma es un
      // punto: sale un chipote por donde jalas. Estirar la silueta completa
      // hacía ver a KIBO elástico, no blando.
      el.style.transform = `translate(${(Math.cos(rad) * 16 * mag).toFixed(1)}px, ${(Math.sin(rad) * 16 * mag).toFixed(1)}px) scale(var(--k))`;
      // El chipote nace en el borde del gel (radio ~46 del cuerpo nativo) y
      // se aleja con el jalón, arrastrando la masa detrás.
      const r = 22 + 42 * mag;
      el.style.setProperty('--bx', (Math.cos(rad) * r).toFixed(1) + 'px');
      el.style.setProperty('--by', (Math.sin(rad) * r).toFixed(1) + 'px');
      // Al estirarse, la masa que sale ADELGAZA — un hilo de gelatina, no una
      // bola que viaja: crece de tamaño pero se afina en el eje del jalón.
      el.style.setProperty('--bs', (0.62 + 0.5 * mag).toFixed(3));
      // El estiramiento hace el trabajo que antes hacía la traslación: la gota
      // se alarga hacia el borde con la punta clavada en el cuerpo.
      el.style.setProperty('--bsx', (1 + 2.3 * mag).toFixed(3));
      el.style.setProperty('--bsy', (1 - 0.42 * mag).toFixed(3));
      el.style.setProperty('--brot', (rad * 180 / Math.PI).toFixed(1) + 'deg');
      el.style.setProperty('--bo', Math.min(1, mag * 2.6).toFixed(2));
    };
    const up = () => {
      window.removeEventListener('pointermove', draw);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      el.classList.remove('pulling');
      el.style.transform = '';
      el.style.removeProperty('--bx'); el.style.removeProperty('--by');
      el.style.setProperty('--bs', '0'); el.style.setProperty('--bo', '0');
      el.style.removeProperty('--bsx'); el.style.removeProperty('--bsy');
      // La clase del rebote se retira sola: dejarla puesta impide que la
      // siguiente soltada vuelva a disparar la animación.
      el.classList.remove('snap');
      void el.offsetWidth;
      el.classList.add('snap');
      clearTimeout(el._snap);
      el._snap = setTimeout(() => el.classList.remove('snap'), 760);
      // El clic que sigue al puntero no debe disparar una segunda travesura.
      justPulled.current = true;
      setTimeout(() => { justPulled.current = false; }, 350);
      fireHub();
    };
    window.addEventListener('pointermove', draw);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }
  const vitals = (typeof useVitals === 'function') ? useVitals() : { mood: 'calma' };
  const [, force] = React.useReducer(x => x + 1, 0);
  const wrapRef = React.useRef(null);

  // Abrir la rueda la reinicia. Si la apertura viene de una PETICIÓN (el
  // buscador pidiendo una acción), el reinicio llegaba después del manejador y
  // se llevaba por delante el nivel y el formulario recién fijados. La petición
  // se guarda en un ref y es el propio reinicio quien la aplica.
  const pending = React.useRef(null);
  React.useEffect(() => {
    if (pending.current) {
      const { mod, action } = pending.current;
      pending.current = null;
      setLevel({ kind: 'mod', mod }); setForm({ mod, action });
      setCustom(false); setActive(-1);
      return;
    }
    setLevel(null); setForm(null); setCustom(false); setActive(-1);
  }, [open]);
  // Al cambiar de nivel el disco es otro: conservar el sector apuntado dejaba
  // resaltado un índice que ya no significa lo mismo.
  React.useEffect(() => { setActive(-1); setPage(0); }, [level, form, custom]);

  React.useEffect(() => {
    const h = () => force();
    window.addEventListener('kibo:qa-change', h);
    return () => window.removeEventListener('kibo:qa-change', h);
  }, []);

  // El buscador puede pedir una acción por su nombre: se abre EL MISMO
  // formulario de la rueda, no una copia — un formulario duplicado es una
  // deuda que se paga en cada cambio.
  React.useEffect(() => {
    const h = (ev) => {
      const d = (ev && ev.detail) || {};
      const mod = (window.KIBO_QA_MODULES || []).find(m => m.id === d.modId);
      const act = mod && mod.actions.find(a => a.id === d.actionId);
      if (!mod || !act) return;
      const full = qaModalFor(mod.id, act.id);
      if (full) { openFullModal(mod, full.kind); return; }
      if (act.form === 'instant') { done(act.msg, act.log, { instant: act.id }); return; }
      pending.current = { mod, action: act };
      setLevel({ kind: 'mod', mod });
      setForm({ mod, action: act });
      if (onDemand) onDemand();
    };
    window.addEventListener('kibo:qa-run', h);
    return () => window.removeEventListener('kibo:qa-run', h);
  }, [onDemand]);

  const owned = qaOwned(), enabled = qaEnabled();
  const mods = qaSort(KIBO_QA_MODULES.filter(m => owned.has(m.id) && enabled.includes(m.id)));

  function back() {
    if (form) setForm(null);
    else if (custom) setCustom(false);
    else if (level) setLevel(null);
    else onClose();
  }

  React.useEffect(() => {
    if (!open) return;
    const esc = (e) => { if (e.key === 'Escape') back(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, form, custom, level, onClose]);

  // Se enseña una vez y se calla para siempre: una pista que vuelve cada día
  // deja de ser pista y pasa a ser ruido.
  const [showPullHint, setShowPullHint] = React.useState(() => {
    try { return !localStorage.getItem('kibo:taught-pull'); } catch (_) { return false; }
  });
  React.useEffect(() => {
    if (!open || !showPullHint) return;
    const t = setTimeout(() => {
      setShowPullHint(false);
      try { localStorage.setItem('kibo:taught-pull', '1'); } catch (_) {}
    }, 4200);
    return () => clearTimeout(t);
  }, [open, showPullHint]);

  function bumpUse(modId) {
    if (!modId) return;
    let u = {};
    try { u = JSON.parse(localStorage.getItem('kibo:qa-uses') || '{}'); } catch (_) {}
    u[modId] = (u[modId] || 0) + 1;
    try { localStorage.setItem('kibo:qa-uses', JSON.stringify(u)); } catch (_) {}
  }

  // Lo que paga cada tipo de registro. Vivía implícito («+5 XP a Vigor» dentro
  // del texto de una acción), así que la mayoría no decía nada de lo ganado.
  const QA_GAIN = {
    'money-out': { xp: 10 }, 'money-in': { xp: 15, coins: 8 },
    habit: { xp: 25, coins: 10, streak: '+1' }, reto: { xp: 40, coins: 15 },
    task: { xp: 30, coins: 12 }, read: { xp: 20, coins: 6 },
    study: { xp: 25, coins: 8 }, health: { xp: 20, coins: 6 },
    note: { xp: 8 }, mood: { xp: 5 }, watch: { xp: 8 }, social: { xp: 12, coins: 4 },
  };

  function done(msg, log, detail) {
    const delta = detail && typeof detail.hp === 'number'
      ? detail.hp
      : (['habit', 'health', 'read', 'study'].includes(log) ? 2 : 0);
    if (delta && typeof setHP === 'function' && typeof getHP === 'function') setHP(getHP() + delta);
    if (log && typeof kiboLog === 'function') kiboLog({ kind: log, label: msg, detail: detail || null });
    // Deshacer: devuelve la vida y anota la reversión, para que quien escuche
    // el registro (widgets, historial) pueda quitarlo.
    const undo = () => {
      if (delta && typeof setHP === 'function' && typeof getHP === 'function') setHP(getHP() - delta);
      if (log && typeof kiboLog === 'function') kiboLog({ kind: 'undo', of: log, label: msg });
    };
    onToast(msg, undo, { gain: QA_GAIN[log] || { xp: 10 } }); onClose();
  }

  // ── Los sectores de este nivel ──
  // El disco se pagina por LEGIBILIDAD, no por falta de sitio: en 360° caben
  // veinte sectores, pero el rótulo se encoge con cada uno y a partir de doce
  // ya no cabe el nombre. Las anclas (platicar, travesura, carpetas) viven en
  // TODAS las páginas: son la razón de abrir la rueda, no deben quedar
  // «en la otra hoja».
  // Lo pendiente de hoy primero. El catálogo estaba en orden de escritura, que
  // no dice nada de tu día: si tienes tres hábitos sin marcar, ese rubro no
  // puede estar en la segunda hoja. Empata por uso.
  const modOrder = React.useCallback((list) => {
    const pend = {};
    try {
      pend['qa-habitos'] = (window.HABITS_DEMO || []).filter(h => !h.done).length;
      pend['qa-retos'] = (window.RETOS_DEMO || []).filter(r => r.status === 'active').length;
      pend['qa-tareas'] = (window.DEMO_TASKS_FULL || []).filter(t => t.status !== 'done').length;
    } catch (_) {}
    let used = {};
    try { used = JSON.parse(localStorage.getItem('kibo:qa-uses') || '{}'); } catch (_) {}
    return list.slice().sort((a, b) =>
      ((pend[b.id] ? 1 : 0) - (pend[a.id] ? 1 : 0)) ||
      ((used[b.id] || 0) - (used[a.id] || 0)) ||
      (pend[b.id] || 0) - (pend[a.id] || 0));
  }, []);

  // Abre el formulario COMPLETO encima de la pantalla actual. No navega: el
  // usuario pidió registrar algo, no cambiar de sitio.
  function openFullModal(m, kind) {
    bumpUse(m.id);
    onClose();
    try { window.dispatchEvent(new CustomEvent('kibo:open-modal', { detail: { kind } })); } catch (_) {}
  }
  function pickAction(m, a) {
    const full = qaModalFor(m.id, a.id);
    if (full) return openFullModal(m, full.kind);
    if (a.form === 'instant') return done(a.msg, a.log, { instant: a.id });
    setForm({ mod: m, action: a });
  }

  const wheel = React.useMemo(() => {
    if (level && level.kind === 'mod') {
      return { pages: 1, fixed: 0, items: level.mod.actions.map(a => ({
        id: a.id, name: a.name, icon: a.icon, color: level.mod.color,
        run: () => pickAction(level.mod, a),
      })) };
    }
    if (level && level.kind === 'tricks') {
      const toy = (typeof getKiboStyle === 'function') ? getKiboStyle().toy : null;
      const all = ((typeof kiboTricksFor === 'function') ? kiboTricksFor(toy) : (window.KIBO_TRICK_LIST || []))
        .map(t => ({ id: t.id, name: t.name, desc: t.desc, icon: t.icon, color: 'var(--kb-streak)',
                     run: () => fireHub(t.id) }));
      // Reparto BALANCEADO: con 15 travesuras y tope de 11, cortar «11 y 4»
      // dejaba una segunda hoja con cuatro sectores gigantes. Se calcula el
      // número de hojas y luego se reparte parejo (8 y 7).
      const pages = Math.max(1, Math.ceil(all.length / 11));
      const PER = Math.ceil(all.length / pages);
      const pg = Math.min(page, pages - 1);
      return { pages, fixed: 1, items: [
        { id: '__rand', name: 'Sorpréndeme', desc: 'Que escoja él', icon: 'sparkle', color: 'var(--kb-primary)', hero: true,
          run: () => fireHub() },
        ...all.slice(pg * PER, pg * PER + PER),
      ] };
    }
    const ordered = modOrder(mods);
    const pages = Math.max(1, Math.ceil(ordered.length / 8));
    const PER = Math.ceil(mods.length / pages);
    const pg = Math.min(page, pages - 1);
    return { pages, fixed: 2, items: [
      { id: '__chat', name: 'Platicar con KIBO', desc: 'Cuéntale el día y él lo registra', icon: 'mic',
        color: 'var(--kb-primary)', hero: true, wide: true,
        run: () => { onClose(); onChat(); } },
      { id: '__find', name: 'Buscar', desc: 'Cualquier cosa, en toda la plataforma', icon: 'search', color: 'var(--kb-gem)',
        run: () => { onClose(); try { window.dispatchEvent(new CustomEvent('kibo:search')); } catch (_) {} } },
      ...mods.slice(pg * PER, pg * PER + PER).map(m => ({ id: m.id, name: m.name, icon: m.icon, color: m.color,
                          run: () => setLevel({ kind: 'mod', mod: m }) })),
      { id: '__trick', name: 'Travesura', desc: 'Que haga una de las suyas', icon: 'flame', color: 'var(--kb-streak)',
        run: () => setLevel({ kind: 'tricks' }) },
    ] };
  }, [level, page, mods.length, enabled.join(','), owned.size]);

  const items = wheel.items;
  const pages = wheel.pages;
  const pg = Math.min(page, pages - 1);
  const n = Math.max(1, items.length);
  // Los sectores dejan de ser todos iguales: cada uno declara su peso y la
  // acción estelar ocupa el doble. El origen se corre media porción para que
  // ese sector quede CENTRADO arriba, no empezando arriba.
  const weights = items.map(it => (it.wide ? 2 : 1));
  const totalW = weights.reduce((a, b) => a + b, 0);
  const unit = 360 / totalW;
  const spans = [];
  let acc = 0;
  const arcOrigin = KBW_START - (weights[0] * unit) / 2;
  for (const w of weights) { spans.push([arcOrigin + acc * unit, arcOrigin + (acc + w) * unit]); acc += w; }
  const step = unit;
  // El rótulo no puede ser más ancho que su sector: con 15 travesuras la
  // cuerda a media banda cae a 65px y los nombres se encimaban. Cuando ni
  // así caben (más de 12 sectores) el disco se queda en íconos y el nombre
  // completo lo dice el letrero de abajo — como en la rueda de GTA.
  const labW = (i) => Math.max(44, Math.min(104, Math.round(2 * Math.PI * ((KBW_RIN + KBW_ROUT) / 2) * ((spans[i][1] - spans[i][0]) / 360)) - 8));
  const labelsOff = n > 12;
  const mid = (i) => (spans[i][0] + spans[i][1]) / 2;
  const at = (deg, r) => ({ x: Math.cos(deg * Math.PI / 180) * r, y: Math.sin(deg * Math.PI / 180) * r });

  // Apuntar = dirección del cursor. Dentro del cubo no hay sector: esa zona
  // muerta es la que deja «no escoger nada» al alcance.
  function sectorAt(e) {
    const el = wrapRef.current; if (!el) return -1;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy) / (r.width / (KBW_ROUT * 2));
    if (dist < KBW_RIN - 6 || dist > KBW_ROUT + 26) return -1;
    let a = Math.atan2(dy, dx) * 180 / Math.PI;
    while (a < arcOrigin) a += 360;
    while (a >= arcOrigin + 360) a -= 360;
    for (let i = 0; i < spans.length; i++) if (a >= spans[i][0] && a < spans[i][1]) return i;
    return n - 1;
  }
  // El clic saca su sector de SUS propias coordenadas. Colgarlo del hover
  // dejaba la rueda muerta al tacto: un dedo quieto no emite pointermove, así
  // que `active` seguía en -1 y el toque no hacía nada.
  function choose(e) {
    const i = sectorAt(e);
    if (i >= 0 && items[i]) items[i].run();
  }
  function move(e) { setActive(sectorAt(e)); }

  const panel = form || custom;
  const cur = active >= 0 ? items[active] : null;
  const title = cur ? cur.name : (level && level.kind === 'mod' ? level.mod.name
    : level && level.kind === 'tricks' ? 'Travesuras' : 'Acción rápida');
  const sub = cur ? (cur.desc || '') : (level ? 'Escoge, o vuelve con ←' : 'Apunta con el cursor · jala a KIBO');

  return (
    <div className={`kbw ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="kbw-stage" onClick={(e) => e.stopPropagation()}>
        {!panel && (
          <div ref={wrapRef} className="kbw-wrap"
               role="menu" tabIndex={0} aria-label={title}
               aria-activedescendant={active >= 0 ? `kbw-i${active}` : undefined}
               onPointerMove={move} onPointerLeave={() => setActive(-1)}
               onPointerDown={(e) => { if (e.pointerType !== 'mouse') setActive(sectorAt(e)); }}
               onClick={choose}
               onKeyDown={(e) => {
                 const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
                 if (d) { e.preventDefault(); setActive(a => (((a < 0 ? (d > 0 ? -1 : 0) : a) + d) % n + n) % n); return; }
                 if (pages > 1 && (e.key === 'PageDown' || e.key === 'Tab' && !e.shiftKey && false)) { e.preventDefault(); setPage((p) => (p + 1) % pages); return; }
                 if (pages > 1 && e.key === 'PageUp') { e.preventDefault(); setPage((p) => (p - 1 + pages) % pages); return; }
                 if ((e.key === 'Enter' || e.key === ' ') && active >= 0) { e.preventDefault(); items[active].run(); }
               }}>
            <svg className="kbw-disc" viewBox={`${-KBW_ROUT} ${-KBW_ROUT} ${KBW_ROUT * 2} ${KBW_ROUT * 2}`} aria-hidden="true">
              {/* El cubo es una placa, no un agujero: KIBO tiene que pisar algo
                  o se lee como si flotara sobre la pantalla de atrás. */}
              <circle className="hubplate" r={KBW_RIN - 4} />
              {items.map((it, i) => (
                <path key={it.id} className={`sec ${active === i ? 'on' : ''} ${it.hero ? 'hero' : ''}`}
                      style={{ '--c': it.color, '--i': i }}
                      d={kbwSector(spans[i][0] + KBW_GAP, spans[i][1] - KBW_GAP, KBW_RIN, KBW_ROUT)} />
              ))}
            </svg>
            <div className="kbw-labels">
              {items.map((it, i) => {
                const p = at(mid(i), (KBW_RIN + KBW_ROUT) / 2);
                return (
                  <span key={it.id} id={`kbw-i${i}`} role="menuitem" aria-label={it.name}
                        className={`kbw-lab ${active === i ? 'on' : ''} ${labelsOff ? 'ico' : ''}`}
                        style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, '--c': it.color, '--i': i, '--w': `${labW(i)}px` }}>
                    <KIcon name={it.icon} size={it.hero ? 24 : 21} />
                    <b>{it.name}</b>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* El cubo: KIBO llega volando desde su esquina y se queda al centro.
            Tocarlo AQUÍ no navega — hace una travesura. Cerrar y volver tienen
            su propia tecla debajo: colgar «volver» del personaje convertía cada
            caricia en un salto de pantalla. */}
        {open && !panel && showPullHint && (
          <span className="kbw-teach" aria-hidden="true">
            <i /><b>Jálalo</b>
          </span>
        )}
        <button type="button" key={open ? 'hub-in' : 'hub-out'} className={`kbw-hub ${panel ? 'aside' : ''}`}
                style={origin ? { '--ox': `${origin.dx}px`, '--oy': `${origin.dy}px`, '--os': origin.scale } : undefined}
                onPointerDown={pullStart}
                onClick={(e) => {
                  // Enter/Espacio también: un botón enfocable que anuncia una
                  // acción tiene que poder ejecutarla sin ratón.
                  e.stopPropagation();
                  if (justPulled.current) return;
                  fireHub();
                }}
                title="Jálalo y suéltalo" aria-label="KIBO: jálalo y suéltalo para una travesura">
          <span className="kbw-pull" ref={pullRef}>
            {typeof KiboBlob === 'function' &&
              <KiboBlob size={kiboSize} ground={false} gesture={hubGesture} mood={vitals.mood} />}
          </span>
        </button>

        {!panel && (
          <div className="kbw-hubbar">
            <button type="button" className="kbw-hb" title={level ? 'Volver' : 'Cerrar'}
                    aria-label={level ? 'Volver' : 'Cerrar'}
                    onClick={(e) => { e.stopPropagation(); back(); }}>
              <KIcon name={level ? 'arrow-right' : 'x'} size={14} />
            </button>
            <button type="button" className="kbw-hb more" title="Editar la rueda"
                    aria-label="Editar la rueda"
                    onClick={(e) => { e.stopPropagation(); setCustom(true); }}>
              <KIcon name="grip" size={14} />
            </button>
          </div>
        )}

        {!panel && (
          <div className="kbw-foot">
            {pages > 1 && (
              <button type="button" className="kbw-pg" title="Página anterior" aria-label="Página anterior"
                      onClick={(e) => { e.stopPropagation(); setPage((p) => (p - 1 + pages) % pages); }}>
                <KIcon name="arrow-right" size={14} />
              </button>
            )}
            <div className="kbw-cap" aria-live="polite">
              <strong>{title}</strong>
              {sub && <span>{sub}</span>}
              {pages > 1 && (
                <span className="kbw-dots" aria-hidden="true">
                  {[...Array(pages)].map((_, i) => <i key={i} className={i === pg ? 'on' : ''} />)}
                </span>
              )}
            </div>
            {pages > 1 && (
              <button type="button" className="kbw-pg next" title="Más" aria-label="Página siguiente"
                      onClick={(e) => { e.stopPropagation(); setPage((p) => (p + 1) % pages); }}>
                <KIcon name="arrow-right" size={14} />
              </button>
            )}
          </div>
        )}

        {open && form && (
          <div className="kbb-rform" style={{ '--c': form.mod.color }}>
            <div className="rf-head">
              <button type="button" className="rf-back" title="Volver" onClick={() => setForm(null)}><KIcon name="arrow-right" size={12} /></button>
              <span className="rf-title"><KIcon name={form.action.icon} size={13} /> {form.action.name}</span>
              <button type="button" className="rf-x" title="Cerrar" onClick={onClose}><KIcon name="x" size={12} /></button>
            </div>
            <QaForm form={form.action.form} onDone={(m, detail) => { bumpUse(form.mod.id); done(m, form.action.log, detail); }} />
            {QA_FULL[form.mod.id] && (
              <button type="button" className="rf-more"
                      onClick={() => {
                        const f = QA_FULL[form.mod.id];
                        onClose();
                        try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: f.screen, create: !!f.create } })); } catch (_) {}
                      }}>
                <KIcon name="layers" size={14} /> Formulario completo
              </button>
            )}
          </div>
        )}

        {open && custom && (
          <div className="kbb-rform wide">
            <div className="rf-head">
              <button type="button" className="rf-back" title="Volver" onClick={() => setCustom(false)}><KIcon name="arrow-right" size={12} /></button>
              <span className="rf-title"><KIcon name="grip" size={13} /> Tu rueda</span>
              <button type="button" className="rf-x" title="Cerrar" onClick={onClose}><KIcon name="x" size={12} /></button>
            </div>
            <div className="qa-custom">
              <span className="kbv-meta">Arrastra con las flechas para ordenar. El orden es el que verás en el disco.</span>
              {(() => {
                // Puestos primero (en TU orden), después los que tienes guardados
                // y al final los que aún no son tuyos, con su precio.
                const mine = qaSort(KIBO_QA_MODULES.filter(m => owned.has(m.id)));
                const on = mine.filter(m => enabled.includes(m.id));
                const off = mine.filter(m => !enabled.includes(m.id));
                const locked = KIBO_QA_MODULES.filter(m => !owned.has(m.id));
                const move = (id, dir) => {
                  const ids = on.map(m => m.id);
                  const i = ids.indexOf(id), j = i + dir;
                  if (i < 0 || j < 0 || j >= ids.length) return;
                  ids.splice(j, 0, ids.splice(i, 1)[0]);
                  qaSetOrder(ids.concat(off.map(m => m.id)));
                  force();
                };
                const toggle = (m) => {
                  qaSetEnabled(enabled.includes(m.id) ? enabled.filter(x => x !== m.id) : [...enabled, m.id]);
                  force();
                };
                const row = (m, i, list, movable) => (
                  <div key={m.id} className="qa-cust-row" style={{ '--c': m.color }}>
                    {movable ? (
                      <span className="qc-move">
                        <button type="button" disabled={i === 0} title="Subir" aria-label={`Subir ${m.name}`} onClick={() => move(m.id, -1)}>
                          <KIcon name="arrow-right" size={11} />
                        </button>
                        <button type="button" disabled={i === list.length - 1} title="Bajar" aria-label={`Bajar ${m.name}`} onClick={() => move(m.id, 1)}>
                          <KIcon name="arrow-right" size={11} />
                        </button>
                      </span>
                    ) : <span className="qc-move ghost" aria-hidden="true" />}
                    <span className="qc-ico"><KIcon name={m.icon} size={14} /></span>
                    <span className="qc-name">{m.name}</span>
                    {typeof KbToggle === 'function'
                      ? <KbToggle on={enabled.includes(m.id)} onChange={() => toggle(m)} />
                      : <button type="button" className="fr-btn" onClick={() => toggle(m)}>{enabled.includes(m.id) ? 'Quitar' : 'Poner'}</button>}
                  </div>
                );
                return (
                  <React.Fragment>
                    {on.map((m, i) => row(m, i, on, true))}
                    {off.length > 0 && <span className="qa-cust-sep">Guardados</span>}
                    {off.map((m, i) => row(m, i, off, false))}
                    {locked.length > 0 && <span className="qa-cust-sep">Se compran en la Tienda</span>}
                    {locked.map(m => (
                      <div key={m.id} className="qa-cust-row locked" style={{ '--c': m.color }}>
                        <span className="qc-move ghost" aria-hidden="true" />
                        <span className="qc-ico"><KIcon name={m.icon} size={14} /></span>
                        <span className="qc-name">{m.name}</span>
                        <button type="button" className="qc-lock" title="Ir a la Tienda"
                                onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'store', tab: 'unlocks' } })); }}>
                          <GemIcon size={11} /> {m.cost}
                        </button>
                      </div>
                    ))}
                  </React.Fragment>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { KIBO_QA_MODULES, qaOwned, qaOwn, qaEnabled, qaSetEnabled, qaOrder, qaSetOrder, qaSort, kiboParse, KiboQuickWheel, KiboChat, QaForm });
