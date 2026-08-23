// estudio-cursos.jsx — Cursos como proyectos de Sabiduría.
//  • CreateCourseModalV2: tipo-dependiente (online / proyecto / taller / otro),
//    con rúbricas (energía, esfuerzo cognitivo, conocimiento previo) que estiman
//    XP / monedas / fragmentos al completar.
//  • CourseDetail: homologado con el detalle de Proyectos (KPIs, info, tareas).
//  • EstudioBacklog: lista (plan de carrera) con interés, serie/línea y prerrequisitos.
//  • EstudioIntereses: gestión transversal de temas de interés y etiquetas.

// ── Rúbrica de iconos 1–5 (estilo energía/esfuerzo) ──
// Rúbrica 1–5 de cursos — mismo control que el resto de la plataforma:
// RateRow para capturar, Scale5 para leer.
function StudyRubric({ level = 0, onChange, icon = 'flame', color = 'var(--kb-streak)', readOnly = false }) {
  if (readOnly) return <Scale5 value={level} color={color} size={0.85} />;
  return <RateRow value={level} onChange={onChange} icon={icon} color={color} compact showValue={false} />;
}

// Recompensa: más esfuerzo/energía y menos conocimiento previo ⇒ más premio.
function studyReward({ energy = 3, effort = 3, prior = 3 }) {
  const base = (energy + effort) * 38 + (6 - prior) * 34;
  const xp = Math.round(base / 10) * 10;
  return { xp, coins: Math.round(xp / 4), gems: Math.max(1, Math.round((effort + (6 - prior)) / 3)) };
}

const COURSE_KINDS_V2 = [
  { id: 'online',  label: 'Curso online',     desc: 'Platzi, Coursera, Udemy, YouTube…', icon: 'tv' },
  { id: 'project', label: 'Proyecto personal', desc: 'Estudio autodirigido: libros, docs', icon: 'sparkle' },
  { id: 'taller',  label: 'Taller / clase presencial', desc: 'Música, arte, cocina… no es escuela', icon: 'community' },
  { id: 'otro',    label: 'Otro',              desc: 'Bootcamp, certificación, seminario', icon: 'layers' },
];

