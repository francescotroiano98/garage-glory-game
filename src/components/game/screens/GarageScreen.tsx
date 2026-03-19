import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CarCard } from '@/components/game/CarCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Car as CarIcon, Wrench, Loader2, DollarSign, Tag, Briefcase } from 'lucide-react';
import garageBg from '@/assets/garage-bg.jpg';

interface GarageScreenProps {
  onNavigateToOffice: () => void;
  onSelectCar: (carId: string) => void;
}

export function GarageScreen({ onNavigateToOffice, onSelectCar }: GarageScreenProps) {
  const { state } = useGame();
  const { t, formatMoney } = useLanguage();
  const { carsInGarage, garageUpgrades, repairQueue } = state;
  const emptySlots = garageUpgrades.carBays - carsInGarage.length;

  return (
    <div className="flex flex-col min-h-[100dvh] pb-20 relative overflow-hidden">
      <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${garageBg})` }} />
      
      <div className="relative z-10 flex flex-col min-h-full">
        <div className="p-4 py-5 border-b-2 border-border bg-card/95 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                {t.myGarage}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {carsInGarage.length}/{garageUpgrades.carBays} {t.carsInGarage}
              </p>
            </div>
          </div>
        </div>

        {repairQueue.length > 0 && (
          <div className="mx-4 mt-4 p-3 bg-accent/30 border-2 border-accent/50 rounded-lg flex items-center gap-2 backdrop-blur-sm">
            <Loader2 className="w-4 h-4 animate-spin text-accent-foreground" />
            <span className="text-sm font-medium">
              {repairQueue.length} {t.repairsInProgress}
            </span>
          </div>
        )}

        <div className="flex-1 p-4">
          {carsInGarage.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center bg-card/95 backdrop-blur-sm rounded-xl border-2 border-dashed border-border">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <CarIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-bold mb-2">{t.noCarsYet}</h2>
              <p className="text-sm text-muted-foreground mb-4 px-8">{t.browseAdsToFind}</p>
              <Button onClick={onNavigateToOffice}>
                <Briefcase className="w-4 h-4 mr-2" />
                {t.browseAds}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {carsInGarage.map((car) => {
                const hasDamages = car.damages.some(d => !d.repaired);
                const allRepaired = !hasDamages;
                const isListed = car.listedForSale;
                const totalInvestment = (car.purchasePrice || car.askingPrice) + (car.totalRepairCost || 0);
                const potentialProfit = car.currentValue - totalInvestment;

                const topBadge = isListed ? (
                  <Badge variant="secondary" className="text-xs bg-primary/20 text-primary animate-pulse">
                    📞 {t.listedForSaleBadge}
                  </Badge>
                ) : (
                  <div className={`px-2 py-1 rounded-md text-xs font-medium ${potentialProfit >= 0 ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                    {potentialProfit >= 0 ? '+' : ''}{formatMoney(potentialProfit)}
                  </div>
                );

                const actionButton = allRepaired && !isListed ? (
                  <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700 dark:text-green-400">
                    ✓ {t.readyToSellBadge}
                  </Badge>
                ) : null;

                return (
                  <CarCard
                    key={car.id}
                    car={car}
                    onClick={() => onSelectCar(car.id)}
                    showDamages={true}
                    actionButton={actionButton}
                    topBadge={topBadge}
                  />
                );
              })}
              
              {Array.from({ length: emptySlots }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="border-2 border-dashed border-border rounded-xl p-8 flex items-center justify-center bg-card/80 backdrop-blur-sm"
                >
                  <span className="text-muted-foreground text-sm font-medium">{t.emptyBay}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
