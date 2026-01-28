// Tutorial System
export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight?: string; // CSS selector to highlight
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Garage Glory!',
    description: 'Build your car flipping empire! Buy damaged cars, repair them, and sell for profit.',
    icon: '🏁',
  },
  {
    id: 'money_energy',
    title: 'Resources',
    description: 'You have Money 💵 to buy cars and parts, and Energy ⚡ for repairs. Energy recharges over time, or collect bonus every 10 minutes!',
    icon: '📊',
  },
  {
    id: 'buy_cars',
    title: 'Buy Cars',
    description: 'Go to Newspaper Ads 📰 to find cars for sale. Look for hidden damage - some issues are not visible until you buy!',
    icon: '🚗',
  },
  {
    id: 'repair',
    title: 'Repair Damage',
    description: 'Tap a car in your Garage to see its damage. Repair parts using Pro Repair (guaranteed) or DIY (cheaper but risky).',
    icon: '🔧',
  },
  {
    id: 'diy',
    title: 'DIY Repairs',
    description: 'DIY is cheaper but may fail! Your Skills increase success rate. Failed repairs waste energy but you can retry.',
    icon: '🛠️',
  },
  {
    id: 'sell',
    title: 'Sell for Profit',
    description: 'Once fully repaired, list your car for sale. A customer will arrive with an offer. Negotiate for better prices!',
    icon: '💰',
  },
  {
    id: 'upgrades',
    title: 'Upgrade & Grow',
    description: 'Visit the Shop 🛒 to upgrade tools, skills, and garage capacity. Better tools = faster repairs!',
    icon: '📈',
  },
  {
    id: 'challenges',
    title: 'Daily Challenges',
    description: 'Complete daily challenges for bonus rewards! Check the 🎯 icon for todays tasks.',
    icon: '🎯',
  },
  {
    id: 'ready',
    title: "You're Ready!",
    description: 'Start with the Newspaper Ads to buy your first car. Good luck, mechanic!',
    icon: '🎉',
  },
];
