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
  repairTime: number;
  valueImpact: number;
  diyAttempts?: number; // Track DIY attempts
}

export type CarCategory = 'economy' | 'sedan' | 'suv' | 'sports' | 'luxury';

export interface Car {
  id: string;
  name: string;
  category: CarCategory;
  image: string;
  baseValue: number;
  askingPrice: number;
  damages: PartDamage[];
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

export interface GameState {
  money: number;
  energy: number;
  maxEnergy: number;
  reputation: number;
  xp: number;
  level: number;
  skillPoints: number; // Points to spend on skills
  toolLevel: ToolLevel;
  diagnosticLevel: DiagnosticLevel;
  skills: Skills;
  garageUpgrades: GarageUpgrades;
  carsInGarage: Car[];
  totalCarsSold: number;
  totalProfit: number;
  lastEnergyUpdate: number;
  repairQueue: RepairJob[];
  activeSales: SaleState[];
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
