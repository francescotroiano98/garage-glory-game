import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Zap, DollarSign, Star, Gauge, Gift, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getXpForLevel } from '@/data/upgrades';
import { MAX_LEVEL } from '@/types/game';
import { useSound } from '@/hooks/useSound';

export function StatsBar() {
  const { state, dispatch, canCollectEnergyBonus, getEnergyBonusTimeRemaining } = useGame();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const { playSound } = useSound();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getEnergyBonusTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [getEnergyBonusTimeRemaining]);

  const handleCollectBonus = () => {
    if (canCollectEnergyBonus()) {
      dispatch({ type: 'COLLECT_ENERGY_BONUS' });
      playSound('purchase');
      toast.success('+30 Energy collected!');
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const xpForNextLevel = state.level >= MAX_LEVEL ? 0 : getXpForLevel(state.level);
  const xpProgress = state.level >= MAX_LEVEL ? 100 : (state.xp / xpForNextLevel) * 100;
  const unlockedAchievements = state.achievements.filter(a => a.unlocked).length;

  return (
    <>
      <div className="bg-card/95 backdrop-blur-sm border-b-2 border-border p-3 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-2">
          {/* Money */}
          <div className="flex items-center gap-1.5 bg-primary/15 px-3 py-1.5 rounded-full border-2 border-primary/20">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-bold text-primary">${state.money.toLocaleString()}</span>
          </div>

          {/* Energy with Bonus Button */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-bold">{state.energy}/{state.maxEnergy}</span>
              </div>
              <Progress 
                value={(state.energy / state.maxEnergy) * 100} 
                className="h-2 w-20 bg-secondary border border-border"
              />
            </div>
            <Button
              size="sm"
              variant={canCollectEnergyBonus() ? "default" : "outline"}
              onClick={handleCollectBonus}
              disabled={!canCollectEnergyBonus()}
              className="h-8 px-2 text-xs"
            >
              <Gift className="w-3 h-3 mr-1" />
              {canCollectEnergyBonus() ? '+30' : formatTime(timeRemaining)}
            </Button>
          </div>

          {/* Achievements */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAchievements(true)}
            className="h-8 px-2"
          >
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="ml-1 text-xs">{unlockedAchievements}</span>
          </Button>

          {/* Level with XP */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 bg-secondary px-2 py-0.5 rounded-md border-2 border-border">
              <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-bold">Lv.{state.level}</span>
              {state.skillPoints > 0 && (
                <span className="text-xs text-primary font-bold">+{state.skillPoints}</span>
              )}
            </div>
            <Progress value={xpProgress} className="h-1 w-12 mt-0.5" />
          </div>
        </div>
      </div>

      {/* Achievements Dialog */}
      <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Achievements ({unlockedAchievements}/{state.achievements.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {state.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border-2 ${
                  achievement.unlocked 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-secondary/50 border-border opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground">{achievement.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-primary font-bold">+${achievement.reward}</div>
                    {achievement.unlocked && (
                      <div className="text-xs text-muted-foreground">✓ Unlocked</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
