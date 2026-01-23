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

// Import car images
import economyHatch from '@/assets/cars/economy-hatch.png';
import sedanImg from '@/assets/cars/sedan.png';
import suvImg from '@/assets/cars/suv.png';
import sportsImg from '@/assets/cars/sports.png';
import luxuryImg from '@/assets/cars/luxury.png';

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
  { id: 'mechanical', label: 'Mechanical', icon: '⚙️' },
  { id: 'body', label: 'Body', icon: '🔧' },
  { id: 'tires', label: 'Tires', icon: '🛞' },
  { id: 'interior', label: 'Interior', icon: '🪑' },
];

export function RepairScreen({ carId, onBack }: RepairScreenProps) {
  const { 
    state, 
    dispatch, 
    hasEnergy, 
    getEnergyMultiplier, 
    getRepairSpeedMultiplier,
    startRepair,
    getRepairProgress,
    isRepairing,
    getSaleState,
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

  // Initialize sell price
  useEffect(() => {
    if (car) {
      setSellPrice(Math.round(car.currentValue * 1.2));
    }
  }, [car?.currentValue]);

  // Play sound when customer arrives
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
    const actualDuration = damage.repairTime * getRepairSpeedMultiplier();
    
    if (!hasEnergy(actualEnergyCost)) {
      toast.error("Not enough energy! Wait for it to regenerate.");
      return;
    }

    const success = startRepair(carId, damage.part, actualEnergyCost, actualDuration);
    if (success) {
      playSound('repair');
      toast.info(`Repairing ${partType.replace('_', ' ')}...`);
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

    dispatch({ type: 'SELL_CAR', payload: { carId, salePrice: customerOffer } });
    dispatch({ type: 'ADD_REPUTATION', payload: 2 + Math.floor(customerOffer / 500) });
    dispatch({ type: 'ADD_XP', payload: 25 + Math.floor(customerOffer / 100) });
    
    playSound('cashRegister');
    toast.success(`Sold ${car.name} for $${customerOffer.toLocaleString()}!`);
    onBack();
  };

  const handleCounterOffer = () => {
    if (!customer || !saleState) return;

    if (negotiationRound >= 2) {
      toast.error("Customer is losing patience and leaving!");
      dispatch({ type: 'CANCEL_SALE', payload: carId });
      return;
    }

    const increase = (saleState.askingPrice - customerOffer) * (0.3 + Math.random() * 0.3);
    const newOffer = Math.round(customerOffer + increase);
    dispatch({ type: 'UPDATE_SALE_OFFER', payload: { carId, offer: newOffer, round: negotiationRound + 1 } });
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

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header with car image */}
      <div className="relative p-4 border-b border-border bg-gradient-to-b from-secondary/50 to-background">
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
        
        {/* Car image */}
        <div className="flex justify-center mt-3">
          <img 
            src={carImage} 
            alt={car.name}
            className="h-24 object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Customer waiting / offer */}
      {(waitingForCustomer || customer) && (
        <div className="p-4 border-b border-border">
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
            />
          )}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 p-4 overflow-x-auto">
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

      {/* Parts List */}
      <div className="flex-1 p-4 space-y-2">
        {categoryDamages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No issues in this category</p>
          </div>
        ) : (
          categoryDamages.map((damage) => {
            const partIsRepairing = isRepairing(carId, damage.part);
            const progress = getRepairProgress(carId, damage.part);
            return (
              <PartRepairCard
                key={damage.part}
                damage={damage}
                onRepair={() => handleRepair(damage.part)}
                canRepair={hasEnergy(Math.round(damage.energyCost * getEnergyMultiplier())) && !partIsRepairing && !damage.repaired}
                isRepairing={partIsRepairing}
                repairProgress={progress}
                energyMultiplier={getEnergyMultiplier()}
              />
            );
          })
        )}
      </div>

      {/* Sell Dialog */}
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

            <div className="p-3 bg-secondary/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Potential profit:</span>
                <span className={`font-bold ${sellPrice - car.askingPrice > 0 ? 'text-primary' : 'text-destructive'}`}>
                  ${(sellPrice - car.askingPrice).toLocaleString()}
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
