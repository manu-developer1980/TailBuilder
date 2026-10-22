Plan de Implementación: Generador Visual de Componentes React + Tailwind CSS

Construir una herramienta web en Next.js (App Router), TypeScript y Tailwind CSS que permita componer jerarquías visuales de elementos HTML/React, personalizar sus estilos Tailwind de forma visual e intuitiva en tiempo real y exportar código limpio en múltiples formatos.

1. Decisiones Clave Alineadas con el Usuario
   Estructura por Árbol Jerárquico Completo: Los componentes admiten anidamiento ilimitado (ej: form > fieldset > div > label + input, o card > card-header + card-body > button). Un panel de capas lateral (Layers Tree) permitirá seleccionar, añadir, reordenar y eliminar nodos en cualquier nivel.
   Enfoque por Fases:
   Fase 1 (MVP Local): Editor 100% interactivo en el cliente con lienzo en vivo, panel de propiedades Tailwind, selector de elementos jerárquico y generador multiformato.
   Fase 2 (Persistencia con Supabase): Autenticación, guardado de componentes por usuario en PostgreSQL con RLS y galería de plantillas compartidas.
   Formatos de Exportación Soportados:
   JSX / TSX directo: Fragmento de JSX con className="...".
   HTML nativo: Estructura HTML pura con clases Tailwind para usar fuera de React.
   Componente Reutilizable TypeScript: Función exportable (export function MiComponente({ ... })) con tipado listo para copiar en cualquier proyecto Next.js / Vite.
2. Arquitectura del Editor
3. Modelo de Datos del Nodo (ComponentNode)
   typescript
   export type HtmlTag =
   | 'div' | 'section' | 'article' | 'form' | 'fieldset' | 'legend'
   | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
   | 'button' | 'input' | 'textarea' | 'select' | 'option' | 'label'
   | 'ul' | 'ol' | 'li' | 'img' | 'a' | 'header' | 'footer' | 'nav';
   export interface StyleCategoryMap {
   layout?: string; // flex, grid, block, items-center, gap-4...
   spacing?: string; // p-4, px-2, py-3, m-2, mx-auto...
   sizing?: string; // w-full, h-auto, max-w-md, min-h-[40px]...
   typography?: string; // text-sm, font-medium, text-slate-800, text-center...
   background?: string; // bg-white, bg-blue-600, bg-slate-50...
   borders?: string; // border, border-slate-300, rounded-lg...
   effects?: string; // shadow-sm, shadow-md, opacity-90...
   interactive?: string; // hover:bg-blue-700, focus:ring-2...
   custom?: string; // clases manuales que el usuario escriba directamente
   }
   export interface ComponentNode {
   id: string; // Identificador único (nanoid/uuid)
   tag: HtmlTag; // Etiqueta HTML
   name: string; // Nombre visual (ej. "Campo Correo")
   styles: StyleCategoryMap; // Clases agrupadas
   attributes: Record<string, string | boolean>; // type="email", placeholder="...", id="email"
   textContent?: string; // Texto interno si aplica (ej. "Enviar", "Nombre completo")
   children: ComponentNode[]; // Elementos hijos para jerarquías
   }
4. Categorías de Propiedades Tailwind en el Inspector

Cada propiedad del inspector mostrará controles ergonómicos con autocompletado y catálogo predefinido de clases Tailwind:

Layout & Display:
Display: block, inline-block, flex, inline-flex, grid, hidden.
Flex Direction: flex-row, flex-col, flex-row-reverse.
Align Items: items-start, items-center, items-end, items-stretch.
Justify Content: justify-start, justify-center, justify-end, justify-between, justify-around.
Gap: gap-0 hasta gap-12.
Espaciado (Spacing):
Controles visuales intuitivos para Padding (all, X, Y) y Margin (all, X, Y, auto).
Dimensiones (Sizing):
Width: w-auto, w-full, w-1/2, w-1/3, w-1/4, w-fit.
Max Width: max-w-xs, max-w-sm, max-w-md, max-w-lg, max-w-xl, max-w-full.
Height: h-auto, h-full, h-10, h-12, h-16, etc.
Tipografía:
Font Size: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl.
Font Weight: font-normal, font-medium, font-semibold, font-bold.
Color: Selector de paleta de colores de Tailwind (text-slate-900, text-blue-600, etc.).
Align: text-left, text-center, text-right.
Fondo y Bordes:
Background: Paleta de colores (bg-white, bg-slate-50, bg-blue-600, etc.).
Border Width: border-0, border, border-2, border-4.
Border Color: Paleta de colores (border-slate-200, border-gray-300, etc.).
Border Radius: rounded-none, rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-full.
Efectos y Estados:
Shadow: shadow-none, shadow-sm, shadow, shadow-md, shadow-lg.
Hover State: Configuración rápida de hover:bg-..., hover:text-.... 5. Módulos y Archivos a Desarrollar
app/
├── globals.css # Tailwind v4 / v3 base
├── layout.tsx # Layout raíz
└── page.tsx # Página principal del Builder
components/
├── editor/
│ ├── EditorHeader.tsx # Barra superior: Nombre, selector de exportación, botón copiar
│ ├── ElementPalette.tsx # Lista de elementos básicos y presets (Form, Card, Button...)
│ ├── LayerTree.tsx # Árbol jerárquico de nodos (navegación y selección)
│ ├── Canvas.tsx # Lienzo de previsualización con selección interactiva
│ ├── CanvasNodeRenderer.tsx # Renderizador recursivo de nodos en el Canvas
│ ├── PropertyInspector.tsx # Panel lateral derecho con todas las categorías de Tailwind
│ ├── CodeExportModal.tsx # Visor de código (JSX, HTML, TSX Component) con copia rápida
│ └── controls/ # Controles reutilizables (Select, ColorPicker, SpacingControl)
lib/
├── store/
│ └── useEditorStore.ts # Estado global con Zustand (árbol, nodo activo, acciones)
├── tailwind/
│ ├── dictionary.ts # Catálogo estructurado de utilidades y clases Tailwind
│ └── classCompiler.ts # Compilador de StyleCategoryMap a className string
└── exporters/
├── toJSX.ts # Generador de JSX formateado
├── toHTML.ts # Generador de HTML con clases Tailwind
└── toTSXComponent.ts # Generador de Componente exportable reutilizable 6. Plan de Verificación
Pruebas de Componentes Simples:
Crear un h3 o p, modificar tamaño, color y márgenes.
Verificar que el className se compila sin duplicidades y se previsualiza al instante.
Pruebas de Estructuras Complejas (Fieldsets & Forms):
Crear un form que contenga un fieldset, dos pares label + input y un button.
Anidar elementos, reorganizarlos y estilar cada hijo de forma independiente.
Pruebas de Exportación Multiformato:
Alternar entre las pestañas JSX / TSX, HTML Puro y Componente TypeScript Reutilizable.
Validar que el código copiado es 100% sintácticamente válido y portable a cualquier proyecto.
