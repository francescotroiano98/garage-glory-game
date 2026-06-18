import { PartType, PartCategory, VehicleCategory } from '@/types/game';
import { Language } from '@/contexts/LanguageContext';

// Map part types to translation keys
export const PART_TRANSLATION_KEYS: Record<PartType, string> = {
  engine: 'partEngine', transmission: 'partTransmission', brakes: 'partBrakes',
  suspension: 'partSuspension', exhaust: 'partExhaust', fuel_system: 'partFuelSystem',
  paint: 'partPaint', dents: 'partDents', rust: 'partRust',
  windows: 'partWindows', lights: 'partLights', bumpers: 'partBumpers',
  front_tires: 'partFrontTires', rear_tires: 'partRearTires', wheels: 'partWheels',
  alignment: 'partAlignment', tire_pressure: 'partTirePressure', wheel_bearings: 'partWheelBearings',
  seats: 'partSeats', dashboard: 'partDashboard', electronics: 'partElectronics',
  cleaning: 'partCleaning', air_conditioning: 'partAirConditioning', audio_system: 'partAudioSystem',
  moto_engine: 'partMotoEngine', moto_chain: 'partMotoChain',
  moto_exhaust: 'partMotoExhaust', moto_carburetor: 'partMotoCarburetor',
  moto_fairing: 'partMotoFairing', moto_tank: 'partMotoTank',
  moto_fender: 'partMotoFender', moto_mirrors: 'partMotoMirrors',
  moto_front_tire: 'partMotoFrontTire', moto_rear_tire: 'partMotoRearTire',
  moto_front_suspension: 'partMotoFrontSuspension', moto_rear_suspension: 'partMotoRearSuspension',
  moto_battery: 'partMotoBattery', moto_wiring: 'partMotoWiring',
  moto_instruments: 'partMotoInstruments', moto_seat: 'partMotoSeat',
  truck_engine: 'partTruckEngine', truck_transmission: 'partTruckTransmission',
  truck_brakes: 'partTruckBrakes', truck_hydraulics: 'partTruckHydraulics',
  truck_cabin: 'partTruckCabin', truck_bed: 'partTruckBed',
  truck_frame: 'partTruckFrame', truck_lights: 'partTruckLights',
  truck_front_axle: 'partTruckFrontAxle', truck_rear_axle: 'partTruckRearAxle',
  truck_tires: 'partTruckTires', truck_suspension: 'partTruckSuspension',
  truck_dashboard: 'partTruckDashboard', truck_wiring: 'partTruckWiring',
  truck_ac: 'partTruckAC', truck_seat: 'partTruckSeat',
};

export const CATEGORY_TRANSLATION_KEYS: Record<PartCategory, string> = {
  mechanical: 'mechanical',
  body: 'body',
  tires: 'tires',
  interior: 'interior',
};

export const DAMAGE_LEVEL_KEYS: Record<string, string> = {
  minor: 'damageMinor',
  moderate: 'damageModerate',
  major: 'damageMajor',
  critical: 'damageCritical',
};

export function getPartName(part: PartType, t: Record<string, string>): string {
  const key = PART_TRANSLATION_KEYS[part];
  return t[key] || part.replace(/_/g, ' ');
}

export function getCategoryName(category: PartCategory, t: Record<string, string>): string {
  const key = CATEGORY_TRANSLATION_KEYS[category];
  return t[key] || category;
}

export function getDamageLevelName(level: string, t: Record<string, string>): string {
  const key = DAMAGE_LEVEL_KEYS[level];
  return t[key] || level;
}

