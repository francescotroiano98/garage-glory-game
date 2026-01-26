import { ToolLevel, DiagnosticLevel, MAX_LEVEL } from '@/types/game';

// Tool upgrades - 6 levels, harder progression
export const TOOL_UPGRADES: Array<{
  level: ToolLevel;
  name: string;
  cost: number;
  desc: string;
  energyReduction: number;
  speedBonus: number;
  diyBonus: number;
}> = [
  { level: 'standard', name: 'Standard Tools', cost: 800, desc: '-10% energy, +5% DIY success', energyReduction: 0.1, speedBonus: 0, diyBonus: 1 },
  { level: 'pro', name: 'Pro Tools', cost: 2500, desc: '-20% energy, -10% time, +10% DIY', energyReduction: 0.2, speedBonus: 0.1, diyBonus: 2 },
  { level: 'advanced', name: 'Advanced Tools', cost: 6000, desc: '-30% energy, -20% time, +15% DIY', energyReduction: 0.3, speedBonus: 0.2, diyBonus: 3 },
  { level: 'premium', name: 'Premium Tools', cost: 12000, desc: '-40% energy, -30% time, +20% DIY', energyReduction: 0.4, speedBonus: 0.3, diyBonus: 4 },
  { level: 'master', name: 'Master Tools', cost: 25000, desc: '-50% energy, -40% time, +25% DIY', energyReduction: 0.5, speedBonus: 0.4, diyBonus: 5 },
];

// Diagnostic upgrades - 6 levels
export const DIAGNOSTIC_UPGRADES: Array<{
  level: DiagnosticLevel;
  name: string;
  cost: number;
  desc: string;
  visibilityBonus: number;
}> = [
  { level: 'basic_scanner', name: 'Basic Scanner', cost: 600, desc: 'Reveal 30% hidden issues', visibilityBonus: 0.3 },
  { level: 'intermediate', name: 'Intermediate Scanner', cost: 2000, desc: 'Reveal 50% hidden issues', visibilityBonus: 0.5 },
  { level: 'pro_diagnostic', name: 'Pro Diagnostic', cost: 5000, desc: 'Reveal 70% hidden issues', visibilityBonus: 0.7 },
  { level: 'advanced', name: 'Advanced Diagnostic', cost: 10000, desc: 'Reveal 85% hidden issues', visibilityBonus: 0.85 },
  { level: 'master', name: 'Master Diagnostic', cost: 20000, desc: 'Reveal ALL problems', visibilityBonus: 1.0 },
];

// Garage upgrades - more options
export const GARAGE_UPGRADES = {
  carBays: [
    { value: 2, name: '2nd Car Bay', cost: 1500, desc: 'Work on 2 cars' },
    { value: 3, name: '3rd Car Bay', cost: 4000, desc: 'Work on 3 cars' },
    { value: 4, name: '4th Car Bay', cost: 8000, desc: 'Work on 4 cars' },
    { value: 5, name: '5th Car Bay', cost: 15000, desc: 'Work on 5 cars' },
  ],
  specialEquipment: [
    { key: 'hasPaintBooth', name: 'Paint Booth', cost: 5000, desc: '+20% body DIY success' },
    { key: 'hasEngineLift', name: 'Engine Lift', cost: 8000, desc: '+20% mechanical DIY success' },
    { key: 'hasAlignmentRack', name: 'Alignment Rack', cost: 4000, desc: '+20% tire DIY success' },
    { key: 'hasAdvancedTools', name: 'Electrical Station', cost: 6000, desc: '+20% electrical DIY success' },
    { key: 'hasCleaningStation', name: 'Cleaning Station', cost: 2000, desc: '-50% interior cleaning energy' },
  ],
};

// Energy upgrades - more levels
export const ENERGY_UPGRADES = [
  { maxEnergy: 1500, cost: 1000, desc: 'Max energy: 1,500' },
  { maxEnergy: 2000, cost: 3000, desc: 'Max energy: 2,000' },
  { maxEnergy: 2500, cost: 6000, desc: 'Max energy: 2,500' },
  { maxEnergy: 3000, cost: 10000, desc: 'Max energy: 3,000' },
  { maxEnergy: 4000, cost: 18000, desc: 'Max energy: 4,000' },
  { maxEnergy: 5000, cost: 30000, desc: 'Max energy: 5,000' },
];

// Skill upgrade costs (exponential)
export function getSkillUpgradeCost(currentLevel: number): number {
  return Math.floor(100 * Math.pow(1.5, currentLevel - 1));
}

// XP required for next level (exponential curve, 20 levels max)
export function getXpForLevel(level: number): number {
  if (level >= MAX_LEVEL) return Infinity; // Can't level past max
  // Level 1->2: 100 XP, Level 19->20: ~3700 XP
  return Math.floor(100 * Math.pow(1.2, level - 1));
}

// Skill points per level
export function getSkillPointsForLevel(level: number): number {
  // 1 point at levels 1-5, 2 points at 6-10, 3 points at 11-15, 4 points at 16-20
  if (level <= 5) return 1;
  if (level <= 10) return 2;
  if (level <= 15) return 3;
  return 4;
}

// Tool level index helper
export function getToolLevelIndex(level: ToolLevel): number {
  const levels: ToolLevel[] = ['basic', 'standard', 'pro', 'advanced', 'premium', 'master'];
  return levels.indexOf(level);
}

// Diagnostic level index helper
export function getDiagnosticLevelIndex(level: DiagnosticLevel): number {
  const levels: DiagnosticLevel[] = ['visual', 'basic_scanner', 'intermediate', 'pro_diagnostic', 'advanced', 'master'];
  return levels.indexOf(level);
}
