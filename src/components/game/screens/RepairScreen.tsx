import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PartRepairCard } from '@/components/game/PartRepairCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { PartCategory } from '@/types/game';
import { ArrowLeft, DollarSign, Tag, Loader2, PhoneCall } from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import { CATEGORY_ICONS } from '@/data/parts';
import { getCategoryName } from '@/utils/partTranslations';

import garageBg from '@/assets/garage-bg.jpg';

interface RepairScreenProps {
  carId: string;
  onBack: () => void;
  onNavigateToOffice?: () => void;
}

const categoryList: { id: PartCategory; icon: string }[] = [
  { id: 'mechanical', icon: CATEGORY_ICONS.mechanical },
  { id: 'body', icon: CATEGORY_ICONS.body },
  { id: 'tires', icon: CATEGORY_ICONS.tires },
  { id: 'interior', icon: CATEGORY_ICONS.interior },
];

export function RepairScreen({ carId, onBack, onNavigateToOffice }: RepairScreenProps) {
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
    getSaleState,
    getDiySuccessChance,
    handleSaleComplete,
    updateChallengeProgress,
  } = useGame();
  const { t, formatMoney } = useLanguage();
  
  const [selectedCategory, setSelectedCategory] = useState<PartCategory>('mechanical');
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [sellPrice, setSellPrice] = useState(0);
  const { playSound } = useSound();

  const car = state.carsInGarage.find(c => c.id === carId);
  const saleState = getSaleState(carId);
  const waitingForCustomer = saleState && !saleState.customer;
  const customer = saleState?.customer;
  const customerOffer = saleState?.customerOffer || 0;
  const negotiationRound = saleState?.negotiationRound || 0;

  useEffect(() => {
    if (car) {
      setSellPrice(Math.round(car.currentValue * 1.2));
    }
  }, [car?.currentValue]);

  useEffect(() => {
    if (customer) {
      playSound('customerCall');
    }
  }, [customer, playSound]);

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

  const handleListForSale = () => {
    if (!car) return;
    
    dispatch({ type: 'LIST_CAR_FOR_SALE', payload: { carId, askingPrice: sellPrice } });
    setShowSellDialog(false);
  };

  // Customer negotiation now happens in the Office phone screen

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
  const allRepaired = unrepaired === 0;
  
  // Use car.image directly - it's stored at generation time
  const carImage = car.image;
  
  const totalInvestment = (car.purchasePrice || car.askingPrice) + (car.totalRepairCost || 0);

  return (
    <div className="flex flex-col min-h-[100dvh] pb-20 relative">
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
            <Button 
              onClick={() => setShowSellDialog(true)} 
              disabled={!allRepaired || car.listedForSale}
              size="sm"
              className="shrink-0"
            >
              <Tag className="w-4 h-4 mr-1" />
              {t.sell}
            </Button>
          </div>
          
          <div className="flex justify-center mt-3">
            <img 
              src={carImage} 
              alt={car.name}
              className="h-24 object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {waitingForCustomer && (
          <div className="p-4 border-b border-border bg-card/95 backdrop-blur-sm">
            <div className="flex items-center gap-3 p-4 bg-secondary/80 rounded-lg border-2 border-border">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <div>
                <p className="font-medium">{t.waitingForBuyer}</p>
                <p className="text-sm text-muted-foreground">{t.customerWillArrive}</p>
              </div>
            </div>
          </div>
        )}

        {customer && (
          <div className="p-4 border-b border-border bg-accent/20 backdrop-blur-sm">
            <button
              onClick={onNavigateToOffice}
              className="w-full flex items-center gap-3 p-4 bg-primary/10 rounded-lg border-2 border-primary/30 hover:bg-primary/20 transition-colors"
            >
              <PhoneCall className="w-5 h-5 text-primary animate-bounce" />
              <div className="flex-1 text-left">
                <p className="font-medium">{t.incomingCalls}</p>
                <p className="text-sm text-muted-foreground">{t.goToOfficeToAnswer}</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-primary rotate-180" />
            </button>
          </div>
        )}

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

      <Dialog open={showSellDialog} onOpenChange={setShowSellDialog}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-sm p-4">
          <DialogHeader>
            <DialogTitle>{t.listForSale} {car.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="text-center">
              <img src={carImage} alt={car.name} className="h-20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">{t.carValue}</p>
              <p className="text-2xl font-bold text-primary">
                {formatMoney(Math.round(car.currentValue))}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t.yourOffer}:</span>
                <span className="font-bold">{formatMoney(sellPrice)}</span>
              </div>
              <Slider
                value={[sellPrice]}
                onValueChange={([v]) => setSellPrice(v)}
                min={Math.round(car.currentValue * 0.8)}
                max={Math.round(car.currentValue * 1.5)}
                step={50}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>80%</span>
                <span className="text-center text-primary font-medium">Max: 150%</span>
                <span>{t.sell}</span>
              </div>
            </div>

            <div className="p-3 bg-secondary/80 rounded-lg space-y-1 border-2 border-border">
              <div className="flex justify-between text-sm">
                <span>{t.totalInvested}:</span>
                <span className="font-medium">{formatMoney(totalInvestment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t.potentialProfit}:</span>
                <span className={`font-bold ${sellPrice - totalInvestment > 0 ? 'text-primary' : 'text-destructive'}`}>
                  {formatMoney(sellPrice - totalInvestment)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleListForSale} className="w-full">
              <DollarSign className="w-4 h-4 mr-1" />
              {t.listForSale}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
