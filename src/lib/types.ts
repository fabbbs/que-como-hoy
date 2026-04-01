export type MealCategory = 'desayuno' | 'almuerzo' | 'cena' | 'snack';

export interface Meal {
  id: string;
  name: string;
  category: MealCategory;
  calories: number;
  ingredients: string;
}

export interface LogEntry {
  meal: Meal;
  timestamp: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  entries: LogEntry[];
}

export interface AppSettings {
  darkMode: boolean;
  calorieGoal: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  calorieGoal: 2200,
};

export const CALORIE_GOAL = 2200;
export const WATER_GOAL = 12; // vasos de 300cc

export const CATEGORY_LABELS: Record<MealCategory, string> = {
  desayuno: '🌅 Desayuno',
  almuerzo: '☀️ Almuerzo',
  cena: '🌙 Cena',
  snack: '🍎 Snack',
};

export const CATEGORIES: MealCategory[] = ['desayuno', 'almuerzo', 'cena', 'snack'];

// Timeline slots
export type MealTimeSlot =
  | 'desayuno'
  | 'colacion_am'
  | 'almuerzo'
  | 'colacion_pm'
  | 'cena'
  | 'colacion_nocturna';

export const TIME_SLOTS: MealTimeSlot[] = [
  'desayuno',
  'colacion_am',
  'almuerzo',
  'colacion_pm',
  'cena',
  'colacion_nocturna',
];

export const TIME_SLOT_LABELS: Record<MealTimeSlot, string> = {
  desayuno: '🌅 Desayuno',
  colacion_am: '🍌 Colación AM',
  almuerzo: '☀️ Almuerzo',
  colacion_pm: '🍎 Colación PM',
  cena: '🌙 Once / Cena',
  colacion_nocturna: '💪 Col. Nocturna',
};

export const SLOT_TO_CATEGORY: Record<MealTimeSlot, MealCategory> = {
  desayuno: 'desayuno',
  colacion_am: 'snack',
  almuerzo: 'almuerzo',
  colacion_pm: 'snack',
  cena: 'cena',
  colacion_nocturna: 'snack',
};

export const LIPID_OPTIONS = [
  'Almendras', 'Palta', 'Nueces', 'Maní', 'Aceitunas', 'Mix semillas',
];

export const NOCTURNAL_ITEMS = ['Batido proteína', 'ZMA'];
