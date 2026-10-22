import { ComponentNode } from '../types/editor';
import { toJSX } from './toJSX';

export function toTSXComponent(node: ComponentNode, componentName: string = 'GeneratedComponent'): string {
  // Aseguramos formato PascalCase válido para el nombre del componente
  const cleanName = componentName
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') || 'GeneratedComponent';

  const innerJSX = toJSX(node, 2);

  return `import React from 'react';

export interface ${cleanName}Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Componente generado visualmente con Tailwind CSS
 */
export function ${cleanName}({ className = '', ...props }: ${cleanName}Props) {
  return (
${innerJSX}
  );
}

export default ${cleanName};
`;
}
