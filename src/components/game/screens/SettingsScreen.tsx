import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, RotateCcw, Trophy, DollarSign, Car, Star, Volume2, VolumeX, Music } from 'lucide-react';
import { useSound, useBackgroundMusic } from '@/hooks/useSound';

export function SettingsScreen() {
  const { state } = useGame();
  const { muted, toggleMute } = useSound();
  const { playing, toggleMusic } = useBackgroundMusic();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
      localStorage.removeItem('car_mechanic_save');
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header */}
      <div className="p-4 border-b-2 border-border bg-gradient-to-b from-secondary/30 to-transparent">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Settings & Stats
        </h1>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Audio Settings */}
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              Audio Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sound Effects</span>
              <Button variant="outline" size="sm" onClick={toggleMute} className="border-2">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="ml-2">{muted ? 'Off' : 'On'}</span>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Background Music</span>
              <Button variant="outline" size="sm" onClick={toggleMusic} className="border-2">
                <Music className="w-4 h-4" />
                <span className="ml-2">{playing ? 'Playing' : 'Paused'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Your Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/50 rounded-lg p-3 text-center border-2 border-border">
                <Car className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{state.totalCarsSold}</p>
                <p className="text-xs text-muted-foreground">Cars Sold</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center border-2 border-border">
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-500" />
                <p className="text-2xl font-bold">${state.totalProfit.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Profit</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center border-2 border-border">
                <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                <p className="text-2xl font-bold">{state.reputation}</p>
                <p className="text-xs text-muted-foreground">Reputation</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center border-2 border-border">
                <Trophy className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <p className="text-2xl font-bold">{state.level}</p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Balance */}
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Balance</span>
              <span className="text-2xl font-bold text-primary">${state.money.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Game Info */}
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">How to Play</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>1. <strong>Buy cars</strong> from newspaper ads - look for hidden damage!</p>
            <p>2. <strong>Repair</strong> all damaged parts using energy (regenerates 20/min)</p>
            <p>3. <strong>Sell</strong> the car to customers at a profit</p>
            <p>4. <strong>Upgrade</strong> your tools and garage to handle better cars</p>
            <p>5. <strong>Build reputation</strong> to unlock luxury vehicles!</p>
          </CardContent>
        </Card>

        {/* Reset Button */}
        <Card className="border-2 border-destructive/30">
          <CardContent className="p-4">
            <Button variant="destructive" className="w-full" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All Progress
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              This will delete all your saved data
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
