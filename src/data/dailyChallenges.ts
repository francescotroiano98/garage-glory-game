// Daily Challenge System
export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type:
    | 'sell_cars' | 'earn_profit' | 'repair_parts' | 'diy_repairs' | 'buy_cars'
    | 'open_packs' | 'obtain_new_cards' | 'sell_card_duplicates'
    | 'obtain_rare_cards' | 'complete_vehicles';
  target: number;
  reward: number;
  rewardType: 'money' | 'energy' | 'xp' | 'pack';
  /** When rewardType === 'pack', id of the pack from PACK_TYPES */
  rewardPackId?: string;
   isWeekly?: boolean;
}

// Daily challenge templates
const DAILY_CHALLENGE_TEMPLATES: Omit<DailyChallenge, 'id'>[] = [
  // Sell challenges
  { title: 'Quick Flip', description: 'Sell 1 car today', icon: '🚗', type: 'sell_cars', target: 1, reward: 200, rewardType: 'money' },
  { title: 'Salesman', description: 'Sell 2 cars today', icon: '🏆', type: 'sell_cars', target: 2, reward: 500, rewardType: 'money' },
  { title: 'Car Baron', description: 'Sell 3 cars today', icon: '👑', type: 'sell_cars', target: 3, reward: 1000, rewardType: 'money' },
   { title: 'Hot Seller', description: 'Sell 4 cars today', icon: '🔥', type: 'sell_cars', target: 4, reward: 1500, rewardType: 'money' },
  
  // Profit challenges
  { title: 'Small Profit', description: 'Earn $500 profit today', icon: '💵', type: 'earn_profit', target: 500, reward: 150, rewardType: 'money' },
  { title: 'Good Day', description: 'Earn $1,000 profit today', icon: '💰', type: 'earn_profit', target: 1000, reward: 300, rewardType: 'money' },
  { title: 'Big Money', description: 'Earn $2,000 profit today', icon: '🤑', type: 'earn_profit', target: 2000, reward: 600, rewardType: 'money' },
   { title: 'Jackpot', description: 'Earn $3,500 profit today', icon: '💎', type: 'earn_profit', target: 3500, reward: 1000, rewardType: 'money' },
  
  // Repair challenges
  { title: 'Fixer Upper', description: 'Repair 3 parts today', icon: '🔧', type: 'repair_parts', target: 3, reward: 20, rewardType: 'energy' },
  { title: 'Mechanic', description: 'Repair 5 parts today', icon: '⚙️', type: 'repair_parts', target: 5, reward: 40, rewardType: 'energy' },
  { title: 'Master Tech', description: 'Repair 10 parts today', icon: '🛠️', type: 'repair_parts', target: 10, reward: 80, rewardType: 'energy' },
   { title: 'Repair Pro', description: 'Repair 15 parts today', icon: '🏅', type: 'repair_parts', target: 15, reward: 120, rewardType: 'energy' },
  
  // DIY challenges
  { title: 'DIY Novice', description: 'Complete 2 DIY repairs', icon: '✨', type: 'diy_repairs', target: 2, reward: 25, rewardType: 'xp' },
  { title: 'Hands On', description: 'Complete 4 DIY repairs', icon: '🧰', type: 'diy_repairs', target: 4, reward: 50, rewardType: 'xp' },
   { title: 'DIY Master', description: 'Complete 6 DIY repairs', icon: '🎓', type: 'diy_repairs', target: 6, reward: 80, rewardType: 'xp' },
  
  // Buy challenges
  { title: 'Shopper', description: 'Buy 2 cars today', icon: '📰', type: 'buy_cars', target: 2, reward: 300, rewardType: 'money' },
   { title: 'Collector', description: 'Buy 3 cars today', icon: '🎯', type: 'buy_cars', target: 3, reward: 500, rewardType: 'money' },

  // Card / Collection daily challenges
  { title: 'Pack Opener', description: 'Open 1 card pack', icon: '📦', type: 'open_packs', target: 1, reward: 200, rewardType: 'money' },
  { title: 'Pack Hunter', description: 'Open 3 card packs', icon: '🎁', type: 'open_packs', target: 3, reward: 800, rewardType: 'money' },
  { title: 'New Finds', description: 'Get 3 new cards', icon: '🆕', type: 'obtain_new_cards', target: 3, reward: 30, rewardType: 'xp' },
  { title: 'Card Sweep', description: 'Sell 5 duplicate cards', icon: '♻️', type: 'sell_card_duplicates', target: 5, reward: 250, rewardType: 'money' },
  { title: 'Rare Pull', description: 'Get 1 Reverse or Gold card', icon: '✨', type: 'obtain_rare_cards', target: 1, reward: 50, rewardType: 'xp' },

  // Pack-reward daily challenges
  { title: 'Daily Hustle', description: 'Sell 2 cars to win a Base Pack', icon: '🎁', type: 'sell_cars', target: 2, reward: 1, rewardType: 'pack', rewardPackId: 'base' },
  { title: 'Profit Pack', description: 'Earn $1,500 profit to win a Base Pack', icon: '🎁', type: 'earn_profit', target: 1500, reward: 1, rewardType: 'pack', rewardPackId: 'base' },
  { title: 'Wrench Reward', description: 'Repair 8 parts to win a Base Pack', icon: '🎁', type: 'repair_parts', target: 8, reward: 1, rewardType: 'pack', rewardPackId: 'base' },
  { title: 'Lucky Shopper', description: 'Buy 3 cars to win a Premium Pack', icon: '🎁', type: 'buy_cars', target: 3, reward: 1, rewardType: 'pack', rewardPackId: 'premium' },
  { title: 'Card Streak', description: 'Get 5 new cards to win a Base Pack', icon: '🎁', type: 'obtain_new_cards', target: 5, reward: 1, rewardType: 'pack', rewardPackId: 'base' },
];
 
 // Weekly challenge templates (harder, bigger rewards)
 const WEEKLY_CHALLENGE_TEMPLATES: Omit<DailyChallenge, 'id'>[] = [
   { title: 'Weekly Tycoon', description: 'Sell 10 cars this week', icon: '🏛️', type: 'sell_cars', target: 10, reward: 3000, rewardType: 'money', isWeekly: true },
   { title: 'Fortune Week', description: 'Earn $10,000 profit this week', icon: '💰', type: 'earn_profit', target: 10000, reward: 2500, rewardType: 'money', isWeekly: true },
   { title: 'Repair Marathon', description: 'Repair 40 parts this week', icon: '🔩', type: 'repair_parts', target: 40, reward: 200, rewardType: 'energy', isWeekly: true },
   { title: 'DIY Champion', description: 'Complete 15 DIY repairs this week', icon: '🏆', type: 'diy_repairs', target: 15, reward: 150, rewardType: 'xp', isWeekly: true },
   { title: 'Market Hunter', description: 'Buy 8 cars this week', icon: '📰', type: 'buy_cars', target: 8, reward: 1500, rewardType: 'money', isWeekly: true },
   { title: 'Collector\'s Week', description: 'Open 10 card packs this week', icon: '📦', type: 'open_packs', target: 10, reward: 2000, rewardType: 'money', isWeekly: true },
   { title: 'Set Builder', description: 'Complete 1 vehicle (base+reverse+gold)', icon: '🏆', type: 'complete_vehicles', target: 1, reward: 3000, rewardType: 'money', isWeekly: true },
   { title: 'Master Collector', description: 'Complete 3 vehicles this week', icon: '👑', type: 'complete_vehicles', target: 3, reward: 8000, rewardType: 'money', isWeekly: true },
   { title: 'Rare Hunter', description: 'Get 5 Reverse/Gold cards this week', icon: '💎', type: 'obtain_rare_cards', target: 5, reward: 250, rewardType: 'xp', isWeekly: true },

   // Pack-reward weekly challenges
   { title: 'Weekly Bonus Pack', description: 'Sell 8 cars to win a Premium Pack', icon: '🎁', type: 'sell_cars', target: 8, reward: 1, rewardType: 'pack', rewardPackId: 'premium', isWeekly: true },
   { title: 'Legendary Effort', description: 'Earn $15,000 profit to win a Legendary Pack', icon: '🎁', type: 'earn_profit', target: 15000, reward: 1, rewardType: 'pack', rewardPackId: 'legendary', isWeekly: true },
   { title: 'MEGA Mechanic', description: 'Repair 60 parts to win a MEGA Base Pack', icon: '🎁', type: 'repair_parts', target: 60, reward: 1, rewardType: 'pack', rewardPackId: 'mega_base', isWeekly: true },
   { title: 'Pack Frenzy', description: 'Open 15 packs to win a MEGA Premium Pack', icon: '🎁', type: 'open_packs', target: 15, reward: 1, rewardType: 'pack', rewardPackId: 'mega_premium', isWeekly: true },
   { title: 'Card Master', description: 'Complete 2 vehicles to win a MEGA Gold Pack', icon: '🎁', type: 'complete_vehicles', target: 2, reward: 1, rewardType: 'pack', rewardPackId: 'mega_gold', isWeekly: true },
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
   weekStartDate: string;
   weeklyChallenges: DailyChallenge[];
   weeklyProgress: DailyChallengeProgress[];
}

