// Carta de decision: tres ajustes de color, cada uno con su antes y sus
// alternativas, sobre piezas reales. No cambia nada del sistema: se mira.
import fs from 'fs';

const shell = fs.readFileSync('../aplicacion/Shell.dc.html', 'utf8');
const cabeza = shell.slice(0, shell.indexOf('</helmet>'));

// Las tres variantes del matiz, como pares de luminosidad y croma.
const V = [
  { id: 'b62', nom: 'Brillo medio',  sub: 'luminosidad 0.62', l: '0.62', c: '0.15', tinta: true },
  { id: 'b66', nom: 'Brillo alto',   sub: 'luminosidad 0.66', l: '0.66', c: '0.15', tinta: true },
  { id: 'b70', nom: 'Brillo m&aacute;ximo', sub: 'luminosidad 0.70', l: '0.70', c: '0.15', tinta: true },
];
// Medido en navegador sobre esta misma lamina: rotulo blanco sobre la cara.
const MED = {
  b62: 'r&oacute;tulo oscuro <b>4.79&ndash;6.13</b>',
  b66: 'r&oacute;tulo oscuro <b>5.63&ndash;7.02</b>',
  b70: 'r&oacute;tulo oscuro <b>6.57&ndash;8.08</b>',
};
const cara = (v) => `oklch(from var(--c) ${v.l} ${v.c} h)`;

const piezas = (v) => `
  <div class="aj-piezas" style="--v:${v.id}"${v.tinta ? ' data-tinta' : ''}>
    <div class="aj-bar" style="--c: var(--kb-hp)"><span style="width:82%; background:${cara(v)}"></span></div>
    <div class="aj-row">
      <span class="aj-pill" data-m="rojo" style="--c: var(--kb-hp); background:${cara(v)}">2</span>
      <span class="aj-btn" style="--c: var(--kb-hp); background:${cara(v)}">Eliminar</span>
      <span class="aj-btn" style="--c: var(--kb-primary); background:${cara(v)}">Guardar</span>
      <span class="aj-btn" style="--c: var(--kb-coin); background:${cara(v)}">Divisa</span>
    </div>
    <div class="aj-row">
      <span class="aj-dot" style="--c: var(--area-vigor); background:${cara(v)}"></span>
      <span class="aj-dot" style="--c: var(--area-wisdom); background:${cara(v)}"></span>
      <span class="aj-dot" style="--c: var(--area-wealth); background:${cara(v)}"></span>
      <span class="aj-dot" style="--c: var(--area-community); background:${cara(v)}"></span>
      <span class="aj-dot" style="--c: var(--area-will); background:${cara(v)}"></span>
    </div>
  </div>`;

// Lavados: la mezcla de hoy contra el mismo lavado construido en oklch.
const chips = (modo) => {
  const bg = modo === 'hoy'
    ? 'color-mix(in oklab, var(--c) 12%, var(--kb-canvas))'
    : `oklch(from var(--c) 0.90 ${modo} h)`;
  const tinta = modo === 'hoy'
    ? 'color-mix(in oklab, var(--c) 54%, var(--kb-void-2))'
    : 'oklch(from var(--c) 0.38 0.13 h)';
  const uno = (tok, txt) => `<span class="aj-chip" style="--c: var(${tok}); background:${bg}; color:${tinta}">${txt}</span>`;
  return `<div class="aj-row">
    ${uno('--kb-streak', '23 d&iacute;as')}${uno('--kb-coin', '1 480')}
    ${uno('--area-vigor', 'Vigor')}${uno('--area-wisdom', 'Sabidur&iacute;a')}
    ${uno('--area-wealth', 'Riqueza')}${uno('--area-will', 'Voluntad')}
  </div>`;
};

// Cuanto color lleva el armazon.
const mini = (modo) => {
  const menu = modo === 'neutro' ? 'var(--kb-card)'
    : modo === 'menu' ? 'oklch(from var(--kb-primary) 0.96 0.03 h)'
    : 'oklch(from var(--kb-primary) 0.96 0.03 h)';
  const cab = modo === 'todo' ? 'oklch(from var(--kb-primary) 0.97 0.02 h)' : 'var(--kb-card)';
  return `<div class="aj-mini">
    <div class="aj-mini-cab" style="background:${cab}"><span class="aj-mark"></span><b>Kibo</b><span class="aj-grow"></span><span class="aj-mini-hud"></span></div>
    <div class="aj-mini-cols">
      <div class="aj-mini-side" style="background:${menu}">
        <span class="aj-nav on">Hoy</span><span class="aj-nav"></span><span class="aj-nav"></span><span class="aj-nav"></span>
      </div>
      <div class="aj-mini-body"><div class="aj-card"></div><div class="aj-card"></div></div>
    </div>
  </div>`;
};

