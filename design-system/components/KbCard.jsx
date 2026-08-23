export function KbCard({ boss, hover, title, meta, children, style }) {
  const cls = boss ? 'kbv-card kbv-boss' : 'kbv-card';
  return (
    <div className={cls} style={{ ...(hover ? { borderColor: 'var(--kb-border-strong)', boxShadow: 'var(--kb-sh-2)' } : null), ...style }}>
      {title ? <div style={{ fontFamily: 'var(--kb-f-display)', fontWeight: 700, fontSize: 16, color: boss ? 'var(--kb-boss)' : 'var(--kb-text)', marginBottom: 2 }}>{title}</div> : null}
      {meta ? <div style={{ fontSize: 12, color: 'var(--kb-text-2)', marginBottom: 8 }}>{meta}</div> : null}
      {children}
    </div>
  );
}
