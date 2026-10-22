export type HtmlTag =
  // Contenedores y Estructura Semántica
  | 'div'
  | 'section'
  | 'article'
  | 'main'
  | 'aside'
  | 'header'
  | 'footer'
  | 'nav'
  | 'figure'
  | 'figcaption'
  | 'details'
  | 'summary'
  | 'dialog'
  // Tipografía y Contenido de Texto
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'blockquote'
  | 'pre'
  | 'code'
  | 'small'
  | 'strong'
  | 'em'
  | 'mark'
  | 'hr'
  | 'br'
  // Formularios e Interacción
  | 'form'
  | 'fieldset'
  | 'legend'
  | 'label'
  | 'input'
  | 'textarea'
  | 'select'
  | 'option'
  | 'button'
  | 'progress'
  // Listas
  | 'ul'
  | 'ol'
  | 'li'
  | 'dl'
  | 'dt'
  | 'dd'
  // Tablas
  | 'table'
  | 'thead'
  | 'tbody'
  | 'tr'
  | 'th'
  | 'td'
  // Media y Enlaces
  | 'img'
  | 'video'
  | 'audio'
  | 'iframe'
  | 'a';

export interface StyleCategoryMap {
  layout?: string; // flex, grid, block, items-center, gap-4, position, z-index...
  spacing?: string; // p-4, px-2, py-3, m-2, mx-auto, arbitrary [..]...
  sizing?: string; // w-full, h-auto, max-w-md, min-h-[40px], arbitrary [..]...
  typography?: string; // text-sm, font-medium, text-slate-800, text-center, arbitrary [..]...
  background?: string; // bg-white, bg-blue-600, bg-[#hex], gradients...
  borders?: string; // border, border-slate-300, rounded-lg, arbitrary [..]...
  effects?: string; // shadow-sm, shadow-md, blur, backdrop-blur, opacity-90...
  interactive?: string; // hover:bg-blue-700, focus:ring-2, cursor-pointer, transitions, transforms...
  custom?: string; // clases manuales adicionales
}

export type StyleCategory = keyof StyleCategoryMap;

export interface ComponentNode {
  id: string; // Identificador único
  tag: HtmlTag; // Etiqueta HTML
  name: string; // Nombre visual descriptivo
  styles: StyleCategoryMap; // Clases agrupadas por categoría
  attributes: Record<string, string | boolean>; // type="email", placeholder="...", id="email"
  textContent?: string; // Texto interno si aplica (ej. "Enviar", "Título")
  children: ComponentNode[]; // Elementos hijos para jerarquías
}

export type ViewportDevice = 'desktop' | 'tablet' | 'mobile';

export type ExportFormat = 'jsx' | 'html' | 'tsx-component';

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  category: 'forms' | 'cards' | 'navigation' | 'hero' | 'ui';
  root: ComponentNode;
}
