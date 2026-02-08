/**
 * Giorni e orari di apertura.
 * getDay(): 0 = domenica, 1 = lunedì, ..., 6 = sabato
 */

export type MealType = 'pranzo' | 'cena';

/** Servizio per giorno: pranzo, cena, entrambi o chiuso */
export type DayService = 'pranzo' | 'cena' | 'entrambi' | 'chiuso';

/**
 * Lunedì cena
 * Martedì chiuso
 * Mercoledì cena
 * Giovedì cena
 * Venerdì cena
 * Sabato pranzo e cena
 * Domenica pranzo
 */
export const SCHEDULE: Record<number, DayService> = {
  0: 'pranzo',   // domenica
  1: 'cena',     // lunedì
  2: 'chiuso',   // martedì
  3: 'cena',     // mercoledì
  4: 'cena',     // giovedì
  5: 'cena',     // venerdì
  6: 'entrambi', // sabato
};

/** Orari pranzo (slot prenotabili). */
export const PRANZO_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
] as const;

/** Orari cena (slot prenotabili). */
export const CENA_SLOTS = [
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
] as const;

export const OPENING_HOURS = {
  pranzo: { label: 'Pranzo', slots: [...PRANZO_SLOTS] },
  cena: { label: 'Cena', slots: [...CENA_SLOTS] },
} as const;

const DAY_NAMES: Record<number, string> = {
  0: 'domenica',
  1: 'lunedì',
  2: 'martedì',
  3: 'mercoledì',
  4: 'giovedì',
  5: 'venerdì',
  6: 'sabato',
};

function getDayOfWeek(isoDate: string): number {
  return new Date(isoDate + 'T12:00:00').getDay();
}

/** True se il locale è aperto in quella data (almeno pranzo o cena). */
export function isDayOpen(isoDate: string): boolean {
  return SCHEDULE[getDayOfWeek(isoDate)] !== 'chiuso';
}

/** True se nella data indicata è disponibile il servizio scelto (pranzo o cena). */
export function isMealAvailable(isoDate: string, mealType: MealType): boolean {
  const service = SCHEDULE[getDayOfWeek(isoDate)];
  if (service === 'chiuso') return false;
  if (service === 'entrambi') return true;
  return service === mealType;
}

export function getDayName(isoDate: string): string {
  return DAY_NAMES[getDayOfWeek(isoDate)] ?? '';
}

/** Servizio in calendario per quella data (pranzo, cena, entrambi, chiuso). */
export function getDayService(isoDate: string): DayService {
  return SCHEDULE[getDayOfWeek(isoDate)] ?? 'chiuso';
}

export function getTimeSlots(mealType: MealType): readonly string[] {
  return OPENING_HOURS[mealType].slots;
}
