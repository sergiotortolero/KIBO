/* Kibo App kit — icons. Lucide (the set the live app imports) via CDN UMD.
   <Icon name="flame" size={18}/> renders an <i data-lucide>; a global effect
   re-runs lucide.createIcons() after each render so new icons hydrate. */

function Icon({ name, size = 18, color, strokeWidth = 1.75, style }) {
  return (
    <i
      data-lucide={name}
      style={{ width: size, height: size, display: 'inline-flex', color, ['--lucide-stroke']: strokeWidth, ...style }}
      data-sw={strokeWidth}
    />
  );
}

// Re-hydrate Lucide icons after React commits.
function useLucide(dep) {
  React.useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
    }
  });
}

// Currency glyphs — intentionally filled brand objects, not UI icons.
function CoinIcon({ size = 18 }) {
  return <span className="kb-coin" style={{ width: size, height: size }} />;
}
function GemIcon({ size = 16 }) {
  return <span className="kb-gem" style={{ width: size, height: size }} />;
}

// Flame glyph for streaks (tinted by tier color).
function FlameSVG({ size = 18, color = 'var(--kb-streak)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 2c1.5 4 5 5.5 5 9.5a5 5 0 0 1-10 0c0-1.6.8-2.6 1.5-3.4C9 9.5 9.3 10.6 10 11c-.3-2 1-4.2 2-9z"/>
    </svg>
  );
}

Object.assign(window, { Icon, useLucide, CoinIcon, GemIcon, FlameSVG });
