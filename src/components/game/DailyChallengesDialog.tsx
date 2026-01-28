import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DailyChallengeState } from '@/data/dailyChallenges';
import { Check, Gift, Zap, DollarSign, Star } from 'lucide-react';

interface DailyChallengesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeState: DailyChallengeState;
  onClaimReward: (challengeId: string) => void;
}

export function DailyChallengesDialog({
  open,
  onOpenChange,
  challengeState,
  onClaimReward,
}: DailyChallengesDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎯 Daily Challenges
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {challengeState.challenges.map((challenge) => {
            const progressData = challengeState.progress.find(p => p.challengeId === challenge.id);
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
                          Done
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
                        onClick={() => onClaimReward(challenge.id)}
                        className="h-7 text-xs gap-1 animate-pulse"
                      >
                        <Gift className="w-3 h-3" />
                        Claim
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
          })}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Challenges reset daily at midnight
        </p>
      </DialogContent>
    </Dialog>
  );
}
