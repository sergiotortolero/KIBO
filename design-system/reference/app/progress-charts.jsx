// progress-charts.jsx — Primitivas de gráficos + filtro de periodo reutilizable.
// Estándar de toda la app: <PeriodFilter> reusa el patrón de Finanzas (.kbv-fin-period
// + .range-tabs). Los datos responden al periodo seleccionado. Todos los gráficos
// llevan padding interno para no pegarse a los bordes.

// ── Periodos estándar ──────────────────────────────────────────
const KB_PERIODS = [
  { id: '7d',   l: 'Semana',   days: 7,   note: 'Últimos 7 días',     n: 7,  unitLabel: 'día' },
  { id: '30d',  l: 'Mes',      days: 30,  note: 'Últimos 30 días',    n: 30, unitLabel: 'día' },
  { id: '90d',  l: '3 meses',  days: 90,  note: 'Últimos 90 días',    n: 13, unitLabel: 'semana' },
  { id: '365d', l: 'Año',      days: 365, note: 'Últimos 12 meses',   n: 12, unitLabel: 'mes' },
  { id: 'all',  l: 'Todo',     days: 730, note: 'Histórico completo', n: 24, unitLabel: 'mes' },
];
function periodMeta(id) { return KB_PERIODS.find(p => p.id === id) || KB_PERIODS[1]; }

function usePeriod(initial = '30d') {
  const [period, setPeriod] = React.useState(initial);
  return [period, setPeriod, periodMeta(period)];
}

// Filtro de periodo — reutilizable. Mismo lenguaje visual que Finanzas.
function PeriodFilter({ period, onChange, label = 'Periodo de los indicadores', periods = KB_PERIODS, note }) {
  const meta = periodMeta(period);
  return (
    <div className="kbv-fin-period kbv-period-filter">
      <span className="kbv-meta"><KIcon name="calendar" size={13} /> {label}</span>
      <div className="range-tabs">
        {periods.map(p => (
          <button key={p.id} className={period === p.id ? 'on' : ''} onClick={() => onChange(p.id)}>{p.l}</button>
        ))}
      </div>
      <span className="kbv-meta period-note">{note || meta.note}</span>
    </div>
  );
}

// ── Datos sintéticos deterministas ─────────────────────────────
function mulberry(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DOW_ES = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// Genera una serie acorde al periodo. base=valor medio aprox, growth=tendencia.
function genSeries(period, { seed = 7, base = 300, growth = 0.18, vol = 0.28 } = {}) {
  const meta = periodMeta(period);
  const n = meta.n;
  const rnd = mulberry(seed + n * 13);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const trend = base * (1 + growth * (i / Math.max(1, n - 1)));
    const noise = 1 + (rnd() - 0.5) * 2 * vol;
    const v = Math.max(0, Math.round(trend * noise));
    pts.push({ i, v, label: pointLabel(meta, i, n) });
  }
  const max = Math.max(...pts.map(p => p.v), 1);
  const total = pts.reduce((s, p) => s + p.v, 0);
  return { points: pts, max, total, meta };
}

function pointLabel(meta, i, n) {
  if (meta.id === '7d') {
    const today = 4; // demo: hoy = viernes-ish
    return DOW_ES[(today - (n - 1 - i) % 7 + 70) % 7];
  }
  if (meta.id === '30d') return `D${i + 1}`;
  if (meta.id === '90d') return `S${i + 1}`;
  // mensual
  const startM = (5 - (n - 1)) % 12; // termina en may (4)
  const m = ((startM + i) % 12 + 12) % 12;
  return MONTHS_ES[m];
}

