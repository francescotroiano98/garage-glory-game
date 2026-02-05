import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
 import { DailyChallengeState, DailyChallenge, DailyChallengeProgress } from '@/data/dailyChallenges';
import { Check, Gift, Zap, DollarSign, Star } from 'lucide-react';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { useLanguage } from '@/contexts/LanguageContext';

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
   
  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'money': return <DollarSign className="w-3 h-3" />;
      case 'energy': return <Zap className="w-3 h-3" />;
      case 'xp': return <Star className="w-3 h-3" />;
      default: return <Gift className="w-3 h-3" />;
    }
  };

  const getRewardLabel = (type: string, amount: number) => {
    switch (type) {
      case 'money': return `$${amount}`;
      case 'energy': return `+${amount} ⚡`;
      case 'xp': return `+${amount} XP`;
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
                 <span className="ml-1">{getRewardLabel(challenge.rewardType, challenge.reward)}</span>
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
                 <span className="ml-1">{getRewardLabel(challenge.rewardType, challenge.reward)}</span>
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
               Challenges reset daily at midnight
             </p>
           </TabsContent>
           
           <TabsContent value="weekly" className="space-y-3 mt-3">
             {challengeState.weeklyChallenges?.map((challenge) => {
               const progressData = challengeState.weeklyProgress?.find(p => p.challengeId === challenge.id);
               return renderChallengeCard(challenge, progressData, () => onClaimWeeklyReward(challenge.id));
             })}
             <p className="text-xs text-center text-muted-foreground">
               {t.resetsMonday}
             </p>
           </TabsContent>
         </Tabs>
      </DialogContent>
    </Dialog>
  );
}
