// Genera Verdes.dc.html: la lamina de decision de marca. Los numeros son los
// medidos en navegador con _verde.mjs, no estimaciones.
import fs from 'fs';

const C = [
  { id: 'a', L: 'A', hex: '#1CA4A0', nom: 'Teal actual',      nota: 'La referencia. Es lo que hay hoy en toda la maqueta.' },
  { id: 'b', L: 'B', hex: '#00B894', nom: 'Verde jade',       nota: 'La misma familia, con mas verde y mas fuerza.' },
  { id: 'c', L: 'C', hex: '#00C271', nom: 'Verde esmeralda',  nota: 'El punto donde deja de leerse azulado y se lee verde.' },
  { id: 'd', L: 'D', hex: '#14CF6E', nom: 'Verde vivo',       nota: 'Salto claro de vibracion, todavia con cuerpo.' },
  { id: 'e', L: 'E', hex: '#2BE07E', nom: 'Verde brillante',  nota: 'El extremo del abanico. Maxima energia, minimo cuerpo.' },
];

const M = {
  a: { claro: [7.70, 7.70, 6.85, 2.72, 6.85], oscuro: [5.91, 8.23, 6.95, 7.96, 12.17] },
  b: { claro: [6.86, 6.86, 6.22, 2.30, 6.22], oscuro: [5.54, 8.80, 7.11, 8.86, 12.58] },
  c: { claro: [6.54, 6.54, 5.96, 2.14, 5.96], oscuro: [5.33, 9.07, 7.22, 9.21, 12.70] },
  d: { claro: [6.04, 6.04, 5.59, 1.91, 5.59], oscuro: [5.07, 9.46, 7.25, 9.87, 12.97] },
  e: { claro: [5.40, 5.40, 5.08, 1.64, 5.08], oscuro: [4.68, 10.14, 7.42, 10.82, 13.39] },
};

const DERIVA = '--kb-primary-ink: color-mix(in oklab, var(--kb-primary) 54%, var(--kb-void-2));'
  + ' --kb-primary-soft: color-mix(in oklab, var(--kb-primary) 12%, var(--kb-canvas));'
  + ' --kb-primary-hover: color-mix(in oklab, var(--kb-primary) 82%, var(--kb-void-2));';

const mini = (c, tema) => `
<div class="kb-app vd-app" style="--kb-primary: var(--vd-${c.id}); ${DERIVA}">
  <div class="vd-mini${tema === 'oscuro' ? ' theme-dark' : ''}">
    <div class="vd-top">
      <span class="vd-mark">K</span>
      <span class="vd-name">Kibo</span>
      <span class="vd-grow"></span>
      <span class="vd-hud"><b class="vd-hudn">1 240</b> divisa</span>
      <span class="vd-hud"><b class="vd-hudn">Nv 12</b></span>
    </div>
    <div class="vd-cols">
      <div class="vd-side">
        <span class="vd-nav on">Hoy</span>
        <span class="vd-nav">H&aacute;bitos</span>
        <span class="vd-nav">Tareas</span>
        <span class="vd-nav">&Aacute;reas</span>
      </div>
      <div class="vd-content">
        <div class="kbv-card vd-card">
          <div class="kbv-card-title">Rutina de la ma&ntilde;ana</div>
          <div class="kbv-progress"><span class="fill" style="width:62%"></span></div>
          <div class="vd-row">
            <button class="kbv-btn sm kbv-btn-primary" type="button">Completar</button>
            <button class="kbv-btn sm kbv-btn-ghost" type="button">M&aacute;s tarde</button>
            <span class="kbv-chip active">Vigor</span>
          </div>
          <div class="kbv-meta">Racha de 12 d&iacute;as &middot; <a href="#">ver detalle</a></div>
        </div>
        <div class="vd-kpis">
          <div class="vd-kpi"><span class="vd-kpin">62 %</span><span class="kbv-meta">constancia</span></div>
          <div class="vd-kpi"><span class="vd-kpin">8/14</span><span class="kbv-meta">de la semana</span></div>
        </div>
      </div>
    </div>
  </div>
</div>`;

const marca = (v, piso) => v >= piso ? '<span class="vd-ok">pasa</span>' : '<span class="vd-no">reprueba</span>';

const filaTabla = (c, tema) => {
  const m = M[c.id][tema];
  return `<tr>
  <td class="vd-td-c"><span class="vd-dot" style="background: var(--vd-${c.id})"></span>${c.L}</td>
  <td>${tema}</td>
  <td class="vd-n">${m[0].toFixed(2)}</td>
  <td class="vd-n">${m[1].toFixed(2)}</td>
  <td class="vd-n">${m[2].toFixed(2)}</td>
  <td class="vd-n${m[3] >= 3 ? '' : ' vd-bad'}">${m[3].toFixed(2)} ${marca(m[3], 3)}</td>
  <td class="vd-n">${m[4].toFixed(2)}</td>
</tr>`;
};

