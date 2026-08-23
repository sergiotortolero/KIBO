// pixel-hero.jsx — Pixel art Hero avatar
// Drawn procedurally to a canvas at 1 logical pixel per cell, then upscaled
// via image-rendering: pixelated. 16 columns × 22 rows.

const HERO_SKIN_TONES = [
  { id: 'porcelain', label: 'Porcelana', hex: '#F2D9C0' },
  { id: 'sand',      label: 'Trigo',     hex: '#E5BE99' },
  { id: 'honey',     label: 'Miel',      hex: '#D29976' },
  { id: 'sienna',    label: 'Siena',     hex: '#A7724E' },
  { id: 'walnut',    label: 'Nogal',     hex: '#7A4F33' },
  { id: 'ebony',     label: 'Ébano',     hex: '#4D2E1E' },
];

const HERO_HAIR_TYPES = [
  { id: 'short',  label: 'Corto' },
  { id: 'long',   label: 'Largo' },
  { id: 'mohawk', label: 'Cresta' },
  { id: 'cap',    label: 'Gorro' },
];

const HERO_HAIR_COLORS = [
  { id: 'jet',    label: 'Azabache', hex: '#1A1A22' },
  { id: 'umber',  label: 'Castaño',  hex: '#3F2A1E' },
  { id: 'auburn', label: 'Rojizo',   hex: '#9B4520' },
  { id: 'wheat',  label: 'Rubio',    hex: '#D6B27A' },
  { id: 'silver', label: 'Plata',    hex: '#C9CDD6' },
  { id: 'cobalt', label: 'Cobalto',  hex: '#3F5BC4' },
];

const HERO_CLOTHING_TYPES = [
  { id: 'tunic',   label: 'Túnica' },
  { id: 'hoodie',  label: 'Hoodie' },
  { id: 'armor',   label: 'Armadura' },
  { id: 'robe',    label: 'Túnica larga' },
];

const HERO_CLOTHING_COLORS = [
  { id: 'kibo',   label: 'Kibo',     hex: 'var(--kb-primary)' },
  { id: 'ember',  label: 'Brasa',    hex: 'var(--kb-hp)' },
  { id: 'sky',    label: 'Cielo',    hex: 'var(--area-wisdom)' },
  { id: 'plum',   label: 'Ciruela',  hex: 'var(--area-community)' },
  { id: 'sand',   label: 'Arena',    hex: '#D6B27A' },
];

// Color tint helper: brighten / darken a hex by amount (-1..1)
function shadeHex(hex, amount) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  const factor = 1 + amount;
  const sr = amount < 0
    ? clamp(r + amount * r)
    : clamp(r + (255 - r) * amount);
  const sg = amount < 0
    ? clamp(g + amount * g)
    : clamp(g + (255 - g) * amount);
  const sb = amount < 0
    ? clamp(b + amount * b)
    : clamp(b + (255 - b) * amount);
  return `#${sr.toString(16).padStart(2,'0')}${sg.toString(16).padStart(2,'0')}${sb.toString(16).padStart(2,'0')}`;
}

const SPRITE_W = 16;
const SPRITE_H = 22;

