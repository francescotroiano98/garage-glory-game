import { Achievement, AchievementId, GameState } from '@/types/game';

export const ACHIEVEMENTS: Achievement[] = [
  // Sales milestones
  { id: 'first_sale', name: 'First Sale', description: 'Sell your first car', icon: '🚗', reward: 100, unlocked: false },
  { id: 'cars_sold_10', name: 'Salesperson', description: 'Sell 10 cars', icon: '🏆', reward: 500, unlocked: false },
  { id: 'cars_sold_50', name: 'Master Dealer', description: 'Sell 50 cars', icon: '👑', reward: 2000, unlocked: false },
  { id: 'cars_sold_100', name: 'Legend', description: 'Sell 100 cars', icon: '⭐', reward: 5000, unlocked: false },
  
  // Profit milestones
  { id: 'profit_1k', name: 'First Thousand', description: 'Earn $1,000 total profit', icon: '💵', reward: 200, unlocked: false },
  { id: 'profit_10k', name: 'Profit King', description: 'Earn $10,000 total profit', icon: '💰', reward: 1000, unlocked: false },
  { id: 'profit_100k', name: 'Tycoon', description: 'Earn $100,000 total profit', icon: '🤑', reward: 5000, unlocked: false },
  
  // Level milestones
  { id: 'level_5', name: 'Apprentice', description: 'Reach level 5', icon: '🔧', reward: 300, unlocked: false },
  { id: 'level_10', name: 'Expert', description: 'Reach level 10', icon: '⚙️', reward: 1000, unlocked: false },
  { id: 'level_20', name: 'Grand Master', description: 'Reach level 20', icon: '🎓', reward: 5000, unlocked: false },
  
  // Special achievements
  { id: 'perfect_flip', name: 'Perfect Flip', description: 'Sell a car with 100%+ profit margin', icon: '🎯', reward: 500, unlocked: false },
  { id: 'diy_master', name: 'DIY Master', description: 'Successfully complete 50 DIY repairs', icon: '🛠️', reward: 500, unlocked: false },
  { id: 'negotiator', name: 'Silver Tongue', description: 'Save $5,000 through negotiations', icon: '🗣️', reward: 500, unlocked: false },
  { id: 'luxury_dealer', name: 'Luxury Dealer', description: 'Sell a luxury car', icon: '💎', reward: 1000, unlocked: false },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Sell a sports car with 50%+ profit', icon: '🏎️', reward: 800, unlocked: false },
  { id: 'collector', name: 'Collector', description: 'Have 5 cars in garage at once', icon: '🏠', reward: 500, unlocked: false },
];

export function checkAchievements(state: GameState, context?: {
  carCategory?: string;
  profitMargin?: number;
  diySuccessCount?: number;
  negotiationSavings?: number;
}): AchievementId[] {
  const newlyUnlocked: AchievementId[] = [];
  
  const check = (id: AchievementId, condition: boolean) => {
    const achievement = state.achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked && condition) {
      newlyUnlocked.push(id);
    }
  };
  
  // Sales milestones
  check('first_sale', state.totalCarsSold >= 1);
  check('cars_sold_10', state.totalCarsSold >= 10);
  check('cars_sold_50', state.totalCarsSold >= 50);
  check('cars_sold_100', state.totalCarsSold >= 100);
  
  // Profit milestones
  check('profit_1k', state.totalProfit >= 1000);
  check('profit_10k', state.totalProfit >= 10000);
  check('profit_100k', state.totalProfit >= 100000);
  
  // Level milestones
  check('level_5', state.level >= 5);
  check('level_10', state.level >= 10);
  check('level_20', state.level >= 20);
  
  // Special achievements
  if (context?.profitMargin !== undefined && context.profitMargin >= 100) {
    check('perfect_flip', true);
  }
  
  if (context?.carCategory === 'luxury') {
    check('luxury_dealer', true);
  }
  
  if (context?.carCategory === 'sports' && context?.profitMargin && context.profitMargin >= 50) {
    check('speed_demon', true);
  }
  
  check('collector', state.carsInGarage.length >= 5);
  
  return newlyUnlocked;
}

export function getInitialAchievements(): Achievement[] {
  return ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }));
}
