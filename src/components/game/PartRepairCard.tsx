import { PartDamage } from '@/types/game';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Check, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface PartRepairCardProps {
  damage: PartDamage;
  onRepair: () => void;
  canRepair: boolean;
  isRepairing: boolean;
  repairProgress: number;
  energyMultiplier: number;
}

const levelColors: Record<string, string> = {
  minor: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  moderate: 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30',
  major: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
  critical: 'bg-red-600/30 text-red-800 dark:text-red-300 border-red-600/50',
};

const categoryIcons: Record<string, string> = {
  mechanical: '⚙️',
  body: '🔧',
  tires: '🛞',
  interior: '🪑',
};

export function PartRepairCard({
  damage,
  onRepair,
  canRepair,
  isRepairing,
  repairProgress,
  energyMultiplier,
}: PartRepairCardProps) {
  const actualEnergyCost = Math.round(damage.energyCost * energyMultiplier);
  const [displayProgress, setDisplayProgress] = useState(repairProgress);

  // Animate progress smoothly
  useEffect(() => {
    if (isRepairing) {
      const interval = setInterval(() => {
        setDisplayProgress(prev => {
          const diff = repairProgress - prev;
          return prev + diff * 0.3;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setDisplayProgress(repairProgress);
    }
  }, [isRepairing, repairProgress]);

  if (damage.repaired) {
    return (
      <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border-2 border-primary/30">
        <span className="text-xl">{categoryIcons[damage.category]}</span>
        <div className="flex-1">
          <span className="font-medium capitalize text-primary">
            {damage.part.replace('_', ' ')}
          </span>
        </div>
        <Check className="w-5 h-5 text-primary" />
      </div>
    );
  }

  return (
    <div className={cn(
      'flex flex-col gap-2 p-3 rounded-lg border-2 transition-all',
      isRepairing ? 'bg-accent/20 border-accent shadow-md' : 'bg-card border-border'
    )}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{categoryIcons[damage.category]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold capitalize truncate">
              {damage.part.replace('_', ' ')}
            </span>
            <Badge variant="outline" className={cn('text-xs capitalize', levelColors[damage.level])}>
              {damage.level}
            </Badge>
            {!damage.visible && (
              <span title="Hidden damage">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              {actualEnergyCost}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {damage.repairTime}s
            </span>
            <span className="text-primary font-semibold">
              +${Math.round(damage.valueImpact)}
            </span>
          </div>
        </div>
        <Button
          size="sm"
          onClick={onRepair}
          disabled={!canRepair}
          className="shrink-0 retro-button"
        >
          {isRepairing ? 'In Progress' : 'Repair'}
        </Button>
      </div>

      {isRepairing && (
        <Progress value={displayProgress} className="h-2" />
      )}
    </div>
  );
}
