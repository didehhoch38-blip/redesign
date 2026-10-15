import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header.js';
import { 
  RoomUploader 
} from './components/RoomUploader.js';
import { 
  PhotoZoneViewer 
} from './components/PhotoZoneViewer.js';
import { 
  ZenScoreOverview 
} from './components/ZenScoreOverview.js';
import { 
  ActionChecklist 
} from './components/ActionChecklist.js';
import { 
  DecisionBinsView 
} from './components/DecisionBinsView.js';
import { 
  StorageRecommendations 
} from './components/StorageRecommendations.js';
import { 
  CategorizedStorageDirectory 
} from './components/CategorizedStorageDirectory.js';
import { 
  ThreeRoomVisualizer 
} from './components/ThreeRoomVisualizer.js';
import { 
  GeminiChatbot 
} from './components/GeminiChatbot.js';
import { 
  GuideModal 
} from './components/GuideModal.js';
import { 
  RoomAnalysisResult, 
  DeclutterTask 
} from './types/declutter.js';
import { 
  calculateProgress 
} from './utils/declutter.js';
import { 
  SAMPLE_ROOMS 
} from './data/sampleRooms.js';
import { 
  Layers, 
  CheckSquare, 
  Boxes, 
  Package, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  Box,
  FolderTree
} from 'lucide-react';

