import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Wand2, Compass, AlertCircle, ArrowRight } from 'lucide-react';
import { SAMPLE_ROOMS } from '../data/sampleRooms.js';

interface RoomUploaderProps {
  onAnalyze: (payload: {
    imageBase64: string;
    mimeType: string;
    roomTypeHint?: string;
    focusArea?: string;
    previewUrl: string;
  }) => void;
  isLoading: boolean;
  loadingStepText: string;
  error?: string | null;
}

export const RoomUploader: React.FC<RoomUploaderProps> = ({
  onAnalyze,
  isLoading,
  loadingStepText,
  error,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [roomTypeHint, setRoomTypeHint] = useState<string>('Auto-Detect');
  const [focusArea, setFocusArea] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile && !previewUrl) return;

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onAnalyze({
          imageBase64: result,
          mimeType: selectedFile.type || 'image/jpeg',
          roomTypeHint: roomTypeHint === 'Auto-Detect' ? '' : roomTypeHint,
          focusArea,
          previewUrl: previewUrl || result,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSelectSample = async (sample: typeof SAMPLE_ROOMS[0]) => {
    try {
      // Use proxy endpoint to fetch sample image base64
      const res = await fetch('/api/fetch-sample-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: sample.imageUrl }),
      });
      if (!res.ok) throw new Error('Could not load sample room image');
      const data = await res.json();
      onAnalyze({
        imageBase64: data.base64Data,
        mimeType: data.mimeType || 'image/jpeg',
        roomTypeHint: sample.roomType,
        focusArea: sample.tagline,
        previewUrl: sample.imageUrl,
      });
    } catch (err: any) {
      console.error('Failed to analyze sample room:', err);
      // Fallback: pass sample image URL as preview and hint
      alert('Unable to load sample image directly: ' + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero Intro */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Powered by Gemini 4 Argon Vision & Spatial Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-['Outfit',sans-serif]">
          Transform Room Chaos into <span className="text-amber-600">Peaceful Clarity</span>
        </h1>
        <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
          Upload a photo of your desk, wardrobe, kitchen counter, or living room.
          Our AI spatial organizer identifies clutter zones, crafts a micro-step decluttering roadmap, and guides you with an interactive KonMari assistant.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Analysis Notice</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Main Upload Box */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 mb-10 transition">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Dropzone / Preview */}
          <div className="md:col-span-7">
            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group">
                <img
                  src={previewUrl}
                  alt="Room preview"
                  className="w-full h-72 sm:h-80 object-cover"
                />
                {!isLoading && (
                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white text-stone-900 text-xs font-semibold rounded-lg shadow hover:bg-stone-50 transition"
                      aria-label="Change photo"
                    >
                      Change Photo
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg shadow hover:bg-rose-700 transition"
                      aria-label="Remove photo"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl h-72 sm:h-80 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50/50 scale-[0.99]'
                    : 'border-stone-300 hover:border-amber-400 hover:bg-stone-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-stone-800 text-base">
                  Drag and drop your room photo
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Supports PNG, JPG, or WebP up to 20MB
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition shadow-sm">
                  <ImageIcon className="w-4 h-4" />
                  Browse Room Photo
                </span>
              </div>
            )}
          </div>

          {/* Configuration Options */}
          <div className="md:col-span-5 flex flex-col justify-between h-full space-y-5">
            <div>
              <h2 className="text-lg font-bold text-stone-900 mb-1">
                Room Details (Optional)
              </h2>
              <p className="text-xs text-stone-500 mb-4">
                Help the AI tailor specific storage solutions and spatial tips.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Room Type
                  </label>
                  <select
                    value={roomTypeHint}
                    onChange={(e) => setRoomTypeHint(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  >
                    <option value="Auto-Detect">Auto-Detect with AI Vision</option>
                    <option value="Home Office / Workspace">Home Office / Workspace</option>
                    <option value="Kitchen & Counters">Kitchen & Counters</option>
                    <option value="Bedroom & Wardrobe / Closet">Bedroom & Wardrobe / Closet</option>
                    <option value="Living Room / Family Area">Living Room / Family Area</option>
                    <option value="Bathroom / Vanity">Bathroom / Vanity</option>
                    <option value="Entryway / Mudroom">Entryway / Mudroom</option>
                    <option value="Garage / Storage Room">Garage / Storage Room</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Specific Clutter Focus Area
                  </label>
                  <input
                    type="text"
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    placeholder="e.g. Cables & chargers, paper clutter, desk surface"
                    disabled={isLoading}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleStartAnalysis}
                disabled={!previewUrl || isLoading}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition ${
                  previewUrl && !isLoading
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20 active:scale-[0.99]'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                }`}
                aria-label="Analyze room with Gemini 4 Argon"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{loadingStepText || 'Analyzing with Gemini 4 Argon...'}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Analyze Room with Gemini 4 Argon</span>
                  </>
                )}
              </button>

              {isLoading && (
                <p className="text-[11px] text-center text-amber-700 font-medium mt-2 animate-pulse">
                  Examining room geometry, identifying hotspots, and generating decluttering plan...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Or Test With a Curated Sample Room */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 font-['Outfit',sans-serif]">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Or Test Instantly with Curated Sample Rooms</span>
            </h3>
            <p className="text-xs text-stone-500">
              Click any sample room below to test image understanding and decluttering suggestions immediately.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_ROOMS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => !isLoading && handleSelectSample(sample)}
              className="group bg-white border border-stone-200 hover:border-amber-400 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-40 overflow-hidden bg-stone-100">
                <img
                  src={sample.imageUrl}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-medium">
                  {sample.roomType}
                </span>
              </div>
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-bold text-xs text-stone-900 group-hover:text-amber-700 transition">
                    {sample.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                    {sample.tagline}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-amber-700 text-[11px] font-semibold">
                  <span>Analyze Sample</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
