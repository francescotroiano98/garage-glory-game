import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { GameState, Car, PartType, ToolLevel, DiagnosticLevel } from '@/types/game';
import { recalculateCarValue } from '@/data/cars';

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
  | { type: 'LIST_CAR_FOR_SALE'; payload: string }
  | { type: 'UNLIST_CAR'; payload: string }
  | { type: 'UPGRADE_TOOLS'; payload: ToolLevel }
  | { type: 'UPGRADE_DIAGNOSTICS'; payload: DiagnosticLevel }
  | { type: 'UPGRADE_SKILL'; payload: { skill: keyof GameState['skills']; level: number } }
  | { type: 'UPGRADE_GARAGE'; payload: Partial<GameState['garageUpgrades']> }
  | { type: 'UPGRADE_MAX_ENERGY'; payload: number }
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
      const energyToAdd = Math.floor(minutesElapsed * 20); // 20 energy per minute
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
      const profit = soldCar ? action.payload.salePrice - soldCar.askingPrice : 0;
      return {
        ...state,
        money: state.money + action.payload.salePrice,
        carsInGarage: state.carsInGarage.filter(c => c.id !== action.payload.carId),
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
      const updatedCars = state.carsInGarage.map(car =>
        car.id === action.payload ? { ...car, listedForSale: true, saleStartTime: Date.now() } : car
      );
      return { ...state, carsInGarage: updatedCars };
    }
    case 'UNLIST_CAR': {
      const updatedCars = state.carsInGarage.map(car =>
        car.id === action.payload ? { ...car, listedForSale: false, saleStartTime: undefined } : car
      );
      return { ...state, carsInGarage: updatedCars };
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
    case 'LOAD_STATE':
      return { ...action.payload, lastEnergyUpdate: Date.now() };
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
    }, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  const canAfford = useCallback((amount: number) => state.money >= amount, [state.money]);
  const hasEnergy = useCallback((amount: number) => state.energy >= amount, [state.energy]);

  // Diagnostic visibility based on tool level and skill
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

  // Tool level affects energy cost
  const getEnergyMultiplier = useCallback(() => {
    const multipliers: Record<ToolLevel, number> = {
      basic: 1,
      pro: 0.8,
      premium: 0.65,
    };
    return multipliers[state.toolLevel];
  }, [state.toolLevel]);

  // Repair speed multiplier
  const getRepairSpeedMultiplier = useCallback(() => {
    const toolBonus: Record<ToolLevel, number> = {
      basic: 1,
      pro: 0.85,
      premium: 0.7,
    };
    const skillBonus = 1 - (state.skills.repairSpeed - 1) * 0.05;
    return toolBonus[state.toolLevel] * skillBonus;
  }, [state.toolLevel, state.skills.repairSpeed]);

  // Negotiation bonus for better prices
  const getNegotiationBonus = useCallback(() => {
    return 1 + (state.skills.negotiation - 1) * 0.03;
  }, [state.skills.negotiation]);

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
