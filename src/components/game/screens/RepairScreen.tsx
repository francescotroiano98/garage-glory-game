import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PartRepairCard } from '@/components/game/PartRepairCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PartCategory } from '@/types/game';
import { ArrowLeft } from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import { CATEGORY_ICONS } from '@/data/parts';
import { getCategoryName } from '@/utils/partTranslations';

import garageBg from '@/assets/garage-bg.jpg';

interface RepairScreenProps {
  carId: string;
  onBack: () => void;
}

const categoryList: { id: PartCategory; icon: string }[] = [
  { id: 'mechanical', icon: CATEGORY_ICONS.mechanical },
  { id: 'body', icon: CATEGORY_ICONS.body },
  { id: 'tires', icon: CATEGORY_ICONS.tires },
  { id: 'interior', icon: CATEGORY_ICONS.interior },
];

export function RepairScreen({ carId, onBack }: RepairScreenProps) {
  const { 
    state, 
    dispatch, 
    hasEnergy, 
    canAfford,
    getEnergyMultiplier, 
    getRepairSpeedMultiplier,
    startRepair,
    startDiyRepair,
    getRepairProgress,
    isRepairing,
    getDiySuccessChance,
    updateChallengeProgress,
  } = useGame();
  const { t, formatMoney } = useLanguage();
  
  const [selectedCategory, setSelectedCategory] = useState<PartCategory>('mechanical');
  const { playSound } = useSound();

  const car = state.carsInGarage.find(c => c.id === carId);

  const handleRepair = (partType: string) => {
    if (!car) return;

    const damage = car.damages.find(d => d.part === partType);
    if (!damage) return;

    const actualEnergyCost = Math.round(damage.energyCost * getEnergyMultiplier());
    const moneyCost = damage.moneyCost;
    const actualDuration = damage.repairTime * getRepairSpeedMultiplier();
    
    if (!hasEnergy(actualEnergyCost) || !canAfford(moneyCost)) return;

    const success = startRepair(carId, damage.part, actualEnergyCost, moneyCost, actualDuration);
    if (success) {
      playSound('repair');
      updateChallengeProgress('repair_parts', 1);
    }
  };

  const handleDiyRepair = (partType: string) => {
    if (!car) return;

    const damage = car.damages.find(d => d.part === partType);
    if (!damage) return;

    const actualEnergyCost = Math.round(damage.energyCost * getEnergyMultiplier() * 0.5);
    const actualDuration = damage.repairTime * getRepairSpeedMultiplier() * 0.7;
    
    if (!hasEnergy(actualEnergyCost)) return;

    const { started } = startDiyRepair(carId, damage.part, actualEnergyCost, actualDuration);
    
    if (started) {
      playSound('repair');
      updateChallengeProgress('diy_repairs', 1);
    }
  };

  if (!car) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Car not found</p>
         <Button variant="outline" onClick={onBack} className="mt-4">
           {t.goBack}
         </Button>
      </div>
    );
  }

  const categoryDamages = car.damages.filter(d => d.category === selectedCategory);
  const unrepaired = car.damages.filter(d => !d.repaired).length;
  const repaired = car.damages.filter(d => d.repaired).length;
  
  const carImage = car.image;
  
  const totalInvestment = (car.purchasePrice || car.askingPrice) + (car.totalRepairCost || 0);

  return (
    <div className="flex flex-col h-[100dvh] pb-20 relative">
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${garageBg})` }}
      />
      
      <div className="relative z-10">
        <div className="relative p-4 py-5 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">{car.name}</h1>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <Badge variant="secondary">{repaired}/{repaired + unrepaired} {t.fixed}</Badge>
                <span className="text-muted-foreground">
                  {t.carValue}: <span className="text-primary font-medium">{formatMoney(Math.round(car.currentValue))}</span>
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {t.invested}: {formatMoney(totalInvestment)}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-3">
            <img 
              src={carImage} 
              alt={car.name}
              className="h-24 object-contain drop-shadow-lg"
            />
          </div>
        </div>

        <div className="flex gap-2 p-4 overflow-x-auto bg-card/95 backdrop-blur-sm">
          {categoryList.map((cat) => {
            const catDamages = car.damages.filter(d => d.category === cat.id);
            const catUnrepaired = catDamages.filter(d => !d.repaired).length;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="shrink-0"
              >
                <span className="mr-1">{cat.icon}</span>
                {getCategoryName(cat.id, t as unknown as Record<string, string>)}
                {catUnrepaired > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1">
                    {catUnrepaired}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        <div className="flex-1 p-4 space-y-2">
          {categoryDamages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-card/95 backdrop-blur-sm rounded-lg border-2 border-border">
              <p>{t.noIssues}</p>
            </div>
          ) : (
            categoryDamages.map((damage) => {
              const partIsRepairing = isRepairing(carId, damage.part);
              const progress = getRepairProgress(carId, damage.part);
              const diyChance = getDiySuccessChance(damage.part);
              return (
                <PartRepairCard
                  key={damage.part}
                  damage={damage}
                  onRepair={() => handleRepair(damage.part)}
                  onDiyRepair={() => handleDiyRepair(damage.part)}
                  canRepair={hasEnergy(Math.round(damage.energyCost * getEnergyMultiplier())) && canAfford(damage.moneyCost) && !partIsRepairing && !damage.repaired}
                  canDiy={hasEnergy(Math.round(damage.energyCost * getEnergyMultiplier() * 0.5)) && !partIsRepairing && !damage.repaired}
                  isRepairing={partIsRepairing}
                  repairProgress={progress}
                  energyMultiplier={getEnergyMultiplier()}
                  diySuccessChance={diyChance}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
