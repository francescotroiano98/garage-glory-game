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
import { AnimatePresence, motion } from 'framer-motion';
import { ConfettiBurst } from '@/components/ui/confetti-burst';
import { useHaptics } from '@/hooks/useHaptics';

interface GarageScreenProps {
  onNavigateToOffice: () => void;
  onSelectCar: (carId: string) => void;
}

export function GarageScreen({ onNavigateToOffice, onSelectCar }: GarageScreenProps) {
  const { state, dispatch } = useGame();
  const { t, formatMoney } = useLanguage();
  const { carsInGarage, garageUpgrades, repairQueue } = state;
  const emptySlots = garageUpgrades.carBays - carsInGarage.length;

  const [showSellDialog, setShowSellDialog] = useState(false);
  const [sellCarId, setSellCarId] = useState<string | null>(null);
  const [sellPrice, setSellPrice] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [shakeDialog, setShakeDialog] = useState(false);
  const { trigger } = useHaptics();

  const sellCar = sellCarId ? carsInGarage.find(c => c.id === sellCarId) : null;
  const sellTotalInvestment = sellCar ? (sellCar.purchasePrice || sellCar.askingPrice) + (sellCar.totalRepairCost || 0) : 0;

  useEffect(() => {
    if (sellCar) {
      setSellPrice(Math.round(sellCar.currentValue * 1.2));
    }
  }, [sellCar?.currentValue]);

  const handleOpenSellDialog = (carId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSellCarId(carId);
    setShowSellDialog(true);
  };

  const handleListForSale = () => {
    if (!sellCar) return;
    const totalInv = (sellCar.purchasePrice || sellCar.askingPrice) + (sellCar.totalRepairCost || 0);
    if (sellPrice < totalInv * 0.7) {
      // hard guard against catastrophic loss — shake & block
      setShakeDialog(true);
      trigger('error');
      setTimeout(() => setShakeDialog(false), 450);
      return;
    }
    dispatch({ type: 'LIST_CAR_FOR_SALE', payload: { carId: sellCar.id, askingPrice: sellPrice } });
    trigger('success');
    setConfetti(true);
    setShowSellDialog(false);
    setSellCarId(null);
  };

  return (
    <>
    <div className="flex flex-col h-[100svh] pb-20 relative">
      <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${garageBg})` }} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="relative p-4 py-5 border-b-2 border-border bg-card/95 backdrop-blur-sm shrink-0 sticky top-0 z-20 texture-grain brushed-metal">
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
          {repairQueue.length > 0 && (
            <div className="mt-3 p-2 bg-accent/30 border border-accent/50 rounded-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-accent-foreground" />
              <span className="text-sm font-medium">
                {repairQueue.length} {t.repairsInProgress}
              </span>
            </div>
          )}
        </div>
        <div className="overflow-y-auto p-4"
             style={{ height: `calc(100svh - ${repairQueue.length > 0 ? 295 : 258}px)`}}
        >
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
              <AnimatePresence initial={false} mode="popLayout">
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
                  <Button size="sm" variant="default" className="text-xs h-7" onClick={(e) => handleOpenSellDialog(car.id, e)}>
                    <Tag className="w-3 h-3 mr-1" />
                    {t.sell}
                  </Button>
                ) : null;

                return (
                  <motion.div
                    key={car.id}
                    layout
                    data-tutorial-id="tutorial-car-card"
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 80, scale: 0.9, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
                    transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                  >
                    <CarCard
                      car={car}
                      onClick={() => onSelectCar(car.id)}
                      showDamages={true}
                      actionButton={actionButton}
                      topBadge={topBadge}
                    />
                  </motion.div>
                );
              })}
              </AnimatePresence>
              
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

    <Dialog open={showSellDialog} onOpenChange={setShowSellDialog}>
      <DialogContent className={`max-w-[calc(100vw-2rem)] sm:max-w-sm p-4 ${shakeDialog ? 'anim-shake' : ''}`}>
        <DialogHeader>
          <DialogTitle>{t.listForSale} {sellCar?.name}</DialogTitle>
        </DialogHeader>
        {sellCar && (
          <div className="space-y-3">
            <div className="text-center">
              <img src={sellCar.image} alt={sellCar.name} className="h-20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">{t.carValue}</p>
              <p className="text-2xl font-bold text-primary">
                {formatMoney(Math.round(sellCar.currentValue))}
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
                min={Math.round(sellCar.currentValue * 0.8)}
                max={Math.round(sellCar.currentValue * 1.5)}
                step={50}
              />
            </div>
            <div className="p-3 bg-secondary/80 rounded-lg space-y-1 border-2 border-border">
              <div className="flex justify-between text-sm">
                <span>{t.totalInvested}:</span>
                <span className="font-medium">{formatMoney(sellTotalInvestment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t.potentialProfit}:</span>
                <span className={`font-bold ${sellPrice - sellTotalInvestment > 0 ? 'text-primary' : 'text-destructive'}`}>
                  {formatMoney(sellPrice - sellTotalInvestment)}
                </span>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={handleListForSale} className="w-full">
            <DollarSign className="w-4 h-4 mr-1" />
            {t.listForSale}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    {confetti && <ConfettiBurst onDone={() => setConfetti(false)} />}
    </>
  );
}
