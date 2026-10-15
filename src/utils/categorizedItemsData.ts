import { CategorizedItemSolution, ItemCategory, RoomAnalysisResult } from '../types/declutter.js';

export const DEFAULT_CATEGORIZED_SOLUTIONS: CategorizedItemSolution[] = [
  // 1. Office Supplies & Tech
  {
    id: 'item-off-1',
    itemName: 'Loose Charging Cables & Adapters',
    category: 'office_supplies',
    categoryLabel: 'Office Supplies & Tech',
    recommendedOrganizer: 'Under-desk cable raceway & silicone velcro cable ties',
    estimatedPriceRange: '$12 - $18',
    organizingStrategy: 'Consolidate multiple power strips off the carpet; bundle slack using color-coded reusable straps.',
    placementTip: 'Clamp beneath the rear desk apron directly adjacent to wall outlets.',
    actionBin: 'keep',
  },
  {
    id: 'item-off-2',
    itemName: 'Stationery, Pens & Desk Scissors',
    category: 'office_supplies',
    categoryLabel: 'Office Supplies & Tech',
    recommendedOrganizer: 'Expandable bamboo drawer divider or 3-tier clear acrylic caddy',
    estimatedPriceRange: '$10 - $16',
    organizingStrategy: 'Clear prime desktop real estate. Keep only 2 everyday pens on top; store backups in top drawer.',
    placementTip: 'Front-right corner of the uppermost desk drawer.',
    actionBin: 'keep',
  },
  {
    id: 'item-off-3',
    itemName: 'Sticky Notes, USB Flash Drives & Paperclips',
    category: 'office_supplies',
    categoryLabel: 'Office Supplies & Tech',
    recommendedOrganizer: 'Stackable magnetic micro-organizer trays with lidded compartments',
    estimatedPriceRange: '$8 - $14',
    organizingStrategy: 'Group tiny accessories into designated shallow compartments so they never spill across open surfaces.',
    placementTip: 'Under monitor riser or inside top pedestal drawer.',
    actionBin: 'keep',
  },

  // 2. Books, Notebooks & Paperwork
  {
    id: 'item-book-1',
    itemName: 'Reference Books, Manuals & Textbooks',
    category: 'books_paper',
    categoryLabel: 'Books & Paperwork',
    recommendedOrganizer: 'Weighted powder-coated steel bookends & floating wall shelves',
    estimatedPriceRange: '$15 - $28',
    organizingStrategy: 'Sort vertically by height or frequency of consultation. Relocate books read only once to secondary shelving.',
    placementTip: 'Eye-level shelf centered above desk or adjacent credenza.',
    actionBin: 'keep',
  },
  {
    id: 'item-book-2',
    itemName: 'Active Bills, Incoming Mail & Tax Receipts',
    category: 'books_paper',
    categoryLabel: 'Books & Paperwork',
    recommendedOrganizer: '3-Tier wall-mounted wire document file or acrylic in-and-out tray',
    estimatedPriceRange: '$14 - $22',
    organizingStrategy: 'Enforce the One-Touch Rule: immediately shred circulars, file archive documents, and keep only active bills in tray.',
    placementTip: 'Mount on the wall directly at room entrance or desk perimeter.',
    actionBin: 'keep',
  },
  {
    id: 'item-book-3',
    itemName: 'Expired Catalogs, Old Magazines & Redundant Notes',
    category: 'books_paper',
    categoryLabel: 'Books & Paperwork',
    recommendedOrganizer: 'Heavy-duty cross-cut home paper shredder & recycling bin',
    estimatedPriceRange: '$25 - $45',
    organizingStrategy: 'Recycle periodicals over 3 months old; snap smartphone scans of must-save reference articles.',
    placementTip: 'Tucked discreetly next to waste basket.',
    actionBin: 'recycle',
  },

  // 3. Kitchenware & Pantry
  {
    id: 'item-kitch-1',
    itemName: 'Spices, Seasoning Bottles & Oil Dispensers',
    category: 'kitchenware',
    categoryLabel: 'Kitchenware & Pantry',
    recommendedOrganizer: '2-Tier stainless steel Lazy Susan turntable or tiered drawer spice liner',
    estimatedPriceRange: '$12 - $20',
    organizingStrategy: 'Rotate items effortlessly without knocking over back bottles. Keeps sticky bottles off raw counters.',
    placementTip: 'Cabinet shelf closest to cooking range, or far counter corner.',
    actionBin: 'keep',
  },
  {
    id: 'item-kitch-2',
    itemName: 'Cutlery, Whisks, Spatulas & Kitchen Knives',
    category: 'kitchenware',
    categoryLabel: 'Kitchenware & Pantry',
    recommendedOrganizer: 'Magnetic acacia wall knife strip & expandable diagonal drawer dividers',
    estimatedPriceRange: '$18 - $30',
    organizingStrategy: 'Frees up precious prep counter space while protecting knife edges from dulling in cluttered bins.',
    placementTip: 'Backsplash tile directly above main prep workspace.',
    actionBin: 'keep',
  },
  {
    id: 'item-kitch-3',
    itemName: 'Pots, Pans, Skillets & Baking Sheets',
    category: 'kitchenware',
    categoryLabel: 'Kitchenware & Pantry',
    recommendedOrganizer: 'Heavy-duty adjustable vertical cookware rack & slide-out basket',
    estimatedPriceRange: '$19 - $35',
    organizingStrategy: 'Store pans vertically like books on a shelf instead of noisy, scratching nesting stacks.',
    placementTip: 'Deep lower base cabinet next to stove.',
    actionBin: 'keep',
  },

  // 4. Clothing & Wardrobe
  {
    id: 'item-cloth-1',
    itemName: 'Shirts, Blouses, Jackets & Dresses',
    category: 'clothing',
    categoryLabel: 'Clothing & Wardrobe',
    recommendedOrganizer: 'Ultra-slim non-slip velvet hangers with shoulder notches',
    estimatedPriceRange: '$16 - $24 (Pack of 50)',
    organizingStrategy: 'Replacing bulky mismatched plastic/wire hangers increases closet rod hanging capacity by up to 50%.',
    placementTip: 'Main closet hanging rod, grouped by category and sleeve length.',
    actionBin: 'keep',
  },
  {
    id: 'item-cloth-2',
    itemName: 'Shoes, Sneakers & Boots',
    category: 'clothing',
    categoryLabel: 'Clothing & Wardrobe',
    recommendedOrganizer: 'Stackable clear drop-front shoe boxes or 3-tier expandable shoe rack',
    estimatedPriceRange: '$20 - $35',
    organizingStrategy: 'Lifts shoes off closet carpet; prevents piles and keeps dust away from leather and canvas.',
    placementTip: 'Bottom floor of closet or bedroom entryway nook.',
    actionBin: 'keep',
  },
  {
    id: 'item-cloth-3',
    itemName: 'Underwear, Socks, Belts & Scarves',
    category: 'clothing',
    categoryLabel: 'Clothing & Wardrobe',
    recommendedOrganizer: 'Honeycomb fabric drawer organizer bins with individual cell dividers',
    estimatedPriceRange: '$11 - $18',
    organizingStrategy: 'Enables KonMari vertical rolling so every single item is instantly visible without rummaging.',
    placementTip: 'Top dresser drawer or wardrobe slide-out wire baskets.',
    actionBin: 'keep',
  },
  {
    id: 'item-cloth-4',
    itemName: 'Bulky Winter Coats, Sweaters & Extra Blankets',
    category: 'clothing',
    categoryLabel: 'Clothing & Wardrobe',
    recommendedOrganizer: 'Vacuum compression storage bags with airtight zip seals',
    estimatedPriceRange: '$15 - $22',
    organizingStrategy: 'Compress off-season clothing down to 25% of their original bulk to free primary wardrobe space.',
    placementTip: 'High closet top shelf or under-bed storage drawers.',
    actionBin: 'keep',
  },

  // 5. Miscellaneous & Sentimental
  {
    id: 'item-misc-1',
    itemName: 'Sentimental Keepsakes, Travel Souvenirs & Letters',
    category: 'miscellaneous',
    categoryLabel: 'Sentimental & Memory Items',
    recommendedOrganizer: 'Archival linen-wrapped memory keepsake box with interior folders',
    estimatedPriceRange: '$18 - $28',
    organizingStrategy: 'Apply the "One Treasure Box" boundary: curated memories are cherished rather than scattered.',
    placementTip: 'Top shelf of wardrobe or bedroom bookcase.',
    actionBin: 'keep',
  },
  {
    id: 'item-misc-2',
    itemName: 'Duplicate Cables, Obsolete Chargers & Broken Gadgets',
    category: 'miscellaneous',
    categoryLabel: 'E-Waste & Recycling',
    recommendedOrganizer: 'Recycled clear tote labeled "E-Waste / Best Buy Drop-off"',
    estimatedPriceRange: '$5 - $10',
    organizingStrategy: 'Do not let dead gadgets take up live home storage. Safely recycle lithium batteries and copper cords.',
    placementTip: 'Staged in mudroom or garage for next weekend recycling trip.',
    actionBin: 'recycle',
  },
];

