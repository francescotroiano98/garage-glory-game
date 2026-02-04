import { useState, useEffect, Component, ReactNode } from 'react';
import { GameProvider } from '@/contexts/GameContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { StatsBar } from '@/components/game/StatsBar';
import { BottomNav, Screen } from '@/components/game/BottomNav';
import { GarageScreen } from '@/components/game/screens/GarageScreen';
import { NewspaperScreen } from '@/components/game/screens/NewspaperScreen';
import { RepairScreen } from '@/components/game/screens/RepairScreen';
import { ShopScreen } from '@/components/game/screens/ShopScreen';
import { SettingsScreen } from '@/components/game/screens/SettingsScreen';
import { TutorialOverlay } from '@/components/game/TutorialOverlay';
import { useBackgroundMusic } from '@/hooks/useSound';

// Error Boundary to handle context errors gracefully
class GameErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Game Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-4">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary text-primary-foreground px-4 py-2 rounded"
            >
              Reload Game
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <GameErrorBoundary>
      <LanguageProvider>
        <GameProvider>
          <GameContent />
        </GameProvider>
      </LanguageProvider>
    </GameErrorBoundary>
  );
};

export default Index;
