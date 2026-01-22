import { Car, CarCategory, PartDamage, DamageLevel, PartType, PartCategory } from '@/types/game';

// Part definitions with energy costs and value impacts
export const PART_DEFINITIONS: Record<PartType, { category: PartCategory; baseEnergyCost: number; baseRepairTime: number }> = {
  // Mechanical
  engine: { category: 'mechanical', baseEnergyCost: 50, baseRepairTime: 120 },
  transmission: { category: 'mechanical', baseEnergyCost: 45, baseRepairTime: 100 },
  brakes: { category: 'mechanical', baseEnergyCost: 25, baseRepairTime: 40 },
  suspension: { category: 'mechanical', baseEnergyCost: 35, baseRepairTime: 60 },
  exhaust: { category: 'mechanical', baseEnergyCost: 20, baseRepairTime: 30 },
  // Body
  paint: { category: 'body', baseEnergyCost: 30, baseRepairTime: 90 },
  dents: { category: 'body', baseEnergyCost: 20, baseRepairTime: 45 },
  rust: { category: 'body', baseEnergyCost: 35, baseRepairTime: 60 },
  windows: { category: 'body', baseEnergyCost: 15, baseRepairTime: 25 },
  lights: { category: 'body', baseEnergyCost: 10, baseRepairTime: 15 },
  bumpers: { category: 'body', baseEnergyCost: 25, baseRepairTime: 40 },
  // Tires
  tires: { category: 'tires', baseEnergyCost: 20, baseRepairTime: 30 },
  wheels: { category: 'tires', baseEnergyCost: 25, baseRepairTime: 35 },
  alignment: { category: 'tires', baseEnergyCost: 15, baseRepairTime: 20 },
  // Interior
  seats: { category: 'interior', baseEnergyCost: 30, baseRepairTime: 50 },
  dashboard: { category: 'interior', baseEnergyCost: 25, baseRepairTime: 40 },
  electronics: { category: 'interior', baseEnergyCost: 35, baseRepairTime: 55 },
  cleaning: { category: 'interior', baseEnergyCost: 10, baseRepairTime: 20 },
};

// Damage level multipliers
export const DAMAGE_MULTIPLIERS: Record<DamageLevel, { energy: number; time: number; value: number }> = {
  none: { energy: 0, time: 0, value: 0 },
  minor: { energy: 0.4, time: 0.5, value: 0.05 },
  moderate: { energy: 0.7, time: 0.75, value: 0.12 },
  major: { energy: 1, time: 1, value: 0.2 },
  critical: { energy: 1.3, time: 1.25, value: 0.3 },
};

// Car templates
export const CAR_TEMPLATES: Array<{ name: string; category: CarCategory; baseValue: number; image: string }> = [
  // Economy
  { name: 'Compact Hatch', category: 'economy', baseValue: 300, image: '🚗' },
  { name: 'City Runner', category: 'economy', baseValue: 400, image: '🚙' },
  { name: 'Budget Wagon', category: 'economy', baseValue: 350, image: '🚗' },
  // Sedan
  { name: 'Family Sedan', category: 'sedan', baseValue: 600, image: '🚘' },
  { name: 'Executive Sedan', category: 'sedan', baseValue: 800, image: '🚘' },
  { name: 'Classic Sedan', category: 'sedan', baseValue: 700, image: '🚗' },
  // SUV
  { name: 'Urban SUV', category: 'suv', baseValue: 1200, image: '🚙' },
  { name: 'Off-Road SUV', category: 'suv', baseValue: 1500, image: '🚙' },
  // Sports
  { name: 'Sports Coupe', category: 'sports', baseValue: 2000, image: '🏎️' },
  { name: 'Muscle Car', category: 'sports', baseValue: 2500, image: '🏎️' },
  // Luxury
  { name: 'Luxury Sedan', category: 'luxury', baseValue: 4000, image: '🚘' },
  { name: 'Premium Convertible', category: 'luxury', baseValue: 5000, image: '🏎️' },
];

// Generate random damage for a car
function generateDamage(baseValue: number, damageIntensity: number): PartDamage[] {
  const damages: PartDamage[] = [];
  const parts = Object.keys(PART_DEFINITIONS) as PartType[];
  
  // Randomly select parts to damage (more parts for higher intensity)
  const numDamagedParts = Math.floor(3 + Math.random() * (damageIntensity * 5));
  const shuffledParts = parts.sort(() => Math.random() - 0.5).slice(0, numDamagedParts);
  
  shuffledParts.forEach(partType => {
    const def = PART_DEFINITIONS[partType];
    const levels: DamageLevel[] = ['minor', 'moderate', 'major', 'critical'];
    const levelIndex = Math.min(Math.floor(Math.random() * (1 + damageIntensity * 3)), 3);
    const level = levels[levelIndex];
    const multipliers = DAMAGE_MULTIPLIERS[level];
    
    // Some damages are hidden (30-60% chance based on category)
    const visibilityChance = def.category === 'body' ? 0.8 : 0.4;
    
    damages.push({
      part: partType,
      category: def.category,
      level,
      visible: Math.random() < visibilityChance,
      repaired: false,
      energyCost: Math.round(def.baseEnergyCost * multipliers.energy),
      repairTime: Math.round(def.baseRepairTime * multipliers.time),
      valueImpact: baseValue * multipliers.value,
    });
  });
  
  return damages;
}

// Calculate car value based on damages
function calculateCurrentValue(baseValue: number, damages: PartDamage[]): number {
  const totalDamageValue = damages.reduce((sum, d) => sum + (d.repaired ? 0 : d.valueImpact), 0);
  return Math.max(baseValue * 0.1, baseValue - totalDamageValue);
}

// Generate a car for the newspaper
export function generateCar(reputation: number): Car {
  // Filter templates based on reputation
  let availableTemplates = CAR_TEMPLATES.filter(t => {
    if (reputation < 20) return t.category === 'economy';
    if (reputation < 40) return ['economy', 'sedan'].includes(t.category);
    if (reputation < 60) return ['economy', 'sedan', 'suv'].includes(t.category);
    if (reputation < 80) return t.category !== 'luxury';
    return true;
  });
  
  if (availableTemplates.length === 0) {
    availableTemplates = CAR_TEMPLATES.filter(t => t.category === 'economy');
  }
  
  const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
  const damageIntensity = 0.3 + Math.random() * 0.5; // 30-80% damage
  const damages = generateDamage(template.baseValue, damageIntensity);
  const currentValue = calculateCurrentValue(template.baseValue, damages);
  
  // Asking price is slightly below or at current value (seller's perspective)
  const askingPrice = Math.round(currentValue * (0.85 + Math.random() * 0.25));
  
  return {
    id: `car_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    category: template.category,
    image: template.image,
    baseValue: template.baseValue,
    askingPrice,
    damages,
    purchased: false,
    currentValue,
    isInGarage: false,
    listedForSale: false,
  };
}

// Recalculate car value after repairs
export function recalculateCarValue(car: Car): number {
  return calculateCurrentValue(car.baseValue, car.damages);
}

// Customer names for selling
export const CUSTOMER_NAMES = [
  'John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Williams',
  'Michael Brown', 'Emily Davis', 'James Miller', 'Jennifer Wilson',
  'Robert Moore', 'Lisa Taylor', 'William Anderson', 'Elizabeth Thomas',
];

export const CUSTOMER_AVATARS = ['👨', '👩', '🧔', '👱‍♀️', '👨‍🦰', '👩‍🦱', '🧑', '👴', '👵', '🧑‍🦳'];
