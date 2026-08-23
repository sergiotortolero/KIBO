/* Kibo App kit — HUD header (avatar + emblem, level, XP bar, HP, streak, coins, gems) */

function Header({ user }) {
  const xpPct = Math.round((user.xp / user.xpNext) * 100);
  const eq = KB.prestige; // equipped prestige emblem
  return (
    <header className="kb-header">
      <div className="kb-hero-id">
        <div className="kb-avatar-wrap">
          <div className="kb-avatar">{user.initial}</div>
          <div className="kb-hero-emblem" style={{ background: `linear-gradient(145deg,${KB.ranks[2].a},${KB.ranks[2].b})`, color: KB.ranks[2].ink }}>
            {user.level}
          </div>
        </div>
        <div className="kb-hero-meta">
          <span className="kb-hero-name">{user.name}</span>
          <div className="kb-xpbar" title={`${user.xp} / ${user.xpNext} XP`}><i style={{ width: `${xpPct}%` }} /></div>
          <span className="kb-eyebrow" style={{ fontSize: 10 }}>{user.xp.toLocaleString('es-MX')} / {user.xpNext.toLocaleString('es-MX')} XP</span>
        </div>
      </div>

      <div className="kb-hud-spacer" />

      <StatPill style={{ color: 'var(--kb-hp)' }}>
        <Icon name="heart" size={15} color="var(--kb-hp)" /> {user.hp}%
      </StatPill>
      <StatPill style={{ color: 'var(--kb-streak)' }}>
        <FlameSVG size={15} /> {user.streak}
      </StatPill>
      <StatPill><CoinIcon /> {user.coins.toLocaleString('es-MX')}</StatPill>
      <StatPill><GemIcon /> {user.gems}</StatPill>
    </header>
  );
}

window.Header = Header;
