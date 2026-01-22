import { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { PartRepairCard } from '@/components/game/PartRepairCard';
import { CustomerCard } from '@/components/game/CustomerCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Car, Customer, PartType, PartCategory } from '@/types/game';
import { CUSTOMER_NAMES, CUSTOMER_AVATARS } from '@/data/cars';
import { ArrowLeft, DollarSign, Wrench, Tag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
  const { state, dispatch, hasEnergy, getEnergyMultiplier, getRepairSpeedMultiplier, getVisibilityChance } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<PartCategory>('mechanical');
  const [repairingPart, setRepairingPart] = useState<PartType | null>(null);
  const [repairProgress, setRepairProgress] = useState(0);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [sellPrice, setSellPrice] = useState(0);
  const [waitingForCustomer, setWaitingForCustomer] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerOffer, setCustomerOffer] = useState(0);
  const [negotiationRound, setNegotiationRound] = useState(0);

  const car = state.carsInGarage.find(c => c.id === carId);

  // Initialize sell price
  useEffect(() => {
    if (car) {
      setSellPrice(Math.round(car.currentValue * 1.2)); // 20% markup target
    }
  }, [car?.currentValue]);

  // Handle repair progress
  useEffect(() => {
    if (!repairingPart || !car) return;

    const damage = car.damages.find(d => d.part === repairingPart);
    if (!damage) return;

    const speedMultiplier = getRepairSpeedMultiplier();
    const totalTime = damage.repairTime * speedMultiplier * 1000; // in ms
    const interval = 50; // Update every 50ms
    const increment = (interval / totalTime) * 100;

    const timer = setInterval(() => {
      setRepairProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          dispatch({ type: 'REPAIR_PART', payload: { carId, partType: repairingPart } });
          dispatch({ type: 'ADD_XP', payload: 10 + damage.energyCost });
          toast.success(`Repaired ${repairingPart.replace('_', ' ')}!`);
          setRepairingPart(null);
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [repairingPart, carId, dispatch, getRepairSpeedMultiplier, car]);

  const handleRepair = useCallback((partType: PartType) => {
    if (!car) return;

    const damage = car.damages.find(d => d.part === partType);
    if (!damage) return;

    const actualEnergyCost = Math.round(damage.energyCost * getEnergyMultiplier());
    
    if (!hasEnergy(actualEnergyCost)) {
      toast.error("Not enough energy! Wait for it to regenerate.");
      return;
    }

    dispatch({ type: 'SPEND_ENERGY', payload: actualEnergyCost });
    setRepairingPart(partType);
    setRepairProgress(0);
  }, [car, dispatch, hasEnergy, getEnergyMultiplier]);

  const handleListForSale = () => {
    if (!car) return;
    
    dispatch({ type: 'LIST_CAR_FOR_SALE', payload: carId });
    setShowSellDialog(false);
    setWaitingForCustomer(true);

    // Generate customer after random delay (5-30 seconds)
    const delay = 5000 + Math.random() * 25000;
    setTimeout(() => {
      const newCustomer: Customer = {
        id: `customer_${Date.now()}`,
        name: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
        avatar: CUSTOMER_AVATARS[Math.floor(Math.random() * CUSTOMER_AVATARS.length)],
        patience: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        maxBudget: sellPrice * (1 + Math.random() * 0.3),
      };
      setCustomer(newCustomer);
      
      // Customer's initial offer (usually below asking price)
      const offerVariance = newCustomer.patience === 'high' ? 0.95 : newCustomer.patience === 'medium' ? 0.85 : 0.75;
      setCustomerOffer(Math.round(sellPrice * (offerVariance + Math.random() * 0.1)));
      setWaitingForCustomer(false);
    }, delay);
  };

  const handleAcceptOffer = () => {
    if (!car || !customer) return;

    dispatch({ type: 'SELL_CAR', payload: { carId, salePrice: customerOffer } });
    dispatch({ type: 'ADD_REPUTATION', payload: 2 + Math.floor(customerOffer / 500) });
    dispatch({ type: 'ADD_XP', payload: 25 + Math.floor(customerOffer / 100) });
    
    toast.success(`Sold ${car.name} for $${customerOffer.toLocaleString()}!`);
    onBack();
  };

  const handleCounterOffer = () => {
    if (!customer) return;

    if (negotiationRound >= 2) {
      toast.error("Customer is losing patience and leaving!");
      setCustomer(null);
      dispatch({ type: 'UNLIST_CAR', payload: carId });
      return;
    }

    // Customer increases offer slightly
    const increase = (sellPrice - customerOffer) * (0.3 + Math.random() * 0.3);
    setCustomerOffer(Math.round(customerOffer + increase));
    setNegotiationRound(prev => prev + 1);
    toast.info("Customer increased their offer.");
  };

  const handleRejectOffer = () => {
    setCustomer(null);
    dispatch({ type: 'UNLIST_CAR', payload: carId });
    setNegotiationRound(0);
    toast.info("Customer left. You can list the car again.");
  };

  if (!car) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Car not found</p>
      </div>
    );
  }

  // Get all damages (reveal hidden ones with skill)
  const visibleDamages = car.damages.filter(d => 
    !d.repaired && (d.visible || Math.random() < getVisibilityChance())
  );
  const categoryDamages = car.damages.filter(d => d.category === selectedCategory);
  const unrepaired = car.damages.filter(d => !d.repaired).length;
  const repaired = car.damages.filter(d => d.repaired).length;
  const allRepaired = unrepaired === 0;

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{car.image}</span>
              <h1 className="text-lg font-bold">{car.name}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm">
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
          >
            <Tag className="w-4 h-4 mr-1" />
            Sell
          </Button>
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
            <Wrench className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No issues in this category</p>
          </div>
        ) : (
          categoryDamages.map((damage) => (
            <PartRepairCard
              key={damage.part}
              damage={damage}
              onRepair={() => handleRepair(damage.part)}
              canRepair={hasEnergy(Math.round(damage.energyCost * getEnergyMultiplier())) && !repairingPart}
              isRepairing={repairingPart === damage.part}
              repairProgress={repairingPart === damage.part ? repairProgress : 0}
              energyMultiplier={getEnergyMultiplier()}
            />
          ))
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