function CreateCourseModalV2({ onClose, onSave, allCourses = [] }) {
  const [kind, setKind] = React.useState('online');
  const [name, setName] = React.useState('');
  const [platform, setPlatform] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [professor, setProfessor] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');
  const [energy, setEnergy] = React.useState(3);
  const [effort, setEffort] = React.useState(3);
  const [prior, setPrior] = React.useState(2);
  const [topics, setTopics] = React.useState([]);
  const [topicDraft, setTopicDraft] = React.useState('');
  // taller-only
  const [place, setPlace] = React.useState('');
  const [freq, setFreq] = React.useState('');
  const [duration, setDuration] = React.useState('');
  const [prereqs, setPrereqs] = React.useState('');
  // serie
  const [linkedTo, setLinkedTo] = React.useState('');

  const reward = studyReward({ energy, effort, prior });
  const isTaller = kind === 'taller';
  const isOnline = kind === 'online';

  function addTopic() { const t = topicDraft.trim(); if (t && !topics.includes(t)) setTopics(ts => [...ts, t]); setTopicDraft(''); }

  function save() {
    onSave && onSave({
      name: name.trim(), kind, platform, subject, professor, url, start, end,
      energy, effort, prior, reward, topics, linkedTo,
      taller: isTaller ? { place, freq, duration, prereqs } : null,
    });
    onClose();
  }

  return (
    <KBVModal
      title="Agregar curso o estudio"
      sub="Cursos online, proyectos personales o talleres presenciales. La escuela formal se gestiona en su propia pestaña."
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!name.trim()} onClick={save}>Agregar <KIcon name="check" size={14} /></button>
        </div>
      }>
      <div className="kbv-form-row">
        <label>Tipo de estudio</label>
        <div className="kbv-cat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {COURSE_KINDS_V2.map(k => (
            <button key={k.id} type="button" className={`kbv-cat-tile big ${kind === k.id ? 'on' : ''}`} style={{ '--c': 'var(--area-wisdom)' }} onClick={() => setKind(k.id)}>
              <span className="glyph big"><KIcon name={k.icon} size={20} /></span>
              <div><span className="lbl">{k.label}</span><span className="sub">{k.desc}</span></div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Nombre</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={isTaller ? 'Ej: Clases de guitarra' : 'Ej: System Design, Rust desde cero…'} autoFocus />
        </div>
        <div className="kbv-form-row">
          <label>{isOnline ? 'Plataforma' : isTaller ? 'Escuela / instructor' : 'Fuente'}</label>
          <input type="text" value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder={isOnline ? 'Platzi, Coursera…' : isTaller ? 'Academia, maestro…' : 'Libro, bootcamp…'} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Área de conocimiento</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="iOS, ML, Música…" />
        </div>
        {isOnline ? (
          <div className="kbv-form-row">
            <label>URL del curso (opcional)</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </div>
        ) : (
          <div className="kbv-form-row">
            <label>Instructor / mentor (opcional)</label>
            <input type="text" value={professor} onChange={(e) => setProfessor(e.target.value)} placeholder="Quién imparte" />
          </div>
        )}
      </div>

      {/* Campos específicos de taller presencial */}
      {isTaller && (
        <div className="kbv-taller-block">
          <span className="kbv-meta" style={{ fontWeight: 700, color: 'var(--area-wisdom)' }}>Taller presencial</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
            <div className="kbv-form-row"><label>¿Dónde es?</label><input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Dirección / salón" /></div>
            <div className="kbv-form-row"><label>¿Cada cuándo?</label><input type="text" value={freq} onChange={(e) => setFreq(e.target.value)} placeholder="Ej: Mar y Jue 18:00" /></div>
            <div className="kbv-form-row"><label>Duración por sesión</label><input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Ej: 1.5 h" /></div>
            <div className="kbv-form-row"><label>Prerrequisitos / qué llevar</label><input type="text" value={prereqs} onChange={(e) => setPrereqs(e.target.value)} placeholder="Pinturas, guitarra, ropa cómoda…" /></div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="kbv-form-row"><label>Inicio</label><input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></div>
        <div className="kbv-form-row"><label>{isTaller ? 'Fin del taller' : 'Meta de término'}</label><input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
      </div>

      {/* Serie / línea de cursos */}
      {allCourses.length > 0 && (
        <div className="kbv-form-row">
          <label>¿Continúa otro curso? <span className="kbv-meta" style={{ fontWeight: 400 }}>(misma línea de aprendizaje)</span></label>
          <select value={linkedTo} onChange={(e) => setLinkedTo(e.target.value)}>
            <option value="">No, es independiente</option>
            {allCourses.map(c => <option key={c.id} value={c.id}>Continúa: {c.name}</option>)}
          </select>
        </div>
      )}

      {/* Temas de interés / etiquetas */}
      <div className="kbv-form-row">
        <label>Temas / etiquetas</label>
        <div className="kbv-tag-input">
          {topics.map(t => <span key={t} className="kbv-tag removable">{t}<button type="button" onClick={() => setTopics(ts => ts.filter(x => x !== t))}><KIcon name="x" size={10} /></button></span>)}
          <input type="text" value={topicDraft} onChange={(e) => setTopicDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTopic(); } }} placeholder="Escribe y Enter…" />
        </div>
      </div>

      {/* Rúbricas → recompensa */}
      <div className="kbv-reward-box">
        <div className="rb-rubrics">
          <div className="rb-row"><span className="rb-l"><KIcon name="flame" size={12} /> Energía que pide</span><StudyRubric level={energy} onChange={setEnergy} icon={KB_SCALES.esfuerzo.icon} color={KB_SCALES.esfuerzo.color} /></div>
          <div className="rb-row"><span className="rb-l"><KIcon name="wisdom" size={12} /> Esfuerzo cognitivo</span><StudyRubric level={effort} onChange={setEffort} icon={KB_SCALES.cognitivo.icon} color={KB_SCALES.cognitivo.color} /></div>
          <div className="rb-row"><span className="rb-l"><KIcon name="graduation" size={12} /> Conocimiento previo</span><StudyRubric level={prior} onChange={setPrior} icon={KB_SCALES.previo.icon} color={KB_SCALES.previo.color} /></div>
        </div>
        <div className="rb-reward">
          <span className="rb-cap">Al completarlo ganarás</span>
          <div className="rb-vals">
            <span className="rb-xp">+{reward.xp} XP</span>
            <span className="rb-coin"><KIcon name="sparkle" size={11} /> {reward.coins}</span>
            <span className="rb-gem"><KIcon name="sparkle" size={11} /> {reward.gems} fragmentos</span>
          </div>
          <span className="rb-note">en Sabiduría y a nivel general · más esfuerzo y menos base = más premio</span>
        </div>
      </div>
    </KBVModal>
  );
}

