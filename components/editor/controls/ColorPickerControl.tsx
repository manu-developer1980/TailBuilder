'use client';

import React, { useState, useEffect } from 'react';
import { TAILWIND_COLOR_FAMILIES, SPECIAL_COLORS } from '@/lib/tailwind/colors';
import { Pipette, X, Check } from 'lucide-react';

interface ColorPickerControlProps {
  label: string;
  type: 'text' | 'bg' | 'border';
  currentClass?: string;
  onSelect: (className: string) => void;
}

export function isColorClass(cls: string, prefix: string): boolean {
  if (!cls || !cls.startsWith(prefix)) return false;
  if (cls.startsWith(`${prefix}[`)) return true;
  const suffix = cls.slice(prefix.length);
  if (SPECIAL_COLORS.some((s) => s.classSuffix === suffix)) return true;
  for (const fam of TAILWIND_COLOR_FAMILIES) {
    if (suffix.startsWith(`${fam.id}-`)) {
      const shade = suffix.slice(fam.id.length + 1);
      if (fam.shades.some((s) => s.shade === shade)) return true;
    }
  }
  return false;
}

function resolveHexFromClass(cls: string, prefix: string): string {
  if (!cls || !cls.startsWith(prefix)) return '';
  const arbitraryMatch = cls.match(/\[([^\]]+)\]/);
  if (arbitraryMatch) {
    return arbitraryMatch[1];
  }
  const clean = cls.slice(prefix.length);
  for (const fam of TAILWIND_COLOR_FAMILIES) {
    if (clean.startsWith(`${fam.id}-`)) {
      const shade = clean.slice(fam.id.length + 1);
      const found = fam.shades.find((s) => s.shade === shade);
      if (found) return found.hex;
    }
  }
  const spec = SPECIAL_COLORS.find((s) => s.classSuffix === clean);
  if (spec && spec.hex !== 'transparent' && spec.hex !== 'currentColor' && spec.hex !== 'inherit') {
    return spec.hex;
  }

  return '';
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/i.test(hex);
}

