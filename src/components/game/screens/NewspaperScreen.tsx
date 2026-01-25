import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { CarCard } from '@/components/game/CarCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { generateCar } from '@/data/cars';
import { CUSTOMER_NAMES } from '@/data/customers';
import { NewspaperAd, Car } from '@/types/game';
import { Newspaper, RefreshCw, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useSound } from '@/hooks/useSound';

interface NewspaperScreenProps {
  onCarBought: () => void;
}

export function NewspaperScreen({ onCarBought }: NewspaperScreenProps) {
  const { state, dispatch, canAfford, getVisibilityChance, getNegotiationBonus } = useGame();
  const [ads, setAds] = useState<NewspaperAd[]>([]);
  const [selectedAd, setSelectedAd] = useState<NewspaperAd | null>(null);
  const [negotiatePrice, setNegotiatePrice] = useState(0);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const { playSound } = useSound();

  // Generate initial ads
  useEffect(() => {
    refreshAds();
  }, [state.reputation]);

  const refreshAds = () => {
    const newAds: NewspaperAd[] = Array.from({ length: 5 }, () => ({
      id: `ad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      car: generateCar(state.reputation),
      seller: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
      daysListed: Math.floor(Math.random() * 7) + 1,
      negotiable: Math.random() > 0.3,
    }));
    setAds(newAds);
  };

  const handleSelectAd = (ad: NewspaperAd) => {
    setSelectedAd(ad);
    setNegotiatePrice(ad.car.askingPrice);
    setIsNegotiating(false);
    playSound('buttonClick');
  };

  const handleBuy = (price: number) => {
    if (!selectedAd) return;
    
    if (!canAfford(price)) {
      toast.error("Not enough money!");
      return;
    }

    const garageFull = state.carsInGarage.length >= state.garageUpgrades.carBays;
    if (garageFull) {
      toast.error("Your garage is full!");
      return;
    }

    const car: Car = { ...selectedAd.car, askingPrice: price };
    dispatch({ type: 'BUY_CAR', payload: car });
    playSound('purchase');
    toast.success(`Bought ${car.name} for $${price.toLocaleString()}!`);
    
    // Remove ad from list
    setAds(prev => prev.filter(a => a.id !== selectedAd.id));
    setSelectedAd(null);
    onCarBought();
  };

  const handleNegotiate = () => {
    if (!selectedAd) return;
    
    const minPrice = Math.round(selectedAd.car.askingPrice * 0.7);
    const negotiationBonus = getNegotiationBonus();
    const successChance = 0.3 + (negotiationBonus - 1) * 5;
    
    if (negotiatePrice < minPrice) {
      toast.error("That offer is too low!");
      return;
    }

    const discount = selectedAd.car.askingPrice - negotiatePrice;
    const discountPercent = discount / selectedAd.car.askingPrice;
    const adjustedChance = successChance - discountPercent;
    
    if (Math.random() < adjustedChance) {
      toast.success("Seller accepted your offer!");
      handleBuy(negotiatePrice);
    } else {
      const counterPrice = Math.round(selectedAd.car.askingPrice * (0.9 + Math.random() * 0.1));
      setNegotiatePrice(counterPrice);
      toast.info(`Seller counters with $${counterPrice.toLocaleString()}`);
      setIsNegotiating(true);
    }
  };

  const garageFull = state.carsInGarage.length >= state.garageUpgrades.carBays;

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header */}
      <div className="p-4 border-b-2 border-border bg-gradient-to-b from-secondary/30 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-primary" />
              Newspaper Ads
            </h1>
            <p className="text-sm text-muted-foreground">
              Find your next project car
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={refreshAds} className="border-2">
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {garageFull && (
        <div className="mx-4 mt-4 p-3 bg-destructive/10 border-2 border-destructive/30 rounded-lg">
          <p className="text-sm text-destructive font-medium">
            Your garage is full! Sell a car or upgrade your garage to buy more.
          </p>
        </div>
      )}

      {/* Ads List */}
      <div className="flex-1 p-4 space-y-3">
        {ads.map((ad) => (
          <div key={ad.id} className="relative">
            <CarCard
              car={ad.car}
              onClick={() => handleSelectAd(ad)}
              visibilityChance={getVisibilityChance()}
            />
            <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-muted-foreground bg-background/90 px-2 py-1 rounded-md border">
              <span>by {ad.seller}</span>
              {ad.negotiable && <span className="text-primary font-medium">• Negotiable</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Buy Dialog */}
      <Dialog open={!!selectedAd} onOpenChange={(open) => !open && setSelectedAd(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Buy {selectedAd?.car.name}?</DialogTitle>
          </DialogHeader>

          {selectedAd && (
            <div className="space-y-4">
              <CarCard car={selectedAd.car} showPrice={false} visibilityChance={getVisibilityChance()} />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Asking Price:</span>
                  <span className="font-bold">${selectedAd.car.askingPrice.toLocaleString()}</span>
                </div>
                
                {selectedAd.negotiable && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Your Offer:</span>
                      <span className="font-bold text-primary">${negotiatePrice.toLocaleString()}</span>
                    </div>
                    <Slider
                      value={[negotiatePrice]}
                      onValueChange={([v]) => setNegotiatePrice(v)}
                      min={Math.round(selectedAd.car.askingPrice * 0.7)}
                      max={selectedAd.car.askingPrice}
                      step={10}
                    />
                  </>
                )}

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Your Balance:</span>
                  <span className={canAfford(negotiatePrice) ? 'text-primary font-bold' : 'text-destructive font-bold'}>
                    ${state.money.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            {selectedAd?.negotiable && (
              <Button variant="outline" onClick={handleNegotiate} className="flex-1 border-2">
                <DollarSign className="w-4 h-4 mr-1" />
                Negotiate
              </Button>
            )}
            <Button 
              onClick={() => handleBuy(isNegotiating ? negotiatePrice : selectedAd?.car.askingPrice || 0)} 
              disabled={!canAfford(negotiatePrice) || garageFull}
              className="flex-1"
            >
              Buy Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
