// kibo-vitals.jsx — la vida del personaje y las reacciones de KIBO.
// HP es la fuente de verdad del ánimo: KIBO no "siempre sonríe", su cara sale
// de tu salud. Cada acción del sistema pasa por kiboLog() y KIBO reacciona
// (moneda al gastar, flama al cumplir racha, golpe al fallar).

const KB_HP_KEY = 'kibo:hp', KB_HP_MAX = 100;

function getHP() {
  try { const v = parseInt(localStorage.getItem(KB_HP_KEY), 10); if (!isNaN(v)) return Math.max(0, Math.min(KB_HP_MAX, v)); } catch (_) {}
  return 82;
}
function setHP(v) {
  const n = Math.max(0, Math.min(KB_HP_MAX, Math.round(v)));
  try { localStorage.setItem(KB_HP_KEY, String(n)); } catch (_) {}
  try { window.dispatchEvent(new CustomEvent('kibo:hp-change', { detail: { hp: n } })); } catch (_) {}
  return n;
}
function damageHP(n, why) {
  const before = getHP(), after = setHP(before - Math.abs(n));
  kiboLog({ kind: 'fail', amount: Math.abs(n), label: why || 'Fallo registrado', hp: after });
  return after;
}
function healHP(n, why) {
  const before = getHP(), after = setHP(before + Math.abs(n));
  kiboLog({ kind: 'heal', amount: Math.abs(n), label: why || 'Recuperaste vida', hp: after });
  return after;
}

// El ánimo NO se elige: se deriva de la salud. Un tramo por estado.
function moodFromHP(hp) {
  if (hp >= 90) return 'celebra';
  if (hp >= 72) return 'feliz';
  if (hp >= 55) return 'calma';
  if (hp >= 38) return 'enfocado';
  if (hp >= 20) return 'cansado';
  return 'triste';
}
function hpTone(hp) {
  if (hp >= 72) return { label: 'En forma', c: 'var(--kb-good)' };
  if (hp >= 38) return { label: 'Estable', c: 'var(--kb-coin)' };
  if (hp >= 20) return { label: 'Golpeado', c: 'var(--kb-streak)' };
  return { label: 'Crítico', c: 'var(--kb-hp)' };
}

// ── El bus de acciones ───────────────────────────────────────────
// Cualquier módulo llama kiboLog({kind, label, amount}) y KIBO reacciona.
// kind: money-out · money-in · habit · streak · read · study · health ·
//       note · mood · fail · heal · reward · level
const KIBO_REACTIONS = {
  'money-out': { gesture: 'point',  mood: 'enfocado', prop: 'coin',  say: 'Anotado. Cada peso contado.' },
  'money-in':  { gesture: 'five',   mood: 'celebra',  prop: 'coin',  say: '¡Entró dinero! Va a tu cuenta.' },
  habit:       { gesture: 'clap',   mood: 'feliz',    prop: 'spark', say: 'Otro día que cuenta.' },
  streak:      { gesture: 'wave',   mood: 'celebra',  prop: 'flame', say: '¡Racha viva!' },
  read:        { gesture: 'point',  mood: 'enfocado', prop: 'book',  say: 'Sabiduría arriba.' },
  study:       { gesture: 'point',  mood: 'enfocado', prop: 'book',  say: 'A concentrarse.' },
  health:      { gesture: 'five',   mood: 'feliz',    prop: 'heart', say: 'Tu cuerpo te lo agradece.' },
  note:        { gesture: 'point',  mood: 'enfocado', prop: 'spark', say: 'Guardado en tu bóveda.' },
  mood:        { gesture: 'wave',   mood: null,       prop: null,    say: 'Gracias por contarme.' },
  reward:      { gesture: 'clap',   mood: 'celebra',  prop: 'coin',  say: '¡Te lo ganaste!' },
  level:       { gesture: 'five',   mood: 'celebra',  prop: 'spark', say: '¡Subiste de nivel!' },
  heal:        { gesture: 'clap',   mood: 'feliz',    prop: 'heart', say: 'Recuperando vida.' },
  fail:        { gesture: 'squash', mood: 'triste',   prop: 'hit',   say: 'Tranquilo — el fracaso reencauza.' },
};

function kiboLog(evt) {
  const e = evt || {};
  try { window.dispatchEvent(new CustomEvent('kibo:action', { detail: { ...e, at: Date.now() } })); } catch (_) {}
}

