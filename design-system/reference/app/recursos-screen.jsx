// recursos-screen.jsx — LA BÓVEDA: el archivo de tu vida en Markdown plano.
//
// El giro respecto a «Bóveda»: la bóveda no es una libreta más, es el
// REGISTRO de lo que haces. Cada acción en un módulo (marcar un hábito, cerrar
// un reto, registrar un gasto, terminar un libro) hace que Kibo escriba o
// actualice un .md con frontmatter, tags y [[enlaces]]. Esa carpeta se
// sincroniza con Drive, OneDrive o una carpeta local, y la puede leer
// cualquier IA — o el propio Obsidian — sin conversión.

const VAULT_DEST = [
  { id: 'drive',    name: 'Google Drive',  icon: 'upload', hint: 'Kibo/Bóveda' },
  { id: 'onedrive', name: 'OneDrive',      icon: 'upload', hint: 'Documentos/Kibo' },
  { id: 'local',    name: 'Carpeta local', icon: 'home',   hint: '~/Kibo/Bóveda' },
];

// Las carpetas SON los módulos: así el archivo espeja la plataforma.
const VAULT_FOLDERS = [
  { id: 'Hábitos',   icon: 'flame',      color: 'var(--kb-streak)',     auto: true,  pat: 'habitos/2026-05-12.md' },
  { id: 'Retos',     icon: 'sword',      color: 'var(--kb-hp)',         auto: true,  pat: 'retos/<reto>.md' },
  { id: 'Diario',    icon: 'edit',       color: 'var(--area-community)',auto: true,  pat: 'diario/2026-05-12.md' },
  { id: 'Finanzas',  icon: 'wealth',     color: 'var(--kb-coin)',       auto: true,  pat: 'finanzas/2026-05.md' },
  { id: 'Lectura',   icon: 'book-open',  color: 'var(--kb-gem)',        auto: true,  pat: 'lectura/<libro>.md' },
  { id: 'Estudio',   icon: 'graduation', color: 'var(--area-wisdom)',   auto: false, pat: 'estudio/<materia>.md' },
  { id: 'Notas',     icon: 'book',       color: 'var(--kb-primary)',    auto: false, pat: 'notas/<título>.md' },
];

const VAULT_NOTES = [
  { id: 'n1', title: '2026-05-12', folder: 'Hábitos', tags: ['hábitos', 'racha'], auto: true,
    updated: 'hoy · 9:14', words: 120, links: ['n3'], fav: true,
    front: { tipo: 'registro-diario', modulo: 'habitos', fecha: '2026-05-12', racha: 88, completados: '4/5' },
    body: 'Completados **4 de 5** hábitos. Racha global en 88 días.\n\n- [x] Meditar 10 min · 7:05\n- [x] Leer 20 min · 22:30\n- [x] Sin azúcar\n- [x] Salir a correr · 6:40\n- [ ] Escribir 300 palabras\n\nEl que falló arrastra desde el martes — ver [[Sistema de rachas]].' },
  { id: 'n2', title: 'Maratón de lectura', folder: 'Retos', tags: ['reto', 'dificultad-4'], auto: true,
    updated: 'hoy · 8:02', words: 260, links: ['n5'],
    front: { tipo: 'reto', modulo: 'retos', dificultad: 4, inicio: '2026-04-01', fin: '2026-06-30', estado: 'activo' },
    body: 'Día 42 de 90. Fallos usados: 3 de 18.\n\n> Hoy costó, pero 25 páginas antes de dormir.\n\nLibro en curso: [[Hábitos atómicos]].' },
  { id: 'n3', title: 'Sistema de rachas', folder: 'Notas', tags: ['diseño', 'kibo'],
    updated: 'hace 3 días', words: 640, links: ['n1'],
    front: { tipo: 'nota', modulo: 'notas', creado: '2026-05-09' },
    body: 'La racha castiga la ausencia, no el error — por eso existen protectores y días sabáticos.\n\nRegla: **el fracaso reencauza**.' },
  { id: 'n4', title: '2026-05', folder: 'Finanzas', tags: ['finanzas', 'mensual'], auto: true,
    updated: 'ayer', words: 340, links: [],
    front: { tipo: 'resumen-mensual', modulo: 'finanzas', mes: '2026-05', ingresos: 42800, gastos: 31240, ahorro: 11560 },
    body: 'Ahorro del mes: **$11,560** (27% del ingreso).\n\n| Categoría | Gasto |\n|---|---|\n| Casa | $12,400 |\n| Comida | $7,890 |\n| Transporte | $3,100 |\n\nGasto hormiga detectado en cafeterías: $1,840.' },
  { id: 'n5', title: 'Hábitos atómicos', folder: 'Lectura', tags: ['libros', 'hábitos'], auto: true,
    updated: 'hace 2 días', words: 480, links: ['n3'],
    front: { tipo: 'libro', modulo: 'lectura', autor: 'James Clear', paginas: 320, leidas: 210, estado: 'leyendo' },
    body: 'La identidad precede al resultado: no «quiero correr», sino «soy corredor».\n\n> Make it obvious, make it easy.\n\nConecta con [[Sistema de rachas]].' },
  { id: 'n6', title: 'Álgebra lineal', folder: 'Estudio', tags: ['álgebra', 'examen'],
    updated: 'hace 1 semana', words: 920, links: [],
    front: { tipo: 'materia', modulo: 'estudio', profesor: 'Dra. Ruiz', evaluacion: 'parcial 40%' },
    body: 'Base: conjunto linealmente independiente que genera el espacio.\n\nDimensión = cardinalidad de cualquier base.' },
];

