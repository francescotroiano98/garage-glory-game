import { useState, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
 import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Wrench, Search, Zap, Building, Check, Star, Plus, Settings, Package } from 'lucide-react';
import { toast } from 'sonner';
 import { useSound } from '@/hooks/useSound';
import { TOOL_UPGRADES, DIAGNOSTIC_UPGRADES, GARAGE_UPGRADES, ENERGY_UPGRADES, getXpForLevel } from '@/data/upgrades';
import { PART_DEFINITIONS, PART_ICONS, CATEGORY_LABELS, getPartUpgradeCost } from '@/data/parts';
import { PartType, PartCategory, MAX_LEVEL } from '@/types/game';
import { PACK_TYPES, openPack, loadCollection, saveCollection, addCardsToCollection, CollectibleCard } from '@/data/cards';
import { PackOpeningAnimation } from '@/components/game/PackOpeningAnimation';
import { getCompletedVehiclesCount } from '@/data/cards';
import { getPartName } from '@/utils/partTranslations';

const GARAGE_BAYS = GARAGE_UPGRADES.carBays;
const GARAGE_EQUIPMENT = GARAGE_UPGRADES.specialEquipment;

const CAR_PARTS: Record<PartCategory, PartType[]> = {
  mechanical: ['engine', 'transmission', 'brakes', 'suspension', 'exhaust', 'fuel_system'],
  body: ['paint', 'dents', 'rust', 'windows', 'lights', 'bumpers'],
  tires: ['front_tires', 'rear_tires', 'wheels', 'alignment', 'tire_pressure', 'wheel_bearings'],
  interior: ['seats', 'dashboard', 'electronics', 'cleaning', 'air_conditioning', 'audio_system'],
};

const MOTO_PARTS: Record<PartCategory, PartType[]> = {
  mechanical: ['moto_engine', 'moto_chain', 'moto_exhaust', 'moto_carburetor'],
  body: ['moto_fairing', 'moto_tank', 'moto_fender', 'moto_mirrors'],
  tires: ['moto_front_tire', 'moto_rear_tire', 'moto_front_suspension', 'moto_rear_suspension'],
  interior: ['moto_battery', 'moto_wiring', 'moto_instruments', 'moto_seat'],
};

const TRUCK_PARTS: Record<PartCategory, PartType[]> = {
  mechanical: ['truck_engine', 'truck_transmission', 'truck_brakes', 'truck_hydraulics'],
  body: ['truck_cabin', 'truck_bed', 'truck_frame', 'truck_lights'],
  tires: ['truck_front_axle', 'truck_rear_axle', 'truck_tires', 'truck_suspension'],
  interior: ['truck_dashboard', 'truck_wiring', 'truck_ac', 'truck_seat'],
};

type VehiclePartTab = 'car' | 'moto' | 'truck';

const MAX_PART_LEVEL = 10;

