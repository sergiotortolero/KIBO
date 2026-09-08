// Mide cuanta marca puede mostrar la cara del boton primario sin perder AA.
// Hoy la cara es una mezcla al 54 % contra el vacio: la marca nunca se ve a
// plena fuerza, y por eso la interfaz lee opaca.
import fs from 'fs';

const CANTIDADES = [100, 92, 84, 76, 68, 60, 54];

const est = [...fs.readFileSync('Shell.dc.html', 'utf8')
  .matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');

const caso = (amt, tema) => `
<div class="kb-app">
  <div class="pr-caja${tema === 'oscuro' ? ' theme-dark' : ''}" data-amt="${amt}" data-tema="${tema}"
       style="--face: color-mix(in oklab, var(--kb-primary) ${amt}%, var(--kb-void-2));">
    <span class="pr-cara" data-s="cara">
      <span data-s="blanco" style="color: var(--kb-text-inverse)">Completar</span>
      <span data-s="vacio"  style="color: var(--kb-void-2)">Completar</span>
    </span>
  </div>
</div>`;

const bloques = CANTIDADES.flatMap(a => [caso(a, 'claro'), caso(a, 'oscuro')]).join('\n');

fs.mkdirSync('_medir', { recursive: true });
fs.writeFileSync('_medir/boton.html', `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;padding:0;background:#888}
${est}
.kb-app{width:280px;display:inline-block;vertical-align:top;margin:4px}
.pr-caja{padding:10px;background:var(--kb-canvas)}
.pr-cara{display:flex;gap:10px;align-items:center;justify-content:center;height:46px;
         border-radius:14px;background:var(--face);font-family:var(--kb-f-display);
         font-weight:700;font-size:15px}
</style></head><body>
${bloques}
<script>
const px = (s) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const x = cv.getContext('2d', { willReadFrequently: true });
  x.fillStyle = '#FFFFFF'; x.fillRect(0,0,1,1); x.fillStyle = s; x.fillRect(0,0,1,1);
  const d = x.getImageData(0,0,1,1).data; return [d[0],d[1],d[2]]; };
const lum = (r) => { const f = r.map(v => { const s=v/255;
  return s<=0.03928?s/12.92:Math.pow((s+0.055)/1.055,2.4); });
  return 0.2126*f[0]+0.7152*f[1]+0.0722*f[2]; };
const ratio = (a,b) => { const l1=lum(px(a)), l2=lum(px(b));
  return Math.round(((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05))*100)/100; };
window.medir = () => [...document.querySelectorAll('[data-amt]')].map(c => {
  const cara = c.querySelector('[data-s="cara"]');
  const bg = getComputedStyle(cara).backgroundColor;
  return { amt: +c.dataset.amt, tema: c.dataset.tema,
    blanco: ratio(getComputedStyle(c.querySelector('[data-s="blanco"]')).color, bg),
    vacio:  ratio(getComputedStyle(c.querySelector('[data-s="vacio"]')).color, bg),
    caraSobreLienzo: ratio(bg, getComputedStyle(c).backgroundColor) };
});
<\/script></body></html>`);
console.log('escrito _medir/boton.html con ' + CANTIDADES.length + ' cantidades x 2 temas');
