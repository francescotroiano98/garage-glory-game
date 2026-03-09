import { Customer, CustomerPersonality, CarCategory, VehicleCategory } from '@/types/game';

// 20 Customer personality definitions
export const CUSTOMER_PERSONALITIES: Record<CustomerPersonality, {
  name: string;
  patienceRange: ['very_low' | 'low' | 'medium' | 'high' | 'very_high', 'very_low' | 'low' | 'medium' | 'high' | 'very_high'];
  bargainSkillRange: [number, number];
  trustRange: [number, number];
  budgetMultiplier: [number, number];
  traits: string[];
  preferredCategories?: CarCategory[];
}> = {
  bargain_hunter: {
    name: 'Bargain Hunter',
    patienceRange: ['high', 'very_high'],
    bargainSkillRange: [7, 10],
    trustRange: [3, 6],
    budgetMultiplier: [0.7, 0.9],
    traits: ['💰 Loves deals', '🔍 Checks everything'],
  },
  impulse_buyer: {
    name: 'Impulse Buyer',
    patienceRange: ['very_low', 'low'],
    bargainSkillRange: [1, 4],
    trustRange: [6, 9],
    budgetMultiplier: [1.0, 1.3],
    traits: ['⚡ Decides quickly', '💸 Pays well'],
  },
  skeptic: {
    name: 'Skeptic',
    patienceRange: ['medium', 'high'],
    bargainSkillRange: [5, 8],
    trustRange: [1, 4],
    budgetMultiplier: [0.8, 1.0],
    traits: ['🤔 Questions everything', '🔬 Very thorough'],
  },
  enthusiast: {
    name: 'Car Enthusiast',
    patienceRange: ['high', 'very_high'],
    bargainSkillRange: [4, 7],
    trustRange: [5, 8],
    budgetMultiplier: [1.0, 1.2],
    traits: ['🚗 Loves cars', '🔧 Knows mechanics'],
    preferredCategories: ['sports', 'sports_premium', 'exotic'],
  },
  businessman: {
    name: 'Businessman',
    patienceRange: ['very_low', 'low'],
    bargainSkillRange: [6, 9],
    trustRange: [4, 7],
    budgetMultiplier: [0.9, 1.1],
    traits: ['⏰ Values time', '📊 Negotiates hard'],
    preferredCategories: ['sedan', 'luxury_entry', 'luxury_mid'],
  },
  first_timer: {
    name: 'First-time Buyer',
    patienceRange: ['medium', 'high'],
    bargainSkillRange: [1, 3],
    trustRange: [7, 10],
    budgetMultiplier: [0.9, 1.1],
    traits: ['😊 Trusting', '❓ Asks many questions'],
  },
  collector: {
    name: 'Collector',
    patienceRange: ['high', 'very_high'],
    bargainSkillRange: [5, 8],
    trustRange: [4, 7],
    budgetMultiplier: [1.1, 1.4],
    traits: ['🏆 Seeks quality', '💎 Pays premium'],
    preferredCategories: ['sports_premium', 'exotic', 'supercar'],
  },
  commuter: {
    name: 'Daily Commuter',
    patienceRange: ['medium', 'medium'],
    bargainSkillRange: [3, 6],
    trustRange: [5, 8],
    budgetMultiplier: [0.85, 1.0],
    traits: ['🚶 Practical', '⛽ Fuel-conscious'],
    preferredCategories: ['economy', 'sedan'],
  },
  family_person: {
    name: 'Family Person',
    patienceRange: ['medium', 'high'],
    bargainSkillRange: [4, 7],
    trustRange: [5, 8],
    budgetMultiplier: [0.9, 1.1],
    traits: ['👨‍👩‍👧 Needs space', '🛡️ Safety first'],
    preferredCategories: ['suv_mid', 'suv_large', 'sedan', 'crossover'],
  },
  student: {
    name: 'Student',
    patienceRange: ['low', 'medium'],
    bargainSkillRange: [2, 5],
    trustRange: [6, 9],
    budgetMultiplier: [0.6, 0.8],
    traits: ['📚 On a budget', '🎓 Eager'],
    preferredCategories: ['economy'],
  },
  retiree: {
    name: 'Retiree',
    patienceRange: ['very_high', 'very_high'],
    bargainSkillRange: [5, 8],
    trustRange: [4, 7],
    budgetMultiplier: [0.85, 1.0],
    traits: ['🕐 Takes time', '📖 Experienced'],
    preferredCategories: ['sedan', 'suv_mid', 'crossover'],
  },
  flipper: {
    name: 'Car Flipper',
    patienceRange: ['low', 'medium'],
    bargainSkillRange: [8, 10],
    trustRange: [2, 5],
    budgetMultiplier: [0.6, 0.8],
    traits: ['💹 Profit-focused', '🧮 Calculates margins'],
  },
  mechanic: {
    name: 'Mechanic',
    patienceRange: ['medium', 'high'],
    bargainSkillRange: [6, 9],
    trustRange: [3, 6],
    budgetMultiplier: [0.7, 0.9],
    traits: ['🔧 Spots issues', '🛠️ Knows repairs'],
  },
  impatient: {
    name: 'Impatient Buyer',
    patienceRange: ['very_low', 'very_low'],
    bargainSkillRange: [2, 5],
    trustRange: [5, 8],
    budgetMultiplier: [1.0, 1.2],
    traits: ['⚡ No time to waste', '💵 Quick decisions'],
  },
  patient: {
    name: 'Patient Buyer',
    patienceRange: ['very_high', 'very_high'],
    bargainSkillRange: [6, 9],
    trustRange: [5, 8],
    budgetMultiplier: [0.8, 1.0],
    traits: ['🕰️ Will wait', '🎯 Knows what they want'],
  },
  rich: {
    name: 'Wealthy Buyer',
    patienceRange: ['low', 'medium'],
    bargainSkillRange: [2, 5],
    trustRange: [5, 8],
    budgetMultiplier: [1.2, 1.5],
    traits: ['💎 Money is no object', '✨ Wants the best'],
    preferredCategories: ['luxury_mid', 'luxury_full', 'exotic', 'supercar'],
  },
  budget: {
    name: 'Budget Buyer',
    patienceRange: ['high', 'very_high'],
    bargainSkillRange: [7, 10],
    trustRange: [4, 7],
    budgetMultiplier: [0.5, 0.75],
    traits: ['💰 Tight budget', '🔍 Price-focused'],
    preferredCategories: ['economy'],
  },
  suspicious: {
    name: 'Suspicious Buyer',
    patienceRange: ['medium', 'high'],
    bargainSkillRange: [6, 9],
    trustRange: [1, 3],
    budgetMultiplier: [0.75, 0.9],
    traits: ['🕵️ Distrustful', '❌ Hard to convince'],
  },
  friendly: {
    name: 'Friendly Buyer',
    patienceRange: ['high', 'very_high'],
    bargainSkillRange: [2, 5],
    trustRange: [8, 10],
    budgetMultiplier: [0.95, 1.15],
    traits: ['😄 Easy-going', '🤝 Fair dealer'],
  },
  expert: {
    name: 'Industry Expert',
    patienceRange: ['medium', 'high'],
    bargainSkillRange: [8, 10],
    trustRange: [3, 6],
    budgetMultiplier: [0.85, 1.0],
    traits: ['📊 Knows market', '🎓 Industry veteran'],
  },
};

