/* kibo-boot.js — arranca la plataforma Kibo (React + Babel + los .jsx reales)
   dentro de un custom element <kibo-app>. Sin marco de navegador ni panel de tweaks. */
(function () {
  // React solo se carga si el host todavía no lo instaló: cargar un segundo par
  // UMD pisa window.React/ReactDOM y rompe los hooks (dos copias de React).
  const REACT_LIBS = [
    'https://unpkg.com/react@18.3.1/umd/react.development.js',
    'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
  ];
  const BABEL_LIB = 'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js';
  const hasReact = () => !!(window.React && window.ReactDOM && window.ReactDOM.createRoot);

  // Orden de carga: libs → íconos/mascota → pantallas → raíz
  const MODULES = [
    'app/icons.jsx',
    'app/kbv-shared.jsx',
    'app/kibo-style.jsx',
    'app/kibo-vitals.jsx',
    'app/kibo-blob.jsx',
    'app/kibo-quick.jsx',
    'app/mascot.jsx',
    'app/pixel-hero.jsx',
    'app/auth-v2.jsx',
    'app/onboarding-v2.jsx',
    'app/widgets-v2.jsx',
    'app/widgets-v3.jsx',
    'app/streak-system.jsx',
    'app/modals-v2.jsx',
    'app/areas-screen.jsx',
    'app/areas-v2.jsx',
    'app/screens-v2.jsx',
    'app/personal-screens.jsx',
    'app/finanzas-screens.jsx',
    'app/tienda-screen.jsx',
    'app/dashboard-v2.jsx',
    'app/prestige-system.jsx',
    'app/vitrina.jsx',
    'app/progress-charts.jsx',
    'app/achievements.jsx',
    'app/social-screen.jsx',
    'app/character-screen.jsx',
    'app/estudio-screen.jsx',
    'app/estudio-cursos.jsx',
    'app/estudio-escuela.jsx',
    'app/kibo-tip.jsx',
    'app/salud-screen.jsx',
    'app/widgets-catalog.jsx',
    'app/opciones.jsx',
    'app/opciones2.jsx',
    'app/opciones3.jsx',
    'app/cuenta-config.jsx',
    'app/recursos-screen.jsx',
    'app/prestigio-nombres.jsx',
    'app/personalizacion.jsx',
    'app/buscador.jsx',
    'app/kb-gantt.jsx',
    'app/widgets-v4.jsx',
    'app/tarea-detalle.jsx',
    'app/reencauce.jsx',
    'app/kibo-root.jsx',
  ];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.crossOrigin = 'anonymous';
      s.onload = resolve;
      s.onerror = () => reject(new Error('No se pudo cargar ' + src));
      document.head.appendChild(s);
    });
  }

  // El bundle del DS deja window.KIcon como propiedad NO configurable (pero sí
  // escribible) y su set carece de inbox/search/mail/link. Sombrearlo con un
  // `const` global es imposible: la declaración léxica choca con la propiedad no
  // configurable y aborta el script entero, en silencio. La única vía es
  // reasignar la propiedad DESPUÉS de que el bundle haya corrido — y volver a
  // reclamarla antes de cada render, porque el bundle puede llegar tarde.
  function claimKIcon() {
    const app = window.__KIconApp;
    if (app && window.KIcon !== app) {
      try { window.KIcon = app; } catch (e) { /* propiedad de solo lectura */ }
    }
  }

  let bootPromise = null;
  function boot() {
    if (bootPromise) return bootPromise;
    bootPromise = (async () => {
      if (!hasReact()) { for (const src of REACT_LIBS) await loadScript(src); }
      if (!window.Babel) await loadScript(BABEL_LIB);
      for (const path of MODULES) {
        const res = await fetch(path);
        if (!res.ok) throw new Error('No se pudo leer ' + path);
        const src = await res.text();
        const out = window.Babel.transform(src, {
          presets: ['react'],
          filename: path,
          sourceMaps: false,
        }).code;
        // Script clásico = mismas semánticas que <script type="text/babel">:
        // las const/let de nivel superior quedan en el scope léxico global.
        const tag = document.createElement('script');
        tag.textContent = out + '\n//# sourceURL=' + path;
        document.head.appendChild(tag);
      }
      claimKIcon();
    })();
    return bootPromise;
  }

  class KiboApp extends HTMLElement {
    static get observedAttributes() { return ['screen', 'profile', 'boss', 'primary']; }

    connectedCallback() {
      this.style.display = 'block';
      this.style.minHeight = '100%';
      if (this._mounted) return;
      this._mounted = true;
      boot().then(() => {
        this._root = window.ReactDOM.createRoot(this);
        this.render();
      }).catch((err) => {
        console.error(err);
        this.textContent = 'Error al iniciar Kibo: ' + err.message;
      });
    }

    attributeChangedCallback() { this.render(); }

    render() {
      if (!this._root || !window.KiboRoot) return;
      claimKIcon();
      this._root.render(window.React.createElement(window.KiboRoot, {
        screen: this.getAttribute('screen') || 'dashboard',
        profile: this.getAttribute('profile') || 'intermedio',
        bossActive: this.getAttribute('boss') !== 'false',
        primary: this.getAttribute('primary') || '#4CAF82',
      }));
    }
  }

  if (!customElements.get('kibo-app')) customElements.define('kibo-app', KiboApp);

  // <kibo-option variant="…"> — una sola variante para la hoja de comparación
  class KiboOption extends HTMLElement {
    static get observedAttributes() { return ['variant']; }
    connectedCallback() {
      this.style.display = 'block';
      if (this._mounted) return;
      this._mounted = true;
      boot().then(() => {
        this._root = window.ReactDOM.createRoot(this);
        this.render();
      }).catch((err) => { console.error(err); this.textContent = 'Error: ' + err.message; });
    }
    attributeChangedCallback() { this.render(); }
    render() {
      if (!this._root || !window.KiboOptionView) return;
      claimKIcon();
      this._root.render(window.React.createElement(window.KiboOptionView, { variant: this.getAttribute('variant') }));
    }
  }
  if (!customElements.get('kibo-option')) customElements.define('kibo-option', KiboOption);
})();
