// salud-screen.jsx — Salud (ligada al área de Vigor)
// Foco: el EXPEDIENTE MÉDICO — fácil de alimentar, con detalle por registro,
// buscable y compartible con tu médico (para que él busque condiciones crónicas
// en vez de depender de tu memoria).
// La sincronización de dispositivos llega con la app móvil (App Store / Google
// Play): en la web solo se ve/elige la plataforma que alimenta los datos.
// Las METAS de salud son retos: se dan de alta en la sección Retos y aquí se
// miden solas contra tus datos sincronizados.

const SALUD_SOURCES = [
  { id: 'apple',   name: 'Apple Health',  metrics: 'pasos · sueño · ritmo · SpO₂' },
  { id: 'google',  name: 'Google Fit',    metrics: 'pasos · actividad · peso' },
  { id: 'samsung', name: 'Samsung Health', metrics: 'sueño · estrés · ritmo' },
  { id: 'garmin',  name: 'Garmin',         metrics: 'VO₂ · entrenos · FC' },
];

const SALUD_VITALS = [
  { id: 'hr',    label: 'FC en reposo', v: '62', u: 'ppm',  icon: 'flame',  c: 'var(--kb-hp)', trend: '−3 vs mes' },
  { id: 'sleep', label: 'Sueño · prom', v: '7.1', u: 'h',   icon: 'clock',  c: 'var(--kb-gem)', trend: '+0.4 h' },
  { id: 'steps', label: 'Pasos · hoy',  v: '8,240', u: '',  icon: 'vigor',  c: 'var(--kb-primary)', trend: '82% meta' },
  { id: 'spo2',  label: 'SpO₂',         v: '98', u: '%',    icon: 'sparkle', c: 'var(--area-will)', trend: 'normal' },
  { id: 'weight',label: 'Peso',         v: '74.2', u: 'kg', icon: 'trending-up', c: 'var(--area-community)', trend: '−1.1 kg' },
  { id: 'bp',    label: 'Presión',      v: '118/76', u: '', icon: 'shield', c: 'var(--kb-coin)', trend: 'óptima' },
];

// Las metas son RETOS (viven en la sección Retos); aquí se miden contra datos.
const SALUD_GOALS_DEMO = [
  { id: 'g1', name: 'Dormir 7.5 h en promedio', kind: 'Sueño', icon: 'clock', cur: 7.1, target: 7.5, unit: ' h', c: 'var(--kb-gem)', xp: 120 },
  { id: 'g2', name: 'Bajar a 72 kg', kind: 'Peso', icon: 'gauge', cur: 74.2, target: 72, unit: ' kg', c: 'var(--area-community)', down: true, xp: 150 },
  { id: 'g3', name: '10,000 pasos diarios', kind: 'Actividad', icon: 'vigor', cur: 8240, target: 10000, unit: '', c: 'var(--kb-primary)', xp: 100 },
];

const SALUD_RECORD_TYPES = {
  consulta:  { label: 'Consulta médica', icon: 'community', c: 'var(--kb-gem)' },
  receta:    { label: 'Receta / medicación', icon: 'edit', c: 'var(--kb-primary)' },
  estudio:   { label: 'Estudio / laboratorio', icon: 'layers', c: 'var(--area-community)' },
  condicion: { label: 'Condición / alergia', icon: 'alert', c: 'var(--kb-hp)' },
  vacuna:    { label: 'Vacuna', icon: 'shield', c: 'var(--kb-coin)' },
};

const SALUD_RECORDS_DEMO = [
  { id: 'r1', type: 'consulta', title: 'Chequeo general · Dra. Robles', date: '2026-05-12', detail: 'Todo en orden. Recomendó subir actividad cardiovascular y revisar sueño.', doctor: 'Dra. Robles · Medicina interna' },
  { id: 'r2', type: 'receta', title: 'Vitamina D 2000 UI', date: '2026-05-12', detail: '1 cápsula diaria por 3 meses. Renovar en agosto.', doctor: 'Dra. Robles' },
  { id: 'r3', type: 'estudio', title: 'Perfil de lípidos', date: '2026-04-28', detail: 'Colesterol total 182, HDL 58, LDL 104. Dentro de rango.', doctor: 'Lab. Chopo' },
  { id: 'r4', type: 'condicion', title: 'Alergia a penicilina', date: '2025-11-02', detail: 'Reacción cutánea. Evitar betalactámicos.', doctor: '', chronic: true },
];