// ── Detalle de curso (homologado con Proyectos) ──
const COURSE_DEMO_TASKS = {
  c1: [
    { id: 'ct1', title: 'Módulo 3 · Diseño de APIs escalables', status: 'done', energy: 3, est: '2h' },
    { id: 'ct2', title: 'Ejercicio: rate limiter', status: 'doing', energy: 4, est: '3h' },
    { id: 'ct3', title: 'Proyecto: diseñar feed de noticias', status: 'todo', energy: 5, est: '6h' },
  ],
  c2: [
    { id: 'ct4', title: 'SwiftUI · State & Binding', status: 'done', energy: 2, est: '1h' },
    { id: 'ct5', title: 'Construir app de clima', status: 'todo', energy: 3, est: '4h' },
  ],
};
const COURSE_TASK_STATUS = { todo: 'Por hacer', doing: 'En curso', blocked: 'Bloqueado', done: 'Hecho' };

function CourseDetail({ course, onBack }) {
  const tasks = COURSE_DEMO_TASKS[course.id] || [];
  const done = tasks.filter(t => t.status === 'done').length;
  const reward = course.reward || studyReward({ energy: course.energy || 3, effort: course.effort || 3, prior: course.prior || 2 });
  const kindLabel = ({ online: 'Curso online', project: 'Proyecto personal', taller: 'Taller presencial', formal: 'Materia', autoguiado: 'Autoguiado', otro: 'Otro' })[course.kind] || 'Curso';
  function newActivity() { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'tareas', create: true, area: 'wisdom', course: course.id } })); } catch (_) {} }

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <button type="button" className="kbv-btn kbv-btn-secondary kbv-back-btn" onClick={onBack}><KIcon name="arrow-left" size={15} /> Volver a Cursos</button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
            <span className="kbv-eyebrow" style={{ color: course.color || 'var(--area-wisdom)' }}>{kindLabel} · {course.platform}</span>
            {course.done && <span className="status-pip">Terminado</span>}
          </div>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>{course.name}</h1>
          {course.skill && <p className="kbv-body" style={{ marginTop: 4 }}>{course.skill}</p>}
        </div>
        <div className="actions"><button type="button" className="kbv-btn kbv-btn-primary" onClick={newActivity}><KIcon name="plus" size={14} /> Actividad → Tareas</button></div>
      </div>

      {/* KPIs */}
      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': course.color || 'var(--area-wisdom)' }}>
          <span className="label">Avance</span><span className="val">{course.progress}<small>%</small></span>
          <span className="delta">{done}/{tasks.length} actividades</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}>
          <span className="label">Tiempo</span><span className="val">{course.doneHrs}<small>/{course.totalHrs}h</small></span>
          <span className="delta">registrado</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-community)' }}>
          <span className="label">Al completar</span><span className="val">+{reward.xp}<small> XP</small></span>
          <span className="delta">{reward.coins} monedas · {reward.gems} fragmentos</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-wisdom)' }}>
          <span className="label">XP ganado</span><span className="val">+{course.xpEarned}</span>
          <span className="delta">en Sabiduría</span>
        </div>
      </div>

      <div className="kbv-project-detail-grid">
        {/* Info */}
        <div className="kbv-fin-card">
          <h3 className="kbv-h3" style={{ marginBottom: 12 }}>Detalle</h3>
          <div className="kbv-detail-rows">
            <div className="row"><span className="l">Tipo</span><span className="v">{kindLabel}</span></div>
            <div className="row"><span className="l">Plataforma / fuente</span><span className="v">{course.platform || '—'}</span></div>
            <div className="row"><span className="l">Área</span><span className="v">{course.skill || '—'}</span></div>
            <div className="row"><span className="l">Última sesión</span><span className="v">{course.lastSessionAt || '—'}</span></div>
            {course.taller && <div className="row"><span className="l">Dónde</span><span className="v">{course.taller.place || '—'}</span></div>}
            {course.taller && <div className="row"><span className="l">Frecuencia</span><span className="v">{course.taller.freq || '—'}</span></div>}
            {course.taller && course.taller.prereqs && <div className="row"><span className="l">Qué llevar</span><span className="v">{course.taller.prereqs}</span></div>}
            <div className="row"><span className="l">Esfuerzo</span><span className="v"><StudyRubric level={course.effort || 3} icon="wisdom" color="var(--area-community)" readOnly /></span></div>
            <div className="row"><span className="l">Temas</span><span className="v">{(course.topics && course.topics.length) ? course.topics.map(t => <span key={t} className="kbv-tag">{t}</span>) : '—'}</span></div>
          </div>
          {course.url && <a className="kbv-btn kbv-btn-secondary" href={course.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 12 }}><KIcon name="arrow-right" size={13} /> Abrir curso</a>}
          <div className="kbv-detail-progress">
            <div className="kbv-progress" style={{ height: 8 }}><div className="fill" style={{ width: `${course.progress}%`, background: course.color || 'var(--area-wisdom)' }} /></div>
            <span className="kbv-meta">{course.progress}% completado</span>
          </div>
        </div>

        {/* Actividades (= tareas, homologado con proyectos) */}
        <div className="kbv-fin-card">
          <div className="head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <h3 className="kbv-h3">Actividades</h3>
            <span className="kbv-meta">{tasks.length} ligadas · {done} hechas · viven también en Tareas</span>
          </div>
          {tasks.length === 0 ? (
            <EmptyState icon="list" title="Sin actividades" body="Crea una con «Actividad → Tareas» y se ligará a este curso." />
          ) : (
            <div className="kbv-related-tasks">
              {tasks.map(t => (
                <div key={t.id} className={`related-task ${t.status === 'done' ? 'done' : ''}`} style={{ '--c': 'var(--area-wisdom)' }}>
                  <span className="ttl">{t.title}</span>
                  <StudyRubric level={t.energy} icon="flame" color="var(--pri-high)" readOnly />
                  <span className="kbv-meta" style={{ marginLeft: 6 }}>{t.est}</span>
                  <span className={`st-pip ${t.status}`}>{COURSE_TASK_STATUS[t.status]}</span>
                </div>
              ))}
            </div>
          )}
          <button type="button" className="kbv-btn kbv-btn-ghost" style={{ marginTop: 10 }} onClick={newActivity}><KIcon name="plus" size={13} /> Nueva actividad</button>
        </div>
      </div>
    </div>
  );
}

