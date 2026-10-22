import { StyleCategoryMap } from '../types/editor';

/**
 * Combina y limpia las clases de todas las categorías de Tailwind
 */
export function compileNodeClasses(styles?: StyleCategoryMap): string {
  if (!styles) return '';

  const categories: (keyof StyleCategoryMap)[] = [
    'layout',
    'sizing',
    'spacing',
    'typography',
    'background',
    'borders',
    'effects',
    'interactive',
    'custom',
  ];

  const classList: string[] = [];

  for (const cat of categories) {
    const val = styles[cat];
    if (val && typeof val === 'string') {
      const parts = val.trim().split(/\s+/).filter(Boolean);
      for (const p of parts) {
        if (!classList.includes(p)) {
          classList.push(p);
        }
      }
    }
  }

  return classList.join(' ');
}

/**
 * Normaliza y elimina duplicados de una cadena de clases
 */
export function cleanClassString(classStr: string): string {
  return Array.from(new Set(classStr.trim().split(/\s+/).filter(Boolean))).join(' ');
}
