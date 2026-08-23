// estudio-escuela.jsx — Escuela formal, Agenda y Trayectoria (v2).
//  • Escuela: materias con esquema de evaluación, calificación en vivo,
//    indicadores académicos, profesores de la escuela, alta de materias y
//    registro rápido de tareas por materia. (Sin énfasis en costo de material.)
//  • Agenda: horario semanal de materias (Lun–Sáb) con profesor/salón —
//    cada materia calificable en esfuerzo/interés — y entregas = tareas con
//    su detalle completo al seleccionarlas (homologado con Tareas).
//  • Trayectoria: cúmulo de indicadores y gráficos de tu evolución.

// ════════ Datos ════════
const SCHOOL_SEMESTER_V2 = { name: '2026-1 · Primavera', school: 'UNAM · Fac. Ingeniería', start: '2026-02-03', end: '2026-06-12', credits: 32 };

const SCHOOL_SUBJECTS_V2 = [
  { id: 'm1', name: 'Cálculo II', professorId: 'pr1', modality: 'presencial', credits: 8, color: 'var(--area-community)',
    days: ['Mar', 'Jue'], time: '19:00', dur: 2, room: 'Aula 204', online: false, progress: 62, effort: 4, interest: 3, topics: ['Matemáticas'],
    scheme: [
      { name: 'Exámenes', weight: 50, grade: 88, items: [{ n: 'Parcial 1', g: 92 }, { n: 'Parcial 2', g: 84 }, { n: 'Parcial 3', g: null }] },
      { name: 'Tareas', weight: 30, grade: 95, items: [{ n: 'Tareas 1–3', g: 100 }, { n: 'Tarea 4', g: 90 }, { n: 'Tarea 5', g: null }] },
      { name: 'Proyecto', weight: 20, grade: null, items: [{ n: 'Entrega final', g: null }] }],
    notes: [
      { id: 'n1', title: 'Integrales por partes — la regla ILATE', when: '24 May', body: 'Elegir u por orden: Inversa, Logarítmica, Algebraica, Trigonométrica, Exponencial. Con eso el 80% de los ejercicios sale al primer intento.' },
      { id: 'n2', title: 'Errores del parcial 2', when: '18 May', body: 'Perdí 8 puntos por no verificar dominios. Antes de entregar: revisar dominio y continuidad.' }],
    exams: [{ n: 'Parcial 3', d: '06 Jun' }, { n: 'Entrega proyecto', d: '18 Jun' }] },
  { id: 'm2', name: 'Álgebra lineal', professorId: 'pr2', modality: 'híbrida', credits: 8, color: 'var(--kb-gem)',
    days: ['Lun', 'Mié'], time: '17:00', dur: 1.5, room: 'Aula 110 / en línea', online: true, link: 'https://clase-en-linea.kibo/algebra', progress: 48, effort: 3, interest: 4, topics: ['Matemáticas'],
    scheme: [
      { name: 'Parciales', weight: 60, grade: 79, items: [{ n: 'Parcial 1', g: 74 }, { n: 'Parcial 2', g: 84 }] },
      { name: 'Quizzes', weight: 40, grade: 84, items: [{ n: 'Quiz 1', g: 80 }, { n: 'Quiz 2', g: 88 }, { n: 'Quiz 3', g: null }] }],
    notes: [{ id: 'n3', title: 'Bases y dimensión', when: '20 May', body: 'Una base es el mínimo conjunto que genera todo el espacio. Dimensión = cuántos vectores tiene esa base.' }],
    exams: [{ n: 'Quiz 3', d: '02 Jun' }, { n: 'Parcial 3', d: '11 Jun' }] },
  { id: 'm3', name: 'Bases de datos', professorId: 'pr5', modality: 'en línea', credits: 6, color: 'var(--kb-primary)',
    days: ['Vie'], time: '16:00', dur: 1.5, room: 'Campus virtual', online: true, link: 'https://clase-en-linea.kibo/bd', progress: 70, effort: 3, interest: 5, topics: ['Sistemas'],
    scheme: [
      { name: 'Proyecto final', weight: 50, grade: null, items: [{ n: 'Modelo E-R', g: null }, { n: 'Implementación', g: null }] },
      { name: 'Prácticas', weight: 50, grade: 92, items: [{ n: 'Práctica 1–4', g: 94 }, { n: 'Práctica 5', g: 88 }] }],
    notes: [{ id: 'n4', title: 'Normalización hasta 3FN', when: '22 May', body: '1FN: valores atómicos. 2FN: sin dependencias parciales. 3FN: sin dependencias transitivas. Casi todo examen pide llegar a 3FN.' }],
    exams: [{ n: 'Entrega práctica 6', d: '05 Jun' }, { n: 'Proyecto final', d: '20 Jun' }] },
];

