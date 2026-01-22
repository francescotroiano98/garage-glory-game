import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, RotateCcw, Trophy, DollarSign, Car, Star } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsScreen() {
  const { state, dispatch } = useGame();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
      localStorage.removeItem('car_mechanic_save');
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Settings & Stats
        </h1>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Statistics Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Your Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <Car className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{state.totalCarsSold}</p>
                <p className="text-xs text-muted-foreground">Cars Sold</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-500" />
                <p className="text-2xl font-bold">${state.totalProfit.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Profit</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                <p className="text-2xl font-bold">{state.reputation}</p>
                <p className="text-xs text-muted-foreground">Reputation</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <Trophy className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <p className="text-2xl font-bold">{state.level}</p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Balance */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Balance</span>
              <span className="text-2xl font-bold text-primary">${state.money.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Game Info */}
        <Card>
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
        <Card className="border-destructive/30">
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
