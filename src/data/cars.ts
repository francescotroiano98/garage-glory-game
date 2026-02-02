import { Car, CarCategory, PartDamage, DamageLevel, PartType, PartCategory, getCategoriesForLevel, CATEGORY_UNLOCK_LEVEL } from '@/types/game';
import { PART_DEFINITIONS } from './parts';

// Import car images - using existing images for different categories
import economyHatch from '@/assets/cars/economy-hatch.png';
import sedanImg from '@/assets/cars/sedan.png';
import suvImg from '@/assets/cars/suv.png';
import sportsImg from '@/assets/cars/sports.png';
import luxuryImg from '@/assets/cars/luxury.png';

// Map categories to base images (will use CSS transforms for variety)
const CATEGORY_BASE_IMAGES: Record<CarCategory, string> = {
  junker: economyHatch,
  beater: economyHatch,
  economy: economyHatch,
  compact: economyHatch,
  hatchback: economyHatch,
  sedan: sedanImg,
  wagon: sedanImg,
  coupe: sedanImg,
  suv_small: suvImg,
  suv_mid: suvImg,
  suv_large: suvImg,
  crossover: suvImg,
  muscle: sportsImg,
  sports: sportsImg,
  sports_premium: sportsImg,
  luxury_entry: luxuryImg,
  luxury_mid: luxuryImg,
  luxury_full: luxuryImg,
  exotic: sportsImg,
  supercar: luxuryImg,
};

// 3 image variants per category (using CSS transforms)
export const CAR_IMAGES: Record<CarCategory, string[]> = Object.keys(CATEGORY_BASE_IMAGES).reduce((acc, cat) => {
  const baseImg = CATEGORY_BASE_IMAGES[cat as CarCategory];
  acc[cat as CarCategory] = [baseImg, baseImg, baseImg];
  return acc;
}, {} as Record<CarCategory, string[]>);

// Damage level multipliers - balanced for profitability
export const DAMAGE_MULTIPLIERS: Record<DamageLevel, { energy: number; time: number; money: number; value: number }> = {
  none: { energy: 0, time: 0, money: 0, value: 0 },
  minor: { energy: 0.4, time: 0.5, money: 0.4, value: 0.5 },
  moderate: { energy: 0.7, time: 0.75, money: 0.7, value: 0.75 },
  major: { energy: 1, time: 1, money: 1, value: 1 },
  critical: { energy: 1.3, time: 1.25, money: 1.3, value: 1.4 },
};