// ── LineChart / AreaChart ──────────────────────────────────────
function LineChart({ series, color = 'var(--kb-primary)', height = 160, unit = '', area = true, cumulative = false, projection = 0, projectionLabel }) {
  const data = cumulative ? toCumulative(series.points) : series.points;
  const W = 520, H = height;
  const padL = 40, padR = 16, padT = 16, padB = 26;
  const vals = data.map(d => d.v);
  let projPts = [];
  if (projection > 0 && data.length >= 2) {
    const last = data[data.length - 1].v;
    const slope = (data[data.length - 1].v - data[Math.max(0, data.length - 4)].v) / Math.min(4, data.length - 1);
    for (let k = 1; k <= projection; k++) projPts.push(Math.max(0, last + slope * k));
  }
  const maxV = Math.max(...vals, ...projPts, 1);
  const totalN = data.length + projPts.length;
  const x = (i) => padL + (i / Math.max(1, totalN - 1)) * (W - padL - padR);
  const y = (v) => padT + (1 - v / maxV) * (H - padT - padB);

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.v).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${x(data.length - 1).toFixed(1)} ${H - padB} L ${x(0).toFixed(1)} ${H - padB} Z`;
  const projPath = projPts.length
    ? `M ${x(data.length - 1)} ${y(data[data.length - 1].v)} ` + projPts.map((v, k) => `L ${x(data.length + k).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
    : '';

  const uid = React.useMemo(() => 'lc' + Math.random().toString(36).slice(2, 7), []);
  // ticks X — máximo ~7 etiquetas
  const step = Math.max(1, Math.ceil(data.length / 7));
  const lastIdx = data.length - 1;

  return (
    <div className="kbv-linechart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H}>
        <defs>
          <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.26" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* gridlines horizontales */}
        {[0, 0.5, 1].map(g => (
          <line key={g} x1={padL} x2={W - padR} y1={padT + g * (H - padT - padB)} y2={padT + g * (H - padT - padB)} stroke="var(--kb-border)" strokeWidth="1" strokeDasharray={g === 1 ? '0' : '3 4'} opacity={g === 1 ? 1 : 0.6} />
        ))}
        {/* etiquetas Y */}
        <text x={padL - 8} y={padT + 4} textAnchor="end" className="kbv-chart-axis">{fmtN(maxV)}{unit}</text>
        <text x={padL - 8} y={H - padB} textAnchor="end" className="kbv-chart-axis">0</text>
        {area && <path d={areaPath} fill={`url(#${uid})`} />}
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        {projPath && <path d={projPath} fill="none" stroke={color} strokeWidth="2" strokeDasharray="5 5" opacity="0.7" />}
        {/* punto final */}
        <circle cx={x(lastIdx)} cy={y(data[lastIdx].v)} r="3.6" fill="var(--kb-card)" stroke={color} strokeWidth="2.4" />
        {projPts.length > 0 && (
          <circle cx={x(data.length + projPts.length - 1)} cy={y(projPts[projPts.length - 1])} r="3.2" fill={color} opacity="0.7" />
        )}
        {/* etiquetas X */}
        {data.map((d, i) => (i % step === 0 || i === lastIdx) ? (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="kbv-chart-axis">{d.label}</text>
        ) : null)}
      </svg>
      {projectionLabel && projPts.length > 0 && (
        <div className="kbv-chart-proj-note"><span className="dash" style={{ '--c': color }} /> {projectionLabel}</div>
      )}
    </div>
  );
}

function toCumulative(points) {
  let acc = 0;
  return points.map(p => ({ ...p, v: (acc += p.v) }));
}
function fmtN(n) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k';
  return String(Math.round(n));
}

