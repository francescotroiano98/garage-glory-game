import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'it';
export type Currency = 'USD' | 'EUR' | 'GBP';

const CURRENCY_SYMBOLS: Record<Currency, string> = { USD: '$', EUR: '€', GBP: '£' };

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
   
  // Challenges
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
  goToOfficeToAnswer: string;
  
  // Part names
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

  // === NEW TRANSLATIONS ===
  
  // Office
  theOffice: string;
  officeDeskDesc: string;
  browseNewspaper: string;
  answerPhone: string;
  incomingCalls: string;
  noCallsYet: string;
  noCallsDesc: string;
  callsWaiting: string;
  cancelListing: string;
  
  // Welcome
  welcomeTitle: string;
  enterYourName: string;
  playerName: string;
  startPlaying: string;
  showTutorial: string;
  
  // Currency
  currencyLabel: string;
  
  // Volume
  musicVolume: string;
  sfxVolume: string;
  
  // CarCard
  readyToSellBadge: string;
  issuesTitle: string;
  noVisibleIssues: string;
  hiddenIssuesText: string;
  value: string;
  
  // CustomerCard
  patienceLabel: string;
  roundsLeftText: string;
  mayLeaveEarly: string;
  counterOfferText: string;
  interestedInText: string;
  declineButton: string;
  
  // Patience levels
  patienceVeryLow: string;
  patienceLow: string;
  patienceMedium: string;
  patienceHigh: string;
  patienceVeryHigh: string;
  
  // Shop additional
  diagnosticEquipment: string;
  specializedEquipment: string;
  diyPerLevel: string;
  expandTo: string;
  currentMaxEnergy: string;
  levelsPerPart: string;
  diySuccessOn: string;
  priceBonus: string;
  hiddenIssueReveal: string;
  overallStats: string;
  energyCostReduction: string;
  carBays: string;
  
  // Challenges
  challengesResetDaily: string;
  
  // Misc
  vehiclesSold: string;
  back: string;
  next: string;
  skip: string;
  letsGo: string;
  noVehiclesMatch: string;
  listedForSaleBadge: string;
  onlyRepairsHere: string;
  goToOffice: string;
  auto: string;
  moto: string;
  truck: string;
  
  // Auth & Leaderboard
  leaderboard: string;
  loading: string;
  noPlayersYet: string;
  you: string;
  login: string;
  signUp: string;
  email: string;
  password: string;
  createAccount: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  loginToPlay: string;
  orContinueAsGuest: string;
  playAsGuest: string;
  logOut: string;
  loggedInAs: string;
  inspectVehicle: string;
  inspectCost: string;
  issuesFound: string;
  noIssuesFound: string;
  watchAd: string;
  watchAdForEnergy: string;
  watchingAd: string;
  adEnergyReward: string;
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
    carsInGarage: 'vehicles in garage',
    buyCar: 'Buy Vehicle',
    noCarsYet: 'No Vehicles Yet',
    browseAdsToFind: 'Go to the Office to browse newspaper ads and find your first vehicle!',
    browseAds: 'Go to Office',
    emptyBay: 'Empty Bay',
    repairsInProgress: 'repairs in progress',
    sell: 'Sell',
    waiting: 'Waiting...',
    readyToSell: 'Ready to sell',
    fixed: 'fixed',
    newspaperAds: 'Newspaper Ads',
    findNextProject: 'Find your next project vehicle',
    refresh: 'Refresh',
    garageFull: 'Garage Full',
    garageFullMessage: 'Your garage is full! Sell a vehicle or upgrade your garage to buy more.',
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
    customerWillArrive: 'A customer will call soon',
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
    carsSold: 'Vehicles Sold',
    totalProfit: 'Total Profit',
    currentBalance: 'Current Balance',
    howToPlay: 'How to Play',
    howToPlay1: 'Go to the Office and browse newspaper ads - look for hidden damage!',
    howToPlay2: 'Repair all damaged parts in the Garage using energy',
    howToPlay3: 'List repaired vehicles and answer customer calls in the Office',
    howToPlay4: 'Upgrade your tools and garage in the Shop',
    howToPlay5: 'Build reputation to unlock better vehicles!',
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
    carNotFound: 'Vehicle not found',
    goBack: 'Go Back',
    goToOfficeToAnswer: 'Go to the Office to answer',
    
    // Part names
    partEngine: 'Engine', partTransmission: 'Transmission', partBrakes: 'Brakes',
    partSuspension: 'Suspension', partExhaust: 'Exhaust', partFuelSystem: 'Fuel System',
    partPaint: 'Paint', partDents: 'Dents', partRust: 'Rust',
    partWindows: 'Windows', partLights: 'Lights', partBumpers: 'Bumpers',
    partFrontTires: 'Front Tires', partRearTires: 'Rear Tires', partWheels: 'Wheels',
    partAlignment: 'Alignment', partTirePressure: 'Tire Pressure', partWheelBearings: 'Wheel Bearings',
    partSeats: 'Seats', partDashboard: 'Dashboard', partElectronics: 'Electronics',
    partCleaning: 'Cleaning', partAirConditioning: 'Air Conditioning', partAudioSystem: 'Audio System',
    partMotoEngine: 'Engine', partMotoChain: 'Chain', partMotoExhaust: 'Exhaust',
    partMotoCarburetor: 'Carburetor', partMotoFairing: 'Fairing', partMotoTank: 'Fuel Tank',
    partMotoFender: 'Fender', partMotoMirrors: 'Mirrors', partMotoFrontTire: 'Front Tire',
    partMotoRearTire: 'Rear Tire', partMotoFrontSuspension: 'Front Fork',
    partMotoRearSuspension: 'Rear Shock', partMotoBattery: 'Battery',
    partMotoWiring: 'Wiring', partMotoInstruments: 'Instruments', partMotoSeat: 'Seat',
    partTruckEngine: 'Engine', partTruckTransmission: 'Transmission',
    partTruckBrakes: 'Brakes', partTruckHydraulics: 'Hydraulics',
    partTruckCabin: 'Cabin', partTruckBed: 'Truck Bed',
    partTruckFrame: 'Frame', partTruckLights: 'Lights',
    partTruckFrontAxle: 'Front Axle', partTruckRearAxle: 'Rear Axle',
    partTruckTires: 'Tires', partTruckSuspension: 'Suspension',
    partTruckDashboard: 'Dashboard', partTruckWiring: 'Wiring',
    partTruckAC: 'A/C', partTruckSeat: 'Seat',
    allVehicles: 'All', cars: 'Cars', motorcycles: 'Motorcycles', trucks: 'Trucks',
    allCategories: 'All Categories',
    damageMinor: 'Minor', damageModerate: 'Moderate', damageMajor: 'Major', damageCritical: 'Critical',
    mech: 'Mech', int: 'Int', tiresShort: 'Tires',
    weeklyChallenges: 'Weekly Challenges',
    resetsMonday: 'Challenges reset Monday at midnight',

    // New
    theOffice: 'The Office',
    officeDeskDesc: 'Buy vehicles and handle customer calls',
    browseNewspaper: 'Newspaper Ads',
    answerPhone: 'Answer Phone',
    incomingCalls: 'Incoming Calls',
    noCallsYet: 'No Calls Yet',
    noCallsDesc: 'List a repaired vehicle for sale to receive calls',
    callsWaiting: 'call(s) waiting',
    cancelListing: 'Cancel listing',
    welcomeTitle: 'Welcome to Garage Glory!',
    enterYourName: 'Enter your name',
    playerName: 'Player Name',
    startPlaying: 'Start Playing',
    showTutorial: 'Show Tutorial',
    currencyLabel: 'Currency',
    musicVolume: 'Music Volume',
    sfxVolume: 'Effects Volume',
    readyToSellBadge: 'Ready to sell',
    issuesTitle: 'Issues',
    noVisibleIssues: 'No visible issues detected',
    hiddenIssuesText: 'hidden issue(s)',
    value: 'Value',
    patienceLabel: 'Patience',
    roundsLeftText: 'round(s) left',
    mayLeaveEarly: 'May leave early!',
    counterOfferText: 'Counter offer:',
    interestedInText: 'Interested in buying for:',
    declineButton: 'Decline',
    patienceVeryLow: 'Very Low', patienceLow: 'Low', patienceMedium: 'Medium',
    patienceHigh: 'High', patienceVeryHigh: 'Very High',
    diagnosticEquipment: 'Diagnostic Equipment',
    specializedEquipment: 'Specialized Equipment (+10% DIY for category)',
    diyPerLevel: '+3% DIY success each level',
    expandTo: 'Expand to',
    currentMaxEnergy: 'Current max',
    levelsPerPart: '10 levels per part',
    diySuccessOn: 'DIY success on',
    priceBonus: 'Price bonus',
    hiddenIssueReveal: 'Hidden issue reveal',
    overallStats: 'Overall',
    energyCostReduction: 'Energy cost',
    carBays: 'car bay(s)',
    challengesResetDaily: 'Challenges reset daily at midnight',
    vehiclesSold: 'Vehicles Sold',
    back: 'Back',
    next: 'Next',
    skip: 'Skip',
    letsGo: "Let's Go!",
    noVehiclesMatch: 'No vehicles match your filters',
    listedForSaleBadge: 'Listed for sale',
    onlyRepairsHere: 'Garage is for repairs only. Go to the Office to buy or sell vehicles.',
    goToOffice: 'Go to Office',
    auto: 'Cars',
    moto: 'Moto',
    truck: 'Trucks',
    leaderboard: 'Leaderboard',
    loading: 'Loading',
    noPlayersYet: 'No players yet',
    you: 'You',
    login: 'Login',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    loginToPlay: 'Login to save your progress and compete!',
    orContinueAsGuest: 'Or continue without an account',
    playAsGuest: 'Play as Guest',
    logOut: 'Log Out',
    loggedInAs: 'Logged in as',
    inspectVehicle: 'Inspect Vehicle',
    inspectCost: 'Inspect',
    issuesFound: 'Issues Found',
    noIssuesFound: 'No additional issues found',
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
    carsInGarage: 'veicoli nel garage',
    buyCar: 'Compra Veicolo',
    noCarsYet: 'Nessun Veicolo',
    browseAdsToFind: 'Vai in Ufficio per sfogliare gli annunci e trovare il tuo primo veicolo!',
    browseAds: 'Vai in Ufficio',
    emptyBay: 'Box Vuoto',
    repairsInProgress: 'riparazioni in corso',
    sell: 'Vendi',
    waiting: 'In attesa...',
    readyToSell: 'Pronto per la vendita',
    fixed: 'riparate',
    newspaperAds: 'Annunci Giornale',
    findNextProject: 'Trova il tuo prossimo veicolo da sistemare',
    refresh: 'Aggiorna',
    garageFull: 'Garage Pieno',
    garageFullMessage: 'Il tuo garage è pieno! Vendi un veicolo o migliora il garage per comprarne altri.',
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
    customerWillArrive: 'Un cliente chiamerà presto',
    noIssues: 'Nessun problema in questa categoria',
    working: 'Lavorando...',
    diy: 'Fai da te',
    failedDiyAttempts: 'Tentativi fai da te falliti',
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
    carsSold: 'Veicoli Venduti',
    totalProfit: 'Profitto Totale',
    currentBalance: 'Saldo Attuale',
    howToPlay: 'Come Giocare',
    howToPlay1: 'Vai in Ufficio e sfoglia gli annunci - cerca i danni nascosti!',
    howToPlay2: 'Ripara tutte le parti danneggiate nel Garage usando energia',
    howToPlay3: 'Metti in vendita i veicoli riparati e rispondi alle chiamate in Ufficio',
    howToPlay4: 'Migliora i tuoi strumenti e il garage nel Negozio',
    howToPlay5: 'Costruisci la reputazione per sbloccare veicoli migliori!',
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
    carNotFound: 'Veicolo non trovato',
    goBack: 'Torna Indietro',
    goToOfficeToAnswer: 'Vai in Ufficio per rispondere',
    
    // Part names
    partEngine: 'Motore', partTransmission: 'Trasmissione', partBrakes: 'Freni',
    partSuspension: 'Sospensioni', partExhaust: 'Scarico', partFuelSystem: 'Impianto Carburante',
    partPaint: 'Verniciatura', partDents: 'Ammaccature', partRust: 'Ruggine',
    partWindows: 'Vetri', partLights: 'Fari', partBumpers: 'Paraurti',
    partFrontTires: 'Pneumatici Anteriori', partRearTires: 'Pneumatici Posteriori',
    partWheels: 'Cerchioni', partAlignment: 'Convergenza',
    partTirePressure: 'Pressione Pneumatici', partWheelBearings: 'Cuscinetti Ruota',
    partSeats: 'Sedili', partDashboard: 'Cruscotto', partElectronics: 'Elettronica',
    partCleaning: 'Pulizia', partAirConditioning: 'Aria Condizionata', partAudioSystem: 'Sistema Audio',
    partMotoEngine: 'Motore', partMotoChain: 'Catena', partMotoExhaust: 'Scarico',
    partMotoCarburetor: 'Carburatore', partMotoFairing: 'Carena', partMotoTank: 'Serbatoio',
    partMotoFender: 'Parafango', partMotoMirrors: 'Specchietti', partMotoFrontTire: 'Gomma Anteriore',
    partMotoRearTire: 'Gomma Posteriore', partMotoFrontSuspension: 'Forcella',
    partMotoRearSuspension: 'Ammortizzatore', partMotoBattery: 'Batteria',
    partMotoWiring: 'Impianto Elettrico', partMotoInstruments: 'Strumentazione', partMotoSeat: 'Sella',
    partTruckEngine: 'Motore', partTruckTransmission: 'Cambio',
    partTruckBrakes: 'Freni', partTruckHydraulics: 'Idraulica',
    partTruckCabin: 'Cabina', partTruckBed: 'Cassone',
    partTruckFrame: 'Telaio', partTruckLights: 'Fari',
    partTruckFrontAxle: 'Asse Anteriore', partTruckRearAxle: 'Asse Posteriore',
    partTruckTires: 'Pneumatici', partTruckSuspension: 'Sospensioni',
    partTruckDashboard: 'Cruscotto', partTruckWiring: 'Impianto Elettrico',
    partTruckAC: 'Aria Condizionata', partTruckSeat: 'Sedile',
    allVehicles: 'Tutti', cars: 'Auto', motorcycles: 'Moto', trucks: 'Camion',
    allCategories: 'Tutte le Categorie',
    damageMinor: 'Lieve', damageModerate: 'Moderato', damageMajor: 'Grave', damageCritical: 'Critico',
    mech: 'Mecc', int: 'Int', tiresShort: 'Gomme',
    weeklyChallenges: 'Sfide Settimanali',
    resetsMonday: 'Le sfide si resettano lunedì a mezzanotte',

    // New
    theOffice: 'L\'Ufficio',
    officeDeskDesc: 'Compra veicoli e gestisci le chiamate dei clienti',
    browseNewspaper: 'Annunci Giornale',
    answerPhone: 'Rispondi al Telefono',
    incomingCalls: 'Chiamate in Arrivo',
    noCallsYet: 'Nessuna Chiamata',
    noCallsDesc: 'Metti in vendita un veicolo riparato per ricevere chiamate',
    callsWaiting: 'chiamata/e in attesa',
    cancelListing: 'Annulla inserzione',
    welcomeTitle: 'Benvenuto in Garage Glory!',
    enterYourName: 'Inserisci il tuo nome',
    playerName: 'Nome Giocatore',
    startPlaying: 'Inizia a Giocare',
    showTutorial: 'Mostra Tutorial',
    currencyLabel: 'Valuta',
    musicVolume: 'Volume Musica',
    sfxVolume: 'Volume Effetti',
    readyToSellBadge: 'Pronto per la vendita',
    issuesTitle: 'Problemi',
    noVisibleIssues: 'Nessun problema visibile rilevato',
    hiddenIssuesText: 'problema/i nascosto/i',
    value: 'Valore',
    patienceLabel: 'Pazienza',
    roundsLeftText: 'round rimanenti',
    mayLeaveEarly: 'Potrebbe andarsene!',
    counterOfferText: 'Controproposta:',
    interestedInText: 'Interessato ad acquistare per:',
    declineButton: 'Rifiuta',
    patienceVeryLow: 'Molto Bassa', patienceLow: 'Bassa', patienceMedium: 'Media',
    patienceHigh: 'Alta', patienceVeryHigh: 'Molto Alta',
    diagnosticEquipment: 'Strumenti Diagnostici',
    specializedEquipment: 'Attrezzature Specializzate (+10% fai da te per categoria)',
    diyPerLevel: '+3% successo fai da te per livello',
    expandTo: 'Espandi a',
    currentMaxEnergy: 'Massimo attuale',
    levelsPerPart: '10 livelli per parte',
    diySuccessOn: 'Successo fai da te su',
    priceBonus: 'Bonus prezzo',
    hiddenIssueReveal: 'Rivelazione problemi nascosti',
    overallStats: 'Complessivo',
    energyCostReduction: 'Costo energia',
    carBays: 'box garage',
    challengesResetDaily: 'Le sfide si resettano a mezzanotte',
    vehiclesSold: 'Veicoli Venduti',
    back: 'Indietro',
    next: 'Avanti',
    skip: 'Salta',
    letsGo: 'Iniziamo!',
    noVehiclesMatch: 'Nessun veicolo corrisponde ai filtri',
    listedForSaleBadge: 'In vendita',
    onlyRepairsHere: 'Il Garage è solo per le riparazioni. Vai in Ufficio per comprare o vendere veicoli.',
    goToOffice: 'Vai in Ufficio',
    auto: 'Auto',
    moto: 'Moto',
    truck: 'Camion',
    leaderboard: 'Classifica',
    loading: 'Caricamento',
    noPlayersYet: 'Nessun giocatore ancora',
    you: 'Tu',
    login: 'Accedi',
    signUp: 'Registrati',
    email: 'Email',
    password: 'Password',
    createAccount: 'Crea Account',
    alreadyHaveAccount: 'Hai già un account?',
    dontHaveAccount: 'Non hai un account?',
    loginToPlay: 'Accedi per salvare i progressi e competere!',
    orContinueAsGuest: 'Oppure continua senza account',
    playAsGuest: 'Gioca come Ospite',
    logOut: 'Esci',
    loggedInAs: 'Connesso come',
    inspectVehicle: 'Ispeziona Veicolo',
    inspectCost: 'Ispeziona',
    issuesFound: 'Problemi Trovati',
    noIssuesFound: 'Nessun problema aggiuntivo trovato',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatMoney: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'car_mechanic_language';
const CURRENCY_KEY = 'car_mechanic_currency';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return (saved as Language) || 'en';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem(CURRENCY_KEY);
    return (saved as Currency) || 'USD';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem(CURRENCY_KEY, c);
  };

  const formatMoney = (amount: number) => {
    return `${CURRENCY_SYMBOLS[currency]}${amount.toLocaleString()}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], currency, setCurrency, formatMoney }}>
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
