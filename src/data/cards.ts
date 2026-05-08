import { VehicleCategory, CATEGORY_NAMES } from '@/types/game';
import { getVehicleNameByImage } from './vehicleNames';

export type CardRarity = 'base' | 'reverse' | 'gold';

export interface CollectibleCard {
  id: string; // e.g. "junker_1_base"
  vehicleCategory: VehicleCategory;
  imageVariant: number; // 1-10
  rarity: CardRarity;
  name: string;
}

export interface OwnedCard {
  cardId: string;
  quantity: number;
  firstObtained: number;
}

export interface PackType {
  id: string;
  name: string;
  nameIt: string;
  description: string;
  descriptionIt: string;
  cost: number;
  cardCount: number;
  guaranteedReverse: boolean;
  goldMultiplier: number; // multiplier on gold chance
  reverseMultiplier: number; // multiplier on reverse chance
  icon: string;
}

export const PACK_TYPES: PackType[] = [
  {
    id: 'base',
    name: 'Base Pack',
    nameIt: 'Pacchetto Base',
    description: '5 cards with standard odds',
    descriptionIt: '5 carte con probabilità standard',
    cost: 500,
    cardCount: 5,
    guaranteedReverse: false,
    goldMultiplier: 1,
    reverseMultiplier: 1,
    icon: '📦',
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    nameIt: 'Pacchetto Premium',
    description: '5 cards, 2x Reverse chance',
    descriptionIt: '5 carte, probabilità Reverse 2x',
    cost: 2000,
    cardCount: 5,
    guaranteedReverse: false,
    goldMultiplier: 1.5,
    reverseMultiplier: 2,
    icon: '💎',
  },
  {
    id: 'legendary',
    name: 'Legendary Pack',
    nameIt: 'Pacchetto Leggendario',
    description: '5 cards, 3x Gold chance + 1 guaranteed Reverse',
    descriptionIt: '5 carte, probabilità Gold 3x + 1 Reverse garantita',
    cost: 5000,
    cardCount: 5,
    guaranteedReverse: true,
    goldMultiplier: 3,
    reverseMultiplier: 2,
    icon: '👑',
  },
];

// Base probabilities
const BASE_GOLD_CHANCE = 0.03; // 3%
const BASE_REVERSE_CHANCE = 0.17; // 17%

// Sell value for duplicates
export const CARD_SELL_VALUES: Record<CardRarity, number> = {
  base: 25,
  reverse: 150,
  gold: 500,
};

// All vehicle categories for cards
const ALL_CARD_CATEGORIES: VehicleCategory[] = [
  'junker', 'beater', 'economy', 'compact', 'hatchback',
  'sedan', 'wagon', 'coupe', 'suv_small', 'suv_mid',
  'suv_large', 'crossover', 'muscle', 'sports', 'sports_premium',
  'luxury_entry', 'luxury_mid', 'luxury_full', 'exotic', 'supercar',
  'moto_old_scooter', 'moto_scooter', 'moto_125',
  'moto_naked', 'moto_touring', 'moto_adventure',
  'moto_enduro', 'moto_supersport', 'moto_caferacer', 'moto_superbike',
  'truck_old_pickup', 'truck_pickup', 'truck_van', 'truck_delivery', 'truck_flatbed',
  'truck_box', 'truck_tow', 'truck_semi_light', 'truck_semi', 'truck_heavy',
];

// Each category has 10 image variants x 3 rarities = 30 cards per category
// Total: 40 categories x 10 variants x 3 rarities = 1200 unique cards
export function getCardId(category: VehicleCategory, variant: number, rarity: CardRarity): string {
  return `${category}_${variant}_${rarity}`;
}

export function parseCardId(cardId: string): { category: VehicleCategory; variant: number; rarity: CardRarity } {
  const parts = cardId.split('_');
  const rarity = parts.pop() as CardRarity;
  const variant = parseInt(parts.pop()!);
  const category = parts.join('_') as VehicleCategory;
  return { category, variant, rarity };
}

export function getCardName(category: VehicleCategory, variant: number): string {
  return getVehicleNameByImage(category, variant);
}

export function getTotalUniqueCards(): number {
  return ALL_CARD_CATEGORIES.length * 10 * 3;
}

export function getTotalBaseCards(): number {
  return ALL_CARD_CATEGORIES.length * 10;
}

