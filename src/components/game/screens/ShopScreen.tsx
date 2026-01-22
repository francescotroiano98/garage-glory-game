import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ShoppingBag, Wrench, Search, Zap, Building, Check } from 'lucide-react';
import { toast } from 'sonner';

const toolUpgrades = [
  { level: 'pro' as const, name: 'Pro Tools', cost: 500, desc: '-20% energy cost' },
  { level: 'premium' as const, name: 'Premium Tools', cost: 1500, desc: '-35% energy cost, faster repairs' },
];

const diagnosticUpgrades = [
  { level: 'basic_scanner' as const, name: 'Basic Scanner', cost: 300, desc: 'Reveal 50% hidden issues' },
  { level: 'pro_diagnostic' as const, name: 'Pro Diagnostic', cost: 800, desc: 'Reveal 80% hidden issues' },
  { level: 'master' as const, name: 'Master Kit', cost: 2000, desc: 'Reveal all problems' },
];

const garageUpgrades = [
  { type: 'carBays' as const, name: '2nd Car Bay', cost: 1000, value: 2, desc: 'Work on 2 cars' },
  { type: 'carBays' as const, name: '3rd Car Bay', cost: 2500, value: 3, desc: 'Work on 3 cars' },
];

const energyUpgrades = [
  { maxEnergy: 150, cost: 400, desc: 'Max energy: 150' },
  { maxEnergy: 200, cost: 1000, desc: 'Max energy: 200' },
];

export function ShopScreen() {
  const { state, dispatch, canAfford } = useGame();

  const buyToolUpgrade = (upgrade: typeof toolUpgrades[0]) => {
    if (!canAfford(upgrade.cost)) {
      toast.error("Not enough money!");
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_TOOLS', payload: upgrade.level });
    toast.success(`Upgraded to ${upgrade.name}!`);
  };

  const buyDiagnosticUpgrade = (upgrade: typeof diagnosticUpgrades[0]) => {
    if (!canAfford(upgrade.cost)) {
      toast.error("Not enough money!");
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_DIAGNOSTICS', payload: upgrade.level });
    toast.success(`Upgraded to ${upgrade.name}!`);
  };

  const buyGarageUpgrade = (upgrade: typeof garageUpgrades[0]) => {
    if (!canAfford(upgrade.cost)) {
      toast.error("Not enough money!");
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_GARAGE', payload: { [upgrade.type]: upgrade.value } });
    toast.success(`Unlocked ${upgrade.name}!`);
  };

  const buyEnergyUpgrade = (upgrade: typeof energyUpgrades[0]) => {
    if (!canAfford(upgrade.cost)) {
      toast.error("Not enough money!");
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_MAX_ENERGY', payload: upgrade.maxEnergy });
    toast.success(`Max energy increased to ${upgrade.maxEnergy}!`);
  };

  const toolLevelIndex = ['basic', 'pro', 'premium'].indexOf(state.toolLevel);
  const diagnosticLevelIndex = ['visual', 'basic_scanner', 'pro_diagnostic', 'master'].indexOf(state.diagnosticLevel);

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          Upgrade Shop
        </h1>
        <p className="text-sm text-muted-foreground">
          Improve your garage and tools
        </p>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Tools Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Repair Tools
            </CardTitle>
            <CardDescription>
              Current: <Badge variant="secondary" className="capitalize">{state.toolLevel}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {toolUpgrades.map((upgrade, i) => {
              const owned = toolLevelIndex >= i + 1;
              const nextUp = toolLevelIndex === i;
              return (
                <div key={upgrade.level} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium">{upgrade.name}</p>
                    <p className="text-xs text-muted-foreground">{upgrade.desc}</p>
                  </div>
                  {owned ? (
                    <Badge variant="secondary"><Check className="w-3 h-3 mr-1" /> Owned</Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => buyToolUpgrade(upgrade)}
                      disabled={!nextUp || !canAfford(upgrade.cost)}
                    >
                      ${upgrade.cost}
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Diagnostics Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="w-4 h-4" />
              Diagnostic Equipment
            </CardTitle>
            <CardDescription>
              Current: <Badge variant="secondary" className="capitalize">{state.diagnosticLevel.replace('_', ' ')}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {diagnosticUpgrades.map((upgrade, i) => {
              const owned = diagnosticLevelIndex >= i + 1;
              const nextUp = diagnosticLevelIndex === i;
              return (
                <div key={upgrade.level} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium">{upgrade.name}</p>
                    <p className="text-xs text-muted-foreground">{upgrade.desc}</p>
                  </div>
                  {owned ? (
                    <Badge variant="secondary"><Check className="w-3 h-3 mr-1" /> Owned</Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => buyDiagnosticUpgrade(upgrade)}
                      disabled={!nextUp || !canAfford(upgrade.cost)}
                    >
                      ${upgrade.cost}
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Garage Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Building className="w-4 h-4" />
              Garage
            </CardTitle>
            <CardDescription>
              Current: {state.garageUpgrades.carBays} car bay{state.garageUpgrades.carBays !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {garageUpgrades.map((upgrade) => {
              const owned = state.garageUpgrades.carBays >= upgrade.value;
              const nextUp = state.garageUpgrades.carBays === upgrade.value - 1;
              return (
                <div key={upgrade.name} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium">{upgrade.name}</p>
                    <p className="text-xs text-muted-foreground">{upgrade.desc}</p>
                  </div>
                  {owned ? (
                    <Badge variant="secondary"><Check className="w-3 h-3 mr-1" /> Owned</Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => buyGarageUpgrade(upgrade)}
                      disabled={!nextUp || !canAfford(upgrade.cost)}
                    >
                      ${upgrade.cost}
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Energy Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Energy Capacity
            </CardTitle>
            <CardDescription>
              Current max: {state.maxEnergy}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {energyUpgrades.map((upgrade) => {
              const owned = state.maxEnergy >= upgrade.maxEnergy;
              const nextUp = (state.maxEnergy === 100 && upgrade.maxEnergy === 150) || 
                            (state.maxEnergy === 150 && upgrade.maxEnergy === 200);
              return (
                <div key={upgrade.maxEnergy} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium">Expand to {upgrade.maxEnergy}</p>
                    <p className="text-xs text-muted-foreground">{upgrade.desc}</p>
                  </div>
                  {owned ? (
                    <Badge variant="secondary"><Check className="w-3 h-3 mr-1" /> Owned</Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => buyEnergyUpgrade(upgrade)}
                      disabled={!nextUp || !canAfford(upgrade.cost)}
                    >
                      ${upgrade.cost}
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Skills Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Skills (Level up with XP)</CardTitle>
            <CardDescription>
              Level {state.level} • {state.xp}/{state.level * 100} XP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(state.xp / (state.level * 100)) * 100} className="h-2" />
            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span>Diagnosis</span>
                <span className="font-medium">Lv.{state.skills.diagnosis}</span>
              </div>
              <div className="flex justify-between">
                <span>Repair Speed</span>
                <span className="font-medium">Lv.{state.skills.repairSpeed}</span>
              </div>
              <div className="flex justify-between">
                <span>Negotiation</span>
                <span className="font-medium">Lv.{state.skills.negotiation}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
