import { useState, useEffect, useMemo, useCallback } from 'react';
import { Album, Sparkles, Star, Filter, Coins, Package, Recycle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/hooks/useSound';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  CollectionState, loadCollection, saveCollection,
  parseCardId, getCardName, getCollectionStats,
  sellDuplicate, sellAllDuplicates, CARD_SELL_VALUES, CardRarity,
  ALL_CARD_CATEGORIES,
} from '@/data/cards';
import { CATEGORY_NAMES, VehicleCategory } from '@/types/game';
import { CAR_IMAGES } from '@/data/cars';
import { MOTO_IMAGES } from '@/data/motorcycles';
import { TRUCK_IMAGES } from '@/data/trucks';

function getCardImage(category: VehicleCategory, variant: number): string | undefined {
  const carImages = CAR_IMAGES[category as keyof typeof CAR_IMAGES];
  if (carImages) return carImages[variant - 1];
  const motoImages = MOTO_IMAGES[category as keyof typeof MOTO_IMAGES];
  if (motoImages) return motoImages[variant - 1];
  const truckImages = TRUCK_IMAGES[category as keyof typeof TRUCK_IMAGES];
  if (truckImages) return truckImages[variant - 1];
  return undefined;
}

const RARITY_STYLES: Record<CardRarity, string> = {
  base: 'border-border bg-card card-sheen',
  reverse: 'border-blue-400 bg-gradient-to-br from-blue-500/15 to-purple-500/15 card-holo card-sheen',
  gold: 'border-yellow-400 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 card-gold card-sheen',
};

const RARITY_LABEL: Record<CardRarity, string> = {
  base: 'Base',
  reverse: 'Reverse ✨',
  gold: 'Gold 🏆',
};

type FilterTab = 'all' | 'cars' | 'moto' | 'trucks';

