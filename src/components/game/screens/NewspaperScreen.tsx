import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CarCard } from '@/components/game/CarCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { generateCar } from '@/data/cars';
import { NewspaperAd, Car } from '@/types/game';
import { Newspaper, RefreshCw, DollarSign, Zap } from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import newspaperBg from '@/assets/newspaper-bg.jpg';

interface NewspaperScreenProps {
  onCarBought: () => void;
}

const NEGOTIATION_ENERGY_COST = 2;

export function NewspaperScreen({ onCarBought }: NewspaperScreenProps) {
  const { state, dispatch, canAfford, hasEnergy, getVisibilityChance, getNegotiationBonus, updateChallengeProgress } = useGame();
  const { t } = useLanguage();
  const [ads, setAds] = useState<NewspaperAd[]>([]);
  const [selectedAd, setSelectedAd] = useState<NewspaperAd | null>(null);
  const [negotiatePrice, setNegotiatePrice] = useState(0);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiationCount, setNegotiationCount] = useState(0);
  const { playSound } = useSound();

  useEffect(() => {
    refreshAds();
  }, [state.level]);

  const refreshAds = () => {
    const newAds: NewspaperAd[] = Array.from({ length: 5 }, () => ({
      id: `ad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      car: generateCar(state.level),
      seller: '',
      daysListed: Math.floor(Math.random() * 7) + 1,
      negotiable: Math.random() > 0.3,
    }));
    setAds(newAds);
    setNegotiationCount(0);
  };

  const handleSelectAd = (ad: NewspaperAd) => {
    setSelectedAd(ad);
    setNegotiatePrice(ad.car.askingPrice);
    setIsNegotiating(false);
    setNegotiationCount(0);
    playSound('buttonClick');
  };

  const handleBuy = (price: number) => {
    if (!selectedAd) return;
    
    if (!canAfford(price)) return;

    const garageFull = state.carsInGarage.length >= state.garageUpgrades.carBays;
    if (garageFull) return;

    const car: Car = { ...selectedAd.car, askingPrice: price, purchasePrice: price, totalRepairCost: 0 };
    dispatch({ type: 'BUY_CAR', payload: car });
    playSound('purchase');
    
    updateChallengeProgress('buy_cars', 1);
    
    setAds(prev => prev.filter(a => a.id !== selectedAd.id));
    setSelectedAd(null);
    onCarBought();
  };

  const handleNegotiate = () => {
    if (!selectedAd) return;
    
    if (!hasEnergy(NEGOTIATION_ENERGY_COST)) return;
    
    dispatch({ type: 'SPEND_ENERGY', payload: NEGOTIATION_ENERGY_COST });
    setNegotiationCount(prev => prev + 1);
    
    const minPrice = Math.round(selectedAd.car.askingPrice * 0.7);
    const negotiationBonus = getNegotiationBonus();
    const successChance = 0.3 + (negotiationBonus - 1) * 5;
    
    if (negotiatePrice < minPrice) return;

    const discount = selectedAd.car.askingPrice - negotiatePrice;
    const discountPercent = discount / selectedAd.car.askingPrice;
    const adjustedChance = successChance - discountPercent;
    
    if (Math.random() < adjustedChance) {
      handleBuy(negotiatePrice);
    } else {
      const counterPrice = Math.round(selectedAd.car.askingPrice * (0.9 + Math.random() * 0.1));
      setNegotiatePrice(counterPrice);
      setIsNegotiating(true);
    }
  };

  const garageFull = state.carsInGarage.length >= state.garageUpgrades.carBays;

  return (
    <div className="flex flex-col min-h-[100dvh] pb-20 relative overflow-hidden">
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${newspaperBg})` }}
      />
      
      <div className="relative z-10">
        <div className="p-4 py-5 border-b-2 border-border bg-card/95 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-primary" />
                {t.newspaperAds}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t.findNextProject}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={refreshAds} className="border-2">
              <RefreshCw className="w-4 h-4 mr-1" />
              {t.refresh}
            </Button>
          </div>
        </div>

        {garageFull && (
          <div className="mx-4 mt-4 p-3 bg-destructive/20 border-2 border-destructive/50 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-destructive font-medium">
              {t.garageFullMessage}
            </p>
          </div>
        )}

        <div className="flex-1 p-4 space-y-3">
          {ads.map((ad) => (
            <div key={ad.id} className="relative">
              <CarCard
                car={ad.car}
                onClick={() => handleSelectAd(ad)}
                visibilityChance={getVisibilityChance()}
              />
              {ad.negotiable && (
                <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-primary bg-card/95 px-2 py-1 rounded-md border-2 font-medium">
                  {t.negotiable}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedAd} onOpenChange={(open) => !open && setSelectedAd(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t.buy} {selectedAd?.car.name}?</DialogTitle>
          </DialogHeader>

          {selectedAd && (
            <div className="space-y-4">
              <CarCard car={selectedAd.car} showPrice={false} visibilityChance={getVisibilityChance()} />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t.askingPrice}:</span>
                  <span className="font-bold">${selectedAd.car.askingPrice.toLocaleString()}</span>
                </div>
                
                {selectedAd.negotiable && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>{t.yourOffer}:</span>
                      <span className="font-bold text-primary">${negotiatePrice.toLocaleString()}</span>
                    </div>
                    <Slider
                      value={[negotiatePrice]}
                      onValueChange={([v]) => setNegotiatePrice(v)}
                      min={Math.round(selectedAd.car.askingPrice * 0.7)}
                      max={selectedAd.car.askingPrice}
                      step={10}
                    />
                    {negotiationCount > 0 && (
                      <div className="text-xs text-muted-foreground text-center">
                        {t.negotiations}: {negotiationCount} (cost: {negotiationCount * NEGOTIATION_ENERGY_COST} {t.energy.toLowerCase()})
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t.yourBalance}:</span>
                  <span className={canAfford(negotiatePrice) ? 'text-primary font-bold' : 'text-destructive font-bold'}>
                    ${state.money.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            {selectedAd?.negotiable && (
              <Button 
                variant="outline" 
                onClick={handleNegotiate} 
                className="flex-1 border-2"
                disabled={!hasEnergy(NEGOTIATION_ENERGY_COST)}
              >
                <DollarSign className="w-4 h-4 mr-1" />
                {t.negotiate}
                <span className="ml-1 text-xs flex items-center">
                  (<Zap className="w-3 h-3" />{NEGOTIATION_ENERGY_COST})
                </span>
              </Button>
            )}
            <Button 
              onClick={() => handleBuy(isNegotiating ? negotiatePrice : selectedAd?.car.askingPrice || 0)} 
              disabled={!canAfford(negotiatePrice) || garageFull}
              className="flex-1"
            >
              {t.buyNow}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
