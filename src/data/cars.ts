import { Car, CarCategory, PartDamage, DamageLevel, PartType, PartCategory } from '@/types/game';
import { PART_DEFINITIONS } from './parts';

// Import car images - 3 variants per category
import economyHatch from '@/assets/cars/economy-hatch.png';
import sedanImg from '@/assets/cars/sedan.png';
import suvImg from '@/assets/cars/suv.png';
import sportsImg from '@/assets/cars/sports.png';
import luxuryImg from '@/assets/cars/luxury.png';

// Multiple images per category for variety (using same images with CSS transforms for now)
export const CAR_IMAGES: Record<CarCategory, string[]> = {
  economy: [economyHatch, economyHatch, economyHatch],
  sedan: [sedanImg, sedanImg, sedanImg],
  suv: [suvImg, suvImg, suvImg],
  sports: [sportsImg, sportsImg, sportsImg],
  luxury: [luxuryImg, luxuryImg, luxuryImg],
};

// Damage level multipliers - balanced for profitability
export const DAMAGE_MULTIPLIERS: Record<DamageLevel, { energy: number; time: number; money: number; value: number }> = {
  none: { energy: 0, time: 0, money: 0, value: 0 },
  minor: { energy: 0.4, time: 0.5, money: 0.4, value: 0.5 },
  moderate: { energy: 0.7, time: 0.75, money: 0.7, value: 0.75 },
  major: { energy: 1, time: 1, money: 1, value: 1 },
  critical: { energy: 1.3, time: 1.25, money: 1.3, value: 1.4 },
};

// More variety of cars - multiple images per category would be ideal
export const CAR_TEMPLATES: Array<{ name: string; category: CarCategory; baseValue: number }> = [
  // Economy (8 varieties)
  { name: 'Compact Hatch', category: 'economy', baseValue: 800 },
  { name: 'City Runner', category: 'economy', baseValue: 950 },
  { name: 'Budget Wagon', category: 'economy', baseValue: 750 },
  { name: 'Mini Coupe', category: 'economy', baseValue: 1100 },
  { name: 'Urban Hatch', category: 'economy', baseValue: 850 },
  { name: 'Eco Sprint', category: 'economy', baseValue: 700 },
  { name: 'Metro Cruiser', category: 'economy', baseValue: 900 },
  { name: 'Penny Saver', category: 'economy', baseValue: 650 },
  
  // Sedan (8 varieties)
  { name: 'Family Sedan', category: 'sedan', baseValue: 1800 },
  { name: 'Executive Sedan', category: 'sedan', baseValue: 2400 },
  { name: 'Classic Sedan', category: 'sedan', baseValue: 2000 },
  { name: 'Sport Sedan', category: 'sedan', baseValue: 2800 },
  { name: 'Touring Sedan', category: 'sedan', baseValue: 2200 },
  { name: 'Business Sedan', category: 'sedan', baseValue: 2600 },
  { name: 'Luxury Sedan', category: 'sedan', baseValue: 3200 },
  { name: 'Comfort Cruiser', category: 'sedan', baseValue: 1900 },
  
  // SUV (8 varieties)
  { name: 'Urban SUV', category: 'suv', baseValue: 3500 },
  { name: 'Off-Road SUV', category: 'suv', baseValue: 4200 },
  { name: 'Family SUV', category: 'suv', baseValue: 3800 },
  { name: 'Compact SUV', category: 'suv', baseValue: 3000 },
  { name: 'Adventure SUV', category: 'suv', baseValue: 4500 },
  { name: 'Premium SUV', category: 'suv', baseValue: 5000 },
  { name: 'Trail Blazer', category: 'suv', baseValue: 4000 },
  { name: 'City Explorer', category: 'suv', baseValue: 3200 },
  
  // Sports (8 varieties)
  { name: 'Sports Coupe', category: 'sports', baseValue: 6000 },
  { name: 'Muscle Car', category: 'sports', baseValue: 7500 },
  { name: 'GT Racer', category: 'sports', baseValue: 8500 },
  { name: 'Turbo Coupe', category: 'sports', baseValue: 7000 },
  { name: 'Street Rocket', category: 'sports', baseValue: 6500 },
  { name: 'Track Monster', category: 'sports', baseValue: 9000 },
  { name: 'Drift King', category: 'sports', baseValue: 7800 },
  { name: 'Speed Demon', category: 'sports', baseValue: 8000 },
  
  // Luxury (8 varieties)
  { name: 'Luxury Limousine', category: 'luxury', baseValue: 12000 },
  { name: 'Premium Convertible', category: 'luxury', baseValue: 15000 },
  { name: 'Executive Class', category: 'luxury', baseValue: 18000 },
  { name: 'Grand Tourer', category: 'luxury', baseValue: 20000 },
  { name: 'Royal Sedan', category: 'luxury', baseValue: 16000 },
  { name: 'Prestige Coupe', category: 'luxury', baseValue: 22000 },
  { name: 'Elite Roadster', category: 'luxury', baseValue: 25000 },
  { name: 'Platinum Edition', category: 'luxury', baseValue: 28000 },
];

