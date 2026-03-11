// Car Parts and Damage Types
export type PartCategory = 'mechanical' | 'body' | 'tires' | 'interior';

// 6 parts per category = 24 total parts
export type VehicleType = 'car' | 'motorcycle' | 'truck';

export type PartType = 
  // Car Mechanical (6)
  | 'engine' | 'transmission' | 'brakes' | 'suspension' | 'exhaust' | 'fuel_system'
  // Car Body (6)
  | 'paint' | 'dents' | 'rust' | 'windows' | 'lights' | 'bumpers'
  // Car Tires (6)
  | 'front_tires' | 'rear_tires' | 'wheels' | 'alignment' | 'tire_pressure' | 'wheel_bearings'
  // Car Interior (6)
  | 'seats' | 'dashboard' | 'electronics' | 'cleaning' | 'air_conditioning' | 'audio_system'
  // Motorcycle Mechanical (4)
  | 'moto_engine' | 'moto_chain' | 'moto_exhaust' | 'moto_carburetor'
  // Motorcycle Body (4)
  | 'moto_fairing' | 'moto_tank' | 'moto_fender' | 'moto_mirrors'
  // Motorcycle Tires (4)
  | 'moto_front_tire' | 'moto_rear_tire' | 'moto_front_suspension' | 'moto_rear_suspension'
  // Motorcycle Electrical (4)
  | 'moto_battery' | 'moto_wiring' | 'moto_instruments' | 'moto_seat'
  // Truck Mechanical (4)
  | 'truck_engine' | 'truck_transmission' | 'truck_brakes' | 'truck_hydraulics'
  // Truck Body (4)
  | 'truck_cabin' | 'truck_bed' | 'truck_frame' | 'truck_lights'
  // Truck Tires (4)
  | 'truck_front_axle' | 'truck_rear_axle' | 'truck_tires' | 'truck_suspension'
  // Truck Interior (4)
  | 'truck_dashboard' | 'truck_wiring' | 'truck_ac' | 'truck_seat';

export type DamageLevel = 'none' | 'minor' | 'moderate' | 'major' | 'critical';

export interface PartDamage {
  part: PartType;
  category: PartCategory;
  level: DamageLevel;
  visible: boolean;
  repaired: boolean;
  energyCost: number;
  moneyCost: number; // NEW: Money cost for repairs
  repairTime: number;
  valueImpact: number;
  diyAttempts?: number;
}

// 20 car categories - one unlocked per level
export type CarCategory = 
  | 'junker' | 'beater' | 'economy' | 'compact' | 'hatchback'
  | 'sedan' | 'wagon' | 'coupe' | 'suv_small' | 'suv_mid'
  | 'suv_large' | 'crossover' | 'muscle' | 'sports' | 'sports_premium'
  | 'luxury_entry' | 'luxury_mid' | 'luxury_full' | 'exotic' | 'supercar';

// 10 motorcycle categories - unlocked at odd levels
export type MotorcycleCategory =
  | 'moto_old_scooter' | 'moto_scooter' | 'moto_125'
  | 'moto_naked' | 'moto_touring' | 'moto_adventure'
  | 'moto_enduro' | 'moto_supersport' | 'moto_caferacer' | 'moto_superbike';

export type TruckCategory =
  | 'truck_old_pickup' | 'truck_pickup' | 'truck_van' | 'truck_delivery' | 'truck_flatbed'
  | 'truck_box' | 'truck_tow' | 'truck_semi_light' | 'truck_semi' | 'truck_heavy';

export type VehicleCategory = CarCategory | MotorcycleCategory | TruckCategory;

// Map levels to car categories
export const CATEGORY_UNLOCK_LEVEL: Record<CarCategory, number> = {
  junker: 1, beater: 2, economy: 3, compact: 4, hatchback: 5,
  sedan: 6, wagon: 7, coupe: 8, suv_small: 9, suv_mid: 10,
  suv_large: 11, crossover: 12, muscle: 13, sports: 14, sports_premium: 15,
  luxury_entry: 16, luxury_mid: 17, luxury_full: 18, exotic: 19, supercar: 20,
};

