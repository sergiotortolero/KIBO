// Detecta inglés en la PROSA de los documentos entregables, por FRASES de alta señal
// (las palabras función producen ruido: «transforma» contiene «or», «Android» contiene «and»).
// Exentos: bloques de código y lo escrito entre `comillas invertidas` (identificador técnico).
// Uso: node docs/_interno/verificar-idioma.mjs
import fs from 'fs';

const DOCS = ['0-resumen-ejecutivo','1-analisis-funcional','2-documentacion-tecnica','3-modelado-de-datos','4-manual-de-usuario'];

const FRASES = [
  'source of truth','first-class','never projected','body below','one root','date partition',
  'hubs receive','bff pattern','disposable-client','local state','online-only','offline-first',
  'anything involving','credential boundary','become record notes','intent outbox','global prefix',
  'uri versioning','cors allowlist','body limit','sharing react dom',
  'never writes','never emit','without ceiling','user can edit','untouched on sync','by role',
  'column-level','feed cursado','types generadas','client de','server-render','state machine',
  'data binding','authoring role','staffed','no parse','no compute','dumb pipe','continuous route',
  'desktop-only','keep mood','keeping','purchasable','earned-only','buys cosmetic','never advantage',
  'screen parity','feature parity','end-to-end','third parties','raw sensor','daily aggregates',
];
const PICT = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{FE0F}\u{2713}\u{2717}]/gu;

let total = 0, pict = 0;
for (const d of DOCS) {
  const lines = fs.readFileSync(`docs/${d}.md`, 'utf8').split(/\r?\n/);
  let fence = false;
  const hits = [];
  lines.forEach((l, i) => {
    if (/^\s*```/.test(l)) { fence = !fence; return; }
    if (fence) return;
    const prose = l.replace(/`[^`]*`/g, '').toLowerCase();
    const found = FRASES.filter(f => prose.includes(f));
    if (found.length) hits.push({ n: i + 1, f: found, t: l.trim() });
    const pm = l.match(PICT);
    if (pm) pict += pm.length;
  });
  total += hits.length;
  console.log(`\n=== ${d} — ${hits.length} ===`);
  hits.forEach(h => console.log(`L${h.n} «${h.f.join('», «')}»\n    ${h.t.slice(0, 150)}`));
}
console.log(`\n──────────\nlíneas con frases en inglés: ${total}\npictogramas: ${pict}`);
process.exit(total === 0 && pict === 0 ? 0 : 1);
