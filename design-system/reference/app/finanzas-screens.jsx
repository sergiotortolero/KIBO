// finanzas-screens.jsx — Finanzas multi-pantalla
// Resumen · Cuentas · Créditos · Proyectos · Importar
// Reemplaza FinanzasScreen embebido en screens-v2.jsx

// ─────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────

const INFLATION_ANNUAL = 4.5; // % anual — México
const INFLATION_MONTHLY = INFLATION_ANNUAL / 12;

const ACCOUNT_TYPES_FULL = {
  debit:      { label: 'Débito',     icon: 'wealth', color: 'var(--area-wisdom)', desc: 'Cuenta de banco para uso diario.' },
  savings:    { label: 'Ahorro',     icon: 'shield', color: 'var(--kb-primary)', desc: 'Apartado para metas o emergencia. Puede dar rendimiento.' },
  investment: { label: 'Inversión',  icon: 'wealth', color: 'var(--area-community)', desc: 'Posiciones en fondos, acciones, cetes, etc.' },
  cash:       { label: 'Efectivo',   icon: 'shop',   color: 'var(--kb-good-soft)', desc: 'Billetera física. Se deprecia con inflación.' },
};

const CREDIT_TYPES_FULL = {
  'credit-card': { label: 'Tarjeta crédito',  icon: 'wealth', color: 'var(--kb-gem)' },
  'mortgage':    { label: 'Hipoteca',         icon: 'home',   color: 'var(--kb-hp)' },
  'online-loan': { label: 'Préstamo online',  icon: 'alert',  color: 'var(--pri-high)' },
  'auto-loan':   { label: 'Crédito auto',     icon: 'film',   color: 'var(--kb-coin-ink)' },
  'personal':    { label: 'Préstamo personal',icon: 'user',   color: 'var(--area-community)' },
};

const FIN_TX_DEMO = [
  { id: 'tx1', name: 'Salario Mayo',         catId: 'salary',     amt: 38500, kind: 'income',  date: '2026-05-28', accountId: 'a1', src: 'manual', notes: 'Depósito quincenal' },
  { id: 'tx2', name: 'Renta departamento',   catId: 'housing',    amt: -12500,kind: 'expense', date: '2026-05-25', accountId: 'a1', src: 'email',  notes: 'Pago a casero' },
  { id: 'tx3', name: 'Supermercado',         catId: 'food',       amt: -2840, kind: 'expense', date: '2026-05-24', accountId: 'a1', src: 'manual' },
  { id: 'tx4', name: 'Side project · pago',  catId: 'side',       amt: 6000,  kind: 'income',  date: '2026-05-22', accountId: 'a1', src: 'notif',  notes: 'Cliente Aurora' },
  { id: 'tx5', name: 'Netflix + Spotify',    catId: 'subs',       amt: -549,  kind: 'expense', date: '2026-05-21', accountId: 'c1', src: 'email' },
  { id: 'tx6', name: 'Café',                 catId: 'food',       amt: -120,  kind: 'expense', date: '2026-05-21', accountId: 'a3', src: 'manual' },
  { id: 'tx7', name: 'Uber',                 catId: 'transport',  amt: -380,  kind: 'expense', date: '2026-05-20', accountId: 'c1', src: 'notif' },
  { id: 'tx8', name: 'Pago tarjeta',         catId: 'transfer',   amt: -8000, kind: 'expense', date: '2026-05-15', accountId: 'a1', src: 'manual', notes: 'Pago a TC BBVA' },
  { id: 'tx9', name: 'Aporte fondo emerg',   catId: 'transfer',   amt: -4500, kind: 'expense', date: '2026-05-15', accountId: 'a1', src: 'manual', notes: 'Auto-ahorro Nu' },
  { id: 'tx10', name: 'Rendimiento Nu',      catId: 'interest',   amt: 412,   kind: 'income',  date: '2026-05-31', accountId: 'a2', src: 'manual', notes: '10.5% CAT' },
  { id: 'tx11', name: 'Farmacia',            catId: 'health',     amt: -340,  kind: 'expense', date: '2026-05-19', accountId: 'c1', src: 'email' },
  { id: 'tx12', name: 'Cena con amigos',     catId: 'fun',        amt: -680,  kind: 'expense', date: '2026-05-18', accountId: 'c1', src: 'notif' },
];

const FIN_CATEGORIES = {
  salary:    { name: 'Salario',          icon: 'shop',    color: 'var(--kb-primary)' },
  side:      { name: 'Side income',      icon: 'sparkle', color: 'var(--kb-good-soft)' },
  interest:  { name: 'Rendimiento',      icon: 'wealth',  color: 'var(--area-community)' },
  housing:   { name: 'Casa',             icon: 'home',    color: 'var(--kb-hp)' },
  food:      { name: 'Comida',           icon: 'shop',    color: 'var(--pri-high)' },
  transport: { name: 'Transporte',       icon: 'film',    color: 'var(--kb-gem)' },
  subs:      { name: 'Suscripciones',    icon: 'film',    color: 'var(--area-community)' },
  health:    { name: 'Salud',            icon: 'sparkle', color: 'var(--kb-primary)' },
  fun:       { name: 'Ocio',             icon: 'sparkle', color: 'var(--kb-coin)' },
  transfer:  { name: 'Transferencia',    icon: 'arrow-right', color: 'var(--pri-vlow)' },
  other:     { name: 'Otro',             icon: 'layers',  color: 'var(--pri-vlow)' },
};

const FIN_ACCOUNTS_DEMO = [
  { id: 'a1', name: 'BBVA · Débito',  type: 'debit',      bank: 'BBVA',     last4: '4521', balance: 18420, color: '#0040A8', linked: true,  apy: 0,    holdings: null, openedAt: '2024-01-15' },
  { id: 'a2', name: 'Nu · Cuenta',    type: 'savings',    bank: 'Nu',       last4: '8821', balance: 48200, color: '#820AD1', linked: true,  apy: 10.5, holdings: null, openedAt: '2024-06-10' },
  { id: 'a3', name: 'Efectivo',       type: 'cash',       bank: null,       last4: null,   balance: 5800,  color: 'var(--kb-primary)', linked: false, apy: 0,    holdings: null, openedAt: null, isCash: true },
  { id: 'a4', name: 'GBM · Acciones', type: 'investment', bank: 'GBM',      last4: null,   balance: 32400, color: '#000000', linked: true,  apy: 7.8,  holdings: [
    { sym: 'CETES28', name: 'CETES 28d',   weight: 40, perf: 0.10 },
    { sym: 'NAFTRAC', name: 'NAFTRAC IPC', weight: 35, perf: 0.04 },
    { sym: 'IVVPESOMX', name: 'iShares S&P 500', weight: 25, perf: 0.21 },
  ], openedAt: '2025-02-20' },
];

const FIN_CREDITS_DEMO = [
  { id: 'c1', name: 'Tarjeta Oro · BBVA',  type: 'credit-card', bank: 'BBVA',    balance: -14200, limit: 60000,  dueDay: 15, apr: 36.5, color: '#0040A8', linked: true,  interestPaidYTD: 2840,  capitalPaidYTD: 18600, minPayment: 1820 },
  { id: 'c2', name: 'Hipoteca · Banorte',  type: 'mortgage',    bank: 'Banorte', balance: -1240000, limit: 1500000, dueDay: 5, apr: 9.8, color: 'var(--kb-hp)', linked: true,  interestPaidYTD: 41200, capitalPaidYTD: 8420,  minPayment: 12400 },
  { id: 'c3', name: 'Kueski · préstamo',   type: 'online-loan', bank: 'Kueski', balance: -8500, limit: 15000, dueDay: 20, apr: 78,  color: 'var(--pri-high)', linked: false, interestPaidYTD: 3120, capitalPaidYTD: 2400, minPayment: 1800 },
];

const FIN_SUBSCRIPTIONS_DEMO = [
  { id: 's1', name: 'Netflix',          amt: 219,   account: 'TC Oro · BBVA',  day: 5,  icon: 'film',    color: '#E50914', kind: 'Entretenimiento' },
  { id: 's2', name: 'Spotify',          amt: 115,   account: 'TC Oro · BBVA',  day: 8,  icon: 'sparkle', color: '#1DB954', kind: 'Música' },
  { id: 's3', name: 'Xbox Game Pass',   amt: 299,   account: 'TC Oro · BBVA',  day: 12, icon: 'sparkle', color: '#107C10', kind: 'Gaming' },
  { id: 's4', name: 'Teléfono celular', amt: 399,   account: 'BBVA · Débito',  day: 1,  icon: 'alert',   color: 'var(--kb-gem)', kind: 'Servicio' },
  { id: 's5', name: 'Luz · CFE',        amt: 680,   account: 'BBVA · Débito',  day: 18, icon: 'home',    color: 'var(--kb-coin)', kind: 'Hogar' },
  { id: 's6', name: 'Renta',            amt: 12500, account: 'BBVA · Débito',  day: 1,  icon: 'home',    color: 'var(--kb-hp)', kind: 'Hogar' },
];

const FIN_SAVING_PROJECTS = [
  { id: 'fp1', name: 'Fondo de emergencia', icon: 'shield', color: 'var(--kb-primary)', accountId: 'a2', current: 58200, target: 75000, monthly: 4500, projDate: 'Sep 2026', desc: '6 meses de gastos básicos como colchón.',  history: [12000, 18500, 25000, 35000, 44000, 50000, 58200] },
  { id: 'fp2', name: 'Viaje Japón 2026',    icon: 'film',   color: 'var(--kb-coin)', accountId: 'a2', current: 12400, target: 40000, monthly: 3000, projDate: 'Oct 2026', desc: '2 semanas con colchón para imprevistos.', history: [0, 1500, 3000, 5500, 8000, 10000, 12400] },
  { id: 'fp3', name: 'Cambio de auto',      icon: 'film',   color: 'var(--kb-gem)', accountId: 'a4', current: 84000, target: 280000, monthly: 8000, projDate: 'Jul 2028', desc: 'Enganche + reserva.', history: [40000, 50000, 60000, 68000, 75000, 80000, 84000] },
];

const BUDGET_V2 = [
  { catId: 'housing',   used: 12500, limit: 13000 },
  { catId: 'food',      used: 3960,  limit: 5000 },
  { catId: 'transport', used: 1240,  limit: 1500 },
  { catId: 'subs',      used: 549,   limit: 600 },
  { catId: 'fun',       used: 1380,  limit: 1200 },
  { catId: 'health',    used: 420,   limit: 1000 },
];