// Vehicle category display names by language
export const CATEGORY_DISPLAY_NAMES: Record<Language, Record<VehicleCategory, string>> = {
  en: {
    junker: 'Junker', beater: 'Beater', economy: 'Economy', hatchback: 'Hatchback',
    sedan: 'Sedan', coupe: 'Coupe', suv_mid: 'Mid SUV', crossover: 'Crossover',
    muscle: 'Muscle', sports_premium: 'Premium Sports', luxury_mid: 'Mid Luxury', supercar: 'Supercar',
    moto_old_scooter: 'Old Scooter', moto_scooter: 'Scooter', moto_125: '125cc',
    moto_naked: 'Naked', moto_chopper: 'Chopper', moto_touring: 'Touring', moto_adventure: 'Adventure',
    moto_enduro: 'Enduro', moto_supersport: 'Supersport', moto_caferacer: 'Cafe Racer',
    moto_electric: 'Electric', moto_superbike: 'Superbike',
    truck_old_pickup: 'Old Pickup', truck_pickup: 'Pickup', truck_van: 'Van',
    truck_delivery: 'Delivery', truck_flatbed: 'Flatbed', truck_dump: 'Dump Truck',
    truck_box: 'Box Truck', truck_tow: 'Tow Truck', truck_refrigerated: 'Refrigerated',
    truck_semi_light: 'Light Semi', truck_semi: 'Semi',
    truck_heavy: 'Heavy Duty',
  },
  it: {
    junker: 'Rottame', beater: 'Malandata', economy: 'Utilitaria', hatchback: 'Berlina Compatta',
    sedan: 'Berlina', coupe: 'Coupé', suv_mid: 'SUV Medio', crossover: 'Crossover',
    muscle: 'Muscle Car', sports_premium: 'Sportiva Premium', luxury_mid: 'Lusso Medio', supercar: 'Supercar',
    moto_old_scooter: 'Motorino Vecchio', moto_scooter: 'Scooter', moto_125: '125cc',
    moto_naked: 'Naked', moto_chopper: 'Chopper', moto_touring: 'Touring', moto_adventure: 'Adventure',
    moto_enduro: 'Enduro', moto_supersport: 'Supersport', moto_caferacer: 'Cafe Racer',
    moto_electric: 'Elettrica', moto_superbike: 'Superbike',
    truck_old_pickup: 'Pickup Vecchio', truck_pickup: 'Pickup', truck_van: 'Furgone',
    truck_delivery: 'Corriere', truck_flatbed: 'Pianale', truck_dump: 'Ribaltabile',
    truck_box: 'Furgone Box', truck_tow: 'Carro Attrezzi', truck_refrigerated: 'Frigorifero',
    truck_semi_light: 'Semirimorchio Leggero', truck_semi: 'Semirimorchio',
    truck_heavy: 'Mezzo Pesante',
  },
};

