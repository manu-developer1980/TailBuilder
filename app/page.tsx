'use client';

import React, { useEffect, useState } from 'react';
import { EditorHeader } from '@/components/editor/EditorHeader';
import { ElementPalette } from '@/components/editor/ElementPalette';
import { LayerTree } from '@/components/editor/LayerTree';
import { Canvas } from '@/components/editor/Canvas';
import { PropertyInspector } from '@/components/editor/PropertyInspector';
import { CodeExportModal } from '@/components/editor/CodeExportModal';
import { useEditorStore } from '@/lib/store/useEditorStore';
import { Layers, PlusCircle, LayoutGrid } from 'lucide-react';

export default function EditorPage() {
  const [leftSidebarTab, setLeftSidebarTab] = useState<'layers' | 'elements'>('elements');
  const { undo, redo, deleteNode, selectedNodeId, rootNode, setSelectedNodeId } = useEditorStore();

  // Atajos de teclado ergonómicos para profesionales (Undo, Redo, Delete, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en un input o textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      // Undo: Ctrl/Cmd + Z
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl/Cmd + Y o Ctrl/Cmd + Shift + Z
      if (
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') ||
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // Deseleccionar: Escape
      if (e.key === 'Escape') {
        setSelectedNodeId(null);
        return;
      }

      // Eliminar: Delete o Backspace (siempre que no sea la raíz absoluta)
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        e.preventDefault();
        deleteNode(selectedNodeId);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteNode, selectedNodeId, setSelectedNodeId]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Barra de Navegación Superior */}
      <EditorHeader />

      {/* Espacio de Trabajo Principal (3 Paneles) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel Izquierdo: Elementos y Capas */}
        <aside className="w-80 flex flex-col border-r border-slate-800 bg-slate-900 z-10 flex-shrink-0">
          {/* Selector de Pestaña Izquierda */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950/70 p-1.5 text-xs">
            <button
              type="button"
              onClick={() => setLeftSidebarTab('elements')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-medium transition-all ${
                leftSidebarTab === 'elements'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Añadir Elemento</span>
            </button>
            <button
              type="button"
              onClick={() => setLeftSidebarTab('layers')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-medium transition-all ${
                leftSidebarTab === 'layers'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Árbol de Capas</span>
            </button>
          </div>

          {/* Contenido de la pestaña activa */}
          <div className="flex-1 overflow-hidden">
            {leftSidebarTab === 'elements' ? <ElementPalette /> : <LayerTree />}
          </div>
        </aside>

        {/* Panel Central: Lienzo de Previsualización Interactivo */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <Canvas />
        </main>

        {/* Panel Derecho: Inspector de Propiedades Tailwind */}
        <aside className="w-[390px] max-w-[390px] flex flex-col border-l border-slate-800 bg-slate-900 z-10 flex-shrink-0 overflow-hidden">
          <PropertyInspector />
        </aside>
      </div>

      {/* Modal de Exportación Multiformato */}
      <CodeExportModal />
    </div>
  );
}
