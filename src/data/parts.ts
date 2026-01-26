import { PartType, PartCategory } from '@/types/game';

// Part icons for visual representation
export const PART_ICONS: Record<PartType, string> = {
  // Mechanical
  engine: '🔧',
  transmission: '⚙️',
  brakes: '🛑',
  suspension: '🔩',
  exhaust: '💨',
  fuel_system: '⛽',
  // Body
  paint: '🎨',
  dents: '🔨',
  rust: '🦠',
  windows: '🪟',
  lights: '💡',
  bumpers: '🛡️',
  // Tires
  front_tires: '🛞',
  rear_tires: '🛞',
  wheels: '⭕',
  alignment: '📐',
  tire_pressure: '🎈',
  wheel_bearings: '🔘',
  // Interior
  seats: '🪑',
  dashboard: '🖥️',
  electronics: '⚡',
  cleaning: '🧹',
  air_conditioning: '❄️',
  audio_system: '🔊',
};

// Part definitions with costs balanced for 3x value increase minimum
// If a repair costs 30$ and 10 energy, value increase should be at least 90$
export const PART_DEFINITIONS: Record<PartType, { 
  category: PartCategory; 
  baseEnergyCost: number;
  baseMoneyCost: number; // NEW: Money cost
  baseRepairTime: number;
  baseValueGain: number; // NEW: Guaranteed value gain (at least 3x cost)
  diyDifficulty: number;
  skillRequired: keyof typeof SKILL_MAP;
}> = {
  // Mechanical - expensive but high value
  engine: { category: 'mechanical', baseEnergyCost: 80, baseMoneyCost: 150, baseRepairTime: 180, baseValueGain: 600, diyDifficulty: 9, skillRequired: 'mechanical' },
  transmission: { category: 'mechanical', baseEnergyCost: 70, baseMoneyCost: 120, baseRepairTime: 150, baseValueGain: 480, diyDifficulty: 8, skillRequired: 'mechanical' },
  brakes: { category: 'mechanical', baseEnergyCost: 40, baseMoneyCost: 50, baseRepairTime: 60, baseValueGain: 200, diyDifficulty: 5, skillRequired: 'mechanical' },
  suspension: { category: 'mechanical', baseEnergyCost: 55, baseMoneyCost: 80, baseRepairTime: 90, baseValueGain: 320, diyDifficulty: 7, skillRequired: 'mechanical' },
  exhaust: { category: 'mechanical', baseEnergyCost: 35, baseMoneyCost: 40, baseRepairTime: 50, baseValueGain: 160, diyDifficulty: 4, skillRequired: 'mechanical' },
  fuel_system: { category: 'mechanical', baseEnergyCost: 50, baseMoneyCost: 70, baseRepairTime: 80, baseValueGain: 280, diyDifficulty: 6, skillRequired: 'mechanical' },
  // Body - moderate costs
  paint: { category: 'body', baseEnergyCost: 50, baseMoneyCost: 80, baseRepairTime: 120, baseValueGain: 320, diyDifficulty: 7, skillRequired: 'bodywork' },
  dents: { category: 'body', baseEnergyCost: 35, baseMoneyCost: 40, baseRepairTime: 70, baseValueGain: 160, diyDifficulty: 5, skillRequired: 'bodywork' },
  rust: { category: 'body', baseEnergyCost: 55, baseMoneyCost: 60, baseRepairTime: 100, baseValueGain: 240, diyDifficulty: 6, skillRequired: 'bodywork' },
  windows: { category: 'body', baseEnergyCost: 25, baseMoneyCost: 35, baseRepairTime: 40, baseValueGain: 140, diyDifficulty: 4, skillRequired: 'bodywork' },
  lights: { category: 'body', baseEnergyCost: 20, baseMoneyCost: 25, baseRepairTime: 25, baseValueGain: 100, diyDifficulty: 3, skillRequired: 'electrical' },
  bumpers: { category: 'body', baseEnergyCost: 40, baseMoneyCost: 50, baseRepairTime: 60, baseValueGain: 200, diyDifficulty: 5, skillRequired: 'bodywork' },
  // Tires - cheaper
  front_tires: { category: 'tires', baseEnergyCost: 30, baseMoneyCost: 40, baseRepairTime: 40, baseValueGain: 160, diyDifficulty: 3, skillRequired: 'tires' },
  rear_tires: { category: 'tires', baseEnergyCost: 30, baseMoneyCost: 40, baseRepairTime: 40, baseValueGain: 160, diyDifficulty: 3, skillRequired: 'tires' },
  wheels: { category: 'tires', baseEnergyCost: 40, baseMoneyCost: 60, baseRepairTime: 55, baseValueGain: 240, diyDifficulty: 5, skillRequired: 'tires' },
  alignment: { category: 'tires', baseEnergyCost: 25, baseMoneyCost: 30, baseRepairTime: 35, baseValueGain: 120, diyDifficulty: 6, skillRequired: 'tires' },
  tire_pressure: { category: 'tires', baseEnergyCost: 10, baseMoneyCost: 5, baseRepairTime: 15, baseValueGain: 30, diyDifficulty: 1, skillRequired: 'tires' },
  wheel_bearings: { category: 'tires', baseEnergyCost: 50, baseMoneyCost: 70, baseRepairTime: 80, baseValueGain: 280, diyDifficulty: 7, skillRequired: 'tires' },
  // Interior - moderate
  seats: { category: 'interior', baseEnergyCost: 45, baseMoneyCost: 60, baseRepairTime: 70, baseValueGain: 240, diyDifficulty: 4, skillRequired: 'bodywork' },
  dashboard: { category: 'interior', baseEnergyCost: 40, baseMoneyCost: 55, baseRepairTime: 60, baseValueGain: 220, diyDifficulty: 6, skillRequired: 'electrical' },
  electronics: { category: 'interior', baseEnergyCost: 55, baseMoneyCost: 80, baseRepairTime: 90, baseValueGain: 320, diyDifficulty: 8, skillRequired: 'electrical' },
  cleaning: { category: 'interior', baseEnergyCost: 15, baseMoneyCost: 10, baseRepairTime: 30, baseValueGain: 50, diyDifficulty: 1, skillRequired: 'bodywork' },
  air_conditioning: { category: 'interior', baseEnergyCost: 50, baseMoneyCost: 70, baseRepairTime: 80, baseValueGain: 280, diyDifficulty: 7, skillRequired: 'electrical' },
  audio_system: { category: 'interior', baseEnergyCost: 35, baseMoneyCost: 45, baseRepairTime: 50, baseValueGain: 180, diyDifficulty: 5, skillRequired: 'electrical' },
};