// Generate 3 random daily challenges
export function generateDailyChallenges(date: string): DailyChallenge[] {
  // Use date as seed for consistent challenges per day
  const seed = date.split('-').reduce((acc, val) => acc + parseInt(val), 0);
  const shuffled = [...DAILY_CHALLENGE_TEMPLATES].sort(() => {
    const x = Math.sin(seed * DAILY_CHALLENGE_TEMPLATES.length) * 10000;
    return x - Math.floor(x) - 0.5;
  });
  
  // Pick 4 challenges of different types
  const types = new Set<string>();
  const selected: DailyChallenge[] = [];
  
  for (const template of shuffled) {
    if (!types.has(template.type) && selected.length < 4) {
      types.add(template.type);
      selected.push({
        ...template,
        id: `${date}_${template.type}_${template.target}`,
      });
    }
  }
  
  return selected;
}
 
 // Generate weekly challenges (2 challenges)
 export function generateWeeklyChallenges(weekStart: string): DailyChallenge[] {
   const seed = weekStart.split('-').reduce((acc, val) => acc + parseInt(val), 0);
   const shuffled = [...WEEKLY_CHALLENGE_TEMPLATES].sort(() => {
     const x = Math.sin(seed * WEEKLY_CHALLENGE_TEMPLATES.length) * 10000;
     return x - Math.floor(x) - 0.5;
   });
   
   const types = new Set<string>();
   const selected: DailyChallenge[] = [];
   
   for (const template of shuffled) {
     if (!types.has(template.type) && selected.length < 3) {
       types.add(template.type);
       selected.push({
         ...template,
         id: `week_${weekStart}_${template.type}_${template.target}`,
       });
     }
   }
   
   return selected;
 }

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
 
 export function getWeekStartDateString(): string {
   const now = new Date();
   const dayOfWeek = now.getDay();
   const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
   const monday = new Date(now.setDate(diff));
   return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
 }

export function getInitialDailyChallengeState(): DailyChallengeState {
  const today = getTodayDateString();
   const weekStart = getWeekStartDateString();
  const challenges = generateDailyChallenges(today);
   const weeklyChallenges = generateWeeklyChallenges(weekStart);
  return {
    date: today,
    challenges,
    progress: challenges.map(c => ({
      challengeId: c.id,
      progress: 0,
      completed: false,
      claimed: false,
    })),
     weekStartDate: weekStart,
     weeklyChallenges,
     weeklyProgress: weeklyChallenges.map(c => ({
       challengeId: c.id,
       progress: 0,
       completed: false,
       claimed: false,
     })),
  };
}
