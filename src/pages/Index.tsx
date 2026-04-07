import { useState, useEffect, Component, ReactNode } from 'react';
import { GameProvider, useGame } from '@/contexts/GameContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { StatsBar } from '@/components/game/StatsBar';
import { BottomNav, Screen } from '@/components/game/BottomNav';
import { GarageScreen } from '@/components/game/screens/GarageScreen';
import { OfficeScreen } from '@/components/game/screens/OfficeScreen';
import { RepairScreen } from '@/components/game/screens/RepairScreen';
import { ShopScreen } from '@/components/game/screens/ShopScreen';
import { CollectionScreen } from '@/components/game/screens/CollectionScreen';
import { SettingsScreen } from '@/components/game/screens/SettingsScreen';
import { LeaderboardScreen } from '@/components/game/screens/LeaderboardScreen';
import { WelcomeScreen } from '@/components/game/screens/WelcomeScreen';
import { TutorialOverlay } from '@/components/game/TutorialOverlay';
import { useBackgroundMusic } from '@/hooks/useSound';

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
            <button onClick={() => window.location.reload()} className="bg-primary text-primary-foreground px-4 py-2 rounded">
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
const WELCOME_KEY = 'car_mechanic_welcome_done';

// Syncs game state to profile DB
function ProfileSync() {
  const { state } = useGame();
  const { user, updateProfile } = useAuth();

  useEffect(() => {
    if (!user) return;
    const timeout = setTimeout(() => {
      updateProfile({
        total_profit: state.totalProfit,
        total_cars_sold: state.totalCarsSold,
        level: state.level,
      });
    }, 5000); // Debounce 5s
    return () => clearTimeout(timeout);
  }, [user, state.totalProfit, state.totalCarsSold, state.level]);

  return null;
}

function GameContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('garage');
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useBackgroundMusic();

  useEffect(() => {
    const welcomeDone = localStorage.getItem(WELCOME_KEY);
    if (!welcomeDone) {
      setShowWelcome(true);
    } else {
      const tutorialDone = localStorage.getItem(TUTORIAL_KEY);
      if (!tutorialDone) {
        setShowTutorial(true);
      }
    }
  }, []);

  const handleWelcomeComplete = (wantTutorial: boolean) => {
    localStorage.setItem(WELCOME_KEY, 'true');
    setShowWelcome(false);
    if (wantTutorial) {
      setShowTutorial(true);
    } else {
      localStorage.setItem(TUTORIAL_KEY, 'true');
    }
  };

  const handleTutorialComplete = () => {
    localStorage.setItem(TUTORIAL_KEY, 'true');
    setShowTutorial(false);
  };

  const handleSelectCar = (carId: string) => setSelectedCarId(carId);
  const handleBackFromRepair = () => setSelectedCarId(null);
  const handleCarBought = () => setCurrentScreen('garage');

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  if (selectedCarId) {
    return (
      <div className="h-[100svh] bg-background flex flex-col overflow-hidden">
        <StatsBar onOpenSettings={() => { setSelectedCarId(null); setCurrentScreen('settings'); }} />
        <div className="flex-1 min-h-0">
          <RepairScreen
            carId={selectedCarId}
            onBack={handleBackFromRepair}
            onNavigateToOffice={() => {
              setSelectedCarId(null);
              setCurrentScreen('office');
            }}
          />
        </div>
        {showTutorial && <TutorialOverlay onComplete={handleTutorialComplete} />}
      </div>
    );
  }

  return (
    <div className="h-[100svh] bg-background flex flex-col overflow-hidden">
      <StatsBar onOpenSettings={() => setCurrentScreen('settings')} />
      <div className="flex-1 min-h-0">
        {currentScreen === 'garage' && (
          <GarageScreen
            onNavigateToOffice={() => setCurrentScreen('office')}
            onSelectCar={handleSelectCar}
          />
        )}
        {currentScreen === 'office' && (
          <OfficeScreen onCarBought={handleCarBought} />
        )}
        {currentScreen === 'shop' && <ShopScreen />}
        {currentScreen === 'collection' && <CollectionScreen />}
        {currentScreen === 'leaderboard' && <LeaderboardScreen />}
        {currentScreen === 'settings' && <SettingsScreen />}
      </div>
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      {showTutorial && <TutorialOverlay onComplete={handleTutorialComplete} />}
      <ProfileSync />
    </div>
  );
}

const Index = () => (
  <GameErrorBoundary>
    <LanguageProvider>
      <AuthProvider>
        <GameProvider>
          <GameContent />
        </GameProvider>
      </AuthProvider>
    </LanguageProvider>
  </GameErrorBoundary>
);

export default Index;
