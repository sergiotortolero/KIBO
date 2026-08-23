// mascot.jsx — KIBO en el sistema.
// La mascota canónica del Design System es el BLOB (kibo-blob.jsx): un gel
// translúcido que respira, parpadea, expresa 8 ánimos y hace travesuras.
// Este archivo mantiene la API previa (KiboMascot / KiboMark / KibPopup) para
// que todas las pantallas ya existentes rendericen la mascota del DS sin
// tocar cada llamada.

// Arte antiguo (ajolote) — conservado solo como referencia histórica.
const KIBO_ASSETS = {
  head:      'assets/kibo-head-wave.png',
  headCele:  'assets/kibo-head-celebrate.png',
  body:      'assets/kibo-wave.png',
  side:      'assets/kibo-side.png',
  celebrate: 'assets/kibo-celebrate.png',
};

// pose se conserva por compatibilidad: el blob es un solo cuerpo, así que la
// pose solo modula el gesto (saludo, celebración) y no cambia el arte.
const POSE_GESTURE = { body: 'wave', celebrate: 'five', side: null, head: null };

function KiboMascot({ size = 96, mood = 'happy', pose = 'head', animate = true, style = {}, onClick }) {
  const m = typeof kiboMood === 'function' ? kiboMood(mood) : 'calma';
  const gesture = mood === 'wave' ? 'wave' : mood === 'celebrating' ? 'clap' : POSE_GESTURE[pose] || null;
  return (
    <KiboBlob
      size={size}
      mood={m}
      idle={animate && size >= 56}
      gesture={gesture}
      ground={size >= 48}
      style={style}
      onClick={onClick} />
  );
}

// Marca compacta — logo de sidebar / chips. Blob recortado en círculo.
function KiboMark({ size = 32, mood = 'happy' }) {
  return (
    <span className="kbb-mark" style={{ width: size, height: size }}>
      <KiboBlob size={size * 0.92} mood={mood} animate={false} ground={false} style={{ marginTop: size * 0.04 }} />
    </span>
  );
}

// ─── KibPopup — KIBO habla. Descartable (snooze / nunca más) ────
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