// ── Heatmap de consistencia (estilo GitHub, etiquetado por tiempo) ──
function ConsistencyHeatmap({ period }) {
  const meta = periodMeta(period);
  // Mapa de hábito estable: siempre últimas ~26 semanas (6 meses), no el periodo.
  const weeks = 26;
  const rnd = mulberry(weeks * 31 + 9);
  const cells = []; // [{week, dow, level, date}]
  // fecha final = hoy (demo: vie 29 may 2026)
  const end = new Date(2026, 4, 29);
  const totalDays = weeks * 7;
  for (let d = 0; d < totalDays; d++) {
    const date = new Date(end);
    date.setDate(end.getDate() - (totalDays - 1 - d));
    const seed = rnd();
    const future = date > end;
    const level = future ? -1 : seed > 0.80 ? 0 : seed > 0.62 ? 1 : seed > 0.40 ? 2 : seed > 0.18 ? 3 : 4;
    const week = Math.floor(d / 7);
    const dow = (date.getDay() + 6) % 7; // 0=Lun
    cells.push({ d, week, dow, level, date });
  }
  // etiquetas de mes en la primera fila de cada cambio de mes
  const monthMarks = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const first = cells.find(c => c.week === w && c.dow === 0) || cells.find(c => c.week === w);
    if (first) {
      const m = first.date.getMonth();
      if (m !== lastMonth) { monthMarks.push({ week: w, label: MONTHS_ES[m] }); lastMonth = m; }
    }
  }
  const activeDays = cells.filter(c => c.level > 0).length;
  const trackedDays = cells.filter(c => c.level >= 0).length;

  return (
    <div className="kbv-heatmap-wrap">
      <div className="kbv-heatmap-scroll">
        <div className="hm-top">
          <span className="hm-corner" />
          <div className="hm-months">
            {Array.from({ length: weeks }).map((_, w) => {
              const mk = monthMarks.find(m => m.week === w);
              return <span key={w} className="hm-month">{mk ? mk.label : ''}</span>;
            })}
          </div>
        </div>
        <div className="hm-body">
          <div className="hm-dows">
            {DOW_ES.map((d, i) => <span key={i} className={i % 2 === 1 ? 'show' : ''}>{i % 2 === 1 ? d : ''}</span>)}
          </div>
          <div className="hm-weeks">
            {Array.from({ length: weeks }).map((_, w) => (
              <div key={w} className="hm-week">
                {Array.from({ length: 7 }).map((_, row) => {
                  const c = cells.find(x => x.week === w && x.dow === row);
                  if (!c || c.level < 0) return <span key={row} className="hc empty" />;
                  return <span key={row} className={`hc l${c.level}`} title={`${c.date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })} · ${['sin actividad', 'baja', 'media', 'alta', 'máxima'][c.level]}`} />;
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="kbv-heatmap-foot">
        <span className="hm-caption">Cada cuadro es <strong>un día</strong> · cada columna, una <strong>semana</strong> · <strong>últimos 6 meses</strong>. Entre más verde, más actividad.</span>
        <span className="kbv-heat-legend">
          <span>Menos</span>
          {[0, 1, 2, 3, 4].map(l => <span key={l} className={`hc l${l}`} />)}
          <span>Más</span>
        </span>
      </div>
      <div className="kbv-heatmap-stat">{activeDays} días activos de {trackedDays} · {Math.round((activeDays / Math.max(1, trackedDays)) * 100)}% del periodo</div>
    </div>
  );
}

// ── Perfil por día de la semana (¿qué día rindes más?) ─────────
function genWeekdayProfile(period, seed = 19) {
  const rnd = mulberry((periodMeta(period).days) + seed);
  // patrón realista: entre semana alto, baja el fin
  const base = [0.82, 0.9, 0.86, 0.94, 0.78, 0.55, 0.6];
  const vals = base.map(b => Math.round((b + (rnd() - 0.5) * 0.18) * 100));
  const max = Math.max(...vals);
  const bestIdx = vals.indexOf(max);
  return { vals, max, bestIdx };
}

function WeekdayBars({ period, color = 'var(--kb-primary)' }) {
  const { vals, max, bestIdx } = genWeekdayProfile(period);
  const full = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return (
    <div className="kbv-weekday">
      <div className="kbv-weekday-bars">
        {vals.map((v, i) => (
          <div key={i} className={`wd-col ${i === bestIdx ? 'best' : ''}`} title={`${full[i]} · índice ${v}`}>
            <span className="wd-bar" style={{ height: `${(v / max) * 100}%`, background: i === bestIdx ? 'linear-gradient(180deg, var(--kb-coin), color-mix(in oklab, var(--kb-coin) 78%, var(--kb-text)))' : `linear-gradient(180deg, ${color}, color-mix(in oklab, ${color} 55%, var(--kb-canvas)))` }} />
            <span className="wd-lbl">{DOW_ES[i]}</span>
          </div>
        ))}
      </div>
      <span className="kbv-weekday-note">Tu mejor día suele ser <strong>{full[bestIdx]}</strong> · el fin de semana bajas el ritmo.</span>
    </div>
  );
}

// ── Barras (XP por semana / por día) ────────────────────────
function BarsChart({ series, color = 'var(--kb-primary)', height = 120, unit = 'XP' }) {
  const pts = series.points;
  const max = series.max;
  const step = Math.max(1, Math.ceil(pts.length / 8));
  return (
    <div className="kbv-bars-chart" style={{ height }}>
      <div className="bars-row">
        {pts.map((p, i) => (
          <div key={i} className="bar-col" title={`${p.label}: ${p.v} ${unit}`}>
            <span className="bar" style={{ height: `${(p.v / max) * 100}%`, background: `linear-gradient(180deg, ${color}, color-mix(in oklab, ${color} 55%, var(--kb-canvas)))` }} />
          </div>
        ))}
      </div>
      <div className="bars-axis">
        {pts.map((p, i) => <span key={i} className="bx">{(i % step === 0 || i === pts.length - 1) ? p.label : ''}</span>)}
      </div>
    </div>
  );
}

Object.assign(window, {
  KB_PERIODS, periodMeta, usePeriod, PeriodFilter,
  genSeries, LineChart, BarsChart, ConsistencyHeatmap, WeekdayBars, genWeekdayProfile, MONTHS_ES, DOW_ES,
  fmtN, mulberry, toCumulative,
});