const CSS = `
  .aj-wrap { padding: 26px 30px 44px; display: grid; gap: 24px; width: 940px; box-sizing: border-box; }
  .aj-sec { display: grid; gap: 12px; }
  .aj-tres { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .aj-dos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .aj-caso { background: var(--kb-card); border: 1px solid var(--kb-border);
             border-radius: var(--kb-r-md); padding: 12px; display: grid; gap: 10px; }
  .aj-caso h5 { margin: 0; font-family: var(--kb-f-display); font-weight: 700;
                font-size: var(--kb-fs-md); color: var(--kb-text); }
  .aj-caso .sub { font-family: var(--kb-f-body); font-size: var(--kb-fs-xs); color: var(--kb-text-2); }
  .aj-piezas { display: grid; gap: 9px; }
  .aj-row { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
  .aj-bar { height: 8px; border-radius: var(--kb-r-pill); overflow: hidden;
            background: color-mix(in oklab, var(--c) 12%, var(--kb-canvas)); }
  .aj-bar > span { display: block; height: 100%; border-radius: var(--kb-r-pill); }
  .aj-piezas[data-tinta] .aj-pill, .aj-piezas[data-tinta] .aj-btn { color: var(--kb-void-2); }
  .aj-pill { min-width: 20px; height: 20px; border-radius: var(--kb-r-pill); padding: 0 6px;
             display: inline-flex; align-items: center; justify-content: center;
             font-family: var(--kb-f-display); font-weight: 700; font-size: var(--kb-fs-2xs);
             color: var(--kb-text-inverse); }
  .aj-btn { height: 30px; padding: 0 12px; border-radius: var(--kb-r-sm);
            display: inline-flex; align-items: center; font-family: var(--kb-f-display);
            font-weight: 700; font-size: var(--kb-fs-sm); color: var(--kb-text-inverse); }
  .aj-dot { width: 22px; height: 22px; border-radius: 50%; display: inline-block; }
  .aj-chip { height: 26px; padding: 0 10px; border-radius: var(--kb-r-pill);
             display: inline-flex; align-items: center; font-family: var(--kb-f-display);
             font-weight: 700; font-size: var(--kb-fs-xs); }

  .aj-mini { border: 1px solid var(--kb-border); border-radius: var(--kb-r-md); overflow: hidden;
             background: var(--kb-surface); }
  .aj-mini-cab { height: 34px; display: flex; align-items: center; gap: 6px; padding: 0 10px;
                 border-bottom: 1px solid var(--kb-border); font-family: var(--kb-f-display);
                 font-size: var(--kb-fs-sm); color: var(--kb-text); }
  .aj-mark { width: 16px; height: 16px; border-radius: 5px;
             background: oklch(from var(--kb-primary) 0.52 0.13 h); }
  .aj-grow { flex: 1; }
  .aj-mini-hud { width: 54px; height: 12px; border-radius: var(--kb-r-pill);
                 background: oklch(from var(--kb-coin) 0.90 0.09 h); }
  .aj-mini-cols { display: grid; grid-template-columns: 74px 1fr; min-height: 96px; }
  .aj-mini-side { padding: 8px 6px; display: grid; gap: 4px; align-content: start;
                  border-right: 1px solid var(--kb-border); }
  .aj-nav { height: 14px; border-radius: 5px; background: var(--kb-surface-2); }
  .aj-nav.on { background: oklch(from var(--kb-primary) 0.52 0.13 h); }
  .aj-mini-body { padding: 8px; display: grid; gap: 6px; align-content: start; }
  .aj-card { height: 34px; border-radius: var(--kb-r-sm); background: var(--kb-card);
             border: 1px solid var(--kb-border); }
  .aj-med { font-family: var(--kb-f-display); font-weight: 700; font-size: var(--kb-fs-xs);
            color: var(--kb-text-2); font-variant-numeric: tabular-nums; }
`;

