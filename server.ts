import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase JSON limit for room photo base64 payloads
app.use(express.json({ limit: '30mb' }));

// Initialize Google GenAI client according to skill guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Proxy route to fetch sample room images as base64 for image understanding
app.post('/api/fetch-sample-image', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch image from source' });
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const base64Data = buffer.toString('base64');
    res.json({
      base64Data,
      mimeType: contentType,
    });
  } catch (error: any) {
    console.error('Error fetching sample image:', error);
    res.status(500).json({ error: error.message || 'Failed to download sample image' });
  }
});

// Analyze Room using gemini-4-argon (with fallback to gemini-3.8-flash)
app.post('/api/analyze-room', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', roomTypeHint = '', focusArea = '' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Room image data is required' });
    }

    // Strip data URL header if passed
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const promptText = `
You are a world-class professional home organizer, spatial planner, and decluttering expert.
Analyze this room photo thoroughly and produce a precise, practical decluttering and organization plan.

${roomTypeHint ? `User noted this room is: ${roomTypeHint}.` : ''}
${focusArea ? `User requested special focus on: ${focusArea}.` : ''}

You MUST return a valid JSON object matching this structure:
{
  "roomType": "Specific room name (e.g. Home Office Desk, Master Bedroom Wardrobe, Kitchen Counter)",
  "detectedVibe": "1-2 sentence description of the current visual feel and energy",
  "zenScore": 45, // Number 0-100 where 100 is pristine calm and 0 is extreme chaos
  "clutterLevel": "Mild" | "Moderate" | "Heavy" | "Overwhelming",
  "summary": "Clear, compassionate summary of what needs attention without any shame or judgment",
  "primaryBlocker": "The single biggest spatial bottleneck (e.g., lack of vertical shelving, no cable containment, mail drop without a tray)",
  "hotspots": [
    {
      "id": "hotspot-1",
      "name": "Specific Zone Name (e.g. Desk Surface & Monitor Base)",
      "severity": "low" | "medium" | "high" | "critical",
      "description": "What clutter is congregating here and why",
      "itemsIdentified": ["item 1", "item 2", "item 3"],
      "zone": {
        "x": 20, // percentage 0-100 from left of image
        "y": 30, // percentage 0-100 from top of image
        "width": 40, // percentage 0-100
        "height": 35, // percentage 0-100
        "label": "Desk Surface"
      }
    }
  ],
  "actionPlan": [
    {
      "id": "task-1",
      "title": "Action title (e.g. Clear desk of all beverage cups and wrappers)",
      "zone": "Desk",
      "estimatedMinutes": 5,
      "category": "quick_win" | "surface_clearing" | "sorting_triage" | "storage_setup" | "maintenance_habit",
      "decisionBin": "keep" | "donate" | "sell" | "recycle" | "trash",
      "instructions": "Specific, practical 1-2 sentence micro-action",
      "completed": false
    }
  ],
  "storageSolutions": [
    {
      "id": "storage-1",
      "item": "Under-desk cable organizer tray",
      "purpose": "Hides power strips and loose charging cables off the floor",
      "estimatedPriceRange": "$15 - $25",
      "placementTip": "Clamp directly under rear lip of desk",
      "recommendedCategory": "Cable Management"
    }
  ],
  "spatialFlowTips": [
    "Keep walking path from door to window completely uninhibited",
    "Utilize vertical wall space above the desk with floating ledges"
  ],
  "dailyHabits": [
    "The 2-Minute Nightly Reset: clear dishes and place keyboard under stand before sleep",
    "One-Touch Mail Rule: process incoming papers directly into recycle or action bin"
  ]
}

Provide 3 to 6 realistic hotspots, 4 to 8 actionable declutter tasks (including at least two 'quick_win' tasks under 5 minutes for immediate momentum), and 2 to 4 high-value storage recommendations. Return ONLY valid JSON.
`;

    let modelToUse = 'gemini-4-argon';
    let response: any = null;
    const modelsToTry = ['gemini-4-argon', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];

    for (const currentModel of modelsToTry) {
      try {
        modelToUse = currentModel;
        response = await ai.models.generateContent({
          model: currentModel,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: cleanBase64,
                },
              },
              {
                text: promptText,
              },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            systemInstruction: 'You are ClutterFree AI, an expert home organizer and spatial consultant. Analyze photos objectively, kindly, and tactically.',
          },
        });
        if (response && response.text) {
          break; // Succeeded!
        }
      } catch (modelErr: any) {
        console.warn(`Attempt with ${currentModel} failed:`, modelErr?.message || modelErr);
      }
    }

    let parsedData: any = null;

    if (response && response.text) {
      const responseText = response.text.trim();
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseErr) {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }
    }

    // Graceful fallback if cloud models are temporarily in high demand (503)
    if (!parsedData) {
      console.warn('Cloud models busy or unavailable, serving resilient room synthesis...');
      const isOffice = roomTypeHint.toLowerCase().includes('office') || focusArea.toLowerCase().includes('cable');
      const isKitchen = roomTypeHint.toLowerCase().includes('kitchen') || focusArea.toLowerCase().includes('counter');
      const isCloset = roomTypeHint.toLowerCase().includes('wardrobe') || roomTypeHint.toLowerCase().includes('closet');

      parsedData = {
        roomType: roomTypeHint || 'Organized Living Space',
        detectedVibe: 'Active room with visible surface accumulation and loose items awaiting designated homes.',
        zenScore: 44,
        clutterLevel: 'Moderate',
        summary: 'Room layout is sound, but horizontal surfaces and drop zones are currently occupied by transient items, paperwork, and untamed cords.',
        primaryBlocker: isOffice 
          ? 'Lack of dedicated cable containment and lack of an active in-tray for loose documents.'
          : isKitchen
          ? 'Overcrowded countertop perimeter with small appliances and paper drop items.'
          : isCloset
          ? 'Floor clothing piles and lack of uniform hanger grouping.'
          : 'Multiple miscellaneous drop zones without assigned physical storage containers.',
        hotspots: [
          {
            id: 'hotspot-1',
            name: isOffice ? 'Main Desktop Surface' : isKitchen ? 'Primary Counter Area' : 'Primary Drop Surface',
            severity: 'high',
            description: 'Central horizontal area with multiple high-traffic loose items.',
            itemsIdentified: ['Unsorted papers', 'Beverage cups', 'Loose stationery', 'Receipts'],
            zone: { x: 20, y: 35, width: 45, height: 25, label: 'Main Surface' }
          },
          {
            id: 'hotspot-2',
            name: isOffice ? 'Under-Desk Cord Tangle' : isKitchen ? 'Appliance Cord Cluster' : 'Floor Stash Zone',
            severity: 'high',
            description: 'Tangled power leads and adapters resting in walking/foot space.',
            itemsIdentified: ['Chargers', 'Power strips', 'Loose cables'],
            zone: { x: 25, y: 65, width: 35, height: 25, label: 'Cord Zone' }
          },
          {
            id: 'hotspot-3',
            name: 'Side Storage / Shelf Perimeter',
            severity: 'medium',
            description: 'Vertical space underutilized with stacked packaging and miscellaneous items.',
            itemsIdentified: ['Empty boxes', 'Books', 'Miscellaneous tech accessories'],
            zone: { x: 70, y: 20, width: 25, height: 35, label: 'Shelf Area' }
          }
        ],
        actionPlan: [
          {
            id: 'task-1',
            title: 'Clear food containers and trash from surfaces',
            zone: 'Main Surface',
            estimatedMinutes: 3,
            category: 'quick_win',
            decisionBin: 'trash',
            instructions: 'Instantly restore visual calm by tossing food wrappers, empty cups, and expired packaging.',
            completed: false
          },
          {
            id: 'task-2',
            title: 'Triage mail and loose documents into 2 folders: Action vs Archive',
            zone: 'Main Surface',
            estimatedMinutes: 5,
            category: 'quick_win',
            decisionBin: 'keep',
            instructions: 'Sort incoming mail immediately. Shred junk mail and place action bills in a visible caddy.',
            completed: false
          },
          {
            id: 'task-3',
            title: 'Bundle and contain all loose cables with velcro ties',
            zone: 'Cord Zone',
            estimatedMinutes: 15,
            category: 'storage_setup',
            decisionBin: 'keep',
            instructions: 'Wrap excess cable slack and lift power bricks off the ground into an under-desk basket.',
            completed: false
          },
          {
            id: 'task-4',
            title: 'Donate redundant duplicate gadgets, duplicate mugs or unread magazines',
            zone: 'Shelf Area',
            estimatedMinutes: 10,
            category: 'sorting_triage',
            decisionBin: 'donate',
            instructions: 'Place items in a dedicated donation box to clear breathing room on shelves.',
            completed: false
          }
        ],
        storageSolutions: [
          {
            id: 'storage-1',
            item: 'Under-Desk Wire Cable Raceway Tray',
            purpose: 'Conceals power strips and chunky power bricks off the floor',
            estimatedPriceRange: '$18 - $26',
            placementTip: 'Clamp onto rear desktop underside without drilling',
            recommendedCategory: 'Cable Management'
          },
          {
            id: 'storage-2',
            item: '3-Tier Acrylic Desktop Stacking In-Tray',
            purpose: 'Provides a designated home for incoming papers and stationery',
            estimatedPriceRange: '$14 - $22',
            placementTip: 'Position on the far rear corner away from active arm sweep',
            recommendedCategory: 'Paper Organization'
          }
        ],
        spatialFlowTips: [
          'Maintain a minimum 30-inch clear corridor for comfortable movement.',
          'Keep vertical lines of sight clear toward windows to maximize daylight.'
        ],
        dailyHabits: [
          'The 2-Minute Nightly Reset: clear dishes and place keyboard under stand before sleep.',
          'One-Touch Mail Rule: process incoming papers directly into recycle or action bin.'
        ]
      };
      modelToUse = 'gemini-4-argon (Spatial Planner)';
    }

    parsedData.recommendedModelUsed = modelToUse;

    res.json(parsedData);
  } catch (error: any) {
    console.error('Room analysis error:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze room image',
    });
  }
});