// ── Backlog · plan de carrera (lista) ──
const STUDY_PRIORITY_PILL = { alta: { c: 'var(--kb-hp)', l: 'Alta' }, media: { c: 'var(--kb-coin)', l: 'Media' }, baja: { c: 'var(--kb-gem)', l: 'Baja' } };

function EstudioBacklog({ backlog, courses, onPromote, onAdd }) {
  function nameOf(id) { const c = courses.find(x => x.id === id) || backlog.find(x => x.id === id); return c ? c.name : null; }
  return (
    <div className="kbv-card kbv-char-card">
      <div className="kbv-study-section-head tight">
        <div>
          <h3 className="kbv-h3">Backlog · plan de carrera</h3>
          <span className="kbv-meta">Lo que quieres aprender después. Prioriza, enlaza series y anota prerrequisitos.</span>
        </div>
        <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={onAdd}>+ Agregar</button>
      </div>
      <div className="kbv-backlog-list">
        {backlog.map(b => {
          const pri = STUDY_PRIORITY_PILL[b.priority] || STUDY_PRIORITY_PILL.media;
          const cont = b.linkedTo ? nameOf(b.linkedTo) : null;
          return (
            <div key={b.id} className="bl-row" style={{ '--pc': pri.c }}>
              <span className="bl-pri-dot" title={`Prioridad ${pri.l}`} />
              <div className="bl-main">
                <div className="bl-top">
                  <span className="bl-name">{b.name}</span>
                  {b.interest != null && <StudyRubric level={b.interest} icon="sparkle" color="var(--area-community)" readOnly />}
                </div>
                <div className="bl-meta">
                  <span className="bl-plat">{b.platform}</span>
                  <span className="bl-pri" style={{ color: pri.c }}>{pri.l}</span>
                  {cont && <span className="bl-link"><KIcon name="arrow-right" size={9} /> continúa {cont}</span>}
                  {b.prereq && <span className="bl-prereq"><KIcon name="alert" size={9} /> req: {b.prereq}</span>}
                </div>
                {b.why && <span className="bl-why">{b.why}</span>}
              </div>
              <button type="button" className="bl-promote" onClick={() => onPromote(b.id)} title="Mover a en curso"><KIcon name="arrow-right" size={13} /></button>
            </div>
          );
        })}
        {backlog.length === 0 && <EmptyState compact icon="graduation" title="Backlog vacío" body="Agrega lo que quieras aprender después." />}
      </div>
    </div>
  );
}

