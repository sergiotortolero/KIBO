export function KbEmblem({ material = 'bronce', level, size = 48, locked }) {
  const M = {
    bronce: { a: '#E0A878', b: '#A8632E', ink: '#4A2810' },
    plata: { a: '#D2D9E1', b: '#8A95A2', ink: '#363E48' },
    oro: { a: '#F8DC8A', b: '#D4A22B', ink: '#5E440E' },
    platino: { a: '#E9EEF3', b: '#AAB6C4', ink: '#3A434E' },
    obsidiana: { a: '#6E6880', b: '#241F30', ink: '#E6E1F2' },
    diamante: { a: '#CFF6FF', b: '#3FC0DE', ink: '#0E4A5A' },
    esmeralda: { a: '#A8E6C0', b: '#1E9E63', ink: '#0C4A2C' },
    rubi: { a: '#FF9DB0', b: '#C8102E', ink: '#FFFFFF' },
    damasco: { a: '#C9CDD4', b: '#5A5E68', ink: '#241B33' },
  };
  const m = M[material] || M.bronce;
  const base = {
    width: size, height: size * 1.16, display: 'flex', alignItems: 'center', justifyContent: 'center',
    clipPath: 'polygon(50% 100%, 8% 76%, 0 0, 100% 0, 92% 76%)',
    fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: Math.round(size * 0.3),
    filter: 'drop-shadow(0 2px 3px rgba(20,30,50,.2))',
  };
  if (locked) return <div style={{ ...base, background: 'var(--kb-surface-2)', color: 'var(--kb-text-3)' }}>🔒</div>;
  return <div style={{ ...base, background: `linear-gradient(160deg, ${m.a}, ${m.b})`, color: m.ink }}>{level}</div>;
}
