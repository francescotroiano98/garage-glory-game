import { Car, CarCategory, PartDamage, DamageLevel, PartType, PartCategory, getCategoriesForLevel, CATEGORY_UNLOCK_LEVEL, VehicleType } from '@/types/game';
import { PART_DEFINITIONS } from './parts';

// Import car images - 10 per category for variety
// Economy images (junker, beater, economy, compact, hatchback)
import economy1 from '@/assets/cars/economy-1.png';
import economy2 from '@/assets/cars/economy-2.png';
import economy3 from '@/assets/cars/economy-3.png';
import economy4 from '@/assets/cars/economy-4.png';
import economy5 from '@/assets/cars/economy-5.png';
import economy6 from '@/assets/cars/economy-6.png';
import economy7 from '@/assets/cars/economy-7.png';
import economy8 from '@/assets/cars/economy-8.png';
import economy9 from '@/assets/cars/economy-9.png';
import economy10 from '@/assets/cars/economy-10.png';

// Sedan images (sedan, wagon, coupe)
import sedan1 from '@/assets/cars/sedan-1.png';
import sedan2 from '@/assets/cars/sedan-2.png';
import sedan3 from '@/assets/cars/sedan-3.png';
import sedan4 from '@/assets/cars/sedan-4.png';
import sedan5 from '@/assets/cars/sedan-5.png';
import sedan6 from '@/assets/cars/sedan-6.png';
import sedan7 from '@/assets/cars/sedan-7.png';
import sedan8 from '@/assets/cars/sedan-8.png';
import sedan9 from '@/assets/cars/sedan-9.png';
import sedan10 from '@/assets/cars/sedan-10.png';

// SUV images (suv_small, suv_mid, suv_large, crossover)
import suv1 from '@/assets/cars/suv-1.png';
import suv2 from '@/assets/cars/suv-2.png';
import suv3 from '@/assets/cars/suv-3.png';
import suv4 from '@/assets/cars/suv-4.png';
import suv5 from '@/assets/cars/suv-5.png';
import suv6 from '@/assets/cars/suv-6.png';
import suv7 from '@/assets/cars/suv-7.png';
import suv8 from '@/assets/cars/suv-8.png';
import suv9 from '@/assets/cars/suv-9.png';
import suv10 from '@/assets/cars/suv-10.png';

// Sports images (muscle, sports, sports_premium, exotic)
import sports1 from '@/assets/cars/sports-1.png';
import sports2 from '@/assets/cars/sports-2.png';
import sports3 from '@/assets/cars/sports-3.png';
import sports4 from '@/assets/cars/sports-4.png';
import sports5 from '@/assets/cars/sports-5.png';
import sports6 from '@/assets/cars/sports-6.png';
import sports7 from '@/assets/cars/sports-7.png';
import sports8 from '@/assets/cars/sports-8.png';
import sports9 from '@/assets/cars/sports-9.png';
import sports10 from '@/assets/cars/sports-10.png';

// Luxury images (luxury_entry, luxury_mid, luxury_full, supercar)
import luxury1 from '@/assets/cars/luxury-1.png';
import luxury2 from '@/assets/cars/luxury-2.png';
import luxury3 from '@/assets/cars/luxury-3.png';
import luxury4 from '@/assets/cars/luxury-4.png';
import luxury5 from '@/assets/cars/luxury-5.png';
import luxury6 from '@/assets/cars/luxury-6.png';
import luxury7 from '@/assets/cars/luxury-7.png';
import luxury8 from '@/assets/cars/luxury-8.png';
import luxury9 from '@/assets/cars/luxury-9.png';
import luxury10 from '@/assets/cars/luxury-10.png';

// Image arrays by category type
const ECONOMY_IMAGES = [economy1, economy2, economy3, economy4, economy5, economy6, economy7, economy8, economy9, economy10];
const SEDAN_IMAGES = [sedan1, sedan2, sedan3, sedan4, sedan5, sedan6, sedan7, sedan8, sedan9, sedan10];
const SUV_IMAGES = [suv1, suv2, suv3, suv4, suv5, suv6, suv7, suv8, suv9, suv10];
const SPORTS_IMAGES = [sports1, sports2, sports3, sports4, sports5, sports6, sports7, sports8, sports9, sports10];
const LUXURY_IMAGES = [luxury1, luxury2, luxury3, luxury4, luxury5, luxury6, luxury7, luxury8, luxury9, luxury10];

// 10 image variants per category
export const CAR_IMAGES: Record<CarCategory, string[]> = {
  junker: ECONOMY_IMAGES,
  beater: ECONOMY_IMAGES,
  economy: ECONOMY_IMAGES,
  compact: ECONOMY_IMAGES,
  hatchback: ECONOMY_IMAGES,
  sedan: SEDAN_IMAGES,
  wagon: SEDAN_IMAGES,
  coupe: SEDAN_IMAGES,
  suv_small: SUV_IMAGES,
  suv_mid: SUV_IMAGES,
  suv_large: SUV_IMAGES,
  crossover: SUV_IMAGES,
  muscle: SPORTS_IMAGES,
  sports: SPORTS_IMAGES,
  sports_premium: SPORTS_IMAGES,
  exotic: SPORTS_IMAGES,
  luxury_entry: LUXURY_IMAGES,
  luxury_mid: LUXURY_IMAGES,
  luxury_full: LUXURY_IMAGES,
  supercar: LUXURY_IMAGES,
};

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
  
  // Random image variant (10 variants per category)
  const imageVariant = Math.floor(Math.random() * 10);
  const images = CAR_IMAGES[template.category];
  
  // Asking price varies
  const priceVariance = 0.75 + Math.random() * 0.35;
  const askingPrice = Math.round(currentValue * priceVariance);
  
  return {
    id: `car_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    vehicleType: 'car' as VehicleType,
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
  return CAR_IMAGES[category][0];
}