// ── Modal: agregar registro al expediente (alta rápida) ──
function SaludRecordModal({ onClose, onSave }) {
  const [type, setType] = React.useState('consulta');
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [doctor, setDoctor] = React.useState('');
  const [detail, setDetail] = React.useState('');
  const [chronic, setChronic] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const fileRef = React.useRef(null);
  function readFile(f) {
    if (!f) return;
    if (f.type.startsWith('image/')) { const fr = new FileReader(); fr.onload = () => setFile({ name: f.name, img: fr.result }); fr.readAsDataURL(f); }
    else setFile({ name: f.name, img: null });
  }
  return (
    <KBVModal title="Agregar al expediente" sub="Con el título basta para guardar — el resto lo puedes completar después. Desde la app móvil: una foto y listo." onClose={onClose}
      footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!title.trim()}
            onClick={() => { onSave({ id: 'r' + Math.random().toString(36).slice(2, 6), type, title: title.trim(), date, doctor: doctor.trim(), detail: detail.trim(), chronic: type === 'condicion' ? chronic : false, file }); onClose(); }}>
            Guardar <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      <div className="kbv-form-row">
        <label>Tipo de registro</label>
        <div className="salud-type-row">
          {Object.entries(SALUD_RECORD_TYPES).map(([k, t]) => (
            <button key={k} type="button" className={`salud-type ${type === k ? 'on' : ''}`} style={{ '--c': t.c }} onClick={() => setType(k)}>
              <KIcon name={t.icon} size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="kbv-form-grid">
        <div className="kbv-form-row span-2">
          <label>Título *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="p. ej. Chequeo general, Perfil tiroideo, Ibuprofeno 400…" autoFocus />
        </div>
        <div className="kbv-form-row">
          <label>Fecha</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="kbv-form-row">
          <label>Médico / institución</label>
          <input type="text" value={doctor} onChange={(e) => setDoctor(e.target.value)} placeholder="Dr(a). · clínica / lab" />
        </div>
        <div className="kbv-form-row span-2">
          <label>Detalle / indicaciones <span className="kbv-meta" style={{ fontWeight: 400 }}>(opcional)</span></label>
          <textarea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Diagnóstico, indicaciones, dosis, resultados…" />
        </div>
        {type === 'condicion' && (
          <div className="kbv-form-row span-2">
            <label className="salud-chronic-check">
              <input type="checkbox" checked={chronic} onChange={(e) => setChronic(e.target.checked)} />
              Es una condición <strong>crónica / permanente</strong> — mostrarla primero cuando comparta mi expediente
            </label>
          </div>
        )}
        <div className="kbv-form-row span-2">
          <label>Adjuntar receta / estudio <span className="kbv-meta" style={{ fontWeight: 400 }}>(foto o archivo, opcional)</span></label>
          <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => { readFile(e.target.files && e.target.files[0]); e.target.value = ''; }} />
          {file ? (
            <div className="salud-file">
              {file.img ? <img src={file.img} alt="" /> : <span className="sf-doc"><KIcon name="book" size={16} /></span>}
              <span className="sf-name">{file.name}</span>
              <button type="button" onClick={() => setFile(null)}><KIcon name="x" size={13} /></button>
            </div>
          ) : (
            <button type="button" className="salud-file-add" onClick={() => fileRef.current && fileRef.current.click()}>
              <KIcon name="camera" size={14} /> Subir foto o PDF
            </button>
          )}
        </div>
      </div>
    </KBVModal>
  );
}

// ── Modal: detalle de un registro ──
function SaludRecordDetail({ r, onClose, onDelete }) {
  const t = SALUD_RECORD_TYPES[r.type] || {};
  return (
    <KBVModal title={r.title} sub={`${t.label} · ${r.date}${r.doctor ? ' · ' + r.doctor : ''}`} onClose={onClose}
      footer={
        <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => { onDelete(r.id); onClose(); }}><KIcon name="x" size={13} /> Eliminar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={onClose}>Cerrar</button>
        </div>
      }>
      <div className="salud-detail">
        <div className="sd-tags">
          <span className="sd-tag" style={{ '--c': t.c }}><KIcon name={t.icon} size={12} /> {t.label}</span>
          {r.chronic && <span className="sd-tag chronic"><KIcon name="alert" size={12} /> Crónica — visible primero para tu médico</span>}
        </div>
        {r.detail ? <p className="sd-detail">{r.detail}</p> : <p className="sd-detail empty">Sin detalle todavía — agrégalo cuando lo tengas a la mano.</p>}
        {r.file && (
          <div className="sd-file">
            {r.file.img ? <img src={r.file.img} alt="" /> : <span className="sf-doc"><KIcon name="book" size={18} /></span>}
            <span>{r.file.name}</span>
          </div>
        )}
        <div className="sd-meta">
          <span><KIcon name="calendar" size={12} /> {r.date}</span>
          {r.doctor && <span><KIcon name="community" size={12} /> {r.doctor}</span>}
          <span><KIcon name="search" size={12} /> Tu médico puede encontrar este registro al buscar en tu expediente</span>
        </div>
      </div>
    </KBVModal>
  );
}

