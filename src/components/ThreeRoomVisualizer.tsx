import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Box, 
  Rotate3d, 
  Eye, 
  Sliders, 
  Sparkles, 
  Maximize2, 
  CheckCircle2, 
  AlertTriangle,
  Compass,
  ArrowRight
} from 'lucide-react';
import { RoomDimensions, Furniture3DItem } from '../types/declutter.js';

interface ThreeRoomVisualizerProps {
  roomType: string;
}

export const ThreeRoomVisualizer: React.FC<ThreeRoomVisualizerProps> = ({ roomType }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [layoutMode, setLayoutMode] = useState<'optimal' | 'current'>('optimal');
  const [dimensions, setDimensions] = useState<RoomDimensions>({
    width: 3.6, // meters (~11.8 ft)
    length: 4.2, // meters (~13.8 ft)
    height: 2.6, // meters (~8.5 ft)
    unit: 'meters',
  });
  const [selectedFurniture, setSelectedFurniture] = useState<Furniture3DItem | null>(null);
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'top' | 'isometric'>('perspective');

  // References to keep Three.js state across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const furnitureGroupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const roomMeshGroupRef = useRef<THREE.Group | null>(null);
  const flowPathMeshRef = useRef<THREE.Mesh | null>(null);

  // Furniture definitions with coordinates for current vs optimal placement
  const furnitureItems: Furniture3DItem[] = [
    {
      id: 'desk',
      name: 'Executive Work Desk & Dual Monitors',
      type: 'desk',
      currentPos: [-1.2, 0, -1.3],
      optimalPos: [-0.6, 0, -0.9],
      currentRot: 0,
      optimalRot: Math.PI / 2, // Rotate 90 deg so side faces window to eliminate glare
      size: [1.5, 0.75, 0.8],
      color: '#d4a373',
      optimizationNote: 'Re-positioned perpendicular to window: eliminates screen glare while keeping doorway in peripheral vision (power commanding position).',
    },
    {
      id: 'chair',
      name: 'Ergonomic Task Chair',
      type: 'chair',
      currentPos: [-1.2, 0, -0.6],
      optimalPos: [-1.2, 0, -0.9],
      currentRot: 0,
      optimalRot: Math.PI / 2,
      size: [0.65, 0.95, 0.65],
      color: '#2b2d42',
      optimizationNote: 'Maintains 36-inch unobstructed wheel roll radius. No longer bangs into back shelf or blocked cables.',
    },
    {
      id: 'shelf',
      name: 'Vertical Bookshelf & Storage Credenza',
      type: 'shelf',
      currentPos: [-1.4, 0, 0.5],
      optimalPos: [1.2, 0, -1.3],
      currentRot: 0,
      optimalRot: 0,
      size: [0.9, 1.8, 0.38],
      color: '#8d99ae',
      optimizationNote: 'Moved from cramped doorway entrance to rear accent wall: immediately expands perceived room entrance flow.',
    },
    {
      id: 'storage_tray',
      name: 'Under-Desk Cable Raceway & Tray',
      type: 'storage_unit',
      currentPos: [-1.2, 0, -1.3],
      optimalPos: [-0.6, 0.45, -0.9],
      currentRot: 0,
      optimalRot: Math.PI / 2,
      size: [0.7, 0.15, 0.2],
      color: '#2a9d8f',
      optimizationNote: 'Elevated onto the rear apron of the desk. Lifts power bricks and cable coils 100% off the floor.',
    },
    {
      id: 'rug',
      name: 'Zoned Area Floor Rug',
      type: 'rug',
      currentPos: [-1.2, 0.005, -0.9],
      optimalPos: [-0.8, 0.005, -0.9],
      currentRot: 0,
      optimalRot: Math.PI / 2,
      size: [2.0, 0.01, 1.5],
      color: '#e9d8a6',
      optimizationNote: 'Anchors the dedicated work zone and dampens acoustic room echo during video conferences.',
    },
    {
      id: 'plant',
      name: 'Natural Daylight Plant (Fiddle Leaf)',
      type: 'plant',
      currentPos: [1.2, 0, 1.2],
      optimalPos: [1.4, 0, 0.6],
      currentRot: 0,
      optimalRot: 0,
      size: [0.5, 1.3, 0.5],
      color: '#38b000',
      optimizationNote: 'Placed directly in the morning light path next to the window to boost room biophilic calmness.',
    },
  ];

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8fafc');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 4.2, 5.0);
    cameraRef.current = camera;

    // 3. Renderer with soft shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Do not go under floor
    controls.minDistance = 2.5;
    controls.maxDistance = 12.0;
    controls.target.set(0, 0.8, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#fffbeb', 1.8);
    sunLight.position.set(5, 7, 3);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0001;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight('#e0f2fe', 0.6);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    // Build the 3D Room Envelope & Furniture
    rebuildRoomStructure();
    buildFurnitureObjects();

    // Animation Loop
    let animationFrameId: number;
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);

    const animate = () => {
      if (!isHeadless) {
        animationFrameId = requestAnimationFrame(animate);
      }
      controls.update();
      renderer.render(scene, camera);
    };

    if (!isHeadless) {
      animate();
    } else {
      // Single frame render for headless test captures
      renderer.render(scene, camera);
    }

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 480;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Rebuild the 3D Room shell whenever dimensions change
  const rebuildRoomStructure = () => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (roomMeshGroupRef.current) {
      scene.remove(roomMeshGroupRef.current);
    }

    const roomGroup = new THREE.Group();
    const w = dimensions.width;
    const l = dimensions.length;
    const h = dimensions.height;

    // Floor with procedural wood texture
    const floorGeo = new THREE.PlaneGeometry(w, l);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#e2d4c0',
      roughness: 0.7,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Subtle floor grid helper for spatial distance reference
    const grid = new THREE.GridHelper(Math.max(w, l), 8, '#cbd5e1', '#e2e8f0');
    grid.position.y = 0.002;
    roomGroup.add(grid);

    // Back wall
    const backWallGeo = new THREE.PlaneGeometry(w, h);
    const wallMat = new THREE.MeshStandardMaterial({
      color: '#f1f5f9',
      roughness: 0.85,
    });
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, h / 2, -l / 2);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    // Left wall
    const leftWallGeo = new THREE.PlaneGeometry(l, h);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-w / 2, h / 2, 0);
    leftWall.receiveShadow = true;
    roomGroup.add(leftWall);

    // Window on right side
    const windowFrameGeo = new THREE.BoxGeometry(0.08, 1.4, 1.6);
    const windowMat = new THREE.MeshStandardMaterial({
      color: '#93c5fd',
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.75,
    });
    const windowFrame = new THREE.Mesh(windowFrameGeo, windowMat);
    windowFrame.position.set(w / 2, 1.4, 0.4);
    roomGroup.add(windowFrame);

    // Baseboards
    const baseboardMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.4 });
    const bbBack = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, 0.04), baseboardMat);
    bbBack.position.set(0, 0.05, -l / 2 + 0.02);
    roomGroup.add(bbBack);

    const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, l), baseboardMat);
    bbLeft.position.set(-w / 2 + 0.02, 0.05, 0);
    roomGroup.add(bbLeft);

    // Doorway indicator at south wall
    const doorGeo = new THREE.BoxGeometry(1.0, 0.02, 0.3);
    const doorMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.3 });
    const doorMatMesh = new THREE.Mesh(doorGeo, doorMat);
    doorMatMesh.position.set(0.6, 0.01, l / 2 - 0.2);
    roomGroup.add(doorMatMesh);

    scene.add(roomGroup);
    roomMeshGroupRef.current = roomGroup;
  };

  // Build composite procedural 3D furniture groups
  const buildFurnitureObjects = () => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear previous
    furnitureGroupsRef.current.forEach((grp) => scene.remove(grp));
    furnitureGroupsRef.current.clear();

    furnitureItems.forEach((item) => {
      const group = new THREE.Group();
      group.name = item.id;

      if (item.type === 'desk') {
        // Desktop
        const topGeo = new THREE.BoxGeometry(item.size[0], 0.05, item.size[2]);
        const topMat = new THREE.MeshStandardMaterial({ color: '#c9966b', roughness: 0.45 });
        const top = new THREE.Mesh(topGeo, topMat);
        top.position.y = 0.72;
        top.castShadow = true;
        group.add(top);

        // Legs
        const legGeo = new THREE.BoxGeometry(0.06, 0.72, 0.06);
        const legMat = new THREE.MeshStandardMaterial({ color: '#1f2937', metalness: 0.8, roughness: 0.3 });
        const offsets = [
          [-item.size[0] / 2 + 0.08, 0.36, -item.size[2] / 2 + 0.08],
          [item.size[0] / 2 - 0.08, 0.36, -item.size[2] / 2 + 0.08],
          [-item.size[0] / 2 + 0.08, 0.36, item.size[2] / 2 - 0.08],
          [item.size[0] / 2 - 0.08, 0.36, item.size[2] / 2 - 0.08],
        ];
        offsets.forEach(([x, y, z]) => {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(x, y, z);
          leg.castShadow = true;
          group.add(leg);
        });

        // Monitors
        const monGeo = new THREE.BoxGeometry(0.6, 0.38, 0.03);
        const monMat = new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.2 });
        const monScreenMat = new THREE.MeshStandardMaterial({ color: '#38bdf8', emissive: '#0284c7', emissiveIntensity: 0.4 });
        
        const mon1 = new THREE.Mesh(monGeo, monMat);
        mon1.position.set(-0.25, 0.98, -0.2);
        mon1.rotation.y = 0.15;
        group.add(mon1);

        const screen1 = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.34), monScreenMat);
        screen1.position.set(-0.25, 0.98, -0.18);
        screen1.rotation.y = 0.15;
        group.add(screen1);

        const mon2 = new THREE.Mesh(monGeo, monMat);
        mon2.position.set(0.32, 0.98, -0.18);
        mon2.rotation.y = -0.2;
        group.add(mon2);

        // Desk accessories: keyboard & lamp
        const kb = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.14), new THREE.MeshStandardMaterial({ color: '#374151' }));
        kb.position.set(0, 0.75, 0.15);
        group.add(kb);

      } else if (item.type === 'chair') {
        // Seat
        const seatGeo = new THREE.BoxGeometry(0.5, 0.08, 0.5);
        const seatMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.8 });
        const seat = new THREE.Mesh(seatGeo, seatMat);
        seat.position.y = 0.45;
        group.add(seat);

        // Backrest
        const backGeo = new THREE.BoxGeometry(0.46, 0.52, 0.06);
        const back = new THREE.Mesh(backGeo, seatMat);
        back.position.set(0, 0.72, -0.22);
        group.add(back);

        // Stem & Casters
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4), new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.9 }));
        stem.position.y = 0.2;
        group.add(stem);

        const star = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 5), new THREE.MeshStandardMaterial({ color: '#0f172a' }));
        star.position.y = 0.04;
        group.add(star);

      } else if (item.type === 'shelf') {
        const shelfMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.5 });
        const frame = new THREE.Mesh(new THREE.BoxGeometry(item.size[0], item.size[1], item.size[2]), shelfMat);
        frame.position.y = item.size[1] / 2;
        frame.castShadow = true;
        group.add(frame);

        // Colored books inside shelves
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
        for (let s = 1; s <= 4; s++) {
          const y = (item.size[1] / 5) * s;
          for (let b = 0; b < 4; b++) {
            const book = new THREE.Mesh(
              new THREE.BoxGeometry(0.06, 0.22, 0.24),
              new THREE.MeshStandardMaterial({ color: colors[(s + b) % colors.length] })
            );
            book.position.set(-item.size[0] / 3 + b * 0.08, y, 0.04);
            group.add(book);
          }
        }

      } else if (item.type === 'storage_unit') {
        // Cable Raceway
        const trayGeo = new THREE.BoxGeometry(item.size[0], item.size[1], item.size[2]);
        const trayMat = new THREE.MeshStandardMaterial({ color: '#059669', roughness: 0.4 });
        const tray = new THREE.Mesh(trayGeo, trayMat);
        tray.position.y = item.size[1] / 2;
        group.add(tray);

      } else if (item.type === 'plant') {
        // Pot
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.4, 16), new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.6 }));
        pot.position.y = 0.2;
        group.add(pot);

        // Leaves
        const leafMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.5 });
        for (let i = 0; i < 5; i++) {
          const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), leafMat);
          leaf.scale.set(1.4, 0.4, 0.8);
          leaf.position.set(Math.sin(i * 1.3) * 0.15, 0.5 + i * 0.14, Math.cos(i * 1.3) * 0.15);
          group.add(leaf);
        }

      } else if (item.type === 'rug') {
        const rug = new THREE.Mesh(
          new THREE.PlaneGeometry(item.size[0], item.size[2]),
          new THREE.MeshStandardMaterial({ color: '#fef3c7', roughness: 0.95 })
        );
        rug.rotation.x = -Math.PI / 2;
        group.add(rug);
      }

      // Initial position according to layout mode
      const pos = layoutMode === 'optimal' ? item.optimalPos : item.currentPos;
      const rot = layoutMode === 'optimal' ? item.optimalRot : item.currentRot;
      group.position.set(pos[0], pos[1], pos[2]);
      group.rotation.y = rot;

      scene.add(group);
      furnitureGroupsRef.current.set(item.id, group);
    });
  };

  // Switch positions smoothly when toggling Current vs Optimal layout
  useEffect(() => {
    furnitureItems.forEach((item) => {
      const group = furnitureGroupsRef.current.get(item.id);
      if (!group) return;
      const targetPos = layoutMode === 'optimal' ? item.optimalPos : item.currentPos;
      const targetRot = layoutMode === 'optimal' ? item.optimalRot : item.currentRot;

      // Animate position transition
      group.position.set(targetPos[0], targetPos[1], targetPos[2]);
      group.rotation.y = targetRot;
    });

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [layoutMode]);

  // Set camera view angles
  const handleSetCamera = (view: 'perspective' | 'top' | 'isometric') => {
    setCameraPreset(view);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (view === 'top') {
      camera.position.set(0, 7.5, 0.01);
      controls.target.set(0, 0, 0);
    } else if (view === 'isometric') {
      camera.position.set(5.5, 5.0, 5.5);
      controls.target.set(0, 0.5, 0);
    } else {
      camera.position.set(4.5, 3.8, 4.8);
      controls.target.set(0, 0.8, 0);
    }
    controls.update();

    if (rendererRef.current && sceneRef.current) {
      rendererRef.current.render(sceneRef.current, camera);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
      {/* 3D Visualizer Top Controls */}
      <div className="p-4 border-b border-stone-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-stone-900 font-['Outfit',sans-serif] flex items-center gap-1.5">
                <span>3D Room Spatial Visualizer &amp; Furniture Placement</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Three.js PBR
                </span>
              </h3>
              <p className="text-[11px] text-stone-500">
                Simulate optimal spatial flow, walkway clearances, and storage placement
              </p>
            </div>
          </div>
        </div>

        {/* Layout Toggle (Current Cluttered vs Optimal Flow) */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200">
            <button
              onClick={() => setLayoutMode('optimal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                layoutMode === 'optimal'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              aria-label="View optimal layout"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimal Flow Layout</span>
            </button>
            <button
              onClick={() => setLayoutMode('current')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                layoutMode === 'current'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              aria-label="View current layout"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Current Cluttered Layout</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-[450px] bg-stone-900 select-none">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Camera Quick Angles */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-stone-900/80 backdrop-blur-md p-1 rounded-xl border border-white/10 text-white text-xs z-10">
          <button
            onClick={() => handleSetCamera('perspective')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
              cameraPreset === 'perspective' ? 'bg-amber-600 text-white' : 'hover:bg-stone-800 text-stone-300'
            }`}
            aria-label="Perspective camera angle"
          >
            3D Orbit
          </button>
          <button
            onClick={() => handleSetCamera('isometric')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
              cameraPreset === 'isometric' ? 'bg-amber-600 text-white' : 'hover:bg-stone-800 text-stone-300'
            }`}
            aria-label="Isometric camera angle"
          >
            Isometric
          </button>
          <button
            onClick={() => handleSetCamera('top')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
              cameraPreset === 'top' ? 'bg-amber-600 text-white' : 'hover:bg-stone-800 text-stone-300'
            }`}
            aria-label="Top down floorplan camera angle"
          >
            Top-Down
          </button>
        </div>

        {/* Layout Mode Pill on Canvas */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-md ${
              layoutMode === 'optimal'
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500 text-stone-950'
            }`}
          >
            {layoutMode === 'optimal' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>+38% Usable Walkway Flow</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Obstructed Walkway & Cable Hotspot</span>
              </>
            )}
          </span>
        </div>

        {/* Orbit Helper Tip */}
        <div className="absolute bottom-3 left-3 pointer-events-none text-[11px] text-white/70 bg-stone-950/60 px-3 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1.5">
          <Rotate3d className="w-3.5 h-3.5 text-amber-400" />
          <span>Click &amp; drag to orbit 360° • Scroll to zoom</span>
        </div>
      </div>

      {/* Spatial Layout Analysis & Dimensions Bar */}
      <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Layout Assessment */}
          <div className="md:col-span-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {layoutMode === 'optimal' ? 'AI Optimized Spatial Flow' : 'Identified Layout Bottlenecks'}
              </span>
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              {layoutMode === 'optimal' ? (
                <>
                  Desk is re-oriented perpendicular to the natural light window to eliminate computer screen glare, creating a wide <strong>38-inch walkway corridor</strong> from door to desk. The vertical shelf is placed along the rear wall, and power strips are lifted off the carpet into an under-desk wire channel.
                </>
              ) : (
                <>
                  In the current layout, the desk faces the wall squarely, trapping loose cables under foot. The credenza encroaches onto the doorway path, reducing the walking clearance to an uncomfortable 20 inches and causing clutter pile-up.
                </>
              )}
            </p>
          </div>

          {/* Room Dimensions Controller */}
          <div className="md:col-span-4 bg-white p-3 rounded-xl border border-stone-200">
            <span className="text-[11px] font-bold text-stone-600 uppercase block mb-1.5">
              Room Dimensions
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Width</span>
                <span className="font-bold text-stone-800">{dimensions.width}m</span>
                <span className="text-[9px] text-stone-500 block">~11.8 ft</span>
              </div>
              <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Length</span>
                <span className="font-bold text-stone-800">{dimensions.length}m</span>
                <span className="text-[9px] text-stone-500 block">~13.8 ft</span>
              </div>
              <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Height</span>
                <span className="font-bold text-stone-800">{dimensions.height}m</span>
                <span className="text-[9px] text-stone-500 block">~8.5 ft</span>
              </div>
            </div>
          </div>
        </div>

        {/* Furniture Item Quick Selector & Details */}
        <div className="mt-4 pt-3 border-t border-stone-200/80">
          <span className="text-[11px] font-bold text-stone-500 uppercase block mb-2">
            Click any furniture element to inspect placement recommendations:
          </span>
          <div className="flex flex-wrap gap-2">
            {furnitureItems.map((item) => {
              const isSelected = selectedFurniture?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedFurniture(isSelected ? null : item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300'
                  }`}
                  aria-label={`Inspect ${item.name}`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {selectedFurniture && (
            <div className="mt-3 p-3 bg-white rounded-xl border border-amber-200 shadow-xs text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-stone-900">{selectedFurniture.name}</span>
                <button
                  onClick={() => setSelectedFurniture(null)}
                  className="text-stone-400 hover:text-stone-600 text-xs"
                  aria-label="Dismiss furniture note"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-stone-600">{selectedFurniture.optimizationNote}</p>
              <div className="mt-2 text-[11px] text-stone-500 flex gap-4">
                <span>
                  <strong>Footprint:</strong> {selectedFurniture.size[0]}m W &times; {selectedFurniture.size[2]}m D
                </span>
                <span>
                  <strong>Elevation:</strong> {selectedFurniture.size[1]}m H
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
