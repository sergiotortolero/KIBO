// mascot.jsx — Kibo the axolotl (v4)
// Uses real reference artwork as <img> instead of hand-drawn SVG.
// Animations are subtle CSS-only effects on the wrapper.
//
// Props:
//   size      px width (height auto-derived from aspect ratio per pose)
//   mood      'happy' | 'default' | 'wave' | 'celebrating' | 'thinking' | 'worried' | 'alert' | 'sleep'
//             — for now mood only affects the small overlay (Zzz, sparkles, etc.).
//             The base image is selected by `pose`.
//   pose      'head'      → just the head, ideal for inline / small avatars (default)
//             'body'      → full standing body, used in onboarding/coach
//             'side'      → side-profile
//             'celebrate' → full body with floating icons around (use for big wins)
//   animate   true (default) — subtle idle bob
//   style     extra inline style
//
// To "rompe la cuarta pared" use a separate <KibPopup> message component.

const KIBO_ASSETS = {
  head:      'assets/kibo-head-wave.png',       // ratio 215/235 ≈ 0.91
  headCele:  'assets/kibo-head-celebrate.png',  // ratio 260/240 ≈ 1.08
  body:      'assets/kibo-wave.png',            // ratio 220/484 ≈ 0.45
  side:      'assets/kibo-side.png',            // ratio 230/484 ≈ 0.475
  celebrate: 'assets/kibo-celebrate.png',       // ratio 360/484 ≈ 0.744
};
const KIBO_RATIOS = {
  head:      235 / 215,
  headCele:  240 / 260,
  body:      484 / 220,
  side:      484 / 230,
  celebrate: 484 / 360,
};

function KiboMascot({ size = 96, mood = 'happy', pose = 'head', animate = true, style = {} }) {
  // Pick asset
  let key = 'head';
  if (pose === 'body')      key = 'body';
  else if (pose === 'side') key = 'side';
  else if (pose === 'celebrate') key = 'celebrate';
  // Switch head to celebrate-head if mood demands and pose is head
  if (pose === 'head' && mood === 'celebrating') key = 'headCele';

  const src = KIBO_ASSETS[key];
  const ratio = KIBO_RATIOS[key];
  const width = size;
  const height = size * ratio;

  // Mood overlay decoration
  let overlay = null;
  if (mood === 'sleep') {
    overlay = (
      <span className="kib-mood-overlay kib-zzz-overlay" aria-hidden="true">
        <span>z</span><span>z</span><span>Z</span>
      </span>
    );
  } else if (mood === 'alert') {
    overlay = (
      <span className="kib-mood-overlay kib-alert-overlay" aria-hidden="true">!</span>
    );
  } else if (mood === 'thinking') {
    overlay = (
      <span className="kib-mood-overlay kib-thinking-overlay" aria-hidden="true">…</span>
    );
  } else if (mood === 'worried') {
    overlay = (
      <span className="kib-mood-overlay kib-worried-overlay" aria-hidden="true">·</span>
    );
  } else if (mood === 'celebrating' && pose !== 'head' && pose !== 'celebrate') {
    overlay = (
      <span className="kib-mood-overlay kib-spark-overlay" aria-hidden="true">
        <span>✦</span><span>✧</span><span>★</span>
      </span>
    );
  }

  return (
    <span
      className={`kib-wrap ${animate ? 'kib-anim' : ''} kib-pose-${pose} kib-mood-${mood}`}
      style={{ width, height, ...style }}
    >
      <img
        src={src}
        alt="Kibo"
        width={width}
        height={height}
        draggable={false}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none' }}
      />
      {overlay}
    </span>
  );
}

// Compact mark — for the sidebar logo / chips. Circle-clipped head.
function KiboMark({ size = 32, mood = 'happy' }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: '#FFE8EF',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.06)',
      border: '1.5px solid #F4D0DD',
    }}>
      <img
        src={KIBO_ASSETS.head}
        alt=""
        draggable={false}
        style={{
          width: size * 1.15, height: 'auto',
          objectFit: 'cover',
          marginTop: -size * 0.05,
        }}
      />
    </span>
  );
}

// ─── KibPopup — Kibo speaks. Dismissible (5 min snooze / forever) ────
// Use:  <KibPopup id="welcome" message="¡Hola! ¿Listo para empezar?" />
//        — Renders bottom-right; remembers dismissal in localStorage.
function KibPopup({
  id, message, action, onAction,
  position = 'bottom-right',
  pose = 'head',
  mood = 'happy',
  defaultOpen = true,
  onDismiss,
}) {
  const KEY_FOREVER = `kib-popup-forever:${id}`;
  const KEY_SNOOZED = `kib-popup-snoozed:${id}`;
  const [open, setOpen] = React.useState(() => {
    if (!defaultOpen) return false;
    try {
      if (localStorage.getItem(KEY_FOREVER)) return false;
      const snoozeUntil = parseInt(localStorage.getItem(KEY_SNOOZED) || '0', 10);
      if (snoozeUntil > Date.now()) return false;
    } catch (_) {}
    return true;
  });
  const [menu, setMenu] = React.useState(false);

  function snooze(mins) {
    try { localStorage.setItem(KEY_SNOOZED, String(Date.now() + mins * 60_000)); } catch (_) {}
    setOpen(false); setMenu(false); onDismiss && onDismiss('snooze');
  }
  function forever() {
    try { localStorage.setItem(KEY_FOREVER, '1'); } catch (_) {}
    setOpen(false); setMenu(false); onDismiss && onDismiss('forever');
  }
  function dismiss() {
    setOpen(false); setMenu(false); onDismiss && onDismiss('close');
  }

  if (!open) return null;

  return (
    <div className={`kib-popup kib-popup-${position}`} role="dialog" aria-live="polite">
      <div className="kib-popup-kibo">
        <KiboMascot size={66} pose={pose} mood={mood} />
      </div>
      <div className="kib-popup-bubble">
        <p>{message}</p>
        {action && (
          <button type="button" className="kib-popup-cta" onClick={() => { onAction && onAction(); dismiss(); }}>
            {action}
          </button>
        )}
        <button type="button" className="kib-popup-x" onClick={dismiss} aria-label="Cerrar">×</button>
        <button type="button" className="kib-popup-dots" onClick={() => setMenu(m => !m)} aria-label="Opciones">⋯</button>
        {menu && (
          <div className="kib-popup-menu" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => snooze(60)}>No molestar por 1h</button>
            <button type="button" onClick={() => snooze(60 * 24)}>Hoy ya no</button>
            <button type="button" onClick={forever}>No volver a mostrar</button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { KiboMascot, KiboMark, KibPopup, KIBO_ASSETS });
