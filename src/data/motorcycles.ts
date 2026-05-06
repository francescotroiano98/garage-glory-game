import { Car, MotorcycleCategory, PartDamage, DamageLevel, PartType, PartCategory, MOTO_CATEGORY_UNLOCK_LEVEL } from '@/types/game';
import { PART_DEFINITIONS } from './parts';
import { DAMAGE_MULTIPLIERS } from './cars';

// Import motorcycle images - 10 per category
import scooter1 from '@/assets/motorcycles/scooter-1.png';
import scooter2 from '@/assets/motorcycles/scooter-2.png';
import scooter3 from '@/assets/motorcycles/scooter-3.png';
import scooter4 from '@/assets/motorcycles/scooter-4.png';
import scooter5 from '@/assets/motorcycles/scooter-5.png';
import scooter6 from '@/assets/motorcycles/scooter-6.png';
import scooter7 from '@/assets/motorcycles/scooter-7.png';
import scooter8 from '@/assets/motorcycles/scooter-8.png';
import scooter9 from '@/assets/motorcycles/scooter-9.png';
import scooter10 from '@/assets/motorcycles/scooter-10.png';

import street1 from '@/assets/motorcycles/street-1.png';
import street2 from '@/assets/motorcycles/street-2.png';
import street3 from '@/assets/motorcycles/street-3.png';
import street4 from '@/assets/motorcycles/street-4.png';
import street5 from '@/assets/motorcycles/street-5.png';
import street6 from '@/assets/motorcycles/street-6.png';
import street7 from '@/assets/motorcycles/street-7.png';
import street8 from '@/assets/motorcycles/street-8.png';
import street9 from '@/assets/motorcycles/street-9.png';
import street10 from '@/assets/motorcycles/street-10.png';

import touring1 from '@/assets/motorcycles/touring-1.png';
import touring2 from '@/assets/motorcycles/touring-2.png';
import touring3 from '@/assets/motorcycles/touring-3.png';
import touring4 from '@/assets/motorcycles/touring-4.png';
import touring5 from '@/assets/motorcycles/touring-5.png';
import touring6 from '@/assets/motorcycles/touring-6.png';
import touring7 from '@/assets/motorcycles/touring-7.png';
import touring8 from '@/assets/motorcycles/touring-8.png';
import touring9 from '@/assets/motorcycles/touring-9.png';
import touring10 from '@/assets/motorcycles/touring-10.png';

import offroad1 from '@/assets/motorcycles/offroad-1.png';
import offroad2 from '@/assets/motorcycles/offroad-2.png';
import offroad3 from '@/assets/motorcycles/offroad-3.png';
import offroad4 from '@/assets/motorcycles/offroad-4.png';
import offroad5 from '@/assets/motorcycles/offroad-5.png';
import offroad6 from '@/assets/motorcycles/offroad-6.png';
import offroad7 from '@/assets/motorcycles/offroad-7.png';
import offroad8 from '@/assets/motorcycles/offroad-8.png';
import offroad9 from '@/assets/motorcycles/offroad-9.png';
import offroad10 from '@/assets/motorcycles/offroad-10.png';

import sport1 from '@/assets/motorcycles/sport-1.png';
import sport2 from '@/assets/motorcycles/sport-2.png';
import sport3 from '@/assets/motorcycles/sport-3.png';
import sport4 from '@/assets/motorcycles/sport-4.png';
import sport5 from '@/assets/motorcycles/sport-5.png';
import sport6 from '@/assets/motorcycles/sport-6.png';
import sport7 from '@/assets/motorcycles/sport-7.png';
import sport8 from '@/assets/motorcycles/sport-8.png';
import sport9 from '@/assets/motorcycles/sport-9.png';
import sport10 from '@/assets/motorcycles/sport-10.png';

const SCOOTER_IMAGES = [scooter1, scooter2, scooter3, scooter4, scooter5, scooter6, scooter7, scooter8, scooter9, scooter10];
const STREET_IMAGES = [street1, street2, street3, street4, street5, street6, street7, street8, street9, street10];
const TOURING_IMAGES = [touring1, touring2, touring3, touring4, touring5, touring6, touring7, touring8, touring9, touring10];
const OFFROAD_IMAGES = [offroad1, offroad2, offroad3, offroad4, offroad5, offroad6, offroad7, offroad8, offroad9, offroad10];
const SPORT_IMAGES = [sport1, sport2, sport3, sport4, sport5, sport6, sport7, sport8, sport9, sport10];

