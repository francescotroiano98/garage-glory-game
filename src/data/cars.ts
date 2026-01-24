import { Car, CarCategory, PartDamage, DamageLevel, PartType, PartCategory } from '@/types/game';
import { PART_DEFINITIONS } from './parts';

// Import car images
import economyHatch from '@/assets/cars/economy-hatch.png';
import sedanImg from '@/assets/cars/sedan.png';
import suvImg from '@/assets/cars/suv.png';
import sportsImg from '@/assets/cars/sports.png';
import luxuryImg from '@/assets/cars/luxury.png';

// Damage level multipliers
export const DAMAGE_MULTIPLIERS: Record<DamageLevel, { energy: number; time: number; value: number }> = {
  none: { energy: 0, time: 0, value: 0 },
  minor: { energy: 0.4, time: 0.5, value: 0.03 },
  moderate: { energy: 0.7, time: 0.75, value: 0.08 },
  major: { energy: 1, time: 1, value: 0.15 },
  critical: { energy: 1.3, time: 1.25, value: 0.25 },
};

// More variety of cars - multiple images per category would be ideal
// For now, using same images but with variety in names and values
export const CAR_TEMPLATES: Array<{ name: string; category: CarCategory; baseValue: number; image: string }> = [
  // Economy (8 varieties)
  { name: 'Compact Hatch', category: 'economy', baseValue: 800, image: economyHatch },
  { name: 'City Runner', category: 'economy', baseValue: 950, image: economyHatch },
  { name: 'Budget Wagon', category: 'economy', baseValue: 750, image: economyHatch },
  { name: 'Mini Coupe', category: 'economy', baseValue: 1100, image: economyHatch },
  { name: 'Urban Hatch', category: 'economy', baseValue: 850, image: economyHatch },
  { name: 'Eco Sprint', category: 'economy', baseValue: 700, image: economyHatch },
  { name: 'Metro Cruiser', category: 'economy', baseValue: 900, image: economyHatch },
  { name: 'Penny Saver', category: 'economy', baseValue: 650, image: economyHatch },
  
  // Sedan (8 varieties)
  { name: 'Family Sedan', category: 'sedan', baseValue: 1800, image: sedanImg },
  { name: 'Executive Sedan', category: 'sedan', baseValue: 2400, image: sedanImg },
  { name: 'Classic Sedan', category: 'sedan', baseValue: 2000, image: sedanImg },
  { name: 'Sport Sedan', category: 'sedan', baseValue: 2800, image: sedanImg },
  { name: 'Touring Sedan', category: 'sedan', baseValue: 2200, image: sedanImg },
  { name: 'Business Sedan', category: 'sedan', baseValue: 2600, image: sedanImg },
  { name: 'Luxury Sedan', category: 'sedan', baseValue: 3200, image: sedanImg },
  { name: 'Comfort Cruiser', category: 'sedan', baseValue: 1900, image: sedanImg },
  
  // SUV (8 varieties)
  { name: 'Urban SUV', category: 'suv', baseValue: 3500, image: suvImg },
  { name: 'Off-Road SUV', category: 'suv', baseValue: 4200, image: suvImg },
  { name: 'Family SUV', category: 'suv', baseValue: 3800, image: suvImg },
  { name: 'Compact SUV', category: 'suv', baseValue: 3000, image: suvImg },
  { name: 'Adventure SUV', category: 'suv', baseValue: 4500, image: suvImg },
  { name: 'Premium SUV', category: 'suv', baseValue: 5000, image: suvImg },
  { name: 'Trail Blazer', category: 'suv', baseValue: 4000, image: suvImg },
  { name: 'City Explorer', category: 'suv', baseValue: 3200, image: suvImg },
  
  // Sports (8 varieties)
  { name: 'Sports Coupe', category: 'sports', baseValue: 6000, image: sportsImg },
  { name: 'Muscle Car', category: 'sports', baseValue: 7500, image: sportsImg },
  { name: 'GT Racer', category: 'sports', baseValue: 8500, image: sportsImg },
  { name: 'Turbo Coupe', category: 'sports', baseValue: 7000, image: sportsImg },
  { name: 'Street Rocket', category: 'sports', baseValue: 6500, image: sportsImg },
  { name: 'Track Monster', category: 'sports', baseValue: 9000, image: sportsImg },
  { name: 'Drift King', category: 'sports', baseValue: 7800, image: sportsImg },
  { name: 'Speed Demon', category: 'sports', baseValue: 8000, image: sportsImg },
  
  // Luxury (8 varieties)
  { name: 'Luxury Limousine', category: 'luxury', baseValue: 12000, image: luxuryImg },
  { name: 'Premium Convertible', category: 'luxury', baseValue: 15000, image: luxuryImg },
  { name: 'Executive Class', category: 'luxury', baseValue: 18000, image: luxuryImg },
  { name: 'Grand Tourer', category: 'luxury', baseValue: 20000, image: luxuryImg },
  { name: 'Royal Sedan', category: 'luxury', baseValue: 16000, image: luxuryImg },
  { name: 'Prestige Coupe', category: 'luxury', baseValue: 22000, image: luxuryImg },
  { name: 'Elite Roadster', category: 'luxury', baseValue: 25000, image: luxuryImg },
  { name: 'Platinum Edition', category: 'luxury', baseValue: 28000, image: luxuryImg },
];

