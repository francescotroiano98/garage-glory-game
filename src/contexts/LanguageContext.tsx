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
   
   // Additional translations
   dailyChallenges: string;
   claim: string;
   completed: string;
   progress: string;
   reward: string;
   electrical: string;
   diagnosis: string;
   negotiation: string;
   upgradeShop: string;
   improveGarage: string;
   partSpecializations: string;
   repairTools: string;
   diagnosticTools: string;
   garageBays: string;
   garageEquipment: string;
   energyCapacity: string;
   owned: string;
   installed: string;
   notEnoughMoney: string;
   carNotFound: string;
   goBack: string;
   
   // Part names translations
   partEngine: string;
   partTransmission: string;
   partBrakes: string;
   partSuspension: string;
   partExhaust: string;
   partFuelSystem: string;
   partPaint: string;
   partDents: string;
   partRust: string;
   partWindows: string;
   partLights: string;
   partBumpers: string;
   partFrontTires: string;
   partRearTires: string;
   partWheels: string;
   partAlignment: string;
   partTirePressure: string;
   partWheelBearings: string;
   partSeats: string;
   partDashboard: string;
   partElectronics: string;
   partCleaning: string;
   partAirConditioning: string;
   partAudioSystem: string;
   // Motorcycle part names
   partMotoEngine: string;
   partMotoChain: string;
   partMotoExhaust: string;
   partMotoCarburetor: string;
   partMotoFairing: string;
   partMotoTank: string;
   partMotoFender: string;
   partMotoMirrors: string;
   partMotoFrontTire: string;
   partMotoRearTire: string;
   partMotoFrontSuspension: string;
   partMotoRearSuspension: string;
   partMotoBattery: string;
   partMotoWiring: string;
   partMotoInstruments: string;
    partMotoSeat: string;
    // Truck part names
    partTruckEngine: string;
    partTruckTransmission: string;
    partTruckBrakes: string;
    partTruckHydraulics: string;
    partTruckCabin: string;
    partTruckBed: string;
    partTruckFrame: string;
    partTruckLights: string;
    partTruckFrontAxle: string;
    partTruckRearAxle: string;
    partTruckTires: string;
    partTruckSuspension: string;
    partTruckDashboard: string;
    partTruckWiring: string;
    partTruckAC: string;
    partTruckSeat: string;
    
    // Filters
    allVehicles: string;
    cars: string;
    motorcycles: string;
    trucks: string;
    allCategories: string;
   // Damage levels
   damageMinor: string;
   damageModerate: string;
   damageMajor: string;
   damageCritical: string;
   
   // Shop page
   mech: string;
   int: string;
   tiresShort: string;
   
   // Weekly challenges
   weeklyChallenges: string;
   resetsMonday: string;
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
     dailyChallenges: 'Daily Challenges',
     claim: 'Claim',
     completed: 'Completed',
     progress: 'Progress',
     reward: 'Reward',
     electrical: 'Electrical',
     diagnosis: 'Diagnosis',
     negotiation: 'Negotiation',
     upgradeShop: 'Upgrade Shop',
     improveGarage: 'Improve your garage and tools',
     partSpecializations: 'Part Specializations',
     repairTools: 'Repair Tools',
     diagnosticTools: 'Diagnostic Tools',
     garageBays: 'Garage Bays',
     garageEquipment: 'Garage Equipment',
     energyCapacity: 'Energy Capacity',
     owned: 'Owned',
     installed: 'Installed',
     notEnoughMoney: 'Not enough money!',
     carNotFound: 'Car not found',
     goBack: 'Go Back',
     
     // Part names
     partEngine: 'Engine',
     partTransmission: 'Transmission',
     partBrakes: 'Brakes',
     partSuspension: 'Suspension',
     partExhaust: 'Exhaust',
     partFuelSystem: 'Fuel System',
     partPaint: 'Paint',
     partDents: 'Dents',
     partRust: 'Rust',
     partWindows: 'Windows',
     partLights: 'Lights',
     partBumpers: 'Bumpers',
     partFrontTires: 'Front Tires',
     partRearTires: 'Rear Tires',
     partWheels: 'Wheels',
     partAlignment: 'Alignment',
     partTirePressure: 'Tire Pressure',
     partWheelBearings: 'Wheel Bearings',
     partSeats: 'Seats',
     partDashboard: 'Dashboard',
     partElectronics: 'Electronics',
     partCleaning: 'Cleaning',
     partAirConditioning: 'Air Conditioning',
     partAudioSystem: 'Audio System',
     // Motorcycle parts
     partMotoEngine: 'Engine', partMotoChain: 'Chain', partMotoExhaust: 'Exhaust',
     partMotoCarburetor: 'Carburetor', partMotoFairing: 'Fairing', partMotoTank: 'Fuel Tank',
     partMotoFender: 'Fender', partMotoMirrors: 'Mirrors', partMotoFrontTire: 'Front Tire',
     partMotoRearTire: 'Rear Tire', partMotoFrontSuspension: 'Front Fork',
     partMotoRearSuspension: 'Rear Shock', partMotoBattery: 'Battery',
     partMotoWiring: 'Wiring', partMotoInstruments: 'Instruments', partMotoSeat: 'Seat',
     
     // Damage levels
     damageMinor: 'Minor',
     damageModerate: 'Moderate',
     damageMajor: 'Major',
     damageCritical: 'Critical',
     
     // Shop page
     mech: 'Mech',
     int: 'Int',
     tiresShort: 'Tires',
     
     // Weekly challenges
     weeklyChallenges: 'Weekly Challenges',
     resetsMonday: 'Challenges reset Monday at midnight',
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
     dailyChallenges: 'Sfide Giornaliere',
     claim: 'Riscuoti',
     completed: 'Completato',
     progress: 'Progresso',
     reward: 'Ricompensa',
     electrical: 'Elettrica',
     diagnosis: 'Diagnosi',
     negotiation: 'Trattativa',
     upgradeShop: 'Negozio Upgrade',
     improveGarage: 'Migliora il tuo garage e i tuoi strumenti',
     partSpecializations: 'Specializzazioni Parti',
     repairTools: 'Strumenti di Riparazione',
     diagnosticTools: 'Strumenti Diagnostici',
     garageBays: 'Box Garage',
     garageEquipment: 'Attrezzature Garage',
     energyCapacity: 'Capacità Energia',
     owned: 'Posseduto',
     installed: 'Installato',
     notEnoughMoney: 'Soldi insufficienti!',
     carNotFound: 'Auto non trovata',
     goBack: 'Torna Indietro',
     
     // Part names
     partEngine: 'Motore',
     partTransmission: 'Trasmissione',
     partBrakes: 'Freni',
     partSuspension: 'Sospensioni',
     partExhaust: 'Scarico',
     partFuelSystem: 'Impianto Carburante',
     partPaint: 'Verniciatura',
     partDents: 'Ammaccature',
     partRust: 'Ruggine',
     partWindows: 'Vetri',
     partLights: 'Fari',
     partBumpers: 'Paraurti',
     partFrontTires: 'Pneumatici Anteriori',
     partRearTires: 'Pneumatici Posteriori',
     partWheels: 'Cerchioni',
     partAlignment: 'Convergenza',
     partTirePressure: 'Pressione Pneumatici',
     partWheelBearings: 'Cuscinetti Ruota',
     partSeats: 'Sedili',
     partDashboard: 'Cruscotto',
     partElectronics: 'Elettronica',
     partCleaning: 'Pulizia',
     partAirConditioning: 'Aria Condizionata',
     partAudioSystem: 'Sistema Audio',
     // Motorcycle parts
     partMotoEngine: 'Motore', partMotoChain: 'Catena', partMotoExhaust: 'Scarico',
     partMotoCarburetor: 'Carburatore', partMotoFairing: 'Carena', partMotoTank: 'Serbatoio',
     partMotoFender: 'Parafango', partMotoMirrors: 'Specchietti', partMotoFrontTire: 'Gomma Anteriore',
     partMotoRearTire: 'Gomma Posteriore', partMotoFrontSuspension: 'Forcella',
     partMotoRearSuspension: 'Ammortizzatore', partMotoBattery: 'Batteria',
     partMotoWiring: 'Impianto Elettrico', partMotoInstruments: 'Strumentazione', partMotoSeat: 'Sella',
     
     // Damage levels
     damageMinor: 'Lieve',
     damageModerate: 'Moderato',
     damageMajor: 'Grave',
     damageCritical: 'Critico',
     
     // Shop page
     mech: 'Mecc',
     int: 'Int',
     tiresShort: 'Gomme',
     
     // Weekly challenges
     weeklyChallenges: 'Sfide Settimanali',
     resetsMonday: 'Le sfide si resettano lunedì a mezzanotte',
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
