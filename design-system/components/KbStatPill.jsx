export function KbStatPill({ kind = 'coin', value, style }) {
  const glyphs = {
    coin: <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#FBE08A,#F4B740 60%,#D99A1F)', boxShadow: 'inset 0 0 0 2px #d99a1f55', flex: 'none' }} />,
    gem: <span style={{ width: 16, height: 16, background: 'linear-gradient(145deg,#9DB4FB,#6E8CF2)', clipPath: 'polygon(50% 0,100% 38%,78% 100%,22% 100%,0 38%)', flex: 'none' }} />,
    streak: <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--kb-streak)"><path d="M12 2c1.5 4 5 5.5 5 9.5a5 5 0 0 1-10 0c0-1.6.8-2.6 1.5-3.4C9 9.5 9.3 10.6 10 11c-.3-2 1-4.2 2-9z"/></svg>,
    hp: <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--kb-hp)"><path d="M12 21S4 14.5 4 9a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 5.5-8 12-8 12z"/></svg>,
    xp: <span style={{ fontFamily: 'var(--kb-f-mono)', fontWeight: 700, fontSize: 11, color: 'var(--kb-primary-ink)' }}>XP</span>,
  };
  const colors = { streak: 'var(--kb-streak)', hp: 'var(--kb-hp)' };
  return (
    <span className="kbv-stat-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: 'var(--kb-r-pill)', background: 'var(--kb-surface)', border: '1px solid var(--kb-border)', fontFamily: 'var(--kb-f-mono)', fontSize: 13, fontVariantNumeric: 'tabular-nums', color: colors[kind] || 'var(--kb-text)', ...style }}>
      {glyphs[kind]}{value}
    </span>
  );
}
