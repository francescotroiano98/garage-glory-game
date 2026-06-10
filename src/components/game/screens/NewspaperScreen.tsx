import { useState, useEffect, useMemo } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CarCard } from '@/components/game/CarCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { generateCar } from '@/data/cars';
import { generateMotorcycle } from '@/data/motorcycles';
import { generateTruck } from '@/data/trucks';
import { NewspaperAd, Car, VehicleCategory } from '@/types/game';
import { CATEGORY_DISPLAY_NAMES } from '@/utils/partTranslations';
import { getCategoriesForLevel } from '@/types/game';
import { getMotoCategoriesForLevel } from '@/data/motorcycles';
import { getTruckCategoriesForLevel } from '@/data/trucks';
import { Newspaper, RefreshCw, DollarSign, Zap, Filter, Search, RotateCcw, ArrowUpDown } from 'lucide-react';
import { useSound } from '@/hooks/useSound';
import { getPartName, getDamageLevelName } from '@/utils/partTranslations';
import newspaperBg from '@/assets/newspaper-bg.jpg';

interface NewspaperScreenProps {
  onCarBought: () => void;
}

const NEGOTIATION_ENERGY_COST = 2;
const INSPECT_ENERGY_COST = 2;

type VehicleTypeFilter = 'all' | 'car' | 'motorcycle' | 'truck';
type SortMode = 'default' | 'price_asc' | 'price_desc' | 'name_asc';

// Filter persistence — survives screen unmount AND app restart via localStorage.
const NEWSPAPER_FILTER_KEY = 'newspaper_filters_v1';
interface NewspaperFilterState {
  type: VehicleTypeFilter;
  category: string;
  priceMax: number; // 0 = any
  sort: SortMode;
}
const DEFAULT_FILTER_STATE: NewspaperFilterState = {
  type: 'all',
  category: 'all',
  priceMax: 0,
  sort: 'default',
};
function loadFilterState(): NewspaperFilterState {
  try {
    const raw = localStorage.getItem(NEWSPAPER_FILTER_KEY);
    if (!raw) return { ...DEFAULT_FILTER_STATE };
    return { ...DEFAULT_FILTER_STATE, ...JSON.parse(raw) };
  } catch { return { ...DEFAULT_FILTER_STATE }; }
}
function saveFilterState(s: NewspaperFilterState) {
  try { localStorage.setItem(NEWSPAPER_FILTER_KEY, JSON.stringify(s)); } catch {}
}
const FILTER_STORE: NewspaperFilterState = loadFilterState();

/** Generate price ceiling options that scale with player level. */
function getPriceCeilings(level: number): number[] {
  // Roughly: level 1 caps ~$1k, scales geometrically up to supercars at level 20.
  // Bands are coarse so the dropdown stays short (max ~8 options).
  const allBands = [500, 1_000, 2_500, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000, 5_000_000];
  // Pick a top band scaled by level (~doubles every 2 levels)
  const topIdx = Math.min(allBands.length - 1, Math.max(2, Math.floor(level / 1.8) + 2));
  // Show 6 bands centered around topIdx, plus the top band
  const startIdx = Math.max(0, topIdx - 5);
  return allBands.slice(startIdx, topIdx + 1);
}

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
  const [typeFilter, setTypeFilterRaw] = useState<VehicleTypeFilter>(FILTER_STORE.type);
  const [categoryFilter, setCategoryFilterRaw] = useState<string>(FILTER_STORE.category);
  const [priceMin, setPriceMinRaw] = useState<number>(FILTER_STORE.priceMin);
  const [priceMax, setPriceMaxRaw] = useState<number>(FILTER_STORE.priceMax);
  const [sortMode, setSortModeRaw] = useState<SortMode>(FILTER_STORE.sort);

  const setTypeFilter = (v: VehicleTypeFilter) => { FILTER_STORE.type = v; setTypeFilterRaw(v); };
  const setCategoryFilter = (v: string) => { FILTER_STORE.category = v; setCategoryFilterRaw(v); };
  const setPriceMin = (v: number) => { FILTER_STORE.priceMin = v; setPriceMinRaw(v); };
  const setPriceMax = (v: number) => { FILTER_STORE.priceMax = v; setPriceMaxRaw(v); };
  const setSortMode = (v: SortMode) => { FILTER_STORE.sort = v; setSortModeRaw(v); };

  const resetFilters = () => {
    setTypeFilter('all');
    setCategoryFilter('all');
    setPriceMin(0);
    setPriceMax(1_000_000);
    setSortMode('default');
  };
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
    const filtered = ads.filter(ad => {
      const vType = ad.car.vehicleType || 'car';
      if (typeFilter !== 'all' && vType !== typeFilter) return false;
      if (categoryFilter !== 'all' && ad.car.category !== categoryFilter) return false;
      if (ad.car.askingPrice < priceMin) return false;
      if (ad.car.askingPrice > priceMax) return false;
      return true;
    });
    switch (sortMode) {
      case 'price_asc': return [...filtered].sort((a, b) => a.car.askingPrice - b.car.askingPrice);
      case 'price_desc': return [...filtered].sort((a, b) => b.car.askingPrice - a.car.askingPrice);
      case 'name_asc': return [...filtered].sort((a, b) => a.car.name.localeCompare(b.car.name));
      default: return filtered;
    }
  }, [ads, typeFilter, categoryFilter, priceMin, priceMax, sortMode]);

  // Compute dynamic price bounds from current ads
  const adsMaxPrice = useMemo(() => {
    if (ads.length === 0) return 1_000_000;
    return Math.max(...ads.map(a => a.car.askingPrice));
  }, [ads]);

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
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="flex gap-1 flex-wrap">
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
              <SelectTrigger className="h-7 text-xs w-[130px]">
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
            <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
              <SelectTrigger className="h-7 text-xs w-[130px]">
                <ArrowUpDown className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{language === 'it' ? 'Predefinito' : 'Default'}</SelectItem>
                <SelectItem value="price_asc">{language === 'it' ? 'Prezzo ↑' : 'Price ↑'}</SelectItem>
                <SelectItem value="price_desc">{language === 'it' ? 'Prezzo ↓' : 'Price ↓'}</SelectItem>
                <SelectItem value="name_asc">{language === 'it' ? 'Nome A-Z' : 'Name A-Z'}</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={resetFilters}>
              <RotateCcw className="w-3 h-3 mr-1" />
              {language === 'it' ? 'Reset' : 'Reset'}
            </Button>
          </div>

          {/* Price range */}
          <div className="mt-3 px-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
              <span>{language === 'it' ? 'Prezzo' : 'Price'}</span>
              <span className="font-medium text-foreground">
                {formatMoney(priceMin)} — {priceMax >= 1_000_000 ? '∞' : formatMoney(priceMax)}
              </span>
            </div>
            <Slider
              value={[priceMin, Math.min(priceMax, Math.max(adsMaxPrice, 1000))]}
              min={0}
              max={Math.max(adsMaxPrice, 1000)}
              step={Math.max(50, Math.round(Math.max(adsMaxPrice, 1000) / 100))}
              onValueChange={([min, max]) => {
                setPriceMin(min);
                setPriceMax(max >= adsMaxPrice ? 1_000_000 : max);
              }}
            />
          </div>
        </div>
        <div className={`overflow-y-auto p-4 space-y-4 ${
                            garageFull
                              ? "h-[calc(100svh-490px)]"
                              : "h-[calc(100svh-470px)]"
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
