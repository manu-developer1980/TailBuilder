import { StyleCategoryMap } from '../types/editor';
import { TAILWIND_COLOR_FAMILIES, SPECIAL_COLORS } from './colors';

// Mapa de colores precompilado para búsqueda O(1) ultra-rápida
const COLOR_HEX_MAP = new Map<string, string>();

for (const fam of TAILWIND_COLOR_FAMILIES) {
  for (const s of fam.shades) {
    COLOR_HEX_MAP.set(`${fam.id}-${s.shade}`, s.hex);
  }
}

for (const spec of SPECIAL_COLORS) {
  COLOR_HEX_MAP.set(spec.classSuffix, spec.hex);
}

/**
 * Extrae y genera estilos CSS en línea para garantizar que CUALQUIER clase
 * de Tailwind (arbitraria ej. bg-[#614242], max-w-[30px], o clases de color no escaneadas)
 * se previsualice al 100% de forma instantánea en el lienzo sin depender del JIT.
 */
export function extractRuntimeStyles(styles?: StyleCategoryMap): React.CSSProperties {
  if (!styles) return {};

  const inline: React.CSSProperties = {};

  // Concatenar todas las clases
  const allCls = Object.values(styles)
    .filter((v): v is string => Boolean(v && typeof v === 'string'))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean);

  for (const cls of allCls) {
    // --- 1. COLORES DE FONDO ---
    // bg-[#hex] o bg-[rgb(...)]
    const bgArbitrary = cls.match(/^bg-\[([^\]]+)\]$/);
    if (bgArbitrary) {
      inline.backgroundColor = bgArbitrary[1];
      continue;
    }
    // bg-family-shade o bg-white
    const bgNamed = cls.match(/^bg-([a-z]+(-[0-9]+)?)$/);
    if (bgNamed && COLOR_HEX_MAP.has(bgNamed[1])) {
      inline.backgroundColor = COLOR_HEX_MAP.get(bgNamed[1]);
      continue;
    }

    // --- 2. COLORES DE TEXTO ---
    const textArbitrary = cls.match(/^text-\[([^\]]+)\]$/);
    if (textArbitrary) {
      const val = textArbitrary[1];
      // Si parece color (#, rgb, hsl)
      if (val.startsWith('#') || val.startsWith('rgb') || val.startsWith('hsl')) {
        inline.color = val;
        continue;
      } else {
        // Podría ser tamaño text-[14px]
        inline.fontSize = val;
        continue;
      }
    }
    const textNamed = cls.match(/^text-([a-z]+-[0-9]+)$/);
    if (textNamed && COLOR_HEX_MAP.has(textNamed[1])) {
      inline.color = COLOR_HEX_MAP.get(textNamed[1]);
      continue;
    }

    // --- 3. COLORES DE BORDE ---
    const borderArbitrary = cls.match(/^border-\[([^\]]+)\]$/);
    if (borderArbitrary) {
      const val = borderArbitrary[1];
      if (val.startsWith('#') || val.startsWith('rgb') || val.startsWith('hsl')) {
        inline.borderColor = val;
      } else {
        inline.borderWidth = val;
      }
      continue;
    }
    const borderNamed = cls.match(/^border-([a-z]+-[0-9]+)$/);
    if (borderNamed && COLOR_HEX_MAP.has(borderNamed[1])) {
      inline.borderColor = COLOR_HEX_MAP.get(borderNamed[1]);
      continue;
    }

    // --- 4. DIMENSIONES ARBITRARIAS ---
    // max-w-[30px]
    const maxW = cls.match(/^max-w-\[([^\]]+)\]$/);
    if (maxW) {
      inline.maxWidth = maxW[1];
      continue;
    }
    // w-[350px]
    const w = cls.match(/^w-\[([^\]]+)\]$/);
    if (w) {
      inline.width = w[1];
      continue;
    }
    // h-[120px]
    const h = cls.match(/^h-\[([^\]]+)\]$/);
    if (h) {
      inline.height = h[1];
      continue;
    }
    // min-h-[50px]
    const minH = cls.match(/^min-h-\[([^\]]+)\]$/);
    if (minH) {
      inline.minHeight = minH[1];
      continue;
    }

    // --- 5. ESPACIADO ARBITRARIO ---
    // p-[20px]
    const p = cls.match(/^p-\[([^\]]+)\]$/);
    if (p) {
      inline.padding = p[1];
      continue;
    }
    // px-[20px]
    const px = cls.match(/^px-\[([^\]]+)\]$/);
    if (px) {
      inline.paddingLeft = px[1];
      inline.paddingRight = px[1];
      continue;
    }
    // py-[20px]
    const py = cls.match(/^py-\[([^\]]+)\]$/);
    if (py) {
      inline.paddingTop = py[1];
      inline.paddingBottom = py[1];
      continue;
    }
    // m-[20px]
    const m = cls.match(/^m-\[([^\]]+)\]$/);
    if (m) {
      inline.margin = m[1];
      continue;
    }
    // mx-[20px]
    const mx = cls.match(/^mx-\[([^\]]+)\]$/);
    if (mx) {
      inline.marginLeft = mx[1];
      inline.marginRight = mx[1];
      continue;
    }
    // my-[20px]
    const my = cls.match(/^my-\[([^\]]+)\]$/);
    if (my) {
      inline.marginTop = my[1];
      inline.marginBottom = my[1];
      continue;
    }
    // gap-[15px]
    const gap = cls.match(/^gap-\[([^\]]+)\]$/);
    if (gap) {
      inline.gap = gap[1];
      continue;
    }

    // --- 6. BORDES Y ESQUINAS ---
    // rounded-[15px]
    const rounded = cls.match(/^rounded-\[([^\]]+)\]$/);
    if (rounded) {
      inline.borderRadius = rounded[1];
      continue;
    }

    // --- 7. EFECTOS Y FILTROS ---
    // opacity-[80%]
    const opacity = cls.match(/^opacity-\[([^\]]+)\]$/);
    if (opacity) {
      inline.opacity = opacity[1].includes('%')
        ? parseFloat(opacity[1]) / 100
        : parseFloat(opacity[1]);
      continue;
    }
    // blur-[4px]
    const blur = cls.match(/^blur-\[([^\]]+)\]$/);
    if (blur) {
      inline.filter = `blur(${blur[1]})`;
      continue;
    }
    // backdrop-blur-[10px]
    const backdropBlur = cls.match(/^backdrop-blur-\[([^\]]+)\]$/);
    if (backdropBlur) {
      inline.backdropFilter = `blur(${backdropBlur[1]})`;
      continue;
    }
    // shadow-[...]
    const shadow = cls.match(/^shadow-\[([^\]]+)\]$/);
    if (shadow) {
      inline.boxShadow = shadow[1].replace(/_/g, ' ');
      continue;
    }
    // z-[999]
    const zIndex = cls.match(/^z-\[([^\]]+)\]$/);
    if (zIndex) {
      inline.zIndex = Number(zIndex[1]) || zIndex[1];
      continue;
    }
    // rotate-[35deg]
    const rotate = cls.match(/^-?rotate-\[([^\]]+)\]$/);
    if (rotate) {
      const isNeg = cls.startsWith('-');
      inline.transform = `rotate(${isNeg ? '-' : ''}${rotate[1]})`;
      continue;
    }
    // scale-[1.08]
    const scale = cls.match(/^scale-\[([^\]]+)\]$/);
    if (scale) {
      inline.transform = `scale(${scale[1]})`;
      continue;
    }
  }

  return inline;
}