const SCHOOL_PROFESSORS_V2 = {
  pr1: { name: 'Dra. Elena Ríos', subject: 'Cálculo II', rating: 5, mail: 'e.rios@fi.unam.mx', office: 'Cubículo 12, Anexo · Mar y Jue 17–19h', style: 'Pregunta en clase y da puntos por participar. Los parciales salen del cuaderno, no del libro.' },
  pr2: { name: 'Mtro. Juan Pérez', subject: 'Álgebra lineal', rating: 4, mail: 'jperez@fi.unam.mx', office: 'Sala de profesores · Lun 16–17h', style: 'Estricto con el formato de entrega. Acepta preguntas por correo y contesta el mismo día.' },
  pr5: { name: 'Dra. M. Soto', subject: 'Bases de datos', rating: 5, mail: 'm.soto@fi.unam.mx', office: 'En línea · Vie 15–16h por videollamada', style: 'Todo el curso gira alrededor del proyecto final. Pide avances cada dos semanas.' },
};

const MODALITY_PILL_V2 = { presencial: { l: 'Presencial', c: 'var(--kb-hp)' }, 'en línea': { l: 'En línea', c: 'var(--kb-gem)' }, híbrida: { l: 'Híbrida', c: 'var(--area-community)' } };

// Tareas académicas (entregas/exámenes/proyectos) — homologadas con Tareas
const ACADEMIC_TASKS = [
  { id: 'at1', title: 'Tarea 4 — Integrales por partes', type: 'entrega', subjectId: 'm1', course: 'Cálculo II', date: '30 May', dleft: 1, status: 'doing', priority: 'high', energy: 3, est: '2h', desc: 'Ejercicios 4.1 a 4.20 del Stewart. Entregar en PDF por el campus.', checklist: [{ t: 'Ej. 4.1–4.10', done: true }, { t: 'Ej. 4.11–4.20', done: false }, { t: 'Revisar y subir', done: false }] },
  { id: 'at2', title: 'Estudiar parcial de Cálculo II', type: 'examen', subjectId: 'm1', course: 'Cálculo II', date: '06 Jun', dleft: 8, status: 'todo', priority: 'urgent', energy: 5, est: '6h', desc: 'Temas 3 y 4. Hacer 2 exámenes de práctica.', checklist: [{ t: 'Repasar tema 3', done: false }, { t: 'Repasar tema 4', done: false }, { t: 'Examen muestra', done: false }] },
  { id: 'at3', title: 'Proyecto final — esquema de BD', type: 'proyecto', subjectId: 'm3', course: 'Bases de datos', date: '20 Jun', dleft: 22, status: 'todo', priority: 'medium', energy: 4, est: '10h', desc: 'Diseñar el modelo entidad-relación y normalizar a 3FN.', checklist: [{ t: 'Modelo E-R', done: false }, { t: 'Normalización', done: false }, { t: 'Documentación', done: false }] },
  { id: 'at4', title: 'Quiz 3 — Álgebra lineal', type: 'examen', subjectId: 'm2', course: 'Álgebra lineal', date: '02 Jun', dleft: 4, status: 'todo', priority: 'high', energy: 2, est: '1h', desc: 'Espacios vectoriales y bases.', checklist: [] },
  { id: 'at5', title: 'Entrega: práctica 5 — BD', type: 'entrega', subjectId: 'm3', course: 'Bases de datos', date: '28 May', dleft: 0, status: 'done', priority: 'medium', energy: 2, est: '1.5h', desc: 'Consultas SQL con JOINs.', checklist: [{ t: 'Resolver', done: true }, { t: 'Subir', done: true }] },
];
const ATASK_TYPE = { entrega: { l: 'Entrega', c: 'var(--kb-gem)', icon: 'upload' }, examen: { l: 'Examen', c: 'var(--kb-hp)', icon: 'edit' }, proyecto: { l: 'Proyecto', c: 'var(--kb-primary)', icon: 'layers' }, estudiar: { l: 'Estudiar', c: 'var(--kb-coin)', icon: 'book-open' } };
const ATASK_PRIORITY = { urgent: { l: 'Urgente', c: 'var(--kb-hp)' }, high: { l: 'Alta', c: 'var(--pri-high)' }, medium: { l: 'Media', c: 'var(--kb-coin)' }, low: { l: 'Baja', c: 'var(--kb-gem)' } };

function schemeGrade(scheme) {
  const gradedWeight = scheme.reduce((a, e) => a + (e.grade != null ? e.weight : 0), 0);
  const score = scheme.reduce((a, e) => a + (e.grade != null ? e.grade * e.weight / 100 : 0), 0);
  return { gradedWeight, projected: gradedWeight ? Math.round(score / gradedWeight * 100) : null };
}


