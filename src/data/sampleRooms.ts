export interface SampleRoom {
  id: string;
  name: string;
  roomType: string;
  thumbnailSvg: string;
  description: string;
  presetAnalysisSummary: string;
}

// Crisp illustrative SVG representations of real rooms with realistic clutter
// that can be converted to base64 or used directly as visual demonstration rooms.
export const SAMPLE_ROOMS: {
  id: string;
  name: string;
  roomType: string;
  tagline: string;
  description: string;
  imageUrl: string;
}[] = [
  {
    id: 'office-desk',
    name: 'Tangled Tech Home Office',
    roomType: 'Home Office / Workspace',
    tagline: 'Cable clutter, overflowing papers & dual monitors',
    description: 'A dedicated workspace overwhelmed by tangled power cords, sticky notes, scattered pens, and stacked delivery boxes.',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'kitchen-island',
    name: 'Cluttered Kitchen Island & Counter',
    roomType: 'Kitchen & Dining',
    tagline: 'Mail drop zone, small appliances & pantry spillover',
    description: 'Central kitchen counter covered in unopened mail, school papers, multiple appliances, vitamins, and loose groceries.',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'closet-wardrobe',
    name: 'Overflowing Bedroom Wardrobe',
    roomType: 'Bedroom & Closet',
    tagline: 'Mixed hangers, floor shoe pile & chair clothing stack',
    description: 'Bedroom closet with mismatched hangers, garments spilling onto the floor, and the infamous "chair of clothes".',
    imageUrl: 'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'living-room',
    name: 'Busy Family Living Room',
    roomType: 'Living Room',
    tagline: 'Board games, scattered remotes & throw pillows',
    description: 'A cozy living area cluttered with discarded throws, kids toys on the rug, magazines, and multiple remote controls.',
    imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
  },
];
