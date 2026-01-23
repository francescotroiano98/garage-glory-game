import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { GameState, Car, PartType, ToolLevel, DiagnosticLevel, RepairJob, SaleState, Customer } from '@/types/game';
import { recalculateCarValue, CUSTOMER_NAMES, CUSTOMER_AVATARS } from '@/data/cars';

const INITIAL_STATE: GameState = {
  money: 500,
  energy: 100,
  maxEnergy: 100,
  reputation: 0,
  xp: 0,
  level: 1,
  toolLevel: 'basic',
  diagnosticLevel: 'visual',
  skills: {
    diagnosis: 1,
    repairSpeed: 1,
    negotiation: 1,
  },
  garageUpgrades: {
    carBays: 1,
    hasPaintBooth: false,
    hasEngineLift: false,
    hasCleaningStation: false,
  },
  carsInGarage: [],
  totalCarsSold: 0,
  totalProfit: 0,
  lastEnergyUpdate: Date.now(),
  repairQueue: [],
  activeSales: [],
};

type GameAction =
  | { type: 'SET_MONEY'; payload: number }
  | { type: 'ADD_MONEY'; payload: number }
  | { type: 'SPEND_MONEY'; payload: number }
  | { type: 'SET_ENERGY'; payload: number }
  | { type: 'SPEND_ENERGY'; payload: number }
  | { type: 'REGENERATE_ENERGY' }
  | { type: 'ADD_REPUTATION'; payload: number }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'BUY_CAR'; payload: Car }
  | { type: 'SELL_CAR'; payload: { carId: string; salePrice: number } }
  | { type: 'REPAIR_PART'; payload: { carId: string; partType: PartType } }
  | { type: 'UPDATE_CAR'; payload: Car }
  | { type: 'LIST_CAR_FOR_SALE'; payload: { carId: string; askingPrice: number } }
  | { type: 'CUSTOMER_ARRIVED'; payload: { carId: string; customer: Customer; offer: number } }
  | { type: 'UPDATE_SALE_OFFER'; payload: { carId: string; offer: number; round: number } }
  | { type: 'CANCEL_SALE'; payload: string }
  | { type: 'UPGRADE_TOOLS'; payload: ToolLevel }
  | { type: 'UPGRADE_DIAGNOSTICS'; payload: DiagnosticLevel }
  | { type: 'UPGRADE_SKILL'; payload: { skill: keyof GameState['skills']; level: number } }
  | { type: 'UPGRADE_GARAGE'; payload: Partial<GameState['garageUpgrades']> }
  | { type: 'UPGRADE_MAX_ENERGY'; payload: number }
  | { type: 'ADD_REPAIR_JOB'; payload: RepairJob }
  | { type: 'COMPLETE_REPAIR'; payload: { carId: string; partType: PartType } }
  | { type: 'PROCESS_REPAIR_QUEUE' }
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
      const energyToAdd = Math.floor(minutesElapsed * 20);
      if (energyToAdd > 0) {
        return {
          ...state,
          energy: Math.min(state.maxEnergy, state.energy + energyToAdd),
          lastEnergyUpdate: now,
        };
      }
      return state;
    }
    case 'ADD_REPUTATION':
      return { ...state, reputation: Math.min(100, state.reputation + action.payload) };
    case 'ADD_XP': {
      const newXp = state.xp + action.payload;
      const xpForNextLevel = state.level * 100;
      if (newXp >= xpForNextLevel) {
        return { ...state, xp: newXp - xpForNextLevel, level: state.level + 1 };
      }
      return { ...state, xp: newXp };
    }
    case 'BUY_CAR': {
      const car = { ...action.payload, purchased: true, isInGarage: true };
      return {
        ...state,
        money: state.money - car.askingPrice,
        carsInGarage: [...state.carsInGarage, car],
      };
    }
    case 'SELL_CAR': {
      const soldCar = state.carsInGarage.find(c => c.id === action.payload.carId);
      if (!soldCar) return state;
      
      const profit = action.payload.salePrice - soldCar.askingPrice;
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
    case 'REPAIR_PART': {
      const updatedCars = state.carsInGarage.map(car => {
        if (car.id === action.payload.carId) {
          const updatedDamages = car.damages.map(d =>
            d.part === action.payload.partType ? { ...d, repaired: true } : d
          );
          const updatedCar = { ...car, damages: updatedDamages };
          updatedCar.currentValue = recalculateCarValue(updatedCar);
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
      return {
        ...state,
        skills: { ...state.skills, [action.payload.skill]: action.payload.level },
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
      const updatedCars = state.carsInGarage.map(car => {
        if (car.id === action.payload.carId) {
          const updatedDamages = car.damages.map(d =>
            d.part === action.payload.partType ? { ...d, repaired: true } : d
          );
          const updatedCar = { ...car, damages: updatedDamages };
          updatedCar.currentValue = recalculateCarValue(updatedCar);
          return updatedCar;
        }
        return car;
      });
      return { ...state, repairQueue: updatedQueue, carsInGarage: updatedCars };
    }
    case 'LOAD_STATE':
      return { 
        ...INITIAL_STATE,
        ...action.payload, 
        lastEnergyUpdate: Date.now(),
        repairQueue: action.payload.repairQueue || [],
        activeSales: action.payload.activeSales || [],
      };
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
  startRepair: (carId: string, partType: PartType, energyCost: number, duration: number) => boolean;
  getRepairProgress: (carId: string, partType: PartType) => number;
  isRepairing: (carId: string, partType: PartType) => boolean;
  getSaleState: (carId: string) => SaleState | undefined;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const SAVE_KEY = 'car_mechanic_save';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

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

  // Save game whenever state changes
  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  // Energy regeneration timer
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'REGENERATE_ENERGY' });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Process repair queue and customer arrivals
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      // Check completed repairs
      state.repairQueue.forEach(job => {
        if (now >= job.startTime + job.duration) {
          dispatch({ type: 'COMPLETE_REPAIR', payload: { carId: job.carId, partType: job.partType } });
          dispatch({ type: 'ADD_XP', payload: 10 + job.energyCost });
        }
      });
      
      // Check customer arrivals
      state.activeSales.forEach(sale => {
        if (!sale.customer && now >= sale.customerArrivalTime) {
          const customer: Customer = {
            id: `customer_${Date.now()}`,
            name: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
            avatar: CUSTOMER_AVATARS[Math.floor(Math.random() * CUSTOMER_AVATARS.length)],
            patience: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
            maxBudget: sale.askingPrice * (1 + Math.random() * 0.3),
          };
          const offerVariance = customer.patience === 'high' ? 0.95 : customer.patience === 'medium' ? 0.85 : 0.75;
          const offer = Math.round(sale.askingPrice * (offerVariance + Math.random() * 0.1));
          dispatch({ type: 'CUSTOMER_ARRIVED', payload: { carId: sale.carId, customer, offer } });
        }
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [state.repairQueue, state.activeSales]);

  const canAfford = useCallback((amount: number) => state.money >= amount, [state.money]);
  const hasEnergy = useCallback((amount: number) => state.energy >= amount, [state.energy]);

  const getVisibilityChance = useCallback(() => {
    const toolBonus: Record<DiagnosticLevel, number> = {
      visual: 0,
      basic_scanner: 0.3,
      pro_diagnostic: 0.5,
      master: 0.8,
    };
    const skillBonus = (state.skills.diagnosis - 1) * 0.05;
    return toolBonus[state.diagnosticLevel] + skillBonus;
  }, [state.diagnosticLevel, state.skills.diagnosis]);

  const getEnergyMultiplier = useCallback(() => {
    const multipliers: Record<ToolLevel, number> = {
      basic: 1,
      pro: 0.8,
      premium: 0.65,
    };
    return multipliers[state.toolLevel];
  }, [state.toolLevel]);

  const getRepairSpeedMultiplier = useCallback(() => {
    const toolBonus: Record<ToolLevel, number> = {
      basic: 1,
      pro: 0.85,
      premium: 0.7,
    };
    const skillBonus = 1 - (state.skills.repairSpeed - 1) * 0.05;
    return toolBonus[state.toolLevel] * skillBonus;
  }, [state.toolLevel, state.skills.repairSpeed]);

  const getNegotiationBonus = useCallback(() => {
    return 1 + (state.skills.negotiation - 1) * 0.03;
  }, [state.skills.negotiation]);

  const startRepair = useCallback((carId: string, partType: PartType, energyCost: number, duration: number) => {
    if (!hasEnergy(energyCost)) return false;
    
    // Check if already repairing this part
    const existingJob = state.repairQueue.find(r => r.carId === carId && r.partType === partType);
    if (existingJob) return false;
    
    dispatch({ type: 'SPEND_ENERGY', payload: energyCost });
    dispatch({
      type: 'ADD_REPAIR_JOB',
      payload: {
        carId,
        partType,
        startTime: Date.now(),
        duration: duration * 1000,
        energyCost,
      },
    });
    return true;
  }, [hasEnergy, state.repairQueue]);

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
        startRepair,
        getRepairProgress,
        isRepairing,
        getSaleState,
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