// Vehicle template name translations (English → Italian)
export const VEHICLE_NAME_IT: Record<string, string> = {
  // Cars - Economy
  'Rusty Beater': 'Rottame Arrugginito', 'Old Clunker': 'Vecchio Catorcio', 'Worn Jalopy': 'Carretta Usurata',
  'Tired Runabout': 'Utilitaria Stanca', 'Faded Runner': 'Corridore Sbiadito', 'Rough Daily': 'Quotidiana Malridotta',
  'Compact Hatch': 'Utilitaria Compatta', 'City Runner': 'Cittadina Agile', 'Budget Wagon': 'Familiare Economica',
  'Mini Coupe': 'Mini Coupé', 'Urban Hatch': 'Utilitaria Urbana', 'Eco Sprint': 'Sprint Ecologica',
  'Metro Cruiser': 'Cruiser Metropolitana', 'Penny Saver': 'Risparmiatrice', 'Quick Hatch': 'Berlina Rapida',
  // Cars - Sedan
  'Family Sedan': 'Berlina Familiare', 'Classic Sedan': 'Berlina Classica', 'Touring Sedan': 'Berlina Turismo',
  'Estate Wagon': 'Familiare Elegante', 'Family Wagon': 'Familiare Spaziosa', 'Touring Wagon': 'Familiare Turismo',
  'Sport Coupe': 'Coupé Sportiva', 'Grand Coupe': 'Gran Coupé', 'Turbo Coupe': 'Coupé Turbo',
  // Cars - SUV
  'Compact SUV': 'SUV Compatto', 'Urban Crossover': 'Crossover Urbano', 'City Explorer': 'Esploratrice Urbana',
  'Family SUV': 'SUV Familiare', 'Trail Blazer': 'Apripista', 'Adventure SUV': 'SUV Avventura',
  'Premium SUV': 'SUV Premium', 'Expedition SUV': 'SUV Spedizione', 'Grand Explorer': 'Grande Esploratrice',
  'Luxury Crossover': 'Crossover di Lusso', 'Sport Crossover': 'Crossover Sportivo', 'Elite Crossover': 'Crossover Elite',
  // Cars - Sports
  'Muscle Classic': 'Muscle Classica', 'Power Runner': 'Corridore Potente', 'Street Beast': 'Bestia da Strada',
  'Sports Coupe': 'Coupé Sportiva', 'Track Monster': 'Mostro da Pista', 'Speed Demon': 'Demone della Velocità',
  'GT Racer': 'GT da Corsa', 'Drift King': 'Re del Drift', 'Street Rocket': 'Razzo da Strada',
  // Cars - Luxury
  'Entry Luxury': 'Lusso Base', 'Business Class': 'Business Class', 'Executive Sedan': 'Berlina Dirigenziale',
  'Grand Tourer': 'Gran Turismo', 'Royal Sedan': 'Berlina Reale', 'Prestige Coupe': 'Coupé Prestigio',
  'Elite Roadster': 'Roadster Elite', 'Platinum Edition': 'Edizione Platino', 'Premium Convertible': 'Cabrio Premium',
  'Exotic Racer': 'Corsa Esotica', 'Limited Edition': 'Edizione Limitata', 'Rare Import': 'Importazione Rara',
  'Hypercar': 'Hypercar', 'Ultimate Machine': 'Macchina Definitiva', 'Legend Edition': 'Edizione Leggenda',
  // Motorcycles
  'Rusty Vespa': 'Vespa Arrugginita', 'Old Ciao': 'Vecchio Ciao', 'Vintage Lambretta': 'Lambretta d\'Epoca',
  'City Scooter': 'Scooter Cittadino', 'Urban Runner': 'Corridore Urbano', 'Commuter 50': 'Pendolare 50',
  'Street 125': 'Strada 125', 'City Bike 125': 'Bici Città 125', 'Sport 125': 'Sport 125',
  'Streetfighter': 'Streetfighter', 'Urban Naked': 'Naked Urbana', 'Power Naked': 'Naked Potente',
  'Highway King': 'Re dell\'Autostrada', 'Cross Tourer': 'Cross Turismo',
  'Trail Master': 'Maestro dei Sentieri', 'Rally Adventure': 'Rally Avventura', 'Globe Trotter': 'Giramondo',
  'Dirt Racer': 'Corridore Sterrato', 'Enduro Pro': 'Enduro Pro', 'Motocross Beast': 'Bestia Motocross',
  'Track Missile': 'Missile da Pista', 'Race Replica': 'Replica da Corsa',
  'Retro Racer': 'Corsa Retrò', 'Classic Sport': 'Sport Classica', 'Vintage Custom': 'Custom d\'Epoca',
  'Hypersport': 'Hypersport', 'Ultimate Racer': 'Corridore Definitivo', 'Legend Bike': 'Moto Leggenda',
  // Trucks
  'Rusty Farm Truck': 'Camion Agricolo Arrugginito', 'Old Work Pickup': 'Pickup da Lavoro Vecchio', 'Vintage Hauler': 'Trasportatore d\'Epoca',
  'Ranch Pickup': 'Pickup da Ranch', 'City Pickup': 'Pickup Cittadino', 'Work Pickup': 'Pickup da Lavoro',
  'Cargo Van': 'Furgone Cargo', 'Panel Van': 'Furgone Chiuso', 'Utility Van': 'Furgone Utilitario',
  'Delivery Express': 'Corriere Express', 'City Courier': 'Corriere Cittadino', 'Route Runner': 'Corridore di Rotta',
  'Work Flatbed': 'Pianale da Lavoro', 'Construction Hauler': 'Trasportatore Edile', 'Platform Truck': 'Camion a Piattaforma',
  'Moving Truck': 'Camion Traslochi', 'Box Hauler': 'Trasportatore Box', 'Freight Box': 'Box Merci',
  'City Tow': 'Carro Attrezzi Cittadino', 'Heavy Rescue': 'Soccorso Pesante', 'Road Recovery': 'Recupero Stradale',
  'Day Cab': 'Cabina Giornaliera', 'Regional Hauler': 'Trasportatore Regionale', 'Light Semi': 'Semirimorchio Leggero',
  'Long Hauler': 'Trasportatore Lungo Raggio', 'Cross Country': 'Attraversa Paesi',
  'Heavy Duty': 'Mezzo Pesante', 'Titan Hauler': 'Trasportatore Titano', 'Road Beast': 'Bestia della Strada',

  // === Expansion pack — Cars ===
  'Scrapyard Special': 'Speciale Sfasciacarrozze', 'Forgotten Wreck': 'Relitto Dimenticato',
  'Backyard Project': 'Progetto da Cortile', 'Smoky Commuter': 'Pendolare Fumante',
  'Thrifty Hatch': 'Utilitaria Risparmiosa', 'Daily Driver': 'Auto Quotidiana',
  'Pocket Rocket': 'Razzo Tascabile', 'Tiny Tourer': 'Piccola Turismo',
  'Zippy Hatch': 'Utilitaria Scattante', 'Suburban Hatch': 'Utilitaria Suburbana',
  'Executive Saloon': 'Berlina Dirigente', 'Heritage Sedan': 'Berlina Storica',
  'Cargo Wagon': 'Familiare da Carico', 'Vintage Estate': 'Familiare d\'Epoca',
  'Boulevard Coupe': 'Coupé da Boulevard', 'Twin-Turbo Coupe': 'Coupé Bi-Turbo',
  'Trail Compact': 'Compatto da Sentiero', 'Weekend SUV': 'SUV del Weekend',
  'Outback Cruiser': 'Cruiser Outback', 'Heritage SUV': 'SUV Storico',
  'Frontier SUV': 'SUV Frontiera', 'Pioneer SUV': 'SUV Pioniere',
  'Hybrid Crossover': 'Crossover Ibrido', 'Apex Crossover': 'Crossover Apex',
  'Big Block Bruiser': 'Bruto Big Block', 'Detroit Iron': 'Ferro di Detroit',
  'Apex Coupe': 'Coupé Apex', 'Canyon Carver': 'Scolpisci Canyon',
  'Targa Master': 'Maestro Targa', 'Carbon Edition': 'Edizione Carbonio',
  'Diplomat Sedan': 'Berlina Diplomatica', 'Chairman Edition': 'Edizione Presidenziale',
  'Royal Tourer': 'Turismo Reale', 'Imperial Coupe': 'Coupé Imperiale',
  'Crown Limousine': 'Limousine Corona', 'Sapphire Sedan': 'Berlina Zaffiro',
  'Carbon Predator': 'Predatore in Carbonio', 'Silver Arrow': 'Freccia d\'Argento',
  'Phantom Hyper': 'Phantom Hyper', 'Apex One-Off': 'Apex Esemplare Unico',

  // === Expansion pack — Motorcycles ===
  'Garage Find Vespa': 'Vespa Trovata in Garage', 'Sidecar Relic': 'Reliquia con Sidecar',
  'Eco Scooter': 'Scooter Ecologico', 'Maxi Scooter': 'Maxi Scooter',
  'Custom 125': 'Custom 125', 'Cruiser 125': 'Cruiser 125',
  'Cafe Naked': 'Naked Café', 'Roadster Naked': 'Naked Roadster',
  'Sport Tourer': 'Sport Turismo', 'Bagger': 'Bagger',
  'Desert Adventure': 'Avventura nel Deserto', 'Big Bore Adventure': 'Avventura Maxi Cilindrata',
  'Trail Enduro': 'Enduro da Trail', 'Hard Enduro': 'Hard Enduro',
  'Track Day Special': 'Speciale Track Day', 'World SBK': 'World SBK',
  'Brat Style': 'Stile Brat', 'Bobber Custom': 'Bobber Custom',
  'Carbon Superbike': 'Superbike in Carbonio', 'MotoGP Replica': 'Replica MotoGP',

  // === Expansion pack — Trucks ===
  'Barn Find Pickup': 'Pickup Trovato in Fienile', 'Country Hauler': 'Trasportatore di Campagna',
  'Off-road Pickup': 'Pickup Fuoristrada', 'Twin Cab Pickup': 'Pickup Doppia Cabina',
  'Refrigerated Van': 'Furgone Refrigerato', 'Crew Van': 'Furgone Equipaggio',
  'Express Delivery': 'Consegna Express', 'Last Mile Van': 'Furgone Ultimo Miglio',
  'Dropside Flatbed': 'Pianale Ribaltabile', 'Crane Flatbed': 'Pianale con Gru',
  'Refrigerated Box': 'Box Refrigerato', 'Tail-lift Box': 'Box con Sponda Idraulica',
  'Flatbed Tow': 'Carro Attrezzi Pianale', 'Wheel Lift Tow': 'Carro Attrezzi Solleva-Ruote',
  'Sleeper Cab': 'Cabina con Cuccetta', 'Urban Semi': 'Semirimorchio Urbano',
  'Reefer Semi': 'Semirimorchio Frigo', 'Tanker Semi': 'Semirimorchio Cisterna',
  'Logging Truck': 'Camion Trasporto Tronchi', 'Mining Hauler': 'Trasportatore Minerario',
};