// ─────────────────────────────────────────────────────────────
// Pequeños SVG sparkline & area charts
// ─────────────────────────────────────────────────────────────
function Sparkline({ data, color = 'var(--kb-primary)', height = 36, fill = true }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const W = 100, H = 100;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1 || 1)) * W;
    const y = H - ((v - min) / range) * H;
    return [x, y];
  });
  const path = 'M ' + pts.map(p => `${p[0]} ${p[1]}`).join(' L ');
  const area = path + ` L ${W} ${H} L 0 ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
      {fill && <path d={area} fill={color} opacity="0.18" />}
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function BarChart({ data, color = 'var(--kb-primary)', height = 80, labels }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  return (
    <div className="kbv-barchart" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="bar-wrap" title={`${labels?.[i] || ''}: ${v}`}>
          <div className="bar" style={{ height: `${(v / max) * 100}%`, background: color }} />
          {labels && <span className="lbl">{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

function StackedFlow({ months, income, expense, height = 120 }) {
  const N = months.length;
  const allVals = [...income, ...expense];
  const max = Math.max(...allVals, 1);
  return (
    <div className="kbv-stacked-flow" style={{ height }}>
      {months.map((m, i) => (
        <div key={i} className="month-col" title={`${m}: +${income[i]} / -${expense[i]}`}>
          <div className="bars">
            <div className="bar inc" style={{ height: `${(income[i] / max) * 100}%` }} />
            <div className="bar exp" style={{ height: `${(expense[i] / max) * 100}%` }} />
          </div>
          <span className="lbl">{m}</span>
        </div>
      ))}
    </div>
  );
}


// ── Gráficos de Finanzas con ejes ────────────────────────────────
// Las gráficas de esta pantalla no decían QUÉ medían: sin eje Y (¿pesos?
// ¿miles?), sin eje X (¿qué mes es cada barra?) y a 120px de alto. El texto
// va en HTML sobre el trazo, no dentro del SVG: estos lienzos se estiran
// (`preserveAspectRatio="none"`) y ahí dentro la tipografía se deforma.
const FIN_MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const FIN_END_MONTH = 4; // demo: la serie termina en mayo

function finMonthLabels(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(FIN_MONTHS[((FIN_END_MONTH - i) % 12 + 12) % 12]);
  return out;
}

// Serie mensual determinista que ATERRIZA en el valor real de hoy.
function finSeries(n, { seed = 7, end = 1000, growth = 0.5, vol = 0.13 } = {}) {
  const rnd = typeof mulberry === 'function' ? mulberry(seed + n * 17) : () => 0.5;
  // Restar sobre el VALOR ABSOLUTO, no dividir: con un patrimonio negativo
  // (hipoteca > activos) dividir invierte la pendiente y el hoyo aparece
  // creciendo. Así la serie siempre viene «de peor a hoy», tenga el signo
  // que tenga.
  const start = end - Math.abs(end) * growth;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 1 : i / (n - 1);
    const noise = 1 + (rnd() - 0.5) * 2 * vol * (1 - t * 0.55);
    pts.push(Math.round((start + (end - start) * t) * noise));
  }
  pts[n - 1] = Math.round(end);
  return pts;
}

// Cifra grande partida en número + unidad, para las tarjetas que estilan el
// sufijo aparte (`<small>`). «$1263K» no se lee: a partir del millón, M.
function finBig(v) {
  const a = Math.abs(v), sg = v < 0 ? '−' : '';
  if (a >= 1000000) return { n: sg + '$' + (a / 1000000).toFixed(2).replace(/0$/, ''), u: 'M' };
  if (a >= 1000) return { n: sg + '$' + Math.round(a / 1000), u: 'K' };
  return { n: sg + '$' + Math.round(a), u: '' };
}

function finMoney(v) {
  const a = Math.abs(v);
  const sg = v < 0 ? '−' : '';
  if (a >= 1000000) return sg + '$' + (a / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (a >= 1000) return sg + '$' + (a / 1000).toFixed(a >= 10000 ? 0 : 1).replace('.0', '') + 'K';
  return sg + '$' + Math.round(a);
}

// Recta de mínimos cuadrados: la tendencia sobre las barras.
function finTrend(vals) {
  const n = vals.length;
  if (n < 2) return null;
  let sx = 0, sy = 0, sxy = 0, sxx = 0;
  vals.forEach((v, i) => { sx += i; sy += v; sxy += i * v; sxx += i * i; });
  const m = (n * sxy - sx * sy) / Math.max(1e-6, n * sxx - sx * sx);
  const b = (sy - m * sx) / n;
  return { from: b, to: b + m * (n - 1) };
}

// Marco común: eje Y rotulado a la izquierda, eje X debajo, rejilla al fondo.
function FinChartFrame({ height = 200, ticks, xLabels, dense, children, footer }) {
  const step = Math.max(1, Math.ceil(xLabels.length / (dense ? 12 : 7)));
  return (
    <div className="kbv-fchart">
      <div className="fc-body" style={{ height }}>
        <div className="fc-y">
          {ticks.map((t, k) => <span key={k} style={{ top: `${t.pct}%` }}>{t.label}</span>)}
        </div>
        <div className="fc-plot">
          {ticks.map((t, k) => <i key={k} className={`fc-grid${t.zero ? ' zero' : ''}`} style={{ top: `${t.pct}%` }} />)}
          {children}
        </div>
      </div>
      <div className="fc-x">
        {xLabels.map((l, i) => (
          <span key={i} className={(i % step === 0 || i === xLabels.length - 1) ? '' : 'muted'}>
            {(i % step === 0 || i === xLabels.length - 1) ? l : ''}
          </span>
        ))}
      </div>
      {footer}
    </div>
  );
}

// Patrimonio: área + línea, con los eventos anclados a SU punto de la curva.
function FinNetWorthChart({ values, labels, events = [], height = 210 }) {
  // El patrimonio puede ser NEGATIVO (hipoteca > activos): el dominio incluye
  // el cero y el área se ancla a esa línea, no al piso del lienzo.
  const lo = Math.min(...values, 0), hi = Math.max(...values, 0);
  const pad = (hi - lo || 1) * 0.12;
  const min = lo - (lo < 0 ? pad : 0), max = hi + (hi > 0 ? pad : 0);
  const span = max - min || 1;
  const neg = lo < 0;
  const x = (i) => (values.length === 1 ? 50 : (i / (values.length - 1)) * 100);
  const y = (v) => (1 - (v - min) / span) * 100;
  const zeroY = y(0);
  const line = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(v).toFixed(2)}`).join(' ');
  const area = `${line} L 100 ${zeroY.toFixed(2)} L 0 ${zeroY.toFixed(2)} Z`;
  const last = values.length - 1;
  const tone = values[last] < 0 ? 'var(--kb-hp)' : 'var(--kb-primary)';
  // Con la serie entera de un solo signo, el cero coincide con un extremo:
  // repetir la etiqueta ahí deja dos rótulos encimados. En ese caso el corte
  // intermedio va a la mitad del dominio.
  const ticks = (neg && hi > 0)
    ? [{ pct: 0, label: finMoney(max) }, { pct: zeroY, label: '$0', zero: true }, { pct: 100, label: finMoney(min) }]
    : [{ pct: 0, label: finMoney(max), zero: max === 0 },
       { pct: 50, label: finMoney((max + min) / 2) },
       { pct: 100, label: finMoney(min), zero: min === 0 }];
  return (
    <FinChartFrame height={height} ticks={ticks} xLabels={labels}>
      <svg className="fc-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="finNwFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={tone} stopOpacity="0.22" />
            <stop offset="1" stopColor={tone} stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#finNwFill)" />
        <path d={line} fill="none" stroke={tone} strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      {events.map((e, k) => (
        <div key={k} className={`fc-evt ${e.tone}${x(e.i) > 62 ? ' flip' : ''}`}
             style={{ left: `${x(e.i)}%`, top: `${y(values[e.i])}%` }}>
          <i className="stem" style={{ height: `${Math.abs(zeroY - y(values[e.i]))}%`, top: y(values[e.i]) > zeroY ? 'auto' : 0, bottom: y(values[e.i]) > zeroY ? 0 : 'auto' }} />
          <i className="pin" />
          <span className="tag">{e.label} <strong>{e.delta}</strong></span>
        </div>
      ))}
      <div className="fc-dot" style={{ left: `${x(last)}%`, top: `${y(values[last])}%`, borderColor: tone }} />
    </FinChartFrame>
  );
}

