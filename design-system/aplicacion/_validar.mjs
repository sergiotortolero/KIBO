// Valida los artboards .dc.html: formato, sistema de diseno y, si es funcional,
// la clase de logica y la forma de los huecos.
// Uso: node design-system/aplicacion/_validar.mjs [archivo ...]
import fs from 'fs';
const DIR = 'design-system/aplicacion';
const args = process.argv.slice(2);
const files = args.length ? args : fs.readdirSync(DIR).filter(f => f.endsWith('.dc.html')).map(f => `${DIR}/${f}`);
const PICT = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{FE0F}\u{2713}\u{2717}]/gu;

let malos = 0;
for (const p of files) {
  const t = fs.readFileSync(p, 'utf8');
  const f = [];
  const inter = t.includes('data-dc-script');

  if (!t.includes('<script src="./support.js"></script>')) f.push('falta la linea exacta de support.js');
  if (/@import/.test(t)) f.push('usa @import');
  const ext = [...new Set((t.match(/(?:src|href)="(https?:[^"]+)"/g) || []))].filter(x => !x.includes('fonts.googleapis.com'));
  if (ext.length) f.push('red externa no permitida: ' + ext.slice(0, 3).join(' '));
  if (!/<x-dc>/.test(t) || !/<\/x-dc>/.test(t)) f.push('falta el envoltorio x-dc');
  if (!/<helmet>/.test(t)) f.push('falta el helmet');

  // interactividad
  if (inter) {
    if (!/class Component extends DCLogic/.test(t)) f.push('data-dc-script sin class Component extends DCLogic');
    if (/<script data-dc-script[^>]*>\s*<\/script>/.test(t)) f.push('data-dc-script vacio (da error)');
  }
  // los huecos solo admiten ruta con puntos, nunca expresiones
  const holes = [...new Set((t.match(/\{\{([^}]*)\}\}/g) || []))];
  if (holes.length && !inter) f.push('lleva huecos pero no hay clase de logica');
  const malosH = holes.filter(h => /[+*/!?()]|&&|\|\||\s-\s/.test(h.replace(/[{}]/g, '')));
  if (malosH.length) f.push('huecos con expresion (solo ruta con puntos): ' + malosH.slice(0, 3).join(' '));

  const pic = t.match(PICT) || [];
  if (pic.length) f.push(`${pic.length} pictograma(s): ${[...new Set(pic)].join('')}`);

  let sin = t;
  (t.match(/(:root|\.theme-[a-z]+)\s*\{[\s\S]*?\n\s*\}/g) || []).forEach(b => { sin = sin.replace(b, ''); });
  const hex = [...new Set((sin.match(/#[0-9a-fA-F]{3,8}\b/g) || []))];
  if (hex.length > 2) f.push(`${hex.length} colores crudos fuera de los tokens: ${hex.slice(0, 6).join(' ')}`);

  const ab = (t.match(/<div\b/g) || []).length, ce = (t.match(/<\/div>/g) || []).length;
  if (ab !== ce) f.push(`divs desbalanceados: ${ab} abren, ${ce} cierran`);
  const si = (t.match(/<sc-if\b/g) || []).length, sic = (t.match(/<\/sc-if>/g) || []).length;
  if (si !== sic) f.push(`sc-if desbalanceados: ${si} abren, ${sic} cierran`);

  const kb = (t.length / 1024).toFixed(0);
  const tipo = inter ? 'funcional' : 'estatico';
  if (f.length) { malos++; console.log(`FALLA  ${p.split(/[\/]/).pop().padEnd(28)} ${kb}KB ${tipo}`); f.forEach(x => console.log('        - ' + x)); }
  else console.log(`ok     ${p.split(/[\/]/).pop().padEnd(28)} ${kb}KB ${tipo}`);
}
console.log(`\n${files.length - malos}/${files.length} validos`);
process.exit(malos ? 1 : 0);
