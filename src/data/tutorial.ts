// Interactive Tutorial System
export type TutorialPhase = 'intro' | 'spotlight';

export interface IntroSlide {
  id: string;
  icon: string;
  titleEn: string;
  titleIt: string;
  descEn: string;
  descIt: string;
}

export interface SpotlightStep {
  id: string;
  targetId: string; // data-tutorial-id on the element
  titleEn: string;
  titleIt: string;
  descEn: string;
  descIt: string;
  icon: string;
  requiredAction?: 'navigate_office' | 'buy_vehicle' | 'navigate_garage' | 'select_vehicle' | 'repair_part' | 'list_for_sale' | 'navigate_shop' | 'navigate_collection' | 'acknowledge' | 'click_target';
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  navigateTo?: string; // screen to navigate to before showing this step
  rewardCoins?: number;
}

export const INTRO_SLIDES: IntroSlide[] = [
  {
    id: 'intro_welcome',
    icon: '🏁',
    titleEn: 'Welcome to Garage Glory!',
    titleIt: 'Benvenuto in Garage Glory!',
    descEn: 'Build your vehicle flipping empire from scratch. Buy damaged vehicles, repair them, and sell for profit!',
    descIt: 'Costruisci il tuo impero di compravendita veicoli da zero. Compra veicoli danneggiati, riparali e vendili con profitto!',
  },
  {
    id: 'intro_loop',
    icon: '🔄',
    titleEn: 'The Business Loop',
    titleIt: 'Il Ciclo del Business',
    descEn: 'Buy cheap → Repair damage → Sell high. Use your earnings to upgrade tools and expand your garage!',
    descIt: 'Compra a poco → Ripara i danni → Vendi a tanto. Usa i guadagni per migliorare gli strumenti e ampliare il garage!',
  },
  {
    id: 'intro_start',
    icon: '🚀',
    titleEn: "Let's get started!",
    titleIt: 'Iniziamo!',
    descEn: "Follow the guided steps to learn the basics. Complete each action to continue. Let's buy your first vehicle!",
    descIt: 'Segui i passaggi guidati per imparare le basi. Completa ogni azione per continuare. Compriamo il tuo primo veicolo!',
  },
];

