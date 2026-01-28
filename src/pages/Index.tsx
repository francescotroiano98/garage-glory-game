import { useState, useEffect } from 'react';
import { GameProvider, useGame } from '@/contexts/GameContext';
import { StatsBar } from '@/components/game/StatsBar';
import { BottomNav, Screen } from '@/components/game/BottomNav';
import { GarageScreen } from '@/components/game/screens/GarageScreen';
import { NewspaperScreen } from '@/components/game/screens/NewspaperScreen';
import { RepairScreen } from '@/components/game/screens/RepairScreen';
import { ShopScreen } from '@/components/game/screens/ShopScreen';
import { SettingsScreen } from '@/components/game/screens/SettingsScreen';
import { TutorialOverlay } from '@/components/game/TutorialOverlay';
import { useBackgroundMusic } from '@/hooks/useSound';

const TUTORIAL_KEY = 'car_mechanic_tutorial_done';

function GameContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('garage');
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Initialize background music
  useBackgroundMusic();

  // Check if tutorial should show
  useEffect(() => {
    const tutorialDone = localStorage.getItem(TUTORIAL_KEY);
    if (!tutorialDone) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem(TUTORIAL_KEY, 'true');
    setShowTutorial(false);
  };

  const handleSelectCar = (carId: string) => {
    setSelectedCarId(carId);
  };

  const handleBackFromRepair = () => {
    setSelectedCarId(null);
  };

  const handleCarBought = () => {
    setCurrentScreen('garage');
  };

  // If a car is selected, show repair screen
  if (selectedCarId) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <StatsBar />
        <div className="flex-1 overflow-auto">
          <RepairScreen carId={selectedCarId} onBack={handleBackFromRepair} />
        </div>
        {showTutorial && <TutorialOverlay onComplete={handleTutorialComplete} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StatsBar />
      <div className="flex-1 overflow-auto">
        {currentScreen === 'garage' && (
          <GarageScreen 
            onNavigateToNewspaper={() => setCurrentScreen('newspaper')} 
            onSelectCar={handleSelectCar}
          />
        )}
        {currentScreen === 'newspaper' && (
          <NewspaperScreen onCarBought={handleCarBought} />
        )}
        {currentScreen === 'shop' && <ShopScreen />}
        {currentScreen === 'settings' && <SettingsScreen />}
      </div>
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      {showTutorial && <TutorialOverlay onComplete={handleTutorialComplete} />}
    </div>
  );
}

const Index = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default Index;
