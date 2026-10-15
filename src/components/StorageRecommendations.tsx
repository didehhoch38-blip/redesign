import React from 'react';
import { Package, Compass, CheckCircle, Repeat, Lightbulb } from 'lucide-react';
import { StorageSolution } from '../types/declutter.js';

interface StorageRecommendationsProps {
  storageSolutions: StorageSolution[];
  spatialFlowTips: string[];
  dailyHabits: string[];
}

export const StorageRecommendations: React.FC<StorageRecommendationsProps> = ({
  storageSolutions,
  spatialFlowTips,
  dailyHabits,
}) => {
  return (
    <div className="space-y-6">
      {/* Recommended Storage Gear */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2 font-['Outfit',sans-serif]">
            <Package className="w-4 h-4 text-amber-600" />
            <span>Targeted Storage Solutions & Organizers</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Sensible containers and organizers specifically suited to solve this room's clutter hotspots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {storageSolutions.map((solution) => (
            <div
              key={solution.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 hover:bg-white hover:border-amber-300 hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-stone-900">{solution.item}</h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    {solution.estimatedPriceRange}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mb-2.5">{solution.purpose}</p>
              </div>

              <div className="pt-2 border-t border-stone-200/60 text-[11px] text-stone-700 flex items-start gap-1.5 bg-amber-50/50 p-2 rounded-lg">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Placement Tip:</strong> {solution.placementTip}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spatial Flow & Daily Habits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spatial Flow Tips */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
          <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-2 font-['Outfit',sans-serif] mb-3">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Spatial Flow & Ergonomics</span>
          </h3>
          <ul className="space-y-2.5">
            {spatialFlowTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Daily Maintenance Habits */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
          <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-2 font-['Outfit',sans-serif] mb-3">
            <Repeat className="w-4 h-4 text-emerald-600" />
            <span>Zero-Effort Daily Reset Habits</span>
          </h3>
          <ul className="space-y-2.5">
            {dailyHabits.map((habit, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{habit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
