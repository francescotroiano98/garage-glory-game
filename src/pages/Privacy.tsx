import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

function Content() {
  const { language } = useLanguage();
  const it = language === 'it';
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <Link to="/"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" />{it ? 'Torna al gioco' : 'Back to game'}</Button></Link>
        <article className="prose prose-invert max-w-none space-y-4 text-sm leading-relaxed">
          <h1 className="text-2xl font-bold">{it ? 'Informativa sulla Privacy' : 'Privacy Policy'}</h1>
          <p className="text-xs text-muted-foreground">{it ? 'Ultimo aggiornamento: 14 luglio 2026' : 'Last updated: July 14, 2026'}</p>

          <p>{it
            ? "Questa app (\"Car Mechanic Tycoon Simulator\") è un gioco per dispositivi mobili gestito dal titolare dell'app. Questa pagina è mantenuta dal titolare per rispondere alle domande più comuni sulla privacy."
            : 'This app ("Car Mechanic Tycoon Simulator") is a mobile game operated by the app owner. This page is maintained by the app owner to answer common privacy questions.'}</p>

          <h2 className="text-lg font-semibold mt-6">{it ? 'Dati che raccogliamo' : 'Data we collect'}</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>{it ? 'Indirizzo email e password (solo hash) se crei un account.' : 'Email address and password (hashed only) if you create an account.'}</li>
            <li>{it ? 'Un nome utente scelto da te, mostrato nella classifica pubblica.' : 'A username you choose, shown on the public leaderboard.'}</li>
            <li>{it ? 'Statistiche di gioco: profitto totale, veicoli venduti, livello, denaro in-game.' : 'Gameplay statistics: total profit, vehicles sold, level, in-game money.'}</li>
            <li>{it ? 'Preferenze locali (lingua, valuta, audio) salvate sul dispositivo.' : 'Local preferences (language, currency, audio) stored on your device.'}</li>
          </ul>

          <h2 className="text-lg font-semibold mt-6">{it ? 'Come usiamo i dati' : 'How we use data'}</h2>
          <p>{it
            ? "Usiamo i dati esclusivamente per far funzionare il gioco, sincronizzare i tuoi progressi tra dispositivi e mostrare la classifica. Non vendiamo dati personali a terzi."
            : 'We use data solely to run the game, sync your progress across devices and display the leaderboard. We do not sell personal data to third parties.'}</p>

          <h2 className="text-lg font-semibold mt-6">{it ? 'Servizi di terze parti' : 'Third-party services'}</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>{it ? 'Backend & Auth: Supabase (hosting sicuro dei dati).' : 'Backend & Auth: Supabase (secure data hosting).'}</li>
            <li>{it ? 'Pubblicità: Google AdMob (mostra annunci ricompensati opzionali).' : 'Advertising: Google AdMob (shows optional rewarded ads).'}</li>
            <li>{it ? 'Distribuzione: Google Play Store.' : 'Distribution: Google Play Store.'}</li>
          </ul>

          <h2 className="text-lg font-semibold mt-6">{it ? 'I tuoi diritti' : 'Your rights'}</h2>
          <p>{it
            ? "Puoi richiedere in qualsiasi momento l'esportazione o la cancellazione dei tuoi dati. Il pulsante \"Elimina il mio account\" nelle Impostazioni rimuove definitivamente il tuo account e i dati associati."
            : 'You can request export or deletion of your data at any time. The "Delete my account" button in Settings permanently removes your account and associated data.'}</p>

          <h2 className="text-lg font-semibold mt-6">{it ? 'Contatti' : 'Contact'}</h2>
          <p>{it ? 'Per domande sulla privacy contattaci tramite lo store del gioco.' : 'For privacy questions contact us via the game store listing.'}</p>
        </article>
      </div>
    </div>
  );
}

export default function Privacy() {
  return <LanguageProvider><Content /></LanguageProvider>;
}