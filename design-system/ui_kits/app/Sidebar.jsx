/* Kibo App kit — left sidebar nav */

function Sidebar({ page, setPage }) {
  const main = [
    { id: 'dashboard', label: 'Inicio',    icon: 'home' },
    { id: 'habits',    label: 'Hábitos',   icon: 'repeat' },
    { id: 'retos',     label: 'Retos',     icon: 'swords' },
    { id: 'projects',  label: 'Proyectos', icon: 'folder' },
  ];
  const game = [
    { id: 'character', label: 'Personaje', icon: 'user' },
    { id: 'store',     label: 'Tienda',    icon: 'shopping-bag' },
  ];
  const Item = ({ it }) => (
    <button className={`kb-nav-item${page === it.id ? ' on' : ''}`} onClick={() => setPage(it.id)}>
      <Icon name={it.icon} size={18} /> {it.label}
    </button>
  );
  return (
    <aside className="kb-side">
      <div className="kb-side-logo">
        <img src="../../assets/kibo-mark.svg" width="30" height="30" alt="" />
        <b>Kibo</b>
      </div>
      <nav className="kb-nav">
        {main.map((it) => <Item key={it.id} it={it} />)}
        <div className="kb-nav-sec">Progreso</div>
        {game.map((it) => <Item key={it.id} it={it} />)}
      </nav>
      <div className="kb-side-foot">
        <div className="kb-avatar" style={{ width: 34, height: 34, fontSize: 14 }}>{KB.user.initial}</div>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>{KB.user.name}</div>
          <div className="kb-eyebrow" style={{ fontSize: 10 }}>NV {KB.user.level}</div>
        </div>
        <button className="kbv-btn kbv-icon-btn" style={{ marginLeft: 'auto' }}><Icon name="settings" size={16} /></button>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
