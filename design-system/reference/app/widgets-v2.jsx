// widgets-v2.jsx — Dashboard widgets (modular, reorderable)

// ─────────────────────────────────────────────────────────────
// Widget shell — handles drag/customize chrome
// ─────────────────────────────────────────────────────────────
function Widget({ id, editing, dragHandlers, onRemove, children }) {
  return (
    <div
      className={`kbv-widget ${editing ? 'editable' : ''}`}
      draggable={editing}
      onDragStart={dragHandlers?.onDragStart}
      onDragOver={dragHandlers?.onDragOver}
      onDrop={dragHandlers?.onDrop}
      onDragEnd={dragHandlers?.onDragEnd}
      data-widget-id={id}
    >
      {children}
      <div className="kbv-widget-controls">
        <button type="button" title="Mover" style={{ cursor: 'grab' }}>
          <KIcon name="grip" size={14} />
        </button>
        <button type="button" className="danger" onClick={onRemove} title="Quitar del dashboard">
          <KIcon name="x" size={14} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Kibo coach card
// ─────────────────────────────────────────────────────────────
function CoachWidget({ w = 1, h = 1, message, mood = 'happy' }) {
  const msg = message || 'Empieza por lo Urgente. Cuando termines una tarea recibes XP del área correspondiente.';
  const extended = w >= 4;
  if (!extended) {
    return (
      <div className="kbv-coach compact">
        <KiboMascot size={40} mood={mood} />
        <div className="msg">
          <span className="from">Kibo · IA</span>
          <span className="body-txt">{msg}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="kbv-coach extended">
      <div className="coach-main">
        <KiboMascot size={56} mood={mood} />
        <div className="msg">
          <span className="from">Kibo · coach IA</span>
          <span className="body-txt">{msg}</span>
        </div>
      </div>
      <div className="coach-tips">
        <div className="tip"><KIcon name="flame" size={13} /> Te faltan 2 hábitos para mantener tu racha.</div>
        <div className="tip"><KIcon name="sword" size={13} /> Tu reto va al 64% — vas bien, no aflojes hoy.</div>
        <div className="tip"><KIcon name="wealth" size={13} /> Sugerencia: registra el gasto de hoy antes de dormir.</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Racha widget
// ─────────────────────────────────────────────────────────────
function StreakWidget({ w = 1, h = 1 }) {
  const days = 23;
  const tier = getFlameTier(days);
  const next = getNextFlameTier(days);
  const extended = w >= 4;
  if (!extended) {
    return (
      <div className="kbv-side-card streak-compact" style={{ '--flame-c': tier.color }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 40, height: 40, borderRadius: 10,
            background: `radial-gradient(circle at center, color-mix(in oklab, ${tier.color} 30%, var(--kb-canvas)), color-mix(in oklab, ${tier.color} 8%, var(--kb-canvas)))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <FlameSVG size={24} tierColor={tier.color} />
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
            <span className="kbv-num" style={{ fontSize: 26, color: tier.color, lineHeight: 1 }}>{days}</span>
            <span style={{ fontSize: 11, color: 'var(--kb-text-2)', fontWeight: 600 }}>días de racha</span>
          </div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--kb-text-2)', marginTop: 'auto' }}>
          <ShieldSVG size={11} active /> 1/2 protectores
        </span>
      </div>
    );
  }
  return (
    <div className="kbv-side-card" style={{ '--flame-c': tier.color }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="kbv-h4">Racha global</h3>
        <span className="kbv-tag" style={{ background: `color-mix(in oklab, ${tier.color} 14%, var(--kb-canvas))`, color: tier.color }}>
          Llama {tier.name}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 48, height: 48, borderRadius: 12,
          background: `radial-gradient(circle at center, color-mix(in oklab, ${tier.color} 30%, var(--kb-canvas)), color-mix(in oklab, ${tier.color} 8%, var(--kb-canvas)))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 0 2px var(--kb-canvas), 0 0 14px color-mix(in oklab, ${tier.color} 50%, transparent)`,
        }}>
          <FlameSVG size={28} tierColor={tier.color} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span className="kbv-num" style={{ fontSize: 32, color: tier.color, lineHeight: 1 }}>{days}</span>
          <span style={{ fontSize: 12, color: 'var(--kb-text-2)', fontWeight: 600, marginTop: 2 }}>días seguidos</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, padding: '8px 0', borderTop: '1px solid var(--kb-border-soft)' }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 18, borderRadius: 4,
            background: i < 12 ? tier.color : i === 12 ? `color-mix(in oklab, ${tier.color} 30%, var(--kb-canvas))` : 'var(--kb-surface-2)',
            opacity: i < 12 ? 0.5 + i * 0.04 : 1,
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--kb-text-2)', alignItems: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <ShieldSVG size={12} active={true} />
          Protectores: <strong style={{ color: 'var(--kb-text)' }}>1/2</strong>
        </span>
        <span>{next ? `Faltan ${next.days - days}d para ${next.name}` : 'Llama final'}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Economía widget
// ─────────────────────────────────────────────────────────────
function EconomyWidget({ w = 1, h = 1 }) {
  const extended = w >= 4;
  const txns = [
    { id: 't1', label: 'Hábitos completados (3×)', amt: '+25', kind: 'coin', dir: 'up' },
    { id: 't2', label: 'Sesión de lectura', amt: '+60', kind: 'coin', dir: 'up' },
    { id: 't3', label: 'Recompensa: Cena italiana', amt: '−120', kind: 'coin', dir: 'down' },
    { id: 't4', label: 'Reto completado · fragmentos', amt: '+40', kind: 'gem', dir: 'up' },
    { id: 't5', label: 'Tarea cerrada · alta', amt: '+80', kind: 'coin', dir: 'up' },
  ];
  if (!extended) {
    return (
      <div className="kbv-side-card economy-compact">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h3 className="kbv-h4">Bolsa</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--kb-coin-ink)' }}><CoinIcon size={14} /> Monedas</span>
            <span className="kbv-num" style={{ fontSize: 18, color: 'var(--kb-coin-ink)' }}>1,245</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--kb-gem-ink)' }}><GemIcon size={14} /> Materia oscura</span>
            <span className="kbv-num" style={{ fontSize: 18, color: 'var(--kb-gem-ink)' }}>5,340</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="kbv-side-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="kbv-h4">Bolsa</h3>
        <span className="kbv-meta">Últimos movimientos</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ padding: 10, background: 'rgba(244, 183, 64, 0.10)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--kb-coin-ink)', letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: 4 }}><CoinIcon size={12} /> MONEDAS</span>
          <span className="kbv-num" style={{ fontSize: 22, color: 'var(--kb-coin-ink)' }}>1,245</span>
        </div>
        <div style={{ padding: 10, background: 'rgba(110, 140, 242, 0.10)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--kb-gem-ink)', letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: 4 }}><GemIcon size={12} /> MATERIA OSCURA</span>
          <span className="kbv-num" style={{ fontSize: 22, color: 'var(--kb-gem-ink)' }}>5,340</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
        {txns.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderTop: '1px solid var(--kb-border-soft)', fontSize: 12 }}>
            <span style={{ color: 'var(--kb-text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.label}</span>
            <span style={{ fontFamily: 'var(--kb-f-mono)', fontWeight: 800, color: t.dir === 'up' ? 'var(--kb-good)' : 'var(--kb-hp-ink)', display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              {t.amt} {t.kind === 'coin' ? <CoinIcon size={10} /> : <GemIcon size={10} />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Diario widget (mood + photo + prompts)
// ─────────────────────────────────────────────────────────────
const MOOD_OPTIONS = [
  { id: 'great', label: 'Genial', icon: 'mood-great', color: 'var(--kb-primary)' },
  { id: 'good',  label: 'Bien',   icon: 'mood-good',  color: 'var(--kb-good-soft)' },
  { id: 'meh',   label: 'Regular',icon: 'mood-meh',   color: 'var(--kb-coin)' },
  { id: 'low',   label: 'Bajón',  icon: 'mood-low',   color: 'var(--pri-high)' },
  { id: 'sad',   label: 'Mal',    icon: 'mood-sad',   color: 'var(--kb-hp)' },
];

const DAILY_PROMPTS = [
  'Algo que aprendí hoy y quiero recordar:',
  '¿Qué me dio energía hoy? ¿Qué me la quitó?',
  'Una persona a la que le agradezco algo hoy:',
  'Si pudiera repetir el día, ¿qué cambiaría?',
  '¿Qué pequeña victoria celebro hoy?',
];

function DiarioWidget({ w = 1, h = 1 }) {
  const [mood, setMood] = React.useState('good');
  const [text, setText] = React.useState('');
  const [transcribing, setTranscribing] = React.useState(false);

  React.useEffect(() => {
    if (!transcribing) return;
    const phrases = [
      ' Hoy fue un día denso pero salió bien la propuesta de Aurora.',
      ' Sentí algo de cansancio en la tarde pero retomé después de caminar 10 minutos.',
      ' Lo que me llevo es que necesito bloquear mejor mis mañanas.',
    ];
    let i = 0;
    const id = setInterval(() => {
      if (i >= phrases.length) { setTranscribing(false); clearInterval(id); return; }
      setText(t => t + phrases[i++]);
    }, 900);
    return () => clearInterval(id);
  }, [transcribing]);

  const extended = w >= 4;

  // Compact 1×1 — mood + transcription + photo, no big textarea
  if (!extended) {
    return (
      <div className="kbv-diario compact">
        <div className="head">
          <h3 className="kbv-h4" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <KIcon name="edit" size={15} style={{ color: 'var(--kb-primary)' }} /> Diario
          </h3>
        </div>
        <div className="kbv-mood-row">
          {MOOD_OPTIONS.map(m => (
            <button key={m.id} type="button" className={`kbv-mood ${mood === m.id ? 'active' : ''}`}
                    style={{ '--m-color': m.color }} onClick={() => setMood(m.id)}>
              <KIcon name={m.icon} size={20} />
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
          <button type="button" className={`kbv-voice-btn ${transcribing ? 'recording' : ''}`} style={{ flex: 1 }}
                  onClick={() => setTranscribing(t => !t)}>
            <KIcon name={transcribing ? 'square' : 'mic'} size={13} />
            <span>{transcribing ? '…' : 'Dictar'}</span>
          </button>
          <button type="button" className="kbv-icon-btn" title="Foto del día"><KIcon name="camera" size={14} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="kbv-diario">
      <div className="head">
        <div>
          <h3 className="kbv-h4" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <KIcon name="edit" size={16} style={{ color: 'var(--kb-primary)' }} />
            Diario del día
          </h3>
          <span className="kbv-meta" style={{ marginTop: 2, display: 'block' }}>Lun 25 May · No guardado</span>
        </div>
        <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }}>Historial</button>
      </div>

      <div>
        <div className="kbv-label" style={{ marginBottom: 6 }}>¿Cómo te fue hoy?</div>
        <div className="kbv-mood-row">
          {MOOD_OPTIONS.map(m => (
            <button
              key={m.id}
              type="button"
              className={`kbv-mood ${mood === m.id ? 'active' : ''}`}
              style={{ '--m-color': m.color }}
              onClick={() => setMood(m.id)}
            >
              <KIcon name={m.icon} size={24} />
              <span className="lbl">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="kbv-diario-entry">
        <textarea
          className="kbv-diario-text"
          placeholder="Escribe sobre tu día… o usa la transcripción de voz."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="kbv-diario-entry-bar">
          <span className="count">{text.length} caracteres</span>
          <button
            type="button"
            className={`kbv-voice-btn ${transcribing ? 'recording' : ''}`}
            onClick={() => setTranscribing(t => !t)}
            title={transcribing ? 'Detener transcripción' : 'Transcribir voz a texto'}>
            <KIcon name={transcribing ? 'square' : 'mic'} size={14} />
            <span>{transcribing ? 'Transcribiendo…' : 'Transcripción'}</span>
          </button>
        </div>
      </div>

      <div className="kbv-diario-photo" title="Adjuntar foto del día">
        <span className="glyph"><KIcon name="camera" size={20} /></span>
        <div className="label">
          <span className="name">Foto del día</span>
          <span className="sub">Sube una imagen que represente tu día</span>
        </div>
        <KIcon name="plus" size={18} style={{ color: 'var(--kb-text-3)' }} />
      </div>

      <button type="button" className="kbv-btn kbv-btn-primary">
        Guardar entrada
        <KIcon name="check" size={14} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Lectura widget
// ─────────────────────────────────────────────────────────────
function LecturaWidget() {
  const [page, setPage] = React.useState(127);
  const [editing, setEditing] = React.useState(false);
  const [transcribing, setTranscribing] = React.useState(false);
  const total = 320;
  const pct = Math.min(100, Math.max(0, (page / total) * 100));
  return (
    <div className="kbv-lectura">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="kbv-h4" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <KIcon name="book-open" size={16} style={{ color: 'var(--kb-gem)' }} />
          Lectura
        </h3>
        <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }}>Cambiar libro</button>
      </div>

      <div className="kbv-book">
        <div className="kbv-book-cover">ATOMIC<br/>HABITS</div>
        <div className="kbv-book-info">
          <span className="title">Atomic Habits</span>
          <span className="author">James Clear · 320 pp</span>
          <div className="kbv-progress" style={{ marginTop: 'auto' }}>
            <div className="fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="kbv-progress-meta">
            {editing ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="number"
                  min="0"
                  max={total}
                  value={page}
                  autoFocus
                  onChange={(e) => setPage(Math.max(0, Math.min(total, parseInt(e.target.value || '0', 10))))}
                  onBlur={() => setEditing(false)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setEditing(false); }}
                  className="kbv-lectura-page-input" />
                <span style={{ color: 'var(--kb-text-2)' }}>/ {total}</span>
              </span>
            ) : (
              <button
                type="button"
                className="kbv-num kbv-lectura-page-btn"
                onClick={() => setEditing(true)}
                title="Editar página actual">
                {page} / {total}
              </button>
            )}
            <span>{Math.round(pct)}%</span>
          </div>
        </div>
      </div>

      <div className="kbv-lectura-actions">
        <button type="button" className="kbv-btn kbv-btn-primary" style={{ flex: 1 }}>
          <KIcon name="book-open" size={14} /> Iniciar sesión
        </button>
        <button type="button" className="kbv-btn kbv-btn-secondary" style={{ flex: 1 }}>
          <KIcon name="plus" size={14} /> Anotar
        </button>
        <button
          type="button"
          className={`kbv-voice-btn ${transcribing ? 'recording' : ''}`}
          onClick={() => setTranscribing(r => !r)}
          title="Transcribir voz a nota">
          <KIcon name={transcribing ? 'square' : 'mic'} size={14} />
          <span>{transcribing ? 'Transcribiendo…' : 'Transcripción'}</span>
        </button>
      </div>

      <div className="kbv-coach" style={{ background: 'var(--kb-surface)', borderColor: 'var(--kb-border)', padding: 10 }}>
        <KIcon name="sparkle" size={20} style={{ color: 'var(--kb-gem)', flexShrink: 0 }} />
        <div className="msg" style={{ fontSize: 12 }}>
          <span className="from" style={{ color: 'var(--kb-gem-ink)' }}>+15 XP en Sabiduría</span>
          Tus notas se transcriben directamente de voz a texto — sin guardar audio.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Películas/Series widget (Trakt-style)
// ─────────────────────────────────────────────────────────────
function WatchWidget() {
  return (
    <div className="kbv-watch">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="kbv-h4" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <KIcon name="film" size={16} style={{ color: 'var(--kb-media)' }} />
          Películas y series
        </h3>
        <span className="kbv-trakt-tag">via TRAKT.TV</span>
      </div>

      <div className="kbv-watch-row">
        <div className="kbv-poster">SEVERANCE</div>
        <div className="kbv-watch-info">
          <span className="title">Severance</span>
          <span className="ep">T2 · E08 — Sweet Vitriol</span>
          <div className="meta">
            <span style={{
              padding: '2px 8px',
              background: 'rgba(110, 140, 242, 0.12)',
              color: 'var(--kb-gem-ink)',
              borderRadius: 999,
              fontFamily: 'var(--kb-f-mono)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}>VIENDO</span>
            <span>·</span>
            <span>2 episodios pendientes</span>
          </div>
        </div>
      </div>

      <div className="kbv-watch-row" style={{ background: 'var(--kb-card)', border: '1px dashed var(--kb-border-strong)' }}>
        <div className="kbv-poster" style={{ background: 'linear-gradient(135deg, #2D3A45, #131820)' }}>DUNE 2</div>
        <div className="kbv-watch-info">
          <span className="title">Dune: Part Two</span>
          <span className="ep">Película · 2h 46m</span>
          <div className="meta">
            <span style={{
              padding: '2px 8px',
              background: 'rgba(244, 183, 64, 0.16)',
              color: 'var(--kb-coin-ink)',
              borderRadius: 999,
              fontFamily: 'var(--kb-f-mono)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}>PENDIENTE</span>
            <span>·</span>
            <span>Marca como vista al terminar</span>
          </div>
        </div>
      </div>

      <button type="button" className="kbv-btn kbv-btn-secondary" style={{ marginTop: 4 }}>
        <KIcon name="plus" size={14} /> Buscar en Trakt
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Diario sub-widgets — mood, prompt, photo (catalogued so users can mix)
// ─────────────────────────────────────────────────────────────
function MoodPickerWidget() {
  const [mood, setMood] = React.useState('good');
  return (
    <div className="kbv-diario" style={{ padding: 18, minHeight: 'unset' }}>
      <h3 className="kbv-h4" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <KIcon name="mood-good" size={16} style={{ color: 'var(--kb-good-soft)' }} />
        ¿Cómo te fue hoy?
      </h3>
      <div className="kbv-mood-row" style={{ marginTop: 4 }}>
        {MOOD_OPTIONS.map(m => (
          <button key={m.id} type="button"
                  className={`kbv-mood ${mood === m.id ? 'active' : ''}`}
                  style={{ '--m-color': m.color }}
                  onClick={() => setMood(m.id)}>
            <KIcon name={m.icon} size={24} />
            <span className="lbl">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PromptWidget() {
  const prompt = DAILY_PROMPTS[(new Date().getDate()) % DAILY_PROMPTS.length];
  return (
    <div className="kbv-diario" style={{ padding: 18, minHeight: 'unset' }}>
      <h3 className="kbv-h4" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <KIcon name="edit" size={16} style={{ color: 'var(--area-community)' }} />
        Prompt del día
      </h3>
      <div className="kbv-prompt" style={{ marginTop: 4 }}>
        <span style={{ fontSize: 13 }}>“{prompt}”</span>
        <textarea placeholder="Escribe algo..." style={{ minHeight: 80 }} />
      </div>
      <button type="button" className="kbv-btn kbv-btn-primary" style={{ padding: '8px 12px', fontSize: 12 }}>Guardar <KIcon name="check" size={12} /></button>
    </div>
  );
}

function PhotoWidget() {
  return (
    <div className="kbv-diario" style={{ padding: 18, minHeight: 'unset' }}>
      <h3 className="kbv-h4" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <KIcon name="camera" size={16} style={{ color: 'var(--kb-primary)' }} />
        Foto del día
      </h3>
      <div className="kbv-diario-photo" style={{ marginTop: 4 }}>
        <span className="glyph"><KIcon name="camera" size={20} /></span>
        <div className="label">
          <span className="name">Sube una imagen</span>
          <span className="sub">Algo que represente tu día</span>
        </div>
        <KIcon name="plus" size={18} style={{ color: 'var(--kb-text-3)' }} />
      </div>
    </div>
  );
}

function WeekMoodWidget() {
  // mini bar version
  const days = ['L','M','X','J','V','S','D'];
  const colors = ['var(--kb-good-soft)','var(--kb-primary)','var(--kb-coin)','var(--kb-good-soft)','var(--pri-high)','var(--kb-primary)','var(--kb-primary)'];
  return (
    <div className="kbv-side-card">
      <h3 className="kbv-h4">Mood de la semana</h3>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 72 }}>
        {days.map((d, i) => (
          <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', height: 8 + (i*5) % 30 + 20, background: colors[i], borderRadius: 4 }} />
            <span style={{ fontFamily: 'var(--kb-f-mono)', fontSize: 10, fontWeight: 700, color: 'var(--kb-text-2)' }}>{d}</span>
          </div>
        ))}
      </div>
      <span className="kbv-meta">Predomina <strong style={{ color: 'var(--kb-text)' }}>Bien</strong> esta semana.</span>
    </div>
  );
}

function GratitudeWidget() {
  return (
    <div className="kbv-side-card">
      <h3 className="kbv-h4" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <KIcon name="sparkle" size={16} style={{ color: 'var(--area-community)' }} />
        Hoy agradezco
      </h3>
      <textarea placeholder="Una persona, un momento, algo pequeño..." style={{
        border: '1.5px solid var(--kb-border)', borderRadius: 10, padding: 10, minHeight: 60,
        fontFamily: 'var(--kb-f-body)', fontSize: 13, color: 'var(--kb-text)', outline: 'none', resize: 'vertical',
      }} />
      <span className="kbv-meta">3 entradas de gratitud esta semana</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Videojuegos widget (Trakt-style for games)
// ─────────────────────────────────────────────────────────────
function GamesWidget() {
  return (
    <div className="kbv-watch">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="kbv-h4" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <KIcon name="sword" size={16} style={{ color: 'var(--area-community)' }} />
          Videojuegos
        </h3>
        <span className="kbv-trakt-tag" style={{ background: 'rgba(168,85,247,0.12)', color: 'var(--kb-community-ink)' }}>via HLTB</span>
      </div>

      <div className="kbv-watch-row">
        <div className="kbv-poster" style={{ background: 'linear-gradient(135deg, #1A4D2E, #0F2E1A)' }}>HOLLOW<br/>KNIGHT</div>
        <div className="kbv-watch-info">
          <span className="title">Hollow Knight</span>
          <span className="ep">42% completado · 18h jugadas</span>
          <div className="meta">
            <span style={{ padding: '2px 8px', background: 'var(--kb-community-soft)', color: 'var(--kb-community-ink)', borderRadius: 999, fontFamily: 'var(--kb-f-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}>JUGANDO</span>
            <span>·</span>
            <span>main story ~25h restantes</span>
          </div>
        </div>
      </div>

      <div className="kbv-watch-row" style={{ background: 'var(--kb-card)', border: '1px dashed var(--kb-border-strong)' }}>
        <div className="kbv-poster" style={{ background: 'linear-gradient(135deg, #6B2D2D, #3E1010)' }}>BG3</div>
        <div className="kbv-watch-info">
          <span className="title">Baldur's Gate 3</span>
          <span className="ep">Acto 1 · 12h jugadas</span>
          <div className="meta">
            <span style={{ padding: '2px 8px', background: 'rgba(244,183,64,0.16)', color: 'var(--kb-coin-ink)', borderRadius: 999, fontFamily: 'var(--kb-f-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}>EN PAUSA</span>
            <span>·</span>
            <span>volver pronto</span>
          </div>
        </div>
      </div>

      <button type="button" className="kbv-btn kbv-btn-secondary" style={{ marginTop: 4 }}>
        <KIcon name="plus" size={14} /> Agregar juego
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Finance sub-widgets — composable, addable to dashboard
// ─────────────────────────────────────────────────────────────
function FinanceBalanceWidget() {
  return (
    <div className="kbv-side-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="kbv-h4">Balance total</h3>
        <span className="kbv-meta">3 cuentas</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="kbv-num" style={{ fontSize: 26, color: 'var(--kb-text)' }}>$72,420</span>
        <span style={{ fontSize: 11, color: 'var(--kb-text-2)', fontWeight: 600 }}>MXN</span>
      </div>
      <div className="kbv-stack-8" style={{ marginTop: 6 }}>
        {[
          { name: 'BBVA · Débito',  amt: 18420, c: '#0040A8' },
          { name: 'Nu · Ahorro',     amt: 48200, c: '#820AD1' },
          { name: 'Efectivo',        amt: 5800,  c: 'var(--kb-primary)' },
        ].map(a => (
          <div key={a.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: a.c }} />
              <span style={{ color: 'var(--kb-text)', fontWeight: 600 }}>{a.name}</span>
            </span>
            <span style={{ fontFamily: 'var(--kb-f-mono)', fontWeight: 700, color: 'var(--kb-text)' }}>
              ${a.amt.toLocaleString('es-MX')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceExpensesWidget() {
  return (
    <div className="kbv-side-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="kbv-h4">Gastos recientes</h3>
        <span className="kbv-meta">Últimos 7 días</span>
      </div>
      <div className="kbv-stack-8">
        {[
          { name: 'Supermercado',  cat: 'Comida',    amt: 1240, ico: 'shop',  c: 'var(--pri-high)' },
          { name: 'Uber',          cat: 'Transporte',amt: 380,  ico: 'film',  c: 'var(--kb-gem)' },
          { name: 'Netflix',       cat: 'Subs',      amt: 219,  ico: 'film',  c: 'var(--area-community)' },
          { name: 'Café',          cat: 'Comida',    amt: 120,  ico: 'shop',  c: 'var(--pri-high)' },
        ].map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < 3 ? '1px solid var(--kb-border-soft)' : 'none' }}>
            <span style={{
              width: 24, height: 24, borderRadius: 7,
              background: `color-mix(in oklab, ${e.c} 14%, var(--kb-canvas))`,
              color: e.c, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <KIcon name={e.ico} size={12} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--kb-text)' }}>{e.name}</div>
              <div style={{ fontSize: 10, color: 'var(--kb-text-2)' }}>{e.cat}</div>
            </div>
            <span style={{ fontFamily: 'var(--kb-f-mono)', fontWeight: 700, fontSize: 12, color: 'var(--kb-hp)' }}>
              -${e.amt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceBudgetWidget() {
  const items = [
    { name: 'Casa',         used: 12500, limit: 13000, c: 'var(--kb-hp)' },
    { name: 'Comida',       used: 3960,  limit: 5000,  c: 'var(--pri-high)' },
    { name: 'Transporte',   used: 1240,  limit: 1500,  c: 'var(--kb-gem)' },
    { name: 'Ocio',         used: 1380,  limit: 1200,  c: 'var(--kb-coin)' },
  ];
  return (
    <div className="kbv-side-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="kbv-h4">Presupuesto · Mayo</h3>
        <span className="kbv-meta">75% gastado</span>
      </div>
      <div className="kbv-stack-8">
        {items.map(i => {
          const pct = Math.min(100, (i.used / i.limit) * 100);
          const over = i.used > i.limit;
          return (
            <div key={i.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                <span style={{ fontWeight: 700, color: 'var(--kb-text)' }}>{i.name}</span>
                <span style={{ fontFamily: 'var(--kb-f-mono)', color: over ? 'var(--kb-hp)' : 'var(--kb-text-2)', fontWeight: 700 }}>
                  ${i.used.toLocaleString('es-MX')} / ${i.limit.toLocaleString('es-MX')}
                </span>
              </div>
              <div style={{ height: 6, background: 'var(--kb-surface-2)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: over ? 'var(--kb-hp)' : i.c, borderRadius: 999 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Today highlight — quick stats card (top-right of dashboard)
// ─────────────────────────────────────────────────────────────
function TodayHighlightWidget({ habitsDone, habitsTotal, tasksDone, tasksTotal }) {
  return (
    <div className="kbv-side-card">
      <h3 className="kbv-h4">Cómo vas hoy</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ padding: 12, background: 'var(--kb-surface)', borderRadius: 10 }}>
          <div className="kbv-meta" style={{ fontWeight: 700, letterSpacing: '0.08em' }}>HÁBITOS</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span className="kbv-num" style={{ fontSize: 22, color: 'var(--kb-streak)' }}>{habitsDone}</span>
            <span style={{ fontSize: 12, color: 'var(--kb-text-2)' }}>/ {habitsTotal}</span>
          </div>
        </div>
        <div style={{ padding: 12, background: 'var(--kb-surface)', borderRadius: 10 }}>
          <div className="kbv-meta" style={{ fontWeight: 700, letterSpacing: '0.08em' }}>TAREAS</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span className="kbv-num" style={{ fontSize: 22, color: 'var(--kb-primary)' }}>{tasksDone}</span>
            <span style={{ fontSize: 12, color: 'var(--kb-text-2)' }}>/ {tasksTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Widget registry (used by gallery + customize mode)
// Each widget defines:
//   sizes:    array of [w, h] allowed combinations (all widgets must support [1,1] minimum + 1 vertical or horizontal 1×2/2×1)
//   defaultW, defaultH: default placement
//   category: section in the gallery
// ─────────────────────────────────────────────────────────────
const WIDGET_REGISTRY = {
  coach:        { id: 'coach',        name: 'Kibo coach',         desc: 'Mensajes contextuales del mascot (IA + tus prioridades).',  icon: 'sparkle',   cost: 'free',          sizes: [[1,1],[4,2]],                  defaultW: 1, defaultH: 1, category: 'today' },
  streak:       { id: 'streak',       name: 'Racha global',       desc: 'Días seguidos + protectores + récord histórico.',          icon: 'flame',     cost: 'free',          sizes: [[1,1],[4,2]],            defaultW: 1, defaultH: 1, category: 'today' },
  economy:      { id: 'economy',      name: 'Bolsa',              desc: 'Monedas y fragmentos. Versión grande: transacciones recientes.', icon: 'shop',      cost: 'free',          sizes: [[1,1],[4,2]],            defaultW: 1, defaultH: 1, category: 'today' },
  diario:       { id: 'diario',       name: 'Diario del día',     desc: 'Mood, foto y transcripción. Tamaño varía la captura.',     icon: 'edit',      cost: 'free',          sizes: [[1,1],[4,2]],      defaultW: 1, defaultH: 1, category: 'diario' },
  moodPicker:   { id: 'moodPicker',   name: 'Solo mood',          desc: 'Marca cómo te fue hoy con un toque.',                       icon: 'mood-good', cost: 'free',          sizes: [[1,1],[4,2]],                  defaultW: 1, defaultH: 1, category: 'diario' },
  prompt:       { id: 'prompt',       name: 'Prompt diario',      desc: 'Una pregunta dirigida + caja para responder.',              icon: 'edit',      cost: 'free',          sizes: [[1,1],[4,2]],            defaultW: 1, defaultH: 1, category: 'diario' },
  photo:        { id: 'photo',        name: 'Foto del día',       desc: 'Sube una imagen que represente tu día.',                    icon: 'camera',    cost: 'free',          sizes: [[1,1],[4,2]],                  defaultW: 1, defaultH: 1, category: 'diario' },
  weekMood:     { id: 'weekMood',     name: 'Mood semanal',       desc: 'Mini gráfico de tu mood a lo largo de la semana.',           icon: 'mood-good', cost: 'free',          sizes: [[1,1],[4,2]],                  defaultW: 1, defaultH: 1, category: 'diario' },
  gratitude:    { id: 'gratitude',    name: 'Gratitud',           desc: 'Una entrada rápida de algo que agradeces hoy.',              icon: 'sparkle',   cost: 'free',          sizes: [[1,1],[4,2]],            defaultW: 1, defaultH: 1, category: 'diario' },
  lectura:      { id: 'lectura',      name: 'Lectura activa',     desc: 'Libro actual + acciones. Grande: notas y citas.',           icon: 'book-open', cost: 'free',          sizes: [[1,1],[4,2]],            defaultW: 1, defaultH: 1, category: 'lectura' },
  watch:        { id: 'watch',        name: 'Pelis y series',     desc: 'Siguiente episodio + sync Trakt.tv.',                       icon: 'film',      cost: 'free',          sizes: [[1,1],[4,2]],            defaultW: 1, defaultH: 1, category: 'entretenimiento' },
  highlight:    { id: 'highlight',    name: 'Cómo vas hoy',       desc: 'Contadores rápidos de hábitos y tareas.',                   icon: 'home',      cost: 'free',          sizes: [[1,1],[4,2]],                        defaultW: 1, defaultH: 1, category: 'today' },
  games:        { id: 'games',        name: 'Videojuegos',        desc: 'Tracking de juegos por jugar y terminar.',                  icon: 'sword',     cost: 'free',          sizes: [[1,1],[4,2]],                  defaultW: 1, defaultH: 1, category: 'entretenimiento' },
  financeBalance:  { id: 'financeBalance',  name: 'Balance total',      desc: 'Suma de tus cuentas con desglose por banco.',         icon: 'wealth',    cost: 'free',          sizes: [[1,1],[4,2]],                  defaultW: 1, defaultH: 1, category: 'finance' },
  financeExpenses: { id: 'financeExpenses', name: 'Gastos recientes',   desc: 'Últimos movimientos por categoría.',                   icon: 'shop',      cost: 'free',          sizes: [[1,1],[4,2]],            defaultW: 1, defaultH: 1, category: 'finance' },
  financeBudget:   { id: 'financeBudget',   name: 'Presupuesto del mes',desc: 'Cómo vas vs lo planeado por categoría.',               icon: 'layers',    cost: 'free',          sizes: [[1,1],[4,2]],            defaultW: 1, defaultH: 1, category: 'finance' },
  // Future / paid (marketplace tie-in)
  bossPanel:    { id: 'bossPanel',    name: 'Panel de combate',   desc: 'Métricas de reto avanzadas y log de daño.',                 icon: 'sword',     cost: '200 fragmentos',     sizes: [[1,1],[4,2]],            defaultW: 1, defaultH: 1, locked: true, category: 'today' },
  weather:      { id: 'weather',      name: 'Clima del día',      desc: 'Pronóstico y sugerencias de hábitos según el clima.',        icon: 'calendar',  cost: '600 monedas',   sizes: [[1,1],[4,2]],                  defaultW: 1, defaultH: 1, locked: true, category: 'today' },
  goals:        { id: 'goals',        name: 'Metas trimestrales', desc: 'Objetivos de largo plazo con progreso visual.',              icon: 'layers',    cost: '300 monedas',   sizes: [[1,1],[4,2]],                  defaultW: 1, defaultH: 1, locked: true, category: 'today' },
};

const WIDGET_COMPONENTS = {
  coach:        ({ w, h }) => <CoachWidget w={w} h={h} />,
  streak:       ({ w, h }) => <StreakWidget w={w} h={h} />,
  economy:      ({ w, h }) => <EconomyWidget w={w} h={h} />,
  diario:       ({ w, h }) => <DiarioWidget w={w} h={h} />,
  moodPicker:   ({ w, h }) => <MoodPickerWidget w={w} h={h} />,
  prompt:       ({ w, h }) => <PromptWidget w={w} h={h} />,
  photo:        ({ w, h }) => <PhotoWidget w={w} h={h} />,
  weekMood:     ({ w, h }) => <WeekMoodWidget w={w} h={h} />,
  gratitude:    ({ w, h }) => <GratitudeWidget w={w} h={h} />,
  lectura:      ({ w, h }) => <LecturaWidget w={w} h={h} />,
  watch:        ({ w, h }) => <WatchWidget w={w} h={h} />,
  games:        ({ w, h }) => <GamesWidget w={w} h={h} />,
  financeBalance:  ({ w, h }) => <FinanceBalanceWidget w={w} h={h} />,
  financeExpenses: ({ w, h }) => <FinanceExpensesWidget w={w} h={h} />,
  financeBudget:   ({ w, h }) => <FinanceBudgetWidget w={w} h={h} />,
  highlight:    ({ ctx, w, h }) => <TodayHighlightWidget {...ctx} w={w} h={h} />,
};

Object.assign(window, {
  Widget, CoachWidget, StreakWidget, EconomyWidget,
  DiarioWidget, LecturaWidget, WatchWidget, TodayHighlightWidget,
  MoodPickerWidget, PromptWidget, PhotoWidget, WeekMoodWidget, GratitudeWidget,
  GamesWidget, FinanceBalanceWidget, FinanceExpensesWidget, FinanceBudgetWidget,
  WIDGET_REGISTRY, WIDGET_COMPONENTS, MOOD_OPTIONS, DAILY_PROMPTS,
});
