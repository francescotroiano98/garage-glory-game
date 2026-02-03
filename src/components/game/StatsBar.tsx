import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Zap, DollarSign, Gift, Trophy, Target, ChevronDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { getXpForLevel } from '@/data/upgrades';
import { MAX_LEVEL } from '@/types/game';
import { useSound } from '@/hooks/useSound';
import { DailyChallengesDialog } from './DailyChallengesDialog';

export function StatsBar() {
  const { 
    state, 
    dispatch, 
    canCollectEnergyBonus, 
    getEnergyBonusTimeRemaining,
    dailyChallenges,
    claimChallengeReward,
  } = useGame();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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
      playSound('energyBonus');
      toast.success('+30 Energy collected!');
    }
  };

  const handleClaimReward = (challengeId: string) => {
    claimChallengeReward(challengeId);
    playSound('achievement');
    toast.success('Reward claimed!');
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const xpForNextLevel = state.level >= MAX_LEVEL ? 0 : getXpForLevel(state.level);
  const xpProgress = state.level >= MAX_LEVEL ? 100 : (state.xp / xpForNextLevel) * 100;
  const unlockedAchievements = state.achievements.filter(a => a.unlocked).length;
  
  // Count claimable challenges
  const claimableChallenges = dailyChallenges.progress.filter(p => p.completed && !p.claimed).length;

  return (
    <>
      <div className="bg-card/95 backdrop-blur-sm border-b-2 border-border p-2 sticky top-0 z-50">
        {/* Compact single row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left side: Money & Energy stacked in column */}
          <div className="flex flex-col gap-1">
            {/* Money */}
            <div className="flex items-center gap-1 bg-primary/15 px-2 py-0.5 rounded-full border border-primary/30">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold text-sm text-primary">${state.money.toLocaleString()}</span>
            </div>

            {/* Energy with recharge button */}
            <div className="flex items-center gap-1 bg-yellow-500/15 px-2 py-0.5 rounded-full border border-yellow-500/30">
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-sm font-bold text-yellow-600">{state.energy}</span>
              <Button
                size="sm"
                variant={canCollectEnergyBonus() ? "default" : "ghost"}
                onClick={handleCollectBonus}
                disabled={!canCollectEnergyBonus()}
                className="h-5 px-1.5 text-[10px] ml-0.5"
              >
                <Gift className="w-3 h-3" />
                {!canCollectEnergyBonus() && <span className="ml-0.5">{formatTime(timeRemaining)}</span>}
              </Button>
            </div>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-1">
            {/* Daily Challenges */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChallenges(true)}
              className="h-8 w-8 p-0 relative"
            >
              <Target className="w-4 h-4 text-accent" />
              {claimableChallenges > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-[9px] rounded-full flex items-center justify-center text-white font-bold">
                  {claimableChallenges}
                </span>
              )}
            </Button>

            {/* Achievements */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAchievements(true)}
              className="h-8 w-8 p-0"
            >
              <Trophy className="w-4 h-4 text-yellow-500" />
            </Button>

            {/* Level with expandable details */}
            <Popover open={showDetails} onOpenChange={setShowDetails}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 text-sm gap-1 border">
                  Lv.{state.level}
                  {state.skillPoints > 0 && (
                    <Badge variant="default" className="h-4 px-1 text-[9px]">+{state.skillPoints}</Badge>
                  )}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3" align="end">
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>XP Progress</span>
                      <span className="font-bold">{state.xp}/{xpForNextLevel || '∞'}</span>
                    </div>
                    <Progress value={xpProgress} className="h-1.5" />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Energy</span>
                    <span className="font-bold">{state.energy}/{state.maxEnergy}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Reputation</span>
                    <span className="font-bold">⭐ {state.reputation}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Skill Points</span>
                    <span className="font-bold text-primary">{state.skillPoints}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
                    <div className="font-semibold text-sm">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground">{achievement.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-primary font-bold">+${achievement.reward}</div>
                    {achievement.unlocked && (
                      <div className="text-xs text-muted-foreground">✓</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Daily Challenges Dialog */}
      <DailyChallengesDialog
        open={showChallenges}
        onOpenChange={setShowChallenges}
        challengeState={dailyChallenges}
        onClaimReward={handleClaimReward}
      />
    </>
  );
}
