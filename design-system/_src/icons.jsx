// icons.jsx — Kibo Area glyphs + utility icons
// Simple geometric SVGs (paths from primitives only)

function KIcon({ name, size = 18, stroke = 1.6, ...rest }) {
  const s = { width: size, height: size, color: 'currentColor' };
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'vigor': // pulse / flame
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M12 3c2 3 4 5 4 8a4 4 0 1 1-8 0c0-3 2-5 4-8z" {...common} />
          <path d="M12 11c.8 1.5 1.6 2.5 1.6 4a1.6 1.6 0 1 1-3.2 0c0-1.5.8-2.5 1.6-4z" {...common} />
        </svg>
      );
    case 'wisdom': // book / eye
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M4 5h7a3 3 0 0 1 3 3v12" {...common} />
          <path d="M20 5h-7a3 3 0 0 0-3 3v12" {...common} />
          <path d="M4 5v15" {...common} />
          <path d="M20 5v15" {...common} />
        </svg>
      );
    case 'wealth': // coin
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <circle cx="12" cy="12" r="8" {...common} />
          <path d="M12 7v10M9 9.5h5.5a1.5 1.5 0 0 1 0 3H9.5a1.5 1.5 0 0 0 0 3H15" {...common} />
        </svg>
      );
    case 'community': // people
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <circle cx="9" cy="9" r="3" {...common} />
          <circle cx="17" cy="10" r="2.5" {...common} />
          <path d="M3 19c0-3 3-5 6-5s6 2 6 5" {...common} />
          <path d="M15 14.2c2.5 0 6 1.4 6 4.8" {...common} />
        </svg>
      );
    case 'will': // shield + bolt
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z" {...common} />
          <path d="M12 8l-2 4h2.5l-1.5 4 4-5h-2.5l1.5-3z" {...common} />
        </svg>
      );
    case 'home':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" {...common} />
        </svg>
      );
    case 'list':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M8 6h13M8 12h13M8 18h13" {...common} />
          <circle cx="4" cy="6" r="1.2" fill="currentColor" />
          <circle cx="4" cy="12" r="1.2" fill="currentColor" />
          <circle cx="4" cy="18" r="1.2" fill="currentColor" />
        </svg>
      );
    case 'sword': // boss/habits
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M14 4l6 0 0 6-9 9-3-3 9-9" {...common} />
          <path d="M9 16l-4 4M5 16l3 3" {...common} />
        </svg>
      );
    case 'user':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <circle cx="12" cy="9" r="3.5" {...common} />
          <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" {...common} />
        </svg>
      );
    case 'plus':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M12 5v14M5 12h14" {...common} />
        </svg>
      );
    case 'check':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M4 12l5 5L20 6" {...common} />
        </svg>
      );
    case 'eye':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" {...common} />
          <circle cx="12" cy="12" r="3" {...common} />
        </svg>
      );
    case 'eye-off':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M3 3l18 18" {...common} />
          <path d="M10.6 6.2A9.7 9.7 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 4M6.6 6.6C3.7 8.4 2 12 2 12s3.5 6 10 6c1.7 0 3.2-.4 4.5-1" {...common} />
        </svg>
      );
    case 'alert':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <circle cx="12" cy="12" r="9" {...common} />
          <path d="M12 7v6M12 17v.5" {...common} />
        </svg>
      );
    case 'grip':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <circle cx="9" cy="6" r="1.3" fill="currentColor" />
          <circle cx="9" cy="12" r="1.3" fill="currentColor" />
          <circle cx="9" cy="18" r="1.3" fill="currentColor" />
          <circle cx="15" cy="6" r="1.3" fill="currentColor" />
          <circle cx="15" cy="12" r="1.3" fill="currentColor" />
          <circle cx="15" cy="18" r="1.3" fill="currentColor" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M5 12h14M13 6l6 6-6 6" {...common} />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M19 12H5M11 6l-6 6 6 6" {...common} />
        </svg>
      );
    case 'sparkle':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M12 4l1.6 5.4L19 11l-5.4 1.6L12 18l-1.6-5.4L5 11l5.4-1.6z" {...common} />
        </svg>
      );
    case 'google':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <path d="M21.6 12.2c0-.7-.06-1.36-.18-2H12v3.78h5.4a4.6 4.6 0 0 1-2 3.03v2.5h3.23c1.9-1.74 2.97-4.3 2.97-7.31z" fill="#4285F4"/>
          <path d="M12 22c2.7 0 4.96-.9 6.63-2.43l-3.24-2.5c-.9.6-2.04.96-3.4.96-2.6 0-4.82-1.76-5.62-4.13H3.04v2.58A10 10 0 0 0 12 22z" fill="#34A853"/>
          <path d="M6.38 13.9a6 6 0 0 1 0-3.82V7.5H3.04a10 10 0 0 0 0 9l3.34-2.6z" fill="#FBBC05"/>
          <path d="M12 5.96c1.47 0 2.8.5 3.84 1.5l2.87-2.87C16.96 2.99 14.7 2 12 2A10 10 0 0 0 3.04 7.5l3.34 2.58C7.18 7.72 9.4 5.96 12 5.96z" fill="#EA4335"/>
        </svg>
      );
    case 'microsoft':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <rect x="2"  y="2"  width="9.5" height="9.5" fill="#F25022"/>
          <rect x="12.5" y="2"  width="9.5" height="9.5" fill="#7FBA00"/>
          <rect x="2"  y="12.5" width="9.5" height="9.5" fill="#00A4EF"/>
          <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900"/>
        </svg>
      );
    case 'layers':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M12 3l9 5-9 5-9-5 9-5z" {...common}/>
          <path d="M3 13l9 5 9-5M3 17l9 5 9-5" {...common}/>
        </svg>
      );
    case 'folder':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" {...common}/>
        </svg>
      );
    case 'book':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2V5z" {...common}/>
          <path d="M4 18a2 2 0 0 1 2-2h13" {...common}/>
        </svg>
      );
    case 'shop':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M3 9l1.5-5h15L21 9M3 9v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9h18" {...common}/>
          <path d="M8 13a4 4 0 0 0 8 0" {...common}/>
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <circle cx="12" cy="12" r="3" {...common}/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01A1.65 1.65 0 0 0 20.91 10H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" {...common}/>
        </svg>
      );
    case 'camera':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M3 8a2 2 0 0 1 2-2h3l1.5-2h5L16 6h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...common}/>
          <circle cx="12" cy="13" r="3.5" {...common}/>
        </svg>
      );
    case 'film':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <rect x="3" y="4" width="18" height="16" rx="2" {...common}/>
          <path d="M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4" {...common}/>
        </svg>
      );
    case 'tv':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <rect x="2" y="5" width="20" height="13" rx="2" {...common}/>
          <path d="M7 22h10M12 18v4" {...common}/>
        </svg>
      );
    case 'book-open':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M12 5c-2-2-5-2-8-1v15c3-1 6-1 8 1m0-15c2-2 5-2 8-1v15c-3-1-6-1-8 1m0-15v15" {...common}/>
        </svg>
      );
    case 'edit':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6" {...common}/>
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...common}/>
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M18 6L6 18M6 6l12 12" {...common}/>
        </svg>
      );
    case 'flame':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M12 2c1 2 3 4 3 7a3 3 0 0 1-6 0c0-1 .5-2 1-3-1 1-3 3-3 6a5 5 0 0 0 10 0c0-4-3-6-5-10z" {...common}/>
        </svg>
      );
    case 'mood-great': // 😄
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <circle cx="12" cy="12" r="9" {...common}/>
          <path d="M8 14s1.5 3 4 3 4-3 4-3" {...common}/>
          <path d="M8 9.5L9.5 11M16 9.5L14.5 11" {...common}/>
        </svg>
      );
    case 'mood-good':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <circle cx="12" cy="12" r="9" {...common}/>
          <path d="M9 14.5s1 1.5 3 1.5 3-1.5 3-1.5" {...common}/>
          <circle cx="9" cy="10" r="0.8" fill="currentColor"/>
          <circle cx="15" cy="10" r="0.8" fill="currentColor"/>
        </svg>
      );
    case 'mood-meh':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <circle cx="12" cy="12" r="9" {...common}/>
          <path d="M9 15h6" {...common}/>
          <circle cx="9" cy="10" r="0.8" fill="currentColor"/>
          <circle cx="15" cy="10" r="0.8" fill="currentColor"/>
        </svg>
      );
    case 'mood-low':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <circle cx="12" cy="12" r="9" {...common}/>
          <path d="M9 16.5s1-1.5 3-1.5 3 1.5 3 1.5" {...common}/>
          <circle cx="9" cy="10" r="0.8" fill="currentColor"/>
          <circle cx="15" cy="10" r="0.8" fill="currentColor"/>
        </svg>
      );
    case 'mood-sad':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <circle cx="12" cy="12" r="9" {...common}/>
          <path d="M8 16s1.5-3 4-3 4 3 4 3" {...common}/>
          <path d="M8 9.5l3 1.5M16 9.5l-3 1.5" {...common}/>
        </svg>
      );
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <rect x="3" y="5" width="18" height="16" rx="2" {...common}/>
          <path d="M3 9h18M8 3v4M16 3v4" {...common}/>
        </svg>
      );
    case 'image':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <rect x="3" y="3" width="18" height="18" rx="2" {...common}/>
          <circle cx="9" cy="9" r="2" {...common}/>
          <path d="M21 16l-5-5L4 21" {...common}/>
        </svg>
      );
    case 'mic':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <rect x="9" y="3" width="6" height="12" rx="3" {...common}/>
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" {...common}/>
        </svg>
      );
    case 'square':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" stroke="none"/>
        </svg>
      );
    case 'upload':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M12 15V4M7 9l5-5 5 5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" {...common}/>
        </svg>
      );
    case 'image-up':
    case 'picture':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <rect x="3" y="3" width="18" height="18" rx="2" {...common}/>
          <circle cx="9" cy="9" r="2" {...common}/>
          <path d="M21 16l-5-5L4 21" {...common}/>
        </svg>
      );
    case 'chart':
    case 'bar-chart':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" {...common}/>
        </svg>
      );
    case 'target':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <circle cx="12" cy="12" r="9" {...common}/>
          <circle cx="12" cy="12" r="5" {...common}/>
          <circle cx="12" cy="12" r="1.4" fill="currentColor"/>
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z" {...common}/>
        </svg>
      );
    case 'clock':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <circle cx="12" cy="12" r="9" {...common}/>
          <path d="M12 7v5l3 2" {...common}/>
        </svg>
      );
    case 'trash':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M4 7h16" {...common}/>
          <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" {...common}/>
          <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" {...common}/>
          <path d="M10 11v6M14 11v6" {...common}/>
        </svg>
      );
    case 'crown':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M4 18h16" {...common}/>
          <path d="M3 7l4 4 5-6 5 6 4-4-2 11H5z" {...common}/>
        </svg>
      );
    case 'repeat':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M4 9a5 5 0 0 1 5-5h8l-2.5-2.5M20 15a5 5 0 0 1-5 5H7l2.5 2.5" {...common}/>
        </svg>
      );
    case 'gauge': // effort / intensity
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M5 19a9 9 0 1 1 14 0" {...common}/>
          <path d="M12 14l4-4" {...common}/>
          <circle cx="12" cy="14" r="1.4" fill="currentColor" stroke="none"/>
        </svg>
      );
    case 'trophy':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M7 4h10v5a5 5 0 0 1-10 0z" {...common}/>
          <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" {...common}/>
          <path d="M10 14.5V18M14 14.5V18M8 20h8" {...common}/>
        </svg>
      );
    case 'trending-up':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M4 16l5-5 4 4 7-7" {...common}/>
          <path d="M16 8h4v4" {...common}/>
        </svg>
      );
    case 'flag':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M6 21V4" {...common}/>
          <path d="M6 4h11l-2 4 2 4H6" {...common}/>
        </svg>
      );
    case 'piggy': // savings
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M4 13a6 5 0 0 1 6-5h5a5 5 0 0 1 5 5 4 4 0 0 1-2 3.5V20h-3v-2h-4v2H8v-2a5 5 0 0 1-4-5z" {...common}/>
          <circle cx="15.5" cy="12" r="1" fill="currentColor" stroke="none"/>
          <path d="M3 12h2" {...common}/>
        </svg>
      );
    case 'tablet': // e-reader / tablet
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <rect x="6" y="3" width="12" height="18" rx="2.5" {...common}/>
          <line x1="9" y1="7" x2="15" y2="7" {...common}/>
          <line x1="9" y1="10" x2="15" y2="10" {...common}/>
          <line x1="9" y1="13" x2="13" y2="13" {...common}/>
          <circle cx="12" cy="18" r="0.6" fill="currentColor" stroke="none"/>
        </svg>
      );
    case 'cloud':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M7 18a4 4 0 0 1-.5-7.97A5 5 0 0 1 16 9.5a3.5 3.5 0 0 1 1 6.86" {...common}/>
          <path d="M7 18h10" {...common}/>
        </svg>
      );
    case 'phone':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <rect x="7" y="2" width="10" height="20" rx="2.5" {...common}/>
          <line x1="10.5" y1="18.5" x2="13.5" y2="18.5" {...common}/>
        </svg>
      );
    case 'laptop':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <rect x="5" y="5" width="14" height="10" rx="1.5" {...common}/>
          <path d="M3 19h18l-1.5-2H4.5z" {...common}/>
        </svg>
      );
    case 'headphones':
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M4 13v-1a8 8 0 0 1 16 0v1" {...common}/>
          <rect x="3" y="13" width="4" height="6" rx="1.5" {...common}/>
          <rect x="17" y="13" width="4" height="6" rx="1.5" {...common}/>
        </svg>
      );
    case 'graduation': // estudio / academic
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M2 9l10-4 10 4-10 4z" {...common}/>
          <path d="M6 11v4c0 1.5 3 3 6 3s6-1.5 6-3v-4" {...common}/>
          <line x1="22" y1="9" x2="22" y2="14" {...common}/>
        </svg>
      );
    case 'pin': // location
      return (
        <svg viewBox="0 0 24 24" {...s} {...rest}>
          <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" {...common}/>
          <circle cx="12" cy="10" r="2.5" {...common}/>
        </svg>
      );
    default:
      return null;
  }
}

window.KIcon = KIcon;