const CSS = `
  /* Lamina de decision de marca */
  .vd-wrap { padding: 32px 40px 56px; display: grid; gap: 28px; }
  .vd-lead { max-width: 78ch; }
  .vd-sec { display: grid; gap: 14px; }
  .vd-swatches { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
  .vd-sw { border-radius: var(--kb-r-lg); overflow: hidden; border: 1px solid var(--kb-border);
           background: var(--kb-card); }
  .vd-sw-face { height: 92px; display: flex; align-items: flex-end; padding: 10px 12px; }
  .vd-sw-l { font-family: var(--kb-f-display); font-weight: 800; font-size: var(--kb-fs-2xl);
             color: var(--kb-text-inverse); }
  .vd-sw-body { padding: 10px 12px 12px; display: grid; gap: 4px; }
  .vd-sw-nom { font-family: var(--kb-f-display); font-weight: 700; font-size: var(--kb-fs-md);
               color: var(--kb-text); }
  .vd-sw-hex { font-family: var(--kb-f-label); font-weight: 700; font-size: var(--kb-fs-xs);
               letter-spacing: .06em; color: var(--kb-text-2); }

  .vd-par { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
  .vd-parhead { display: flex; align-items: baseline; gap: 10px; }
  .vd-parhead .l { font-family: var(--kb-f-display); font-weight: 800; font-size: var(--kb-fs-xl);
                   color: var(--kb-text); }
  .vd-parhead .n { font-family: var(--kb-f-display); font-weight: 700; font-size: var(--kb-fs-lg);
                   color: var(--kb-text); }
  .vd-parhead .h { font-family: var(--kb-f-label); font-weight: 700; font-size: var(--kb-fs-xs);
                   letter-spacing: .06em; color: var(--kb-text-2); }

  .vd-app { width: auto; height: auto; }
  .vd-mini { background: var(--kb-surface); border: 1px solid var(--kb-border);
             border-radius: var(--kb-r-lg); overflow: hidden; }
  .vd-top { display: flex; align-items: center; gap: 8px; height: 52px; padding: 0 14px;
            background: var(--kb-card); border-bottom: 1px solid var(--kb-border); }
  .vd-mark { width: 28px; height: 28px; border-radius: var(--kb-r-sm); display: grid;
             place-items: center; font-family: var(--kb-f-display); font-weight: 800;
             font-size: var(--kb-fs-lg); color: var(--kb-text-inverse);
             background: color-mix(in oklab, var(--kb-primary) 54%, var(--kb-void-2)); }
  .vd-name { font-family: var(--kb-f-display); font-weight: 800; font-size: var(--kb-fs-lg);
             color: var(--kb-text); }
  .vd-grow { flex: 1; }
  .vd-hud { font-family: var(--kb-f-body); font-size: var(--kb-fs-sm); color: var(--kb-text-2); }
  .vd-hudn { font-family: var(--kb-f-display); font-weight: 700; color: var(--kb-primary-ink); }
  .vd-cols { display: grid; grid-template-columns: 128px 1fr; }
  .vd-side { padding: 10px 8px; display: grid; gap: 2px; align-content: start;
             background: var(--kb-card); border-right: 1px solid var(--kb-border); min-height: 196px; }
  .vd-nav { height: 32px; display: flex; align-items: center; padding: 0 10px;
            border-radius: var(--kb-r-sm); font-family: var(--kb-f-display); font-weight: 600;
            font-size: var(--kb-fs-md); color: var(--kb-text-2); }
  .vd-nav.on { background: var(--kb-primary-soft); color: var(--kb-primary-ink); font-weight: 700; }
  .vd-content { padding: 12px; display: grid; gap: 10px; align-content: start; }
  .vd-card { padding: 12px; display: grid; gap: 9px; }
  .vd-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .vd-kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .vd-kpi { background: var(--kb-card); border: 1px solid var(--kb-border);
            border-radius: var(--kb-r-md); padding: 10px 12px; display: grid; gap: 2px; }
  .vd-kpin { font-family: var(--kb-f-display); font-weight: 800; font-size: var(--kb-fs-2xl);
             color: var(--kb-primary-ink); line-height: 1.1; }

  .vd-tabla { width: 100%; border-collapse: collapse; background: var(--kb-card);
              border: 1px solid var(--kb-border); border-radius: var(--kb-r-md); overflow: hidden; }
  .vd-tabla th { text-align: left; font-family: var(--kb-f-label); font-weight: 800;
                 font-size: var(--kb-fs-xs); letter-spacing: .07em; text-transform: uppercase;
                 color: var(--kb-text-2); padding: 9px 12px; background: var(--kb-surface-2);
                 border-bottom: 1px solid var(--kb-border); }
  .vd-tabla td { padding: 8px 12px; font-size: var(--kb-fs-md); color: var(--kb-text);
                 border-bottom: 1px solid var(--kb-border-soft); }
  .vd-n { font-family: var(--kb-f-display); font-weight: 700; font-variant-numeric: tabular-nums; }
  .vd-td-c { font-family: var(--kb-f-display); font-weight: 800; }
  .vd-dot { display: inline-block; width: 12px; height: 12px; border-radius: 50%;
            margin-right: 8px; vertical-align: -1px; }
  .vd-ok { font-family: var(--kb-f-label); font-weight: 800; font-size: var(--kb-fs-2xs);
           letter-spacing: .06em; text-transform: uppercase; color: var(--kb-primary-ink); }
  .vd-no { font-family: var(--kb-f-label); font-weight: 800; font-size: var(--kb-fs-2xs);
           letter-spacing: .06em; text-transform: uppercase; color: var(--kb-hp-ink); }
  .vd-bad { background: color-mix(in oklab, var(--kb-hp) var(--kb-wash-amt), var(--kb-wash-anchor)); }

  .vd-antes { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .vd-caso { background: var(--kb-card); border: 1px solid var(--kb-border);
             border-radius: var(--kb-r-md); padding: 14px; display: grid; gap: 10px; }
  .vd-caso h5 { margin: 0; font-family: var(--kb-f-display); font-weight: 700;
                font-size: var(--kb-fs-lg); color: var(--kb-text); }
  .vd-fija .fill { background: color-mix(in oklab, var(--kb-primary) var(--kb-ink-amt), var(--kb-ink-anchor)); }
`;