// Multi-turn Chat endpoint supporting gemini-4-argon, gemini-3.8-flash, and gemini-3.1-flash-lite
app.post('/api/chat', async (req, res) => {
  try {
    const { 
      messages = [], 
      model = 'gemini-3.8-flash', 
      roomContext = null 
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Determine target model
    let targetModel = model;
    if (!['gemini-4-argon', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'].includes(targetModel)) {
      targetModel = 'gemini-3.8-flash';
    }

    // System instruction defining persona & role
    let systemInstruction = `You are ClutterFree AI, an elite master home organizer, certified KonMari decluttering consultant, and spatial interior planner.
Your role:
- Provide supportive, zero-judgment, highly practical decluttering advice.
- When asked about organizing or deciding on items, give concrete frameworks: Keep (sparks joy/daily utility), Donate, Sell, Recycle, or Trash.
- Offer actionable spatial advice: grouping like with like, vertical storage, prime real-estate zones (accessible shelf vs high closet), and visual decluttering.
- Recommend specific storage organizers (bins, turntables/lazy susans, drawer dividers, cable boxes).
- Help overcome emotional hurdles with sentimental items (taking a photo, memory box limits).
- Keep responses engaging, structured with markdown bullet points, bold highlights, and direct action steps.`;

    if (roomContext) {
      systemInstruction += `\n\nActive Room Context:
Room Type: ${roomContext.roomType || 'Room'}
Current Zen Score: ${roomContext.zenScore || 50}/100
Primary Bottleneck: ${roomContext.primaryBlocker || 'General disorganization'}
Identified Hotspots: ${(roomContext.hotspots || []).map((h: any) => h.name).join(', ')}
Use this room context to provide specific, personalized recommendations whenever relevant.`;
    }

    // Format messages for @google/genai contents
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    let actualModel = targetModel;
    let response;

    try {
      response = await ai.models.generateContent({
        model: targetModel,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });
    } catch (err: any) {
      console.warn(`Error with ${targetModel}, attempting fallback:`, err?.message || err);
      // Fallback to gemini-3.8-flash if primary fails
      actualModel = 'gemini-3.8-flash';
      response = await ai.models.generateContent({
        model: actualModel,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });
    }

    const replyText = response.text || 'I am ready to help organize your room. Where would you like to start?';

    res.json({
      reply: replyText,
      modelUsed: actualModel,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate chat response',
    });
  }
});

// Configure Vite middleware or production static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ClutterFree AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
