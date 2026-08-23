/* Kibo App kit — root app shell + router */

function App() {
  const [page, setPage] = React.useState('dashboard');

  // Re-hydrate Lucide icons after every render so dynamically-added icons appear.
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
  });

  const pages = {
    dashboard: Dashboard,
    habits: Habits,
    retos: Retos,
    projects: ModuleLocked,
    character: Character,
    store: Store,
  };
  const Page = pages[page] || Dashboard;

  return (
    <div className="kb-app kb-root">
      <Sidebar page={page} setPage={setPage} />
      <div className="kb-main">
        <Header user={KB.user} />
        <Page key={page} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
