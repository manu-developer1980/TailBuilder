import { ComponentNode } from '../types/editor';
import { compileNodeClasses } from '../tailwind/classCompiler';

const SELF_CLOSING_TAGS = new Set(['input', 'img', 'br', 'hr', 'meta', 'link']);

function formatAttributesJSX(attributes: Record<string, string | boolean>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(attributes)) {
    if (value === true) {
      parts.push(key);
    } else if (value !== false && value !== undefined && value !== null && value !== '') {
      // Si el atributo es style o evento en React o standard
      parts.push(`${key}="${String(value).replace(/"/g, '&quot;')}"`);
    }
  }
  return parts.length > 0 ? ' ' + parts.join(' ') : '';
}

export function toJSX(node: ComponentNode, indentLevel: number = 0): string {
  const indent = '  '.repeat(indentLevel);
  const classes = compileNodeClasses(node.styles);
  const classAttr = classes ? ` className="${classes}"` : '';
  const attrs = formatAttributesJSX(node.attributes);
  const tag = node.tag;

  if (SELF_CLOSING_TAGS.has(tag)) {
    return `${indent}<${tag}${classAttr}${attrs} />`;
  }

  const hasChildren = node.children && node.children.length > 0;
  const hasText = node.textContent && node.textContent.trim().length > 0;

  if (!hasChildren && !hasText) {
    return `${indent}<${tag}${classAttr}${attrs}></${tag}>`;
  }

  if (!hasChildren && hasText) {
    return `${indent}<${tag}${classAttr}${attrs}>${node.textContent}</${tag}>`;
  }

  const childLines: string[] = [];
  if (hasText) {
    childLines.push(`${indent}  ${node.textContent}`);
  }
  for (const child of node.children) {
    childLines.push(toJSX(child, indentLevel + 1));
  }

  return `${indent}<${tag}${classAttr}${attrs}>\n${childLines.join('\n')}\n${indent}</${tag}>`;
}
