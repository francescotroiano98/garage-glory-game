import { ReactNode } from 'react';
import { Home, Briefcase, Settings, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';

type Screen = 'garage' | 'office' | 'shop' | 'settings';

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
    { id: 'office', icon: <Briefcase className="w-5 h-5" />, label: t.theOffice, badge: pendingCalls },
    { id: 'shop', icon: <ShoppingBag className="w-5 h-5" />, label: t.shop },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: t.settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              'flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-colors min-w-16 relative',
              currentScreen === item.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
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
