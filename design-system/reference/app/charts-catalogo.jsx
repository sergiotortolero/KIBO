// charts-catalogo.jsx — segunda tanda: los tipos del catálogo de 38 que Kibo
// sí puede alimentar con datos reales.
//
// Mismo idioma medido de `progress-charts.jsx` que charts-nuevas.jsx:
//   viewBox 520 · padL 40 · padR 16 · padT 16 · padB 26
//   rejilla en 0/50/100% — var(--kb-border), punteada "3 4" al 60%, sólida en la base
//   etiquetas .kbv-chart-axis · trazo 2.4px · área .26 → 0
//   el SVG manda su proporción: width 100% + alto automático
//
// Regla de texto-sobre-color: sobre cualquier tinte de color se usa la tinta
// oscura REAL (var(--kb-text)), nunca una mezcla del mismo color — una mezcla
// al 78% jamás alcanza 4.5:1 contra un tinte al 25-58% del mismo tono.

(function () {
  const fmtN = window.fmtN || ((n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k' : String(Math.round(n)));
  const nbsp = (n) => n.toLocaleString('es-MX').replace(/,/g, '\u202f');
  const W = 520, PADL = 40, PADR = 16, PADT = 16, PADB = 26;
  const GRID = { stroke: 'var(--kb-border)', strokeWidth: 1 };
  const RESP = { width: '100%', style: { height: 'auto', display: 'block' } };
  const uid = (p) => p + Math.random().toString(36).slice(2, 7);
  const Grid = ({ H, from = PADL, to = W - PADR }) => [0, 0.5, 1].map(g => (
    <line key={g} x1={from} x2={to}
      y1={PADT + g * (H - PADT - PADB)} y2={PADT + g * (H - PADT - PADB)}
      {...GRID} strokeDasharray={g === 1 ? '0' : '3 4'} opacity={g === 1 ? 1 : 0.6} />
  ));
  const AX = 'kbv-chart-axis';

  // ── CASCADA ──────────────────────────────────────────────────────
  // Finanzas y balance de XP: de dónde salió y a dónde se fue. Verde
  // sube, rojo baja, y las columnas de inicio y fin son totales.
  function Waterfall({ steps, height = 200, unit = '' }) {
    const H = height;
    let acc = 0; const tops = [];
    steps.forEach(s => { const from = s.total ? 0 : acc; const to = s.total ? s.v : acc + s.v; tops.push([from, to]); if (!s.total) acc += s.v; else acc = s.v; });
    const max = Math.max(...tops.flat(), 1);
    const y = (v) => PADT + (1 - v / max) * (H - PADT - PADB);
    const bw = Math.min(42, (W - PADL - PADR) / steps.length - 10);
    const cx = (i) => PADL + (i + .5) * ((W - PADL - PADR) / steps.length);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} {...RESP} className="kbv-waterfall">
        <Grid H={H} />
        <text x={PADL - 8} y={PADT + 9} textAnchor="end" className={AX}>{fmtN(max)}{unit}</text>
        <text x={PADL - 8} y={H - PADB} textAnchor="end" className={AX}>0</text>
        {steps.map((s, i) => {
          const [a, b] = tops[i], y0 = y(Math.max(a, b)), y1 = y(Math.min(a, b));
          const c = s.total ? 'var(--kb-primary)' : (s.v >= 0 ? '#1E9E63' : '#E64545');
          return (
            <g key={i}>
              {i > 0 && <line x1={cx(i - 1) + bw / 2} x2={cx(i) - bw / 2} y1={y(tops[i - 1][1])} y2={y(tops[i - 1][1])} {...GRID} strokeDasharray="2 3" />}
              <rect x={(cx(i) - bw / 2).toFixed(1)} y={y0.toFixed(1)} width={bw.toFixed(1)}
                height={Math.max(3, y1 - y0).toFixed(1)} rx="5" fill={c} fillOpacity={s.total ? 1 : .88} />
              <text x={cx(i).toFixed(1)} y={(y0 - 5).toFixed(1)} textAnchor="middle" className={AX}
                style={{ fontWeight: 800, fill: 'var(--kb-text)' }}>{s.v > 0 && !s.total ? '+' : ''}{fmtN(s.v)}</text>
              <text x={cx(i).toFixed(1)} y={H - 8} textAnchor="middle" className={AX}>{s.n}</text>
            </g>
          );
        })}
      </svg>
    );
  }

  // ── TREEMAP ──────────────────────────────────────────────────────
  // Reparto proporcional por área: el tamaño ES el dato. Sirve cuando
  // hay muchas partes y el anillo ya no alcanza (>4).
  function Treemap({ items, height = 250, width = 340 }) {
    const Wv = width, Hv = height;
    const total = items.reduce((a, i) => a + i.v, 0);
    // squarified simple: filas alternando corte, suficiente para 4-8 partes
    const rects = []; let x = 0, y = 0, w = Wv, h = Hv, rest = [...items];
    while (rest.length) {
      const horiz = w >= h;
      const it = rest.shift();
      const frac = it.v / rest.reduce((a, i) => a + i.v, it.v);
      if (!rest.length) { rects.push({ ...it, x, y, w, h }); break; }
      if (horiz) { const cw = w * frac; rects.push({ ...it, x, y, w: cw, h }); x += cw; w -= cw; }
      else { const ch = h * frac; rects.push({ ...it, x, y, w, h: ch }); y += ch; h -= ch; }
    }
    return (
      <svg viewBox={`0 0 ${Wv} ${Hv}`} {...RESP} className="kbv-treemap">
        {rects.map((r, i) => (
          <g key={i}>
            <rect x={r.x + 1.5} y={r.y + 1.5} width={Math.max(0, r.w - 3)} height={Math.max(0, r.h - 3)}
              rx="8" fill={`color-mix(in oklab, ${r.c} 46%, #fff)`} />
            {r.w > 62 && r.h > 34 && <>
              <text x={r.x + 11} y={r.y + 21} className={AX}
                style={{ fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 12, fill: 'var(--kb-text)' }}>{r.n}</text>
              <text x={r.x + 11} y={r.y + 36} className={AX} style={{ fill: 'var(--kb-text)', opacity: .72 }}>
                {fmtN(r.v)} · {Math.round(r.v / total * 100)}%
              </text>
            </>}
          </g>
        ))}
      </svg>
    );
  }

  // ── SUNBURST ─────────────────────────────────────────────────────
  // La jerarquía propia de Kibo: área → proyecto → tarea. Anillo
  // interior el área, exterior sus proyectos.
  function Sunburst({ groups, height = 200 }) {
    const cx = 112, cy = 106, r0 = 30, r1 = 58, r2 = 84;
    const total = groups.reduce((a, g) => a + g.v, 0);
    let ang = -90;
    const arc = (a0, a1, ri, ro) => {
      const rad = (a) => a * Math.PI / 180;
      const p = (a, r) => [(cx + r * Math.cos(rad(a))).toFixed(2), (cy + r * Math.sin(rad(a))).toFixed(2)];
      const big = a1 - a0 > 180 ? 1 : 0;
      const [x0, y0] = p(a0, ro), [x1, y1] = p(a1, ro), [x2, y2] = p(a1, ri), [x3, y3] = p(a0, ri);
      return `M ${x0} ${y0} A ${ro} ${ro} 0 ${big} 1 ${x1} ${y1} L ${x2} ${y2} A ${ri} ${ri} 0 ${big} 0 ${x3} ${y3} Z`;
    };
    const out = [];
    groups.forEach((g, gi) => {
      const span = (g.v / total) * 360, a0 = ang, a1 = ang + span;
      out.push(<path key={'g' + gi} d={arc(a0, a1, r0, r1)} fill={g.c} fillOpacity=".9" stroke="var(--kb-card)" strokeWidth="1.5" />);
      let sa = a0;
      (g.kids || []).forEach((k, ki) => {
        const ks = (k.v / g.v) * span;
        out.push(<path key={`k${gi}-${ki}`} d={arc(sa, sa + ks, r1, r2)}
          fill={`color-mix(in oklab, ${g.c} ${52 - ki * 13}%, #fff)`} stroke="var(--kb-card)" strokeWidth="1.5" />);
        sa += ks;
      });
      const mid = (a0 + a1) / 2 * Math.PI / 180;
      out.push(<text key={'t' + gi} x={cx + (r2 + 13) * Math.cos(mid)} y={cy + (r2 + 13) * Math.sin(mid)}
        textAnchor="middle" dominantBaseline="middle" className={AX}
        style={{ fontWeight: 800, fill: g.c, fontSize: 8.5 }}>{g.n}</text>);
      ang = a1;
    });
    return (
      <svg viewBox="0 0 224 212" {...RESP} className="kbv-sunburst">
        {out}
        <circle cx={cx} cy={cy} r={r0 - 2} fill="var(--kb-card)" />
        <text x={cx} y={cy - 3} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 17, fill: 'var(--kb-text)', fontVariantNumeric: 'tabular-nums' }}>
          {nbsp(total)}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" className={AX}>XP</text>
      </svg>
    );
  }

  // ── SANKEY ───────────────────────────────────────────────────────
  // ¿A dónde se va el tiempo? De la fuente al destino, con el grosor
  // como magnitud. Dos columnas basta: más se vuelve ilegible.
  function Sankey({ from, to, links, height = 190 }) {
    const Hv = height, colW = 15, padY = 12, GAP = 6;
    const xL = PADL + 24, xR = W - PADR - 100;
    const sum = (arr) => arr.reduce((a, n) => a + n.v, 0);
    const nMax = Math.max(from.length, to.length);
    const scale = (Hv - padY * 2 - GAP * (nMax - 1)) / Math.max(sum(from), sum(to));
    const place = (arr, x) => { let y = padY; return arr.map(n => { const h = n.v * scale; const o = { ...n, x, y, h }; y += h + GAP; return o; }); };
    const L = place(from, xL), R = place(to, xR);
    const cursorL = {}, cursorR = {};
    return (
      <svg viewBox={`0 0 ${W} ${Hv}`} {...RESP} className="kbv-sankey">
        {links.map((lk, i) => {
          const a = L.find(n => n.id === lk.s), b = R.find(n => n.id === lk.t);
          if (!a || !b) return null;
          const h = lk.v * scale;
          const y0 = a.y + (cursorL[a.id] = (cursorL[a.id] || 0) + h) - h;
          const y1 = b.y + (cursorR[b.id] = (cursorR[b.id] || 0) + h) - h;
          const mx = (a.x + colW + b.x) / 2;
          return (
            <path key={i} fill={a.c} fillOpacity=".26"
              d={`M ${a.x + colW} ${y0} C ${mx} ${y0}, ${mx} ${y1}, ${b.x} ${y1}
                  L ${b.x} ${y1 + h} C ${mx} ${y1 + h}, ${mx} ${y0 + h}, ${a.x + colW} ${y0 + h} Z`} />
          );
        })}
        {[...L, ...R].map((n, i) => (
          <g key={i}>
            <rect x={n.x} y={n.y} width={colW} height={n.h} rx="4" fill={n.c} />
            <text x={n.x < W / 2 ? n.x - 7 : n.x + colW + 7} y={n.y + n.h / 2}
              textAnchor={n.x < W / 2 ? 'end' : 'start'} dominantBaseline="middle" className={AX}
              style={{ fontWeight: 700 }}>{n.n}</text>
          </g>
        ))}
      </svg>
    );
  }

  // ── BALA ─────────────────────────────────────────────────────────
  // KPI contra su meta, en una línea. Más compacto que el medidor:
  // sirve cuando hay varias metas seguidas.
  function Bullet({ rows, unit = '' }) {
    const labelW = 104, valW = 96, barH = 22, gap = 11;
    const H = rows.length * (barH + gap);
    const trackW = W - labelW - valW - 10;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} {...RESP} className="kbv-bullet">
        {rows.map((r, i) => {
          const y = i * (barH + gap), f = Math.min(1, r.v / r.max);
          const ok = r.v >= r.max;
          return (
            <g key={i}>
              <text x={labelW - 10} y={y + barH / 2} textAnchor="end" dominantBaseline="middle"
                className={AX} style={{ fill: 'var(--kb-text-2)', fontWeight: 700 }}>{r.n}</text>
              <rect x={labelW} y={y + 3} width={trackW} height={barH - 6} rx="5" fill="var(--kb-surface-2)" />
              <rect x={labelW} y={y + 3} width={Math.max(4, f * trackW).toFixed(1)} height={barH - 6} rx="5"
                fill={ok ? '#1E9E63' : (r.c || 'var(--kb-primary)')} />
              <line x1={labelW + trackW} x2={labelW + trackW} y1={y} y2={y + barH}
                stroke="var(--kb-text)" strokeWidth="2.4" strokeLinecap="round" />
              <text x={labelW + trackW + 9} y={y + barH / 2} dominantBaseline="middle"
                style={{ fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 11.5, fill: 'var(--kb-text)', fontVariantNumeric: 'tabular-nums' }}>
                {fmtN(r.v)}<tspan style={{ fill: 'var(--kb-text-3)' }}>/{fmtN(r.max)}{r.u != null ? r.u : unit}</tspan>
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  // ── PENDIENTE ────────────────────────────────────────────────────
  // Antes y después, sin pasos intermedios. Para comparar dos cortes:
  // el mes pasado contra este, o antes y después de un prestigio.
  function Slope({ rows, labels, height = 200, unit = '' }) {
    const H = height, xa = PADL + 58, xb = W - PADR - 58;
    const max = Math.max(...rows.flatMap(r => [r.a, r.b]), 1);
    const y = (v) => PADT + 14 + (1 - v / max) * (H - PADT - PADB - 20);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} {...RESP} className="kbv-slope">
        <line x1={xa} x2={xa} y1={PADT + 6} y2={H - PADB} {...GRID} strokeDasharray="3 4" opacity=".7" />
        <line x1={xb} x2={xb} y1={PADT + 6} y2={H - PADB} {...GRID} strokeDasharray="3 4" opacity=".7" />
        <text x={xa} y={PADT - 2} textAnchor="middle" className={AX} style={{ fontWeight: 800 }}>{labels[0]}</text>
        <text x={xb} y={PADT - 2} textAnchor="middle" className={AX} style={{ fontWeight: 800 }}>{labels[1]}</text>
        {rows.map((r, i) => {
          const up = r.b >= r.a;
          return (
            <g key={i}>
              <line x1={xa} y1={y(r.a)} x2={xb} y2={y(r.b)} stroke={r.c} strokeWidth="2.4" strokeLinecap="round" opacity=".85" />
              <circle cx={xa} cy={y(r.a)} r="4" fill="var(--kb-card)" stroke={r.c} strokeWidth="2.4" />
              <circle cx={xb} cy={y(r.b)} r="4" fill={r.c} />
              <text x={xa - 10} y={y(r.a)} textAnchor="end" dominantBaseline="middle" className={AX}
                style={{ fill: 'var(--kb-text-2)', fontWeight: 700 }}>{r.n}</text>
              <text x={xb + 10} y={y(r.b)} dominantBaseline="middle" className={AX}
                style={{ fill: up ? '#1E7A52' : '#B3261E', fontWeight: 800 }}>
                {fmtN(r.b)}{unit} {up ? '↑' : '↓'}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  // ── COMBINADO ────────────────────────────────────────────────────
  // Dos métricas de distinta unidad en un mismo eje X: XP en barras,
  // racha en línea. Solo dos — con tres nadie lo lee.
  function Combo({ points, height = 190, barKey = 'xp', lineKey = 'racha', barLabel = 'XP', lineLabel = 'racha' }) {
    const H = height;
    const bmax = Math.max(...points.map(p => p[barKey]), 1);
    const lmax = Math.max(...points.map(p => p[lineKey]), 1);
    const cx = (i) => PADL + (i + .5) * ((W - PADL - PADR) / points.length);
    const yb = (v) => PADT + (1 - v / bmax) * (H - PADT - PADB);
    const yl = (v) => PADT + (1 - v / lmax) * (H - PADT - PADB);
    const bw = Math.min(30, (W - PADL - PADR) / points.length - 9);
    const line = points.map((p, i) => `${i ? 'L' : 'M'} ${cx(i).toFixed(1)} ${yl(p[lineKey]).toFixed(1)}`).join(' ');
    return (
      <svg viewBox={`0 0 ${W} ${H}`} {...RESP} className="kbv-combo">
        <Grid H={H} />
        <text x={PADL - 8} y={PADT + 9} textAnchor="end" className={AX}>{fmtN(bmax)}</text>
        <text x={PADL - 8} y={H - PADB} textAnchor="end" className={AX}>0</text>
        <text x={W - 4} y={PADT + 9} textAnchor="end" className={AX}
          style={{ fill: 'var(--kb-streak)', fontWeight: 800 }}>{fmtN(lmax)}</text>
        {points.map((p, i) => (
          <rect key={i} x={(cx(i) - bw / 2).toFixed(1)} y={yb(p[barKey]).toFixed(1)} width={bw.toFixed(1)}
            height={Math.max(2, H - PADB - yb(p[barKey])).toFixed(1)} rx="5"
            fill="var(--kb-primary)" fillOpacity=".82" />
        ))}
        <path d={line} fill="none" stroke="var(--kb-streak)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={cx(i).toFixed(1)} cy={yl(p[lineKey]).toFixed(1)} r="3.2"
            fill="var(--kb-card)" stroke="var(--kb-streak)" strokeWidth="2.2" />
        ))}
        {points.map((p, i) => <text key={i} x={cx(i).toFixed(1)} y={H - 8} textAnchor="middle" className={AX}>{p.label}</text>)}
      </svg>
    );
  }

  // ── HISTOGRAMA ───────────────────────────────────────────────────
  // Forma de una distribución: cuántas sesiones duraron cuánto. Las
  // barras se tocan — eso lo distingue de un gráfico de barras.
  function Histogram({ bins, height = 170, color = 'var(--area-wisdom)', unit = '' }) {
    const H = height;
    const max = Math.max(...bins.map(b => b.n), 1);
    const bw = (W - PADL - PADR) / bins.length;
    const y = (v) => PADT + (1 - v / max) * (H - PADT - PADB);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} {...RESP} className="kbv-histogram">
        <Grid H={H} />
        <text x={PADL - 8} y={PADT + 9} textAnchor="end" className={AX}>{max}</text>
        <text x={PADL - 8} y={H - PADB} textAnchor="end" className={AX}>0</text>
        {bins.map((b, i) => (
          <g key={i}>
            <rect x={(PADL + i * bw).toFixed(1)} y={y(b.n).toFixed(1)} width={bw.toFixed(1)}
              height={Math.max(2, H - PADB - y(b.n)).toFixed(1)}
              fill={`color-mix(in oklab, ${color} ${58 + (b.n / max) * 30}%, #fff)`}
              stroke="var(--kb-card)" strokeWidth="1.5" />
            <text x={(PADL + i * bw + bw / 2).toFixed(1)} y={H - 8} textAnchor="middle" className={AX}>{b.label}</text>
          </g>
        ))}
        <text x={W - PADR} y={PADT - 4} textAnchor="end" className={AX} style={{ fontWeight: 700 }}>{unit}</text>
      </svg>
    );
  }

  // ── CAJA ─────────────────────────────────────────────────────────
  // Cuartiles y atípicos. Va con `u-stats-pro`: responde «¿qué tan
  // parejo soy?», no «¿cuánto hice?».
  function BoxPlot({ groups, height = 180, unit = '' }) {
    const H = height;
    const all = groups.flatMap(g => [g.min, g.max]);
    const max = Math.max(...all, 1), min = Math.min(...all, 0);
    const y = (v) => PADT + (1 - (v - min) / Math.max(1e-6, max - min)) * (H - PADT - PADB);
    const cx = (i) => PADL + (i + .5) * ((W - PADL - PADR) / groups.length);
    const bw = Math.min(44, (W - PADL - PADR) / groups.length - 16);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} {...RESP} className="kbv-boxplot">
        <Grid H={H} />
        <text x={PADL - 8} y={PADT + 9} textAnchor="end" className={AX}>{fmtN(max)}{unit}</text>
        <text x={PADL - 8} y={H - PADB} textAnchor="end" className={AX}>{fmtN(min)}</text>
        {groups.map((g, i) => (
          <g key={i}>
            <line x1={cx(i)} x2={cx(i)} y1={y(g.max)} y2={y(g.min)} stroke={g.c} strokeWidth="1.6" opacity=".7" />
            <line x1={cx(i) - 9} x2={cx(i) + 9} y1={y(g.max)} y2={y(g.max)} stroke={g.c} strokeWidth="2" strokeLinecap="round" />
            <line x1={cx(i) - 9} x2={cx(i) + 9} y1={y(g.min)} y2={y(g.min)} stroke={g.c} strokeWidth="2" strokeLinecap="round" />
            <rect x={(cx(i) - bw / 2).toFixed(1)} y={y(g.q3).toFixed(1)} width={bw.toFixed(1)}
              height={Math.max(4, y(g.q1) - y(g.q3)).toFixed(1)} rx="5"
              fill={`color-mix(in oklab, ${g.c} 32%, #fff)`} stroke={g.c} strokeWidth="1.6" />
            <line x1={cx(i) - bw / 2} x2={cx(i) + bw / 2} y1={y(g.med)} y2={y(g.med)} stroke={g.c} strokeWidth="2.8" strokeLinecap="round" />
            <text x={cx(i)} y={H - 8} textAnchor="middle" className={AX}>{g.n}</text>
          </g>
        ))}
      </svg>
    );
  }

  // ── ROSA POLAR ───────────────────────────────────────────────────
  // ¿A qué hora hago las cosas? 24 sectores porque el día es circular:
  // en barras normales las 23h y la 0h quedan en extremos opuestos.
  function PolarRose({ hours, height = 200, color = 'var(--kb-primary)' }) {
    const cx = 100, cy = 100, R = 82, r0 = 20;
    const max = Math.max(...hours, 1);
    const seg = (i, v) => {
      const a0 = (i * 15 - 90 - 7) * Math.PI / 180, a1 = (i * 15 - 90 + 7) * Math.PI / 180;
      const rr = r0 + (v / max) * (R - r0);
      const p = (a, r) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
      return `M ${p(a0, r0)} L ${p(a0, rr)} A ${rr} ${rr} 0 0 1 ${p(a1, rr)} L ${p(a1, r0)} A ${r0} ${r0} 0 0 0 ${p(a0, r0)} Z`;
    };
    return (
      <svg viewBox="0 0 200 200" {...RESP} className="kbv-polar">
        {[.5, 1].map(g => <circle key={g} cx={cx} cy={cy} r={r0 + g * (R - r0)} fill="none" {...GRID}
          strokeDasharray={g === 1 ? '0' : '3 4'} opacity={g === 1 ? 1 : .6} />)}
        {hours.map((v, i) => v > 0 && (
          <path key={i} d={seg(i, v)} fill={color} fillOpacity={.32 + (v / max) * .5} />
        ))}
        {[0, 6, 12, 18].map(hh => {
          const a = (hh * 15 - 90) * Math.PI / 180;
          return <text key={hh} x={cx + (R + 11) * Math.cos(a)} y={cy + (R + 11) * Math.sin(a)}
            textAnchor="middle" dominantBaseline="middle" className={AX} style={{ fontWeight: 800 }}>{hh}h</text>;
        })}
        <circle cx={cx} cy={cy} r={r0 - 3} fill="var(--kb-card)" />
      </svg>
    );
  }

  // ── BURBUJAS ─────────────────────────────────────────────────────
  // Tres variables a la vez: esfuerzo, impacto y frecuencia. El área
  // es el tercer dato — el radio va por raíz, no lineal, o miente.
  function Bubbles({ items, xLabel, yLabel, height = 210 }) {
    const H = height;
    const xs = items.map(i => i.x), ys = items.map(i => i.y);
    const xMax = Math.max(...xs, 1), yMax = Math.max(...ys, 1);
    const rMax = Math.max(...items.map(i => i.r), 1);
    const RBASE = 7, RSPAN = 15;            // radio en unidades de viewBox
    const inset = RBASE + RSPAN + 4;        // el borde reserva el radio mayor
    const px = (v) => PADL + inset + (v / xMax) * (W - PADL - PADR - inset * 2);
    const py = (v) => PADT + inset + (1 - v / yMax) * (H - PADT - PADB - inset * 2);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} {...RESP} className="kbv-bubbles">
        <Grid H={H} />
        <text x={PADL} y={PADT - 5} className={AX} style={{ fontWeight: 700 }}>↑ {yLabel}</text>
        <text x={W - PADR} y={H - 8} textAnchor="end" className={AX}>{xLabel} →</text>
        {items.map((it, i) => (
          <g key={i}>
            <circle cx={px(it.x).toFixed(1)} cy={py(it.y).toFixed(1)} r={(RBASE + Math.sqrt(it.r / rMax) * RSPAN).toFixed(1)}
              fill={it.c} fillOpacity=".34" stroke={it.c} strokeWidth="1.8" />
            <text x={px(it.x).toFixed(1)} y={py(it.y).toFixed(1)} textAnchor="middle" dominantBaseline="middle"
              className={AX} style={{ fill: 'var(--kb-text)', fontWeight: 800 }}>{it.n}</text>
          </g>
        ))}
      </svg>
    );
  }

  Object.assign(window, { Waterfall, Treemap, Sunburst, Sankey, Bullet, Slope, Combo, Histogram, BoxPlot, PolarRose, Bubbles });
})();
