import React from 'react';
import { Sparkles, ShieldAlert, ArrowUpRight, CheckCircle2, Clock, Zap } from 'lucide-react';
import { calculateClutterBadge, ProgressStats } from '../utils/declutter.js';

interface ZenScoreOverviewProps {
  initialZenScore: number;
  progress: ProgressStats;
  roomType: string;
  clutterLevel: string;
  primaryBlocker: string;
  summary: string;
}

export const ZenScoreOverview: React.FC<ZenScoreOverviewProps> = ({
  initialZenScore,
  progress,
  roomType,
  clutterLevel,
  primaryBlocker,
  summary,
}) => {
  const currentBadge = calculateClutterBadge(progress.currentZenScore);
  const scoreDiff = progress.currentZenScore - initialZenScore;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Score Radial / Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-stone-50 rounded-xl border border-stone-200/60 text-center">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
            Room Spatial Harmony
          </span>

          <div className="relative w-32 h-32 flex items-center justify-center my-2">
            {/* SVG circle progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                className="text-stone-200"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress.currentZenScore / 100)}`}
                strokeLinecap="round"
                className="text-amber-500 transition-all duration-700 ease-out"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-stone-900 tracking-tight font-['Outfit',sans-serif]">
                {progress.currentZenScore}
              </span>
              <span className="text-[10px] text-stone-500 font-semibold uppercase">
                / 100 Zen
              </span>
            </div>
          </div>

          <div className="mt-1">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentBadge.bgClass} ${currentBadge.colorClass} ${currentBadge.borderClass}`}
            >
              {currentBadge.label}
            </span>
            {scoreDiff > 0 && (
              <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center justify-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{scoreDiff} Zen gained from completed tasks!</span>
              </p>
            )}
          </div>
        </div>

        {/* Narrative & Primary Blocker */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h2 className="text-xl font-extrabold text-stone-900 font-['Outfit',sans-serif]">
                {roomType}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold border border-stone-200">
                Load: {clutterLevel}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Primary Blocker Card */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                Primary Spatial Bottleneck
              </span>
              <p className="text-xs font-medium text-stone-800 mt-0.5">
                {primaryBlocker}
              </p>
            </div>
          </div>

          {/* Micro Progress Bar & Stats */}
          <div className="pt-2 border-t border-stone-100 grid grid-cols-3 gap-2 text-center sm:text-left">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Completed</span>
              <span className="text-sm font-bold text-stone-800 flex items-center gap-1 sm:justify-start justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {progress.completedTasks} / {progress.totalTasks} Tasks
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Est. Time Left</span>
              <span className="text-sm font-bold text-stone-800 flex items-center gap-1 sm:justify-start justify-center">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                ~{progress.minutesRemaining} min
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Quick Momentum</span>
              <span className="text-sm font-bold text-stone-800 flex items-center gap-1 sm:justify-start justify-center">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                {progress.percentage}% Done
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
