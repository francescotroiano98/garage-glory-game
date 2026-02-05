 import { PartType, PartCategory } from '@/types/game';
 
 // Map part types to translation keys
 export const PART_TRANSLATION_KEYS: Record<PartType, string> = {
   engine: 'partEngine',
   transmission: 'partTransmission',
   brakes: 'partBrakes',
   suspension: 'partSuspension',
   exhaust: 'partExhaust',
   fuel_system: 'partFuelSystem',
   paint: 'partPaint',
   dents: 'partDents',
   rust: 'partRust',
   windows: 'partWindows',
   lights: 'partLights',
   bumpers: 'partBumpers',
   front_tires: 'partFrontTires',
   rear_tires: 'partRearTires',
   wheels: 'partWheels',
   alignment: 'partAlignment',
   tire_pressure: 'partTirePressure',
   wheel_bearings: 'partWheelBearings',
   seats: 'partSeats',
   dashboard: 'partDashboard',
   electronics: 'partElectronics',
   cleaning: 'partCleaning',
   air_conditioning: 'partAirConditioning',
   audio_system: 'partAudioSystem',
 };
 
 // Map category types to translation keys
 export const CATEGORY_TRANSLATION_KEYS: Record<PartCategory, string> = {
   mechanical: 'mechanical',
   body: 'body',
   tires: 'tires',
   interior: 'interior',
 };
 
 // Map damage levels to translation keys
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