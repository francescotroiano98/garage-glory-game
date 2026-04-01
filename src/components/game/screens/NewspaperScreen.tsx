import { useState, useEffect, useMemo } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CarCard } from '@/components/game/CarCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateCar } from '@/data/cars';
import { generateMotorcycle } from '@/data/motorcycles';
import { generateTruck } from '@/data/trucks';
import { NewspaperAd, Car, CATEGORY_NAMES, VehicleCategory } from '@/types/game';
import { getCategoriesForLevel } from '@/types/game';
import { getMotoCategoriesForLevel } from '@/data/motorcycles';
import { getTruckCategoriesForLevel } from '@/data/trucks';
import { Newspaper, RefreshCw, DollarSign, Zap, Filter, Search } from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import { getPartName, getDamageLevelName } from '@/utils/partTranslations';
import newspaperBg from '@/assets/newspaper-bg.jpg';

interface NewspaperScreenProps {
  onCarBought: () => void;
}

const NEGOTIATION_ENERGY_COST = 2;

type VehicleTypeFilter = 'all' | 'car' | 'motorcycle' | 'truck';

export function NewspaperScreen({ onCarBought }: NewspaperScreenProps) {
  const { state, dispatch, canAfford, hasEnergy, getVisibilityChance, getNegotiationBonus, updateChallengeProgress } = useGame();
  const { t, formatMoney } = useLanguage();
  const [ads, setAds] = useState<NewspaperAd[]>([]);
  const [selectedAd, setSelectedAd] = useState<NewspaperAd | null>(null);
  const [negotiatePrice, setNegotiatePrice] = useState(0);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiationCount, setNegotiationCount] = useState(0);
  const [typeFilter, setTypeFilter] = useState<VehicleTypeFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { playSound } = useSound();

  useEffect(() => {
    refreshAds();
  }, [state.level]);

  const refreshAds = () => {
    const newAds: NewspaperAd[] = Array.from({ length: 8 }, (_, i) => {
      let vehicle: Car;
      if (i < 2) {
        vehicle = generateMotorcycle(state.level);
      } else if (i < 4) {
        vehicle = generateTruck(state.level);
      } else {
        vehicle = generateCar(state.level);
      }
      return {
        id: `ad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        car: vehicle,
        seller: '',
        daysListed: Math.floor(Math.random() * 7) + 1,
        negotiable: Math.random() > 0.3,
      };
    });
    setAds(newAds);
    setNegotiationCount(0);
  };

  // Available categories for the filter dropdown
  const availableCategories = useMemo(() => {
    const cats: VehicleCategory[] = [];
    if (typeFilter === 'all' || typeFilter === 'car') {
      cats.push(...getCategoriesForLevel(state.level));
    }
    if (typeFilter === 'all' || typeFilter === 'motorcycle') {
      cats.push(...getMotoCategoriesForLevel(state.level));
    }
    if (typeFilter === 'all' || typeFilter === 'truck') {
      cats.push(...getTruckCategoriesForLevel(state.level));
    }
    return cats;
  }, [state.level, typeFilter]);

  // Filter ads
  const filteredAds = useMemo(() => {
    return ads.filter(ad => {
      const vType = ad.car.vehicleType || 'car';
      if (typeFilter !== 'all' && vType !== typeFilter) return false;
      if (categoryFilter !== 'all' && ad.car.category !== categoryFilter) return false;
      return true;
    });
  }, [ads, typeFilter, categoryFilter]);

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
    playSound('negotiate');
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

          {/* Filters */}
          <div className="flex gap-2 mt-3">
            <div className="flex gap-1">
              {(['all', 'car', 'motorcycle', 'truck'] as VehicleTypeFilter[]).map(type => (
                <Button
                  key={type}
                  size="sm"
                  variant={typeFilter === type ? 'default' : 'outline'}
                  className="text-xs h-7 px-2"
                  onClick={() => { setTypeFilter(type); setCategoryFilter('all'); }}
                >
                  {type === 'all' ? t.allVehicles : type === 'car' ? `🚗 ${t.cars}` : type === 'motorcycle' ? `🏍️ ${t.motorcycles}` : `🚛 ${t.trucks}`}
                </Button>
              ))}
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-7 text-xs w-[140px]">
                <SelectValue placeholder={t.allCategories} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allCategories}</SelectItem>
                {availableCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_NAMES[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          {filteredAds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-card/80 rounded-lg backdrop-blur-sm">
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No vehicles match your filters</p>
            </div>
          ) : (
            filteredAds.map((ad) => (
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
            ))
          )}
        </div>
      </div>

      <VehicleDetailDialog
        ad={selectedAd}
        onClose={() => setSelectedAd(null)}
        negotiatePrice={negotiatePrice}
        setNegotiatePrice={setNegotiatePrice}
        isNegotiating={isNegotiating}
        negotiationCount={negotiationCount}
        onNegotiate={handleNegotiate}
        onBuy={handleBuy}
        garageFull={garageFull}
        canAfford={canAfford}
        hasEnergy={hasEnergy}
        getVisibilityChance={getVisibilityChance}
        formatMoney={formatMoney}
        t={t}
      />
    </div>
  );
}
