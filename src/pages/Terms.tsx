import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

function Content() {
  const { language } = useLanguage();
  const it = language === 'it';
  return (
    <div className="h-[100svh] overflow-y-auto bg-background">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-16">
        <Link to="/"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" />{it ? 'Torna al gioco' : 'Back to game'}</Button></Link>
        <article className="prose prose-invert max-w-none space-y-4 text-sm leading-relaxed">
          <h1 className="text-2xl font-bold">{it ? 'Termini di Servizio' : 'Terms of Service'}</h1>
          <p className="text-xs text-muted-foreground">{it ? 'Ultimo aggiornamento: 14 luglio 2026' : 'Last updated: July 14, 2026'}</p>

          <p>{it
            ? "Utilizzando \"Car Mechanic Tycoon Simulator\" accetti questi Termini. Se non li accetti, non utilizzare l'app."
            : 'By using "Car Mechanic Tycoon Simulator" you accept these Terms. If you do not accept them, do not use the app.'}</p>

          <h2 className="text-lg font-semibold mt-6">{it ? 'Uso consentito' : 'Acceptable use'}</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>{it ? 'Non tentare di manomettere il gioco o la classifica.' : 'Do not attempt to tamper with the game or leaderboard.'}</li>
            <li>{it ? 'Non usare nomi utente offensivi o che violano diritti altrui.' : 'Do not use offensive usernames or ones that infringe on rights.'}</li>
            <li>{it ? 'Un account per persona.' : 'One account per person.'}</li>
          </ul>

          <h2 className="text-lg font-semibold mt-6">{it ? 'Account e contenuti' : 'Accounts and content'}</h2>
          <p>{it
            ? "Sei responsabile della sicurezza delle tue credenziali. Ci riserviamo il diritto di sospendere account che violano questi Termini."
            : 'You are responsible for keeping your credentials safe. We reserve the right to suspend accounts that violate these Terms.'}</p>

          <h2 className="text-lg font-semibold mt-6">{it ? 'Valuta virtuale' : 'Virtual currency'}</h2>
          <p>{it
            ? "Il denaro in-game non ha valore monetario reale, non è rimborsabile e non può essere trasferito al di fuori del gioco."
            : 'In-game money has no real monetary value, is non-refundable and cannot be transferred outside the game.'}</p>

          <h2 className="text-lg font-semibold mt-6">{it ? 'Limitazione di responsabilità' : 'Limitation of liability'}</h2>
          <p>{it
            ? "Il gioco è fornito \"così com'è\". Nei limiti di legge, non siamo responsabili per danni indiretti derivanti dall'uso dell'app."
            : 'The game is provided "as is". To the extent permitted by law, we are not liable for indirect damages arising from use of the app.'}</p>

          <h2 className="text-lg font-semibold mt-6">{it ? 'Modifiche' : 'Changes'}</h2>
          <p>{it
            ? "Possiamo aggiornare questi Termini. Le modifiche entrano in vigore alla pubblicazione in questa pagina."
            : 'We may update these Terms. Changes take effect when posted on this page.'}</p>
        </article>
      </div>
    </div>
  );
}

export default function Terms() {
  return <LanguageProvider><Content /></LanguageProvider>;
}