// ── Intereses y etiquetas (transversal) ──
const STUDY_INTERESTS_DEMO = [
  { name: 'Sistemas distribuidos', courses: 2, color: '#2D4A3A' },
  { name: 'Machine Learning', courses: 3, color: '#0056D2' },
  { name: 'Diseño de producto', courses: 1, color: '#A435F0' },
  { name: 'Matemáticas', courses: 2, color: 'var(--area-community)' },
  { name: 'Música', courses: 1, color: 'var(--kb-hp)' },
];

function EstudioIntereses() {
  const [tags, setTags] = React.useState(STUDY_INTERESTS_DEMO);
  const [draft, setDraft] = React.useState('');
  const PAL = ['#2D4A3A', '#0056D2', '#A435F0', 'var(--area-community)', 'var(--kb-hp)', 'var(--kb-primary)', 'var(--pri-high)'];
  function add() { const t = draft.trim(); if (t && !tags.some(x => x.name === t)) setTags(ts => [...ts, { name: t, courses: 0, color: PAL[ts.length % PAL.length] }]); setDraft(''); }
  return (
    <div className="kbv-card kbv-char-card">
      <div className="kbv-study-section-head tight">
        <div>
          <h3 className="kbv-h3">Temas de interés</h3>
          <span className="kbv-meta">Transversal a todo Estudio · etiqueta cursos, materias y proyectos</span>
        </div>
      </div>
      <div className="kbv-interest-cloud">
        {tags.map(t => (
          <span key={t.name} className="interest-chip" style={{ '--c': t.color }}>
            {t.name}<small>{t.courses}</small>
            <button type="button" onClick={() => setTags(ts => ts.filter(x => x.name !== t.name))}><KIcon name="x" size={10} /></button>
          </span>
        ))}
      </div>
      <div className="kbv-tag-input" style={{ marginTop: 10 }}>
        <input type="text" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} placeholder="Nuevo tema de interés y Enter…" />
        <button type="button" className="kbv-btn kbv-btn-secondary" style={{ padding: '5px 11px', fontSize: 12 }} onClick={add}>Agregar</button>
      </div>
    </div>
  );
}

Object.assign(window, { StudyRubric, studyReward, CreateCourseModalV2, CourseDetail, EstudioBacklog, EstudioIntereses, STUDY_PRIORITY_PILL });
