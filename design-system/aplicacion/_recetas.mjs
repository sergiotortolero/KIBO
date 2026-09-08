// Barre las dos recetas que oscurecen el sistema y busca el punto mas vivido
// que conserva el piso de contraste, por tema y con el ancla de cada tema.
import fs from 'fs';

const AMT = [54, 62, 70, 78, 86, 94, 100];
const TONOS = ['--kb-primary', '--kb-hp', '--kb-coin', '--kb-streak', '--area-wealth'];

const est = [...fs.readFileSync('Shell.dc.html', 'utf8')
  .matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');

const bloques = ['claro', 'oscuro'].map(tema => `
<div class="kb-app"><div class="${tema === 'oscuro' ? 'theme-dark' : ''}" data-tema="${tema}"></div></div>`).join('');

fs.mkdirSync('_medir', { recursive: true });
fs.writeFileSync('_medir/recetas.html', `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;padding:0}
${est}
</style></head><body>
${bloques}
<script>
const AMT = ${JSON.stringify(AMT)};
const TONOS = ${JSON.stringify(TONOS)};
const px = (s) => { const c = document.createElement('canvas'); c.width = c.height = 1;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.fillStyle = '#FFFFFF'; x.fillRect(0,0,1,1); x.fillStyle = s; x.fillRect(0,0,1,1);
  const d = x.getImageData(0,0,1,1).data; return [d[0],d[1],d[2]]; };
const lum = (r) => { const f = r.map(v => { const s=v/255;
  return s<=0.03928?s/12.92:Math.pow((s+0.055)/1.055,2.4); });
  return 0.2126*f[0]+0.7152*f[1]+0.0722*f[2]; };
const ratio = (a,b) => { const l1=lum(px(a)), l2=lum(px(b));
  return Math.round(((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05))*100)/100; };
window.medir = () => {
  const out = {};
  for (const caja of document.querySelectorAll('[data-tema]')) {
    const tema = caja.dataset.tema;
    const p = document.createElement('div'); caja.appendChild(p);
    const val = (e) => { p.style.background = e; return getComputedStyle(p).backgroundColor; };
    const blanco = val('var(--kb-text-inverse)');
    const anclaTinta = val('var(--kb-ink-anchor)');
    for (const tono of TONOS) {
      const lavado = val('color-mix(in oklab, var(' + tono + ') var(--kb-wash-amt), var(--kb-wash-anchor))');
      for (const a of AMT) {
        const cara = val('color-mix(in oklab, var(' + tono + ') ' + a + '%, var(--kb-ink-anchor))');
        out[tono + '|' + tema + '|' + a] = {
          // rotulo claro sobre la cara (pastilla rellena)
          rotBlanco: ratio(blanco, cara),
          // tinta sobre su propio lavado (texto tintado, item activo del menu)
          tintaSobreLavado: ratio(cara, lavado),
          // tinta sobre el lienzo
          tintaSobreLienzo: ratio(cara, val('var(--kb-canvas)')),
        };
      }
    }
    p.remove();
  }
  return out;
};
<\/script></body></html>`);
console.log('escrito _medir/recetas.html · ' + TONOS.length + ' tonos x ' + AMT.length + ' cantidades x 2 temas');