const shell = fs.readFileSync('Shell.dc.html', 'utf8');
const cabeza = shell.slice(0, shell.indexOf('</helmet>'));

const tokens = '\n<style>\n:root {\n'
  + C.map(c => `  --vd-${c.id}: ${c.hex};`).join('\n')
  + '\n}\n' + CSS + '\n</style>\n</helmet>';

const swatches = C.map(c => `
      <div class="vd-sw">
        <div class="vd-sw-face" style="background: var(--vd-${c.id})"><span class="vd-sw-l">${c.L}</span></div>
        <div class="vd-sw-body">
          <div class="vd-sw-nom">${c.nom}</div>
          <div class="vd-sw-hex">&#35;${c.hex.slice(1)}</div>
        </div>
      </div>`).join('');

const pares = C.map(c => `
      <div class="vd-sec">
        <div class="vd-parhead">
          <span class="l">${c.L}</span><span class="n">${c.nom}</span><span class="h">&#35;${c.hex.slice(1)}</span>
        </div>
        <div class="kbv-meta">${c.nota}</div>
        <div class="vd-par">
          ${mini(c, 'claro')}
          ${mini(c, 'oscuro')}
        </div>
      </div>`).join('');

const tabla = C.map(c => filaTabla(c, 'claro') + filaTabla(c, 'oscuro')).join('\n');

