// Segunda pasada de la regla de marca: las pastillas rellenas y el item activo
// del menu dejan de pintarse con la tinta oscurecida y llevan el color.
import fs from 'fs';

const CAMBIOS = [
  // La pastilla contadora llevaba el tono al 54 % contra el negro con rotulo
  // blanco: eso es lo que volvia vino al rojo. Ahora lleva el tono y el rotulo
  // se adapta. Medido sobre el tono pleno: blanco 1.80-3.96 segun el tono,
  // el vacio 4.77-10.52. El vacio es el unico que pasa en toda la paleta.
  {
    de: '      background: color-mix(in oklab, var(--c, var(--kb-hp)) 54%, var(--kb-void-2)); color: var(--kb-text-inverse);',
    a:  '      background: var(--c, var(--kb-hp)); color: var(--kb-void-2);',
  },
  // El destino activo del menu era tinta oscura sobre lavado palido. Pasa a
  // ser el color: 6.18 en claro, 9.38 en oscuro.
  {
    de: '    .kbv-side-link.active { background: var(--kb-primary-soft); color: var(--kb-primary-ink); font-weight: 700; }',
    a:  '    .kbv-side-link.active { background: var(--kb-primary); color: var(--kb-void-2); font-weight: 700; }',
  },
  // Sobre la pastilla de marca el contador se invierte: lienzo con tinta.
  {
    de: '    .kbv-side-link.active .kbv-badge.quiet { background: var(--kb-primary-fill); color: var(--kb-text-inverse); }',
    a:  '    .kbv-side-link.active .kbv-badge.quiet { background: var(--kb-canvas); color: var(--kb-primary-ink); }',
  },
];

const files = fs.readdirSync('.').filter(f => f.endsWith('.dc.html'));
let tocados = 0;
const fallas = [];
for (const f of files) {
  let t = fs.readFileSync(f, 'utf8');
  const antes = t;
  const faltan = [];
  for (const c of CAMBIOS) {
    if (t.includes(c.a)) continue;
    if (!t.includes(c.de)) { faltan.push(CAMBIOS.indexOf(c) + 1); continue; }
    t = t.split(c.de).join(c.a);
  }
  if (faltan.length) fallas.push(`${f}: falta el cambio ${faltan.join(', ')}`);
  if (t !== antes) { fs.writeFileSync(f, t); tocados++; }
}
console.log(`aplicado en ${tocados}/${files.length} artboards`);
fallas.forEach(x => console.log('  ' + x));
