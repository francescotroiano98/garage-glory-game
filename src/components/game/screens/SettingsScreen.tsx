import { useGame } from '@/contexts/GameContext';
import { useLanguage, Language, Currency } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Settings, RotateCcw, Trophy, DollarSign, Car, Star, Volume2, VolumeX, Music, Globe, LogOut, User, Shield, FileText, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSound, useBackgroundMusic } from '@/hooks/useSound';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function SettingsScreen() {
  const { state } = useGame();
  const { t, language, setLanguage, currency, setCurrency, formatMoney } = useLanguage();
  const { user, username, signOut, isAdmin } = useAuth();
  const { muted, toggleMute, sfxVolume, setSfxVolume } = useSound();
  const { playing, toggleMusic, musicVolume, setMusicVolume } = useBackgroundMusic();

  const handleReset = () => {
    if (confirm(t.resetConfirm)) {
      // Wipe everything we may have stored (game save, collection,
      // challenges, tutorial flags, music, etc.).
      try { localStorage.clear(); } catch {}
      try { sessionStorage.clear(); } catch {}
      // Block any pending React effects from re-saving state in the
      // microtasks between this call and the actual reload.
      try {
        const noop = () => {};
        (localStorage as unknown as { setItem: typeof noop }).setItem = noop;
        (localStorage as unknown as { removeItem: typeof noop }).removeItem = noop;
      } catch {}
      // Hard reload to a clean state
      window.location.replace(window.location.pathname + window.location.search);
    }
  };

  const handleDeleteAccount = async () => {
    const msg = language === 'it'
      ? 'Eliminare definitivamente il tuo account? Questa azione è irreversibile e cancellerà i tuoi progressi dal server.'
      : 'Permanently delete your account? This is irreversible and will erase your progress from the server.';
    if (!confirm(msg)) return;
    const { data, error } = await supabase.functions.invoke('delete-account', { body: {} });
    if (error || data?.error) {
      toast.error(data?.error ?? error?.message ?? 'Failed to delete account');
      return;
    }
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}
    await supabase.auth.signOut();
    window.location.replace(window.location.pathname);
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <div className="p-4 border-b-2 border-border bg-gradient-to-b from-secondary/30 to-transparent">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          {t.settingsAndStats}
        </h1>
      </div>

      <div className="h-[calc(100svh-225px)] overflow-y-auto p-4 space-y-4">
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
              <Button variant={language === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('en')} className="flex-1 border-2">
                🇬🇧 English
              </Button>
              <Button variant={language === 'it' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('it')} className="flex-1 border-2">
                🇮🇹 Italiano
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              {t.currencyLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {(['USD', 'EUR', 'GBP'] as Currency[]).map(c => (
                <Button key={c} variant={currency === c ? 'default' : 'outline'} size="sm" onClick={() => setCurrency(c)} className="flex-1 border-2">
                  {c === 'USD' ? '$ Dollar' : c === 'EUR' ? '€ Euro' : '£ Pound'}
                </Button>
              ))}
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
          <CardContent className="space-y-4">
            {/* Music */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Music className="w-4 h-4" /> {t.backgroundMusic}
                </span>
                <Button variant="outline" size="sm" onClick={toggleMusic} className="border-2 h-7 px-2">
                  {playing ? t.playing : t.paused}
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-12">{t.musicVolume}</span>
                <Slider
                  value={[musicVolume * 100]}
                  onValueChange={([v]) => setMusicVolume(v / 100)}
                  min={0} max={100} step={5}
                  className="flex-1"
                />
                <span className="text-xs font-medium w-8 text-right">{Math.round(musicVolume * 100)}%</span>
              </div>
            </div>

            {/* SFX */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Volume2 className="w-4 h-4" /> {t.soundEffects}
                </span>
                <Button variant="outline" size="sm" onClick={toggleMute} className="border-2 h-7 px-2">
                  {muted ? <VolumeX className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                  {muted ? t.off : t.on}
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-12">{t.sfxVolume}</span>
                <Slider
                  value={[sfxVolume * 100]}
                  onValueChange={([v]) => setSfxVolume(v / 100)}
                  min={0} max={100} step={5}
                  className="flex-1"
                  disabled={muted}
                />
                <span className="text-xs font-medium w-8 text-right">{Math.round(sfxVolume * 100)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
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
                <p className="text-xs text-muted-foreground">{t.vehiclesSold}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center border-2 border-border">
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-500" />
                <p className="text-2xl font-bold">{formatMoney(state.totalProfit)}</p>
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
              <span className="text-2xl font-bold text-primary">{formatMoney(state.money)}</span>
            </div>
          </CardContent>
        </Card>

        {/* How to Play */}
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

        {/* Account */}
        {user && (
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{t.loggedInAs}: <strong>{username || user.email}</strong></p>
              {isAdmin && (
                <Link to="/admin" className="block">
                  <Button variant="default" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Button variant="outline" className="w-full border-2" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                {t.logOut}
              </Button>
              <Button variant="outline" className="w-full border-2 border-destructive/40 text-destructive hover:bg-destructive/10" onClick={handleDeleteAccount}>
                <Trash2 className="w-4 h-4 mr-2" />
                {language === 'it' ? 'Elimina il mio account' : 'Delete my account'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Legal */}
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              {language === 'it' ? 'Informazioni legali' : 'Legal'}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Link to="/privacy"><Button variant="outline" size="sm" className="w-full border-2">Privacy</Button></Link>
            <Link to="/terms"><Button variant="outline" size="sm" className="w-full border-2">{language === 'it' ? 'Termini' : 'Terms'}</Button></Link>
          </CardContent>
        </Card>

        {/* Reset */}
        <Card className="border-2 border-destructive/30">
          <CardContent className="p-4">
            <Button variant="destructive" className="w-full" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.resetAllProgress}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">{t.deleteAllData}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
