// Aplica la decision de marca sobre el armazon y todos los artboards.
// Cada artboard lleva su propia copia del bloque de tokens y de componentes,
// asi que el cambio es un reemplazo exacto repetido, con asercion por archivo.
import fs from 'fs';

const CAMBIOS = [
  // 1 · Las tres derivadas dejan de ser hex escritos a mano: la marca queda
  //     en UN solo valor y el tema oscuro ya derivaba asi sus cuatro.
  {
    de: '  --kb-primary-hover: #178F8B;\n  --kb-primary-soft:  #E4F4F3;\n  --kb-primary-ink:   #0F6E6B;',
    a: '  --kb-primary-hover: color-mix(in oklab, var(--kb-primary) 82%, var(--kb-void-2));\n'
     + '  --kb-primary-soft:  color-mix(in oklab, var(--kb-primary) 12%, var(--kb-canvas));\n'
     + '  --kb-primary-ink:   color-mix(in oklab, var(--kb-primary) 54%, var(--kb-void-2));',
  },
  // 2 · La cara del boton primario deja de ser una mezcla oscurecida y pasa a
  //     ser la marca a plena fuerza. El rotulo va en tinta: blanco sobre el
  //     teal pleno mide 3.06 y la tinta 6.18 en claro, 9.38 en oscuro.
  //     El peligro no es superficie de marca y conserva cara oscurecida y
  //     rotulo blanco, que mide 6.24.
  {
    de: '    .kbv-btn-primary, .kbv-btn-danger {\n'
      + '      --face: color-mix(in oklab, var(--c) 54%, var(--kb-void-2));\n'
      + '      --lip:  color-mix(in oklab, var(--c) 30%, var(--kb-void-2));\n'
      + '      background: var(--face); color: var(--kb-text-inverse);\n'
      + '      box-shadow: var(--kb-elev-hard) var(--lip), var(--kb-sh-1);\n'
      + '    }\n'
      + '    .kbv-btn-primary { --c: var(--kb-primary); }\n'
      + '    .kbv-btn-danger  { --c: var(--kb-hp); }\n'
      + '    .kbv-btn-primary:hover, .kbv-btn-danger:hover { background: color-mix(in oklab, var(--face) 78%, var(--c)); }',
    a: '    /* La cara lleva el color a plena fuerza y el rotulo lo decide el color,\n'
      + '       no el boton: sobre la marca plena el blanco mide 3.06 y la tinta 6.18. */\n'
      + '    .kbv-btn-primary, .kbv-btn-danger {\n'
      + '      --lip: color-mix(in oklab, var(--c) 54%, var(--kb-void-2));\n'
      + '      background: var(--face); color: var(--on-face);\n'
      + '      box-shadow: var(--kb-elev-hard) var(--lip), var(--kb-sh-1);\n'
      + '    }\n'
      + '    .kbv-btn-primary { --c: var(--kb-primary); --face: var(--c); --on-face: var(--kb-void-2); }\n'
      + '    /* El peligro no es superficie de marca: su trabajo es la urgencia. */\n'
      + '    .kbv-btn-danger  { --c: var(--kb-hp); --on-face: var(--kb-text-inverse);\n'
      + '                       --face: color-mix(in oklab, var(--c) 74%, var(--kb-void-2)); }\n'
      + '    .kbv-btn-primary:hover, .kbv-btn-danger:hover { background: color-mix(in oklab, var(--face) 88%, var(--kb-void-2)); }',
  },
  // 3 · La casilla marcada es de la misma familia que el boton: misma cara,
  //     misma tinta.
  {
    de: '    .kbv-check.on { background: var(--kb-primary-fill); border-color: var(--kb-primary-fill); color: var(--kb-text-inverse); }',
    a: '    .kbv-check.on { background: var(--kb-primary); border-color: var(--kb-primary); color: var(--kb-void-2); }',
  },
  // 4 · El relleno de la barra se queda a plena marca. Lo que cambia es el aro
  //     de la pista, que al 24 % media 1.27 contra la tarjeta y era invisible:
  //     con la receta de tinta mide 7.7 y la parte vacia se lee como vacia.
  {
    de: '      box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--c, var(--kb-primary)) 24%, var(--kb-canvas));',
    a: '      box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--c, var(--kb-primary)) var(--kb-ink-amt), var(--kb-ink-anchor));',
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
    if (t.includes(c.a)) continue;            // ya aplicado
    if (!t.includes(c.de)) { faltan.push(CAMBIOS.indexOf(c) + 1); continue; }
    t = t.split(c.de).join(c.a);
  }
  if (faltan.length) fallas.push(`${f}: no encontre el cambio ${faltan.join(', ')}`);
  if (t !== antes) { fs.writeFileSync(f, t); tocados++; }
}

console.log(`aplicado en ${tocados}/${files.length} artboards`);
if (fallas.length) { fallas.forEach(x => console.log('  ' + x)); process.exit(1); }
