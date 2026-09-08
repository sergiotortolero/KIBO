// Aplica las tres decisiones. Una receta a la vez, y SOLO sobre matices:
// los neutros (texto, vacio, superficie, borde) nunca entran en una receta de
// color, y confundirlos fue lo que rompio la pasada anterior.
//
//  1 · Cara  · luminosidad 0.66 y croma 0.15 fijos, rotulo en tinta oscura.
//             Medido: 5.66 (HP) a 6.79 (marca). El blanco no llega a ese
//             brillo en ningun matiz: el mejor es 4.57.
//  2 · Lavado · construido en oklch a 0.90 / 0.07 en vez de mezclado contra el
//             lienzo, que arrastra el croma al blanco y lo vuelve grisaceo.
//             La tinta que va encima baja a 0.38 / 0.13. Medido: 6.73.
//  3 · Armazon · menu y cabecera con un tinte de marca muy leve.
import fs from 'fs';

const paso = Number(process.argv[2] || 0);

const PASO1 = [
  ['--kb-face-l: 0.50;', '--kb-face-l: 0.66;'],
  ['--kb-face-c: 1.5;', '--kb-face-c: 0.15;'],
  ['calc(c * var(--kb-face-c))', 'var(--kb-face-c)'],
  // El rotulo de toda cara pasa a tinta oscura.
  ['.kbv-btn-primary { --c: var(--kb-primary); --face: var(--c); --on-face: var(--kb-text-inverse); }',
   '.kbv-btn-primary { --c: var(--kb-primary); --face: var(--c); --on-face: var(--kb-void-2); }'],
  ['.kbv-btn-danger  { --c: var(--kb-hp); --face: var(--c); --on-face: var(--kb-text-inverse); }',
   '.kbv-btn-danger  { --c: var(--kb-hp); --face: var(--c); --on-face: var(--kb-void-2); }'],
  ['.kbv-check.on { background: oklch(from var(--kb-primary) var(--kb-face-l) var(--kb-face-c) h); border-color: oklch(from var(--kb-primary) var(--kb-face-l) var(--kb-face-c) h); color: var(--kb-text-inverse); }',
   '.kbv-check.on { background: oklch(from var(--kb-primary) var(--kb-face-l) var(--kb-face-c) h); border-color: oklch(from var(--kb-primary) var(--kb-face-l) var(--kb-face-c) h); color: var(--kb-void-2); }'],
  ['background: oklch(from var(--c, var(--kb-hp)) var(--kb-face-l) var(--kb-face-c) h); color: var(--kb-text-inverse);',
   'background: oklch(from var(--c, var(--kb-hp)) var(--kb-face-l) var(--kb-face-c) h); color: var(--kb-void-2);'],
  ['.kbv-side-link.active { background: oklch(from var(--kb-primary) var(--kb-face-l) var(--kb-face-c) h); color: var(--kb-text-inverse); font-weight: 700; }',
   '.kbv-side-link.active { background: oklch(from var(--kb-primary) var(--kb-face-l) var(--kb-face-c) h); color: var(--kb-void-2); font-weight: 700; }'],
];

// El lavado y la tinta, SOLO por su patron de cantidad y ancla. Ese patron no
// aparece en ningun neutro.
const PASO2_TOKENS = [
  ['--kb-wash-amt: 12%;   --kb-wash-anchor: var(--kb-canvas);',
   '--kb-wash-l: 0.90;  --kb-wash-c: 0.07;\n      --kb-ink-l:  0.38;  --kb-ink-c:  0.13;\n      --kb-wash-amt: 12%;   --kb-wash-anchor: var(--kb-canvas);'],
  ['--kb-wash-amt: 22%;   --kb-wash-anchor: var(--kb-void-1);',
   '--kb-wash-l: 0.26;  --kb-wash-c: 0.08;\n      --kb-ink-l:  0.82;  --kb-ink-c:  0.13;\n      --kb-wash-amt: 22%;   --kb-wash-anchor: var(--kb-void-1);'],
];
const PASO2_RE = [
  [/color-mix\(in oklab, (var\([^()]*(?:\([^()]*\))?[^()]*\)) var\(--kb-wash-amt\), var\(--kb-wash-anchor\)\)/g,
   'oklch(from $1 var(--kb-wash-l) var(--kb-wash-c) h)'],
  [/color-mix\(in oklab, (var\([^()]*(?:\([^()]*\))?[^()]*\)) var\(--kb-ink-amt\), var\(--kb-ink-anchor\)\)/g,
   'oklch(from $1 var(--kb-ink-l) var(--kb-ink-c) h)'],
];

const PASO3 = [
  ['.kbv-sidebar {', '.kbv-sidebar { background: oklch(from var(--kb-primary) 0.96 0.03 h);'],
  ['.kbv-header {',  '.kbv-header { background: oklch(from var(--kb-primary) 0.97 0.02 h);'],
];

const objetivos = [];
for (const dir of ['canvas', 'aplicacion']) {
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.dc.html'))) objetivos.push(dir + '/' + f);
}
objetivos.push('colors_and_type.css', 'kbv-components.css');

const aplica = (t, pares) => { for (const [de, a] of pares) if (!t.includes(a) && t.includes(de)) t = t.split(de).join(a); return t; };

let n = 0;
for (const p of objetivos) {
  let t = fs.readFileSync(p, 'utf8'); const antes = t;
  if (paso === 1) t = aplica(t, PASO1);
  if (paso === 2) { t = aplica(t, PASO2_TOKENS); for (const [re, a] of PASO2_RE) t = t.replace(re, a); }
  if (paso === 3) t = aplica(t, PASO3);
  if (t !== antes) { fs.writeFileSync(p, t); n++; }
}
console.log(`paso ${paso}: ${n}/${objetivos.length} archivos`);
