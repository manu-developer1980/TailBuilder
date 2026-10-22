import { create } from 'zustand';
import { ComponentNode, StyleCategory, ViewportDevice } from '../types/editor';
import { DEFAULT_FORM_PRESET } from '../templates/defaultPresets';

// Generador de IDs únicos simple y libre de dependencias
export function generateUniqueId(prefix: string = 'node'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

export function findNodeById(node: ComponentNode, id: string): ComponentNode | null {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export function findParentNode(
  node: ComponentNode,
  id: string,
  parent: ComponentNode | null = null
): { parent: ComponentNode | null; index: number } | null {
  if (node.id === id) {
    return { parent, index: parent ? parent.children.findIndex((c) => c.id === id) : -1 };
  }
  for (let i = 0; i < node.children.length; i++) {
    const res = findParentNode(node.children[i], id, node);
    if (res) return res;
  }
  return null;
}

export function updateNodeRecursive(
  node: ComponentNode,
  id: string,
  updater: (target: ComponentNode) => ComponentNode
): ComponentNode {
  if (node.id === id) {
    return updater(node);
  }
  return {
    ...node,
    children: node.children.map((child) => updateNodeRecursive(child, id, updater)),
  };
}

export function deleteNodeRecursive(node: ComponentNode, id: string): ComponentNode | null {
  if (node.id === id) {
    return null;
  }
  return {
    ...node,
    children: node.children
      .map((child) => deleteNodeRecursive(child, id))
      .filter((child): child is ComponentNode => child !== null),
  };
}

export function cloneNodeWithNewIds(node: ComponentNode): ComponentNode {
  return {
    ...node,
    id: generateUniqueId(node.tag),
    name: `${node.name} (Copia)`,
    children: node.children.map(cloneNodeWithNewIds),
  };
}

interface EditorState {
  rootNode: ComponentNode;
  selectedNodeId: string | null;
  viewportDevice: ViewportDevice;
  zoomLevel: number;
  showOutlines: boolean;
  previewMode: boolean; // Si es true, el canvas actúa como componente real sin selección
  isExportModalOpen: boolean;

  // Historial de Undo / Redo
  past: ComponentNode[];
  future: ComponentNode[];

  // Acciones
  setSelectedNodeId: (id: string | null) => void;
  setViewportDevice: (device: ViewportDevice) => void;
  setZoomLevel: (zoom: number) => void;
  setShowOutlines: (show: boolean) => void;
  setPreviewMode: (preview: boolean) => void;
  setIsExportModalOpen: (open: boolean) => void;

  updateNodeStyles: (id: string, category: StyleCategory, value: string) => void;
  updateNodeAttributes: (id: string, attributes: Record<string, string | boolean>) => void;
  updateNodeAttribute: (id: string, key: string, value: string | boolean) => void;
  removeNodeAttribute: (id: string, key: string) => void;
  updateNodeText: (id: string, text: string) => void;
  updateNodeName: (id: string, name: string) => void;

  addChildNode: (parentId: string, child: ComponentNode) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  moveNode: (id: string, direction: 'up' | 'down') => void;

  loadPreset: (preset: ComponentNode) => void;
  resetCanvas: () => void;
  undo: () => void;
  redo: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  rootNode: DEFAULT_FORM_PRESET,
  selectedNodeId: DEFAULT_FORM_PRESET.id,
  viewportDevice: 'desktop',
  zoomLevel: 100,
  showOutlines: true,
  previewMode: false,
  isExportModalOpen: false,

  past: [],
  future: [],

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setViewportDevice: (device) => set({ viewportDevice: device }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setShowOutlines: (show) => set({ showOutlines: show }),
  setPreviewMode: (preview) => set({ previewMode: preview, selectedNodeId: preview ? null : get().selectedNodeId }),
  setIsExportModalOpen: (open) => set({ isExportModalOpen: open }),

  updateNodeStyles: (id, category, value) => {
    const { rootNode, past } = get();
    const newRoot = updateNodeRecursive(rootNode, id, (node) => ({
      ...node,
      styles: {
        ...node.styles,
        [category]: value,
      },
    }));
    set({
      past: [...past.slice(-20), rootNode],
      future: [],
      rootNode: newRoot,
    });
  },

  updateNodeAttributes: (id, attributes) => {
    const { rootNode, past } = get();
    const newRoot = updateNodeRecursive(rootNode, id, (node) => ({
      ...node,
      attributes: { ...attributes },
    }));
    set({
      past: [...past.slice(-20), rootNode],
      future: [],
      rootNode: newRoot,
    });
  },

  updateNodeAttribute: (id, key, value) => {
    const { rootNode, past } = get();
    const newRoot = updateNodeRecursive(rootNode, id, (node) => ({
      ...node,
      attributes: {
        ...node.attributes,
        [key]: value,
      },
    }));
    set({
      past: [...past.slice(-20), rootNode],
      future: [],
      rootNode: newRoot,
    });
  },

  removeNodeAttribute: (id, key) => {
    const { rootNode, past } = get();
    const newRoot = updateNodeRecursive(rootNode, id, (node) => {
      const nextAttrs = { ...node.attributes };
      delete nextAttrs[key];
      return {
        ...node,
        attributes: nextAttrs,
      };
    });
    set({
      past: [...past.slice(-20), rootNode],
      future: [],
      rootNode: newRoot,
    });
  },

  updateNodeText: (id, text) => {
    const { rootNode, past } = get();
    const newRoot = updateNodeRecursive(rootNode, id, (node) => ({
      ...node,
      textContent: text,
    }));
    set({
      past: [...past.slice(-20), rootNode],
      future: [],
      rootNode: newRoot,
    });
  },

  updateNodeName: (id, name) => {
    const { rootNode } = get();
    const newRoot = updateNodeRecursive(rootNode, id, (node) => ({
      ...node,
      name,
    }));
    set({ rootNode: newRoot });
  },

  addChildNode: (parentId, child) => {
    const { rootNode, past } = get();
    const newRoot = updateNodeRecursive(rootNode, parentId, (node) => ({
      ...node,
      children: [...node.children, child],
    }));
    set({
      past: [...past.slice(-20), rootNode],
      future: [],
      rootNode: newRoot,
      selectedNodeId: child.id,
    });
  },

  deleteNode: (id) => {
    const { rootNode, past, selectedNodeId } = get();
    if (rootNode.id === id) {
      // Si se borra la raíz, resetear a un div contenedor vacío
      const emptyRoot: ComponentNode = {
        id: generateUniqueId('root'),
        tag: 'div',
        name: 'Contenedor Principal',
        styles: {
          layout: 'flex flex-col',
          sizing: 'w-full max-w-2xl min-h-[200px]',
          spacing: 'p-6 mx-auto',
          background: 'bg-white',
          borders: 'border border-dashed border-slate-300 rounded-xl',
        },
        attributes: {},
        children: [],
      };
      set({
        past: [...past.slice(-20), rootNode],
        future: [],
        rootNode: emptyRoot,
        selectedNodeId: emptyRoot.id,
      });
      return;
    }

    const newRoot = deleteNodeRecursive(rootNode, id);
    if (newRoot) {
      set({
        past: [...past.slice(-20), rootNode],
        future: [],
        rootNode: newRoot,
        selectedNodeId: selectedNodeId === id ? newRoot.id : selectedNodeId,
      });
    }
  },

  duplicateNode: (id) => {
    const { rootNode, past } = get();
    const parentInfo = findParentNode(rootNode, id);
    if (!parentInfo || !parentInfo.parent) return;

    const targetNode = findNodeById(rootNode, id);
    if (!targetNode) return;

    const cloned = cloneNodeWithNewIds(targetNode);
    const parentId = parentInfo.parent.id;

    const newRoot = updateNodeRecursive(rootNode, parentId, (parent) => {
      const idx = parent.children.findIndex((c) => c.id === id);
      const newChildren = [...parent.children];
      newChildren.splice(idx + 1, 0, cloned);
      return {
        ...parent,
        children: newChildren,
      };
    });

    set({
      past: [...past.slice(-20), rootNode],
      future: [],
      rootNode: newRoot,
      selectedNodeId: cloned.id,
    });
  },

  moveNode: (id, direction) => {
    const { rootNode, past } = get();
    const parentInfo = findParentNode(rootNode, id);
    if (!parentInfo || !parentInfo.parent) return;

    const parentId = parentInfo.parent.id;
    const newRoot = updateNodeRecursive(rootNode, parentId, (parent) => {
      const idx = parent.children.findIndex((c) => c.id === id);
      if (idx === -1) return parent;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= parent.children.length) return parent;

      const newChildren = [...parent.children];
      const temp = newChildren[idx];
      newChildren[idx] = newChildren[targetIdx];
      newChildren[targetIdx] = temp;

      return {
        ...parent,
        children: newChildren,
      };
    });

    set({
      past: [...past.slice(-20), rootNode],
      future: [],
      rootNode: newRoot,
    });
  },

  loadPreset: (preset) => {
    const { rootNode, past } = get();
    set({
      past: [...past.slice(-20), rootNode],
      future: [],
      rootNode: JSON.parse(JSON.stringify(preset)),
      selectedNodeId: preset.id,
    });
  },

  resetCanvas: () => {
    const { rootNode, past } = get();
    const emptyRoot: ComponentNode = {
      id: generateUniqueId('root'),
      tag: 'div',
      name: 'Lienzo Limpio',
      styles: {
        layout: 'flex flex-col items-center justify-center',
        sizing: 'w-full max-w-xl min-h-[250px]',
        spacing: 'p-8 mx-auto',
        background: 'bg-white',
        borders: 'border-2 border-dashed border-slate-300 rounded-2xl',
        effects: 'shadow-sm',
      },
      attributes: {},
      textContent: 'Contenedor vacío. Añade elementos desde la paleta izquierda.',
      children: [],
    };
    set({
      past: [...past.slice(-20), rootNode],
      future: [],
      rootNode: emptyRoot,
      selectedNodeId: emptyRoot.id,
    });
  },

  undo: () => {
    const { past, rootNode, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    set({
      past: newPast,
      future: [rootNode, ...future],
      rootNode: previous,
      selectedNodeId: previous.id,
    });
  },

  redo: () => {
    const { past, rootNode, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    set({
      past: [...past, rootNode],
      future: newFuture,
      rootNode: next,
      selectedNodeId: next.id,
    });
  },
}));
