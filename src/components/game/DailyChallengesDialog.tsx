import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
 import { DailyChallengeState, DailyChallenge, DailyChallengeProgress } from '@/data/dailyChallenges';
import { Check, Gift, Zap, DollarSign, Star, Package } from 'lucide-react';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { useLanguage } from '@/contexts/LanguageContext';

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
function msUntilNextMidnight(): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}
function msUntilNextMonday(): number {
  const now = new Date();
  const next = new Date(now);
  // ISO Monday = 1 (Sun = 0)
  const day = now.getDay();
  const daysUntilMon = day === 0 ? 1 : (8 - day);
  next.setDate(now.getDate() + daysUntilMon);
  next.setHours(0, 0, 0, 0);
  return next.getTime() - now.getTime();
}

interface DailyChallengesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeState: DailyChallengeState;
  onClaimReward: (challengeId: string) => void;
   onClaimWeeklyReward: (challengeId: string) => void;
}

export function DailyChallengesDialog({
  open,
  onOpenChange,
  challengeState,
  onClaimReward,
   onClaimWeeklyReward,
}: DailyChallengesDialogProps) {
   const { t } = useLanguage();
   const [, tick] = useState(0);
   useEffect(() => {
     if (!open) return;
     const id = setInterval(() => tick(x => x + 1), 1000);
     return () => clearInterval(id);
   }, [open]);

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'money': return <DollarSign className="w-3 h-3" />;
      case 'energy': return <Zap className="w-3 h-3" />;
      case 'xp': return <Star className="w-3 h-3" />;
      case 'pack': return <Package className="w-3 h-3" />;
      default: return <Gift className="w-3 h-3" />;
    }
  };

  const getRewardLabel = (type: string, amount: number, packId?: string) => {
    switch (type) {
      case 'money': return `$${amount}`;
      case 'energy': return `+${amount} ⚡`;
      case 'xp': return `+${amount} XP`;
      case 'pack': return `${amount}× ${packId ? packId.replace('_', ' ') : 'pack'}`;
      default: return `${amount}`;
    }
  };
 
   const renderChallengeCard = (
     challenge: DailyChallenge,
     progressData: DailyChallengeProgress | undefined,
     onClaim: () => void
   ) => {
     const progress = progressData?.progress || 0;
     const completed = progressData?.completed || false;
     const claimed = progressData?.claimed || false;
     const progressPercent = Math.min((progress / challenge.target) * 100, 100);
 
     return (
       <div
         key={challenge.id}
         className={`p-3 rounded-lg border-2 transition-all ${
           claimed
             ? 'bg-muted/50 border-muted opacity-60'
             : completed
               ? 'bg-primary/10 border-primary/50 shadow-sm'
               : 'bg-card border-border'
         }`}
       >
         <div className="flex items-start gap-3">
           <span className="text-2xl">{challenge.icon}</span>
           <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2">
               <span className="font-semibold text-sm">{challenge.title}</span>
               {claimed && (
                 <Badge variant="secondary" className="text-xs">
                   <Check className="w-3 h-3 mr-0.5" />
                   {t.completed}
                 </Badge>
               )}
             </div>
             <p className="text-xs text-muted-foreground">{challenge.description}</p>
             
             <div className="flex items-center gap-2 mt-2">
               <Progress value={progressPercent} className="h-1.5 flex-1" />
               <span className="text-xs font-medium">
                 {progress}/{challenge.target}
               </span>
             </div>
           </div>
 
           <div className="shrink-0">
             {claimed ? (
               <Badge variant="outline" className="text-xs opacity-50">
                 {getRewardIcon(challenge.rewardType)}
                 <span className="ml-1">{getRewardLabel(challenge.rewardType, challenge.reward, challenge.rewardPackId)}</span>
               </Badge>
             ) : completed ? (
               <Button
                 size="sm"
                 onClick={onClaim}
                 className="h-7 text-xs gap-1 animate-pulse"
               >
                 <Gift className="w-3 h-3" />
                 {t.claim}
               </Button>
             ) : (
               <Badge variant="secondary" className="text-xs">
                 {getRewardIcon(challenge.rewardType)}
                 <span className="ml-1">{getRewardLabel(challenge.rewardType, challenge.reward, challenge.rewardPackId)}</span>
               </Badge>
             )}
           </div>
         </div>
       </div>
     );
   };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
             🎯 {t.dailyChallenges}
          </DialogTitle>
        </DialogHeader>

         <Tabs defaultValue="daily" className="w-full">
           <TabsList className="grid w-full grid-cols-2">
             <TabsTrigger value="daily">📅 {t.dailyChallenges}</TabsTrigger>
             <TabsTrigger value="weekly">📆 {t.weeklyChallenges}</TabsTrigger>
           </TabsList>
           
           <TabsContent value="daily" className="space-y-3 mt-3">
             {challengeState.challenges.map((challenge) => {
               const progressData = challengeState.progress.find(p => p.challengeId === challenge.id);
               return renderChallengeCard(challenge, progressData, () => onClaimReward(challenge.id));
             })}
             <p className="text-xs text-center text-muted-foreground">
              {t.resetsIn} {formatCountdown(msUntilNextMidnight())}
             </p>
           </TabsContent>
           
           <TabsContent value="weekly" className="space-y-3 mt-3">
             {challengeState.weeklyChallenges?.map((challenge) => {
               const progressData = challengeState.weeklyProgress?.find(p => p.challengeId === challenge.id);
               return renderChallengeCard(challenge, progressData, () => onClaimWeeklyReward(challenge.id));
             })}
             <p className="text-xs text-center text-muted-foreground">
              {t.resetsIn} {formatCountdown(msUntilNextMonday())}
             </p>
           </TabsContent>
         </Tabs>
      </DialogContent>
    </Dialog>
  );
}
