import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Zap, 
  Layers, 
  Download, 
  Copy, 
  Check, 
  Share2,
  Trash2,
  HeartHandshake,
  Tag,
  Recycle,
  Archive
} from 'lucide-react';
import { DeclutterTask, DecisionBin, RoomAnalysisResult } from '../types/declutter.js';
import { generateExportSummary } from '../utils/declutter.js';

interface ActionChecklistProps {
  tasks: DeclutterTask[];
  onToggleTask: (taskId: string) => void;
  analysis: RoomAnalysisResult;
}

export const ActionChecklist: React.FC<ActionChecklistProps> = ({
  tasks,
  onToggleTask,
  analysis,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'quick_win' | 'pending' | 'completed'>('all');
  const [copied, setCopied] = useState<boolean>(false);

  const getBinBadge = (bin: DecisionBin) => {
    switch (bin) {
      case 'donate':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            <HeartHandshake className="w-3 h-3" />
            Donate
          </span>
        );
      case 'sell':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Tag className="w-3 h-3" />
            Sell
          </span>
        );
      case 'recycle':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            <Recycle className="w-3 h-3" />
            Recycle
          </span>
        );
      case 'trash':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <Trash2 className="w-3 h-3" />
            Trash
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

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'quick_win') return t.category === 'quick_win';
    if (activeFilter === 'pending') return !t.completed;
    if (activeFilter === 'completed') return t.completed;
    return true;
  });

  const handleCopyMarkdown = () => {
    const md = generateExportSummary(analysis, tasks);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateExportSummary(analysis, tasks);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `declutter-blueprint-${analysis.roomType.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
      {/* Header & Export toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2 font-['Outfit',sans-serif]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Interactive Decluttering Checklist</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Check off items as you tackle them to see your room Zen score increase in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition"
            aria-label="Copy declutter plan to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition shadow-xs"
            aria-label="Download declutter plan as markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .md</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pt-4 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeFilter === 'all'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
          aria-label="Filter all tasks"
        >
          All Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setActiveFilter('quick_win')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
            activeFilter === 'quick_win'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
          aria-label="Filter quick wins"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Quick Wins &lt; 5m ({tasks.filter((t) => t.category === 'quick_win').length})</span>
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeFilter === 'pending'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
          aria-label="Filter pending tasks"
        >
          Pending ({tasks.filter((t) => !t.completed).length})
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeFilter === 'completed'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
          aria-label="Filter completed tasks"
        >
          Completed ({tasks.filter((t) => t.completed).length})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3 mt-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs font-medium">
            No tasks match this filter.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isQuickWin = task.category === 'quick_win';
            return (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  task.completed
                    ? 'bg-stone-50 border-stone-200 text-stone-400 opacity-80'
                    : isQuickWin
                    ? 'bg-amber-50/30 border-amber-200/80 hover:border-amber-400 hover:shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-xs'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-stone-400 hover:text-emerald-600 transition"
                  aria-label={task.completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as completed`}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300 hover:text-amber-500 shrink-0" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`font-semibold text-xs sm:text-sm ${
                        task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Zone & Category Tags */}
                    <span className="text-[10px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                      {task.zone}
                    </span>

                    {getBinBadge(task.decisionBin)}

                    {isQuickWin && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        <Zap className="w-3 h-3 text-amber-600" />
                        5-Min Win
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-500 ml-auto">
                      <Clock className="w-3 h-3 text-stone-400" />
                      ~{task.estimatedMinutes}m
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {task.instructions}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
