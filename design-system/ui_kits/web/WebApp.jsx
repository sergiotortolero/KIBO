/* Kibo · Web kit — root router */
function WebApp() {
  const [page, setPage] = React.useState('landing');
  const go = (p) => setPage(p);

  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
  });

  const showNav = page === 'landing' || page === 'register' || page === 'login';
  const pages = { landing: Landing, register: Register, login: Login, onboarding: Onboarding };
  const Page = pages[page] || Landing;

  return (
    <div className="web kb-root">
      {showNav && <Nav go={go} />}
      <Page go={go} key={page} />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<WebApp />);
