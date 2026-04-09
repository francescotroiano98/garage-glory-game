import { ReactNode } from 'react';
import { Home, Briefcase, ShoppingBag, Trophy, Album } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';

type Screen = 'garage' | 'office' | 'collection' | 'shop' | 'leaderboard' | 'settings';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const { state } = useGame();
  const { t } = useLanguage();
  
  const pendingCalls = state.activeSales.filter(s => s.customer).length;

  const navItems: { id: Screen; icon: ReactNode; label: string; badge?: number }[] = [
    { id: 'garage', icon: <Home className="w-5 h-5" />, label: t.garage },
    { id: 'office', icon: <Briefcase className="w-5 h-5" />, label: t.theOffice, badge: pendingCalls > 0 ? pendingCalls : undefined },
    { id: 'collection', icon: <Album className="w-5 h-5" />, label: t.collection },
    { id: 'shop', icon: <ShoppingBag className="w-5 h-5" />, label: t.shop },
    { id: 'leaderboard', icon: <Trophy className="w-5 h-5" />, label: t.leaderboard },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            data-tutorial-id={`tutorial-nav-${item.id}`}
            onClick={() => onNavigate(item.id)}
            className={cn(
              'flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg transition-colors min-w-12 relative',
              currentScreen === item.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

export type { Screen };
