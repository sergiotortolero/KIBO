// Valida los artboards .dc.html contra las reglas del formato y del sistema de diseño.
// Uso: node design-system/aplicacion/_validar.mjs [archivo.dc.html ...]
import fs from 'fs';
const DIR = 'design-system/aplicacion';
const args = process.argv.slice(2);
const files = args.length ? args : fs.readdirSync(DIR).filter(f => f.endsWith('.dc.html')).map(f => `${DIR}/${f}`);
const PICT = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{FE0F}\u{2713}\u{2717}]/gu;

let malos = 0;
for (const p of files) {
  const t = fs.readFileSync(p, 'utf8');
  const f = [];
  if (!t.includes('<script src="./support.js"></script>')) f.push('falta la linea exacta de support.js');
  if (t.includes('data-dc-script')) f.push('lleva data-dc-script (debe ser estatico)');
  if (/@import/.test(t)) f.push('usa @import');
  const ext = [...new Set((t.match(/(?:src|href)="(https?:[^"]+)"/g) || []))].filter(x => !x.includes('fonts.googleapis.com'));
  if (ext.length) f.push('red externa no permitida: ' + ext.slice(0, 3).join(' '));
  if (/\{\{[^}]*\}\}/.test(t)) f.push('lleva handlebars');
  if (!/<x-dc>/.test(t) || !/<\/x-dc>/.test(t)) f.push('falta el envoltorio x-dc');
  if (!/<helmet>/.test(t)) f.push('falta el helmet');
  const pic = t.match(PICT) || [];
  if (pic.length) f.push(`${pic.length} pictograma(s): ${[...new Set(pic)].join('')}`);
  // hex crudo fuera de los bloques :root / .theme-*
  let sin = t;
  (t.match(/(:root|\.theme-[a-z]+)\s*\{[\s\S]*?\n\s*\}/g) || []).forEach(b => { sin = sin.replace(b, ''); });
  const hex = [...new Set((sin.match(/#[0-9a-fA-F]{3,8}\b/g) || []))];
  if (hex.length > 2) f.push(`${hex.length} colores crudos fuera de los tokens: ${hex.slice(0, 6).join(' ')}`);
  // etiquetas balanceadas (aproximacion util: div)
  const ab = (t.match(/<div\b/g) || []).length, ce = (t.match(/<\/div>/g) || []).length;
  if (ab !== ce) f.push(`divs desbalanceados: ${ab} abren, ${ce} cierran`);
  const kb = (t.match(/class="kbv-page"/g) || []).length;
  if (kb !== 1) f.push(`kbv-page aparece ${kb} veces (debe ser 1)`);

  const kbytes = (t.length / 1024).toFixed(0);
  if (f.length) { malos++; console.log(`FALLA  ${p.split('/').pop().padEnd(30)} ${kbytes}KB`); f.forEach(x => console.log('        - ' + x)); }
  else console.log(`ok     ${p.split('/').pop().padEnd(30)} ${kbytes}KB`);
}
console.log(`\n${files.length - malos}/${files.length} validos`);
process.exit(malos ? 1 : 0);
