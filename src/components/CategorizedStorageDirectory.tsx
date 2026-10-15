import React, { useState } from 'react';
import { 
  Briefcase, 
  BookOpen, 
  Utensils, 
  Shirt, 
  Layers, 
  Search, 
  Lightbulb, 
  DollarSign, 
  Sparkles, 
  MessageSquare,
  Archive,
  Recycle,
  Trash2,
  HeartHandshake
} from 'lucide-react';
import { CategorizedItemSolution, ItemCategory, RoomAnalysisResult } from '../types/declutter.js';
import { getItemSolutionsForRoom } from '../utils/categorizedItemsData.js';

interface CategorizedStorageDirectoryProps {
  analysis?: RoomAnalysisResult | null;
  onAskChatAboutItem?: (itemName: string) => void;
}

export const CategorizedStorageDirectory: React.FC<CategorizedStorageDirectoryProps> = ({
  analysis,
  onAskChatAboutItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allItems = getItemSolutionsForRoom(analysis);

  const categoryFilters = [
    { id: 'all', label: 'All Items', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'office_supplies', label: 'Office Supplies & Tech', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'books_paper', label: 'Books & Paperwork', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'kitchenware', label: 'Kitchenware & Pantry', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'clothing', label: 'Clothing & Wardrobe', icon: <Shirt className="w-3.5 h-3.5" /> },
  ];

  const filteredItems = allItems.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recommendedOrganizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organizingStrategy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getActionBinBadge = (bin: string) => {
    switch (bin) {
      case 'recycle':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            <Recycle className="w-3 h-3" />
            Recycle / E-Waste
          </span>
        );
      case 'trash':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <Trash2 className="w-3 h-3" />
            Trash
          </span>
        );
      case 'donate':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            <HeartHandshake className="w-3 h-3" />
            Donate
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            <Archive className="w-3 h-3" />
            Keep & Store
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      {/* Title & Search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2 font-['Outfit',sans-serif]">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Categorized Storage Solutions & Item Organizer</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Tactical organizer gear, space-saving strategies, and placement tips for every common room item.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items (e.g. cables, shoes, spices, books)..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categoryFilters.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
            }`}
            aria-label={`Filter by ${cat.label}`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Grid of Item Solutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12 text-stone-400 text-xs">
            No items found matching your filter or query.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 hover:bg-white hover:border-amber-300 hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                    {item.itemName}
                  </h4>
                  {getActionBinBadge(item.actionBin)}
                </div>

                <div className="mb-3">
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block mb-1">
                    {item.recommendedOrganizer}
                  </span>
                  <div className="text-[11px] font-semibold text-stone-500">
                    Est. Cost: <span className="text-stone-800">{item.estimatedPriceRange}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                  {item.organizingStrategy}
                </p>
              </div>

              <div className="pt-2.5 border-t border-stone-200/60 space-y-2">
                <div className="text-[11px] text-stone-700 flex items-start gap-1.5 bg-white p-2 rounded-lg border border-stone-100">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Placement:</strong> {item.placementTip}
                  </span>
                </div>

                {onAskChatAboutItem && (
                  <button
                    onClick={() => onAskChatAboutItem(item.itemName)}
                    className="w-full py-1.5 text-[11px] font-bold text-stone-700 hover:text-amber-700 bg-stone-100 hover:bg-amber-50 rounded-lg transition flex items-center justify-center gap-1.5"
                    aria-label={`Ask Gemini organizer about ${item.itemName}`}
                  >
                    <MessageSquare className="w-3 h-3 text-amber-600" />
                    <span>Ask AI about {item.itemName}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
