import { Customer } from '@/types/game';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { CUSTOMER_PERSONALITIES, getPatienceRounds } from '@/data/customers';

interface CustomerCardProps {
  customer: Customer;
  offerPrice: number;
  onAccept: () => void;
  onCounter: () => void;
  onReject: () => void;
  isNegotiating?: boolean;
  negotiationRound?: number;
}

const patienceColors: Record<Customer['patience'], string> = {
  very_low: 'bg-red-500/20 text-red-700 dark:text-red-400',
  low: 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
  medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  high: 'bg-green-500/20 text-green-700 dark:text-green-400',
  very_high: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
};

export function CustomerCard({
  customer,
  offerPrice,
  onAccept,
  onCounter,
  onReject,
  isNegotiating = false,
  negotiationRound = 0,
}: CustomerCardProps) {
  const personalityInfo = CUSTOMER_PERSONALITIES[customer.personality];
  const maxRounds = getPatienceRounds(customer.patience);
  const roundsLeft = maxRounds - negotiationRound;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/20 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-3xl">
            {customer.avatar}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{customer.name}</h3>
            <p className="text-xs text-muted-foreground">{personalityInfo.name}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="secondary" className={`text-xs ${patienceColors[customer.patience]}`}>
                Patience: {customer.patience.replace('_', ' ')}
              </Badge>
              {negotiationRound > 0 && (
                <Badge variant="outline" className="text-xs">
                  {roundsLeft} round{roundsLeft !== 1 ? 's' : ''} left
                </Badge>
              )}
              {(customer.patience === 'very_low' || customer.patience === 'low') && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  ⚠️ May leave early!
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Customer traits */}
        <div className="flex flex-wrap gap-1 mb-3">
          {customer.traits.map((trait, i) => (
            <span key={i} className="text-xs bg-secondary/50 px-2 py-0.5 rounded">
              {trait}
            </span>
          ))}
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground mb-1">
            {isNegotiating ? 'Counter offer:' : 'Interested in buying for:'}
          </p>
          <p className="text-3xl font-bold text-primary">
            ${offerPrice.toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onReject}>
            Decline
          </Button>
          <Button 
            variant="secondary" 
            className="flex-1" 
            onClick={onCounter}
            disabled={roundsLeft <= 0}
          >
            Counter
            <span className="ml-1 text-xs flex items-center">
              (<Zap className="w-3 h-3" />2)
            </span>
          </Button>
          <Button className="flex-1" onClick={onAccept}>
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
