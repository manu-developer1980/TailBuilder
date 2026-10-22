export interface StyleOption {
  label: string;
  value: string;
  previewClass?: string;
}

export const DISPLAY_OPTIONS: StyleOption[] = [
  { label: 'Default / Auto', value: '' },
  { label: 'Block', value: 'block' },
  { label: 'Flex', value: 'flex' },
  { label: 'Inline Flex', value: 'inline-flex' },
  { label: 'Grid', value: 'grid' },
  { label: 'Inline Grid', value: 'inline-grid' },
  { label: 'Inline Block', value: 'inline-block' },
  { label: 'Inline', value: 'inline' },
  { label: 'Hidden (Oculto)', value: 'hidden' },
];

export const POSITION_OPTIONS: StyleOption[] = [
  { label: 'Auto (Static)', value: '' },
  { label: 'Relative', value: 'relative' },
  { label: 'Absolute', value: 'absolute' },
  { label: 'Fixed', value: 'fixed' },
  { label: 'Sticky', value: 'sticky' },
];

export const Z_INDEX_OPTIONS: StyleOption[] = [
  { label: 'Auto', value: '' },
  { label: 'z-0', value: 'z-0' },
  { label: 'z-10', value: 'z-10' },
  { label: 'z-20', value: 'z-20' },
  { label: 'z-30', value: 'z-30' },
  { label: 'z-40', value: 'z-40' },
  { label: 'z-50', value: 'z-50' },
];

export const OVERFLOW_OPTIONS: StyleOption[] = [
  { label: 'Visible', value: '' },
  { label: 'Hidden (Ocultar desborde)', value: 'overflow-hidden' },
  { label: 'Auto (Scroll inteligente)', value: 'overflow-auto' },
  { label: 'Scroll (Scroll forzado)', value: 'overflow-scroll' },
];

export const FLEX_DIRECTION_OPTIONS: StyleOption[] = [
  { label: 'Row (Horizontal)', value: 'flex-row' },
  { label: 'Column (Vertical)', value: 'flex-col' },
  { label: 'Row Reverse', value: 'flex-row-reverse' },
  { label: 'Column Reverse', value: 'flex-col-reverse' },
];

export const FLEX_WRAP_OPTIONS: StyleOption[] = [
  { label: 'No Wrap', value: 'flex-nowrap' },
  { label: 'Wrap (Envolver)', value: 'flex-wrap' },
  { label: 'Wrap Reverse', value: 'flex-wrap-reverse' },
];

export const ALIGN_ITEMS_OPTIONS: StyleOption[] = [
  { label: 'Start (Superior)', value: 'items-start' },
  { label: 'Center (Centrado)', value: 'items-center' },
  { label: 'End (Inferior)', value: 'items-end' },
  { label: 'Stretch (Estirar)', value: 'items-stretch' },
  { label: 'Baseline', value: 'items-baseline' },
];

export const JUSTIFY_CONTENT_OPTIONS: StyleOption[] = [
  { label: 'Start (Inicio)', value: 'justify-start' },
  { label: 'Center (Centro)', value: 'justify-center' },
  { label: 'End (Fin)', value: 'justify-end' },
  { label: 'Between (Espacio entre)', value: 'justify-between' },
  { label: 'Around (Espacio alrededor)', value: 'justify-around' },
  { label: 'Evenly (Equidistante)', value: 'justify-evenly' },
];

export const GAP_OPTIONS: StyleOption[] = [
  { label: 'Sin espacio (0)', value: 'gap-0' },
  { label: '4px (gap-1)', value: 'gap-1' },
  { label: '8px (gap-2)', value: 'gap-2' },
  { label: '12px (gap-3)', value: 'gap-3' },
  { label: '16px (gap-4)', value: 'gap-4' },
  { label: '20px (gap-5)', value: 'gap-5' },
  { label: '24px (gap-6)', value: 'gap-6' },
  { label: '32px (gap-8)', value: 'gap-8' },
  { label: '40px (gap-10)', value: 'gap-10' },
  { label: '48px (gap-12)', value: 'gap-12' },
  { label: '64px (gap-16)', value: 'gap-16' },
];

export const GRID_COLS_OPTIONS: StyleOption[] = [
  { label: '1 Columna', value: 'grid-cols-1' },
  { label: '2 Columnas', value: 'grid-cols-2' },
  { label: '3 Columnas', value: 'grid-cols-3' },
  { label: '4 Columnas', value: 'grid-cols-4' },
  { label: '5 Columnas', value: 'grid-cols-5' },
  { label: '6 Columnas', value: 'grid-cols-6' },
  { label: '12 Columnas', value: 'grid-cols-12' },
];

