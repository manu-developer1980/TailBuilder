'use client';

import React, { useState } from 'react';
import { useEditorStore, generateUniqueId, findNodeById } from '@/lib/store/useEditorStore';
import { ComponentNode, HtmlTag } from '@/lib/types/editor';
import { PRESET_TEMPLATES } from '@/lib/templates/defaultPresets';
import {
  Layout,
  Type,
  Square,
  FormInput,
  Image as ImageIcon,
  List,
  Table as TableIcon,
  Sparkles,
  Plus,
  Layers,
  FileCode,
  Sliders,
} from 'lucide-react';

interface ElementDef {
  tag: HtmlTag;
  name: string;
  category: 'layout' | 'typography' | 'form' | 'list' | 'table' | 'media';
  defaultStyles: {
    layout?: string;
    sizing?: string;
    spacing?: string;
    typography?: string;
    background?: string;
    borders?: string;
    effects?: string;
    interactive?: string;
    custom?: string;
  };
  defaultAttrs: Record<string, string | boolean>;
  defaultText?: string;
}

const ELEMENT_CATALOG: ElementDef[] = [
  // --- LAYOUT & CONTENEDORES ---
  {
    tag: 'div',
    name: 'Contenedor Div',
    category: 'layout',
    defaultStyles: {
      layout: 'flex flex-col',
      spacing: 'p-4',
      borders: 'border border-dashed border-slate-300 dark:border-slate-700 rounded-lg',
    },
    defaultAttrs: {},
  },
  {
    tag: 'section',
    name: 'Sección Semántica',
    category: 'layout',
    defaultStyles: {
      layout: 'flex flex-col',
      sizing: 'w-full',
      spacing: 'py-8 px-4',
    },
    defaultAttrs: {},
  },
  {
    tag: 'main',
    name: 'Contenido Principal (Main)',
    category: 'layout',
    defaultStyles: {
      layout: 'flex flex-col',
      sizing: 'w-full max-w-7xl',
      spacing: 'p-6 mx-auto',
    },
    defaultAttrs: {},
  },
  {
    tag: 'article',
    name: 'Artículo Independiente',
    category: 'layout',
    defaultStyles: {
      layout: 'flex flex-col',
      spacing: 'p-6',
      background: 'bg-white dark:bg-slate-900',
      borders: 'border border-slate-200 dark:border-slate-800 rounded-xl',
      effects: 'shadow-sm',
    },
    defaultAttrs: {},
  },
  {
    tag: 'aside',
    name: 'Barra Lateral (Aside)',
    category: 'layout',
    defaultStyles: {
      layout: 'flex flex-col',
      sizing: 'w-64',
      spacing: 'p-4',
      background: 'bg-slate-50 dark:bg-slate-900/60',
      borders: 'border-r border-slate-200 dark:border-slate-800',
    },
    defaultAttrs: {},
  },
  {
    tag: 'header',
    name: 'Cabecera (Header)',
    category: 'layout',
    defaultStyles: {
      layout: 'flex items-center justify-between',
      sizing: 'w-full',
      spacing: 'px-6 py-4',
      background: 'bg-white dark:bg-slate-950',
      borders: 'border-b border-slate-200 dark:border-slate-800',
    },
    defaultAttrs: {},
  },
  {
    tag: 'nav',
    name: 'Barra de Navegación',
    category: 'layout',
    defaultStyles: {
      layout: 'flex items-center gap-6',
    },
    defaultAttrs: {},
  },
  {
    tag: 'footer',
    name: 'Pie de Página (Footer)',
    category: 'layout',
    defaultStyles: {
      layout: 'flex flex-col items-center justify-center',
      sizing: 'w-full',
      spacing: 'py-8 px-4 mt-8',
      borders: 'border-t border-slate-200 dark:border-slate-800',
      typography: 'text-sm text-slate-500',
    },
    defaultAttrs: {},
  },
  {
    tag: 'figure',
    name: 'Figura con Pie (Figure)',
    category: 'layout',
    defaultStyles: {
      layout: 'flex flex-col items-center',
      spacing: 'p-2',
    },
    defaultAttrs: {},
  },
  {
    tag: 'figcaption',
    name: 'Pie de Figura (Figcaption)',
    category: 'layout',
    defaultStyles: {
      typography: 'text-xs text-slate-400',
      spacing: 'mt-1 text-center',
    },
    defaultAttrs: {},
    defaultText: 'Descripción de la figura',
  },
  {
    tag: 'details',
    name: 'Acordeón Desplegable (Details)',
    category: 'layout',
    defaultStyles: {
      borders: 'border border-slate-200 dark:border-slate-800 rounded-lg',
      spacing: 'p-3',
      background: 'bg-slate-50 dark:bg-slate-900',
    },
    defaultAttrs: {},
  },
  {
    tag: 'summary',
    name: 'Cabecera de Acordeón (Summary)',
    category: 'layout',
    defaultStyles: {
      typography: 'font-semibold text-sm text-slate-800 dark:text-slate-200',
      interactive: 'cursor-pointer select-none',
    },
    defaultAttrs: {},
    defaultText: 'Haz clic para desplegar más detalles',
  },
  {
    tag: 'dialog',
    name: 'Cuadro de Diálogo (Dialog/Modal)',
    category: 'layout',
    defaultStyles: {
      sizing: 'max-w-md w-full',
      spacing: 'p-6 mx-auto',
      background: 'bg-white dark:bg-slate-900',
      borders: 'rounded-2xl border border-slate-200 dark:border-slate-800',
      effects: 'shadow-2xl backdrop:bg-black/50',
    },
    defaultAttrs: { open: true },
  },

  // --- TIPOGRAFÍA Y TEXTO ---
  {
    tag: 'h1',
    name: 'Encabezado H1',
    category: 'typography',
    defaultStyles: {
      typography: 'text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight',
      spacing: 'mb-2',
    },
    defaultAttrs: {},
    defaultText: 'Título Principal H1',
  },
  {
    tag: 'h2',
    name: 'Encabezado H2',
    category: 'typography',
    defaultStyles: {
      typography: 'text-2xl font-bold text-slate-800 dark:text-slate-100',
      spacing: 'mb-2',
    },
    defaultAttrs: {},
    defaultText: 'Encabezado Secundario H2',
  },
  {
    tag: 'h3',
    name: 'Encabezado H3',
    category: 'typography',
    defaultStyles: {
      typography: 'text-xl font-semibold text-slate-800 dark:text-slate-200',
      spacing: 'mb-1',
    },
    defaultAttrs: {},
    defaultText: 'Subtítulo H3',
  },
  {
    tag: 'h4',
    name: 'Encabezado H4',
    category: 'typography',
    defaultStyles: {
      typography: 'text-lg font-semibold text-slate-800 dark:text-slate-200',
    },
    defaultAttrs: {},
    defaultText: 'Subtítulo Menor H4',
  },
  {
    tag: 'p',
    name: 'Párrafo de Texto',
    category: 'typography',
    defaultStyles: {
      typography: 'text-base font-normal text-slate-600 dark:text-slate-400 leading-relaxed',
    },
    defaultAttrs: {},
    defaultText: 'Escribe aquí el texto explicativo de tu componente...',
  },
  {
    tag: 'span',
    name: 'Insignia (Badge / Span)',
    category: 'typography',
    defaultStyles: {
      typography: 'text-xs font-semibold text-blue-700 dark:text-blue-300',
      background: 'bg-blue-50 dark:bg-blue-900/40',
      spacing: 'px-2.5 py-0.5 inline-block',
      borders: 'rounded-full border border-blue-200 dark:border-blue-800',
    },
    defaultAttrs: {},
    defaultText: 'Badge Activo',
  },
  {
    tag: 'strong',
    name: 'Texto Destacado (Strong)',
    category: 'typography',
    defaultStyles: {
      typography: 'font-bold text-slate-900 dark:text-white',
    },
    defaultAttrs: {},
    defaultText: 'Texto en negrita destacado',
  },
  {
    tag: 'em',
    name: 'Texto Cursiva (Em)',
    category: 'typography',
    defaultStyles: {
      typography: 'italic text-slate-600 dark:text-slate-300',
    },
    defaultAttrs: {},
    defaultText: 'Texto con énfasis en cursiva',
  },
  {
    tag: 'blockquote',
    name: 'Cita en Bloque (Blockquote)',
    category: 'typography',
    defaultStyles: {
      typography: 'italic text-slate-700 dark:text-slate-300',
      borders: 'border-l-4 border-blue-500',
      spacing: 'pl-4 py-1 my-2',
    },
    defaultAttrs: {},
    defaultText: '"El diseño no es solo cómo se ve, sino cómo funciona."',
  },
  {
    tag: 'code',
    name: 'Código en Línea (Code)',
    category: 'typography',
    defaultStyles: {
      typography: 'font-mono text-xs text-blue-400',
      background: 'bg-slate-800',
      spacing: 'px-1.5 py-0.5 rounded',
      borders: 'border border-slate-700',
    },
    defaultAttrs: {},
    defaultText: 'npm install tailwindcss',
  },
  {
    tag: 'pre',
    name: 'Bloque Preformateado (Pre)',
    category: 'typography',
    defaultStyles: {
      typography: 'font-mono text-xs text-slate-200',
      background: 'bg-slate-950',
      borders: 'border border-slate-800 rounded-lg',
      spacing: 'p-4 overflow-x-auto',
    },
    defaultAttrs: {},
    defaultText: 'const greeting = "Hello Tailwind";',
  },
  {
    tag: 'mark',
    name: 'Texto Resaltado (Mark)',
    category: 'typography',
    defaultStyles: {
      background: 'bg-amber-200 dark:bg-amber-900/60',
      typography: 'text-amber-900 dark:text-amber-100',
      spacing: 'px-1 rounded',
    },
    defaultAttrs: {},
    defaultText: 'texto resaltado',
  },
  {
    tag: 'small',
    name: 'Texto Pequeño (Small)',
    category: 'typography',
    defaultStyles: {
      typography: 'text-xs text-slate-400',
    },
    defaultAttrs: {},
    defaultText: 'Términos y condiciones legales aplicables.',
  },
  {
    tag: 'hr',
    name: 'Línea Separadora (HR)',
    category: 'typography',
    defaultStyles: {
      borders: 'border-t border-slate-200 dark:border-slate-800',
      spacing: 'my-6 w-full',
    },
    defaultAttrs: {},
  },

  // --- FORMULARIOS ---
  {
    tag: 'form',
    name: 'Formulario Completo',
    category: 'form',
    defaultStyles: {
      layout: 'flex flex-col',
      spacing: 'p-6 space-y-4',
      background: 'bg-white dark:bg-slate-900',
      borders: 'border border-slate-200 dark:border-slate-800 rounded-xl',
      effects: 'shadow-sm',
    },
    defaultAttrs: { method: 'POST', action: '#' },
  },
  {
    tag: 'fieldset',
    name: 'Agrupador de Campos (Fieldset)',
    category: 'form',
    defaultStyles: {
      layout: 'flex flex-col',
      spacing: 'p-4 space-y-3',
      borders: 'border border-slate-200 dark:border-slate-800 rounded-lg',
    },
    defaultAttrs: {},
  },
  {
    tag: 'legend',
    name: 'Leyenda de Grupo (Legend)',
    category: 'form',
    defaultStyles: {
      typography: 'text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider',
      spacing: 'px-2',
    },
    defaultAttrs: {},
    defaultText: 'Información de la Sección',
  },
  {
    tag: 'label',
    name: 'Etiqueta (Label)',
    category: 'form',
    defaultStyles: {
      typography: 'text-sm font-medium text-slate-700 dark:text-slate-300',
    },
    defaultAttrs: {},
    defaultText: 'Nombre del Campo',
  },
  {
    tag: 'input',
    name: 'Campo de Texto (Input)',
    category: 'form',
    defaultStyles: {
      sizing: 'w-full h-10',
      spacing: 'px-3 py-2',
      background: 'bg-white dark:bg-slate-900',
      borders: 'border border-slate-300 dark:border-slate-700 rounded-md',
      typography: 'text-sm text-slate-900 dark:text-slate-100',
      interactive: 'focus:outline-none focus:ring-2 focus:ring-blue-500',
    },
    defaultAttrs: { type: 'text', placeholder: 'Escribe algo...' },
  },
  {
    tag: 'textarea',
    name: 'Área de Texto (Textarea)',
    category: 'form',
    defaultStyles: {
      sizing: 'w-full',
      spacing: 'px-3 py-2',
      background: 'bg-white dark:bg-slate-900',
      borders: 'border border-slate-300 dark:border-slate-700 rounded-md',
      typography: 'text-sm text-slate-900 dark:text-slate-100',
      interactive: 'focus:outline-none focus:ring-2 focus:ring-blue-500',
    },
    defaultAttrs: { rows: '3', placeholder: 'Escribe tu mensaje...' },
  },
  {
    tag: 'select',
    name: 'Selector Desplegable (Select)',
    category: 'form',
    defaultStyles: {
      sizing: 'w-full h-10',
      spacing: 'px-3 py-2',
      background: 'bg-white dark:bg-slate-900',
      borders: 'border border-slate-300 dark:border-slate-700 rounded-md',
      typography: 'text-sm text-slate-900 dark:text-slate-100',
    },
    defaultAttrs: {},
  },
  {
    tag: 'button',
    name: 'Botón CTA (Button)',
    category: 'form',
    defaultStyles: {
      sizing: 'h-10',
      spacing: 'px-4 py-2',
      background: 'bg-blue-600',
      typography: 'text-sm font-semibold text-white',
      borders: 'rounded-lg border-0',
      effects: 'shadow-sm',
      interactive: 'hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500',
    },
    defaultAttrs: { type: 'button' },
    defaultText: 'Hacer Clic',
  },
  {
    tag: 'progress',
    name: 'Barra de Progreso (Progress)',
    category: 'form',
    defaultStyles: {
      sizing: 'w-full h-3',
      borders: 'rounded-full overflow-hidden',
      background: 'bg-slate-200 dark:bg-slate-700',
    },
    defaultAttrs: { value: '65', max: '100' },
  },

  // --- LISTAS ---
  {
    tag: 'ul',
    name: 'Lista No Ordenada (UL)',
    category: 'list',
    defaultStyles: {
      layout: 'flex flex-col',
      spacing: 'space-y-2 list-disc list-inside p-2',
    },
    defaultAttrs: {},
  },
  {
    tag: 'ol',
    name: 'Lista Ordenada (OL)',
    category: 'list',
    defaultStyles: {
      layout: 'flex flex-col',
      spacing: 'space-y-2 list-decimal list-inside p-2',
    },
    defaultAttrs: {},
  },
  {
    tag: 'li',
    name: 'Elemento de Lista (LI)',
    category: 'list',
    defaultStyles: {
      typography: 'text-sm text-slate-700 dark:text-slate-300',
    },
    defaultAttrs: {},
    defaultText: 'Elemento de lista',
  },
  {
    tag: 'dl',
    name: 'Lista de Definición (DL)',
    category: 'list',
    defaultStyles: {
      layout: 'flex flex-col',
      spacing: 'space-y-3',
    },
    defaultAttrs: {},
  },
  {
    tag: 'dt',
    name: 'Término de Definición (DT)',
    category: 'list',
    defaultStyles: {
      typography: 'font-semibold text-sm text-slate-900 dark:text-white',
    },
    defaultAttrs: {},
    defaultText: 'Término clave',
  },
  {
    tag: 'dd',
    name: 'Descripción de Término (DD)',
    category: 'list',
    defaultStyles: {
      typography: 'text-sm text-slate-500',
      spacing: 'ml-4',
    },
    defaultAttrs: {},
    defaultText: 'Explicación detallada del término...',
  },

  // --- TABLAS ---
  {
    tag: 'table',
    name: 'Tabla de Datos (Table)',
    category: 'table',
    defaultStyles: {
      sizing: 'w-full',
      typography: 'text-left text-sm',
      borders: 'border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden',
    },
    defaultAttrs: {},
  },
  {
    tag: 'thead',
    name: 'Cabecera de Tabla (Thead)',
    category: 'table',
    defaultStyles: {
      background: 'bg-slate-100 dark:bg-slate-800',
      typography: 'text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider',
    },
    defaultAttrs: {},
  },
  {
    tag: 'tbody',
    name: 'Cuerpo de Tabla (Tbody)',
    category: 'table',
    defaultStyles: {
      custom: 'divide-y divide-slate-200 dark:divide-slate-800',
    },
    defaultAttrs: {},
  },
  {
    tag: 'tr',
    name: 'Fila de Tabla (TR)',
    category: 'table',
    defaultStyles: {
      interactive: 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
    },
    defaultAttrs: {},
  },
  {
    tag: 'th',
    name: 'Celda de Encabezado (TH)',
    category: 'table',
    defaultStyles: {
      spacing: 'px-4 py-3',
      typography: 'font-semibold',
    },
    defaultAttrs: {},
    defaultText: 'Columna',
  },
  {
    tag: 'td',
    name: 'Celda de Datos (TD)',
    category: 'table',
    defaultStyles: {
      spacing: 'px-4 py-3',
      typography: 'text-slate-700 dark:text-slate-300',
    },
    defaultAttrs: {},
    defaultText: 'Dato de ejemplo',
  },

  // --- MEDIA Y ENLACES ---
  {
    tag: 'img',
    name: 'Imagen',
    category: 'media',
    defaultStyles: {
      sizing: 'w-full h-48',
      borders: 'rounded-xl',
      custom: 'object-cover',
    },
    defaultAttrs: {
      src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
      alt: 'Imagen de muestra',
    },
  },
  {
    tag: 'video',
    name: 'Vídeo HTML5',
    category: 'media',
    defaultStyles: {
      sizing: 'w-full h-56',
      borders: 'rounded-xl',
    },
    defaultAttrs: { controls: true },
  },
  {
    tag: 'audio',
    name: 'Reproductor de Audio',
    category: 'media',
    defaultStyles: {
      sizing: 'w-full',
    },
    defaultAttrs: { controls: true },
  },
  {
    tag: 'iframe',
    name: 'Marco Embebido (Iframe)',
    category: 'media',
    defaultStyles: {
      sizing: 'w-full h-64',
      borders: 'rounded-xl border border-slate-800',
    },
    defaultAttrs: { src: 'https://example.com' },
  },
  {
    tag: 'a',
    name: 'Enlace (Link / Anchor)',
    category: 'media',
    defaultStyles: {
      typography: 'text-sm font-medium text-blue-600 dark:text-blue-400',
      interactive: 'hover:underline',
    },
    defaultAttrs: { href: '#' },
    defaultText: 'Enlace a página →',
  },
];