// Skill mapping for DIY repairs
export const SKILL_MAP = {
  mechanical: 'mechanical',
  bodywork: 'bodywork',
  electrical: 'electrical',
  tires: 'tires',
} as const;

// Calculate DIY success chance
export function calculateDiySuccessChance(
  partType: PartType,
  skillLevel: number,
  toolLevel: number,
  hasSpecialEquipment: boolean,
  partUpgradeLevel: number = 0 // NEW: Part-specific upgrade level (0-10)
): number {
  const partDef = PART_DEFINITIONS[partType];
  const baseDifficulty = partDef.diyDifficulty;
  
  // Base success: 25% + skill contribution + tool contribution + equipment bonus + part upgrade
  const skillBonus = skillLevel * 2; // 2% per skill level
  const toolBonus = toolLevel * 4; // 4% per tool level
  const equipBonus = hasSpecialEquipment ? 10 : 0;
  const partUpgradeBonus = partUpgradeLevel * 3; // 3% per part upgrade level
  
  // Difficulty reduces success rate
  const difficultyPenalty = baseDifficulty * 5;
  
  const successChance = 25 + skillBonus + toolBonus + equipBonus + partUpgradeBonus - difficultyPenalty;
  
  return Math.max(5, Math.min(95, successChance));
}

// Get category label
export const CATEGORY_LABELS: Record<PartCategory, string> = {
  mechanical: 'Mechanical',
  body: 'Body',
  tires: 'Tires & Wheels',
  interior: 'Interior',
};

// Get category icon
export const CATEGORY_ICONS: Record<PartCategory, string> = {
  mechanical: '⚙️',
  body: '🚗',
  tires: '🛞',
  interior: '🪑',
};

// Part upgrade costs (10 levels per part)
export function getPartUpgradeCost(partType: PartType, currentLevel: number): number {
  const partDef = PART_DEFINITIONS[partType];
  const baseCost = partDef.baseMoneyCost * 5;
  return Math.floor(baseCost * Math.pow(1.5, currentLevel));
}

// Get all parts in order
export const ALL_PARTS: PartType[] = [
  'engine', 'transmission', 'brakes', 'suspension', 'exhaust', 'fuel_system',
  'paint', 'dents', 'rust', 'windows', 'lights', 'bumpers',
  'front_tires', 'rear_tires', 'wheels', 'alignment', 'tire_pressure', 'wheel_bearings',
  'seats', 'dashboard', 'electronics', 'cleaning', 'air_conditioning', 'audio_system',
];

export function getInitialPartUpgrades(): Record<PartType, number> {
  return ALL_PARTS.reduce((acc, part) => ({ ...acc, [part]: 0 }), {} as Record<PartType, number>);
}
