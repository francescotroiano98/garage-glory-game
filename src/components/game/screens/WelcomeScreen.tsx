import { useState } from 'react';
import { useLanguage, Language, Currency } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Globe, DollarSign } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: (showTutorial: boolean) => void;
}

const USERNAME_KEY = 'game_player_name';

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const { t, language, setLanguage, currency, setCurrency } = useLanguage();
  const [name, setName] = useState('');
  const [wantTutorial, setWantTutorial] = useState(true);

  const handleStart = () => {
    const playerName = name.trim() || 'Player';
    localStorage.setItem(USERNAME_KEY, playerName);
    onComplete(wantTutorial);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-2 border-primary/30 shadow-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{t.welcomeTitle}</h1>
          </div>

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
            <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5 block">
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
            <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5 block">
              <DollarSign className="w-4 h-4" /> {t.currencyLabel}
            </label>
            <div className="flex gap-2">
              {(['USD', 'EUR', 'GBP'] as Currency[]).map(c => (
                <Button
                  key={c}
                  variant={currency === c ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrency(c)}
                  className="flex-1 border-2"
                >
                  {c === 'USD' ? '$ Dollar' : c === 'EUR' ? '€ Euro' : '£ Pound'}
                </Button>
              ))}
            </div>
          </div>

          {/* Tutorial toggle */}
          <label className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border-2 border-border cursor-pointer">
            <input
              type="checkbox"
              checked={wantTutorial}
              onChange={e => setWantTutorial(e.target.checked)}
              className="w-5 h-5 rounded border-2"
            />
            <span className="text-sm font-medium">{t.showTutorial}</span>
          </label>

          <Button onClick={handleStart} className="w-full h-12 text-lg font-bold">
            🚀 {t.startPlaying}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
