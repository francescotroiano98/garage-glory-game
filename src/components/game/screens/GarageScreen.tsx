import { useGame } from '@/contexts/GameContext';
import { CarCard } from '@/components/game/CarCard';
import { Button } from '@/components/ui/button';
import { Car as CarIcon, Plus, Wrench, Loader2 } from 'lucide-react';
import { Newspaper } from 'lucide-react';
import garageBg from '@/assets/garage-bg.jpg';

interface GarageScreenProps {
  onNavigateToNewspaper: () => void;
  onSelectCar: (carId: string) => void;
}

export function GarageScreen({ onNavigateToNewspaper, onSelectCar }: GarageScreenProps) {
  const { state, getSaleState } = useGame();
  const { carsInGarage, garageUpgrades, repairQueue } = state;
  const emptySlots = garageUpgrades.carBays - carsInGarage.length;

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
                
                return (
                  <div key={car.id} className="relative">
                    <CarCard
                      car={car}
                      onClick={() => onSelectCar(car.id)}
                      showDamages={true}
                    />
                    {/* Sale status indicator */}
                    {(isWaitingForCustomer || hasCustomer) && (
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium ${
                        hasCustomer 
                          ? 'bg-primary text-primary-foreground animate-pulse' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {hasCustomer ? '🔔 Customer waiting!' : '⏳ Listed for sale'}
                      </div>
                    )}
                  </div>
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