export const MOTO_IMAGES: Record<MotorcycleCategory, string[]> = {
  moto_old_scooter: SCOOTER_IMAGES,
  moto_scooter: SCOOTER_IMAGES,
  moto_125: STREET_IMAGES,
  moto_naked: STREET_IMAGES,
  moto_touring: TOURING_IMAGES,
  moto_adventure: TOURING_IMAGES,
  moto_enduro: OFFROAD_IMAGES,
  moto_supersport: SPORT_IMAGES,
  moto_caferacer: SPORT_IMAGES,
  moto_superbike: SPORT_IMAGES,
};

// Motorcycle-specific parts by category
const MOTO_PARTS_BY_CATEGORY: Record<PartCategory, PartType[]> = {
  mechanical: ['moto_engine', 'moto_chain', 'moto_exhaust', 'moto_carburetor'],
  body: ['moto_fairing', 'moto_tank', 'moto_fender', 'moto_mirrors'],
  tires: ['moto_front_tire', 'moto_rear_tire', 'moto_front_suspension', 'moto_rear_suspension'],
  interior: ['moto_battery', 'moto_wiring', 'moto_instruments', 'moto_seat'],
};

// Motorcycle templates
export const MOTO_TEMPLATES: Array<{ name: string; category: MotorcycleCategory; baseValue: number }> = [
  // Level 1 - Old Scooter
  { name: 'Rusty Vespa', category: 'moto_old_scooter', baseValue: 150 },
  { name: 'Old Ciao', category: 'moto_old_scooter', baseValue: 120 },
  { name: 'Vintage Lambretta', category: 'moto_old_scooter', baseValue: 180 },
  // Level 3 - Scooter
  { name: 'City Scooter', category: 'moto_scooter', baseValue: 400 },
  { name: 'Urban Runner', category: 'moto_scooter', baseValue: 450 },
  { name: 'Commuter 50', category: 'moto_scooter', baseValue: 380 },
  // Level 5 - 125cc
  { name: 'Street 125', category: 'moto_125', baseValue: 700 },
  { name: 'City Bike 125', category: 'moto_125', baseValue: 750 },
  { name: 'Sport 125', category: 'moto_125', baseValue: 850 },
  // Level 7 - Naked
  { name: 'Streetfighter', category: 'moto_naked', baseValue: 2000 },
  { name: 'Urban Naked', category: 'moto_naked', baseValue: 2200 },
  { name: 'Power Naked', category: 'moto_naked', baseValue: 2500 },
  // Level 9 - Touring
  { name: 'Grand Tourer', category: 'moto_touring', baseValue: 4000 },
  { name: 'Highway King', category: 'moto_touring', baseValue: 4500 },
  { name: 'Cross Tourer', category: 'moto_touring', baseValue: 4200 },
  // Level 11 - Adventure
  { name: 'Trail Master', category: 'moto_adventure', baseValue: 6500 },
  { name: 'Rally Adventure', category: 'moto_adventure', baseValue: 7000 },
  { name: 'Globe Trotter', category: 'moto_adventure', baseValue: 7500 },
  // Level 13 - Enduro
  { name: 'Dirt Racer', category: 'moto_enduro', baseValue: 5000 },
  { name: 'Enduro Pro', category: 'moto_enduro', baseValue: 5500 },
  { name: 'Motocross Beast', category: 'moto_enduro', baseValue: 6000 },
  // Level 15 - Supersport
  { name: 'Track Missile', category: 'moto_supersport', baseValue: 15000 },
  { name: 'Speed Demon', category: 'moto_supersport', baseValue: 16000 },
  { name: 'Race Replica', category: 'moto_supersport', baseValue: 18000 },
  // Level 17 - Cafe Racer
  { name: 'Retro Racer', category: 'moto_caferacer', baseValue: 12000 },
  { name: 'Classic Sport', category: 'moto_caferacer', baseValue: 13000 },
  { name: 'Vintage Custom', category: 'moto_caferacer', baseValue: 14000 },
  // Level 19 - Superbike
  { name: 'Hypersport', category: 'moto_superbike', baseValue: 30000 },
  { name: 'Ultimate Racer', category: 'moto_superbike', baseValue: 35000 },
  { name: 'Legend Bike', category: 'moto_superbike', baseValue: 40000 },

  // === Expansion pack ===
  { name: 'Garage Find Vespa', category: 'moto_old_scooter', baseValue: 140 },
  { name: 'Sidecar Relic', category: 'moto_old_scooter', baseValue: 200 },
  { name: 'Eco Scooter', category: 'moto_scooter', baseValue: 420 },
  { name: 'Maxi Scooter', category: 'moto_scooter', baseValue: 500 },
  { name: 'Custom 125', category: 'moto_125', baseValue: 780 },
  { name: 'Cruiser 125', category: 'moto_125', baseValue: 820 },
  { name: 'Cafe Naked', category: 'moto_naked', baseValue: 2100 },
  { name: 'Roadster Naked', category: 'moto_naked', baseValue: 2400 },
  { name: 'Sport Tourer', category: 'moto_touring', baseValue: 4300 },
  { name: 'Bagger', category: 'moto_touring', baseValue: 4700 },
  { name: 'Desert Adventure', category: 'moto_adventure', baseValue: 6800 },
  { name: 'Big Bore Adventure', category: 'moto_adventure', baseValue: 7200 },
  { name: 'Trail Enduro', category: 'moto_enduro', baseValue: 5200 },
  { name: 'Hard Enduro', category: 'moto_enduro', baseValue: 5800 },
  { name: 'Track Day Special', category: 'moto_supersport', baseValue: 15500 },
  { name: 'World SBK', category: 'moto_supersport', baseValue: 17000 },
  { name: 'Brat Style', category: 'moto_caferacer', baseValue: 12500 },
  { name: 'Bobber Custom', category: 'moto_caferacer', baseValue: 13500 },
  { name: 'Carbon Superbike', category: 'moto_superbike', baseValue: 32000 },
  { name: 'MotoGP Replica', category: 'moto_superbike', baseValue: 45000 },
];