// Car templates for each category (2-3 per category for variety)
export const CAR_TEMPLATES: Array<{ name: string; category: CarCategory; baseValue: number }> = [
  // Level 1 - Junker
  { name: 'Rusty Beater', category: 'junker', baseValue: 300 },
  { name: 'Old Clunker', category: 'junker', baseValue: 350 },
  { name: 'Worn Jalopy', category: 'junker', baseValue: 280 },
  
  // Level 2 - Beater
  { name: 'Tired Runabout', category: 'beater', baseValue: 500 },
  { name: 'Faded Runner', category: 'beater', baseValue: 550 },
  { name: 'Rough Daily', category: 'beater', baseValue: 480 },
  
  // Level 3 - Economy
  { name: 'Compact Hatch', category: 'economy', baseValue: 800 },
  { name: 'City Runner', category: 'economy', baseValue: 950 },
  { name: 'Budget Wagon', category: 'economy', baseValue: 750 },
  
  // Level 4 - Compact
  { name: 'Mini Coupe', category: 'compact', baseValue: 1100 },
  { name: 'Urban Hatch', category: 'compact', baseValue: 1050 },
  { name: 'Eco Sprint', category: 'compact', baseValue: 1000 },
  
  // Level 5 - Hatchback
  { name: 'Metro Cruiser', category: 'hatchback', baseValue: 1300 },
  { name: 'Penny Saver', category: 'hatchback', baseValue: 1250 },
  { name: 'Quick Hatch', category: 'hatchback', baseValue: 1400 },
  
  // Level 6 - Sedan
  { name: 'Family Sedan', category: 'sedan', baseValue: 1800 },
  { name: 'Classic Sedan', category: 'sedan', baseValue: 2000 },
  { name: 'Touring Sedan', category: 'sedan', baseValue: 2200 },
  
  // Level 7 - Wagon
  { name: 'Estate Wagon', category: 'wagon', baseValue: 2400 },
  { name: 'Family Wagon', category: 'wagon', baseValue: 2600 },
  { name: 'Touring Wagon', category: 'wagon', baseValue: 2800 },
  
  // Level 8 - Coupe
  { name: 'Sport Coupe', category: 'coupe', baseValue: 3000 },
  { name: 'Grand Coupe', category: 'coupe', baseValue: 3200 },
  { name: 'Turbo Coupe', category: 'coupe', baseValue: 3500 },
  
  // Level 9 - Small SUV
  { name: 'Compact SUV', category: 'suv_small', baseValue: 3500 },
  { name: 'Urban Crossover', category: 'suv_small', baseValue: 3800 },
  { name: 'City Explorer', category: 'suv_small', baseValue: 3600 },
  
  // Level 10 - Mid SUV
  { name: 'Family SUV', category: 'suv_mid', baseValue: 4500 },
  { name: 'Trail Blazer', category: 'suv_mid', baseValue: 4800 },
  { name: 'Adventure SUV', category: 'suv_mid', baseValue: 5000 },
  
  // Level 11 - Large SUV
  { name: 'Premium SUV', category: 'suv_large', baseValue: 6000 },
  { name: 'Expedition SUV', category: 'suv_large', baseValue: 6500 },
  { name: 'Grand Explorer', category: 'suv_large', baseValue: 7000 },
  
  // Level 12 - Crossover
  { name: 'Luxury Crossover', category: 'crossover', baseValue: 7500 },
  { name: 'Sport Crossover', category: 'crossover', baseValue: 8000 },
  { name: 'Elite Crossover', category: 'crossover', baseValue: 8500 },
  
  // Level 13 - Muscle
  { name: 'Muscle Classic', category: 'muscle', baseValue: 9000 },
  { name: 'Power Runner', category: 'muscle', baseValue: 9500 },
  { name: 'Street Beast', category: 'muscle', baseValue: 10000 },
  
  // Level 14 - Sports
  { name: 'Sports Coupe', category: 'sports', baseValue: 12000 },
  { name: 'Track Monster', category: 'sports', baseValue: 13000 },
  { name: 'Speed Demon', category: 'sports', baseValue: 14000 },
  
  // Level 15 - Premium Sports
  { name: 'GT Racer', category: 'sports_premium', baseValue: 18000 },
  { name: 'Drift King', category: 'sports_premium', baseValue: 19000 },
  { name: 'Street Rocket', category: 'sports_premium', baseValue: 20000 },
  
  // Level 16 - Entry Luxury
  { name: 'Entry Luxury', category: 'luxury_entry', baseValue: 25000 },
  { name: 'Business Class', category: 'luxury_entry', baseValue: 27000 },
  { name: 'Executive Sedan', category: 'luxury_entry', baseValue: 28000 },
  
  // Level 17 - Mid Luxury
  { name: 'Grand Tourer', category: 'luxury_mid', baseValue: 35000 },
  { name: 'Royal Sedan', category: 'luxury_mid', baseValue: 38000 },
  { name: 'Prestige Coupe', category: 'luxury_mid', baseValue: 40000 },
  
  // Level 18 - Full Luxury
  { name: 'Elite Roadster', category: 'luxury_full', baseValue: 50000 },
  { name: 'Platinum Edition', category: 'luxury_full', baseValue: 55000 },
  { name: 'Premium Convertible', category: 'luxury_full', baseValue: 60000 },
  
  // Level 19 - Exotic
  { name: 'Exotic Racer', category: 'exotic', baseValue: 80000 },
  { name: 'Limited Edition', category: 'exotic', baseValue: 90000 },
  { name: 'Rare Import', category: 'exotic', baseValue: 100000 },
  
  // Level 20 - Supercar
  { name: 'Hypercar', category: 'supercar', baseValue: 150000 },
  { name: 'Ultimate Machine', category: 'supercar', baseValue: 180000 },
  { name: 'Legend Edition', category: 'supercar', baseValue: 200000 },
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

// Generate a car for the newspaper based on player level
export function generateCar(level: number): Car {
  // Get available categories for this level
  const availableCategories = getCategoriesForLevel(level);
  
  // Weight towards higher level categories (70% chance for top 3 categories if available)
  let selectedCategories = availableCategories;
  if (availableCategories.length > 3 && Math.random() < 0.7) {
    selectedCategories = availableCategories.slice(-3);
  }
  
  // Get templates for selected categories
  let availableTemplates = CAR_TEMPLATES.filter(t => selectedCategories.includes(t.category));
  
  if (availableTemplates.length === 0) {
    availableTemplates = CAR_TEMPLATES.filter(t => t.category === 'junker');
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

// Get image for a category
export function getCategoryImage(category: CarCategory): string {
  return CATEGORY_BASE_IMAGES[category];
}