function normalizeToHex6(hex: string): string {
  if (!hex) return '#2563eb';
  const clean = hex.trim();
  if (/^#[0-9a-fA-F]{6}$/i.test(clean)) return clean;
  if (/^#[0-9a-fA-F]{3}$/i.test(clean)) {
    return `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
  }
  return '#2563eb';
}

export function ColorPickerControl({
  label,
  type,
  currentClass = '',
  onSelect,
}: ColorPickerControlProps) {
  const prefix = type === 'text' ? 'text-' : type === 'bg' ? 'bg-' : 'border-';

  // Extraer exclusivamente la clase de color real (evitando colisión con text-sm, border-2, etc.)
  const matchingClass =
    currentClass
      .split(/\s+/)
      .find((c) => isColorClass(c, prefix)) || '';

  // Determinar la familia activa si existe
  const detectFamily = () => {
    if (!matchingClass) return 'rose';
    const clean = matchingClass.slice(prefix.length);
    const family = TAILWIND_COLOR_FAMILIES.find((f) => clean.startsWith(`${f.id}-`));
    return family ? family.id : 'rose';
  };

  const [selectedFamilyId, setSelectedFamilyId] = useState<string>(detectFamily());
  const initialHex = resolveHexFromClass(matchingClass, prefix);
  const [customInputValue, setCustomInputValue] = useState<string>(initialHex);

  // Sincronizar automáticamente el campo con el valor #hex cuando cambie la clase externa
  useEffect(() => {
    const hex = resolveHexFromClass(matchingClass, prefix);
    if (hex) {
      setCustomInputValue(hex);
      const clean = matchingClass.slice(prefix.length);
      const fam = TAILWIND_COLOR_FAMILIES.find((f) => clean.startsWith(`${f.id}-`));
      if (fam) {
        setSelectedFamilyId(fam.id);
      }
    } else if (!matchingClass) {
      setCustomInputValue('');
    }
  }, [matchingClass, prefix]);

  const selectedFamily =
    TAILWIND_COLOR_FAMILIES.find((f) => f.id === selectedFamilyId) ||
    TAILWIND_COLOR_FAMILIES.find((f) => f.id === 'rose') ||
    TAILWIND_COLOR_FAMILIES[0];

  const handleSelectShade = (familyId: string, shade: string) => {
    const classToApply = `${prefix}${familyId}-${shade}`;
    if (matchingClass === classToApply) {
      onSelect(''); // Deseleccionar
      setCustomInputValue('');
    } else {
      const fam = TAILWIND_COLOR_FAMILIES.find((f) => f.id === familyId);
      const s = fam?.shades.find((item) => item.shade === shade);
      if (s) {
        setCustomInputValue(s.hex);
      }
      onSelect(classToApply);
    }
  };

  const handleSelectSpecial = (suffix: string) => {
    const classToApply = `${prefix}${suffix}`;
    if (matchingClass === classToApply) {
      onSelect('');
      setCustomInputValue('');
    } else {
      const spec = SPECIAL_COLORS.find((s) => s.classSuffix === suffix);
      if (spec && spec.hex.startsWith('#')) {
        setCustomInputValue(spec.hex);
      } else {
        setCustomInputValue(spec?.hex || suffix);
      }
      onSelect(classToApply);
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputValue.trim()) return;
    const val = customInputValue.trim();
    if (val.startsWith('#') || val.startsWith('rgb') || val.startsWith('hsl')) {
      onSelect(`${prefix}[${val}]`);
    } else if (val.startsWith(prefix)) {
      onSelect(val);
    } else if (val.startsWith('[') && val.endsWith(']')) {
      onSelect(`${prefix}${val}`);
    } else {
      onSelect(`${prefix}${val}`);
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInputValue(val);
    // Si el usuario introduce un hex completo (#xxxxxx o #xxx), aplicar en vivo inmediatamente
    if (isValidHex(val) || /^#[0-9a-fA-F]{3}$/i.test(val)) {
      onSelect(`${prefix}[${val}]`);
    }
  };

  const handleNativeColorPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setCustomInputValue(hex);
    onSelect(`${prefix}[${hex}]`);
  };

  // Color seguro para el swatch y picker nativo
  const activeHex = normalizeToHex6(
    isValidHex(customInputValue)
      ? customInputValue
      : initialHex || ''
  );

  return (
    <div className="space-y-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 overflow-hidden w-full max-w-full">
      {/* Cabecera del control */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-slate-200 truncate">{label}</span>
          {matchingClass && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 truncate max-w-[150px]">
              {matchingClass}
            </span>
          )}
        </div>

        {matchingClass && (
          <button
            type="button"
            onClick={() => {
              onSelect('');
              setCustomInputValue('');
            }}
            title="Quitar color"
            className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Colores especiales (Transparente, Blanco, Negro, etc.) con wrap fluido */}
      <div className="flex flex-wrap items-center gap-1 pb-2 border-b border-slate-800/80">
        <span className="text-[10px] font-medium text-slate-400 mr-1 flex-shrink-0">Básicos:</span>
        {SPECIAL_COLORS.map((spec) => {
          const specClass = `${prefix}${spec.classSuffix}`;
          const isSelected = matchingClass === specClass;
          return (
            <button
              key={spec.id}
              type="button"
              onClick={() => handleSelectSpecial(spec.classSuffix)}
              title={`${spec.name} (${specClass})`}
              className={`h-5 px-1.5 rounded text-[10px] font-medium transition-all flex items-center gap-1 border flex-shrink-0 ${
                isSelected
                  ? 'border-blue-500 bg-blue-600 text-white shadow-sm'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-slate-600 inline-block flex-shrink-0"
                style={{ backgroundColor: spec.hex === 'transparent' ? undefined : spec.hex }}
              />
              <span className="truncate">{spec.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selector de Familias de Color (Grid de 8 columnas adaptable) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Familias ({TAILWIND_COLOR_FAMILIES.length}):</span>
          <span className="font-semibold text-slate-200 capitalize">
            {selectedFamily.name}
          </span>
        </div>

        <div className="grid grid-cols-8 gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
          {TAILWIND_COLOR_FAMILIES.map((fam) => {
            const shade500 = fam.shades.find((s) => s.shade === '500') || fam.shades[5];
            const isFamActive = selectedFamilyId === fam.id;

            return (
              <button
                key={fam.id}
                type="button"
                onClick={() => setSelectedFamilyId(fam.id)}
                title={`Familia ${fam.name}`}
                className={`group relative h-6 rounded transition-all flex items-center justify-center ${
                  isFamActive
                    ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-slate-950 scale-110 z-10'
                    : 'hover:scale-105 opacity-85 hover:opacity-100'
                }`}
                style={{ backgroundColor: shade500.hex }}
              >
                {isFamActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Escala completa de tonalidades (50 a 950) en grid de 6 columnas */}
      {selectedFamily && (
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Tonalidades ({selectedFamily.name}):</span>
            <span className="font-mono text-[10px] text-slate-500">50 - 950</span>
          </div>

          <div className="grid grid-cols-6 gap-1 p-1.5 rounded-lg bg-slate-900 border border-slate-800">
            {selectedFamily.shades.map((s) => {
              const shadeClass = `${prefix}${selectedFamily.id}-${s.shade}`;
              const isSelected = matchingClass === shadeClass;
              const isDark = parseInt(s.shade, 10) >= 500;

              return (
                <button
                  key={s.shade}
                  type="button"
                  onClick={() => handleSelectShade(selectedFamily.id, s.shade)}
                  title={`${shadeClass} (${s.hex})`}
                  className={`group relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded transition-all ${
                    isSelected
                      ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-slate-950 z-10 shadow-sm'
                      : 'hover:ring-1 hover:ring-slate-400'
                  }`}
                  style={{ backgroundColor: s.hex }}
                >
                  <span
                    className={`text-[10px] font-mono font-bold leading-none ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {s.shade}
                  </span>
                  {isSelected && (
                    <Check
                      className={`w-3 h-3 mt-0.5 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Override Manual / Color Arbitrario (Hex, RGB, etc.) sincronizado en vivo */}
      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Personalizado / Valor Hex:</span>
          {isValidHex(customInputValue) && (
            <span
              className="w-3 h-3 rounded-full border border-slate-600 inline-block shadow-sm"
              style={{ backgroundColor: customInputValue }}
            />
          )}
        </div>

        <form onSubmit={handleApplyCustom} className="flex items-center gap-1.5">
          {/* Cuentagotas y selector nativo sincronizado */}
          <label
            title="Seleccionar con cuentagotas nativo"
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-slate-700 hover:border-blue-500 cursor-pointer text-slate-300 hover:text-white transition-colors flex-shrink-0 relative overflow-hidden"
            style={{ backgroundColor: activeHex }}
          >
            <Pipette className="w-3.5 h-3.5 text-white drop-shadow-md z-10" />
            <input
              type="color"
              className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
              value={activeHex}
              onChange={handleNativeColorPick}
              onInput={handleNativeColorPick}
            />
          </label>

          <input
            type="text"
            placeholder="#614242 o [#614242]"
            value={customInputValue}
            onChange={handleCustomInputChange}
            className="flex-1 min-w-0 py-1 px-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={!customInputValue.trim()}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors flex-shrink-0"
          >
            Aplicar
          </button>
        </form>
      </div>
    </div>
  );
}