export function ShopScreen() {
  const { state, dispatch, canAfford, getToolLevelIndex, getNegotiationBonus, getDiySuccessChance, updateChallengeProgress } = useGame();
   const { t, language, formatMoney } = useLanguage();
   const { playSound } = useSound();
  const [selectedPartCategory, setSelectedPartCategory] = useState<PartCategory>('mechanical');
  const [vehiclePartTab, setVehiclePartTab] = useState<VehiclePartTab>('car');
  const [openedCards, setOpenedCards] = useState<CollectibleCard[] | null>(null);
  const [openedPackIcon, setOpenedPackIcon] = useState<string>('📦');
  const [openedPackImage, setOpenedPackImage] = useState<string | undefined>(undefined);

  const buyPack = useCallback((packId: string) => {
    const pack = PACK_TYPES.find(p => p.id === packId);
    if (!pack || !canAfford(pack.cost)) {
      toast.error(t.notEnoughMoney);
      playSound('error');
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: pack.cost });
    const cards = openPack(pack, state.level);
    const collection = loadCollection();
    // Track newly-obtained cards & newly-completed vehicles for challenges
    const ownedBefore = collection.ownedCards;
    const newCards = cards.filter(c => !ownedBefore[c.id]).length;
    const rareCards = cards.filter(c => c.rarity !== 'base').length;
    const completedBefore = getCompletedVehiclesCount(collection);
    const newCollection = addCardsToCollection(collection, cards);
    const completedAfter = getCompletedVehiclesCount(newCollection);
    saveCollection(newCollection);
    setOpenedPackIcon(pack.icon);
    setOpenedPackImage(pack.image);
    setOpenedCards(cards);
    playSound('cashRegister');
    // Daily/weekly challenge hooks
    updateChallengeProgress('open_packs', 1);
    if (newCards > 0) updateChallengeProgress('obtain_new_cards', newCards);
    if (rareCards > 0) updateChallengeProgress('obtain_rare_cards', rareCards);
    const newlyCompleted = completedAfter - completedBefore;
    if (newlyCompleted > 0) updateChallengeProgress('complete_vehicles', newlyCompleted);
  }, [canAfford, dispatch, playSound, t, updateChallengeProgress]);

  const buyToolUpgrade = (upgrade: typeof TOOL_UPGRADES[0]) => {
    if (!canAfford(upgrade.cost)) {
       toast.error(t.notEnoughMoney);
       playSound('error');
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_TOOLS', payload: upgrade.level });
     playSound('skillUp');
  };

  const buyDiagnosticUpgrade = (upgrade: typeof DIAGNOSTIC_UPGRADES[0]) => {
    if (!canAfford(upgrade.cost)) {
       toast.error(t.notEnoughMoney);
       playSound('error');
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_DIAGNOSTICS', payload: upgrade.level });
     playSound('skillUp');
  };

  const buyGarageBay = (upgrade: typeof GARAGE_BAYS[0]) => {
    if (!canAfford(upgrade.cost)) {
       toast.error(t.notEnoughMoney);
       playSound('error');
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_GARAGE', payload: { carBays: upgrade.value } });
     playSound('purchase');
  };

  const buyGarageEquipment = (upgrade: typeof GARAGE_EQUIPMENT[0]) => {
    if (!canAfford(upgrade.cost)) {
       toast.error(t.notEnoughMoney);
       playSound('error');
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_GARAGE', payload: { [upgrade.key]: true } });
     playSound('purchase');
  };

  const buyEnergyUpgrade = (upgrade: typeof ENERGY_UPGRADES[0]) => {
    if (!canAfford(upgrade.cost)) {
       toast.error(t.notEnoughMoney);
       playSound('error');
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: upgrade.cost });
    dispatch({ type: 'UPGRADE_MAX_ENERGY', payload: upgrade.maxEnergy });
     playSound('purchase');
  };

  const upgradeSkill = (skill: keyof typeof state.skills) => {
    if (state.skillPoints <= 0) {
      return;
    }
    dispatch({ type: 'UPGRADE_SKILL', payload: { skill, level: state.skills[skill] + 1 } });
     playSound('skillUp');
  };

  const upgradePartLevel = (partType: PartType) => {
    const currentLevel = state.partUpgrades[partType] || 0;
    if (currentLevel >= MAX_PART_LEVEL) {
      return;
    }
    const cost = getPartUpgradeCost(partType, currentLevel);
    if (!canAfford(cost)) {
       toast.error(t.notEnoughMoney);
       playSound('error');
      return;
    }
    dispatch({ type: 'SPEND_MONEY', payload: cost });
    dispatch({ type: 'UPGRADE_PART', payload: { partType } });
     playSound('skillUp');
  };

  const toolLevelIndex = getToolLevelIndex();
  const diagnosticLevelIndex = ['visual', 'basic_scanner', 'intermediate', 'pro_diagnostic', 'advanced', 'master'].indexOf(state.diagnosticLevel);

  const negotiationBonus = Math.round((getNegotiationBonus() - 1) * 100);
  const avgRepairSkill = (state.skills.mechanical + state.skills.bodywork + state.skills.electrical + state.skills.tires) / 4;
  const energyReduction = Math.round((avgRepairSkill - 1) * 2);
  
  const xpForNextLevel = state.level >= MAX_LEVEL ? 0 : getXpForLevel(state.level);

  return (
    <div className="flex flex-col h-[100svh] pb-20 relative">
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'linear-gradient(135deg, hsl(var(--primary)/0.1), hsl(var(--accent)/0.1))',
          backgroundColor: 'hsl(var(--background))'
        }}
      />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="p-4 py-5 border-b border-border bg-card/90 backdrop-blur-sm shrink-0 sticky top-0 z-20">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
             {t.upgradeShop}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
             {t.improveGarage}
          </p>
        </div>

        <div className="h-[calc(100svh-258px)] overflow-y-auto p-4 space-y-4">

        {/* Card Packs Section */}
        <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-accent" />
              {t.packs}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {PACK_TYPES.map(pack => (
              <div key={pack.id} className="flex items-center gap-3 p-2 bg-secondary/30 rounded-lg">
                {pack.image ? (
                  <img
                    src={pack.image}
                    alt={pack.name}
                    width={48}
                    height={66}
                    loading="lazy"
                    className="w-12 h-auto object-contain drop-shadow"
                  />
                ) : (
                  <span className="text-2xl">{pack.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{language === 'it' ? pack.nameIt : pack.name}</div>
                  <div className="text-[10px] text-muted-foreground">{language === 'it' ? pack.descriptionIt : pack.description}</div>
                </div>
                <Button
                  size="sm"
                  onClick={() => buyPack(pack.id)}
                  disabled={!canAfford(pack.cost)}
                  className="shrink-0 h-8"
                >
                  {formatMoney(pack.cost)}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pack opening animation */}
        <PackOpeningAnimation
          cards={openedCards}
          packIcon={openedPackIcon}
          packImage={openedPackImage}
          onClose={() => setOpenedCards(null)}
        />

        {/* Skills Section */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
               {t.skills}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span>Level {state.level}/{MAX_LEVEL}</span>
              <span className="text-xs">•</span>
              <span>{state.xp}/{xpForNextLevel || '∞'} XP</span>
              {state.skillPoints > 0 && (
                <Badge variant="default" className="ml-2 animate-pulse">
                  {state.skillPoints} point{state.skillPoints !== 1 ? 's' : ''} to spend!
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={state.level >= MAX_LEVEL ? 100 : (state.xp / xpForNextLevel) * 100} className="h-2 mb-4" />
            <div className="space-y-3">
              {/* Mechanical */}
              <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">🔧 {t.mechanical}</span>
                    <Badge variant="secondary">Lv.{state.skills.mechanical}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    DIY success: ~{Math.round(getDiySuccessChance('engine'))}% on engine
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
                    <span className="font-medium">🚗 {t.body}</span>
                    <Badge variant="secondary">Lv.{state.skills.bodywork}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    DIY success: ~{Math.round(getDiySuccessChance('paint'))}% on paint
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
                    <span className="font-medium">⚡ {t.electrical}</span>
                    <Badge variant="secondary">Lv.{state.skills.electrical}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    DIY success: ~{Math.round(getDiySuccessChance('electronics'))}% on electronics
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
                    <span className="font-medium">🛞 {t.tires}</span>
                    <Badge variant="secondary">Lv.{state.skills.tires}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    DIY success: ~{Math.round(getDiySuccessChance('front_tires'))}% on tires
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
                    <span className="font-medium">💬 {t.negotiation}</span>
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
                    <span className="font-medium">🔍 {t.diagnosis}</span>
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

              <div className="mt-3 p-2 bg-primary/10 rounded-lg text-xs text-center">
                <span className="font-medium">Overall: </span>
                Energy cost -{energyReduction}% • Negotiation +{negotiationBonus}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Part Upgrades Section - 10 levels each */}
        <Card className="border-2 border-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4 text-accent" />
               {t.partSpecializations}
            </CardTitle>
            <CardDescription>
              10 levels per part • +3% DIY success each level
            </CardDescription>
          </CardHeader>
           <CardContent>
            {/* Vehicle type selector */}
            <div className="flex gap-1 mb-3">
              {(['car', 'moto', 'truck'] as VehiclePartTab[]).map(tab => (
                <Button
                  key={tab}
                  size="sm"
                  variant={vehiclePartTab === tab ? 'default' : 'outline'}
                  className="text-xs flex-1"
                  onClick={() => setVehiclePartTab(tab)}
                >
                  {tab === 'car' ? '🚗 Auto' : tab === 'moto' ? '🏍️ Moto' : '🚛 Truck'}
                </Button>
              ))}
            </div>

            <Tabs value={selectedPartCategory} onValueChange={(v) => setSelectedPartCategory(v as PartCategory)}>
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="mechanical" className="text-xs">⚙️ {t.mech}</TabsTrigger>
                <TabsTrigger value="body" className="text-xs">🚗 {t.body}</TabsTrigger>
                <TabsTrigger value="tires" className="text-xs">🛞 {t.tiresShort}</TabsTrigger>
                <TabsTrigger value="interior" className="text-xs">🪑 {t.int}</TabsTrigger>
              </TabsList>
              
              {(() => {
                const partsMap = vehiclePartTab === 'moto' ? MOTO_PARTS : vehiclePartTab === 'truck' ? TRUCK_PARTS : CAR_PARTS;
                return Object.entries(partsMap).map(([category, parts]) => (
                  <TabsContent key={category} value={category} className="space-y-2 mt-0">
                    {(parts as PartType[]).map((partType) => {
                      const currentLevel = state.partUpgrades[partType] || 0;
                      const cost = getPartUpgradeCost(partType, currentLevel);
                      const isMaxed = currentLevel >= MAX_PART_LEVEL;
                      
                      return (
                        <div key={partType} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{PART_ICONS[partType]}</span>
                              <span className="font-medium text-sm">{getPartName(partType, t as unknown as Record<string, string>)}</span>
                              <Badge variant={isMaxed ? "default" : "secondary"} className="text-xs">
                                {currentLevel}/{MAX_PART_LEVEL}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={(currentLevel / MAX_PART_LEVEL) * 100} className="h-1.5 flex-1" />
                              <span className="text-xs text-muted-foreground">
                                +{currentLevel * 3}% DIY
                              </span>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => upgradePartLevel(partType)}
                            disabled={isMaxed || !canAfford(cost)}
                            className="ml-2"
                          >
                            {isMaxed ? <Check className="w-4 h-4" /> : `$${cost.toLocaleString()}`}
                          </Button>
                        </div>
                      );
                    })}
                  </TabsContent>
                ));
              })()}
            </Tabs>
          </CardContent>
        </Card>

        {/* Tools Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="w-4 h-4" />
               {t.repairTools}
            </CardTitle>
            <CardDescription>
               {t.current}: <Badge variant="secondary" className="capitalize">{state.toolLevel}</Badge>
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
                     <Badge variant="secondary"><Check className="w-3 h-3 mr-1" /> {t.owned}</Badge>
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
    </div>
  );
}
