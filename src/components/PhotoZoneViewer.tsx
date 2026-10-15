import React, { useState } from 'react';
import { Eye, EyeOff, MapPin, AlertTriangle, Layers, Maximize2 } from 'lucide-react';
import { ClutterHotspot } from '../types/declutter.js';

interface PhotoZoneViewerProps {
  imageUrl: string;
  roomType: string;
  hotspots: ClutterHotspot[];
  activeHotspotId: string | null;
  onSelectHotspot: (id: string | null) => void;
}

export const PhotoZoneViewer: React.FC<PhotoZoneViewerProps> = ({
  imageUrl,
  roomType,
  hotspots,
  activeHotspotId,
  onSelectHotspot,
}) => {
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const getSeverityColor = (sev: ClutterHotspot['severity']) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-600 border-rose-300 text-white';
      case 'high':
        return 'bg-amber-600 border-amber-300 text-white';
      case 'medium':
        return 'bg-yellow-500 border-yellow-200 text-stone-900';
      default:
        return 'bg-blue-600 border-blue-200 text-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-stone-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-600" />
          <h3 className="font-bold text-sm text-stone-900">
            Room Photo & Spatial Hotspots
          </h3>
          <span className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
            {hotspots.length} Zones Detected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
            aria-label={showOverlays ? 'Hide hotspot tags' : 'Show hotspot tags'}
          >
            {showOverlays ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide Tags</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Show Tags</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="relative bg-stone-950 overflow-hidden select-none">
        <img
          src={imageUrl}
          alt={roomType}
          className="w-full max-h-[480px] object-contain mx-auto transition-transform duration-300"
        />

        {/* Hotspot Overlays */}
        {showOverlays && (
          <div className="absolute inset-0 pointer-events-none">
            {hotspots.map((h, idx) => {
              const zone = h.zone || {
                x: 20 + (idx * 22) % 65,
                y: 25 + (idx * 20) % 55,
                width: 25,
                height: 25,
                label: h.name,
              };
              const isSelected = activeHotspotId === h.id;

              return (
                <div
                  key={h.id}
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${Math.max(zone.width || 20, 18)}%`,
                    height: `${Math.max(zone.height || 20, 15)}%`,
                  }}
                  className={`absolute pointer-events-auto transition-all cursor-pointer rounded-xl border-2 flex flex-col justify-start p-1.5 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/25 shadow-lg shadow-amber-500/30 ring-2 ring-white scale-105 z-20'
                      : 'border-white/80 bg-stone-900/30 hover:bg-amber-500/20 hover:border-amber-300 z-10'
                  }`}
                  onClick={() => onSelectHotspot(isSelected ? null : h.id)}
                  title={h.description}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight shadow-sm ${getSeverityColor(
                        h.severity
                      )}`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-white drop-shadow-md truncate bg-stone-900/70 px-1.5 py-0.5 rounded backdrop-blur-xs">
                      {h.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hotspots Carousel / Pill List below image */}
      <div className="p-3.5 bg-stone-50 border-t border-stone-200">
        <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
          Click a zone to review clutter details:
        </p>
        <div className="flex flex-wrap gap-2">
          {hotspots.map((h, idx) => {
            const isSelected = activeHotspotId === h.id;
            return (
              <button
                key={h.id}
                onClick={() => onSelectHotspot(isSelected ? null : h.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-amber-400 hover:bg-amber-50/50'
                }`}
                aria-label={`Zone ${idx + 1}: ${h.name}`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-600'}`} />
                <span>
                  <strong className="mr-1">#{idx + 1}</strong>
                  {h.name}
                </span>
                <span
                  className={`text-[9px] uppercase px-1 py-0.2 rounded font-bold ${
                    isSelected
                      ? 'bg-amber-700 text-white'
                      : h.severity === 'critical'
                      ? 'bg-rose-100 text-rose-700'
                      : h.severity === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {h.severity}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected hotspot detail drawer */}
        {activeHotspotId && (
          <div className="mt-3 p-3 bg-white rounded-xl border border-amber-200 shadow-xs text-xs">
            {(() => {
              const selected = hotspots.find((h) => h.id === activeHotspotId);
              if (!selected) return null;
              return (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      {selected.name}
                    </span>
                    <button
                      onClick={() => onSelectHotspot(null)}
                      className="text-stone-400 hover:text-stone-600 text-xs"
                      aria-label="Close hotspot detail"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-stone-600">{selected.description}</p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="font-semibold text-stone-500 text-[11px]">Identified Items:</span>
                    {selected.itemsIdentified.map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md text-[10px] font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
