import { useGame } from '@/contexts/GameContext';
import { CarCard } from '@/components/game/CarCard';
import { Button } from '@/components/ui/button';
import { Car as CarIcon, Plus, Wrench, Loader2, DollarSign, Clock } from 'lucide-react';
import { Newspaper } from 'lucide-react';
import garageBg from '@/assets/garage-bg.jpg';
import { toast } from 'sonner';

interface GarageScreenProps {
  onNavigateToNewspaper: () => void;
  onSelectCar: (carId: string) => void;
}

export function GarageScreen({ onNavigateToNewspaper, onSelectCar }: GarageScreenProps) {
  const { state, dispatch, getSaleState } = useGame();
  const { carsInGarage, garageUpgrades, repairQueue, activeSales } = state;
  const emptySlots = garageUpgrades.carBays - carsInGarage.length;

  const handleStartSale = (carId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const car = carsInGarage.find(c => c.id === carId);
    if (!car) return;
    
    // Check if car has damages
    const hasDamages = car.damages.some(d => !d.repaired);
    if (hasDamages) {
      toast.error("Repair all damages before selling!");
      return;
    }
    
    dispatch({ type: 'LIST_CAR_FOR_SALE', payload: { carId, askingPrice: car.currentValue } });
    toast.success("Car listed for sale! Waiting for customers...");
  };

  const handleAcceptOffer = (carId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const saleState = getSaleState(carId);
    if (!saleState?.customer || !saleState.customerOffer) return;
    
    dispatch({ type: 'SELL_CAR', payload: { carId, salePrice: saleState.customerOffer } });
    toast.success(`Sold for $${saleState.customerOffer.toLocaleString()}!`);
  };

  const handleRejectOffer = (carId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'CANCEL_SALE', payload: carId });
    toast.info("Customer left. You can relist the car.");
  };

  const handleCancelSale = (carId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'CANCEL_SALE', payload: carId });
    toast.info("Sale cancelled");
  };

  return (
    <div className="flex flex-col min-h-full pb-20 relative">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${garageBg})` }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="p-4 border-b-2 border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                My Garage
              </h1>
              <p className="text-sm text-muted-foreground">
                {carsInGarage.length}/{garageUpgrades.carBays} car{garageUpgrades.carBays !== 1 ? 's' : ''} in garage
              </p>
            </div>
            <Button onClick={onNavigateToNewspaper} size="sm" disabled={emptySlots === 0}>
              <Plus className="w-4 h-4 mr-1" />
              Buy Car
            </Button>
          </div>
        </div>

        {/* Active repairs indicator */}
        {repairQueue.length > 0 && (
          <div className="mx-4 mt-4 p-3 bg-accent/20 border-2 border-accent/30 rounded-lg flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
            <span className="text-sm font-medium">
              {repairQueue.length} repair{repairQueue.length !== 1 ? 's' : ''} in progress
            </span>
          </div>
        )}

        {/* Cars List */}
        <div className="flex-1 p-4">
          {carsInGarage.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center bg-card/80 backdrop-blur-sm rounded-xl border-2 border-dashed border-border">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <CarIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-bold mb-2">No Cars Yet</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Browse newspaper ads to find your first car to repair!
              </p>
              <Button onClick={onNavigateToNewspaper}>
                <Newspaper className="w-4 h-4 mr-2" />
                Browse Ads
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {carsInGarage.map((car) => {
                const saleState = getSaleState(car.id);
                const isWaitingForCustomer = saleState && !saleState.customer;
                const hasCustomer = saleState?.customer;
                const hasDamages = car.damages.some(d => !d.repaired);
                const isInSale = !!saleState;
                
                // Build action button based on sale state
                const actionButton = (() => {
                  if (!isInSale) {
                    return (
                      <Button
                        size="sm"
                        variant={hasDamages ? "secondary" : "default"}
                        onClick={(e) => handleStartSale(car.id, e)}
                        disabled={hasDamages}
                        className="shadow-lg"
                      >
                        <DollarSign className="w-3 h-3 mr-1" />
                        Sell
                      </Button>
                    );
                  }
                  if (isWaitingForCustomer) {
                    return (
                      <div className="flex gap-1">
                        <Button size="sm" variant="secondary" className="animate-pulse" disabled>
                          <Clock className="w-3 h-3 mr-1 animate-spin" />
                          Waiting...
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => handleCancelSale(car.id, e)}>
                          ✕
                        </Button>
                      </div>
                    );
                  }
                  if (hasCustomer) {
                    return (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={(e) => handleAcceptOffer(car.id, e)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          ✓ ${saleState.customerOffer?.toLocaleString()}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={(e) => handleRejectOffer(car.id, e)}>
                          ✕
                        </Button>
                      </div>
                    );
                  }
                  return null;
                })();

                // Build top badge for customer info
                const topBadge = hasCustomer ? (
                  <div className="px-2 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground animate-pulse">
                    🔔 {saleState.customer?.avatar} {saleState.customer?.name}
                  </div>
                ) : null;

                return (
                  <CarCard
                    key={car.id}
                    car={car}
                    onClick={() => onSelectCar(car.id)}
                    showDamages={true}
                    actionButton={actionButton}
                    topBadge={topBadge}
                  />
                );
              })}
              
              {/* Empty slots */}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="border-2 border-dashed border-border rounded-xl p-8 flex items-center justify-center bg-card/50"
                >
                  <span className="text-muted-foreground text-sm font-medium">Empty Bay</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
