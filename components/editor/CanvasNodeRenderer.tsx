'use client';

import React from 'react';
import { ComponentNode } from '@/lib/types/editor';
import { compileNodeClasses } from '@/lib/tailwind/classCompiler';
import { extractRuntimeStyles } from '@/lib/tailwind/runtimeStyles';
import { useEditorStore } from '@/lib/store/useEditorStore';

interface CanvasNodeRendererProps {
  node: ComponentNode;
}

export function CanvasNodeRenderer({ node }: CanvasNodeRendererProps) {
  const {
    selectedNodeId,
    setSelectedNodeId,
    previewMode,
    showOutlines,
  } = useEditorStore();

  const isSelected = selectedNodeId === node.id && !previewMode;
  const compiledClasses = compileNodeClasses(node.styles);
  const runtimeInlineStyles = extractRuntimeStyles(node.styles);

  // Mapeo seguro de atributos HTML para React
  const safeAttributes: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(node.attributes)) {
    if (k === 'for') {
      safeAttributes.htmlFor = v;
    } else if (k === 'class' || k === 'className') {
      // Ignoramos class en attributes porque ya viene compilado de styles
    } else {
      safeAttributes[k] = v;
    }
  }

  const combinedStyles: React.CSSProperties = {
    ...runtimeInlineStyles,
    ...(safeAttributes.style as React.CSSProperties),
  };

  // Prevenir envío de formularios o navegación accidental durante el modo edición
  const handleClick = (e: React.MouseEvent) => {
    if (!previewMode) {
      e.preventDefault();
      e.stopPropagation();
      setSelectedNodeId(node.id);
    }
  };

  // Clases del editor (borde de selección y guías)
  let editorIndicatorClass = '';
  if (!previewMode) {
    if (isSelected) {
      editorIndicatorClass = ' relative outline-2 outline-blue-500 outline-offset-1 ring-2 ring-blue-500/20';
    } else if (showOutlines) {
      editorIndicatorClass = ' hover:outline hover:outline-1 hover:outline-blue-400/60 hover:outline-offset-1';
    }
  }

  const finalClassName = `${compiledClasses}${editorIndicatorClass}`.trim();

  // Elementos auto-cerrados o que no admiten hijos en el DOM
  if (node.tag === 'input') {
    return (
      <div className="relative inline-block w-full" onClick={handleClick}>
        {isSelected && (
          <span className="absolute -top-5 left-0 z-30 inline-flex items-center gap-1 rounded bg-blue-600 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white shadow-sm pointer-events-none">
            &lt;input&gt; {node.name}
          </span>
        )}
        <input
          {...safeAttributes}
          style={combinedStyles}
          className={finalClassName}
          readOnly={!previewMode}
        />
      </div>
    );
  }

  if (node.tag === 'textarea') {
    return (
      <div className="relative inline-block w-full" onClick={handleClick}>
        {isSelected && (
          <span className="absolute -top-5 left-0 z-30 inline-flex items-center gap-1 rounded bg-blue-600 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white shadow-sm pointer-events-none">
            &lt;textarea&gt; {node.name}
          </span>
        )}
        <textarea
          {...safeAttributes}
          style={combinedStyles}
          value={node.textContent || ''}
          onChange={() => {}}
          className={finalClassName}
          readOnly={!previewMode}
        />
      </div>
    );
  }

  if (node.tag === 'img') {
    return (
      <div className="relative inline-block w-full" onClick={handleClick}>
        {isSelected && (
          <span className="absolute -top-5 left-0 z-30 inline-flex items-center gap-1 rounded bg-blue-600 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white shadow-sm pointer-events-none">
            &lt;img&gt; {node.name}
          </span>
        )}
        <img
          {...safeAttributes}
          style={combinedStyles}
          src={(safeAttributes.src as string) || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80'}
          alt={(safeAttributes.alt as string) || 'Vista previa'}
          className={finalClassName}
        />
      </div>
    );
  }

  if (node.tag === 'hr') {
    return (
      <div className="relative w-full py-1" onClick={handleClick}>
        {isSelected && (
          <span className="absolute -top-5 left-0 z-30 inline-flex items-center gap-1 rounded bg-blue-600 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white shadow-sm pointer-events-none">
            &lt;hr&gt; {node.name}
          </span>
        )}
        <hr {...safeAttributes} style={combinedStyles} className={finalClassName} />
      </div>
    );
  }

  if (node.tag === 'br') {
    return <br className={finalClassName} onClick={handleClick} />;
  }

  if (node.tag === 'progress') {
    return (
      <div className="relative w-full inline-block" onClick={handleClick}>
        {isSelected && (
          <span className="absolute -top-5 left-0 z-30 inline-flex items-center gap-1 rounded bg-blue-600 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white shadow-sm pointer-events-none">
            &lt;progress&gt; {node.name}
          </span>
        )}
        <progress
          {...safeAttributes}
          style={combinedStyles}
          value={typeof safeAttributes.value === 'string' ? Number(safeAttributes.value) || 50 : 50}
          max={typeof safeAttributes.max === 'string' ? Number(safeAttributes.max) || 100 : 100}
          className={finalClassName}
        />
      </div>
    );
  }

  const Tag = node.tag as React.ElementType;
  const hasChildren = node.children && node.children.length > 0;
  const hasText = node.textContent !== undefined && node.textContent !== null && node.textContent !== '';

  // Si es un contenedor vacío en modo edición, mostrar guía visual
  const isContainerTag = [
    'div', 'section', 'article', 'main', 'aside', 'header', 'footer', 'nav',
    'figure', 'details', 'dialog', 'form', 'fieldset', 'ul', 'ol', 'dl',
    'table', 'thead', 'tbody', 'tr',
  ].includes(node.tag);
  const showEmptyGuide = !previewMode && isContainerTag && !hasChildren && !hasText;

  return (
    <Tag
      {...safeAttributes}
      style={combinedStyles}
      className={finalClassName}
      onClick={handleClick}
    >
      {/* Etiqueta flotante del nodo seleccionado */}
      {isSelected && (
        <span
          className="absolute -top-5 left-0 z-30 inline-flex items-center gap-1 rounded bg-blue-600 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white shadow-sm pointer-events-none"
        >
          &lt;{node.tag}&gt; {node.name}
        </span>
      )}

      {/* Texto directo */}
      {hasText && node.textContent}

      {/* Guía para contenedores vacíos */}
      {showEmptyGuide && (
        <span className="block p-3 text-center text-xs text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded my-1">
          &lt;{node.tag}&gt; vacío. Añade elementos desde la paleta.
        </span>
      )}

      {/* Renderizado recursivo de hijos */}
      {hasChildren &&
        node.children.map((child) => (
          <CanvasNodeRenderer key={child.id} node={child} />
        ))}
    </Tag>
  );
}
