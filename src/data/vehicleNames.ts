import { VehicleCategory, CarCategory, MotorcycleCategory, TruckCategory } from '@/types/game';

// Deterministic names per image variant (1-indexed: variant 1..10).
// Each image pool has a fixed set of 10 named models. Whenever a vehicle is
// generated with a given image, it MUST share the same display name and the
// same collection-card name.

const ECONOMY_NAMES = [
  'Rusty Bug', 'Old Beetle', 'City Hatch', 'Mini Runner', 'Eco Sprint',
  'Penny Saver', 'Compact 5', 'Urban Pop', 'Suburban Hatch', 'Daily Driver',
];
const SEDAN_NAMES = [
  'Family Saloon', 'Classic Touring', 'Boulevard Sedan', 'Executive Line', 'Heritage 4D',
  'Diplomat Sedan', 'Imperial Cruiser', 'Avenue GT', 'Royal Coupe', 'Twin-Turbo Sedan',
];
const SUV_NAMES = [
  'Trail Compact', 'City Explorer', 'Family SUV', 'Outback Cruiser', 'Pioneer SUV',
  'Frontier 4x4', 'Apex Crossover', 'Hybrid X', 'Grand Explorer', 'Summit SUV',
];
const SPORTS_NAMES = [
  'Muscle Classic', 'Street Beast', 'Apex Coupe', 'Canyon Carver', 'Carbon GT',
  'Targa Master', 'Speed Demon', 'Track Monster', 'Drift King', 'Limited Racer',
];
const LUXURY_NAMES = [
  'Diplomat L', 'Royal Tourer', 'Crown Limo', 'Sapphire Sedan', 'Imperial Coupe',
  'Phantom Hyper', 'Elite Roadster', 'Platinum Edition', 'Apex One-Off', 'Legend Edition',
];

const SCOOTER_NAMES = [
  'Rusty Vespa', 'Old Ciao', 'Vintage Lambretta', 'City Scooter', 'Urban Runner',
  'Eco Scooter', 'Maxi Scooter', 'Custom 50', 'Side Cruiser', 'Garage Find',
];
const STREET_NAMES = [
  'Street 125', 'Cafe Naked', 'Streetfighter', 'Roadster', 'Power Naked',
  'Custom 125', 'Cruiser 125', 'City Bike', 'Sport 125', 'Urban Naked',
];
const TOURING_NAMES = [
  'Grand Tourer', 'Highway King', 'Cross Tourer', 'Bagger', 'Sport Tourer',
  'Globe Trotter', 'Big Bore Adv', 'Trail Master', 'Desert Adv', 'Rally Adv',
];
const OFFROAD_NAMES = [
  'Dirt Racer', 'Enduro Pro', 'Motocross', 'Hard Enduro', 'Trail Enduro',
  'Mud King', 'Dune Jumper', 'Rally Cross', 'Desert Storm', 'Open Trail',
];
const SPORT_NAMES = [
  'Track Missile', 'Race Replica', 'Hypersport', 'Carbon SBK', 'MotoGP Replica',
  'Retro Racer', 'Classic Sport', 'Vintage Custom', 'Brat Style', 'Bobber Custom',
];

const PICKUP_NAMES = [
  'Rusty Farm', 'Old Work', 'Vintage Hauler', 'Ranch Pickup', 'City Pickup',
  'Off-road Pickup', 'Twin Cab', 'Country Hauler', 'Barn Find', 'Workhorse',
];
const VAN_NAMES = [
  'Cargo Van', 'Panel Van', 'Utility Van', 'Refrigerated', 'Crew Van',
  'Express', 'Last Mile', 'Route Runner', 'City Courier', 'Delivery X',
];
const FLATBED_NAMES = [
  'Work Flatbed', 'Construction', 'Platform Truck', 'Dropside', 'Crane Bed',
  'Box Hauler', 'Moving Truck', 'Freight Box', 'Reefer Box', 'Tail-lift',
];
const TOW_NAMES = [
  'City Tow', 'Heavy Rescue', 'Road Recovery', 'Flatbed Tow', 'Wheel Lift',
  'Highway Tow', 'Rapid Recovery', 'Salvage King', 'Crane Tow', 'Tow Master',
];
const SEMI_NAMES = [
  'Day Cab', 'Regional Hauler', 'Light Semi', 'Long Hauler', 'Highway King',
  'Cross Country', 'Reefer Semi', 'Tanker Semi', 'Logging Truck', 'Mining Hauler',
];

// Map every category to its image-pool name list.
const NAMES_BY_CATEGORY: Record<VehicleCategory, string[]> = {
  // Cars
  junker: ECONOMY_NAMES, beater: ECONOMY_NAMES, economy: ECONOMY_NAMES,
  compact: ECONOMY_NAMES, hatchback: ECONOMY_NAMES,
  sedan: SEDAN_NAMES, wagon: SEDAN_NAMES, coupe: SEDAN_NAMES,
  suv_small: SUV_NAMES, suv_mid: SUV_NAMES, suv_large: SUV_NAMES, crossover: SUV_NAMES,
  muscle: SPORTS_NAMES, sports: SPORTS_NAMES, sports_premium: SPORTS_NAMES, exotic: SPORTS_NAMES,
  luxury_entry: LUXURY_NAMES, luxury_mid: LUXURY_NAMES, luxury_full: LUXURY_NAMES, supercar: LUXURY_NAMES,
  // Motorcycles
  moto_old_scooter: SCOOTER_NAMES, moto_scooter: SCOOTER_NAMES,
  moto_125: STREET_NAMES, moto_naked: STREET_NAMES,
  moto_touring: TOURING_NAMES, moto_adventure: TOURING_NAMES,
  moto_enduro: OFFROAD_NAMES,
  moto_supersport: SPORT_NAMES, moto_caferacer: SPORT_NAMES, moto_superbike: SPORT_NAMES,
  // Trucks
  truck_old_pickup: PICKUP_NAMES, truck_pickup: PICKUP_NAMES,
  truck_van: VAN_NAMES, truck_delivery: VAN_NAMES,
  truck_flatbed: FLATBED_NAMES, truck_box: FLATBED_NAMES,
  truck_tow: TOW_NAMES,
  truck_semi_light: SEMI_NAMES, truck_semi: SEMI_NAMES, truck_heavy: SEMI_NAMES,
};

/** variant is 1..10 (NOT 0-indexed). */
export function getVehicleNameByImage(
  category: VehicleCategory,
  variant: number,
): string {
  const pool = NAMES_BY_CATEGORY[category];
  if (!pool) return `Vehicle #${variant}`;
  const idx = Math.max(0, Math.min(9, variant - 1));
  return pool[idx];
}

/** Stable identifier for a "vehicle model" = category + image variant (1..10). */
export function getVehicleModelKey(category: VehicleCategory, variant: number): string {
  return `${category}_${variant}`;
}