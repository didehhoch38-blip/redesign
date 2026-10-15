import { DeclutterTask, RoomAnalysisResult, DecisionBin } from '../types/declutter.js';

export interface ProgressStats {
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  minutesCompleted: number;
  minutesRemaining: number;
  currentZenScore: number;
}

export function calculateClutterBadge(zenScore: number): {
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  description: string;
} {
  const score = Math.max(0, Math.min(100, zenScore));
  if (score >= 80) {
    return {
      label: 'Minimalist & Zen',
      colorClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-200',
      description: 'Clean spatial flow with minimal clutter points.',
    };
  } else if (score >= 60) {
    return {
      label: 'Light Disorganization',
      colorClass: 'text-teal-700',
      bgClass: 'bg-teal-50',
      borderClass: 'border-teal-200',
      description: 'Functional room with several active drop zones to clear.',
    };
  } else if (score >= 35) {
    return {
      label: 'Moderate Clutter Load',
      colorClass: 'text-amber-700',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-200',
      description: 'Surfaces obstructed; needs systematic sorting and dedicated storage.',
    };
  } else {
    return {
      label: 'High Density / Overwhelming',
      colorClass: 'text-rose-700',
      bgClass: 'bg-rose-50',
      borderClass: 'border-rose-200',
      description: 'Multiple overflowing zones. Break down into micro 5-min sessions.',
    };
  }
}

export function calculateProgress(tasks: DeclutterTask[], initialZenScore: number = 40): ProgressStats {
  if (!tasks || tasks.length === 0) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      percentage: 0,
      minutesCompleted: 0,
      minutesRemaining: 0,
      currentZenScore: initialZenScore,
    };
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const percentage = Math.round((completedTasks / totalTasks) * 100);

  const minutesCompleted = tasks
    .filter(t => t.completed)
    .reduce((acc, t) => acc + (t.estimatedMinutes || 5), 0);

  const minutesRemaining = tasks
    .filter(t => !t.completed)
    .reduce((acc, t) => acc + (t.estimatedMinutes || 5), 0);

  // Zen score improves towards 100 as tasks complete
  const scoreGap = 100 - initialZenScore;
  const scoreGain = Math.round((completedTasks / totalTasks) * scoreGap);
  const currentZenScore = Math.min(100, initialZenScore + scoreGain);

  return {
    totalTasks,
    completedTasks,
    percentage,
    minutesCompleted,
    minutesRemaining,
    currentZenScore,
  };
}

export function groupTasksByDecisionBin(tasks: DeclutterTask[]): Record<DecisionBin, DeclutterTask[]> {
  const bins: Record<DecisionBin, DeclutterTask[]> = {
    keep: [],
    donate: [],
    sell: [],
    recycle: [],
    trash: [],
  };

  tasks.forEach(task => {
    const bin = task.decisionBin || 'keep';
    if (bins[bin]) {
      bins[bin].push(task);
    } else {
      bins.keep.push(task);
    }
  });

  return bins;
}

export function generateExportSummary(
  analysis: RoomAnalysisResult, 
  tasks: DeclutterTask[]
): string {
  const progress = calculateProgress(tasks, analysis.zenScore);
  const completedList = tasks.filter(t => t.completed).map(t => `- [x] ${t.title} (${t.zone})`).join('\n');
  const pendingList = tasks.filter(t => !t.completed).map(t => `- [ ] ${t.title} (~${t.estimatedMinutes}m) - ${t.zone}`).join('\n');

  return `# ClutterFree AI Blueprint: ${analysis.roomType}
**Initial Zen Score:** ${analysis.zenScore}/100 | **Current Zen Score:** ${progress.currentZenScore}/100
**Progress:** ${progress.completedTasks} of ${progress.totalTasks} tasks complete (${progress.percentage}%)

### Summary & Spatial Vibe
${analysis.summary}

### Primary Blocker
${analysis.primaryBlocker}

### Hotspots Identified (${analysis.hotspots.length})
${analysis.hotspots.map(h => `* **${h.name}** [${h.severity.toUpperCase()}]: ${h.description} (Items: ${h.itemsIdentified.join(', ')})`).join('\n')}

### Completed Tasks
${completedList || '*(None yet)*'}

### Pending Action Items
${pendingList || '*(All tasks completed! Enjoy your organized space!)*'}

### Recommended Storage Solutions
${analysis.storageSolutions.map(s => `* **${s.item}** (${s.estimatedPriceRange}): ${s.purpose} - Tip: ${s.placementTip}`).join('\n')}

### Daily Maintenance Habits
${analysis.dailyHabits.map(h => `* ${h}`).join('\n')}
`;
}
