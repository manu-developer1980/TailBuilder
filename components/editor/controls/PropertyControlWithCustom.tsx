'use client';

import React, { useState } from 'react';
import { StyleOption } from '@/lib/tailwind/dictionary';
import { Check, X, Sparkles } from 'lucide-react';

interface PropertyControlWithCustomProps {
  label: string;
  prefix: string; // e.g. 'max-w-', 'w-', 'h-', 'p-', 'rounded-', etc.
  options: StyleOption[];
  currentClass?: string;
  onUpdate: (newClass: string) => void;
  placeholder?: string;
}

export function PropertyControlWithCustom({
  label,
  prefix,
  options,
  currentClass = '',
  onUpdate,
  placeholder = 'ej. [30px] o 250px',
}: PropertyControlWithCustomProps) {
  // Encontrar la clase que coincide con el prefijo o con prefix[..]
  const classList = currentClass.split(/\s+/).filter(Boolean);
  const matched = classList.find(
    (c) =>
      c === prefix.replace(/-$/, '') ||
      c.startsWith(prefix) ||
      (prefix.startsWith('-') && c.startsWith(prefix))
  ) || '';

  const isArbitrary = matched.includes('[') && matched.includes(']');
  const arbitraryInner = isArbitrary
    ? matched.substring(matched.indexOf('[') + 1, matched.lastIndexOf(']'))
    : '';

  const [customVal, setCustomVal] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(isArbitrary);

  const handleSelectPreset = (value: string) => {
    onUpdate(value);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVal.trim()) return;
    const clean = customVal.trim();
    // Si el usuario introduce "[30px]", usar prefix[30px]
    if (clean.startsWith('[') && clean.endsWith(']')) {
      onUpdate(`${prefix}${clean}`);
    } else {
      onUpdate(`${prefix}[${clean}]`);
    }
  };

  const handleClear = () => {
    onUpdate('');
    setCustomVal('');
  };

  return (
    <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800/80">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-300">{label}</span>
        <div className="flex items-center gap-1.5">
          {matched && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
              {matched}
            </span>
          )}
          {matched && (
            <button
              type="button"
              onClick={handleClear}
              title="Restablecer"
              className="text-slate-500 hover:text-red-400 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Selector de Presets */}
      <select
        value={matched}
        onChange={(e) => handleSelectPreset(e.target.value)}
        className="w-full py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Por defecto / Ninguno</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        {isArbitrary && (
          <option value={matched}>
            ★ Arbitrario: {matched}
          </option>
        )}
      </select>

      {/* Input de Valor Arbitrario Custom (ej: max-w-[30px]) */}
      <div className="pt-1">
        {!showCustomInput && !isArbitrary ? (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Valor arbitrario manual [..]</span>
          </button>
        ) : (
          <form onSubmit={handleApplyCustom} className="flex items-center gap-1.5 pt-1">
            <span className="font-mono text-[11px] text-slate-400 flex-shrink-0">
              {prefix}[
            </span>
            <input
              type="text"
              value={customVal || arbitraryInner}
              onChange={(e) => setCustomVal(e.target.value)}
              placeholder={placeholder.replace(/^[a-z-]+\[|\]$/g, '')}
              className="flex-1 py-0.5 px-2 rounded bg-slate-900 border border-slate-700 font-mono text-xs text-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="font-mono text-[11px] text-slate-400 flex-shrink-0">
              ]
            </span>
            <button
              type="submit"
              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium rounded transition-colors flex-shrink-0"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => setShowCustomInput(false)}
              className="text-slate-500 hover:text-slate-300 p-1"
            >
              <X className="w-3 h-3" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