// ═══ 67 · Detalle de MATERIA ═════════════════════════════════════
// La tarjeta del listado resume; el detalle es donde vive la materia. Seis
// piezas, en el orden en que se preguntan: cómo voy, cómo me califican, qué
// debo, cuándo es, qué apunté y quién la da.
function SubjectDetail({ subject: s, tasks, onBack, onAddTask }) {
  const [tab, setTab] = React.useState('resumen');
  const g = schemeGrade(s.scheme);
  const prof = s.professorId ? SCHOOL_PROFESSORS_V2[s.professorId] : null;
  const mod = MODALITY_PILL_V2[s.modality] || { l: s.modality, c: 'var(--kb-text-3)' };
  const mine = (tasks || []).filter(t => t.subjectId === s.id);
  const pend = mine.filter(t => t.status !== 'done');
  // Lo que falta por calificar: sin esto, «voy en 88» no dice nada.
  const falta = 100 - g.gradedWeight;
  const paraPasar = falta > 0 ? Math.max(0, Math.ceil((70 - (g.projected || 0) * g.gradedWeight / 100) / falta * 100)) : null;
  const TABS = [
    { id: 'resumen', l: 'Resumen', ic: 'gauge' },
    { id: 'calif', l: 'Calificaciones', ic: 'chart' },
    { id: 'pend', l: 'Pendientes', ic: 'list', n: pend.length },
    { id: 'cal', l: 'Calendario', ic: 'calendar' },
    { id: 'notas', l: 'Apuntes', ic: 'edit', n: (s.notes || []).length },
    { id: 'prof', l: 'Profesor', ic: 'community' },
  ];
  return (
    <div className="kbv-subject-detail" style={{ '--c': s.color }}>
      <div className="sd-head">
        <button type="button" className="sd-back" onClick={onBack} aria-label="Volver a materias">
          <KIcon name="arrow-right" size={14} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div className="sd-id">
          <span className="kbv-eyebrow">{SCHOOL_SEMESTER_V2.name} · {s.credits} créditos</span>
          <h2 className="kbv-h2" style={{ marginTop: 2 }}>{s.name}</h2>
          <span className="kbv-meta">
            {prof ? prof.name : 'Sin profesor'} · {mod.l}{s.days.length ? ` · ${s.days.join('/')} ${s.time}` : ''}{s.room ? ` · ${s.room}` : ''}
          </span>
        </div>
        <div className="sd-grade">
          <span className="sg-v">{g.projected != null ? g.projected : '—'}</span>
          <span className="sg-l">proyectada<em>{g.gradedWeight}% calificado</em></span>
        </div>
      </div>

      <div className="kbv-seg sd-seg">
        {TABS.map(t => (
          <button key={t.id} type="button" className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            <KIcon name={t.ic} size={13} /> {t.l}{t.n ? <span className="seg-n">{t.n}</span> : null}
          </button>
        ))}
      </div>

      {tab === 'resumen' && (
        <div className="sd-body">
          <div className="kbv-kpi-row">
            <div className="kbv-kpi" style={{ '--c': s.color }}><span className="label">Temario</span><span className="val">{s.progress}<small>%</small></span><span className="delta">cubierto en clase</span></div>
            <div className="kbv-kpi" style={{ '--c': 'var(--kb-hp)' }}><span className="label">Pendientes</span><span className="val">{pend.length}</span><span className="delta">entregas y exámenes</span></div>
            <div className="kbv-kpi" style={{ '--c': 'var(--kb-coin)' }}><span className="label">Por calificar</span><span className="val">{falta}<small>%</small></span><span className="delta">del total del curso</span></div>
            <div className="kbv-kpi" style={{ '--c': 'var(--area-wisdom)' }}><span className="label">Interés</span><span className="val">{s.interest}<small>/5</small></span><span className="delta">esfuerzo {s.effort}/5</span></div>
          </div>
          <div className="kbv-card kbv-char-card">
            <SectionHead tight title="Cómo vas" meta="Lo calificado, lo que falta y qué necesitas de aquí al final" />
            <div className="sd-progress">
              <div className="kbv-progress" style={{ height: 8 }}><div className="fill" style={{ width: `${s.progress}%`, background: s.color }} /></div>
              <span className="kbv-meta">{s.progress}% del temario visto en clase</span>
            </div>
            <p className="kbv-body" style={{ marginTop: 10 }}>
              Llevas <strong>{g.projected != null ? g.projected : '—'}</strong> sobre el <strong>{g.gradedWeight}%</strong> ya calificado.
              {paraPasar != null && falta > 0 && <> Para cerrar en 70 necesitas al menos <strong>{paraPasar}</strong> en el {falta}% que queda.</>}
            </p>
          </div>
        </div>
      )}

      {tab === 'calif' && (
        <div className="sd-body">
          <div className="kbv-card kbv-char-card">
            <SectionHead tight title="Calificaciones por rubro" meta="Cuánto pesa cada cosa y qué sacaste en cada una" />
            <div className="sd-rubros">
              {s.scheme.map((r, i) => (
                <div key={i} className="sd-rubro">
                  <div className="sr-head">
                    <span className="sr-name">{r.name}</span>
                    <span className="sr-weight">{r.weight}% del curso</span>
                    <span className={`sr-grade ${r.grade == null ? 'pend' : ''}`}>{r.grade != null ? r.grade : 'sin calificar'}</span>
                  </div>
                  <div className="kbv-progress" style={{ height: 5 }}>
                    <div className="fill" style={{ width: `${r.grade != null ? r.grade : 0}%`, background: r.grade == null ? 'var(--kb-border-strong)' : s.color }} />
                  </div>
                  <div className="sr-items">
                    {(r.items || []).map((it, j) => (
                      <div key={j} className={`sr-item ${it.g == null ? 'pend' : ''}`}>
                        <span className="si-n">{it.n}</span>
                        <span className="si-g">{it.g != null ? it.g : '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'pend' && (
        <div className="sd-body">
          <div className="kbv-card kbv-char-card">
            <SectionHead tight title="Pendientes de la materia" meta="Las mismas tareas del tablero — filtradas a esta materia" />
            {pend.length === 0
              ? <EmptyState compact icon="check" title="Nada pendiente" body="No debes nada de esta materia. Disfrútalo." />
              : (
                <div className="sd-tasks">
                  {pend.map(t => {
                    const ty = ATASK_TYPE[t.type] || ATASK_TYPE.entrega;
                    const pr = ATASK_PRIORITY[t.priority] || ATASK_PRIORITY.medium;
                    return (
                      <div key={t.id} className="sd-task" style={{ '--c': ty.c }}>
                        <span className="st-ico"><KIcon name={ty.icon} size={14} /></span>
                        <span className="st-txt"><strong>{t.title}</strong><em>{ty.l} · {t.est} · {t.desc}</em></span>
                        <span className="st-pri" style={{ '--p': pr.c }}>{pr.l}</span>
                        <span className={`st-due ${t.dleft <= 1 ? 'soon' : ''}`}>{t.date}<em>{t.dleft === 0 ? 'hoy' : t.dleft === 1 ? 'mañana' : `en ${t.dleft} días`}</em></span>
                      </div>
                    );
                  })}
                </div>
              )}
            <button type="button" className="subj-addtask" onClick={() => onAddTask(s)}><KIcon name="plus" size={11} /> Registrar tarea de esta materia</button>
          </div>
        </div>
      )}

      {tab === 'cal' && (
        <div className="sd-body">
          <div className="kbv-card kbv-char-card">
            <SectionHead tight title="Calendario de la materia" meta="Tus clases de la semana y las fechas que no se mueven" />
            <div className="sd-cal">
              <div className="sc-week">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                  <div key={d} className={`sc-day ${s.days.includes(d) ? 'on' : ''}`}>
                    <span className="scd-l">{d}</span>
                    {s.days.includes(d)
                      ? <span className="scd-cls">{s.time}<em>{s.dur}h · {s.room}</em></span>
                      : <span className="scd-off">—</span>}
                  </div>
                ))}
              </div>
              <div className="sc-dates">
                {(s.exams || []).map((x, i) => (
                  <div key={i} className="sc-date"><span className="scd-d">{x.d}</span><span className="scd-n">{x.n}</span></div>
                ))}
                {mine.filter(t => t.status !== 'done').map(t => (
                  <div key={t.id} className="sc-date task"><span className="scd-d">{t.date}</span><span className="scd-n">{t.title}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'notas' && (
        <div className="sd-body">
          <div className="kbv-card kbv-char-card">
            <SectionHead tight title="Apuntes" meta="Lo que escribiste de esta materia — se guarda también en tu Bóveda"
                         action={<button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }}>+ Nuevo apunte</button>} />
            {(s.notes || []).length === 0
              ? <EmptyState compact icon="edit" title="Sin apuntes" body="Lo que escribas aquí queda ligado a la materia y a tu Bóveda." />
              : (
                <div className="sd-notes">
                  {(s.notes || []).map(n => (
                    <article key={n.id} className="sd-note">
                      <header><strong>{n.title}</strong><span>{n.when}</span></header>
                      <p>{n.body}</p>
                    </article>
                  ))}
                </div>
              )}
          </div>
        </div>
      )}

      {tab === 'prof' && (
        <div className="sd-body">
          <div className="kbv-card kbv-char-card">
            <SectionHead tight title="Profesor" meta="Con quién la cursas y cómo trabaja" />
            {!prof
              ? <EmptyState compact icon="community" title="Sin profesor asignado" body="Asígnalo para tener sus horarios de asesoría a la mano." />
              : (
                <div className="sd-prof">
                  <span className="sp-av">{prof.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
                  <div className="sp-id">
                    <span className="sp-name">{prof.name}</span>
                    <span className="sp-stars">{'★'.repeat(prof.rating)}<span className="off">{'★'.repeat(5 - prof.rating)}</span></span>
                  </div>
                  <div className="sp-rows">
                    <div className="sp-row"><KIcon name="inbox" size={13} /><span>{prof.mail}</span></div>
                    <div className="sp-row"><KIcon name="clock" size={13} /><span>{prof.office}</span></div>
                  </div>
                  <p className="sp-style">{prof.style}</p>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════ ESCUELA ════════
function EstudioEscuelaV2() {
  const [subjects, setSubjects] = React.useState(SCHOOL_SUBJECTS_V2);
  const graded = subjects.map(s => schemeGrade(s.scheme)).filter(g => g.projected != null);
  const avg = graded.length ? Math.round(graded.reduce((a, g) => a + g.projected, 0) / graded.length) : null;
  const avgProgress = Math.round(subjects.reduce((a, s) => a + s.progress, 0) / Math.max(1, subjects.length));
  const today = new Date('2026-05-29'); const start = new Date(SCHOOL_SEMESTER_V2.start), end = new Date(SCHOOL_SEMESTER_V2.end);
  const semPct = Math.max(0, Math.min(100, Math.round((today - start) / (end - start) * 100)));
  const upcoming = ACADEMIC_TASKS.filter(t => !t.done && t.status !== 'done').length;

  const [askText, textDialog] = usePrompt();
  function addSubject() {
    askText({ title: 'Agregar materia', sub: 'Después le asignas profesor, horario y método de evaluación.', label: 'Nombre de la materia', placeholder: 'p. ej. Álgebra lineal, Historia del arte, Bases de datos…', onSubmit: (name) => reallyAddSubject(name) });
  }
  function reallyAddSubject(name) {
    if (!name || !name.trim()) return;
    setSubjects(ss => [...ss, { id: 'm' + Math.random().toString(36).slice(2, 5), name: name.trim(), professorId: null, modality: 'presencial', credits: 6, color: 'var(--kb-good-soft)', days: [], time: '', room: '', progress: 0, effort: 3, interest: 3, topics: [], scheme: [{ name: 'Exámenes', weight: 60, grade: null }, { name: 'Tareas', weight: 40, grade: null }] }]);
  }
  function addTask(s) { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'tareas', create: true, area: 'wisdom', subject: s.id } })); } catch (_) {} }

  const [openSubject, setOpenSubject] = React.useState(null);
  const current = subjects.find(x => x.id === openSubject);
  if (current) {
    return (
      <>
        {textDialog}
        <SubjectDetail subject={current} tasks={ACADEMIC_TASKS} onAddTask={addTask} onBack={() => setOpenSubject(null)} />
      </>
    );
  }

  return (
    <>
      {textDialog}
      {/* Semestre + indicadores académicos */}
      <div className="kbv-semester-card">
        <div className="sem-info">
          <span className="kbv-eyebrow">{SCHOOL_SEMESTER_V2.school}</span>
          <h3 className="kbv-h3" style={{ marginTop: 2 }}>{SCHOOL_SEMESTER_V2.name}</h3>
          <span className="kbv-meta">{SCHOOL_SEMESTER_V2.start} → {SCHOOL_SEMESTER_V2.end} · {SCHOOL_SEMESTER_V2.credits} créditos · {subjects.length} materias</span>
          <div className="sem-bar"><span style={{ width: `${semPct}%` }} /></div>
          <span className="kbv-meta">{semPct}% del semestre transcurrido</span>
        </div>
      </div>
      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-wisdom)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="label">Promedio en vivo</span><span className="kbv-kpi-icon" style={{ '--c': 'var(--area-wisdom)' }}><KIcon name="graduation" size={14} /></span></div>
          <span className="val">{avg != null ? avg : '—'}</span><span className="delta up">de tus materias calificadas</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}><span className="label">Avance general</span><span className="val">{avgProgress}<small>%</small></span><span className="delta">del temario cubierto</span></div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}><span className="label">Créditos</span><span className="val">{SCHOOL_SEMESTER_V2.credits}</span><span className="delta">{subjects.length} materias activas</span></div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-hp)' }}><span className="label">Pendientes</span><span className="val">{upcoming}</span><span className="delta">entregas y exámenes</span></div>
      </div>

      <div className="kbv-study-section-head">
        <h3 className="kbv-h3">Materias <span className="kbv-meta">({subjects.length})</span></h3>
        <button type="button" className="kbv-btn kbv-btn-primary" style={{ padding: '8px 12px', fontSize: 13 }} onClick={addSubject}><KIcon name="plus" size={13} /> Agregar materia</button>
      </div>
      <div className="kbv-subjects-grid">
        {subjects.map(s => {
          const g = schemeGrade(s.scheme); const mod = MODALITY_PILL_V2[s.modality] || { l: s.modality, c: 'var(--kb-text-3)' };
          const prof = s.professorId ? SCHOOL_PROFESSORS_V2[s.professorId] : null;
          return (
            <div key={s.id} className="kbv-subject-card open" style={{ '--c': s.color }}
                 role="button" tabIndex={0} title={`Abrir ${s.name}`}
                 onClick={() => setOpenSubject(s.id)}
                 onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); setOpenSubject(s.id); } }}>
              <div className="subj-head">
                <div className="subj-id">
                  <span className="subj-name">{s.name}</span>
                  <span className="subj-prof"><KIcon name="community" size={10} /> {prof ? prof.name : 'Sin profesor'}</span>
                </div>
                <span className="subj-grade">{g.projected != null ? g.projected : '—'}<small>/100</small></span>
              </div>
              <div className="subj-meta">
                <span className="subj-pill" style={{ '--mc': mod.c }}>{mod.l}</span>
                <span className="subj-tag">{s.credits} créd.</span>
                {s.days.length > 0 && <span className="subj-tag"><KIcon name="clock" size={9} /> {s.days.join('/')} {s.time}</span>}
                {s.room && <span className="subj-tag">{s.room}</span>}
              </div>
              {/* avance de la materia */}
              <div className="subj-progress">
                <div className="kbv-progress" style={{ height: 5 }}><div className="fill" style={{ width: `${s.progress}%`, background: s.color }} /></div>
                <span className="kbv-meta">{s.progress}% del temario</span>
              </div>
              {/* esquema de evaluación */}
              <div className="subj-evals">
                <span className="kbv-meta">Esquema de evaluación ({g.gradedWeight}% calificado)</span>
                {s.scheme.map((e, i) => (
                  <div key={i} className="subj-eval-row">
                    <span className="se-name">{e.name}</span><span className="se-weight">{e.weight}%</span>
                    <span className={`se-grade ${e.grade == null ? 'pend' : ''}`}>{e.grade != null ? e.grade : 'pend.'}</span>
                  </div>
                ))}
              </div>
              <button type="button" className="subj-addtask" onClick={(ev) => { ev.stopPropagation(); addTask(s); }}><KIcon name="plus" size={11} /> Registrar tarea de esta materia</button>
            </div>
          );
        })}
      </div>

      {/* Profesores de la escuela */}
      <div className="kbv-study-cols">
        <div className="kbv-card kbv-char-card">
          <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Profesores de esta escuela</h3><button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }}>+ Registrar</button></div>
          <div className="kbv-prof-list">
            {Object.entries(SCHOOL_PROFESSORS_V2).map(([id, p]) => (
              <div key={id} className="prof-row">
                <span className="pf-av">{p.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
                <div className="pf-info"><span className="pf-name">{p.name}</span><span className="pf-meta">{p.subject}</span></div>
                <span className="pf-stars">{'★'.repeat(p.rating)}<span className="off">{'★'.repeat(5 - p.rating)}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Métodos de evaluación (movido aquí desde Agenda) */}
        <div className="kbv-card kbv-char-card">
          <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Métodos de evaluación</h3><span className="kbv-meta">Cómo se califica cada materia</span></div>
          <div className="kbv-evals">
            {subjects.map(s => {
              const g = schemeGrade(s.scheme);
              return (
                <div key={s.id} className="ev-card" style={{ '--ec': s.color }}>
                  <div className="ev-head"><span className="ev-name">{s.name}</span><span className="ev-grade">{g.gradedWeight > 0 ? `${g.projected} pts` : 'Sin calif.'}<small>de {g.gradedWeight}%</small></span></div>
                  <div className="ev-bar">{s.scheme.map((it, i) => <span key={i} className={`seg ${it.grade == null ? 'pending' : ''}`} style={{ width: `${it.weight}%` }} title={`${it.name} · ${it.weight}%`} />)}</div>
                  <div className="ev-items">{s.scheme.map((it, i) => <span key={i} className="ev-item"><b>{it.name}</b> {it.weight}% {it.grade != null ? <em>· {it.grade}</em> : <em className="pend">· pend.</em>}</span>)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ════════ AGENDA ════════
const AGENDA_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Línea del tiempo semanal (estilo calendario): eje de horas + clases ubicadas
// por su hora de inicio. Sustituye al conjunto de tarjetas sueltas.
function AgendaTimeline({ subjects, onRate }) {
  const HOUR_PX = 78;
  const parse = (t) => { const [h, m] = String(t || '0:0').split(':').map(Number); return h + (m || 0) / 60; };
  const withTime = subjects.filter(s => s.days.length && s.time);
  const starts = withTime.map(s => parse(s.time));
  const ends = withTime.map(s => parse(s.time) + (s.dur || 1.5));
  const START = Math.floor(Math.min(...(starts.length ? starts : [16])));
  const END = Math.ceil(Math.max(...(ends.length ? ends : [21])));
  const hours = []; for (let h = START; h <= END; h++) hours.push(h);
  const bodyH = (END - START) * HOUR_PX;

  return (
    <div className="kbv-week-tl">
      <div className="wt-head">
        <span className="wt-corner" />
        {AGENDA_DAYS.map(d => <span key={d} className="wt-dayname">{d}</span>)}
      </div>
      <div className="wt-body" style={{ height: bodyH, '--hpx': HOUR_PX + 'px' }}>
        <div className="wt-axis">
          {hours.map(h => <span key={h} className="wt-hour" style={{ top: (h - START) * HOUR_PX }}>{String(h).padStart(2, '0')}:00</span>)}
        </div>
        {AGENDA_DAYS.map(day => {
          const todays = subjects.filter(s => s.days.includes(day) && s.time);
          return (
            <div key={day} className="wt-lane">
              {todays.map(s => {
                const prof = s.professorId ? SCHOOL_PROFESSORS_V2[s.professorId] : null;
                const top = (parse(s.time) - START) * HOUR_PX;
                const h = (s.dur || 1.5) * HOUR_PX;
                const endH = parse(s.time) + (s.dur || 1.5);
                return (
                  <div key={s.id} className="wt-class" style={{ top, minHeight: h - 6, '--c': s.color }}>
                    <span className="wtc-time">{s.time}–{String(Math.floor(endH)).padStart(2, '0')}:{String(Math.round((endH % 1) * 60)).padStart(2, '0')}</span>
                    <span className="wtc-name">{s.name}</span>
                    {prof && <span className="wtc-meta"><KIcon name="community" size={9} /> {prof.name}</span>}
                    {s.room && <span className="wtc-meta"><KIcon name="pin" size={9} /> {s.room}</span>}
                    {s.online && (
                      <a className="wtc-online" href={s.link || '#'} target="_blank" rel="noopener noreferrer" onClick={(e) => { if (!s.link) e.preventDefault(); }}>
                        <KIcon name="tv" size={10} /> Clase en línea <KIcon name="arrow-right" size={9} />
                      </a>
                    )}
                    <div className="wtc-rate">
                      <span className="wtr"><span>Esf.</span><StudyRubric level={s.effort} onChange={(v) => onRate(s.id, 'effort', v)} icon="wisdom" color="var(--area-community)" /></span>
                      <span className="wtr"><span>Int.</span><StudyRubric level={s.interest} onChange={(v) => onRate(s.id, 'interest', v)} icon="sparkle" color="var(--kb-coin)" /></span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EstudioAgendaV2() {
  const [subjects, setSubjects] = React.useState(SCHOOL_SUBJECTS_V2);
  // Las entregas y tareas SON las mismas del tablero de Tareas (área Sabiduría),
  // con el MISMO detalle (TaskDetailModal). Aquí solo se filtran las académicas.
  const academicSource = (typeof DEMO_TASKS_FULL !== 'undefined' ? DEMO_TASKS_FULL : []).filter(t => t.taskType);
  const [tasks, setTasks] = React.useState(academicSource);
  const [openTaskId, setOpenTaskId] = React.useState(null);
  function rate(id, key, val) { setSubjects(ss => ss.map(s => s.id === id ? { ...s, [key]: val } : s)); }
  function toggle(id) { setTasks(ts => ts.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t)); }
  const projName = (pid) => ((typeof DEMO_PROJECTS_FOR_FILTER !== 'undefined' ? DEMO_PROJECTS_FOR_FILTER : []).find(p => p.id === pid) || {}).name || 'Sabiduría';
  const sorted = [...tasks].sort((a, b) => ((a.status === 'done') - (b.status === 'done')) || ((a.dleft ?? 99) - (b.dleft ?? 99)));
  const openTask = tasks.find(t => t.id === openTaskId);

  return (
    <>
      {/* Horario de materias — línea del tiempo */}
      <div className="kbv-study-section-head">
        <h3 className="kbv-h3">Horario de materias</h3>
        <span className="kbv-meta">Lun–Sáb · línea del tiempo · profesor, salón, clase en línea y tu esfuerzo/interés</span>
      </div>
      <AgendaTimeline subjects={subjects} onRate={rate} />

      {/* Entregas y tareas = mismas tareas de la sección Tareas, mismo detalle */}
      <div className="kbv-study-section-head" style={{ marginTop: 10 }}>
        <div><h3 className="kbv-h3">Entregas y tareas</h3><span className="kbv-meta">Las mismas tareas de tu tablero (área Sabiduría) · toca una para el detalle completo</span></div>
        <button type="button" className="kbv-btn kbv-btn-primary" style={{ padding: '8px 12px', fontSize: 13 }} onClick={() => { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'tareas', create: true, area: 'wisdom' } })); } catch (_) {} }}><KIcon name="plus" size={13} /> Nueva tarea</button>
      </div>
      <div className="kbv-deadlines">
        {sorted.map(t => {
          const ty = ATASK_TYPE[t.taskType] || ATASK_TYPE.entrega; const urgent = t.status !== 'done' && (t.dleft ?? 99) <= 3;
          return (
            <div key={t.id} className={`dl-row clickable ${t.status === 'done' ? 'done' : ''} ${urgent ? 'urgent' : ''}`} onClick={() => setOpenTaskId(t.id)}>
              <span className="dl-check" onClick={(e) => { e.stopPropagation(); toggle(t.id); }} />
              <span className="dl-type" style={{ '--tc': ty.c }}><KIcon name={ty.icon} size={11} /> {ty.l}</span>
              <span className="dl-title">{t.title}<small className="dl-course"> · {projName(t.project)}</small></span>
              <span className="dl-date">{t.status === 'done' ? 'Entregado' : t.dleft === 0 ? 'Hoy' : `en ${t.dleft} d`}<small>{t.status !== 'done' && t.dueLabel ? ` · ${t.dueLabel}` : ''}</small></span>
              <KIcon name="arrow-right" size={13} />
            </div>
          );
        })}
      </div>
      {openTask && typeof TaskDetailModal === 'function' && (
        <TaskDetailModal task={openTask} onClose={() => setOpenTaskId(null)} onSave={(u) => setTasks(ts => ts.map(x => x.id === u.id ? u : x))} />
      )}
    </>
  );
}

// ════════ TRAYECTORIA ════════
function EstudioTrayectoriaV2({ courses = [] }) {
  const topByTime = courses.slice().sort((a, b) => (b.doneHrs || 0) - (a.doneHrs || 0))[0];
  const totalHrs = courses.reduce((a, c) => a + (c.doneHrs || 0), 0);
  const activeNow = courses.filter(c => !c.done).length;
  const completed = courses.filter(c => c.done).length;

  const ranking = [
    { name: 'System Design', xp: 320, color: '#2D4A3A' }, { name: 'UX / Producto', xp: 280, color: '#A435F0' },
    { name: 'Machine Learning', xp: 220, color: '#0056D2' }, { name: 'iOS · Swift', xp: 180, color: '#98CA3F' },
    { name: 'Matemáticas', xp: 150, color: 'var(--area-community)' }, { name: 'Hábitos / lectura', xp: 80, color: '#1B2A60' },
  ].sort((a, b) => b.xp - a.xp);
  const maxXp = ranking[0].xp;
  // distribución de esfuerzo por área de interés (radar simplificado → barras)
  const effortAreas = [
    { name: 'Sistemas', pct: 85, color: '#2D4A3A' }, { name: 'Matemáticas', pct: 70, color: 'var(--area-community)' },
    { name: 'Producto/UX', pct: 55, color: '#A435F0' }, { name: 'ML / datos', pct: 48, color: '#0056D2' },
    { name: 'Idiomas', pct: 30, color: 'var(--kb-gem)' },
  ];
  const hoursTrend = [4.2, 5.1, 6.8, 5.9, 7.4, 8.1, 9.4];
  const maxH = Math.max(...hoursTrend);

  return (
    <>
      {/* Indicadores cabecera */}
      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-wisdom)' }}><span className="label">Horas totales</span><span className="val">{totalHrs.toFixed(0)}<small> h</small></span><span className="delta">registradas en estudio</span></div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}><span className="label">Cursos completados</span><span className="val">{completed}</span><span className="delta">{activeNow} en curso ahora</span></div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}><span className="label">Más foco en</span><span className="val" style={{ fontSize: 17 }}>{topByTime ? topByTime.name : '—'}</span><span className="delta">{topByTime ? topByTime.doneHrs + ' h' : ''}</span></div>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-community)' }}><span className="label">Disciplina top</span><span className="val" style={{ fontSize: 17 }}>{ranking[0].name}</span><span className="delta">+{ranking[0].xp} XP</span></div>
      </div>

      <div className="kbv-study-cols tri">
        {/* Ranking de conocimiento */}
        <div className="kbv-card kbv-char-card">
          <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Ranking de conocimiento</h3><span className="kbv-meta">XP por disciplina</span></div>
          <div className="kbv-rank">
            {ranking.map((r, i) => (
              <div key={r.name} className="rank-row">
                <span className="rk-pos">{i + 1}</span>
                <div className="rk-body"><div className="rk-head"><span className="rk-name">{r.name}</span><span className="rk-xp">+{r.xp} XP</span></div><div className="rk-bar"><span style={{ width: `${(r.xp / maxXp) * 100}%`, background: r.color }} /></div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución de esfuerzo por interés */}
        <div className="kbv-card kbv-char-card">
          <div className="kbv-study-section-head tight"><h3 className="kbv-h3">¿Dónde pones el esfuerzo?</h3><span className="kbv-meta">Por área de interés</span></div>
          <div className="kbv-effort-areas">
            {effortAreas.map(e => (
              <div key={e.name} className="ea-row">
                <span className="ea-name">{e.name}</span>
                <div className="ea-track"><span style={{ width: `${e.pct}%`, background: e.color }} /></div>
                <span className="ea-pct">{e.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tendencia de horas */}
        <div className="kbv-card kbv-char-card">
          <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Horas de estudio</h3><span className="kbv-meta">Últimas 7 semanas</span></div>
          <div className="kbv-hours-trend">
            {hoursTrend.map((h, i) => (
              <div key={i} className="ht-bar" title={`${h} h`}>
                <div className="ht-track"><div className="ht-fill" style={{ height: `${(h / maxH) * 100}%` }} /></div>
                <span className="ht-l">S{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="kbv-knowledge-top" style={{ marginTop: 10, gridTemplateColumns: '1fr 1fr' }}>
            <div className="kt-cell"><span className="kt-v">{hoursTrend[hoursTrend.length - 1]}<small> h</small></span><span className="kt-l">esta semana</span></div>
            <div className="kt-cell"><span className="kt-v">+{Math.round((hoursTrend[6] - hoursTrend[5]) / hoursTrend[5] * 100)}<small>%</small></span><span className="kt-l">vs semana previa</span></div>
          </div>
        </div>
      </div>

      {/* Escuelas e instituciones */}
      <div className="kbv-card kbv-char-card">
        <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Escuelas e instituciones</h3><button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }}>+ Agregar</button></div>
        <div className="kbv-school-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
          {(typeof STUDY_SCHOOLS !== 'undefined' ? STUDY_SCHOOLS : []).map(s => (
            <div key={s.id} className="school-row">
              <span className="sc-ico"><KIcon name="graduation" size={15} /></span>
              <div className="sc-info"><span className="sc-name">{s.name}</span><span className="sc-meta">{s.kind} · {s.period}</span></div>
              <span className={`sc-status ${s.status === 'Activo' ? 'on' : ''}`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { EstudioEscuelaV2, EstudioAgendaV2, EstudioTrayectoriaV2 });