// Challenge title/description translations
export const CHALLENGE_TRANSLATIONS: Record<string, { titleIt: string; descIt: string }> = {
  'Quick Flip': { titleIt: 'Vendita Lampo', descIt: 'Vendi 1 veicolo oggi' },
  'Salesman': { titleIt: 'Venditore', descIt: 'Vendi 2 veicoli oggi' },
  'Car Baron': { titleIt: 'Barone dei Veicoli', descIt: 'Vendi 3 veicoli oggi' },
  'Hot Seller': { titleIt: 'Venditore in Fiamme', descIt: 'Vendi 4 veicoli oggi' },
  'Small Profit': { titleIt: 'Piccolo Profitto', descIt: 'Guadagna $500 di profitto oggi' },
  'Good Day': { titleIt: 'Buona Giornata', descIt: 'Guadagna $1.000 di profitto oggi' },
  'Big Money': { titleIt: 'Soldi Grossi', descIt: 'Guadagna $2.000 di profitto oggi' },
  'Jackpot': { titleIt: 'Jackpot', descIt: 'Guadagna $3.500 di profitto oggi' },
  'Fixer Upper': { titleIt: 'Tuttofare', descIt: 'Ripara 3 parti oggi' },
  'Mechanic': { titleIt: 'Meccanico', descIt: 'Ripara 5 parti oggi' },
  'Master Tech': { titleIt: 'Tecnico Esperto', descIt: 'Ripara 10 parti oggi' },
  'Repair Pro': { titleIt: 'Riparatore Pro', descIt: 'Ripara 15 parti oggi' },
  'DIY Novice': { titleIt: 'Fai da Te Principiante', descIt: 'Completa 2 riparazioni fai da te' },
  'Hands On': { titleIt: 'Mani in Pasta', descIt: 'Completa 4 riparazioni fai da te' },
  'DIY Master': { titleIt: 'Maestro Fai da Te', descIt: 'Completa 6 riparazioni fai da te' },
  'Shopper': { titleIt: 'Acquirente', descIt: 'Compra 2 veicoli oggi' },
  'Collector': { titleIt: 'Collezionista', descIt: 'Compra 3 veicoli oggi' },
  // Weekly
  'Weekly Tycoon': { titleIt: 'Magnate Settimanale', descIt: 'Vendi 10 veicoli questa settimana' },
  'Fortune Week': { titleIt: 'Settimana Fortunata', descIt: 'Guadagna $10.000 di profitto questa settimana' },
  'Repair Marathon': { titleIt: 'Maratona Riparazioni', descIt: 'Ripara 40 parti questa settimana' },
  'DIY Champion': { titleIt: 'Campione Fai da Te', descIt: 'Completa 15 riparazioni fai da te questa settimana' },
  'Market Hunter': { titleIt: 'Cacciatore di Affari', descIt: 'Compra 8 veicoli questa settimana' },
};

// Customer personality name translations
export const PERSONALITY_NAMES_IT: Record<string, string> = {
  'Bargain Hunter': 'Cacciatore di Affari',
  'Impulse Buyer': 'Acquirente Impulsivo',
  'Skeptic': 'Scettico',
  'Car Enthusiast': 'Appassionato di Auto',
  'Businessman': 'Uomo d\'Affari',
  'First-time Buyer': 'Acquirente alla Prima Volta',
  'Collector': 'Collezionista',
  'Daily Commuter': 'Pendolare',
  'Family Person': 'Persona di Famiglia',
  'Student': 'Studente',
  'Retiree': 'Pensionato',
  'Car Flipper': 'Rivenditore',
  'Mechanic': 'Meccanico',
  'Impatient Buyer': 'Acquirente Impaziente',
  'Patient Buyer': 'Acquirente Paziente',
  'Wealthy Buyer': 'Acquirente Facoltoso',
  'Budget Buyer': 'Acquirente Low Budget',
  'Suspicious Buyer': 'Acquirente Sospettoso',
  'Friendly Buyer': 'Acquirente Amichevole',
  'Industry Expert': 'Esperto del Settore',
};
