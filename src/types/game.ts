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

// 12 motorcycle categories
export type MotorcycleCategory =
  | 'moto_old_scooter' | 'moto_scooter' | 'moto_125'
  | 'moto_naked' | 'moto_chopper' | 'moto_touring' | 'moto_adventure'
  | 'moto_enduro' | 'moto_supersport' | 'moto_caferacer'
  | 'moto_electric' | 'moto_superbike';

export type TruckCategory =
  | 'truck_old_pickup' | 'truck_pickup' | 'truck_van' | 'truck_delivery' | 'truck_flatbed'
  | 'truck_dump' | 'truck_box' | 'truck_tow' | 'truck_refrigerated'
  | 'truck_semi_light' | 'truck_semi' | 'truck_heavy';

export type VehicleCategory = CarCategory | MotorcycleCategory | TruckCategory;

// Map levels to car categories.
// Only 12 categories are actively unlocked/spawned across the 40 levels.
// The remaining 8 (compact, wagon, suv_small, suv_large, sports, luxury_entry,
// luxury_full, exotic) are kept in the type system for save/collection
// compatibility but never unlock (level 999).
export const CATEGORY_UNLOCK_LEVEL: Record<CarCategory, number> = {
  junker: 1, beater: 4, economy: 8, hatchback: 12,
  sedan: 16, coupe: 20, suv_mid: 23, crossover: 26,
  muscle: 29, sports_premium: 32, luxury_mid: 36, supercar: 40,
  // Deprecated / inactive categories
  compact: 999, wagon: 999, suv_small: 999, suv_large: 999,
  sports: 999, luxury_entry: 999, luxury_full: 999, exotic: 999,
};

// Map levels to motorcycle categories (12 across 40 levels)
export const MOTO_CATEGORY_UNLOCK_LEVEL: Record<MotorcycleCategory, number> = {
  moto_old_scooter: 1, moto_scooter: 4, moto_125: 8,
  moto_naked: 12, moto_chopper: 16, moto_touring: 20,
  moto_adventure: 23, moto_enduro: 26, moto_supersport: 29,
  moto_caferacer: 32, moto_electric: 36, moto_superbike: 40,
};

// Map levels to truck categories (12 across 40 levels)
export const TRUCK_CATEGORY_UNLOCK_LEVEL: Record<TruckCategory, number> = {
  truck_old_pickup: 1, truck_pickup: 4, truck_van: 8, truck_delivery: 12,
  truck_flatbed: 16, truck_dump: 20, truck_box: 23, truck_tow: 26,
  truck_refrigerated: 29, truck_semi_light: 32, truck_semi: 36, truck_heavy: 40,
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
  moto_naked: 'Naked', moto_chopper: 'Chopper', moto_touring: 'Touring', moto_adventure: 'Adventure',
  moto_enduro: 'Enduro', moto_supersport: 'Supersport', moto_caferacer: 'Cafe Racer',
  moto_electric: 'Electric', moto_superbike: 'Superbike',
  // Trucks
  truck_old_pickup: 'Old Pickup', truck_pickup: 'Pickup', truck_van: 'Van',
  truck_delivery: 'Delivery', truck_flatbed: 'Flatbed', truck_dump: 'Dump Truck',
  truck_box: 'Box Truck', truck_tow: 'Tow Truck', truck_refrigerated: 'Refrigerated',
  truck_semi_light: 'Light Semi', truck_semi: 'Semi',
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
  /** Discount fraction applied based on which card variants of this model the
   * player owns (0.05 base, 0.10 reverse, 0.15 gold and combinations up to 0.30). */
  collectionBonus?: number;
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
  /** Free packs awarded from challenges; map packId -> count */
  pendingPacks?: Record<string, number>;
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
export const MAX_LEVEL = 40;

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
// Tuned for 40 levels: 1-5 → 1000, 6-15 → 2000, 16-25 → 3000,
// 26-35 → 4500, 36+ → 6000.
export function getXpForLevel(level: number): number {
  if (level >= MAX_LEVEL) return Infinity;
  if (level <= 5) return 1000;
  if (level <= 15) return 2000;
  if (level <= 25) return 3000;
  if (level <= 35) return 4500;
  return 6000;
}

// Get categories available at a given level
export function getCategoriesForLevel(level: number): CarCategory[] {
  // Only the 12 active categories are considered.
  const activeCategories: CarCategory[] = [
    'junker', 'beater', 'economy', 'hatchback',
    'sedan', 'coupe', 'suv_mid', 'crossover',
    'muscle', 'sports_premium', 'luxury_mid', 'supercar',
  ];
  return activeCategories.filter(cat => CATEGORY_UNLOCK_LEVEL[cat] <= level);
}
