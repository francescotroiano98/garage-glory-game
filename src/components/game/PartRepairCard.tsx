import { PartDamage } from '@/types/game';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Check, AlertTriangle, Clock, Wrench, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import { PART_ICONS } from '@/data/parts';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { getPartName, getDamageLevelName } from '@/utils/partTranslations';

interface PartRepairCardProps {
  damage: PartDamage;
  onRepair: () => void;
  onDiyRepair: () => void;
  canRepair: boolean;
  canDiy: boolean;
  isRepairing: boolean;
  repairProgress: number;
  energyMultiplier: number;
  diySuccessChance: number;
}

const levelColors: Record<string, string> = {
  minor: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  moderate: 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30',
  major: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
  critical: 'bg-red-600/30 text-red-800 dark:text-red-300 border-red-600/50',
};

export function PartRepairCard({
  damage,
  onRepair,
  onDiyRepair,
  canRepair,
  canDiy,
  isRepairing,
  repairProgress,
  energyMultiplier,
  diySuccessChance,
}: PartRepairCardProps) {
   const { t } = useLanguage();
  const actualEnergyCost = Math.round(damage.energyCost * energyMultiplier);
  const diyEnergyCost = Math.round(actualEnergyCost * 0.5);
  const [displayProgress, setDisplayProgress] = useState(repairProgress);
  const animationRef = useRef<number>();
  
  const partIcon = PART_ICONS[damage.part] || '🔧';

  // Smooth animation using requestAnimationFrame
  useEffect(() => {
    if (isRepairing) {
      const animate = () => {
        setDisplayProgress(prev => {
          const diff = repairProgress - prev;
          if (Math.abs(diff) < 0.1) return repairProgress;
          return prev + diff * 0.15;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      setDisplayProgress(repairProgress);
    }
  }, [isRepairing, repairProgress]);

  if (damage.repaired) {
    return (
       <motion.div
         initial={{ scale: 0.96, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         transition={{ type: 'spring', stiffness: 320, damping: 18 }}
         className="flex items-center gap-3 p-3 bg-card/95 backdrop-blur-sm rounded-lg border-2 border-primary/50 shadow-glow-success/0 animate-bounce-success"
       >
        <span className="text-xl">{partIcon}</span>
        <div className="flex-1">
          <span className="font-medium text-primary">
            {getPartName(damage.part, t as unknown as Record<string, string>)}
          </span>
        </div>
        <Check className="w-5 h-5 text-primary" />
      </motion.div>
    );
  }

  return (
    <div className={cn(
      'flex flex-col gap-2 p-3 rounded-lg border-2 bg-card/95 backdrop-blur-sm transition-shadow',
      isRepairing ? 'border-accent shadow-industrial-lg' : 'border-border shadow-industrial'
    )}>
      <div className="flex items-center gap-3">
        <span className={cn("text-2xl inline-block", isRepairing && "animate-wrench-spin origin-center")}>{partIcon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold truncate">
              {getPartName(damage.part, t as unknown as Record<string, string>)}
            </span>
            <Badge variant="outline" className={cn('text-xs', levelColors[damage.level])}>
              {getDamageLevelName(damage.level, t as unknown as Record<string, string>)}
            </Badge>
            {!damage.visible && (
              <span title="Hidden damage">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              {actualEnergyCost}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-primary" />
              {damage.moneyCost}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {damage.repairTime}s
            </span>
            <span className="text-primary font-semibold">
              +${Math.round(damage.valueImpact)}
            </span>
          </div>
          {damage.diyAttempts && damage.diyAttempts > 0 && (
            <div className="text-xs text-destructive mt-0.5">
              {t.failedDiyAttempts}: {damage.diyAttempts}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <Button
            size="sm"
            onClick={onRepair}
            disabled={!canRepair}
            className="text-xs"
          >
            {isRepairing ? t.working : `$${damage.moneyCost}`}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDiyRepair}
            disabled={!canDiy}
            className="text-xs"
            title={`${t.diy}: ${Math.round(diySuccessChance)}%`}
          >
            <Wrench className="w-3 h-3 mr-1" />
            {t.diy} {Math.round(diySuccessChance)}%
          </Button>
        </div>
      </div>

      {isRepairing && (
        <Progress value={displayProgress} className="h-2 transition-none" />
      )}
    </div>
  );
}
