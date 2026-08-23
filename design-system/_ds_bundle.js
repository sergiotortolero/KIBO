/* @ds-bundle: {"format":4,"namespace":"KiboDesignSystem_07af9d","components":[{"name":"KbButton","sourcePath":"components/KbButton.jsx"},{"name":"KbCard","sourcePath":"components/KbCard.jsx"},{"name":"KbChip","sourcePath":"components/KbChip.jsx"},{"name":"KbEmblem","sourcePath":"components/KbEmblem.jsx"},{"name":"KbStatPill","sourcePath":"components/KbStatPill.jsx"}],"sourceHashes":{"components/KbButton.jsx":"d9d8699f6a5a","components/KbCard.jsx":"ded87f9b259b","components/KbChip.jsx":"b1d934d42d7e","components/KbEmblem.jsx":"c2826bdf4c5f","components/KbStatPill.jsx":"9982e4b5b4a4","reference/app/charts-catalogo.jsx":"88c12aeb86fb","reference/app/charts-nuevas.jsx":"79a0e57d2e13","reference/app/icons.jsx":"c6da458196d5","reference/app/kb-gantt.jsx":"2fcb97620eb4","reference/app/kbv-shared.jsx":"85c9477b1f32","reference/app/kibo-blob.jsx":"7cdc5d496db9","reference/app/kibo-quick.jsx":"7babb7fac4af","reference/app/kibo-style.jsx":"4b5188f6161a","reference/app/kibo-vitals.jsx":"f5cbbc89713f","reference/app/kicon-faltantes.jsx":"1e9a00e1d8d9","reference/app/personalizacion.jsx":"3959cedc6d8a","reference/app/prestige-system.jsx":"cdb104d9253c","reference/app/prestigio-nombres.jsx":"6161a8fa5227","reference/app/progress-charts.jsx":"4f89338a23a8","reference/app/reencauce.jsx":"f9759a2a8415","reference/app/tarea-detalle.jsx":"6b5e724f0a21","ui_kits/app/App.jsx":"607b365b73e6","ui_kits/app/Character.jsx":"f1b9842bd29c","ui_kits/app/Dashboard.jsx":"b804887c87c0","ui_kits/app/Header.jsx":"7ef22660c1e2","ui_kits/app/Misc.jsx":"cc5eb9acd34c","ui_kits/app/Sidebar.jsx":"9737c0ec2554","ui_kits/app/Store.jsx":"0eba93317444","ui_kits/app/data.jsx":"9aa74254acd2","ui_kits/app/icons.jsx":"90247a264f4f","ui_kits/app/ui.jsx":"a77cda85bb8c","ui_kits/web/Web.jsx":"f8311a928a7c","ui_kits/web/WebApp.jsx":"7de5f6d1623b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KiboDesignSystem_07af9d = window.KiboDesignSystem_07af9d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/KbButton.jsx
try { (() => {
function KbButton({
  variant = 'primary',
  size,
  children,
  onClick,
  disabled,
  style
}) {
  const cls = 'kbv-btn kbv-btn-' + variant + (size === 'sm' ? ' kbv-btn-sm' : '');
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: cls,
    onClick: onClick,
    disabled: disabled,
    style: style
  }, children);
}
Object.assign(__ds_scope, { KbButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/KbButton.jsx", error: String((e && e.message) || e) }); }

// components/KbCard.jsx
try { (() => {
function KbCard({
  boss,
  hover,
  title,
  meta,
  children,
  style
}) {
  const cls = boss ? 'kbv-card kbv-boss' : 'kbv-card';
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: {
      ...(hover ? {
        borderColor: 'var(--kb-border-strong)',
        boxShadow: 'var(--kb-sh-2)'
      } : null),
      ...style
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--kb-f-display)',
      fontWeight: 700,
      fontSize: 16,
      color: boss ? 'var(--kb-boss)' : 'var(--kb-text)',
      marginBottom: 2
    }
  }, title) : null, meta ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--kb-text-2)',
      marginBottom: 8
    }
  }, meta) : null, children);
}
Object.assign(__ds_scope, { KbCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/KbCard.jsx", error: String((e && e.message) || e) }); }

// components/KbChip.jsx
try { (() => {
function KbChip({
  on,
  color,
  children,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: 'kbv-chip' + (on ? ' active' : ''),
    onClick: onClick,
    style: style
  }, color ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: color,
      marginRight: 6
    }
  }) : null, children);
}
Object.assign(__ds_scope, { KbChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/KbChip.jsx", error: String((e && e.message) || e) }); }

// components/KbEmblem.jsx
try { (() => {
function KbEmblem({
  material = 'bronce',
  level,
  size = 48,
  locked
}) {
  const M = {
    bronce: {
      a: '#E0A878',
      b: '#A8632E',
      ink: '#4A2810'
    },
    plata: {
      a: '#D2D9E1',
      b: '#8A95A2',
      ink: '#363E48'
    },
    oro: {
      a: '#F8DC8A',
      b: '#D4A22B',
      ink: '#5E440E'
    },
    platino: {
      a: '#E9EEF3',
      b: '#AAB6C4',
      ink: '#3A434E'
    },
    obsidiana: {
      a: '#6E6880',
      b: '#241F30',
      ink: '#E6E1F2'
    },
    diamante: {
      a: '#CFF6FF',
      b: '#3FC0DE',
      ink: '#0E4A5A'
    },
    esmeralda: {
      a: '#A8E6C0',
      b: '#1E9E63',
      ink: '#0C4A2C'
    },
    rubi: {
      a: '#FF9DB0',
      b: '#C8102E',
      ink: '#FFFFFF'
    },
    damasco: {
      a: '#C9CDD4',
      b: '#5A5E68',
      ink: '#241B33'
    }
  };
  const m = M[material] || M.bronce;
  const base = {
    width: size,
    height: size * 1.16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    clipPath: 'polygon(50% 100%, 8% 76%, 0 0, 100% 0, 92% 76%)',
    fontFamily: 'var(--kb-f-display)',
    fontWeight: 800,
    fontSize: Math.round(size * 0.3),
    filter: 'drop-shadow(0 2px 3px rgba(20,30,50,.2))'
  };
  if (locked) return /*#__PURE__*/React.createElement("div", {
    style: {
      ...base,
      background: 'var(--kb-surface-2)',
      color: 'var(--kb-text-3)'
    }
  }, "\uD83D\uDD12");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...base,
      background: `linear-gradient(160deg, ${m.a}, ${m.b})`,
      color: m.ink
    }
  }, level);
}
Object.assign(__ds_scope, { KbEmblem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/KbEmblem.jsx", error: String((e && e.message) || e) }); }

// components/KbStatPill.jsx
try { (() => {
function KbStatPill({
  kind = 'coin',
  value,
  style
}) {
  const glyphs = {
    coin: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%,#FBE08A,#F4B740 60%,#D99A1F)',
        boxShadow: 'inset 0 0 0 2px #d99a1f55',
        flex: 'none'
      }
    }),
    gem: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        background: 'linear-gradient(145deg,#9DB4FB,#6E8CF2)',
        clipPath: 'polygon(50% 0,100% 38%,78% 100%,22% 100%,0 38%)',
        flex: 'none'
      }
    }),
    streak: /*#__PURE__*/React.createElement("svg", {
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "var(--kb-streak)"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2c1.5 4 5 5.5 5 9.5a5 5 0 0 1-10 0c0-1.6.8-2.6 1.5-3.4C9 9.5 9.3 10.6 10 11c-.3-2 1-4.2 2-9z"
    })),
    hp: /*#__PURE__*/React.createElement("svg", {
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "var(--kb-hp)"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 21S4 14.5 4 9a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 5.5-8 12-8 12z"
    })),
    xp: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--kb-f-mono)',
        fontWeight: 700,
        fontSize: 11,
        color: 'var(--kb-primary-ink)'
      }
    }, "XP")
  };
  const colors = {
    streak: 'var(--kb-streak)',
    hp: 'var(--kb-hp)'
  };
  return /*#__PURE__*/React.createElement("span", {
    className: "kbv-stat-pill",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      whiteSpace: 'nowrap',
      padding: '6px 12px',
      borderRadius: 'var(--kb-r-pill)',
      background: 'var(--kb-surface)',
      border: '1px solid var(--kb-border)',
      fontFamily: 'var(--kb-f-mono)',
      fontSize: 13,
      fontVariantNumeric: 'tabular-nums',
      color: colors[kind] || 'var(--kb-text)',
      ...style
    }
  }, glyphs[kind], value);
}
Object.assign(__ds_scope, { KbStatPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/KbStatPill.jsx", error: String((e && e.message) || e) }); }

// reference/app/charts-catalogo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const fmtN = window.fmtN || (n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k' : String(Math.round(n)));
  const nbsp = n => n.toLocaleString('es-MX').replace(/,/g, '\u202f');
  const W = 520,
    PADL = 40,
    PADR = 16,
    PADT = 16,
    PADB = 26;
  const GRID = {
    stroke: 'var(--kb-border)',
    strokeWidth: 1
  };
  const RESP = {
    width: '100%',
    style: {
      height: 'auto',
      display: 'block'
    }
  };
  const uid = p => p + Math.random().toString(36).slice(2, 7);
  const Grid = ({
    H,
    from = PADL,
    to = W - PADR
  }) => [0, 0.5, 1].map(g => /*#__PURE__*/React.createElement("line", _extends({
    key: g,
    x1: from,
    x2: to,
    y1: PADT + g * (H - PADT - PADB),
    y2: PADT + g * (H - PADT - PADB)
  }, GRID, {
    strokeDasharray: g === 1 ? '0' : '3 4',
    opacity: g === 1 ? 1 : 0.6
  })));
  const AX = 'kbv-chart-axis';

  // ── CASCADA ──────────────────────────────────────────────────────
  // Finanzas y balance de XP: de dónde salió y a dónde se fue. Verde
  // sube, rojo baja, y las columnas de inicio y fin son totales.
  function Waterfall({
    steps,
    height = 200,
    unit = ''
  }) {
    const H = height;
    let acc = 0;
    const tops = [];
    steps.forEach(s => {
      const from = s.total ? 0 : acc;
      const to = s.total ? s.v : acc + s.v;
      tops.push([from, to]);
      if (!s.total) acc += s.v;else acc = s.v;
    });
    const max = Math.max(...tops.flat(), 1);
    const y = v => PADT + (1 - v / max) * (H - PADT - PADB);
    const bw = Math.min(42, (W - PADL - PADR) / steps.length - 10);
    const cx = i => PADL + (i + .5) * ((W - PADL - PADR) / steps.length);
    return /*#__PURE__*/React.createElement("svg", _extends({
      viewBox: `0 0 ${W} ${H}`
    }, RESP, {
      className: "kbv-waterfall"
    }), /*#__PURE__*/React.createElement(Grid, {
      H: H
    }), /*#__PURE__*/React.createElement("text", {
      x: PADL - 8,
      y: PADT + 9,
      textAnchor: "end",
      className: AX
    }, fmtN(max), unit), /*#__PURE__*/React.createElement("text", {
      x: PADL - 8,
      y: H - PADB,
      textAnchor: "end",
      className: AX
    }, "0"), steps.map((s, i) => {
      const [a, b] = tops[i],
        y0 = y(Math.max(a, b)),
        y1 = y(Math.min(a, b));
      const c = s.total ? 'var(--kb-primary)' : s.v >= 0 ? '#1E9E63' : '#E64545';
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, i > 0 && /*#__PURE__*/React.createElement("line", _extends({
        x1: cx(i - 1) + bw / 2,
        x2: cx(i) - bw / 2,
        y1: y(tops[i - 1][1]),
        y2: y(tops[i - 1][1])
      }, GRID, {
        strokeDasharray: "2 3"
      })), /*#__PURE__*/React.createElement("rect", {
        x: (cx(i) - bw / 2).toFixed(1),
        y: y0.toFixed(1),
        width: bw.toFixed(1),
        height: Math.max(3, y1 - y0).toFixed(1),
        rx: "5",
        fill: c,
        fillOpacity: s.total ? 1 : .88
      }), /*#__PURE__*/React.createElement("text", {
        x: cx(i).toFixed(1),
        y: (y0 - 5).toFixed(1),
        textAnchor: "middle",
        className: AX,
        style: {
          fontWeight: 800,
          fill: 'var(--kb-text)'
        }
      }, s.v > 0 && !s.total ? '+' : '', fmtN(s.v)), /*#__PURE__*/React.createElement("text", {
        x: cx(i).toFixed(1),
        y: H - 8,
        textAnchor: "middle",
        className: AX
      }, s.n));
    }));
  }

  // ── TREEMAP ──────────────────────────────────────────────────────
  // Reparto proporcional por área: el tamaño ES el dato. Sirve cuando
  // hay muchas partes y el anillo ya no alcanza (>4).
  function Treemap({
    items,
    height = 250,
    width = 340
  }) {
    const Wv = width,
      Hv = height;
    const total = items.reduce((a, i) => a + i.v, 0);
    // squarified simple: filas alternando corte, suficiente para 4-8 partes
    const rects = [];
    let x = 0,
      y = 0,
      w = Wv,
      h = Hv,
      rest = [...items];
    while (rest.length) {
      const horiz = w >= h;
      const it = rest.shift();
      const frac = it.v / rest.reduce((a, i) => a + i.v, it.v);
      if (!rest.length) {
        rects.push({
          ...it,
          x,
          y,
          w,
          h
        });
        break;
      }
      if (horiz) {
        const cw = w * frac;
        rects.push({
          ...it,
          x,
          y,
          w: cw,
          h
        });
        x += cw;
        w -= cw;
      } else {
        const ch = h * frac;
        rects.push({
          ...it,
          x,
          y,
          w,
          h: ch
        });
        y += ch;
        h -= ch;
      }
    }
    return /*#__PURE__*/React.createElement("svg", _extends({
      viewBox: `0 0 ${Wv} ${Hv}`
    }, RESP, {
      className: "kbv-treemap"
    }), rects.map((r, i) => /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("rect", {
      x: r.x + 1.5,
      y: r.y + 1.5,
      width: Math.max(0, r.w - 3),
      height: Math.max(0, r.h - 3),
      rx: "8",
      fill: `color-mix(in oklab, ${r.c} 46%, #fff)`
    }), r.w > 62 && r.h > 34 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("text", {
      x: r.x + 11,
      y: r.y + 21,
      className: AX,
      style: {
        fontFamily: 'var(--kb-f-display)',
        fontWeight: 800,
        fontSize: 12,
        fill: 'var(--kb-text)'
      }
    }, r.n), /*#__PURE__*/React.createElement("text", {
      x: r.x + 11,
      y: r.y + 36,
      className: AX,
      style: {
        fill: 'var(--kb-text)',
        opacity: .72
      }
    }, fmtN(r.v), " \xB7 ", Math.round(r.v / total * 100), "%")))));
  }

  // ── SUNBURST ─────────────────────────────────────────────────────
  // La jerarquía propia de Kibo: área → proyecto → tarea. Anillo
  // interior el área, exterior sus proyectos.
  function Sunburst({
    groups,
    height = 200
  }) {
    const cx = 112,
      cy = 106,
      r0 = 30,
      r1 = 58,
      r2 = 84;
    const total = groups.reduce((a, g) => a + g.v, 0);
    let ang = -90;
    const arc = (a0, a1, ri, ro) => {
      const rad = a => a * Math.PI / 180;
      const p = (a, r) => [(cx + r * Math.cos(rad(a))).toFixed(2), (cy + r * Math.sin(rad(a))).toFixed(2)];
      const big = a1 - a0 > 180 ? 1 : 0;
      const [x0, y0] = p(a0, ro),
        [x1, y1] = p(a1, ro),
        [x2, y2] = p(a1, ri),
        [x3, y3] = p(a0, ri);
      return `M ${x0} ${y0} A ${ro} ${ro} 0 ${big} 1 ${x1} ${y1} L ${x2} ${y2} A ${ri} ${ri} 0 ${big} 0 ${x3} ${y3} Z`;
    };
    const out = [];
    groups.forEach((g, gi) => {
      const span = g.v / total * 360,
        a0 = ang,
        a1 = ang + span;
      out.push(/*#__PURE__*/React.createElement("path", {
        key: 'g' + gi,
        d: arc(a0, a1, r0, r1),
        fill: g.c,
        fillOpacity: ".9",
        stroke: "var(--kb-card)",
        strokeWidth: "1.5"
      }));
      let sa = a0;
      (g.kids || []).forEach((k, ki) => {
        const ks = k.v / g.v * span;
        out.push(/*#__PURE__*/React.createElement("path", {
          key: `k${gi}-${ki}`,
          d: arc(sa, sa + ks, r1, r2),
          fill: `color-mix(in oklab, ${g.c} ${52 - ki * 13}%, #fff)`,
          stroke: "var(--kb-card)",
          strokeWidth: "1.5"
        }));
        sa += ks;
      });
      const mid = (a0 + a1) / 2 * Math.PI / 180;
      out.push(/*#__PURE__*/React.createElement("text", {
        key: 't' + gi,
        x: cx + (r2 + 13) * Math.cos(mid),
        y: cy + (r2 + 13) * Math.sin(mid),
        textAnchor: "middle",
        dominantBaseline: "middle",
        className: AX,
        style: {
          fontWeight: 800,
          fill: g.c,
          fontSize: 8.5
        }
      }, g.n));
      ang = a1;
    });
    return /*#__PURE__*/React.createElement("svg", _extends({
      viewBox: "0 0 224 212"
    }, RESP, {
      className: "kbv-sunburst"
    }), out, /*#__PURE__*/React.createElement("circle", {
      cx: cx,
      cy: cy,
      r: r0 - 2,
      fill: "var(--kb-card)"
    }), /*#__PURE__*/React.createElement("text", {
      x: cx,
      y: cy - 3,
      textAnchor: "middle",
      dominantBaseline: "middle",
      style: {
        fontFamily: 'var(--kb-f-display)',
        fontWeight: 800,
        fontSize: 17,
        fill: 'var(--kb-text)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, nbsp(total)), /*#__PURE__*/React.createElement("text", {
      x: cx,
      y: cy + 12,
      textAnchor: "middle",
      className: AX
    }, "XP"));
  }

  // ── SANKEY ───────────────────────────────────────────────────────
  // ¿A dónde se va el tiempo? De la fuente al destino, con el grosor
  // como magnitud. Dos columnas basta: más se vuelve ilegible.
  function Sankey({
    from,
    to,
    links,
    height = 190
  }) {
    const Hv = height,
      colW = 15,
      padY = 12,
      GAP = 6;
    const xL = PADL + 24,
      xR = W - PADR - 100;
    const sum = arr => arr.reduce((a, n) => a + n.v, 0);
    const nMax = Math.max(from.length, to.length);
    const scale = (Hv - padY * 2 - GAP * (nMax - 1)) / Math.max(sum(from), sum(to));
    const place = (arr, x) => {
      let y = padY;
      return arr.map(n => {
        const h = n.v * scale;
        const o = {
          ...n,
          x,
          y,
          h
        };
        y += h + GAP;
        return o;
      });
    };
    const L = place(from, xL),
      R = place(to, xR);
    const cursorL = {},
      cursorR = {};
    return /*#__PURE__*/React.createElement("svg", _extends({
      viewBox: `0 0 ${W} ${Hv}`
    }, RESP, {
      className: "kbv-sankey"
    }), links.map((lk, i) => {
      const a = L.find(n => n.id === lk.s),
        b = R.find(n => n.id === lk.t);
      if (!a || !b) return null;
      const h = lk.v * scale;
      const y0 = a.y + (cursorL[a.id] = (cursorL[a.id] || 0) + h) - h;
      const y1 = b.y + (cursorR[b.id] = (cursorR[b.id] || 0) + h) - h;
      const mx = (a.x + colW + b.x) / 2;
      return /*#__PURE__*/React.createElement("path", {
        key: i,
        fill: a.c,
        fillOpacity: ".26",
        d: `M ${a.x + colW} ${y0} C ${mx} ${y0}, ${mx} ${y1}, ${b.x} ${y1}
                  L ${b.x} ${y1 + h} C ${mx} ${y1 + h}, ${mx} ${y0 + h}, ${a.x + colW} ${y0 + h} Z`
      });
    }), [...L, ...R].map((n, i) => /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("rect", {
      x: n.x,
      y: n.y,
      width: colW,
      height: n.h,
      rx: "4",
      fill: n.c
    }), /*#__PURE__*/React.createElement("text", {
      x: n.x < W / 2 ? n.x - 7 : n.x + colW + 7,
      y: n.y + n.h / 2,
      textAnchor: n.x < W / 2 ? 'end' : 'start',
      dominantBaseline: "middle",
      className: AX,
      style: {
        fontWeight: 700
      }
    }, n.n))));
  }

  // ── BALA ─────────────────────────────────────────────────────────
  // KPI contra su meta, en una línea. Más compacto que el medidor:
  // sirve cuando hay varias metas seguidas.
  function Bullet({
    rows,
    unit = ''
  }) {
    const labelW = 104,
      valW = 96,
      barH = 22,
      gap = 11;
    const H = rows.length * (barH + gap);
    const trackW = W - labelW - valW - 10;
    return /*#__PURE__*/React.createElement("svg", _extends({
      viewBox: `0 0 ${W} ${H}`
    }, RESP, {
      className: "kbv-bullet"
    }), rows.map((r, i) => {
      const y = i * (barH + gap),
        f = Math.min(1, r.v / r.max);
      const ok = r.v >= r.max;
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, /*#__PURE__*/React.createElement("text", {
        x: labelW - 10,
        y: y + barH / 2,
        textAnchor: "end",
        dominantBaseline: "middle",
        className: AX,
        style: {
          fill: 'var(--kb-text-2)',
          fontWeight: 700
        }
      }, r.n), /*#__PURE__*/React.createElement("rect", {
        x: labelW,
        y: y + 3,
        width: trackW,
        height: barH - 6,
        rx: "5",
        fill: "var(--kb-surface-2)"
      }), /*#__PURE__*/React.createElement("rect", {
        x: labelW,
        y: y + 3,
        width: Math.max(4, f * trackW).toFixed(1),
        height: barH - 6,
        rx: "5",
        fill: ok ? '#1E9E63' : r.c || 'var(--kb-primary)'
      }), /*#__PURE__*/React.createElement("line", {
        x1: labelW + trackW,
        x2: labelW + trackW,
        y1: y,
        y2: y + barH,
        stroke: "var(--kb-text)",
        strokeWidth: "2.4",
        strokeLinecap: "round"
      }), /*#__PURE__*/React.createElement("text", {
        x: labelW + trackW + 9,
        y: y + barH / 2,
        dominantBaseline: "middle",
        style: {
          fontFamily: 'var(--kb-f-display)',
          fontWeight: 800,
          fontSize: 11.5,
          fill: 'var(--kb-text)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, fmtN(r.v), /*#__PURE__*/React.createElement("tspan", {
        style: {
          fill: 'var(--kb-text-3)'
        }
      }, "/", fmtN(r.max), r.u != null ? r.u : unit)));
    }));
  }

  // ── PENDIENTE ────────────────────────────────────────────────────
  // Antes y después, sin pasos intermedios. Para comparar dos cortes:
  // el mes pasado contra este, o antes y después de un prestigio.
  function Slope({
    rows,
    labels,
    height = 200,
    unit = ''
  }) {
    const H = height,
      xa = PADL + 58,
      xb = W - PADR - 58;
    const max = Math.max(...rows.flatMap(r => [r.a, r.b]), 1);
    const y = v => PADT + 14 + (1 - v / max) * (H - PADT - PADB - 20);
    return /*#__PURE__*/React.createElement("svg", _extends({
      viewBox: `0 0 ${W} ${H}`
    }, RESP, {
      className: "kbv-slope"
    }), /*#__PURE__*/React.createElement("line", _extends({
      x1: xa,
      x2: xa,
      y1: PADT + 6,
      y2: H - PADB
    }, GRID, {
      strokeDasharray: "3 4",
      opacity: ".7"
    })), /*#__PURE__*/React.createElement("line", _extends({
      x1: xb,
      x2: xb,
      y1: PADT + 6,
      y2: H - PADB
    }, GRID, {
      strokeDasharray: "3 4",
      opacity: ".7"
    })), /*#__PURE__*/React.createElement("text", {
      x: xa,
      y: PADT - 2,
      textAnchor: "middle",
      className: AX,
      style: {
        fontWeight: 800
      }
    }, labels[0]), /*#__PURE__*/React.createElement("text", {
      x: xb,
      y: PADT - 2,
      textAnchor: "middle",
      className: AX,
      style: {
        fontWeight: 800
      }
    }, labels[1]), rows.map((r, i) => {
      const up = r.b >= r.a;
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, /*#__PURE__*/React.createElement("line", {
        x1: xa,
        y1: y(r.a),
        x2: xb,
        y2: y(r.b),
        stroke: r.c,
        strokeWidth: "2.4",
        strokeLinecap: "round",
        opacity: ".85"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: xa,
        cy: y(r.a),
        r: "4",
        fill: "var(--kb-card)",
        stroke: r.c,
        strokeWidth: "2.4"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: xb,
        cy: y(r.b),
        r: "4",
        fill: r.c
      }), /*#__PURE__*/React.createElement("text", {
        x: xa - 10,
        y: y(r.a),
        textAnchor: "end",
        dominantBaseline: "middle",
        className: AX,
        style: {
          fill: 'var(--kb-text-2)',
          fontWeight: 700
        }
      }, r.n), /*#__PURE__*/React.createElement("text", {
        x: xb + 10,
        y: y(r.b),
        dominantBaseline: "middle",
        className: AX,
        style: {
          fill: up ? '#1E7A52' : '#B3261E',
          fontWeight: 800
        }
      }, fmtN(r.b), unit, " ", up ? '↑' : '↓'));
    }));
  }

  // ── COMBINADO ────────────────────────────────────────────────────
  // Dos métricas de distinta unidad en un mismo eje X: XP en barras,
  // racha en línea. Solo dos — con tres nadie lo lee.
  function Combo({
    points,
    height = 190,
    barKey = 'xp',
    lineKey = 'racha',
    barLabel = 'XP',
    lineLabel = 'racha'
  }) {
    const H = height;
    const bmax = Math.max(...points.map(p => p[barKey]), 1);
    const lmax = Math.max(...points.map(p => p[lineKey]), 1);
    const cx = i => PADL + (i + .5) * ((W - PADL - PADR) / points.length);
    const yb = v => PADT + (1 - v / bmax) * (H - PADT - PADB);
    const yl = v => PADT + (1 - v / lmax) * (H - PADT - PADB);
    const bw = Math.min(30, (W - PADL - PADR) / points.length - 9);
    const line = points.map((p, i) => `${i ? 'L' : 'M'} ${cx(i).toFixed(1)} ${yl(p[lineKey]).toFixed(1)}`).join(' ');
    return /*#__PURE__*/React.createElement("svg", _extends({
      viewBox: `0 0 ${W} ${H}`
    }, RESP, {
      className: "kbv-combo"
    }), /*#__PURE__*/React.createElement(Grid, {
      H: H
    }), /*#__PURE__*/React.createElement("text", {
      x: PADL - 8,
      y: PADT + 9,
      textAnchor: "end",
      className: AX
    }, fmtN(bmax)), /*#__PURE__*/React.createElement("text", {
      x: PADL - 8,
      y: H - PADB,
      textAnchor: "end",
      className: AX
    }, "0"), /*#__PURE__*/React.createElement("text", {
      x: W - 4,
      y: PADT + 9,
      textAnchor: "end",
      className: AX,
      style: {
        fill: 'var(--kb-streak)',
        fontWeight: 800
      }
    }, fmtN(lmax)), points.map((p, i) => /*#__PURE__*/React.createElement("rect", {
      key: i,
      x: (cx(i) - bw / 2).toFixed(1),
      y: yb(p[barKey]).toFixed(1),
      width: bw.toFixed(1),
      height: Math.max(2, H - PADB - yb(p[barKey])).toFixed(1),
      rx: "5",
      fill: "var(--kb-primary)",
      fillOpacity: ".82"
    })), /*#__PURE__*/React.createElement("path", {
      d: line,
      fill: "none",
      stroke: "var(--kb-streak)",
      strokeWidth: "2.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), points.map((p, i) => /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: cx(i).toFixed(1),
      cy: yl(p[lineKey]).toFixed(1),
      r: "3.2",
      fill: "var(--kb-card)",
      stroke: "var(--kb-streak)",
      strokeWidth: "2.2"
    })), points.map((p, i) => /*#__PURE__*/React.createElement("text", {
      key: i,
      x: cx(i).toFixed(1),
      y: H - 8,
      textAnchor: "middle",
      className: AX
    }, p.label)));
  }

  // ── HISTOGRAMA ───────────────────────────────────────────────────
  // Forma de una distribución: cuántas sesiones duraron cuánto. Las
  // barras se tocan — eso lo distingue de un gráfico de barras.
  function Histogram({
    bins,
    height = 170,
    color = 'var(--area-wisdom)',
    unit = ''
  }) {
    const H = height;
    const max = Math.max(...bins.map(b => b.n), 1);
    const bw = (W - PADL - PADR) / bins.length;
    const y = v => PADT + (1 - v / max) * (H - PADT - PADB);
    return /*#__PURE__*/React.createElement("svg", _extends({
      viewBox: `0 0 ${W} ${H}`
    }, RESP, {
      className: "kbv-histogram"
    }), /*#__PURE__*/React.createElement(Grid, {
      H: H
    }), /*#__PURE__*/React.createElement("text", {
      x: PADL - 8,
      y: PADT + 9,
      textAnchor: "end",
      className: AX
    }, max), /*#__PURE__*/React.createElement("text", {
      x: PADL - 8,
      y: H - PADB,
      textAnchor: "end",
      className: AX
    }, "0"), bins.map((b, i) => /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("rect", {
      x: (PADL + i * bw).toFixed(1),
      y: y(b.n).toFixed(1),
      width: bw.toFixed(1),
      height: Math.max(2, H - PADB - y(b.n)).toFixed(1),
      fill: `color-mix(in oklab, ${color} ${58 + b.n / max * 30}%, #fff)`,
      stroke: "var(--kb-card)",
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("text", {
      x: (PADL + i * bw + bw / 2).toFixed(1),
      y: H - 8,
      textAnchor: "middle",
      className: AX
    }, b.label))), /*#__PURE__*/React.createElement("text", {
      x: W - PADR,
      y: PADT - 4,
      textAnchor: "end",
      className: AX,
      style: {
        fontWeight: 700
      }
    }, unit));
  }

  // ── CAJA ─────────────────────────────────────────────────────────
  // Cuartiles y atípicos. Va con `u-stats-pro`: responde «¿qué tan
  // parejo soy?», no «¿cuánto hice?».
  function BoxPlot({
    groups,
    height = 180,
    unit = ''
  }) {
    const H = height;
    const all = groups.flatMap(g => [g.min, g.max]);
    const max = Math.max(...all, 1),
      min = Math.min(...all, 0);
    const y = v => PADT + (1 - (v - min) / Math.max(1e-6, max - min)) * (H - PADT - PADB);
    const cx = i => PADL + (i + .5) * ((W - PADL - PADR) / groups.length);
    const bw = Math.min(44, (W - PADL - PADR) / groups.length - 16);
    return /*#__PURE__*/React.createElement("svg", _extends({
      viewBox: `0 0 ${W} ${H}`
    }, RESP, {
      className: "kbv-boxplot"
    }), /*#__PURE__*/React.createElement(Grid, {
      H: H
    }), /*#__PURE__*/React.createElement("text", {
      x: PADL - 8,
      y: PADT + 9,
      textAnchor: "end",
      className: AX
    }, fmtN(max), unit), /*#__PURE__*/React.createElement("text", {
      x: PADL - 8,
      y: H - PADB,
      textAnchor: "end",
      className: AX
    }, fmtN(min)), groups.map((g, i) => /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("line", {
      x1: cx(i),
      x2: cx(i),
      y1: y(g.max),
      y2: y(g.min),
      stroke: g.c,
      strokeWidth: "1.6",
      opacity: ".7"
    }), /*#__PURE__*/React.createElement("line", {
      x1: cx(i) - 9,
      x2: cx(i) + 9,
      y1: y(g.max),
      y2: y(g.max),
      stroke: g.c,
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("line", {
      x1: cx(i) - 9,
      x2: cx(i) + 9,
      y1: y(g.min),
      y2: y(g.min),
      stroke: g.c,
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: (cx(i) - bw / 2).toFixed(1),
      y: y(g.q3).toFixed(1),
      width: bw.toFixed(1),
      height: Math.max(4, y(g.q1) - y(g.q3)).toFixed(1),
      rx: "5",
      fill: `color-mix(in oklab, ${g.c} 32%, #fff)`,
      stroke: g.c,
      strokeWidth: "1.6"
    }), /*#__PURE__*/React.createElement("line", {
      x1: cx(i) - bw / 2,
      x2: cx(i) + bw / 2,
      y1: y(g.med),
      y2: y(g.med),
      stroke: g.c,
      strokeWidth: "2.8",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("text", {
      x: cx(i),
      y: H - 8,
      textAnchor: "middle",
      className: AX
    }, g.n))));
  }

  // ── ROSA POLAR ───────────────────────────────────────────────────
  // ¿A qué hora hago las cosas? 24 sectores porque el día es circular:
  // en barras normales las 23h y la 0h quedan en extremos opuestos.
  function PolarRose({
    hours,
    height = 200,
    color = 'var(--kb-primary)'
  }) {
    const cx = 100,
      cy = 100,
      R = 82,
      r0 = 20;
    const max = Math.max(...hours, 1);
    const seg = (i, v) => {
      const a0 = (i * 15 - 90 - 7) * Math.PI / 180,
        a1 = (i * 15 - 90 + 7) * Math.PI / 180;
      const rr = r0 + v / max * (R - r0);
      const p = (a, r) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
      return `M ${p(a0, r0)} L ${p(a0, rr)} A ${rr} ${rr} 0 0 1 ${p(a1, rr)} L ${p(a1, r0)} A ${r0} ${r0} 0 0 0 ${p(a0, r0)} Z`;
    };
    return /*#__PURE__*/React.createElement("svg", _extends({
      viewBox: "0 0 200 200"
    }, RESP, {
      className: "kbv-polar"
    }), [.5, 1].map(g => /*#__PURE__*/React.createElement("circle", _extends({
      key: g,
      cx: cx,
      cy: cy,
      r: r0 + g * (R - r0),
      fill: "none"
    }, GRID, {
      strokeDasharray: g === 1 ? '0' : '3 4',
      opacity: g === 1 ? 1 : .6
    }))), hours.map((v, i) => v > 0 && /*#__PURE__*/React.createElement("path", {
      key: i,
      d: seg(i, v),
      fill: color,
      fillOpacity: .32 + v / max * .5
    })), [0, 6, 12, 18].map(hh => {
      const a = (hh * 15 - 90) * Math.PI / 180;
      return /*#__PURE__*/React.createElement("text", {
        key: hh,
        x: cx + (R + 11) * Math.cos(a),
        y: cy + (R + 11) * Math.sin(a),
        textAnchor: "middle",
        dominantBaseline: "middle",
        className: AX,
        style: {
          fontWeight: 800
        }
      }, hh, "h");
    }), /*#__PURE__*/React.createElement("circle", {
      cx: cx,
      cy: cy,
      r: r0 - 3,
      fill: "var(--kb-card)"
    }));
  }

  // ── BURBUJAS ─────────────────────────────────────────────────────
  // Tres variables a la vez: esfuerzo, impacto y frecuencia. El área
  // es el tercer dato — el radio va por raíz, no lineal, o miente.
  function Bubbles({
    items,
    xLabel,
    yLabel,
    height = 210
  }) {
    const H = height;
    const xs = items.map(i => i.x),
      ys = items.map(i => i.y);
    const xMax = Math.max(...xs, 1),
      yMax = Math.max(...ys, 1);
    const rMax = Math.max(...items.map(i => i.r), 1);
    const RBASE = 7,
      RSPAN = 15; // radio en unidades de viewBox
    const inset = RBASE + RSPAN + 4; // el borde reserva el radio mayor
    const px = v => PADL + inset + v / xMax * (W - PADL - PADR - inset * 2);
    const py = v => PADT + inset + (1 - v / yMax) * (H - PADT - PADB - inset * 2);
    return /*#__PURE__*/React.createElement("svg", _extends({
      viewBox: `0 0 ${W} ${H}`
    }, RESP, {
      className: "kbv-bubbles"
    }), /*#__PURE__*/React.createElement(Grid, {
      H: H
    }), /*#__PURE__*/React.createElement("text", {
      x: PADL,
      y: PADT - 5,
      className: AX,
      style: {
        fontWeight: 700
      }
    }, "\u2191 ", yLabel), /*#__PURE__*/React.createElement("text", {
      x: W - PADR,
      y: H - 8,
      textAnchor: "end",
      className: AX
    }, xLabel, " \u2192"), items.map((it, i) => /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("circle", {
      cx: px(it.x).toFixed(1),
      cy: py(it.y).toFixed(1),
      r: (RBASE + Math.sqrt(it.r / rMax) * RSPAN).toFixed(1),
      fill: it.c,
      fillOpacity: ".34",
      stroke: it.c,
      strokeWidth: "1.8"
    }), /*#__PURE__*/React.createElement("text", {
      x: px(it.x).toFixed(1),
      y: py(it.y).toFixed(1),
      textAnchor: "middle",
      dominantBaseline: "middle",
      className: AX,
      style: {
        fill: 'var(--kb-text)',
        fontWeight: 800
      }
    }, it.n))));
  }
  Object.assign(window, {
    Waterfall,
    Treemap,
    Sunburst,
    Sankey,
    Bullet,
    Slope,
    Combo,
    Histogram,
    BoxPlot,
    PolarRose,
    Bubbles
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/charts-catalogo.jsx", error: String((e && e.message) || e) }); }

// reference/app/charts-nuevas.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const fmtN = window.fmtN || (n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k' : String(Math.round(n)));
  const W = 520,
    PADL = 40,
    PADR = 16,
    PADT = 16,
    PADB = 26;
  const GRID = {
    stroke: 'var(--kb-border)',
    strokeWidth: 1
  };
  const uid = p => p + Math.random().toString(36).slice(2, 7);

  // rejilla horizontal idéntica a la de LineChart
  const Grid = ({
    H,
    from = PADL,
    to = W - PADR
  }) => [0, 0.5, 1].map(g => /*#__PURE__*/React.createElement("line", _extends({
    key: g,
    x1: from,
    x2: to,
    y1: PADT + g * (H - PADT - PADB),
    y2: PADT + g * (H - PADT - PADB)
  }, GRID, {
    strokeDasharray: g === 1 ? '0' : '3 4',
    opacity: g === 1 ? 1 : 0.6
  })));

  // ── 1 · RADAR de las 5 áreas ─────────────────────────────────────
  // VENDIDO: wg-radar, 80 gemas. Pentágono porque son exactamente 5 áreas.
  function RadarChart({
    areas,
    height = 190,
    rings = 3
  }) {
    const cx = 100,
      cy = 96,
      R = 68;
    const at = (i, r) => {
      const a = (-90 + 360 / areas.length * i) * Math.PI / 180;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    };
    const poly = r => areas.map((_, i) => at(i, r).map(n => n.toFixed(1)).join(',')).join(' ');
    const data = areas.map((a, i) => at(i, R * a.v).map(n => n.toFixed(1)).join(',')).join(' ');
    const gid = React.useMemo(() => uid('rd'), []);
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 200 192",
      width: "100%",
      style: {
        height: 'auto',
        display: 'block'
      },
      className: "kbv-radar"
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
      id: gid
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "var(--kb-primary)",
      stopOpacity: ".30"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "var(--kb-primary)",
      stopOpacity: ".12"
    }))), Array.from({
      length: rings
    }, (_, k) => /*#__PURE__*/React.createElement("polygon", _extends({
      key: k,
      points: poly(R * (k + 1) / rings),
      fill: "none"
    }, GRID, {
      strokeDasharray: k === rings - 1 ? '0' : '3 4',
      opacity: k === rings - 1 ? 1 : 0.6
    }))), areas.map((_, i) => {
      const [x, y] = at(i, R);
      return /*#__PURE__*/React.createElement("line", _extends({
        key: i,
        x1: cx,
        y1: cy,
        x2: x.toFixed(1),
        y2: y.toFixed(1)
      }, GRID, {
        strokeDasharray: "3 4",
        opacity: ".6"
      }));
    }), /*#__PURE__*/React.createElement("polygon", {
      points: data,
      fill: `url(#${gid})`,
      stroke: "var(--kb-primary)",
      strokeWidth: "2.4",
      strokeLinejoin: "round"
    }), areas.map((a, i) => {
      const [x, y] = at(i, R * a.v);
      return /*#__PURE__*/React.createElement("circle", {
        key: i,
        cx: x.toFixed(1),
        cy: y.toFixed(1),
        r: "3.4",
        fill: "var(--kb-card)",
        stroke: a.c,
        strokeWidth: "2.4"
      });
    }), areas.map((a, i) => {
      const [x, y] = at(i, R + 19);
      return /*#__PURE__*/React.createElement("text", {
        key: i,
        x: x.toFixed(1),
        y: y.toFixed(1),
        textAnchor: "middle",
        dominantBaseline: "middle",
        className: "kbv-chart-axis",
        style: {
          fill: a.c,
          fontWeight: 800
        }
      }, a.n);
    }));
  }

  // ── 2 · DISPERSIÓN ───────────────────────────────────────────────
  // VENDIDO: u-stats-pro, 260 gemas. Correlación entre dos series
  // (sueño vs ánimo, gasto vs estrés). Lleva línea de tendencia.
  function Scatter({
    points,
    xLabel,
    yLabel,
    height = 300,
    color = 'var(--area-community)'
  }) {
    const H = height;
    const xs = points.map(p => p.x),
      ys = points.map(p => p.y);
    const xMin = Math.min(...xs),
      xMax = Math.max(...xs);
    const yMax = Math.max(...ys, 1);
    const px = v => PADL + (v - xMin) / Math.max(1e-6, xMax - xMin) * (W - PADL - PADR);
    const py = v => PADT + (1 - v / yMax) * (H - PADT - PADB);
    // mínimos cuadrados: la tendencia se calcula, no se dibuja a ojo
    const n = points.length,
      sx = xs.reduce((a, b) => a + b, 0),
      sy = ys.reduce((a, b) => a + b, 0);
    const sxy = points.reduce((a, p) => a + p.x * p.y, 0),
      sxx = xs.reduce((a, v) => a + v * v, 0);
    const m = (n * sxy - sx * sy) / Math.max(1e-6, n * sxx - sx * sx),
      b = (sy - m * sx) / n;
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      width: "100%",
      style: {
        height: 'auto',
        display: 'block'
      },
      className: "kbv-scatter"
    }, /*#__PURE__*/React.createElement(Grid, {
      H: H
    }), /*#__PURE__*/React.createElement("text", {
      x: PADL - 8,
      y: PADT + 9,
      textAnchor: "end",
      className: "kbv-chart-axis"
    }, fmtN(yMax)), /*#__PURE__*/React.createElement("text", {
      x: PADL - 8,
      y: H - PADB,
      textAnchor: "end",
      className: "kbv-chart-axis"
    }, "0"), /*#__PURE__*/React.createElement("line", {
      x1: px(xMin),
      y1: py(m * xMin + b),
      x2: px(xMax),
      y2: py(m * xMax + b),
      stroke: color,
      strokeWidth: "2",
      strokeDasharray: "5 5",
      opacity: ".7"
    }), points.map((p, i) => /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: px(p.x).toFixed(1),
      cy: py(p.y).toFixed(1),
      r: "4.2",
      fill: color,
      fillOpacity: ".55",
      stroke: color,
      strokeWidth: "1.4"
    })), /*#__PURE__*/React.createElement("text", {
      x: W - PADR,
      y: H - 8,
      textAnchor: "end",
      className: "kbv-chart-axis"
    }, xLabel), /*#__PURE__*/React.createElement("text", {
      x: PADL + 4,
      y: PADT - 6,
      textAnchor: "start",
      className: "kbv-chart-axis",
      style: {
        fontWeight: 700
      }
    }, "\u2191 ", yLabel));
  }

  // ── 3 · ANILLO ───────────────────────────────────────────────────
  // Composición de un total. Aro grueso, hueco al centro para el dato.
  function Donut({
    slices,
    height = 170,
    total,
    unit = ''
  }) {
    const cx = 90,
      cy = 90,
      R = 66,
      sw = 20;
    const sum = slices.reduce((a, s) => a + s.v, 0);
    const C = 2 * Math.PI * R;
    let acc = 0;
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 180 180",
      width: "100%",
      style: {
        height: 'auto',
        display: 'block'
      },
      className: "kbv-donut"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: cx,
      cy: cy,
      r: R,
      fill: "none",
      stroke: "var(--kb-surface-2)",
      strokeWidth: sw
    }), slices.map((s, i) => {
      const frac = s.v / sum,
        dash = frac * C;
      const el = /*#__PURE__*/React.createElement("circle", {
        key: i,
        cx: cx,
        cy: cy,
        r: R,
        fill: "none",
        stroke: s.c,
        strokeWidth: sw,
        strokeDasharray: `${dash.toFixed(2)} ${(C - dash).toFixed(2)}`,
        strokeDashoffset: (-acc * C).toFixed(2),
        strokeLinecap: "butt",
        transform: `rotate(-90 ${cx} ${cy})`
      });
      acc += frac;
      return el;
    }), /*#__PURE__*/React.createElement("text", {
      x: cx,
      y: cy - 4,
      textAnchor: "middle",
      dominantBaseline: "middle",
      style: {
        fontFamily: 'var(--kb-f-display)',
        fontWeight: 800,
        fontSize: 25,
        fill: 'var(--kb-text)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, (total != null ? total : sum).toLocaleString('es-MX').replace(/,/g, '\u202f')), /*#__PURE__*/React.createElement("text", {
      x: cx,
      y: cy + 17,
      textAnchor: "middle",
      className: "kbv-chart-axis"
    }, unit));
  }

  // ── 4 · BARRA APILADA ────────────────────────────────────────────
  // Distribución dentro de cada periodo. Una sola barra por columna.
  function StackedBars({
    cols,
    keys,
    height = 150,
    unit = ''
  }) {
    const H = height;
    const max = Math.max(...cols.map(c => keys.reduce((a, k) => a + (c.v[k.id] || 0), 0)), 1);
    const bw = Math.min(34, (W - PADL - PADR) / cols.length - 10);
    const cx = i => PADL + (i + 0.5) * ((W - PADL - PADR) / cols.length);
    const y = v => PADT + (1 - v / max) * (H - PADT - PADB);
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      width: "100%",
      style: {
        height: 'auto',
        display: 'block'
      },
      className: "kbv-stacked"
    }, /*#__PURE__*/React.createElement(Grid, {
      H: H
    }), /*#__PURE__*/React.createElement("text", {
      x: PADL - 8,
      y: PADT + 4,
      textAnchor: "end",
      className: "kbv-chart-axis"
    }, fmtN(max), unit), /*#__PURE__*/React.createElement("text", {
      x: PADL - 8,
      y: H - PADB,
      textAnchor: "end",
      className: "kbv-chart-axis"
    }, "0"), cols.map((c, i) => {
      let acc = 0;
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, keys.map((k, j) => {
        const v = c.v[k.id] || 0;
        if (!v) return null;
        const y0 = y(acc + v),
          y1 = y(acc);
        acc += v;
        const isTop = j === keys.length - 1 || !keys.slice(j + 1).some(kk => c.v[kk.id]);
        return /*#__PURE__*/React.createElement("rect", {
          key: k.id,
          x: (cx(i) - bw / 2).toFixed(1),
          y: y0.toFixed(1),
          width: bw.toFixed(1),
          height: Math.max(1, y1 - y0).toFixed(1),
          fill: k.c,
          rx: isTop ? 5 : 0
        });
      }), /*#__PURE__*/React.createElement("text", {
        x: cx(i).toFixed(1),
        y: H - 8,
        textAnchor: "middle",
        className: "kbv-chart-axis"
      }, c.label));
    }));
  }

  // ── 5 · MEDIDOR ──────────────────────────────────────────────────
  // Un valor contra su meta. Arco de 180°, nunca un círculo completo:
  // el semicírculo dice «hay un techo» y el círculo no.
  function Gauge({
    value,
    max,
    height = 130,
    color = 'var(--kb-primary)',
    label
  }) {
    const cx = 100,
      cy = 96,
      R = 70,
      sw = 18;
    const frac = Math.max(0, Math.min(1, value / max));
    const arc = f => {
      const a = Math.PI * (1 - f);
      return `${(cx + R * Math.cos(a)).toFixed(1)} ${(cy - R * Math.sin(a)).toFixed(1)}`;
    };
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 200 122",
      width: "100%",
      style: {
        height: 'auto',
        display: 'block'
      },
      className: "kbv-gauge"
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${arc(0)} A ${R} ${R} 0 0 1 ${arc(1)}`,
      fill: "none",
      stroke: "var(--kb-surface-2)",
      strokeWidth: sw,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: `M ${arc(0)} A ${R} ${R} 0 0 1 ${arc(frac)}`,
      fill: "none",
      stroke: color,
      strokeWidth: sw,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("text", {
      x: cx,
      y: cy - 16,
      textAnchor: "middle",
      style: {
        fontFamily: 'var(--kb-f-display)',
        fontWeight: 800,
        fontSize: 26,
        fill: 'var(--kb-text)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, value.toLocaleString('es-MX').replace(/,/g, '\u202f')), /*#__PURE__*/React.createElement("text", {
      x: cx,
      y: cy + 3,
      textAnchor: "middle",
      className: "kbv-chart-axis"
    }, label || `meta ${fmtN(max)}`));
  }

  // ── 6 · BARRAS HORIZONTALES ──────────────────────────────────────
  // Ranking. Horizontal porque las etiquetas son nombres largos y en
  // vertical se voltean o se cortan.
  function HBars({
    rows,
    unit = '',
    barH = 26,
    gap = 8
  }) {
    const max = Math.max(...rows.map(r => r.v), 1);
    const labelW = 108,
      valW = 46;
    const H = rows.length * (barH + gap);
    const trackW = W - labelW - valW - 8;
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      width: "100%",
      style: {
        height: 'auto',
        display: 'block'
      },
      className: "kbv-hbars"
    }, rows.map((r, i) => {
      const y = i * (barH + gap),
        w = r.v / max * trackW;
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, /*#__PURE__*/React.createElement("text", {
        x: labelW - 10,
        y: y + barH / 2,
        textAnchor: "end",
        dominantBaseline: "middle",
        className: "kbv-chart-axis",
        style: {
          fill: 'var(--kb-text-2)'
        }
      }, r.n), /*#__PURE__*/React.createElement("rect", {
        x: labelW,
        y: y,
        width: trackW,
        height: barH,
        rx: "6",
        fill: "var(--kb-surface-2)"
      }), /*#__PURE__*/React.createElement("rect", {
        x: labelW,
        y: y,
        width: Math.max(6, w).toFixed(1),
        height: barH,
        rx: "6",
        fill: r.c || 'var(--kb-primary)'
      }), /*#__PURE__*/React.createElement("text", {
        x: labelW + trackW + 8,
        y: y + barH / 2,
        dominantBaseline: "middle",
        style: {
          fontFamily: 'var(--kb-f-display)',
          fontWeight: 800,
          fontSize: 12,
          fill: 'var(--kb-text)'
        }
      }, fmtN(r.v), unit));
    }));
  }

  // ── 7 · SPARKLINE ────────────────────────────────────────────────
  // Tendencia dentro de un KPI. Sin ejes ni rejilla — no hay lugar, y
  // el dato exacto ya lo da el valor grande del KPI, al lado.
  function Sparkline({
    values,
    w = 86,
    h = 26,
    color = 'var(--kb-primary)',
    area = true
  }) {
    const max = Math.max(...values, 1),
      min = Math.min(...values);
    const x = i => i / Math.max(1, values.length - 1) * (w - 4) + 2;
    const y = v => h - 3 - (v - min) / Math.max(1e-6, max - min) * (h - 8);
    const line = values.map((v, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
    const gid = React.useMemo(() => uid('sp'), []);
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: `0 0 ${w} ${h}`,
      width: w,
      height: h,
      className: "kbv-spark"
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: gid,
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: color,
      stopOpacity: ".26"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: color,
      stopOpacity: "0"
    }))), area && /*#__PURE__*/React.createElement("path", {
      d: `${line} L ${x(values.length - 1).toFixed(1)} ${h} L ${x(0).toFixed(1)} ${h} Z`,
      fill: `url(#${gid})`
    }), /*#__PURE__*/React.createElement("path", {
      d: line,
      fill: "none",
      stroke: color,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x(values.length - 1).toFixed(1),
      cy: y(values[values.length - 1]).toFixed(1),
      r: "2.4",
      fill: "var(--kb-card)",
      stroke: color,
      strokeWidth: "2"
    }));
  }

  // ── 8 · EMBUDO ───────────────────────────────────────────────────
  // Cuántos sobreviven cada paso. Trapecio, no barras: la forma ya
  // cuenta la caída sin leer los números.
  function Funnel({
    steps,
    height = 160,
    color = 'var(--kb-primary)'
  }) {
    const H = height,
      top = steps[0].v;
    const sw = W - PADL - PADR;
    const stepH = (H - PADT - 12) / steps.length;
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: `0 0 ${W} ${H}`,
      width: "100%",
      style: {
        height: 'auto',
        display: 'block'
      },
      className: "kbv-funnel"
    }, steps.map((s, i) => {
      const f0 = s.v / top,
        f1 = (steps[i + 1] ? steps[i + 1].v : s.v) / top;
      const y0 = PADT + i * stepH,
        y1 = y0 + stepH - 4;
      const w0 = sw * f0,
        w1 = sw * f1;
      const cx = PADL + sw / 2;
      const d = `M ${(cx - w0 / 2).toFixed(1)} ${y0.toFixed(1)} L ${(cx + w0 / 2).toFixed(1)} ${y0.toFixed(1)} L ${(cx + w1 / 2).toFixed(1)} ${y1.toFixed(1)} L ${(cx - w1 / 2).toFixed(1)} ${y1.toFixed(1)} Z`;
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, /*#__PURE__*/React.createElement("path", {
        d: d,
        fill: `color-mix(in oklab, ${color} ${58 - i * 11}%, #fff)`
      }), /*#__PURE__*/React.createElement("text", {
        x: cx,
        y: y0 + stepH / 2 - 4,
        textAnchor: "middle",
        dominantBaseline: "middle",
        style: {
          fontFamily: 'var(--kb-f-display)',
          fontWeight: 800,
          fontSize: 11.5,
          fill: 'var(--kb-text)'
        }
      }, s.n), /*#__PURE__*/React.createElement("text", {
        x: cx,
        y: y0 + stepH / 2 + 9,
        textAnchor: "middle",
        className: "kbv-chart-axis",
        style: {
          fill: 'var(--kb-text)',
          opacity: .78
        }
      }, fmtN(s.v), " \xB7 ", Math.round(f0 * 100), "%"));
    }));
  }
  Object.assign(window, {
    RadarChart,
    Scatter,
    Donut,
    StackedBars,
    Gauge,
    HBars,
    Sparkline,
    Funnel
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/charts-nuevas.jsx", error: String((e && e.message) || e) }); }

// reference/app/icons.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// icons.jsx — Kibo Area glyphs + utility icons
// Simple geometric SVGs (paths from primitives only)

function KIcon({
  name,
  size = 18,
  stroke = 1.6,
  ...rest
}) {
  const s = {
    width: size,
    height: size,
    color: 'currentColor'
  };
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  switch (name) {
    case 'search':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "11",
        cy: "11",
        r: "7"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M16.5 16.5L21 21"
      }, common)));
    case 'moon':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", {
        d: "M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z"
      }));
    case 'inbox':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 5h16v14H4z"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 13h4l2 3h4l2-3h4"
      }, common)));
    case 'user-plus':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "9",
        cy: "8",
        r: "3.5"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M3 20c0-3.2 2.8-5 6-5s6 1.8 6 5"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M18.5 7v6M15.5 10h6"
      }, common)));
    case 'share':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "6",
        cy: "12",
        r: "2.6"
      }, common)), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "17.5",
        cy: "5.5",
        r: "2.6"
      }, common)), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "17.5",
        cy: "18.5",
        r: "2.6"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M8.4 10.7l6.7-3.9M8.4 13.3l6.7 3.9"
      }, common)));
    case 'copy':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("rect", _extends({
        x: "9",
        y: "9",
        width: "11",
        height: "11",
        rx: "2.5"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M15 5H7a3 3 0 0 0-3 3v8"
      }, common)));
    case 'heart':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 20.5C7 16.5 3.5 13.4 3.5 9.6A4.4 4.4 0 0 1 12 7.8a4.4 4.4 0 0 1 8.5 1.8c0 3.8-3.5 6.9-8.5 10.9z"
      }, common)));
    case 'vigor':
      // pulse / flame
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 3c2 3 4 5 4 8a4 4 0 1 1-8 0c0-3 2-5 4-8z"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 11c.8 1.5 1.6 2.5 1.6 4a1.6 1.6 0 1 1-3.2 0c0-1.5.8-2.5 1.6-4z"
      }, common)));
    case 'wisdom':
      // book / eye
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 5h7a3 3 0 0 1 3 3v12"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M20 5h-7a3 3 0 0 0-3 3v12"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 5v15"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M20 5v15"
      }, common)));
    case 'wealth':
      // coin
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "8"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 7v10M9 9.5h5.5a1.5 1.5 0 0 1 0 3H9.5a1.5 1.5 0 0 0 0 3H15"
      }, common)));
    case 'community':
      // people
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "9",
        cy: "9",
        r: "3"
      }, common)), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "17",
        cy: "10",
        r: "2.5"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M3 19c0-3 3-5 6-5s6 2 6 5"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M15 14.2c2.5 0 6 1.4 6 4.8"
      }, common)));
    case 'will':
      // shield + bolt
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 8l-2 4h2.5l-1.5 4 4-5h-2.5l1.5-3z"
      }, common)));
    case 'home':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"
      }, common)));
    case 'list':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M8 6h13M8 12h13M8 18h13"
      }, common)), /*#__PURE__*/React.createElement("circle", {
        cx: "4",
        cy: "6",
        r: "1.2",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "4",
        cy: "12",
        r: "1.2",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "4",
        cy: "18",
        r: "1.2",
        fill: "currentColor"
      }));
    case 'sword':
      // boss/habits
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M14 4l6 0 0 6-9 9-3-3 9-9"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M9 16l-4 4M5 16l3 3"
      }, common)));
    case 'user':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "9",
        r: "3.5"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"
      }, common)));
    case 'plus':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 5v14M5 12h14"
      }, common)));
    case 'minus':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M5 12h14"
      }, common)));
    case 'check':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 12l5 5L20 6"
      }, common)));
    case 'eye':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
      }, common)), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "3"
      }, common)));
    case 'eye-off':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M3 3l18 18"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M10.6 6.2A9.7 9.7 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 4M6.6 6.6C3.7 8.4 2 12 2 12s3.5 6 10 6c1.7 0 3.2-.4 4.5-1"
      }, common)));
    case 'alert':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "9"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 7v6M12 17v.5"
      }, common)));
    case 'grip':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "6",
        r: "1.3",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "12",
        r: "1.3",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "18",
        r: "1.3",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "15",
        cy: "6",
        r: "1.3",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "15",
        cy: "12",
        r: "1.3",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "15",
        cy: "18",
        r: "1.3",
        fill: "currentColor"
      }));
    case 'arrow-right':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M5 12h14M13 6l6 6-6 6"
      }, common)));
    case 'arrow-left':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M19 12H5M11 6l-6 6 6 6"
      }, common)));
    case 'sparkle':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 4l1.6 5.4L19 11l-5.4 1.6L12 18l-1.6-5.4L5 11l5.4-1.6z"
      }, common)));
    case 'droplet':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 3.2c3.4 3.7 5.4 6.4 5.4 8.9a5.4 5.4 0 0 1-10.8 0c0-2.5 2-5.2 5.4-8.9z"
      }, common)));
    case 'google':
      return /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 24 24",
        width: size,
        height: size
      }, /*#__PURE__*/React.createElement("path", {
        d: "M21.6 12.2c0-.7-.06-1.36-.18-2H12v3.78h5.4a4.6 4.6 0 0 1-2 3.03v2.5h3.23c1.9-1.74 2.97-4.3 2.97-7.31z",
        fill: "#4285F4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 22c2.7 0 4.96-.9 6.63-2.43l-3.24-2.5c-.9.6-2.04.96-3.4.96-2.6 0-4.82-1.76-5.62-4.13H3.04v2.58A10 10 0 0 0 12 22z",
        fill: "#34A853"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6.38 13.9a6 6 0 0 1 0-3.82V7.5H3.04a10 10 0 0 0 0 9l3.34-2.6z",
        fill: "#FBBC05"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 5.96c1.47 0 2.8.5 3.84 1.5l2.87-2.87C16.96 2.99 14.7 2 12 2A10 10 0 0 0 3.04 7.5l3.34 2.58C7.18 7.72 9.4 5.96 12 5.96z",
        fill: "#EA4335"
      }));
    case 'microsoft':
      return /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 24 24",
        width: size,
        height: size
      }, /*#__PURE__*/React.createElement("rect", {
        x: "2",
        y: "2",
        width: "9.5",
        height: "9.5",
        fill: "#F25022"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "12.5",
        y: "2",
        width: "9.5",
        height: "9.5",
        fill: "#7FBA00"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "2",
        y: "12.5",
        width: "9.5",
        height: "9.5",
        fill: "#00A4EF"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "12.5",
        y: "12.5",
        width: "9.5",
        height: "9.5",
        fill: "#FFB900"
      }));
    case 'layers':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 3l9 5-9 5-9-5 9-5z"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M3 13l9 5 9-5M3 17l9 5 9-5"
      }, common)));
    case 'folder':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
      }, common)));
    case 'book':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2V5z"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 18a2 2 0 0 1 2-2h13"
      }, common)));
    case 'shop':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M3 9l1.5-5h15L21 9M3 9v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9h18"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M8 13a4 4 0 0 0 8 0"
      }, common)));
    case 'settings':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "3"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01A1.65 1.65 0 0 0 20.91 10H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      }, common)));
    case 'camera':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M3 8a2 2 0 0 1 2-2h3l1.5-2h5L16 6h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      }, common)), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "13",
        r: "3.5"
      }, common)));
    case 'film':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("rect", _extends({
        x: "3",
        y: "4",
        width: "18",
        height: "16",
        rx: "2"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4"
      }, common)));
    case 'tv':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("rect", _extends({
        x: "2",
        y: "5",
        width: "20",
        height: "13",
        rx: "2"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M7 22h10M12 18v4"
      }, common)));
    case 'book-open':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 5c-2-2-5-2-8-1v15c3-1 6-1 8 1m0-15c2-2 5-2 8-1v15c-3-1-6-1-8 1m0-15v15"
      }, common)));
    case 'edit':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      }, common)));
    case 'x':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M18 6L6 18M6 6l12 12"
      }, common)));
    case 'flame':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 2c1 2 3 4 3 7a3 3 0 0 1-6 0c0-1 .5-2 1-3-1 1-3 3-3 6a5 5 0 0 0 10 0c0-4-3-6-5-10z"
      }, common)));
    case 'mood-great':
      // 😄
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "9"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M8 14s1.5 3 4 3 4-3 4-3"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M8 9.5L9.5 11M16 9.5L14.5 11"
      }, common)));
    case 'mood-good':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "9"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M9 14.5s1 1.5 3 1.5 3-1.5 3-1.5"
      }, common)), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "10",
        r: "0.8",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "15",
        cy: "10",
        r: "0.8",
        fill: "currentColor"
      }));
    case 'mood-meh':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "9"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M9 15h6"
      }, common)), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "10",
        r: "0.8",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "15",
        cy: "10",
        r: "0.8",
        fill: "currentColor"
      }));
    case 'mood-low':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "9"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M9 16.5s1-1.5 3-1.5 3 1.5 3 1.5"
      }, common)), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "10",
        r: "0.8",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "15",
        cy: "10",
        r: "0.8",
        fill: "currentColor"
      }));
    case 'mood-sad':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "9"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M8 16s1.5-3 4-3 4 3 4 3"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M8 9.5l3 1.5M16 9.5l-3 1.5"
      }, common)));
    case 'calendar':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("rect", _extends({
        x: "3",
        y: "5",
        width: "18",
        height: "16",
        rx: "2"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M3 9h18M8 3v4M16 3v4"
      }, common)));
    case 'image':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("rect", _extends({
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2"
      }, common)), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "9",
        cy: "9",
        r: "2"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M21 16l-5-5L4 21"
      }, common)));
    case 'mic':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("rect", _extends({
        x: "9",
        y: "3",
        width: "6",
        height: "12",
        rx: "3"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"
      }, common)));
    case 'square':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("rect", {
        x: "6",
        y: "6",
        width: "12",
        height: "12",
        rx: "1.5",
        fill: "currentColor",
        stroke: "none"
      }));
    case 'upload':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 15V4M7 9l5-5 5 5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
      }, common)));
    case 'image-up':
    case 'picture':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("rect", _extends({
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2"
      }, common)), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "9",
        cy: "9",
        r: "2"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M21 16l-5-5L4 21"
      }, common)));
    case 'chart':
    case 'bar-chart':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 20V10M10 20V4M16 20v-8M22 20H2"
      }, common)));
    case 'target':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "9"
      }, common)), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "5"
      }, common)), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "1.4",
        fill: "currentColor"
      }));
    case 'shield':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z"
      }, common)));
    case 'clock':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "9"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 7v5l3 2"
      }, common)));
    case 'trash':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 7h16"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M10 11v6M14 11v6"
      }, common)));
    case 'crown':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 18h16"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M3 7l4 4 5-6 5 6 4-4-2 11H5z"
      }, common)));
    case 'repeat':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 9a5 5 0 0 1 5-5h8l-2.5-2.5M20 15a5 5 0 0 1-5 5H7l2.5 2.5"
      }, common)));
    case 'gauge':
      // effort / intensity
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M5 19a9 9 0 1 1 14 0"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 14l4-4"
      }, common)), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "14",
        r: "1.4",
        fill: "currentColor",
        stroke: "none"
      }));
    case 'trophy':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M7 4h10v5a5 5 0 0 1-10 0z"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M10 14.5V18M14 14.5V18M8 20h8"
      }, common)));
    case 'trending-up':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 16l5-5 4 4 7-7"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M16 8h4v4"
      }, common)));
    case 'trending-down':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 8l5 5 4-4 7 7"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M16 16h4v-4"
      }, common)));
    case 'info':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "12",
        r: "9"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 11v5"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 7.6v.6"
      }, common)));
    case 'flag':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M6 21V4"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M6 4h11l-2 4 2 4H6"
      }, common)));
    case 'piggy':
      // savings
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 13a6 5 0 0 1 6-5h5a5 5 0 0 1 5 5 4 4 0 0 1-2 3.5V20h-3v-2h-4v2H8v-2a5 5 0 0 1-4-5z"
      }, common)), /*#__PURE__*/React.createElement("circle", {
        cx: "15.5",
        cy: "12",
        r: "1",
        fill: "currentColor",
        stroke: "none"
      }), /*#__PURE__*/React.createElement("path", _extends({
        d: "M3 12h2"
      }, common)));
    case 'tablet':
      // e-reader / tablet
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("rect", _extends({
        x: "6",
        y: "3",
        width: "12",
        height: "18",
        rx: "2.5"
      }, common)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "9",
        y1: "7",
        x2: "15",
        y2: "7"
      }, common)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "9",
        y1: "10",
        x2: "15",
        y2: "10"
      }, common)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "9",
        y1: "13",
        x2: "13",
        y2: "13"
      }, common)), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "18",
        r: "0.6",
        fill: "currentColor",
        stroke: "none"
      }));
    case 'cloud':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M7 18a4 4 0 0 1-.5-7.97A5 5 0 0 1 16 9.5a3.5 3.5 0 0 1 1 6.86"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M7 18h10"
      }, common)));
    case 'phone':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("rect", _extends({
        x: "7",
        y: "2",
        width: "10",
        height: "20",
        rx: "2.5"
      }, common)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "10.5",
        y1: "18.5",
        x2: "13.5",
        y2: "18.5"
      }, common)));
    case 'laptop':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("rect", _extends({
        x: "5",
        y: "5",
        width: "14",
        height: "10",
        rx: "1.5"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M3 19h18l-1.5-2H4.5z"
      }, common)));
    case 'headphones':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 13v-1a8 8 0 0 1 16 0v1"
      }, common)), /*#__PURE__*/React.createElement("rect", _extends({
        x: "3",
        y: "13",
        width: "4",
        height: "6",
        rx: "1.5"
      }, common)), /*#__PURE__*/React.createElement("rect", _extends({
        x: "17",
        y: "13",
        width: "4",
        height: "6",
        rx: "1.5"
      }, common)));
    case 'graduation':
      // estudio / academic
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M2 9l10-4 10 4-10 4z"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M6 11v4c0 1.5 3 3 6 3s6-1.5 6-3v-4"
      }, common)), /*#__PURE__*/React.createElement("line", _extends({
        x1: "22",
        y1: "9",
        x2: "22",
        y2: "14"
      }, common)));
    // Chincheta (el menú fijo). `pin-on` y `pin-off` comparten la MISMA
    // geometría: lo único que cambia es el trazo que la tacha, así que los dos
    // estados se leen como el mismo objeto puesto o quitado.
    case 'pin-on':
    case 'pin-off':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M9.5 3.5h5l-.8 5.2 2.8 3.6H7.5l2.8-3.6z"
      }, common)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 12.3V20.5"
      }, common)), name === 'pin-off' && /*#__PURE__*/React.createElement("path", _extends({
        d: "M4.5 4.5l15 15"
      }, common)));
    case 'pin':
      // location
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24"
      }, s, rest), /*#__PURE__*/React.createElement("path", _extends({
        d: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"
      }, common)), /*#__PURE__*/React.createElement("circle", _extends({
        cx: "12",
        cy: "10",
        r: "2.5"
      }, common)));
    default:
      return null;
  }
}

// ── Registro autoritativo del set de iconos ───────────────────────
// El bundle del Design System también asigna window.KIcon (su snapshot viejo,
// sin search/inbox/user-plus/info…). Como los dos son <script>/fetch async,
// cuál ganaba era una carrera y los botones de solo-ícono salían vacíos.
// Este set manda: se planta con un setter que ignora asignaciones posteriores,
// y si un nombre no existe aquí, delega en el set del DS antes de rendirse.
(function registerKIcon() {
  // Por qué NO basta con asignar window.KIcon: el bundle del DS ya dejó
  // 'KIcon' en el global como propiedad NO configurable, así que ni la
  // declaración `function KIcon` de este archivo ni un defineProperty
  // posterior lo pisan — fallan en silencio y gana el set del DS (que no
  // tiene 'inbox', 'mail', 'link'…, y esos botones salen vacíos).
  // Solución: publicamos el set bajo un nombre propio y el boot declara
  // `const KIcon = window.__KIconApp` como script clásico. Un const de nivel
  // superior vive en el ámbito léxico global y SOMBREA a window.KIcon para
  // todos los módulos que se cargan después.
  const base = KIcon;
  const prev = window.KIcon;
  const fallback = typeof prev === 'function' && prev !== base && String(prev).indexOf("case 'vigor'") !== -1 ? prev : null;
  function KIconAuthoritative(props) {
    const out = base(props);
    if (out !== null) return out;
    const alt = KIconAuthoritative.__fallback;
    return alt ? alt(props) : null;
  }
  KIconAuthoritative.__authoritative = true;
  KIconAuthoritative.__fallback = fallback;
  window.__KIconApp = KIconAuthoritative;
  // Si el global resulta escribible (otro orden de carga), tomarlo también.
  try {
    const d = Object.getOwnPropertyDescriptor(window, 'KIcon');
    if (!d || d.configurable || d.writable) window.KIcon = KIconAuthoritative;
  } catch (_) {}
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/icons.jsx", error: String((e && e.message) || e) }); }

// reference/app/kb-gantt.jsx
try { (() => {
// kb-gantt.jsx — El cronograma explorable.
//
// KbTimeline reparte el periodo en cubetas fijas (1m, 3m, 6m): sirve para
// mirar, no para explorar — no hay zoom continuo, ni desplazamiento, ni forma
// de acercarse a un proyecto. KbGantt cambia el modelo: el eje es TIEMPO REAL
// en píxeles, así que acercarse, moverse y arrastrar fechas son la misma
// aritmética y no tres casos especiales.
//
// Gestos: rueda/pinza = zoom anclado al cursor · arrastrar el lienzo = moverse
// · − / + / ajustar a todo · línea de HOY con vuelta a hoy · mini-mapa con
// ventana arrastrable · doble clic en una barra = acercarse a ese proyecto.
//
// Mover fechas es OPCIONAL y explícito: mientras «Editar fechas» esté apagado,
// arrastrar solo mueve el lienzo. Un mismo gesto no puede significar dos cosas.

const DAY = 86400000;
const KG_MIN_SPAN = 7 * DAY; // no acercarse más allá de una semana
const KG_MAX_SPAN = 900 * DAY; // ni alejarse más de ~2.5 años

function kgClamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}
function kgDay(ms) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// Escala de marcas. La granularidad la decide cuántos PÍXELES hay por marca,
// no el ancho del periodo: decidirlo por periodo (`span < 120 días` → semanas)
// emitía un lunes tras otro sin comprobar si las etiquetas caben, y a 38px de
// separación con etiquetas de 48px se leían pegadas. Cuando no alcanzan los
// píxeles, la rejilla sigue densa pero solo se rotula cada N marcas: perder
// líneas es perder referencia, perder rótulos no.
const KG_LABEL_PX = 58; // ancho mínimo cómodo para «10 ago»

function kgTicks(from, to, width) {
  const span = to - from;
  const W = Math.max(1, width);
  const out = [];
  const step = ms => ms / span * W; // píxeles que ocupa un paso
  const every = px => Math.max(1, Math.ceil(KG_LABEL_PX / Math.max(1, px)));
  // Se rotula cada n marcas, y nunca una que empiece fuera de la vista.
  const rotula = (i, n, t) => i % n === 0 && t >= from;

  // Días: solo si un día ocupa lo suficiente para rotularlo.
  if (step(DAY) >= 26) {
    const n = every(step(DAY));
    let i = 0;
    for (let t = kgDay(from); t <= to; t += DAY, i++) {
      const d = new Date(t);
      out.push({
        t,
        label: rotula(i, n, t) ? d.toLocaleDateString('es-MX', {
          day: 'numeric',
          month: step(DAY) >= 46 ? 'short' : undefined
        }) : '',
        strong: d.getDay() === 1
      });
    }
    return {
      ticks: out,
      unit: 'día'
    };
  }

  // Semanas: idem — la rejilla es semanal, el rótulo aparece cada n semanas.
  if (step(7 * DAY) >= 22) {
    const px = step(7 * DAY),
      n = every(px);
    const d = new Date(kgDay(from));
    d.setDate(d.getDate() - (d.getDay() + 6) % 7);
    let i = 0;
    for (let t = d.getTime(); t <= to; t += 7 * DAY, i++) {
      const x = new Date(t);
      out.push({
        t,
        label: rotula(i, n, t) ? x.toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'short'
        }) : '',
        strong: x.getDate() <= 7
      });
    }
    return {
      ticks: out,
      unit: 'semana'
    };
  }

  // Meses.
  const px = step(30 * DAY),
    n = every(px);
  const d = new Date(from);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  let i = 0;
  while (d.getTime() <= to) {
    const strong = d.getMonth() === 0;
    out.push({
      t: d.getTime(),
      label: rotula(i, n, d.getTime()) || strong && d.getTime() >= from ? d.toLocaleDateString('es-MX', {
        month: 'short'
      }) : '',
      strong
    });
    d.setMonth(d.getMonth() + 1);
    i++;
  }
  return {
    ticks: out,
    unit: 'mes'
  };
}
function kgFmt(ms) {
  return new Date(ms).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short'
  });
}
function KbGantt({
  title,
  meta,
  rows = [],
  filters,
  onOpenRow,
  onChangeDates,
  emptyText = 'Nada que mostrar en este periodo.',
  rowLabel = 'ELEMENTO',
  canEditDates = true,
  focusId = null,
  onFocus,
  initialDays = 90
}) {
  const trackRef = React.useRef(null);
  const [width, setWidth] = React.useState(900);
  const [view, setView] = React.useState(() => {
    const now = kgDay(Date.now());
    // Un poco de pasado a la izquierda: sin él, «hoy» queda pegado al borde y
    // no se ve lo que viene con retraso.
    const back = Math.round(initialDays * 0.12);
    return {
      from: now - back * DAY,
      to: now + (initialDays - back) * DAY
    };
  });
  const [open, setOpen] = React.useState(() => new Set());
  const [editing, setEditing] = React.useState(false);
  const [drag, setDrag] = React.useState(null);
  const [hint, setHint] = React.useState(null);

  // El ancho real del lienzo es un dato de layout: sin medirlo, el eje de
  // tiempo y los píxeles no coinciden y todo el zoom queda torcido.
  React.useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth || 900));
    ro.observe(el);
    setWidth(el.clientWidth || 900);
    return () => ro.disconnect();
  }, []);
  const span = view.to - view.from;
  const xOf = t => (t - view.from) / span * width;
  const tOf = x => view.from + x / Math.max(1, width) * span;
  const {
    ticks,
    unit
  } = kgTicks(view.from, view.to, width);
  const today = kgDay(Date.now());

  // Rango completo: lo que abarca todo lo que hay, con aire a los lados.
  const bounds = React.useMemo(() => {
    const all = [];
    const walk = list => list.forEach(r => {
      if (r.start && r.end) all.push(r.start, r.end);
      if (r.children) walk(r.children);
    });
    walk(rows);
    if (!all.length) return {
      from: today - 30 * DAY,
      to: today + 60 * DAY
    };
    const lo = Math.min(...all),
      hi = Math.max(...all);
    const pad = Math.max(3 * DAY, (hi - lo) * 0.08);
    return {
      from: lo - pad,
      to: hi + pad
    };
  }, [rows, today]);
  function setSpanAround(anchorT, nextSpan) {
    const s = kgClamp(nextSpan, KG_MIN_SPAN, KG_MAX_SPAN);
    const ratio = (anchorT - view.from) / span;
    setView({
      from: anchorT - ratio * s,
      to: anchorT - ratio * s + s
    });
  }
  function zoom(factor, anchorT) {
    setSpanAround(anchorT != null ? anchorT : view.from + span / 2, span * factor);
  }
  function fitAll() {
    // Ajustar a todo respeta el mismo techo que el zoom: sin él, un rango muy
    // largo deja todas las barras contra su ancho mínimo y no dice nada.
    const s = Math.min(KG_MAX_SPAN, bounds.to - bounds.from);
    const mid = (bounds.from + bounds.to) / 2;
    setView({
      from: mid - s / 2,
      to: mid + s / 2
    });
  }
  function goToday() {
    setView({
      from: today - span * 0.25,
      to: today + span * 0.75
    });
  }
  function focusRange(from, to) {
    const pad = Math.max(2 * DAY, (to - from) * 0.15);
    setView({
      from: from - pad,
      to: to + pad
    });
  }

  // Rueda = zoom anclado al cursor. Sin ancla, acercarse tira el contenido
  // fuera de la vista y hay que volver a buscarlo.
  function onWheel(e) {
    if (!trackRef.current) return;
    e.preventDefault();
    const r = trackRef.current.getBoundingClientRect();
    const at = tOf(e.clientX - r.left);
    setSpanAround(at, span * (e.deltaY > 0 ? 1.18 : 1 / 1.18));
  }

  // Arrastrar el lienzo. Cuando «Editar fechas» está encendido, la barra se
  // queda el gesto para sí (detiene la propagación) y el lienzo solo responde
  // fuera de las barras.
  function panStart(e) {
    if (e.button !== 0) return;
    const startX = e.clientX,
      from0 = view.from,
      to0 = view.to;
    const move = ev => {
      const dx = ev.clientX - startX;
      const dt = -(dx / Math.max(1, width)) * (to0 - from0);
      setView({
        from: from0 + dt,
        to: to0 + dt
      });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      setDrag(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    setDrag({
      kind: 'pan'
    });
  }

  // Mover o estirar una barra: solo en modo edición.
  function barDrag(e, row, mode) {
    if (!editing || !onChangeDates) return;
    e.stopPropagation();
    const startX = e.clientX,
      s0 = row.start,
      e0 = row.end;
    const move = ev => {
      const dt = (ev.clientX - startX) / Math.max(1, width) * span;
      let ns = s0,
        ne = e0;
      if (mode === 'move') {
        ns = s0 + dt;
        ne = e0 + dt;
      }
      if (mode === 'start') ns = Math.min(e0 - DAY, s0 + dt);
      if (mode === 'end') ne = Math.max(s0 + DAY, e0 + dt);
      setHint(`${kgFmt(ns)} → ${kgFmt(ne)}`);
      onChangeDates(row.id, kgDay(ns), kgDay(ne));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      setDrag(null);
      setHint(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    setDrag({
      kind: mode
    });
  }

  // Mini-mapa: el periodo completo con una ventana que se arrastra.
  function miniDrag(e) {
    const el = e.currentTarget,
      r = el.getBoundingClientRect();
    const total = bounds.to - bounds.from;
    const at = bounds.from + (e.clientX - r.left) / r.width * total;
    setView({
      from: at - span / 2,
      to: at + span / 2
    });
    const move = ev => {
      const t = bounds.from + (ev.clientX - r.left) / r.width * total;
      setView({
        from: t - span / 2,
        to: t + span / 2
      });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  // Filas visibles: un padre abierto intercala sus hijas debajo. Varios
  // pueden estar abiertos a la vez.
  const flat = [];
  rows.forEach(r => {
    flat.push({
      ...r,
      depth: 0
    });
    if (open.has(r.id) && r.children) r.children.forEach(c => flat.push({
      ...c,
      depth: 1,
      parent: r.id
    }));
  });
  function toggle(id) {
    setOpen(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  const miniPct = t => kgClamp((t - bounds.from) / Math.max(1, bounds.to - bounds.from) * 100, 0, 100);
  return /*#__PURE__*/React.createElement("div", {
    className: `kbv-card kb-gantt ${drag ? 'dragging drag-' + drag.kind : ''} ${editing ? 'editing' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "kg-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kg-title"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kbv-h3"
  }, title), meta && /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, meta)), /*#__PURE__*/React.createElement("div", {
    className: "kg-tools"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kg-range"
  }, kgFmt(view.from), " \u2014 ", kgFmt(view.to), " \xB7 por ", unit), /*#__PURE__*/React.createElement("div", {
    className: "kg-zoom"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => zoom(1.35),
    title: "Alejar",
    "aria-label": "Alejar"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "minus",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => zoom(1 / 1.35),
    title: "Acercar",
    "aria-label": "Acercar"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "plus",
    size: 14
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-secondary kg-btn",
    onClick: fitAll,
    title: "Ajustar a todo"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "layers",
    size: 13
  }), " Todo"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-secondary kg-btn",
    onClick: goToday,
    title: "Volver a hoy"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "calendar",
    size: 13
  }), " Hoy"), canEditDates && onChangeDates && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `kbv-btn kg-btn ${editing ? 'kbv-btn-primary' : 'kbv-btn-secondary'}`,
    onClick: () => setEditing(v => !v),
    title: editing ? 'Al apagarlo, arrastrar vuelve a mover el lienzo' : 'Enciéndelo para arrastrar barras y cambiar fechas'
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: editing ? 'check' : 'edit',
    size: 13
  }), " ", editing ? 'Editando fechas' : 'Editar fechas'))), filters && /*#__PURE__*/React.createElement("div", {
    className: "kg-filters"
  }, filters), /*#__PURE__*/React.createElement("p", {
    className: "kg-hint kbv-meta"
  }, editing ? 'Arrastra una barra para moverla y sus bordes para estirarla. El lienzo sigue moviéndose desde el fondo.' : 'Rueda para acercar · arrastra el lienzo para moverte · doble clic en una barra para acercarte a ella.'), /*#__PURE__*/React.createElement("div", {
    className: "kg-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kg-labels"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kg-corner"
  }, rowLabel), flat.map(r => /*#__PURE__*/React.createElement("span", {
    key: (r.parent || '') + r.id,
    className: `kg-label d${r.depth}`
  }, r.depth === 0 && r.children && r.children.length > 0 ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `kg-twist ${open.has(r.id) ? 'on' : ''}`,
    onClick: () => toggle(r.id),
    title: open.has(r.id) ? 'Plegar sus tareas' : 'Desplegar sus tareas'
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-right",
    size: 12
  })) : /*#__PURE__*/React.createElement("span", {
    className: "kg-twist ghost"
  }), r.icon ? /*#__PURE__*/React.createElement(KIcon, {
    name: r.icon,
    size: 12
  }) : /*#__PURE__*/React.createElement("span", {
    className: "kg-dot",
    style: {
      background: r.color
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kg-name",
    onClick: () => onOpenRow && onOpenRow(r),
    title: "Abrir"
  }, r.name)))), /*#__PURE__*/React.createElement("div", {
    className: "kg-canvas",
    ref: trackRef,
    onWheel: onWheel,
    onPointerDown: panStart
  }, /*#__PURE__*/React.createElement("div", {
    className: "kg-axis"
  }, ticks.filter(t => t.label).map(t => /*#__PURE__*/React.createElement("span", {
    key: t.t,
    className: `kg-tick ${t.strong ? 'strong' : ''}`,
    style: {
      left: xOf(t.t) + 'px'
    }
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    className: "kg-grid"
  }, ticks.map(t => /*#__PURE__*/React.createElement("i", {
    key: t.t,
    className: t.strong ? 'strong' : '',
    style: {
      left: xOf(t.t) + 'px'
    }
  })), today >= view.from && today <= view.to && /*#__PURE__*/React.createElement("span", {
    className: "kg-today",
    style: {
      left: xOf(today) + 'px'
    }
  }, /*#__PURE__*/React.createElement("em", null, "Hoy")), flat.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "kg-empty"
  }, emptyText), flat.map(r => {
    const x1 = xOf(r.start),
      x2 = xOf(r.end);
    const w = Math.max(18, x2 - x1);
    return /*#__PURE__*/React.createElement("div", {
      key: (r.parent || '') + r.id,
      className: `kg-row d${r.depth} ${focusId === r.id ? 'focus' : ''}`
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "kg-bar",
      style: {
        '--c': r.color,
        left: x1 + 'px',
        width: w + 'px'
      },
      title: `${r.name} · ${kgFmt(r.start)} → ${kgFmt(r.end)}`,
      onPointerDown: e => barDrag(e, r, 'move'),
      onDoubleClick: e => {
        e.stopPropagation();
        focusRange(r.start, r.end);
        if (r.depth === 0 && r.children && r.children.length) {
          setOpen(p => new Set(p).add(r.id));
          if (onFocus) onFocus(r);
        }
      },
      onClick: () => {
        if (!editing && onOpenRow) onOpenRow(r);
      }
    }, r.progress != null && /*#__PURE__*/React.createElement("span", {
      className: "kg-fill",
      style: {
        width: r.progress + '%'
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "kg-bar-txt"
    }, r.label || r.name), editing && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "kg-handle s",
      onPointerDown: e => barDrag(e, r, 'start')
    }), /*#__PURE__*/React.createElement("i", {
      className: "kg-handle e",
      onPointerDown: e => barDrag(e, r, 'end')
    }))));
  })), hint && /*#__PURE__*/React.createElement("span", {
    className: "kg-drag-hint"
  }, hint))), /*#__PURE__*/React.createElement("div", {
    className: "kg-mini",
    onPointerDown: miniDrag,
    title: "Arrastra para recorrer todo el rango"
  }, flat.filter(r => r.depth === 0).map(r => /*#__PURE__*/React.createElement("i", {
    key: r.id,
    style: {
      '--c': r.color,
      left: miniPct(r.start) + '%',
      width: Math.max(1, miniPct(r.end) - miniPct(r.start)) + '%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "kg-mini-today",
    style: {
      left: miniPct(today) + '%'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "kg-mini-win",
    style: {
      left: miniPct(view.from) + '%',
      width: Math.max(2, miniPct(view.to) - miniPct(view.from)) + '%'
    }
  })));
}
Object.assign(window, {
  KbGantt,
  kgDay,
  kgFmt,
  DAY_MS: DAY
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/kb-gantt.jsx", error: String((e && e.message) || e) }); }

// reference/app/kbv-shared.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// kbv-shared.jsx — componentes canónicos de reutilización.
// Decisiones de unificación (turno 1): 1c tarjeta de hábito · 1g tarjeta de item · 1i barra de meta.
// Una sola implementación para toda la plataforma; las pantallas la envuelven, no la copian.

// ── 1c · Tarjeta de hábito ───────────────────────────────────────
// Check tocable + racha (del tablero) + semana y recompensa (del catálogo).
function KbHabitCard({
  h,
  onToggle,
  onOpen,
  onEdit,
  onDelete,
  compact
}) {
  const color = h.color || h.c || 'var(--kb-primary)';
  const week = Array.isArray(h.weeklyHistory) ? h.weeklyHistory : null;
  const rw = h.energy != null && h.effort != null && typeof habitReward === 'function' ? habitReward(h.energy, h.effort) : {
    xp: h.xp != null ? h.xp : 10,
    coins: h.coins != null ? h.coins : null
  };
  const sched = h.schedule || h.when || null;
  const cls = ['kbv-habit-card', h.done ? 'done' : '', compact ? 'compact' : ''].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: {
      '--c': color
    },
    onClick: () => onOpen && onOpen(h)
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "oh-check",
    "aria-label": h.done ? 'Desmarcar hábito' : 'Marcar hecho',
    onClick: e => {
      e.stopPropagation();
      onToggle && onToggle(h.id);
    }
  }, h.done && /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: compact ? 15 : 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "oh-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "oh-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "oh-ico"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: h.icon || 'flame',
    size: 13
  })), /*#__PURE__*/React.createElement("span", {
    className: "oh-name",
    title: h.name
  }, h.name, h.fromReto && /*#__PURE__*/React.createElement("span", {
    className: "kbv-from-reto",
    title: "H\xE1bito heredado de un reto"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "sword",
    size: 9
  }), " De reto")), h.streak != null && /*#__PURE__*/React.createElement("span", {
    className: "oh-streak"
  }, "\uD83D\uDD25 ", h.streak, "d")), week && /*#__PURE__*/React.createElement("div", {
    className: "oh-week"
  }, ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `d ${week[i] ? 'on' : ''}`,
    title: d
  }, d))), /*#__PURE__*/React.createElement("div", {
    className: "oh-foot"
  }, sched && /*#__PURE__*/React.createElement("span", {
    className: "oh-sched"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "clock",
    size: 9
  }), " ", sched), /*#__PURE__*/React.createElement("span", {
    className: "oh-xp"
  }, "+", rw.xp, " XP", rw.coins != null ? ` · +${rw.coins} mon.` : ''), (onEdit || onDelete) && /*#__PURE__*/React.createElement("div", {
    className: "oh-actions",
    onClick: e => e.stopPropagation()
  }, onEdit && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ic-btn",
    title: "Editar",
    onClick: () => onEdit(h)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "edit",
    size: 11
  })), onDelete && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ic-btn danger",
    title: "Eliminar",
    onClick: () => onDelete(h.id)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "trash",
    size: 11
  }))))));
}

// ── 1g · Tarjeta de item ─────────────────────────────────────────
// Base Vitrina: el arte manda y el precio va en el botón.
// Tienda, regalos a amigos, catálogo de widgets y cosméticos.
function ItemCard({
  item,
  onBuy,
  onEdit,
  onDelete,
  actionLabel,
  disabled
}) {
  const color = item.color || item.c || 'var(--kb-primary)';
  const currency = item.currency || item.cur || 'coin';
  const cost = item.cost != null ? item.cost : 0;
  const free = item.free || cost === 0;
  const owned = !!item.owned;
  return /*#__PURE__*/React.createElement("div", {
    className: `kbv-item-card ${owned ? 'owned' : ''}`,
    style: {
      '--c': color
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oiv-art"
  }, item.customImage ? /*#__PURE__*/React.createElement("span", {
    className: "oiv-emoji"
  }, item.customImage) : /*#__PURE__*/React.createElement(KIcon, {
    name: item.icon || 'sparkle',
    size: 38
  }), item.kind && /*#__PURE__*/React.createElement("span", {
    className: "oiv-kind"
  }, item.kind), item.custom && /*#__PURE__*/React.createElement("span", {
    className: "oiv-kind own"
  }, "Tuya")), /*#__PURE__*/React.createElement("div", {
    className: "oiv-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "oiv-name"
  }, item.name), item.desc && /*#__PURE__*/React.createElement("span", {
    className: "oiv-desc"
  }, item.desc)), owned ? /*#__PURE__*/React.createElement("span", {
    className: "oiv-owned"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 13
  }), " Tuyo") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `oiv-buy ${free ? 'free' : ''}`,
    disabled: disabled,
    onClick: () => onBuy && onBuy(item)
  }, free ? 'Gratis' : /*#__PURE__*/React.createElement(React.Fragment, null, currency === 'gem' ? /*#__PURE__*/React.createElement(GemIcon, {
    size: 13
  }) : /*#__PURE__*/React.createElement(CoinIcon, {
    size: 13
  }), cost.toLocaleString('es-MX')), actionLabel ? ` · ${actionLabel}` : ''), (onEdit || onDelete) && /*#__PURE__*/React.createElement("div", {
    className: "oiv-actions"
  }, onEdit && /*#__PURE__*/React.createElement("button", {
    type: "button",
    title: "Editar",
    onClick: () => onEdit(item)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "edit",
    size: 12
  })), onDelete && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "danger",
    title: "Borrar",
    onClick: () => onDelete(item)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "x",
    size: 12
  }))));
}

// ── 1i · Barra de meta ───────────────────────────────────────────
// Donde hay dinero de por medio: deseos de amigos y ahorro de Finanzas.
// Cursos e hitos de proyecto conservan su barra simple.
function GoalBar({
  label,
  who,
  cur,
  target,
  capPct,
  currency,
  money,
  color,
  head = true,
  right
}) {
  const pct = target > 0 ? Math.min(100, Math.round(cur / target * 100)) : 0;
  const fmt = n => (money ? '$' : '') + Number(n).toLocaleString('es-MX');
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-goal unified",
    style: color ? {
      '--goal-c': color
    } : undefined
  }, head && /*#__PURE__*/React.createElement("div", {
    className: "og-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "og-name"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: `og-cur ${currency || ''}`
  }, currency === 'gem' ? '◆' : currency === 'coin' ? '●' : '', " ", fmt(target))), /*#__PURE__*/React.createElement("div", {
    className: "og-bar"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: pct + '%'
    }
  }), capPct != null && /*#__PURE__*/React.createElement("span", {
    className: "cap",
    style: {
      left: capPct + '%'
    },
    title: `Tope: ${capPct}%`
  })), /*#__PURE__*/React.createElement("div", {
    className: "og-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, fmt(cur), " \xB7 ", pct, "%"), who && /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, who), right && /*#__PURE__*/React.createElement("span", {
    className: "og-right",
    onClick: e => e.stopPropagation()
  }, right)));
}

// ── 2i · SectionHead ─────────────────────────────────────────────
// Un solo encabezado de sección: título + meta + acción, siempre igual.
function SectionHead({
  title,
  meta,
  action,
  onAction,
  level = 3,
  tight,
  children
}) {
  const H = level === 4 ? 'h4' : 'h3';
  return /*#__PURE__*/React.createElement("div", {
    className: `kbv-section-head ${tight ? 'tight' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "sh-id"
  }, React.createElement(H, {
    className: level === 4 ? 'kbv-h4' : 'kbv-h3'
  }, title), meta && /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, meta)), children, action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-ghost sh-act",
    onClick: onAction
  }, action, " ", /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-right",
    size: 12
  })));
}

// ── 2k · MoneyRow ────────────────────────────────────────────────
// Cuentas, créditos y suscripciones: ícono + nombre + meta + monto.
function MoneyRow({
  icon,
  color,
  name,
  meta,
  amount,
  suffix,
  negative,
  onClick,
  right
}) {
  const Tag = onClick ? 'button' : 'div';
  const props = onClick ? {
    type: 'button',
    onClick
  } : {};
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: "kbv-money-row",
    style: {
      '--c': color || 'var(--kb-primary)'
    }
  }, props), /*#__PURE__*/React.createElement("span", {
    className: "mr-ico"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: icon || 'wealth',
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    className: "mr-id"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mr-name"
  }, name), meta && /*#__PURE__*/React.createElement("span", {
    className: "mr-meta"
  }, meta)), /*#__PURE__*/React.createElement("span", {
    className: `mr-amt ${negative ? 'debt' : ''}`
  }, negative ? '−' : '', "$", Math.abs(Number(amount) || 0).toLocaleString('es-MX'), suffix && /*#__PURE__*/React.createElement("small", null, suffix)), right, onClick && /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-right",
    size: 11,
    style: {
      color: 'var(--kb-text-3)'
    }
  }));
}

// ── 2m · EmptyState ──────────────────────────────────────────────
// El vacío enseña qué es la sección y ofrece cómo llenarla.
function EmptyState({
  icon,
  title,
  body,
  action,
  onAction,
  compact
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `kbv-empty-state ${compact ? 'compact' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "es-ico"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: icon || 'sparkle',
    size: compact ? 17 : 22
  })), title && /*#__PURE__*/React.createElement("span", {
    className: "es-title"
  }, title), body && /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, body), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-primary es-act",
    onClick: onAction
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "plus",
    size: 13
  }), " ", action));
}

// ── 2g · PersonRow ───────────────────────────────────────────────
// Liga, aportantes y cualquier lista de personas. La métrica de la
// derecha se configura por sección; el resto es idéntico.
function PersonRow({
  person,
  rank,
  metric,
  you,
  actions,
  onClick
}) {
  const p = person || {};
  const m = metric || {};
  const Tag = onClick ? 'button' : 'div';
  const props = onClick ? {
    type: 'button',
    onClick
  } : {};
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `kbv-person-row lg ${p.risk ? 'risk' : ''} ${you ? 'you' : ''}`
  }, props), rank != null && /*#__PURE__*/React.createElement("span", {
    className: "pr-rank"
  }, rank), /*#__PURE__*/React.createElement("span", {
    className: "pr-av",
    style: {
      '--c': p.color || 'var(--kb-primary)'
    }
  }, (p.name || '?')[0], p.online && /*#__PURE__*/React.createElement("i", {
    className: "fr-dot"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pr-id"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pr-name"
  }, p.name, you && /*#__PURE__*/React.createElement("em", null, " \xB7 t\xFA")), /*#__PURE__*/React.createElement("span", {
    className: "pr-meta"
  }, "Nv. ", p.level, p.streak != null && /*#__PURE__*/React.createElement(React.Fragment, null, " \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: p.streak === 0 ? 'fr-streak-zero' : 'fr-streak'
  }, "\uD83D\uDD25 ", p.streak, " d")), p.note && ` · ${p.note}`)), m.value != null && /*#__PURE__*/React.createElement("div", {
    className: "pr-metric"
  }, /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, typeof m.value === 'number' ? m.value.toLocaleString('es-MX') : m.value), /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, m.label)), actions && /*#__PURE__*/React.createElement("div", {
    className: "pr-actions"
  }, actions));
}

// ── 2o · PriorityRow + RateRow ───────────────────────────────────
const KB_PRIORITIES = [{
  id: 'urgent',
  label: 'Urgente',
  color: 'var(--pri-urgent)'
}, {
  id: 'high',
  label: 'Alta',
  color: 'var(--pri-high)'
}, {
  id: 'medium',
  label: 'Media',
  color: 'var(--pri-medium)'
}, {
  id: 'low',
  label: 'Baja',
  color: 'var(--pri-low)'
}, {
  id: 'vlow',
  label: 'Muy baja',
  color: 'var(--pri-vlow)'
}];
function PriorityRow({
  value,
  onChange,
  compact
}) {
  const hasGlyph = typeof PriorityIcon === 'function';
  return /*#__PURE__*/React.createElement("div", {
    className: `kbv-priority-row ${compact ? 'compact' : ''} ${hasGlyph ? 'glyphs' : ''}`
  }, KB_PRIORITIES.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    type: "button",
    className: `kbv-pri ${value === p.id ? 'on' : ''}`,
    style: {
      '--c': p.color
    },
    onClick: () => onChange && onChange(p.id),
    title: p.label
  }, hasGlyph ? /*#__PURE__*/React.createElement(PriorityIcon, {
    level: p.id,
    size: 16
  }) : /*#__PURE__*/React.createElement("i", null), !compact && p.label)));
}

// RateRow — la escala 1–5 canónica. Adopta el control de íconos del modal de
// hábito (llamas para esfuerzo, glifos para prioridad) en vez de números sueltos.
function RateRow({
  label,
  hint,
  value,
  onChange,
  color,
  labels,
  icon = 'flame',
  showValue = true,
  compact,
  readOnly
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `kbv-rate-scale ${compact ? 'compact' : ''}`,
    style: color ? {
      '--c': color
    } : undefined
  }, (label || hint) && /*#__PURE__*/React.createElement("div", {
    className: "rr-head"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "rr-lbl"
  }, label), hint && /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, hint)), /*#__PURE__*/React.createElement("div", {
    className: "rr-dots"
  }, [1, 2, 3, 4, 5].map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    type: "button",
    className: `rr-dot ${n <= (value || 0) ? 'on' : ''}`,
    disabled: readOnly,
    onClick: () => onChange && onChange(n),
    title: labels && labels[n - 1] || `${n}/5`
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: icon,
    size: compact ? 12 : 14
  }))), showValue && /*#__PURE__*/React.createElement("span", {
    className: "rr-val"
  }, value || 0, "/5")));
}

// ── 2q · KbStepper · campo numérico ──────────────────────────────
// Reemplaza los <input type="number"> sueltos: mismo alto, misma etiqueta y
// una línea de ayuda que no descuadra la fila cuando falta.
function KbStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  hint,
  suffix,
  tone
}) {
  const v = Number(value) || 0;
  const set = n => onChange && onChange(Math.min(max, Math.max(min, n)));
  return /*#__PURE__*/React.createElement("div", {
    className: `kbv-stepper ${tone ? 'tone-' + tone : ''}`
  }, label && /*#__PURE__*/React.createElement("label", null, label), /*#__PURE__*/React.createElement("div", {
    className: "st-ctl"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => set(v - step),
    disabled: v <= min,
    "aria-label": "Restar"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "minus",
    size: 13
  })), /*#__PURE__*/React.createElement("span", {
    className: "st-val"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    onChange: e => set(parseInt(e.target.value || String(min), 10))
  }), suffix && /*#__PURE__*/React.createElement("em", null, suffix)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => set(v + step),
    disabled: v >= max,
    "aria-label": "Sumar"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "plus",
    size: 13
  }))), /*#__PURE__*/React.createElement("span", {
    className: "st-hint"
  }, hint || ''));
}

// ── 2p · Scale5 · el medidor 1–5 de solo lectura ─────────────────
// Un único indicador para toda escala 1–5 que solo se lee (tarjetas,
// filtros, detalles): 5 barras ascendentes. Sustituye a los rayos de
// energía, las estrellas y los pips sueltos.
function Scale5({
  value = 0,
  max = 5,
  color,
  size = 1,
  label = 'Nivel'
}) {
  const c = color || 'var(--kb-streak)';
  return /*#__PURE__*/React.createElement("span", {
    className: "kbv-diff-meter",
    style: {
      height: 18 * size
    },
    title: `${label} ${value}/${max}`,
    "aria-label": `${label} ${value} de ${max}`
  }, [1, 2, 3, 4, 5].map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    className: `bar ${n <= value ? 'on' : ''}`,
    style: {
      width: 4 * size,
      height: (5 + n * 2.5) * size,
      background: n <= value ? c : 'var(--kb-surface-2)'
    }
  })));
}

// Mapa semántico: un concepto ⇒ un ícono y un color, en toda la plataforma.
const KB_SCALES = {
  esfuerzo: {
    icon: 'flame',
    color: 'var(--kb-streak)',
    label: 'Esfuerzo'
  },
  dificultad: {
    icon: 'sword',
    color: 'var(--kb-boss)',
    label: 'Dificultad'
  },
  cognitivo: {
    icon: 'wisdom',
    color: 'var(--area-wisdom)',
    label: 'Esfuerzo cognitivo'
  },
  previo: {
    icon: 'graduation',
    color: 'var(--area-community)',
    label: 'Conocimiento previo'
  },
  interes: {
    icon: 'sparkle',
    color: 'var(--kb-primary)',
    label: 'Interés'
  }
};

// ── 2b · Confirmación en el pie ──────────────────────────────────
// Reemplaza los modales anidados y los confirm() del navegador.
function ConfirmFooter({
  message,
  confirmLabel = 'Sí, continuar',
  cancelLabel = 'No',
  danger = true,
  onConfirm,
  onCancel
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `kbv-confirm-strip ${danger ? 'danger' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-msg"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: danger ? 'alert' : 'sparkle',
    size: 13
  }), " ", message), /*#__PURE__*/React.createElement("div", {
    className: "cs-acts"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-ghost",
    onClick: onCancel
  }, cancelLabel), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `kbv-btn ${danger ? 'kbv-btn-danger' : 'kbv-btn-primary'}`,
    onClick: onConfirm
  }, confirmLabel)));
}

// Confirmación suelta (fuera de un modal): marco Kibo tamaño sm.
function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Sí, eliminar',
  cancelLabel = 'Cancelar',
  danger = true,
  onConfirm,
  onClose
}) {
  return /*#__PURE__*/React.createElement(KBVModal, {
    title: title,
    size: "sm",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement(ConfirmFooter, {
      message: message,
      confirmLabel: confirmLabel,
      cancelLabel: cancelLabel,
      danger: danger,
      onConfirm: () => {
        onConfirm && onConfirm();
        onClose && onClose();
      },
      onCancel: onClose
    })
  }, /*#__PURE__*/React.createElement("p", {
    className: "kbv-body"
  }, message));
}

// Hook: pide confirmación sin ventanas del navegador.
//   const [ask, dialog] = useConfirm();  …  ask({ title, message, onConfirm })
function useConfirm() {
  const [req, setReq] = React.useState(null);
  const ask = React.useCallback(cfg => setReq(cfg), []);
  const dialog = req ? /*#__PURE__*/React.createElement(ConfirmDialog, _extends({}, req, {
    onClose: () => setReq(null)
  })) : null;
  return [ask, dialog];
}

// ── 2b-bis · Preferencias vivas ────────────────────────────────────────
// Las prefs se leían de localStorage en cada render, pero nada avisaba de un
// cambio: cambiar «menú fijo» en Configuración no hacía nada hasta recargar.
// Un solo evento las vuelve reactivas para cualquier pantalla.
const KB_PREFS_KEY = 'kibo:prefs';
function kbGetPrefs() {
  try {
    return JSON.parse(localStorage.getItem(KB_PREFS_KEY) || '{}');
  } catch (_) {
    return {};
  }
}
function kbSetPref(k, v) {
  const next = {
    ...kbGetPrefs(),
    [k]: v
  };
  try {
    localStorage.setItem(KB_PREFS_KEY, JSON.stringify(next));
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent('kibo:prefs', {
      detail: next
    }));
  } catch (_) {}
  return next;
}
function useKbPrefs() {
  const [p, setP] = React.useState(kbGetPrefs);
  React.useEffect(() => {
    const h = () => setP(kbGetPrefs());
    window.addEventListener('kibo:prefs', h);
    window.addEventListener('storage', h);
    return () => {
      window.removeEventListener('kibo:prefs', h);
      window.removeEventListener('storage', h);
    };
  }, []);
  return p;
}

// ── 2b-ter · Divisas: un solo sitio por donde pasan ────────────────────
// La divisa personalizada se quedaba en su pantalla de ajustes porque cada
// sitio dibujaba `CoinIcon`/`GemIcon` a mano. Estos dos ayudantes leen el
// guardarropa de divisas, así renombrar o recolorear se ve en todas partes.
function curLabel(kind) {
  return typeof csLabel === 'function' ? csLabel(kind) : kind === 'coin' ? 'Monedas' : 'Materia oscura';
}
function curGlyph(kind, size) {
  const skin = typeof csGet === 'function' ? csGet(kind) : null;
  if (skin && typeof CurrencyGlyph === 'function') {
    return React.createElement(CurrencyGlyph, {
      glyph: skin.glyph,
      color: skin.color,
      size: size || 16
    });
  }
  const F = kind === 'coin' ? window.CoinIcon : window.GemIcon;
  return F ? React.createElement(F, {
    size: size || 16
  }) : null;
}
// Repinta al cambiar la divisa: sin esto el HUD se queda con la anterior.
function useCurrencyRepaint() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    const h = () => force();
    window.addEventListener('kibo:currency-change', h);
    return () => window.removeEventListener('kibo:currency-change', h);
  }, []);
}

// ── 2b-quater · La migaja de sección, derivada del menú ────────────────
// Cada pantalla escribía «Trabajo · …» o «Más · …» a mano: al reagrupar el
// menú, las 18 migajas quedaron nombrando grupos que ya no existen. Ahora la
// primera mitad sale de `DEFAULT_SIDEBAR_SECTIONS`, el único sitio donde vive
// la agrupación.
function sectionNameOf(screenId) {
  const secs = window.DEFAULT_SIDEBAR_SECTIONS || [];
  for (const s of secs) {
    if ((s.items || []).some(it => it.id === screenId)) return s.name;
  }
  return 'General';
}
// La migaja completa: grupo (derivado) + de qué va la pantalla (suyo).
function crumb(screenId, what) {
  const g = sectionNameOf(screenId);
  return what ? g + ' · ' + what : g;
}

// ── 2c · TextPromptDialog ──────────────────────────────────────────────
// Alta rápida de un solo campo — reemplaza los prompt() del navegador.
function TextPromptDialog({
  title,
  sub,
  label = 'Nombre',
  placeholder = '',
  confirmLabel = 'Agregar',
  value = '',
  onSubmit,
  onClose
}) {
  const [val, setVal] = React.useState(value);
  const submit = () => {
    if (!val.trim()) return;
    onSubmit && onSubmit(val.trim());
    onClose && onClose();
  };
  return /*#__PURE__*/React.createElement(KBVModal, {
    title: title,
    sub: sub,
    size: "md",
    onClose: onClose,
    footer: /*#__PURE__*/React.createElement("div", {
      className: "right",
      style: {
        marginLeft: 'auto',
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "kbv-btn kbv-btn-ghost",
      onClick: onClose
    }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "kbv-btn kbv-btn-primary",
      disabled: !val.trim(),
      onClick: submit
    }, confirmLabel, " ", /*#__PURE__*/React.createElement(KIcon, {
      name: "check",
      size: 14
    })))
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-form-row"
  }, /*#__PURE__*/React.createElement("label", null, label, " *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: val,
    autoFocus: true,
    placeholder: placeholder,
    onChange: e => setVal(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') submit();
    }
  })));
}

// Hook gemelo de useConfirm:  const [askText, textDialog] = usePrompt();
function usePrompt() {
  const [req, setReq] = React.useState(null);
  const ask = React.useCallback(cfg => setReq(cfg), []);
  const dialog = req ? /*#__PURE__*/React.createElement(TextPromptDialog, _extends({}, req, {
    onClose: () => setReq(null)
  })) : null;
  return [ask, dialog];
}

// ── fmtNum ────────────────────────────────────────────────────────
// Todo contador de la plataforma pasa por aquí: acepta número o cadena
// («24000», «9,999») y devuelve es-MX con separador de miles. Existe porque los
// pills de divisa nacían unos formateados y otros crudos, y se veían lado a lado.
function fmtNum(v, fallback = 0) {
  const n = typeof v === 'number' ? v : parseInt(String(v ?? '').replace(/[^\d-]/g, ''), 10);
  return (Number.isFinite(n) ? n : fallback).toLocaleString('es-MX');
}
Object.assign(window, {
  kbGetPrefs,
  kbSetPref,
  useKbPrefs,
  curLabel,
  curGlyph,
  useCurrencyRepaint,
  sectionNameOf,
  crumb,
  fmtNum,
  KbHabitCard,
  ItemCard,
  GoalBar,
  SectionHead,
  MoneyRow,
  EmptyState,
  PersonRow,
  PriorityRow,
  RateRow,
  KB_PRIORITIES,
  Scale5,
  KB_SCALES,
  KbStepper,
  ConfirmFooter,
  ConfirmDialog,
  useConfirm,
  TextPromptDialog,
  usePrompt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/kbv-shared.jsx", error: String((e && e.message) || e) }); }

// reference/app/kibo-blob.jsx
try { (() => {
// kibo-blob.jsx — KIBO, la mascota canónica del Design System (RF-19).
// Gel translúcido de un solo cuerpo: respira, parpadea, hace travesuras y
// expresa 8 ánimos con color + cara. Como FAB abre la rueda de acción rápida
// y puede "leerle" al usuario morfando en losa de mensaje.

const KIBO_MOODS = {
  // Boca de KIBO (referencia del usuario): PEQUEÑA y de ondas — un festón de
  // 2–3 bombas, no una sonrisa ancha. La expresión la carga la pupila; la boca
  // solo matiza. Anchos ~11–14 unidades en un viewBox de 34.
  // `px`/`py` = posición de la pupila blanca (0,0 = centro del ojo).
  calma: {
    label: 'Tranquilo',
    skin: 'var(--kb-mood-calma)',
    d: 'M -4.2 1 q 2.1 2.3 4.2 0 q 2.1 2.3 4.2 0',
    px: 0,
    py: -0.18
  },
  feliz: {
    label: 'Feliz',
    skin: 'var(--kb-mood-feliz)',
    d: 'M -4.2 1 q 2.1 2.3 4.2 0 q 2.1 2.3 4.2 0',
    px: 0,
    py: -0.24
  },
  celebra: {
    label: 'Celebra',
    skin: 'var(--kb-mood-celebra)',
    d: 'M -4.2 1 q 2.1 2.3 4.2 0 q 2.1 2.3 4.2 0',
    px: 0,
    py: -0.3
  },
  travieso: {
    label: 'Travieso',
    skin: 'var(--kb-mood-travieso)',
    d: 'M -1.6 -1.4 L 2.4 1.4 L -1.6 4.2',
    px: 0.34,
    py: -0.24
  },
  enfocado: {
    label: 'Enfocado',
    skin: 'var(--kb-mood-enfocado)',
    d: 'M -4.2 1.6 q 2.1 1.5 4.2 0 q 2.1 1.5 4.2 0',
    px: 0,
    py: 0.1
  },
  sorpresa: {
    label: 'Sorpresa',
    skin: 'var(--kb-mood-sorpresa)',
    d: 'M -4.2 0.4 q 2.1 3 4.2 0 q 2.1 3 4.2 0',
    px: 0,
    py: -0.34
  },
  cansado: {
    label: 'Cansado',
    skin: 'var(--kb-mood-cansado)',
    d: 'M -4.2 2 q 2.1 1.4 4.2 0 q 2.1 1.4 4.2 -0.3',
    px: -0.2,
    py: 0.34
  },
  triste: {
    label: 'Triste',
    skin: 'var(--kb-mood-triste)',
    d: 'M -4.2 2.8 q 2.1 -1.9 4.2 0 q 2.1 -1.9 4.2 0',
    px: 0,
    py: 0.4
  }
};

// Ánimos heredados del prototipo → ánimos canónicos del DS
const KIBO_MOOD_ALIAS = {
  happy: 'feliz',
  default: 'calma',
  wave: 'feliz',
  celebrating: 'celebra',
  thinking: 'enfocado',
  worried: 'triste',
  alert: 'sorpresa',
  sleep: 'cansado',
  ok: 'feliz',
  warn: 'sorpresa',
  info: 'enfocado',
  focus: 'enfocado',
  sad: 'triste'
};
function kiboMood(m) {
  if (!m) return 'calma';
  return KIBO_MOODS[m] ? m : KIBO_MOOD_ALIAS[m] || 'calma';
}

// Travesuras que EXIGEN un juguete: solo entran al repertorio (y al dial) si
// ese juguete está equipado.
const KIBO_TOY_TRICKS = {
  'toy-pelota': {
    id: 'patada',
    name: 'Patear el balón',
    icon: 'target',
    desc: 'Le da con la manopié y la manda a volar'
  },
  'toy-uke': {
    id: 'cantar',
    name: 'Cantar',
    icon: 'mic',
    desc: 'Toma el ukelele y le salen notas de la boca'
  },
  'toy-cubo': {
    id: 'mirar',
    name: 'Voltear a ver',
    icon: 'search',
    desc: 'Se queda viendo su juguete'
  },
  'toy-plantita': {
    id: 'mirar',
    name: 'Voltear a ver',
    icon: 'search',
    desc: 'Se queda viendo su plantita'
  }
};
const KIBO_TRICK_LIST = [{
  id: 'zumbido',
  name: 'Zumbido',
  icon: 'sparkle',
  face: true,
  desc: 'Vibra y abre los ojos como platos'
}, {
  id: 'flip',
  name: 'Voltereta',
  icon: 'repeat',
  face: false,
  desc: 'Un giro completo en el aire'
}, {
  id: 'squash',
  name: 'Aplastarse',
  icon: 'gauge',
  face: false,
  desc: 'Se hace tortilla y rebota'
}, {
  id: 'globo',
  name: 'Globo',
  icon: 'trending-up',
  face: false,
  desc: 'Se infla y flota'
}, {
  id: 'gota',
  name: 'Gota',
  icon: 'droplet',
  face: false,
  desc: 'Se escurre como gel'
}, {
  id: 'wave',
  name: 'Saludo',
  icon: 'user',
  face: true,
  desc: 'Agita su manopié'
}, {
  id: 'point',
  name: 'Señalar',
  icon: 'target',
  face: true,
  desc: 'Te apunta con la manopié'
}, {
  id: 'five',
  name: 'Choca esos 5',
  icon: 'check',
  face: true,
  desc: 'Levanta la manopié para chocarla'
}, {
  id: 'clap',
  name: 'Aplauso',
  icon: 'trophy',
  face: true,
  desc: 'Aplaude con las dos'
}, {
  id: 'beso',
  name: 'Beso',
  icon: 'mood-great',
  face: true,
  desc: 'Manda un corazón'
}, {
  id: 'mueca',
  name: 'Mueca',
  icon: 'mood-meh',
  face: true,
  desc: 'Estira la boca de lado'
}, {
  id: 'bostezo',
  name: 'Bostezo',
  icon: 'clock',
  face: true,
  desc: 'Boca enorme y ojos cerrados'
}, {
  id: 'guino',
  name: 'Guiño',
  icon: 'mood-good',
  face: true,
  desc: 'Cierra un ojo con complicidad'
}, {
  id: 'mareo',
  name: 'Mareo',
  icon: 'repeat',
  face: true,
  desc: 'Las pupilas giran en espiral'
}];
const KIBO_TRICKS = KIBO_TRICK_LIST.map(t => t.id);
const KIBO_FACE_TRICKS = ['wave', 'point', 'five', 'clap', 'beso', 'mueca', 'zumbido', 'bostezo', 'guino', 'mareo', 'patada', 'cantar', 'mirar'];
// El repertorio depende del juguete equipado: sin pelota no hay patada.
function kiboTricksFor(toyId) {
  const extra = KIBO_TOY_TRICKS[toyId];
  return extra ? KIBO_TRICK_LIST.concat([{
    ...extra,
    face: true,
    toy: true
  }]) : KIBO_TRICK_LIST;
}

// Bocas de travesura: se elige una al azar para que la mueca nunca se repita.
// Ánimos con los que KIBO puede salir de una travesura (antes siempre
// 'travieso', y de ahí que la cara se viera idéntica cada vez).
const KIBO_TRICK_MOODS = ['travieso', 'sorpresa', 'celebra', 'feliz'];
const KIBO_MUECAS = [{
  d: 'M -8 1 Q -2 7 2 0 Q 5 -4 8 2',
  fill: false
},
// ondulada
{
  d: 'M -7 0 L 0 5 L 7 -1',
  fill: false
},
// pico
{
  d: 'M -8 -1 C -8 -4 8 -4 8 -1 C 8 6 -8 6 -8 -1 Z',
  fill: true
},
// boquita llena
{
  d: 'M -5 -3 Q 0 6 5 -3 Q 0 0 -5 -3 Z',
  fill: true
},
// lengua
{
  d: 'M -9 2 Q -4 -3 0 2 Q 4 7 9 2',
  fill: false
},
// zigzag suave
{
  d: 'M -3 -4 Q 5 0 -3 5',
  fill: false
},
// de lado
{
  d: 'M -6 0 Q -3 4 0 0 Q 3 -4 6 0',
  fill: false
},
// doble onda fina
{
  d: 'M -5 2 Q 0 -4 5 2',
  fill: false
},
// arco invertido
{
  d: 'M -4 -2 C -4 -5 4 -5 4 -2 C 4 3 -4 3 -4 -2 Z',
  fill: true
},
// ovalito
{
  d: 'M -2 -2.4 L 2.6 1 L -2 4.4',
  fill: false
},
// chevron «>»
{
  d: 'M 2 -2.4 L -2.6 1 L 2 4.4',
  fill: false
},
// chevron «<»
{
  d: 'M -5 -1 L -1.4 2.4 L 2.2 -1 L 5.8 2.4',
  fill: false
} // zigzag de picos
];
const KIBO_NATIVE_W = 140,
  KIBO_NATIVE_H = 150;

// ─────────────────────────────────────────────────────────────
// KiboBlob — el cuerpo. size = ancho en px.
// idle: programa travesuras solo (6–12 s). gesture: dispara una a mano.
// ─────────────────────────────────────────────────────────────
// Auras que se dibujan con partículas. Burbujas y Pétalos tenían su CSS
// completo pero nunca recibían los `.star`: el JSX solo los emitía para
// 'au-estelar', así que se compraban y no se veía nada.
const AURA_PARTICLES = ['au-estelar', 'au-burbujas', 'au-petalo'];
function KiboBlob({
  size = 96,
  mood = 'calma',
  idle = false,
  gesture = null,
  onClick,
  ground = true,
  className = '',
  style = {},
  title,
  styleOverride = null,
  prop = null,
  asMark = false
}) {
  const m = kiboMood(mood);
  const def = KIBO_MOODS[m];
  // Guardarropa compartido (Tienda · Kibo cosmético). styleOverride permite
  // previsualizar un item sin equiparlo.
  const wardrobe = typeof useKiboStyle === 'function' ? useKiboStyle() : null;
  const fit = styleOverride ? {
    ...(wardrobe || {}),
    ...styleOverride
  } : wardrobe;
  const skin = fit && typeof kiboSkinById === 'function' ? kiboSkinById(fit.skin) : null;
  const aura = fit && typeof kiboAuraById === 'function' ? kiboAuraById(fit.aura) : null;
  const pers = fit && typeof kiboPersById === 'function' ? kiboPersById(fit.pers) : null;
  const acc = fit ? fit.acc : 'ac-none';
  const mark = fit ? fit.mark : 'mk-none';
  const toy = fit && typeof kiboToyById === 'function' ? kiboToyById(fit.toy) : null;
  // La piel viste el cuerpo; el ánimo sigue mandando cuando no es la default.
  // Degradados: --skin lleva la BASE sólida (manos, tinte, losa) y el
  // degradado se pinta directo en el cuerpo.
  const isGrad = skin && skin.base;
  const bodySkin = skin && skin.id !== 'sk-teal' ? isGrad ? skin.base : skin.body : def.skin;
  const bodyGrad = isGrad ? {
    backgroundImage: skin.body
  } : null;
  const [trick, setTrick] = React.useState(null);
  const [mueca, setMueca] = React.useState(null);
  const [pop, setPop] = React.useState(false);
  const busy = React.useRef(false);
  const busyTimer = React.useRef(null);
  const lastGesture = React.useRef(null);
  const rest = React.useCallback(() => {
    clearTimeout(busyTimer.current);
    busyTimer.current = null;
    busy.current = false;
    setTrick(null);
    setMueca(null);
  }, []);
  const run = React.useCallback((name, interrupt) => {
    // Un gesto pedido por el usuario manda: corta la travesura en curso en
    // lugar de perderse. Solo las automáticas (idle) respetan la ventana.
    if (busy.current && !interrupt) return;
    clearTimeout(busyTimer.current);
    const withToy = toy && toy.id !== 'toy-none' && KIBO_TOY_TRICKS[toy.id] ? [KIBO_TOY_TRICKS[toy.id].id] : [];
    const pool = pers && pers.tricks || KIBO_TRICKS.concat(withToy);
    const t = name || pool[Math.floor(Math.random() * pool.length)];
    const cls = KIBO_FACE_TRICKS.includes(t) ? t : 'trick-' + t;
    // Limpiar antes de aplicar: si la clase entrante es la misma que la que
    // está corriendo, el navegador no reinicia el keyframe y no se ve nada.
    setTrick(null);
    requestAnimationFrame(() => setTrick(cls));
    // Cualquier travesura con la cara a la vista cambia de boca: si solo la
    // 'mueca' la cambiara, las otras nueve repetirían el trazo del ánimo.
    // Las que esconden la cara no cambian de boca; las que tienen boca PROPIA
    // (bostezo, beso) tampoco — su trazo lo define su animación.
    const entry = KIBO_TRICK_LIST.find(x => x.id === t);
    const ownMouth = ['bostezo', 'beso', 'cantar'].includes(t);
    setMueca(!entry || !entry.face || ownMouth ? null : KIBO_MUECAS[Math.floor(Math.random() * KIBO_MUECAS.length)]);
    busy.current = true;
    busyTimer.current = setTimeout(rest, 3400);
  }, [pers && pers.id, toy && toy.id, rest]);
  React.useEffect(() => () => clearTimeout(busyTimer.current), []);
  React.useEffect(() => {
    if (!gesture || gesture === lastGesture.current) return;
    lastGesture.current = gesture;
    const g = String(gesture).split('#')[0];
    // Viene de un toque: interrumpe lo que esté corriendo.
    run(g === 'random' || g === '' ? null : g, true);
  }, [gesture, run]);
  React.useEffect(() => {
    // Sereno (o sin guardarropa cargado en superficies quietas): cero travesuras.
    const ms = pers ? pers.idleMs : [6000, 12000];
    if (!idle || !ms) return;
    let alive = true,
      id;
    const [lo, hi] = ms;
    const loop = () => {
      id = setTimeout(() => {
        if (!alive) return;
        run();
        loop();
      }, lo + Math.random() * (hi - lo));
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, [idle, run, pers && pers.id]);

  // La boca "pop" cada vez que cambia el ánimo
  React.useEffect(() => {
    setPop(true);
    const t = setTimeout(() => setPop(false), 460);
    return () => clearTimeout(t);
  }, [m]);
  const s = size / KIBO_NATIVE_W;
  const host = {
    width: size,
    height: Math.round(size * (KIBO_NATIVE_H / KIBO_NATIVE_W)),
    '--s': s,
    ...style
  };
  return /*#__PURE__*/React.createElement("span", {
    className: `kbb-host ${className}`,
    style: host,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: `kbb ${trick || ''} ${onClick ? 'clickable' : ''} ${skin && skin.animated ? 'skinned' : ''} ${pers && pers.theatrical ? 'teatral' : ''}`,
    "data-mood": m,
    "data-skin": skin ? skin.id : 'sk-teal',
    style: {
      '--skin': bodySkin,
      '--aura': aura && aura.tint || 'transparent'
    },
    title: title,
    onClick: onClick,
    onAnimationEnd: e => {
      if (e.target === e.currentTarget && trick) rest();
    }
  }, ground && /*#__PURE__*/React.createElement("span", {
    className: "kbb-ground"
  }), prop && typeof KiboProp === 'function' && /*#__PURE__*/React.createElement(KiboProp, {
    kind: prop
  }), toy && toy.id !== 'toy-none' && /*#__PURE__*/React.createElement(KiboToy, {
    id: toy.id
  }), aura && aura.id !== 'au-none' && /*#__PURE__*/React.createElement("span", {
    className: `kbb-aura ${aura.id}`,
    "aria-hidden": "true"
  }, AURA_PARTICLES.includes(aura.id) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "star s1"
  }), /*#__PURE__*/React.createElement("i", {
    className: "star s2"
  }), /*#__PURE__*/React.createElement("i", {
    className: "star s3"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "kbb-float"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbb-bub l"
  }, /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("span", {
    className: "kbb-bub r"
  }, /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("span", {
    className: "kbb-body",
    style: bodyGrad || undefined
  }, skin && skin.animated && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "kbb-skinfx a"
  }), /*#__PURE__*/React.createElement("span", {
    className: "kbb-skinfx b"
  }), /*#__PURE__*/React.createElement("span", {
    className: "kbb-skinfx c"
  })), /*#__PURE__*/React.createElement("span", {
    className: "kbb-tint"
  })), /*#__PURE__*/React.createElement("span", {
    className: "kbb-bump",
    "aria-hidden": "true"
  }), String(mark || '').split(',').filter(m => m && m !== 'mk-none').map(m => {
    const [id, slot] = m.split('@');
    return /*#__PURE__*/React.createElement(KiboTattoo, {
      key: m,
      id: id,
      slot: slot
    });
  }), acc && acc !== 'ac-none' && /*#__PURE__*/React.createElement(KiboAccessory, {
    id: acc
  }), /*#__PURE__*/React.createElement("span", {
    className: "kbb-faceclip",
    style: {
      '--px': mueca && mueca.px != null ? mueca.px : def.px || 0,
      '--py': def.py || 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbb-face"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbb-brows"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbb-brow"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "-11 -6 22 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M -8 2.6 Q 0 -3.4 8 2.6"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "kbb-brow"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "-11 -6 22 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M -8 2.6 Q 0 -3.4 8 2.6"
  })))), /*#__PURE__*/React.createElement("span", {
    className: "kbb-eyes"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbb-eye"
  }), /*#__PURE__*/React.createElement("span", {
    className: "kbb-eye"
  })), /*#__PURE__*/React.createElement("span", {
    className: "kbb-cheeks"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbb-cheek"
  }), /*#__PURE__*/React.createElement("span", {
    className: "kbb-cheek"
  })), /*#__PURE__*/React.createElement("svg", {
    className: `kbb-mouth ${pop ? 'pop' : ''} ${mueca ? 'mueca' : ''}`,
    viewBox: "-17 -10 34 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: (mueca || def).d,
    className: (mueca || def).fill ? 'fill' : ''
  })), /*#__PURE__*/React.createElement("span", {
    className: "kbb-notes",
    "aria-hidden": "true"
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      '--i': i
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "15",
    height: "15"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 18V5l10-2v13",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6.5",
    cy: "18",
    r: "3",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16.5",
    cy: "16",
    r: "3",
    fill: "currentColor"
  }))))), /*#__PURE__*/React.createElement("span", {
    className: "kbb-kiss",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 21 C 5 15 2 11 2 7.6 C 2 4.8 4.2 3 6.6 3 C 8.6 3 10.6 4.2 12 6.2 C 13.4 4.2 15.4 3 17.4 3 C 19.8 3 22 4.8 22 7.6 C 22 11 19 15 12 21 Z",
    fill: "var(--kb-hp)"
  }))))), /*#__PURE__*/React.createElement("span", {
    className: "kbb-target"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "26",
    height: "26",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3 L14 9.6 L21 12 L14 14.4 L12 21 L10 14.4 L3 12 L10 9.6 Z"
  }))))));
}

// ─────────────────────────────────────────────────────────────
// KiboTattoo — tatuaje sobre el gel. Vive DENTRO del cuerpo (mismo lienzo,
// 140×150), así que se deforma con él: nunca se despega como un accesorio.
// ─────────────────────────────────────────────────────────────
// OJO: NO llamarlo KiboMark — mascot.jsx ya exporta un KiboMark (la insignia
// compacta) que renderiza un KiboBlob dentro. Como mascot.jsx carga después,
// sobrescribía este y el blob se renderizaba a sí mismo en bucle infinito.
// Encuadre propio de cada marca para verla SOLA (58): el arte vive en el
// lienzo del cuerpo (140×150) y en su sitio anatómico, así que para el
// specimen se recorta a su caja — no se reposiciona el arte.
// Dónde puede ir un tatuaje: la cara, que es donde se ve. Antes vivían
// repartidos por los costados del cuerpo, donde la silueta los tapaba.
const MARK_SLOTS = {
  frente: {
    label: 'Frente',
    key: 'F'
  },
  nariz: {
    label: 'Nariz',
    key: 'N'
  },
  cizq: {
    label: 'Cachete izquierdo',
    key: 'I'
  },
  cder: {
    label: 'Cachete derecho',
    key: 'D'
  },
  ambos: {
    label: 'Ambos cachetes',
    key: 'A'
  }
};
const MARK_BOX = {
  'mk-pecas': '20 106 26 26',
  'mk-estrella': '90 112 28 24',
  'mk-rayo': '18 100 32 40',
  'mk-espiral': '84 102 34 34',
  'mk-corazon': '18 102 32 30',
  'mk-consteo': '20 98 34 46',
  'mk-runa': '94 100 26 40',
  'mk-ondas': '34 100 60 46'
};
function KiboTattoo({
  id,
  slot,
  specimen = false
}) {
  const ink = 'rgba(255,255,255,0.74)';
  let art = null;
  switch (id) {
    case 'mk-pecas':
      art = /*#__PURE__*/React.createElement("g", {
        fill: ink
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "34",
        cy: "112",
        r: "2.8"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "26",
        cy: "120",
        r: "2.3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "38",
        cy: "126",
        r: "2.1"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "106",
        cy: "112",
        r: "2.8"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "114",
        cy: "120",
        r: "2.3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "102",
        cy: "126",
        r: "2.1"
      }));
      break;
    case 'mk-estrella':
      art = /*#__PURE__*/React.createElement("path", {
        d: "M104 116 l3 6.4 7 1 -5 4.9 1.2 7-6.2-3.3-6.2 3.3 1.2-7-5-4.9 7-1 Z",
        fill: ink
      });
      break;
    case 'mk-rayo':
      art = /*#__PURE__*/React.createElement("path", {
        d: "M30 104 L 42 104 L 35 116 L 46 116 L 26 136 L 32 120 L 22 120 Z",
        fill: ink
      });
      break;
    case 'mk-espiral':
      art = /*#__PURE__*/React.createElement("path", {
        d: "M104 122 a 7 7 0 1 1 -7 -7 a 11 11 0 1 0 11 11",
        fill: "none",
        stroke: ink,
        strokeWidth: "3.4",
        strokeLinecap: "round"
      });
      break;
    case 'mk-corazon':
      art = /*#__PURE__*/React.createElement("path", {
        d: "M34 128 C 22 118 22 108 30 106 C 35 105 38 109 34 111 C 38 107 46 108 46 114 C 46 120 40 124 34 128 Z",
        fill: "var(--kb-hp)",
        opacity: "0.62"
      });
      break;
    case 'mk-consteo':
      art = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
        d: "M26 104 L 40 110 L 34 122 L 48 128 L 42 138",
        fill: "none",
        stroke: ink,
        strokeWidth: "1.6"
      }), /*#__PURE__*/React.createElement("g", {
        fill: ink
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "26",
        cy: "104",
        r: "2.8"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "40",
        cy: "110",
        r: "2.2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "34",
        cy: "122",
        r: "2.4"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "48",
        cy: "128",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "42",
        cy: "138",
        r: "2.6"
      })));
      break;
    case 'mk-runa':
      art = /*#__PURE__*/React.createElement("g", {
        fill: "none",
        stroke: ink,
        strokeWidth: "3.2",
        strokeLinecap: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M102 106 V 134"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M102 114 L 112 106"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M102 124 L 112 132"
      }));
      break;
    case 'mk-ondas':
      art = /*#__PURE__*/React.createElement("g", {
        fill: "none",
        stroke: ink,
        strokeWidth: "2.8",
        strokeLinecap: "round",
        opacity: "0.8"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M40 112 Q 52 106 64 112 Q 76 118 88 112"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M40 124 Q 52 118 64 124 Q 76 130 88 124"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M40 136 Q 52 130 64 136 Q 76 142 88 136"
      }));
      break;
    default:
      return null;
  }
  if (specimen) return /*#__PURE__*/React.createElement("svg", {
    className: "kbs-mark-art",
    viewBox: MARK_BOX[id] || '0 0 140 150',
    preserveAspectRatio: "xMidYMid meet",
    "aria-hidden": "true"
  }, art);
  // El arte está dibujado en su sitio anatómico dentro del lienzo del cuerpo.
  // Para llevarlo a la cara no se arrastra el lienzo entero (quedaría fuera de
  // cuadro): se recorta a SU caja y esa caja se coloca en la mejilla, la
  // frente o la nariz. El envoltorio interior lleva el mismo `kbBlob` que el
  // gel, así que el tatuaje se estira y encoge con el cuerpo.
  const box = MARK_BOX[id] || '0 0 140 150';
  const where = MARK_SLOTS[slot] ? slot : 'cder';
  const spots = where === 'ambos' ? ['cizq', 'cder'] : [where];
  return /*#__PURE__*/React.createElement(React.Fragment, null, spots.map(sp => /*#__PURE__*/React.createElement("span", {
    key: sp,
    className: `kbb-tattoo face spot-${sp}`,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbb-tattoo-in"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: box,
    preserveAspectRatio: "xMidYMid meet"
  }, art)))));
}

// ─────────────────────────────────────────────────────────────
// KiboToy — el juguete equipado, viviendo junto a la base de KIBO.
// ─────────────────────────────────────────────────────────────
function KiboToy({
  id
}) {
  let art = null;
  switch (id) {
    case 'toy-pelota':
      art = /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 30 30",
        width: "26",
        height: "26"
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "15",
        cy: "15",
        r: "13",
        fill: "var(--kb-hp)"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M2 15 A 13 13 0 0 1 28 15",
        fill: "var(--kb-canvas)",
        opacity: "0.9",
        transform: "rotate(-18 15 15)"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "15",
        cy: "15",
        r: "13",
        fill: "none",
        stroke: "#A92020",
        strokeWidth: "1.6"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "15",
        cy: "15",
        r: "4",
        fill: "var(--kb-canvas)",
        stroke: "#A92020",
        strokeWidth: "1.4"
      }));
      break;
    case 'toy-cubo':
      art = /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 28 30",
        width: "24",
        height: "26"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M14 2 L26 8.5 V 21.5 L14 28 L2 21.5 V 8.5 Z",
        fill: "var(--area-community)"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M14 2 L26 8.5 L14 15 L2 8.5 Z",
        fill: "#C89CF2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M14 15 V 28 L2 21.5 V 8.5 Z",
        fill: "#8348C4"
      }));
      break;
    case 'toy-uke':
      art = /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 22 40",
        width: "20",
        height: "36"
      }, /*#__PURE__*/React.createElement("rect", {
        x: "9",
        y: "2",
        width: "4",
        height: "14",
        rx: "2",
        fill: "#8A5A2B"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "26",
        r: "10",
        fill: "#C98A46"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "26",
        r: "3.4",
        fill: "#5E3A16"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 8 V 26 M12 8 V 26",
        stroke: "#F4DC92",
        strokeWidth: "0.8"
      }));
      break;
    case 'toy-plantita':
      art = /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 26 32",
        width: "22",
        height: "28"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M13 16 C 13 8 18 4 22 3 C 22 10 18 14 13 16 Z",
        fill: "#2A9D5C"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M13 17 C 13 11 9 8 5 7 C 5 13 9 16 13 17 Z",
        fill: "#37B26D"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 18 H 19 L 17.4 29 H 8.6 Z",
        fill: "var(--kb-streak)"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 18 H 19 L 18.6 21 H 7.4 Z",
        fill: "#C24E1F"
      }));
      break;
    default:
      return null;
  }
  return /*#__PURE__*/React.createElement("span", {
    className: `kbb-toy ${id}`,
    "aria-hidden": "true"
  }, art);
}

// ─────────────────────────────────────────────────────────────
// KiboAccessory — el accesorio equipado, dibujado sobre el cuerpo.
// Coordenadas en el mismo lienzo nativo (140×150); hereda las
// transformaciones del cuerpo porque vive dentro de .kbb-float.
// ─────────────────────────────────────────────────────────────
// Geometría MEDIDA de la cara actual (viewBox 140×150): ojos de 43×44 con
// centros en (39.5, 65.7) y (104.4, 65.7). El arte venía de la cara anterior
// a E-01 (ojos de 37 en cx 52/88) — por eso los cosméticos no cuadraban.
const KB_EYE_L = 39.5,
  KB_EYE_R = 104.4,
  KB_EYE_CY = 65.7,
  KB_EYE_RX = 21.5;
const KB_HEAD_L = 26,
  KB_HEAD_R = 114,
  KB_HEAD_MID = 70;
function KiboAccessory({
  id
}) {
  let art = null;
  switch (id) {
    case 'ac-lentes':
      art = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
        cx: KB_EYE_L,
        cy: KB_EYE_CY,
        r: KB_EYE_RX + 3,
        fill: "rgba(255,255,255,0.14)",
        stroke: "var(--kb-text)",
        strokeWidth: "3.4"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: KB_EYE_R,
        cy: KB_EYE_CY,
        r: KB_EYE_RX + 3,
        fill: "rgba(255,255,255,0.14)",
        stroke: "var(--kb-text)",
        strokeWidth: "3.4"
      }), /*#__PURE__*/React.createElement("path", {
        d: `M${KB_EYE_L + KB_EYE_RX + 3} ${KB_EYE_CY} H ${KB_EYE_R - KB_EYE_RX - 3}`,
        stroke: "var(--kb-text)",
        strokeWidth: "3.4",
        strokeLinecap: "round",
        fill: "none"
      }), /*#__PURE__*/React.createElement("path", {
        d: `M${KB_EYE_L - KB_EYE_RX - 3} ${KB_EYE_CY} H 12`,
        stroke: "var(--kb-text)",
        strokeWidth: "3",
        strokeLinecap: "round",
        fill: "none"
      }), /*#__PURE__*/React.createElement("path", {
        d: `M${KB_EYE_R + KB_EYE_RX + 3} ${KB_EYE_CY} H 128`,
        stroke: "var(--kb-text)",
        strokeWidth: "3",
        strokeLinecap: "round",
        fill: "none"
      }));
      break;
    case 'ac-mono':
      art = /*#__PURE__*/React.createElement("g", {
        transform: "translate(70,16) rotate(-8) scale(1.15)"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M0 0 C -14 -10 -22 2 -8 6 C -22 10 -14 22 0 12 Z",
        fill: "var(--kb-hp)"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M0 0 C 14 -10 22 2 8 6 C 22 10 14 22 0 12 Z",
        fill: "var(--kb-hp)"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "0",
        cy: "6",
        r: "4.5",
        fill: "var(--kb-hp-ink)"
      }));
      break;
    case 'ac-gorra':
      art = /*#__PURE__*/React.createElement("g", {
        transform: "translate(0,-6)"
      }, /*#__PURE__*/React.createElement("path", {
        d: `M${KB_HEAD_L} 34 A 34 26 0 0 1 ${KB_HEAD_R} 34 L ${KB_HEAD_R} 43 A 34 16 0 0 1 ${KB_HEAD_L} 43 Z`,
        fill: "var(--kb-primary-ink)"
      }), /*#__PURE__*/React.createElement("path", {
        d: `M${KB_HEAD_R - 6} 36 Q 136 34 140 45 Q 118 50 ${KB_HEAD_R - 8} 45 Z`,
        fill: "var(--kb-primary-ink)",
        opacity: "0.92"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: KB_HEAD_MID,
        cy: "20",
        r: "4.5",
        fill: "var(--kb-coin)"
      }));
      break;
    case 'ac-mago':
      art = /*#__PURE__*/React.createElement("g", {
        transform: "translate(0,-10)"
      }, /*#__PURE__*/React.createElement("path", {
        d: `M${KB_HEAD_MID} -16 L ${KB_HEAD_MID + 28} 44 Q ${KB_HEAD_MID} 53 ${KB_HEAD_MID - 28} 44 Z`,
        fill: "#6D28D9"
      }), /*#__PURE__*/React.createElement("path", {
        d: `M${KB_HEAD_L - 2} 44 Q ${KB_HEAD_MID} 58 ${KB_HEAD_R + 2} 44 Q ${KB_HEAD_MID} 66 ${KB_HEAD_L - 2} 44 Z`,
        fill: "#5B21B6"
      }), /*#__PURE__*/React.createElement("path", {
        d: `M${KB_HEAD_MID} 4 l 2.6 5.4 5.8 .8 -4.2 4.1 1 5.8 -5.2 -2.8 -5.2 2.8 1 -5.8 -4.2 -4.1 5.8 -.8 Z`,
        fill: "var(--kb-coin)"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: KB_HEAD_MID - 12,
        cy: "30",
        r: "2.2",
        fill: "var(--kb-coin-soft)"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: KB_HEAD_MID + 12,
        cy: "22",
        r: "1.8",
        fill: "var(--kb-coin-soft)"
      }));
      break;
    case 'ac-corona':
      art = /*#__PURE__*/React.createElement("g", {
        transform: "translate(0,-8)"
      }, /*#__PURE__*/React.createElement("path", {
        d: `M${KB_HEAD_L + 4} 42 L ${KB_HEAD_L + 4} 18 L ${KB_HEAD_MID - 14} 31 L ${KB_HEAD_MID} 10 L ${KB_HEAD_MID + 14} 31 L ${KB_HEAD_R - 4} 18 L ${KB_HEAD_R - 4} 42 Q ${KB_HEAD_MID} 52 ${KB_HEAD_L + 4} 42 Z`,
        fill: "var(--kb-coin)",
        stroke: "var(--kb-coin-ink)",
        strokeWidth: "2.4",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: KB_HEAD_MID - 16,
        cy: "38",
        r: "2.8",
        fill: "var(--kb-hp)"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: KB_HEAD_MID,
        cy: "41",
        r: "2.8",
        fill: "var(--kb-gem)"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: KB_HEAD_MID + 16,
        cy: "38",
        r: "2.8",
        fill: "var(--kb-good)"
      }));
      break;
    default:
      return null;
  }
  return /*#__PURE__*/React.createElement("span", {
    className: "kbb-acc",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "4 0 136 132",
    preserveAspectRatio: "none",
    width: "100%",
    height: "100%"
  }, art));
}

// Mini KIBO dentro de la losa de "Léeme"
function KiboMini() {
  return /*#__PURE__*/React.createElement("span", {
    className: "kbb-mini",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m-eyes"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m-eye"
  }), /*#__PURE__*/React.createElement("span", {
    className: "m-eye"
  })), /*#__PURE__*/React.createElement("svg", {
    className: "m-mouth",
    viewBox: "-11 -6 22 15"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M -6 -0.4 Q 0 5 6 -0.4"
  })));
}

// ─────────────────────────────────────────────────────────────
// KiboWheel — rueda radial estilo GTA-V. Arco hacia arriba-derecha
// porque KIBO vive abajo a la izquierda del lienzo.
// ─────────────────────────────────────────────────────────────
function KiboWheel({
  open,
  items,
  radius = 190,
  from = -128,
  to = -8,
  onPick
}) {
  const n = Math.max(1, items.length);
  const step = n > 1 ? (to - from) / (n - 1) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: `kbb-wheel ${open ? 'open' : ''}`
  }, items.map((it, i) => {
    const ang = (from + i * step) * Math.PI / 180;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      type: "button",
      className: "kbb-witem",
      style: {
        '--tx': `${Math.cos(ang) * radius}px`,
        '--ty': `${Math.sin(ang) * radius}px`,
        transitionDelay: open ? `${i * 0.035}s` : '0s'
      },
      title: it.desc || it.label,
      onClick: e => {
        e.stopPropagation();
        onPick(it);
      }
    }, /*#__PURE__*/React.createElement(KIcon, {
      name: it.icon,
      size: 18
    }), /*#__PURE__*/React.createElement("span", {
      className: "wl"
    }, it.label));
  }));
}

// ─────────────────────────────────────────────────────────────
// KiboFab — KIBO como acción rápida: rueda + travesuras + "Léeme".
// ─────────────────────────────────────────────────────────────
function KiboFab({
  items = [],
  onPick,
  size = 72
}) {
  const [open, setOpen] = React.useState(false);
  const [chat, setChat] = React.useState(false);
  // El ánimo NO es decorativo: sale de la vida del personaje.
  const vitals = typeof useVitals === 'function' ? useVitals() : {
    hp: 82,
    mood: 'feliz'
  };
  const [react, clearReact] = typeof useKiboReaction === 'function' ? useKiboReaction() : [null, () => {}];
  const [prop, setProp] = React.useState(null);
  // La pista solo se muestra al usuario nuevo: se apaga en cuanto toca a KIBO.
  const [hint, setHint] = React.useState(() => {
    try {
      return localStorage.getItem('kibo:fab-hint-seen') !== '1';
    } catch (_) {
      return false;
    }
  });
  function dismissHint() {
    if (!hint) return;
    setHint(false);
    try {
      localStorage.setItem('kibo:fab-hint-seen', '1');
    } catch (_) {}
  }
  // Si el usuario nuevo no lo toca, la pista se retira sola a los 6 s.
  React.useEffect(() => {
    if (!hint) return;
    const t = setTimeout(dismissHint, 6000);
    return () => clearTimeout(t);
  }, [hint]);
  // mood === null significa «el que dicta tu vida»; una reacción lo pisa un rato.
  const [mood, setMood] = React.useState(null);
  const [gesture, setGesture] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  // De dónde sale KIBO cuando se abre la rueda: la distancia de su esquina al
  // centro de la pantalla, medida al abrir (no supuesta), para que el viaje
  // termine exactamente en el cubo con cualquier ventana.
  const trigRef = React.useRef(null);
  const [origin, setOrigin] = React.useState(null);
  const HUB = 96;
  function openWheel() {
    const el = trigRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setOrigin({
        dx: Math.round(r.left + r.width / 2 - window.innerWidth / 2),
        dy: Math.round(r.top + r.height / 2 - window.innerHeight / 2),
        scale: +(size / HUB).toFixed(3)
      });
    }
    setOpen(true);
  }

  // Dos cosas distintas que compartían un solo aviso: el RECIBO de lo que
  // registraste (con deshacer) y el COMENTARIO de KIBO. El comentario llega
  // medio segundo después y borraba el recibo — de ahí que el registro
  // «desapareciera». Ahora el recibo manda: el comentario se le suma como
  // segunda línea en vez de reemplazarlo.
  const receipt = React.useRef(0);
  const [phase, setPhase] = React.useState(0);
  function flash(msg, undo, extra) {
    if (!msg) {
      setToast(null);
      return;
    }
    receipt.current = Date.now();
    const t = {
      msg,
      undo,
      ...(extra || {})
    };
    setToast(t);
    setPhase(1);
    clearTimeout(flash._t);
    const life = t.kind === 'logro' ? 6400 : undo ? 5600 : t.gain ? 3600 : 1800;
    flash._t = setTimeout(() => setToast(null), life);
  }
  function kiboSay(line) {
    if (Date.now() - receipt.current < 5600) {
      setToast(t => t ? {
        ...t,
        note: line
      } : {
        msg: line
      });
      return;
    }
    setToast({
      msg: line
    });
    clearTimeout(flash._t);
    flash._t = setTimeout(() => setToast(null), 1800);
  }
  function fire(g, m) {
    if (m) setMood(m);
    setGesture((g || 'random') + '#' + Date.now());
    setTimeout(() => setGesture(null), 80);
  }

  // Un logro no es un registro más: pide su propio aviso, con medalla y
  // destello. Cualquier módulo lo dispara sin conocer al FAB.
  React.useEffect(() => {
    const h = e => {
      const d = e && e.detail || {};
      if (!d.name) return;
      flash(d.name, null, {
        kind: 'logro',
        gain: d.gain || {
          xp: 100
        }
      });
      fire('clap', 'celebra');
    };
    window.addEventListener('kibo:logro', h);
    return () => window.removeEventListener('kibo:logro', h);
  }, []);

  // Cada acción del sistema: KIBO gesticula, saca su objeto y lo dice.
  React.useEffect(() => {
    if (!react) return;
    if (react.gesture) fire(react.gesture, react.mood || null);else if (react.mood) setMood(react.mood);
    setProp(react.prop || null);
    if (react.say) kiboSay(react.say);
    const t = setTimeout(() => {
      setProp(null);
      setMood(null);
      clearReact();
    }, 3200);
    return () => clearTimeout(t);
  }, [react && react.id]);
  React.useEffect(() => {
    if (!open) return;
    const close = e => {
      if (!e.target || !e.target.closest || !e.target.closest('.kbb-fab')) setOpen(false);
    };
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [open]);
  return /*#__PURE__*/React.createElement("div", {
    className: `kbb-fab ${open ? 'open' : ''}`,
    "data-comment-anchor": "fab-quick-action",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbb-fab-trigger",
    ref: trigRef
  }, /*#__PURE__*/React.createElement(KiboBlob, {
    size: size,
    mood: mood || vitals.mood,
    idle: !open && !chat,
    gesture: gesture,
    prop: prop,
    title: `KIBO · acción rápida · vida ${vitals.hp}`,
    onClick: () => {
      dismissHint();
      open ? setOpen(false) : openWheel();
    }
  }), hint && /*#__PURE__*/React.createElement("span", {
    className: "kbb-fab-hint"
  }, "Toca a KIBO")), typeof KiboQuickWheel === 'function' && /*#__PURE__*/React.createElement(KiboQuickWheel, {
    open: open,
    origin: origin,
    kiboSize: HUB,
    onClose: () => setOpen(false),
    onToast: flash,
    onDemand: () => {
      if (!open) openWheel();
    },
    onChat: () => setChat(true)
  }), chat && typeof KiboChat === 'function' && /*#__PURE__*/React.createElement(KiboChat, {
    onClose: () => setChat(false),
    onToast: flash
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: `kbb-toast show ${toast.kind === 'logro' ? 'logro' : ''} ${phase ? 'gain' : ''}`
  }, toast.kind === 'logro' && /*#__PURE__*/React.createElement("span", {
    className: "kbb-toast-badge",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "trophy",
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    className: "kbb-toast-text"
  }, toast.kind === 'logro' && /*#__PURE__*/React.createElement("b", {
    className: "kbb-toast-kicker"
  }, "Logro desbloqueado"), toast.msg, toast.gain && /*#__PURE__*/React.createElement("span", {
    className: "kbb-toast-gain"
  }, toast.gain.xp ? /*#__PURE__*/React.createElement("i", {
    style: {
      '--c': 'var(--kb-xp)'
    }
  }, "+", toast.gain.xp, " XP") : null, toast.gain.coins ? /*#__PURE__*/React.createElement("i", {
    style: {
      '--c': 'var(--kb-coin)'
    }
  }, "+", toast.gain.coins, " ", curLabel('coin')) : null, toast.gain.gems ? /*#__PURE__*/React.createElement("i", {
    style: {
      '--c': 'var(--kb-gem)'
    }
  }, "+", toast.gain.gems, " ", curLabel('dark')) : null, toast.gain.streak ? /*#__PURE__*/React.createElement("i", {
    style: {
      '--c': 'var(--kb-streak)'
    }
  }, "racha ", toast.gain.streak) : null), toast.note && /*#__PURE__*/React.createElement("em", null, toast.note)), toast.undo && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbb-undo",
    onClick: () => {
      toast.undo();
      flash('Deshecho');
    }
  }, "Deshacer")));
}

// ───────────────────────────────────────────────────
// KiboSpecimen — la ficha de UN cosmético. El catálogo mostraba el KIBO
// completo en cada tarjeta, así que veinte items se veían idénticos: lo que
// cambiaba (una peca, un halo, una cadencia) medía cuatro píxeles. Aquí cada
// parte se muestra AISLADA y en grande, con el lenguaje que le toca.
// ───────────────────────────────────────────────────
// Firma de movimiento de cada personalidad: el trazo ES su ritmo (plano y
// largo = sereno; zigzag apretado = juguetón), y una gota de gel lo recorre.
const PERS_SIGNATURE = {
  'pe-sereno': {
    d: 'M4 17 Q 26 12 48 17 Q 70 22 92 17',
    dur: 7
  },
  'pe-curioso': {
    d: 'M4 23 L 20 23 Q 28 5 36 23 L 56 23 Q 64 7 72 23 L 92 23',
    dur: 5
  },
  'pe-jugueton': {
    d: 'M4 27 L 13 8 L 22 27 L 31 8 L 40 27 L 49 8 L 58 27 L 67 8 L 76 27 L 85 10 L 92 22',
    dur: 2.4
  },
  'pe-teatral': {
    d: 'M4 29 C 18 -8 32 32 48 17 C 64 2 76 34 92 5',
    dur: 4
  },
  'pe-dormilon': {
    d: 'M4 7 Q 26 28 48 26 Q 70 24 92 30',
    dur: 9
  },
  'pe-coqueto': {
    d: 'M4 25 Q 16 9 28 24 Q 40 37 52 19 Q 64 3 76 21 Q 85 32 92 19',
    dur: 3.4
  }
};
function KiboSpecimen({
  part,
  item
}) {
  if (!item) return null;
  if (part === 'skin') {
    // La ficha monta las MISMAS capas vivas que el cuerpo: si la piel es una
    // galaxia, en el catálogo se ve la galaxia, no un degradado morado.
    const grad = item.base ? {
      backgroundImage: item.body
    } : null;
    return /*#__PURE__*/React.createElement("span", {
      className: `kbs kbs-skin ${item.animated ? 'anim' : ''}`,
      "data-skin": item.id,
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      className: "kbs-gel",
      style: {
        background: item.base || item.body,
        ...(grad || {})
      }
    }, item.animated && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "kbb-skinfx a"
    }), /*#__PURE__*/React.createElement("span", {
      className: "kbb-skinfx b"
    }), /*#__PURE__*/React.createElement("span", {
      className: "kbb-skinfx c"
    }))));
  }
  if (part === 'mark') {
    if (item.id === 'mk-none') return /*#__PURE__*/React.createElement("span", {
      className: "kbs kbs-mark none",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      className: "kbs-gel"
    }));
    return /*#__PURE__*/React.createElement("span", {
      className: "kbs kbs-mark",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      className: "kbs-gel"
    }), /*#__PURE__*/React.createElement(KiboTattoo, {
      id: item.id,
      specimen: true
    }));
  }
  if (part === 'aura') {
    if (item.id === 'au-none') return /*#__PURE__*/React.createElement("span", {
      className: "kbs kbs-aura none",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      className: "kbs-nada"
    }));
    return /*#__PURE__*/React.createElement("span", {
      className: "kbs kbs-aura",
      style: {
        '--aura': item.tint
      },
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      className: `kbb-aura ${item.id}`
    }, AURA_PARTICLES.includes(item.id) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "star s1"
    }), /*#__PURE__*/React.createElement("i", {
      className: "star s2"
    }), /*#__PURE__*/React.createElement("i", {
      className: "star s3"
    }))));
  }
  if (part === 'pers') {
    const sig = PERS_SIGNATURE[item.id] || PERS_SIGNATURE['pe-sereno'];
    const pid = 'sig-' + item.id;
    return /*#__PURE__*/React.createElement("span", {
      className: "kbs kbs-pers",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 96 34",
      preserveAspectRatio: "xMidYMid meet"
    }, /*#__PURE__*/React.createElement("path", {
      id: pid,
      d: sig.d,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: "0.32"
    }), /*#__PURE__*/React.createElement("circle", {
      r: "3.6",
      fill: "var(--kb-primary)"
    }, /*#__PURE__*/React.createElement("animateMotion", {
      dur: sig.dur + 's',
      repeatCount: "indefinite"
    }, /*#__PURE__*/React.createElement("mpath", {
      href: '#' + pid,
      xlinkHref: '#' + pid
    })))));
  }
  return null;
}

// KiboPet — el compañero de la carta de presentación. Es TU KIBO (lee el
// guardarropa como cualquier otro) repitiendo el gesto comprado; no recibe
// `mood` a propósito, porque el ánimo recolorea el gel y taparía la piel.
function KiboPet({
  gesture,
  size = 58,
  every = 5200
}) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!gesture) return;
    // Fase propia: sin ella, seis compañeros en una rejilla gesticulan al
    // unísono y el catálogo vuelve a verse como seis copias del mismo blob.
    let id;
    const start = setTimeout(() => {
      setTick(t => t + 1);
      id = setInterval(() => setTick(t => t + 1), every);
    }, Math.random() * every);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [gesture, every]);
  return /*#__PURE__*/React.createElement(KiboBlob, {
    size: size,
    ground: false,
    gesture: gesture ? gesture + '#' + tick : null
  });
}
Object.assign(window, {
  MARK_SLOTS,
  KiboBlob,
  KiboMini,
  KiboWheel,
  KiboFab,
  KiboAccessory,
  KiboToy,
  KiboTattoo,
  KiboSpecimen,
  KiboPet,
  KIBO_MOODS,
  KIBO_TRICK_LIST,
  KIBO_TOY_TRICKS,
  kiboTricksFor,
  kiboMood
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/kibo-blob.jsx", error: String((e && e.message) || e) }); }

// reference/app/kibo-quick.jsx
try { (() => {
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
  'qa-tareas:nueva': {
    kind: 'task',
    label: 'Nueva tarea'
  },
  'qa-habitos:nuevo': {
    kind: 'habit',
    label: 'Nuevo hábito'
  },
  'qa-diario:entrada': {
    kind: 'entry',
    label: 'Entrada de diario'
  },
  'qa-lectura:libro': {
    kind: 'book',
    label: 'Registrar libro'
  }
};
function qaModalFor(modId, actId) {
  return QA_MODAL[modId + ':' + actId];
}
const QA_FULL = {
  'qa-finanzas': {
    screen: 'finanzas',
    label: 'Abrir Finanzas'
  },
  'qa-habitos': {
    screen: 'habits',
    label: 'Abrir Hábitos'
  },
  'qa-tareas': {
    screen: 'tareas',
    label: 'Formulario completo',
    create: true
  },
  'qa-retos': {
    screen: 'retos',
    label: 'Abrir Retos'
  },
  'qa-lectura': {
    screen: 'lectura',
    label: 'Abrir Lectura'
  },
  'qa-diario': {
    screen: 'diario',
    label: 'Abrir Diario'
  },
  'qa-salud': {
    screen: 'salud',
    label: 'Abrir Salud'
  },
  'qa-estudio': {
    screen: 'estudio',
    label: 'Abrir Estudio'
  },
  'qa-entre': {
    screen: 'entretenimiento',
    label: 'Abrir Entretenimiento'
  },
  'qa-amigos': {
    screen: 'social',
    label: 'Abrir Amigos'
  },
  'qa-boveda': {
    screen: 'recursos',
    label: 'Abrir Bóveda'
  }
};
const KIBO_QA_MODULES = [{
  id: 'qa-finanzas',
  name: 'Finanzas',
  icon: 'wealth',
  color: 'var(--kb-coin)',
  owned: true,
  actions: [{
    id: 'gasto',
    name: 'Registrar gasto',
    icon: 'trending-down',
    form: 'money-out',
    log: 'money-out'
  }, {
    id: 'ingreso',
    name: 'Registrar ingreso',
    icon: 'trending-up',
    form: 'money-in',
    log: 'money-in'
  }, {
    id: 'abono',
    name: 'Abono a meta',
    icon: 'piggy',
    form: 'goal',
    log: 'money-out'
  }]
}, {
  id: 'qa-habitos',
  name: 'Hábitos',
  icon: 'flame',
  color: 'var(--kb-streak)',
  owned: true,
  actions: [{
    id: 'done',
    name: 'Marcar hábito',
    icon: 'check',
    form: 'habit',
    log: 'habit'
  }, {
    id: 'agua',
    name: 'Vaso de agua',
    icon: 'plus',
    form: 'instant',
    log: 'health',
    msg: 'Vaso de agua registrado 💧 +5 XP a Vigor'
  }, {
    id: 'nuevo',
    name: 'Nuevo hábito',
    icon: 'plus',
    log: 'habit'
  }]
}, {
  id: 'qa-diario',
  name: 'Diario',
  icon: 'edit',
  color: 'var(--area-community)',
  owned: true,
  actions: [{
    id: 'mood',
    name: 'Mi ánimo de hoy',
    icon: 'mood-great',
    form: 'mood',
    log: 'mood'
  }, {
    id: 'nota',
    name: 'Nota rápida',
    icon: 'edit',
    form: 'note',
    log: 'note'
  }, {
    id: 'entrada',
    name: 'Entrada completa',
    icon: 'calendar',
    log: 'note'
  }]
}, {
  id: 'qa-lectura',
  name: 'Lectura',
  icon: 'book-open',
  color: 'var(--kb-gem)',
  owned: true,
  actions: [{
    id: 'paginas',
    name: 'Registrar lectura',
    icon: 'book',
    form: 'read',
    log: 'read'
  }, {
    id: 'cita',
    name: 'Guardar una cita',
    icon: 'edit',
    form: 'quote',
    log: 'note'
  }, {
    id: 'libro',
    name: 'Registrar libro',
    icon: 'plus',
    log: 'read'
  }]
}, {
  id: 'qa-tareas',
  name: 'Tareas',
  icon: 'list',
  color: 'var(--kb-primary)',
  owned: true,
  actions: [{
    id: 'nueva',
    name: 'Nueva tarea',
    icon: 'plus',
    form: 'task',
    log: 'task'
  }, {
    id: 'hecha',
    name: 'Marcar hecha',
    icon: 'check',
    form: 'done',
    log: 'task'
  }]
}, {
  id: 'qa-retos',
  name: 'Retos',
  icon: 'sword',
  color: 'var(--kb-hp)',
  owned: true,
  actions: [{
    id: 'dia-ok',
    name: 'Día cumplido',
    icon: 'check',
    form: 'reto',
    log: 'reto'
  }, {
    id: 'reflex',
    name: 'Reflexión del día',
    icon: 'edit',
    form: 'note',
    log: 'note'
  }]
}, {
  id: 'qa-entre',
  name: 'Entretenimiento',
  icon: 'film',
  color: 'var(--kb-hp-ink)',
  cost: 40,
  actions: [{
    id: 'epi',
    name: 'Marcar episodio',
    icon: 'tv',
    form: 'episode',
    log: 'watch'
  }]
}, {
  id: 'qa-amigos',
  name: 'Amigos',
  icon: 'community',
  color: 'var(--area-community)',
  cost: 40,
  actions: [{
    id: 'empujon',
    name: 'Mandar empujón',
    icon: 'flame',
    form: 'friend',
    log: 'social'
  }, {
    id: 'aplauso',
    name: 'Aplaudir a alguien',
    icon: 'trophy',
    form: 'friend',
    log: 'social'
  }]
}, {
  id: 'qa-boveda',
  name: 'Bóveda',
  icon: 'book',
  color: 'var(--kb-gem-ink)',
  cost: 40,
  actions: [{
    id: 'nota-md',
    name: 'Nota a la Bóveda',
    icon: 'edit',
    form: 'note',
    log: 'note'
  }]
}, {
  id: 'qa-salud',
  name: 'Salud',
  icon: 'vigor',
  color: 'var(--area-vigor)',
  cost: 60,
  actions: [{
    id: 'peso',
    name: 'Registrar peso',
    icon: 'gauge',
    form: 'weight',
    log: 'health'
  }, {
    id: 'entreno',
    name: 'Entreno hecho',
    icon: 'check',
    form: 'instant',
    log: 'health',
    msg: 'Entreno registrado 💪 +40 XP a Vigor'
  }]
}, {
  id: 'qa-estudio',
  name: 'Estudio',
  icon: 'graduation',
  color: 'var(--area-wisdom)',
  cost: 60,
  actions: [{
    id: 'pomo',
    name: 'Pomodoro · 25 min',
    icon: 'clock',
    form: 'instant',
    log: 'study',
    msg: 'Foco de 25 min iniciado 🎯'
  }, {
    id: 'apunte',
    name: 'Apunte a la Bóveda',
    icon: 'book',
    form: 'note',
    log: 'note'
  }]
}];
const KIBO_QA_KEY = 'kibo:qa-enabled',
  KIBO_QA_OWNED_KEY = 'kibo:qa-owned';
function qaOwned() {
  const base = KIBO_QA_MODULES.filter(m => m.owned).map(m => m.id);
  try {
    return new Set(base.concat(JSON.parse(localStorage.getItem(KIBO_QA_OWNED_KEY) || '[]')));
  } catch (_) {
    return new Set(base);
  }
}
function qaOwn(id) {
  const s = [...qaOwned()].filter(x => !KIBO_QA_MODULES.find(m => m.id === x && m.owned));
  if (!s.includes(id)) s.push(id);
  try {
    localStorage.setItem(KIBO_QA_OWNED_KEY, JSON.stringify(s));
  } catch (_) {}
  // Comprar un rubro es comprarlo PARA USARLO: si solo se marcara como tuyo,
  // seguiría sin aparecer en la rueda y la compra se sentiría rota.
  const on = qaEnabled();
  if (!on.includes(id)) {
    try {
      localStorage.setItem(KIBO_QA_KEY, JSON.stringify([...on, id]));
    } catch (_) {}
  }
  try {
    window.dispatchEvent(new CustomEvent('kibo:qa-change'));
  } catch (_) {}
}

// El orden lo decide el usuario desde el «⋯» de KIBO; lo que no esté en la
// lista guardada va detrás, en el orden del catálogo.
const KIBO_QA_ORDER_KEY = 'kibo:qa-order';
function qaOrder() {
  try {
    const v = JSON.parse(localStorage.getItem(KIBO_QA_ORDER_KEY) || 'null');
    if (Array.isArray(v)) return v;
  } catch (_) {}
  return [];
}
function qaSetOrder(list) {
  try {
    localStorage.setItem(KIBO_QA_ORDER_KEY, JSON.stringify(list));
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent('kibo:qa-change'));
  } catch (_) {}
}
function qaSort(list) {
  const ord = qaOrder();
  return [...list].sort((a, b) => {
    const ia = ord.indexOf(a.id),
      ib = ord.indexOf(b.id);
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
  });
}
function qaEnabled() {
  try {
    const v = JSON.parse(localStorage.getItem(KIBO_QA_KEY) || 'null');
    if (Array.isArray(v)) return v;
  } catch (_) {}
  return KIBO_QA_MODULES.filter(m => m.owned).map(m => m.id);
}
function qaSetEnabled(list) {
  try {
    localStorage.setItem(KIBO_QA_KEY, JSON.stringify(list));
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent('kibo:qa-change'));
  } catch (_) {}
}

// ── El intérprete (reglas locales; se sustituye por el proveedor de IA) ──
function kiboParse(text) {
  const t = (text || '').toLowerCase();
  const num = re => {
    const m = t.match(re);
    return m ? parseFloat(m[1].replace(/,/g, '')) : null;
  };
  const out = [];
  const gasto = num(/(?:gast[eé]|compr[eé]|pagu[eé])[^\d$]*\$?\s*([\d,]+(?:\.\d+)?)/);
  if (gasto) out.push({
    kind: 'money-out',
    icon: 'wealth',
    color: 'var(--kb-coin)',
    label: `Gasto de $${gasto.toLocaleString('es-MX')}`,
    sub: /caf[eé]|comida|super|uber|cine/.test(t) ? 'Categoría: ' + (t.match(/caf[eé]|comida|super|uber|cine/) || [])[0] : 'Sin categoría'
  });
  const ingreso = num(/(?:me pagaron|ingres[oé]|cobr[eé]|deposit[oó]?)[^\d$]*\$?\s*([\d,]+(?:\.\d+)?)/);
  if (ingreso) out.push({
    kind: 'money-in',
    icon: 'trending-up',
    color: 'var(--kb-good)',
    label: `Ingreso de $${ingreso.toLocaleString('es-MX')}`,
    sub: 'A tu cuenta principal'
  });
  const pags = num(/le[ií][^\d]*(\d+)\s*p[aá]g/);
  if (pags) out.push({
    kind: 'read',
    icon: 'book-open',
    color: 'var(--kb-gem)',
    label: `${pags} páginas leídas`,
    sub: '+' + Math.round(pags * 1.5) + ' XP a Sabiduría'
  });
  if (/medit|ejercicio|entren|gym|corr[íi]|camin/.test(t)) out.push({
    kind: 'habit',
    icon: 'flame',
    color: 'var(--kb-streak)',
    label: 'Hábito completado',
    sub: 'Actividad física / mindfulness'
  });
  if (/agua|vaso/.test(t)) out.push({
    kind: 'health',
    icon: 'plus',
    color: 'var(--kb-primary)',
    label: 'Vaso de agua',
    sub: '+5 XP a Vigor'
  });
  if (/me siento|[aá]nimo/.test(t)) out.push({
    kind: 'mood',
    icon: 'mood-great',
    color: 'var(--area-community)',
    label: 'Ánimo de hoy',
    sub: 'Eliges el mood al confirmar'
  });
  if (/fall[eé]|no pude|se me olvid|romp[íi]/.test(t)) out.push({
    kind: 'fail',
    icon: 'alert',
    color: 'var(--kb-hp)',
    label: 'Fallo registrado',
    sub: 'Cuesta vida — pero reencauza'
  });
  return out;
}

// Etiqueta canónica de un registro: se rearma desde el valor, para que
// corregir el número corrija también lo que dice la tarjeta.
const KB_KINDS = {
  'money-out': {
    icon: 'wealth',
    color: 'var(--kb-coin)',
    unit: '$',
    lbl: v => `Gasto de $${(+v).toLocaleString('es-MX')}`
  },
  'money-in': {
    icon: 'trending-up',
    color: 'var(--kb-good)',
    unit: '$',
    lbl: v => `Ingreso de $${(+v).toLocaleString('es-MX')}`
  },
  read: {
    icon: 'book-open',
    color: 'var(--kb-gem)',
    unit: 'pág.',
    lbl: v => `${+v} páginas leídas`
  },
  study: {
    icon: 'graduation',
    color: 'var(--area-wisdom)',
    unit: 'min',
    lbl: v => `${+v} min de estudio`
  },
  habit: {
    icon: 'flame',
    color: 'var(--kb-streak)',
    unit: '',
    lbl: () => 'Hábito completado'
  },
  health: {
    icon: 'plus',
    color: 'var(--kb-primary)',
    unit: 'vasos',
    lbl: v => `${+v} vaso${+v === 1 ? '' : 's'} de agua`
  },
  mood: {
    icon: 'mood-great',
    color: 'var(--area-community)',
    unit: '',
    lbl: () => 'Ánimo de hoy'
  },
  fail: {
    icon: 'alert',
    color: 'var(--kb-hp)',
    unit: '',
    lbl: () => 'Fallo registrado'
  }
};
function kbProp(kind, value, sub) {
  const k = KB_KINDS[kind] || KB_KINDS.habit;
  return {
    kind,
    value: value == null ? null : +value,
    icon: k.icon,
    color: k.color,
    unit: k.unit,
    label: k.lbl(value),
    sub
  };
}

// kiboRead — lo que kiboParse no cubría: número suelto sin unidad, verbo sin
// cantidad, y el caso de que no haya nada. Devuelve o registros o UNA
// pregunta; nunca un silencio.
function kiboRead(text) {
  const t = (text || '').toLowerCase();
  const props = kiboParse(text).map(p => {
    const m = String(p.label).match(/([\d,.]+)/);
    const v = m ? parseFloat(m[1].replace(/,/g, '')) : null;
    return {
      ...p,
      value: v,
      unit: (KB_KINDS[p.kind] || {}).unit || ''
    };
  });
  if (props.length) return {
    props,
    ask: null
  };
  const verbo = /gast[eé]|compr[eé]|pagu[eé]/.test(t) ? 'money-out' : /me pagaron|ingres[oé]|cobr[eé]/.test(t) ? 'money-in' : /le[ií]/.test(t) ? 'read' : /estudi/.test(t) ? 'study' : null;
  const bare = (t.match(/\b(\d[\d,.]*)\b/) || [])[1];
  if (verbo && !bare) return {
    props: [],
    ask: {
      type: 'amount',
      kind: verbo
    }
  };
  if (bare && !verbo) return {
    props: [],
    ask: {
      type: 'unit',
      n: parseFloat(String(bare).replace(/,/g, ''))
    }
  };
  return {
    props: [],
    ask: {
      type: 'none'
    }
  };
}

// ── Formularios compactos (burbuja junto al anillo) ──────────────
function QaMoneyForm({
  kind,
  onDone
}) {
  const [amount, setAmount] = React.useState('');
  const [cat, setCat] = React.useState(kind === 'money-in' ? 'Nómina' : 'Comida');
  const [acct, setAcct] = React.useState('Débito');
  const CATS = kind === 'money-in' ? ['Nómina', 'Venta', 'Regalo'] : ['Comida', 'Transporte', 'Casa', 'Gustos'];
  return /*#__PURE__*/React.createElement("div", {
    className: "qa-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-amount-input"
  }, /*#__PURE__*/React.createElement("span", {
    className: "prefix"
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: amount,
    autoFocus: true,
    placeholder: "0.00",
    onChange: e => setAmount(e.target.value)
  }), /*#__PURE__*/React.createElement("span", {
    className: "suffix"
  }, "MXN")), /*#__PURE__*/React.createElement("div", {
    className: "qa-chiprow"
  }, CATS.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    type: "button",
    className: `qa-chip ${cat === c ? 'on' : ''}`,
    onClick: () => setCat(c)
  }, c))), /*#__PURE__*/React.createElement("div", {
    className: "qa-chiprow"
  }, ['Débito', 'Efectivo', 'Crédito'].map(a => /*#__PURE__*/React.createElement("button", {
    key: a,
    type: "button",
    className: `qa-chip ${acct === a ? 'on' : ''}`,
    onClick: () => setAcct(a)
  }, a))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-primary qa-save",
    disabled: !parseFloat(amount),
    onClick: () => onDone(`${kind === 'money-in' ? 'Ingreso' : 'Gasto'} de $${parseFloat(amount).toLocaleString('es-MX')} · ${cat} · ${acct} ✓`, {
      amount: parseFloat(amount),
      cat,
      account: acct,
      dir: kind === 'money-in' ? 'in' : 'out'
    })
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 14
  }), " Registrar"));
}
function QaHabitForm({
  onDone
}) {
  const HABITS = ['Meditar 10 min', 'Leer 20 min', 'Salir a correr', 'Sin azúcar'];
  const [h, setH] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    className: "qa-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qa-chiprow wrap"
  }, HABITS.map(x => /*#__PURE__*/React.createElement("button", {
    key: x,
    type: "button",
    className: `qa-chip ${h === x ? 'on' : ''}`,
    onClick: () => setH(x)
  }, x))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-primary qa-save",
    disabled: !h,
    onClick: () => onDone(`«${h}» marcado ✓ — racha protegida 🔥`, {
      habit: h
    })
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 14
  }), " Marcar hecho"));
}
// El ánimo no es solo una cara: guarda causa y nota, y mueve la vida (un día
// «Mal» cuesta, uno «Genial» repone) — así el registro tiene consecuencia.
const QA_MOODS = [{
  ic: 'mood-great',
  l: 'Genial',
  hp: 3,
  c: 'var(--kb-good)'
}, {
  ic: 'mood-good',
  l: 'Bien',
  hp: 1,
  c: 'var(--kb-primary)'
}, {
  ic: 'mood-meh',
  l: 'Normal',
  hp: 0,
  c: 'var(--kb-coin)'
}, {
  ic: 'mood-low',
  l: 'Bajo',
  hp: -2,
  c: 'var(--kb-streak)'
}, {
  ic: 'mood-sad',
  l: 'Mal',
  hp: -4,
  c: 'var(--kb-hp)'
}];
const QA_MOOD_CAUSES = ['Trabajo', 'Escuela', 'Salud', 'Gente', 'Dinero', 'Nada en particular'];
function QaMoodForm({
  onDone
}) {
  const [pick, setPick] = React.useState(null);
  const [cause, setCause] = React.useState(null);
  const [note, setNote] = React.useState('');
  const m = QA_MOODS.find(x => x.l === pick);
  return /*#__PURE__*/React.createElement("div", {
    className: "qa-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qa-moodrow"
  }, QA_MOODS.map(x => /*#__PURE__*/React.createElement("button", {
    key: x.ic,
    type: "button",
    className: `qa-mood ${pick === x.l ? 'on' : ''}`,
    style: {
      '--c': x.c
    },
    title: x.l,
    "aria-label": x.l,
    onClick: () => setPick(x.l)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: x.ic,
    size: 20
  })))), pick && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "qa-hintline"
  }, "\xBFQu\xE9 lo hizo as\xED?"), /*#__PURE__*/React.createElement("div", {
    className: "qa-chiprow wrap"
  }, QA_MOOD_CAUSES.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    type: "button",
    className: `qa-chip ${cause === c ? 'on' : ''}`,
    onClick: () => setCause(c)
  }, c))), /*#__PURE__*/React.createElement("textarea", {
    value: note,
    rows: 2,
    placeholder: "Una l\xEDnea para tu Diario (opcional)\u2026",
    onChange: e => setNote(e.target.value)
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-primary qa-save",
    disabled: !pick,
    onClick: () => onDone(`Ánimo «${pick}»${cause ? ' · ' + cause : ''} guardado en tu Diario ✓${m && m.hp ? m.hp > 0 ? ` +${m.hp} de vida` : ` ${m.hp} de vida` : ''}`, {
      hp: m ? m.hp : 0,
      note: note.trim(),
      cause
    })
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 14
  }), " Registrar el d\xEDa"));
}
function QaNoteForm({
  onDone
}) {
  const [v, setV] = React.useState('');
  return /*#__PURE__*/React.createElement("div", {
    className: "qa-form"
  }, /*#__PURE__*/React.createElement("textarea", {
    value: v,
    autoFocus: true,
    rows: 3,
    placeholder: "Escr\xEDbelo y su\xE9ltalo\u2026",
    onChange: e => setV(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-primary qa-save",
    disabled: !v.trim(),
    onClick: () => onDone(`Nota guardada ✓ +10 XP · ${v.trim().split(/\s+/).length} palabras`, {
      text: v.trim()
    })
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 14
  }), " Guardar"));
}
// Selector + contador: el registro dice de QUÉ es, no solo cuánto.
function QaPickCountForm({
  items,
  pickLabel,
  label,
  suffix,
  start,
  step,
  msg,
  onDone
}) {
  const [pick, setPick] = React.useState(items[0]);
  const [n, setN] = React.useState(start);
  return /*#__PURE__*/React.createElement("div", {
    className: "qa-form"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa-hintline"
  }, pickLabel), /*#__PURE__*/React.createElement("div", {
    className: "qa-chiprow wrap"
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it,
    type: "button",
    className: `qa-chip ${pick === it ? 'on' : ''}`,
    onClick: () => setPick(it)
  }, it))), typeof KbStepper === 'function' ? /*#__PURE__*/React.createElement(KbStepper, {
    label: label,
    value: n,
    onChange: setN,
    min: 1,
    max: 999,
    step: step,
    suffix: suffix
  }) : /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: n,
    onChange: e => setN(parseInt(e.target.value || '0', 10))
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-primary qa-save",
    disabled: !pick,
    onClick: () => onDone(msg(pick, n), {
      item: pick,
      value: n,
      unit: suffix
    })
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 14
  }), " Registrar"));
}

// Elegir uno de una lista y listo (tarea hecha, reto del día, empujón).
// Un ítem puede ser una cadena o {name, icon, color, meta, progress} — así la
// misma lista sirve para un empujón (solo nombre) y para un reto (ícono del
// rubro, color y en qué día va), sin dos componentes que mantener.
function qaItem(it) {
  return typeof it === 'string' ? {
    name: it
  } : it;
}
function QaPickForm({
  items,
  hint,
  cta,
  msg,
  onDone
}) {
  const [pick, setPick] = React.useState(null);
  const list = items.map(qaItem);
  const rich = list.some(x => x.icon || x.meta);
  return /*#__PURE__*/React.createElement("div", {
    className: "qa-form"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qa-hintline"
  }, hint), /*#__PURE__*/React.createElement("div", {
    className: rich ? 'qa-optlist' : 'qa-chiprow wrap'
  }, list.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.name,
    type: "button",
    className: rich ? `qa-opt ${pick === it.name ? 'on' : ''}` : `qa-chip ${pick === it.name ? 'on' : ''}`,
    style: it.color ? {
      '--c': it.color
    } : undefined,
    onClick: () => setPick(it.name)
  }, rich && /*#__PURE__*/React.createElement("span", {
    className: "qa-opt-ico"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: it.icon || 'target',
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    className: "qa-opt-txt"
  }, /*#__PURE__*/React.createElement("strong", null, it.name), it.meta && /*#__PURE__*/React.createElement("em", null, it.meta)), rich && typeof it.progress === 'number' && /*#__PURE__*/React.createElement("span", {
    className: "qa-opt-bar"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: Math.round(it.progress * 100) + '%'
    }
  })), rich && pick === it.name && /*#__PURE__*/React.createElement("span", {
    className: "qa-opt-check"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 13
  }))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-primary qa-save",
    disabled: !pick,
    onClick: () => onDone(msg(pick), {
      item: pick
    })
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 14
  }), " ", cta));
}
function QaStepperForm({
  label,
  suffix,
  start = 10,
  step = 5,
  msg,
  onDone
}) {
  const [n, setN] = React.useState(start);
  return /*#__PURE__*/React.createElement("div", {
    className: "qa-form"
  }, typeof KbStepper === 'function' ? /*#__PURE__*/React.createElement(KbStepper, {
    label: label,
    value: n,
    onChange: setN,
    min: 1,
    max: 999,
    step: step,
    suffix: suffix
  }) : /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: n,
    onChange: e => setN(parseInt(e.target.value || '0', 10))
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-primary qa-save",
    onClick: () => onDone(msg(n), {
      value: n,
      unit: suffix
    })
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 14
  }), " Registrar"));
}
// Las listas salen de los datos de verdad: una lista inventada aquí dentro se
// queda vieja en cuanto el usuario cambia algo en su pantalla.
function qaActiveRetos() {
  const src = (window.RETOS_DEMO || []).filter(r => r.status === 'active');
  if (!src.length) return ['Maratón de lectura', 'Sin azúcar 30 días', '5 km diarios'];
  return src.slice(0, 5).map(r => ({
    name: r.name,
    icon: r.icon || 'sword',
    color: r.color || 'var(--kb-boss)',
    meta: r.daysTotal ? `Día ${r.daysElapsed || 0} de ${r.daysTotal}` : null,
    progress: r.daysTotal ? Math.min(1, (r.daysElapsed || 0) / r.daysTotal) : null
  }));
}
function qaOpenTasks() {
  const PRIO = {
    urgent: 'Urgente',
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
    vlow: 'Muy baja'
  };
  const src = (window.DEMO_TASKS_FULL || []).filter(t => t.status !== 'done');
  if (!src.length) return ['Cerrar el reporte', 'Llamar al banco', 'Comprar despensa'];
  return src.slice(0, 5).map(t => ({
    name: t.title,
    icon: 'list',
    color: `var(--area-${t.area})`,
    meta: [PRIO[t.priority], t.project].filter(Boolean).join(' · ') || null
  }));
}
function QaForm({
  form,
  onDone
}) {
  switch (form) {
    case 'money-out':
      return /*#__PURE__*/React.createElement(QaMoneyForm, {
        kind: "money-out",
        onDone: onDone
      });
    case 'money-in':
      return /*#__PURE__*/React.createElement(QaMoneyForm, {
        kind: "money-in",
        onDone: onDone
      });
    case 'goal':
      return /*#__PURE__*/React.createElement(QaStepperForm, {
        label: "Abono",
        suffix: "MXN",
        start: 500,
        step: 100,
        msg: n => `Abono de $${n.toLocaleString('es-MX')} a tu meta ✓`,
        onDone: onDone
      });
    case 'habit':
      return /*#__PURE__*/React.createElement(QaHabitForm, {
        onDone: onDone
      });
    case 'mood':
      return /*#__PURE__*/React.createElement(QaMoodForm, {
        onDone: onDone
      });
    case 'note':
      return /*#__PURE__*/React.createElement(QaNoteForm, {
        onDone: onDone
      });
    case 'pages':
    case 'read':
      return /*#__PURE__*/React.createElement(QaPickCountForm, {
        items: ['Hábitos atómicos', 'Sapiens', 'El Quijote'],
        pickLabel: "\xBFQu\xE9 est\xE1s leyendo?",
        label: "P\xE1ginas",
        suffix: "p\xE1g.",
        start: 12,
        step: 4,
        msg: (b, n) => `${n} páginas de «${b}» ✓ +${Math.round(n * 1.5)} XP a Sabiduría`,
        onDone: onDone
      });
    case 'quote':
    case 'task':
      return /*#__PURE__*/React.createElement(QaNoteForm, {
        onDone: onDone
      });
    case 'done':
      return /*#__PURE__*/React.createElement(QaPickForm, {
        items: qaOpenTasks(),
        hint: "\xBFCu\xE1l terminaste?",
        cta: "Marcar hecha",
        msg: t => `«${t}» completada ✓ +25 XP`,
        onDone: onDone
      });
    case 'reto':
      return /*#__PURE__*/React.createElement(QaPickForm, {
        items: qaActiveRetos(),
        hint: "\xBFQu\xE9 reto cumpliste hoy?",
        cta: "Registrar d\xEDa",
        msg: r => `Día cumplido en «${r}» 🔥`,
        onDone: onDone
      });
    case 'episode':
      return /*#__PURE__*/React.createElement(QaPickCountForm, {
        items: ['Severance', 'The Bear', 'Arcane'],
        pickLabel: "\xBFQu\xE9 est\xE1s viendo?",
        label: "Episodios",
        suffix: "ep.",
        start: 1,
        step: 1,
        msg: (s, n) => `${n} episodio${n > 1 ? 's' : ''} de «${s}» ✓`,
        onDone: onDone
      });
    case 'friend':
      return /*#__PURE__*/React.createElement(QaPickForm, {
        items: ['Lucía', 'Diego', 'Sofía', 'Renata'],
        hint: "\xBFA qui\xE9n?",
        cta: "Enviar",
        msg: f => `Empujón enviado a ${f} 👊`,
        onDone: onDone
      });
    case 'weight':
      return /*#__PURE__*/React.createElement(QaStepperForm, {
        label: "Peso",
        suffix: "kg",
        start: 72,
        step: 1,
        msg: n => `Peso de ${n} kg registrado ✓`,
        onDone: onDone
      });
    default:
      return null;
  }
}

// ── 50 · Chat inmersivo ───────────────────────────────────────────
// Antes era una tarjeta flotando sobre un velo gris: KIBO diminuto en una
// esquina y la conversación encerrada en una caja. Ahora el chat ES el
// espacio — fondo profundo con luz que respira, KIBO grande al centro y los
// mensajes viviendo sueltos a su alrededor.
function KiboChat({
  onClose,
  onToast
}) {
  const {
    hp,
    tone,
    mood
  } = typeof useVitals === 'function' ? useVitals() : {
    hp: 80,
    tone: {
      label: ''
    },
    mood: 'calma'
  };
  const [msgs, setMsgs] = React.useState([{
    who: 'kibo',
    text: 'Cuéntame el día y yo lo registro. Puedes hablarme o escribirme — y si entiendo mal, me corriges.'
  }]);
  const [text, setText] = React.useState('');
  const [listening, setListening] = React.useState(false);
  const [edit, setEdit] = React.useState(null); // { mi, pi, value }
  const [gesture, setGesture] = React.useState(null);
  const recRef = React.useRef(null),
    endRef = React.useRef(null);
  const canVoice = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  // Un rAF de margen: las tarjetas de registro crecen DESPUÉS del primer
  // layout, así que fijar el scroll en el mismo tick lo dejaba a media altura.
  React.useEffect(() => {
    const el = endRef.current && endRef.current.parentNode;
    if (!el) return;
    const pin = () => {
      el.scrollTop = el.scrollHeight;
    };
    const id = requestAnimationFrame(pin);
    const t = setTimeout(pin, 140); // las tarjetas crecen tras el layout
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [msgs, edit]);
  React.useEffect(() => {
    const esc = ev => {
      if (ev.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);
  function react(g) {
    setGesture(g + '#' + Date.now());
    setTimeout(() => setGesture(null), 90);
  }
  function mic() {
    if (!canVoice) return;
    if (listening) {
      recRef.current && recRef.current.stop();
      return;
    }
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new R();
    recRef.current = rec;
    rec.lang = 'es-MX';
    rec.interimResults = true;
    rec.onresult = ev => setText([...ev.results].map(r => r[0].transcript).join(' '));
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  }
  function say(t) {
    const {
      props,
      ask
    } = kiboRead(t);
    const reply = props.length ? props.length > 1 ? `Pesqué ${props.length} cosas. Confírmalas o corrige el número.` : 'Esto entendí. Confirma o corrige el número.' : ask && ask.type === 'unit' ? `${ask.n}… ¿de qué? Dime y lo guardo.` : ask && ask.type === 'amount' ? '¿De cuánto?' : 'No pesqué nada registrable ahí. ¿Va alguno de estos?';
    react(props.length ? 'wave' : 'mueca');
    setMsgs(ms => [...ms, {
      who: 'yo',
      text: t
    }, {
      who: 'kibo',
      text: reply,
      props,
      ask
    }]);
  }
  function send() {
    const t = text.trim();
    if (!t) return;
    setText('');
    say(t);
  }
  function commit(p) {
    if (p.kind === 'fail' && typeof damageHP === 'function') damageHP(8, p.label);else if (typeof setHP === 'function' && typeof getHP === 'function' && ['habit', 'health', 'read', 'study'].includes(p.kind)) setHP(getHP() + 3);
    if (p.kind !== 'fail' && typeof kiboLog === 'function') kiboLog({
      kind: p.kind,
      label: p.label
    });
    onToast && onToast(`${p.label} · registrado ✓`);
  }
  function register(p, mi, pi) {
    commit(p);
    react('beso');
    setMsgs(ms => ms.map((m, i) => i !== mi ? m : {
      ...m,
      props: m.props.filter((_, j) => j !== pi)
    }).concat([{
      who: 'kibo',
      text: `Listo: ${p.label}. ${p.kind === 'fail' ? 'Perdiste 8 de vida — mañana lo reencauzas.' : 'Anotado.'}`
    }]));
  }
  function registerAll(props, mi) {
    props.forEach(commit);
    react('clap');
    setMsgs(ms => ms.map((m, i) => i !== mi ? m : {
      ...m,
      props: []
    }).concat([{
      who: 'kibo',
      text: `Registré las ${props.length}. Buen día, en serio.`
    }]));
  }
  function saveEdit() {
    if (!edit) return;
    const {
      mi,
      pi,
      value
    } = edit;
    setMsgs(ms => ms.map((m, i) => i !== mi ? m : {
      ...m,
      props: m.props.map((p, j) => j !== pi ? p : {
        ...p,
        value: +value,
        label: (KB_KINDS[p.kind] || KB_KINDS.habit).lbl(+value)
      })
    }));
    setEdit(null);
  }
  const UNIT_OPTS = [{
    kind: 'read',
    label: 'páginas leídas'
  }, {
    kind: 'study',
    label: 'minutos de estudio'
  }, {
    kind: 'money-out',
    label: 'pesos gastados'
  }, {
    kind: 'health',
    label: 'vasos de agua'
  }];
  const NADA_OPTS = ['Marqué un hábito', 'Leí un rato', 'Registré mi ánimo', 'Fallé en algo'];
  return /*#__PURE__*/React.createElement("div", {
    className: "kbb-chat-veil",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "kc-space",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("i", {
    className: "a"
  }), /*#__PURE__*/React.createElement("i", {
    className: "b"
  }), /*#__PURE__*/React.createElement("i", {
    className: "c"
  })), /*#__PURE__*/React.createElement("div", {
    className: "kbb-chat",
    onClick: ev => ev.stopPropagation(),
    role: "dialog",
    "aria-label": "Chat con KIBO"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kc-x",
    onClick: onClose,
    "aria-label": "Cerrar"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "x",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "kc-stage"
  }, typeof KiboBlob === 'function' && /*#__PURE__*/React.createElement(KiboBlob, {
    size: 168,
    ground: false,
    gesture: gesture,
    mood: mood,
    idle: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "kc-vitals"
  }, "Tu vida ", /*#__PURE__*/React.createElement("strong", null, hp), " \xB7 ", tone.label)), /*#__PURE__*/React.createElement("div", {
    className: "kc-log"
  }, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `kc-msg ${m.who}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "kc-bub"
  }, m.text), m.props && m.props.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "kc-props"
  }, m.props.map((p, j) => {
    const editing = edit && edit.mi === i && edit.pi === j;
    return /*#__PURE__*/React.createElement("div", {
      key: j,
      className: "kc-prop",
      style: {
        '--c': p.color
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "kp-ico"
    }, /*#__PURE__*/React.createElement(KIcon, {
      name: p.icon,
      size: 15
    })), editing ? /*#__PURE__*/React.createElement("span", {
      className: "kp-edit"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: edit.value,
      autoFocus: true,
      onChange: ev => setEdit({
        ...edit,
        value: ev.target.value
      }),
      onKeyDown: ev => {
        if (ev.key === 'Enter') saveEdit();
        if (ev.key === 'Escape') setEdit(null);
      }
    }), /*#__PURE__*/React.createElement("em", null, p.unit)) : /*#__PURE__*/React.createElement("span", {
      className: "kp-txt"
    }, /*#__PURE__*/React.createElement("strong", null, p.label), /*#__PURE__*/React.createElement("em", null, p.sub)), p.value != null && !editing && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "kp-fix",
      title: "Corregir el n\xFAmero",
      onClick: () => setEdit({
        mi: i,
        pi: j,
        value: p.value
      })
    }, /*#__PURE__*/React.createElement(KIcon, {
      name: "edit",
      size: 13
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "kp-ok",
      title: editing ? 'Guardar' : 'Registrar',
      onClick: () => editing ? saveEdit() : register(p, i, j)
    }, /*#__PURE__*/React.createElement(KIcon, {
      name: "check",
      size: 14
    })));
  }), m.props.length > 1 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kc-all",
    onClick: () => registerAll(m.props, i)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 13
  }), " Registrar las ", m.props.length)), m.ask && m.ask.type === 'unit' && /*#__PURE__*/React.createElement("div", {
    className: "kc-chips"
  }, UNIT_OPTS.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.kind,
    type: "button",
    onClick: () => {
      const p = kbProp(o.kind, m.ask.n, 'Lo dijiste tú, yo solo pregunté');
      setMsgs(ms => [...ms, {
        who: 'kibo',
        text: 'Va:',
        props: [p]
      }]);
    }
  }, m.ask.n, " ", o.label))), m.ask && m.ask.type === 'amount' && /*#__PURE__*/React.createElement("div", {
    className: "kc-chips"
  }, [50, 100, 250, 500].map(v => /*#__PURE__*/React.createElement("button", {
    key: v,
    type: "button",
    onClick: () => {
      const p = kbProp(m.ask.kind, v, 'Sin categoría');
      setMsgs(ms => [...ms, {
        who: 'kibo',
        text: 'Va:',
        props: [p]
      }]);
    }
  }, "$", v)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "otro",
    onClick: () => setText('')
  }, "Otro monto\u2026")), m.ask && m.ask.type === 'none' && /*#__PURE__*/React.createElement("div", {
    className: "kc-chips"
  }, NADA_OPTS.map(o => /*#__PURE__*/React.createElement("button", {
    key: o,
    type: "button",
    onClick: () => say(o)
  }, o))))), /*#__PURE__*/React.createElement("span", {
    ref: endRef
  })), /*#__PURE__*/React.createElement("footer", {
    className: "kc-bar"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `kc-mic ${listening ? 'live' : ''} ${canVoice ? '' : 'off'}`,
    onClick: mic,
    title: canVoice ? listening ? 'Detener' : 'Hablar' : 'Tu navegador no soporta dictado'
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "mic",
    size: 18
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: text,
    autoFocus: true,
    placeholder: listening ? 'Escuchando…' : 'Gasté $250 en el súper y leí 30 páginas',
    onChange: ev => setText(ev.target.value),
    onKeyDown: ev => {
      if (ev.key === 'Enter') send();
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kc-send",
    disabled: !text.trim(),
    onClick: send,
    "aria-label": "Enviar"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-right",
    size: 17
  })))));
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
const KBW_RIN = 104,
  KBW_ROUT = 210,
  KBW_GAP = 1.4,
  KBW_START = -90;

// Sector con las CUATRO esquinas redondeadas. Un sector recto deja cuatro
// puntas de aguja donde el arco corta el radio: a 1px de trazo se ven como
// bordes sucios, y es lo que hacía que la rueda no se viera terminada. El
// filete se resuelve en la geometría, no con `stroke-linejoin` (que solo
// suaviza la unión del trazo, no la silueta del relleno).
function kbwSector(a0, a1, ri, ro, k = 9) {
  const rad = d => d * Math.PI / 180;
  const p = (a, r) => [+(Math.cos(rad(a)) * r).toFixed(2), +(Math.sin(rad(a)) * r).toFixed(2)];
  // El filete no puede comerse más de la mitad del sector, ni del grosor.
  const kk = Math.max(0, Math.min(k, (ro - ri) / 2 - 1, rad(a1 - a0) * ri / 2 - 1));
  const dOut = kk / ro * 180 / Math.PI,
    dIn = kk / ri * 180 / Math.PI;
  const big = a1 - a0 - dOut * 2 > 180 ? 1 : 0;
  const A = p(a0 + dOut, ro),
    B = p(a1 - dOut, ro),
    C = p(a1, ro - kk);
  const D = p(a1, ri + kk),
    E = p(a1 - dIn, ri),
    F = p(a0 + dIn, ri),
    G = p(a0, ri + kk),
    H = p(a0, ro - kk);
  return [`M ${A[0]} ${A[1]}`, `A ${ro} ${ro} 0 ${big} 1 ${B[0]} ${B[1]}`, `A ${kk} ${kk} 0 0 1 ${C[0]} ${C[1]}`, `L ${D[0]} ${D[1]}`, `A ${kk} ${kk} 0 0 1 ${E[0]} ${E[1]}`, `A ${ri} ${ri} 0 ${big} 0 ${F[0]} ${F[1]}`, `A ${kk} ${kk} 0 0 1 ${G[0]} ${G[1]}`, `L ${H[0]} ${H[1]}`, `A ${kk} ${kk} 0 0 1 ${A[0]} ${A[1]}`, 'Z'].join(' ');
}
function KiboQuickWheel({
  open,
  onClose,
  onToast,
  onChat,
  onDemand,
  origin,
  kiboSize = 96
}) {
  const [level, setLevel] = React.useState(null); // null | {kind:'mod', mod} | {kind:'tricks'}
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
    const el = pullRef.current;
    if (!el) return;
    e.stopPropagation();
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2,
      cy = r.top + r.height / 2;
    el.classList.add('pulling');
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    const draw = ev => {
      const dx = ev.clientX - cx,
        dy = ev.clientY - cy;
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
      el.style.removeProperty('--bx');
      el.style.removeProperty('--by');
      el.style.setProperty('--bs', '0');
      el.style.setProperty('--bo', '0');
      el.style.removeProperty('--bsx');
      el.style.removeProperty('--bsy');
      // La clase del rebote se retira sola: dejarla puesta impide que la
      // siguiente soltada vuelva a disparar la animación.
      el.classList.remove('snap');
      void el.offsetWidth;
      el.classList.add('snap');
      clearTimeout(el._snap);
      el._snap = setTimeout(() => el.classList.remove('snap'), 760);
      // El clic que sigue al puntero no debe disparar una segunda travesura.
      justPulled.current = true;
      setTimeout(() => {
        justPulled.current = false;
      }, 350);
      fireHub();
    };
    window.addEventListener('pointermove', draw);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }
  const vitals = typeof useVitals === 'function' ? useVitals() : {
    mood: 'calma'
  };
  const [, force] = React.useReducer(x => x + 1, 0);
  const wrapRef = React.useRef(null);

  // Abrir la rueda la reinicia. Si la apertura viene de una PETICIÓN (el
  // buscador pidiendo una acción), el reinicio llegaba después del manejador y
  // se llevaba por delante el nivel y el formulario recién fijados. La petición
  // se guarda en un ref y es el propio reinicio quien la aplica.
  const pending = React.useRef(null);
  React.useEffect(() => {
    if (pending.current) {
      const {
        mod,
        action
      } = pending.current;
      pending.current = null;
      setLevel({
        kind: 'mod',
        mod
      });
      setForm({
        mod,
        action
      });
      setCustom(false);
      setActive(-1);
      return;
    }
    setLevel(null);
    setForm(null);
    setCustom(false);
    setActive(-1);
  }, [open]);
  // Al cambiar de nivel el disco es otro: conservar el sector apuntado dejaba
  // resaltado un índice que ya no significa lo mismo.
  React.useEffect(() => {
    setActive(-1);
    setPage(0);
  }, [level, form, custom]);
  React.useEffect(() => {
    const h = () => force();
    window.addEventListener('kibo:qa-change', h);
    return () => window.removeEventListener('kibo:qa-change', h);
  }, []);

  // El buscador puede pedir una acción por su nombre: se abre EL MISMO
  // formulario de la rueda, no una copia — un formulario duplicado es una
  // deuda que se paga en cada cambio.
  React.useEffect(() => {
    const h = ev => {
      const d = ev && ev.detail || {};
      const mod = (window.KIBO_QA_MODULES || []).find(m => m.id === d.modId);
      const act = mod && mod.actions.find(a => a.id === d.actionId);
      if (!mod || !act) return;
      const full = qaModalFor(mod.id, act.id);
      if (full) {
        openFullModal(mod, full.kind);
        return;
      }
      if (act.form === 'instant') {
        done(act.msg, act.log, {
          instant: act.id
        });
        return;
      }
      pending.current = {
        mod,
        action: act
      };
      setLevel({
        kind: 'mod',
        mod
      });
      setForm({
        mod,
        action: act
      });
      if (onDemand) onDemand();
    };
    window.addEventListener('kibo:qa-run', h);
    return () => window.removeEventListener('kibo:qa-run', h);
  }, [onDemand]);
  const owned = qaOwned(),
    enabled = qaEnabled();
  const mods = qaSort(KIBO_QA_MODULES.filter(m => owned.has(m.id) && enabled.includes(m.id)));
  function back() {
    if (form) setForm(null);else if (custom) setCustom(false);else if (level) setLevel(null);else onClose();
  }
  React.useEffect(() => {
    if (!open) return;
    const esc = e => {
      if (e.key === 'Escape') back();
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, form, custom, level, onClose]);

  // Se enseña una vez y se calla para siempre: una pista que vuelve cada día
  // deja de ser pista y pasa a ser ruido.
  const [showPullHint, setShowPullHint] = React.useState(() => {
    try {
      return !localStorage.getItem('kibo:taught-pull');
    } catch (_) {
      return false;
    }
  });
  React.useEffect(() => {
    if (!open || !showPullHint) return;
    const t = setTimeout(() => {
      setShowPullHint(false);
      try {
        localStorage.setItem('kibo:taught-pull', '1');
      } catch (_) {}
    }, 4200);
    return () => clearTimeout(t);
  }, [open, showPullHint]);
  function bumpUse(modId) {
    if (!modId) return;
    let u = {};
    try {
      u = JSON.parse(localStorage.getItem('kibo:qa-uses') || '{}');
    } catch (_) {}
    u[modId] = (u[modId] || 0) + 1;
    try {
      localStorage.setItem('kibo:qa-uses', JSON.stringify(u));
    } catch (_) {}
  }

  // Lo que paga cada tipo de registro. Vivía implícito («+5 XP a Vigor» dentro
  // del texto de una acción), así que la mayoría no decía nada de lo ganado.
  const QA_GAIN = {
    'money-out': {
      xp: 10
    },
    'money-in': {
      xp: 15,
      coins: 8
    },
    habit: {
      xp: 25,
      coins: 10,
      streak: '+1'
    },
    reto: {
      xp: 40,
      coins: 15
    },
    task: {
      xp: 30,
      coins: 12
    },
    read: {
      xp: 20,
      coins: 6
    },
    study: {
      xp: 25,
      coins: 8
    },
    health: {
      xp: 20,
      coins: 6
    },
    note: {
      xp: 8
    },
    mood: {
      xp: 5
    },
    watch: {
      xp: 8
    },
    social: {
      xp: 12,
      coins: 4
    }
  };
  function done(msg, log, detail) {
    const delta = detail && typeof detail.hp === 'number' ? detail.hp : ['habit', 'health', 'read', 'study'].includes(log) ? 2 : 0;
    if (delta && typeof setHP === 'function' && typeof getHP === 'function') setHP(getHP() + delta);
    if (log && typeof kiboLog === 'function') kiboLog({
      kind: log,
      label: msg,
      detail: detail || null
    });
    // Deshacer: devuelve la vida y anota la reversión, para que quien escuche
    // el registro (widgets, historial) pueda quitarlo.
    const undo = () => {
      if (delta && typeof setHP === 'function' && typeof getHP === 'function') setHP(getHP() - delta);
      if (log && typeof kiboLog === 'function') kiboLog({
        kind: 'undo',
        of: log,
        label: msg
      });
    };
    onToast(msg, undo, {
      gain: QA_GAIN[log] || {
        xp: 10
      }
    });
    onClose();
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
  const modOrder = React.useCallback(list => {
    const pend = {};
    try {
      pend['qa-habitos'] = (window.HABITS_DEMO || []).filter(h => !h.done).length;
      pend['qa-retos'] = (window.RETOS_DEMO || []).filter(r => r.status === 'active').length;
      pend['qa-tareas'] = (window.DEMO_TASKS_FULL || []).filter(t => t.status !== 'done').length;
    } catch (_) {}
    let used = {};
    try {
      used = JSON.parse(localStorage.getItem('kibo:qa-uses') || '{}');
    } catch (_) {}
    return list.slice().sort((a, b) => (pend[b.id] ? 1 : 0) - (pend[a.id] ? 1 : 0) || (used[b.id] || 0) - (used[a.id] || 0) || (pend[b.id] || 0) - (pend[a.id] || 0));
  }, []);

  // Abre el formulario COMPLETO encima de la pantalla actual. No navega: el
  // usuario pidió registrar algo, no cambiar de sitio.
  function openFullModal(m, kind) {
    bumpUse(m.id);
    onClose();
    try {
      window.dispatchEvent(new CustomEvent('kibo:open-modal', {
        detail: {
          kind
        }
      }));
    } catch (_) {}
  }
  function pickAction(m, a) {
    const full = qaModalFor(m.id, a.id);
    if (full) return openFullModal(m, full.kind);
    if (a.form === 'instant') return done(a.msg, a.log, {
      instant: a.id
    });
    setForm({
      mod: m,
      action: a
    });
  }
  const wheel = React.useMemo(() => {
    if (level && level.kind === 'mod') {
      return {
        pages: 1,
        fixed: 0,
        items: level.mod.actions.map(a => ({
          id: a.id,
          name: a.name,
          icon: a.icon,
          color: level.mod.color,
          run: () => pickAction(level.mod, a)
        }))
      };
    }
    if (level && level.kind === 'tricks') {
      const toy = typeof getKiboStyle === 'function' ? getKiboStyle().toy : null;
      const all = (typeof kiboTricksFor === 'function' ? kiboTricksFor(toy) : window.KIBO_TRICK_LIST || []).map(t => ({
        id: t.id,
        name: t.name,
        desc: t.desc,
        icon: t.icon,
        color: 'var(--kb-streak)',
        run: () => fireHub(t.id)
      }));
      // Reparto BALANCEADO: con 15 travesuras y tope de 11, cortar «11 y 4»
      // dejaba una segunda hoja con cuatro sectores gigantes. Se calcula el
      // número de hojas y luego se reparte parejo (8 y 7).
      const pages = Math.max(1, Math.ceil(all.length / 11));
      const PER = Math.ceil(all.length / pages);
      const pg = Math.min(page, pages - 1);
      return {
        pages,
        fixed: 1,
        items: [{
          id: '__rand',
          name: 'Sorpréndeme',
          desc: 'Que escoja él',
          icon: 'sparkle',
          color: 'var(--kb-primary)',
          hero: true,
          run: () => fireHub()
        }, ...all.slice(pg * PER, pg * PER + PER)]
      };
    }
    const ordered = modOrder(mods);
    const pages = Math.max(1, Math.ceil(ordered.length / 8));
    const PER = Math.ceil(mods.length / pages);
    const pg = Math.min(page, pages - 1);
    return {
      pages,
      fixed: 2,
      items: [{
        id: '__chat',
        name: 'Platicar con KIBO',
        desc: 'Cuéntale el día y él lo registra',
        icon: 'mic',
        color: 'var(--kb-primary)',
        hero: true,
        wide: true,
        run: () => {
          onClose();
          onChat();
        }
      }, {
        id: '__find',
        name: 'Buscar',
        desc: 'Cualquier cosa, en toda la plataforma',
        icon: 'search',
        color: 'var(--kb-gem)',
        run: () => {
          onClose();
          try {
            window.dispatchEvent(new CustomEvent('kibo:search'));
          } catch (_) {}
        }
      }, ...mods.slice(pg * PER, pg * PER + PER).map(m => ({
        id: m.id,
        name: m.name,
        icon: m.icon,
        color: m.color,
        run: () => setLevel({
          kind: 'mod',
          mod: m
        })
      })), {
        id: '__trick',
        name: 'Travesura',
        desc: 'Que haga una de las suyas',
        icon: 'flame',
        color: 'var(--kb-streak)',
        run: () => setLevel({
          kind: 'tricks'
        })
      }]
    };
  }, [level, page, mods.length, enabled.join(','), owned.size]);
  const items = wheel.items;
  const pages = wheel.pages;
  const pg = Math.min(page, pages - 1);
  const n = Math.max(1, items.length);
  // Los sectores dejan de ser todos iguales: cada uno declara su peso y la
  // acción estelar ocupa el doble. El origen se corre media porción para que
  // ese sector quede CENTRADO arriba, no empezando arriba.
  const weights = items.map(it => it.wide ? 2 : 1);
  const totalW = weights.reduce((a, b) => a + b, 0);
  const unit = 360 / totalW;
  const spans = [];
  let acc = 0;
  const arcOrigin = KBW_START - weights[0] * unit / 2;
  for (const w of weights) {
    spans.push([arcOrigin + acc * unit, arcOrigin + (acc + w) * unit]);
    acc += w;
  }
  const step = unit;
  // El rótulo no puede ser más ancho que su sector: con 15 travesuras la
  // cuerda a media banda cae a 65px y los nombres se encimaban. Cuando ni
  // así caben (más de 12 sectores) el disco se queda en íconos y el nombre
  // completo lo dice el letrero de abajo — como en la rueda de GTA.
  const labW = i => Math.max(44, Math.min(104, Math.round(2 * Math.PI * ((KBW_RIN + KBW_ROUT) / 2) * ((spans[i][1] - spans[i][0]) / 360)) - 8));
  const labelsOff = n > 12;
  const mid = i => (spans[i][0] + spans[i][1]) / 2;
  const at = (deg, r) => ({
    x: Math.cos(deg * Math.PI / 180) * r,
    y: Math.sin(deg * Math.PI / 180) * r
  });

  // Apuntar = dirección del cursor. Dentro del cubo no hay sector: esa zona
  // muerta es la que deja «no escoger nada» al alcance.
  function sectorAt(e) {
    const el = wrapRef.current;
    if (!el) return -1;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2),
      dy = e.clientY - (r.top + r.height / 2);
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
  function move(e) {
    setActive(sectorAt(e));
  }
  const panel = form || custom;
  const cur = active >= 0 ? items[active] : null;
  const title = cur ? cur.name : level && level.kind === 'mod' ? level.mod.name : level && level.kind === 'tricks' ? 'Travesuras' : 'Acción rápida';
  const sub = cur ? cur.desc || '' : level ? 'Escoge, o vuelve con ←' : 'Apunta con el cursor · jala a KIBO';
  return /*#__PURE__*/React.createElement("div", {
    className: `kbw ${open ? 'open' : ''}`,
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbw-stage",
    onClick: e => e.stopPropagation()
  }, !panel && /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    className: "kbw-wrap",
    role: "menu",
    tabIndex: 0,
    "aria-label": title,
    "aria-activedescendant": active >= 0 ? `kbw-i${active}` : undefined,
    onPointerMove: move,
    onPointerLeave: () => setActive(-1),
    onPointerDown: e => {
      if (e.pointerType !== 'mouse') setActive(sectorAt(e));
    },
    onClick: choose,
    onKeyDown: e => {
      const d = {
        ArrowRight: 1,
        ArrowDown: 1,
        ArrowLeft: -1,
        ArrowUp: -1
      }[e.key];
      if (d) {
        e.preventDefault();
        setActive(a => (((a < 0 ? d > 0 ? -1 : 0 : a) + d) % n + n) % n);
        return;
      }
      if (pages > 1 && (e.key === 'PageDown' || e.key === 'Tab' && !e.shiftKey && false)) {
        e.preventDefault();
        setPage(p => (p + 1) % pages);
        return;
      }
      if (pages > 1 && e.key === 'PageUp') {
        e.preventDefault();
        setPage(p => (p - 1 + pages) % pages);
        return;
      }
      if ((e.key === 'Enter' || e.key === ' ') && active >= 0) {
        e.preventDefault();
        items[active].run();
      }
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "kbw-disc",
    viewBox: `${-KBW_ROUT} ${-KBW_ROUT} ${KBW_ROUT * 2} ${KBW_ROUT * 2}`,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    className: "hubplate",
    r: KBW_RIN - 4
  }), items.map((it, i) => /*#__PURE__*/React.createElement("path", {
    key: it.id,
    className: `sec ${active === i ? 'on' : ''} ${it.hero ? 'hero' : ''}`,
    style: {
      '--c': it.color,
      '--i': i
    },
    d: kbwSector(spans[i][0] + KBW_GAP, spans[i][1] - KBW_GAP, KBW_RIN, KBW_ROUT)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kbw-labels"
  }, items.map((it, i) => {
    const p = at(mid(i), (KBW_RIN + KBW_ROUT) / 2);
    return /*#__PURE__*/React.createElement("span", {
      key: it.id,
      id: `kbw-i${i}`,
      role: "menuitem",
      "aria-label": it.name,
      className: `kbw-lab ${active === i ? 'on' : ''} ${labelsOff ? 'ico' : ''}`,
      style: {
        '--x': `${p.x}px`,
        '--y': `${p.y}px`,
        '--c': it.color,
        '--i': i,
        '--w': `${labW(i)}px`
      }
    }, /*#__PURE__*/React.createElement(KIcon, {
      name: it.icon,
      size: it.hero ? 24 : 21
    }), /*#__PURE__*/React.createElement("b", null, it.name));
  }))), open && !panel && showPullHint && /*#__PURE__*/React.createElement("span", {
    className: "kbw-teach",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("b", null, "J\xE1lalo")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: open ? 'hub-in' : 'hub-out',
    className: `kbw-hub ${panel ? 'aside' : ''}`,
    style: origin ? {
      '--ox': `${origin.dx}px`,
      '--oy': `${origin.dy}px`,
      '--os': origin.scale
    } : undefined,
    onPointerDown: pullStart,
    onClick: e => {
      // Enter/Espacio también: un botón enfocable que anuncia una
      // acción tiene que poder ejecutarla sin ratón.
      e.stopPropagation();
      if (justPulled.current) return;
      fireHub();
    },
    title: "J\xE1lalo y su\xE9ltalo",
    "aria-label": "KIBO: j\xE1lalo y su\xE9ltalo para una travesura"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbw-pull",
    ref: pullRef
  }, typeof KiboBlob === 'function' && /*#__PURE__*/React.createElement(KiboBlob, {
    size: kiboSize,
    ground: false,
    gesture: hubGesture,
    mood: vitals.mood
  }))), !panel && /*#__PURE__*/React.createElement("div", {
    className: "kbw-hubbar"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbw-hb",
    title: level ? 'Volver' : 'Cerrar',
    "aria-label": level ? 'Volver' : 'Cerrar',
    onClick: e => {
      e.stopPropagation();
      back();
    }
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: level ? 'arrow-right' : 'x',
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbw-hb more",
    title: "Editar la rueda",
    "aria-label": "Editar la rueda",
    onClick: e => {
      e.stopPropagation();
      setCustom(true);
    }
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "grip",
    size: 14
  }))), !panel && /*#__PURE__*/React.createElement("div", {
    className: "kbw-foot"
  }, pages > 1 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbw-pg",
    title: "P\xE1gina anterior",
    "aria-label": "P\xE1gina anterior",
    onClick: e => {
      e.stopPropagation();
      setPage(p => (p - 1 + pages) % pages);
    }
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-right",
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    className: "kbw-cap",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("strong", null, title), sub && /*#__PURE__*/React.createElement("span", null, sub), pages > 1 && /*#__PURE__*/React.createElement("span", {
    className: "kbw-dots",
    "aria-hidden": "true"
  }, [...Array(pages)].map((_, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    className: i === pg ? 'on' : ''
  })))), pages > 1 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbw-pg next",
    title: "M\xE1s",
    "aria-label": "P\xE1gina siguiente",
    onClick: e => {
      e.stopPropagation();
      setPage(p => (p + 1) % pages);
    }
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-right",
    size: 14
  }))), open && form && /*#__PURE__*/React.createElement("div", {
    className: "kbb-rform",
    style: {
      '--c': form.mod.color
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "rf-head"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rf-back",
    title: "Volver",
    onClick: () => setForm(null)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-right",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    className: "rf-title"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: form.action.icon,
    size: 13
  }), " ", form.action.name), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rf-x",
    title: "Cerrar",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "x",
    size: 12
  }))), /*#__PURE__*/React.createElement(QaForm, {
    form: form.action.form,
    onDone: (m, detail) => {
      bumpUse(form.mod.id);
      done(m, form.action.log, detail);
    }
  }), QA_FULL[form.mod.id] && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rf-more",
    onClick: () => {
      const f = QA_FULL[form.mod.id];
      onClose();
      try {
        window.dispatchEvent(new CustomEvent('kibo:navigate', {
          detail: {
            screen: f.screen,
            create: !!f.create
          }
        }));
      } catch (_) {}
    }
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "layers",
    size: 14
  }), " Formulario completo")), open && custom && /*#__PURE__*/React.createElement("div", {
    className: "kbb-rform wide"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rf-head"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rf-back",
    title: "Volver",
    onClick: () => setCustom(false)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-right",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    className: "rf-title"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "grip",
    size: 13
  }), " Tu rueda"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rf-x",
    title: "Cerrar",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "x",
    size: 12
  }))), /*#__PURE__*/React.createElement("div", {
    className: "qa-custom"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, "Arrastra con las flechas para ordenar. El orden es el que ver\xE1s en el disco."), (() => {
    // Puestos primero (en TU orden), después los que tienes guardados
    // y al final los que aún no son tuyos, con su precio.
    const mine = qaSort(KIBO_QA_MODULES.filter(m => owned.has(m.id)));
    const on = mine.filter(m => enabled.includes(m.id));
    const off = mine.filter(m => !enabled.includes(m.id));
    const locked = KIBO_QA_MODULES.filter(m => !owned.has(m.id));
    const move = (id, dir) => {
      const ids = on.map(m => m.id);
      const i = ids.indexOf(id),
        j = i + dir;
      if (i < 0 || j < 0 || j >= ids.length) return;
      ids.splice(j, 0, ids.splice(i, 1)[0]);
      qaSetOrder(ids.concat(off.map(m => m.id)));
      force();
    };
    const toggle = m => {
      qaSetEnabled(enabled.includes(m.id) ? enabled.filter(x => x !== m.id) : [...enabled, m.id]);
      force();
    };
    const row = (m, i, list, movable) => /*#__PURE__*/React.createElement("div", {
      key: m.id,
      className: "qa-cust-row",
      style: {
        '--c': m.color
      }
    }, movable ? /*#__PURE__*/React.createElement("span", {
      className: "qc-move"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: i === 0,
      title: "Subir",
      "aria-label": `Subir ${m.name}`,
      onClick: () => move(m.id, -1)
    }, /*#__PURE__*/React.createElement(KIcon, {
      name: "arrow-right",
      size: 11
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: i === list.length - 1,
      title: "Bajar",
      "aria-label": `Bajar ${m.name}`,
      onClick: () => move(m.id, 1)
    }, /*#__PURE__*/React.createElement(KIcon, {
      name: "arrow-right",
      size: 11
    }))) : /*#__PURE__*/React.createElement("span", {
      className: "qc-move ghost",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("span", {
      className: "qc-ico"
    }, /*#__PURE__*/React.createElement(KIcon, {
      name: m.icon,
      size: 14
    })), /*#__PURE__*/React.createElement("span", {
      className: "qc-name"
    }, m.name), typeof KbToggle === 'function' ? /*#__PURE__*/React.createElement(KbToggle, {
      on: enabled.includes(m.id),
      onChange: () => toggle(m)
    }) : /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "fr-btn",
      onClick: () => toggle(m)
    }, enabled.includes(m.id) ? 'Quitar' : 'Poner'));
    return /*#__PURE__*/React.createElement(React.Fragment, null, on.map((m, i) => row(m, i, on, true)), off.length > 0 && /*#__PURE__*/React.createElement("span", {
      className: "qa-cust-sep"
    }, "Guardados"), off.map((m, i) => row(m, i, off, false)), locked.length > 0 && /*#__PURE__*/React.createElement("span", {
      className: "qa-cust-sep"
    }, "Se compran en la Tienda"), locked.map(m => /*#__PURE__*/React.createElement("div", {
      key: m.id,
      className: "qa-cust-row locked",
      style: {
        '--c': m.color
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "qc-move ghost",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("span", {
      className: "qc-ico"
    }, /*#__PURE__*/React.createElement(KIcon, {
      name: m.icon,
      size: 14
    })), /*#__PURE__*/React.createElement("span", {
      className: "qc-name"
    }, m.name), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "qc-lock",
      title: "Ir a la Tienda",
      onClick: () => {
        onClose();
        window.dispatchEvent(new CustomEvent('kibo:navigate', {
          detail: {
            screen: 'store',
            tab: 'unlocks'
          }
        }));
      }
    }, /*#__PURE__*/React.createElement(GemIcon, {
      size: 11
    }), " ", m.cost))));
  })()))));
}
Object.assign(window, {
  KIBO_QA_MODULES,
  qaOwned,
  qaOwn,
  qaEnabled,
  qaSetEnabled,
  qaOrder,
  qaSetOrder,
  qaSort,
  kiboParse,
  KiboQuickWheel,
  KiboChat,
  QaForm
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/kibo-quick.jsx", error: String((e && e.message) || e) }); }

// reference/app/kibo-style.jsx
try { (() => {
// kibo-style.jsx — el guardarropa de KIBO. Estado compartido de cosméticos
// (piel, accesorio, aura, personalidad) en localStorage + evento
// 'kibo:kibo-change'. Lo leen KiboBlob (sidebar, FAB, tienda) y la Tienda.
// Mismo patrón que vitrina.jsx / prestige-system.jsx.

const KIBO_STYLE_KEYS = {
  skin: 'kibo:kb-skin',
  mark: 'kibo:kb-mark',
  acc: 'kibo:kb-acc',
  aura: 'kibo:kb-aura',
  pers: 'kibo:kb-pers',
  toy: 'kibo:kb-toy',
  owned: 'kibo:kb-owned'
};

// ── Catálogo ─────────────────────────────────────────────────────
// PIELES — recoloran el gel del blob (el ánimo sigue pintando la cara/boca).
const KIBO_SKINS = [{
  id: 'sk-teal',
  name: 'Teal clásico',
  cost: 0,
  currency: 'coin',
  body: 'var(--kb-primary)',
  desc: 'El KIBO de siempre — progreso sereno.'
}, {
  id: 'sk-rosa',
  name: 'Fresa',
  cost: 300,
  currency: 'coin',
  body: '#FF9FB1',
  desc: 'Dulce y de buen humor.'
}, {
  id: 'sk-cielo',
  name: 'Cielo',
  cost: 300,
  currency: 'coin',
  body: '#5BA7E0',
  desc: 'Frío, tranquilo, enfocado.'
}, {
  id: 'sk-lima',
  name: 'Lima',
  cost: 300,
  currency: 'coin',
  body: '#7CD17C',
  desc: 'Primaveral — energía fresca.'
}, {
  id: 'sk-sol',
  name: 'Sol',
  cost: 450,
  currency: 'coin',
  body: '#F4C24D',
  desc: 'Radiante. Cuidado: contagia.'
}, {
  id: 'sk-lavanda',
  name: 'Lavanda',
  cost: 600,
  currency: 'coin',
  body: '#B891E8',
  desc: 'Suave, casi premium.'
}, {
  id: 'sk-sombra',
  name: 'Sombra',
  cost: 30,
  currency: 'gem',
  body: '#3A3A52',
  desc: 'KIBO nocturno. Ojos que brillan más.'
},
// Las degradadas llevan base sólida: --skin (manos, losa, tinte) usa la base
// y el degradado se pinta directo en el cuerpo.
{
  id: 'sk-galaxia',
  name: 'Galaxia',
  cost: 60,
  currency: 'gem',
  base: '#2A2263',
  body: 'radial-gradient(120% 120% at 30% 20%, #2A2166 0%, #171040 54%, #0B0722 100%)',
  animated: true,
  desc: 'Un cielo adentro: estrellas blancas, rojas, amarillas y azules titilando en el gel.'
}, {
  id: 'sk-lava',
  name: 'Lava',
  cost: 60,
  currency: 'gem',
  base: '#B33A16',
  body: 'radial-gradient(120% 120% at 40% 25%, #FF9A3C 0%, #E0451A 42%, #7A1608 78%, #2A0A04 100%)',
  animated: true,
  desc: 'Grietas encendidas y pedazos de roca que se deshacen y se hunden.'
}, {
  id: 'sk-cristal',
  name: 'Cristal',
  cost: 90,
  currency: 'gem',
  base: '#8FB2F7',
  body: 'linear-gradient(150deg, #E8F6FF 0%, #A6C6FF 50%, #6E8CF2 100%)',
  animated: true,
  desc: 'Facetas y un destello que recorre el gel.'
}];

// ACCESORIOS — se dibujan SOBRE el blob (SVG), viajan con cada travesura.
const KIBO_ACCS = [{
  id: 'ac-none',
  name: 'Nada',
  cost: 0,
  currency: 'coin',
  desc: 'KIBO al natural.'
}, {
  id: 'ac-lentes',
  name: 'Lentes nerd',
  cost: 200,
  currency: 'coin',
  desc: 'Redondos. +10 de enfoque imaginario.'
}, {
  id: 'ac-mono',
  name: 'Moño',
  cost: 250,
  currency: 'coin',
  desc: 'Un moño coqueto en la cabeza.'
}, {
  id: 'ac-gorra',
  name: 'Gorra',
  cost: 350,
  currency: 'coin',
  desc: 'Visera al frente, actitud al cien.'
}, {
  id: 'ac-mago',
  name: 'Gorro de mago',
  cost: 500,
  currency: 'coin',
  desc: 'Violeta con estrellas — sabiduría +1.'
}, {
  id: 'ac-corona',
  name: 'Corona',
  cost: 100,
  currency: 'gem',
  desc: 'Dorada. Para el rey de la racha.'
}];

// AURAS — halo/partículas detrás del cuerpo (grandes: rebasan la silueta).
const KIBO_AURAS = [{
  id: 'au-none',
  name: 'Sin aura',
  cost: 0,
  currency: 'coin',
  desc: 'Limpio y sereno.'
}, {
  id: 'au-dorada',
  name: 'Aura dorada',
  cost: 80,
  currency: 'gem',
  tint: 'var(--kb-coin)',
  desc: 'Halo cálido que respira contigo.'
}, {
  id: 'au-estelar',
  name: 'Aura estelar',
  cost: 90,
  currency: 'gem',
  tint: 'var(--area-community)',
  desc: 'Chispas orbitando despacio.'
}, {
  id: 'au-fuego',
  name: 'Aura de racha',
  cost: 90,
  currency: 'gem',
  tint: 'var(--kb-streak)',
  desc: 'Arde más mientras más días llevas.'
}, {
  id: 'au-neon',
  name: 'Anillo neón',
  cost: 110,
  currency: 'gem',
  tint: 'var(--area-will)',
  desc: 'Un aro cian que pulsa a tu ritmo.'
}, {
  id: 'au-burbujas',
  name: 'Burbujas',
  cost: 70,
  currency: 'gem',
  tint: 'var(--kb-primary)',
  desc: 'Burbujitas de gel subiendo siempre.'
}, {
  id: 'au-petalo',
  name: 'Pétalos',
  cost: 95,
  currency: 'gem',
  tint: 'var(--kb-hp)',
  desc: 'Pétalos rosados cayendo suave.'
}];

// PERSONALIDADES — comportamiento comprable. La base es Sereno: quieto,
// solo respira y parpadea (cero travesuras); lo demás se compra.
const KIBO_PERS = [{
  id: 'pe-sereno',
  name: 'Sereno',
  cost: 0,
  currency: 'coin',
  idleMs: null,
  desc: 'Quieto y presente: respira, parpadea, nada más.'
}, {
  id: 'pe-curioso',
  name: 'Curioso',
  cost: 25,
  currency: 'gem',
  idleMs: [12000, 18000],
  tricks: ['wave', 'point'],
  desc: 'Voltea, señala, saluda — de vez en cuando.'
}, {
  id: 'pe-jugueton',
  name: 'Juguetón',
  cost: 40,
  currency: 'gem',
  idleMs: [4000, 8000],
  desc: 'No se puede quedar quieto.'
}, {
  id: 'pe-teatral',
  name: 'Teatral',
  cost: 60,
  currency: 'gem',
  idleMs: [6000, 10000],
  theatrical: true,
  desc: 'Cada travesura, una función.'
}, {
  id: 'pe-dormilon',
  name: 'Dormilón',
  cost: 30,
  currency: 'gem',
  idleMs: [14000, 20000],
  tricks: ['squash', 'gota'],
  sleepy: true,
  desc: 'Bosteza, se escurre, vuelve a dormir.'
}, {
  id: 'pe-coqueto',
  name: 'Coqueto',
  cost: 50,
  currency: 'gem',
  idleMs: [7000, 12000],
  tricks: ['beso', 'wave', 'mueca'],
  desc: 'Manda besos y hace caras.'
}];

// MARCAS — tatuajes y detalles sobre el gel. Se dibujan DENTRO del cuerpo, así
// que se deforman con él: a diferencia de accesorios y objetos, no se despegan
// ni compiten con la cara.
const KIBO_MARKS = [{
  id: 'mk-none',
  name: 'Sin marca',
  cost: 0,
  currency: 'coin',
  desc: 'KIBO al natural.'
}, {
  id: 'mk-pecas',
  name: 'Pecas',
  cost: 180,
  currency: 'coin',
  desc: 'Tres pecas a cada lado. Encanto instantáneo.'
}, {
  id: 'mk-estrella',
  name: 'Estrella',
  cost: 260,
  currency: 'coin',
  desc: 'Una estrellita en la mejilla.'
}, {
  id: 'mk-rayo',
  name: 'Rayo',
  cost: 320,
  currency: 'coin',
  desc: 'Un rayo en el costado — energía.'
}, {
  id: 'mk-espiral',
  name: 'Espiral',
  cost: 380,
  currency: 'coin',
  desc: 'Hipnótica, gira con el gel.'
}, {
  id: 'mk-corazon',
  name: 'Corazón',
  cost: 25,
  currency: 'gem',
  desc: 'Late un poco más fuerte que el resto.'
}, {
  id: 'mk-consteo',
  name: 'Constelación',
  cost: 45,
  currency: 'gem',
  desc: 'Cinco estrellas unidas por una línea fina.'
}, {
  id: 'mk-runa',
  name: 'Runa',
  cost: 55,
  currency: 'gem',
  desc: 'Símbolo antiguo que brilla apenas.'
}, {
  id: 'mk-ondas',
  name: 'Ondas',
  cost: 40,
  currency: 'gem',
  desc: 'Tres ondas que recorren el cuerpo.'
}];

// JUGUETES — objetos con los que KIBO convive junto a su base.
const KIBO_TOYS = [{
  id: 'toy-none',
  name: 'Sin juguete',
  cost: 0,
  currency: 'coin',
  desc: 'KIBO y nada más.'
}, {
  id: 'toy-pelota',
  name: 'Pelota',
  cost: 250,
  currency: 'coin',
  desc: 'Bota sola; KIBO la persigue con la mirada.'
}, {
  id: 'toy-cubo',
  name: 'Cubo mágico',
  cost: 350,
  currency: 'coin',
  desc: 'Gira lento junto a su base.'
}, {
  id: 'toy-uke',
  name: 'Ukelele',
  cost: 45,
  currency: 'gem',
  desc: 'Recargado en KIBO — a veces lo rasguea.'
}, {
  id: 'toy-plantita',
  name: 'Plantita',
  cost: 30,
  currency: 'gem',
  desc: 'Crece con tu racha (de mentiras, pero crece).'
}];

// Accesorios y juguetes quedan FUERA del guardarropa: se veían poco y
// estorbaban a la silueta. Su lugar lo toman las marcas, que viven sobre el gel.
const KIBO_STYLE_CATALOG = {
  skin: KIBO_SKINS,
  mark: KIBO_MARKS,
  aura: KIBO_AURAS,
  pers: KIBO_PERS
};
const KIBO_STYLE_DEFAULTS = {
  skin: 'sk-teal',
  mark: 'mk-none',
  acc: 'ac-none',
  aura: 'au-none',
  pers: 'pe-sereno',
  toy: 'toy-none'
};
const KIBO_STYLE_FREE = ['sk-teal', 'mk-none', 'ac-none', 'au-none', 'pe-sereno', 'toy-none'];

// Partes retiradas del guardarropa (accesorios y objetos). Mientras estén aquí
// NO se leen del almacenamiento y se migra el valor guardado a "ninguno": sin
// esto, quien ya tuviera corona o ukelele equipado se quedaba con ellos para
// siempre, porque al quitar la sección de la Tienda no queda control que los
// pueda apagar. Es también lo que saca "Cantar" del dial de travesuras.
const KIBO_STYLE_RETIRED = {
  acc: 'ac-none',
  toy: 'toy-none'
};
function getKiboStyle() {
  const out = {
    ...KIBO_STYLE_DEFAULTS
  };
  for (const k of Object.keys(KIBO_STYLE_KEYS)) {
    if (k === 'owned') continue;
    if (KIBO_STYLE_RETIRED[k] !== undefined) {
      out[k] = KIBO_STYLE_RETIRED[k];
      // Migración silenciosa: solo toca SU clave, ninguna otra del usuario.
      try {
        if (localStorage.getItem(KIBO_STYLE_KEYS[k]) !== KIBO_STYLE_RETIRED[k]) {
          localStorage.setItem(KIBO_STYLE_KEYS[k], KIBO_STYLE_RETIRED[k]);
        }
      } catch (_) {}
      continue;
    }
    try {
      const v = localStorage.getItem(KIBO_STYLE_KEYS[k]);
      if (v) out[k] = v;
    } catch (_) {}
  }
  return out;
}
function getKiboOwned() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KIBO_STYLE_KEYS.owned) || '[]').concat(KIBO_STYLE_FREE));
  } catch (_) {
    return new Set(KIBO_STYLE_FREE);
  }
}
function ownKiboItem(id) {
  const s = getKiboOwned();
  s.add(id);
  try {
    localStorage.setItem(KIBO_STYLE_KEYS.owned, JSON.stringify([...s]));
  } catch (_) {}
  emitKiboChange();
}
function setKiboStyle(part, id) {
  if (!KIBO_STYLE_KEYS[part]) return;
  try {
    localStorage.setItem(KIBO_STYLE_KEYS[part], id);
  } catch (_) {}
  emitKiboChange();
}
function emitKiboChange() {
  try {
    window.dispatchEvent(new CustomEvent('kibo:kibo-change'));
  } catch (_) {}
}

// Hook: cualquier KiboBlob montado se re-renderiza al equipar algo.
function useKiboStyle() {
  const [style, setStyle] = React.useState(getKiboStyle);
  React.useEffect(() => {
    const upd = () => setStyle(getKiboStyle());
    window.addEventListener('kibo:kibo-change', upd);
    window.addEventListener('storage', upd);
    return () => {
      window.removeEventListener('kibo:kibo-change', upd);
      window.removeEventListener('storage', upd);
    };
  }, []);
  return style;
}
function kiboSkinById(id) {
  return KIBO_SKINS.find(s => s.id === id) || KIBO_SKINS[0];
}
function kiboAuraById(id) {
  return KIBO_AURAS.find(a => a.id === id) || KIBO_AURAS[0];
}
function kiboPersById(id) {
  return KIBO_PERS.find(p => p.id === id) || KIBO_PERS[0];
}
function kiboToyById(id) {
  return KIBO_TOYS.find(t => t.id === id) || KIBO_TOYS[0];
}
function kiboMarkById(id) {
  return KIBO_MARKS.find(m => m.id === id) || KIBO_MARKS[0];
}
Object.assign(window, {
  KIBO_SKINS,
  KIBO_MARKS,
  KIBO_ACCS,
  KIBO_AURAS,
  KIBO_PERS,
  KIBO_TOYS,
  KIBO_STYLE_CATALOG,
  KIBO_STYLE_DEFAULTS,
  getKiboStyle,
  getKiboOwned,
  ownKiboItem,
  setKiboStyle,
  useKiboStyle,
  kiboSkinById,
  kiboAuraById,
  kiboPersById,
  kiboToyById,
  kiboMarkById
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/kibo-style.jsx", error: String((e && e.message) || e) }); }

// reference/app/kibo-vitals.jsx
try { (() => {
// kibo-vitals.jsx — la vida del personaje y las reacciones de KIBO.
// HP es la fuente de verdad del ánimo: KIBO no "siempre sonríe", su cara sale
// de tu salud. Cada acción del sistema pasa por kiboLog() y KIBO reacciona
// (moneda al gastar, flama al cumplir racha, golpe al fallar).

const KB_HP_KEY = 'kibo:hp',
  KB_HP_MAX = 100;
function getHP() {
  try {
    const v = parseInt(localStorage.getItem(KB_HP_KEY), 10);
    if (!isNaN(v)) return Math.max(0, Math.min(KB_HP_MAX, v));
  } catch (_) {}
  return 82;
}
function setHP(v) {
  const n = Math.max(0, Math.min(KB_HP_MAX, Math.round(v)));
  try {
    localStorage.setItem(KB_HP_KEY, String(n));
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent('kibo:hp-change', {
      detail: {
        hp: n
      }
    }));
  } catch (_) {}
  return n;
}
function damageHP(n, why) {
  const before = getHP(),
    after = setHP(before - Math.abs(n));
  kiboLog({
    kind: 'fail',
    amount: Math.abs(n),
    label: why || 'Fallo registrado',
    hp: after
  });
  return after;
}
function healHP(n, why) {
  const before = getHP(),
    after = setHP(before + Math.abs(n));
  kiboLog({
    kind: 'heal',
    amount: Math.abs(n),
    label: why || 'Recuperaste vida',
    hp: after
  });
  return after;
}

// El ánimo NO se elige: se deriva de la salud. Un tramo por estado.
function moodFromHP(hp) {
  if (hp >= 90) return 'celebra';
  if (hp >= 72) return 'feliz';
  if (hp >= 55) return 'calma';
  if (hp >= 38) return 'enfocado';
  if (hp >= 20) return 'cansado';
  return 'triste';
}
function hpTone(hp) {
  if (hp >= 72) return {
    label: 'En forma',
    c: 'var(--kb-good)'
  };
  if (hp >= 38) return {
    label: 'Estable',
    c: 'var(--kb-coin)'
  };
  if (hp >= 20) return {
    label: 'Golpeado',
    c: 'var(--kb-streak)'
  };
  return {
    label: 'Crítico',
    c: 'var(--kb-hp)'
  };
}

// ── El bus de acciones ───────────────────────────────────────────
// Cualquier módulo llama kiboLog({kind, label, amount}) y KIBO reacciona.
// kind: money-out · money-in · habit · streak · read · study · health ·
//       note · mood · fail · heal · reward · level
const KIBO_REACTIONS = {
  'money-out': {
    gesture: 'point',
    mood: 'enfocado',
    prop: 'coin',
    say: 'Anotado. Cada peso contado.'
  },
  'money-in': {
    gesture: 'five',
    mood: 'celebra',
    prop: 'coin',
    say: '¡Entró dinero! Va a tu cuenta.'
  },
  habit: {
    gesture: 'clap',
    mood: 'feliz',
    prop: 'spark',
    say: 'Otro día que cuenta.'
  },
  streak: {
    gesture: 'wave',
    mood: 'celebra',
    prop: 'flame',
    say: '¡Racha viva!'
  },
  read: {
    gesture: 'point',
    mood: 'enfocado',
    prop: 'book',
    say: 'Sabiduría arriba.'
  },
  study: {
    gesture: 'point',
    mood: 'enfocado',
    prop: 'book',
    say: 'A concentrarse.'
  },
  health: {
    gesture: 'five',
    mood: 'feliz',
    prop: 'heart',
    say: 'Tu cuerpo te lo agradece.'
  },
  note: {
    gesture: 'point',
    mood: 'enfocado',
    prop: 'spark',
    say: 'Guardado en tu bóveda.'
  },
  mood: {
    gesture: 'wave',
    mood: null,
    prop: null,
    say: 'Gracias por contarme.'
  },
  reward: {
    gesture: 'clap',
    mood: 'celebra',
    prop: 'coin',
    say: '¡Te lo ganaste!'
  },
  level: {
    gesture: 'five',
    mood: 'celebra',
    prop: 'spark',
    say: '¡Subiste de nivel!'
  },
  heal: {
    gesture: 'clap',
    mood: 'feliz',
    prop: 'heart',
    say: 'Recuperando vida.'
  },
  fail: {
    gesture: 'squash',
    mood: 'triste',
    prop: 'hit',
    say: 'Tranquilo — el fracaso reencauza.'
  }
};
function kiboLog(evt) {
  const e = evt || {};
  try {
    window.dispatchEvent(new CustomEvent('kibo:action', {
      detail: {
        ...e,
        at: Date.now()
      }
    }));
  } catch (_) {}
}

// Hook: HP vivo + ánimo derivado. Lo usa el FAB y cualquier HUD.
function useVitals() {
  const [hp, setHpState] = React.useState(getHP);
  React.useEffect(() => {
    const h = e => setHpState((e && e.detail && e.detail.hp) != null ? e.detail.hp : getHP());
    window.addEventListener('kibo:hp-change', h);
    window.addEventListener('storage', h);
    return () => {
      window.removeEventListener('kibo:hp-change', h);
      window.removeEventListener('storage', h);
    };
  }, []);
  return {
    hp,
    max: KB_HP_MAX,
    mood: moodFromHP(hp),
    tone: hpTone(hp)
  };
}

// Hook: la última reacción (gesto + prop + frase) para que KIBO la actúe.
function useKiboReaction() {
  const [react, setReact] = React.useState(null);
  React.useEffect(() => {
    const h = e => {
      const d = e && e.detail || {};
      const r = KIBO_REACTIONS[d.kind];
      if (!r) return;
      setReact({
        ...r,
        ...d,
        id: Math.random().toString(36).slice(2)
      });
    };
    window.addEventListener('kibo:action', h);
    return () => window.removeEventListener('kibo:action', h);
  }, []);
  return [react, () => setReact(null)];
}

// El objeto que KIBO saca de su cuerpo al reaccionar.
function KiboProp({
  kind
}) {
  if (!kind) return null;
  const art = {
    coin: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "26",
      height: "26"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10",
      fill: "var(--kb-coin)",
      stroke: "var(--kb-coin-ink)",
      strokeWidth: "1.4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8.8 6.8 V 17.2 M15.4 7.2 L 8.8 12.6 M11.4 10.6 L 15.8 17.2",
      fill: "none",
      stroke: "var(--kb-coin-ink)",
      strokeWidth: "2.8",
      strokeLinecap: "round"
    })),
    flame: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "24",
      height: "24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2 C 14 7 19 8.5 19 14 A 7 7 0 0 1 5 14 C 5 9 8 7.5 9.5 4.5 C 10.5 7 12 7 12 2 Z",
      fill: "var(--kb-streak)"
    })),
    heart: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "24",
      height: "24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 21 C 5 15 2 11 2 7.6 C 2 4.8 4.2 3 6.6 3 C 8.6 3 10.6 4.2 12 6.2 C 13.4 4.2 15.4 3 17.4 3 C 19.8 3 22 4.8 22 7.6 C 22 11 19 15 12 21 Z",
      fill: "var(--kb-hp)"
    })),
    book: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "24",
      height: "24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 5 H 10.5 A 1.5 1.5 0 0 1 12 6.5 V 20 H 4.5 A 1.5 1.5 0 0 1 3 18.5 Z",
      fill: "var(--kb-gem)"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M21 5 H 13.5 A 1.5 1.5 0 0 0 12 6.5 V 20 H 19.5 A 1.5 1.5 0 0 0 21 18.5 Z",
      fill: "color-mix(in oklab, var(--kb-gem) 55%, var(--kb-canvas))"
    })),
    spark: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "24",
      height: "24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2 l 2.4 6.4 6.6 1 -4.8 4.6 1.2 6.6 -5.4 -3.2 -5.4 3.2 1.2 -6.6 -4.8 -4.6 6.6 -1 Z",
      fill: "var(--kb-primary)"
    })),
    hit: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "26",
      height: "26"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2 l 3.2 5.6 6.2 -1.4 -2.6 5.8 4.2 4.6 -6.2 1 -1.4 6.4 -4.6 -4 -5.6 3 1 -6.4 -5.4 -3.4 5.6 -3 -3 -5.8 Z",
      fill: "var(--kb-hp)",
      opacity: "0.9"
    }))
  }[kind];
  if (!art) return null;
  return /*#__PURE__*/React.createElement("span", {
    className: `kbb-prop ${kind}`,
    "aria-hidden": "true"
  }, art);
}

// Barra de vida reutilizable (HUD, Personaje, chat de KIBO).
function HpBar({
  compact = false
}) {
  const {
    hp,
    max,
    tone
  } = useVitals();
  return /*#__PURE__*/React.createElement("span", {
    className: `kbv-hpbar ${compact ? 'compact' : ''}`,
    style: {
      '--c': tone.c
    },
    title: `${hp} de ${max} de vida · ${tone.label}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "hb-track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hb-fill",
    style: {
      width: `${hp / max * 100}%`
    }
  })), !compact && /*#__PURE__*/React.createElement("span", {
    className: "hb-num"
  }, hp, /*#__PURE__*/React.createElement("small", null, "/", max), " \xB7 ", tone.label));
}
Object.assign(window, {
  KB_HP_MAX,
  getHP,
  setHP,
  damageHP,
  healHP,
  moodFromHP,
  hpTone,
  kiboLog,
  useVitals,
  useKiboReaction,
  KiboProp,
  HpBar,
  KIBO_REACTIONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/kibo-vitals.jsx", error: String((e && e.message) || e) }); }

// reference/app/kicon-faltantes.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// kicon-faltantes.jsx — los 6 glifos que KIcon declara pero no dibuja.
//
// Están escritos con el MISMO patrón que sus vecinos en icons.jsx:
//   viewBox="0 0 24 24" · {...common} (fill:none, stroke:currentColor, linecap/join round)
//   pupilas como <circle r="0.8" fill="currentColor"> · relleno solo donde el vecino lo usa
//
// Se parchan sobre el KIcon real sin tocarlo. El set real se consulta PRIMERO:
// si ya dibuja un nombre, gana él y este archivo no interviene. Solo entra
// cuando el set devuelve null — o sea, cuando el nombre está declarado sin
// dibujo. Por eso el día que icons.jsx los implemente, el parche se apaga solo
// y la marca morada de las tarjetas se apaga con él.
//
// Referencias de estilo por glifo:
//   play      ← 'square' (control de reproducción, RELLENO: un trazo no lee como botón)
//   mood-*    ← 'mood-meh' / 'mood-low' (círculo r=9 + boca + pupilas r=0.8)
//   star      ← 'sparkle' (estrella de 5 puntas, trazo)
//   medal     ← 'trophy' (disco + cintas, sin estrella dentro)
//   scissors  ← 'x' + 'grip' (dos aros y dos hojas cruzadas)

(function () {
  const Base = window.KIcon || window.__KIconApp;
  if (typeof Base !== 'function') return;
  const EXTRA = {
    // ── acción ──────────────────────────────────────────────────────────
    // Relleno, igual que 'square': un triángulo de trazo no se lee como
    // botón de iniciar. Son pareja — play/square arrancan y detienen.
    play: c => /*#__PURE__*/React.createElement("path", {
      d: "M8 5.5l10 6.5-10 6.5z",
      fill: "currentColor",
      stroke: "currentColor",
      strokeWidth: c.strokeWidth,
      strokeLinejoin: "round"
    }),
    scissors: c => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", _extends({
      cx: "6",
      cy: "18",
      r: "2.6"
    }, c)), /*#__PURE__*/React.createElement("circle", _extends({
      cx: "18",
      cy: "18",
      r: "2.6"
    }, c)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M7.8 16.2L17 4M16.2 16.2L7 4"
    }, c))),
    // ── ánimo ───────────────────────────────────────────────────────────
    // Completan la escala de 7. 'mood-neutral' cae entre meh y low: boca
    // recta pero más corta; 'mood-bad' es más grave que sad: boca hacia
    // abajo y cejas caídas.
    'mood-neutral': c => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", _extends({
      cx: "12",
      cy: "12",
      r: "9"
    }, c)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M9.5 15h5"
    }, c)), /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "10",
      r: "0.8",
      fill: "currentColor"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "15",
      cy: "10",
      r: "0.8",
      fill: "currentColor"
    })),
    // 'mood-bad' es el más grave de la escala: no repite el ceño de 'mood-sad'
    // (salían idénticos a 22px), usa boca de mueca en zigzag — inconfundible.
    'mood-bad': c => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", _extends({
      cx: "12",
      cy: "12",
      r: "9"
    }, c)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M8.5 15.5l1.4 1.6 1.5-1.6 1.4 1.6 1.7-1.6"
    }, c)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M8 8.6l3 1.4M16 8.6l-3 1.4"
    }, c)), /*#__PURE__*/React.createElement("circle", {
      cx: "9.7",
      cy: "11.2",
      r: "0.8",
      fill: "currentColor"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "14.3",
      cy: "11.2",
      r: "0.8",
      fill: "currentColor"
    })),
    // ── gamificación ────────────────────────────────────────────────────
    star: c => /*#__PURE__*/React.createElement("path", _extends({
      d: "M12 3.5l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.9l6-.8z"
    }, c)),
    // Disco + cintas, sin estrella dentro: a 22px la estrella se emplastaba y
    // además duplicaba el glifo 'star'. Se distingue de 'trophy' por las cintas.
    medal: c => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", _extends({
      d: "M8.5 3l2.4 5.4M15.5 3l-2.4 5.4"
    }, c)), /*#__PURE__*/React.createElement("circle", _extends({
      cx: "12",
      cy: "15",
      r: "5.8"
    }, c)), /*#__PURE__*/React.createElement("circle", _extends({
      cx: "12",
      cy: "15",
      r: "2.2"
    }, c)))
  };
  function KIconPatched(props) {
    // El set real gana SIEMPRE: se le pregunta primero. Solo si devuelve null
    // (el nombre está declarado pero sin dibujo) entra el glifo del DS. Así, el
    // día que icons.jsx los implemente, este parche se apaga solo para ellos.
    let baseEl = null;
    try {
      baseEl = Base(props);
    } catch (e) {
      baseEl = null;
    }
    if (baseEl !== null && baseEl !== undefined) return baseEl;
    const draw = EXTRA[props.name];
    if (!draw) return null;
    const size = props.size || 20;
    const sw = props.stroke || 1.8;
    const common = {
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: sw,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    };
    const {
      name,
      size: _s,
      stroke: _st,
      ...rest
    } = props;
    return /*#__PURE__*/React.createElement("svg", _extends({
      viewBox: "0 0 24 24",
      width: size,
      height: size
    }, rest), draw(common));
  }

  // ¿Este nombre lo dibuja el DS y no el set? Se resuelve preguntándole al set,
  // no con una lista teclada — para que la marca visual se apague sola.
  function kiconIsFromDS(name) {
    if (!EXTRA[name]) return false;
    try {
      return Base({
        name,
        size: 18
      }) === null;
    } catch (e) {
      return true;
    }
  }
  Object.assign(window, {
    KIcon: KIconPatched,
    __KIconApp: KIconPatched,
    KICON_EXTRA: Object.keys(EXTRA),
    kiconIsFromDS
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/kicon-faltantes.jsx", error: String((e && e.message) || e) }); }

// reference/app/personalizacion.jsx
try { (() => {
// personalizacion.jsx — Todo lo que se puede cambiar de aspecto, en un solo
// sitio. «Mi progreso» se queda con lo que MIDES (perfil, estadísticas,
// logros); aquí vive lo que DECIDES: cómo se ve tu KIBO, tu carta, tus
// prestigios, tus divisas y la interfaz. Y como casi todo se compra, esta
// sección también vende: ver, comprar y equipar sin cambiar de pantalla.

const PERS_TABS = [{
  id: 'kibo',
  name: 'KIBO',
  icon: 'user',
  desc: 'Piel, marcas, aura y personalidad de tu mascota.'
}, {
  id: 'carta',
  name: 'Carta',
  icon: 'image',
  desc: 'Portada, marco, título y compañero de tu carta de presentación.'
}, {
  id: 'prestigio',
  name: 'Prestigio',
  icon: 'crown',
  desc: 'Cómo se llaman tus 16 prestigios.'
}, {
  id: 'divisas',
  name: 'Divisas',
  icon: 'sparkle',
  desc: 'Nombre, glifo y color de tus recompensas.'
}, {
  id: 'interfaz',
  name: 'Interfaz',
  icon: 'settings',
  desc: 'Menú, rueda, tablero y tema.'
}];

// ── Glifos de divisa ─────────────────────────────────────────────
// Dibujados aquí y no en `icons.jsx` porque son objetos de marca (como la
// moneda y la materia), no íconos de interfaz.
function CurrencyGlyph({
  glyph,
  color,
  size = 26,
  spin = false
}) {
  const s = {
    width: size,
    height: size,
    display: 'block'
  };
  const c = color || 'var(--kb-void-1)';
  switch (glyph) {
    case 'spark':
      return /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 24 24",
        style: s,
        className: spin ? 'cg-spin' : ''
      }, /*#__PURE__*/React.createElement("path", {
        d: "M12 2.6l2.1 6.6 6.6 2.1-6.6 2.1L12 20l-2.1-6.6L3.3 11.3l6.6-2.1z",
        fill: c
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "11.3",
        r: "2.4",
        fill: "var(--kb-canvas)",
        opacity: ".85"
      }));
    case 'drop':
      return /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 24 24",
        style: s,
        className: spin ? 'cg-spin' : ''
      }, /*#__PURE__*/React.createElement("path", {
        d: "M12 3c3.4 3.8 5.4 6.5 5.4 9a5.4 5.4 0 0 1-10.8 0c0-2.5 2-5.2 5.4-9z",
        fill: c
      }), /*#__PURE__*/React.createElement("ellipse", {
        cx: "9.6",
        cy: "10.4",
        rx: "1.5",
        ry: "2.2",
        fill: "var(--kb-canvas)",
        opacity: ".55"
      }));
    case 'core':
      return /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 24 24",
        style: s,
        className: spin ? 'cg-spin' : ''
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "5.6",
        fill: c
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9",
        fill: "none",
        stroke: c,
        strokeWidth: "1.4",
        opacity: ".5"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "10",
        cy: "10",
        r: "1.8",
        fill: "var(--kb-canvas)",
        opacity: ".5"
      }));
    case 'chip':
      return /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 24 24",
        style: s,
        className: spin ? 'cg-spin' : ''
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9",
        fill: c
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "5.4",
        fill: "var(--kb-canvas)",
        opacity: ".9"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "2.6",
        fill: c
      }));
    case 'leaf':
      return /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 24 24",
        style: s,
        className: spin ? 'cg-spin' : ''
      }, /*#__PURE__*/React.createElement("path", {
        d: "M19 4c0 8-4.6 12.6-11 13 0-7.4 4-12 11-13z",
        fill: c
      }), /*#__PURE__*/React.createElement("path", {
        d: "M17 6C12 9 9.6 12.4 8.4 17",
        stroke: "var(--kb-canvas)",
        strokeWidth: "1.3",
        fill: "none",
        opacity: ".7"
      }));
    case 'coin':
      return /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 24 24",
        style: s,
        className: spin ? 'cg-spin' : ''
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9.2",
        fill: c
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9.4 7.4v9.2M9.4 12.4l4.6-5M10.4 12.2l4.4 4.4",
        stroke: "var(--kb-coin-ink)",
        strokeWidth: "2",
        strokeLinecap: "round",
        fill: "none"
      }));
    default:
      // orb — obsidiana con contorno
      return /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 24 24",
        style: s,
        className: spin ? 'cg-spin' : ''
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "8.4",
        fill: c
      }), /*#__PURE__*/React.createElement("ellipse", {
        cx: "12",
        cy: "12",
        rx: "9.6",
        ry: "4",
        fill: "none",
        stroke: c,
        strokeWidth: "1.3",
        opacity: ".7",
        transform: "rotate(-22 12 12)"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9.4",
        cy: "9.2",
        r: "1.8",
        fill: "var(--kb-canvas)",
        opacity: ".4"
      }));
  }
}

// ── Ficha comprable genérica ─────────────────────────────────────
function PersCard({
  owned,
  active,
  name,
  desc,
  cost,
  currency = 'gem',
  onPick,
  children,
  wide
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `pers-card ${active ? 'on' : ''} ${owned ? '' : 'locked'} ${wide ? 'wide' : ''}`,
    onClick: onPick,
    title: desc
  }, /*#__PURE__*/React.createElement("span", {
    className: "pc-art"
  }, children), /*#__PURE__*/React.createElement("span", {
    className: "pc-meta"
  }, /*#__PURE__*/React.createElement("strong", null, name), desc && /*#__PURE__*/React.createElement("span", null, desc)), active ? /*#__PURE__*/React.createElement("span", {
    className: "pc-tag on"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 11
  }), " Puesto") : owned ? /*#__PURE__*/React.createElement("span", {
    className: "pc-tag"
  }, "Poner") : /*#__PURE__*/React.createElement("span", {
    className: "pc-tag buy"
  }, currency === 'gem' ? /*#__PURE__*/React.createElement(GemIcon, {
    size: 11
  }) : /*#__PURE__*/React.createElement(CoinIcon, {
    size: 11
  }), " ", cost));
}

// ── Pestaña · Prestigio ──────────────────────────────────────────
function PersPrestigio({
  stats,
  flash,
  ask
}) {
  const live = usePrestigeNames();
  const owned = pfOwned();
  const [draft, setDraft] = React.useState(null); // los 16 nombres en edición

  function pick(f) {
    if (!owned.has(f.id)) {
      const have = parseInt(stats?.gems, 10) || 0;
      if (have < f.cost) {
        flash('No tienes suficiente materia oscura — gánala en retos o ábrela en cofres');
        return;
      }
      ask({
        title: `Comprar «${f.name}»`,
        confirmLabel: 'Comprar y poner',
        message: `Cuesta ${f.cost} de materia oscura. Cambia el nombre de tus 16 prestigios; el número y lo que valen no se tocan.`,
        onConfirm: () => {
          pfOwn(f.id);
          pfSetCustom(null);
          pfSetActive(f.id);
          flash(`Prestigios «${f.name}» ✓`);
        }
      });
      return;
    }
    pfSetCustom(null);
    pfSetActive(f.id);
    flash(`Prestigios «${f.name}»`);
  }
  function startCustom() {
    const have = parseInt(stats?.gems, 10) || 0;
    const already = live.custom;
    if (!already && have < PF_CUSTOM_COST) {
      flash('Escribir los tuyos cuesta ' + PF_CUSTOM_COST + ' de materia oscura');
      return;
    }
    setDraft(live.names.slice());
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pers-pane"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pers-lead"
  }, /*#__PURE__*/React.createElement("p", null, "Los 16 prestigios son un ", /*#__PURE__*/React.createElement("strong", null, "n\xFAmero"), " \u2014 el nombre es cosm\xE9tico. C\xE1mbialo por una familia entera o escribe los tuyos."), /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, "El nivel se sigue viendo junto al nombre, as\xED que nadie pierde la referencia.")), /*#__PURE__*/React.createElement("div", {
    className: "pers-grid"
  }, PRESTIGE_FAMILIES.map(f => /*#__PURE__*/React.createElement(PersCard, {
    key: f.id,
    wide: true,
    owned: owned.has(f.id),
    active: !live.custom && live.family === f.id,
    name: f.name,
    desc: f.desc,
    cost: f.cost,
    onPick: () => pick(f)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-sample"
  }, [1, 8, 16].map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    className: "pf-chip"
  }, /*#__PURE__*/React.createElement("b", null, n), " ", f.names[n - 1]))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `pers-card wide custom ${live.custom ? 'on' : ''}`,
    onClick: startCustom
  }, /*#__PURE__*/React.createElement("span", {
    className: "pc-art"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "edit",
    size: 22
  })), /*#__PURE__*/React.createElement("span", {
    className: "pc-meta"
  }, /*#__PURE__*/React.createElement("strong", null, "Escribe los tuyos"), /*#__PURE__*/React.createElement("span", null, "Los 16, con tus palabras. Se guardan y puedes volver a editarlos.")), live.custom ? /*#__PURE__*/React.createElement("span", {
    className: "pc-tag on"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 11
  }), " Puestos") : /*#__PURE__*/React.createElement("span", {
    className: "pc-tag buy"
  }, /*#__PURE__*/React.createElement(GemIcon, {
    size: 11
  }), " ", PF_CUSTOM_COST))), draft && /*#__PURE__*/React.createElement("div", {
    className: "kbv-modal-veil",
    onClick: () => setDraft(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-modal-card",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-modal-head"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kbv-h3"
  }, "Tus 16 prestigios"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-icon-btn",
    onClick: () => setDraft(null),
    "aria-label": "Cerrar"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "x",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pers-custom-list"
  }, draft.map((v, i) => /*#__PURE__*/React.createElement("label", {
    key: i,
    className: "pers-custom-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, i + 1), /*#__PURE__*/React.createElement("input", {
    value: v,
    maxLength: 28,
    onChange: e => setDraft(d => d.map((x, j) => j === i ? e.target.value : x))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "kbv-modal-foot"
  }, live.custom && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-ghost",
    onClick: () => {
      pfSetCustom(null);
      setDraft(null);
      flash('Volviste a la familia elegida');
    }
  }, "Quitar los m\xEDos"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-secondary",
    onClick: () => setDraft(null)
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-primary",
    onClick: () => {
      if (draft.some(x => !x.trim())) {
        flash('Ninguno puede quedar vacío');
        return;
      }
      pfSetCustom(draft.map(x => x.trim()));
      setDraft(null);
      flash('Prestigios a tu manera ✓');
    }
  }, "Guardar los 16")))));
}

// ── Pestaña · Divisas ────────────────────────────────────────────
function PersDivisas({
  stats,
  flash,
  ask
}) {
  const live = useCurrencySkin();
  const owned = csOwned();
  const [naming, setNaming] = React.useState(null);
  function pick(kind, skin) {
    if (!owned.has(skin.id)) {
      const have = parseInt(stats?.gems, 10) || 0;
      if (have < skin.cost) {
        flash('No tienes suficiente materia oscura');
        return;
      }
      ask({
        title: `Comprar «${skin.name}»`,
        confirmLabel: 'Comprar y poner',
        message: `Cuesta ${skin.cost} de materia oscura. Cambia cómo se ve y cómo se llama; lo que vale, no.`,
        onConfirm: () => {
          csOwn(skin.id);
          csSet(kind, skin.id);
          flash(`${skin.name} ✓`);
        }
      });
      return;
    }
    csSet(kind, skin.id);
    flash(`${skin.name} puesta`);
  }
  const blocks = [{
    kind: 'dark',
    title: 'Materia oscura',
    sub: 'La recompensa rara: cofres, retos y prestigios.'
  }, {
    kind: 'coin',
    title: 'Monedas',
    sub: 'La de todos los días: hábitos, tareas y rachas.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "pers-pane"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pers-lead"
  }, /*#__PURE__*/React.createElement("p", null, "Cambia el ", /*#__PURE__*/React.createElement("strong", null, "nombre"), ", el ", /*#__PURE__*/React.createElement("strong", null, "glifo"), " y el ", /*#__PURE__*/React.createElement("strong", null, "color"), " de tus recompensas. La econom\xEDa no se entera: siguen valiendo lo mismo y gan\xE1ndose igual.")), blocks.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.kind,
    className: "pers-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pers-block-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "kbv-h3"
  }, csLabel(b.kind)), /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, b.sub)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-secondary",
    onClick: () => setNaming({
      kind: b.kind,
      value: csLabel(b.kind)
    })
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "edit",
    size: 13
  }), " Renombrar")), /*#__PURE__*/React.createElement("div", {
    className: "pers-grid"
  }, CURRENCY_SKINS[b.kind].map(sk => /*#__PURE__*/React.createElement(PersCard, {
    key: sk.id,
    owned: owned.has(sk.id),
    active: live[b.kind].id === sk.id,
    name: sk.name,
    desc: sk.desc,
    cost: sk.cost,
    onPick: () => pick(b.kind, sk)
  }, /*#__PURE__*/React.createElement("span", {
    className: "cg-stage"
  }, /*#__PURE__*/React.createElement(CurrencyGlyph, {
    glyph: sk.glyph,
    color: sk.color,
    size: 38,
    spin: live[b.kind].id === sk.id
  }))))))), naming && /*#__PURE__*/React.createElement("div", {
    className: "kbv-modal-veil",
    onClick: () => setNaming(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-modal-card sm",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-modal-head"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kbv-h3"
  }, "\xBFC\xF3mo se llama?")), /*#__PURE__*/React.createElement("div", {
    className: "kbv-form-row"
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: naming.value,
    maxLength: 22,
    onChange: e => setNaming(n => ({
      ...n,
      value: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "kbv-modal-foot"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-secondary",
    onClick: () => setNaming(null)
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-primary",
    onClick: () => {
      csSetName(naming.kind, naming.value.trim());
      setNaming(null);
      flash('Listo — se llama así en toda la plataforma');
    }
  }, "Guardar")))));
}

// ── Pestaña · Interfaz ───────────────────────────────────────────
function PersInterfaz({
  flash,
  onNavigate
}) {
  const prefs = typeof useKbPrefs === 'function' ? useKbPrefs() : {};
  const mode = prefs.sidebarMode || 'replegable';
  const dense = prefs.density || 'estandar';
  return /*#__PURE__*/React.createElement("div", {
    className: "pers-pane"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pers-lead"
  }, /*#__PURE__*/React.createElement("p", null, "C\xF3mo se comporta la plataforma alrededor de tu contenido.")), /*#__PURE__*/React.createElement("div", {
    className: "pers-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pers-block-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "kbv-h3"
  }, "Men\xFA lateral"), /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, "Tambi\xE9n puedes fijarlo desde la chincheta del propio men\xFA."))), /*#__PURE__*/React.createElement("div", {
    className: "pers-choices"
  }, [{
    id: 'replegable',
    n: 'Replegable',
    d: 'Con botón para colapsarlo a riel.'
  }, {
    id: 'fijo',
    n: 'Fijo',
    d: 'Siempre abierto, con los nombres a la vista.'
  }].map(o => /*#__PURE__*/React.createElement("button", {
    key: o.id,
    type: "button",
    className: `pers-choice ${mode === o.id ? 'on' : ''}`,
    onClick: () => {
      kbSetPref('sidebarMode', o.id);
      flash('Listo');
    }
  }, /*#__PURE__*/React.createElement("strong", null, o.n), /*#__PURE__*/React.createElement("span", null, o.d))))), /*#__PURE__*/React.createElement("div", {
    className: "pers-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pers-block-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "kbv-h3"
  }, "Densidad"), /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, "Cu\xE1nto aire hay entre las cosas."))), /*#__PURE__*/React.createElement("div", {
    className: "pers-choices"
  }, [{
    id: 'compacta',
    n: 'Compacta',
    d: 'Más contenido a la vista.'
  }, {
    id: 'estandar',
    n: 'Estándar',
    d: 'El equilibrio de siempre.'
  }, {
    id: 'amplia',
    n: 'Amplia',
    d: 'Más aire, menos por pantalla.'
  }].map(o => /*#__PURE__*/React.createElement("button", {
    key: o.id,
    type: "button",
    className: `pers-choice ${dense === o.id ? 'on' : ''}`,
    onClick: () => {
      kbSetPref('density', o.id);
      flash('Listo');
    }
  }, /*#__PURE__*/React.createElement("strong", null, o.n), /*#__PURE__*/React.createElement("span", null, o.d))))), /*#__PURE__*/React.createElement("div", {
    className: "pers-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pers-block-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "kbv-h3"
  }, "Atajos"), /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, "Lo que se configura en su propio sitio."))), /*#__PURE__*/React.createElement("div", {
    className: "pers-links"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pers-link",
    onClick: () => onNavigate && onNavigate('today')
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "layers",
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Widgets del tablero"), /*#__PURE__*/React.createElement("em", null, "A\xF1adir, quitar y redimensionar en \xABHoy\xBB")), /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-right",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pers-link",
    onClick: () => {
      flash('Toca a KIBO y usa el ⋯ bajo él');
    }
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "grip",
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Tu rueda de acci\xF3n r\xE1pida"), /*#__PURE__*/React.createElement("em", null, "Qu\xE9 rubros salen y en qu\xE9 orden")), /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-right",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pers-link",
    onClick: () => onNavigate && onNavigate('config')
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "settings",
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Configuraci\xF3n"), /*#__PURE__*/React.createElement("em", null, "Notificaciones, juego, integraciones y cuenta")), /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-right",
    size: 14
  })))));
}

// ── La pantalla ──────────────────────────────────────────────────
function PersonalizacionScreen({
  user,
  stats,
  onNavigate,
  initialTab
}) {
  const [tab, setTab] = React.useState(initialTab || 'kibo');
  const [toast, setToast] = React.useState(null);
  const [ask, confirmDialog] = useConfirm();
  function flash(m) {
    setToast(m);
    clearTimeout(flash._t);
    flash._t = setTimeout(() => setToast(null), 2400);
  }
  const meta = PERS_TABS.find(t => t.id === tab) || PERS_TABS[0];
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-main kbv-pers"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "kbv-eyebrow",
    style: {
      color: 'var(--kb-primary)'
    }
  }, "Tuyo \xB7 c\xF3mo se ve todo"), /*#__PURE__*/React.createElement("h1", {
    className: "kbv-h1",
    style: {
      marginTop: 4
    }
  }, "Personalizaci\xF3n."), /*#__PURE__*/React.createElement("p", {
    className: "kbv-meta",
    style: {
      marginTop: 6,
      maxWidth: 620
    }
  }, meta.desc))), /*#__PURE__*/React.createElement("div", {
    className: "kbv-store-tabs"
  }, PERS_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    type: "button",
    className: tab === t.id ? 'on' : '',
    onClick: () => setTab(t.id)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: t.icon,
    size: 14
  }), " ", t.name))), tab === 'kibo' && typeof KiboStyleTab === 'function' && /*#__PURE__*/React.createElement(KiboStyleTab, {
    stats: stats,
    flash: flash
  }), tab === 'carta' && /*#__PURE__*/React.createElement("div", {
    className: "pers-pane"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pers-lead"
  }, /*#__PURE__*/React.createElement("p", null, "As\xED te ven los dem\xE1s. Toca ", /*#__PURE__*/React.createElement("strong", null, "Editar"), " en la carta para elegir qu\xE9 presumes; abajo, con qu\xE9 se viste.")), typeof CallingCard === 'function' && typeof prestigeInfo === 'function' && (() => {
    const level = stats && stats.level || 8;
    const completed = stats && stats.prestigeMaster ? 16 : (stats && stats.prestigeCompleted) ?? 0;
    return /*#__PURE__*/React.createElement(CallingCard, {
      user: user,
      pres: prestigeInfo(completed, level),
      level: level,
      xp: stats && stats.xp || 0,
      xpMax: stats && stats.xpMax || 4000,
      paragonLevel: stats && stats.paragonLevel || 0
    });
  })(), typeof VitrinaStoreTab === 'function' && /*#__PURE__*/React.createElement(VitrinaStoreTab, null)), tab === 'prestigio' && /*#__PURE__*/React.createElement(PersPrestigio, {
    stats: stats,
    flash: flash,
    ask: ask
  }), tab === 'divisas' && /*#__PURE__*/React.createElement(PersDivisas, {
    stats: stats,
    flash: flash,
    ask: ask
  }), tab === 'interfaz' && /*#__PURE__*/React.createElement(PersInterfaz, {
    flash: flash,
    onNavigate: onNavigate
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "kbv-toast show"
  }, toast), confirmDialog);
}
Object.assign(window, {
  PersonalizacionScreen,
  PERS_TABS,
  CurrencyGlyph
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/personalizacion.jsx", error: String((e && e.message) || e) }); }

// reference/app/prestige-system.jsx
try { (() => {
// prestige-system.jsx — Progresión estilo Call of Duty con un VIAJE astronómico.
//
// MODELO:
//  • Niveles 1–100 = "Rangos" militares (20 emblemas, salto cada 5 niveles).
//    Escala de materiales: Bronce → Plata → Oro → Platino → Obsidiana →
//    Diamante → Esmeralda → Rubí → Damasco (el más raro, con logo animado).
//  • Al Nivel 100 se desbloquea el PRESTIGIO: reinicias a Nv. 1 y subes de grado.
//  • 16 prestigios = un ESCALAFÓN ESPACIAL ascendente, de Cadete Estelar hasta
//    la Leyenda (singularidad / agujero negro animado), grado supremo.
//  • Los últimos 10 grados ganan un ANILLO animado que envuelve el emblema,
//    con un color propio y complejidad creciente; la Leyenda corona con un
//    aro espectral que late.
//  • Equipar libremente cualquier emblema es EXCLUSIVO de la Leyenda (Maestro).
//  • Maestro: niveles de paragón sin tope + un "Trayecto hacia deidad" que se
//    revela como una línea de tiempo cósmica (ascensión a deidad).

const PRESTIGE_LEVELS = 100;
const PRESTIGE_MAX = 16; // el 16 (Leyenda) es Maestro

// Prestigio = ESCALAFÓN ESPACIAL ascendente: de cadete a leyenda.
// Cada prestigio es un grado militar cósmico (medallón con campo estelar),
// el dispositivo central escala por grupo (galones → órbitas → alas → laureles
// → nova → galaxia) y culmina en la singularidad (Leyenda, agujero negro animado).
const CELESTIAL = [{
  n: 1,
  name: 'Cadete Estelar',
  sub: 'Primer ascenso',
  type: 'cadete',
  a: 'var(--kb-rank-cadete-a)',
  b: 'var(--kb-rank-cadete-b)',
  ink: 'var(--kb-rank-cadete-ink)',
  glow: 'var(--kb-rank-cadete-glow)'
}, {
  n: 2,
  name: 'Piloto Orbital',
  sub: 'Vuelo libre',
  type: 'piloto',
  a: 'var(--kb-rank-cadete-a)',
  b: 'var(--kb-rank-cadete-b)',
  ink: 'var(--kb-rank-cadete-ink)',
  glow: 'var(--kb-rank-cadete-glow)'
}, {
  n: 3,
  name: 'Explorador Sideral',
  sub: 'Vanguardia',
  type: 'explorador',
  a: 'var(--kb-rank-cadete-a)',
  b: 'var(--kb-rank-cadete-b)',
  ink: 'var(--kb-rank-cadete-ink)',
  glow: 'var(--kb-rank-cadete-glow)'
}, {
  n: 4,
  name: 'Teniente Sideral',
  sub: 'Oficial',
  type: 'teniente',
  a: 'var(--kb-rank-teniente-a)',
  b: 'var(--kb-rank-teniente-b)',
  ink: 'var(--kb-rank-teniente-ink)',
  glow: 'var(--kb-rank-teniente-glow)'
}, {
  n: 5,
  name: 'Capitán de Nave',
  sub: 'Al mando',
  type: 'capitan',
  a: 'var(--kb-rank-teniente-a)',
  b: 'var(--kb-rank-teniente-b)',
  ink: 'var(--kb-rank-teniente-ink)',
  glow: 'var(--kb-rank-teniente-glow)'
}, {
  n: 6,
  name: 'Comandante de Flota',
  sub: 'Flota propia',
  type: 'flota',
  a: 'var(--kb-rank-teniente-a)',
  b: 'var(--kb-rank-teniente-b)',
  ink: 'var(--kb-rank-teniente-ink)',
  glow: 'var(--kb-rank-teniente-glow)'
}, {
  n: 7,
  name: 'Comodoro Galáctico',
  sub: 'Líder de escuadra',
  type: 'comodoro',
  a: 'var(--kb-rank-granalmirante-a)',
  b: 'var(--kb-rank-granalmirante-b)',
  ink: 'var(--kb-coin-ink)',
  glow: 'var(--kb-rank-granalmirante-glow)'
}, {
  n: 8,
  name: 'Almirante',
  sub: 'Alto mando',
  type: 'almirante',
  a: 'var(--kb-rank-granalmirante-a)',
  b: 'var(--kb-rank-granalmirante-b)',
  ink: 'var(--kb-coin-ink)',
  glow: 'var(--kb-rank-granalmirante-glow)'
}, {
  n: 9,
  name: 'Almirante de Galaxias',
  sub: 'Dominio galáctico',
  type: 'galaxias',
  a: 'var(--kb-rank-granalmirante-a)',
  b: 'var(--kb-rank-granalmirante-b)',
  ink: 'var(--kb-coin-ink)',
  glow: 'var(--kb-rank-granalmirante-glow)'
}, {
  n: 10,
  name: 'Gran Almirante',
  sub: 'Mando supremo',
  type: 'granalmirante',
  a: 'var(--kb-rank-granalmirante-a)',
  b: 'var(--kb-rank-granalmirante-b)',
  ink: 'var(--kb-rank-granalmirante-ink)',
  glow: 'var(--kb-rank-granalmirante-glow)',
  fancy: true
}, {
  n: 11,
  name: 'Señor de Constelaciones',
  sub: 'Soberano estelar',
  type: 'constelacion',
  a: 'var(--kb-rank-arquitecto-a)',
  b: 'var(--kb-rank-arquitecto-b)',
  ink: 'var(--kb-rank-arquitecto-ink)',
  glow: 'var(--kb-rank-arquitecto-glow)',
  fancy: true
}, {
  n: 12,
  name: 'Soberano del Cosmos',
  sub: 'Trono cósmico',
  type: 'soberano',
  a: 'var(--kb-rank-arquitecto-a)',
  b: 'var(--kb-rank-arquitecto-b)',
  ink: 'var(--kb-rank-arquitecto-ink)',
  glow: 'var(--kb-rank-arquitecto-glow)',
  fancy: true
}, {
  n: 13,
  name: 'Arquitecto de Estrellas',
  sub: 'Forja de soles',
  type: 'arquitecto',
  a: 'var(--kb-rank-arquitecto-a)',
  b: 'var(--kb-rank-arquitecto-b)',
  ink: 'var(--kb-rank-arquitecto-ink)',
  glow: 'var(--kb-rank-arquitecto-glow)',
  fancy: true
}, {
  n: 14,
  name: 'Titán Cósmico',
  sub: 'Fuerza universal',
  type: 'titan',
  a: 'var(--kb-rank-titan-a)',
  b: 'var(--kb-rank-titan-b)',
  ink: 'var(--kb-rank-titan-ink)',
  glow: 'var(--kb-rank-titan-glow)',
  fancy: true
}, {
  n: 15,
  name: 'Avatar Cósmico',
  sub: 'Forma trascendente',
  type: 'avatar',
  a: 'var(--kb-rank-avatar-a)',
  b: 'var(--kb-rank-avatar-b)',
  ink: 'var(--kb-rank-avatar-ink)',
  glow: 'var(--kb-rank-avatar-glow)',
  fancy: true
}, {
  n: 16,
  name: 'Leyenda',
  sub: 'Singularidad',
  type: 'blackhole',
  a: 'var(--kb-rank-blackhole-a)',
  b: 'var(--kb-rank-blackhole-b)',
  ink: 'var(--kb-rank-blackhole-ink)',
  glow: 'var(--kb-rank-blackhole-glow)',
  master: true
}];

// El nombre del prestigio es COSMÉTICO: sale de la familia que el usuario
// eligió (o de los 16 que escribió). El número, el color y el emblema siguen
// siendo los de siempre — nadie pierde la referencia de en qué nivel va.
const PRESTIGE_RANKS = CELESTIAL.map(c => c.name);
function prestigeName(n) {
  return (typeof pfName === 'function' ? pfName(n) : null) || (CELESTIAL[n - 1] || {}).name || '';
}

// ── 20 rangos militares (salto cada 5 niveles) ─────────────────
// Escalafón ascendente; el último (Nv. 100) es el grado supremo, justo antes
// del primer prestigio.
const RANK_NAMES = ['Soldado', 'Soldado de primera', 'Cabo', 'Cabo primero', 'Cabo mayor', 'Sargento', 'Sargento de estado mayor', 'Sargento mayor', 'Subteniente', 'Alférez', 'Teniente', 'Capitán', 'Mayor', 'Teniente coronel', 'Coronel', 'General de brigada', 'Mayor general', 'Teniente general', 'General', 'Capitán general'];
function rankGroup(i) {
  // 9 materiales (20 niveles): Bronce → Plata → Oro → Platino → Obsidiana
  //   → Diamante → Esmeralda → Rubí → Damasco (el más raro, animado).
  if (i <= 2) return {
    t: 'chevron',
    c: i + 1,
    a: 'var(--kb-mat-bronce-a)',
    b: 'var(--kb-mat-bronce-b)',
    ink: 'var(--kb-mat-bronce-ink)',
    name: 'Bronce'
  };
  if (i <= 5) return {
    t: 'bar',
    c: i - 2,
    a: 'var(--kb-mat-plata-a)',
    b: 'var(--kb-mat-plata-b)',
    ink: 'var(--kb-mat-plata-ink)',
    name: 'Plata'
  };
  if (i <= 8) return {
    t: 'star',
    c: i - 5,
    a: 'var(--kb-mat-oro-a)',
    b: 'var(--kb-mat-oro-b)',
    ink: 'var(--kb-coin-ink)',
    name: 'Oro'
  };
  if (i <= 11) return {
    t: 'eagle',
    c: i - 8,
    a: 'var(--kb-mat-platino-a)',
    b: 'var(--kb-mat-platino-b)',
    ink: 'var(--kb-mat-platino-ink)',
    name: 'Platino'
  };
  if (i <= 13) return {
    t: 'wreath',
    c: i - 11,
    a: 'var(--kb-mat-obsidiana-a)',
    b: 'var(--kb-mat-obsidiana-b)',
    ink: 'var(--kb-mat-obsidiana-ink)',
    name: 'Obsidiana'
  };
  if (i <= 15) return {
    t: 'diamond',
    c: i - 13,
    a: 'var(--kb-mat-diamante-a)',
    b: 'var(--kb-mat-diamante-b)',
    ink: 'var(--kb-mat-diamante-ink)',
    name: 'Diamante',
    anim: 'shine'
  };
  if (i <= 17) return {
    t: 'diamond',
    c: i - 15,
    a: 'var(--kb-mat-esmeralda-a)',
    b: 'var(--kb-mat-esmeralda-b)',
    ink: 'var(--kb-mat-esmeralda-ink)',
    name: 'Esmeralda',
    anim: 'shine'
  };
  if (i === 18) return {
    t: 'crown',
    c: 1,
    a: 'var(--kb-mat-rubi-a)',
    b: 'var(--kb-mat-rubi-b)',
    ink: 'var(--kb-mat-rubi-ink)',
    name: 'Rubí',
    anim: 'shine'
  };
  return {
    t: 'crown',
    c: 1,
    a: 'var(--kb-mat-damasco-a)',
    b: 'var(--kb-mat-damasco-b)',
    ink: 'var(--kb-mat-damasco-ink)',
    name: 'Damasco',
    anim: 'oil'
  };
}
function rankTier(level) {
  return Math.min(19, Math.floor((Math.max(1, level) - 1) / 5));
}
function prestigeInfo(completed, levelInPrestige) {
  const c = Math.max(0, Math.min(PRESTIGE_MAX, completed | 0));
  const master = c >= PRESTIGE_MAX;
  return {
    completed: c,
    levelInPrestige: levelInPrestige || 0,
    master,
    prestiged: c >= 1,
    levelsToNextPrestige: master ? 0 : PRESTIGE_LEVELS - (levelInPrestige || 0),
    rank: prestigeName(Math.min(Math.max(c, 1), PRESTIGE_MAX))
  };
}

// ── Equip store ────────────────────────────────────────────────
const EMBLEM_KEY = 'kibo:equippedEmblem';
function getEquippedEmblem() {
  return localStorage.getItem(EMBLEM_KEY) || null;
}
function setEquippedEmblem(key) {
  try {
    localStorage.setItem(EMBLEM_KEY, key);
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent('kibo:emblem-change', {
      detail: {
        key
      }
    }));
  } catch (_) {}
}
let __emUid = 0;
function starPath(cx, cy, r) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const ang = Math.PI / 5 * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    d += (i === 0 ? 'M' : 'L') + (cx + rad * Math.cos(ang)).toFixed(1) + ' ' + (cy + rad * Math.sin(ang)).toFixed(1) + ' ';
  }
  return d + 'Z';
}

// ── Emblema de prestigio (cuerpo / estructura cósmica) ─────────
function PrestigeEmblem({
  tier,
  size = 64,
  locked = false
}) {
  const uid = React.useMemo(() => `ce${++__emUid}`, []);
  const t = CELESTIAL[(tier || 1) - 1] || CELESTIAL[0];
  const rg = `${uid}-r`,
    coreG = `${uid}-core`;
  const A = locked ? 'var(--kb-parch-1)' : t.a;
  const B = locked ? 'var(--kb-parch-3)' : t.b;
  const ink = locked ? 'var(--kb-parch-4)' : t.ink;
  const glow = locked ? 'var(--kb-parch-2)' : t.glow || t.a;
  const dev = t.dev || 1;
  const fancy = !locked && t.fancy,
    master = !locked && t.master;
  function ringStars(n, rad) {
    return Array.from({
      length: n
    }).map((_, i) => {
      const a = Math.PI * 2 / n * i - Math.PI / 2;
      return /*#__PURE__*/React.createElement("circle", {
        key: i,
        cx: (50 + Math.cos(a) * rad).toFixed(1),
        cy: (50 + Math.sin(a) * rad).toFixed(1),
        r: "1.6",
        fill: "#fff",
        opacity: "0.9"
      });
    });
  }

  // Anillo animado que envuelve el emblema. Sólo los últimos 10 grados (n>=7).
  // El nivel (1..10) escala la complejidad: de un aro punteado simple que gira,
  // a luz viajera + doble aro contrarrotante, hasta un aro espectral que late.
  const ringLvl = locked ? 0 : Math.max(0, Math.min(10, (t.n || tier) - 6));
  const prismId = `${uid}-pr`;
  function ringFx() {
    if (!ringLvl) return null;
    const col = t.glow || t.b;
    const prism = ringLvl >= 10;
    const dash = ringLvl >= 6 ? '3 5' : ringLvl >= 3 ? '2 6' : '1.5 8';
    const els = [];
    els.push(/*#__PURE__*/React.createElement("g", {
      key: "rot",
      className: "cel-ring",
      style: {
        animationDuration: 32 - ringLvl * 1.8 + 's'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "50",
      r: "48",
      fill: "none",
      stroke: prism ? `url(#${prismId})` : col,
      strokeWidth: ringLvl >= 6 ? 2.2 : 1.5,
      strokeDasharray: prism ? null : dash,
      strokeLinecap: "round",
      opacity: prism ? 1 : 0.82
    })));
    if (ringLvl >= 3) els.push(/*#__PURE__*/React.createElement("circle", {
      key: "sw",
      className: "cel-ring-sweep",
      cx: "50",
      cy: "50",
      r: "48",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "2.4",
      pathLength: "100",
      strokeDasharray: `${9 + ringLvl} ${91 - ringLvl}`,
      strokeLinecap: "round",
      opacity: "0.92",
      style: {
        animationDuration: 8.5 - Math.min(5, ringLvl - 3) * 0.7 + 's'
      }
    }));
    if (ringLvl >= 5) els.push(/*#__PURE__*/React.createElement("g", {
      key: "rev",
      className: "cel-ring cel-ring-rev",
      style: {
        animationDuration: 22 - ringLvl + 's'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "50",
      r: "44.5",
      fill: "none",
      stroke: col,
      strokeWidth: "1",
      strokeDasharray: "1 9",
      opacity: "0.6"
    })));
    return /*#__PURE__*/React.createElement("g", {
      className: `cel-ringfx ${ringLvl >= 8 ? 'cel-ring-pulse' : ''}`
    }, els);
  }
  function body() {
    switch (t.type) {
      case 'cadete':
        // galón + estrella guía — primer ascenso
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
          d: "M34 58 L50 49 L66 58",
          fill: "none",
          stroke: glow,
          strokeWidth: "3.6",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }), /*#__PURE__*/React.createElement("path", {
          d: starPath(50, 38, 6),
          fill: "#fff"
        }));
      case 'piloto':
        // alas + órbita de vuelo
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
          cx: "50",
          cy: "50",
          rx: "24",
          ry: "9",
          fill: "none",
          stroke: B,
          strokeWidth: "1.6",
          opacity: "0.7",
          transform: "rotate(-18 50 50)"
        }), /*#__PURE__*/React.createElement("circle", {
          cx: "71",
          cy: "44",
          r: "2.4",
          fill: glow
        }), /*#__PURE__*/React.createElement("path", {
          d: "M47 50 Q33 43 18 49 Q32 52 47 56 Z",
          fill: glow
        }), /*#__PURE__*/React.createElement("path", {
          d: "M53 50 Q67 43 82 49 Q68 52 53 56 Z",
          fill: glow
        }), /*#__PURE__*/React.createElement("circle", {
          cx: "50",
          cy: "50",
          r: "5",
          fill: "#fff"
        }));
      case 'explorador':
        // rosa de los vientos / brújula sideral
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
          cx: "50",
          cy: "50",
          r: "22",
          fill: "none",
          stroke: B,
          strokeWidth: "1.4",
          strokeDasharray: "2 4",
          opacity: "0.7"
        }), /*#__PURE__*/React.createElement("path", {
          d: "M50 28 L55 50 L50 72 L45 50 Z",
          fill: glow
        }), /*#__PURE__*/React.createElement("path", {
          d: "M28 50 L50 45 L72 50 L50 55 Z",
          fill: "#fff",
          opacity: "0.9"
        }), /*#__PURE__*/React.createElement("circle", {
          cx: "50",
          cy: "50",
          r: "3",
          fill: ink
        }));
      case 'teniente':
        // dos barras de oficial + estrella
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
          d: starPath(50, 33, 5),
          fill: "#fff"
        }), /*#__PURE__*/React.createElement("rect", {
          x: "35",
          y: "46",
          width: "30",
          height: "5",
          rx: "2.5",
          fill: glow
        }), /*#__PURE__*/React.createElement("rect", {
          x: "35",
          y: "57",
          width: "30",
          height: "5",
          rx: "2.5",
          fill: glow
        }));
      case 'capitan':
        // timón de nave — al mando
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
          cx: "50",
          cy: "50",
          r: "16",
          fill: "none",
          stroke: glow,
          strokeWidth: "3"
        }), [0, 1, 2, 3, 4, 5].map(i => {
          const a = Math.PI / 3 * i;
          return /*#__PURE__*/React.createElement("line", {
            key: i,
            x1: (50 + Math.cos(a) * 5).toFixed(1),
            y1: (50 + Math.sin(a) * 5).toFixed(1),
            x2: (50 + Math.cos(a) * 23).toFixed(1),
            y2: (50 + Math.sin(a) * 23).toFixed(1),
            stroke: glow,
            strokeWidth: "2.4",
            strokeLinecap: "round"
          });
        }), /*#__PURE__*/React.createElement("circle", {
          cx: "50",
          cy: "50",
          r: "5",
          fill: "#fff"
        }));
      case 'flota':
        // formación de tres naves
        return /*#__PURE__*/React.createElement("g", {
          fill: glow,
          stroke: ink,
          strokeWidth: "0.6"
        }, /*#__PURE__*/React.createElement("path", {
          d: "M50 32 l8 15 l-16 0 Z"
        }), /*#__PURE__*/React.createElement("path", {
          d: "M33 54 l6.5 12 l-13 0 Z"
        }), /*#__PURE__*/React.createElement("path", {
          d: "M67 54 l6.5 12 l-13 0 Z"
        }));
      case 'comodoro':
        // alas amplias + estrella de escuadra
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
          d: starPath(50, 36, 5.5),
          fill: "#fff"
        }), /*#__PURE__*/React.createElement("path", {
          d: "M49 52 Q29 44 12 51 Q29 54 49 58 Z",
          fill: glow
        }), /*#__PURE__*/React.createElement("path", {
          d: "M51 52 Q71 44 88 51 Q71 54 51 58 Z",
          fill: glow
        }), /*#__PURE__*/React.createElement("circle", {
          cx: "50",
          cy: "53",
          r: "4.5",
          fill: "#fff",
          stroke: ink,
          strokeWidth: "1"
        }));
      case 'almirante':
        // almirante galáctico — ancla estelar sobre órbita + estrellas
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
          cx: "50",
          cy: "52",
          rx: "28",
          ry: "10",
          fill: "none",
          stroke: B,
          strokeWidth: "1.4",
          opacity: "0.55",
          transform: "rotate(-16 50 52)"
        }), /*#__PURE__*/React.createElement("path", {
          d: starPath(24, 44, 2.8),
          fill: glow
        }), /*#__PURE__*/React.createElement("path", {
          d: starPath(78, 58, 2.6),
          fill: glow
        }), /*#__PURE__*/React.createElement("g", {
          fill: "none",
          stroke: glow,
          strokeWidth: "3",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }, /*#__PURE__*/React.createElement("circle", {
          cx: "50",
          cy: "32",
          r: "4"
        }), /*#__PURE__*/React.createElement("line", {
          x1: "50",
          y1: "36",
          x2: "50",
          y2: "64"
        }), /*#__PURE__*/React.createElement("line", {
          x1: "40",
          y1: "45",
          x2: "60",
          y2: "45"
        }), /*#__PURE__*/React.createElement("path", {
          d: "M34 55 Q36 67 50 67 Q64 67 66 55"
        }), /*#__PURE__*/React.createElement("path", {
          d: "M31 53 L34 57 M69 53 L66 57"
        })));
      case 'galaxias':
        // galaxia espiral girando + cúmulo
        return /*#__PURE__*/React.createElement("g", {
          className: "cel-spin"
        }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
          cx: "50",
          cy: "50",
          rx: "28",
          ry: "11",
          fill: "none",
          stroke: B,
          strokeWidth: "1.4",
          opacity: "0.55",
          transform: "rotate(-22 50 50)"
        }), /*#__PURE__*/React.createElement("path", {
          d: "M50 50 Q70 42 78 53 M50 50 Q30 58 22 47",
          stroke: glow,
          strokeWidth: "3",
          fill: "none",
          strokeLinecap: "round",
          transform: "rotate(-22 50 50)"
        }), /*#__PURE__*/React.createElement("circle", {
          cx: "50",
          cy: "50",
          r: "6",
          fill: "#fff"
        }), ringStars(5, 27)));
      case 'granalmirante':
        // laurel + gran estrella — mando supremo
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
          fill: "none",
          stroke: glow,
          strokeWidth: "2.8",
          strokeLinecap: "round"
        }, /*#__PURE__*/React.createElement("path", {
          d: "M40 66 Q25 55 30 35"
        }), /*#__PURE__*/React.createElement("path", {
          d: "M60 66 Q75 55 70 35"
        })), /*#__PURE__*/React.createElement("path", {
          d: starPath(50, 46, 9),
          fill: "#fff"
        }), /*#__PURE__*/React.createElement("path", {
          d: starPath(36, 38, 3),
          fill: "#fff"
        }), /*#__PURE__*/React.createElement("path", {
          d: starPath(64, 38, 3),
          fill: "#fff"
        }));
      case 'constelacion':
        // constelación trazada
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
          d: "M28 42 L44 56 L60 34 L74 56 L54 68",
          fill: "none",
          stroke: glow,
          strokeWidth: "1.4",
          opacity: "0.75"
        }), [[28, 42, 3.2], [44, 56, 3.6], [60, 34, 4.8], [74, 56, 3.2], [54, 68, 3]].map(([x, y, r], i) => /*#__PURE__*/React.createElement("path", {
          key: i,
          d: starPath(x, y, r),
          fill: "#fff"
        })));
      case 'soberano':
        // corona + órbita — trono cósmico
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
          cx: "50",
          cy: "56",
          rx: "25",
          ry: "8",
          fill: "none",
          stroke: B,
          strokeWidth: "1.5",
          opacity: "0.6",
          transform: "rotate(-10 50 56)"
        }), /*#__PURE__*/React.createElement("path", {
          d: "M33 54 L36 36 L44 47 L50 31 L56 47 L64 36 L67 54 Z",
          fill: glow,
          stroke: glow,
          strokeWidth: "1",
          strokeLinejoin: "round"
        }), /*#__PURE__*/React.createElement("circle", {
          cx: "50",
          cy: "29",
          r: "2.8",
          fill: "#fff"
        }), /*#__PURE__*/React.createElement("circle", {
          cx: "36",
          cy: "36",
          r: "2",
          fill: "#fff"
        }), /*#__PURE__*/React.createElement("circle", {
          cx: "64",
          cy: "36",
          r: "2",
          fill: "#fff"
        }));
      case 'arquitecto':
        // estrella en forja dentro de compás — forja de soles
        return /*#__PURE__*/React.createElement("g", null, !locked && /*#__PURE__*/React.createElement("g", {
          className: "cel-rays"
        }, /*#__PURE__*/React.createElement("g", null, Array.from({
          length: 12
        }).map((_, i) => {
          const a = Math.PI * 2 / 12 * i;
          return /*#__PURE__*/React.createElement("line", {
            key: i,
            x1: (50 + Math.cos(a) * 13).toFixed(1),
            y1: (50 + Math.sin(a) * 13).toFixed(1),
            x2: (50 + Math.cos(a) * 30).toFixed(1),
            y2: (50 + Math.sin(a) * 30).toFixed(1),
            stroke: glow,
            strokeWidth: "2.4",
            strokeLinecap: "round",
            opacity: "0.8"
          });
        }))), /*#__PURE__*/React.createElement("path", {
          d: "M50 28 L70 64 L30 64 Z",
          fill: "none",
          stroke: B,
          strokeWidth: "1.8",
          opacity: "0.65",
          strokeLinejoin: "round"
        }), /*#__PURE__*/React.createElement("path", {
          d: starPath(50, 52, 8),
          fill: "#fff"
        }));
      case 'titan':
        // orbe sostenido por arcos de fuerza, girando — fuerza universal
        return /*#__PURE__*/React.createElement("g", {
          className: "cel-spin"
        }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
          d: "M22 38 Q13 50 22 62",
          fill: "none",
          stroke: glow,
          strokeWidth: "3.2",
          strokeLinecap: "round"
        }), /*#__PURE__*/React.createElement("path", {
          d: "M78 38 Q87 50 78 62",
          fill: "none",
          stroke: glow,
          strokeWidth: "3.2",
          strokeLinecap: "round"
        }), /*#__PURE__*/React.createElement("circle", {
          cx: "50",
          cy: "50",
          r: "15",
          fill: `url(#${rg})`,
          stroke: "#fff",
          strokeWidth: "1.5"
        }), /*#__PURE__*/React.createElement("circle", {
          cx: "44",
          cy: "44",
          r: "4.5",
          fill: "#fff",
          opacity: "0.5"
        }), ringStars(3, 30)));
      case 'avatar':
        // forma trascendente — supernova ascendida, antesala de la leyenda
        return /*#__PURE__*/React.createElement("g", null, !locked && /*#__PURE__*/React.createElement("g", {
          className: "cel-rays"
        }, /*#__PURE__*/React.createElement("g", null, Array.from({
          length: 16
        }).map((_, i) => {
          const a = Math.PI * 2 / 16 * i;
          return /*#__PURE__*/React.createElement("line", {
            key: i,
            x1: (50 + Math.cos(a) * 12).toFixed(1),
            y1: (50 + Math.sin(a) * 12).toFixed(1),
            x2: (50 + Math.cos(a) * 28).toFixed(1),
            y2: (50 + Math.sin(a) * 28).toFixed(1),
            stroke: glow,
            strokeWidth: i % 2 ? 1.3 : 2.4,
            strokeLinecap: "round",
            opacity: "0.85"
          });
        }))), /*#__PURE__*/React.createElement("circle", {
          cx: "50",
          cy: "50",
          r: "11",
          fill: `url(#${rg})`,
          stroke: "#fff",
          strokeWidth: "1.4"
        }), /*#__PURE__*/React.createElement("path", {
          d: starPath(50, 50, 7),
          fill: "#fff"
        }), ringStars(4, 30));
      case 'blackhole':
        // Leyenda — singularidad dentro del medallón (mismo estándar), animada
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
          d: "M30 50 A20 20 0 0 1 70 50",
          fill: "none",
          stroke: t.glow,
          strokeWidth: "3.6",
          opacity: "0.92",
          strokeLinecap: "round"
        }), /*#__PURE__*/React.createElement("path", {
          d: "M30 50 A20 20 0 0 1 70 50",
          fill: "none",
          stroke: "var(--kb-parch-glow)",
          strokeWidth: "1.4",
          opacity: "0.9",
          strokeLinecap: "round"
        }), /*#__PURE__*/React.createElement("ellipse", {
          cx: "50",
          cy: "50",
          rx: "30",
          ry: "7",
          fill: "none",
          stroke: t.glow,
          strokeWidth: "5",
          opacity: "0.9"
        }), /*#__PURE__*/React.createElement("ellipse", {
          className: "bh-orbit",
          cx: "50",
          cy: "50",
          rx: "30",
          ry: "7",
          fill: "none",
          stroke: "var(--kb-parch-glow)",
          strokeWidth: "2.6",
          pathLength: "100",
          strokeDasharray: "16 84",
          strokeLinecap: "round",
          opacity: "0.95"
        }), /*#__PURE__*/React.createElement("circle", {
          cx: "50",
          cy: "50",
          r: "12",
          fill: "#000"
        }), /*#__PURE__*/React.createElement("circle", {
          className: "bh-core-pulse",
          cx: "50",
          cy: "50",
          r: "13",
          fill: "none",
          stroke: t.glow,
          strokeWidth: "2.2"
        }));
      default:
        return /*#__PURE__*/React.createElement("circle", {
          cx: "50",
          cy: "50",
          r: "26",
          fill: `url(#${rg})`,
          stroke: t.ink,
          strokeWidth: "1.5"
        });
    }
  }
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    width: size,
    height: size,
    className: `kbv-emblem cel ${master ? 'master' : ''} ${fancy ? 'fancy' : ''} ${locked ? 'locked' : ''}`,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
    id: rg,
    cx: "42%",
    cy: "38%",
    r: "70%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: locked ? 'var(--kb-parch-5)' : glow
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.55",
    stopColor: A
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: B
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: coreG,
    cx: "50%",
    cy: "42%",
    r: "62%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: locked ? 'var(--kb-parch-6)' : 'var(--kb-void-1)'
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: locked ? 'var(--kb-parch-7)' : 'var(--kb-void-2)'
  })), ringLvl >= 10 && /*#__PURE__*/React.createElement("linearGradient", {
    id: prismId,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "var(--kb-spark-red)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.18",
    stopColor: "var(--kb-spark-amber)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.36",
    stopColor: "var(--kb-spark-yellow)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.54",
    stopColor: "var(--kb-spark-green)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.72",
    stopColor: "var(--kb-rank-accent-1)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.86",
    stopColor: "var(--kb-rank-accent-2)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "var(--kb-rank-accent-3)"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "46",
    fill: `url(#${rg})`,
    stroke: ink,
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "38",
    fill: `url(#${coreG})`,
    stroke: ink,
    strokeWidth: "0.8",
    opacity: "0.92"
  }), !locked && /*#__PURE__*/React.createElement("g", null, [[34, 30], [64, 28], [28, 52], [72, 56], [40, 70], [66, 72], [50, 24], [24, 40], [76, 42]].map(([sx, sy], k) => /*#__PURE__*/React.createElement("circle", {
    key: k,
    cx: sx,
    cy: sy,
    r: k % 3 === 0 ? 1.3 : 0.8,
    fill: "#fff",
    opacity: 0.45 + k % 3 * 0.18
  }))), !locked && /*#__PURE__*/React.createElement("g", {
    className: "cel-base"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "42",
    fill: "none",
    stroke: glow,
    strokeWidth: "1",
    strokeDasharray: "1.5 6",
    opacity: "0.55"
  })), body(), ringFx(), locked && /*#__PURE__*/React.createElement("g", {
    opacity: "0.82"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "42",
    y: "49",
    width: "16",
    height: "13",
    rx: "2.5",
    fill: "var(--kb-rank-accent-4)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M44 49 V44 a6 6 0 0 1 12 0 V49",
    fill: "none",
    stroke: "var(--kb-rank-accent-4)",
    strokeWidth: "2.6"
  })));
}

// ── Emblema de rango (insignia militar, niveles 1–100) ─────────
function RankEmblem({
  level = 1,
  size = 50,
  locked = false
}) {
  const tier = rankTier(level);
  const g = rankGroup(tier);
  const uid = React.useMemo(() => `re${++__emUid}`, []);
  const A = locked ? 'var(--kb-parch-1)' : g.a,
    B = locked ? 'var(--kb-parch-3)' : g.b,
    ink = locked ? 'var(--kb-parch-4)' : g.ink;
  const shieldD = 'M50 7 L86 21 V51 Q86 79 50 93 Q14 79 14 51 V21 Z';
  const anim = locked ? null : g.anim || null; // 'shine' | 'oil'
  const animated = !!anim;
  const oil = anim === 'oil';
  function insignia() {
    const els = [];
    if (g.t === 'chevron') {
      for (let i = 0; i < g.c; i++) els.push(/*#__PURE__*/React.createElement("path", {
        key: i,
        d: `M34 ${36 + i * 7} L50 ${30 + i * 7} L66 ${36 + i * 7}`,
        fill: "none",
        stroke: ink,
        strokeWidth: "3",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }));
    } else if (g.t === 'bar') {
      for (let i = 0; i < g.c; i++) els.push(/*#__PURE__*/React.createElement("rect", {
        key: i,
        x: "34",
        y: 34 + i * 8,
        width: "32",
        height: "4.5",
        rx: "2",
        fill: ink
      }));
    } else if (g.t === 'star') {
      const sx = 50 - (g.c - 1) * 9 / 2;
      for (let i = 0; i < g.c; i++) els.push(/*#__PURE__*/React.createElement("path", {
        key: i,
        d: starPath(sx + i * 9, 44, 5.5),
        fill: ink
      }));
    } else if (g.t === 'eagle') {
      els.push(/*#__PURE__*/React.createElement("g", {
        key: "e",
        fill: ink
      }, /*#__PURE__*/React.createElement("path", {
        d: "M50 36 Q40 30 28 36 Q40 38 50 42 Q60 38 72 36 Q60 30 50 36 Z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "50",
        cy: "40",
        r: "3"
      })));
      const sx = 50 - (g.c - 1) * 8 / 2;
      for (let i = 0; i < g.c; i++) els.push(/*#__PURE__*/React.createElement("path", {
        key: 's' + i,
        d: starPath(sx + i * 8, 54, 3.6),
        fill: ink
      }));
    } else if (g.t === 'diamond') {
      // piedras facetadas (Diamante / Esmeralda)
      const sx = 50 - (g.c - 1) * 15 / 2;
      for (let i = 0; i < g.c; i++) {
        const cx = sx + i * 15;
        els.push(/*#__PURE__*/React.createElement("g", {
          key: i
        }, /*#__PURE__*/React.createElement("path", {
          d: `M${cx} 35 L${cx + 8} 45 L${cx} 57 L${cx - 8} 45 Z`,
          fill: ink
        }), /*#__PURE__*/React.createElement("path", {
          d: `M${cx - 8} 45 H${cx + 8} M${cx} 35 V57`,
          stroke: A,
          strokeWidth: "0.9",
          opacity: "0.75"
        })));
      }
    } else if (g.t === 'crown') {
      // corona (Rubí / Damasco)
      els.push(/*#__PURE__*/React.createElement("path", {
        key: "c",
        d: "M31 57 L34 39 L42 49 L50 35 L58 49 L66 39 L69 57 Z",
        fill: ink,
        stroke: ink,
        strokeWidth: "1",
        strokeLinejoin: "round"
      }));
      els.push(/*#__PURE__*/React.createElement("rect", {
        key: "cb",
        x: "32",
        y: "57",
        width: "36",
        height: "5",
        rx: "1.6",
        fill: ink
      }));
      els.push(/*#__PURE__*/React.createElement("circle", {
        key: "g1",
        cx: "34",
        cy: "37",
        r: "2.3",
        fill: A
      }));
      els.push(/*#__PURE__*/React.createElement("circle", {
        key: "g2",
        cx: "50",
        cy: "33",
        r: "2.8",
        fill: A
      }));
      els.push(/*#__PURE__*/React.createElement("circle", {
        key: "g3",
        cx: "66",
        cy: "37",
        r: "2.3",
        fill: A
      }));
    } else {
      // wreath
      els.push(/*#__PURE__*/React.createElement("g", {
        key: "w",
        fill: "none",
        stroke: ink,
        strokeWidth: "2.4",
        strokeLinecap: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M40 56 Q28 48 32 34"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M60 56 Q72 48 68 34"
      })));
      const sx = 50 - g.c * 8 / 2;
      for (let i = 0; i <= g.c; i++) els.push(/*#__PURE__*/React.createElement("path", {
        key: 's' + i,
        d: starPath(sx + i * 8, 44, 5),
        fill: ink
      }));
    }
    return /*#__PURE__*/React.createElement("g", {
      opacity: "0.95"
    }, els);
  }
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    width: size,
    height: size,
    className: `kbv-emblem rank ${locked ? 'locked' : ''} ${anim ? 'anim-' + anim : ''}`,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("defs", null, oil ? /*#__PURE__*/React.createElement("linearGradient", {
    id: uid,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "var(--kb-rank-accent-5)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.28",
    stopColor: "var(--kb-rank-accent-6)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.52",
    stopColor: "var(--kb-rank-accent-7)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.76",
    stopColor: "var(--kb-rank-accent-8)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "var(--kb-rank-accent-9)"
  })) : /*#__PURE__*/React.createElement("linearGradient", {
    id: uid,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: A
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: B
  })), animated && /*#__PURE__*/React.createElement("clipPath", {
    id: uid + 'c'
  }, /*#__PURE__*/React.createElement("path", {
    d: shieldD
  })), animated && /*#__PURE__*/React.createElement("linearGradient", {
    id: uid + 's',
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#fff",
    stopOpacity: "0"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.5",
    stopColor: "#fff",
    stopOpacity: "0.85"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#fff",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: shieldD,
    fill: `url(#${uid})`,
    stroke: ink,
    strokeWidth: "2.2"
  }), animated && /*#__PURE__*/React.createElement("g", {
    clipPath: `url(#${uid}c)`
  }, oil && [16, 26, 36, 46, 56, 66, 78].map((y, k) => /*#__PURE__*/React.createElement("path", {
    key: k,
    d: `M8 ${y} Q26 ${y - 6} 50 ${y} T92 ${y}`,
    fill: "none",
    stroke: "var(--kb-rank-accent-10)",
    strokeWidth: "2.4",
    opacity: "0.22"
  })), /*#__PURE__*/React.createElement("g", {
    className: "dmsc-sheen"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "-14",
    y: "0",
    width: "20",
    height: "100",
    fill: `url(#${uid}s)`,
    transform: "skewX(-16)"
  }))), /*#__PURE__*/React.createElement("path", {
    d: shieldD,
    fill: "none",
    stroke: "rgba(255,255,255,0.4)",
    strokeWidth: "1",
    transform: "translate(0,2) scale(0.88)",
    style: {
      transformOrigin: '50px 50px'
    }
  }), insignia(), /*#__PURE__*/React.createElement("text", {
    x: "50",
    y: "80",
    textAnchor: "middle",
    fontFamily: "var(--kb-f-mono), monospace",
    fontWeight: "800",
    fontSize: "15",
    fill: ink
  }, level), locked && /*#__PURE__*/React.createElement("g", {
    opacity: "0.82"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "42",
    y: "49",
    width: "16",
    height: "13",
    rx: "2.5",
    fill: "var(--kb-rank-accent-4)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M44 49 V44 a6 6 0 0 1 12 0 V49",
    fill: "none",
    stroke: "var(--kb-rank-accent-4)",
    strokeWidth: "2.6"
  })));
}

// Hitos del "Trayecto hacia deidad" — cada 100 niveles asciendes un escalón divino.
const PARAGON_REWARDS = ['Aura divina para Kibo', 'Halo de estrellas', 'Manto cósmico', 'Corona de nova', 'Aliento estelar', 'Cetro de luz', 'Trono del vacío', 'Forma ascendida', 'Avatar de deidad'];

// ── Badge para header/hero ─────────────────────────────────────
function EmblemBadge({
  completed = 0,
  level = 1,
  master = false,
  size = 26
}) {
  const eq = getEquippedEmblem();
  if (master && eq) {
    if (eq[0] === 'p') return /*#__PURE__*/React.createElement(PrestigeEmblem, {
      tier: parseInt(eq.slice(1), 10) || PRESTIGE_MAX,
      size: size
    });
    if (eq[0] === 'r') return /*#__PURE__*/React.createElement(RankEmblem, {
      level: parseInt(eq.slice(1), 10) || 1,
      size: size
    });
  }
  if (completed >= 1) return /*#__PURE__*/React.createElement(PrestigeEmblem, {
    tier: completed,
    size: size
  });
  return /*#__PURE__*/React.createElement(RankEmblem, {
    level: level,
    size: size
  });
}
function PrestigeBadge(props) {
  return /*#__PURE__*/React.createElement(EmblemBadge, props);
}

// ── Línea de tiempo arcoíris del paragón (dentro de Gargantúa) ──
function ParagonTimeline({
  paragonLevel
}) {
  const reached = Math.floor(paragonLevel / 100);
  const nodes = PARAGON_REWARDS.slice(0, 8);
  const pct = Math.min(100, reached / nodes.length * 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "pp-paragon-tl cosmic"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ptl-stars",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ptl-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbv-eyebrow"
  }, "Trayecto hacia deidad"), /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, "Cada 100 niveles asciendes un escal\xF3n: de Leyenda hacia la deidad")), /*#__PURE__*/React.createElement("div", {
    className: "ptl-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ptl-line"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ptl-line filled",
    style: {
      width: `calc(${pct}% )`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "ptl-nodes"
  }, nodes.map((r, i) => {
    const revealed = i < reached;
    const here = i === reached;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `ptl-node ${revealed ? 'on' : ''} ${here ? 'here' : ''}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "ptl-dot"
    }, revealed ? /*#__PURE__*/React.createElement(KIcon, {
      name: "check",
      size: 10
    }) : here ? /*#__PURE__*/React.createElement(KIcon, {
      name: "sparkle",
      size: 10
    }) : ''), /*#__PURE__*/React.createElement("span", {
      className: "ptl-lvl"
    }, "+", (i + 1) * 100), /*#__PURE__*/React.createElement("span", {
      className: "ptl-name"
    }, revealed ? r : here ? 'En curso…' : 'Por venir'));
  }))));
}

// ── Panel de progresión (rangos + viaje de prestigio) ──────────
function ProgressPanel({
  completed,
  level,
  master,
  paragonLevel = 0,
  onPrestige
}) {
  usePrestigeRepaint();
  const prestiged = completed >= 1;
  const [tab, setTab] = React.useState(prestiged ? 'prestige' : 'rank');
  const [equipped, setEquipped] = React.useState(() => getEquippedEmblem());
  function equip(key) {
    if (!master) return;
    setEquipped(key);
    setEquippedEmblem(key);
  }
  const atCap = level >= PRESTIGE_LEVELS;
  const pct = Math.round(level / PRESTIGE_LEVELS * 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-prestige-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pp-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pp-current"
  }, prestiged ? /*#__PURE__*/React.createElement(PrestigeEmblem, {
    tier: completed,
    size: 66
  }) : /*#__PURE__*/React.createElement(RankEmblem, {
    level: level,
    size: 66
  }), /*#__PURE__*/React.createElement("div", {
    className: "pp-current-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pp-eyebrow"
  }, master ? 'Prestigio máximo · Paragón' : prestiged ? `Prestigio ${completed} de ${PRESTIGE_MAX}` : 'Rango · niveles 1–100'), /*#__PURE__*/React.createElement("span", {
    className: "pp-rank"
  }, master ? `${prestigeName(PRESTIGE_MAX)} · grado supremo` : prestiged ? `P${completed} · ${prestigeName(completed)} · ${CELESTIAL[completed - 1].sub}` : `${RANK_NAMES[rankTier(level)]} · Nivel ${level}`), master ? /*#__PURE__*/React.createElement("span", {
    className: "pp-sub"
  }, "Nivel de parag\xF3n ", /*#__PURE__*/React.createElement("strong", null, paragonLevel), " \xB7 sin tope.") : prestiged ? /*#__PURE__*/React.createElement("span", {
    className: "pp-sub"
  }, "Nivel ", level, "/", PRESTIGE_LEVELS, " \xB7 faltan ", /*#__PURE__*/React.createElement("strong", null, PRESTIGE_LEVELS - level), " para ", completed + 1 > PRESTIGE_MAX ? 'el Maestro' : `el prestigio ${completed + 1}`, " (", (CELESTIAL[completed] || CELESTIAL[CELESTIAL.length - 1]).name, ")") : /*#__PURE__*/React.createElement("span", {
    className: "pp-sub"
  }, "Nivel ", level, "/100 \xB7 faltan ", /*#__PURE__*/React.createElement("strong", null, 100 - level), " niveles para tu ", /*#__PURE__*/React.createElement("strong", null, "primer prestigio"), "."))), /*#__PURE__*/React.createElement("div", {
    className: "pp-progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: `pp-track ${master ? 'paragon' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: master ? `${paragonLevel % 100}%` : `${pct}%`
    }
  })), !master ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "pp-prestige-btn",
    onClick: onPrestige,
    disabled: !atCap,
    title: atCap ? 'Reinicia a Nv. 1 y avanza en el viaje' : 'Llega al Nv. 100 para prestigiar'
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "repeat",
    size: 13
  }), " ", atCap ? 'Prestigiar' : 'Nv. 100 para prestigiar') : /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta",
    style: {
      whiteSpace: 'nowrap'
    }
  }, "Pr\xF3ximo hito en ", /*#__PURE__*/React.createElement("strong", null, 100 - paragonLevel % 100), " niv."))), prestiged && /*#__PURE__*/React.createElement("div", {
    className: "pp-tabs"
  }, /*#__PURE__*/React.createElement("button", {
    className: tab === 'prestige' ? 'on' : '',
    onClick: () => setTab('prestige')
  }, "Viaje de prestigio"), /*#__PURE__*/React.createElement("button", {
    className: tab === 'rank' ? 'on' : '',
    onClick: () => setTab('rank')
  }, "Rangos 1\u2013100")), /*#__PURE__*/React.createElement("div", {
    className: "pp-gallery-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbv-eyebrow"
  }, tab === 'prestige' ? `El viaje · ${PRESTIGE_MAX} destinos` : 'Insignias de rango', " ", master ? '· toca para equipar' : prestiged ? '· tu colección' : '· se ganan al subir'), !master && /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, "Equipar a gusto: exclusivo de Maestro")), tab === 'prestige' ? /*#__PURE__*/React.createElement("div", {
    className: "pp-gallery"
  }, CELESTIAL.map(c => {
    const unlocked = c.n <= completed || master;
    const key = 'p' + c.n;
    const isEq = master ? equipped === key || !equipped && c.n === PRESTIGE_MAX : c.n === completed;
    return /*#__PURE__*/React.createElement("button", {
      key: c.n,
      type: "button",
      className: `pp-emblem ${unlocked ? 'unlocked' : 'locked'} ${isEq ? 'equipped' : ''} ${master ? 'pickable' : ''} ${c.master ? 'is-master' : ''}`,
      onClick: () => equip(key),
      disabled: !master && !unlocked,
      title: unlocked ? `${c.n === PRESTIGE_MAX ? 'Maestro' : 'Prestigio ' + c.n} · ${prestigeName(c.n)} (${c.sub})` : `Bloqueado · prestigio ${c.n}`,
      style: {
        backgroundColor: "rgb(247, 247, 248)",
        textAlign: "left",
        borderWidth: "1px",
        borderStyle: "none",
        borderColor: "rgb(255, 255, 255)"
      }
    }, /*#__PURE__*/React.createElement(PrestigeEmblem, {
      tier: c.n,
      locked: !unlocked,
      size: 46
    }), /*#__PURE__*/React.createElement("span", {
      className: "pp-emblem-name"
    }, prestigeName(c.n)), isEq && /*#__PURE__*/React.createElement("span", {
      className: "pp-equipped-tag"
    }, /*#__PURE__*/React.createElement(KIcon, {
      name: "check",
      size: 9
    })));
  })) : /*#__PURE__*/React.createElement("div", {
    className: "pp-gallery ranks"
  }, Array.from({
    length: 20
  }).map((_, i) => {
    const lvl = (i + 1) * 5;
    const reachedLevel = prestiged ? 100 : level;
    const unlocked = lvl <= reachedLevel;
    const key = 'r' + lvl;
    const isEq = master && equipped === key;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: `pp-emblem ${unlocked ? 'unlocked' : 'locked'} ${isEq ? 'equipped' : ''} ${master ? 'pickable' : ''}`,
      onClick: () => equip(key),
      disabled: !master || !unlocked,
      title: unlocked ? `${RANK_NAMES[i]} · Nivel ${lvl}` : `Bloqueado · Nv. ${lvl}`
    }, /*#__PURE__*/React.createElement(RankEmblem, {
      level: lvl,
      locked: !unlocked,
      size: 46
    }), /*#__PURE__*/React.createElement("span", {
      className: "pp-emblem-name"
    }, RANK_NAMES[i]), isEq && /*#__PURE__*/React.createElement("span", {
      className: "pp-equipped-tag"
    }, /*#__PURE__*/React.createElement(KIcon, {
      name: "check",
      size: 9
    })));
  })), !prestiged && /*#__PURE__*/React.createElement("div", {
    className: "pp-next-reward"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pp-nr-ico"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "sparkle",
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    className: "pp-nr-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pp-nr-label"
  }, "Al llegar al Nivel 100 desbloqueas"), /*#__PURE__*/React.createElement("span", {
    className: "pp-nr-text"
  }, "El Prestigio \xB7 asciendes a Cadete Estelar + el escalaf\xF3n espacial de emblemas"))), prestiged && !master && /*#__PURE__*/React.createElement("div", {
    className: "pp-next-reward"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pp-nr-ico"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "sparkle",
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    className: "pp-nr-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pp-nr-label"
  }, "Tu pr\xF3ximo destino"), /*#__PURE__*/React.createElement("span", {
    className: "pp-nr-text"
  }, "Prestigio ", completed + 1, ": ", prestigeName(Math.min(completed + 1, PRESTIGE_MAX)), " \xB7 ", (CELESTIAL[completed] || CELESTIAL[CELESTIAL.length - 1]).sub))), master && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pp-master-perks"
  }, ['Equipar cualquier emblema', 'Niveles sin tope (paragón)', 'Ascensos cada 100 niv.', 'Leyenda animada'].map(p => /*#__PURE__*/React.createElement("span", {
    key: p,
    className: "pp-perk"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 11
  }), " ", p))), /*#__PURE__*/React.createElement(ParagonTimeline, {
    paragonLevel: paragonLevel
  })));
}
function usePrestigeRepaint() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    const h = () => force();
    window.addEventListener('kibo:prestige-change', h);
    return () => window.removeEventListener('kibo:prestige-change', h);
  }, []);
}
function PrestigePanel(props) {
  return /*#__PURE__*/React.createElement(ProgressPanel, props);
}
Object.assign(window, {
  prestigeName,
  PRESTIGE_LEVELS,
  PRESTIGE_MAX,
  PRESTIGE_RANKS,
  CELESTIAL,
  RANK_NAMES,
  rankTier,
  rankGroup,
  prestigeInfo,
  PrestigeEmblem,
  RankEmblem,
  EmblemBadge,
  PrestigeBadge,
  ProgressPanel,
  PrestigePanel,
  getEquippedEmblem,
  setEquippedEmblem
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/prestige-system.jsx", error: String((e && e.message) || e) }); }

// reference/app/prestigio-nombres.jsx
try { (() => {
// prestigio-nombres.jsx — Las familias de prestigio.
//
// Los 16 prestigios se llamaban «Cadete Estelar → Gran Almirante → Leyenda»:
// un escalafón militar, que es una lectura muy concreta del mérito y no le
// habla a todo el mundo. El nombre pasa a ser COSMÉTICO: la lógica sigue
// siendo el número (1…16), y encima va la familia que elijas — o la que
// escribas tú. Cada familia es un paquete vendible.

const PRESTIGE_FAMILIES = [{
  id: 'pf-militar',
  name: 'Escalafón estelar',
  cost: 0,
  currency: 'gem',
  free: true,
  desc: 'El de siempre: una flota que asciende de cadete a leyenda.',
  names: ['Cadete Estelar', 'Piloto Orbital', 'Explorador Sideral', 'Teniente Sideral', 'Capitán de Nave', 'Comandante de Flota', 'Comodoro Galáctico', 'Almirante', 'Almirante de Galaxias', 'Gran Almirante', 'Señor de Constelaciones', 'Soberano del Cosmos', 'Arquitecto de Estrellas', 'Titán Cósmico', 'Avatar Cósmico', 'Leyenda']
}, {
  id: 'pf-natura',
  name: 'Estaciones',
  cost: 120,
  currency: 'gem',
  desc: 'Crecer como crece un bosque: de semilla a ecosistema.',
  names: ['Semilla', 'Brote', 'Retoño', 'Raíz Firme', 'Tallo', 'Rama', 'Copa', 'Floración', 'Fruto', 'Cosecha', 'Roble', 'Arboleda', 'Bosque', 'Selva', 'Cordillera', 'Ecosistema']
}, {
  id: 'pf-cosmos',
  name: 'Cosmos',
  cost: 120,
  currency: 'gem',
  desc: 'Sin jerarquía militar: solo materia haciéndose más grande.',
  names: ['Polvo', 'Meteoro', 'Cometa', 'Asteroide', 'Luna', 'Planeta', 'Gigante Gaseoso', 'Estrella', 'Gigante Roja', 'Supernova', 'Púlsar', 'Nebulosa', 'Cúmulo', 'Galaxia', 'Cúmulo Galáctico', 'Universo']
}, {
  id: 'pf-oficios',
  name: 'Maestrías',
  cost: 120,
  currency: 'gem',
  desc: 'El camino de un taller: aprendiz, oficial, maestro.',
  names: ['Aprendiz', 'Ayudante', 'Oficial', 'Artesano', 'Artífice', 'Especialista', 'Perito', 'Maestro', 'Maestro Mayor', 'Contramaestre', 'Decano', 'Mentor', 'Autoridad', 'Eminencia', 'Escuela Propia', 'Legado']
}, {
  id: 'pf-mito',
  name: 'Mitología',
  cost: 140,
  currency: 'gem',
  desc: 'De mortal a mito, sin ejércitos de por medio.',
  names: ['Peregrino', 'Buscador', 'Portador', 'Guardián', 'Vidente', 'Oráculo', 'Heraldo', 'Héroe', 'Semidiós', 'Numen', 'Titán', 'Deidad Menor', 'Deidad', 'Panteón', 'Primigenio', 'Mito']
}, {
  id: 'pf-minimal',
  name: 'Minimalista',
  cost: 0,
  currency: 'gem',
  free: true,
  desc: 'Sin épica: el número y el material, nada más.',
  names: ['Bronce I', 'Bronce II', 'Bronce III', 'Plata I', 'Plata II', 'Plata III', 'Oro I', 'Oro II', 'Oro III', 'Platino I', 'Platino II', 'Platino III', 'Diamante I', 'Diamante II', 'Diamante III', 'Maestro']
}, {
  id: 'pf-neutro',
  name: 'Neutro',
  cost: 90,
  currency: 'gem',
  desc: 'Ni rangos ni épica: vueltas al mismo camino.',
  names: ['Primera vuelta', 'Segunda vuelta', 'Tercera vuelta', 'Cuarta vuelta', 'Quinta vuelta', 'Sexta vuelta', 'Séptima vuelta', 'Octava vuelta', 'Novena vuelta', 'Décima vuelta', 'Undécima vuelta', 'Duodécima vuelta', 'Decimotercera', 'Decimocuarta', 'Decimoquinta', 'Vuelta completa']
}];
const PF_KEY = 'kibo:prestige-family';
const PF_OWNED_KEY = 'kibo:prestige-owned';
const PF_CUSTOM_KEY = 'kibo:prestige-custom';
// «Escribe el tuyo» es caro a propósito: renombrar los 16 es la personalización
// más visible que existe en el perfil.
const PF_CUSTOM_COST = 400;
function pfFamilies() {
  return PRESTIGE_FAMILIES;
}
function pfById(id) {
  return PRESTIGE_FAMILIES.find(f => f.id === id) || PRESTIGE_FAMILIES[0];
}
function pfOwned() {
  const base = PRESTIGE_FAMILIES.filter(f => f.free).map(f => f.id);
  try {
    return new Set(base.concat(JSON.parse(localStorage.getItem(PF_OWNED_KEY) || '[]')));
  } catch (_) {
    return new Set(base);
  }
}
function pfOwn(id) {
  const s = [...pfOwned()].filter(x => !pfById(x).free);
  if (!s.includes(id)) s.push(id);
  try {
    localStorage.setItem(PF_OWNED_KEY, JSON.stringify(s));
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent('kibo:prestige-change'));
  } catch (_) {}
}
function pfActive() {
  try {
    return localStorage.getItem(PF_KEY) || 'pf-militar';
  } catch (_) {
    return 'pf-militar';
  }
}
function pfSetActive(id) {
  try {
    localStorage.setItem(PF_KEY, id);
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent('kibo:prestige-change'));
  } catch (_) {}
}
function pfCustom() {
  try {
    const v = JSON.parse(localStorage.getItem(PF_CUSTOM_KEY) || 'null');
    return Array.isArray(v) ? v : null;
  } catch (_) {
    return null;
  }
}
function pfSetCustom(list) {
  try {
    if (list) localStorage.setItem(PF_CUSTOM_KEY, JSON.stringify(list));else localStorage.removeItem(PF_CUSTOM_KEY);
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent('kibo:prestige-change'));
  } catch (_) {}
}
// Los 16 nombres vigentes: los tuyos si los escribiste, si no los de la familia.
function pfNames() {
  const custom = pfCustom();
  if (custom && custom.length === 16) return custom;
  return pfById(pfActive()).names;
}
function pfName(n) {
  return pfNames()[Math.max(0, Math.min(15, (n | 0) - 1))];
}
function usePrestigeNames() {
  const [v, set] = React.useState(() => ({
    names: pfNames(),
    family: pfActive(),
    custom: !!pfCustom()
  }));
  React.useEffect(() => {
    const h = () => set({
      names: pfNames(),
      family: pfActive(),
      custom: !!pfCustom()
    });
    window.addEventListener('kibo:prestige-change', h);
    window.addEventListener('storage', h);
    return () => {
      window.removeEventListener('kibo:prestige-change', h);
      window.removeEventListener('storage', h);
    };
  }, []);
  return v;
}

// ── Divisas ──────────────────────────────────────────────────────
// La materia oscura y las monedas son las dos recompensas que más se miran:
// su nombre, su glifo y su color se personalizan; lo que valen, no.
const CURRENCY_SKINS = {
  dark: [{
    id: 'cs-obsidiana',
    name: 'Materia oscura',
    glyph: 'orb',
    color: 'var(--kb-void-1)',
    cost: 0,
    free: true,
    desc: 'La de fábrica: obsidiana con contorno orbitando.'
  }, {
    id: 'cs-magia',
    name: 'Magia',
    glyph: 'spark',
    color: 'var(--area-community)',
    cost: 60,
    desc: 'Chispa violeta.'
  }, {
    id: 'cs-esencia',
    name: 'Esencia',
    glyph: 'drop',
    color: 'var(--kb-primary)',
    cost: 60,
    desc: 'Gota de gel, como KIBO.'
  }, {
    id: 'cs-nucleo',
    name: 'Núcleo',
    glyph: 'core',
    color: 'var(--kb-streak)',
    cost: 90,
    desc: 'Brasa con anillo caliente.'
  }],
  coin: [{
    id: 'cs-kibo',
    name: 'Monedas Kibo',
    glyph: 'coin',
    color: 'var(--kb-coin)',
    cost: 0,
    free: true,
    desc: 'La K acuñada de siempre.'
  }, {
    id: 'cs-fichas',
    name: 'Fichas',
    glyph: 'chip',
    color: 'var(--kb-gem)',
    cost: 40,
    desc: 'Ficha plana de dos tonos.'
  }, {
    id: 'cs-hojas',
    name: 'Hojas',
    glyph: 'leaf',
    color: 'var(--kb-good)',
    cost: 40,
    desc: 'Para quien no quiere dinero en su vida.'
  }]
};
const CS_KEY = 'kibo:currency-skin',
  CS_OWNED_KEY = 'kibo:currency-owned',
  CS_NAME_KEY = 'kibo:currency-names';
function csGet(kind) {
  try {
    const v = JSON.parse(localStorage.getItem(CS_KEY) || '{}');
    return CURRENCY_SKINS[kind].find(s => s.id === v[kind]) || CURRENCY_SKINS[kind][0];
  } catch (_) {
    return CURRENCY_SKINS[kind][0];
  }
}
function csSet(kind, id) {
  let v = {};
  try {
    v = JSON.parse(localStorage.getItem(CS_KEY) || '{}');
  } catch (_) {}
  v[kind] = id;
  try {
    localStorage.setItem(CS_KEY, JSON.stringify(v));
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent('kibo:currency-change'));
  } catch (_) {}
}
function csOwned() {
  const base = [].concat(CURRENCY_SKINS.dark, CURRENCY_SKINS.coin).filter(s => s.free).map(s => s.id);
  try {
    return new Set(base.concat(JSON.parse(localStorage.getItem(CS_OWNED_KEY) || '[]')));
  } catch (_) {
    return new Set(base);
  }
}
function csOwn(id) {
  const s = [...csOwned()];
  if (!s.includes(id)) s.push(id);
  try {
    localStorage.setItem(CS_OWNED_KEY, JSON.stringify(s));
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent('kibo:currency-change'));
  } catch (_) {}
}
function csNames() {
  try {
    return JSON.parse(localStorage.getItem(CS_NAME_KEY) || '{}');
  } catch (_) {
    return {};
  }
}
function csSetName(kind, name) {
  const v = {
    ...csNames(),
    [kind]: name || undefined
  };
  try {
    localStorage.setItem(CS_NAME_KEY, JSON.stringify(v));
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent('kibo:currency-change'));
  } catch (_) {}
}
function csLabel(kind) {
  return csNames()[kind] || csGet(kind).name;
}
function useCurrencySkin() {
  const [v, set] = React.useState(() => ({
    dark: csGet('dark'),
    coin: csGet('coin'),
    names: csNames()
  }));
  React.useEffect(() => {
    const h = () => set({
      dark: csGet('dark'),
      coin: csGet('coin'),
      names: csNames()
    });
    window.addEventListener('kibo:currency-change', h);
    window.addEventListener('storage', h);
    return () => {
      window.removeEventListener('kibo:currency-change', h);
      window.removeEventListener('storage', h);
    };
  }, []);
  return v;
}
Object.assign(window, {
  PRESTIGE_FAMILIES,
  PF_CUSTOM_COST,
  pfFamilies,
  pfById,
  pfOwned,
  pfOwn,
  pfActive,
  pfSetActive,
  pfCustom,
  pfSetCustom,
  pfNames,
  pfName,
  usePrestigeNames,
  CURRENCY_SKINS,
  csGet,
  csSet,
  csOwned,
  csOwn,
  csNames,
  csSetName,
  csLabel,
  useCurrencySkin
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/prestigio-nombres.jsx", error: String((e && e.message) || e) }); }

// reference/app/progress-charts.jsx
try { (() => {
// progress-charts.jsx — Primitivas de gráficos + filtro de periodo reutilizable.
// Estándar de toda la app: <PeriodFilter> reusa el patrón de Finanzas (.kbv-fin-period
// + .range-tabs). Los datos responden al periodo seleccionado. Todos los gráficos
// llevan padding interno para no pegarse a los bordes.

// ── Periodos estándar ──────────────────────────────────────────
const KB_PERIODS = [{
  id: '7d',
  l: 'Semana',
  days: 7,
  note: 'Últimos 7 días',
  n: 7,
  unitLabel: 'día'
}, {
  id: '30d',
  l: 'Mes',
  days: 30,
  note: 'Últimos 30 días',
  n: 30,
  unitLabel: 'día'
}, {
  id: '90d',
  l: '3 meses',
  days: 90,
  note: 'Últimos 90 días',
  n: 13,
  unitLabel: 'semana'
}, {
  id: '365d',
  l: 'Año',
  days: 365,
  note: 'Últimos 12 meses',
  n: 12,
  unitLabel: 'mes'
}, {
  id: 'all',
  l: 'Todo',
  days: 730,
  note: 'Histórico completo',
  n: 24,
  unitLabel: 'mes'
}];
function periodMeta(id) {
  return KB_PERIODS.find(p => p.id === id) || KB_PERIODS[1];
}
function usePeriod(initial = '30d') {
  const [period, setPeriod] = React.useState(initial);
  return [period, setPeriod, periodMeta(period)];
}

// Filtro de periodo — reutilizable. Mismo lenguaje visual que Finanzas.
function PeriodFilter({
  period,
  onChange,
  label = 'Periodo de los indicadores',
  periods = KB_PERIODS,
  note
}) {
  const meta = periodMeta(period);
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-fin-period kbv-period-filter"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "calendar",
    size: 13
  }), " ", label), /*#__PURE__*/React.createElement("div", {
    className: "range-tabs"
  }, periods.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    className: period === p.id ? 'on' : '',
    onClick: () => onChange(p.id)
  }, p.l))), /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta period-note"
  }, note || meta.note));
}

// ── Datos sintéticos deterministas ─────────────────────────────
function mulberry(seed) {
  return function () {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DOW_ES = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// Genera una serie acorde al periodo. base=valor medio aprox, growth=tendencia.
function genSeries(period, {
  seed = 7,
  base = 300,
  growth = 0.18,
  vol = 0.28
} = {}) {
  const meta = periodMeta(period);
  const n = meta.n;
  const rnd = mulberry(seed + n * 13);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const trend = base * (1 + growth * (i / Math.max(1, n - 1)));
    const noise = 1 + (rnd() - 0.5) * 2 * vol;
    const v = Math.max(0, Math.round(trend * noise));
    pts.push({
      i,
      v,
      label: pointLabel(meta, i, n)
    });
  }
  const max = Math.max(...pts.map(p => p.v), 1);
  const total = pts.reduce((s, p) => s + p.v, 0);
  return {
    points: pts,
    max,
    total,
    meta
  };
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
function LineChart({
  series,
  color = 'var(--kb-primary)',
  height = 160,
  unit = '',
  area = true,
  cumulative = false,
  projection = 0,
  projectionLabel
}) {
  const data = cumulative ? toCumulative(series.points) : series.points;
  const W = 520,
    H = height;
  const padL = 40,
    padR = 16,
    padT = 16,
    padB = 26;
  const vals = data.map(d => d.v);
  let projPts = [];
  if (projection > 0 && data.length >= 2) {
    const last = data[data.length - 1].v;
    const slope = (data[data.length - 1].v - data[Math.max(0, data.length - 4)].v) / Math.min(4, data.length - 1);
    for (let k = 1; k <= projection; k++) projPts.push(Math.max(0, last + slope * k));
  }
  const maxV = Math.max(...vals, ...projPts, 1);
  const totalN = data.length + projPts.length;
  const x = i => padL + i / Math.max(1, totalN - 1) * (W - padL - padR);
  const y = v => padT + (1 - v / maxV) * (H - padT - padB);
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.v).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${x(data.length - 1).toFixed(1)} ${H - padB} L ${x(0).toFixed(1)} ${H - padB} Z`;
  const projPath = projPts.length ? `M ${x(data.length - 1)} ${y(data[data.length - 1].v)} ` + projPts.map((v, k) => `L ${x(data.length + k).toFixed(1)} ${y(v).toFixed(1)}`).join(' ') : '';
  const uid = React.useMemo(() => 'lc' + Math.random().toString(36).slice(2, 7), []);
  // ticks X — máximo ~7 etiquetas
  const step = Math.max(1, Math.ceil(data.length / 7));
  const lastIdx = data.length - 1;
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-linechart"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: "none",
    width: "100%",
    height: H
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: uid,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: color,
    stopOpacity: "0.26"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: color,
    stopOpacity: "0"
  }))), [0, 0.5, 1].map(g => /*#__PURE__*/React.createElement("line", {
    key: g,
    x1: padL,
    x2: W - padR,
    y1: padT + g * (H - padT - padB),
    y2: padT + g * (H - padT - padB),
    stroke: "var(--kb-border)",
    strokeWidth: "1",
    strokeDasharray: g === 1 ? '0' : '3 4',
    opacity: g === 1 ? 1 : 0.6
  })), /*#__PURE__*/React.createElement("text", {
    x: padL - 8,
    y: padT + 4,
    textAnchor: "end",
    className: "kbv-chart-axis"
  }, fmtN(maxV), unit), /*#__PURE__*/React.createElement("text", {
    x: padL - 8,
    y: H - padB,
    textAnchor: "end",
    className: "kbv-chart-axis"
  }, "0"), area && /*#__PURE__*/React.createElement("path", {
    d: areaPath,
    fill: `url(#${uid})`
  }), /*#__PURE__*/React.createElement("path", {
    d: linePath,
    fill: "none",
    stroke: color,
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), projPath && /*#__PURE__*/React.createElement("path", {
    d: projPath,
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeDasharray: "5 5",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: x(lastIdx),
    cy: y(data[lastIdx].v),
    r: "3.6",
    fill: "var(--kb-card)",
    stroke: color,
    strokeWidth: "2.4"
  }), projPts.length > 0 && /*#__PURE__*/React.createElement("circle", {
    cx: x(data.length + projPts.length - 1),
    cy: y(projPts[projPts.length - 1]),
    r: "3.2",
    fill: color,
    opacity: "0.7"
  }), data.map((d, i) => i % step === 0 || i === lastIdx ? /*#__PURE__*/React.createElement("text", {
    key: i,
    x: x(i),
    y: H - 8,
    textAnchor: "middle",
    className: "kbv-chart-axis"
  }, d.label) : null)), projectionLabel && projPts.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "kbv-chart-proj-note"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dash",
    style: {
      '--c': color
    }
  }), " ", projectionLabel));
}
function toCumulative(points) {
  let acc = 0;
  return points.map(p => ({
    ...p,
    v: acc += p.v
  }));
}
function fmtN(n) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k';
  return String(Math.round(n));
}

// ── Heatmap de consistencia (estilo GitHub, etiquetado por tiempo) ──
function ConsistencyHeatmap({
  period
}) {
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
    cells.push({
      d,
      week,
      dow,
      level,
      date
    });
  }
  // etiquetas de mes en la primera fila de cada cambio de mes
  const monthMarks = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const first = cells.find(c => c.week === w && c.dow === 0) || cells.find(c => c.week === w);
    if (first) {
      const m = first.date.getMonth();
      if (m !== lastMonth) {
        monthMarks.push({
          week: w,
          label: MONTHS_ES[m]
        });
        lastMonth = m;
      }
    }
  }
  const activeDays = cells.filter(c => c.level > 0).length;
  const trackedDays = cells.filter(c => c.level >= 0).length;
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-heatmap-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-heatmap-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hm-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hm-corner"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hm-months"
  }, Array.from({
    length: weeks
  }).map((_, w) => {
    const mk = monthMarks.find(m => m.week === w);
    return /*#__PURE__*/React.createElement("span", {
      key: w,
      className: "hm-month"
    }, mk ? mk.label : '');
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hm-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hm-dows"
  }, DOW_ES.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: i % 2 === 1 ? 'show' : ''
  }, i % 2 === 1 ? d : ''))), /*#__PURE__*/React.createElement("div", {
    className: "hm-weeks"
  }, Array.from({
    length: weeks
  }).map((_, w) => /*#__PURE__*/React.createElement("div", {
    key: w,
    className: "hm-week"
  }, Array.from({
    length: 7
  }).map((_, row) => {
    const c = cells.find(x => x.week === w && x.dow === row);
    if (!c || c.level < 0) return /*#__PURE__*/React.createElement("span", {
      key: row,
      className: "hc empty"
    });
    return /*#__PURE__*/React.createElement("span", {
      key: row,
      className: `hc l${c.level}`,
      title: `${c.date.toLocaleDateString('es-MX', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      })} · ${['sin actividad', 'baja', 'media', 'alta', 'máxima'][c.level]}`
    });
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "kbv-heatmap-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hm-caption"
  }, "Cada cuadro es ", /*#__PURE__*/React.createElement("strong", null, "un d\xEDa"), " \xB7 cada columna, una ", /*#__PURE__*/React.createElement("strong", null, "semana"), " \xB7 ", /*#__PURE__*/React.createElement("strong", null, "\xFAltimos 6 meses"), ". Entre m\xE1s verde, m\xE1s actividad."), /*#__PURE__*/React.createElement("span", {
    className: "kbv-heat-legend"
  }, /*#__PURE__*/React.createElement("span", null, "Menos"), [0, 1, 2, 3, 4].map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    className: `hc l${l}`
  })), /*#__PURE__*/React.createElement("span", null, "M\xE1s"))), /*#__PURE__*/React.createElement("div", {
    className: "kbv-heatmap-stat"
  }, activeDays, " d\xEDas activos de ", trackedDays, " \xB7 ", Math.round(activeDays / Math.max(1, trackedDays) * 100), "% del periodo"));
}

// ── Perfil por día de la semana (¿qué día rindes más?) ─────────
function genWeekdayProfile(period, seed = 19) {
  const rnd = mulberry(periodMeta(period).days + seed);
  // patrón realista: entre semana alto, baja el fin
  const base = [0.82, 0.9, 0.86, 0.94, 0.78, 0.55, 0.6];
  const vals = base.map(b => Math.round((b + (rnd() - 0.5) * 0.18) * 100));
  const max = Math.max(...vals);
  const bestIdx = vals.indexOf(max);
  return {
    vals,
    max,
    bestIdx
  };
}
function WeekdayBars({
  period,
  color = 'var(--kb-primary)'
}) {
  const {
    vals,
    max,
    bestIdx
  } = genWeekdayProfile(period);
  const full = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-weekday"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-weekday-bars"
  }, vals.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `wd-col ${i === bestIdx ? 'best' : ''}`,
    title: `${full[i]} · índice ${v}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "wd-bar",
    style: {
      height: `${v / max * 100}%`,
      background: i === bestIdx ? 'linear-gradient(180deg, var(--kb-coin), color-mix(in oklab, var(--kb-coin) 78%, var(--kb-text)))' : `linear-gradient(180deg, ${color}, color-mix(in oklab, ${color} 55%, var(--kb-canvas)))`
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "wd-lbl"
  }, DOW_ES[i])))), /*#__PURE__*/React.createElement("span", {
    className: "kbv-weekday-note"
  }, "Tu mejor d\xEDa suele ser ", /*#__PURE__*/React.createElement("strong", null, full[bestIdx]), " \xB7 el fin de semana bajas el ritmo."));
}

// ── Barras (XP por semana / por día) ────────────────────────
function BarsChart({
  series,
  color = 'var(--kb-primary)',
  height = 120,
  unit = 'XP'
}) {
  const pts = series.points;
  const max = series.max;
  const step = Math.max(1, Math.ceil(pts.length / 8));
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-bars-chart",
    style: {
      height
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bars-row"
  }, pts.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "bar-col",
    title: `${p.label}: ${p.v} ${unit}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "bar",
    style: {
      height: `${p.v / max * 100}%`,
      background: `linear-gradient(180deg, ${color}, color-mix(in oklab, ${color} 55%, var(--kb-canvas)))`
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "bars-axis"
  }, pts.map((p, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "bx"
  }, i % step === 0 || i === pts.length - 1 ? p.label : ''))));
}
Object.assign(window, {
  KB_PERIODS,
  periodMeta,
  usePeriod,
  PeriodFilter,
  genSeries,
  LineChart,
  BarsChart,
  ConsistencyHeatmap,
  WeekdayBars,
  genWeekdayProfile,
  MONTHS_ES,
  DOW_ES,
  fmtN,
  mulberry,
  toCumulative
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/progress-charts.jsx", error: String((e && e.message) || e) }); }

// reference/app/reencauce.jsx
try { (() => {
// reencauce.jsx — «el fracaso reencauza».
//
// La promesa de marca decía que un fallo redirige, nunca castiga, pero el
// sistema solo sabía restar vida: fallabas, perdías HP y ahí acababa la
// historia. Esto cierra el ciclo. Cuando algo falla, KIBO no regaña: ofrece
// una versión MÁS PEQUEÑA del compromiso para mañana (y devuelve la mitad del
// golpe si la aceptas) y, si la racha estaba en juego, un día de gracia.
//
// El día de gracia es uno por semana y no se compra: si se pudiera comprar,
// dejaría de ser una red y sería una moneda más.

const RC_GRACE_KEY = 'kibo:grace-used'; // ISO de la semana en que se usó
const RC_ROUTES_KEY = 'kibo:reencauces'; // los compromisos aceptados

function rcWeek(d) {
  const t = d || new Date();
  const on = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));
  const day = on.getUTCDay() || 7;
  on.setUTCDate(on.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(on.getUTCFullYear(), 0, 1));
  return `${on.getUTCFullYear()}-W${Math.ceil(((on - y0) / 86400000 + 1) / 7)}`;
}
function rcGraceLeft() {
  try {
    return localStorage.getItem(RC_GRACE_KEY) !== rcWeek();
  } catch (_) {
    return true;
  }
}
function rcUseGrace() {
  try {
    localStorage.setItem(RC_GRACE_KEY, rcWeek());
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent('kibo:grace-used'));
  } catch (_) {}
}
function rcRoutes() {
  try {
    const v = JSON.parse(localStorage.getItem(RC_ROUTES_KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch (_) {
    return [];
  }
}
function rcAddRoute(r) {
  const list = [{
    ...r,
    at: Date.now()
  }, ...rcRoutes()].slice(0, 12);
  try {
    localStorage.setItem(RC_ROUTES_KEY, JSON.stringify(list));
  } catch (_) {}
  try {
    window.dispatchEvent(new CustomEvent('kibo:reencauce', {
      detail: r
    }));
  } catch (_) {}
}

// La versión pequeña de cada cosa. No es «lo mismo pero menos»: es el mínimo
// que mantiene el hábito vivo — la mitad, el arranque, un solo paso.
const RC_SMALLER = {
  habit: [{
    n: 'La mitad, mañana',
    d: 'Medio hábito cuenta como día vivo.'
  }, {
    n: 'Solo empezar',
    d: 'Dos minutos y lo dejas si quieres.'
  }],
  reto: [{
    n: 'Un día de gracia',
    d: 'El reto sigue; el día no cuenta en contra.'
  }, {
    n: 'Bajar la meta un escalón',
    d: 'Menos exigente, mismo reto.'
  }],
  task: [{
    n: 'Partirla en dos',
    d: 'La mitad hoy, la mitad mañana.'
  }, {
    n: 'Mover a mañana',
    d: 'Sin penalización si la agendas.'
  }],
  study: [{
    n: 'Un pomodoro',
    d: '25 minutos y listo.'
  }],
  health: [{
    n: 'Diez minutos',
    d: 'Movimiento corto, cuenta igual.'
  }],
  read: [{
    n: 'Cinco páginas',
    d: 'Lo justo para no romper el hilo.'
  }],
  otro: [{
    n: 'La mitad, mañana',
    d: 'Bajarle a la mitad es seguir.'
  }]
};
function ReencauceCard() {
  const [fail, setFail] = React.useState(null);
  const [grace, setGrace] = React.useState(rcGraceLeft);
  React.useEffect(() => {
    const h = e => {
      const d = e && e.detail || {};
      if (d.kind !== 'fail') return;
      setFail({
        label: d.label || 'Algo no salió',
        of: d.of || 'otro',
        amount: Math.abs(d.amount || 0),
        id: Math.random()
      });
    };
    const g = () => setGrace(rcGraceLeft());
    window.addEventListener('kibo:action', h);
    window.addEventListener('kibo:grace-used', g);
    return () => {
      window.removeEventListener('kibo:action', h);
      window.removeEventListener('kibo:grace-used', g);
    };
  }, []);

  // Se va sola: una tarjeta de fallo que se queda hasta que la cierres acaba
  // siendo un regaño permanente en la esquina.
  React.useEffect(() => {
    if (!fail) return;
    const t = setTimeout(() => setFail(null), 14000);
    return () => clearTimeout(t);
  }, [fail]);
  if (!fail) return null;
  const options = RC_SMALLER[fail.of] || RC_SMALLER.otro;
  function take(o) {
    rcAddRoute({
      of: fail.of,
      label: fail.label,
      route: o.n
    });
    // Aceptar el reencauce devuelve la mitad del golpe: el fallo sigue
    // costando, pero recomponerse vale algo.
    if (fail.amount && typeof healHP === 'function') healHP(Math.round(fail.amount / 2), 'Reencauzaste');
    setFail(null);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "rc-card",
    role: "status"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rc-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rc-ico"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "repeat",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "rc-txt"
  }, /*#__PURE__*/React.createElement("strong", null, "El fracaso reencauza"), /*#__PURE__*/React.createElement("span", null, fail.label, ". Escoge algo m\xE1s peque\xF1o y sigues de pie.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rc-x",
    onClick: () => setFail(null),
    "aria-label": "Cerrar"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "x",
    size: 13
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rc-opts"
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.n,
    type: "button",
    className: "rc-opt",
    onClick: () => take(o)
  }, /*#__PURE__*/React.createElement("strong", null, o.n), /*#__PURE__*/React.createElement("span", null, o.d))), grace && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rc-opt grace",
    onClick: () => {
      rcUseGrace();
      rcAddRoute({
        of: fail.of,
        label: fail.label,
        route: 'Día de gracia'
      });
      if (fail.amount && typeof healHP === 'function') healHP(fail.amount, 'Día de gracia');
      setFail(null);
    }
  }, /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(KIcon, {
    name: "shield",
    size: 12
  }), " D\xEDa de gracia"), /*#__PURE__*/React.createElement("span", null, "Uno por semana. Tu racha no se rompe."))));
}
Object.assign(window, {
  ReencauceCard,
  rcGraceLeft,
  rcUseGrace,
  rcRoutes,
  rcAddRoute
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/reencauce.jsx", error: String((e && e.message) || e) }); }

// reference/app/tarea-detalle.jsx
try { (() => {
// tarea-detalle.jsx — La tarea como PANTALLA, no como modal.
//
// El modal sirve para editar de pasada; una tarea con proyecto, checklist,
// subtareas, recompensa y sobre todo un HISTÓRICO no cabe en una ventana
// flotante. Esta pantalla es el destino canónico de cualquier enlace a una
// tarea: el tablero, el proyecto, el buscador y KIBO llegan aquí.

const TASK_STATUS_LABELS = {
  todo: 'Por hacer',
  doing: 'En curso',
  blocked: 'Bloqueado',
  done: 'Hecho'
};

// ── Histórico ────────────────────────────────────────────────────
// Cada evento dice QUIÉN, QUÉ y CUÁNDO. El tipo decide el ícono y el color, así
// que añadir un tipo nuevo no obliga a tocar la vista.
const TASK_EVENT_KINDS = {
  created: {
    icon: 'plus',
    color: 'var(--kb-primary)',
    what: 'Tarea creada',
    tag: 'Creación'
  },
  moved: {
    icon: 'trending-up',
    color: 'var(--kb-gem)',
    what: 'Movida de columna',
    tag: 'Columna'
  },
  priority: {
    icon: 'flag',
    color: 'var(--kb-streak)',
    what: 'Prioridad cambiada',
    tag: 'Prioridad'
  },
  check: {
    icon: 'check',
    color: 'var(--kb-good)',
    what: 'Paso marcado',
    tag: 'Pasos'
  },
  date: {
    icon: 'calendar',
    color: 'var(--area-will)',
    what: 'Fechas ajustadas',
    tag: 'Fechas'
  },
  note: {
    icon: 'edit',
    color: 'var(--area-community)',
    what: 'Nota escrita',
    tag: 'Notas'
  },
  link: {
    icon: 'folder',
    color: 'var(--kb-coin-ink)',
    what: 'Ligada a un proyecto',
    tag: 'Proyecto'
  },
  reward: {
    icon: 'sparkle',
    color: 'var(--kb-medal)',
    what: 'Recompensa cobrada',
    tag: 'Recompensa'
  }
};
function taskHistory(task) {
  if (task.history && task.history.length) return task.history;
  // Historia derivada del estado real de la tarea: así una tarea «hecha» no
  // muestra un histórico que se queda a medias.
  const day = 86400000;
  const ago = n => new Date(Date.now() - n * day).toISOString();
  const h = [{
    id: 'h1',
    kind: 'created',
    at: ago(9),
    who: 'Tú',
    what: task.title
  }];
  if (task.project) {
    const proj = (window.DEMO_PROJECTS_FOR_FILTER || []).find(p => p.id === task.project);
    h.push({
      id: 'h2',
      kind: 'link',
      at: ago(9),
      who: 'Tú',
      what: proj && proj.name || task.project
    });
  }
  h.push({
    id: 'h3',
    kind: 'priority',
    at: ago(7),
    who: 'Tú',
    what: 'Media → ' + ({
      urgent: 'Urgente',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
      vlow: 'Muy baja'
    }[task.priority] || 'Media')
  });
  h.push({
    id: 'h4',
    kind: 'date',
    at: ago(6),
    who: 'Tú',
    what: 'Fin objetivo en 3 días'
  });
  if (task.status !== 'todo') h.push({
    id: 'h5',
    kind: 'moved',
    at: ago(4),
    who: 'Tú',
    what: 'Por hacer → ' + (TASK_STATUS_LABELS[task.status] || task.status)
  });
  if ((task.checklist || []).some(c => c.done)) h.push({
    id: 'h6',
    kind: 'check',
    at: ago(3),
    who: 'Tú',
    what: (task.checklist.find(c => c.done) || {}).text
  });
  h.push({
    id: 'h7',
    kind: 'note',
    at: ago(2),
    who: 'Tú',
    what: 'Pendiente confirmar alcance con el cliente antes de cerrar.'
  });
  if (task.status === 'done') h.push({
    id: 'h8',
    kind: 'reward',
    at: ago(1),
    who: 'Kibo',
    what: 'XP y monedas acreditadas'
  });
  return h.reverse();
}
function fmtWhen(iso) {
  const d = new Date(iso),
    now = new Date();
  const days = Math.round((now - d) / 86400000);
  const hhmm = d.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  });
  if (days <= 0) return 'Hoy · ' + hhmm;
  if (days === 1) return 'Ayer · ' + hhmm;
  if (days < 7) return `Hace ${days} días · ${hhmm}`;
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short'
  }) + ' · ' + hhmm;
}
function TaskHistory({
  task
}) {
  const [filter, setFilter] = React.useState('all');
  const all = taskHistory(task);
  const kinds = [...new Set(all.map(e => e.kind))];
  const rows = filter === 'all' ? all : all.filter(e => e.kind === filter);
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-card kbv-th"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Hist\xF3rico de cambios",
    meta: `${all.length} movimientos`
  }), /*#__PURE__*/React.createElement("div", {
    className: "th-filters"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `kbv-chip ${filter === 'all' ? 'on' : ''}`,
    onClick: () => setFilter('all')
  }, "Todo"), kinds.map(k => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    className: `kbv-chip ${filter === k ? 'on' : ''}`,
    style: {
      '--c': TASK_EVENT_KINDS[k].color
    },
    onClick: () => setFilter(k)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: TASK_EVENT_KINDS[k].icon,
    size: 12
  }), " ", TASK_EVENT_KINDS[k].tag))), /*#__PURE__*/React.createElement("ol", {
    className: "th-list"
  }, rows.map(e => {
    const k = TASK_EVENT_KINDS[e.kind] || TASK_EVENT_KINDS.note;
    return /*#__PURE__*/React.createElement("li", {
      key: e.id,
      className: "th-row",
      style: {
        '--c': k.color
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "th-dot"
    }, /*#__PURE__*/React.createElement(KIcon, {
      name: k.icon,
      size: 13
    })), /*#__PURE__*/React.createElement("span", {
      className: "th-body"
    }, /*#__PURE__*/React.createElement("span", {
      className: "th-line"
    }, k.what, " ", /*#__PURE__*/React.createElement("em", null, "\xB7 ", e.who)), e.what && /*#__PURE__*/React.createElement("span", {
      className: "th-what"
    }, e.what)), /*#__PURE__*/React.createElement("span", {
      className: "th-when"
    }, fmtWhen(e.at)));
  })));
}

// El salto al área respeta DESDE DÓNDE entras: desde una tarea, lo que sigue
// en la jerarquía es el frente de proyectos de esa área, no su progreso.
function goToArea(areaId, tab) {
  try {
    window.dispatchEvent(new CustomEvent('kibo:navigate', {
      detail: {
        screen: 'areas',
        area: areaId,
        tab: tab || 'proyectos'
      }
    }));
  } catch (_) {}
}
const TD_TABS = [{
  id: 'detalle',
  label: 'Detalle',
  icon: 'list'
}, {
  id: 'pasos',
  label: 'Pasos',
  icon: 'check'
}, {
  id: 'historico',
  label: 'Histórico',
  icon: 'clock'
}];
function TaskDetailScreen({
  taskId,
  onBack,
  onNavigate
}) {
  const base = (window.DEMO_TASKS_FULL || []).find(t => t.id === taskId);
  const [t, setT] = React.useState(() => base ? {
    ...base
  } : null);
  const [tab, setTab] = React.useState('detalle');
  const [editOpen, setEditOpen] = React.useState(false);
  const [note, setNote] = React.useState('');
  const [toast, setToast] = React.useState(null);
  function flash(m) {
    setToast(m);
    clearTimeout(flash._t);
    flash._t = setTimeout(() => setToast(null), 2200);
  }
  if (!t) {
    return /*#__PURE__*/React.createElement("div", {
      className: "kbv-main"
    }, /*#__PURE__*/React.createElement(EmptyState, {
      icon: "list",
      title: "Esa tarea ya no existe",
      body: "Puede que se haya borrado. Vuelve al tablero para ver las de hoy.",
      action: "Ir a Tareas",
      onAction: onBack
    }));
  }
  const area = KIBO_AREAS_V2.find(a => a.id === t.area);
  const proj = (window.DEMO_PROJECTS_FOR_FILTER || []).find(p => p.id === t.project);
  const pri = PRIORITY_DEFS[t.priority] || PRIORITY_DEFS.medium;
  const PRI_W = {
    urgent: 5,
    high: 4,
    medium: 3,
    low: 2,
    vlow: 1
  };
  const xp = (PRI_W[t.priority] || 2) * (t.energy || 2) * 5;
  const coins = (PRI_W[t.priority] || 2) * (t.energy || 2) * 3;
  const checklist = t.checklist || [];
  const subtasks = t.subtasks || [];
  const clDone = checklist.filter(c => c.done).length;
  const stDone = subtasks.filter(s => s.done).length;
  const steps = checklist.length + subtasks.length;
  const stepsDone = clDone + stDone;
  function toggle(list, id) {
    setT(prev => ({
      ...prev,
      [list]: (prev[list] || []).map(x => x.id === id ? {
        ...x,
        done: !x.done
      } : x)
    }));
  }
  function setStatus(s) {
    setT(prev => ({
      ...prev,
      status: s
    }));
    flash(s === 'done' ? `Cerrada ✓ +${xp} XP · ${coins} monedas` : `Movida a «${TASK_STATUS_LABELS[s]}»`);
  }
  const pulse = [{
    l: 'Estado',
    v: TASK_STATUS_LABELS[t.status] || t.status
  }, {
    l: 'Prioridad',
    v: pri.label,
    c: pri.color
  }, {
    l: 'Energía',
    v: '·'.repeat(t.energy || 2) || '—'
  }, {
    l: 'Tiempo',
    v: t.estTime || '—'
  }, {
    l: 'Pasos',
    v: steps ? `${stepsDone}/${steps}` : '—'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-main kbv-taskdetail",
    style: {
      '--c': area?.color || 'var(--kb-primary)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-area-back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-left",
    size: 14
  }), " Todas las tareas"), /*#__PURE__*/React.createElement("div", {
    className: "kbv-area-detail-head td-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "adh-glyph"
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: area?.glyph || 'list',
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    className: "adh-id"
  }, /*#__PURE__*/React.createElement("div", {
    className: "td-head-crumbs"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "td-crumb",
    onClick: () => goToArea(t.area, 'proyectos')
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: area?.glyph || 'layers',
    size: 11
  }), " ", area?.name || 'Sin área'), proj && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "td-crumb",
    onClick: () => onNavigate && onNavigate('projects', {
      project: proj.id
    })
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "folder",
    size: 11
  }), " ", proj.name)), /*#__PURE__*/React.createElement("h2", {
    className: "adh-name"
  }, t.title), /*#__PURE__*/React.createElement("p", {
    className: "adh-desc"
  }, t.description || 'Sin descripción todavía — edítala para dejar el contexto que necesitas al retomarla.')), /*#__PURE__*/React.createElement("div", {
    className: "td-head-reward"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tdr-l"
  }, "Al cerrar"), /*#__PURE__*/React.createElement("span", {
    className: "tdr-v"
  }, "+", xp, " ", /*#__PURE__*/React.createElement("em", null, "XP")), /*#__PURE__*/React.createElement("span", {
    className: "tdr-c"
  }, coins, " ", /*#__PURE__*/React.createElement(CoinIcon, {
    size: 12
  })))), /*#__PURE__*/React.createElement("div", {
    className: "kbv-card kbv-char-card td-pulse-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-area-pulsegrid"
  }, pulse.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "apg-cell"
  }, /*#__PURE__*/React.createElement("span", {
    className: "apg-v",
    style: m.c ? {
      color: m.c
    } : undefined
  }, m.v), /*#__PURE__*/React.createElement("span", {
    className: "apg-l"
  }, m.l)))), /*#__PURE__*/React.createElement("div", {
    className: "td-status"
  }, Object.entries(TASK_STATUS_LABELS).map(([id, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    type: "button",
    className: `td-st ${t.status === id ? 'on' : ''} ${id}`,
    onClick: () => setStatus(id)
  }, label)), /*#__PURE__*/React.createElement("div", {
    className: "td-status-acts"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-secondary",
    onClick: () => setEditOpen(true)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "edit",
    size: 14
  }), " Editar"), t.status !== 'done' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-primary",
    onClick: () => setStatus('done')
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 14
  }), " Marcar hecha")))), /*#__PURE__*/React.createElement("div", {
    className: "kbv-store-tabs-v2",
    style: {
      marginBottom: 4
    }
  }, TD_TABS.map(x => /*#__PURE__*/React.createElement("button", {
    key: x.id,
    type: "button",
    className: tab === x.id ? 'on' : '',
    onClick: () => setTab(x.id)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: x.icon,
    size: 14
  }), " ", x.label))), tab === 'detalle' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "kbv-card kbv-char-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-study-section-head tight"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kbv-h3"
  }, "Ficha"), /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, "lo que define la tarea")), /*#__PURE__*/React.createElement("div", {
    className: "kbv-detail-rows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Estado"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, TASK_STATUS_LABELS[t.status] || t.status)), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Prioridad"), /*#__PURE__*/React.createElement("span", {
    className: "v",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(PriorityIcon, {
    level: t.priority,
    size: 14
  }), " ", pri.label)), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Energ\xEDa"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, /*#__PURE__*/React.createElement(EnergyMeter, {
    level: t.energy,
    size: 10
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Tiempo estimado"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, t.estTime || '—')), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "\xC1rea"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, area ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "area-chip with-icon as-link",
    style: {
      '--c': area.color
    },
    onClick: () => goToArea(area.id, 'proyectos')
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: area.glyph,
    size: 11
  }), " ", area.name, " ", /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-right",
    size: 10
  })) : 'Sin área')), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, "Proyecto"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, proj ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "td-link",
    onClick: () => onNavigate && onNavigate('projects', {
      project: proj.id
    })
  }, proj.name, " ", /*#__PURE__*/React.createElement(KIcon, {
    name: "arrow-right",
    size: 11
  })) : 'Sin proyecto')))), /*#__PURE__*/React.createElement("div", {
    className: "kbv-card kbv-char-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-study-section-head tight"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kbv-h3"
  }, "Lo que mueve"), /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, "al cerrarla")), /*#__PURE__*/React.createElement("div", {
    className: "td-rewards"
  }, /*#__PURE__*/React.createElement("div", {
    className: "td-rw",
    style: {
      '--c': 'var(--kb-xp)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "XP"), /*#__PURE__*/React.createElement("strong", null, "+", xp), /*#__PURE__*/React.createElement("em", null, area?.name || 'Sin área')), /*#__PURE__*/React.createElement("div", {
    className: "td-rw",
    style: {
      '--c': 'var(--kb-coin)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Monedas"), /*#__PURE__*/React.createElement("strong", null, coins), /*#__PURE__*/React.createElement("em", null, curLabel('coin')))), /*#__PURE__*/React.createElement("p", {
    className: "kbv-meta",
    style: {
      marginTop: 8
    }
  }, "Sale de la prioridad por la energ\xEDa: lo dif\xEDcil paga m\xE1s."))), tab === 'pasos' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "kbv-card kbv-char-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-study-section-head tight"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kbv-h3"
  }, "Pasos"), /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, checklist.length ? `${clDone} de ${checklist.length}` : 'sin pasos')), checklist.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "kbv-meta"
  }, "Divide la tarea en pasos para no perder el hilo al retomarla.") : /*#__PURE__*/React.createElement("div", {
    className: "td-checks"
  }, checklist.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    type: "button",
    className: `td-check ${c.done ? 'on' : ''}`,
    onClick: () => toggle('checklist', c.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "box"
  }, c.done && /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    className: "txt"
  }, c.text))))), /*#__PURE__*/React.createElement("div", {
    className: "kbv-card kbv-char-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-study-section-head tight"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kbv-h3"
  }, "Subtareas"), /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, subtasks.length ? `${stDone} de ${subtasks.length}` : 'sin subtareas')), subtasks.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "kbv-meta"
  }, "Una subtarea es trabajo que podr\xEDa vivir solo; un paso, no.") : /*#__PURE__*/React.createElement("div", {
    className: "td-checks"
  }, subtasks.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    type: "button",
    className: `td-check ${s.done ? 'on' : ''}`,
    onClick: () => toggle('subtasks', s.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "box"
  }, s.done && /*#__PURE__*/React.createElement(KIcon, {
    name: "check",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    className: "txt"
  }, s.text)))))), tab === 'historico' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TaskHistory, {
    task: t
  }), /*#__PURE__*/React.createElement("div", {
    className: "kbv-card kbv-char-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-study-section-head tight"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kbv-h3"
  }, "A\xF1adir una nota"), /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta"
  }, "queda en el hist\xF3rico")), /*#__PURE__*/React.createElement("div", {
    className: "td-note"
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    value: note,
    placeholder: "Qu\xE9 pas\xF3, qu\xE9 falta, qu\xE9 decidiste\u2026",
    onChange: e => setNote(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kbv-btn kbv-btn-primary",
    disabled: !note.trim(),
    onClick: () => {
      setT(prev => ({
        ...prev,
        history: [{
          id: 'n' + Date.now(),
          kind: 'note',
          at: new Date().toISOString(),
          who: 'Tú',
          what: note.trim()
        }, ...taskHistory(prev)]
      }));
      setNote('');
      flash('Nota guardada en el histórico');
    }
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "plus",
    size: 14
  }), " A\xF1adir")))), editOpen && typeof TaskDetailModal === 'function' && /*#__PURE__*/React.createElement(TaskDetailModal, {
    task: t,
    onClose: () => setEditOpen(false),
    onSave: next => {
      setT(next);
      flash('Cambios guardados');
    }
  }), toast && /*#__PURE__*/React.createElement("div", {
    className: "kbv-toast show"
  }, toast));
}
Object.assign(window, {
  TaskDetailScreen,
  TaskHistory,
  taskHistory,
  TASK_STATUS_LABELS,
  TASK_EVENT_KINDS,
  goToArea
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/app/tarea-detalle.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/App.jsx
try { (() => {
/* Kibo App kit — root app shell + router */

function App() {
  const [page, setPage] = React.useState('dashboard');

  // Re-hydrate Lucide icons after every render so dynamically-added icons appear.
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons({
      attrs: {
        'stroke-width': 1.75
      }
    });
  });
  const pages = {
    dashboard: Dashboard,
    habits: Habits,
    retos: Retos,
    projects: ModuleLocked,
    character: Character,
    store: Store
  };
  const Page = pages[page] || Dashboard;
  return /*#__PURE__*/React.createElement("div", {
    className: "kb-app kb-root"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    page: page,
    setPage: setPage
  }), /*#__PURE__*/React.createElement("div", {
    className: "kb-main"
  }, /*#__PURE__*/React.createElement(Header, {
    user: KB.user
  }), /*#__PURE__*/React.createElement(Page, {
    key: page
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Character.jsx
try { (() => {
/* Kibo App kit — Personaje (Character): prestige, rank emblems, area ranks, achievements */

function PrestigePanel({
  p
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-card",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-prestige-ring",
    style: {
      width: 76,
      height: 76,
      background: p.glow,
      boxShadow: `0 0 18px ${p.glow}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-prestige-ring",
    style: {
      width: 56,
      height: 56,
      background: `linear-gradient(145deg,${p.a},${p.b})`,
      color: p.ink,
      fontFamily: 'var(--kb-f-mono)',
      fontWeight: 700,
      fontSize: 20
    }
  }, p.grade)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "kb-eyebrow"
  }, "Prestigio \xB7 grado ", p.grade), /*#__PURE__*/React.createElement("h2", {
    className: "kbv-h3",
    style: {
      margin: '4px 0 4px'
    }
  }, p.name), /*#__PURE__*/React.createElement("p", {
    className: "kbv-meta",
    style: {
      margin: 0
    }
  }, p.sub), /*#__PURE__*/React.createElement("div", {
    className: "kb-stars",
    style: {
      marginTop: 8
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement(Icon, {
    key: i,
    name: "star",
    size: 16,
    color: i < p.stars ? 'var(--kb-coin)' : 'var(--kb-border-strong)',
    style: {
      fill: i < p.stars ? 'var(--kb-coin)' : 'none'
    }
  })))));
}
function AreaRankRow({
  area
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid var(--kb-border-soft)'
    }
  }, /*#__PURE__*/React.createElement(Emblem, {
    rank: KB.ranks[Math.min(4, Math.floor(area.level / 6))],
    size: 32,
    num: area.level
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, area.name), /*#__PURE__*/React.createElement("span", {
    className: "kb-area-lvl"
  }, "NV ", area.level, " \xB7 ", area.pct, "%")), /*#__PURE__*/React.createElement(Bar, {
    pct: area.pct,
    color: area.color
  })));
}
function Character() {
  return /*#__PURE__*/React.createElement("div", {
    className: "kb-page fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "kb-eyebrow"
  }, "Tu personaje"), /*#__PURE__*/React.createElement("h1", {
    className: "kbv-h2",
    style: {
      margin: '4px 0 0'
    }
  }, KB.user.name))), /*#__PURE__*/React.createElement(PrestigePanel, {
    p: KB.prestige
  }), /*#__PURE__*/React.createElement("div", {
    className: "kb-cols",
    style: {
      marginTop: 20,
      gridTemplateColumns: '1fr 360px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-card"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "kb-card-title",
    style: {
      marginBottom: 4
    }
  }, "Rangos por material"), /*#__PURE__*/React.createElement("p", {
    className: "kbv-meta",
    style: {
      marginTop: 0
    }
  }, "20 rangos militares (Nv 1\u2013100) en 9 materiales."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(64px,1fr))',
      gap: 14,
      marginTop: 6
    }
  }, KB.ranks.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Emblem, {
    rank: r,
    size: 48,
    num: (i + 1) * 11,
    locked: !r.unlocked
  }), /*#__PURE__*/React.createElement("span", {
    className: "kbv-meta",
    style: {
      fontSize: 11
    }
  }, r.name))))), /*#__PURE__*/React.createElement("div", {
    className: "kbv-card"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "kb-card-title",
    style: {
      marginBottom: 8
    }
  }, "Logros"), /*#__PURE__*/React.createElement("div", {
    className: "kb-ach-grid"
  }, KB.achievements.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.name,
    className: `kb-ach${a.unlocked ? '' : ' lock'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "medal",
    style: a.unlocked ? {
      background: a.color
    } : null
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.unlocked ? a.icon : 'lock',
    size: 20,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, a.name), /*#__PURE__*/React.createElement("span", {
    className: "kb-eyebrow",
    style: {
      fontSize: 9,
      color: a.color
    }
  }, a.rarity)))))), /*#__PURE__*/React.createElement("div", {
    className: "kbv-card"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "kb-card-title",
    style: {
      marginBottom: 4
    }
  }, "Habilidades"), /*#__PURE__*/React.createElement("p", {
    className: "kbv-meta",
    style: {
      marginTop: 0,
      marginBottom: 6
    }
  }, "5 \xE1reas \xD7 50 niveles."), KB.areas.map(a => /*#__PURE__*/React.createElement(AreaRankRow, {
    key: a.id,
    area: a
  })))));
}
window.Character = Character;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Character.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Dashboard.jsx
try { (() => {
/* Kibo App kit — Dashboard (Inicio) */

function Kpi({
  icon,
  iconBg,
  iconColor,
  value,
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-kpi-icon",
    style: {
      background: iconBg,
      color: iconColor
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18,
    color: iconColor
  })), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, value), /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, label));
}
function HabitRow({
  habit,
  area,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `kb-habit${habit.done ? ' is-done' : ''}`
  }, /*#__PURE__*/React.createElement("button", {
    className: `kb-check${habit.done ? ' done' : ''}`,
    onClick: onToggle,
    "aria-label": "completar"
  }, habit.done && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    className: "kb-area-dot",
    style: {
      background: area.color
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "kb-habit-name"
  }, habit.name), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    },
    className: "kb-xp-gain"
  }, "+", habit.xp, " XP"));
}
function AreaMini({
  area
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "kb-area-mini"
  }, /*#__PURE__*/React.createElement("div", {
    className: "top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kb-area-dot",
    style: {
      width: 22,
      height: 22,
      borderRadius: 7,
      background: `${area.hex}1f`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: area.icon,
    size: 13,
    color: area.color
  })), /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, area.name), /*#__PURE__*/React.createElement("span", {
    className: "kb-area-lvl"
  }, "NV ", area.level)), /*#__PURE__*/React.createElement(Bar, {
    pct: area.pct,
    color: area.color
  }));
}
function Dashboard() {
  const [habits, setHabits] = React.useState(KB.habits);
  const [showModal, setShowModal] = React.useState(false);
  const areaById = id => KB.areas.find(a => a.id === id);
  const doneCount = habits.filter(h => h.done).length;
  const toggle = id => setHabits(hs => hs.map(h => h.id === id ? {
    ...h,
    done: !h.done
  } : h));
  const bossPct = Math.round((KB.boss.hpMax - KB.boss.hp) / KB.boss.hpMax * 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "kb-page fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "kb-eyebrow"
  }, "Martes \xB7 3 jun"), /*#__PURE__*/React.createElement("h1", {
    className: "kbv-h2",
    style: {
      margin: '4px 0 0'
    }
  }, "Buen d\xEDa, ", KB.user.name)), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setShowModal(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16,
    color: "#fff"
  }), " Nueva misi\xF3n")), /*#__PURE__*/React.createElement("div", {
    className: "kb-grid-kpi"
  }, /*#__PURE__*/React.createElement(Kpi, {
    icon: "zap",
    iconBg: "var(--kb-primary-soft)",
    iconColor: "var(--kb-primary-ink)",
    value: KB.user.xp.toLocaleString('es-MX'),
    label: "Experiencia"
  }), /*#__PURE__*/React.createElement(Kpi, {
    icon: "flame",
    iconBg: "#FFF1E6",
    iconColor: "var(--kb-streak)",
    value: KB.user.streak,
    label: "Racha \xB7 d\xEDas"
  }), /*#__PURE__*/React.createElement(Kpi, {
    icon: "circle-dollar-sign",
    iconBg: "#FDF3DC",
    iconColor: "#b5851a",
    value: KB.user.coins.toLocaleString('es-MX'),
    label: "Monedas"
  }), /*#__PURE__*/React.createElement(Kpi, {
    icon: "heart",
    iconBg: "var(--kb-hp-soft)",
    iconColor: "var(--kb-hp)",
    value: `${KB.user.hp}%`,
    label: "Salud"
  })), /*#__PURE__*/React.createElement("div", {
    className: "kb-cols"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "kb-card-title"
  }, "Hoy"), /*#__PURE__*/React.createElement("span", {
    className: "kb-eyebrow"
  }, doneCount, "/", habits.length, " completadas")), habits.map(h => /*#__PURE__*/React.createElement(HabitRow, {
    key: h.id,
    habit: h,
    area: areaById(h.area),
    onToggle: () => toggle(h.id)
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "kb-card-title",
    style: {
      marginBottom: 12
    }
  }, "\xC1reas de vida"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
      gap: 12
    }
  }, KB.areas.map(a => /*#__PURE__*/React.createElement(AreaMini, {
    key: a.id,
    area: a
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-coach"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-eyebrow",
    style: {
      color: 'var(--kb-primary)',
      marginBottom: 8
    }
  }, "Coach Kibo"), /*#__PURE__*/React.createElement("p", {
    className: "quote"
  }, "El fracaso no castiga: reencauza."), /*#__PURE__*/React.createElement("p", {
    className: "kbv-meta",
    style: {
      marginTop: 8,
      marginBottom: 0
    }
  }, "Fallaste 1 h\xE1bito ayer. Hoy es un nuevo intento \u2014 vas 86% de salud.")), /*#__PURE__*/React.createElement("div", {
    className: "kb-boss"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tag"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "swords",
    size: 13,
    color: "var(--kb-boss)"
  }), " Jefe activo"), /*#__PURE__*/React.createElement("h3", {
    className: "kb-card-title",
    style: {
      color: 'var(--kb-boss)',
      margin: '8px 0 2px'
    }
  }, KB.boss.name), /*#__PURE__*/React.createElement("p", {
    className: "kbv-meta",
    style: {
      margin: '0 0 12px'
    }
  }, KB.boss.hp.toLocaleString('es-MX'), " / ", KB.boss.hpMax.toLocaleString('es-MX'), " HP restante"), /*#__PURE__*/React.createElement(Bar, {
    pct: bossPct,
    color: "var(--kb-boss)",
    track: "#fadbdb"
  })), /*#__PURE__*/React.createElement("div", {
    className: "kbv-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-eyebrow",
    style: {
      marginBottom: 8
    }
  }, "Leyendo"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 60,
      borderRadius: 6,
      background: 'linear-gradient(160deg,#2E8B63,#155C40)',
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, "H\xE1bitos At\xF3micos"), /*#__PURE__*/React.createElement("div", {
    className: "kbv-meta",
    style: {
      margin: '2px 0 8px'
    }
  }, "p. 142 / 320"), /*#__PURE__*/React.createElement(Bar, {
    pct: 44,
    color: "var(--area-wisdom)"
  })))))), showModal && /*#__PURE__*/React.createElement(Modal, {
    title: "Nueva misi\xF3n",
    onClose: () => setShowModal(false),
    foot: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setShowModal(false)
    }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => setShowModal(false)
    }, "Crear misi\xF3n"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-field"
  }, /*#__PURE__*/React.createElement("label", null, "Nombre"), /*#__PURE__*/React.createElement("input", {
    className: "kbv-input",
    placeholder: "\xBFQu\xE9 quieres lograr?",
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "kbv-field"
  }, /*#__PURE__*/React.createElement("label", null, "\xC1rea de vida"), /*#__PURE__*/React.createElement("div", {
    className: "kbv-chips"
  }, KB.areas.map((a, i) => /*#__PURE__*/React.createElement("button", {
    key: a.id,
    className: `kbv-chip${i === 1 ? ' on' : ''}`
  }, a.name)))), /*#__PURE__*/React.createElement("div", {
    className: "kbv-field"
  }, /*#__PURE__*/React.createElement("label", null, "Prioridad"), /*#__PURE__*/React.createElement("div", {
    className: "kbv-chips"
  }, KB.priorities.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    className: `kbv-chip${i === 0 ? ' on' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: p.color,
      marginRight: 6
    }
  }), p.name))))));
}
window.Dashboard = Dashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Header.jsx
try { (() => {
/* Kibo App kit — HUD header (avatar + emblem, level, XP bar, HP, streak, coins, gems) */

function Header({
  user
}) {
  const xpPct = Math.round(user.xp / user.xpNext * 100);
  const eq = KB.prestige; // equipped prestige emblem
  return /*#__PURE__*/React.createElement("header", {
    className: "kb-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-hero-id"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-avatar-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-avatar"
  }, user.initial), /*#__PURE__*/React.createElement("div", {
    className: "kb-hero-emblem",
    style: {
      background: `linear-gradient(145deg,${KB.ranks[2].a},${KB.ranks[2].b})`,
      color: KB.ranks[2].ink
    }
  }, user.level)), /*#__PURE__*/React.createElement("div", {
    className: "kb-hero-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kb-hero-name"
  }, user.name), /*#__PURE__*/React.createElement("div", {
    className: "kb-xpbar",
    title: `${user.xp} / ${user.xpNext} XP`
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: `${xpPct}%`
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "kb-eyebrow",
    style: {
      fontSize: 10
    }
  }, user.xp.toLocaleString('es-MX'), " / ", user.xpNext.toLocaleString('es-MX'), " XP"))), /*#__PURE__*/React.createElement("div", {
    className: "kb-hud-spacer"
  }), /*#__PURE__*/React.createElement(StatPill, {
    style: {
      color: 'var(--kb-hp)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    size: 15,
    color: "var(--kb-hp)"
  }), " ", user.hp, "%"), /*#__PURE__*/React.createElement(StatPill, {
    style: {
      color: 'var(--kb-streak)'
    }
  }, /*#__PURE__*/React.createElement(FlameSVG, {
    size: 15
  }), " ", user.streak), /*#__PURE__*/React.createElement(StatPill, null, /*#__PURE__*/React.createElement(CoinIcon, null), " ", user.coins.toLocaleString('es-MX')), /*#__PURE__*/React.createElement(StatPill, null, /*#__PURE__*/React.createElement(GemIcon, null), " ", user.gems));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Misc.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Kibo App kit — secondary pages: Hábitos, Retos, and the locked premium module */

function HabitCard({
  name,
  area,
  freq,
  streak
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-card click",
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 9,
      background: `${area.hex}1f`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: area.icon,
    size: 16,
    color: area.color
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    className: "kb-statpill",
    style: {
      marginLeft: 'auto',
      padding: '4px 9px',
      color: 'var(--kb-streak)'
    }
  }, /*#__PURE__*/React.createElement(FlameSVG, {
    size: 13
  }), " ", streak)), /*#__PURE__*/React.createElement("div", {
    className: "kbv-meta",
    style: {
      marginBottom: 10
    }
  }, area.name, " \xB7 ", freq), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5
    }
  }, Array.from({
    length: 7
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      height: 20,
      borderRadius: 5,
      background: i < 5 ? area.color : 'var(--kb-surface-2)'
    }
  }))));
}
function Habits() {
  const a = id => KB.areas.find(x => x.id === id);
  const items = [{
    name: 'Leer 20 minutos',
    area: a('wisdom'),
    freq: 'Diario',
    streak: 42
  }, {
    name: 'Entrenar fuerza',
    area: a('vigor'),
    freq: 'Lun · Mié · Vie',
    streak: 18
  }, {
    name: 'Meditar 10 min',
    area: a('will'),
    freq: 'Diario',
    streak: 7
  }, {
    name: 'Registrar gastos',
    area: a('wealth'),
    freq: 'Diario',
    streak: 90
  }, {
    name: 'Llamar a un amigo',
    area: a('community'),
    freq: 'Semanal',
    streak: 4
  }, {
    name: 'Caminar 8 000 pasos',
    area: a('vigor'),
    freq: 'Diario',
    streak: 23
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "kb-page fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "kb-eyebrow"
  }, "Rutina"), /*#__PURE__*/React.createElement("h1", {
    className: "kbv-h2",
    style: {
      margin: '4px 0 0'
    }
  }, "H\xE1bitos")), /*#__PURE__*/React.createElement(Button, null, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16,
    color: "#fff"
  }), " Nuevo h\xE1bito")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
      gap: 14
    }
  }, items.map(it => /*#__PURE__*/React.createElement(HabitCard, _extends({
    key: it.name
  }, it)))));
}
function Retos() {
  const a = id => KB.areas.find(x => x.id === id);
  const retos = [{
    name: '30 días sin azúcar',
    area: a('vigor'),
    day: 12,
    total: 30
  }, {
    name: 'Leer 4 libros este mes',
    area: a('wisdom'),
    day: 2,
    total: 4
  }, {
    name: 'Ahorrar $5 000',
    area: a('wealth'),
    day: 3200,
    total: 5000,
    money: true
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "kb-page fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "kb-eyebrow"
  }, "Desaf\xEDos"), /*#__PURE__*/React.createElement("h1", {
    className: "kbv-h2",
    style: {
      margin: '4px 0 0'
    }
  }, "Retos")), /*#__PURE__*/React.createElement(Button, null, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16,
    color: "#fff"
  }), " Nuevo reto")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
      gap: 14
    }
  }, retos.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    className: "kbv-card click"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "kb-area-dot",
    style: {
      background: r.area.color
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "kb-eyebrow"
  }, r.area.name)), /*#__PURE__*/React.createElement("h3", {
    className: "kb-card-title",
    style: {
      marginBottom: 12
    }
  }, r.name), /*#__PURE__*/React.createElement(Bar, {
    pct: Math.round(r.day / r.total * 100),
    color: r.area.color
  }), /*#__PURE__*/React.createElement("div", {
    className: "kbv-meta",
    style: {
      marginTop: 8
    }
  }, r.money ? `$${r.day.toLocaleString('es-MX')} / $${r.total.toLocaleString('es-MX')}` : `Día ${r.day} de ${r.total}`)))));
}
function ModuleLocked() {
  return /*#__PURE__*/React.createElement("div", {
    className: "kb-page fade-in",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-card",
    style: {
      maxWidth: 420,
      textAlign: 'center',
      padding: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'var(--kb-primary-soft)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 26,
    color: "var(--kb-primary)"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "kbv-h3",
    style: {
      margin: '0 0 8px'
    }
  }, "Proyectos es premium"), /*#__PURE__*/React.createElement("p", {
    className: "kbv-body",
    style: {
      color: 'var(--kb-text-2)',
      margin: '0 0 18px'
    }
  }, "Organiza misiones grandes en proyectos con sub-metas, plazos y recompensas. Desbloqu\xE9alo con Kibo Pro."), /*#__PURE__*/React.createElement(Button, null, "Probar Kibo Pro")));
}
Object.assign(window, {
  Habits,
  Retos,
  ModuleLocked
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Misc.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Sidebar.jsx
try { (() => {
/* Kibo App kit — left sidebar nav */

function Sidebar({
  page,
  setPage
}) {
  const main = [{
    id: 'dashboard',
    label: 'Inicio',
    icon: 'home'
  }, {
    id: 'habits',
    label: 'Hábitos',
    icon: 'repeat'
  }, {
    id: 'retos',
    label: 'Retos',
    icon: 'swords'
  }, {
    id: 'projects',
    label: 'Proyectos',
    icon: 'folder'
  }];
  const game = [{
    id: 'character',
    label: 'Personaje',
    icon: 'user'
  }, {
    id: 'store',
    label: 'Tienda',
    icon: 'shopping-bag'
  }];
  const Item = ({
    it
  }) => /*#__PURE__*/React.createElement("button", {
    className: `kb-nav-item${page === it.id ? ' on' : ''}`,
    onClick: () => setPage(it.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 18
  }), " ", it.label);
  return /*#__PURE__*/React.createElement("aside", {
    className: "kb-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-side-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/kibo-mark.svg",
    width: "30",
    height: "30",
    alt: ""
  }), /*#__PURE__*/React.createElement("b", null, "Kibo")), /*#__PURE__*/React.createElement("nav", {
    className: "kb-nav"
  }, main.map(it => /*#__PURE__*/React.createElement(Item, {
    key: it.id,
    it: it
  })), /*#__PURE__*/React.createElement("div", {
    className: "kb-nav-sec"
  }, "Progreso"), game.map(it => /*#__PURE__*/React.createElement(Item, {
    key: it.id,
    it: it
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kb-side-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-avatar",
    style: {
      width: 34,
      height: 34,
      fontSize: 14
    }
  }, KB.user.initial), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, KB.user.name), /*#__PURE__*/React.createElement("div", {
    className: "kb-eyebrow",
    style: {
      fontSize: 10
    }
  }, "NV ", KB.user.level)), /*#__PURE__*/React.createElement("button", {
    className: "kbv-btn kbv-icon-btn",
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 16
  }))));
}
window.Sidebar = Sidebar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Store.jsx
try { (() => {
/* Kibo App kit — Tienda / Vitrina (cosmetics store) */

function Price({
  cost,
  cur
}) {
  if (cost === 0) return /*#__PURE__*/React.createElement("span", {
    className: "kb-price",
    style: {
      color: 'var(--kb-primary-ink)'
    }
  }, "Gratis");
  return /*#__PURE__*/React.createElement("span", {
    className: "kb-price",
    style: {
      color: cur === 'gem' ? 'var(--kb-gem)' : '#b5851a'
    }
  }, cur === 'gem' ? /*#__PURE__*/React.createElement(GemIcon, {
    size: 14
  }) : /*#__PURE__*/React.createElement(CoinIcon, {
    size: 15
  }), " ", cost);
}
function Store() {
  const [tab, setTab] = React.useState('backgrounds');
  const tabs = [{
    id: 'backgrounds',
    label: 'Portadas'
  }, {
    id: 'frames',
    label: 'Marcos'
  }, {
    id: 'chests',
    label: 'Cofres'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "kb-page fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "kb-eyebrow"
  }, "Vitrina"), /*#__PURE__*/React.createElement("h1", {
    className: "kbv-h2",
    style: {
      margin: '4px 0 0'
    }
  }, "Tienda")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(StatPill, null, /*#__PURE__*/React.createElement(CoinIcon, null), " ", KB.user.coins.toLocaleString('es-MX')), /*#__PURE__*/React.createElement(StatPill, null, /*#__PURE__*/React.createElement(GemIcon, null), " ", KB.user.gems))), /*#__PURE__*/React.createElement("div", {
    className: "kbv-chips",
    style: {
      marginBottom: 18
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement(Chip, {
    key: t.id,
    on: tab === t.id,
    onClick: () => setTab(t.id)
  }, t.label))), tab === 'backgrounds' && /*#__PURE__*/React.createElement("div", {
    className: "kb-store-grid"
  }, KB.store.backgrounds.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.id,
    className: "kb-vt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-backdrop",
    style: {
      background: b.css
    }
  }, b.locked && /*#__PURE__*/React.createElement("div", {
    className: "kb-lock-badge"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 22,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kb-vt-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kb-vt-name"
  }, b.name), b.locked ? /*#__PURE__*/React.createElement("span", {
    className: "kb-eyebrow"
  }, "Pronto") : /*#__PURE__*/React.createElement(Price, {
    cost: b.cost,
    cur: b.cur
  }))))), tab === 'frames' && /*#__PURE__*/React.createElement("div", {
    className: "kb-store-grid"
  }, KB.store.frames.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    className: "kb-vt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-backdrop",
    style: {
      background: 'var(--kb-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-avatar",
    style: {
      width: 52,
      height: 52,
      boxShadow: f.ring
    }
  }, KB.user.initial)), /*#__PURE__*/React.createElement("div", {
    className: "kb-vt-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kb-vt-name"
  }, f.name), /*#__PURE__*/React.createElement(Price, {
    cost: f.cost,
    cur: f.cur
  }))))), tab === 'chests' && /*#__PURE__*/React.createElement("div", {
    className: "kb-store-grid"
  }, [{
    n: 'Cofre de madera',
    r: '1–5 gemas',
    c: '#A8632E',
    a: '#E0A878'
  }, {
    n: 'Cofre de metal',
    r: '5–20 gemas',
    c: '#8A95A2',
    a: '#D2D9E1'
  }, {
    n: 'Cofre de oro',
    r: '20–40 gemas',
    c: '#D4A22B',
    a: '#F8DC8A'
  }].map(ch => /*#__PURE__*/React.createElement("div", {
    key: ch.n,
    className: "kb-vt-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kb-backdrop",
    style: {
      background: `linear-gradient(160deg,${ch.a},${ch.c})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "gift",
    size: 40,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    className: "kb-vt-foot"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "kb-vt-name"
  }, ch.n), /*#__PURE__*/React.createElement("div", {
    className: "kb-eyebrow",
    style: {
      marginTop: 3
    }
  }, ch.r)), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    style: {
      padding: '7px 12px'
    }
  }, "Abrir"))))));
}
window.Store = Store;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Store.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.jsx
try { (() => {
/* Kibo App kit — mock data. Values follow the canonical DS spec. */

const KB = {
  user: {
    name: 'Mariana',
    initial: 'M',
    level: 27,
    xp: 2480,
    xpNext: 3200,
    hp: 86,
    coins: 1250,
    gems: 38,
    streak: 42
  },
  areas: [{
    id: 'vigor',
    name: 'Vigor',
    icon: 'dumbbell',
    color: 'var(--area-vigor)',
    hex: '#EF4444',
    level: 18,
    pct: 64
  }, {
    id: 'wisdom',
    name: 'Sabiduría',
    icon: 'book-open',
    color: 'var(--area-wisdom)',
    hex: '#3B82F6',
    level: 24,
    pct: 41
  }, {
    id: 'wealth',
    name: 'Riqueza',
    icon: 'piggy-bank',
    color: 'var(--area-wealth)',
    hex: '#EAB308',
    level: 12,
    pct: 78
  }, {
    id: 'community',
    name: 'Comunidad',
    icon: 'users',
    color: 'var(--area-community)',
    hex: '#A855F7',
    level: 9,
    pct: 30
  }, {
    id: 'will',
    name: 'Voluntad',
    icon: 'target',
    color: 'var(--area-will)',
    hex: '#06B6D4',
    level: 15,
    pct: 55
  }],
  habits: [{
    id: 'h1',
    name: 'Leer 20 minutos',
    area: 'wisdom',
    xp: 30,
    done: false
  }, {
    id: 'h2',
    name: 'Entrenar fuerza',
    area: 'vigor',
    xp: 45,
    done: true
  }, {
    id: 'h3',
    name: 'Meditar 10 min',
    area: 'will',
    xp: 25,
    done: false
  }, {
    id: 'h4',
    name: 'Registrar gastos',
    area: 'wealth',
    xp: 20,
    done: false
  }, {
    id: 'h5',
    name: 'Llamar a un amigo',
    area: 'community',
    xp: 35,
    done: false
  }],
  boss: {
    name: 'Terminar la tesis',
    area: 'wealth',
    hpMax: 3000,
    hp: 1140
  },
  priorities: [{
    id: 'urgent',
    name: 'Urgente',
    color: 'var(--pri-urgent)'
  }, {
    id: 'high',
    name: 'Alta',
    color: 'var(--pri-high)'
  }, {
    id: 'medium',
    name: 'Media',
    color: 'var(--pri-medium)'
  }, {
    id: 'low',
    name: 'Baja',
    color: 'var(--pri-low)'
  }],
  // Rank materials (gradient a/b + ink), from the spec's scoped tokens.
  ranks: [{
    name: 'Bronce',
    a: '#E0A878',
    b: '#A8632E',
    ink: '#4A2810',
    unlocked: true
  }, {
    name: 'Plata',
    a: '#D2D9E1',
    b: '#8A95A2',
    ink: '#363E48',
    unlocked: true
  }, {
    name: 'Oro',
    a: '#F8DC8A',
    b: '#D4A22B',
    ink: '#5E440E',
    unlocked: true
  }, {
    name: 'Platino',
    a: '#E9EEF3',
    b: '#AAB6C4',
    ink: '#3A434E',
    unlocked: true
  }, {
    name: 'Obsidiana',
    a: '#6E6880',
    b: '#241F30',
    ink: '#E6E1F2',
    unlocked: false
  }, {
    name: 'Diamante',
    a: '#CFF6FF',
    b: '#3FC0DE',
    ink: '#0E4A5A',
    unlocked: false
  }, {
    name: 'Esmeralda',
    a: '#A8E6C0',
    b: '#1E9E63',
    ink: '#0C4A2C',
    unlocked: false
  }, {
    name: 'Rubí',
    a: '#FF9DB0',
    b: '#C8102E',
    ink: '#FFFFFF',
    unlocked: false
  }, {
    name: 'Damasco',
    a: '#C9CDD4',
    b: '#5A5E68',
    ink: '#241B33',
    unlocked: false
  }],
  prestige: {
    grade: 7,
    name: 'Comodoro Galáctico',
    sub: 'Líder de escuadra',
    a: '#F4DC92',
    b: '#D0A02E',
    ink: '#5E440E',
    glow: '#FFE7A0',
    stars: 2
  },
  achievements: [{
    name: 'Madrugador',
    color: '#5FA98A',
    icon: 'sunrise',
    unlocked: true,
    rarity: 'Común'
  }, {
    name: 'Imparable',
    color: '#E64545',
    icon: 'flame',
    unlocked: true,
    rarity: 'Legendario'
  }, {
    name: 'Mente clara',
    color: '#6E8CF2',
    icon: 'brain',
    unlocked: true,
    rarity: 'Raro'
  }, {
    name: 'Constante',
    color: '#4CAF82',
    icon: 'calendar-check',
    unlocked: true,
    rarity: 'Común'
  }, {
    name: 'Ahorrador',
    color: '#E0A82B',
    icon: 'piggy-bank',
    unlocked: true,
    rarity: 'Épico'
  }, {
    name: 'Maratonista',
    color: '#A855F7',
    icon: 'medal',
    unlocked: false,
    rarity: 'Épico'
  }, {
    name: 'Mentor',
    color: '#06B6D4',
    icon: 'heart-handshake',
    unlocked: false,
    rarity: 'Raro'
  }, {
    name: '???',
    color: '#8A5CF0',
    icon: 'lock',
    unlocked: false,
    rarity: 'Secreto'
  }],
  store: {
    backgrounds: [{
      id: 'slate',
      name: 'Pizarra',
      cost: 0,
      cur: 'coin',
      locked: false,
      css: 'linear-gradient(155deg,#2B313D 0%,#181C25 100%)'
    }, {
      id: 'aurora',
      name: 'Aurora',
      cost: 450,
      cur: 'coin',
      locked: false,
      css: 'linear-gradient(135deg,#155C40 0%,#2E8B63 55%,#6FD3A2 100%)'
    }, {
      id: 'dusk',
      name: 'Crepúsculo',
      cost: 550,
      cur: 'coin',
      locked: false,
      css: 'linear-gradient(135deg,#5A2150 0%,#B23A4A 55%,#E0731B 100%)'
    }, {
      id: 'nebula',
      name: 'Nebulosa',
      cost: 35,
      cur: 'gem',
      locked: false,
      css: 'linear-gradient(135deg,#221C66 0%,#6D3BD0 55%,#B06BF5 100%)'
    }, {
      id: 'cosmos',
      name: 'Cosmos',
      cost: 80,
      cur: 'gem',
      locked: false,
      css: 'radial-gradient(120% 110% at 18% 0%,#2A2057 0%,#140F33 48%,#08061A 100%)'
    }, {
      id: 'collab',
      name: 'Colab de marca',
      cost: 0,
      cur: 'coin',
      locked: true,
      css: 'linear-gradient(135deg,#3a3f4b,#22262f)'
    }],
    frames: [{
      id: 'gold',
      name: 'Marco oro',
      cost: 300,
      cur: 'coin',
      ring: '0 0 0 3px #F4C24B, 0 0 0 6px rgba(244,194,75,.28)'
    }, {
      id: 'aurora',
      name: 'Marco aurora',
      cost: 300,
      cur: 'coin',
      ring: '0 0 0 3px #4CAF82, 0 0 0 6px rgba(76,175,130,.28)'
    }, {
      id: 'neon',
      name: 'Marco neón',
      cost: 28,
      cur: 'gem',
      ring: '0 0 0 3px #22D3EE, 0 0 12px rgba(34,211,238,.6)'
    }, {
      id: 'obsid',
      name: 'Marco obsidiana',
      cost: 24,
      cur: 'gem',
      ring: '0 0 0 3px #2A2438, 0 0 0 6px rgba(138,130,168,.4)'
    }]
  }
};
window.KB = KB;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/icons.jsx
try { (() => {
/* Kibo App kit — icons. Lucide (the set the live app imports) via CDN UMD.
   <Icon name="flame" size={18}/> renders an <i data-lucide>; a global effect
   re-runs lucide.createIcons() after each render so new icons hydrate. */

function Icon({
  name,
  size = 18,
  color,
  strokeWidth = 1.75,
  style
}) {
  return /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      color,
      ['--lucide-stroke']: strokeWidth,
      ...style
    },
    "data-sw": strokeWidth
  });
}

// Re-hydrate Lucide icons after React commits.
function useLucide(dep) {
  React.useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons({
        attrs: {
          'stroke-width': 1.75
        }
      });
    }
  });
}

// Currency glyphs — intentionally filled brand objects, not UI icons.
function CoinIcon({
  size = 18
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "kb-coin",
    style: {
      width: size,
      height: size
    }
  });
}
function GemIcon({
  size = 16
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "kb-gem",
    style: {
      width: size,
      height: size
    }
  });
}

// Flame glyph for streaks (tinted by tier color).
function FlameSVG({
  size = 18,
  color = 'var(--kb-streak)'
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: color,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2c1.5 4 5 5.5 5 9.5a5 5 0 0 1-10 0c0-1.6.8-2.6 1.5-3.4C9 9.5 9.3 10.6 10 11c-.3-2 1-4.2 2-9z"
  }));
}
Object.assign(window, {
  Icon,
  useLucide,
  CoinIcon,
  GemIcon,
  FlameSVG
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ui.jsx
try { (() => {
/* Kibo App kit — shared primitives */

function Button({
  variant = 'primary',
  children,
  onClick,
  type = 'button',
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    onClick: onClick,
    className: `kbv-btn kbv-btn-${variant}`,
    style: style
  }, children);
}
function Bar({
  pct,
  color = 'var(--kb-primary)',
  track
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-bar",
    style: track ? {
      background: track
    } : null
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: `${pct}%`,
      background: color
    }
  }));
}
function StatPill({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "kb-statpill",
    style: style
  }, children);
}
function Chip({
  on,
  children,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: `kbv-chip${on ? ' on' : ''}`,
    onClick: onClick
  }, children);
}
function Modal({
  title,
  onClose,
  children,
  foot
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "kbv-modal-veil",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-modal-card fade-in",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "kbv-modal-head"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kb-card-title"
  }, title), /*#__PURE__*/React.createElement("button", {
    className: "kbv-btn kbv-icon-btn",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kbv-modal-body"
  }, children), foot && /*#__PURE__*/React.createElement("div", {
    className: "kbv-modal-foot"
  }, foot)));
}

// Hexagonal rank emblem.
function Emblem({
  rank,
  size = 46,
  num,
  locked
}) {
  const fontSize = Math.round(size * 0.26);
  if (locked || rank && rank.unlocked === false) {
    return /*#__PURE__*/React.createElement("div", {
      className: "kb-emblem locked",
      style: {
        width: size,
        height: size * 1.13,
        fontSize
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: size * 0.34
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "kb-emblem",
    style: {
      width: size,
      height: size * 1.13,
      fontSize,
      background: `linear-gradient(145deg, ${rank.a}, ${rank.b})`,
      color: rank.ink
    }
  }, num);
}
Object.assign(window, {
  Button,
  Bar,
  StatPill,
  Chip,
  Modal,
  Emblem
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ui.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/Web.jsx
try { (() => {
/* Kibo · Web kit — marketing, auth, onboarding components */

function GoogleMark() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 18 18"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#4285F4",
    d: "M17.6 9.2c0-.6 0-1.1-.2-1.7H9v3.3h4.8a4 4 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#34A853",
    d: "M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.8v2.3A9 9 0 0 0 9 18z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FBBC05",
    d: "M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.8a9 9 0 0 0 0 8l3.1-2.3z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#EA4335",
    d: "M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 .8 5l3.1 2.3C4.6 5.2 6.6 3.6 9 3.6z"
  }));
}
function MsMark() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 21 21"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "9",
    height: "9",
    fill: "#f25022"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "11",
    width: "9",
    height: "9",
    fill: "#00a4ef"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "11",
    y: "1",
    width: "9",
    height: "9",
    fill: "#7fba00"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "11",
    y: "11",
    width: "9",
    height: "9",
    fill: "#ffb900"
  }));
}
function Nav({
  go
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "web-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "web-nav-in"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => go('landing'),
    style: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/kibo-mark.svg",
    width: "30",
    height: "30",
    alt: ""
  }), /*#__PURE__*/React.createElement("b", {
    style: {
      fontFamily: 'var(--kb-f-display)',
      fontWeight: 800,
      fontSize: 20,
      letterSpacing: '-.02em'
    }
  }, "Kibo")), /*#__PURE__*/React.createElement("nav", {
    className: "web-nav-links"
  }, /*#__PURE__*/React.createElement("a", null, "Filosof\xEDa"), /*#__PURE__*/React.createElement("a", null, "Blog"), /*#__PURE__*/React.createElement("a", null, "FAQ")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "kbv-btn kbv-btn-secondary",
    onClick: () => go('login')
  }, "Entrar"), /*#__PURE__*/React.createElement("a", {
    className: "kbv-btn kbv-btn-primary",
    onClick: () => go('register')
  }, "Crear cuenta"))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "web-foot"
  }, "\xA9 ", new Date().getFullYear(), " Kibo \xB7 Personal OS gamificado \xB7 Hecho en M\xE9xico");
}
function Landing({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("h1", null, "Tu vida es la mejor", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "aventura"), " que jugar\xE1s."), /*#__PURE__*/React.createElement("p", null, "Kibo convierte tus metas en misiones, tus h\xE1bitos en rachas y cada avance en experiencia. Un segundo cerebro con filosof\xEDa zen."), /*#__PURE__*/React.createElement("div", {
    className: "hero-cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "kbv-btn kbv-btn-primary kbv-btn-lg",
    onClick: () => go('register')
  }, "Empezar onboarding \u2192"), /*#__PURE__*/React.createElement("a", {
    className: "kbv-btn kbv-btn-secondary kbv-btn-lg",
    onClick: () => go('login')
  }, "Ya tengo cuenta")), /*#__PURE__*/React.createElement("div", {
    className: "hero-chips"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero-chip"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--area-vigor)'
    }
  }), "Vigor"), /*#__PURE__*/React.createElement("span", {
    className: "hero-chip"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--area-wisdom)'
    }
  }), "Sabidur\xEDa"), /*#__PURE__*/React.createElement("span", {
    className: "hero-chip"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--area-wealth)'
    }
  }), "Riqueza"), /*#__PURE__*/React.createElement("span", {
    className: "hero-chip"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--area-community)'
    }
  }), "Comunidad"), /*#__PURE__*/React.createElement("span", {
    className: "hero-chip"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--area-will)'
    }
  }), "Voluntad"))), /*#__PURE__*/React.createElement("div", {
    className: "hero-preview"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-frame"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      padding: 28,
      background: 'var(--kb-surface)'
    }
  }, [['XP', '2 480', 'var(--kb-primary)'], ['Racha', '42 días', 'var(--kb-streak)'], ['Nivel', '27', 'var(--kb-text)']].map(([k, v, c]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      flex: 1,
      background: '#fff',
      border: '1px solid var(--kb-border)',
      borderRadius: 'var(--kb-r-lg)',
      padding: 18,
      boxShadow: 'var(--kb-sh-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--kb-f-mono)',
      fontSize: 10,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--kb-text-3)'
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--kb-f-mono)',
      fontSize: 26,
      color: c,
      marginTop: 6
    }
  }, v)))))), /*#__PURE__*/React.createElement(Footer, null));
}
function OAuthRow() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "oauth-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "oauth-btn"
  }, /*#__PURE__*/React.createElement(MsMark, null), " Microsoft"), /*#__PURE__*/React.createElement("button", {
    className: "oauth-btn"
  }, /*#__PURE__*/React.createElement(GoogleMark, null), " Google")), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }, /*#__PURE__*/React.createElement("span", null, "O contin\xFAa con")));
}
function Register({
  go
}) {
  const [pw, setPw] = React.useState('');
  const checks = [{
    ok: pw.length >= 6,
    label: 'Al menos 6 caracteres'
  }, {
    ok: /[A-Z]/.test(pw),
    label: 'Una mayúscula'
  }, {
    ok: /[0-9]/.test(pw),
    label: 'Un número'
  }];
  const score = checks.filter(c => c.ok).length;
  const colors = ['var(--kb-surface-2)', 'var(--pri-high)', 'var(--kb-coin)', 'var(--kb-primary)'];
  return /*#__PURE__*/React.createElement("div", {
    className: "auth-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Crear cuenta"), /*#__PURE__*/React.createElement("p", null, "\xDAnete a Kibo y comienza tu aventura")), /*#__PURE__*/React.createElement(OAuthRow, null), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Nombre de usuario"), /*#__PURE__*/React.createElement("input", {
    placeholder: "tu_nombre_usuario"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Correo electr\xF3nico"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "tu@email.com"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Contrase\xF1a"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: pw,
    onChange: e => setPw(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "strength"
  }, /*#__PURE__*/React.createElement("div", {
    className: "strength-bars"
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      background: i < score ? colors[score] : 'var(--kb-surface-2)'
    }
  }))), checks.map(c => /*#__PURE__*/React.createElement("span", {
    key: c.label,
    className: `strength-item${c.ok ? ' ok' : ''}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.ok ? 'check-circle-2' : 'circle',
    size: 13
  }), " ", c.label))), /*#__PURE__*/React.createElement("button", {
    className: "kbv-btn kbv-btn-primary",
    style: {
      width: '100%',
      justifyContent: 'center',
      padding: 12
    },
    onClick: () => go('onboarding')
  }, "Crear cuenta"), /*#__PURE__*/React.createElement("div", {
    className: "auth-foot"
  }, "\xBFYa tienes una cuenta? ", /*#__PURE__*/React.createElement("a", {
    onClick: () => go('login')
  }, "Inicia sesi\xF3n"))));
}
function Login({
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "auth-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Bienvenido a Kibo"), /*#__PURE__*/React.createElement("p", null, "Inicia sesi\xF3n para continuar tu aventura")), /*#__PURE__*/React.createElement(OAuthRow, null), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Correo electr\xF3nico"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "tu@email.com"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("label", null, "Contrase\xF1a"), /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 11,
      color: 'var(--kb-text-3)',
      cursor: 'pointer'
    }
  }, "\xBFOlvidaste tu contrase\xF1a?")), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
  })), /*#__PURE__*/React.createElement("button", {
    className: "kbv-btn kbv-btn-primary",
    style: {
      width: '100%',
      justifyContent: 'center',
      padding: 12,
      marginTop: 4
    },
    onClick: () => go('onboarding')
  }, "Iniciar sesi\xF3n"), /*#__PURE__*/React.createElement("div", {
    className: "auth-foot"
  }, "\xBFNuevo en Kibo? ", /*#__PURE__*/React.createElement("a", {
    onClick: () => go('register')
  }, "Crear cuenta"))));
}
function Onboarding({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "onb-progress"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: '33%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "onb-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "onb-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "onb-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "onb-badge"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user-round",
    size: 32,
    color: "var(--kb-primary)"
  })), /*#__PURE__*/React.createElement("h2", null, "Configura tu personaje"), /*#__PURE__*/React.createElement("p", null, "Toda gran aventura comienza con un nombre. \xBFC\xF3mo te llamaremos?")), /*#__PURE__*/React.createElement("div", {
    className: "onb-avatar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "onb-avatar-ring"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user-round",
    size: 52,
    color: "var(--kb-text-3)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "onb-cam"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "camera",
    size: 16,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "field hint",
    style: {
      margin: 0
    }
  }, "Subir foto")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Tu nombre"), /*#__PURE__*/React.createElement("input", {
    placeholder: "\xBFC\xF3mo te dicen tus amigos?",
    defaultValue: "Mariana"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "G\xE9nero"), /*#__PURE__*/React.createElement("select", null, /*#__PURE__*/React.createElement("option", null, "Selecciona una opci\xF3n"), /*#__PURE__*/React.createElement("option", null, "Mujer"), /*#__PURE__*/React.createElement("option", null, "Hombre"), /*#__PURE__*/React.createElement("option", null, "No binario"), /*#__PURE__*/React.createElement("option", null, "Prefiero no decir")), /*#__PURE__*/React.createElement("span", {
    className: "hint"
  }, "Para dirigirnos a ti correctamente.")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Fecha de nacimiento"), /*#__PURE__*/React.createElement("input", {
    type: "date"
  }), /*#__PURE__*/React.createElement("span", {
    className: "hint"
  }, "\xA1Para celebrar tu vuelta al sol!")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Tu misi\xF3n actual"), /*#__PURE__*/React.createElement("textarea", {
    rows: "3",
    placeholder: "\xBFQu\xE9 quieres lograr este a\xF1o?"
  }), /*#__PURE__*/React.createElement("span", {
    className: "hint"
  }, "Opcional, pero nos ayuda a conocerte mejor.")), /*#__PURE__*/React.createElement("div", {
    className: "onb-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "kbv-btn kbv-btn-secondary",
    onClick: () => go('register')
  }, "Volver"), /*#__PURE__*/React.createElement("button", {
    className: "kbv-btn kbv-btn-primary",
    onClick: () => go('landing')
  }, "\xA1Listo, vamos! \uD83D\uDE80")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 12,
      color: 'var(--kb-text-3)',
      marginTop: 14
    }
  }, "Paso 1 de 3"))));
}
Object.assign(window, {
  Nav,
  Footer,
  Landing,
  Register,
  Login,
  Onboarding
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/Web.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/WebApp.jsx
try { (() => {
/* Kibo · Web kit — root router */
function WebApp() {
  const [page, setPage] = React.useState('landing');
  const go = p => setPage(p);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons({
      attrs: {
        'stroke-width': 1.75
      }
    });
  });
  const showNav = page === 'landing' || page === 'register' || page === 'login';
  const pages = {
    landing: Landing,
    register: Register,
    login: Login,
    onboarding: Onboarding
  };
  const Page = pages[page] || Landing;
  return /*#__PURE__*/React.createElement("div", {
    className: "web kb-root"
  }, showNav && /*#__PURE__*/React.createElement(Nav, {
    go: go
  }), /*#__PURE__*/React.createElement(Page, {
    go: go,
    key: page
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(WebApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/WebApp.jsx", error: String((e && e.message) || e) }); }

__ds_ns.KbButton = __ds_scope.KbButton;

__ds_ns.KbCard = __ds_scope.KbCard;

__ds_ns.KbChip = __ds_scope.KbChip;

__ds_ns.KbEmblem = __ds_scope.KbEmblem;

__ds_ns.KbStatPill = __ds_scope.KbStatPill;

})();
