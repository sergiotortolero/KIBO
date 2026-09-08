// Arnes de medicion para la decision de marca: pinta el armazon en N verdes
// candidatos, en claro y en oscuro, y mide el contraste real de cada par.
import fs from 'fs';

export const CANDIDATOS = [
  { id: 'A', hex: '#1CA4A0', nombre: 'Teal actual',      nota: 'la referencia: lo que hay hoy' },
  { id: 'B', hex: '#00B894', nombre: 'Verde jade',       nota: 'misma familia, mas verde y mas vivo' },
  { id: 'C', hex: '#00C271', nombre: 'Verde esmeralda',  nota: 'ya se lee verde, no azulado' },
  { id: 'D', hex: '#14CF6E', nombre: 'Verde vivo',       nota: 'salto claro de vibracion' },
  { id: 'E', hex: '#2BE07E', nombre: 'Verde brillante',  nota: 'el mas vibrante del abanico' },
];

// Las tres derivaciones que hoy son hex literales. Reproducen el teal actual
// dentro de un pelo, asi que valen como estandarizacion y no como cambio.
export const DERIVA = [
  '--kb-primary-ink: color-mix(in oklab, var(--kb-primary) 54%, var(--kb-void-2));',
  '--kb-primary-soft: color-mix(in oklab, var(--kb-primary) 12%, var(--kb-canvas));',
  '--kb-primary-hover: color-mix(in oklab, var(--kb-primary) 82%, var(--kb-void-2));',
].join(' ');

export const SONDA = `
<div class="kbv-card vp-probe">
  <div class="kbv-card-title" data-sonda="titulo">Rutina de la manana</div>
  <div class="kbv-progress" data-sonda="pista"><span class="fill" data-sonda="relleno" style="width:62%"></span></div>
  <div class="vp-fila">
    <button class="kbv-btn sm kbv-btn-primary" data-sonda="boton">Completar</button>
    <button class="kbv-btn sm kbv-btn-ghost" data-sonda="fantasma">Mas tarde</button>
    <span class="kbv-chip active" data-sonda="chip">Vigor</span>
  </div>
  <div class="kbv-meta">Racha de 12 dias · <a href="#" data-sonda="enlace">ver detalle</a></div>
</div>`;

export const CSS_SONDA = `
.vp-probe { padding: 14px; display: grid; gap: 10px; }
.vp-fila { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.vp-caja { padding: 16px; border-radius: 16px; }
`;

function estilosDe(archivo) {
  const t = fs.readFileSync(archivo, 'utf8');
  return [...t.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
}

if (process.argv[1] && process.argv[1].endsWith('_verde.mjs')) {
  const est = estilosDe('Shell.dc.html');
  const bloques = [];
  for (const c of CANDIDATOS) {
    for (const tema of ['claro', 'oscuro']) {
      const clase = tema === 'oscuro' ? 'kbv-shell theme-dark' : 'kbv-shell';
      bloques.push(`<div class="kb-app" style="--kb-primary:${c.hex}; ${DERIVA}">
  <div class="${clase} vp-caja" data-cand="${c.id}" data-tema="${tema}"
       style="background: var(--kb-surface);">${SONDA}</div>
</div>`);
    }
  }
  const pagina = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;padding:0;background:#777}
${est}
${CSS_SONDA}
.kb-app{width:420px;display:inline-block;vertical-align:top;margin:6px}
</style></head><body>
${bloques.join('\n')}
<script>
const px = (s) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const x = cv.getContext('2d', { willReadFrequently: true });
  x.clearRect(0,0,1,1); x.fillStyle = '#FFFFFF'; x.fillRect(0,0,1,1);
  x.fillStyle = s; x.fillRect(0,0,1,1);
  const d = x.getImageData(0,0,1,1).data; return [d[0], d[1], d[2]]; };
const lum = (rgb) => { const f = rgb.map(v => { const s = v/255;
  return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4); });
  return 0.2126*f[0] + 0.7152*f[1] + 0.0722*f[2]; };
const ratio = (a,b) => { const l1 = lum(px(a)), l2 = lum(px(b));
  return Math.round(((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05))*100)/100; };
const fondoDe = (el) => { let n = el;
  while (n && n !== document.documentElement) {
    const bg = getComputedStyle(n).backgroundColor;
    const p = px(bg);
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
    n = n.parentElement; }
  return '#FFFFFF'; };
window.medir = () => [...document.querySelectorAll('[data-cand]')].map(caja => {
  const g = (s) => caja.querySelector('[data-sonda="'+s+'"]');
  const cs = (el, p) => getComputedStyle(el)[p];
  const boton = g('boton'), fantasma = g('fantasma'), chip = g('chip'),
        pista = g('pista'), relleno = g('relleno'), enlace = g('enlace'), titulo = g('titulo');
  return {
    cand: caja.dataset.cand, tema: caja.dataset.tema,
    boton:    ratio(cs(boton,'color'), cs(boton,'backgroundColor')),
    fantasma: ratio(cs(fantasma,'color'), fondoDe(fantasma)),
    chip:     ratio(cs(chip,'color'), cs(chip,'backgroundColor')),
    barra:    ratio(cs(relleno,'backgroundColor'), cs(pista,'backgroundColor')),
    enlace:   ratio(cs(enlace,'color'), fondoDe(enlace)),
    titulo:   ratio(cs(titulo,'color'), fondoDe(titulo)),
    primario: getComputedStyle(caja).getPropertyValue('--kb-primary').trim(),
  };
});
<\/script></body></html>`;
  fs.mkdirSync('_medir', { recursive: true });
  fs.writeFileSync('_medir/verde.html', pagina);
  console.log('escrito _medir/verde.html con ' + CANDIDATOS.length + ' candidatos x 2 temas');
}