// Render mínimo del cuerpo: párrafos, listas, citas, tablas y [[enlaces]].
function NoteBody({ note, onJump }) {
  return (
    <div className="rn-body">
      {note.body.split('\n\n').map((p, i) => {
        if (p.startsWith('|')) {
          const rows = p.split('\n').filter(r => !/^\|[\s-|]+\|$/.test(r));
          return (
            <table key={i} className="rn-table">
              <tbody>
                {rows.map((r, ri) => (
                  <tr key={ri}>{r.split('|').slice(1, -1).map((cell, ci) => (
                    ri === 0 ? <th key={ci}>{cell.trim()}</th> : <td key={ci}>{cell.trim()}</td>
                  ))}</tr>
                ))}
              </tbody>
            </table>
          );
        }
        if (p.startsWith('- ')) {
          return (
            <ul key={i} className="rn-checks">
              {p.split('\n').map((li, li2) => {
                const done = li.startsWith('- [x]');
                return (
                  <li key={li2} className={done ? 'done' : ''}>
                    <KIcon name={done ? 'check' : 'x'} size={12} />
                    {li.replace(/^- \[.\] /, '')}
                  </li>
                );
              })}
            </ul>
          );
        }
        const isQuote = p.startsWith('> ');
        const chunks = p.replace(/^> /, '').split(/(\[\[[^\]]+\]\]|\*\*[^*]+\*\*)/g).map((c, j) => {
          const bold = c.match(/^\*\*([^*]+)\*\*$/);
          if (bold) return <strong key={j}>{bold[1]}</strong>;
          const m = c.match(/^\[\[([^\]]+)\]\]$/);
          if (!m) return c;
          const target = VAULT_NOTES.find(n => n.title === m[1]);
          return <button key={j} type="button" className="rn-wikilink" disabled={!target}
                         onClick={() => target && onJump(target.id)}>{m[1]}</button>;
        });
        return isQuote ? <blockquote key={i}>{chunks}</blockquote> : <p key={i}>{chunks}</p>;
      })}
    </div>
  );
}

