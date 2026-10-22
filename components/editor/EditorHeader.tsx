'use client';

import React from 'react';
import { useEditorStore } from '@/lib/store/useEditorStore';
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  RotateCcw,
  Code,
  Eye,
  Edit3,
  SlidersHorizontal,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

export function EditorHeader() {
  const {
    viewportDevice,
    setViewportDevice,
    zoomLevel,
    setZoomLevel,
    showOutlines,
    setShowOutlines,
    previewMode,
    setPreviewMode,
    setIsExportModalOpen,
    resetCanvas,
    undo,
    redo,
    past,
    future,
    rootNode,
  } = useEditorStore();

  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-200 select-none z-20">
      {/* Lado Izquierdo: Marca & Nombre */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white">
                Tailwind Builder
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
                v1.0 Pro
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Generador visual de componentes React + Tailwind
            </p>
          </div>
        </div>
      </div>

      {/* Centro: Selector de Dispositivo & Modos */}
      <div className="flex items-center gap-4">
        {/* Dispositivos */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setViewportDevice('desktop')}
            title="Vista Escritorio (Desktop)"
            className={`p-1.5 rounded-md transition-colors ${
              viewportDevice === 'desktop'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewportDevice('tablet')}
            title="Vista Tablet (768px)"
            className={`p-1.5 rounded-md transition-colors ${
              viewportDevice === 'tablet'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewportDevice('mobile')}
            title="Vista Móvil (375px)"
            className={`p-1.5 rounded-md transition-colors ${
              viewportDevice === 'mobile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-950/80 border border-slate-800 rounded-lg p-0.5 px-2">
          <button
            type="button"
            disabled={zoomLevel <= 50}
            onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
            className="hover:text-white disabled:opacity-30 p-1"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="font-mono text-[11px] w-8 text-center text-slate-300">
            {zoomLevel}%
          </span>
          <button
            type="button"
            disabled={zoomLevel >= 150}
            onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
            className="hover:text-white disabled:opacity-30 p-1"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>

        {/* Modo Edición vs Vista Previa */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setPreviewMode(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              !previewMode
                ? 'bg-slate-800 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3 h-3 text-blue-400" />
            <span>Editar</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              previewMode
                ? 'bg-emerald-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Probar</span>
          </button>
        </div>
      </div>

      {/* Lado Derecho: Deshacer, Reiniciar, Exportar */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 border-r border-slate-800 pr-2">
          <button
            type="button"
            disabled={past.length === 0}
            onClick={undo}
            title="Deshacer (Undo)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={future.length === 0}
            onClick={redo}
            title="Rehacer (Redo)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetCanvas}
            title="Reiniciar a lienzo vacío"
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors ml-1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Botón Principal Exportar Código */}
        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Code className="w-4 h-4" />
          <span>Exportar Código</span>
        </button>
      </div>
    </header>
  );
}
