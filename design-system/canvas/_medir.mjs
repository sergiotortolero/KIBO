// Convierte cada artboard en HTML plano (helmet -> <style>, x-dc -> body) para
// poder MEDIR su alto real en un navegador, en vez de adivinarlo.
import fs from 'fs';
const OUT = '_medir';
fs.mkdirSync(OUT, { recursive: true });
const files = fs.readdirSync('.').filter(f => f.endsWith('.dc.html'));
const nombres = [];
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  const est = [...t.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
  const i0 = t.indexOf('</helmet>');
  const i1 = t.lastIndexOf('</x-dc>');
  if (i0 < 0 || i1 < 0) { console.log('  omito ' + f); continue; }
  const cuerpo = t.slice(i0 + 9, i1);
  const n = f.replace('.dc.html', '');
  fs.writeFileSync(`${OUT}/${n}.html`,
    `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0}
${est}</style></head><body>${cuerpo}</body></html>`);
  nombres.push(n);
}
const filas = nombres.map(n =>
  `<div class="row"><span>${n}</span><iframe data-n="${n}" src="${n}.html" width="1440" height="300"></iframe></div>`).join('\n');
fs.writeFileSync(`${OUT}/index.html`,
  `<!doctype html><html><head><meta charset="utf-8"><style>body{font:12px monospace;background:#111;color:#eee}
.row{margin:4px 0}iframe{border:0;display:block;width:1440px;height:300px}</style></head><body>
<div id="out">midiendo…</div>${filas}
<script>
window.medir = () => [...document.querySelectorAll('iframe')].map(f => {
  let h = 0;
  try { const d = f.contentDocument; h = Math.max(d.body.scrollHeight, d.documentElement.scrollHeight); } catch (e) { h = -1; }
  return { n: f.dataset.n, h };
});
<\/script></body></html>`);
console.log(`convertidos ${nombres.length} artboards a HTML plano en ${OUT}/`);
