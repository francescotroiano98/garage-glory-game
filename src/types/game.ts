// Car Parts and Damage Types
export type PartCategory = 'mechanical' | 'body' | 'tires' | 'interior';

// 6 parts per category = 24 total parts
export type PartType = 
  // Mechanical (6)
  | 'engine' | 'transmission' | 'brakes' | 'suspension' | 'exhaust' | 'fuel_system'
  // Body (6)
  | 'paint' | 'dents' | 'rust' | 'windows' | 'lights' | 'bumpers'
  // Tires (6)
  | 'front_tires' | 'rear_tires' | 'wheels' | 'alignment' | 'tire_pressure' | 'wheel_bearings'
  // Interior (6)
  | 'seats' | 'dashboard' | 'electronics' | 'cleaning' | 'air_conditioning' | 'audio_system';

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

export type CarCategory = 'economy' | 'sedan' | 'suv' | 'sports' | 'luxury';

export interface Car {
  id: string;
  name: string;
  category: CarCategory;
  image: string;
  imageVariant?: number; // NEW: Image variant for variety
  baseValue: number;
  askingPrice: number;
  purchasePrice?: number; // NEW: Track what we paid for the car
  damages: PartDamage[];
  totalRepairCost?: number; // NEW: Track total repair costs
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
  preferredCategory?: CarCategory;
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

// XP required for each level (exponential, harder each level)
export function getXpForLevel(level: number): number {
  // Level 1->2: 100 XP, Level 19->20: ~3700 XP
  return Math.floor(100 * Math.pow(1.2, level - 1));
}
