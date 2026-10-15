import React from 'react';
import { Sparkles, Home, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';

interface HeaderProps {
  hasAnalysis: boolean;
  onReset: () => void;
  onOpenGuide: () => void;
  currentZenScore?: number;
}

export const Header: React.FC<HeaderProps> = ({
  hasAnalysis,
  onReset,
  onOpenGuide,
  currentZenScore,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-stone-900 font-['Outfit',sans-serif]">
                ClutterFree<span className="text-amber-600">AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Gemini 4 Argon
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              AI Room Spatial Organization & Decluttering Studio
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {hasAnalysis && currentZenScore !== undefined && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-lg border border-stone-200">
              <span className="text-xs font-medium text-stone-600">Zen Score:</span>
              <span className="text-sm font-bold text-amber-600">{currentZenScore}/100</span>
            </div>
          )}

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition"
            aria-label="How it works guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>

          {hasAnalysis && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-lg transition border border-stone-300"
              aria-label="Upload new room"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Room</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