export const PADDING_OPTIONS: StyleOption[] = [
  { label: 'p-0 (0px)', value: 'p-0' },
  { label: 'p-1 (4px)', value: 'p-1' },
  { label: 'p-2 (8px)', value: 'p-2' },
  { label: 'p-3 (12px)', value: 'p-3' },
  { label: 'p-4 (16px)', value: 'p-4' },
  { label: 'p-5 (20px)', value: 'p-5' },
  { label: 'p-6 (24px)', value: 'p-6' },
  { label: 'p-8 (32px)', value: 'p-8' },
  { label: 'p-10 (40px)', value: 'p-10' },
  { label: 'p-12 (48px)', value: 'p-12' },
  { label: 'p-16 (64px)', value: 'p-16' },
];

export const MARGIN_OPTIONS: StyleOption[] = [
  { label: 'm-0 (0px)', value: 'm-0' },
  { label: 'm-auto (Automático)', value: 'm-auto' },
  { label: 'm-1 (4px)', value: 'm-1' },
  { label: 'm-2 (8px)', value: 'm-2' },
  { label: 'm-3 (12px)', value: 'm-3' },
  { label: 'm-4 (16px)', value: 'm-4' },
  { label: 'm-6 (24px)', value: 'm-6' },
  { label: 'm-8 (32px)', value: 'm-8' },
  { label: 'm-12 (48px)', value: 'm-12' },
  { label: '-m-2 (-8px)', value: '-m-2' },
  { label: '-m-4 (-16px)', value: '-m-4' },
];

export const WIDTH_OPTIONS: StyleOption[] = [
  { label: 'Auto (w-auto)', value: 'w-auto' },
  { label: '100% (w-full)', value: 'w-full' },
  { label: 'Ajuste contenido (w-fit)', value: 'w-fit' },
  { label: 'Pantalla (w-screen)', value: 'w-screen' },
  { label: '1/2 (w-1/2)', value: 'w-1/2' },
  { label: '1/3 (w-1/3)', value: 'w-1/3' },
  { label: '2/3 (w-2/3)', value: 'w-2/3' },
  { label: '1/4 (w-1/4)', value: 'w-1/4' },
  { label: '3/4 (w-3/4)', value: 'w-3/4' },
  { label: '64px (w-16)', value: 'w-16' },
  { label: '96px (w-24)', value: 'w-24' },
  { label: '128px (w-32)', value: 'w-32' },
  { label: '192px (w-48)', value: 'w-48' },
  { label: '256px (w-64)', value: 'w-64' },
  { label: '320px (w-80)', value: 'w-80' },
  { label: '384px (w-96)', value: 'w-96' },
];

export const MAX_WIDTH_OPTIONS: StyleOption[] = [
  { label: 'Sin límite (max-w-none)', value: 'max-w-none' },
  { label: '320px (max-w-xs)', value: 'max-w-xs' },
  { label: '384px (max-w-sm)', value: 'max-w-sm' },
  { label: '448px (max-w-md)', value: 'max-w-md' },
  { label: '512px (max-w-lg)', value: 'max-w-lg' },
  { label: '576px (max-w-xl)', value: 'max-w-xl' },
  { label: '672px (max-w-2xl)', value: 'max-w-2xl' },
  { label: '768px (max-w-3xl)', value: 'max-w-3xl' },
  { label: '896px (max-w-4xl)', value: 'max-w-4xl' },
  { label: '1024px (max-w-5xl)', value: 'max-w-5xl' },
  { label: '1152px (max-w-6xl)', value: 'max-w-6xl' },
  { label: '1280px (max-w-7xl)', value: 'max-w-7xl' },
  { label: '100% (max-w-full)', value: 'max-w-full' },
];

export const HEIGHT_OPTIONS: StyleOption[] = [
  { label: 'Auto (h-auto)', value: 'h-auto' },
  { label: '100% (h-full)', value: 'h-full' },
  { label: 'Ajuste contenido (h-fit)', value: 'h-fit' },
  { label: 'Pantalla (h-screen)', value: 'h-screen' },
  { label: '32px (h-8)', value: 'h-8' },
  { label: '40px (h-10)', value: 'h-10' },
  { label: '48px (h-12)', value: 'h-12' },
  { label: '64px (h-16)', value: 'h-16' },
  { label: '80px (h-20)', value: 'h-20' },
  { label: '96px (h-24)', value: 'h-24' },
  { label: '128px (h-32)', value: 'h-32' },
  { label: '192px (h-48)', value: 'h-48' },
  { label: '256px (h-64)', value: 'h-64' },
  { label: '384px (h-96)', value: 'h-96' },
];

