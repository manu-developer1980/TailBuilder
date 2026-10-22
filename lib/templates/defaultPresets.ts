import { ComponentNode, PresetTemplate } from '../types/editor';

export const DEFAULT_FORM_PRESET: ComponentNode = {
  id: 'form-root-1',
  tag: 'form',
  name: 'Formulario de Contacto',
  styles: {
    layout: 'flex flex-col',
    sizing: 'w-full max-w-lg',
    spacing: 'p-6 mx-auto',
    background: 'bg-white',
    borders: 'border border-slate-200 rounded-xl',
    effects: 'shadow-lg',
    custom: 'space-y-6',
  },
  attributes: {
    method: 'POST',
    action: '#',
  },
  children: [
    {
      id: 'form-header-box',
      tag: 'div',
      name: 'Cabecera del Formulario',
      styles: {
        layout: 'flex flex-col',
        spacing: 'mb-2',
        typography: 'text-left',
      },
      attributes: {},
      children: [
        {
          id: 'form-title',
          tag: 'h2',
          name: 'Título Principal',
          styles: {
            typography: 'text-2xl font-bold text-slate-900',
            spacing: 'mb-1',
          },
          attributes: {},
          textContent: 'Contáctanos',
          children: [],
        },
        {
          id: 'form-subtitle',
          tag: 'p',
          name: 'Subtítulo',
          styles: {
            typography: 'text-sm font-normal text-slate-500',
          },
          attributes: {},
          textContent: 'Déjanos un mensaje y te responderemos en menos de 24 horas.',
          children: [],
        },
      ],
    },
    {
      id: 'fieldset-personal',
      tag: 'fieldset',
      name: 'Grupo Datos Personales',
      styles: {
        borders: 'border border-slate-200 rounded-lg',
        spacing: 'p-4',
        layout: 'flex flex-col',
        custom: 'space-y-4',
      },
      attributes: {},
      children: [
        {
          id: 'legend-personal',
          tag: 'legend',
          name: 'Leyenda de Grupo',
          styles: {
            typography: 'text-xs font-semibold text-blue-600 uppercase tracking-wider',
            spacing: 'px-2',
          },
          attributes: {},
          textContent: 'Información Básica',
          children: [],
        },
        {
          id: 'field-name-wrap',
          tag: 'div',
          name: 'Contenedor Nombre',
          styles: {
            layout: 'flex flex-col',
            spacing: 'space-y-1',
          },
          attributes: {},
          children: [
            {
              id: 'label-name',
              tag: 'label',
              name: 'Etiqueta Nombre',
              styles: {
                typography: 'text-sm font-medium text-slate-700',
              },
              attributes: { for: 'user-name' },
              textContent: 'Nombre Completo',
              children: [],
            },
            {
              id: 'input-name',
              tag: 'input',
              name: 'Campo Nombre',
              styles: {
                sizing: 'w-full h-10',
                spacing: 'px-3 py-2',
                background: 'bg-slate-50',
                borders: 'border border-slate-300 rounded-md',
                typography: 'text-sm text-slate-900',
                interactive: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white',
              },
              attributes: {
                id: 'user-name',
                type: 'text',
                placeholder: 'Ej. Juan Pérez',
                required: true,
              },
              children: [],
            },
          ],
        },
        {
          id: 'field-email-wrap',
          tag: 'div',
          name: 'Contenedor Email',
          styles: {
            layout: 'flex flex-col',
            spacing: 'space-y-1',
          },
          attributes: {},
          children: [
            {
              id: 'label-email',
              tag: 'label',
              name: 'Etiqueta Email',
              styles: {
                typography: 'text-sm font-medium text-slate-700',
              },
              attributes: { for: 'user-email' },
              textContent: 'Correo Electrónico',
              children: [],
            },
            {
              id: 'input-email',
              tag: 'input',
              name: 'Campo Email',
              styles: {
                sizing: 'w-full h-10',
                spacing: 'px-3 py-2',
                background: 'bg-slate-50',
                borders: 'border border-slate-300 rounded-md',
                typography: 'text-sm text-slate-900',
                interactive: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white',
              },
              attributes: {
                id: 'user-email',
                type: 'email',
                placeholder: 'juan@ejemplo.com',
                required: true,
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 'field-msg-wrap',
      tag: 'div',
      name: 'Contenedor Mensaje',
      styles: {
        layout: 'flex flex-col',
        spacing: 'space-y-1',
      },
      attributes: {},
      children: [
        {
          id: 'label-msg',
          tag: 'label',
          name: 'Etiqueta Mensaje',
          styles: {
            typography: 'text-sm font-medium text-slate-700',
          },
          attributes: { for: 'user-message' },
          textContent: 'Mensaje o Consulta',
          children: [],
        },
        {
          id: 'textarea-msg',
          tag: 'textarea',
          name: 'Área de Texto',
          styles: {
            sizing: 'w-full',
            spacing: 'px-3 py-2',
            background: 'bg-slate-50',
            borders: 'border border-slate-300 rounded-md',
            typography: 'text-sm text-slate-900',
            interactive: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white',
            custom: 'min-h-[100px]',
          },
          attributes: {
            id: 'user-message',
            placeholder: 'Escribe los detalles aquí...',
            rows: '4',
          },
          children: [],
        },
      ],
    },
    {
      id: 'button-submit',
      tag: 'button',
      name: 'Botón Enviar',
      styles: {
        sizing: 'w-full h-11',
        spacing: 'px-4 py-2',
        background: 'bg-blue-600',
        typography: 'text-sm font-semibold text-white text-center',
        borders: 'rounded-lg border-0',
        effects: 'shadow-md',
        interactive: 'hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500',
      },
      attributes: {
        type: 'submit',
      },
      textContent: 'Enviar Consulta',
      children: [],
    },
  ],
};

export const CARD_PRESET: ComponentNode = {
  id: 'card-root-1',
  tag: 'div',
  name: 'Tarjeta Producto Pro',
  styles: {
    layout: 'flex flex-col',
    sizing: 'w-full max-w-sm',
    background: 'bg-white',
    borders: 'border border-slate-200 rounded-2xl',
    effects: 'shadow-lg hover:shadow-xl transition-all duration-300',
    spacing: 'overflow-hidden mx-auto',
  },
  attributes: {},
  children: [
    {
      id: 'card-img',
      tag: 'img',
      name: 'Imagen Principal',
      styles: {
        sizing: 'w-full h-48',
        custom: 'object-cover',
      },
      attributes: {
        src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        alt: 'Auriculares Premium',
      },
      children: [],
    },
    {
      id: 'card-body',
      tag: 'div',
      name: 'Cuerpo Tarjeta',
      styles: {
        layout: 'flex flex-col',
        spacing: 'p-5',
        custom: 'space-y-3',
      },
      attributes: {},
      children: [
        {
          id: 'card-badge-wrap',
          tag: 'div',
          name: 'Insignia',
          styles: {
            layout: 'flex items-center',
          },
          attributes: {},
          children: [
            {
              id: 'card-badge',
              tag: 'span',
              name: 'Tag Nuevo',
              styles: {
                background: 'bg-blue-50',
                typography: 'text-xs font-semibold text-blue-700',
                spacing: 'px-2.5 py-1',
                borders: 'rounded-full border border-blue-200',
              },
              attributes: {},
              textContent: 'Novedad',
              children: [],
            },
          ],
        },
        {
          id: 'card-title',
          tag: 'h3',
          name: 'Título Tarjeta',
          styles: {
            typography: 'text-xl font-bold text-slate-900',
          },
          attributes: {},
          textContent: 'Auriculares Wireless Pro',
          children: [],
        },
        {
          id: 'card-desc',
          tag: 'p',
          name: 'Descripción',
          styles: {
            typography: 'text-sm text-slate-500 leading-relaxed',
          },
          attributes: {},
          textContent: 'Cancelación activa de ruido, 40h de autonomía y acabado en aluminio aeroespacial.',
          children: [],
        },
        {
          id: 'card-footer-flex',
          tag: 'div',
          name: 'Fila Precio y Botón',
          styles: {
            layout: 'flex items-center justify-between',
            spacing: 'pt-3',
            borders: 'border-t border-slate-100',
          },
          attributes: {},
          children: [
            {
              id: 'card-price',
              tag: 'span',
              name: 'Precio',
              styles: {
                typography: 'text-2xl font-bold text-slate-900',
              },
              attributes: {},
              textContent: '199 €',
              children: [],
            },
            {
              id: 'card-btn',
              tag: 'button',
              name: 'Botón Comprar',
              styles: {
                background: 'bg-slate-900',
                typography: 'text-sm font-medium text-white',
                spacing: 'px-4 py-2',
                borders: 'rounded-lg',
                effects: 'hover:bg-slate-800 transition-colors',
              },
              attributes: { type: 'button' },
              textContent: 'Añadir al Carrito',
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

export const HERO_PRESET: ComponentNode = {
  id: 'hero-root-1',
  tag: 'section',
  name: 'Sección Hero Moderna',
  styles: {
    layout: 'flex flex-col items-center justify-center text-center',
    sizing: 'w-full max-w-4xl',
    spacing: 'py-16 px-6 mx-auto',
    background: 'bg-gradient-to-b from-slate-900 to-slate-950',
    borders: 'rounded-3xl border border-slate-800',
    effects: 'shadow-2xl',
    custom: 'space-y-6',
  },
  attributes: {},
  children: [
    {
      id: 'hero-badge',
      tag: 'span',
      name: 'Badge Anuncio',
      styles: {
        background: 'bg-blue-500/10',
        typography: 'text-xs font-semibold text-blue-400 tracking-wide',
        spacing: 'px-3 py-1',
        borders: 'rounded-full border border-blue-500/20',
      },
      attributes: {},
      textContent: '🚀 Nueva versión 2.0 disponible',
      children: [],
    },
    {
      id: 'hero-title',
      tag: 'h1',
      name: 'Título Principal',
      styles: {
        typography: 'text-4xl sm:text-5xl font-extrabold text-white tracking-tight',
        sizing: 'max-w-2xl',
      },
      attributes: {},
      textContent: 'Diseña interfaces sin esfuerzo con Tailwind CSS',
      children: [],
    },
    {
      id: 'hero-desc',
      tag: 'p',
      name: 'Párrafo Hero',
      styles: {
        typography: 'text-base sm:text-lg text-slate-400',
        sizing: 'max-w-xl',
      },
      attributes: {},
      textContent: 'Compón árboles jerárquicos visualmente, ajusta cada propiedad al pixel y exporta código React y HTML listo para producción.',
      children: [],
    },
    {
      id: 'hero-cta-group',
      tag: 'div',
      name: 'Grupo de Botones CTA',
      styles: {
        layout: 'flex items-center justify-center gap-4',
        spacing: 'pt-2',
      },
      attributes: {},
      children: [
        {
          id: 'hero-btn-primary',
          tag: 'button',
          name: 'Botón Empezar',
          styles: {
            background: 'bg-blue-600',
            typography: 'text-sm font-semibold text-white',
            spacing: 'px-6 py-3',
            borders: 'rounded-xl',
            effects: 'shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-all',
          },
          attributes: { type: 'button' },
          textContent: 'Comenzar Gratis',
          children: [],
        },
        {
          id: 'hero-btn-secondary',
          tag: 'button',
          name: 'Botón Documentación',
          styles: {
            background: 'bg-slate-800',
            typography: 'text-sm font-medium text-slate-200',
            spacing: 'px-6 py-3',
            borders: 'rounded-xl border border-slate-700',
            effects: 'hover:bg-slate-700 transition-colors',
          },
          attributes: { type: 'button' },
          textContent: 'Ver Documentación',
          children: [],
        },
      ],
    },
  ],
};

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'preset-form',
    name: 'Formulario Completo',
    description: 'Formulario con fieldset, leyenda, labels, inputs y botón',
    category: 'forms',
    root: DEFAULT_FORM_PRESET,
  },
  {
    id: 'preset-card',
    name: 'Tarjeta de Producto',
    description: 'Card interactiva con imagen, badge, descripción y precio',
    category: 'cards',
    root: CARD_PRESET,
  },
  {
    id: 'preset-hero',
    name: 'Hero Section Oscura',
    description: 'Cabecera moderna con degradado, badge y dos llamadas a la acción',
    category: 'hero',
    root: HERO_PRESET,
  },
];
