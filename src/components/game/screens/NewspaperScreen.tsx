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
import { NewspaperAd, Car, VehicleCategory } from '@/types/game';
import { CATEGORY_DISPLAY_NAMES } from '@/utils/partTranslations';
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
const INSPECT_ENERGY_COST = 2;

type VehicleTypeFilter = 'all' | 'car' | 'motorcycle' | 'truck';

interface VehicleDetailDialogProps {
  ad: NewspaperAd | null;
  onClose: () => void;
  negotiatePrice: number;
  setNegotiatePrice: (v: number) => void;
  isNegotiating: boolean;
  negotiationCount: number;
  onNegotiate: () => void;
  onBuy: (price: number) => void;
  garageFull: boolean;
  canAfford: (amount: number) => boolean;
  hasEnergy: (amount: number) => boolean;
  getVisibilityChance: () => number;
  formatMoney: (n: number) => string;
  t: Record<string, any>;
}

function VehicleDetailDialog({
  ad, onClose, negotiatePrice, setNegotiatePrice, isNegotiating, negotiationCount,
  onNegotiate, onBuy, garageFull, canAfford, hasEnergy, getVisibilityChance, formatMoney, t,
}: VehicleDetailDialogProps) {
  const [inspected, setInspected] = useState(false);
  const [revealedDamages, setRevealedDamages] = useState<string[]>([]);
  const { playSound } = useSound();
  const { state, dispatch } = useGame();

  // Reset inspection state when dialog changes
  useEffect(() => {
    setInspected(false);
    setRevealedDamages([]);
  }, [ad?.id]);

  // Calculate reveal percentage based on player level
  const getRevealPercent = () => {
    const level = state.level;
    if (level >= 15) return 1.0;
    if (level >= 10) return 0.7;
    if (level >= 5) return 0.5;
    return 0.3;
  };

  const handleInspect = () => {
    if (!ad || !hasEnergy(INSPECT_ENERGY_COST)) return;
    dispatch({ type: 'SPEND_ENERGY', payload: INSPECT_ENERGY_COST });
    playSound('inspect');

    const hiddenDamages = ad.car.damages.filter(d => !d.visible && !d.repaired);
    const revealPercent = getRevealPercent();
    const revealCount = Math.min(Math.ceil(hiddenDamages.length * revealPercent), hiddenDamages.length);
    const shuffled = [...hiddenDamages].sort(() => Math.random() - 0.5);
    const revealed = shuffled.slice(0, revealCount).map(d => d.part);
    setRevealedDamages(revealed);
    setInspected(true);
  };

  if (!ad) return null;

  const visibleDamages = ad.car.damages.filter(d => !d.repaired && (d.visible || revealedDamages.includes(d.part)));
  const totalUnrepaired = ad.car.damages.filter(d => !d.repaired).length;
  const hiddenCount = totalUnrepaired - visibleDamages.length;

  return (
    <Dialog open={!!ad} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-sm p-3 max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-base">{t.buy} {ad.car.name}?</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {/* Vehicle image & basic info */}
          <div className="flex items-center gap-3">
            <img src={ad.car.image} alt={ad.car.name} className="w-16 h-16 object-contain shrink-0 rounded-lg" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{ad.car.name}</p>
              <p className="text-lg font-bold text-primary">{formatMoney(ad.car.askingPrice)}</p>
              {!!ad.car.collectionBonus && (
                <p className="text-[10px] font-bold text-yellow-500">
                  🏆 Collection bonus −{Math.round((ad.car.collectionBonus || 0) * 100)}%
                </p>
              )}
            </div>
          </div>

          {/* Visible damages */}
          {visibleDamages.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">{t.issuesFound}:</p>
              <div className="grid grid-cols-2 gap-1">
                {visibleDamages.map((d, i) => (
                  <div key={i} className="flex items-center justify-between px-2 py-1 bg-destructive/10 rounded border border-destructive/20 text-xs">
                    <span className="truncate">{getPartName(d.part, t)}</span>
                    <Badge variant="outline" className="text-[10px] ml-1 shrink-0 border-destructive/30 text-destructive px-1">
                      {getDamageLevelName(d.level, t)}
                    </Badge>
                  </div>
                ))}
              </div>
              {hiddenCount > 0 && (
                <p className="text-xs text-muted-foreground text-center">+ {hiddenCount} {t.hiddenIssuesText}</p>
              )}
            </div>
          )}

          {/* Inspect button */}
          {!inspected && totalUnrepaired > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs border-2"
              onClick={handleInspect}
              disabled={!hasEnergy(INSPECT_ENERGY_COST)}
            >
              <Search className="w-3 h-3 mr-1" />
              {t.inspectCost} ({Math.round(getRevealPercent() * 100)}%)
              <span className="ml-1 flex items-center">(<Zap className="w-3 h-3" />{INSPECT_ENERGY_COST})</span>
            </Button>
          )}

          {inspected && revealedDamages.length === 0 && (
            <p className="text-xs text-center text-muted-foreground py-1">{t.noIssuesFound}</p>
          )}

          {/* Negotiate section */}
          {ad.negotiable && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>{t.yourOffer}:</span>
                <span className="font-bold text-primary">{formatMoney(negotiatePrice)}</span>
              </div>
              <Slider
                value={[negotiatePrice]}
                onValueChange={([v]) => setNegotiatePrice(v)}
                min={Math.max(10, Math.round(ad.car.askingPrice * 0.7))}
                max={ad.car.askingPrice}
                step={Math.max(1, Math.round(ad.car.askingPrice * 0.01))}
              />
              {negotiationCount > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  {t.negotiations}: {negotiationCount}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t.yourBalance}:</span>
            <span className={canAfford(negotiatePrice) ? 'text-primary font-bold' : 'text-destructive font-bold'}>
              {formatMoney(state.money)}
            </span>
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-1">
          {ad.negotiable && (
            <Button
              variant="outline"
              onClick={onNegotiate}
              className="flex-1 border-2"
              disabled={!hasEnergy(NEGOTIATION_ENERGY_COST)}
              size="sm"
            >
              <DollarSign className="w-3 h-3 mr-1" />
              {t.negotiate}
              <span className="ml-1 text-xs flex items-center">(<Zap className="w-3 h-3" />{NEGOTIATION_ENERGY_COST})</span>
            </Button>
          )}
          <Button
            onClick={() => onBuy(isNegotiating ? negotiatePrice : ad.car.askingPrice)}
            disabled={!canAfford(negotiatePrice) || garageFull}
            className="flex-1"
            size="sm"
            data-tutorial-id="tutorial-buy-now-btn"
          >
            {t.buyNow}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NewspaperScreen({ onCarBought }: NewspaperScreenProps) {
  const { state, dispatch, canAfford, hasEnergy, getVisibilityChance, getNegotiationBonus, updateChallengeProgress } = useGame();
  const { t, language, formatMoney } = useLanguage();
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
    <div className="flex flex-col h-[100svh] pb-20 relative">
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${newspaperBg})` }}
      />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="p-4 py-5 border-b-2 border-border bg-card/95 backdrop-blur-sm shrink-0 sticky top-0 z-40">
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
                    {CATEGORY_DISPLAY_NAMES[language][cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className={`overflow-y-auto p-4 space-y-4 ${
                            garageFull
                              ? "h-[calc(100svh-420px)]"
                              : "h-[calc(100svh-400px)]"
                        }`}>
          {garageFull && (
          <div className="mx-4 mt-4 p-3 bg-destructive/20 border-2 border-destructive/50 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-destructive font-medium">
              {t.garageFullMessage}
            </p>
          </div>
          )}
          <div className="p-4 space-y-3">
            {filteredAds.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-card/80 rounded-lg backdrop-blur-sm">
                <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No vehicles match your filters</p>
              </div>
            ) : (
              filteredAds.map((ad, idx) => (
                <div key={ad.id} className="relative" data-tutorial-id={idx === 0 ? 'tutorial-vehicle-listing' : undefined}>
                  <CarCard
                    car={ad.car}
                    onClick={() => handleSelectAd(ad)}
                    showDamages={false}
                  />
                  {!!ad.car.collectionBonus && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] bg-yellow-500/90 text-black px-1.5 py-0.5 rounded-md font-bold border border-yellow-300 shadow">
                      🏆 -{Math.round((ad.car.collectionBonus || 0) * 100)}%
                    </div>
                  )}
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
