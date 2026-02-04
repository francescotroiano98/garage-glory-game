import { useGame } from '@/contexts/GameContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, RotateCcw, Trophy, DollarSign, Car, Star, Volume2, VolumeX, Music, Globe } from 'lucide-react';
import { useSound, useBackgroundMusic } from '@/hooks/useSound';

export function SettingsScreen() {
  const { state } = useGame();
  const { t, language, setLanguage } = useLanguage();
  const { muted, toggleMute } = useSound();
  const { playing, toggleMusic } = useBackgroundMusic();

  const handleReset = () => {
    if (confirm(t.resetConfirm)) {
      // Clear all game-related localStorage keys
      localStorage.removeItem('car_mechanic_save');
      localStorage.removeItem('car_mechanic_save_v3');
      localStorage.removeItem('car_mechanic_challenges');
      localStorage.removeItem('car_mechanic_tutorial_done');
      localStorage.removeItem('game_sound_muted');
      localStorage.removeItem('game_music_playing');
      window.location.reload();
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <div className="p-4 border-b-2 border-border bg-gradient-to-b from-secondary/30 to-transparent">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          {t.settingsAndStats}
        </h1>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Language Settings */}
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              {t.language}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleLanguageChange('en')}
                className="flex-1 border-2"
              >
                🇬🇧 English
              </Button>
              <Button
                variant={language === 'it' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleLanguageChange('it')}
                className="flex-1 border-2"
              >
                🇮🇹 Italiano
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              {t.audioSettings}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t.soundEffects}</span>
              <Button variant="outline" size="sm" onClick={toggleMute} className="border-2">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="ml-2">{muted ? t.off : t.on}</span>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t.backgroundMusic}</span>
              <Button variant="outline" size="sm" onClick={toggleMusic} className="border-2">
                <Music className="w-4 h-4" />
                <span className="ml-2">{playing ? t.playing : t.paused}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              {t.yourStatistics}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/50 rounded-lg p-3 text-center border-2 border-border">
                <Car className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{state.totalCarsSold}</p>
                <p className="text-xs text-muted-foreground">{t.carsSold}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center border-2 border-border">
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-500" />
                <p className="text-2xl font-bold">${state.totalProfit.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{t.totalProfit}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center border-2 border-border">
                <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                <p className="text-2xl font-bold">{state.reputation}</p>
                <p className="text-xs text-muted-foreground">{t.reputation}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center border-2 border-border">
                <Trophy className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <p className="text-2xl font-bold">{state.level}</p>
                <p className="text-xs text-muted-foreground">{t.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Balance */}
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.currentBalance}</span>
              <span className="text-2xl font-bold text-primary">${state.money.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Game Info */}
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t.howToPlay}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>1. <strong>{t.howToPlay1}</strong></p>
            <p>2. <strong>{t.howToPlay2}</strong></p>
            <p>3. <strong>{t.howToPlay3}</strong></p>
            <p>4. <strong>{t.howToPlay4}</strong></p>
            <p>5. <strong>{t.howToPlay5}</strong></p>
          </CardContent>
        </Card>

        {/* Reset Button */}
        <Card className="border-2 border-destructive/30">
          <CardContent className="p-4">
            <Button variant="destructive" className="w-full" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.resetAllProgress}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {t.deleteAllData}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
