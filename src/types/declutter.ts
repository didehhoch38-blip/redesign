export interface HotspotZone {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  label: string;
}

export interface ClutterHotspot {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  itemsIdentified: string[];
  zone?: HotspotZone;
}

export type ActionCategory = 
  | 'quick_win' 
  | 'surface_clearing' 
  | 'sorting_triage' 
  | 'storage_setup' 
  | 'maintenance_habit';

export type DecisionBin = 'keep' | 'donate' | 'sell' | 'recycle' | 'trash';

export interface DeclutterTask {
  id: string;
  title: string;
  zone: string;
  estimatedMinutes: number;
  category: ActionCategory;
  decisionBin: DecisionBin;
  instructions: string;
  completed: boolean;
}

export interface StorageSolution {
  id: string;
  item: string;
  purpose: string;
  estimatedPriceRange: string;
  placementTip: string;
  recommendedCategory: string;
}

export type ItemCategory = 
  | 'office_supplies' 
  | 'books_paper' 
  | 'kitchenware' 
  | 'clothing' 
  | 'miscellaneous';

export interface CategorizedItemSolution {
  id: string;
  itemName: string;
  category: ItemCategory;
  categoryLabel: string;
  recommendedOrganizer: string;
  estimatedPriceRange: string;
  organizingStrategy: string;
  placementTip: string;
  actionBin: DecisionBin;
}

export interface RoomDimensions {
  width: number; // meters (e.g. 3.2m ~ 10.5ft)
  length: number; // meters (e.g. 3.8m ~ 12.5ft)
  height: number; // meters (e.g. 2.4m ~ 8ft)
  unit: 'meters' | 'feet';
}

export interface Furniture3DItem {
  id: string;
  name: string;
  type: 'desk' | 'chair' | 'shelf' | 'plant' | 'rug' | 'storage_unit' | 'cabinet';
  currentPos: [number, number, number]; // x, y, z
  optimalPos: [number, number, number]; // x, y, z
  currentRot: number; // y rotation in radians
  optimalRot: number; // y rotation in radians
  size: [number, number, number]; // width, height, depth
  color: string;
  optimizationNote: string;
}

export interface Spatial3DPlan {
  dimensions: RoomDimensions;
  currentLayoutAnalysis: string;
  optimalLayoutAnalysis: string;
  flowGains: string[];
  furniture: Furniture3DItem[];
}

export interface RoomAnalysisResult {
  roomType: string;
  detectedVibe: string;
  zenScore: number; // 0 (chaos) to 100 (pristine zen)
  clutterLevel: 'Mild' | 'Moderate' | 'Heavy' | 'Overwhelming';
  summary: string;
  primaryBlocker: string;
  hotspots: ClutterHotspot[];
  actionPlan: DeclutterTask[];
  storageSolutions: StorageSolution[];
  spatialFlowTips: string[];
  dailyHabits: string[];
  categorizedItems?: CategorizedItemSolution[];
  spatial3DPlan?: Spatial3DPlan;
  recommendedModelUsed?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  modelUsed?: string;
  taskSuggestions?: string[];
}

export type GeminiModelChoice = 
  | 'gemini-4-argon' 
  | 'gemini-3.8-flash' 
  | 'gemini-3.1-flash-lite';