// Map levels to motorcycle categories
export const MOTO_CATEGORY_UNLOCK_LEVEL: Record<MotorcycleCategory, number> = {
  moto_old_scooter: 1, moto_scooter: 3, moto_125: 5,
  moto_naked: 7, moto_touring: 9, moto_adventure: 11,
  moto_enduro: 13, moto_supersport: 15, moto_caferacer: 17, moto_superbike: 19,
};

// Map levels to truck categories (even levels)
export const TRUCK_CATEGORY_UNLOCK_LEVEL: Record<TruckCategory, number> = {
  truck_old_pickup: 2, truck_pickup: 4, truck_van: 6, truck_delivery: 8, truck_flatbed: 10,
  truck_box: 12, truck_tow: 14, truck_semi_light: 16, truck_semi: 18, truck_heavy: 20,
};

// Category display names
export const CATEGORY_NAMES: Record<VehicleCategory, string> = {
  junker: 'Junker', beater: 'Beater', economy: 'Economy', compact: 'Compact',
  hatchback: 'Hatchback', sedan: 'Sedan', wagon: 'Wagon', coupe: 'Coupe',
  suv_small: 'Small SUV', suv_mid: 'Mid SUV', suv_large: 'Large SUV',
  crossover: 'Crossover', muscle: 'Muscle', sports: 'Sports',
  sports_premium: 'Premium Sports', luxury_entry: 'Entry Luxury',
  luxury_mid: 'Mid Luxury', luxury_full: 'Full Luxury', exotic: 'Exotic', supercar: 'Supercar',
  // Motorcycles
  moto_old_scooter: 'Old Scooter', moto_scooter: 'Scooter', moto_125: '125cc',
  moto_naked: 'Naked', moto_touring: 'Touring', moto_adventure: 'Adventure',
  moto_enduro: 'Enduro', moto_supersport: 'Supersport', moto_caferacer: 'Cafe Racer',
  moto_superbike: 'Superbike',
  // Trucks
  truck_old_pickup: 'Old Pickup', truck_pickup: 'Pickup', truck_van: 'Van',
  truck_delivery: 'Delivery', truck_flatbed: 'Flatbed', truck_box: 'Box Truck',
  truck_tow: 'Tow Truck', truck_semi_light: 'Light Semi', truck_semi: 'Semi',
  truck_heavy: 'Heavy Duty',
};

export interface Car {
  id: string;
  name: string;
  vehicleType?: VehicleType; // 'car' | 'motorcycle', defaults to 'car'
  category: CarCategory | MotorcycleCategory | TruckCategory;
  image: string;
  imageVariant?: number;
  baseValue: number;
  askingPrice: number;
  purchasePrice?: number;
  damages: PartDamage[];
  totalRepairCost?: number;
  purchased: boolean;
  currentValue: number;
  isInGarage: boolean;
  listedForSale: boolean;
  saleStartTime?: number;
}

// Progression Types - More levels for harder progression
export type ToolLevel = 'basic' | 'standard' | 'pro' | 'advanced' | 'premium' | 'master';
export type DiagnosticLevel = 'visual' | 'basic_scanner' | 'intermediate' | 'pro_diagnostic' | 'advanced' | 'master';

// Skills with more granular categories
export interface Skills {
  diagnosis: number; // 1-20
  mechanical: number; // 1-20 - affects mechanical DIY success
  bodywork: number; // 1-20 - affects body DIY success
  electrical: number; // 1-20 - affects electrical/interior DIY success
  tires: number; // 1-20 - affects tire DIY success
  negotiation: number; // 1-20
}

// Part-specific upgrade levels (10 levels each)
export type PartUpgrades = Record<PartType, number>;

export interface GarageUpgrades {
  carBays: number; // 1-5
  hasPaintBooth: boolean;
  hasEngineLift: boolean;
  hasCleaningStation: boolean;
  hasAlignmentRack: boolean;
  hasAdvancedTools: boolean;
}

// Repair job in queue
export interface RepairJob {
  carId: string;
  partType: PartType;
  startTime: number;
  duration: number;
  energyCost: number;
  moneyCost: number; // NEW: Track money cost
  isDiy: boolean;
}

