import { ReactNode } from 'react';
import { Home, Newspaper, Settings, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

type Screen = 'garage' | 'newspaper' | 'shop' | 'settings';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems: { id: Screen; icon: ReactNode; label: string }[] = [
  { id: 'garage', icon: <Home className="w-5 h-5" />, label: 'Garage' },
  { id: 'newspaper', icon: <Newspaper className="w-5 h-5" />, label: 'Ads' },
  { id: 'shop', icon: <ShoppingBag className="w-5 h-5" />, label: 'Shop' },
  { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
];

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              'flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-colors min-w-16',
              currentScreen === item.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export type { Screen };