function BovedaScreen() {
  const [sel, setSel] = React.useState('n1');
  const [folder, setFolder] = React.useState('todas');
  const [query, setQuery] = React.useState('');
  const [syncOpen, setSyncOpen] = React.useState(false);
  const [dest, setDest] = React.useState('drive');
  const [toast, setToast] = React.useState(null);
  const [askText, textDialog] = usePrompt();
  const flash = (m) => { setToast(m); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2600); };

  const note = VAULT_NOTES.find(n => n.id === sel) || VAULT_NOTES[0];
  const backlinks = VAULT_NOTES.filter(n => n.links.includes(note.id));
  const autoCount = VAULT_NOTES.filter(n => n.auto).length;
  const list = VAULT_NOTES
    .filter(n => folder === 'todas' || n.folder === folder)
    .filter(n => !query.trim() || (n.title + ' ' + n.tags.join(' ') + ' ' + n.folder).toLowerCase().includes(query.trim().toLowerCase()));
  const destino = VAULT_DEST.find(d => d.id === dest);

  return (
    <div className="kbv-main kbv-recursos">
      {textDialog}
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--area-community)' }}>{crumb('resources', 'Tu archivo de vida')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Bóveda. <InfoDot label="i" text={"Markdown plano con frontmatter, tags y [[enlaces]]. Kibo escribe una nota por cada acción que registras y la carpeta se sincroniza con Drive, OneDrive o tu disco — legible por cualquier IA y por Obsidian, sin conversión."} /></h1>
        </div>
        <button type="button" className="kbv-btn kbv-btn-primary"
                onClick={() => askText({ title: 'Nueva nota', sub: 'Se guarda como .md en la carpeta que elijas.', label: 'Título', placeholder: 'p. ej. Retro del sprint, Ideas del capítulo 4…', confirmLabel: 'Crear', onSubmit: (t) => flash(`«${t}.md» creada · +15 XP a Sabiduría`) })}>
          <KIcon name="plus" size={14} /> Nueva nota
        </button>
      </div>

      {/* Estado de la sincronización */}
      <div className="kbv-obsidian-strip">
        <span className="ob-logo" aria-hidden="true"><KIcon name={destino.icon} size={18} /></span>
        <span className="ob-msg">
          <strong>Sincronizada con {destino.name} · <code>{destino.hint}</code></strong>
          Kibo escribió {autoCount} de estas {VAULT_NOTES.length} notas solo — una por cada acción que registraste. Los archivos son tuyos: Markdown plano, sin base de datos de por medio.
        </span>
        <div className="ob-acts">
          <button type="button" className="fr-btn" onClick={() => setSyncOpen(true)}><KIcon name="repeat" size={13} /> Cambiar destino</button>
          <button type="button" className="fr-btn ghost" title="Sincronizar ahora" onClick={() => flash('Sincronizando… 6 archivos al día')}><KIcon name="upload" size={13} /></button>
        </div>
      </div>

      {/* Pulso de la bóveda */}
      <div className="kbv-social-band">
        <div className="sb-cell">
          <span className="sb-ico" style={{ '--c': 'var(--area-community)' }}><KIcon name="book" size={15} /></span>
          <span className="sb-v">{VAULT_NOTES.length}</span>
          <span className="sb-l">archivos .md</span>
        </div>
        <div className="sb-cell">
          <span className="sb-ico" style={{ '--c': 'var(--kb-primary)' }}><KIcon name="sparkle" size={15} /></span>
          <span className="sb-v">{autoCount}</span>
          <span className="sb-l">escritos por Kibo</span>
        </div>
        <div className="sb-cell">
          <span className="sb-ico" style={{ '--c': 'var(--kb-gem)' }}><KIcon name="layers" size={15} /></span>
          <span className="sb-v">{VAULT_FOLDERS.length}</span>
          <span className="sb-l">carpetas · una por módulo</span>
        </div>
        <div className="sb-cell">
          <span className="sb-ico" style={{ '--c': 'var(--kb-coin)' }}><KIcon name="repeat" size={15} /></span>
          <span className="sb-v">hoy</span>
          <span className="sb-l">última sincronización</span>
        </div>
      </div>

      {/* Explorador */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Estructura" meta="Las carpetas espejan los módulos: lo que haces en Kibo aterriza aquí como archivo" />
        <div className="kbv-seg-row">
          <div className="kbv-seg">
            <button type="button" className={folder === 'todas' ? 'on' : ''} onClick={() => setFolder('todas')}>Todas <span className="seg-n">{VAULT_NOTES.length}</span></button>
            {VAULT_FOLDERS.map(f => (
              <button key={f.id} type="button" className={folder === f.id ? 'on' : ''} onClick={() => setFolder(f.id)} title={f.pat}>
                <KIcon name={f.icon} size={13} /> {f.id} <span className="seg-n">{VAULT_NOTES.filter(n => n.folder === f.id).length}</span>
              </button>
            ))}
          </div>
          <div className="kbv-search-box small">
            <KIcon name="search" size={14} />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar archivo o #tag…" />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Limpiar"><KIcon name="x" size={11} /></button>}
          </div>
        </div>

        <div className="kbv-vault">
          <div className="kbv-vault-list">
            {list.length === 0 && <EmptyState compact icon="search" title="Nada por aquí" body="Ningún archivo coincide. Prueba otro término o crea el primero." />}
            {list.map(n => {
              const f = VAULT_FOLDERS.find(x => x.id === n.folder);
              return (
                <button key={n.id} type="button" className={`kbv-note-row ${sel === n.id ? 'on' : ''}`} style={{ '--c': f ? f.color : 'var(--kb-text-3)' }} onClick={() => setSel(n.id)}>
                  <span className="nr-ico"><KIcon name={f ? f.icon : 'book'} size={14} /></span>
                  <span className="nr-txt">
                    <span className="nr-title">{n.title}.md{n.fav && <KIcon name="pin" size={10} />}</span>
                    <span className="nr-meta">{n.folder} · {n.updated} · {n.words} palabras</span>
                  </span>
                  {n.auto
                    ? <span className="nr-auto" title="Escrita por Kibo desde tus registros"><KIcon name="sparkle" size={11} /></span>
                    : <span className="nr-links">{n.links.length + VAULT_NOTES.filter(x => x.links.includes(n.id)).length} <KIcon name="repeat" size={10} /></span>}
                </button>
              );
            })}
          </div>

          <article className="kbv-note-view">
            <header>
              <h3>{note.title}.md</h3>
              <div className="rn-tags">
                {note.auto && <span className="rn-auto"><KIcon name="sparkle" size={10} /> escrita por Kibo</span>}
                {note.tags.map(t => <span key={t} className="rn-tag">#{t}</span>)}
                <span className="kbv-meta">· {note.updated}</span>
              </div>
            </header>
            {/* Frontmatter: lo que hace la nota legible por cualquier IA */}
            <div className="rn-front">
              <span className="rf-label">---</span>
              {Object.entries(note.front).map(([k, v]) => (
                <span key={k} className="rf-row"><em>{k}:</em> {String(v)}</span>
              ))}
              <span className="rf-label">---</span>
            </div>
            <NoteBody note={note} onJump={setSel} />
            <footer>
              <span className="kbv-eyebrow">Backlinks · {backlinks.length}</span>
              {backlinks.length === 0
                ? <span className="kbv-meta">Nadie enlaza aquí todavía — enlázalo desde otro archivo con [[{note.title}]].</span>
                : <div className="rn-backlinks">
                    {backlinks.map(b => (
                      <button key={b.id} type="button" className="rn-backlink" onClick={() => setSel(b.id)}>
                        <KIcon name="arrow-right" size={11} /> {b.title}
                      </button>
                    ))}
                  </div>}
            </footer>
          </article>
        </div>
      </div>

      {syncOpen && (
        <KBVModal title="¿Dónde vive tu bóveda?" size="md" onClose={() => setSyncOpen(false)}
          sub="Kibo escribe Markdown plano en la carpeta que elijas. Nada queda encerrado: lo puede leer Obsidian, cualquier IA o tú con un editor de texto."
          footer={<div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setSyncOpen(false)}>Después</button>
            <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => { setSyncOpen(false); flash(`Bóveda vinculada a ${VAULT_DEST.find(d => d.id === dest).name} · sincronizando…`); }}>
              <KIcon name="check" size={14} /> Vincular carpeta
            </button>
          </div>}>
          <div className="kbv-settings-list">
            {VAULT_DEST.map(d => (
              <SettingRow key={d.id} icon={d.icon} title={d.name} sub={d.hint}
                          onClick={() => setDest(d.id)}>
                {dest === d.id
                  ? <span className="kbv-tag" style={{ background: 'var(--kb-primary-soft)', color: 'var(--kb-primary-ink)' }}>Elegida</span>
                  : <span className="kbv-meta">Elegir</span>}
              </SettingRow>
            ))}
          </div>
          <div className="kbv-ob-steps" style={{ marginTop: 12 }}>
            <div className="ob-step"><span className="n">1</span><span><strong>Kibo escribe por ti.</strong> Cada hábito marcado, reto cerrado, gasto o lectura se convierte en una entrada con frontmatter (<code>tipo</code>, <code>modulo</code>, <code>fecha</code>…).</span></div>
            <div className="ob-step"><span className="n">2</span><span><strong>Una carpeta por módulo.</strong> <code>habitos/</code>, <code>retos/</code>, <code>finanzas/</code>… con nombres de archivo predecibles para que la IA sepa dónde buscar.</span></div>
            <div className="ob-step"><span className="n">3</span><span><strong>Obsidian la abre tal cual.</strong> Los <code>[[enlaces]]</code>, tags y carpetas son los suyos; la capa de juego (XP, rachas) se queda en Kibo y no ensucia tus archivos.</span></div>
          </div>
        </KBVModal>
      )}

      {toast && <div className="kbv-social-toast"><KIcon name="check" size={14} /> {toast}</div>}
    </div>
  );
}

Object.assign(window, { BovedaScreen, BóvedaScreen: BovedaScreen });