export const SPOTLIGHT_STEPS: SpotlightStep[] = [
  {
    id: 'step_stats',
    targetId: 'tutorial-stats-bar',
    icon: '📊',
    titleEn: 'Your Resources',
    titleIt: 'Le Tue Risorse',
    descEn: 'This is your money and energy. Money buys vehicles and parts. Energy is spent on repairs and recharges over time.',
    descIt: 'Questi sono i tuoi soldi e la tua energia. I soldi servono per comprare veicoli e parti. L\'energia si usa per le riparazioni e si ricarica nel tempo.',
    requiredAction: 'acknowledge',
    tooltipPosition: 'bottom',
  },
  {
    id: 'step_go_office',
    targetId: 'tutorial-nav-office',
    icon: '🏢',
    titleEn: 'Go to the Office',
    titleIt: 'Vai in Ufficio',
    descEn: 'Tap the Office tab to browse newspaper ads and find vehicles to buy!',
    descIt: 'Tocca la scheda Ufficio per sfogliare gli annunci e trovare veicoli da comprare!',
    requiredAction: 'navigate_office',
    tooltipPosition: 'top',
  },
  {
    id: 'step_buy_vehicle',
    targetId: 'tutorial-newspaper-btn',
    icon: '📰',
    titleEn: 'Browse & Buy',
    titleIt: 'Sfoglia e Compra',
    descEn: 'Open the newspaper ads and buy your first vehicle! Look for one within your budget.',
    descIt: 'Apri gli annunci del giornale e compra il tuo primo veicolo! Cercane uno nel tuo budget.',
    requiredAction: 'click_target',
    tooltipPosition: 'bottom',
    navigateTo: 'office',
  },
  {
    id: 'step_select_listing',
    targetId: 'tutorial-vehicle-listing',
    icon: '🚙',
    titleEn: 'Pick a Vehicle',
    titleIt: 'Scegli un Veicolo',
    descEn: 'Tap on a vehicle listing to see its details and price.',
    descIt: 'Tocca un annuncio per vederne dettagli e prezzo.',
    requiredAction: 'click_target',
    tooltipPosition: 'bottom',
  },
  {
    id: 'step_buy_now',
    targetId: 'tutorial-buy-now-btn',
    icon: '💰',
    titleEn: 'Buy It Now',
    titleIt: 'Comprala Ora',
    descEn: 'Hit "Buy Now" to add this vehicle to your garage!',
    descIt: 'Premi "Compra ora" per aggiungere il veicolo al tuo garage!',
    requiredAction: 'buy_vehicle',
    tooltipPosition: 'top',
  },
  {
    id: 'step_go_garage',
    targetId: 'tutorial-nav-garage',
    icon: '🏠',
    titleEn: 'Back to Garage',
    titleIt: 'Torna al Garage',
    descEn: 'Great purchase! Now go to the Garage to see your vehicle and start repairs.',
    descIt: 'Ottimo acquisto! Ora vai al Garage per vedere il tuo veicolo e iniziare le riparazioni.',
    requiredAction: 'navigate_garage',
    tooltipPosition: 'top',
    rewardCoins: 50,
  },
  {
    id: 'step_select_vehicle',
    targetId: 'tutorial-car-card',
    icon: '🚗',
    titleEn: 'Select Your Vehicle',
    titleIt: 'Seleziona il Veicolo',
    descEn: 'Tap on your vehicle to open the repair screen and see what needs fixing!',
    descIt: 'Tocca il tuo veicolo per aprire la schermata di riparazione e vedere cosa va sistemato!',
    requiredAction: 'select_vehicle',
    tooltipPosition: 'bottom',
  },
  {
    id: 'step_repair',
    targetId: 'tutorial-repair-area',
    icon: '🔧',
    titleEn: 'Repair a Part',
    titleIt: 'Ripara una Parte',
    descEn: 'Choose a damaged part and repair it! Use Pro Repair (guaranteed) or DIY (cheaper but may fail).',
    descIt: 'Scegli una parte danneggiata e riparala! Usa Riparazione Pro (garantita) o Fai da Te (più economico ma può fallire).',
    requiredAction: 'repair_part',
    tooltipPosition: 'top',
  },
  {
    id: 'step_back_to_garage',
    targetId: 'tutorial-repair-back',
    icon: '↩️',
    titleEn: 'Back to Garage',
    titleIt: 'Torna al Garage',
    descEn: 'Tap the back arrow to return to your garage.',
    descIt: 'Tocca la freccia indietro per tornare al tuo garage.',
    requiredAction: 'click_target',
    tooltipPosition: 'bottom',
  },
  {
    id: 'step_shop',
    targetId: 'tutorial-nav-shop',
    icon: '🛒',
    titleEn: 'Visit the Shop',
    titleIt: 'Visita il Negozio',
    descEn: 'Upgrade your tools, skills and garage here. Better equipment means faster and cheaper repairs!',
    descIt: 'Migliora i tuoi strumenti, abilità e garage qui. Attrezzature migliori = riparazioni più veloci e economiche!',
    requiredAction: 'navigate_shop',
    tooltipPosition: 'top',
  },
  {
    id: 'step_collection',
    targetId: 'tutorial-nav-collection',
    icon: '🃏',
    titleEn: 'Card Collection',
    titleIt: 'Collezione Carte',
    descEn: 'Collect vehicle cards! Buy card packs in the shop and complete your album for rewards.',
    descIt: 'Colleziona le carte dei veicoli! Compra pacchetti nel negozio e completa il tuo album per ottenere ricompense.',
    requiredAction: 'navigate_collection',
    tooltipPosition: 'top',
  },
  {
    id: 'step_complete',
    targetId: 'tutorial-stats-bar',
    icon: '🎉',
    titleEn: "You're Ready!",
    titleIt: 'Sei Pronto!',
    descEn: 'You know the basics! Keep buying, repairing and selling vehicles to grow your empire. Good luck, mechanic!',
    descIt: 'Conosci le basi! Continua a comprare, riparare e vendere veicoli per far crescere il tuo impero. Buona fortuna, meccanico!',
    requiredAction: 'acknowledge',
    tooltipPosition: 'bottom',
    rewardCoins: 100,
  },
];
