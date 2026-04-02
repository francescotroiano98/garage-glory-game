import { Car } from '@/types/game';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORY_DISPLAY_NAMES, VEHICLE_NAME_IT } from '@/utils/partTranslations';

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
  car, onClick, showPrice = true, showDamages = true,
  compact = false, actionButton, topBadge,
}: CarCardProps) {
  const { language, t, formatMoney } = useLanguage();
  
  const unrepaired = car.damages.filter(d => !d.repaired).length;
  const repaired = car.damages.filter(d => d.repaired).length;
  const allRepaired = unrepaired === 0;

  const displayName = language === 'it' ? (VEHICLE_NAME_IT[car.name] || car.name) : car.name;
  const categoryName = CATEGORY_DISPLAY_NAMES[language]?.[car.category] || car.category;

  return (
    <Card
      className={cn(
        'relative border-2 bg-card/95 backdrop-blur-sm',
        onClick && 'cursor-pointer active:scale-[0.99]',
        compact ? 'p-2' : ''
      )}
      onClick={onClick}
    >
      {actionButton && <div className="absolute top-2 right-2 z-10">{actionButton}</div>}

      <CardContent className={cn('p-4', compact && 'p-2', actionButton && 'pt-12')}>
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {topBadge && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                {topBadge}
              </div>
            )}
            <div className={cn('flex items-center justify-center rounded-lg overflow-hidden', compact ? 'w-14 h-14' : 'w-20 h-20', topBadge && 'mt-5')}>
              <img src={car.image} alt={displayName} className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn('font-bold', compact ? 'text-sm' : 'text-base')}>
                {displayName}
              </h3>
            </div>
            <Badge variant="outline" className={cn('text-xs shrink-0 border mb-1', categoryColors[getCategoryColorKey(car.category)])}>
              {getVehicleIcon(car.vehicleType)} {categoryName}
            </Badge>

            {showPrice && (
              <div className="flex items-center gap-2">
                <span className={cn('font-bold text-primary', compact ? 'text-sm' : 'text-lg')}>
                  {formatMoney(car.askingPrice)}
                </span>
                {car.purchased && (
                  <span className="text-xs text-muted-foreground">
                    {t.value}: {formatMoney(Math.round(car.currentValue))}
                  </span>
                )}
              </div>
            )}

            {showDamages && (
              <div className="flex items-center gap-2 mt-1">
                {allRepaired ? (
                  <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700 dark:text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {t.readyToSellBadge}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    {repaired}/{repaired + unrepaired} {t.fixed}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
