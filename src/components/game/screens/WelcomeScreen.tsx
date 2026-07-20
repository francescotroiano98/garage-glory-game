import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage, Language, Currency } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Globe, DollarSign, Mail, Lock, User, Shield } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: (showTutorial: boolean) => void;
}

const USERNAME_KEY = 'game_player_name';

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const { t, language, setLanguage, currency, setCurrency } = useLanguage();
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const nextParam = (() => {
    const p = new URLSearchParams(window.location.search).get("next");
    return p && p.startsWith("/") && !p.startsWith("//") ? p : null;
  })();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [wantTutorial, setWantTutorial] = useState(true);
  const [mode, setMode] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [adminLogin, setAdminLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    const playerName = name.trim() || 'Player';
    localStorage.setItem(USERNAME_KEY, playerName);
    onComplete(wantTutorial);
  };

  const handleSignUp = async () => {
    if (!email || !password || !name.trim()) {
      setError(t.enterYourName);
      return;
    }
    setLoading(true);
    setError(null);
    const result = await signUp(email, password, name.trim());
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      localStorage.setItem(USERNAME_KEY, name.trim());
      if (nextParam) { window.location.href = nextParam; return; }
      onComplete(wantTutorial);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else if (nextParam) {
      window.location.href = nextParam;
    } else if (adminLogin) {
      navigate('/admin');
    } else {
      onComplete(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-2 border-primary/30 shadow-2xl">
        <CardContent className="p-6 space-y-5 h-[90svh] overflow-y-auto">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{t.welcomeTitle}</h1>
            <p className="text-sm font-medium text-foreground/80 mt-1">Car Mechanic Tycoon Simulator</p>
            <p className="text-xs text-muted-foreground mt-1">{t.loginToPlay}</p>
          </div>

          {mode === 'welcome' && (
            <>
              {/* Name */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t.playerName}</label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t.enterYourName}
                  maxLength={20}
                  className="border-2"
                />
              </div>

              {/* Language */}
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> {t.language}
                </label>
                <div className="flex gap-2">
                  <Button variant={language === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('en')} className="flex-1 border-2">
                    🇬🇧 English
                  </Button>
                  <Button variant={language === 'it' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('it')} className="flex-1 border-2">
                    🇮🇹 Italiano
                  </Button>
                </div>
              </div>

              {/* Currency */}
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" /> {t.currencyLabel}
                </label>
                <div className="flex gap-2">
                  {(['USD', 'EUR', 'GBP'] as Currency[]).map(c => (
                    <Button key={c} variant={currency === c ? 'default' : 'outline'} size="sm" onClick={() => setCurrency(c)} className="flex-1 border-2">
                      {c === 'USD' ? '$ Dollar' : c === 'EUR' ? '€ Euro' : '£ Pound'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tutorial toggle */}
              <label className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border-2 border-border cursor-pointer">
                <input type="checkbox" checked={wantTutorial} onChange={e => setWantTutorial(e.target.checked)} className="w-5 h-5 rounded border-2" />
                <span className="text-sm font-medium">{t.showTutorial}</span>
              </label>

              <div className="space-y-2">
                <Button onClick={() => setMode('signup')} className="w-full h-11 font-bold">
                  <Mail className="w-4 h-4 mr-2" /> {t.signUp}
                </Button>
                <Button onClick={() => setMode('login')} variant="outline" className="w-full h-11 font-bold border-2">
                  {t.login}
                </Button>
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">{t.orContinueAsGuest}</span></div>
                </div>
                <Button onClick={handleStart} variant="ghost" className="w-full h-10 text-muted-foreground">
                  {t.playAsGuest}
                </Button>
                <button
                  type="button"
                  onClick={() => { setAdminLogin(true); setMode('login'); }}
                  className="w-full text-xs text-muted-foreground/70 hover:text-primary flex items-center justify-center gap-1 mt-2"
                >
                  <Shield className="w-3 h-3" /> {language === 'it' ? 'Accesso Admin' : 'Admin Login'}
                </button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground pt-2">
                <Link to="/privacy" className="underline hover:text-primary">{language === 'it' ? 'Privacy' : 'Privacy'}</Link>
                {' · '}
                <Link to="/terms" className="underline hover:text-primary">{language === 'it' ? 'Termini' : 'Terms'}</Link>
              </p>
            </>
          )}

          {(mode === 'signup' || mode === 'login') && (
            <>
              {adminLogin && (
                <div className="p-2 rounded-md bg-primary/10 border border-primary/30 text-xs text-center flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> {language === 'it' ? 'Accesso amministratore' : 'Administrator access'}
                </div>
              )}
              {mode === 'signup' && (
                <div>
                  <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4" /> {t.playerName}
                  </label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder={t.enterYourName} maxLength={20} className="border-2" />
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-4 h-4" /> {t.email}
                </label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="border-2" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" /> {t.password}
                </label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" className="border-2" />
              </div>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <Button onClick={mode === 'signup' ? handleSignUp : handleSignIn} className="w-full h-11 font-bold" disabled={loading}>
                {loading ? `${t.loading}...` : mode === 'signup' ? t.createAccount : t.login}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                {mode === 'signup' ? t.alreadyHaveAccount : t.dontHaveAccount}{' '}
                <button className="text-primary font-medium underline" onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(null); }}>
                  {mode === 'signup' ? t.login : t.signUp}
                </button>
              </p>

              <Button onClick={() => { setMode('welcome'); setAdminLogin(false); }} variant="ghost" size="sm" className="w-full">
                ← {t.goBack}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