// Sale state for a car
export interface SaleState {
  carId: string;
  askingPrice: number;
  customerArrivalTime: number;
  customer?: Customer;
  customerOffer?: number;
  negotiationRound: number;
}

// Achievement types
export type AchievementId = 
  | 'first_sale' | 'profit_1k' | 'profit_10k' | 'profit_100k'
  | 'cars_sold_10' | 'cars_sold_50' | 'cars_sold_100'
  | 'level_5' | 'level_10' | 'level_20'
  | 'perfect_flip' | 'diy_master' | 'negotiator'
  | 'luxury_dealer' | 'speed_demon' | 'collector';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  reward: number; // Money reward
  unlocked: boolean;
  unlockedAt?: number;
}

export interface GameState {
  money: number;
  energy: number;
  maxEnergy: number;
  reputation: number;
  xp: number;
  level: number;
  skillPoints: number;
  toolLevel: ToolLevel;
  diagnosticLevel: DiagnosticLevel;
  skills: Skills;
  partUpgrades: PartUpgrades; // NEW: Part-specific upgrades
  garageUpgrades: GarageUpgrades;
  carsInGarage: Car[];
  totalCarsSold: number;
  totalProfit: number;
  lastEnergyUpdate: number;
  lastEnergyBonus: number; // NEW: Last time bonus energy was collected
  repairQueue: RepairJob[];
  activeSales: SaleState[];
  achievements: Achievement[]; // NEW: Achievements
  negotiationAttempts: number; // NEW: Track negotiation attempts for buying
}

// Customer Types - 20 different types
export type CustomerPersonality = 
  | 'bargain_hunter' | 'impulse_buyer' | 'skeptic' | 'enthusiast' | 'businessman'
  | 'first_timer' | 'collector' | 'commuter' | 'family_person' | 'student'
  | 'retiree' | 'flipper' | 'mechanic' | 'impatient' | 'patient'
  | 'rich' | 'budget' | 'suspicious' | 'friendly' | 'expert';

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  personality: CustomerPersonality;
  patience: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  maxBudget: number;
  preferredCategory?: VehicleCategory;
  bargainSkill: number; // 1-10 how good they are at negotiating
  trustLevel: number; // 1-10 how much they trust the seller
  traits: string[]; // Visible traits to player
}

// Newspaper Ad
export interface NewspaperAd {
  id: string;
  car: Car;
  seller: string;
  daysListed: number;
  negotiable: boolean;
}

// Repair Progress
export interface RepairProgress {
  carId: string;
  partType: PartType;
  progress: number;
  startTime: number;
}

// XP calculation based on profit margin
export const MAX_LEVEL = 20;

export function calculateXpFromSale(purchasePrice: number, totalRepairCost: number, salePrice: number): number {
  const totalInvestment = purchasePrice + totalRepairCost;
  const profit = salePrice - totalInvestment;
  const profitMargin = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;
  
  if (profitMargin >= 50) return 100;
  if (profitMargin >= 30) return 50;
  if (profitMargin > 0) return 25;
  if (profitMargin === 0) return 0;
  
  // Negative profit = lose XP
  if (profitMargin <= -50) return -100;
  if (profitMargin <= -30) return -50;
  return -25;
}

// XP required for each level
// Levels 1-5: 1000 XP each, 6-15: 2000 XP each, 16+: 3000 XP each
export function getXpForLevel(level: number): number {
  if (level >= MAX_LEVEL) return Infinity;
  if (level <= 5) return 1000;
  if (level <= 15) return 2000;
  return 3000;
}

// Get categories available at a given level
export function getCategoriesForLevel(level: number): CarCategory[] {
  const allCategories: CarCategory[] = [
    'junker', 'beater', 'economy', 'compact', 'hatchback',
    'sedan', 'wagon', 'coupe', 'suv_small', 'suv_mid',
    'suv_large', 'crossover', 'muscle', 'sports', 'sports_premium',
    'luxury_entry', 'luxury_mid', 'luxury_full', 'exotic', 'supercar'
  ];
  return allCategories.filter(cat => CATEGORY_UNLOCK_LEVEL[cat] <= level);
}
