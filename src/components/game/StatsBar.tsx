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
import { PackOpeningAnimation } from './PackOpeningAnimation';
import {
  PACK_TYPES,
  openPack,
  loadCollection,
  saveCollection,
  addCardsToCollection,
  getCompletedVehiclesCount,
  CollectibleCard,
} from '@/data/cards';
import { toast } from 'sonner';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';

const AD_ENERGY_REWARD = 50;
const AD_WATCH_DURATION = 5000; // 5 seconds simulated ad (web fallback)
const AD_COOLDOWN = 120000; // 2 minutes between ads

// Money safety-net bonus: when the player runs out of money (< $10), grant a
// small $30 top-up on a 10-minute cooldown. Mirrors the energy gift bonus UX.
const MONEY_BONUS_AMOUNT = 30;
const MONEY_BONUS_COOLDOWN = 10 * 60 * 1000;
const MONEY_BONUS_KEY = 'money_bonus_last_v1';
const MONEY_BONUS_THRESHOLD = 10;

export function StatsBar({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const { 
    state, 
    dispatch, 
    canCollectEnergyBonus, 
    getEnergyBonusTimeRemaining,
    dailyChallenges,
    claimChallengeReward,
    claimWeeklyChallengeReward,
    updateChallengeProgress,
  } = useGame();
  const { t, formatMoney, currency } = useLanguage();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [lastAdWatch, setLastAdWatch] = useState(0);
  const [lastMoneyBonus, setLastMoneyBonus] = useState<number>(() => {
    try { return parseInt(localStorage.getItem(MONEY_BONUS_KEY) || '0', 10) || 0; } catch { return 0; }
  });
  const [moneyBonusTick, setMoneyBonusTick] = useState(0);
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
      setMoneyBonusTick(x => x + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [getEnergyBonusTimeRemaining]);

  const handleCollectBonus = () => {
    if (canCollectEnergyBonus()) {
      dispatch({ type: 'COLLECT_ENERGY_BONUS' });
      playSound('energyBonus');
    }
  };

  const moneyBonusRemaining = Math.max(0, MONEY_BONUS_COOLDOWN - (Date.now() - lastMoneyBonus));
  const canCollectMoneyBonus = state.money < MONEY_BONUS_THRESHOLD && moneyBonusRemaining === 0;
  const showMoneyBonus = state.money < MONEY_BONUS_THRESHOLD;
  const handleCollectMoneyBonus = () => {
    if (!canCollectMoneyBonus) return;
    dispatch({ type: 'ADD_MONEY', payload: MONEY_BONUS_AMOUNT });
    const now = Date.now();
    setLastMoneyBonus(now);
    try { localStorage.setItem(MONEY_BONUS_KEY, String(now)); } catch {}
    playSound('energyBonus');
  };

  const [openedCards, setOpenedCards] = useState<CollectibleCard[] | null>(null);
  const [openedPackIcon, setOpenedPackIcon] = useState<string>('📦');
  const [openedPackImage, setOpenedPackImage] = useState<string | undefined>(undefined);

  const openPackReward = useCallback((packId: string) => {
    const pack = PACK_TYPES.find(p => p.id === packId);
    if (!pack) return;
    // The claim has already dispatched GIVE_PACK; immediately consume + animate.
    dispatch({ type: 'CONSUME_PACK', payload: { packId } });
    const cards = openPack(pack, state.level);
    const collection = loadCollection();
    const ownedBefore = collection.ownedCards;
    const newCards = cards.filter(c => !ownedBefore[c.id]).length;
    const rareCards = cards.filter(c => c.rarity !== 'base').length;
    const completedBefore = getCompletedVehiclesCount(collection);
    const newCollection = addCardsToCollection(collection, cards);
    const completedAfter = getCompletedVehiclesCount(newCollection);
    saveCollection(newCollection);
    setOpenedPackIcon(pack.icon);
    setOpenedPackImage(pack.image);
    setOpenedCards(cards);
    updateChallengeProgress('open_packs', 1);
    if (newCards > 0) updateChallengeProgress('obtain_new_cards', newCards);
    if (rareCards > 0) updateChallengeProgress('obtain_rare_cards', rareCards);
    const newlyCompleted = completedAfter - completedBefore;
    if (newlyCompleted > 0) updateChallengeProgress('complete_vehicles', newlyCompleted);
  }, [dispatch, state.level, updateChallengeProgress]);

  const handleClaimReward = (challengeId: string) => {
    const challenge = dailyChallenges.challenges.find(c => c.id === challengeId);
    const granted = claimChallengeReward(challengeId);
    if (!granted) return;
    playSound('achievement');
    if (challenge?.rewardType === 'pack' && challenge.rewardPackId) {
      setShowChallenges(false);
      // Slight delay so the dialog finishes closing before the animation overlay opens
      setTimeout(() => openPackReward(challenge.rewardPackId!), 200);
    }
  };

  const handleClaimWeeklyReward = (challengeId: string) => {
    const challenge = dailyChallenges.weeklyChallenges?.find(c => c.id === challengeId);
    const granted = claimWeeklyChallengeReward(challengeId);
    if (!granted) return;
    playSound('achievement');
    if (challenge?.rewardType === 'pack' && challenge.rewardPackId) {
      setShowChallenges(false);
      setTimeout(() => openPackReward(challenge.rewardPackId!), 200);
    }
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

  // Bounce + glow when money increases (sale reward)
  const prevMoneyRef = useRef(state.money);
  const [moneyPulse, setMoneyPulse] = useState(false);
  const { trigger: hapticTrigger } = useHaptics();
  useEffect(() => {
    const delta = state.money - prevMoneyRef.current;
    if (delta > 0) {
      setMoneyPulse(true);
      // Strong haptic only on big rewards (sales)
      if (delta >= 500) hapticTrigger('success');
      const t = setTimeout(() => setMoneyPulse(false), 600);
      return () => clearTimeout(t);
    }
    prevMoneyRef.current = state.money;
  }, [state.money]);
  useEffect(() => { prevMoneyRef.current = state.money; }, [state.money]);

  return (
    <>
      <div data-tutorial-id="tutorial-stats-bar" className="flex flex-col gap-1.5 bg-card/95 backdrop-blur-sm border-b-2 border-border p-3 sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Energy chip with inline gift bonus */}
          <div className="flex items-center gap-1 bg-yellow-500/15 pl-2 pr-1 py-0.5 rounded-lg border border-yellow-500/30">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-bold text-yellow-600 min-w-[28px]">{state.energy}</span>
            <Button
              size="sm"
              variant={canCollectEnergyBonus() ? 'default' : 'ghost'}
              onClick={handleCollectBonus}
              disabled={!canCollectEnergyBonus()}
              className="h-6 px-1.5 text-[10px] gap-0.5"
              aria-label="Collect energy bonus"
            >
              <Gift className="w-3 h-3" />
              {canCollectEnergyBonus() ? '+30' : formatTime(timeRemaining)}
            </Button>
          </div>

          {/* Money chip (single currency icon, with optional +30 rescue) */}
          <div className={cn(
            "flex items-center gap-1 bg-primary/15 pl-2 pr-1 py-0.5 rounded-lg border border-primary/30 transition-shadow",
            moneyPulse && "animate-bounce-success shadow-glow-success"
          )}>
            <AnimatedCounter value={state.money} className="font-bold text-sm text-primary min-w-[52px]" />
            {showMoneyBonus && (
              <Button
                size="sm"
                variant={canCollectMoneyBonus ? 'default' : 'ghost'}
                onClick={handleCollectMoneyBonus}
                disabled={!canCollectMoneyBonus}
                className="h-6 px-1.5 text-[10px] gap-0.5"
                aria-label="Collect money bonus"
              >
                <Gift className="w-3 h-3" />
                {canCollectMoneyBonus ? `+${MONEY_BONUS_AMOUNT}` : formatTime(moneyBonusRemaining)}
              </Button>
            )}
          </div>

          {showAdButton && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleWatchAd}
              disabled={!canWatchAd() || isWatchingAd || isShowingAd}
              className="h-7 px-1.5 text-[11px] border-accent text-accent hover:bg-accent/10 gap-0.5"
              aria-label="Watch rewarded ad"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              {isWatchingAd || isShowingAd ? '...' : adCooldown > 0 ? formatTime(adCooldown) : `+${AD_ENERGY_REWARD}`}
            </Button>
          )}

          <div className="flex items-center gap-0.5 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChallenges(true)}
              className="h-7 w-7 p-0 relative"
              aria-label="Open daily and weekly challenges"
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
              className="h-7 w-7 p-0"
              aria-label="Open achievements"
            >
              <Trophy className="w-4 h-4 text-yellow-500" />
            </Button>

            <Popover open={showDetails} onOpenChange={setShowDetails}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs gap-1 border-2">
                  <Star className="w-3 h-3 text-primary" />
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

            {onOpenSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenSettings}
                className="h-7 w-7 p-0"
                aria-label="Open settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
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

      {/* Pack opening animation for rewards claimed from the challenge dialog */}
      <PackOpeningAnimation
        cards={openedCards}
        packIcon={openedPackIcon}
        packImage={openedPackImage}
        onClose={() => setOpenedCards(null)}
      />
    </>
  );
}