export const CUSTOMER_NAMES = [
  'John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Williams',
  'Michael Brown', 'Emily Davis', 'James Miller', 'Jennifer Wilson',
  'Robert Moore', 'Lisa Taylor', 'William Anderson', 'Elizabeth Thomas',
  'Christopher Jackson', 'Amanda White', 'Daniel Harris', 'Michelle Martin',
  'Matthew Thompson', 'Jessica Robinson', 'Anthony Clark', 'Stephanie Lewis',
  'Mark Walker', 'Nicole Hall', 'Steven Allen', 'Rachel Young',
  'Paul King', 'Laura Wright', 'Andrew Scott', 'Kimberly Green',
  'Joshua Baker', 'Angela Adams', 'Kevin Nelson', 'Melissa Hill',
];

export const CUSTOMER_AVATARS = [
  '👨', '👩', '🧔', '👱‍♀️', '👨‍🦰', '👩‍🦱', '🧑', '👴', '👵', '🧑‍🦳',
  '👨‍🦱', '👩‍🦰', '🧑‍🦰', '👱', '👨‍🦳', '👩‍🦳', '🧓', '👤', '🧑‍💼', '👨‍💼',
];

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCustomer(askingPrice: number, carCategory?: CarCategory): Customer {
  const personalities = Object.keys(CUSTOMER_PERSONALITIES) as CustomerPersonality[];
  
  // Weight personalities based on car category if provided
  let weightedPersonalities = personalities;
  if (carCategory) {
    weightedPersonalities = personalities.filter(p => {
      const pref = CUSTOMER_PERSONALITIES[p].preferredCategories;
      return !pref || pref.includes(carCategory);
    });
    // Add some randomness - 30% chance to get any personality
    if (Math.random() < 0.3 || weightedPersonalities.length === 0) {
      weightedPersonalities = personalities;
    }
  }

  const personality = pickRandom(weightedPersonalities);
  const config = CUSTOMER_PERSONALITIES[personality];
  
  const patienceOptions = ['very_low', 'low', 'medium', 'high', 'very_high'] as const;
  const minPatIdx = patienceOptions.indexOf(config.patienceRange[0]);
  const maxPatIdx = patienceOptions.indexOf(config.patienceRange[1]);
  const patIdx = minPatIdx + Math.floor(Math.random() * (maxPatIdx - minPatIdx + 1));
  
  const budgetMult = randomInRange(config.budgetMultiplier[0], config.budgetMultiplier[1]);
  
  return {
    id: `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: pickRandom(CUSTOMER_NAMES),
    avatar: pickRandom(CUSTOMER_AVATARS),
    personality,
    patience: patienceOptions[patIdx],
    maxBudget: Math.round(askingPrice * budgetMult),
    preferredCategory: carCategory,
    bargainSkill: Math.round(randomInRange(config.bargainSkillRange[0], config.bargainSkillRange[1])),
    trustLevel: Math.round(randomInRange(config.trustRange[0], config.trustRange[1])),
    traits: config.traits,
  };
}

// Calculate initial offer based on customer personality
export function calculateCustomerOffer(customer: Customer, askingPrice: number): number {
  const baseOffer = customer.maxBudget;
  
  // Adjust based on bargain skill (higher skill = lower initial offer)
  const bargainFactor = 1 - (customer.bargainSkill - 1) * 0.03; // 3% less per skill point
  
  // Adjust based on trust (higher trust = closer to asking)
  const trustFactor = 0.85 + (customer.trustLevel - 1) * 0.015; // 1.5% more per trust point
  
  const offer = Math.min(baseOffer, askingPrice * bargainFactor * trustFactor);
  return Math.round(Math.max(offer, askingPrice * 0.5)); // Never less than 50%
}

// Get patience in rounds before leaving
export function getPatienceRounds(patience: Customer['patience']): number {
  const rounds: Record<Customer['patience'], number> = {
    very_low: 1,
    low: 2,
    medium: 3,
    high: 4,
    very_high: 5,
  };
  return rounds[patience];
}
