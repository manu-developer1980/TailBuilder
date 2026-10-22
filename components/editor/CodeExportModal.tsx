'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/lib/store/useEditorStore';
import { ExportFormat } from '@/lib/types/editor';
import { toJSX } from '@/lib/exporters/toJSX';
import { toHTML } from '@/lib/exporters/toHTML';
import { toTSXComponent } from '@/lib/exporters/toTSXComponent';
import {
  X,
  Copy,
  Check,
  Download,
  Code,
  FileCode,
  FileText,
} from 'lucide-react';

export function CodeExportModal() {
  const { rootNode, isExportModalOpen, setIsExportModalOpen } = useEditorStore();
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('jsx');
  const [componentName, setComponentName] = useState<string>('MyComponent');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isExportModalOpen) return null;

  // Generar código según formato
  let generatedCode = '';
  let filename = 'Component';
  let mimeType = 'text/plain';

  if (activeFormat === 'jsx') {
    generatedCode = toJSX(rootNode);
    filename = `${componentName}.jsx`;
    mimeType = 'text/javascript';
  } else if (activeFormat === 'html') {
    generatedCode = toHTML(rootNode);
    filename = `${componentName}.html`;
    mimeType = 'text/html';
  } else if (activeFormat === 'tsx-component') {
    generatedCode = toTSXComponent(rootNode, componentName);
    filename = `${componentName}.tsx`;
    mimeType = 'text/typescript';
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex flex-col w-full max-w-4xl h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Exportar Código de Componente
              </h3>
              <p className="text-xs text-slate-400">
                Limpio, portable y sin dependencias propietarias
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas de Formatos & Opciones */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            {[
              { id: 'jsx' as ExportFormat, label: 'React JSX / TSX', icon: Code },
              { id: 'tsx-component' as ExportFormat, label: 'Componente TypeScript', icon: FileCode },
              { id: 'html' as ExportFormat, label: 'HTML Nativo', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFormat === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFormat(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeFormat === 'tsx-component' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Nombre:</span>
              <input
                type="text"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="py-1 px-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="NombreComponente"
              />
            </div>
          )}
        </div>

        {/* Visor de Código */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs leading-relaxed text-blue-200 select-text">
          <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 overflow-x-auto whitespace-pre">
            {generatedCode}
          </pre>
        </div>

        {/* Barra de Acciones Inferior */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <span className="text-xs text-slate-400">
            {activeFormat === 'jsx' && 'Pega este bloque directamente en tu archivo JSX/TSX.'}
            {activeFormat === 'tsx-component' && 'Componente React reutilizable con props y tipado estricto.'}
            {activeFormat === 'html' && 'HTML nativo con clases Tailwind para sitios estáticos o plantillas.'}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Descargar {filename}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-md ${
                copied
                  ? 'bg-emerald-600 shadow-emerald-500/20'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Código
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