// Get motorcycle categories available at a given level
export function getMotoCategoriesForLevel(level: number): MotorcycleCategory[] {
  const allCategories: MotorcycleCategory[] = [
    'moto_old_scooter', 'moto_scooter', 'moto_125',
    'moto_naked', 'moto_touring', 'moto_adventure',
    'moto_enduro', 'moto_supersport', 'moto_caferacer', 'moto_superbike'
  ];
  return allCategories.filter(cat => MOTO_CATEGORY_UNLOCK_LEVEL[cat] <= level);
}

// Generate motorcycle damage using motorcycle-specific parts
function generateMotoDamage(baseValue: number, damageIntensity: number): PartDamage[] {
  const damages: PartDamage[] = [];
  const categories: PartCategory[] = ['mechanical', 'body', 'tires', 'interior'];
  
  categories.forEach(category => {
    const categoryParts = MOTO_PARTS_BY_CATEGORY[category];
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

function calculateMotoCurrentValue(baseValue: number, damages: PartDamage[]): number {
  const totalDamageValue = damages.reduce((sum, d) => sum + (d.repaired ? 0 : d.valueImpact), 0);
  return Math.max(baseValue * 0.1, baseValue - totalDamageValue);
}

// Generate a motorcycle for the newspaper
export function generateMotorcycle(level: number): Car {
  const availableCategories = getMotoCategoriesForLevel(level);
  
  let selectedCategories = availableCategories;
  if (availableCategories.length > 3 && Math.random() < 0.7) {
    selectedCategories = availableCategories.slice(-3);
  }
  
  let availableTemplates = MOTO_TEMPLATES.filter(t => selectedCategories.includes(t.category));
  
  if (availableTemplates.length === 0) {
    availableTemplates = MOTO_TEMPLATES.filter(t => t.category === 'moto_old_scooter');
  }
  
  const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
  const damageIntensity = 0.3 + Math.random() * 0.5;
  const damages = generateMotoDamage(template.baseValue, damageIntensity);
  const currentValue = calculateMotoCurrentValue(template.baseValue, damages);
  
  const imageVariant = Math.floor(Math.random() * 10);
  const images = MOTO_IMAGES[template.category];
  
  const priceVariance = 0.75 + Math.random() * 0.35;
  const askingPrice = Math.round(currentValue * priceVariance);
  
  return {
    id: `moto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    vehicleType: 'motorcycle',
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

// Recalculate motorcycle value after repairs
export function recalculateMotorcycleValue(car: Car): number {
  return calculateMotoCurrentValue(car.baseValue, car.damages);
}