export const FONT_SIZE_OPTIONS: StyleOption[] = [
  { label: 'text-xs (12px)', value: 'text-xs' },
  { label: 'text-sm (14px)', value: 'text-sm' },
  { label: 'text-base (16px)', value: 'text-base' },
  { label: 'text-lg (18px)', value: 'text-lg' },
  { label: 'text-xl (20px)', value: 'text-xl' },
  { label: 'text-2xl (24px)', value: 'text-2xl' },
  { label: 'text-3xl (30px)', value: 'text-3xl' },
  { label: 'text-4xl (36px)', value: 'text-4xl' },
  { label: 'text-5xl (48px)', value: 'text-5xl' },
  { label: 'text-6xl (60px)', value: 'text-6xl' },
];

export const FONT_WEIGHT_OPTIONS: StyleOption[] = [
  { label: 'Thin (100)', value: 'font-thin' },
  { label: 'Light (300)', value: 'font-light' },
  { label: 'Normal (400)', value: 'font-normal' },
  { label: 'Medium (500)', value: 'font-medium' },
  { label: 'Semibold (600)', value: 'font-semibold' },
  { label: 'Bold (700)', value: 'font-bold' },
  { label: 'Extrabold (800)', value: 'font-extrabold' },
  { label: 'Black (900)', value: 'font-black' },
];

export const TEXT_ALIGN_OPTIONS: StyleOption[] = [
  { label: 'Izquierda', value: 'text-left' },
  { label: 'Centro', value: 'text-center' },
  { label: 'Derecha', value: 'text-right' },
  { label: 'Justificado', value: 'text-justify' },
];

export const BORDER_WIDTH_OPTIONS: StyleOption[] = [
  { label: '0px (border-0)', value: 'border-0' },
  { label: '1px (border)', value: 'border' },
  { label: '2px (border-2)', value: 'border-2' },
  { label: '4px (border-4)', value: 'border-4' },
  { label: '8px (border-8)', value: 'border-8' },
  { label: 'Top 1px (border-t)', value: 'border-t' },
  { label: 'Bottom 1px (border-b)', value: 'border-b' },
  { label: 'Left 1px (border-l)', value: 'border-l' },
  { label: 'Right 1px (border-r)', value: 'border-r' },
];

export const BORDER_RADIUS_OPTIONS: StyleOption[] = [
  { label: 'Recto (rounded-none)', value: 'rounded-none' },
  { label: 'Sutil (rounded-sm / 2px)', value: 'rounded-sm' },
  { label: 'Estándar (rounded / 4px)', value: 'rounded' },
  { label: 'Medio (rounded-md / 6px)', value: 'rounded-md' },
  { label: 'Redondeado (rounded-lg / 8px)', value: 'rounded-lg' },
  { label: 'Pronunciado (rounded-xl / 12px)', value: 'rounded-xl' },
  { label: 'Muy Redondo (rounded-2xl / 16px)', value: 'rounded-2xl' },
  { label: '3X Redondo (rounded-3xl / 24px)', value: 'rounded-3xl' },
  { label: 'Completamente Redondo (rounded-full)', value: 'rounded-full' },
  { label: 'Top Redondo (rounded-t-xl)', value: 'rounded-t-xl' },
  { label: 'Bottom Redondo (rounded-b-xl)', value: 'rounded-b-xl' },
];

export const SHADOW_OPTIONS: StyleOption[] = [
  { label: 'Sin sombra (shadow-none)', value: 'shadow-none' },
  { label: 'Sombra XS (shadow-xs)', value: 'shadow-xs' },
  { label: 'Sombra Sutil (shadow-sm)', value: 'shadow-sm' },
  { label: 'Sombra Regular (shadow)', value: 'shadow' },
  { label: 'Sombra Media (shadow-md)', value: 'shadow-md' },
  { label: 'Sombra Grande (shadow-lg)', value: 'shadow-lg' },
  { label: 'Sombra Elevada (shadow-xl)', value: 'shadow-xl' },
  { label: 'Sombra Flotante (shadow-2xl)', value: 'shadow-2xl' },
  { label: 'Sombra Interna (shadow-inner)', value: 'shadow-inner' },
];