const cuerpo = `
<div style="width:940px; background:var(--kb-surface);
            --kb-sp-7:16px; --kb-sp-8:20px; --kb-sp-9:24px;
            --kb-fs-4xl-fluid:30px; --kb-fs-3xl-fluid:24px;
            --kb-fs-2xl-fluid:20px; --kb-fs-xl-fluid:17px;">
  <div class="kb-app">
    <div class="aj-wrap">

      <div class="aj-sec">
        <div class="kbv-eyebrow">Decisi&oacute;n de color</div>
        <h1 class="kbv-h2">Tres ajustes, para elegir mirando</h1>
        <div class="kbv-meta">Nada de esto est&aacute; aplicado todav&iacute;a. Son las mismas piezas pintadas de tres maneras.</div>
      </div>

      <div class="aj-sec">
        <h2 class="kbv-h4">1 &middot; M&aacute;s brillante &mdash; y qu&eacute; cuesta</h2>
        <div class="kbv-meta">El r&oacute;tulo blanco tiene un techo duro: por encima de una luminosidad de <b>0.52</b> deja de pasar el piso de 4.5, y a 0.58 ya mide 3.72. Para subir el brillo, <b>el r&oacute;tulo pasa a tinta oscura</b>. Es lo contrario del intento anterior: aquella tinta oscura iba sobre una cara oscura y se ve&iacute;a lodosa; sobre una cara brillante se lee como marcatextos. El croma sigue igualado en los tres, as&iacute; que el rojo nunca domina.</div>
        <div class="aj-tres">
          ${V.map(v => `<div class="aj-caso">
            <h5>${v.nom}</h5><div class="sub">${v.sub}</div>
            ${piezas(v)}
            <div class="aj-med" data-med="${v.id}">${MED[v.id]}</div>
          </div>`).join('')}
        </div>
      </div>

      <div class="aj-sec">
        <h2 class="kbv-h4">2 &middot; Los lavados grisáceos</h2>
        <div class="kbv-meta">Un lavado se hace mezclando el matiz contra el blanco, y esa mezcla arrastra el croma hacia el blanco: por eso sale gris&aacute;ceo. Con croma propio se ve de color. El cian de Voluntad es el que m&aacute;s fosforece a igual croma &mdash; mira los dos niveles y dime cu&aacute;l.</div>
        <div class="aj-tres">
          <div class="aj-caso"><h5>Hoy</h5><div class="sub">mezcla contra el lienzo</div>${chips('hoy')}
            <div class="aj-med">gris&aacute;ceo &middot; se separa del lienzo 1.07&ndash;1.15</div></div>
          <div class="aj-caso"><h5>Croma 0.09</h5><div class="sub">lo que viste &mdash; Voluntad fosforece</div>${chips('0.09')}
            <div class="aj-med">tinta 6.74 &middot; separaci&oacute;n 1.32&ndash;1.48</div></div>
          <div class="aj-caso"><h5>Croma 0.07</h5><div class="sub">el punto medio</div>${chips('0.07')}
            <div class="aj-med">tinta <b>6.73</b> &middot; separaci&oacute;n 1.32&ndash;1.42</div></div>
        </div>
      </div>

      <div class="aj-sec">
        <h2 class="kbv-h4">3 &middot; Cu&aacute;nto color lleva la interfaz <span style="font-family:var(--kb-f-label);font-size:var(--kb-fs-2xs);letter-spacing:.08em;text-transform:uppercase;color:var(--kb-primary-ink)">&mdash; decidido</span></h2>
        <div class="kbv-meta">Puede que no sea el color de las piezas sino el del fondo: hoy el armaz&oacute;n es blanco y gris, y las piezas de color flotan sobre neutro. Un tinte de marca muy leve cambia la sensaci&oacute;n sin tocar ninguna pieza.</div>
        <div class="aj-tres">
          <div class="aj-caso"><h5>Hoy</h5><div class="sub">armaz&oacute;n neutro</div>${mini('neutro')}</div>
          <div class="aj-caso"><h5>Men&uacute; con tinte</h5><div class="sub">la marca al 3&nbsp;% de croma</div>${mini('menu')}</div>
          <div class="aj-caso" style="border-color: var(--kb-primary); box-shadow: 0 0 0 2px var(--kb-primary-soft)"><h5>Men&uacute; y cabecera</h5><div class="sub">el armaz&oacute;n completo &mdash; elegido</div>${mini('todo')}</div>
        </div>
      </div>

    </div>
  </div>
</div>
</x-dc>
</body>
</html>`;

fs.writeFileSync('Ajuste.dc.html', cabeza + '\n<style>\n' + CSS + '\n</style>\n</helmet>' + cuerpo);
console.log('escrito Ajuste.dc.html');
