// Tutorial System
export interface TutorialStep {
  id: string;
  titleEn: string;
  titleIt: string;
  descEn: string;
  descIt: string;
  icon: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    titleEn: 'Welcome to Garage Glory!',
    titleIt: 'Benvenuto in Garage Glory!',
    descEn: 'Build your vehicle flipping empire! Buy damaged vehicles, repair them, and sell for profit.',
    descIt: 'Costruisci il tuo impero di compravendita veicoli! Compra veicoli danneggiati, riparali e vendili con profitto.',
    icon: '🏁',
  },
  {
    id: 'money_energy',
    titleEn: 'Resources',
    titleIt: 'Risorse',
    descEn: 'You have Money to buy vehicles and parts, and Energy for repairs. Energy recharges over time, or collect bonus every 10 minutes!',
    descIt: 'Hai Denaro per comprare veicoli e parti, ed Energia per le riparazioni. L\'energia si ricarica nel tempo, o raccogli il bonus ogni 10 minuti!',
    icon: '📊',
  },
  {
    id: 'office',
    titleEn: 'The Office',
    titleIt: 'L\'Ufficio',
    descEn: 'Go to the Office to browse newspaper ads and buy vehicles. When customers call, answer the phone to negotiate sales!',
    descIt: 'Vai in Ufficio per sfogliare gli annunci e comprare veicoli. Quando i clienti chiamano, rispondi al telefono per negoziare le vendite!',
    icon: '🏢',
  },
  {
    id: 'buy_vehicles',
    titleEn: 'Buy Vehicles',
    titleIt: 'Compra Veicoli',
    descEn: 'Find cars, motorcycles and trucks in newspaper ads. Look for hidden damage - some issues are not visible until you buy!',
    descIt: 'Trova auto, moto e camion negli annunci. Cerca i danni nascosti - alcuni problemi non sono visibili finché non compri!',
    icon: '📰',
  },
  {
    id: 'repair',
    titleEn: 'Repair Damage',
    titleIt: 'Ripara i Danni',
    descEn: 'Tap a vehicle in your Garage to see its damage. Repair parts using Pro Repair (guaranteed) or DIY (cheaper but risky).',
    descIt: 'Tocca un veicolo nel Garage per vedere i danni. Ripara le parti con Riparazione Pro (garantita) o Fai da te (più economico ma rischioso).',
    icon: '🔧',
  },
  {
    id: 'diy',
    titleEn: 'DIY Repairs',
    titleIt: 'Riparazioni Fai da Te',
    descEn: 'DIY is cheaper but may fail! Your Skills increase success rate. Failed repairs waste energy but you can retry.',
    descIt: 'Il fai da te è più economico ma può fallire! Le tue Abilità aumentano il tasso di successo. Le riparazioni fallite sprecano energia ma puoi riprovare.',
    icon: '🛠️',
  },
  {
    id: 'sell',
    titleEn: 'Sell for Profit',
    titleIt: 'Vendi con Profitto',
    descEn: 'Once fully repaired, list your vehicle for sale. Go to the Office and answer the phone when a customer calls to negotiate!',
    descIt: 'Una volta riparato completamente, metti in vendita il veicolo. Vai in Ufficio e rispondi al telefono quando un cliente chiama per negoziare!',
    icon: '💰',
  },
  {
    id: 'upgrades',
    titleEn: 'Upgrade & Grow',
    titleIt: 'Migliora e Cresci',
    descEn: 'Visit the Shop to upgrade tools, skills, and garage capacity. Better tools = faster repairs!',
    descIt: 'Visita il Negozio per migliorare strumenti, abilità e capacità del garage. Strumenti migliori = riparazioni più veloci!',
    icon: '📈',
  },
  {
    id: 'currency',
    titleEn: 'Settings',
    titleIt: 'Impostazioni',
    descEn: 'You can change language, currency, and audio settings anytime. Adjust music and sound effects volume to your preference!',
    descIt: 'Puoi cambiare lingua, valuta e impostazioni audio in qualsiasi momento. Regola il volume della musica e degli effetti sonori come preferisci!',
    icon: '⚙️',
  },
  {
    id: 'ready',
    titleEn: "You're Ready!",
    titleIt: 'Sei Pronto!',
    descEn: 'Go to the Office to buy your first vehicle. Good luck, mechanic!',
    descIt: 'Vai in Ufficio per comprare il tuo primo veicolo. Buona fortuna, meccanico!',
    icon: '🎉',
  },
];