// ── Modal: compartir expediente con tu médico ──
function ShareExpedienteModal({ records, onClose, onCopied }) {
  const [inc, setInc] = React.useState({ condicion: true, receta: true, estudio: true, vacuna: true, consulta: false });
  const [exp, setExp] = React.useState('7d');
  const count = (k) => records.filter(r => r.type === k).length;
  const code = 'kibo.health/exp/MTO-4K2F';
  return (
    <KBVModal title="Comparte tu expediente con tu médico" sub="Acceso de solo lectura, con caducidad. Tu médico puede BUSCAR en todo el expediente — condiciones crónicas, alergias, medicación — en vez de depender de tu memoria en consulta." onClose={onClose}
      footer={
        <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cerrar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => { onCopied(); onClose(); }}>
            <KIcon name="copy" size={14} /> Copiar enlace
          </button>
        </div>
      }>
      <div className="kbv-form-row">
        <label>Qué incluye el acceso</label>
        <div className="share-opts">
          {Object.entries(SALUD_RECORD_TYPES).map(([k, t]) => (
            <label key={k} className={`share-opt ${inc[k] ? 'on' : ''}`} style={{ '--c': t.c }}>
              <input type="checkbox" checked={!!inc[k]} onChange={(e) => setInc(v => ({ ...v, [k]: e.target.checked }))} />
              <KIcon name={t.icon} size={13} />
              <span className="so-label">{t.label}</span>
              <span className="so-count">{count(k)}</span>
            </label>
          ))}
        </div>
        <span className="kbv-meta" style={{ marginTop: 4 }}>Las condiciones crónicas y alergias se muestran <strong>primero</strong> — es lo que tu médico necesita ver antes que nada.</span>
      </div>
      <div className="kbv-form-row">
        <label>El acceso caduca en</label>
        <div className="kbv-pick-row">
          {[['24h', '24 horas'], ['7d', '7 días'], ['30d', '30 días']].map(([k, l]) => (
            <button key={k} type="button" className={`kbv-pick ${exp === k ? 'on' : ''}`} onClick={() => setExp(k)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="kbv-form-row">
        <label>Enlace de solo lectura</label>
        <div className="share-link">
          <KIcon name="share" size={14} />
          <span className="sl-code">{code}</span>
          <button type="button" className="kbv-btn kbv-btn-primary" style={{ padding: '7px 12px' }} onClick={() => { onCopied(); }}>
            <KIcon name="copy" size={13} /> Copiar
          </button>
        </div>
      </div>
    </KBVModal>
  );
}

function SaludScreen({ onNavigate }) {
  const [platform, setPlatform] = React.useState('apple');
  const [goals] = React.useState(SALUD_GOALS_DEMO);
  const [records, setRecords] = React.useState(SALUD_RECORDS_DEMO);
  const [recType, setRecType] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [addOpen, setAddOpen] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [detail, setDetail] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  function flash(msg) { setToast(msg); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2600); }
  const platformName = (SALUD_SOURCES.find(s => s.id === platform) || {}).name || '—';

  const q = search.trim().toLowerCase();
  const filtered = records
    .filter(r => recType === 'all' || r.type === recType)
    .filter(r => !q || (r.title + ' ' + r.detail + ' ' + (r.doctor || '') + ' ' + (SALUD_RECORD_TYPES[r.type] || {}).label).toLowerCase().includes(q));
  const sorted = filtered.slice().sort((a, b) => (a.chronic === b.chronic ? (b.date > a.date ? 1 : -1) : a.chronic ? -1 : 1));

  function nav(s) { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: s } })); } catch (_) {} (onNavigate && onNavigate(s)); }
  function navRetos(action) { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'retos', action } })); } catch (_) {} }

  return (
    <div className="kbv-main kbv-salud">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--area-vigor)' }}>Vigor · Cuerpo y salud</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Salud. <InfoDot label="i" text={"Tu expediente médico en un lugar — fácil de alimentar, buscable y compartible con tu médico. Tus metas de salud viven en Retos y se miden solas con tus datos."} /></h1>
        </div>
        <div className="actions">
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setShareOpen(true)}>
            <KIcon name="share" size={14} /> Compartir con mi médico
          </button>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setAddOpen(true)}>
            <KIcon name="plus" size={14} /> Agregar al expediente
          </button>
        </div>
      </div>

      {/* Sincronización — discreta: llega con la app móvil */}
      <div className="salud-sync-banner">
        <span className="ssb-ico"><KIcon name="phone" size={18} /></span>
        <div className="ssb-txt">
          <strong>Sincronización de dispositivos <span className="kbv-tag soon">con la app móvil · próximamente</span></strong>
          <span className="kbv-meta">Los signos vitales se registran solos desde tu teléfono cuando la app esté en las tiendas. Aquí en la web solo ves la plataforma que alimenta tus datos.</span>
        </div>
        <div className="ssb-chips">
          {SALUD_SOURCES.map(s => (
            <button key={s.id} type="button" className={`ssb-chip ${platform === s.id ? 'on' : ''}`} title={s.metrics} onClick={() => { setPlatform(s.id); flash(`${s.name} será tu fuente de datos`); }}>
              {platform === s.id && <KIcon name="check" size={11} />} {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Signos vitales — alimentados por la plataforma elegida */}
      <SectionHead title="Signos vitales y biométricos" meta={`Vía ${platformName} · hoy 08:14`} />
      <div className="kbv-salud-vitals">
        {SALUD_VITALS.map(v => (
          <div key={v.id} className="salud-vital" style={{ '--c': v.c }}>
            <span className="sv-ico"><KIcon name={v.icon} size={15} /></span>
            <span className="sv-v">{v.v}{v.u && <small> {v.u}</small>}</span>
            <span className="sv-l">{v.label}</span>
            <span className="sv-trend">{v.trend}</span>
          </div>
        ))}
      </div>

      {/* EXPEDIENTE MÉDICO — el corazón de la sección */}
      <SectionHead title="Expediente médico" meta="Consultas, recetas, estudios y condiciones · lo crónico va primero">
        <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={() => setShareOpen(true)}><KIcon name="share" size={12} /> Compartir</button>
      </SectionHead>
      <div className="salud-toolbar">
        <div className="kbv-search-box">
          <KIcon name="search" size={15} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Busca en tu expediente — «penicilina», «lípidos», «Dra. Robles»…" />
          {search && <button type="button" onClick={() => setSearch('')} aria-label="Limpiar"><KIcon name="x" size={12} /></button>}
        </div>
        <div className="salud-rec-filters" style={{ margin: 0 }}>
          <button type="button" className={recType === 'all' ? 'on' : ''} onClick={() => setRecType('all')}>Todos ({records.length})</button>
          {Object.entries(SALUD_RECORD_TYPES).map(([k, t]) => {
            const n = records.filter(r => r.type === k).length;
            return <button key={k} type="button" className={recType === k ? 'on' : ''} onClick={() => setRecType(k)}>{t.label} ({n})</button>;
          })}
        </div>
      </div>
      <div className="kbv-salud-records">
        {sorted.length === 0 ? (
          <EmptyState compact icon={q ? 'search' : 'book'} title={q ? 'Sin coincidencias' : 'Sin registros'} body={q ? `Nada en tu expediente para «${search.trim()}».` : 'Agrega consultas, recetas y estudios para tenerlos a la mano.'} />
        ) : sorted.map(r => {
          const t = SALUD_RECORD_TYPES[r.type] || {};
          return (
            <button key={r.id} type="button" className="salud-record clickable" style={{ '--c': t.c }} onClick={() => setDetail(r)} title="Ver detalle">
              <span className="sr-ico"><KIcon name={t.icon} size={16} /></span>
              <div className="sr-body">
                <div className="sr-top">
                  <span className="sr-type">{t.label}</span>
                  {r.chronic && <span className="sr-chronic">Crónica</span>}
                  <span className="sr-date">{r.date}</span>
                </div>
                <span className="sr-title">{r.title}</span>
                {r.detail && <span className="sr-detail">{r.detail}</span>}
                {r.doctor && <span className="sr-doctor"><KIcon name="community" size={10} /> {r.doctor}</span>}
                {r.file && (
                  <span className="sr-file">{r.file.img ? <img src={r.file.img} alt="" /> : <KIcon name="book" size={12} />} {r.file.name}</span>
                )}
              </div>
              <span className="sr-open"><KIcon name="eye" size={13} /></span>
            </button>
          );
        })}
      </div>

      {/* METAS DE SALUD — son retos; aquí se miden contra tus datos */}
      <SectionHead title="Metas de salud" meta={`Son retos — se miden solas con tus datos de ${platformName}`} action="Gestionar en Retos" onAction={() => nav('retos')} />
      <div className="kbv-retos-grid salud-metas">
        {goals.map(g => {
          const pct = g.down
            ? Math.max(0, Math.min(100, Math.round((1 - (g.cur - g.target) / Math.max(1, g.cur)) * 100)))
            : Math.max(0, Math.min(100, Math.round((g.cur / g.target) * 100)));
          return (
            <div key={g.id} className="kbv-reto-card active salud-meta" style={{ '--c': g.c, '--area-c': g.c }}>
              <div className="top">
                <div className="diff" style={{ background: g.c }}>
                  <KIcon name={g.icon} size={13} />
                  <span>{g.kind}</span>
                </div>
                <span className="kbv-meta">se mide sola</span>
              </div>
              <h4 className="name">{g.name}</h4>
              <div className="kind-strip">
                <span className="kind-pip"><KIcon name="vigor" size={11} /> Vigor</span>
                <span className="kind-pip period"><KIcon name="repeat" size={10} /> continua</span>
                <span className="kind-pip"><KIcon name="phone" size={10} /> {platformName}</span>
              </div>
              <div className="progress-row">
                <div className="kbv-progress" style={{ height: 8 }}>
                  <div className="fill" style={{ width: `${pct}%`, background: g.c }} />
                </div>
                <span className="pct">{pct}%</span>
              </div>
              <div className="stats">
                <span>Ahora <strong>{g.cur}{g.unit}</strong></span>
                <span>Meta <strong>{g.target}{g.unit}</strong></span>
                <span className="xp"><KIcon name="trending-up" size={11} /> +{g.xp} XP</span>
              </div>
            </div>
          );
        })}
        <button type="button" className="kbv-reto-add-card salud" onClick={() => navRetos('create')}>
          <span className="glyph"><KIcon name="plus" size={22} /></span>
          <span className="lbl">Nueva meta de salud</span>
          <span className="sub">Se crea como reto en la sección Retos — aquí la verás medirse contra tus datos.</span>
        </button>
      </div>

      {addOpen && <SaludRecordModal onClose={() => setAddOpen(false)} onSave={(rec) => { setRecords(rs => [rec, ...rs]); flash('Registro guardado en tu expediente'); }} />}
      {detail && <SaludRecordDetail r={detail} onClose={() => setDetail(null)} onDelete={(id) => { setRecords(rs => rs.filter(x => x.id !== id)); flash('Registro eliminado'); }} />}
      {shareOpen && <ShareExpedienteModal records={records} onClose={() => setShareOpen(false)} onCopied={() => flash('Enlace copiado — caduca solo y es de solo lectura')} />}
      {toast && <div className="kbv-social-toast"><KIcon name="check" size={14} /> {toast}</div>}
    </div>
  );
}

Object.assign(window, { SaludScreen, SaludRecordModal, SaludRecordDetail, ShareExpedienteModal });
