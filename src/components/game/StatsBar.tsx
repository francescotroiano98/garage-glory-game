import { useGame } from '@/contexts/GameContext';
import { Zap, DollarSign, Star, Gauge } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function StatsBar() {
  const { state } = useGame();

  return (
    <div className="bg-card border-b border-border p-3 sticky top-0 z-10">
      <div className="flex items-center justify-between gap-2">
        {/* Money */}
        <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="font-bold text-primary">${state.money.toLocaleString()}</span>
        </div>

        {/* Energy */}
        <div className="flex-1 max-w-32">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium">{state.energy}/{state.maxEnergy}</span>
          </div>
          <Progress 
            value={(state.energy / state.maxEnergy) * 100} 
            className="h-2 bg-secondary"
          />
        </div>

        {/* Reputation */}
        <div className="flex items-center gap-1.5 bg-accent/20 px-3 py-1.5 rounded-full">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-medium text-sm">{state.reputation}</span>
        </div>

        {/* Level */}
        <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
          <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">Lv.{state.level}</span>
        </div>
      </div>
    </div>
  );
}
