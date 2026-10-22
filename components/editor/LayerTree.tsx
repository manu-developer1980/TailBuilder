'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/lib/store/useEditorStore';
import { ComponentNode } from '@/lib/types/editor';
import {
  ChevronRight,
  ChevronDown,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Box,
  Eye,
} from 'lucide-react';

interface LayerItemProps {
  node: ComponentNode;
  depth: number;
  isFirst: boolean;
  isLast: boolean;
}

function LayerItem({ node, depth, isFirst, isLast }: LayerItemProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const {
    selectedNodeId,
    setSelectedNodeId,
    duplicateNode,
    deleteNode,
    moveNode,
    rootNode,
  } = useEditorStore();

  const isSelected = selectedNodeId === node.id;
  const isRoot = rootNode.id === node.id;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col">
      <div
        onClick={() => setSelectedNodeId(node.id)}
        className={`group flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer transition-colors text-xs ${
          isSelected
            ? 'bg-blue-600 text-white font-medium shadow-sm'
            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
        }`}
        style={{ paddingLeft: `${Math.max(8, depth * 16)}px` }}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-0.5 rounded hover:bg-slate-700/60 text-slate-400 group-hover:text-slate-200"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-3.5" />
          )}

          <Box className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-white' : 'text-blue-400'}`} />

          <span className="truncate">{node.name}</span>

          <span
            className={`font-mono text-[10px] px-1 rounded flex-shrink-0 ${
              isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {node.tag}
          </span>
        </div>

        {/* Acciones flotantes en hover */}
        <div
          className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
            isSelected ? 'opacity-100' : ''
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {!isRoot && (
            <>
              <button
                type="button"
                disabled={isFirst}
                onClick={() => moveNode(node.id, 'up')}
                title="Subir posición"
                className={`p-1 rounded hover:bg-slate-700 disabled:opacity-20 ${
                  isSelected ? 'hover:bg-blue-700 text-white' : 'text-slate-400'
                }`}
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                disabled={isLast}
                onClick={() => moveNode(node.id, 'down')}
                title="Bajar posición"
                className={`p-1 rounded hover:bg-slate-700 disabled:opacity-20 ${
                  isSelected ? 'hover:bg-blue-700 text-white' : 'text-slate-400'
                }`}
              >
                <ArrowDown className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => duplicateNode(node.id)}
                title="Duplicar elemento"
                className={`p-1 rounded hover:bg-slate-700 ${
                  isSelected ? 'hover:bg-blue-700 text-white' : 'text-slate-400'
                }`}
              >
                <Copy className="w-3 h-3" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => deleteNode(node.id)}
            title={isRoot ? 'Reiniciar lienzo' : 'Eliminar elemento'}
            className={`p-1 rounded hover:bg-red-500 hover:text-white ${
              isSelected ? 'hover:bg-red-600 text-white' : 'text-slate-400'
            }`}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Renderizar Hijos si está expandido */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col border-l border-slate-800/80 ml-3">
          {node.children.map((child, idx) => (
            <LayerItem
              key={child.id}
              node={child}
              depth={depth + 1}
              isFirst={idx === 0}
              isLast={idx === node.children.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function LayerTree() {
  const { rootNode } = useEditorStore();

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-200 select-none">
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Capas del Árbol
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Jerarquía
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        <LayerItem node={rootNode} depth={0} isFirst={true} isLast={true} />
      </div>
    </div>
  );
}
