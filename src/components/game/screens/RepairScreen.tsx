import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { PartRepairCard } from '@/components/game/PartRepairCard';
import { CustomerCard } from '@/components/game/CustomerCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { PartCategory } from '@/types/game';
import { ArrowLeft, DollarSign, Tag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSound } from '@/hooks/useSound';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '@/data/parts';
import { getPatienceRounds } from '@/data/customers';

import economyHatch from '@/assets/cars/economy-hatch.png';
import sedanImg from '@/assets/cars/sedan.png';
import suvImg from '@/assets/cars/suv.png';
import sportsImg from '@/assets/cars/sports.png';
import luxuryImg from '@/assets/cars/luxury.png';
import garageBg from '@/assets/garage-bg.jpg';

const CAR_IMAGES: Record<string, string> = {
  economy: economyHatch,
  sedan: sedanImg,
  suv: suvImg,
  sports: sportsImg,
  luxury: luxuryImg,
};

interface RepairScreenProps {
  carId: string;
  onBack: () => void;
}

const categories: { id: PartCategory; label: string; icon: string }[] = [
  { id: 'mechanical', label: CATEGORY_LABELS.mechanical, icon: CATEGORY_ICONS.mechanical },
  { id: 'body', label: CATEGORY_LABELS.body, icon: CATEGORY_ICONS.body },
  { id: 'tires', label: CATEGORY_LABELS.tires, icon: CATEGORY_ICONS.tires },
  { id: 'interior', label: CATEGORY_LABELS.interior, icon: CATEGORY_ICONS.interior },
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
    getSaleState,
    getDiySuccessChance,
    handleSaleComplete,
    updateChallengeProgress,
  } = useGame();
  
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
    
    if (!hasEnergy(actualEnergyCost)) {
      toast.error("Not enough energy!");
      return;
    }
    
    if (!canAfford(moneyCost)) {
      toast.error(`Not enough money! Need $${moneyCost}`);
      return;
    }

    const success = startRepair(carId, damage.part, actualEnergyCost, moneyCost, actualDuration);
    if (success) {
      playSound('repair');
      toast.info(`Repairing ${partType.replace(/_/g, ' ')}... (-$${moneyCost})`);
      // Track repair challenge (will complete when repair finishes)
      updateChallengeProgress('repair_parts', 1);
    }
  };

  const handleDiyRepair = (partType: string) => {
    if (!car) return;

    const damage = car.damages.find(d => d.part === partType);
    if (!damage) return;

    const actualEnergyCost = Math.round(damage.energyCost * getEnergyMultiplier() * 0.5);
    const actualDuration = damage.repairTime * getRepairSpeedMultiplier() * 0.7;
    
    if (!hasEnergy(actualEnergyCost)) {
      toast.error("Not enough energy!");
      return;
    }

    const successChance = getDiySuccessChance(damage.part);
    const { started } = startDiyRepair(carId, damage.part, actualEnergyCost, actualDuration);
    
    if (started) {
      playSound('repair');
      toast.info(`DIY repair started (${Math.round(successChance)}% success)...`);
      // Track DIY challenge (will complete when repair finishes successfully)
      updateChallengeProgress('diy_repairs', 1);
    }
  };

  const handleListForSale = () => {
    if (!car) return;
    
    dispatch({ type: 'LIST_CAR_FOR_SALE', payload: { carId, askingPrice: sellPrice } });
    setShowSellDialog(false);
    toast.info("Car listed! Waiting for customers...");
  };

  const handleAcceptOffer = () => {
    if (!car || !customer) return;

    handleSaleComplete(carId, customerOffer);
    playSound('cashRegister');
    toast.success(`Sold ${car.name} for $${customerOffer.toLocaleString()}!`);
    onBack();
  };

  const handleCounterOffer = () => {
    if (!customer || !saleState) return;

    const maxRounds = getPatienceRounds(customer.patience);
    if (negotiationRound >= maxRounds) {
      toast.error("Customer is losing patience and leaving!");
      dispatch({ type: 'CANCEL_SALE', payload: carId });
      return;
    }

    const increase = (saleState.askingPrice - customerOffer) * (0.2 + Math.random() * 0.3) * (1 - customer.bargainSkill * 0.05);
    const newOffer = Math.round(customerOffer + Math.max(increase, 50));
    dispatch({ type: 'UPDATE_SALE_OFFER', payload: { carId, offer: Math.min(newOffer, customer.maxBudget), round: negotiationRound + 1 } });
    toast.info("Customer increased their offer.");
  };

  const handleRejectOffer = () => {
    dispatch({ type: 'CANCEL_SALE', payload: carId });
    toast.info("Customer left. You can list the car again.");
  };

  if (!car) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Car not found</p>
      </div>
    );
  }

  const categoryDamages = car.damages.filter(d => d.category === selectedCategory);
  const unrepaired = car.damages.filter(d => !d.repaired).length;
  const repaired = car.damages.filter(d => d.repaired).length;
  const allRepaired = unrepaired === 0;
  const carImage = CAR_IMAGES[car.category] || economyHatch;
  
  // Calculate total investment and potential profit
  const totalInvestment = (car.purchasePrice || car.askingPrice) + (car.totalRepairCost || 0);

  return (
    <div className="flex flex-col min-h-full pb-20 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${garageBg})` }}
      />
      
      <div className="relative z-10">
        <div className="relative p-4 border-b border-border bg-card/90 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold truncate">{car.name}</h1>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <Badge variant="secondary">{repaired}/{repaired + unrepaired} fixed</Badge>
                <span className="text-muted-foreground">
                  Value: <span className="text-primary font-medium">${Math.round(car.currentValue).toLocaleString()}</span>
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Invested: ${totalInvestment.toLocaleString()}
              </div>
            </div>
            <Button 
              onClick={() => setShowSellDialog(true)} 
              disabled={!allRepaired || car.listedForSale}
              size="sm"
              className="shrink-0"
            >
              <Tag className="w-4 h-4 mr-1" />
              Sell
            </Button>
          </div>
          
          <div className="flex justify-center mt-3">
            <img 
              src={carImage} 
              alt={car.name}
              className="h-24 object-contain drop-shadow-lg"
              style={{ transform: `scaleX(${car.imageVariant === 1 ? -1 : 1})` }}
            />
          </div>
        </div>

        {(waitingForCustomer || customer) && (
          <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm">
            {waitingForCustomer ? (
              <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <div>
                  <p className="font-medium">Waiting for a buyer...</p>
                  <p className="text-sm text-muted-foreground">A customer will arrive soon</p>
                </div>
              </div>
            ) : customer && (
              <CustomerCard
                customer={customer}
                offerPrice={customerOffer}
                onAccept={handleAcceptOffer}
                onCounter={handleCounterOffer}
                onReject={handleRejectOffer}
                isNegotiating={negotiationRound > 0}
                negotiationRound={negotiationRound}
              />
            )}
          </div>
        )}

        <div className="flex gap-2 p-4 overflow-x-auto bg-card/70 backdrop-blur-sm">
          {categories.map((cat) => {
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
                {cat.label}
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
            <div className="text-center py-8 text-muted-foreground bg-card/70 backdrop-blur-sm rounded-lg">
              <p>No issues in this category</p>
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
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>List {car.name} for Sale</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              <img src={carImage} alt={car.name} className="h-20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Car Value</p>
              <p className="text-2xl font-bold text-primary">
                ${Math.round(car.currentValue).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Your asking price:</span>
                <span className="font-bold">${sellPrice.toLocaleString()}</span>
              </div>
              <Slider
                value={[sellPrice]}
                onValueChange={([v]) => setSellPrice(v)}
                min={Math.round(car.currentValue * 0.8)}
                max={Math.round(car.currentValue * 1.5)}
                step={50}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low price = fast sale</span>
                <span>High price = slower sale</span>
              </div>
            </div>

            <div className="p-3 bg-secondary/50 rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span>Total invested:</span>
                <span className="font-medium">${totalInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Potential profit:</span>
                <span className={`font-bold ${sellPrice - totalInvestment > 0 ? 'text-primary' : 'text-destructive'}`}>
                  ${(sellPrice - totalInvestment).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleListForSale} className="w-full">
              <DollarSign className="w-4 h-4 mr-1" />
              List for Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
