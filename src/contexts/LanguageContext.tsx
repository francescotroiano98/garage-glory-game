import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'it';

interface Translations {
  // General
  settings: string;
  stats: string;
  language: string;
  
  // StatsBar
  energy: string;
  level: string;
  xpProgress: string;
  reputation: string;
  skillPoints: string;
  achievements: string;
  
  // Garage
  myGarage: string;
  carsInGarage: string;
  buyCar: string;
  noCarsYet: string;
  browseAdsToFind: string;
  browseAds: string;
  emptyBay: string;
  repairsInProgress: string;
  sell: string;
  waiting: string;
  readyToSell: string;
  fixed: string;
  
  // Newspaper
  newspaperAds: string;
  findNextProject: string;
  refresh: string;
  garageFull: string;
  garageFullMessage: string;
  negotiable: string;
  buy: string;
  askingPrice: string;
  yourOffer: string;
  yourBalance: string;
  negotiate: string;
  buyNow: string;
  negotiations: string;
  
  // Repair
  carValue: string;
  invested: string;
  waitingForBuyer: string;
  customerWillArrive: string;
  noIssues: string;
  working: string;
  diy: string;
  failedDiyAttempts: string;
  listForSale: string;
  potentialProfit: string;
  totalInvested: string;
  
  // Settings
  settingsAndStats: string;
  audioSettings: string;
  soundEffects: string;
  backgroundMusic: string;
  on: string;
  off: string;
  playing: string;
  paused: string;
  yourStatistics: string;
  carsSold: string;
  totalProfit: string;
  currentBalance: string;
  howToPlay: string;
  howToPlay1: string;
  howToPlay2: string;
  howToPlay3: string;
  howToPlay4: string;
  howToPlay5: string;
  resetAllProgress: string;
  deleteAllData: string;
  resetConfirm: string;
  
  // Shop
  shop: string;
  tools: string;
  diagnostics: string;
  garage: string;
  skills: string;
  parts: string;
  current: string;
  upgrade: string;
  max: string;
  locked: string;
  
  // Categories
  mechanical: string;
  body: string;
  tires: string;
  interior: string;
  
  // Customer
  accept: string;
  counter: string;
  reject: string;
  customerOffer: string;
}