// Parts by category for damage generation
const PARTS_BY_CATEGORY: Record<PartCategory, PartType[]> = {
  mechanical: ['engine', 'transmission', 'brakes', 'suspension', 'exhaust', 'fuel_system'],
  body: ['paint', 'dents', 'rust', 'windows', 'lights', 'bumpers'],
  tires: ['front_tires', 'rear_tires', 'wheels', 'alignment', 'tire_pressure', 'wheel_bearings'],
  interior: ['seats', 'dashboard', 'electronics', 'cleaning', 'air_conditioning', 'audio_system'],
};

// Generate random damage for a car - balanced so repairs are always profitable
function generateDamage(baseValue: number, damageIntensity: number): PartDamage[] {
  const damages: PartDamage[] = [];
  const categories: PartCategory[] = ['mechanical', 'body', 'tires', 'interior'];
  
  categories.forEach(category => {
    const categoryParts = PARTS_BY_CATEGORY[category];
    const numDamagedParts = Math.floor(1 + Math.random() * (damageIntensity * 4));
    
    const shuffledParts = [...categoryParts].sort(() => Math.random() - 0.5);
    const selectedParts = shuffledParts.slice(0, Math.min(numDamagedParts, 6));
    
    selectedParts.forEach(partType => {
      const def = PART_DEFINITIONS[partType];
      const levels: DamageLevel[] = ['minor', 'moderate', 'major', 'critical'];
      const levelIndex = Math.min(Math.floor(Math.random() * (1 + damageIntensity * 3)), 3);
      const level = levels[levelIndex];
      const multipliers = DAMAGE_MULTIPLIERS[level];
      
      const visibilityChance = category === 'body' ? 0.8 : category === 'tires' ? 0.6 : 0.35;
      
      // Value impact is at least 3x the repair cost for profitability
      const energyCost = Math.round(def.baseEnergyCost * multipliers.energy);
      const moneyCost = Math.round(def.baseMoneyCost * multipliers.money);
      const valueImpact = Math.round(def.baseValueGain * multipliers.value);
      
      damages.push({
        part: partType,
        category: def.category,
        level,
        visible: Math.random() < visibilityChance,
        repaired: false,
        energyCost,
        moneyCost,
        repairTime: Math.round(def.baseRepairTime * multipliers.time),
        valueImpact,
        diyAttempts: 0,
      });
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
  let availableTemplates = CAR_TEMPLATES.filter(t => {
    if (reputation < 15) return t.category === 'economy';
    if (reputation < 30) return ['economy', 'sedan'].includes(t.category);
    if (reputation < 50) return ['economy', 'sedan', 'suv'].includes(t.category);
    if (reputation < 70) return t.category !== 'luxury';
    return true;
  });
  
  if (availableTemplates.length === 0) {
    availableTemplates = CAR_TEMPLATES.filter(t => t.category === 'economy');
  }
  
  const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
  const damageIntensity = 0.3 + Math.random() * 0.5;
  const damages = generateDamage(template.baseValue, damageIntensity);
  const currentValue = calculateCurrentValue(template.baseValue, damages);
  
  // Random image variant
  const imageVariant = Math.floor(Math.random() * 3);
  const images = CAR_IMAGES[template.category];
  
  // Asking price varies
  const priceVariance = 0.75 + Math.random() * 0.35;
  const askingPrice = Math.round(currentValue * priceVariance);
  
  return {
    id: `car_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    category: template.category,
    image: images[imageVariant],
    imageVariant,
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
