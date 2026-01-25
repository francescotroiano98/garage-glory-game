import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ShoppingBag, Wrench, Search, Zap, Building, Check, Star, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { TOOL_UPGRADES, DIAGNOSTIC_UPGRADES, GARAGE_UPGRADES, ENERGY_UPGRADES } from '@/data/upgrades';

const GARAGE_BAYS = GARAGE_UPGRADES.carBays;
const GARAGE_EQUIPMENT = GARAGE_UPGRADES.specialEquipment;

export function ShopScreen() {
  const { state, dispatch, canAfford, getToolLevelIndex, getNegotiationBonus, getDiySuccessChance } = useGame();

  const buyToolUpgrade = (upgrade: typeof TOOL_UPGRADES[0]) => {
    if (!canAfford(upgrade.cost)) {
      toast.error("Not enough money!");
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_TOOLS', payload: upgrade.level });
    toast.success(`Upgraded to ${upgrade.name}!`);
  };

  const buyDiagnosticUpgrade = (upgrade: typeof DIAGNOSTIC_UPGRADES[0]) => {
    if (!canAfford(upgrade.cost)) {
      toast.error("Not enough money!");
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_DIAGNOSTICS', payload: upgrade.level });
    toast.success(`Upgraded to ${upgrade.name}!`);
  };

  const buyGarageBay = (upgrade: typeof GARAGE_BAYS[0]) => {
    if (!canAfford(upgrade.cost)) {
      toast.error("Not enough money!");
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_GARAGE', payload: { carBays: upgrade.value } });
    toast.success(`Unlocked ${upgrade.name}!`);
  };

  const buyGarageEquipment = (upgrade: typeof GARAGE_EQUIPMENT[0]) => {
    if (!canAfford(upgrade.cost)) {
      toast.error("Not enough money!");
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_GARAGE', payload: { [upgrade.key]: true } });
    toast.success(`Installed ${upgrade.name}!`);
  };

  const buyEnergyUpgrade = (upgrade: typeof ENERGY_UPGRADES[0]) => {
    if (!canAfford(upgrade.cost)) {
      toast.error("Not enough money!");
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_MAX_ENERGY', payload: upgrade.maxEnergy });
    toast.success(`Max energy increased to ${upgrade.maxEnergy}!`);
  };

  const upgradeSkill = (skill: keyof typeof state.skills) => {
    if (state.skillPoints <= 0) {
      toast.error("No skill points available! Level up to earn more.");
      return;
    }
    dispatch({ type: 'UPGRADE_SKILL', payload: { skill, level: state.skills[skill] + 1 } });
    toast.success(`${skill.charAt(0).toUpperCase() + skill.slice(1)} skill increased!`);
  };

  const toolLevelIndex = getToolLevelIndex();
  const diagnosticLevelIndex = ['visual', 'basic_scanner', 'intermediate', 'pro_diagnostic', 'advanced', 'master'].indexOf(state.diagnosticLevel);

  // Calculate actual stat bonuses
  const negotiationBonus = Math.round((getNegotiationBonus() - 1) * 100);
  const avgRepairSkill = (state.skills.mechanical + state.skills.bodywork + state.skills.electrical + state.skills.tires) / 4;
  const energyReduction = Math.round((avgRepairSkill - 1) * 2);

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          Upgrade Shop
        </h1>
        <p className="text-sm text-muted-foreground">
          Improve your garage and tools
        </p>
      </div>

      <div className="flex-1 p-4 space-y-4 bg-background">
        {/* Skills Section - NEW */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Skills
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span>Level {state.level}</span>
              <span className="text-xs">•</span>
              <span>{state.xp}/{state.level * 100} XP</span>
              {state.skillPoints > 0 && (
                <Badge variant="default" className="ml-2 animate-pulse">
                  {state.skillPoints} point{state.skillPoints !== 1 ? 's' : ''} to spend!
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(state.xp / (state.level * 100)) * 100} className="h-2 mb-4" />
            <div className="space-y-3">
              {/* Mechanical */}
              <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">🔧 Mechanical</span>
                    <Badge variant="secondary">Lv.{state.skills.mechanical}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    DIY success: ~{getDiySuccessChance('engine')}% on engine
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => upgradeSkill('mechanical')}
                  disabled={state.skillPoints <= 0 || state.skills.mechanical >= 20}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Bodywork */}
              <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">🚗 Bodywork</span>
                    <Badge variant="secondary">Lv.{state.skills.bodywork}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    DIY success: ~{getDiySuccessChance('paint')}% on paint
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => upgradeSkill('bodywork')}
                  disabled={state.skillPoints <= 0 || state.skills.bodywork >= 20}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Electrical */}
              <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">⚡ Electrical</span>
                    <Badge variant="secondary">Lv.{state.skills.electrical}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    DIY success: ~{getDiySuccessChance('electronics')}% on electronics
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => upgradeSkill('electrical')}
                  disabled={state.skillPoints <= 0 || state.skills.electrical >= 20}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Tires */}
              <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">🛞 Tires</span>
                    <Badge variant="secondary">Lv.{state.skills.tires}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    DIY success: ~{getDiySuccessChance('front_tires')}% on tires
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => upgradeSkill('tires')}
                  disabled={state.skillPoints <= 0 || state.skills.tires >= 20}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Negotiation */}
              <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">💬 Negotiation</span>
                    <Badge variant="secondary">Lv.{state.skills.negotiation}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Price bonus: +{negotiationBonus}%
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => upgradeSkill('negotiation')}
                  disabled={state.skillPoints <= 0 || state.skills.negotiation >= 20}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Diagnosis */}
              <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">🔍 Diagnosis</span>
                    <Badge variant="secondary">Lv.{state.skills.diagnosis}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hidden issue reveal: +{(state.skills.diagnosis - 1) * 3}%
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => upgradeSkill('diagnosis')}
                  disabled={state.skillPoints <= 0 || state.skills.diagnosis >= 20}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Overall Stats Summary */}
              <div className="mt-3 p-2 bg-primary/10 rounded-lg text-xs text-center">
                <span className="font-medium">Overall: </span>
                Energy cost -{energyReduction}% • Negotiation +{negotiationBonus}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tools Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Repair Tools
            </CardTitle>
            <CardDescription>
              Current: <Badge variant="secondary" className="capitalize">{state.toolLevel}</Badge>
              <span className="ml-2 text-xs">(-{(1 - (0.95 ** toolLevelIndex)) * 100 | 0}% energy, +{toolLevelIndex * 4}% DIY)</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {TOOL_UPGRADES.map((upgrade) => {
              const upgradeIndex = ['basic', 'standard', 'pro', 'advanced', 'premium', 'master'].indexOf(upgrade.level);
              const owned = toolLevelIndex >= upgradeIndex;
              const nextUp = toolLevelIndex === upgradeIndex - 1;
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
                      ${upgrade.cost.toLocaleString()}
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
            {DIAGNOSTIC_UPGRADES.map((upgrade) => {
              const upgradeIndex = ['visual', 'basic_scanner', 'intermediate', 'pro_diagnostic', 'advanced', 'master'].indexOf(upgrade.level);
              const owned = diagnosticLevelIndex >= upgradeIndex;
              const nextUp = diagnosticLevelIndex === upgradeIndex - 1;
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
                      ${upgrade.cost.toLocaleString()}
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
            {/* Car Bays */}
            {GARAGE_BAYS.map((upgrade) => {
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
                      onClick={() => buyGarageBay(upgrade)}
                      disabled={!nextUp || !canAfford(upgrade.cost)}
                    >
                      ${upgrade.cost.toLocaleString()}
                    </Button>
                  )}
                </div>
              );
            })}
            
            {/* Specialized Equipment */}
            <div className="pt-2 border-t border-border mt-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Specialized Equipment (+10% DIY for category)</p>
              {GARAGE_EQUIPMENT.map((equip) => {
                const owned = state.garageUpgrades[equip.key as keyof typeof state.garageUpgrades];
                return (
                  <div key={equip.key} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg mb-2">
                    <div>
                      <p className="font-medium">{equip.name}</p>
                      <p className="text-xs text-muted-foreground">{equip.desc}</p>
                    </div>
                    {owned ? (
                      <Badge variant="secondary"><Check className="w-3 h-3 mr-1" /> Owned</Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => buyGarageEquipment(equip)}
                        disabled={!canAfford(equip.cost)}
                      >
                        ${equip.cost.toLocaleString()}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
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
            {ENERGY_UPGRADES.map((upgrade) => {
              const owned = state.maxEnergy >= upgrade.maxEnergy;
              const nextUp = ENERGY_UPGRADES.findIndex(u => u.maxEnergy > state.maxEnergy) === ENERGY_UPGRADES.indexOf(upgrade);
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
                      ${upgrade.cost.toLocaleString()}
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