export default function App() {
  const [analysis, setAnalysis] = useState<RoomAnalysisResult | null>(null);
  const [tasks, setTasks] = useState<DeclutterTask[]>([]);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [roomImageUrl, setRoomImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepText, setLoadingStepText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'three_d' | 'items' | 'bins' | 'chat'>('blueprint');
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Check for ?autostart=1 to automatically load demo room for ultra-mode verification
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' && !analysis) {
      loadAutostartDemo();
    }
  }, []);

  const loadAutostartDemo = () => {
    const sample = SAMPLE_ROOMS[0];
    setFallbackDemoAnalysis(sample);
  };

  const setFallbackDemoAnalysis = (sample: typeof SAMPLE_ROOMS[0]) => {
    const demoData: RoomAnalysisResult = {
      roomType: sample.roomType,
      detectedVibe: 'Creative work hub with scattered cable bundles and surface papers.',
      zenScore: 42,
      clutterLevel: 'Moderate',
      summary: 'Functional dual-monitor workspace that has accumulated visual noise, tangled charging wires, and loose stationery.',
      primaryBlocker: 'Absence of under-desk cable management and lack of an active in-box paper tray.',
      hotspots: [
        {
          id: 'h1',
          name: 'Under-Desk Power Strip & Cables',
          severity: 'high',
          description: 'A rat\'s nest of power supplies and monitor cords resting where feet go.',
          itemsIdentified: ['Extension cords', 'Laptop charger', 'Monitor HDMI cables', 'Dust bunnies'],
          zone: { x: 25, y: 65, width: 35, height: 25, label: 'Cable Nest' },
        },
        {
          id: 'h2',
          name: 'Primary Desktop Surface',
          severity: 'medium',
          description: 'Empty mugs, loose sticky notes, and three notebooks competing with mousepad.',
          itemsIdentified: ['Coffee mugs', 'Loose pens', 'Post-it notes', 'Receipts'],
          zone: { x: 20, y: 35, width: 45, height: 25, label: 'Desk Surface' },
        },
        {
          id: 'h3',
          name: 'Bookshelf / Tech Stash',
          severity: 'low',
          description: 'Unsorted packaging boxes and obsolete tech accessories.',
          itemsIdentified: ['Empty device boxes', 'Old USB-A cables', 'Expired manuals'],
          zone: { x: 70, y: 20, width: 25, height: 35, label: 'Tech Shelf' },
        },
      ],
      actionPlan: [
        {
          id: 't1',
          title: 'Return mugs to sink and discard wrappers',
          zone: 'Desk Surface',
          estimatedMinutes: 3,
          category: 'quick_win',
          decisionBin: 'trash',
          instructions: 'Clear food and drink items immediately to restore clean desk surface.',
          completed: false,
        },
        {
          id: 't2',
          title: 'Group and recycle empty device boxes',
          zone: 'Bookshelf',
          estimatedMinutes: 5,
          category: 'quick_win',
          decisionBin: 'recycle',
          instructions: 'Flatten cardboard boxes for tech you have owned for more than 30 days.',
          completed: false,
        },
        {
          id: 't3',
          title: 'Bundle loose power cords with velcro ties',
          zone: 'Under Desk',
          estimatedMinutes: 15,
          category: 'storage_setup',
          decisionBin: 'keep',
          instructions: 'Route all monitor and power cords together into a spine or under-desk cable tray.',
          completed: false,
        },
        {
          id: 't4',
          title: 'Triage old USB cables and donate duplicates',
          zone: 'Bookshelf',
          estimatedMinutes: 10,
          category: 'sorting_triage',
          decisionBin: 'donate',
          instructions: 'Keep two quality USB-C cables, donate or recycle older redundant micro-USB cables.',
          completed: false,
        },
      ],
      storageSolutions: [
        {
          id: 's1',
          item: 'Under-Desk Wire Mesh Cable Raceway',
          purpose: 'Lifts surge protector and brick adapters completely off the floor',
          estimatedPriceRange: '$18 - $26',
          placementTip: 'Clamp onto rear desktop underside without drilling',
          recommendedCategory: 'Cable Management',
        },
        {
          id: 's2',
          item: 'Acrylic 3-Tier Stacking Desktop In-Tray',
          purpose: 'Contains active papers, bills, and pending mail in one designated home',
          estimatedPriceRange: '$14 - $22',
          placementTip: 'Place on the far right corner away from mouse sweep area',
          recommendedCategory: 'Paper Organization',
        },
      ],
      spatialFlowTips: [
        'Maintain a 30-inch clear zone around office chair wheels to allow fluid movement.',
        'Keep the line of sight toward your window clear to maximize natural focus.',
      ],
      dailyHabits: [
        'The 2-Minute End-of-Workday Reset: Park keyboard under monitor stand and clear dishes.',
        'Zero-Loose-Paper Policy: All mail goes straight to recycling or the action tray upon arrival.',
      ],
      recommendedModelUsed: 'gemini-4-argon',
    };

    setAnalysis(demoData);
    setTasks(demoData.actionPlan);
    setRoomImageUrl(sample.imageUrl);
  };

  const handleAnalyzeRoom = async ({
    imageBase64,
    mimeType,
    roomTypeHint,
    focusArea,
    previewUrl,
  }: {
    imageBase64: string;
    mimeType: string;
    roomTypeHint?: string;
    focusArea?: string;
    previewUrl: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setLoadingStepText('Gemini 4 Argon: Analyzing room photo...');
    setRoomImageUrl(previewUrl);

    try {
      setLoadingStepText('Detecting clutter hotspots & spatial flow...');
      const response = await fetch('/api/analyze-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          roomTypeHint,
          focusArea,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      setLoadingStepText('Generating actionable decluttering roadmap...');
      const data: RoomAnalysisResult = await response.json();

      setAnalysis(data);
      setTasks(data.actionPlan || []);
      setActiveTab('blueprint');
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(`Analysis Error: ${err.message}. Please try again or choose another room photo.`);
    } finally {
      setIsLoading(false);
      setLoadingStepText('');
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleReset = () => {
    setAnalysis(null);
    setTasks([]);
    setActiveHotspotId(null);
    setRoomImageUrl(null);
    setError(null);
    setActiveTab('blueprint');
  };

  const progress = calculateProgress(tasks, analysis?.zenScore || 40);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Header
        hasAnalysis={!!analysis}
        onReset={handleReset}
        onOpenGuide={() => setIsGuideOpen(true)}
        currentZenScore={analysis ? progress.currentZenScore : undefined}
      />

      <main className="flex-1">
        {!analysis ? (
          <RoomUploader
            onAnalyze={handleAnalyzeRoom}
            isLoading={isLoading}
            loadingStepText={loadingStepText}
            error={error}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 flex-wrap gap-3">
              <div className="flex items-center space-x-1 sm:space-x-2 bg-stone-200/60 p-1 rounded-xl overflow-x-auto max-w-full">
                <button
                  onClick={() => setActiveTab('blueprint')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                    activeTab === 'blueprint'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  aria-label="Room Blueprint tab"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>Blueprint &amp; Checklist</span>
                </button>

                <button
                  onClick={() => setActiveTab('three_d')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                    activeTab === 'three_d'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  aria-label="3D Room & Flow tab"
                >
                  <Box className="w-3.5 h-3.5 text-amber-600" />
                  <span>3D Room &amp; Flow</span>
                </button>

                <button
                  onClick={() => setActiveTab('items')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                    activeTab === 'items'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  aria-label="Item Storage Directory tab"
                >
                  <FolderTree className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Categorized Items</span>
                </button>

                <button
                  onClick={() => setActiveTab('bins')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                    activeTab === 'bins'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  aria-label="5-Bin Sorting tab"
                >
                  <Boxes className="w-3.5 h-3.5 text-indigo-600" />
                  <span>5-Bin Triage</span>
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                    activeTab === 'chat'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  aria-label="Gemini Organizer Chat tab"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                  <span>Gemini Chatbot</span>
                </button>
              </div>

              {/* Model Tag */}
              <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                <span>Analyzed via</span>
                <span className="font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                  {analysis.recommendedModelUsed || 'gemini-4-argon'}
                </span>
              </div>
            </div>

            {/* Zen Score Overview Banner */}
            <ZenScoreOverview
              initialZenScore={analysis.zenScore}
              progress={progress}
              roomType={analysis.roomType}
              clutterLevel={analysis.clutterLevel}
              primaryBlocker={analysis.primaryBlocker}
              summary={analysis.summary}
            />

            {/* Tab Contents */}
            {activeTab === 'blueprint' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 space-y-6">
                  {roomImageUrl && (
                    <PhotoZoneViewer
                      imageUrl={roomImageUrl}
                      roomType={analysis.roomType}
                      hotspots={analysis.hotspots}
                      activeHotspotId={activeHotspotId}
                      onSelectHotspot={setActiveHotspotId}
                    />
                  )}
                </div>

                <div className="lg:col-span-6 space-y-6">
                  <ActionChecklist
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    analysis={analysis}
                  />
                </div>
              </div>
            )}

            {activeTab === 'three_d' && (
              <ThreeRoomVisualizer roomType={analysis.roomType} />
            )}

            {activeTab === 'items' && (
              <CategorizedStorageDirectory
                analysis={analysis}
                onAskChatAboutItem={(itemName) => {
                  setChatInitialQuestion(itemName);
                  setActiveTab('chat');
                }}
              />
            )}

            {activeTab === 'bins' && (
              <DecisionBinsView tasks={tasks} />
            )}

            {activeTab === 'chat' && (
              <div className="max-w-4xl mx-auto">
                <GeminiChatbot
                  roomAnalysis={analysis}
                  initialQuestion={chatInitialQuestion}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
        <p>
          ClutterFree AI &bull; Intelligent Room Decluttering &amp; Organization Studio &bull; Powered by Gemini 4 Argon, 3.8 Flash &amp; 3.1 Flash Lite
        </p>
      </footer>
    </div>
  );
}
