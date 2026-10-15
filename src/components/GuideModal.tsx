import React from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake, Layers, Bot } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          aria-label="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-extrabold text-stone-900 font-['Outfit',sans-serif]">
            Decluttering Guide & Method
          </h2>
        </div>
        <p className="text-xs text-stone-500 mb-6">
          Everything you need to know to transform cluttered spaces into calm, productive havens.
        </p>

        <div className="space-y-6 text-xs text-stone-700 leading-relaxed">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <span>Snap & Upload Your Room</span>
            </h3>
            <p className="text-stone-600">
              Capture a wide angle of the whole room or a tight shot of a specific messy zone (desk, closet, kitchen counter). Gemini 4 Argon analyzes spatial geometry and identifies clutter hotspots.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-stone-800 text-white text-[11px] font-bold flex items-center justify-center">
                2
              </span>
              <span>The 5-Bin Triage System</span>
            </h3>
            <p className="text-stone-600 mb-2">
              Avoid decision paralysis by placing items into 5 distinct physical bins:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-white rounded-lg border border-stone-200">
                <strong>1. Keep & Assign:</strong> Daily essentials with a dedicated home.
              </div>
              <div className="p-2 bg-white rounded-lg border border-stone-200">
                <strong>2. Donate:</strong> Good condition items you haven't used in 6 months.
              </div>
              <div className="p-2 bg-white rounded-lg border border-stone-200">
                <strong>3. Sell:</strong> High value gadgets or clothes worth $20+.
              </div>
              <div className="p-2 bg-white rounded-lg border border-stone-200">
                <strong>4. Recycle / E-Waste:</strong> Old cords, paper piles, batteries.
              </div>
              <div className="p-2 bg-white rounded-lg border border-stone-200 sm:col-span-2">
                <strong>5. Trash:</strong> Broken, expired, or non-recyclable clutter.
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 mb-1">
              <Bot className="w-4 h-4 text-amber-600" />
              <span>Multi-Turn Gemini Chatbot Roles</span>
            </h3>
            <p className="text-stone-600 mb-2">
              Switch models depending on your needs:
            </p>
            <ul className="space-y-1 text-[11px] list-disc list-inside text-stone-600">
              <li>
                <strong>gemini-4-argon:</strong> Best for deep architectural flow, custom cabinet layouts, and complex spatial restructuring.
              </li>
              <li>
                <strong>gemini-3.8-flash:</strong> Ideal for general decluttering questions, item triage, and KonMari methods.
              </li>
              <li>
                <strong>gemini-3.1-flash-lite:</strong> Lightning-fast answers for quick tips, bin classifications, and rapid queries.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            aria-label="Got it"
          >
            Got it, Let's Declutter!
          </button>
        </div>
      </div>
    </div>
  );
};