// Hook: HP vivo + ánimo derivado. Lo usa el FAB y cualquier HUD.
function useVitals() {
  const [hp, setHpState] = React.useState(getHP);
  React.useEffect(() => {
    const h = (e) => setHpState((e && e.detail && e.detail.hp) != null ? e.detail.hp : getHP());
    window.addEventListener('kibo:hp-change', h);
    window.addEventListener('storage', h);
    return () => { window.removeEventListener('kibo:hp-change', h); window.removeEventListener('storage', h); };
  }, []);
  return { hp, max: KB_HP_MAX, mood: moodFromHP(hp), tone: hpTone(hp) };
}

// Hook: la última reacción (gesto + prop + frase) para que KIBO la actúe.
function useKiboReaction() {
  const [react, setReact] = React.useState(null);
  React.useEffect(() => {
    const h = (e) => {
      const d = (e && e.detail) || {};
      const r = KIBO_REACTIONS[d.kind];
      if (!r) return;
      setReact({ ...r, ...d, id: Math.random().toString(36).slice(2) });
    };
    window.addEventListener('kibo:action', h);
    return () => window.removeEventListener('kibo:action', h);
  }, []);
  return [react, () => setReact(null)];
}

// El objeto que KIBO saca de su cuerpo al reaccionar.
function KiboProp({ kind }) {
  if (!kind) return null;
  const art = {
    coin:  <svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="12" r="10" fill="var(--kb-coin)" stroke="var(--kb-coin-ink)" strokeWidth="1.4" /><path d="M8.8 6.8 V 17.2 M15.4 7.2 L 8.8 12.6 M11.4 10.6 L 15.8 17.2" fill="none" stroke="var(--kb-coin-ink)" strokeWidth="2.8" strokeLinecap="round" /></svg>,
    flame: <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2 C 14 7 19 8.5 19 14 A 7 7 0 0 1 5 14 C 5 9 8 7.5 9.5 4.5 C 10.5 7 12 7 12 2 Z" fill="var(--kb-streak)" /></svg>,
    heart: <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 21 C 5 15 2 11 2 7.6 C 2 4.8 4.2 3 6.6 3 C 8.6 3 10.6 4.2 12 6.2 C 13.4 4.2 15.4 3 17.4 3 C 19.8 3 22 4.8 22 7.6 C 22 11 19 15 12 21 Z" fill="var(--kb-hp)" /></svg>,
    book:  <svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 5 H 10.5 A 1.5 1.5 0 0 1 12 6.5 V 20 H 4.5 A 1.5 1.5 0 0 1 3 18.5 Z" fill="var(--kb-gem)" /><path d="M21 5 H 13.5 A 1.5 1.5 0 0 0 12 6.5 V 20 H 19.5 A 1.5 1.5 0 0 0 21 18.5 Z" fill="color-mix(in oklab, var(--kb-gem) 55%, var(--kb-canvas))" /></svg>,
    spark: <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2 l 2.4 6.4 6.6 1 -4.8 4.6 1.2 6.6 -5.4 -3.2 -5.4 3.2 1.2 -6.6 -4.8 -4.6 6.6 -1 Z" fill="var(--kb-primary)" /></svg>,
    hit:   <svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 2 l 3.2 5.6 6.2 -1.4 -2.6 5.8 4.2 4.6 -6.2 1 -1.4 6.4 -4.6 -4 -5.6 3 1 -6.4 -5.4 -3.4 5.6 -3 -3 -5.8 Z" fill="var(--kb-hp)" opacity="0.9" /></svg>,
  }[kind];
  if (!art) return null;
  return <span className={`kbb-prop ${kind}`} aria-hidden="true">{art}</span>;
}

// Barra de vida reutilizable (HUD, Personaje, chat de KIBO).
function HpBar({ compact = false }) {
  const { hp, max, tone } = useVitals();
  return (
    <span className={`kbv-hpbar ${compact ? 'compact' : ''}`} style={{ '--c': tone.c }} title={`${hp} de ${max} de vida · ${tone.label}`}>
      <span className="hb-track"><span className="hb-fill" style={{ width: `${(hp / max) * 100}%` }} /></span>
      {!compact && <span className="hb-num">{hp}<small>/{max}</small> · {tone.label}</span>}
    </span>
  );
}

Object.assign(window, {
  KB_HP_MAX, getHP, setHP, damageHP, healHP, moodFromHP, hpTone,
  kiboLog, useVitals, useKiboReaction, KiboProp, HpBar, KIBO_REACTIONS,
});