// Generate cards from a pack opening
export function openPack(pack: PackType): CollectibleCard[] {
  const cards: CollectibleCard[] = [];

  for (let i = 0; i < pack.cardCount; i++) {
    // If last card and pack guarantees reverse, force it
    const forceReverse = pack.guaranteedReverse && i === pack.cardCount - 1 && 
      !cards.some(c => c.rarity !== 'base');

    const category = ALL_CARD_CATEGORIES[Math.floor(Math.random() * ALL_CARD_CATEGORIES.length)];
    const variant = Math.floor(Math.random() * 10) + 1;
    
    let rarity: CardRarity = 'base';
    if (forceReverse) {
      rarity = 'reverse';
    } else {
      const roll = Math.random();
      if (roll < BASE_GOLD_CHANCE * pack.goldMultiplier) {
        rarity = 'gold';
      } else if (roll < (BASE_GOLD_CHANCE * pack.goldMultiplier) + (BASE_REVERSE_CHANCE * pack.reverseMultiplier)) {
        rarity = 'reverse';
      }
    }

    cards.push({
      id: getCardId(category, variant, rarity),
      vehicleCategory: category,
      imageVariant: variant,
      rarity,
      name: getCardName(category, variant),
    });
  }

  return cards;
}

// Collection state
export interface CollectionState {
  ownedCards: Record<string, OwnedCard>; // cardId -> OwnedCard
  totalPacksOpened: number;
}

const COLLECTION_SAVE_KEY = 'car_mechanic_collection';

export function loadCollection(): CollectionState {
  try {
    const saved = localStorage.getItem(COLLECTION_SAVE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load collection:', e);
  }
  return { ownedCards: {}, totalPacksOpened: 0 };
}

export function saveCollection(state: CollectionState) {
  localStorage.setItem(COLLECTION_SAVE_KEY, JSON.stringify(state));
}

export function addCardsToCollection(state: CollectionState, cards: CollectibleCard[]): CollectionState {
  const newState = { ...state, ownedCards: { ...state.ownedCards }, totalPacksOpened: state.totalPacksOpened + 1 };
  for (const card of cards) {
    const existing = newState.ownedCards[card.id];
    if (existing) {
      newState.ownedCards[card.id] = { ...existing, quantity: existing.quantity + 1 };
    } else {
      newState.ownedCards[card.id] = { cardId: card.id, quantity: 1, firstObtained: Date.now() };
    }
  }
  return newState;
}

export function sellDuplicate(state: CollectionState, cardId: string): { newState: CollectionState; value: number } | null {
  const owned = state.ownedCards[cardId];
  if (!owned || owned.quantity <= 1) return null; // Keep at least 1
  
  const { rarity } = parseCardId(cardId);
  const value = CARD_SELL_VALUES[rarity];
  
  const newState = { ...state, ownedCards: { ...state.ownedCards } };
  newState.ownedCards[cardId] = { ...owned, quantity: owned.quantity - 1 };
  
  return { newState, value };
}

// Sell ALL extra copies (qty > 1) at once. Always keeps 1 of each card.
export function sellAllDuplicates(
  state: CollectionState,
): { newState: CollectionState; value: number; count: number } {
  let value = 0;
  let count = 0;
  const newOwned: Record<string, OwnedCard> = { ...state.ownedCards };
  for (const [cardId, owned] of Object.entries(state.ownedCards)) {
    if (owned.quantity > 1) {
      const extras = owned.quantity - 1;
      const { rarity } = parseCardId(cardId);
      value += CARD_SELL_VALUES[rarity] * extras;
      count += extras;
      newOwned[cardId] = { ...owned, quantity: 1 };
    }
  }
  return { newState: { ...state, ownedCards: newOwned }, value, count };
}

/** A vehicle "model" (category + image variant) is completed when the player
 * owns the base, reverse, AND gold card for that variant. */
export function isVehicleCompleted(
  state: CollectionState,
  category: VehicleCategory,
  variant: number,
): boolean {
  return (
    !!state.ownedCards[getCardId(category, variant, 'base')] &&
    !!state.ownedCards[getCardId(category, variant, 'reverse')] &&
    !!state.ownedCards[getCardId(category, variant, 'gold')]
  );
}

export function getCompletedVehiclesCount(state: CollectionState): number {
  let n = 0;
  for (const cat of ALL_CARD_CATEGORIES) {
    for (let v = 1; v <= 10; v++) {
      if (isVehicleCompleted(state, cat, v)) n++;
    }
  }
  return n;
}

/** Discount applied on vehicle purchase price when its model is fully collected. */
export const COLLECTION_COMPLETION_DISCOUNT = 0.15;

export function getCollectionStats(state: CollectionState) {
  const uniqueCards = Object.keys(state.ownedCards).length;
  const totalCards = getTotalUniqueCards();
  const byRarity = { base: 0, reverse: 0, gold: 0 };
  const duplicates: { cardId: string; quantity: number; rarity: CardRarity }[] = [];

  for (const [cardId, owned] of Object.entries(state.ownedCards)) {
    const { rarity } = parseCardId(cardId);
    byRarity[rarity]++;
    if (owned.quantity > 1) {
      duplicates.push({ cardId, quantity: owned.quantity, rarity });
    }
  }

  return { uniqueCards, totalCards, byRarity, duplicates, completionPercent: Math.round((uniqueCards / totalCards) * 100) };
}

export { ALL_CARD_CATEGORIES };
