import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import { GameState, Car, PartType, ToolLevel, DiagnosticLevel, RepairJob, SaleState, Customer, Skills, calculateXpFromSale, MAX_LEVEL, VehicleCategory } from '@/types/game';
import { recalculateCarValue } from '@/data/cars';
import { recalculateMotorcycleValue } from '@/data/motorcycles';
import { recalculateTruckValue } from '@/data/trucks';
import { generateCustomer, calculateCustomerOffer } from '@/data/customers';

// Helper to recalculate value for both cars and motorcycles
function recalculateVehicleValue(car: Car): number {
  if (car.vehicleType === 'motorcycle') return recalculateMotorcycleValue(car);
  return recalculateCarValue(car);
}
import { PART_DEFINITIONS, calculateDiySuccessChance, getInitialPartUpgrades } from '@/data/parts';
import { getXpForLevel, getSkillPointsForLevel } from '@/data/upgrades';
import { getInitialAchievements, checkAchievements } from '@/data/achievements';
import { DailyChallengeState, getInitialDailyChallengeState, getTodayDateString, generateDailyChallenges, getWeekStartDateString, generateWeeklyChallenges } from '@/data/dailyChallenges';
import { toast } from 'sonner';

const INITIAL_STATE: GameState = {
  money: 500,
  energy: 1000,
  maxEnergy: 1000,
  reputation: 0,
  xp: 0,
  level: 1,
  skillPoints: 0,
  toolLevel: 'basic',
  diagnosticLevel: 'visual',
  skills: {
    diagnosis: 1,
    mechanical: 1,
    bodywork: 1,
    electrical: 1,
    tires: 1,
    negotiation: 1,
  },
  partUpgrades: getInitialPartUpgrades(),
  garageUpgrades: {
    carBays: 1,
    hasPaintBooth: false,
    hasEngineLift: false,
    hasCleaningStation: false,
    hasAlignmentRack: false,
    hasAdvancedTools: false,
  },
  carsInGarage: [],
  totalCarsSold: 0,
  totalProfit: 0,
  lastEnergyUpdate: Date.now(),
  lastEnergyBonus: 0,
  repairQueue: [],
  activeSales: [],
  achievements: getInitialAchievements(),
  negotiationAttempts: 0,
};

