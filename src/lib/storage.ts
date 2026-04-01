import { Meal, DailyLog, LogEntry, MealCategory, MealTimeSlot, AppSettings, DEFAULT_SETTINGS, LIPID_OPTIONS, NOCTURNAL_ITEMS, SLOT_TO_CATEGORY } from './types';

const MEALS_KEY = 'que-como-hoy-meals';
const LOGS_KEY = 'que-como-hoy-logs';

// --- Meals ---

export function getMeals(): Meal[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(MEALS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveMeals(meals: Meal[]) {
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

export function addMeal(meal: Meal) {
  const meals = getMeals();
  meals.push(meal);
  saveMeals(meals);
}

export function updateMeal(updated: Meal) {
  const meals = getMeals().map((m) => (m.id === updated.id ? updated : m));
  saveMeals(meals);
}

export function deleteMeal(id: string) {
  const meals = getMeals().filter((m) => m.id !== id);
  saveMeals(meals);
}

export function getMealsByCategory(category: MealCategory): Meal[] {
  return getMeals().filter((m) => m.category === category);
}

// --- Daily Logs ---

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getAllLogs(): DailyLog[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLogs(logs: DailyLog[]) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function getTodayLog(): DailyLog {
  const today = getTodayKey();
  const logs = getAllLogs();
  return logs.find((l) => l.date === today) || { date: today, entries: [] };
}

export function addLogEntry(meal: Meal) {
  const today = getTodayKey();
  const logs = getAllLogs();
  let log = logs.find((l) => l.date === today);

  if (!log) {
    log = { date: today, entries: [] };
    logs.push(log);
  }

  const entry: LogEntry = {
    meal,
    timestamp: new Date().toISOString(),
  };

  log.entries.push(entry);
  saveLogs(logs);
}

export function removeLogEntry(timestamp: string) {
  const today = getTodayKey();
  const logs = getAllLogs();
  const log = logs.find((l) => l.date === today);

  if (log) {
    log.entries = log.entries.filter((e) => e.timestamp !== timestamp);
    saveLogs(logs);
  }
}

export function getTodayCalories(): number {
  const log = getTodayLog();
  return log.entries.reduce((sum, e) => sum + e.meal.calories, 0);
}

// --- Recommendations ---

export function getRecommendations(category: MealCategory): Meal[] {
  const meals = getMealsByCategory(category);
  const logs = getAllLogs();

  // Get meals eaten in the last 3 days
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const recentDateStr = threeDaysAgo.toISOString().split('T')[0];

  const recentMealIds = new Set<string>();
  logs
    .filter((l) => l.date >= recentDateStr)
    .forEach((l) =>
      l.entries.forEach((e) => recentMealIds.add(e.meal.id))
    );

  // Prioritize meals NOT eaten recently
  const notRecent = meals.filter((m) => !recentMealIds.has(m.id));
  const recent = meals.filter((m) => recentMealIds.has(m.id));

  return [...notRecent, ...recent];
}

export function getRandomMeal(category: MealCategory): Meal | null {
  const recommended = getRecommendations(category);
  if (recommended.length === 0) return null;
  // Pick from top recommendations (not eaten recently)
  const topPicks = recommended.slice(0, Math.max(3, Math.ceil(recommended.length / 2)));
  return topPicks[Math.floor(Math.random() * topPicks.length)];
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// --- Settings ---

const SETTINGS_KEY = 'que-como-hoy-settings';

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// --- Water Tracking ---

const WATER_KEY = 'que-como-hoy-water';

function getWaterData(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(WATER_KEY);
  return data ? JSON.parse(data) : {};
}

export function getTodayWater(): number {
  return getWaterData()[getTodayKey()] || 0;
}

export function setTodayWater(glasses: number) {
  const data = getWaterData();
  data[getTodayKey()] = Math.max(0, glasses);
  localStorage.setItem(WATER_KEY, JSON.stringify(data));
}

// --- Lipid Option ---

export function hasTodayLipid(): boolean {
  const log = getTodayLog();
  return log.entries.some((e) =>
    LIPID_OPTIONS.some((opt) => e.meal.name.includes(opt))
  );
}

export function getLipidMeals(): Meal[] {
  return getMeals().filter((m) =>
    LIPID_OPTIONS.some((opt) => m.name.includes(opt))
  );
}

export function getTodayLipidEntry(): string | null {
  const log = getTodayLog();
  const entry = log.entries.find((e) =>
    LIPID_OPTIONS.some((opt) => e.meal.name.includes(opt))
  );
  return entry ? entry.meal.name : null;
}

// --- Day Complete ---

const COMPLETED_DAYS_KEY = 'que-como-hoy-completed';

function getCompletedDays(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(COMPLETED_DAYS_KEY);
  return data ? JSON.parse(data) : {};
}

export function isTodayComplete(): boolean {
  return getCompletedDays()[getTodayKey()] === true;
}

export function markDayComplete() {
  const data = getCompletedDays();
  data[getTodayKey()] = true;
  localStorage.setItem(COMPLETED_DAYS_KEY, JSON.stringify(data));
}

export function unmarkDayComplete() {
  const data = getCompletedDays();
  delete data[getTodayKey()];
  localStorage.setItem(COMPLETED_DAYS_KEY, JSON.stringify(data));
}

// --- Slot-aware meal filtering ---

export function getMealsForSlot(slot: MealTimeSlot): Meal[] {
  const category = SLOT_TO_CATEGORY[slot];
  const all = getMealsByCategory(category);

  if (slot === 'colacion_nocturna') {
    // Only show nocturnal items
    return all.filter((m) =>
      NOCTURNAL_ITEMS.some((n) => m.name.includes(n))
    );
  }

  if (slot === 'colacion_am' || slot === 'colacion_pm') {
    // Regular snacks: exclude lipid options and nocturnal items
    return all.filter((m) =>
      !LIPID_OPTIONS.some((opt) => m.name.includes(opt)) &&
      !NOCTURNAL_ITEMS.some((n) => m.name.includes(n))
    );
  }

  // desayuno, almuerzo, cena: return all for that category
  return all;
}

// --- Smart Recommendations ---

export function getSmartRecommendations(category: MealCategory): Meal[] {
  const meals = getMealsByCategory(category);
  const logs = getAllLogs();

  const now = new Date();
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(now.getDate() - 3);
  const recentStr = threeDaysAgo.toISOString().split('T')[0];

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const weekStr = sevenDaysAgo.toISOString().split('T')[0];

  const recentMealIds = new Set<string>();
  let legumesThisWeek = 0;
  const weekProteins: Record<string, number> = {};

  logs.filter((l) => l.date >= weekStr).forEach((l) => {
    l.entries.forEach((e) => {
      if (l.date >= recentStr) recentMealIds.add(e.meal.id);
      const n = e.meal.name.toLowerCase();
      if (n.includes('lentejas') || n.includes('porotos') || n.includes('garbanzos')) legumesThisWeek++;
      // Track protein frequency
      for (const p of ['pollo', 'vacuno', 'carne', 'cerdo', 'pescado', 'atún', 'pavo', 'camarones']) {
        if (n.includes(p)) weekProteins[p] = (weekProteins[p] || 0) + 1;
      }
    });
  });

  return [...meals].sort((a, b) => {
    // 1. Not eaten recently first
    const aRecent = recentMealIds.has(a.id) ? 1 : 0;
    const bRecent = recentMealIds.has(b.id) ? 1 : 0;
    if (aRecent !== bRecent) return aRecent - bRecent;

    // 2. Boost legumes if < 2 this week
    if (category === 'almuerzo' && legumesThisWeek < 2) {
      const aLeg = /lentejas|porotos|garbanzos/i.test(a.name) ? -1 : 0;
      const bLeg = /lentejas|porotos|garbanzos/i.test(b.name) ? -1 : 0;
      if (aLeg !== bLeg) return aLeg - bLeg;
    }

    // 3. Prefer less-eaten protein sources
    if (category === 'almuerzo' || category === 'cena') {
      const getFreq = (name: string) => {
        for (const p of Object.keys(weekProteins)) {
          if (name.toLowerCase().includes(p)) return weekProteins[p];
        }
        return 0;
      };
      return getFreq(a.name) - getFreq(b.name);
    }

    return 0;
  });
}

// --- Export / Import ---

export function exportData(): string {
  return JSON.stringify({
    meals: getMeals(),
    logs: getAllLogs(),
    settings: getSettings(),
    water: getWaterData(),
    exportDate: new Date().toISOString(),
  }, null, 2);
}

export function importData(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.meals) saveMeals(data.meals);
    if (data.logs) {
      localStorage.setItem(LOGS_KEY, JSON.stringify(data.logs));
    }
    if (data.settings) saveSettings(data.settings);
    if (data.water) localStorage.setItem(WATER_KEY, JSON.stringify(data.water));
    return true;
  } catch {
    return false;
  }
}

// --- Weekly Summary ---

export interface WeeklySummary {
  daysTracked: number;
  avgCalories: number;
  proteinVariety: string[];
  legumeDays: number;
  totalEntries: number;
}

export function getWeeklySummary(): WeeklySummary | null {
  const logs = getAllLogs();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekStr = sevenDaysAgo.toISOString().split('T')[0];

  const weekLogs = logs.filter((l) => l.date >= weekStr);
  if (weekLogs.length === 0) return null;

  const totalCals = weekLogs.reduce(
    (sum, l) => sum + l.entries.reduce((s, e) => s + e.meal.calories, 0), 0
  );

  const proteins = new Set<string>();
  let legumeDays = 0;
  let totalEntries = 0;

  weekLogs.forEach((l) => {
    let hasLegume = false;
    totalEntries += l.entries.length;
    l.entries.forEach((e) => {
      const n = e.meal.name.toLowerCase();
      if (n.includes('pollo') || n.includes('trutro') || n.includes('pechuga')) proteins.add('Pollo');
      if (n.includes('vacuno') || n.includes('bistec') || n.includes('carne')) proteins.add('Carne');
      if (n.includes('cerdo')) proteins.add('Cerdo');
      if (n.includes('pescado') || n.includes('reineta') || n.includes('merluza')) proteins.add('Pescado');
      if (n.includes('atún')) proteins.add('Atún');
      if (n.includes('pavo')) proteins.add('Pavo');
      if (n.includes('camarones')) proteins.add('Camarones');
      if (n.includes('lentejas') || n.includes('porotos') || n.includes('garbanzos')) hasLegume = true;
    });
    if (hasLegume) legumeDays++;
  });

  return {
    daysTracked: weekLogs.length,
    avgCalories: Math.round(totalCals / weekLogs.length),
    proteinVariety: Array.from(proteins),
    legumeDays,
    totalEntries,
  };
}
