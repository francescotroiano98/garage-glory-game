import { Car, TruckCategory, PartDamage, DamageLevel, PartType, PartCategory, TRUCK_CATEGORY_UNLOCK_LEVEL } from '@/types/game';
import { PART_DEFINITIONS } from './parts';
import { DAMAGE_MULTIPLIERS } from './cars';
import { getVehicleNameByImage } from './vehicleNames';
import { loadCollection, isVehicleCompleted, COLLECTION_COMPLETION_DISCOUNT } from './cards';

// Import truck images - 10 per style
import pickup1 from '@/assets/trucks/pickup-1.png';
import pickup2 from '@/assets/trucks/pickup-2.png';
import pickup3 from '@/assets/trucks/pickup-3.png';
import pickup4 from '@/assets/trucks/pickup-4.png';
import pickup5 from '@/assets/trucks/pickup-5.png';
import pickup6 from '@/assets/trucks/pickup-6.png';
import pickup7 from '@/assets/trucks/pickup-7.png';
import pickup8 from '@/assets/trucks/pickup-8.png';
import pickup9 from '@/assets/trucks/pickup-9.png';
import pickup10 from '@/assets/trucks/pickup-10.png';

import van1 from '@/assets/trucks/van-1.png';
import van2 from '@/assets/trucks/van-2.png';
import van3 from '@/assets/trucks/van-3.png';
import van4 from '@/assets/trucks/van-4.png';
import van5 from '@/assets/trucks/van-5.png';
import van6 from '@/assets/trucks/van-6.png';
import van7 from '@/assets/trucks/van-7.png';
import van8 from '@/assets/trucks/van-8.png';
import van9 from '@/assets/trucks/van-9.png';
import van10 from '@/assets/trucks/van-10.png';

import flatbed1 from '@/assets/trucks/flatbed-1.png';
import flatbed2 from '@/assets/trucks/flatbed-2.png';
import flatbed3 from '@/assets/trucks/flatbed-3.png';
import flatbed4 from '@/assets/trucks/flatbed-4.png';
import flatbed5 from '@/assets/trucks/flatbed-5.png';
import flatbed6 from '@/assets/trucks/flatbed-6.png';
import flatbed7 from '@/assets/trucks/flatbed-7.png';
import flatbed8 from '@/assets/trucks/flatbed-8.png';
import flatbed9 from '@/assets/trucks/flatbed-9.png';
import flatbed10 from '@/assets/trucks/flatbed-10.png';

import tow1 from '@/assets/trucks/tow-1.png';
import tow2 from '@/assets/trucks/tow-2.png';
import tow3 from '@/assets/trucks/tow-3.png';
import tow4 from '@/assets/trucks/tow-4.png';
import tow5 from '@/assets/trucks/tow-5.png';
import tow6 from '@/assets/trucks/tow-6.png';
import tow7 from '@/assets/trucks/tow-7.png';
import tow8 from '@/assets/trucks/tow-8.png';
import tow9 from '@/assets/trucks/tow-9.png';
import tow10 from '@/assets/trucks/tow-10.png';

import semi1 from '@/assets/trucks/semi-1.png';
import semi2 from '@/assets/trucks/semi-2.png';
import semi3 from '@/assets/trucks/semi-3.png';
import semi4 from '@/assets/trucks/semi-4.png';
import semi5 from '@/assets/trucks/semi-5.png';
import semi6 from '@/assets/trucks/semi-6.png';
import semi7 from '@/assets/trucks/semi-7.png';
import semi8 from '@/assets/trucks/semi-8.png';
import semi9 from '@/assets/trucks/semi-9.png';
import semi10 from '@/assets/trucks/semi-10.png';

const PICKUP_IMAGES = [pickup1, pickup2, pickup3, pickup4, pickup5, pickup6, pickup7, pickup8, pickup9, pickup10];
const VAN_IMAGES = [van1, van2, van3, van4, van5, van6, van7, van8, van9, van10];
const FLATBED_IMAGES = [flatbed1, flatbed2, flatbed3, flatbed4, flatbed5, flatbed6, flatbed7, flatbed8, flatbed9, flatbed10];
const TOW_IMAGES = [tow1, tow2, tow3, tow4, tow5, tow6, tow7, tow8, tow9, tow10];
const SEMI_IMAGES = [semi1, semi2, semi3, semi4, semi5, semi6, semi7, semi8, semi9, semi10];

export const TRUCK_IMAGES: Record<TruckCategory, string[]> = {
  truck_old_pickup: PICKUP_IMAGES,
  truck_pickup: PICKUP_IMAGES,
  truck_van: VAN_IMAGES,
  truck_delivery: VAN_IMAGES,
  truck_flatbed: FLATBED_IMAGES,
  truck_box: FLATBED_IMAGES,
  truck_tow: TOW_IMAGES,
  truck_semi_light: SEMI_IMAGES,
  truck_semi: SEMI_IMAGES,
  truck_heavy: SEMI_IMAGES,
};