export function ElementPalette() {
  const [activeTab, setActiveTab] = useState<'elements' | 'presets'>('elements');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { rootNode, selectedNodeId, addChildNode, loadPreset } = useEditorStore();

  const handleAddElement = (def: ElementDef) => {
    const targetParentId = selectedNodeId || rootNode.id;

    const newNode: ComponentNode = {
      id: generateUniqueId(def.tag),
      tag: def.tag,
      name: def.name,
      styles: { ...def.defaultStyles },
      attributes: { ...def.defaultAttrs },
      textContent: def.defaultText,
      children: [],
    };

    addChildNode(targetParentId, newNode);
  };

  const filteredElements =
    filterCategory === 'all'
      ? ELEMENT_CATALOG
      : ELEMENT_CATALOG.filter((el) => el.category === filterCategory);

  const selectedNode = selectedNodeId ? findNodeById(rootNode, selectedNodeId) : null;

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-200 select-none">
      {/* Pestañas superiores */}
      <div className="flex items-center p-2 border-b border-slate-800 bg-slate-950/50">
        <button
          type="button"
          onClick={() => setActiveTab('elements')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'elements'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Square className="w-3.5 h-3.5" />
          Elementos ({ELEMENT_CATALOG.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'presets'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Plantillas ({PRESET_TEMPLATES.length})
        </button>
      </div>

      {activeTab === 'elements' ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Destino de inserción */}
          <div className="px-3 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-blue-400" />
              Insertar dentro de:
            </span>
            <span className="font-mono text-blue-300 truncate max-w-[140px]">
              {selectedNode ? selectedNode.name : rootNode.name}
            </span>
          </div>

          {/* Filtros de categoría */}
          <div className="flex items-center gap-1 p-2 overflow-x-auto border-b border-slate-800 scrollbar-none text-[11px]">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'layout', label: 'Estructura' },
              { id: 'typography', label: 'Texto' },
              { id: 'form', label: 'Formularios' },
              { id: 'list', label: 'Listas' },
              { id: 'table', label: 'Tablas' },
              { id: 'media', label: 'Media' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                  filterCategory === cat.id
                    ? 'bg-slate-700 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Lista de Elementos */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            {filteredElements.map((elem) => (
              <button
                key={elem.tag + elem.name}
                type="button"
                onClick={() => handleAddElement(elem)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 hover:border-blue-500/50 border border-slate-800 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-md bg-slate-800 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {elem.category === 'layout' && <Layout className="w-3.5 h-3.5" />}
                    {elem.category === 'typography' && <Type className="w-3.5 h-3.5" />}
                    {elem.category === 'form' && <FormInput className="w-3.5 h-3.5" />}
                    {elem.category === 'list' && <List className="w-3.5 h-3.5" />}
                    {elem.category === 'table' && <TableIcon className="w-3.5 h-3.5" />}
                    {elem.category === 'media' && <ImageIcon className="w-3.5 h-3.5" />}
                  </span>
                  <div>
                    <div className="text-xs font-medium text-slate-200 group-hover:text-white">
                      {elem.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      &lt;{elem.tag}&gt;
                    </div>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-slate-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Plantillas Predefinidas */
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <p className="text-[11px] text-slate-400">
            Carga componentes listos para usar y edítalos visualmente:
          </p>
          {PRESET_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-blue-500/60 transition-all space-y-2 group"
            >
              <div>
                <h4 className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {tmpl.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {tmpl.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => loadPreset(tmpl.root)}
                className="w-full py-1.5 px-3 text-xs font-medium bg-slate-700 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-blue-300" />
                Cargar en Lienzo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
