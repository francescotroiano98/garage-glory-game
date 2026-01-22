import { Car } from '@/types/game';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CarCardProps {
  car: Car;
  onClick?: () => void;
  showPrice?: boolean;
  showDamages?: boolean;
  visibilityChance?: number;
  compact?: boolean;
}

const categoryColors: Record<string, string> = {
  economy: 'bg-green-500/20 text-green-700 dark:text-green-400',
  sedan: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  suv: 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
  sports: 'bg-red-500/20 text-red-700 dark:text-red-400',
  luxury: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
};

export function CarCard({
  car,
  onClick,
  showPrice = true,
  showDamages = true,
  visibilityChance = 0,
  compact = false,
}: CarCardProps) {
  const visibleDamages = car.damages.filter(d => !d.repaired && (d.visible || Math.random() < visibilityChance));
  const unrepaired = car.damages.filter(d => !d.repaired).length;
  const repaired = car.damages.filter(d => d.repaired).length;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]',
        compact ? 'p-2' : ''
      )}
      onClick={onClick}
    >
      <CardContent className={cn('p-4', compact && 'p-2')}>
        <div className="flex items-center gap-3">
          {/* Car Icon */}
          <div className={cn(
            'flex items-center justify-center bg-secondary rounded-lg',
            compact ? 'w-12 h-12 text-2xl' : 'w-16 h-16 text-4xl'
          )}>
            {car.image}
          </div>

          {/* Car Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn('font-semibold truncate', compact ? 'text-sm' : 'text-base')}>
                {car.name}
              </h3>
              <Badge variant="secondary" className={cn('text-xs shrink-0', categoryColors[car.category])}>
                {car.category}
              </Badge>
            </div>

            {showDamages && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {visibleDamages.length > 0 ? (
                  <span className="text-destructive">
                    {visibleDamages.length} visible issue{visibleDamages.length !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-muted-foreground">No visible issues</span>
                )}
                {car.purchased && (
                  <span className="text-primary">
                    {repaired}/{repaired + unrepaired} fixed
                  </span>
                )}
              </div>
            )}

            {showPrice && (
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('font-bold text-primary', compact ? 'text-sm' : 'text-lg')}>
                  ${car.askingPrice.toLocaleString()}
                </span>
                {car.purchased && (
                  <span className="text-xs text-muted-foreground">
                    Value: ${Math.round(car.currentValue).toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Visible Damages Preview */}
        {showDamages && visibleDamages.length > 0 && !compact && (
          <div className="mt-3 flex flex-wrap gap-1">
            {visibleDamages.slice(0, 4).map((d, i) => (
              <Badge key={i} variant="outline" className="text-xs capitalize bg-destructive/10 text-destructive border-destructive/30">
                {d.part.replace('_', ' ')} ({d.level})
              </Badge>
            ))}
            {visibleDamages.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{visibleDamages.length - 4} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
