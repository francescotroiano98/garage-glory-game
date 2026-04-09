import { useState, useEffect, useCallback, Component, ReactNode } from 'react';
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
    }, 5000);
    return () => clearTimeout(timeout);
  }, [user, state.totalProfit, state.totalCarsSold, state.level]);

  return null;
}

function GameContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('garage');
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [tutorialAction, setTutorialAction] = useState<string | null>(null);
  const { state, dispatch } = useGame();
  const prevCarsCount = useState(state.carsInGarage.length)[0];

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

  // Track tutorial actions based on state changes
  const handleNavigate = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
    if (showTutorial) {
      if (screen === 'office') setTutorialAction('navigate_office');
      else if (screen === 'garage') setTutorialAction('navigate_garage');
      else if (screen === 'shop') setTutorialAction('navigate_shop');
      else if (screen === 'collection') setTutorialAction('navigate_collection');
      // Clear action after a tick so it can be detected
      setTimeout(() => setTutorialAction(null), 100);
    }
  }, [showTutorial]);

  // Detect vehicle purchase
  useEffect(() => {
    if (showTutorial && state.carsInGarage.length > 0) {
      setTutorialAction('buy_vehicle');
      setTimeout(() => setTutorialAction(null), 100);
    }
  }, [state.carsInGarage.length, showTutorial]);

  // Detect vehicle selection
  const handleSelectCar = useCallback((carId: string) => {
    setSelectedCarId(carId);
    if (showTutorial) {
      setTutorialAction('select_vehicle');
      setTimeout(() => setTutorialAction(null), 100);
    }
  }, [showTutorial]);

  // Detect repair (listen for repair queue changes)
  useEffect(() => {
    if (showTutorial && state.repairQueue.length > 0) {
      setTutorialAction('repair_part');
      setTimeout(() => setTutorialAction(null), 100);
    }
  }, [state.repairQueue.length, showTutorial]);

  // Detect list for sale
  useEffect(() => {
    if (showTutorial && state.activeSales.length > 0) {
      setTutorialAction('list_for_sale');
      setTimeout(() => setTutorialAction(null), 100);
    }
  }, [state.activeSales.length, showTutorial]);

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
    // Give bonus coins
    dispatch({ type: 'ADD_MONEY', payload: 150 });
  };

  const handleTutorialNavigate = useCallback((screen: string) => {
    setSelectedCarId(null);
    setCurrentScreen(screen as Screen);
  }, []);

  const handleBackFromRepair = () => setSelectedCarId(null);
  const handleCarBought = () => setCurrentScreen('garage');

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  if (selectedCarId) {
    return (
      <div className="h-[100svh] bg-background flex flex-col overflow-hidden">
        <StatsBar onOpenSettings={() => { setSelectedCarId(null); setCurrentScreen('settings'); }} />
        <div className="flex-1 min-h-0" data-tutorial-id="tutorial-repair-area">
          <RepairScreen
            carId={selectedCarId}
            onBack={handleBackFromRepair}
            onNavigateToOffice={() => {
              setSelectedCarId(null);
              setCurrentScreen('office');
            }}
          />
        </div>
        {showTutorial && (
          <TutorialOverlay
            onComplete={handleTutorialComplete}
            currentScreen="repair"
            tutorialStepCompleted={tutorialAction}
            onRequestNavigate={handleTutorialNavigate}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-[100svh] bg-background flex flex-col overflow-hidden">
      <StatsBar onOpenSettings={() => setCurrentScreen('settings')} />
      <div className="flex-1 min-h-0">
        {currentScreen === 'garage' && (
          <GarageScreen
            onNavigateToOffice={() => handleNavigate('office')}
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
      <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      {showTutorial && (
        <TutorialOverlay
          onComplete={handleTutorialComplete}
          currentScreen={currentScreen}
          tutorialStepCompleted={tutorialAction}
          onRequestNavigate={handleTutorialNavigate}
        />
      )}
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