// Truck-specific parts by category
const TRUCK_PARTS_BY_CATEGORY: Record<PartCategory, PartType[]> = {
  mechanical: ['truck_engine', 'truck_transmission', 'truck_brakes', 'truck_hydraulics'],
  body: ['truck_cabin', 'truck_bed', 'truck_frame', 'truck_lights'],
  tires: ['truck_front_axle', 'truck_rear_axle', 'truck_tires', 'truck_suspension'],
  interior: ['truck_dashboard', 'truck_wiring', 'truck_ac', 'truck_seat'],
};

// Truck templates
export const TRUCK_TEMPLATES: Array<{ name: string; category: TruckCategory; baseValue: number }> = [
  // Level 2 - Old Pickup
  { name: 'Rusty Farm Truck', category: 'truck_old_pickup', baseValue: 300 },
  { name: 'Old Work Pickup', category: 'truck_old_pickup', baseValue: 250 },
  { name: 'Vintage Hauler', category: 'truck_old_pickup', baseValue: 350 },
  // Level 4 - Pickup
  { name: 'Ranch Pickup', category: 'truck_pickup', baseValue: 1200 },
  { name: 'City Pickup', category: 'truck_pickup', baseValue: 1400 },
  { name: 'Work Pickup', category: 'truck_pickup', baseValue: 1100 },
  // Level 6 - Van
  { name: 'Cargo Van', category: 'truck_van', baseValue: 2500 },
  { name: 'Panel Van', category: 'truck_van', baseValue: 2800 },
  { name: 'Utility Van', category: 'truck_van', baseValue: 2300 },
  // Level 8 - Delivery
  { name: 'Delivery Express', category: 'truck_delivery', baseValue: 4000 },
  { name: 'City Courier', category: 'truck_delivery', baseValue: 4500 },
  { name: 'Route Runner', category: 'truck_delivery', baseValue: 3800 },
  // Level 10 - Flatbed
  { name: 'Work Flatbed', category: 'truck_flatbed', baseValue: 6000 },
  { name: 'Construction Hauler', category: 'truck_flatbed', baseValue: 6500 },
  { name: 'Platform Truck', category: 'truck_flatbed', baseValue: 5500 },
  // Level 12 - Box Truck
  { name: 'Moving Truck', category: 'truck_box', baseValue: 8000 },
  { name: 'Box Hauler', category: 'truck_box', baseValue: 8500 },
  { name: 'Freight Box', category: 'truck_box', baseValue: 7500 },
  // Level 14 - Tow Truck
  { name: 'City Tow', category: 'truck_tow', baseValue: 12000 },
  { name: 'Heavy Rescue', category: 'truck_tow', baseValue: 13000 },
  { name: 'Road Recovery', category: 'truck_tow', baseValue: 11000 },
  // Level 16 - Semi Light
  { name: 'Day Cab', category: 'truck_semi_light', baseValue: 20000 },
  { name: 'Regional Hauler', category: 'truck_semi_light', baseValue: 22000 },
  { name: 'Light Semi', category: 'truck_semi_light', baseValue: 18000 },
  // Level 18 - Semi
  { name: 'Long Hauler', category: 'truck_semi', baseValue: 35000 },
  { name: 'Highway King', category: 'truck_semi', baseValue: 38000 },
  { name: 'Cross Country', category: 'truck_semi', baseValue: 32000 },
  // Level 20 - Heavy
  { name: 'Heavy Duty', category: 'truck_heavy', baseValue: 55000 },
  { name: 'Titan Hauler', category: 'truck_heavy', baseValue: 60000 },
  { name: 'Road Beast', category: 'truck_heavy', baseValue: 50000 },

  // === Expansion pack ===
  { name: 'Barn Find Pickup', category: 'truck_old_pickup', baseValue: 280 },
  { name: 'Country Hauler', category: 'truck_old_pickup', baseValue: 320 },
  { name: 'Off-road Pickup', category: 'truck_pickup', baseValue: 1300 },
  { name: 'Twin Cab Pickup', category: 'truck_pickup', baseValue: 1500 },
  { name: 'Refrigerated Van', category: 'truck_van', baseValue: 2700 },
  { name: 'Crew Van', category: 'truck_van', baseValue: 2900 },
  { name: 'Express Delivery', category: 'truck_delivery', baseValue: 4200 },
  { name: 'Last Mile Van', category: 'truck_delivery', baseValue: 4400 },
  { name: 'Dropside Flatbed', category: 'truck_flatbed', baseValue: 6200 },
  { name: 'Crane Flatbed', category: 'truck_flatbed', baseValue: 6700 },
  { name: 'Refrigerated Box', category: 'truck_box', baseValue: 8200 },
  { name: 'Tail-lift Box', category: 'truck_box', baseValue: 8700 },
  { name: 'Flatbed Tow', category: 'truck_tow', baseValue: 12500 },
  { name: 'Wheel Lift Tow', category: 'truck_tow', baseValue: 13500 },
  { name: 'Sleeper Cab', category: 'truck_semi_light', baseValue: 21000 },
  { name: 'Urban Semi', category: 'truck_semi_light', baseValue: 23000 },
  { name: 'Reefer Semi', category: 'truck_semi', baseValue: 36000 },
  { name: 'Tanker Semi', category: 'truck_semi', baseValue: 39000 },
  { name: 'Logging Truck', category: 'truck_heavy', baseValue: 56000 },
  { name: 'Mining Hauler', category: 'truck_heavy', baseValue: 65000 },
];