export function CollectionScreen() {
  const { t, language, formatMoney } = useLanguage();
  const { dispatch, updateChallengeProgress } = useGame();
  const { playSound } = useSound();
  const [collection, setCollection] = useState<CollectionState>(loadCollection);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [rarityFilter, setRarityFilter] = useState<CardRarity | 'all'>('all');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showSellAllConfirm, setShowSellAllConfirm] = useState(false);

  // Sync collection from localStorage on focus
  useEffect(() => {
    const onFocus = () => setCollection(loadCollection());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Also reload when component mounts (in case shop purchased a pack)
  useEffect(() => {
    setCollection(loadCollection());
  }, []);

  const stats = useMemo(() => getCollectionStats(collection), [collection]);

  const filteredCategories = useMemo(() => {
    return ALL_CARD_CATEGORIES.filter(cat => {
      if (filter === 'all') return true;
      if (filter === 'cars') return !cat.startsWith('moto_') && !cat.startsWith('truck_');
      if (filter === 'moto') return cat.startsWith('moto_');
      if (filter === 'trucks') return cat.startsWith('truck_');
      return true;
    });
  }, [filter]);

  // Build grid of all cards (10 variants x 3 rarities per category)
  const allCards = useMemo(() => {
    const cards: { id: string; category: VehicleCategory; variant: number; rarity: CardRarity; owned: boolean; quantity: number }[] = [];
    for (const cat of filteredCategories) {
      for (let v = 1; v <= 10; v++) {
        const rarities: CardRarity[] = rarityFilter === 'all' ? ['base', 'reverse', 'gold'] : [rarityFilter];
        for (const r of rarities) {
          const id = `${cat}_${v}_${r}`;
          const owned = collection.ownedCards[id];
          cards.push({ id, category: cat, variant: v, rarity: r, owned: !!owned, quantity: owned?.quantity || 0 });
        }
      }
    }
    return cards;
  }, [filteredCategories, rarityFilter, collection]);

  const ownedCount = allCards.filter(c => c.owned).length;

  const handleSellDuplicate = useCallback((cardId: string) => {
    const result = sellDuplicate(collection, cardId);
    if (!result) return;
    setCollection(result.newState);
    saveCollection(result.newState);
    dispatch({ type: 'ADD_MONEY', payload: result.value });
    playSound('purchase');
    toast.success(`+${formatMoney(result.value)}`);
    updateChallengeProgress('sell_card_duplicates', 1);
    setSelectedCard(null);
  }, [collection, dispatch, playSound, formatMoney, updateChallengeProgress]);

  // Preview total earnings if user sells every duplicate at once
  const sellAllPreview = useMemo(() => {
    let value = 0;
    let count = 0;
    for (const [cardId, owned] of Object.entries(collection.ownedCards)) {
      if (owned.quantity > 1) {
        const extras = owned.quantity - 1;
        const { rarity } = parseCardId(cardId);
        value += CARD_SELL_VALUES[rarity] * extras;
        count += extras;
      }
    }
    return { value, count };
  }, [collection]);

  const handleSellAllDuplicates = useCallback(() => {
    const result = sellAllDuplicates(collection);
    if (result.count === 0) return;
    setCollection(result.newState);
    saveCollection(result.newState);
    dispatch({ type: 'ADD_MONEY', payload: result.value });
    playSound('purchase');
    toast.success(`${language === 'it' ? 'Venduti' : 'Sold'} ${result.count} → +${formatMoney(result.value)}`);
    updateChallengeProgress('sell_card_duplicates', result.count);
    setShowSellAllConfirm(false);
  }, [collection, dispatch, playSound, formatMoney, language, updateChallengeProgress]);

  const selectedCardData = selectedCard ? (() => {
    const { category, variant, rarity } = parseCardId(selectedCard);
    const owned = collection.ownedCards[selectedCard];
    return { category, variant, rarity, owned, image: getCardImage(category, variant) };
  })() : null;

  return (
    <div className="h-full flex flex-col">
      {/* Sticky header */}
      <div className="shrink-0 p-4 pb-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Album className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold">{t.collection}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {stats.completionPercent}%
            </Badge>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[10px]"
              disabled={sellAllPreview.count === 0}
              onClick={() => setShowSellAllConfirm(true)}
            >
              <Recycle className="w-3 h-3 mr-1" />
              {language === 'it' ? 'Vendi doppioni' : 'Sell duplicates'}
              {sellAllPreview.count > 0 && (
                <span className="ml-1 text-primary font-bold">+{formatMoney(sellAllPreview.value)}</span>
              )}
            </Button>
          </div>
        </div>
        <Progress value={stats.completionPercent} className="h-2" />
        <div className="flex gap-2 text-[10px] text-muted-foreground">
          <span>{stats.byRarity.base} Base</span>
          <span>·</span>
          <span className="text-blue-400">{stats.byRarity.reverse} Reverse</span>
          <span>·</span>
          <span className="text-yellow-500">{stats.byRarity.gold} Gold</span>
          <span>·</span>
          <span>{stats.duplicates.length} {t.duplicates}</span>
        </div>

        {/* Filters */}
        <div className="flex gap-1">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)} className="w-full">
            <TabsList className="grid grid-cols-4 h-8">
              <TabsTrigger value="all" className="text-[10px] px-1">{t.allVehicles}</TabsTrigger>
              <TabsTrigger value="cars" className="text-[10px] px-1">{t.auto}</TabsTrigger>
              <TabsTrigger value="moto" className="text-[10px] px-1">{t.moto}</TabsTrigger>
              <TabsTrigger value="trucks" className="text-[10px] px-1">{t.truck}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex gap-1">
          {(['all', 'base', 'reverse', 'gold'] as const).map(r => (
            <Button
              key={r}
              variant={rarityFilter === r ? 'default' : 'outline'}
              size="sm"
              className="h-6 text-[10px] px-2 flex-1"
              onClick={() => setRarityFilter(r)}
            >
              {r === 'all' ? (language === 'it' ? 'Tutte' : 'All') : r === 'base' ? 'Base' : r === 'reverse' ? '✨' : '🏆'}
            </Button>
          ))}
        </div>
      </div>

      {/* Scrollable card grid */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-20">
        <div className="binder-page rounded-xl p-3 grid grid-cols-3 gap-3">
          {allCards.map(card => (
            <button
              key={card.id}
              onClick={() => card.owned && setSelectedCard(card.id)}
              className={`relative aspect-[3/4] rounded-lg border-2 overflow-hidden ${
                card.owned
                  ? `${RARITY_STYLES[card.rarity]} card-3d cursor-pointer`
                  : 'binder-slot border-dashed border-border/30 opacity-70'
              }`}
            >
              {card.owned ? (
                <>
                  <img
                    src={getCardImage(card.category, card.variant)}
                    alt={getCardName(card.category, card.variant)}
                    className="w-full h-full object-cover relative z-[1]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5 z-[2]">
                    <span className="text-[8px] text-white font-medium truncate block">{CATEGORY_NAMES[card.category]}</span>
                  </div>
                  {card.quantity > 1 && (
                    <span className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold z-[3] shadow">
                      {card.quantity}
                    </span>
                  )}
                  {card.rarity === 'gold' && (
                    <Star className="absolute top-0.5 left-0.5 w-3 h-3 text-yellow-300 fill-yellow-400 z-[3] drop-shadow" />
                  )}
                  {card.rarity === 'reverse' && (
                    <Sparkles className="absolute top-0.5 left-0.5 w-3 h-3 text-blue-200 z-[3] drop-shadow" />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-lg text-muted-foreground/50">?</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sell-all duplicates confirmation */}
      <Dialog open={showSellAllConfirm} onOpenChange={setShowSellAllConfirm}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Recycle className="w-4 h-4 text-primary" />
              {language === 'it' ? 'Vendi tutti i doppioni?' : 'Sell all duplicates?'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {language === 'it'
                ? `Verranno venduti ${sellAllPreview.count} doppioni (1 copia di ogni carta resta nella collezione).`
                : `${sellAllPreview.count} duplicate cards will be sold (1 copy of each card stays in your collection).`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between p-2 bg-secondary/40 rounded-md">
            <span className="text-xs text-muted-foreground">
              {language === 'it' ? 'Guadagno totale' : 'Total earnings'}
            </span>
            <span className="font-bold text-primary">{formatMoney(sellAllPreview.value)}</span>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowSellAllConfirm(false)}>
              {language === 'it' ? 'Annulla' : 'Cancel'}
            </Button>
            <Button size="sm" className="flex-1" onClick={handleSellAllDuplicates}>
              <Coins className="w-3 h-3 mr-1" />
              {language === 'it' ? 'Vendi' : 'Sell'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Card detail dialog */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-xs">
          {selectedCardData && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base flex items-center gap-2">
                  {selectedCardData.rarity === 'gold' && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                  {selectedCardData.rarity === 'reverse' && <Sparkles className="w-4 h-4 text-blue-400" />}
                  {getCardName(selectedCardData.category, selectedCardData.variant)}
                </DialogTitle>
              </DialogHeader>
              <div className={`aspect-[4/3] rounded-lg overflow-hidden border-2 ${RARITY_STYLES[selectedCardData.rarity]}`}>
                {selectedCardData.image && (
                  <img src={selectedCardData.image} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex justify-between items-center text-sm">
                <Badge variant={selectedCardData.rarity === 'gold' ? 'default' : 'secondary'} className={
                  selectedCardData.rarity === 'gold' ? 'bg-yellow-500 text-black' : 
                  selectedCardData.rarity === 'reverse' ? 'bg-blue-500 text-white' : ''
                }>
                  {RARITY_LABEL[selectedCardData.rarity]}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  x{selectedCardData.owned?.quantity || 0}
                </span>
              </div>
              {selectedCardData.owned && selectedCardData.owned.quantity > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleSellDuplicate(selectedCard!)}
                >
                  <Coins className="w-4 h-4 mr-2" />
                  {t.sellDuplicate} ({formatMoney(CARD_SELL_VALUES[selectedCardData.rarity])})
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
