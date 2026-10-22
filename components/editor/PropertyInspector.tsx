'use client';

import React, { useState } from 'react';
import { useEditorStore, findNodeById } from '@/lib/store/useEditorStore';
import { ColorPickerControl } from './controls/ColorPickerControl';
import { SpacingControl } from './controls/SpacingControl';
import { PropertyControlWithCustom } from './controls/PropertyControlWithCustom';
import {
  DISPLAY_OPTIONS,
  POSITION_OPTIONS,
  Z_INDEX_OPTIONS,
  OVERFLOW_OPTIONS,
  FLEX_DIRECTION_OPTIONS,
  FLEX_WRAP_OPTIONS,
  ALIGN_ITEMS_OPTIONS,
  JUSTIFY_CONTENT_OPTIONS,
  GAP_OPTIONS,
  GRID_COLS_OPTIONS,
  WIDTH_OPTIONS,
  MAX_WIDTH_OPTIONS,
  HEIGHT_OPTIONS,
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  TEXT_ALIGN_OPTIONS,
  BORDER_WIDTH_OPTIONS,
  BORDER_RADIUS_OPTIONS,
  SHADOW_OPTIONS,
  BLUR_OPTIONS,
  BACKDROP_BLUR_OPTIONS,
  OPACITY_OPTIONS,
  CURSOR_OPTIONS,
  SCALE_OPTIONS,
  ROTATE_OPTIONS,
  TRANSITION_OPTIONS,
} from '@/lib/tailwind/dictionary';
import {
  Sliders,
  Type,
  Layout,
  Maximize2,
  Paintbrush,
  Sparkles,
  Code2,
  Trash2,
  Copy,
  Plus,
  Settings2,
  Move,
} from 'lucide-react';
import { StyleCategory } from '@/lib/types/editor';

