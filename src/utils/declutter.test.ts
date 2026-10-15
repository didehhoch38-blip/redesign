import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateClutterBadge, 
  calculateProgress, 
  groupTasksByDecisionBin, 
  generateExportSummary 
} from './declutter.ts';
import { DeclutterTask, RoomAnalysisResult } from '../types/declutter.ts';

test('calculateClutterBadge assigns correct labels and colors across score thresholds', () => {
  const highBadge = calculateClutterBadge(85);
  assert.equal(highBadge.label, 'Minimalist & Zen');
  assert.match(highBadge.colorClass, /emerald/);

  const midBadge = calculateClutterBadge(65);
  assert.equal(midBadge.label, 'Light Disorganization');

  const moderateBadge = calculateClutterBadge(45);
  assert.equal(moderateBadge.label, 'Moderate Clutter Load');

  const lowBadge = calculateClutterBadge(20);
  assert.equal(lowBadge.label, 'High Density / Overwhelming');
  assert.match(lowBadge.colorClass, /rose/);
});

test('calculateProgress tracks task completion, percentages, and score gains', () => {
  const sampleTasks: DeclutterTask[] = [
    {
      id: '1',
      title: 'Toss empty coffee cups',
      zone: 'Desk',
      estimatedMinutes: 5,
      category: 'quick_win',
      decisionBin: 'trash',
      instructions: 'Recycle paper cups and wash ceramic mugs.',
      completed: true,
    },
    {
      id: '2',
      title: 'Bundle loose power cords',
      zone: 'Floor',
      estimatedMinutes: 15,
      category: 'storage_setup',
      decisionBin: 'keep',
      instructions: 'Use velcro ties.',
      completed: false,
    },
  ];

  const stats = calculateProgress(sampleTasks, 40);
  assert.equal(stats.totalTasks, 2);
  assert.equal(stats.completedTasks, 1);
  assert.equal(stats.percentage, 50);
  assert.equal(stats.minutesCompleted, 5);
  assert.equal(stats.minutesRemaining, 15);
  // Score gap: 100 - 40 = 60. 50% completed -> +30 -> 70
  assert.equal(stats.currentZenScore, 70);
});

test('groupTasksByDecisionBin partitions items properly into keep, donate, sell, recycle, trash', () => {
  const sampleTasks: DeclutterTask[] = [
    { id: '1', title: 'Task 1', zone: 'A', estimatedMinutes: 5, category: 'quick_win', decisionBin: 'donate', instructions: '', completed: false },
    { id: '2', title: 'Task 2', zone: 'B', estimatedMinutes: 5, category: 'quick_win', decisionBin: 'trash', instructions: '', completed: false },
    { id: '3', title: 'Task 3', zone: 'C', estimatedMinutes: 5, category: 'quick_win', decisionBin: 'keep', instructions: '', completed: false },
    { id: '4', title: 'Task 4', zone: 'D', estimatedMinutes: 5, category: 'quick_win', decisionBin: 'donate', instructions: '', completed: false },
  ];

  const bins = groupTasksByDecisionBin(sampleTasks);
  assert.equal(bins.donate.length, 2);
  assert.equal(bins.trash.length, 1);
  assert.equal(bins.keep.length, 1);
  assert.equal(bins.sell.length, 0);
});

test('generateExportSummary formats a readable markdown blueprint', () => {
  const mockAnalysis: RoomAnalysisResult = {
    roomType: 'Home Office',
    detectedVibe: 'Active creative space',
    zenScore: 50,
    clutterLevel: 'Moderate',
    summary: 'A busy desk with too many wires.',
    primaryBlocker: 'No cable management box',
    hotspots: [
      { id: 'h1', name: 'Desk Front', severity: 'high', description: 'Tangled cords', itemsIdentified: ['USB cables', 'chargers'] }
    ],
    actionPlan: [
      { id: 't1', title: 'Bundle cables', zone: 'Desk', estimatedMinutes: 10, category: 'storage_setup', decisionBin: 'keep', instructions: 'Tie them', completed: true },
      { id: 't2', title: 'Recycle shredded paper', zone: 'Bin', estimatedMinutes: 5, category: 'quick_win', decisionBin: 'recycle', instructions: 'Take to bin', completed: false }
    ],
    storageSolutions: [
      { id: 's1', item: 'Cable Box', purpose: 'Hide surge protector', estimatedPriceRange: '$15-$25', placementTip: 'Floor behind desk', recommendedCategory: 'Tech' }
    ],
    spatialFlowTips: ['Keep clear legroom under desk'],
    dailyHabits: ['Reset desk before dinner']
  };

  const md = generateExportSummary(mockAnalysis, mockAnalysis.actionPlan);
  assert.match(md, /ClutterFree AI Blueprint: Home Office/);
  assert.match(md, /\*\*Initial Zen Score:\*\* 50\/100/);
  assert.match(md, /- \[x\] Bundle cables/);
  assert.match(md, /- \[ \] Recycle shredded paper/);
  assert.match(md, /Cable Box/);
});
