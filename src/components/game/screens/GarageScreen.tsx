import { useGame } from '@/contexts/GameContext';
import { CarCard } from '@/components/game/CarCard';
import { Button } from '@/components/ui/button';
import { Car as CarIcon, Plus, Wrench } from 'lucide-react';

interface GarageScreenProps {
  onNavigateToNewspaper: () => void;
  onSelectCar: (carId: string) => void;
}

export function GarageScreen({ onNavigateToNewspaper, onSelectCar }: GarageScreenProps) {
  const { state } = useGame();
  const { carsInGarage, garageUpgrades } = state;
  const emptySlots = garageUpgrades.carBays - carsInGarage.length;

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header */}
      <div className="p-4 border-b border-border">
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

      {/* Cars List */}
      <div className="flex-1 p-4">
        {carsInGarage.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <CarIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-2">No Cars Yet</h2>
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
            {carsInGarage.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onClick={() => onSelectCar(car.id)}
                showDamages={true}
              />
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="border-2 border-dashed border-border rounded-lg p-8 flex items-center justify-center"
              >
                <span className="text-muted-foreground text-sm">Empty Bay</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Import for the empty state button
import { Newspaper } from 'lucide-react';
