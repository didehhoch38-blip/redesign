import React from 'react';
import { HeartHandshake, Tag, Recycle, Trash2, Archive, ArrowRight, Sparkles } from 'lucide-react';
import { DeclutterTask, DecisionBin } from '../types/declutter.js';
import { groupTasksByDecisionBin } from '../utils/declutter.js';

interface DecisionBinsViewProps {
  tasks: DeclutterTask[];
}

export const DecisionBinsView: React.FC<DecisionBinsViewProps> = ({ tasks }) => {
  const bins = groupTasksByDecisionBin(tasks);

  const binConfigs: {
    key: DecisionBin;
    title: string;
    description: string;
    icon: React.ReactNode;
    colorClasses: string;
    badgeClasses: string;
    actionAdvice: string;
  }[] = [
    {
      key: 'keep',
      title: 'Keep & Store',
      description: 'Items of genuine utility or joy that belong in this room.',
      icon: <Archive className="w-4 h-4" />,
      colorClasses: 'border-stone-200 bg-stone-50/50',
      badgeClasses: 'bg-stone-200 text-stone-800',
      actionAdvice: 'Assign a dedicated container or shelf zone. Group like items together.',
    },
    {
      key: 'donate',
      title: 'Donate',
      description: 'Quality items you no longer use that can help someone else.',
      icon: <HeartHandshake className="w-4 h-4 text-indigo-600" />,
      colorClasses: 'border-indigo-100 bg-indigo-50/30',
      badgeClasses: 'bg-indigo-100 text-indigo-800',
      actionAdvice: 'Box up and schedule a pickup or drop off at Goodwill, Salvation Army, or local community centers.',
    },
    {
      key: 'sell',
      title: 'Sell',
      description: 'Valuable electronics, branded clothes, or functional decor.',
      icon: <Tag className="w-4 h-4 text-emerald-600" />,
      colorClasses: 'border-emerald-100 bg-emerald-50/30',
      badgeClasses: 'bg-emerald-100 text-emerald-800',
      actionAdvice: 'Snap 3 clear photos and list on Facebook Marketplace, eBay, or Poshmark within 48 hours.',
    },
    {
      key: 'recycle',
      title: 'Recycle / E-Waste',
      description: 'Paperwork, broken cables, old batteries, cardboard.',
      icon: <Recycle className="w-4 h-4 text-teal-600" />,
      colorClasses: 'border-teal-100 bg-teal-50/30',
      badgeClasses: 'bg-teal-100 text-teal-800',
      actionAdvice: 'Shred sensitive mail; take tangled cords and batteries to Best Buy or town e-waste drop-off.',
    },
    {
      key: 'trash',
      title: 'Trash',
      description: 'Damaged, expired, or non-repairable items.',
      icon: <Trash2 className="w-4 h-4 text-rose-600" />,
      colorClasses: 'border-rose-100 bg-rose-50/30',
      badgeClasses: 'bg-rose-100 text-rose-800',
      actionAdvice: 'Bag directly and remove immediately from the room to prevent second-guessing.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
      <div className="mb-6">
        <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2 font-['Outfit',sans-serif]">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>The 5-Bin Sorting System</span>
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Eliminate decision paralysis by triaging your room's items into distinct physical destinations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {binConfigs.map((bin) => {
          const items = bins[bin.key] || [];
          return (
            <div
              key={bin.key}
              className={`p-4 rounded-xl border flex flex-col justify-between ${bin.colorClasses}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {bin.icon}
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">{bin.title}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${bin.badgeClasses}`}>
                    {items.length} {items.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mb-3">{bin.description}</p>

                {/* Items in this bin */}
                <div className="space-y-1.5 mb-3">
                  {items.length === 0 ? (
                    <p className="text-[11px] text-stone-400 italic">No items triaged to this bin yet.</p>
                  ) : (
                    items.map((t) => (
                      <div
                        key={t.id}
                        className={`text-xs p-2 rounded-lg bg-white border border-stone-200/80 shadow-2xs ${
                          t.completed ? 'line-through text-stone-400 opacity-70' : 'text-stone-800'
                        }`}
                      >
                        <span className="font-medium">{t.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200/60 text-[10px] text-stone-600">
                <span className="font-bold text-stone-700">Action Tip: </span>
                {bin.actionAdvice}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
