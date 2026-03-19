import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { NewspaperScreen } from './NewspaperScreen';
import { CustomerCard } from '@/components/game/CustomerCard';
import { CarCard } from '@/components/game/CarCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, Newspaper, Phone, PhoneCall, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/useSound';
import { getPatienceRounds } from '@/data/customers';
import officeBg from '@/assets/office-bg.jpg';

type OfficeView = 'hub' | 'newspaper' | 'phone';

interface OfficeScreenProps {
  onCarBought: () => void;
}

export function OfficeScreen({ onCarBought }: OfficeScreenProps) {
  const [view, setView] = useState<OfficeView>('hub');
  const { state, dispatch, getSaleState, handleSaleComplete, hasEnergy } = useGame();
  const { t, formatMoney } = useLanguage();
  const { playSound } = useSound();

  const activeSalesWithCustomer = state.activeSales.filter(s => s.customer);
  const pendingCalls = activeSalesWithCustomer.length;
  const listedCars = state.carsInGarage.filter(c => c.listedForSale);

  const handleCounterOffer = (carId: string) => {
    const saleState = getSaleState(carId);
    if (!saleState?.customer) return;
    const customer = saleState.customer;
    const customerOffer = saleState.customerOffer || 0;
    const negotiationRound = saleState.negotiationRound || 0;
    const maxRounds = getPatienceRounds(customer.patience);

    if (!hasEnergy(2)) return;
    dispatch({ type: 'SPEND_ENERGY', payload: 2 });

    if (customer.patience === 'very_low' || customer.patience === 'low') {
      const leaveChance = customer.patience === 'very_low' ? 0.5 : 0.3;
      if (Math.random() < leaveChance) {
        dispatch({ type: 'CANCEL_SALE', payload: carId });
        return;
      }
    }

    if (negotiationRound >= maxRounds) {
      dispatch({ type: 'CANCEL_SALE', payload: carId });
      return;
    }

    const increase = (saleState.askingPrice - customerOffer) * (0.2 + Math.random() * 0.3) * (1 - customer.bargainSkill * 0.05);
    const newOffer = Math.round(customerOffer + Math.max(increase, 50));
    dispatch({ type: 'UPDATE_SALE_OFFER', payload: { carId, offer: Math.min(newOffer, customer.maxBudget), round: negotiationRound + 1 } });
  };

  if (view === 'newspaper') {
    return (
      <div className="flex flex-col min-h-[100dvh] pb-20">
        <div className="p-3 bg-card/95 backdrop-blur-sm border-b-2 border-border sticky top-0 z-40">
          <Button variant="ghost" size="sm" onClick={() => setView('hub')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> {t.goBack}
          </Button>
        </div>
        <NewspaperScreen onCarBought={onCarBought} />
      </div>
    );
  }

  if (view === 'phone') {
    return (
      <div className="flex flex-col min-h-[100dvh] pb-20 relative">
        <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${officeBg})` }} />
        <div className="relative z-10">
          <div className="p-3 bg-card/95 backdrop-blur-sm border-b-2 border-border sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setView('hub')}>
                <ArrowLeft className="w-4 h-4 mr-1" /> {t.goBack}
              </Button>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-primary" />
                {t.incomingCalls}
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {listedCars.length === 0 ? (
              <div className="text-center py-16 bg-card/90 backdrop-blur-sm rounded-xl border-2 border-dashed border-border">
                <Phone className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <h3 className="font-bold text-lg mb-1">{t.noCallsYet}</h3>
                <p className="text-sm text-muted-foreground px-8">{t.noCallsDesc}</p>
              </div>
            ) : (
              listedCars.map(car => {
                const saleState = getSaleState(car.id);
                const customer = saleState?.customer;
                const customerOffer = saleState?.customerOffer || 0;
                const negotiationRound = saleState?.negotiationRound || 0;

                return (
                  <div key={car.id} className="bg-card/95 backdrop-blur-sm rounded-xl border-2 border-border overflow-hidden">
                    <div className="p-3 border-b border-border">
                      <CarCard car={car} showPrice={false} showDamages={false} compact />
                    </div>

                    <div className="p-3">
                      {!customer ? (
                        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            <span className="text-sm">{t.waitingForBuyer}</span>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => dispatch({ type: 'CANCEL_SALE', payload: car.id })}>
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <CustomerCard
                          customer={customer}
                          offerPrice={customerOffer}
                          onAccept={() => {
                            handleSaleComplete(car.id, customerOffer);
                            playSound('cashRegister');
                          }}
                          onCounter={() => handleCounterOffer(car.id)}
                          onReject={() => dispatch({ type: 'CANCEL_SALE', payload: car.id })}
                          isNegotiating={negotiationRound > 0}
                          negotiationRound={negotiationRound}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // Hub view
  return (
    <div className="flex flex-col min-h-[100dvh] pb-20 relative overflow-hidden">
      <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${officeBg})` }} />

      <div className="relative z-10 flex flex-col min-h-full">
        <div className="p-4 py-5 border-b-2 border-border bg-card/95 backdrop-blur-sm">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            {t.theOffice}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t.officeDeskDesc}</p>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-4 justify-center">
          {/* Newspaper Button */}
          <button
            onClick={() => { setView('newspaper'); playSound('pageChange'); }}
            className="w-full p-8 bg-card/95 backdrop-blur-sm rounded-2xl border-2 border-border hover:border-primary/50 transition-all active:scale-[0.98] flex flex-col items-center gap-3 shadow-lg"
          >
            <Newspaper className="w-16 h-16 text-primary" />
            <span className="text-xl font-bold">{t.browseNewspaper}</span>
            <span className="text-sm text-muted-foreground">{t.findNextProject}</span>
          </button>

          {/* Phone Button */}
          <button
            onClick={() => { if (listedCars.length > 0) { setView('phone'); playSound('pageChange'); } }}
            disabled={listedCars.length === 0}
            className={cn(
              'w-full p-8 bg-card/95 backdrop-blur-sm rounded-2xl border-2 transition-all flex flex-col items-center gap-3 relative shadow-lg',
              listedCars.length > 0
                ? 'border-border hover:border-primary/50 active:scale-[0.98]'
                : 'border-border opacity-50 cursor-not-allowed'
            )}
          >
            {pendingCalls > 0 && (
              <div className="absolute top-4 right-4 w-10 h-10 bg-destructive text-white rounded-full flex items-center justify-center font-bold text-lg animate-pulse shadow-lg">
                {pendingCalls}
              </div>
            )}
            <PhoneCall className={cn(
              'w-16 h-16',
              pendingCalls > 0 ? 'text-green-500 animate-bounce' : 'text-muted-foreground'
            )} />
            <span className="text-xl font-bold">{t.answerPhone}</span>
            <span className="text-sm text-muted-foreground">
              {pendingCalls > 0
                ? `${pendingCalls} ${t.callsWaiting}`
                : listedCars.length > 0
                  ? t.noCallsDesc
                  : t.noCallsDesc}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