const translations: Record<Language, Translations> = {
  en: {
    settings: 'Settings',
    stats: 'Stats',
    language: 'Language',
    energy: 'Energy',
    level: 'Level',
    xpProgress: 'XP Progress',
    reputation: 'Reputation',
    skillPoints: 'Skill Points',
    achievements: 'Achievements',
    myGarage: 'My Garage',
    carsInGarage: 'cars in garage',
    buyCar: 'Buy Car',
    noCarsYet: 'No Cars Yet',
    browseAdsToFind: 'Browse newspaper ads to find your first car to repair!',
    browseAds: 'Browse Ads',
    emptyBay: 'Empty Bay',
    repairsInProgress: 'repairs in progress',
    sell: 'Sell',
    waiting: 'Waiting...',
    readyToSell: 'Ready to sell',
    fixed: 'fixed',
    newspaperAds: 'Newspaper Ads',
    findNextProject: 'Find your next project car',
    refresh: 'Refresh',
    garageFull: 'Garage Full',
    garageFullMessage: 'Your garage is full! Sell a car or upgrade your garage to buy more.',
    negotiable: 'Negotiable',
    buy: 'Buy',
    askingPrice: 'Asking Price',
    yourOffer: 'Your Offer',
    yourBalance: 'Your Balance',
    negotiate: 'Negotiate',
    buyNow: 'Buy Now',
    negotiations: 'Negotiations',
    carValue: 'Value',
    invested: 'Invested',
    waitingForBuyer: 'Waiting for a buyer...',
    customerWillArrive: 'A customer will arrive soon',
    noIssues: 'No issues in this category',
    working: 'Working...',
    diy: 'DIY',
    failedDiyAttempts: 'Failed DIY attempts',
    listForSale: 'List for Sale',
    potentialProfit: 'Potential profit',
    totalInvested: 'Total invested',
    settingsAndStats: 'Settings & Stats',
    audioSettings: 'Audio Settings',
    soundEffects: 'Sound Effects',
    backgroundMusic: 'Background Music',
    on: 'On',
    off: 'Off',
    playing: 'Playing',
    paused: 'Paused',
    yourStatistics: 'Your Statistics',
    carsSold: 'Cars Sold',
    totalProfit: 'Total Profit',
    currentBalance: 'Current Balance',
    howToPlay: 'How to Play',
    howToPlay1: 'Buy cars from newspaper ads - look for hidden damage!',
    howToPlay2: 'Repair all damaged parts using energy (regenerates 20/min)',
    howToPlay3: 'Sell the car to customers at a profit',
    howToPlay4: 'Upgrade your tools and garage to handle better cars',
    howToPlay5: 'Build reputation to unlock luxury vehicles!',
    resetAllProgress: 'Reset All Progress',
    deleteAllData: 'This will delete all your saved data',
    resetConfirm: 'Are you sure you want to reset all progress? This cannot be undone!',
    shop: 'Shop',
    tools: 'Tools',
    diagnostics: 'Diagnostics',
    garage: 'Garage',
    skills: 'Skills',
    parts: 'Parts',
    current: 'Current',
    upgrade: 'Upgrade',
    max: 'MAX',
    locked: 'Locked',
    mechanical: 'Mechanical',
    body: 'Body',
    tires: 'Tires',
    interior: 'Interior',
    accept: 'Accept',
    counter: 'Counter',
    reject: 'Reject',
    customerOffer: 'Customer Offer',
  },
  it: {
    settings: 'Impostazioni',
    stats: 'Statistiche',
    language: 'Lingua',
    energy: 'Energia',
    level: 'Livello',
    xpProgress: 'Progresso XP',
    reputation: 'Reputazione',
    skillPoints: 'Punti Abilità',
    achievements: 'Obiettivi',
    myGarage: 'Il Mio Garage',
    carsInGarage: 'auto nel garage',
    buyCar: 'Compra Auto',
    noCarsYet: 'Nessuna Auto',
    browseAdsToFind: 'Sfoglia gli annunci per trovare la tua prima auto da riparare!',
    browseAds: 'Sfoglia Annunci',
    emptyBay: 'Box Vuoto',
    repairsInProgress: 'riparazioni in corso',
    sell: 'Vendi',
    waiting: 'In attesa...',
    readyToSell: 'Pronta per la vendita',
    fixed: 'riparate',
    newspaperAds: 'Annunci Giornale',
    findNextProject: 'Trova la tua prossima auto da sistemare',
    refresh: 'Aggiorna',
    garageFull: 'Garage Pieno',
    garageFullMessage: 'Il tuo garage è pieno! Vendi un\'auto o migliora il garage per comprarne altre.',
    negotiable: 'Trattabile',
    buy: 'Compra',
    askingPrice: 'Prezzo Richiesto',
    yourOffer: 'La Tua Offerta',
    yourBalance: 'Il Tuo Saldo',
    negotiate: 'Tratta',
    buyNow: 'Compra Ora',
    negotiations: 'Trattative',
    carValue: 'Valore',
    invested: 'Investito',
    waitingForBuyer: 'In attesa di un acquirente...',
    customerWillArrive: 'Un cliente arriverà presto',
    noIssues: 'Nessun problema in questa categoria',
    working: 'Lavorando...',
    diy: 'Fai da te',
    failedDiyAttempts: 'Tentativi DIY falliti',
    listForSale: 'Metti in Vendita',
    potentialProfit: 'Profitto potenziale',
    totalInvested: 'Totale investito',
    settingsAndStats: 'Impostazioni e Statistiche',
    audioSettings: 'Impostazioni Audio',
    soundEffects: 'Effetti Sonori',
    backgroundMusic: 'Musica di Sottofondo',
    on: 'On',
    off: 'Off',
    playing: 'In riproduzione',
    paused: 'In pausa',
    yourStatistics: 'Le Tue Statistiche',
    carsSold: 'Auto Vendute',
    totalProfit: 'Profitto Totale',
    currentBalance: 'Saldo Attuale',
    howToPlay: 'Come Giocare',
    howToPlay1: 'Compra auto dagli annunci - cerca i danni nascosti!',
    howToPlay2: 'Ripara tutte le parti danneggiate usando energia (rigenera 20/min)',
    howToPlay3: 'Vendi l\'auto ai clienti con profitto',
    howToPlay4: 'Migliora i tuoi strumenti e il garage per gestire auto migliori',
    howToPlay5: 'Costruisci la reputazione per sbloccare veicoli di lusso!',
    resetAllProgress: 'Resetta Tutti i Progressi',
    deleteAllData: 'Questo cancellerà tutti i tuoi dati salvati',
    resetConfirm: 'Sei sicuro di voler resettare tutti i progressi? Non si può annullare!',
    shop: 'Negozio',
    tools: 'Strumenti',
    diagnostics: 'Diagnostica',
    garage: 'Garage',
    skills: 'Abilità',
    parts: 'Parti',
    current: 'Attuale',
    upgrade: 'Migliora',
    max: 'MAX',
    locked: 'Bloccato',
    mechanical: 'Meccanica',
    body: 'Carrozzeria',
    tires: 'Pneumatici',
    interior: 'Interni',
    accept: 'Accetta',
    counter: 'Rilancia',
    reject: 'Rifiuta',
    customerOffer: 'Offerta Cliente',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'car_mechanic_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