export function getItemSolutionsForRoom(analysis?: RoomAnalysisResult | null): CategorizedItemSolution[] {
  if (!analysis) return DEFAULT_CATEGORIZED_SOLUTIONS;

  // Enhance default solutions with any specific items detected by Gemini from the photo
  const photoItems: CategorizedItemSolution[] = [];
  const hotspots = analysis.hotspots || [];

  hotspots.forEach((spot, idx) => {
    (spot.itemsIdentified || []).forEach((item, itemIdx) => {
      const lower = item.toLowerCase();
      let category: ItemCategory = 'miscellaneous';
      let label = 'Miscellaneous Items';
      let organizer = 'Labelled woven storage bin or clear drawer divider';
      let price = '$12 - $20';
      let strategy = 'Assign a permanent home grouped with similar frequency-of-use items.';
      let tip = `Store near ${spot.name}`;
      let bin: any = 'keep';

      if (lower.includes('cable') || lower.includes('cord') || lower.includes('pen') || lower.includes('charger') || lower.includes('adapter') || lower.includes('mouse') || lower.includes('tech')) {
        category = 'office_supplies';
        label = 'Office Supplies & Tech';
        organizer = 'Under-desk cable clip raceway & desktop drawer divider';
        price = '$10 - $22';
        strategy = 'Contain cables along desk spine to eliminate foot tangle.';
        tip = 'Mount behind desk leg or inside pedestal.';
      } else if (lower.includes('book') || lower.includes('paper') || lower.includes('mail') || lower.includes('receipt') || lower.includes('note') || lower.includes('magazine')) {
        category = 'books_paper';
        label = 'Books & Paperwork';
        organizer = 'Vertical file sorter & steel bookends';
        price = '$14 - $25';
        strategy = 'Separate action paperwork from archive documents.';
        tip = 'Keep at arm reach on desktop or wall ledge.';
        if (lower.includes('receipt') || lower.includes('shred') || lower.includes('wrapper')) {
          bin = 'recycle';
        }
      } else if (lower.includes('dish') || lower.includes('cup') || lower.includes('mug') || lower.includes('spice') || lower.includes('pan') || lower.includes('food')) {
        category = 'kitchenware';
        label = 'Kitchenware & Dining';
        organizer = 'Countertop ceramic tray or rotating turntable';
        price = '$12 - $19';
        strategy = 'Keep kitchen counters 70% clear for food prep.';
        tip = 'Store immediately adjacent to water source or stove.';
        if (lower.includes('empty') || lower.includes('wrapper')) {
          bin = 'trash';
        }
      } else if (lower.includes('cloth') || lower.includes('shoe') || lower.includes('hanger') || lower.includes('jacket') || lower.includes('shirt')) {
        category = 'clothing';
        label = 'Clothing & Wardrobe';
        organizer = 'Velvet non-slip hanger set & drawer honeycomb cells';
        price = '$15 - $25';
        strategy = 'Remove floor piles; hang garments facing the same direction.';
        tip = 'Group by clothing type and color in closet.';
      }

      photoItems.push({
        id: `photo-item-${idx}-${itemIdx}`,
        itemName: item,
        category,
        categoryLabel: label,
        recommendedOrganizer: organizer,
        estimatedPriceRange: price,
        organizingStrategy: strategy,
        placementTip: tip,
        actionBin: bin,
      });
    });
  });

  // Combine unique items from photo with curated category knowledge
  const combined = [...photoItems];
  DEFAULT_CATEGORIZED_SOLUTIONS.forEach(def => {
    if (!combined.some(c => c.itemName.toLowerCase() === def.itemName.toLowerCase())) {
      combined.push(def);
    }
  });

  return combined;
}