export function PropertyInspector() {
  const {
    rootNode,
    selectedNodeId,
    updateNodeStyles,
    updateNodeName,
    updateNodeText,
    updateNodeAttribute,
    removeNodeAttribute,
    duplicateNode,
    deleteNode,
  } = useEditorStore();

  const [activeTab, setActiveTab] = useState<string>('layout');
  const [newAttrKey, setNewAttrKey] = useState<string>('');
  const [newAttrVal, setNewAttrVal] = useState<string>('');

  const node = selectedNodeId ? findNodeById(rootNode, selectedNodeId) : null;

  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-900 border-l border-slate-800 text-slate-400">
        <Sliders className="w-10 h-10 mb-3 text-slate-600" />
        <h4 className="text-sm font-semibold text-slate-200">Ningún Elemento Seleccionado</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          Haz clic en cualquier elemento del lienzo o en el árbol de capas para inspeccionar y ajustar todas sus propiedades de Tailwind CSS.
        </p>
      </div>
    );
  }

  const styles = node.styles || {};

  // Helper universal para actualizar clases con expresión regular
  const updatePropertyClass = (
    category: StyleCategory,
    regexMatch: RegExp,
    newClass: string
  ) => {
    const current = (styles[category] || '').split(/\s+/).filter(Boolean);
    const filtered = current.filter((c) => !regexMatch.test(c));
    if (newClass) filtered.push(newClass);
    updateNodeStyles(node.id, category, filtered.join(' '));
  };

  const getStyleMatch = (category: StyleCategory, regexMatch: RegExp): string => {
    const current = (styles[category] || '').split(/\s+/).filter(Boolean);
    return current.find((c) => regexMatch.test(c)) || '';
  };

  const handleAddAttribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttrKey.trim()) return;
    updateNodeAttribute(node.id, newAttrKey.trim(), newAttrVal.trim());
    setNewAttrKey('');
    setNewAttrVal('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-200 select-none overflow-hidden w-full max-w-full">
      {/* Cabecera del Inspector: Nombre y Etiqueta */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-600 text-white font-bold flex-shrink-0">
            &lt;{node.tag}&gt;
          </span>
          <input
            type="text"
            value={node.name}
            onChange={(e) => updateNodeName(node.id, e.target.value)}
            className="text-xs font-semibold bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1.5 py-0.5 truncate flex-1 min-w-0 border border-transparent hover:border-slate-700"
            title="Haz clic para renombrar este elemento"
          />
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {node.id !== rootNode.id && (
            <button
              type="button"
              onClick={() => duplicateNode(node.id)}
              title="Duplicar elemento"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => deleteNode(node.id)}
            title="Eliminar elemento"
            className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pestañas de categorías del Inspector en dos filas equilibradas de 4 */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800 bg-slate-950/60 p-2 text-[11px] overflow-hidden">
        {[
          { id: 'layout', label: 'Disposición', icon: Layout },
          { id: 'spacing', label: 'Espaciado', icon: Maximize2 },
          { id: 'sizing', label: 'Dimensiones', icon: Move },
          { id: 'typography', label: 'Texto', icon: Type },
          { id: 'styles', label: 'Aspecto', icon: Paintbrush },
          { id: 'effects', label: 'Efectos', icon: Sparkles },
          { id: 'attributes', label: 'Atributos', icon: Settings2 },
          { id: 'custom', label: 'Clases', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-all font-medium flex-shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Cuerpo del Inspector con scroll vertical y SIN overflow horizontal */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 space-y-3.5 text-xs">
        {/* --- PESTAÑA: DISPOSICIÓN & LAYOUT --- */}
        {activeTab === 'layout' && (
          <div className="space-y-3">
            {/* Display */}
            <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <label className="text-slate-300 font-medium">Display</label>
              <select
                value={getStyleMatch('layout', /^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|hidden)$/)}
                onChange={(e) =>
                  updatePropertyClass(
                    'layout',
                    /^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|hidden)$/,
                    e.target.value
                  )
                }
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {DISPLAY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Posición & Z-Index */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <label className="text-slate-300 font-medium">Posición</label>
                <select
                  value={getStyleMatch('layout', /^(relative|absolute|fixed|sticky)$/)}
                  onChange={(e) =>
                    updatePropertyClass('layout', /^(relative|absolute|fixed|sticky)$/, e.target.value)
                  }
                  className="w-full py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {POSITION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <PropertyControlWithCustom
                label="Z-Index"
                prefix="z-"
                options={Z_INDEX_OPTIONS}
                currentClass={styles.layout || ''}
                onUpdate={(newClass) => updatePropertyClass('layout', /^z(-.*)?$/, newClass)}
                placeholder="ej. [99] o 50"
              />
            </div>

            {/* Overflow */}
            <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <label className="text-slate-300 font-medium">Desbordamiento (Overflow)</label>
              <select
                value={getStyleMatch('layout', /^overflow-(hidden|auto|scroll|visible)$/)}
                onChange={(e) =>
                  updatePropertyClass('layout', /^overflow-(hidden|auto|scroll|visible)$/, e.target.value)
                }
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {OVERFLOW_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Flex Direction & Wrap */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <label className="text-slate-300 font-medium">Dirección Flex</label>
                <select
                  value={getStyleMatch('layout', /^flex-(row|col|row-reverse|col-reverse)$/)}
                  onChange={(e) =>
                    updatePropertyClass(
                      'layout',
                      /^flex-(row|col|row-reverse|col-reverse)$/,
                      e.target.value
                    )
                  }
                  className="w-full py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Auto</option>
                  {FLEX_DIRECTION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <label className="text-slate-300 font-medium">Flex Wrap</label>
                <select
                  value={getStyleMatch('layout', /^flex-(nowrap|wrap|wrap-reverse)$/)}
                  onChange={(e) =>
                    updatePropertyClass('layout', /^flex-(nowrap|wrap|wrap-reverse)$/, e.target.value)
                  }
                  className="w-full py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Auto</option>
                  {FLEX_WRAP_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Align Items */}
            <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <label className="text-slate-300 font-medium">Alineación (Align Items)</label>
              <select
                value={getStyleMatch('layout', /^items-(start|center|end|stretch|baseline)$/)}
                onChange={(e) =>
                  updatePropertyClass(
                    'layout',
                    /^items-(start|center|end|stretch|baseline)$/,
                    e.target.value
                  )
                }
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Por defecto</option>
                {ALIGN_ITEMS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Justify Content */}
            <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <label className="text-slate-300 font-medium">Distribución (Justify Content)</label>
              <select
                value={getStyleMatch('layout', /^justify-(start|center|end|between|around|evenly)$/)}
                onChange={(e) =>
                  updatePropertyClass(
                    'layout',
                    /^justify-(start|center|end|between|around|evenly)$/,
                    e.target.value
                  )
                }
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Por defecto</option>
                {JUSTIFY_CONTENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Gap con soporte arbitrario [..] */}
            <PropertyControlWithCustom
              label="Separación entre elementos (Gap)"
              prefix="gap-"
              options={GAP_OPTIONS}
              currentClass={styles.layout || ''}
              onUpdate={(newClass) => updatePropertyClass('layout', /^gap(-.*)?$/, newClass)}
              placeholder="ej. [14px] o 6"
            />

            {/* Grid Columns */}
            <PropertyControlWithCustom
              label="Columnas Grid (Grid Cols)"
              prefix="grid-cols-"
              options={GRID_COLS_OPTIONS}
              currentClass={styles.layout || ''}
              onUpdate={(newClass) => updatePropertyClass('layout', /^grid-cols(-.*)?$/, newClass)}
              placeholder="ej. [16] o 3"
            />
          </div>
        )}

        {/* --- PESTAÑA: ESPACIADO (PADDING & MARGIN) --- */}
        {activeTab === 'spacing' && (
          <div className="space-y-4">
            <p className="text-[11px] text-slate-400">
              Ajusta el relleno y márgenes interiores/exteriores con presets o valores manuales como <code>p-[18px]</code>:
            </p>
            <SpacingControl
              currentClasses={styles.spacing || ''}
              onUpdate={(classes) => updateNodeStyles(node.id, 'spacing', classes)}
            />
          </div>
        )}

        {/* --- PESTAÑA: DIMENSIONES (WIDTH, HEIGHT, MAX-W, MIN-H) --- */}
        {activeTab === 'sizing' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-400">
              Configura el ancho y alto con presets o <strong>valores arbitrarios exactos</strong> como <code>max-w-[30px]</code> o <code>w-[450px]</code>:
            </p>

            {/* Width */}
            <PropertyControlWithCustom
              label="Ancho (Width)"
              prefix="w-"
              options={WIDTH_OPTIONS}
              currentClass={styles.sizing || ''}
              onUpdate={(newClass) => updatePropertyClass('sizing', /^w(-.*)?$/, newClass)}
              placeholder="ej. [320px] o [85%]"
            />

            {/* Max Width */}
            <PropertyControlWithCustom
              label="Ancho Máximo (Max Width)"
              prefix="max-w-"
              options={MAX_WIDTH_OPTIONS}
              currentClass={styles.sizing || ''}
              onUpdate={(newClass) => updatePropertyClass('sizing', /^max-w(-.*)?$/, newClass)}
              placeholder="ej. [30px] o [600px]"
            />

            {/* Height */}
            <PropertyControlWithCustom
              label="Alto (Height)"
              prefix="h-"
              options={HEIGHT_OPTIONS}
              currentClass={styles.sizing || ''}
              onUpdate={(newClass) => updatePropertyClass('sizing', /^h(-.*)?$/, newClass)}
              placeholder="ej. [150px] o [100vh]"
            />

            {/* Min Height */}
            <PropertyControlWithCustom
              label="Alto Mínimo (Min Height)"
              prefix="min-h-"
              options={[
                { label: '0px (min-h-0)', value: 'min-h-0' },
                { label: '100% (min-h-full)', value: 'min-h-full' },
                { label: 'Pantalla (min-h-screen)', value: 'min-h-screen' },
              ]}
              currentClass={styles.sizing || ''}
              onUpdate={(newClass) => updatePropertyClass('sizing', /^min-h(-.*)?$/, newClass)}
              placeholder="ej. [200px]"
            />
          </div>
        )}

        {/* --- PESTAÑA: TIPOGRAFÍA & TEXTO --- */}
        {activeTab === 'typography' && (
          <div className="space-y-4">
            {/* Texto Interno */}
            {node.textContent !== undefined && (
              <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <label className="text-slate-300 font-medium">Contenido de Texto</label>
                <textarea
                  value={node.textContent || ''}
                  onChange={(e) => updateNodeText(node.id, e.target.value)}
                  rows={2}
                  className="w-full py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                  placeholder="Escribe el texto aquí..."
                />
              </div>
            )}

            {/* Font Size con Arbitrario (ej: text-[14px]) */}
            <PropertyControlWithCustom
              label="Tamaño de Fuente (Font Size)"
              prefix="text-"
              options={FONT_SIZE_OPTIONS}
              currentClass={styles.typography || ''}
              onUpdate={(newClass) =>
                updatePropertyClass(
                  'typography',
                  /^text-(xs|sm|base|lg|xl|[2-9]xl|\[[^\]]+\])$/,
                  newClass
                )
              }
              placeholder="ej. [15px] o [1.1rem]"
            />

            {/* Font Weight */}
            <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <label className="text-slate-300 font-medium">Grosor de Fuente (Weight)</label>
              <select
                value={getStyleMatch('typography', /^font-(thin|light|normal|medium|semibold|bold|extrabold|black)$/)}
                onChange={(e) =>
                  updatePropertyClass(
                    'typography',
                    /^font-(thin|light|normal|medium|semibold|bold|extrabold|black)$/,
                    e.target.value
                  )
                }
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Por defecto</option>
                {FONT_WEIGHT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Align */}
            <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <label className="text-slate-300 font-medium">Alineación de Texto</label>
              <div className="grid grid-cols-4 gap-1">
                {TEXT_ALIGN_OPTIONS.map((opt) => {
                  const current = getStyleMatch('typography', /^text-(left|center|right|justify)$/);
                  const isSelected = current === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        updatePropertyClass(
                          'typography',
                          /^text-(left|center|right|justify)$/,
                          isSelected ? '' : opt.value
                        )
                      }
                      className={`py-1.5 px-2 text-[11px] rounded border transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color de Texto Completo */}
            <ColorPickerControl
              label="Color de Texto"
              type="text"
              currentClass={styles.typography || ''}
              onSelect={(className) =>
                updatePropertyClass(
                  'typography',
                  /^text-([a-z]+(-[0-9]+)?|transparent|white|black|current|inherit|\[[^\]]+\])$/,
                  className
                )
              }
            />
          </div>
        )}

        {/* --- PESTAÑA: ASPECTO (FONDO Y BORDES) --- */}
        {activeTab === 'styles' && (
          <div className="space-y-4">
            {/* Color de Fondo Completo */}
            <ColorPickerControl
              label="Color de Fondo (Background)"
              type="bg"
              currentClass={styles.background || ''}
              onSelect={(className) => updateNodeStyles(node.id, 'background', className)}
            />

            <hr className="border-slate-800" />

            <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Bordes y Esquinas
            </h5>

            {/* Border Width con Arbitrario */}
            <PropertyControlWithCustom
              label="Grosor de Borde (Border Width)"
              prefix="border-"
              options={BORDER_WIDTH_OPTIONS}
              currentClass={styles.borders || ''}
              onUpdate={(newClass) =>
                updatePropertyClass(
                  'borders',
                  /^border(-[0-9tb]|-\[[^\]]+\])?$/,
                  newClass
                )
              }
              placeholder="ej. [3px]"
            />

            {/* Border Radius con Arbitrario */}
            <PropertyControlWithCustom
              label="Radio de Esquinas (Border Radius)"
              prefix="rounded-"
              options={BORDER_RADIUS_OPTIONS}
              currentClass={styles.borders || ''}
              onUpdate={(newClass) =>
                updatePropertyClass('borders', /^rounded(-.*)?$/, newClass)
              }
              placeholder="ej. [16px] o [2rem]"
            />

            {/* Color de Borde Completo */}
            <ColorPickerControl
              label="Color de Borde"
              type="border"
              currentClass={styles.borders || ''}
              onSelect={(className) =>
                updatePropertyClass(
                  'borders',
                  /^border-([a-z]+(-[0-9]+)?|transparent|white|black|current|inherit|\[[^\]]+\])$/,
                  className
                )
              }
            />
          </div>
        )}

        {/* --- PESTAÑA: EFECTOS & TRANSFORMACIONES --- */}
        {activeTab === 'effects' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-400">
              Efectos visuales, filtros, opacidad y transformaciones interactivas:
            </p>

            {/* Shadow con Arbitrario */}
            <PropertyControlWithCustom
              label="Sombra (Box Shadow)"
              prefix="shadow-"
              options={SHADOW_OPTIONS}
              currentClass={styles.effects || ''}
              onUpdate={(newClass) => updatePropertyClass('effects', /^shadow(-.*)?$/, newClass)}
              placeholder="ej. [0_8px_30px_rgb(0,0,0,0.12)]"
            />

            {/* Opacity con Arbitrario */}
            <PropertyControlWithCustom
              label="Opacidad (Opacity)"
              prefix="opacity-"
              options={OPACITY_OPTIONS}
              currentClass={styles.effects || ''}
              onUpdate={(newClass) => updatePropertyClass('effects', /^opacity(-.*)?$/, newClass)}
              placeholder="ej. [85%]"
            />

            {/* Blur con Arbitrario */}
            <PropertyControlWithCustom
              label="Desenfoque (Blur Filter)"
              prefix="blur-"
              options={BLUR_OPTIONS}
              currentClass={styles.effects || ''}
              onUpdate={(newClass) => updatePropertyClass('effects', /^blur(-.*)?$/, newClass)}
              placeholder="ej. [2px]"
            />

            {/* Backdrop Blur con Arbitrario */}
            <PropertyControlWithCustom
              label="Desenfoque de Fondo (Backdrop Blur)"
              prefix="backdrop-blur-"
              options={BACKDROP_BLUR_OPTIONS}
              currentClass={styles.effects || ''}
              onUpdate={(newClass) =>
                updatePropertyClass('effects', /^backdrop-blur(-.*)?$/, newClass)
              }
              placeholder="ej. [10px]"
            />

            {/* Cursor */}
            <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <label className="text-slate-300 font-medium">Tipo de Cursor</label>
              <select
                value={getStyleMatch('interactive', /^cursor-(auto|default|pointer|wait|text|move|not-allowed|grab)$/)}
                onChange={(e) =>
                  updatePropertyClass(
                    'interactive',
                    /^cursor-(auto|default|pointer|wait|text|move|not-allowed|grab)$/,
                    e.target.value
                  )
                }
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {CURSOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Scale / Zoom con Arbitrario */}
            <PropertyControlWithCustom
              label="Escala / Zoom (Transform Scale)"
              prefix="scale-"
              options={SCALE_OPTIONS}
              currentClass={styles.interactive || ''}
              onUpdate={(newClass) =>
                updatePropertyClass(
                  'interactive',
                  /^(-?scale(-.*)?|hover:scale(-.*)?|active:scale(-.*)?)$/,
                  newClass
                )
              }
              placeholder="ej. [1.08]"
            />

            {/* Rotate con Arbitrario */}
            <PropertyControlWithCustom
              label="Rotación (Rotate)"
              prefix="rotate-"
              options={ROTATE_OPTIONS}
              currentClass={styles.interactive || ''}
              onUpdate={(newClass) =>
                updatePropertyClass('interactive', /^-?rotate(-.*)?$/, newClass)
              }
              placeholder="ej. [25deg] o [-15deg]"
            />

            {/* Transiciones */}
            <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
              <label className="text-slate-300 font-medium">Animación & Transición</label>
              <select
                value={styles.interactive?.split(/\s+/).find((c) => c.startsWith('transition')) ? styles.interactive : ''}
                onChange={(e) => updateNodeStyles(node.id, 'interactive', e.target.value)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {TRANSITION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* --- PESTAÑA: ATRIBUTOS HTML --- */}
        {activeTab === 'attributes' && (
          <div className="space-y-4">
            <p className="text-[11px] text-slate-400">
              Modifica los atributos HTML estándar de este elemento (&lt;{node.tag}&gt;):
            </p>

            <div className="space-y-2">
              {Object.entries(node.attributes).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60"
                >
                  <span className="font-mono text-blue-400 font-semibold w-24 truncate">
                    {k}:
                  </span>
                  <input
                    type="text"
                    value={String(v)}
                    onChange={(e) => updateNodeAttribute(node.id, k, e.target.value)}
                    className="flex-1 py-1 px-2 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => removeNodeAttribute(node.id, k)}
                    title="Eliminar atributo"
                    className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Formulario para añadir atributo */}
            <form onSubmit={handleAddAttribute} className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/40 space-y-2">
              <span className="text-[11px] font-semibold text-slate-300">Añadir Atributo Personalizado:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ej. id, placeholder, src"
                  value={newAttrKey}
                  onChange={(e) => setNewAttrKey(e.target.value)}
                  className="w-1/2 py-1 px-2 rounded bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="valor..."
                  value={newAttrVal}
                  onChange={(e) => setNewAttrVal(e.target.value)}
                  className="w-1/2 py-1 px-2 rounded bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={!newAttrKey.trim()}
                className="w-full py-1 px-2 text-xs font-medium bg-slate-800 hover:bg-blue-600 disabled:opacity-40 text-white rounded transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir Atributo
              </button>
            </form>
          </div>
        )}

        {/* --- PESTAÑA: CLASES MANUALES DIRECTAS --- */}
        {activeTab === 'custom' && (
          <div className="space-y-4">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Introduce cualquier clase Tailwind adicional manualmente (ej: <code>space-y-4</code>, <code>backdrop-blur-md</code>, <code>hover:rotate-1</code>, <code>selection:bg-blue-500</code>):
            </p>
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Clases Personalizadas</label>
              <textarea
                value={styles.custom || ''}
                onChange={(e) => updateNodeStyles(node.id, 'custom', e.target.value)}
                rows={4}
                placeholder="ej: space-y-4 group-hover:scale-105 active:brightness-90"
                className="w-full font-mono text-xs py-2 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