const cuerpo = `
<div style="width:1440px; min-height:900px; background:var(--kb-surface);
            --kb-sp-7:16px; --kb-sp-8:20px; --kb-sp-9:24px;
            --kb-fs-4xl-fluid:34px; --kb-fs-3xl-fluid:26px;
            --kb-fs-2xl-fluid:22px; --kb-fs-xl-fluid:18px;">
  <div class="kb-app">
    <div class="vd-wrap">

      <div class="vd-sec">
        <div class="kbv-eyebrow">Decisi&oacute;n de marca</div>
        <h1 class="kbv-h1">El verde de Kibo</h1>
        <div class="kbv-body vd-lead">Cinco candidatos, del teal de hoy al verde m&aacute;s vibrante que el sistema resiste. Cada uno est&aacute; pintado sobre la misma composici&oacute;n real &mdash; cabecera, men&uacute;, tarjeta, barra, bot&oacute;n, chip y cifra &mdash; en tema claro y en tema oscuro, porque un color de marca no se juzga en un cuadrito: se juzga en la pantalla que va a pintar.</div>
        <div class="kbv-notice">
          <div class="kbv-body"><b>C&oacute;mo se decide.</b> Recorre los cinco pares y qu&eacute;date con el que quieras ver todos los d&iacute;as. El contraste ya est&aacute; medido y los cinco pasan el piso de texto en los dos temas, as&iacute; que la elecci&oacute;n es est&eacute;tica: ninguno te obliga a ceder accesibilidad.</div>
        </div>
      </div>

      <div class="vd-sec">
        <h2 class="kbv-h3">Los cinco, en crudo</h2>
        <div class="vd-swatches">${swatches}
        </div>
      </div>

      <div class="vd-sec">
        <h2 class="kbv-h3">Los cinco, en la aplicaci&oacute;n</h2>
        <div class="kbv-meta">Izquierda tema claro, derecha tema oscuro. Es la misma composici&oacute;n en los diez casos: lo &uacute;nico que cambia es el token de marca.</div>
      </div>
${pares}

      <div class="vd-sec">
        <h2 class="kbv-h3">El contraste, medido</h2>
        <div class="kbv-meta">Medido en navegador sobre esta misma composici&oacute;n, rasterizando cada color a p&iacute;xel. Piso de texto 4.5; piso de pieza no textual 3.0.</div>
        <table class="vd-tabla">
          <thead>
            <tr>
              <th>Verde</th><th>Tema</th>
              <th>Bot&oacute;n primario</th><th>Tinta sobre lienzo</th><th>Chip activo</th>
              <th>Barra hoy</th><th>Barra con receta</th>
            </tr>
          </thead>
          <tbody>
${tabla}
          </tbody>
        </table>
        <div class="kbv-meta">Las tres primeras columnas son texto y las cinco opciones pasan AA en los dos temas. La cuarta no es texto y es la &uacute;nica que reprueba &mdash; en los cinco, incluido el teal de hoy.</div>
      </div>

      <div class="vd-sec">
        <h2 class="kbv-h3">Lo que la medici&oacute;n destap&oacute;</h2>
        <div class="kbv-body vd-lead">La barra de progreso pinta su relleno con el color de marca en crudo, sobre una pista que es ese mismo color al 12 % contra el lienzo. En tema claro eso da <b>2.72</b> con el teal de hoy, por debajo del piso de 3.0 &mdash; y cada paso hacia un verde m&aacute;s vibrante lo empeora, hasta 1.64. No es un defecto que traiga el cambio de color: <b>ya estaba ah&iacute;</b>, y el cambio solo lo vuelve visible.</div>
        <div class="vd-antes">
          <div class="vd-caso">
            <h5>Como est&aacute; hoy</h5>
            <div class="kb-app vd-app" style="--kb-primary: var(--vd-d); ${DERIVA}">
              <div class="kbv-progress"><span class="fill" style="width:62%"></span></div>
            </div>
            <div class="kbv-meta">El relleno es el color en crudo. Contra su pista mide <b>1.91</b> con el verde vivo.</div>
          </div>
          <div class="vd-caso">
            <h5>Con la receta de tinta</h5>
            <div class="kb-app vd-app vd-fija" style="--kb-primary: var(--vd-d); ${DERIVA}">
              <div class="kbv-progress"><span class="fill" style="width:62%"></span></div>
            </div>
            <div class="kbv-meta">El relleno lee la receta que el sistema ya publica. Mide <b>5.59</b> en claro y <b>12.97</b> en oscuro.</div>
          </div>
        </div>
      </div>

      <div class="vd-sec">
        <h2 class="kbv-h3">Qu&eacute; se toca para cambiarlo</h2>
        <div class="kbv-body vd-lead">Hoy la marca vive en <b>cuatro</b> valores escritos a mano &mdash; el color, su tono de apoyo, su lavado y su tinta &mdash;, as&iacute; que cambiar el verde son cuatro decisiones y tres oportunidades de que queden desalineadas. Las tres derivadas se calculan del color base con las recetas que el sistema ya usa para todo lo dem&aacute;s, y reproducen el teal de hoy dentro de un pelo. Hecho eso, <b>el verde de Kibo es un solo valor</b>: cambiarlo vuelve a ser una l&iacute;nea, en claro y en oscuro a la vez.</div>
        <div class="kbv-def">
          <div class="kbv-body"><code class="kbv-code">--kb-primary</code> es el &uacute;nico valor de marca. La tinta sale al 54 % contra el vac&iacute;o, el lavado al 12 % contra el lienzo, y el tono de apoyo al 82 % contra el vac&iacute;o. El tema oscuro ya derivaba as&iacute; sus cuatro; el claro era el que los ten&iacute;a escritos a mano.</div>
        </div>
      </div>

    </div>
  </div>
</div>
</x-dc>
</body>
</html>`;

const html = cabeza + tokens + cuerpo;
fs.writeFileSync('Verdes.dc.html', html);
console.log('escrito Verdes.dc.html (' + (html.length / 1024).toFixed(0) + 'KB)');