export const BLUR_OPTIONS: StyleOption[] = [
  { label: 'Sin desenfoque (blur-none)', value: '' },
  { label: 'blur-sm (4px)', value: 'blur-sm' },
  { label: 'blur (8px)', value: 'blur' },
  { label: 'blur-md (12px)', value: 'blur-md' },
  { label: 'blur-lg (16px)', value: 'blur-lg' },
  { label: 'blur-xl (24px)', value: 'blur-xl' },
  { label: 'blur-2xl (40px)', value: 'blur-2xl' },
  { label: 'blur-3xl (64px)', value: 'blur-3xl' },
];

export const BACKDROP_BLUR_OPTIONS: StyleOption[] = [
  { label: 'Sin desenfoque de fondo', value: '' },
  { label: 'backdrop-blur-sm (4px)', value: 'backdrop-blur-sm' },
  { label: 'backdrop-blur (8px)', value: 'backdrop-blur' },
  { label: 'backdrop-blur-md (12px)', value: 'backdrop-blur-md' },
  { label: 'backdrop-blur-lg (16px)', value: 'backdrop-blur-lg' },
  { label: 'backdrop-blur-xl (24px)', value: 'backdrop-blur-xl' },
];

export const OPACITY_OPTIONS: StyleOption[] = [
  { label: '100% (opacity-100)', value: 'opacity-100' },
  { label: '95% (opacity-95)', value: 'opacity-95' },
  { label: '90% (opacity-90)', value: 'opacity-90' },
  { label: '80% (opacity-80)', value: 'opacity-80' },
  { label: '75% (opacity-75)', value: 'opacity-75' },
  { label: '50% (opacity-50)', value: 'opacity-50' },
  { label: '25% (opacity-25)', value: 'opacity-25' },
  { label: '10% (opacity-10)', value: 'opacity-10' },
  { label: '0% (opacity-0)', value: 'opacity-0' },
];

export const CURSOR_OPTIONS: StyleOption[] = [
  { label: 'Por defecto (cursor-auto)', value: '' },
  { label: 'Cursor Pointer (Mano)', value: 'cursor-pointer' },
  { label: 'Cursor Default (Flecha)', value: 'cursor-default' },
  { label: 'Cursor Not-Allowed (Prohibido)', value: 'cursor-not-allowed' },
  { label: 'Cursor Grab (Agarrar)', value: 'cursor-grab' },
  { label: 'Cursor Text (Seleccionar)', value: 'cursor-text' },
  { label: 'Cursor Wait (Carga)', value: 'cursor-wait' },
];

export const SCALE_OPTIONS: StyleOption[] = [
  { label: 'Normal (100%)', value: '' },
  { label: 'Hover Zoom In (hover:scale-105)', value: 'hover:scale-105' },
  { label: 'Hover Zoom Pro (hover:scale-110)', value: 'hover:scale-110' },
  { label: 'Hover Click Press (active:scale-95)', value: 'active:scale-95' },
  { label: 'Fijo 95% (scale-95)', value: 'scale-95' },
  { label: 'Fijo 105% (scale-105)', value: 'scale-105' },
  { label: 'Fijo 110% (scale-110)', value: 'scale-110' },
];

export const ROTATE_OPTIONS: StyleOption[] = [
  { label: '0°', value: '' },
  { label: '1° (rotate-1)', value: 'rotate-1' },
  { label: '2° (rotate-2)', value: 'rotate-2' },
  { label: '3° (rotate-3)', value: 'rotate-3' },
  { label: '6° (rotate-6)', value: 'rotate-6' },
  { label: '45° (rotate-45)', value: 'rotate-45' },
  { label: '90° (rotate-90)', value: 'rotate-90' },
  { label: '180° (rotate-180)', value: 'rotate-180' },
  { label: '-1° (-rotate-1)', value: '-rotate-1' },
  { label: '-2° (-rotate-2)', value: '-rotate-2' },
  { label: '-6° (-rotate-6)', value: '-rotate-6' },
  { label: '-45° (-rotate-45)', value: '-rotate-45' },
  { label: '-90° (-rotate-90)', value: '-rotate-90' },
];

export const TRANSITION_OPTIONS: StyleOption[] = [
  { label: 'Sin transición', value: '' },
  { label: 'Colores Suave (transition-colors duration-200)', value: 'transition-colors duration-200' },
  { label: 'Todo Suave 200ms (transition-all duration-200)', value: 'transition-all duration-200' },
  { label: 'Todo Suave 300ms (transition-all duration-300)', value: 'transition-all duration-300' },
  { label: 'Todo Suave 500ms (transition-all duration-500)', value: 'transition-all duration-500' },
  { label: 'Transform Suave (transition-transform duration-200)', value: 'transition-transform duration-200' },
  { label: 'Opacidad Suave (transition-opacity duration-200)', value: 'transition-opacity duration-200' },
];
