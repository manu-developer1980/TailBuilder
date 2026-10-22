'use client';

import React from 'react';
import { useEditorStore, findNodeById, findParentNode } from '@/lib/store/useEditorStore';
import { CanvasNodeRenderer } from './CanvasNodeRenderer';
import { ComponentNode } from '@/lib/types/editor';
import {
  Monitor,
  Tablet,
  Smartphone,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export function Canvas() {
  const {
    rootNode,
    selectedNodeId,
    setSelectedNodeId,
    viewportDevice,
    zoomLevel,
    previewMode,
  } = useEditorStore();

  // Calcular ruta de migas de pan (Breadcrumb) hasta el nodo seleccionado
  const buildBreadcrumbs = (): ComponentNode[] => {
    if (!selectedNodeId) return [rootNode];
    const path: ComponentNode[] = [];
    let currentId: string | null = selectedNodeId;

    while (currentId) {
      const node = findNodeById(rootNode, currentId);
      if (node) {
        path.unshift(node);
        const parentInfo = findParentNode(rootNode, currentId);
        currentId = parentInfo?.parent ? parentInfo.parent.id : null;
      } else {
        break;
      }
    }
    return path.length > 0 ? path : [rootNode];
  };

  const breadcrumbs = buildBreadcrumbs();

  // Dimensiones del contenedor según dispositivo seleccionado
  const viewportWidthClass = {
    desktop: 'w-full max-w-5xl',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  }[viewportDevice];

  return (
    <div
      className="flex-1 flex flex-col h-full bg-slate-950/95 overflow-hidden relative"
      onClick={() => {
        // Clic en el fondo del lienzo deselecciona
        if (!previewMode) setSelectedNodeId(null);
      }}
    >
      {/* Barra de Migas de Pan (Breadcrumbs) para navegación jerárquica */}
      {!previewMode && (
        <div
          className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md z-10 text-xs text-slate-400 select-none overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-slate-500 font-medium">Jerarquía:</span>
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.id}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />}
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(crumb.id)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                    isLast
                      ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="font-mono text-[10px] text-slate-400">&lt;{crumb.tag}&gt;</span>
                  <span>{crumb.name}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Área Principal del Lienzo con cuadrícula de fondo */}
      <div className="flex-1 overflow-auto p-8 flex items-start justify-center relative bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]">
        {/* Contenedor del dispositivo / simulación */}
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out, width 0.3s ease-in-out',
          }}
          className={`flex flex-col transition-all duration-300 ${viewportWidthClass} ${
            viewportDevice !== 'desktop'
              ? 'rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden bg-slate-900'
              : ''
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Barra superior de dispositivo en móvil o tablet */}
          {viewportDevice !== 'desktop' && (
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 text-xs">
              <span className="font-mono text-[11px]">
                {viewportDevice === 'mobile' ? 'Mobile (375px)' : 'Tablet (768px)'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-700" />
                <span className="w-2 h-2 rounded-full bg-slate-700" />
                <span className="w-2 h-2 rounded-full bg-slate-700" />
              </div>
            </div>
          )}

          {/* Renderizado de la raíz del componente */}
          <div className="p-4 sm:p-6 w-full flex justify-center">
            <CanvasNodeRenderer node={rootNode} />
          </div>
        </div>
      </div>
    </div>
  );
}