function paintHero(canvas, opts) {
  const skinDef = HERO_SKIN_TONES.find(s => s.id === opts.skin) || HERO_SKIN_TONES[1];
  const hairColDef = HERO_HAIR_COLORS.find(c => c.id === opts.hairColor) || HERO_HAIR_COLORS[0];
  const clothColDef = HERO_CLOTHING_COLORS.find(c => c.id === opts.clothingColor) || HERO_CLOTHING_COLORS[0];
  const hairKind = opts.hairType || 'short';
  const clothKind = opts.clothingType || 'tunic';

  const SKIN = skinDef.hex;
  const SKIN_SH = shadeHex(SKIN, -0.18);
  const HAIR = hairColDef.hex;
  const HAIR_SH = shadeHex(HAIR, -0.22);
  const CLOTH = clothColDef.hex;
  const CLOTH_SH = shadeHex(CLOTH, -0.22);
  const PANTS = '#3F4150';
  const PANTS_SH = '#2A2C36';
  const BOOTS = '#26221C';
  const INK = 'var(--kb-text)';

  const ctx = canvas.getContext('2d');
  const scale = canvas.width / SPRITE_W;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const px = (x, y, c) => {
    if (x < 0 || y < 0 || x >= SPRITE_W || y >= SPRITE_H) return;
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x * scale), Math.round(y * scale), Math.ceil(scale), Math.ceil(scale));
  };
  const rect = (x1, y1, x2, y2, c) => {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) px(x, y, c);
    }
  };

  // ─── HEAD (skin oval) ───
  rect(4, 2, 11, 2, SKIN);
  rect(3, 3, 12, 3, SKIN);
  rect(2, 4, 13, 9, SKIN);
  rect(3, 10, 12, 10, SKIN);
  rect(4, 11, 11, 11, SKIN);

  // Subtle chin shadow
  px(3, 10, SKIN_SH); px(12, 10, SKIN_SH);
  rect(5, 11, 10, 11, SKIN_SH);

  // Eyes — 1-pixel
  px(5, 6, INK); px(10, 6, INK);
  px(5, 7, INK); px(10, 7, INK);

  // Mouth — 2 pixels, single row
  rect(7, 9, 8, 9, INK);

  // Tiny cheek blush
  px(4, 8, '#E89A99');
  px(11, 8, '#E89A99');

  // ─── NECK ───
  rect(6, 12, 9, 12, SKIN);
  rect(6, 13, 9, 13, SKIN_SH);

  // ─── BODY / CLOTHING ───
  // Shoulders row 13 (clothing covers everything except where neck is)
  rect(3, 13, 5, 13, CLOTH);
  rect(10, 13, 12, 13, CLOTH);
  // Main torso
  rect(3, 14, 12, 19, CLOTH);
  // Sleeves down sides
  rect(2, 14, 2, 17, CLOTH);
  rect(13, 14, 13, 17, CLOTH);
  // Cuff shadow
  rect(2, 17, 2, 17, CLOTH_SH);
  rect(13, 17, 13, 17, CLOTH_SH);

  // Type-specific detailing
  if (clothKind === 'tunic') {
    // V-neck
    px(7, 13, SKIN); px(8, 13, SKIN);
    px(7, 14, SKIN); px(8, 14, SKIN);
    // belt
    rect(3, 19, 12, 19, CLOTH_SH);
    // hem highlight
    rect(3, 18, 12, 18, CLOTH);
  } else if (clothKind === 'hoodie') {
    // hood ring around face
    px(2, 11, CLOTH); px(13, 11, CLOTH);
    px(3, 12, CLOTH); px(12, 12, CLOTH);
    // pocket
    rect(5, 17, 10, 18, CLOTH_SH);
    // drawstrings
    px(7, 13, INK); px(8, 13, INK);
    px(7, 14, INK); px(8, 14, INK);
  } else if (clothKind === 'armor') {
    // pauldrons
    rect(1, 13, 2, 14, CLOTH);
    rect(13, 13, 14, 14, CLOTH);
    px(1, 13, CLOTH_SH);
    px(14, 13, CLOTH_SH);
    // chest plate seam
    rect(7, 14, 7, 19, CLOTH_SH);
    rect(8, 14, 8, 19, CLOTH_SH);
    // center boss
    px(7, 16, INK); px(8, 16, INK);
    px(7, 17, '#FFFFFF'); px(8, 17, '#FFFFFF');
    // trim
    rect(3, 19, 12, 19, INK);
  } else if (clothKind === 'robe') {
    // wider skirt
    rect(1, 18, 14, 19, CLOTH);
    // sash
    rect(2, 19, 13, 19, CLOTH_SH);
    // lapels
    px(6, 13, CLOTH_SH); px(9, 13, CLOTH_SH);
    px(7, 14, CLOTH_SH); px(8, 14, CLOTH_SH);
  }

  // Hands (skin) at row 18
  px(2, 18, SKIN);
  px(13, 18, SKIN);

  // ─── LEGS / PANTS ───
  if (clothKind === 'robe') {
    // robe covers legs — just a small foot peek
    rect(5, 20, 7, 20, PANTS);
    rect(8, 20, 10, 20, PANTS);
  } else {
    rect(4, 20, 6, 20, PANTS);
    rect(9, 20, 11, 20, PANTS);
    // inseam
    px(5, 20, PANTS_SH);
    px(10, 20, PANTS_SH);
  }

  // Boots row 21
  rect(4, 21, 7, 21, BOOTS);
  rect(8, 21, 11, 21, BOOTS);

  // ─── HAIR (top layer, overlays forehead) ───
  if (hairKind === 'short') {
    rect(4, 2, 11, 2, HAIR);
    rect(3, 3, 12, 3, HAIR);
    rect(2, 4, 13, 4, HAIR);
    px(2, 5, HAIR); px(13, 5, HAIR);
    // forehead bangs
    rect(4, 5, 6, 5, HAIR);
    rect(9, 5, 11, 5, HAIR);
    // highlight
    rect(5, 2, 8, 2, HAIR_SH);
  } else if (hairKind === 'long') {
    rect(4, 2, 11, 2, HAIR);
    rect(3, 3, 12, 3, HAIR);
    rect(2, 4, 13, 4, HAIR);
    rect(2, 5, 5, 5, HAIR);
    rect(10, 5, 13, 5, HAIR);
    // long down sides
    rect(2, 6, 2, 11, HAIR);
    rect(13, 6, 13, 11, HAIR);
    // back behind shoulders to row 14
    rect(1, 11, 2, 14, HAIR);
    rect(13, 11, 14, 14, HAIR);
    // highlight strip
    rect(5, 2, 7, 2, HAIR_SH);
  } else if (hairKind === 'mohawk') {
    // strip on top
    rect(7, 0, 8, 4, HAIR);
    rect(6, 1, 9, 3, HAIR);
    // sides — exposed skin (no hair) — leave bare
  } else if (hairKind === 'cap') {
    // cap covers top of head + brim
    rect(4, 2, 11, 2, HAIR);
    rect(3, 3, 12, 3, HAIR);
    rect(2, 4, 13, 4, HAIR);
    // brim shadow strip
    rect(2, 5, 13, 5, HAIR_SH);
    // logo dot
    px(8, 3, shadeHex(HAIR, 0.5));
  }
}

// ─────────────────────────────────────────────────────────────
// React component
// ─────────────────────────────────────────────────────────────
function PixelHero({
  skin = 'sand', hairType = 'short', hairColor = 'umber',
  clothingType = 'tunic', clothingColor = 'kibo',
  size = 128, style = {},
}) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    if (!canvasRef.current) return;
    paintHero(canvasRef.current, { skin, hairType, hairColor, clothingType, clothingColor });
  }, [skin, hairType, hairColor, clothingType, clothingColor, size]);

  const pixelW = SPRITE_W;
  const pixelH = SPRITE_H;
  const scale = Math.floor(size / pixelW);
  const w = pixelW * scale;
  const h = pixelH * scale;

  return (
    <canvas
      ref={canvasRef}
      width={w}
      height={h}
      style={{
        imageRendering: 'pixelated',
        display: 'block',
        width: w,
        height: h,
        ...style,
      }}
    />
  );
}

Object.assign(window, {
  PixelHero,
  HERO_SKIN_TONES,
  HERO_HAIR_TYPES,
  HERO_HAIR_COLORS,
  HERO_CLOTHING_TYPES,
  HERO_CLOTHING_COLORS,
});
