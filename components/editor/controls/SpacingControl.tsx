'use client';

import React, { useState } from 'react';
import { PADDING_OPTIONS, MARGIN_OPTIONS } from '@/lib/tailwind/dictionary';
import { Sparkles, X } from 'lucide-react';

interface SpacingControlProps {
  currentClasses?: string;
  onUpdate: (classes: string) => void;
}

export function SpacingControl({ currentClasses = '', onUpdate }: SpacingControlProps) {
  const classList = currentClasses.split(/\s+/).filter(Boolean);

  const paddingVal = classList.find((c) => /^p(x|y|t|b|l|r)?(-.*)?$/.test(c) && !c.startsWith('pointer-')) || '';
  const marginVal = classList.find((c) => /^-?m(x|y|t|b|l|r)?(-.*)?$/.test(c)) || '';

  const [customP, setCustomP] = useState<string>('');
  const [customM, setCustomM] = useState<string>('');
  const [showCustomP, setShowCustomP] = useState<boolean>(paddingVal.includes('['));
  const [showCustomM, setShowCustomM] = useState<boolean>(marginVal.includes('['));

  const handlePaddingChange = (newP: string) => {
    const filtered = classList.filter((c) => !/^p(x|y|t|b|l|r)?(-.*)?$/.test(c) || c.startsWith('pointer-'));
    if (newP) filtered.push(newP);
    onUpdate(filtered.join(' '));
  };

  const handleMarginChange = (newM: string) => {
    const filtered = classList.filter((c) => !/^-?m(x|y|t|b|l|r)?(-.*)?$/.test(c));
    if (newM) filtered.push(newM);
    onUpdate(filtered.join(' '));
  };

  const applyCustomP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customP.trim()) return;
    const clean = customP.trim();
    const finalVal = clean.startsWith('p') ? clean : clean.startsWith('[') ? `p${clean}` : `p-[${clean}]`;
    handlePaddingChange(finalVal);
  };

  const applyCustomM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customM.trim()) return;
    const clean = customM.trim();
    const finalVal = clean.startsWith('m') || clean.startsWith('-m') ? clean : clean.startsWith('[') ? `m${clean}` : `m-[${clean}]`;
    handleMarginChange(finalVal);
  };

  return (
    <div className="space-y-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
      {/* Selector de Padding */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-slate-300">
          <span>Relleno (Padding)</span>
          <div className="flex items-center gap-1.5">
            {paddingVal && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                {paddingVal}
              </span>
            )}
            {paddingVal && (
              <button
                type="button"
                onClick={() => handlePaddingChange('')}
                className="text-slate-500 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <select
          value={paddingVal}
          onChange={(e) => handlePaddingChange(e.target.value)}
          className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Sin relleno (p-0)</option>
          {PADDING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          {paddingVal.includes('[') && (
            <option value={paddingVal}>★ Arbitrario: {paddingVal}</option>
          )}
        </select>

        {!showCustomP ? (
          <button
            type="button"
            onClick={() => setShowCustomP(true)}
            className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Padding arbitrario manual [..]</span>
          </button>
        ) : (
          <form onSubmit={applyCustomP} className="flex items-center gap-1.5 pt-1">
            <span className="font-mono text-[11px] text-slate-400">p-[</span>
            <input
              type="text"
              placeholder="18px o 1.5rem"
              value={customP}
              onChange={(e) => setCustomP(e.target.value)}
              className="flex-1 py-0.5 px-2 rounded bg-slate-900 border border-slate-700 font-mono text-xs text-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="font-mono text-[11px] text-slate-400">]</span>
            <button
              type="submit"
              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium rounded transition-colors"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => setShowCustomP(false)}
              className="text-slate-500 hover:text-slate-300 p-1"
            >
              <X className="w-3 h-3" />
            </button>
          </form>
        )}
      </div>

      <hr className="border-slate-800/80" />

      {/* Selector de Margen */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-slate-300">
          <span>Margen Exterior</span>
          <div className="flex items-center gap-1.5">
            {marginVal && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                {marginVal}
              </span>
            )}
            {marginVal && (
              <button
                type="button"
                onClick={() => handleMarginChange('')}
                className="text-slate-500 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <select
          value={marginVal}
          onChange={(e) => handleMarginChange(e.target.value)}
          className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Sin margen (m-0)</option>
          {MARGIN_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          {marginVal.includes('[') && (
            <option value={marginVal}>★ Arbitrario: {marginVal}</option>
          )}
        </select>

        {!showCustomM ? (
          <button
            type="button"
            onClick={() => setShowCustomM(true)}
            className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Margen arbitrario manual [..]</span>
          </button>
        ) : (
          <form onSubmit={applyCustomM} className="flex items-center gap-1.5 pt-1">
            <span className="font-mono text-[11px] text-slate-400">m-[</span>
            <input
              type="text"
              placeholder="24px o 2rem"
              value={customM}
              onChange={(e) => setCustomM(e.target.value)}
              className="flex-1 py-0.5 px-2 rounded bg-slate-900 border border-slate-700 font-mono text-xs text-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="font-mono text-[11px] text-slate-400">]</span>
            <button
              type="submit"
              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium rounded transition-colors"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => setShowCustomM(false)}
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