// Parts by category for damage generation
const PARTS_BY_CATEGORY: Record<PartCategory, PartType[]> = {
  mechanical: ['engine', 'transmission', 'brakes', 'suspension', 'exhaust', 'fuel_system'],
  body: ['paint', 'dents', 'rust', 'windows', 'lights', 'bumpers'],
  tires: ['front_tires', 'rear_tires', 'wheels', 'alignment', 'tire_pressure', 'wheel_bearings'],
  interior: ['seats', 'dashboard', 'electronics', 'cleaning', 'air_conditioning', 'audio_system'],
};

// Generate random damage for a car
function generateDamage(baseValue: number, damageIntensity: number): PartDamage[] {
  const damages: PartDamage[] = [];
  const categories: PartCategory[] = ['mechanical', 'body', 'tires', 'interior'];
  
  // Each category has a chance to have damaged parts
  categories.forEach(category => {
    const categoryParts = PARTS_BY_CATEGORY[category];
    const numDamagedParts = Math.floor(1 + Math.random() * (damageIntensity * 4)); // 1-5 parts per category
    
    // Shuffle and pick parts
    const shuffledParts = [...categoryParts].sort(() => Math.random() - 0.5);
    const selectedParts = shuffledParts.slice(0, Math.min(numDamagedParts, 6));
    
    selectedParts.forEach(partType => {
      const def = PART_DEFINITIONS[partType];
      const levels: DamageLevel[] = ['minor', 'moderate', 'major', 'critical'];
      const levelIndex = Math.min(Math.floor(Math.random() * (1 + damageIntensity * 3)), 3);
      const level = levels[levelIndex];
      const multipliers = DAMAGE_MULTIPLIERS[level];
      
      // Visibility chance based on category
      const visibilityChance = category === 'body' ? 0.8 : category === 'tires' ? 0.6 : 0.35;
      
      damages.push({
        part: partType,
        category: def.category,
        level,
        visible: Math.random() < visibilityChance,
        repaired: false,
        energyCost: Math.round(def.baseEnergyCost * multipliers.energy),
        repairTime: Math.round(def.baseRepairTime * multipliers.time),
        valueImpact: baseValue * multipliers.value,
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
  // Filter templates based on reputation - harder progression
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
  
  // Asking price varies more for harder negotiation
  const priceVariance = 0.75 + Math.random() * 0.35;
  const askingPrice = Math.round(currentValue * priceVariance);
  
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
