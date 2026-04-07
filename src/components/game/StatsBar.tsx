import { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Zap, DollarSign, Gift, Trophy, Target, Star, ChevronDown, Euro, PoundSterling, PlayCircle, Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getXpForLevel } from '@/data/upgrades';
import { MAX_LEVEL } from '@/types/game';
import { useSound } from '@/hooks/useSound';
import { useAdMob } from '@/hooks/useAdMob';
import { DailyChallengesDialog } from './DailyChallengesDialog';
import { toast } from 'sonner';

const AD_ENERGY_REWARD = 50;
const AD_WATCH_DURATION = 5000; // 5 seconds simulated ad (web fallback)
const AD_COOLDOWN = 120000; // 2 minutes between ads

export function StatsBar() {
  const { 
    state, 
    dispatch, 
    canCollectEnergyBonus, 
    getEnergyBonusTimeRemaining,
    dailyChallenges,
    claimChallengeReward,
    claimWeeklyChallengeReward,
  } = useGame();
  const { t, formatMoney, currency } = useLanguage();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [lastAdWatch, setLastAdWatch] = useState(0);
  const { playSound } = useSound();
  const { isNative, isShowingAd, showRewardedAd, prepareRewardedAd } = useAdMob();
  // Preload rewarded ad on native
  useEffect(() => {
    if (isNative) {
      prepareRewardedAd();
    }
  }, [isNative, prepareRewardedAd]);

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
    }
  };

  const handleClaimReward = (challengeId: string) => {
    claimChallengeReward(challengeId);
    playSound('achievement');
  };

  const handleClaimWeeklyReward = (challengeId: string) => {
    claimWeeklyChallengeReward(challengeId);
    playSound('achievement');
  };

  const canWatchAd = useCallback(() => {
    if (isWatchingAd || isShowingAd) return false;
    const now = Date.now();
    if (now - lastAdWatch < AD_COOLDOWN) return false;
    // Available when energy < 100 OR as alternative to the 10min bonus timer
    return state.energy < 100 || !canCollectEnergyBonus();
  }, [isWatchingAd, isShowingAd, lastAdWatch, state.energy, canCollectEnergyBonus]);

  const getAdCooldownRemaining = useCallback(() => {
    const now = Date.now();
    const remaining = AD_COOLDOWN - (now - lastAdWatch);
    return remaining > 0 ? remaining : 0;
  }, [lastAdWatch]);

  const handleWatchAd = async () => {
    if (!canWatchAd()) return;
    playSound('buttonClick');

    if (isNative) {
      // Use real AdMob rewarded ad
      const rewarded = await showRewardedAd();
      if (rewarded) {
        dispatch({ type: 'SET_ENERGY', payload: state.energy + AD_ENERGY_REWARD });
        setLastAdWatch(Date.now());
        playSound('energyBonus');
        toast.success(`⚡ +${AD_ENERGY_REWARD} ${t.adEnergyReward}`);
      }
    } else {
      // Simulated ad for web preview
      setIsWatchingAd(true);
      setTimeout(() => {
        dispatch({ type: 'SET_ENERGY', payload: state.energy + AD_ENERGY_REWARD });
        setIsWatchingAd(false);
        setLastAdWatch(Date.now());
        playSound('energyBonus');
        toast.success(`⚡ +${AD_ENERGY_REWARD} ${t.adEnergyReward}`);
      }, AD_WATCH_DURATION);
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
  
  const claimableChallenges = dailyChallenges.progress.filter(p => p.completed && !p.claimed).length;
  const claimableWeeklyChallenges = (dailyChallenges.weeklyProgress || []).filter(p => p.completed && !p.claimed).length;

  const showAdButton = state.energy < 100 || !canCollectEnergyBonus();
  const adCooldown = getAdCooldownRemaining();

  return (
    <>
      <div className="flex flex-col gap-1.5 bg-card/95 backdrop-blur-sm border-b-2 border-border p-3 sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-1.5">
            <div className="flex flex-row gap-1.5">
              <Button
                  size="sm"
                  variant={canCollectEnergyBonus() ? "default" : "secondary"}
                  onClick={handleCollectBonus}
                  disabled={!canCollectEnergyBonus()}
                  className="h-7 px-2 text-xs"
                >
                  <Gift className="w-3.5 h-3.5 mr-1" />
                  {canCollectEnergyBonus() ? '+30' : formatTime(timeRemaining)}
                </Button>
                {showAdButton && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleWatchAd}
                    disabled={!canWatchAd() || isWatchingAd || isShowingAd}
                    className="h-7 px-2 text-xs border-accent text-accent hover:bg-accent/10"
                  >
                    <PlayCircle className="w-3.5 h-3.5 mr-1" />
                    {isWatchingAd || isShowingAd ? '...' : adCooldown > 0 ? formatTime(adCooldown) : `+${AD_ENERGY_REWARD}`}
                </Button>
              )}
            </div>  
            <div className="flex items-center gap-1.5 bg-yellow-500/15 px-2.5 py-1 rounded-lg border border-yellow-500/30">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-bold text-yellow-600 min-w-[40px]">{state.energy}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          {/* Left side: Money & Energy in column */}
          <div className="flex flex-col gap-1.5">
            {/* Money */}
            <div className="flex items-center gap-1.5 bg-primary/15 px-2.5 py-1 rounded-lg border border-primary/30">
              {currency === 'EUR' ? <Euro className="w-4 h-4 text-primary" /> : currency === 'GBP' ? <PoundSterling className="w-4 h-4 text-primary" /> : <DollarSign className="w-4 h-4 text-primary" />}
              <span className="font-bold text-sm text-primary min-w-[60px]">{formatMoney(state.money)}</span>
            </div>          
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChallenges(true)}
              className="h-8 w-8 p-0 relative"
            >
              <Target className="w-4 h-4 text-accent" />
              {(claimableChallenges + claimableWeeklyChallenges) > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-[9px] rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                  {claimableChallenges + claimableWeeklyChallenges}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAchievements(true)}
              className="h-8 w-8 p-0"
            >
              <Trophy className="w-4 h-4 text-yellow-500" />
            </Button>

            <Popover open={showDetails} onOpenChange={setShowDetails}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2.5 text-sm gap-1.5 border-2">
                  <Star className="w-3.5 h-3.5 text-primary" />
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
                      <span>{t.xpProgress}</span>
                      <span className="font-bold">{state.xp}/{xpForNextLevel || '∞'}</span>
                    </div>
                    <Progress value={xpProgress} className="h-1.5" />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>{t.energy}</span>
                    <span className="font-bold">{state.energy}/{state.maxEnergy}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>{t.reputation}</span>
                    <span className="font-bold">⭐ {state.reputation}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>{t.skillPoints}</span>
                    <span className="font-bold text-primary">{state.skillPoints}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              {t.achievements} ({unlockedAchievements}/{state.achievements.length})
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

      <DailyChallengesDialog
        open={showChallenges}
        onOpenChange={setShowChallenges}
        challengeState={dailyChallenges}
        onClaimReward={handleClaimReward}
        onClaimWeeklyReward={handleClaimWeeklyReward}
      />
    </>
  );
}
