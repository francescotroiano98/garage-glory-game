import { useState } from 'react';
import { Car } from '@/types/game';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CarCardProps {
  car: Car;
  onClick?: () => void;
  showPrice?: boolean;
  showDamages?: boolean;
  visibilityChance?: number;
  compact?: boolean;
  actionButton?: React.ReactNode;
  topBadge?: React.ReactNode;
}

const categoryColors: Record<string, string> = {
  economy: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
  sedan: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
  suv: 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30',
  sports: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
  luxury: 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30',
  moto: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/30',
  truck: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30',
};

function getCategoryColorKey(category: string): string {
  if (category.startsWith('moto_')) return 'moto';
  if (category.startsWith('truck_')) return 'truck';
  if (['junker','beater','economy','compact','hatchback'].includes(category)) return 'economy';
  if (['sedan','wagon','coupe'].includes(category)) return 'sedan';
  if (['suv_small','suv_mid','suv_large','crossover'].includes(category)) return 'suv';
  if (['muscle','sports','sports_premium','exotic'].includes(category)) return 'sports';
  if (['luxury_entry','luxury_mid','luxury_full','supercar'].includes(category)) return 'luxury';
  return 'economy';
}

function getVehicleIcon(vehicleType?: string): string {
  if (vehicleType === 'motorcycle') return '🏍️';
  if (vehicleType === 'truck') return '🚛';
  return '🚗';
}

export function CarCard({
  car,
  onClick,
  showPrice = true,
  showDamages = true,
  visibilityChance = 0,
  compact = false,
  actionButton,
  topBadge,
}: CarCardProps) {
  const [showIssuesDialog, setShowIssuesDialog] = useState(false);
  
  const visibleDamages = car.damages.filter(d => !d.repaired && (d.visible || Math.random() < visibilityChance));
  const unrepaired = car.damages.filter(d => !d.repaired).length;
  const repaired = car.damages.filter(d => d.repaired).length;
  const allRepaired = unrepaired === 0;

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowIssuesDialog(true);
  };

  return (
    <>
      <Card
        className={cn(
          'relative border-2 bg-card/95 backdrop-blur-sm',
          onClick && 'cursor-pointer active:scale-[0.99]',
          compact ? 'p-2' : ''
        )}
        onClick={onClick}
      >
        {topBadge && (
          <div className="absolute top-2 left-2 z-10">
            {topBadge}
          </div>
        )}

        {actionButton && (
          <div className="absolute top-2 right-2 z-10">
            {actionButton}
          </div>
        )}

        <CardContent className={cn('p-4', compact && 'p-2', (actionButton || topBadge) && 'pt-12')}>
          <div className="flex items-center gap-3">
            {/* Car Image - use car.image directly which is set at generation time */}
            <div className={cn(
              'flex items-center justify-center rounded-lg overflow-hidden shrink-0',
              compact ? 'w-14 h-14' : 'w-20 h-20'
            )}>
              <img 
                src={car.image} 
                alt={car.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={cn('font-bold truncate', compact ? 'text-sm' : 'text-base')}>
                  {car.name}
                </h3>
                <Badge variant="outline" className={cn('text-xs shrink-0 border', categoryColors[getCategoryColorKey(car.category)])}>
                  {getVehicleIcon(car.vehicleType)} {car.category.replace('moto_', '').replace('truck_', '').replace(/_/g, ' ')}
                </Badge>
              </div>

              {showPrice && (
                <div className="flex items-center gap-2">
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

              {showDamages && (
                <div className="flex items-center gap-2 mt-1">
                  {allRepaired ? (
                    <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700 dark:text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready to sell
                    </Badge>
                  ) : (
                    <>
                      <Badge variant="secondary" className="text-xs">
                        {repaired}/{repaired + unrepaired} fixed
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={handleInfoClick}
                      >
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showIssuesDialog} onOpenChange={setShowIssuesDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              {car.name} - Issues
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {visibleDamages.length > 0 ? (
              visibleDamages.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg border border-destructive/20">
                  <span className="text-sm capitalize">{d.part.replace('_', ' ')}</span>
                  <Badge variant="outline" className="text-xs border-destructive/30 text-destructive">
                    {d.level}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No visible issues detected
              </p>
            )}
            {unrepaired > visibleDamages.length && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                + {unrepaired - visibleDamages.length} hidden issue(s)
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
