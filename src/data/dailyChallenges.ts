// Daily Challenge System
export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'sell_cars' | 'earn_profit' | 'repair_parts' | 'diy_repairs' | 'buy_cars';
  target: number;
  reward: number;
  rewardType: 'money' | 'energy' | 'xp';
}

// Challenge templates
const CHALLENGE_TEMPLATES: Omit<DailyChallenge, 'id'>[] = [
  // Sell challenges
  { title: 'Quick Flip', description: 'Sell 1 car today', icon: '🚗', type: 'sell_cars', target: 1, reward: 200, rewardType: 'money' },
  { title: 'Salesman', description: 'Sell 2 cars today', icon: '🏆', type: 'sell_cars', target: 2, reward: 500, rewardType: 'money' },
  { title: 'Car Baron', description: 'Sell 3 cars today', icon: '👑', type: 'sell_cars', target: 3, reward: 1000, rewardType: 'money' },
  
  // Profit challenges
  { title: 'Small Profit', description: 'Earn $500 profit today', icon: '💵', type: 'earn_profit', target: 500, reward: 150, rewardType: 'money' },
  { title: 'Good Day', description: 'Earn $1,000 profit today', icon: '💰', type: 'earn_profit', target: 1000, reward: 300, rewardType: 'money' },
  { title: 'Big Money', description: 'Earn $2,000 profit today', icon: '🤑', type: 'earn_profit', target: 2000, reward: 600, rewardType: 'money' },
  
  // Repair challenges
  { title: 'Fixer Upper', description: 'Repair 3 parts today', icon: '🔧', type: 'repair_parts', target: 3, reward: 20, rewardType: 'energy' },
  { title: 'Mechanic', description: 'Repair 5 parts today', icon: '⚙️', type: 'repair_parts', target: 5, reward: 40, rewardType: 'energy' },
  { title: 'Master Tech', description: 'Repair 10 parts today', icon: '🛠️', type: 'repair_parts', target: 10, reward: 80, rewardType: 'energy' },
  
  // DIY challenges
  { title: 'DIY Novice', description: 'Complete 2 DIY repairs', icon: '✨', type: 'diy_repairs', target: 2, reward: 25, rewardType: 'xp' },
  { title: 'Hands On', description: 'Complete 4 DIY repairs', icon: '🧰', type: 'diy_repairs', target: 4, reward: 50, rewardType: 'xp' },
  
  // Buy challenges
  { title: 'Shopper', description: 'Buy 2 cars today', icon: '📰', type: 'buy_cars', target: 2, reward: 300, rewardType: 'money' },
];

export interface DailyChallengeProgress {
  challengeId: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export interface DailyChallengeState {
  date: string; // YYYY-MM-DD
  challenges: DailyChallenge[];
  progress: DailyChallengeProgress[];
}

// Generate 3 random daily challenges
export function generateDailyChallenges(date: string): DailyChallenge[] {
  // Use date as seed for consistent challenges per day
  const seed = date.split('-').reduce((acc, val) => acc + parseInt(val), 0);
  const shuffled = [...CHALLENGE_TEMPLATES].sort(() => {
    const x = Math.sin(seed * CHALLENGE_TEMPLATES.length) * 10000;
    return x - Math.floor(x) - 0.5;
  });
  
  // Pick 3 challenges of different types
  const types = new Set<string>();
  const selected: DailyChallenge[] = [];
  
  for (const template of shuffled) {
    if (!types.has(template.type) && selected.length < 3) {
      types.add(template.type);
      selected.push({
        ...template,
        id: `${date}_${template.type}_${template.target}`,
      });
    }
  }
  
  return selected;
}

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getInitialDailyChallengeState(): DailyChallengeState {
  const today = getTodayDateString();
  const challenges = generateDailyChallenges(today);
  return {
    date: today,
    challenges,
    progress: challenges.map(c => ({
      challengeId: c.id,
      progress: 0,
      completed: false,
      claimed: false,
    })),
  };
}
