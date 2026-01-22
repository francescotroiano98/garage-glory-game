import { Customer } from '@/types/game';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CustomerCardProps {
  customer: Customer;
  offerPrice: number;
  onAccept: () => void;
  onCounter: () => void;
  onReject: () => void;
  isNegotiating?: boolean;
}

export function CustomerCard({
  customer,
  offerPrice,
  onAccept,
  onCounter,
  onReject,
  isNegotiating = false,
}: CustomerCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/20 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-3xl">
            {customer.avatar}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{customer.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Patience: {customer.patience}
              </Badge>
            </div>
          </div>
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
          <Button variant="secondary" className="flex-1" onClick={onCounter}>
            Counter
          </Button>
          <Button className="flex-1" onClick={onAccept}>
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
