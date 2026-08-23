// charts-nuevas.jsx — las 8 gráficas que el sistema necesita y no existían.
//
// PROPUESTA DEL DS, no extracción: `progress-charts.jsx` trae 6 (línea, barras,
// perfil semanal, heatmap, gantt, filtro de periodo). Estas 8 hablan su MISMO
// idioma, medido del fuente real:
//
//   viewBox 520 de ancho · padL 40 · padR 16 · padT 16 · padB 26
//   rejilla horizontal en [0, .5, 1] — var(--kb-border), 1px,
//     dasharray "3 4" al 60%, sólida en la base
//   etiquetas con class="kbv-chart-axis" (10px, --kb-text-3)
//   trazo principal 2.4px, remates redondos
//   relleno de área: degradado vertical del color, .26 → 0
//   números con fmtN(): 1 240 → "1.2k"
//
// Dos ya están VENDIDAS en la tienda y no existían:
//   RadarChart  → widget `wg-radar`  «Radar de balance», 80 gemas
//   Scatter     → upgrade `u-stats-pro` «Estadísticas avanzadas», 260 gemas

(function () {
  const fmtN = window.fmtN || ((n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k' : String(Math.round(n)));
  const W = 520, PADL = 40, PADR = 16, PADT = 16, PADB = 26;
  const GRID = { stroke: 'var(--kb-border)', strokeWidth: 1 };
  const uid = (p) => p + Math.random().toString(36).slice(2, 7);

  // rejilla horizontal idéntica a la de LineChart
  const Grid = ({ H, from = PADL, to = W - PADR }) => [0, 0.5, 1].map(g => (
    <line key={g} x1={from} x2={to}
      y1={PADT + g * (H - PADT - PADB)} y2={PADT + g * (H - PADT - PADB)}
      {...GRID} strokeDasharray={g === 1 ? '0' : '3 4'} opacity={g === 1 ? 1 : 0.6} />
  ));

  // ── 1 · RADAR de las 5 áreas ─────────────────────────────────────
  // VENDIDO: wg-radar, 80 gemas. Pentágono porque son exactamente 5 áreas.
  function RadarChart({ areas, height = 190, rings = 3 }) {
    const cx = 100, cy = 96, R = 68;
    const at = (i, r) => {
      const a = (-90 + (360 / areas.length) * i) * Math.PI / 180;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    };
    const poly = (r) => areas.map((_, i) => at(i, r).map(n => n.toFixed(1)).join(',')).join(' ');
    const data = areas.map((a, i) => at(i, R * a.v).map(n => n.toFixed(1)).join(',')).join(' ');
    const gid = React.useMemo(() => uid('rd'), []);
    return (
      <svg viewBox="0 0 200 192" width="100%" style={{ height: 'auto', display: 'block' }} className="kbv-radar">
        <defs><radialGradient id={gid}>
          <stop offset="0" stopColor="var(--kb-primary)" stopOpacity=".30" />
          <stop offset="1" stopColor="var(--kb-primary)" stopOpacity=".12" />
        </radialGradient></defs>
        {Array.from({ length: rings }, (_, k) => (
          <polygon key={k} points={poly(R * (k + 1) / rings)} fill="none"
            {...GRID} strokeDasharray={k === rings - 1 ? '0' : '3 4'}
            opacity={k === rings - 1 ? 1 : 0.6} />
        ))}
        {areas.map((_, i) => {
          const [x, y] = at(i, R);
          return <line key={i} x1={cx} y1={cy} x2={x.toFixed(1)} y2={y.toFixed(1)} {...GRID} strokeDasharray="3 4" opacity=".6" />;
        })}
        <polygon points={data} fill={`url(#${gid})`} stroke="var(--kb-primary)" strokeWidth="2.4" strokeLinejoin="round" />
        {areas.map((a, i) => {
          const [x, y] = at(i, R * a.v);
          return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="3.4" fill="var(--kb-card)" stroke={a.c} strokeWidth="2.4" />;
        })}
        {areas.map((a, i) => {
          const [x, y] = at(i, R + 19);
          return (
            <text key={i} x={x.toFixed(1)} y={y.toFixed(1)} textAnchor="middle"
              dominantBaseline="middle" className="kbv-chart-axis"
              style={{ fill: a.c, fontWeight: 800 }}>{a.n}</text>
          );
        })}
      </svg>
    );
  }

  // ── 2 · DISPERSIÓN ───────────────────────────────────────────────
  // VENDIDO: u-stats-pro, 260 gemas. Correlación entre dos series
  // (sueño vs ánimo, gasto vs estrés). Lleva línea de tendencia.
  function Scatter({ points, xLabel, yLabel, height = 300, color = 'var(--area-community)' }) {
    const H = height;
    const xs = points.map(p => p.x), ys = points.map(p => p.y);
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMax = Math.max(...ys, 1);
    const px = (v) => PADL + ((v - xMin) / Math.max(1e-6, xMax - xMin)) * (W - PADL - PADR);
    const py = (v) => PADT + (1 - v / yMax) * (H - PADT - PADB);
    // mínimos cuadrados: la tendencia se calcula, no se dibuja a ojo
    const n = points.length, sx = xs.reduce((a, b) => a + b, 0), sy = ys.reduce((a, b) => a + b, 0);
    const sxy = points.reduce((a, p) => a + p.x * p.y, 0), sxx = xs.reduce((a, v) => a + v * v, 0);
    const m = (n * sxy - sx * sy) / Math.max(1e-6, n * sxx - sx * sx), b = (sy - m * sx) / n;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ height: 'auto', display: 'block' }} className="kbv-scatter">
        <Grid H={H} />
        <text x={PADL - 8} y={PADT + 9} textAnchor="end" className="kbv-chart-axis">{fmtN(yMax)}</text>
        <text x={PADL - 8} y={H - PADB} textAnchor="end" className="kbv-chart-axis">0</text>
        <line x1={px(xMin)} y1={py(m * xMin + b)} x2={px(xMax)} y2={py(m * xMax + b)}
          stroke={color} strokeWidth="2" strokeDasharray="5 5" opacity=".7" />
        {points.map((p, i) => (
          <circle key={i} cx={px(p.x).toFixed(1)} cy={py(p.y).toFixed(1)} r="4.2"
            fill={color} fillOpacity=".55" stroke={color} strokeWidth="1.4" />
        ))}
        <text x={W - PADR} y={H - 8} textAnchor="end" className="kbv-chart-axis">{xLabel}</text>
        <text x={PADL + 4} y={PADT - 6} textAnchor="start" className="kbv-chart-axis"
          style={{ fontWeight: 700 }}>↑ {yLabel}</text>
      </svg>
    );
  }

  // ── 3 · ANILLO ───────────────────────────────────────────────────
  // Composición de un total. Aro grueso, hueco al centro para el dato.
  function Donut({ slices, height = 170, total, unit = '' }) {
    const cx = 90, cy = 90, R = 66, sw = 20;
    const sum = slices.reduce((a, s) => a + s.v, 0);
    const C = 2 * Math.PI * R;
    let acc = 0;
    return (
      <svg viewBox="0 0 180 180" width="100%" style={{ height: 'auto', display: 'block' }} className="kbv-donut">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--kb-surface-2)" strokeWidth={sw} />
        {slices.map((s, i) => {
          const frac = s.v / sum, dash = frac * C;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={s.c} strokeWidth={sw}
              strokeDasharray={`${dash.toFixed(2)} ${(C - dash).toFixed(2)}`}
              strokeDashoffset={(-acc * C).toFixed(2)} strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`} />
          );
          acc += frac;
          return el;
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 25,
                   fill: 'var(--kb-text)', fontVariantNumeric: 'tabular-nums' }}>
          {(total != null ? total : sum).toLocaleString('es-MX').replace(/,/g, '\u202f')}
        </text>
        <text x={cx} y={cy + 17} textAnchor="middle" className="kbv-chart-axis">{unit}</text>
      </svg>
    );
  }

  // ── 4 · BARRA APILADA ────────────────────────────────────────────
  // Distribución dentro de cada periodo. Una sola barra por columna.
  function StackedBars({ cols, keys, height = 150, unit = '' }) {
    const H = height;
    const max = Math.max(...cols.map(c => keys.reduce((a, k) => a + (c.v[k.id] || 0), 0)), 1);
    const bw = Math.min(34, (W - PADL - PADR) / cols.length - 10);
    const cx = (i) => PADL + (i + 0.5) * ((W - PADL - PADR) / cols.length);
    const y = (v) => PADT + (1 - v / max) * (H - PADT - PADB);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ height: 'auto', display: 'block' }} className="kbv-stacked">
        <Grid H={H} />
        <text x={PADL - 8} y={PADT + 4} textAnchor="end" className="kbv-chart-axis">{fmtN(max)}{unit}</text>
        <text x={PADL - 8} y={H - PADB} textAnchor="end" className="kbv-chart-axis">0</text>
        {cols.map((c, i) => {
          let acc = 0;
          return (
            <g key={i}>
              {keys.map((k, j) => {
                const v = c.v[k.id] || 0; if (!v) return null;
                const y0 = y(acc + v), y1 = y(acc); acc += v;
                const isTop = j === keys.length - 1 || !keys.slice(j + 1).some(kk => c.v[kk.id]);
                return (
                  <rect key={k.id} x={(cx(i) - bw / 2).toFixed(1)} y={y0.toFixed(1)}
                    width={bw.toFixed(1)} height={Math.max(1, y1 - y0).toFixed(1)}
                    fill={k.c} rx={isTop ? 5 : 0} />
                );
              })}
              <text x={cx(i).toFixed(1)} y={H - 8} textAnchor="middle" className="kbv-chart-axis">{c.label}</text>
            </g>
          );
        })}
      </svg>
    );
  }

  // ── 5 · MEDIDOR ──────────────────────────────────────────────────
  // Un valor contra su meta. Arco de 180°, nunca un círculo completo:
  // el semicírculo dice «hay un techo» y el círculo no.
  function Gauge({ value, max, height = 130, color = 'var(--kb-primary)', label }) {
    const cx = 100, cy = 96, R = 70, sw = 18;
    const frac = Math.max(0, Math.min(1, value / max));
    const arc = (f) => {
      const a = Math.PI * (1 - f);
      return `${(cx + R * Math.cos(a)).toFixed(1)} ${(cy - R * Math.sin(a)).toFixed(1)}`;
    };
    return (
      <svg viewBox="0 0 200 122" width="100%" style={{ height: 'auto', display: 'block' }} className="kbv-gauge">
        <path d={`M ${arc(0)} A ${R} ${R} 0 0 1 ${arc(1)}`} fill="none"
          stroke="var(--kb-surface-2)" strokeWidth={sw} strokeLinecap="round" />
        <path d={`M ${arc(0)} A ${R} ${R} 0 0 1 ${arc(frac)}`} fill="none"
          stroke={color} strokeWidth={sw} strokeLinecap="round" />
        <text x={cx} y={cy - 16} textAnchor="middle"
          style={{ fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 26,
                   fill: 'var(--kb-text)', fontVariantNumeric: 'tabular-nums' }}>
          {value.toLocaleString('es-MX').replace(/,/g, '\u202f')}
        </text>
        <text x={cx} y={cy + 3} textAnchor="middle" className="kbv-chart-axis">{label || `meta ${fmtN(max)}`}</text>
      </svg>
    );
  }

  // ── 6 · BARRAS HORIZONTALES ──────────────────────────────────────
  // Ranking. Horizontal porque las etiquetas son nombres largos y en
  // vertical se voltean o se cortan.
  function HBars({ rows, unit = '', barH = 26, gap = 8 }) {
    const max = Math.max(...rows.map(r => r.v), 1);
    const labelW = 108, valW = 46;
    const H = rows.length * (barH + gap);
    const trackW = W - labelW - valW - 8;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ height: 'auto', display: 'block' }} className="kbv-hbars">
        {rows.map((r, i) => {
          const y = i * (barH + gap), w = (r.v / max) * trackW;
          return (
            <g key={i}>
              <text x={labelW - 10} y={y + barH / 2} textAnchor="end" dominantBaseline="middle"
                className="kbv-chart-axis" style={{ fill: 'var(--kb-text-2)' }}>{r.n}</text>
              <rect x={labelW} y={y} width={trackW} height={barH} rx="6" fill="var(--kb-surface-2)" />
              <rect x={labelW} y={y} width={Math.max(6, w).toFixed(1)} height={barH} rx="6" fill={r.c || 'var(--kb-primary)'} />
              <text x={labelW + trackW + 8} y={y + barH / 2} dominantBaseline="middle"
                style={{ fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 12, fill: 'var(--kb-text)' }}>
                {fmtN(r.v)}{unit}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  // ── 7 · SPARKLINE ────────────────────────────────────────────────
  // Tendencia dentro de un KPI. Sin ejes ni rejilla — no hay lugar, y
  // el dato exacto ya lo da el valor grande del KPI, al lado.
  function Sparkline({ values, w = 86, h = 26, color = 'var(--kb-primary)', area = true }) {
    const max = Math.max(...values, 1), min = Math.min(...values);
    const x = (i) => (i / Math.max(1, values.length - 1)) * (w - 4) + 2;
    const y = (v) => h - 3 - ((v - min) / Math.max(1e-6, max - min)) * (h - 8);
    const line = values.map((v, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
    const gid = React.useMemo(() => uid('sp'), []);
    return (
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="kbv-spark">
        <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".26" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient></defs>
        {area && <path d={`${line} L ${x(values.length - 1).toFixed(1)} ${h} L ${x(0).toFixed(1)} ${h} Z`} fill={`url(#${gid})`} />}
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={x(values.length - 1).toFixed(1)} cy={y(values[values.length - 1]).toFixed(1)}
          r="2.4" fill="var(--kb-card)" stroke={color} strokeWidth="2" />
      </svg>
    );
  }

  // ── 8 · EMBUDO ───────────────────────────────────────────────────
  // Cuántos sobreviven cada paso. Trapecio, no barras: la forma ya
  // cuenta la caída sin leer los números.
  function Funnel({ steps, height = 160, color = 'var(--kb-primary)' }) {
    const H = height, top = steps[0].v;
    const sw = W - PADL - PADR;
    const stepH = (H - PADT - 12) / steps.length;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ height: 'auto', display: 'block' }} className="kbv-funnel">
        {steps.map((s, i) => {
          const f0 = s.v / top, f1 = (steps[i + 1] ? steps[i + 1].v : s.v) / top;
          const y0 = PADT + i * stepH, y1 = y0 + stepH - 4;
          const w0 = sw * f0, w1 = sw * f1;
          const cx = PADL + sw / 2;
          const d = `M ${(cx - w0 / 2).toFixed(1)} ${y0.toFixed(1)} L ${(cx + w0 / 2).toFixed(1)} ${y0.toFixed(1)} L ${(cx + w1 / 2).toFixed(1)} ${y1.toFixed(1)} L ${(cx - w1 / 2).toFixed(1)} ${y1.toFixed(1)} Z`;
          return (
            <g key={i}>
              <path d={d} fill={`color-mix(in oklab, ${color} ${58 - i * 11}%, #fff)`} />
              <text x={cx} y={y0 + stepH / 2 - 4} textAnchor="middle" dominantBaseline="middle"
                style={{ fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 11.5,
                         fill: 'var(--kb-text)' }}>
                {s.n}
              </text>
              <text x={cx} y={y0 + stepH / 2 + 9} textAnchor="middle" className="kbv-chart-axis"
                style={{ fill: 'var(--kb-text)', opacity: .78 }}>
                {fmtN(s.v)} · {Math.round(f0 * 100)}%
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  Object.assign(window, { RadarChart, Scatter, Donut, StackedBars, Gauge, HBars, Sparkline, Funnel });
})();
