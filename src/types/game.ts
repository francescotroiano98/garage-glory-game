// Car Parts and Damage Types
export type PartCategory = 'mechanical' | 'body' | 'tires' | 'interior';

export type PartType = 
  | 'engine' | 'transmission' | 'brakes' | 'suspension' | 'exhaust'
  | 'paint' | 'dents' | 'rust' | 'windows' | 'lights' | 'bumpers'
  | 'tires' | 'wheels' | 'alignment'
  | 'seats' | 'dashboard' | 'electronics' | 'cleaning';

export type DamageLevel = 'none' | 'minor' | 'moderate' | 'major' | 'critical';

export interface PartDamage {
  part: PartType;
  category: PartCategory;
  level: DamageLevel;
  visible: boolean; // Whether damage is visible before inspection
  repaired: boolean;
  energyCost: number;
  repairTime: number; // in seconds
  valueImpact: number; // How much this damage reduces car value
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

// Progression Types
export type ToolLevel = 'basic' | 'pro' | 'premium';
export type DiagnosticLevel = 'visual' | 'basic_scanner' | 'pro_diagnostic' | 'master';

export interface Skills {
  diagnosis: number; // 1-10
  repairSpeed: number; // 1-10
  negotiation: number; // 1-10
}

export interface GarageUpgrades {
  carBays: number; // 1-3
  hasPaintBooth: boolean;
  hasEngineLift: boolean;
  hasCleaningStation: boolean;
}

export interface GameState {
  money: number;
  energy: number;
  maxEnergy: number;
  reputation: number; // 0-100
  xp: number;
  level: number;
  toolLevel: ToolLevel;
  diagnosticLevel: DiagnosticLevel;
  skills: Skills;
  garageUpgrades: GarageUpgrades;
  carsInGarage: Car[];
  totalCarsSold: number;
  totalProfit: number;
  lastEnergyUpdate: number;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  avatar: string;
  patience: 'low' | 'medium' | 'high';
  maxBudget: number;
  preferredCategory?: CarCategory;
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
  progress: number; // 0-100
  startTime: number;
}
