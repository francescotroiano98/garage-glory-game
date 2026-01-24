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

// Part definitions with energy costs, repair times, and DIY difficulty
export const PART_DEFINITIONS: Record<PartType, { 
  category: PartCategory; 
  baseEnergyCost: number; 
  baseRepairTime: number;
  diyDifficulty: number; // 1-10, higher = harder
  skillRequired: keyof typeof SKILL_MAP;
}> = {
  // Mechanical - requires mechanical skill
  engine: { category: 'mechanical', baseEnergyCost: 80, baseRepairTime: 180, diyDifficulty: 9, skillRequired: 'mechanical' },
  transmission: { category: 'mechanical', baseEnergyCost: 70, baseRepairTime: 150, diyDifficulty: 8, skillRequired: 'mechanical' },
  brakes: { category: 'mechanical', baseEnergyCost: 40, baseRepairTime: 60, diyDifficulty: 5, skillRequired: 'mechanical' },
  suspension: { category: 'mechanical', baseEnergyCost: 55, baseRepairTime: 90, diyDifficulty: 7, skillRequired: 'mechanical' },
  exhaust: { category: 'mechanical', baseEnergyCost: 35, baseRepairTime: 50, diyDifficulty: 4, skillRequired: 'mechanical' },
  fuel_system: { category: 'mechanical', baseEnergyCost: 50, baseRepairTime: 80, diyDifficulty: 6, skillRequired: 'mechanical' },
  // Body - requires bodywork skill
  paint: { category: 'body', baseEnergyCost: 50, baseRepairTime: 120, diyDifficulty: 7, skillRequired: 'bodywork' },
  dents: { category: 'body', baseEnergyCost: 35, baseRepairTime: 70, diyDifficulty: 5, skillRequired: 'bodywork' },
  rust: { category: 'body', baseEnergyCost: 55, baseRepairTime: 100, diyDifficulty: 6, skillRequired: 'bodywork' },
  windows: { category: 'body', baseEnergyCost: 25, baseRepairTime: 40, diyDifficulty: 4, skillRequired: 'bodywork' },
  lights: { category: 'body', baseEnergyCost: 20, baseRepairTime: 25, diyDifficulty: 3, skillRequired: 'electrical' },
  bumpers: { category: 'body', baseEnergyCost: 40, baseRepairTime: 60, diyDifficulty: 5, skillRequired: 'bodywork' },
  // Tires - requires tires skill
  front_tires: { category: 'tires', baseEnergyCost: 30, baseRepairTime: 40, diyDifficulty: 3, skillRequired: 'tires' },
  rear_tires: { category: 'tires', baseEnergyCost: 30, baseRepairTime: 40, diyDifficulty: 3, skillRequired: 'tires' },
  wheels: { category: 'tires', baseEnergyCost: 40, baseRepairTime: 55, diyDifficulty: 5, skillRequired: 'tires' },
  alignment: { category: 'tires', baseEnergyCost: 25, baseRepairTime: 35, diyDifficulty: 6, skillRequired: 'tires' },
  tire_pressure: { category: 'tires', baseEnergyCost: 10, baseRepairTime: 15, diyDifficulty: 1, skillRequired: 'tires' },
  wheel_bearings: { category: 'tires', baseEnergyCost: 50, baseRepairTime: 80, diyDifficulty: 7, skillRequired: 'tires' },
  // Interior - requires electrical skill
  seats: { category: 'interior', baseEnergyCost: 45, baseRepairTime: 70, diyDifficulty: 4, skillRequired: 'bodywork' },
  dashboard: { category: 'interior', baseEnergyCost: 40, baseRepairTime: 60, diyDifficulty: 6, skillRequired: 'electrical' },
  electronics: { category: 'interior', baseEnergyCost: 55, baseRepairTime: 90, diyDifficulty: 8, skillRequired: 'electrical' },
  cleaning: { category: 'interior', baseEnergyCost: 15, baseRepairTime: 30, diyDifficulty: 1, skillRequired: 'bodywork' },
  air_conditioning: { category: 'interior', baseEnergyCost: 50, baseRepairTime: 80, diyDifficulty: 7, skillRequired: 'electrical' },
  audio_system: { category: 'interior', baseEnergyCost: 35, baseRepairTime: 50, diyDifficulty: 5, skillRequired: 'electrical' },
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
  toolLevel: number, // 0-5 based on tool upgrades
  hasSpecialEquipment: boolean
): number {
  const partDef = PART_DEFINITIONS[partType];
  const baseDifficulty = partDef.diyDifficulty;
  
  // Base success: 30% + skill contribution + tool contribution + equipment bonus
  // Skill contributes up to 40% (2% per skill level, max 20)
  // Tools contribute up to 20% (4% per tool level, max 5)
  // Special equipment adds 10%
  
  const skillBonus = skillLevel * 2; // 2% per skill level
  const toolBonus = toolLevel * 4; // 4% per tool level
  const equipBonus = hasSpecialEquipment ? 10 : 0;
  
  // Difficulty reduces success rate
  const difficultyPenalty = baseDifficulty * 5; // 5% per difficulty point
  
  const successChance = 30 + skillBonus + toolBonus + equipBonus - difficultyPenalty;
  
  // Clamp between 5% and 95%
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