type GameAction =
  | { type: 'SET_MONEY'; payload: number }
  | { type: 'ADD_MONEY'; payload: number }
  | { type: 'SPEND_MONEY'; payload: number }
  | { type: 'SET_ENERGY'; payload: number }
  | { type: 'SPEND_ENERGY'; payload: number }
  | { type: 'REGENERATE_ENERGY' }
  | { type: 'COLLECT_ENERGY_BONUS' }
  | { type: 'ADD_REPUTATION'; payload: number }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'REMOVE_XP'; payload: number }
  | { type: 'ADD_SKILL_POINTS'; payload: number }
  | { type: 'BUY_CAR'; payload: Car }
  | { type: 'SELL_CAR'; payload: { carId: string; salePrice: number } }
  | { type: 'REPAIR_PART'; payload: { carId: string; partType: PartType } }
  | { type: 'ADD_REPAIR_COST'; payload: { carId: string; cost: number } }
  | { type: 'UPDATE_CAR'; payload: Car }
  | { type: 'LIST_CAR_FOR_SALE'; payload: { carId: string; askingPrice: number } }
  | { type: 'CUSTOMER_ARRIVED'; payload: { carId: string; customer: Customer; offer: number } }
  | { type: 'UPDATE_SALE_OFFER'; payload: { carId: string; offer: number; round: number } }
  | { type: 'CANCEL_SALE'; payload: string }
  | { type: 'UPGRADE_TOOLS'; payload: ToolLevel }
  | { type: 'UPGRADE_DIAGNOSTICS'; payload: DiagnosticLevel }
  | { type: 'UPGRADE_SKILL'; payload: { skill: keyof Skills; level: number } }
  | { type: 'UPGRADE_PART'; payload: { partType: PartType } }
  | { type: 'UPGRADE_GARAGE'; payload: Partial<GameState['garageUpgrades']> }
  | { type: 'UPGRADE_MAX_ENERGY'; payload: number }
  | { type: 'ADD_REPAIR_JOB'; payload: RepairJob }
  | { type: 'COMPLETE_REPAIR'; payload: { carId: string; partType: PartType; success: boolean } }
  | { type: 'INCREMENT_DIY_ATTEMPTS'; payload: { carId: string; partType: PartType } }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'INCREMENT_NEGOTIATION_ATTEMPTS' }
  | { type: 'RESET_NEGOTIATION_ATTEMPTS' }
  | { type: 'LOAD_STATE'; payload: GameState };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_MONEY':
      return { ...state, money: action.payload };
    case 'ADD_MONEY':
      return { ...state, money: state.money + action.payload };
    case 'SPEND_MONEY':
      return { ...state, money: Math.max(0, state.money - action.payload) };
    case 'SET_ENERGY':
      return { ...state, energy: Math.min(state.maxEnergy, action.payload) };
    case 'SPEND_ENERGY':
      return { ...state, energy: Math.max(0, state.energy - action.payload) };
    case 'REGENERATE_ENERGY': {
      const now = Date.now();
      const minutesElapsed = (now - state.lastEnergyUpdate) / 60000;
      // Cap at 30 minutes of offline regeneration
      const cappedMinutes = Math.min(minutesElapsed, 30);
      const regenRate = state.repairQueue.length > 0 ? 3 : 20;
      const energyToAdd = Math.floor(cappedMinutes * regenRate);
      if (energyToAdd > 0) {
        return {
          ...state,
          energy: Math.min(state.maxEnergy, state.energy + energyToAdd),
          lastEnergyUpdate: now,
        };
      }
      return { ...state, lastEnergyUpdate: now };
    }
    case 'COLLECT_ENERGY_BONUS': {
      const now = Date.now();
      return {
        ...state,
        energy: Math.min(state.maxEnergy, state.energy + 30),
        lastEnergyBonus: now,
      };
    }
    case 'ADD_REPUTATION':
      return { ...state, reputation: Math.min(100, state.reputation + action.payload) };
    case 'ADD_XP': {
      if (state.level >= MAX_LEVEL) {
        return { ...state, xp: 0 };
      }
      const newXp = state.xp + action.payload;
      const xpForNextLevel = getXpForLevel(state.level);
      if (newXp >= xpForNextLevel && state.level < MAX_LEVEL) {
        const newLevel = state.level + 1;
        const skillPointsEarned = getSkillPointsForLevel(newLevel);
        return { 
          ...state, 
          xp: newXp - xpForNextLevel, 
          level: newLevel,
          skillPoints: state.skillPoints + skillPointsEarned,
        };
      }
      return { ...state, xp: newXp };
    }
    case 'REMOVE_XP': {
      const newXp = state.xp - action.payload;
      if (newXp < 0 && state.level > 1) {
        const prevLevelXp = getXpForLevel(state.level - 1);
        return {
          ...state,
          xp: prevLevelXp + newXp,
          level: state.level - 1,
        };
      }
      return { ...state, xp: Math.max(0, newXp) };
    }
    case 'ADD_SKILL_POINTS':
      return { ...state, skillPoints: state.skillPoints + action.payload };
    case 'BUY_CAR': {
      const car = { 
        ...action.payload, 
        purchased: true, 
        isInGarage: true,
        purchasePrice: action.payload.askingPrice,
        totalRepairCost: 0,
      };
      return {
        ...state,
        money: state.money - car.askingPrice,
        carsInGarage: [...state.carsInGarage, car],
        negotiationAttempts: 0,
      };
    }
    case 'SELL_CAR': {
      const soldCar = state.carsInGarage.find(c => c.id === action.payload.carId);
      if (!soldCar) return state;
      
      const purchasePrice = soldCar.purchasePrice || soldCar.askingPrice;
      const totalRepairCost = soldCar.totalRepairCost || 0;
      const profit = action.payload.salePrice - purchasePrice - totalRepairCost;
      
      return {
        ...state,
        money: state.money + action.payload.salePrice,
        carsInGarage: state.carsInGarage.filter(c => c.id !== action.payload.carId),
        activeSales: state.activeSales.filter(s => s.carId !== action.payload.carId),
        repairQueue: state.repairQueue.filter(r => r.carId !== action.payload.carId),
        totalCarsSold: state.totalCarsSold + 1,
        totalProfit: state.totalProfit + profit,
      };
    }
    case 'ADD_REPAIR_COST': {
      const updatedCars = state.carsInGarage.map(car => {
        if (car.id === action.payload.carId) {
          return { ...car, totalRepairCost: (car.totalRepairCost || 0) + action.payload.cost };
        }
        return car;
      });
      return { ...state, carsInGarage: updatedCars };
    }
    case 'REPAIR_PART': {
      const updatedCars = state.carsInGarage.map(car => {
        if (car.id === action.payload.carId) {
          const updatedDamages = car.damages.map(d =>
            d.part === action.payload.partType ? { ...d, repaired: true } : d
          );
          const updatedCar = { ...car, damages: updatedDamages };
          updatedCar.currentValue = recalculateVehicleValue(updatedCar);
          return updatedCar;
        }
        return car;
      });
      return { ...state, carsInGarage: updatedCars };
    }
    case 'UPDATE_CAR': {
      const updatedCars = state.carsInGarage.map(car =>
        car.id === action.payload.id ? action.payload : car
      );
      return { ...state, carsInGarage: updatedCars };
    }
    case 'LIST_CAR_FOR_SALE': {
      const delay = 5000 + Math.random() * 25000;
      const newSale: SaleState = {
        carId: action.payload.carId,
        askingPrice: action.payload.askingPrice,
        customerArrivalTime: Date.now() + delay,
        negotiationRound: 0,
      };
      const updatedCars = state.carsInGarage.map(car =>
        car.id === action.payload.carId ? { ...car, listedForSale: true, saleStartTime: Date.now() } : car
      );
      return { 
        ...state, 
        carsInGarage: updatedCars,
        activeSales: [...state.activeSales.filter(s => s.carId !== action.payload.carId), newSale],
      };
    }
    case 'CUSTOMER_ARRIVED': {
      const updatedSales = state.activeSales.map(sale =>
        sale.carId === action.payload.carId
          ? { ...sale, customer: action.payload.customer, customerOffer: action.payload.offer }
          : sale
      );
      return { ...state, activeSales: updatedSales };
    }
    case 'UPDATE_SALE_OFFER': {
      const updatedSales = state.activeSales.map(sale =>
        sale.carId === action.payload.carId
          ? { ...sale, customerOffer: action.payload.offer, negotiationRound: action.payload.round }
          : sale
      );
      return { ...state, activeSales: updatedSales };
    }
    case 'CANCEL_SALE': {
      const updatedCars = state.carsInGarage.map(car =>
        car.id === action.payload ? { ...car, listedForSale: false, saleStartTime: undefined } : car
      );
      return { 
        ...state, 
        carsInGarage: updatedCars,
        activeSales: state.activeSales.filter(s => s.carId !== action.payload),
      };
    }
    case 'UPGRADE_TOOLS':
      return { ...state, toolLevel: action.payload };
    case 'UPGRADE_DIAGNOSTICS':
      return { ...state, diagnosticLevel: action.payload };
    case 'UPGRADE_SKILL':
      if (state.skillPoints <= 0) return state;
      return {
        ...state,
        skills: { ...state.skills, [action.payload.skill]: action.payload.level },
        skillPoints: state.skillPoints - 1,
      };
    case 'UPGRADE_PART':
      return {
        ...state,
        partUpgrades: { 
          ...state.partUpgrades, 
          [action.payload.partType]: (state.partUpgrades[action.payload.partType] || 0) + 1 
        },
      };
    case 'UPGRADE_GARAGE':
      return {
        ...state,
        garageUpgrades: { ...state.garageUpgrades, ...action.payload },
      };
    case 'UPGRADE_MAX_ENERGY':
      return { ...state, maxEnergy: action.payload };
    case 'ADD_REPAIR_JOB':
      return { ...state, repairQueue: [...state.repairQueue, action.payload] };
    case 'COMPLETE_REPAIR': {
      const updatedQueue = state.repairQueue.filter(
        r => !(r.carId === action.payload.carId && r.partType === action.payload.partType)
      );
      
      if (!action.payload.success) {
        return { ...state, repairQueue: updatedQueue };
      }
      
      const updatedCars = state.carsInGarage.map(car => {
        if (car.id === action.payload.carId) {
          const updatedDamages = car.damages.map(d =>
            d.part === action.payload.partType ? { ...d, repaired: true } : d
          );
          const updatedCar = { ...car, damages: updatedDamages };
          updatedCar.currentValue = recalculateVehicleValue(updatedCar);
          return updatedCar;
        }
        return car;
      });
      return { ...state, repairQueue: updatedQueue, carsInGarage: updatedCars };
    }
    case 'INCREMENT_DIY_ATTEMPTS': {
      const updatedCars = state.carsInGarage.map(car => {
        if (car.id === action.payload.carId) {
          const updatedDamages = car.damages.map(d =>
            d.part === action.payload.partType 
              ? { ...d, diyAttempts: (d.diyAttempts || 0) + 1 } 
              : d
          );
          return { ...car, damages: updatedDamages };
        }
        return car;
      });
      return { ...state, carsInGarage: updatedCars };
    }
    case 'UNLOCK_ACHIEVEMENT': {
      const updatedAchievements = state.achievements.map(a =>
        a.id === action.payload ? { ...a, unlocked: true, unlockedAt: Date.now() } : a
      );
      const achievement = updatedAchievements.find(a => a.id === action.payload);
      const reward = achievement?.reward || 0;
      return { 
        ...state, 
        achievements: updatedAchievements,
        money: state.money + reward,
      };
    }
    case 'INCREMENT_NEGOTIATION_ATTEMPTS':
      return { ...state, negotiationAttempts: state.negotiationAttempts + 1 };
    case 'RESET_NEGOTIATION_ATTEMPTS':
      return { ...state, negotiationAttempts: 0 };
    case 'LOAD_STATE': {
      // Calculate energy regeneration from time spent offline
      const now = Date.now();
      const lastUpdate = action.payload.lastEnergyUpdate || now;
      const minutesElapsed = Math.min((now - lastUpdate) / 60000, 30); // Cap at 30 min
      const regenRate = (action.payload.repairQueue?.length || 0) > 0 ? 3 : 20;
      const offlineEnergy = Math.floor(minutesElapsed * regenRate);
      const savedEnergy = action.payload.energy || INITIAL_STATE.energy;
      const maxEnergy = action.payload.maxEnergy || INITIAL_STATE.maxEnergy;
      const newEnergy = Math.min(maxEnergy, savedEnergy + offlineEnergy);
      
      return { 
        ...INITIAL_STATE,
        ...action.payload,
        energy: newEnergy,
        lastEnergyUpdate: now,
        repairQueue: action.payload.repairQueue || [],
        activeSales: action.payload.activeSales || [],
        skillPoints: action.payload.skillPoints || 0,
        partUpgrades: action.payload.partUpgrades || getInitialPartUpgrades(),
        achievements: action.payload.achievements || getInitialAchievements(),
        lastEnergyBonus: action.payload.lastEnergyBonus || 0,
        negotiationAttempts: action.payload.negotiationAttempts || 0,
        skills: {
          ...INITIAL_STATE.skills,
          ...action.payload.skills,
        },
        garageUpgrades: {
          ...INITIAL_STATE.garageUpgrades,
          ...action.payload.garageUpgrades,
        },
      };
    }
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  canAfford: (amount: number) => boolean;
  hasEnergy: (amount: number) => boolean;
  getVisibilityChance: () => number;
  getEnergyMultiplier: () => number;
  getRepairSpeedMultiplier: () => number;
  getNegotiationBonus: () => number;
  getToolLevelIndex: () => number;
  startRepair: (carId: string, partType: PartType, energyCost: number, moneyCost: number, duration: number, isDiy?: boolean) => boolean;
  startDiyRepair: (carId: string, partType: PartType, energyCost: number, duration: number) => { started: boolean; successChance: number };
  getRepairProgress: (carId: string, partType: PartType) => number;
  isRepairing: (carId: string, partType: PartType) => boolean;
  getSaleState: (carId: string) => SaleState | undefined;
  getDiySuccessChance: (partType: PartType) => number;
  canCollectEnergyBonus: () => boolean;
  getEnergyBonusTimeRemaining: () => number;
  handleSaleComplete: (carId: string, salePrice: number) => void;
  dailyChallenges: DailyChallengeState;
  claimChallengeReward: (challengeId: string) => void;
   claimWeeklyChallengeReward: (challengeId: string) => void;
  updateChallengeProgress: (type: string, amount: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const SAVE_KEY = 'car_mechanic_save_v3';
const CHALLENGES_KEY = 'car_mechanic_challenges';
const ENERGY_BONUS_COOLDOWN = 10 * 60 * 1000; // 10 minutes

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallengeState>(getInitialDailyChallengeState);

  // Load saved game on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (e) {
        console.error('Failed to load save:', e);
      }
    }
  }, []);

  // Load and reset daily challenges
  useEffect(() => {
    const today = getTodayDateString();
     const weekStart = getWeekStartDateString();
    const saved = localStorage.getItem(CHALLENGES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DailyChallengeState;
        // Check if we need to reset daily or weekly
        let updatedState = parsed;
        
        if (parsed.date !== today) {
          // New day - reset daily challenges but keep weekly
          const newChallenges = generateDailyChallenges(today);
          updatedState = {
            ...updatedState,
            date: today,
            challenges: newChallenges,
            progress: newChallenges.map(c => ({
              challengeId: c.id,
              progress: 0,
              completed: false,
              claimed: false,
            })),
          };
        }
        
        if (!parsed.weekStartDate || parsed.weekStartDate !== weekStart) {
          // New week - reset weekly challenges
          const newWeeklyChallenges = generateWeeklyChallenges(weekStart);
          updatedState = {
            ...updatedState,
            weekStartDate: weekStart,
            weeklyChallenges: newWeeklyChallenges,
            weeklyProgress: newWeeklyChallenges.map(c => ({
              challengeId: c.id,
              progress: 0,
              completed: false,
              claimed: false,
            })),
          };
        }
        
        // Ensure weekly fields exist
        if (!updatedState.weeklyChallenges) {
          const newWeeklyChallenges = generateWeeklyChallenges(weekStart);
          updatedState = {
            ...updatedState,
            weekStartDate: weekStart,
            weeklyChallenges: newWeeklyChallenges,
            weeklyProgress: newWeeklyChallenges.map(c => ({
              challengeId: c.id,
              progress: 0,
              completed: false,
              claimed: false,
            })),
          };
        }
        
        if (parsed.date !== today || parsed.weekStartDate !== weekStart) {
          localStorage.setItem(CHALLENGES_KEY, JSON.stringify(updatedState));
        }
        
        setDailyChallenges(updatedState);
      } catch (e) {
        console.error('Failed to load challenges:', e);
      }
    }
  }, []);

  // Save challenges whenever they change
  useEffect(() => {
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(dailyChallenges));
  }, [dailyChallenges]);

  // Save game whenever state changes
  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  // Energy regeneration timer
  useEffect(() => {
    const interval = setInterval(() => {
       // Only regenerate if enough time has passed (at least 3 seconds)
       const now = Date.now();
       const lastUpdate = state.lastEnergyUpdate;
       if (now - lastUpdate >= 3000) {
         dispatch({ type: 'REGENERATE_ENERGY' });
       }
     }, 3000);
    return () => clearInterval(interval);
   }, [state.lastEnergyUpdate]);

  // Process repair queue and customer arrivals
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      state.repairQueue.forEach(job => {
        if (now >= job.startTime + job.duration) {
          if (job.isDiy) {
            const partDef = PART_DEFINITIONS[job.partType];
            const skillKey = partDef.skillRequired;
            const skillLevel = state.skills[skillKey as keyof Skills] || 1;
            const toolLevel = getToolLevelIndexLocal(state.toolLevel);
            const hasEquipment = getEquipmentForCategory(partDef.category, state.garageUpgrades);
            const partUpgradeLevel = state.partUpgrades[job.partType] || 0;
            const successChance = calculateDiySuccessChance(job.partType, skillLevel, toolLevel, hasEquipment, partUpgradeLevel);
            const success = Math.random() * 100 < successChance;
            
            dispatch({ type: 'COMPLETE_REPAIR', payload: { carId: job.carId, partType: job.partType, success } });
            dispatch({ type: 'INCREMENT_DIY_ATTEMPTS', payload: { carId: job.carId, partType: job.partType } });
          } else {
            dispatch({ type: 'COMPLETE_REPAIR', payload: { carId: job.carId, partType: job.partType, success: true } });
          }
        }
      });
      
      state.activeSales.forEach(sale => {
        if (!sale.customer && now >= sale.customerArrivalTime) {
          const car = state.carsInGarage.find(c => c.id === sale.carId);
          const customer = generateCustomer(sale.askingPrice, car?.category);
          const offer = calculateCustomerOffer(customer, sale.askingPrice);
          dispatch({ type: 'CUSTOMER_ARRIVED', payload: { carId: sale.carId, customer, offer } });
        }
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [state.repairQueue, state.activeSales, state.skills, state.toolLevel, state.garageUpgrades, state.partUpgrades]);

  const canAfford = useCallback((amount: number) => state.money >= amount, [state.money]);
  const hasEnergy = useCallback((amount: number) => state.energy >= amount, [state.energy]);

  const canCollectEnergyBonus = useCallback(() => {
    const now = Date.now();
    return now - state.lastEnergyBonus >= ENERGY_BONUS_COOLDOWN;
  }, [state.lastEnergyBonus]);

  const getEnergyBonusTimeRemaining = useCallback(() => {
    const now = Date.now();
    const elapsed = now - state.lastEnergyBonus;
    return Math.max(0, ENERGY_BONUS_COOLDOWN - elapsed);
  }, [state.lastEnergyBonus]);

  const getVisibilityChance = useCallback(() => {
    const toolBonus: Record<DiagnosticLevel, number> = {
      visual: 0,
      basic_scanner: 0.3,
      intermediate: 0.5,
      pro_diagnostic: 0.7,
      advanced: 0.85,
      master: 1.0,
    };
    const skillBonus = (state.skills.diagnosis - 1) * 0.03;
    return toolBonus[state.diagnosticLevel] + skillBonus;
  }, [state.diagnosticLevel, state.skills.diagnosis]);

  const getEnergyMultiplier = useCallback(() => {
    const multipliers: Record<ToolLevel, number> = {
      basic: 1,
      standard: 0.9,
      pro: 0.8,
      advanced: 0.7,
      premium: 0.6,
      master: 0.5,
    };
    return multipliers[state.toolLevel];
  }, [state.toolLevel]);

  const getRepairSpeedMultiplier = useCallback(() => {
    const toolBonus: Record<ToolLevel, number> = {
      basic: 1,
      standard: 1,
      pro: 0.9,
      advanced: 0.8,
      premium: 0.7,
      master: 0.6,
    };
    const avgSkill = (state.skills.mechanical + state.skills.bodywork + state.skills.electrical + state.skills.tires) / 4;
    const skillBonus = 1 - (avgSkill - 1) * 0.02;
    return toolBonus[state.toolLevel] * skillBonus;
  }, [state.toolLevel, state.skills]);

  const getNegotiationBonus = useCallback(() => {
    return 1 + (state.skills.negotiation - 1) * 0.02;
  }, [state.skills.negotiation]);

  const getToolLevelIndex = useCallback(() => {
    return getToolLevelIndexLocal(state.toolLevel);
  }, [state.toolLevel]);

  const getDiySuccessChance = useCallback((partType: PartType) => {
    const partDef = PART_DEFINITIONS[partType];
    const skillKey = partDef.skillRequired;
    const skillLevel = state.skills[skillKey as keyof Skills] || 1;
    const toolLevel = getToolLevelIndexLocal(state.toolLevel);
    const hasEquipment = getEquipmentForCategory(partDef.category, state.garageUpgrades);
    const partUpgradeLevel = state.partUpgrades[partType] || 0;
    return calculateDiySuccessChance(partType, skillLevel, toolLevel, hasEquipment, partUpgradeLevel);
  }, [state.skills, state.toolLevel, state.garageUpgrades, state.partUpgrades]);

  const startRepair = useCallback((carId: string, partType: PartType, energyCost: number, moneyCost: number, duration: number, isDiy: boolean = false) => {
    if (!hasEnergy(energyCost)) return false;
    if (!canAfford(moneyCost)) return false;
    
    const existingJob = state.repairQueue.find(r => r.carId === carId && r.partType === partType);
    if (existingJob) return false;
    
    dispatch({ type: 'SPEND_ENERGY', payload: energyCost });
    dispatch({ type: 'SPEND_MONEY', payload: moneyCost });
    dispatch({ type: 'ADD_REPAIR_COST', payload: { carId, cost: moneyCost } });
    dispatch({
      type: 'ADD_REPAIR_JOB',
      payload: {
        carId,
        partType,
        startTime: Date.now(),
        duration: duration * 1000,
        energyCost,
        moneyCost,
        isDiy,
      },
    });
    return true;
  }, [hasEnergy, canAfford, state.repairQueue]);

  const startDiyRepair = useCallback((carId: string, partType: PartType, energyCost: number, duration: number) => {
    const successChance = getDiySuccessChance(partType);
    const diyEnergyCost = Math.round(energyCost * 0.5);
    const started = startRepair(carId, partType, diyEnergyCost, 0, duration * 0.7, true);
    return { started, successChance };
  }, [startRepair, getDiySuccessChance]);

  const getRepairProgress = useCallback((carId: string, partType: PartType) => {
    const job = state.repairQueue.find(r => r.carId === carId && r.partType === partType);
    if (!job) return 0;
    const elapsed = Date.now() - job.startTime;
    return Math.min(100, (elapsed / job.duration) * 100);
  }, [state.repairQueue]);

  const isRepairing = useCallback((carId: string, partType: PartType) => {
    return state.repairQueue.some(r => r.carId === carId && r.partType === partType);
  }, [state.repairQueue]);

  const getSaleState = useCallback((carId: string) => {
    return state.activeSales.find(s => s.carId === carId);
  }, [state.activeSales]);

  const updateChallengeProgress = useCallback((type: string, amount: number) => {
    setDailyChallenges(prev => {
       // Update daily progress
      const updatedProgress = prev.progress.map(p => {
        const challenge = prev.challenges.find(c => c.id === p.challengeId);
        if (challenge?.type === type && !p.claimed) {
          const newProgress = p.progress + amount;
          const completed = newProgress >= challenge.target;
          return { ...p, progress: newProgress, completed };
        }
        return p;
      });
       
       // Update weekly progress
       const updatedWeeklyProgress = (prev.weeklyProgress || []).map(p => {
         const challenge = (prev.weeklyChallenges || []).find(c => c.id === p.challengeId);
         if (challenge?.type === type && !p.claimed) {
           const newProgress = p.progress + amount;
           const completed = newProgress >= challenge.target;
           return { ...p, progress: newProgress, completed };
         }
         return p;
       });
       
       return { ...prev, progress: updatedProgress, weeklyProgress: updatedWeeklyProgress };
    });
  }, []);

  const handleSaleComplete = useCallback((carId: string, salePrice: number) => {
    const car = state.carsInGarage.find(c => c.id === carId);
    if (!car) return;
    
    const purchasePrice = car.purchasePrice || car.askingPrice;
    const totalRepairCost = car.totalRepairCost || 0;
    const totalInvestment = purchasePrice + totalRepairCost;
    const profitMargin = totalInvestment > 0 ? ((salePrice - totalInvestment) / totalInvestment) * 100 : 0;
    
    // Calculate XP
    const xpGain = calculateXpFromSale(purchasePrice, totalRepairCost, salePrice);
    
    if (xpGain > 0) {
      dispatch({ type: 'ADD_XP', payload: xpGain });
    } else if (xpGain < 0) {
      dispatch({ type: 'REMOVE_XP', payload: Math.abs(xpGain) });
    }
    
    // Check achievements
    const newAchievements = checkAchievements(state, {
      carCategory: car.category,
      profitMargin,
    });
    
    newAchievements.forEach(achievementId => {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievementId });
      const achievement = state.achievements.find(a => a.id === achievementId);
      if (achievement) {
        toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`);
      }
    });
    
    // Sell the car
    dispatch({ type: 'SELL_CAR', payload: { carId, salePrice } });
    
    // Add reputation for profitable sale
    const profit = salePrice - totalInvestment;
    if (profit > 0) {
      dispatch({ type: 'ADD_REPUTATION', payload: Math.min(5, Math.ceil(profitMargin / 20)) });
    }
    
    // Update daily challenges
    updateChallengeProgress('sell_cars', 1);
    if (profit > 0) {
      updateChallengeProgress('earn_profit', profit);
    }
  }, [state.carsInGarage, state.achievements, state, updateChallengeProgress]);

  const claimChallengeReward = useCallback((challengeId: string) => {
    const challenge = dailyChallenges.challenges.find(c => c.id === challengeId);
    const progressData = dailyChallenges.progress.find(p => p.challengeId === challengeId);
    
    if (!challenge || !progressData?.completed || progressData.claimed) return;

    // Give reward
    switch (challenge.rewardType) {
      case 'money':
        dispatch({ type: 'ADD_MONEY', payload: challenge.reward });
        break;
      case 'energy':
        dispatch({ type: 'SET_ENERGY', payload: state.energy + challenge.reward });
        break;
      case 'xp':
        dispatch({ type: 'ADD_XP', payload: challenge.reward });
        break;
    }

    // Mark as claimed
    setDailyChallenges(prev => ({
      ...prev,
      progress: prev.progress.map(p =>
        p.challengeId === challengeId ? { ...p, claimed: true } : p
      ),
    }));
  }, [dailyChallenges, state.energy]);
 
   const claimWeeklyChallengeReward = useCallback((challengeId: string) => {
     const challenge = dailyChallenges.weeklyChallenges?.find(c => c.id === challengeId);
     const progressData = dailyChallenges.weeklyProgress?.find(p => p.challengeId === challengeId);
     
     if (!challenge || !progressData?.completed || progressData.claimed) return;
 
     // Give reward
     switch (challenge.rewardType) {
       case 'money':
         dispatch({ type: 'ADD_MONEY', payload: challenge.reward });
         break;
       case 'energy':
         dispatch({ type: 'SET_ENERGY', payload: state.energy + challenge.reward });
         break;
       case 'xp':
         dispatch({ type: 'ADD_XP', payload: challenge.reward });
         break;
     }
 
     // Mark as claimed
     setDailyChallenges(prev => ({
       ...prev,
       weeklyProgress: (prev.weeklyProgress || []).map(p =>
         p.challengeId === challengeId ? { ...p, claimed: true } : p
       ),
     }));
   }, [dailyChallenges, state.energy]);

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        canAfford,
        hasEnergy,
        getVisibilityChance,
        getEnergyMultiplier,
        getRepairSpeedMultiplier,
        getNegotiationBonus,
        getToolLevelIndex,
        startRepair,
        startDiyRepair,
        getRepairProgress,
        isRepairing,
        getSaleState,
        getDiySuccessChance,
        canCollectEnergyBonus,
        getEnergyBonusTimeRemaining,
        handleSaleComplete,
        dailyChallenges,
        claimChallengeReward,
         claimWeeklyChallengeReward,
        updateChallengeProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

function getToolLevelIndexLocal(level: ToolLevel): number {
  const levels: ToolLevel[] = ['basic', 'standard', 'pro', 'advanced', 'premium', 'master'];
  return levels.indexOf(level);
}

function getEquipmentForCategory(category: string, upgrades: GameState['garageUpgrades']): boolean {
  switch (category) {
    case 'mechanical': return upgrades.hasEngineLift;
    case 'body': return upgrades.hasPaintBooth;
    case 'tires': return upgrades.hasAlignmentRack;
    case 'interior': return upgrades.hasAdvancedTools || upgrades.hasCleaningStation;
    default: return false;
  }
}