// Get truck categories available at a given level
export function getTruckCategoriesForLevel(level: number): TruckCategory[] {
  const allCategories: TruckCategory[] = [
    'truck_old_pickup', 'truck_pickup', 'truck_van', 'truck_delivery', 'truck_flatbed',
    'truck_box', 'truck_tow', 'truck_semi_light', 'truck_semi', 'truck_heavy'
  ];
  return allCategories.filter(cat => TRUCK_CATEGORY_UNLOCK_LEVEL[cat] <= level);
}

// Generate truck damage using truck-specific parts
function generateTruckDamage(baseValue: number, damageIntensity: number): PartDamage[] {
  const damages: PartDamage[] = [];
  const categories: PartCategory[] = ['mechanical', 'body', 'tires', 'interior'];
  
  categories.forEach(category => {
    const categoryParts = TRUCK_PARTS_BY_CATEGORY[category];
    const numDamagedParts = Math.floor(1 + Math.random() * (damageIntensity * 3));
    
    const shuffledParts = [...categoryParts].sort(() => Math.random() - 0.5);
    const selectedParts = shuffledParts.slice(0, Math.min(numDamagedParts, 4));
    
    selectedParts.forEach(partType => {
      const def = PART_DEFINITIONS[partType];
      const levels: DamageLevel[] = ['minor', 'moderate', 'major', 'critical'];
      const levelIndex = Math.min(Math.floor(Math.random() * (1 + damageIntensity * 3)), 3);
      const level = levels[levelIndex];
      const multipliers = DAMAGE_MULTIPLIERS[level];
      
      const visibilityChance = category === 'body' ? 0.8 : category === 'tires' ? 0.6 : 0.35;
      
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

function calculateTruckCurrentValue(baseValue: number, damages: PartDamage[]): number {
  const totalDamageValue = damages.reduce((sum, d) => sum + (d.repaired ? 0 : d.valueImpact), 0);
  return Math.max(baseValue * 0.1, baseValue - totalDamageValue);
}

// Generate a truck for the newspaper
export function generateTruck(level: number): Car {
  const availableCategories = getTruckCategoriesForLevel(level);
  
  let selectedCategories = availableCategories;
  if (availableCategories.length > 3 && Math.random() < 0.7) {
    selectedCategories = availableCategories.slice(-3);
  }
  
  let availableTemplates = TRUCK_TEMPLATES.filter(t => selectedCategories.includes(t.category));
  
  if (availableTemplates.length === 0) {
    availableTemplates = TRUCK_TEMPLATES.filter(t => t.category === 'truck_old_pickup');
  }
  
  const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
  const damageIntensity = 0.3 + Math.random() * 0.5;
  const damages = generateTruckDamage(template.baseValue, damageIntensity);
  const currentValue = calculateTruckCurrentValue(template.baseValue, damages);
  
  const imageVariant = Math.floor(Math.random() * 10);
  const images = TRUCK_IMAGES[template.category];
  
  const priceVariance = 0.75 + Math.random() * 0.35;
  let askingPrice = Math.round(currentValue * priceVariance);
  const collectionBonus = isVehicleCompleted(loadCollection(), template.category, imageVariant + 1);
  if (collectionBonus) askingPrice = Math.round(askingPrice * (1 - COLLECTION_COMPLETION_DISCOUNT));

  return {
    id: `truck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: getVehicleNameByImage(template.category, imageVariant + 1),
    vehicleType: 'truck',
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
    collectionBonus,
  };
}

// Recalculate truck value after repairs
export function recalculateTruckValue(car: Car): number {
  return calculateTruckCurrentValue(car.baseValue, car.damages);
}