// Flujo: barras pareadas + una tendencia por serie sobre ellas.
function FinFlowChart({ months, income, expense, height = 210 }) {
  const max = Math.max(...income, ...expense, 1) * 1.1;
  const ti = finTrend(income), te = finTrend(expense);
  const pct = (v) => (1 - v / max) * 100;
  const half = 100 / months.length / 2;
  const trendLine = (t) => t ? `M ${half} ${pct(t.from)} L ${100 - half} ${pct(t.to)}` : '';
  const ticks = [{ pct: 0, label: finMoney(max) }, { pct: 50, label: finMoney(max / 2) }, { pct: 100, label: '$0', zero: true }];
  return (
    <FinChartFrame height={height} ticks={ticks} xLabels={months} dense={months.length > 8}>
      <div className="fc-bars">
        {months.map((m, i) => (
          <div key={i} className="col" title={`${m}: +${finMoney(income[i])} / −${finMoney(expense[i])}`}>
            <i className="b inc" style={{ height: `${(income[i] / max) * 100}%` }} />
            <i className="b exp" style={{ height: `${(expense[i] / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <svg className="fc-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={trendLine(ti)} fill="none" stroke="var(--kb-primary-ink)" strokeWidth="2"
              strokeDasharray="6 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={trendLine(te)} fill="none" stroke="var(--kb-hp-ink)" strokeWidth="2"
              strokeDasharray="6 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </FinChartFrame>
  );
}

function FinDonut({ data, total, size = 150 }) {
  const sum = total || data.reduce((a, d) => a + d.value, 0) || 1;
  const r = 54, C = 2 * Math.PI * r;
  let offset = 0;
  const segs = data.map(d => {
    const frac = d.value / sum;
    const seg = { color: d.color, len: frac * C, off: offset };
    offset += frac * C;
    return seg;
  });
  return (
    <div className="kbv-fin-donut">
      <svg viewBox="0 0 140 140" width={size} height={size}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--kb-surface-2)" strokeWidth="18" />
        {segs.map((sg, i) => (
          <circle key={i} cx="70" cy="70" r={r} fill="none" stroke={sg.color} strokeWidth="18"
                  strokeDasharray={`${sg.len} ${C - sg.len}`} strokeDashoffset={-sg.off}
                  transform="rotate(-90 70 70)" />
        ))}
        <text x="70" y="66" textAnchor="middle" className="donut-amt">${(sum/1000).toFixed(1)}K</text>
        <text x="70" y="84" textAnchor="middle" className="donut-lbl">total</text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pantalla principal
// ─────────────────────────────────────────────────────────────
function FinanzasScreen() {
  const [tab, setTab] = React.useState('overview');
  const [transactions, setTransactions] = React.useState(FIN_TX_DEMO);
  const [accounts, setAccounts] = React.useState(FIN_ACCOUNTS_DEMO);
  const [credits, setCredits] = React.useState(FIN_CREDITS_DEMO);
  const [savings, setSavings] = React.useState(FIN_SAVING_PROJECTS);
  const [openAccountId, setOpenAccountId] = React.useState(null);
  const [openCreditId, setOpenCreditId] = React.useState(null);
  const [openProjectId, setOpenProjectId] = React.useState(null);
  const [movOpen, setMovOpen] = React.useState(false);
  const [acctOpen, setAcctOpen] = React.useState(false);
  const [credOpen, setCredOpen] = React.useState(false);
  const [projOpen, setProjOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);

  // Detail screens "navigation"
  if (openAccountId) {
    const acct = accounts.find(a => a.id === openAccountId);
    if (acct) return <AccountDetailScreen account={acct} transactions={transactions} onBack={() => setOpenAccountId(null)} />;
  }
  if (openCreditId) {
    const cred = credits.find(c => c.id === openCreditId);
    if (cred) return <CreditDetailScreen credit={cred} transactions={transactions} onBack={() => setOpenCreditId(null)} />;
  }
  if (openProjectId) {
    const p = savings.find(x => x.id === openProjectId);
    if (p) return <ProjectDetailScreen project={p} account={accounts.find(a => a.id === p.accountId)} transactions={transactions} onBack={() => setOpenProjectId(null)} />;
  }

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>{crumb('finanzas', 'Dinero y recursos')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Finanzas. <InfoDot label="i" text={"Cuentas, créditos, ahorros y movimientos en un sistema único. Auto-registro desde correos y notificaciones, importación de estados de cuenta y recomendaciones con IA."} /></h1>
        </div>
        <div className="actions" style={{ gap: 8 }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setImportOpen(true)}>
            <KIcon name="upload" size={14} /> Importar
          </button>
          <button type="button" className="kbv-btn kbv-btn-secondary" onClick={() => setMovOpen(true)}>
            <KIcon name="plus" size={14} /> Movimiento
          </button>
        </div>
      </div>

      {/* Top tabs */}
      <div className="kbv-fin-tabs">
        {[
          { id: 'overview', icon: 'home',   lbl: 'Resumen' },
          { id: 'accounts', icon: 'wealth', lbl: `Cuentas (${accounts.length})` },
          { id: 'credits',  icon: 'alert',  lbl: `Créditos (${credits.length})` },
          { id: 'savings',  icon: 'shield', lbl: `Ahorro (${savings.length})` },
          { id: 'import',   icon: 'upload', lbl: 'Importar' },
        ].map(t => (
          <button key={t.id} type="button"
                  className={`kbv-fin-tab ${tab === t.id ? 'on' : ''}`}
                  onClick={() => setTab(t.id)}>
            <KIcon name={t.icon} size={14} /> {t.lbl}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab
        transactions={transactions}
        accounts={accounts}
        credits={credits}
        savings={savings}
        onOpenAccount={setOpenAccountId}
        onOpenCredit={setOpenCreditId}
        onOpenProject={setOpenProjectId} />}

      {tab === 'accounts' && <AccountsTab
        accounts={accounts}
        transactions={transactions}
        onOpen={setOpenAccountId}
        onAdd={() => setAcctOpen(true)} />}

      {tab === 'credits' && <CreditsTab
        credits={credits}
        transactions={transactions}
        onOpen={setOpenCreditId}
        onAdd={() => setCredOpen(true)} />}

      {tab === 'savings' && <SavingsTab
        savings={savings}
        accounts={accounts}
        onOpen={setOpenProjectId}
        onAdd={() => setProjOpen(true)} />}

      {tab === 'import' && <ImportTab onOpenImport={() => setImportOpen(true)} />}

      {movOpen && <RegistrarMovimientoModalV2 accounts={accounts} onClose={() => setMovOpen(false)} onSave={(tx) => setTransactions(ts => [tx, ...ts])} />}
      {acctOpen && <CreateAccountModal onClose={() => setAcctOpen(false)} onSave={(a) => setAccounts(as => [...as, { ...a, id: 'a' + Math.random().toString(36).slice(2, 6) }])} />}
      {credOpen && <CreateCreditModal onClose={() => setCredOpen(false)} onSave={(c) => setCredits(cs => [...cs, { ...c, id: 'c' + Math.random().toString(36).slice(2, 6) }])} />}
      {projOpen && <CreateSavingProjectModal accounts={accounts} onClose={() => setProjOpen(false)} onSave={(p) => setSavings(ps => [...ps, { ...p, id: 'fp' + Math.random().toString(36).slice(2, 6), history: [p.current] }])} />}
      {importOpen && <ImportStatementModal accounts={accounts} onClose={() => setImportOpen(false)} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 1 — Resumen
// ─────────────────────────────────────────────────────────────
function OverviewTab({ transactions, accounts, credits, savings, onOpenAccount, onOpenCredit, onOpenProject }) {
  // El periodo se pide en MESES (es la unidad del dinero) y manda sobre las
  // dos gráficas, no solo sobre el rótulo.
  const FIN_PERIODS = [
    { id: '1m', l: '1 mes', n: 1 }, { id: '3m', l: '3 meses', n: 3 },
    { id: '6m', l: '6 meses', n: 6 }, { id: '12m', l: '12 meses', n: 12 },
    { id: 'all', l: 'Todo', n: 24 }, { id: 'custom', l: 'Personalizado', n: 6 }];
  const [period, setPeriod] = React.useState('6m');
  const [range, setRange] = React.useState({ from: '2025-12', to: '2026-05' });
  const customN = React.useMemo(() => {
    const a = range.from.split('-').map(Number), b = range.to.split('-').map(Number);
    const d = (b[0] - a[0]) * 12 + (b[1] - a[1]) + 1;
    return Math.min(24, Math.max(1, d || 6));
  }, [range]);
  const pMeta = FIN_PERIODS.find(p => p.id === period) || FIN_PERIODS[2];
  const nMonths = period === 'custom' ? customN : pMeta.n;
  // Calcs
  const totalIncome  = transactions.filter(t => t.kind === 'income' && t.catId !== 'transfer').reduce((a, b) => a + b.amt, 0);
  const totalExpense = Math.abs(transactions.filter(t => t.kind === 'expense' && t.catId !== 'transfer').reduce((a, b) => a + b.amt, 0));
  const net = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((net / totalIncome) * 100) : 0;
  const totalAssets = accounts.reduce((a, x) => a + x.balance, 0);
  const totalDebt = credits.reduce((a, c) => a + Math.abs(c.balance), 0);
  const netWorth = totalAssets - totalDebt;
  const interestPaid = credits.reduce((a, c) => a + (c.interestPaidYTD || 0), 0);
  const interestEarned = accounts.filter(a => a.apy > 0).reduce((sum, a) => sum + (a.balance * a.apy / 100 / 12), 0);
  const burnRate = totalExpense / 30;
  const runway = totalAssets / Math.max(1, burnRate);
  const subsTotal = transactions.filter(t => t.catId === 'subs').reduce((a, b) => a + Math.abs(b.amt), 0);
  const budgetUsedPct = Math.round((totalExpense / BUDGET_V2.reduce((a, b) => a + b.limit, 0)) * 100);

  // Por categoría (sin transferencias)
  const expenseByCategory = {};
  transactions.forEach(t => {
    if (t.kind === 'expense' && t.catId !== 'transfer') {
      expenseByCategory[t.catId] = (expenseByCategory[t.catId] || 0) + Math.abs(t.amt);
    }
  });
  const sortedCats = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);

  // Series del periodo: los meses visibles salen del filtro y ambas series
  // aterrizan en el valor real de hoy, así el último punto nunca miente.
  const flowMonths  = React.useMemo(() => finMonthLabels(nMonths), [nMonths]);
  const flowIncome  = React.useMemo(() => finSeries(nMonths, { seed: 21, end: totalIncome,  growth: 0.18, vol: 0.12 }), [nMonths, totalIncome]);
  const flowExpense = React.useMemo(() => finSeries(nMonths, { seed: 34, end: totalExpense, growth: 0.24, vol: 0.15 }), [nMonths, totalExpense]);
  const netWorthHistory = React.useMemo(() => finSeries(nMonths, { seed: 12, end: netWorth, growth: 0.62, vol: 0.09 }), [nMonths, netWorth]);
  // Los hitos se anclan a «hace N meses», no a un índice fijo: al cambiar el
  // periodo siguen cayendo en su mes — y desaparecen si quedan fuera del rango.
  const netWorthEvents = React.useMemo(() => [
    { back: 3, label: 'Emergencia médica', delta: '−$5K', tone: 'hp' },
    { back: 1, label: 'Bono semestral', delta: '+$4K', tone: 'good' }]
    .filter(e => e.back < nMonths)
    .map(e => ({ ...e, i: nMonths - 1 - e.back })), [nMonths]);

  return (
    <>
      {/* Filtro de periodo global */}
      <div className="kbv-fin-period">
        <span className="kbv-meta"><KIcon name="calendar" size={13} /> Periodo de las gráficas</span>
        <div className="range-tabs">
          {FIN_PERIODS.map(p => (
            <button key={p.id} className={period === p.id ? 'on' : ''} onClick={() => setPeriod(p.id)}>{p.l}</button>
          ))}
        </div>
        {period === 'custom' && (
          <div className="kbv-daterange">
            <span className="dr-l"><KIcon name="calendar" size={12} /> Del</span>
            <input type="month" value={range.from} max={range.to} onChange={(e) => setRange(r => ({ ...r, from: e.target.value }))} />
            <span className="dr-sep"><KIcon name="arrow-right" size={11} /></span>
            <span className="dr-l">al</span>
            <input type="month" value={range.to} min={range.from} onChange={(e) => setRange(r => ({ ...r, to: e.target.value }))} />
          </div>
        )}
        <span className="kbv-meta period-note">{nMonths === 1 ? 'Mostrando el mes en curso' : `Mostrando ${nMonths} meses · ${flowMonths[0]} → ${flowMonths[flowMonths.length - 1]}`}</span>
      </div>

      {/* Hero compacto */}
      <div className="kbv-fin-hero" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="label">Patrimonio neto</span>
          <div className="amount" style={{ color: netWorth < 0 ? 'var(--kb-hp-ink)' : undefined }}>{netWorth < 0 ? '−' : ''}${Math.abs(netWorth).toLocaleString('es-MX')}</div>
          <span className="sub"><span className="delta">+12%</span> vs Q1 · activos ${totalAssets.toLocaleString('es-MX')}</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="label">Saldo mes</span>
          <div className="amount">${net.toLocaleString('es-MX')}</div>
          <span className="sub">Ingresos ${totalIncome.toLocaleString('es-MX')} · gastos ${totalExpense.toLocaleString('es-MX')}</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="label">Tasa de ahorro</span>
          <div className="amount">{savingsRate}<small>%</small></div>
          <span className="sub">{savingsRate >= 20 ? '✓ Por arriba de 20%' : 'Bajo 20% — ajusta gasto'}</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="label">Deuda total</span>
          <div className="amount">{finBig(totalDebt).n}<small>{finBig(totalDebt).u}</small></div>
          <span className="sub">Interés YTD <strong>${interestPaid.toLocaleString('es-MX')}</strong> pagado</span>
        </div>
      </div>

      {/* KPI strip extendido */}
      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <span className="label">Rendimiento estimado/mes</span>
          <span className="val">+${Math.round(interestEarned).toLocaleString('es-MX')}</span>
          <span className="delta up">Cuentas con APY</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-hp)' }}>
          <span className="label">Interés pagado YTD</span>
          <span className="val">${(interestPaid/1000).toFixed(1)}<small>K</small></span>
          <span className="delta down">{(interestPaid / totalDebt * 100).toFixed(1)}% del saldo</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-community)' }}>
          <span className="label">Suscripciones</span>
          <span className="val">${subsTotal.toLocaleString('es-MX')}</span>
          <span className="delta">{transactions.filter(t => t.catId === 'subs').length} activas</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-coin)' }}>
          <span className="label">Quema diaria</span>
          <span className="val">${Math.round(burnRate).toLocaleString('es-MX')}</span>
          <span className="delta">{Math.round(burnRate * 30).toLocaleString('es-MX')}/mes</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}>
          <span className="label">Runway (meses) <span className="kbv-info" title="Meses que podrías cubrir tus gastos actuales usando solo tu saldo, sin ingresos nuevos.">?</span></span>
          <span className="val">{runway.toFixed(1)}</span>
          <span className="delta">Con saldo actual</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--pri-high)' }}>
          <span className="label">Presupuesto usado</span>
          <span className="val">{budgetUsedPct}<small>%</small></span>
          <span className="delta">{BUDGET_V2.filter(b => b.used > b.limit).length} sobre el límite</span>
        </div>
      </div>

      {/* Quick acceso a cuentas y créditos */}
      <div className="kbv-fin-grid">
        <div className="kbv-fin-card">
          <div className="head">
            <h3 className="kbv-h3">Tus cuentas</h3>
            <span className="kbv-meta">Click para ver detalle</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {accounts.map(a => {
              const t = ACCOUNT_TYPES_FULL[a.type];
              return (
                <MoneyRow key={a.id} icon={t.icon} color={a.color} name={a.name}
                  meta={`${t.label}${a.apy > 0 ? ` · ${a.apy}% CAT` : ''}${a.isCash ? ` · −${INFLATION_MONTHLY.toFixed(2)}% inflación/mes` : ''}`}
                  amount={a.balance} onClick={() => onOpenAccount(a.id)} />
              );
            })}
          </div>
        </div>

        <div className="kbv-fin-card">
          <div className="head">
            <h3 className="kbv-h3">Tus créditos</h3>
            <span className="kbv-meta">{credits.length} · interés acumulado ${interestPaid.toLocaleString('es-MX')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {credits.map(c => {
              const t = CREDIT_TYPES_FULL[c.type];
              return (
                <button key={c.id} type="button" className="kbv-fin-mini-row credit" style={{ '--c': c.color }} onClick={() => onOpenCredit(c.id)}>
                  <span className="ico"><KIcon name={t.icon} size={14} /></span>
                  <div className="info">
                    <span className="name">{c.name}</span>
                    <span className="meta">{t.label} · CAT <strong style={{ color: c.apr > 50 ? 'var(--kb-hp)' : 'inherit' }}>{c.apr}%</strong> · vence día {c.dueDay}</span>
                  </div>
                  <span className="amt debt">−${Math.abs(c.balance).toLocaleString('es-MX')}</span>
                  <KIcon name="arrow-right" size={11} style={{ color: 'var(--kb-text-3)' }} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="kbv-fin-charts">
        <div className="kbv-fin-card">
          <div className="head">
            <h3 className="kbv-h3">Flujo mensual</h3>
            <span className="kbv-meta">{nMonths === 1 ? 'Mes en curso' : `${nMonths} meses`} · ingresos vs gastos, en pesos</span>
          </div>
          <FinFlowChart months={flowMonths} income={flowIncome} expense={flowExpense} />
          <div className="flow-legend">
            <span><span className="dot" style={{ background: 'var(--kb-primary)' }} /> Ingresos</span>
            <span><span className="dot" style={{ background: 'var(--kb-hp)' }} /> Gastos</span>
            <span className="trend-key"><i /> Tendencia</span>
            <span style={{ marginLeft: 'auto', color: 'var(--kb-text-2)' }}>Ahorro neto: <strong style={{ color: net > 0 ? 'var(--kb-good)' : 'var(--kb-hp-ink)' }}>${net.toLocaleString('es-MX')}</strong></span>
          </div>
        </div>

        <div className="kbv-fin-card">
          <div className="head">
            <h3 className="kbv-h3">Evolución patrimonio</h3>
            <span className="kbv-meta">{nMonths === 1 ? 'Mes en curso' : `${nMonths} meses`} · patrimonio neto en pesos</span>
          </div>
          <FinNetWorthChart values={netWorthHistory} labels={flowMonths} events={netWorthEvents} />
          <div className="flow-legend">
            <span><strong style={{ color: 'var(--kb-text)' }}>{finMoney(netWorthHistory[0])}</strong> → <strong style={{ color: netWorth < 0 ? 'var(--kb-hp-ink)' : 'var(--kb-primary-ink)' }}>{finMoney(netWorth)}</strong></span>
            <span style={{ marginLeft: 'auto', color: netWorth >= netWorthHistory[0] ? 'var(--kb-good)' : 'var(--kb-hp-ink)' }}>
              {netWorth >= netWorthHistory[0] ? '+' : '−'}{finMoney(Math.abs(netWorth - netWorthHistory[0])).replace('−', '')} en {nMonths === 1 ? 'el mes' : `${nMonths} meses`}
            </span>
          </div>
        </div>
      </div>

      {/* Gastos por categoría */}
      <div className="kbv-fin-card">
        <div className="head">
          <h3 className="kbv-h3">Gastos por categoría · Mayo</h3>
          <span className="kbv-meta">{Object.keys(expenseByCategory).length} categorías · ${totalExpense.toLocaleString('es-MX')} total</span>
        </div>
        <div className="kbv-cat-split">
        <div className="kbv-cat-breakdown">
          {sortedCats.map(([catId, amt]) => {
            const cat = FIN_CATEGORIES[catId] || FIN_CATEGORIES.other;
            const pct = (amt / totalExpense) * 100;
            return (
              <div key={catId} className="kbv-cat-row" style={{ '--c': cat.color }}>
                <span className="ico"><KIcon name={cat.icon} size={14} /></span>
                <span className="name">{cat.name}</span>
                <div className="bar"><div className="fill" style={{ width: `${pct}%` }} /></div>
                <span className="amt">${amt.toLocaleString('es-MX')}</span>
                <span className="pct">{Math.round(pct)}%</span>
              </div>
            );
          })}
        </div>
        <FinDonut total={totalExpense} data={sortedCats.map(([catId, amt]) => { const c = FIN_CATEGORIES[catId] || FIN_CATEGORIES.other; return { label: c.name, value: amt, color: c.color }; })} />
        </div>
      </div>

    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 2 — Cuentas
// ─────────────────────────────────────────────────────────────
function AccountsTab({ accounts, transactions, onOpen, onAdd }) {
  const total = accounts.reduce((a, x) => a + x.balance, 0);
  const totalAPY = accounts.filter(a => a.apy > 0).reduce((s, a) => s + a.balance * a.apy / 100 / 12, 0);
  const annualAPY = totalAPY * 12;
  const cashAccts = accounts.filter(a => a.isCash);
  const totalCash = cashAccts.reduce((s, a) => s + a.balance, 0);
  const inflationLossMonth = totalCash * INFLATION_MONTHLY / 100;
  const netYieldYear = annualAPY - inflationLossMonth * 12;
  const monthlyExpenses = 22000;
  const runwayMonths = total / monthlyExpenses;

  return (
    <>
      <div className="kbv-kpi-grid kpi-wrap" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <span className="label">Total en cuentas</span>
          <span className="val">${total.toLocaleString('es-MX')}</span>
          <span className="delta">{accounts.length} cuentas</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <span className="label">Rendimiento mensual</span>
          <span className="val">+${Math.round(totalAPY).toLocaleString('es-MX')}</span>
          <span className="delta up">De {accounts.filter(a => a.apy > 0).length} cuentas con CAT</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-good)' }}>
          <span className="label">Rendimiento anual</span>
          <span className="val">+${Math.round(annualAPY).toLocaleString('es-MX')}</span>
          <span className="delta up">Proyección a 12 meses</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-hp)' }}>
          <span className="label">Pérdida por inflación</span>
          <span className="val">−${Math.round(inflationLossMonth).toLocaleString('es-MX')}</span>
          <span className="delta down">{INFLATION_MONTHLY.toFixed(2)}%/mes en efectivo</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-community)' }}>
          <span className="label">Rend. neto anual <span className="kbv-info" title="Rendimiento de tus cuentas con CAT menos lo que la inflación te quita en efectivo, en un año.">?</span></span>
          <span className={`val`} style={{ color: netYieldYear >= 0 ? 'var(--kb-good)' : 'var(--kb-hp)' }}>{netYieldYear >= 0 ? '+' : '−'}${Math.abs(Math.round(netYieldYear)).toLocaleString('es-MX')}</span>
          <span className="delta">Rendimientos − inflación</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}>
          <span className="label">Tiempo ahorrado <span className="kbv-info" title="Cuántos meses de tus gastos reales (~$22,000/mes) podrías cubrir solo con lo que tienes en cuentas.">?</span></span>
          <span className="val">{runwayMonths.toFixed(1)}<small> meses</small></span>
          <span className="delta">de gastos cubiertos</span>
        </div>
      </div>

      <div className="kbv-account-grid">
        {accounts.map(a => {
          const t = ACCOUNT_TYPES_FULL[a.type];
          const monthlyAPY = a.balance * (a.apy || 0) / 100 / 12;
          const monthlyLoss = a.isCash ? a.balance * INFLATION_MONTHLY / 100 : 0;
          const lastTx = transactions.filter(tx => tx.accountId === a.id).slice(0, 1)[0];
          return (
            <div key={a.id} className="kbv-account-card" style={{ '--c': a.color, cursor: 'pointer' }} onClick={() => onOpen(a.id)}>
              <div className="top">
                <span className="bank">{a.bank || (a.isCash ? 'Personal' : '—')}</span>
                <span className="type-pip" style={{ '--c': t.color }}>
                  <KIcon name={t.icon} size={10} /> {t.label}
                </span>
              </div>
              <div className="name">{a.name}</div>
              <div className="balance">${a.balance.toLocaleString('es-MX')}<small> MXN</small></div>

              {a.apy > 0 && (
                <div className="apy-strip">
                  <KIcon name="sparkle" size={11} style={{ color: 'var(--kb-primary)' }} />
                  <span>{a.apy}% CAT · genera <strong style={{ color: 'var(--kb-good)' }}>+${Math.round(monthlyAPY)}</strong>/mes</span>
                </div>
              )}
              {a.isCash && (
                <div className="apy-strip inflation">
                  <KIcon name="alert" size={11} style={{ color: 'var(--kb-hp)' }} />
                  <span>Se deprecia <strong style={{ color: 'var(--kb-hp-ink)' }}>−${Math.round(monthlyLoss)}</strong>/mes (inflación)</span>
                </div>
              )}
              {a.holdings && (
                <div className="holdings-mini">
                  {a.holdings.slice(0, 3).map(h => (
                    <span key={h.sym} className="holding-pip" title={`${h.name} · ${h.perf > 0 ? '+' : ''}${(h.perf * 100).toFixed(1)}%`}
                          style={{ color: h.perf > 0 ? 'var(--kb-good)' : 'var(--kb-hp-ink)' }}>
                      {h.sym} {h.perf > 0 ? '+' : ''}{(h.perf * 100).toFixed(1)}%
                    </span>
                  ))}
                </div>
              )}

              <div className="bottom">
                <span className="last4">{a.last4 ? `•• •• •• ${a.last4}` : '—'}</span>
                <span className={`link-state ${a.linked ? 'on' : ''}`}>
                  {a.linked ? <><KIcon name="check" size={10} /> Conectada</> : <><KIcon name="alert" size={10} /> Manual</>}
                </span>
              </div>
              {lastTx && (
                <div className="last-tx">
                  Último: <strong>{lastTx.name}</strong> · {lastTx.amt > 0 ? '+' : ''}${lastTx.amt.toLocaleString('es-MX')}
                </div>
              )}
            </div>
          );
        })}
        <button type="button" className="kbv-account-add" onClick={onAdd}>
          <span className="glyph"><KIcon name="plus" size={20} /></span>
          <span className="name">Agregar cuenta</span>
          <span className="sub">Débito · Ahorro · Inversión · Efectivo</span>
        </button>
      </div>

      <div className="kbv-fin-automation" style={{ background: 'linear-gradient(135deg, var(--kb-primary-soft) 0%, var(--kb-canvas) 100%)', borderColor: 'var(--kb-primary-border)' }}>
        <div className="left">
          <div className="ico" style={{ background: 'rgba(76,175,130,0.20)', color: 'var(--kb-primary-ink)' }}>
            <KIcon name="sparkle" size={20} />
          </div>
          <div>
            <h4>Conexión bancaria · activa</h4>
            <p>3 de 4 cuentas están conectadas vía Belvo. Los saldos se actualizan cada 4 horas y los movimientos llegan como borradores que apruebas con un toque.</p>
          </div>
        </div>
        <div className="actions">
          <button type="button" className="kbv-btn kbv-btn-secondary">
            <KIcon name="sparkle" size={14} /> Gestionar conexiones
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 3 — Créditos
// ─────────────────────────────────────────────────────────────
function CreditsTab({ credits, transactions, onOpen, onAdd }) {
  const totalDebt = credits.reduce((a, c) => a + Math.abs(c.balance), 0);
  const totalInterestYTD = credits.reduce((a, c) => a + (c.interestPaidYTD || 0), 0);
  const totalCapitalYTD = credits.reduce((a, c) => a + (c.capitalPaidYTD || 0), 0);
  const totalMinPay = credits.reduce((a, c) => a + (c.minPayment || 0), 0);
  const avgAPR = credits.reduce((a, c) => a + c.apr * Math.abs(c.balance), 0) / Math.max(1, totalDebt);
  const interestPct = totalDebt > 0 ? (totalInterestYTD / totalDebt) * 100 : 0;

  return (
    <>
      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-hp)' }}>
          <span className="label">Deuda total</span>
          <span className="val">{finBig(totalDebt).n}<small>{finBig(totalDebt).u}</small></span>
          <span className="delta down">{credits.length} créditos activos</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--pri-high)' }}>
          <span className="label">Interés pagado YTD</span>
          <span className="val">${(totalInterestYTD/1000).toFixed(1)}<small>K</small></span>
          <span className="delta">{interestPct.toFixed(1)}% del saldo</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <span className="label">Capital pagado YTD</span>
          <span className="val">${(totalCapitalYTD/1000).toFixed(1)}<small>K</small></span>
          <span className="delta up">Reduce tu deuda real</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-community)' }}>
          <span className="label">Pago mínimo / mes</span>
          <span className="val">${totalMinPay.toLocaleString('es-MX')}</span>
          <span className="delta">Suma de mínimos</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}>
          <span className="label">CAT promedio</span>
          <span className="val">{avgAPR.toFixed(1)}<small>%</small></span>
          <span className="delta">Ponderado por saldo</span>
        </div>
      </div>

      <div className="kbv-credit-grid">
        {credits.map(c => {
          const t = CREDIT_TYPES_FULL[c.type];
          const usedPct = c.limit > 0 ? Math.min(100, (Math.abs(c.balance) / c.limit) * 100) : 0;
          const interestRatio = c.balance !== 0 ? (c.interestPaidYTD / Math.abs(c.balance)) * 100 : 0;
          return (
            <div key={c.id} className="kbv-credit-card" style={{ '--c': c.color, cursor: 'pointer' }} onClick={() => onOpen(c.id)}>
              <div className="top">
                <span className="type-pip" style={{ '--c': t.color }}>
                  <KIcon name={t.icon} size={10} /> {t.label}
                </span>
                <span className={`link-state ${c.linked ? 'on' : ''}`}>
                  {c.linked ? <><KIcon name="check" size={10} /> Conectado</> : <><KIcon name="alert" size={10} /> Manual</>}
                </span>
              </div>
              <div className="name">{c.name}</div>
              <div className="balance">
                <span className="bal">${Math.abs(c.balance).toLocaleString('es-MX')}</span>
                <span className="cap">de ${c.limit.toLocaleString('es-MX')}</span>
              </div>
              <div className="kbv-progress" style={{ height: 6 }}>
                <div className="fill" style={{ width: `${usedPct}%`, background: usedPct > 80 ? 'var(--kb-hp)' : c.color }} />
              </div>
              <div className="interest-strip">
                <span>Interés YTD</span>
                <strong style={{ color: 'var(--kb-hp-ink)' }}>${(c.interestPaidYTD || 0).toLocaleString('es-MX')}</strong>
                <span className="pct">({interestRatio.toFixed(1)}%)</span>
              </div>
              <div className="bottom">
                <span>Vence día <strong>{c.dueDay}</strong></span>
                <span>CAT <strong style={{ color: c.apr > 50 ? 'var(--kb-hp)' : c.color }}>{c.apr}%</strong></span>
              </div>
            </div>
          );
        })}
        <button type="button" className="kbv-account-add" onClick={onAdd}>
          <span className="glyph"><KIcon name="plus" size={20} /></span>
          <span className="name">Agregar crédito</span>
          <span className="sub">Tarjeta · Hipoteca · Préstamo · Auto · Personal</span>
        </button>
      </div>

      {/* Suscripciones y gastos recurrentes */}
      {(() => {
        const subsMonthly = FIN_SUBSCRIPTIONS_DEMO.reduce((a, b) => a + b.amt, 0);
        return (
          <div className="kbv-fin-card">
            <div className="head">
              <h3 className="kbv-h3">Suscripciones y recurrentes</h3>
              <span className="kbv-meta">{FIN_SUBSCRIPTIONS_DEMO.length} activos · ${subsMonthly.toLocaleString('es-MX')}/mes · ${(subsMonthly * 12).toLocaleString('es-MX')}/año</span>
            </div>
            <div className="kbv-subs-grid">
              {FIN_SUBSCRIPTIONS_DEMO.map(sub => (
                <MoneyRow key={sub.id} icon={sub.icon} color={sub.color} name={sub.name}
                  meta={`${sub.kind} · día ${sub.day} · ${sub.account}`}
                  amount={sub.amt} suffix="/mes" />
              ))}
              <button type="button" className="kbv-sub-add">
                <KIcon name="plus" size={14} /> Agregar recurrente
              </button>
            </div>
            <span className="kbv-meta" style={{ marginTop: 10, display: 'block' }}>
              Estos gastos se descuentan automáticamente de la cuenta ligada y se contemplan en tu quema mensual y runway.
            </span>
          </div>
        );
      })()}

      <div className="kbv-fin-automation" style={{ background: 'linear-gradient(135deg, var(--kb-hp-soft) 0%, var(--kb-canvas) 100%)', borderColor: 'var(--kb-coin-border)' }}>
        <div className="left">
          <div className="ico" style={{ background: 'rgba(230,69,69,0.18)', color: 'var(--kb-hp-ink)' }}>
            <KIcon name="alert" size={20} />
          </div>
          <div>
            <h4>Estrategia anti-deuda</h4>
            <p>Con el método <strong>avalancha</strong> (atacar primero el CAT más alto) liquidarías Kueski en 6 meses y ahorrarías $4,800 en intereses futuros. Bola de nieve disponible también.</p>
          </div>
        </div>
        <div className="actions">
          <button type="button" className="kbv-btn kbv-btn-secondary">
            <KIcon name="sparkle" size={14} /> Plan avalancha
          </button>
          <button type="button" className="kbv-btn kbv-btn-ghost">
            <KIcon name="sparkle" size={14} /> Plan bola de nieve
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 4 — Ahorro (proyectos)
// ─────────────────────────────────────────────────────────────
function SavingsTab({ savings, accounts, onOpen, onAdd }) {
  const totalSaving = savings.reduce((a, s) => a + s.current, 0);
  const totalTarget = savings.reduce((a, s) => a + s.target, 0);
  const totalMonthly = savings.reduce((a, s) => a + s.monthly, 0);
  const avgProgress = Math.round(totalSaving / totalTarget * 100);

  return (
    <>
      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <span className="label">Acumulado</span>
          <span className="val">${(totalSaving/1000).toFixed(1)}<small>K</small></span>
          <span className="delta">de ${(totalTarget/1000).toFixed(0)}K meta</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <span className="label">Avance global</span>
          <span className="val">{avgProgress}<small>%</small></span>
          <span className="delta">de tus {savings.length} ahorros</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-community)' }}>
          <span className="label">Aporte mensual</span>
          <span className="val">${totalMonthly.toLocaleString('es-MX')}</span>
          <span className="delta">Comprometido</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}>
          <span className="label">Proyectos</span>
          <span className="val">{savings.length}</span>
          <span className="delta">activos</span>
        </div>
      </div>

      <div className="kbv-saving-grid">
        {savings.map(p => {
          const pct = Math.min(100, (p.current / p.target) * 100);
          const remain = Math.max(0, p.target - p.current);
          const monthsToGo = p.monthly > 0 ? Math.ceil(remain / p.monthly) : '—';
          const acct = accounts.find(a => a.id === p.accountId);
          return (
            <div key={p.id} className="kbv-saving-card" style={{ '--c': p.color, cursor: 'pointer' }} onClick={() => onOpen(p.id)}>
              <div className="head">
                <span className="glyph"><KIcon name={p.icon} size={18} /></span>
                <div style={{ flex: 1 }}>
                  <h4>{p.name}</h4>
                  <span className="kbv-meta">{p.desc}</span>
                </div>
                <span className="kind">AHORRO</span>
              </div>
              <div className="amounts">
                <div className="block">
                  <span className="l">Acumulado</span>
                  <span className="v">${p.current.toLocaleString('es-MX')}</span>
                </div>
                <div className="block">
                  <span className="l">Meta</span>
                  <span className="v">${p.target.toLocaleString('es-MX')}</span>
                </div>
                <div className="block">
                  <span className="l">Mensual</span>
                  <span className="v">${p.monthly.toLocaleString('es-MX')}</span>
                </div>
              </div>
              <GoalBar
                head={false}
                color={p.color}
                money
                cur={p.current}
                target={p.target}
                who={`${monthsToGo} meses para meta · proyección ${p.projDate}`} />
              {acct && (
                <div className="acct-link">
                  <KIcon name="wealth" size={12} />
                  <span>Depositado en: <strong>{acct.name}</strong></span>
                </div>
              )}
              <Sparkline data={p.history} color={p.color} height={40} />
            </div>
          );
        })}
        <button type="button" className="kbv-account-add" onClick={onAdd} style={{ minHeight: 280 }}>
          <span className="glyph"><KIcon name="plus" size={20} /></span>
          <span className="name">Nuevo proyecto de ahorro</span>
          <span className="sub">Define meta, aporte mensual y cuenta destino. Kibo proyecta cuándo lo logras.</span>
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 5 — Importar
// ─────────────────────────────────────────────────────────────
function ImportTab({ onOpenImport }) {
  const recentImports = [
    { id: 'i1', file: 'BBVA-2026-04.pdf', date: '2026-05-02', txCount: 84, status: 'success', mapped: 84 },
    { id: 'i2', file: 'Nu-2026-Q1.csv',   date: '2026-04-05', txCount: 156, status: 'success', mapped: 156 },
    { id: 'i3', file: 'tarjeta-bbva-feb.xlsx', date: '2026-03-10', txCount: 42, status: 'partial', mapped: 38, unmapped: 4 },
  ];

  return (
    <>
      <div className="kbv-fin-card" style={{ background: 'linear-gradient(135deg, var(--kb-primary-soft) 0%, var(--kb-canvas) 70%)', borderColor: 'var(--kb-primary-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--kb-primary)', color: 'var(--kb-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <KIcon name="upload" size={28} />
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h3 className="kbv-h3">Importar estados de cuenta</h3>
            <p className="kbv-body" style={{ marginTop: 4 }}>
              Sube PDFs, CSV o Excel de tu banco. Kibo extrae los movimientos, los clasifica automáticamente y los pone como borradores para que apruebes. Soporta BBVA, Nu, Banamex, Banorte y más.
            </p>
          </div>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={onOpenImport}>
            <KIcon name="upload" size={14} /> Subir archivo
          </button>
        </div>
      </div>

      {/* Cómo funciona */}
      <div className="kbv-fin-card">
        <div className="head">
          <h3 className="kbv-h3">Cómo funciona</h3>
        </div>
        <div className="kbv-import-steps">
          {[
            { n: 1, t: 'Sube tu estado de cuenta', d: 'PDF, CSV o Excel. Hasta 12 meses por archivo.', icon: 'upload' },
            { n: 2, t: 'Kibo lo lee y mapea', d: 'Detecta banco, formato y categorías. OCR para PDFs con tablas.', icon: 'sparkle' },
            { n: 3, t: 'Tú revisas y apruebas', d: 'Vista previa de cada movimiento. Ajusta categorías si hace falta.', icon: 'check' },
            { n: 4, t: 'Listo · forma parte de tu historia', d: 'Movimientos se agregan a tu cuenta. KPIs se recalculan al vuelo.', icon: 'arrow-right' },
          ].map(s => (
            <div key={s.n} className="step">
              <div className="num">{s.n}</div>
              <div className="ico"><KIcon name={s.icon} size={18} /></div>
              <div className="info">
                <div className="title">{s.t}</div>
                <div className="kbv-meta">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Imports recientes */}
      <div className="kbv-fin-card">
        <div className="head">
          <h3 className="kbv-h3">Historial de importaciones</h3>
          <span className="kbv-meta">{recentImports.length} archivos procesados</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {recentImports.map(i => (
            <div key={i.id} className="kbv-import-row">
              <div className="file-ico"><KIcon name="book" size={14} /></div>
              <div className="info">
                <span className="file">{i.file}</span>
                <span className="kbv-meta">{i.date} · {i.txCount} movimientos detectados</span>
              </div>
              <span className={`status-pip ${i.status}`}>
                {i.status === 'success' ? `✓ ${i.mapped}/${i.txCount} OK` : `⚠ ${i.mapped}/${i.txCount} · ${i.unmapped} sin mapear`}
              </span>
              <button type="button" className="kbv-btn kbv-btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }}>
                Ver
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Próximo: integración bancaria automática */}
      <div className="kbv-fin-card" style={{ background: 'var(--kb-coin-soft)', borderColor: 'var(--kb-coin-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(244,183,64,0.20)', color: 'var(--kb-coin-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KIcon name="alert" size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 14, color: 'var(--kb-text)' }}>
              ¿Por qué no conectar el banco directamente?
            </h4>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--kb-text-2)', lineHeight: 1.4 }}>
              Conectar tu banco vía Belvo/Plaid trae movimientos automáticamente cada 4 horas — más cómodo y no requiere descargar archivos. La importación manual sigue útil para histórico antiguo o bancos sin conexión.
            </p>
          </div>
          <button type="button" className="kbv-btn kbv-btn-secondary">
            <KIcon name="sparkle" size={14} /> Conectar banco
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Pantallas de detalle (account / credit / project)
// ─────────────────────────────────────────────────────────────
function AccountDetailScreen({ account, transactions, onBack }) {
  const t = ACCOUNT_TYPES_FULL[account.type];
  const accountTx = transactions.filter(tx => tx.accountId === account.id);
  const monthlyAPY = account.balance * (account.apy || 0) / 100 / 12;
  const monthlyLoss = account.isCash ? account.balance * INFLATION_MONTHLY / 100 : 0;
  const totalIn = accountTx.filter(tx => tx.amt > 0).reduce((a, tx) => a + tx.amt, 0);
  const totalOut = Math.abs(accountTx.filter(tx => tx.amt < 0).reduce((a, tx) => a + tx.amt, 0));

  // Mock balance evolution
  const balHistory = [account.balance * 0.4, account.balance * 0.55, account.balance * 0.65, account.balance * 0.78, account.balance * 0.9, account.balance];

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <button type="button" className="kbv-btn kbv-btn-secondary kbv-back-btn" onClick={onBack}>
            <KIcon name="arrow-left" size={12} /> Volver a Finanzas
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="kbv-eyebrow" style={{ color: account.color }}>{t.label}</span>
            <span className={`status-pip ${account.linked ? '' : 'manual'}`} style={{ background: account.linked ? 'rgba(76,175,130,0.14)' : 'var(--kb-surface-2)', color: account.linked ? 'var(--kb-good)' : 'var(--kb-text-3)' }}>
              {account.linked ? '✓ Conectada' : '⚠ Manual'}
            </span>
          </div>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>{account.name}</h1>
          {account.bank && <p className="kbv-body" style={{ marginTop: 4 }}>{account.bank} {account.last4 && `· •• •• •• ${account.last4}`} · Abierta {account.openedAt || '—'}</p>}
        </div>
        <div className="actions" style={{ gap: 8 }}>
          <button type="button" className="kbv-btn kbv-btn-ghost"><KIcon name="edit" size={14} /> Editar</button>
          <button type="button" className="kbv-btn kbv-btn-primary"><KIcon name="plus" size={14} /> Movimiento</button>
        </div>
      </div>

      {/* Hero balance */}
      <div className="kbv-account-hero" style={{ '--c': account.color }}>
        <div className="balance-block">
          <span className="lbl">SALDO ACTUAL</span>
          <span className="val">${account.balance.toLocaleString('es-MX')}<small> MXN</small></span>
        </div>
        {account.apy > 0 && (
          <div className="stat-block">
            <span className="lbl">RENDIMIENTO MENSUAL</span>
            <span className="val" style={{ color: 'var(--kb-good)' }}>+${Math.round(monthlyAPY).toLocaleString('es-MX')}</span>
            <span className="kbv-meta">{account.apy}% CAT</span>
          </div>
        )}
        {account.isCash && (
          <div className="stat-block">
            <span className="lbl">PÉRDIDA INFLACIÓN/MES</span>
            <span className="val" style={{ color: 'var(--kb-hp-ink)' }}>−${Math.round(monthlyLoss).toLocaleString('es-MX')}</span>
            <span className="kbv-meta">{INFLATION_MONTHLY.toFixed(2)}% mensual · {INFLATION_ANNUAL}% anual</span>
          </div>
        )}
        <div className="stat-block">
          <span className="lbl">INGRESOS MES</span>
          <span className="val" style={{ color: 'var(--kb-good)' }}>+${totalIn.toLocaleString('es-MX')}</span>
        </div>
        <div className="stat-block">
          <span className="lbl">SALIDAS MES</span>
          <span className="val" style={{ color: 'var(--kb-hp-ink)' }}>−${totalOut.toLocaleString('es-MX')}</span>
        </div>
      </div>

      {/* Holdings (investment) */}
      {account.holdings && (
        <div className="kbv-fin-card">
          <div className="head">
            <h3 className="kbv-h3">Composición del portafolio</h3>
            <span className="kbv-meta">{account.holdings.length} instrumentos</span>
          </div>
          <div className="kbv-holdings">
            {account.holdings.map(h => (
              <div key={h.sym} className="holding-row">
                <div className="info">
                  <span className="sym">{h.sym}</span>
                  <span className="name">{h.name}</span>
                </div>
                <div className="weight-bar">
                  <div className="fill" style={{ width: `${h.weight}%`, background: account.color }} />
                </div>
                <span className="weight">{h.weight}%</span>
                <span className="amount">${Math.round(account.balance * h.weight / 100).toLocaleString('es-MX')}</span>
                <span className="perf" style={{ color: h.perf > 0 ? 'var(--kb-good)' : 'var(--kb-hp-ink)' }}>
                  {h.perf > 0 ? '+' : ''}{(h.perf * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="kbv-fin-grid">
        <div className="kbv-fin-card">
          <div className="head">
            <h3 className="kbv-h3">Evolución del saldo</h3>
            <span className="kbv-meta">Últimos 6 meses</span>
          </div>
          <Sparkline data={balHistory} color={account.color} height={140} />
        </div>

        <div className="kbv-fin-card">
          <div className="head">
            <h3 className="kbv-h3">Movimientos · {accountTx.length}</h3>
            <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }}>Ver todos</button>
          </div>
          <TxList transactions={accountTx} compact />
        </div>
      </div>
    </div>
  );
}

function CreditDetailScreen({ credit, transactions, onBack }) {
  const t = CREDIT_TYPES_FULL[credit.type];
  const creditTx = transactions.filter(tx => tx.accountId === credit.id);
  const usedPct = credit.limit > 0 ? Math.min(100, (Math.abs(credit.balance) / credit.limit) * 100) : 0;
  const monthsToPayoff = credit.minPayment > 0 ? Math.ceil(Math.abs(credit.balance) / credit.minPayment) : '—';
  const interestProjected = monthsToPayoff !== '—' ? Math.round(Math.abs(credit.balance) * credit.apr / 100 / 12 * monthsToPayoff * 0.6) : 0;

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <button type="button" className="kbv-btn kbv-btn-secondary kbv-back-btn" onClick={onBack}>
            <KIcon name="arrow-left" size={12} /> Volver a Finanzas
          </button>
          <span className="kbv-eyebrow" style={{ color: credit.color }}>{t.label}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>{credit.name}</h1>
          <p className="kbv-body" style={{ marginTop: 4 }}>{credit.bank} · vence día {credit.dueDay} cada mes</p>
        </div>
        <div className="actions" style={{ gap: 8 }}>
          <button type="button" className="kbv-btn kbv-btn-danger"><KIcon name="check" size={14} /> Marcar pago</button>
          <button type="button" className="kbv-btn kbv-btn-secondary"><KIcon name="edit" size={14} /> Editar</button>
        </div>
      </div>

      <div className="kbv-account-hero" style={{ '--c': credit.color }}>
        <div className="balance-block">
          <span className="lbl">SALDO PENDIENTE</span>
          <span className="val" style={{ color: 'var(--kb-hp-ink)' }}>−${Math.abs(credit.balance).toLocaleString('es-MX')}<small> MXN</small></span>
          <div className="kbv-progress" style={{ marginTop: 8, height: 8 }}>
            <div className="fill" style={{ width: `${usedPct}%`, background: usedPct > 80 ? 'var(--kb-hp)' : credit.color }} />
          </div>
          <span className="kbv-meta" style={{ marginTop: 4, display: 'block' }}>{Math.round(usedPct)}% utilizado de ${credit.limit.toLocaleString('es-MX')}</span>
        </div>
        <div className="stat-block">
          <span className="lbl">PAGO MÍNIMO</span>
          <span className="val">${credit.minPayment.toLocaleString('es-MX')}</span>
          <span className="kbv-meta">Próximo: día {credit.dueDay}</span>
        </div>
        <div className="stat-block">
          <span className="lbl">CAT</span>
          <span className="val" style={{ color: credit.apr > 50 ? 'var(--kb-hp-ink)' : credit.color }}>{credit.apr}<small>%</small></span>
          <span className="kbv-meta">Costo total anual</span>
        </div>
        <div className="stat-block">
          <span className="lbl">SI SOLO PAGAS MÍNIMO</span>
          <span className="val">{monthsToPayoff}<small> meses</small></span>
          <span className="kbv-meta" style={{ color: 'var(--kb-hp-ink)' }}>+${interestProjected.toLocaleString('es-MX')} de interés</span>
        </div>
      </div>

      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-hp)' }}>
          <span className="label">Interés pagado YTD</span>
          <span className="val">${credit.interestPaidYTD.toLocaleString('es-MX')}</span>
          <span className="delta down">{((credit.interestPaidYTD / Math.abs(credit.balance)) * 100).toFixed(1)}% del saldo</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <span className="label">Capital pagado YTD</span>
          <span className="val">${credit.capitalPaidYTD.toLocaleString('es-MX')}</span>
          <span className="delta up">Reduce deuda</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-community)' }}>
          <span className="label">Pago total YTD</span>
          <span className="val">${(credit.interestPaidYTD + credit.capitalPaidYTD).toLocaleString('es-MX')}</span>
          <span className="delta">5 meses</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--pri-high)' }}>
          <span className="label">% interés del pago</span>
          <span className="val">{Math.round(credit.interestPaidYTD / (credit.interestPaidYTD + credit.capitalPaidYTD) * 100)}<small>%</small></span>
          <span className="delta">Dinero "perdido"</span>
        </div>
      </div>

      <div className="kbv-fin-card">
        <div className="head">
          <h3 className="kbv-h3">Movimientos asociados</h3>
          <span className="kbv-meta">{creditTx.length} cargos y pagos</span>
        </div>
        <TxList transactions={creditTx} compact />
      </div>

      <div className="kbv-fin-card" style={{ background: 'linear-gradient(135deg, var(--kb-hp-soft) 0%, var(--kb-canvas) 100%)', borderColor: 'var(--kb-coin-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <KIcon name="sparkle" size={24} style={{ color: 'var(--kb-hp-ink)' }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0 }}>Acelera el pago — ahorra interés</h4>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--kb-text-2)' }}>
              Pagando <strong>${(credit.minPayment * 2).toLocaleString('es-MX')}/mes</strong> en vez del mínimo, liquidas en <strong>{Math.ceil(monthsToPayoff / 2)} meses</strong> y ahorras <strong style={{ color: 'var(--kb-hp-ink)' }}>~${Math.round(interestProjected / 2).toLocaleString('es-MX')}</strong>.
            </p>
          </div>
          <button type="button" className="kbv-btn kbv-btn-primary">Plan acelerado</button>
        </div>
      </div>
    </div>
  );
}

function ProjectDetailScreen({ project, account, transactions, onBack }) {
  const pct = Math.min(100, (project.current / project.target) * 100);
  const remain = Math.max(0, project.target - project.current);
  const monthsToGo = project.monthly > 0 ? Math.ceil(remain / project.monthly) : '—';
  const projTx = transactions.filter(tx => tx.notes && tx.notes.toLowerCase().includes(project.name.toLowerCase().split(' ')[0]));

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <button type="button" className="kbv-btn kbv-btn-secondary kbv-back-btn" onClick={onBack}>
            <KIcon name="arrow-left" size={12} /> Volver a Finanzas
          </button>
          <span className="kbv-eyebrow" style={{ color: project.color }}>AHORRO · PROYECTO</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>{project.name}</h1>
          <p className="kbv-body" style={{ marginTop: 4 }}>{project.desc}</p>
        </div>
        <div className="actions" style={{ gap: 8 }}>
          <button type="button" className="kbv-btn kbv-btn-primary"><KIcon name="plus" size={14} /> Aportar</button>
          <button type="button" className="kbv-btn kbv-btn-ghost"><KIcon name="edit" size={14} /> Editar</button>
        </div>
      </div>

      <div className="kbv-account-hero" style={{ '--c': project.color }}>
        <div className="balance-block">
          <span className="lbl">ACUMULADO</span>
          <span className="val">${project.current.toLocaleString('es-MX')}<small> MXN</small></span>
          <div className="kbv-progress" style={{ marginTop: 8, height: 10 }}>
            <div className="fill" style={{ width: `${pct}%`, background: project.color }} />
          </div>
          <span className="kbv-meta" style={{ marginTop: 4, display: 'block' }}>{Math.round(pct)}% de ${project.target.toLocaleString('es-MX')} meta</span>
        </div>
        <div className="stat-block">
          <span className="lbl">FALTAN</span>
          <span className="val">${remain.toLocaleString('es-MX')}</span>
          <span className="kbv-meta">{monthsToGo} meses al ritmo actual</span>
        </div>
        <div className="stat-block">
          <span className="lbl">APORTE MENSUAL</span>
          <span className="val" style={{ color: 'var(--kb-good)' }}>+${project.monthly.toLocaleString('es-MX')}</span>
          <span className="kbv-meta">Comprometido</span>
        </div>
        <div className="stat-block">
          <span className="lbl">META PROYECCIÓN</span>
          <span className="val">{project.projDate}</span>
          <span className="kbv-meta">Si mantienes el aporte</span>
        </div>
      </div>

      {account && (
        <div className="kbv-fin-card" style={{ background: 'var(--kb-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: account.color, color: 'var(--kb-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KIcon name="wealth" size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <span className="kbv-eyebrow">CUENTA VINCULADA</span>
              <div style={{ fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 16 }}>{account.name}</div>
              <span className="kbv-meta">{account.apy > 0 && `Tu ahorro gana ${account.apy}% CAT — +$${Math.round(project.current * account.apy / 100 / 12)}/mes`}</span>
            </div>
            <button type="button" className="kbv-btn kbv-btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }}>
              <KIcon name="arrow-right" size={11} /> Ver cuenta
            </button>
          </div>
        </div>
      )}

      <div className="kbv-fin-grid">
        <div className="kbv-fin-card">
          <div className="head">
            <h3 className="kbv-h3">Evolución del ahorro</h3>
            <span className="kbv-meta">Últimos 7 meses</span>
          </div>
          <Sparkline data={project.history} color={project.color} height={140} />
        </div>
        <div className="kbv-fin-card">
          <div className="head">
            <h3 className="kbv-h3">Aportes recientes</h3>
            <span className="kbv-meta">{projTx.length} movimientos</span>
          </div>
          {projTx.length === 0 ? (
            <EmptyState compact icon="wealth" title="Sin aportes" body="Etiqueta un movimiento con este proyecto y aparecerá aquí." />
          ) : <TxList transactions={projTx} compact />}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Lista de movimientos compartida
// ─────────────────────────────────────────────────────────────
function TxList({ transactions, compact }) {
  if (transactions.length === 0) return <EmptyState compact icon="chart" title="Sin movimientos" body="Cuando registres ingresos o gastos, los verás aquí." />;
  return (
    <div className="kbv-tx-list">
      {transactions.slice(0, compact ? 8 : 50).map(tx => {
        const cat = FIN_CATEGORIES[tx.catId] || FIN_CATEGORIES.other;
        return (
          <div key={tx.id} className="kbv-tx" style={{ '--cat-c': cat.color, '--cat-bg': `color-mix(in oklab, ${cat.color} 12%, var(--kb-canvas))` }}>
            <span className="ico"><KIcon name={cat.icon} size={14} /></span>
            <div>
              <div className="name">
                {tx.name}
                {tx.src === 'email'  && <span className="src-pill email" title="Detectado desde correo">📧</span>}
                {tx.src === 'notif'  && <span className="src-pill notif" title="Detectado desde notificación">📱</span>}
              </div>
              <div className="meta">{cat.name} · {tx.date}{tx.notes && ` · ${tx.notes}`}</div>
            </div>
            <span className={`amt ${tx.kind}`}>
              {tx.kind === 'income' ? '+' : ''}${tx.amt.toLocaleString('es-MX')}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modales — registrar movimiento / crear cuenta / crear crédito / crear ahorro / importar
// ─────────────────────────────────────────────────────────────
function RegistrarMovimientoModalV2({ accounts, onClose, onSave }) {
  const [kind, setKind] = React.useState('expense');
  const [amount, setAmount] = React.useState('');
  const [name, setName] = React.useState('');
  const [catId, setCatId] = React.useState('food');
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [accountId, setAccountId] = React.useState(accounts[0]?.id || 'a1');
  const [notes, setNotes] = React.useState('');

  const cats = Object.entries(FIN_CATEGORIES)
    .filter(([id]) => kind === 'income' ? ['salary', 'side', 'interest', 'transfer'].includes(id) : !['salary', 'side', 'interest'].includes(id))
    .map(([id, def]) => ({ id, ...def }));

  function save() {
    if (!amount || !name.trim()) return;
    const amt = parseFloat(amount) * (kind === 'expense' ? -1 : 1);
    onSave && onSave({
      id: 'tx' + Math.random().toString(36).slice(2, 6),
      name: name.trim(), catId, amt, kind, date, accountId, src: 'manual', notes: notes.trim()
    });
    onClose();
  }

  return (
    <KBVModal
      title="Registrar movimiento"
      sub="Entrada o salida en una de tus cuentas. Solo entradas y salidas — los proyectos de ahorro viven en su propia sección."
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!amount || !name.trim()} onClick={save}>
            Guardar movimiento <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      <div className="kbv-fin-toggle">
        <button type="button" className={kind === 'expense' ? 'on' : ''} onClick={() => { setKind('expense'); setCatId('food'); }}>
          Salida
        </button>
        <button type="button" className={kind === 'income' ? 'on' : ''} onClick={() => { setKind('income'); setCatId('salary'); }}>
          Entrada
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Monto</label>
          <div className="kbv-amount-input">
            <span className="prefix">$</span>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" autoFocus />
            <span className="suffix">MXN</span>
          </div>
        </div>
        <div className="kbv-form-row">
          <label>Fecha</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className="kbv-form-row">
        <label>Concepto</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Súper de la semana, salario, etc." />
      </div>
      <div className="kbv-form-row">
        <label>Categoría</label>
        <div className="kbv-cat-grid">
          {cats.map(c => (
            <button key={c.id} type="button"
                    className={`kbv-cat-tile ${catId === c.id ? 'on' : ''}`}
                    style={{ '--c': c.color }}
                    onClick={() => setCatId(c.id)}>
              <span className="glyph"><KIcon name={c.icon} size={16} /></span>
              <span className="lbl">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Cuenta</label>
          <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="kbv-form-row">
          <label>Notas (opcional)</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Detalle adicional..." />
        </div>
      </div>
    </KBVModal>
  );
}

function CreateAccountModal({ onClose, onSave }) {
  const BANK_OPTIONS = ['BBVA', 'Nu', 'Banamex', 'Banorte', 'Santander', 'HSBC', 'Hey Banco', 'Mercado Pago', 'Klar', 'Stori', 'GBM', 'Scotiabank'];
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('debit');
  const [bank, setBank] = React.useState('');
  const [last4, setLast4] = React.useState('');
  const [balance, setBalance] = React.useState('');
  const [apy, setApy] = React.useState('');
  const [apyCap, setApyCap] = React.useState('');
  const [reqMonthly, setReqMonthly] = React.useState(false);
  const [monthlyCond, setMonthlyCond] = React.useState('');
  const [color, setColor] = React.useState('var(--area-wisdom)');
  return (
    <KBVModal
      title="Agregar cuenta"
      sub="Débito, ahorro, inversión o efectivo. Si tiene rendimiento (CAT), Kibo calcula cuánto genera mensualmente."
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!name.trim()}
                  onClick={() => { onSave({ name, type, bank, last4, balance: parseFloat(balance || 0), apy: parseFloat(apy || 0), apyCap: parseFloat(apyCap || 0), reqMonthly, monthlyCond, color, linked: false, isCash: type === 'cash' }); onClose(); }}>
            Crear cuenta <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      <div className="kbv-form-row">
        <label>Tipo de cuenta</label>
        <div className="kbv-cat-grid four">
          {Object.entries(ACCOUNT_TYPES_FULL).map(([k, def]) => (
            <button key={k} type="button"
                    className={`kbv-cat-tile big ${type === k ? 'on' : ''}`}
                    style={{ '--c': def.color }}
                    onClick={() => { setType(k); setColor(def.color); }}>
              <span className="glyph big"><KIcon name={def.icon} size={20} /></span>
              <div><span className="lbl">{def.label}</span><span className="sub">{def.desc}</span></div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Nombre</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: BBVA Débito, Nu Ahorro..." autoFocus />
        </div>
        <div className="kbv-form-row">
          <label>Banco</label>
          <input type="text" list="kbv-bank-options" value={bank} onChange={(e) => setBank(e.target.value)} placeholder="Elige o escribe uno nuevo…" disabled={type === 'cash'} />
          <datalist id="kbv-bank-options">
            {BANK_OPTIONS.map(b => <option key={b} value={b} />)}
          </datalist>
          <span className="hint">Selecciona uno o agrega el tuyo — no depende de ninguna conexión externa.</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Últimos 4 dígitos</label>
          <input type="text" maxLength={4} value={last4} onChange={(e) => setLast4(e.target.value)} placeholder="4521" disabled={type === 'cash'} />
        </div>
        <div className="kbv-form-row">
          <label>Saldo actual</label>
          <div className="kbv-amount-input"><span className="prefix">$</span><input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0" /><span className="suffix">MXN</span></div>
        </div>
        <div className="kbv-form-row">
          <label>CAT anual (rendimiento)</label>
          <div className="kbv-amount-input"><input type="number" step="0.1" value={apy} onChange={(e) => setApy(e.target.value)} placeholder={type === 'savings' || type === 'investment' ? '10.5' : '0'} disabled={type === 'debit' || type === 'cash'} /><span className="suffix">%</span></div>
        </div>
      </div>
      {parseFloat(apy) > 0 && (
        <div className="kbv-fin-cat-cond">
          <div className="kbv-form-row">
            <label>Monto máximo con rendimiento <span className="kbv-meta">(tope del CAT)</span></label>
            <div className="kbv-amount-input"><span className="prefix">$</span><input type="number" value={apyCap} onChange={(e) => setApyCap(e.target.value)} placeholder="Ej: 25,000 — arriba de esto no genera" /><span className="suffix">MXN</span></div>
            <span className="hint">Muchas cuentas topan el rendimiento a cierto saldo. Déjalo en 0 si aplica a todo el saldo.</span>
          </div>
          <div className="kbv-form-row">
            <label>Condición mensual</label>
            <label className="kbv-check-row"><input type="checkbox" checked={reqMonthly} onChange={(e) => setReqMonthly(e.target.checked)} /> Requiere cumplir algo cada mes para ganar el CAT</label>
            {reqMonthly && <input type="text" value={monthlyCond} onChange={(e) => setMonthlyCond(e.target.value)} placeholder="Ej: Depositar más de $3,000 al mes (estilo Mercado Pago)" style={{ marginTop: 8 }} />}
            <span className="hint">Si la activas, cada mes te pediremos confirmar si se cumplió para contar (o no) el rendimiento.</span>
          </div>
        </div>
      )}
      {type === 'cash' && (
        <div style={{ padding: 10, background: 'var(--kb-hp-soft)', border: '1px solid var(--kb-coin-border)', borderRadius: 10, fontSize: 12, color: 'var(--kb-coin-ink)' }}>
          <strong>Efectivo:</strong> Kibo aplica una depreciación mensual del <strong>{INFLATION_MONTHLY.toFixed(2)}%</strong> ({INFLATION_ANNUAL}% anual de inflación) para que veas cuánto pierde tu efectivo cada mes que no lo mueves.
        </div>
      )}
    </KBVModal>
  );
}

function CreateCreditModal({ onClose, onSave }) {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState('credit-card');
  const [bank, setBank] = React.useState('');
  const [balance, setBalance] = React.useState('');
  const [limit, setLimit] = React.useState('');
  const [apr, setApr] = React.useState('');
  const [dueDay, setDueDay] = React.useState('15');
  const [minPayment, setMinPayment] = React.useState('');
  const [commitDate, setCommitDate] = React.useState('');
  const isPersonal = type === 'personal';
  return (
    <KBVModal
      title="Agregar crédito"
      sub="Tarjetas, hipotecas, préstamos. Kibo calculará interés pagado vs capital y te recomendará estrategias."
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!name.trim()}
                  onClick={() => { onSave({ name, type, bank, payee: isPersonal ? bank : null, commitDate, balance: -Math.abs(parseFloat(balance || 0)), limit: parseFloat(limit || 0), apr: parseFloat(apr || 0), dueDay: parseInt(dueDay, 10), minPayment: parseFloat(minPayment || 0), color: CREDIT_TYPES_FULL[type].color, linked: false, interestPaidYTD: 0, capitalPaidYTD: 0 }); onClose(); }}>
            Agregar crédito <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      <div className="kbv-form-row">
        <label>Tipo de crédito</label>
        <div className="kbv-cat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {Object.entries(CREDIT_TYPES_FULL).map(([k, def]) => (
            <button key={k} type="button"
                    className={`kbv-cat-tile ${type === k ? 'on' : ''}`}
                    style={{ '--c': def.color }}
                    onClick={() => setType(k)}>
              <span className="glyph"><KIcon name={def.icon} size={16} /></span>
              <span className="lbl">{def.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Nombre</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Tarjeta Oro, Hipoteca casa..." autoFocus />
        </div>
        <div className="kbv-form-row">
          <label>{isPersonal ? 'Persona / prestamista' : 'Banco'}</label>
          <input type="text" value={bank} onChange={(e) => setBank(e.target.value)} placeholder={isPersonal ? 'Ej: Abuela, prima Ana, Tío Beto…' : 'BBVA, Banorte...'} />
          {isPersonal && <span className="hint">Préstamos entre personas — sin banco. Lleva el tracking de cuánto debes y cuándo.</span>}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Saldo pendiente</label>
          <div className="kbv-amount-input"><span className="prefix">$</span><input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="14,200" /></div>
        </div>
        <div className="kbv-form-row">
          <label>Límite total</label>
          <div className="kbv-amount-input"><span className="prefix">$</span><input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="60,000" /></div>
        </div>
        <div className="kbv-form-row">
          <label>CAT anual</label>
          <div className="kbv-amount-input"><input type="number" step="0.1" value={apr} onChange={(e) => setApr(e.target.value)} placeholder="36.5" /><span className="suffix">%</span></div>
        </div>
        <div className="kbv-form-row">
          <label>Pago mínimo</label>
          <div className="kbv-amount-input"><span className="prefix">$</span><input type="number" value={minPayment} onChange={(e) => setMinPayment(e.target.value)} placeholder="1,820" /></div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <KbStepper label="Día de pago" value={dueDay} onChange={setDueDay} min={1} max={31} hint="día del mes" />
        </div>
        <div className="kbv-form-row">
          <label>{isPersonal ? 'Fecha compromiso de pago' : 'Fecha límite (opcional)'}</label>
          <input type="date" value={commitDate} onChange={(e) => setCommitDate(e.target.value)} />
          {isPersonal && <span className="hint">La fecha en la que te comprometiste a saldar la deuda.</span>}
        </div>
      </div>
    </KBVModal>
  );
}

function CreateSavingProjectModal({ accounts, onClose, onSave }) {
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [target, setTarget] = React.useState('');
  const [current, setCurrent] = React.useState('');
  const [monthly, setMonthly] = React.useState('');
  const [date, setDate] = React.useState('');
  const [accountId, setAccountId] = React.useState(accounts[0]?.id || '');
  const [color, setColor] = React.useState('var(--kb-primary)');

  const COLORS = ['var(--kb-primary)', 'var(--kb-gem)', 'var(--kb-coin)', 'var(--area-community)', 'var(--kb-good-soft)', 'var(--pri-high)'];
  const monthsToTarget = (target && monthly && parseFloat(monthly) > 0)
    ? Math.ceil(Math.max(0, parseFloat(target) - parseFloat(current || 0)) / parseFloat(monthly))
    : null;

  return (
    <KBVModal
      title="Nuevo proyecto de ahorro"
      sub="Una meta de dinero a acumular. Vincula una cuenta destino, define aporte mensual y Kibo proyecta cuándo lo logras."
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!name.trim() || !target} onClick={() => {
            onSave({
              name: name.trim(), desc, icon: 'shield', color,
              accountId,
              current: parseFloat(current || 0),
              target: parseFloat(target),
              monthly: parseFloat(monthly || 0),
              projDate: date || '—',
            });
            onClose();
          }}>
            Crear proyecto <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Nombre del proyecto</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Fondo de emergencia, viaje Japón..." autoFocus />
        </div>
        <div className="kbv-form-row">
          <label>Fecha objetivo</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className="kbv-form-row">
        <label>Descripción</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Por qué importa y cómo se ve éxito." />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Acumulado hoy</label>
          <div className="kbv-amount-input"><span className="prefix">$</span><input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0" /></div>
        </div>
        <div className="kbv-form-row">
          <label>Meta total</label>
          <div className="kbv-amount-input"><span className="prefix">$</span><input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="75,000" /></div>
        </div>
        <div className="kbv-form-row">
          <label>Aporte mensual</label>
          <div className="kbv-amount-input"><span className="prefix">$</span><input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="4,500" /></div>
        </div>
      </div>
      <div className="kbv-form-row">
        <label>Cuenta destino</label>
        <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
          {accounts.filter(a => a.type !== 'cash').map(a => (
            <option key={a.id} value={a.id}>{a.name}{a.apy > 0 ? ` · ${a.apy}% CAT` : ''}</option>
          ))}
        </select>
        <span className="kbv-meta">El dinero del ahorro vive en esta cuenta. Idealmente una con buen rendimiento.</span>
      </div>
      <div className="kbv-form-row">
        <label>Color</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {COLORS.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)}
                    style={{ width: 32, height: 32, borderRadius: 8, background: c, border: color === c ? '3px solid var(--kb-text)' : '1.5px solid var(--kb-border)', cursor: 'pointer' }} />
          ))}
        </div>
      </div>
      {monthsToTarget !== null && (
        <div className="kbv-fin-projection">
          <KIcon name="sparkle" size={16} style={{ color: 'var(--kb-gem)' }} />
          Con ${parseFloat(monthly).toLocaleString('es-MX')} al mes alcanzas la meta en <strong>{monthsToTarget} meses</strong>.
        </div>
      )}
    </KBVModal>
  );
}

function ImportStatementModal({ accounts, onClose }) {
  const [step, setStep] = React.useState('upload'); // upload | mapping | preview | done
  const [accountId, setAccountId] = React.useState(accounts[0]?.id);

  // Mock detected movements
  const detected = [
    { date: '2026-04-28', name: 'OXXO RUBI',         amt: -120, cat: 'food',      conf: 'high' },
    { date: '2026-04-27', name: 'SPEI ENTRANTE',     amt: 8500, cat: 'side',      conf: 'medium' },
    { date: '2026-04-25', name: 'NETFLIX MX',        amt: -219, cat: 'subs',      conf: 'high' },
    { date: '2026-04-22', name: 'UBER MX',           amt: -180, cat: 'transport', conf: 'high' },
    { date: '2026-04-20', name: 'AMAZON.COM',        amt: -890, cat: 'other',     conf: 'low' },
    { date: '2026-04-18', name: 'SUPERAMA',          amt: -1240, cat: 'food',     conf: 'high' },
  ];

  return (
    <KBVModal
      title="Importar estado de cuenta"
      sub={step === 'upload' ? 'Sube tu PDF, CSV o Excel — Kibo extrae los movimientos automáticamente.'
        : step === 'mapping' ? '6 movimientos detectados — confirma cuenta destino y mapeo.'
        : step === 'preview' ? 'Revisa cada movimiento. Ajusta categorías incorrectas antes de importar.'
        : 'Importación completa.'}
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {step !== 'upload' && <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setStep(step === 'preview' ? 'mapping' : step === 'mapping' ? 'upload' : 'preview')}>Atrás</button>}
          {step === 'upload'  && <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setStep('mapping')}><KIcon name="upload" size={14} /> Procesar</button>}
          {step === 'mapping' && <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setStep('preview')}>Ver vista previa <KIcon name="arrow-right" size={14} /></button>}
          {step === 'preview' && <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setStep('done')}>Importar {detected.length} movimientos <KIcon name="check" size={14} /></button>}
          {step === 'done'    && <button type="button" className="kbv-btn kbv-btn-primary" onClick={onClose}>Cerrar</button>}
        </div>
      }>
      {step === 'upload' && (
        <div className="kbv-upload-zone">
          <KIcon name="upload" size={48} />
          <h4>Arrastra tu archivo aquí</h4>
          <p>o haz click para seleccionar — PDF, CSV, XLSX hasta 20MB</p>
          <button type="button" className="kbv-btn kbv-btn-secondary">Seleccionar archivo</button>
          <div className="supported">
            <span className="kbv-meta">Compatible con:</span>
            {['BBVA', 'Nu', 'Banamex', 'Banorte', 'Santander', 'HSBC', 'Hey Banco', 'Mercado Pago'].map(b => (
              <span key={b} className="kbv-tag" style={{ background: 'var(--kb-surface)' }}>{b}</span>
            ))}
          </div>
        </div>
      )}

      {step === 'mapping' && (
        <div className="kbv-stack-12">
          <div className="kbv-form-row">
            <label>Cuenta destino</label>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <span className="kbv-meta">Los movimientos se asignarán a esta cuenta.</span>
          </div>
          <div className="kbv-mapping-detected">
            <div className="head">
              <h4>Mapeo automático detectado</h4>
              <span className="kbv-meta">Banco: <strong>BBVA</strong> · formato: <strong>PDF nativo</strong> · {detected.length} movimientos en 2 meses</span>
            </div>
            <div className="mapping-fields">
              {[
                ['Fecha', 'Columna A', 'high'],
                ['Descripción', 'Columna B', 'high'],
                ['Cargo / Abono', 'Columna C / D', 'high'],
                ['Saldo', 'Columna E', 'medium'],
                ['Categoría', 'Auto-detectada por descripción', 'medium'],
              ].map(([label, field, conf]) => (
                <div key={label} className="map-row">
                  <span className="lbl">{label}</span>
                  <span className="field">{field}</span>
                  <span className={`conf ${conf}`}>{conf === 'high' ? '✓ Alta' : '· Media'}</span>
                </div>
              ))}
            </div>
            <span className="kbv-meta" style={{ marginTop: 8, display: 'block' }}>
              Si algún mapeo es incorrecto podrás ajustarlo en el siguiente paso. Después de importar, el proceso queda guardado para futuras importaciones del mismo banco.
            </span>
          </div>
        </div>
      )}

      {step === 'preview' && (
        <div className="kbv-import-preview">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Monto</th>
                <th>Conf.</th>
              </tr>
            </thead>
            <tbody>
              {detected.map((tx, i) => {
                const cat = FIN_CATEGORIES[tx.cat] || FIN_CATEGORIES.other;
                return (
                  <tr key={i}>
                    <td>{tx.date}</td>
                    <td><strong>{tx.name}</strong></td>
                    <td>
                      <span className="cat-pip" style={{ '--c': cat.color, background: `color-mix(in oklab, ${cat.color} 14%, var(--kb-canvas))`, color: cat.color }}>
                        <KIcon name={cat.icon} size={10} /> {cat.name}
                      </span>
                    </td>
                    <td className={tx.amt > 0 ? 'amt income' : 'amt expense'}>
                      {tx.amt > 0 ? '+' : ''}${tx.amt.toLocaleString('es-MX')}
                    </td>
                    <td>
                      <span className={`conf-pip ${tx.conf}`}>
                        {tx.conf === 'high' ? '✓ Alta' : tx.conf === 'medium' ? '~ Media' : '? Baja'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {step === 'done' && (
        <div className="kbv-import-done">
          <div className="success">
            <KIcon name="check" size={48} />
          </div>
          <h3 className="kbv-h2">¡Listo!</h3>
          <p>Importé <strong>{detected.length} movimientos</strong> a <strong>{accounts.find(a => a.id === accountId)?.name}</strong>. Ya están en tu historial y los KPIs se actualizaron.</p>
        </div>
      )}
    </KBVModal>
  );
}

Object.assign(window, {
  FinanzasScreen,
  FinanzasScreenV2: FinanzasScreen,
  ACCOUNT_TYPES_FULL, CREDIT_TYPES_FULL, FIN_TX_DEMO, FIN_CATEGORIES, FIN_ACCOUNTS_DEMO, FIN_CREDITS_DEMO, FIN_SAVING_PROJECTS, BUDGET_V2,
});
